import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  assertManifestMatches, assertSidecarMatches, resolvePublishedTag, validatePublicationIndex,
  type ArchiveSnapshot, type ReleaseAsset, type ReleaseSnapshot,
} from "./release-audit-lib.ts";

const api = "https://api.github.com/repos/scarp-lang/scarp";
const assetOrigin = "https://github.com";
const assetPrefix = "/scarp-lang/scarp/releases/download/";
const jsonCap = 8 * 1024 * 1024;
const checksumCap = 64 * 1024;
const archiveCap = 64 * 1024 * 1024;
const pageSize = 100;
const pageLimit = 10;
const timeoutMs = 60_000;

type Fetcher = typeof fetch;
type ChunkConsumer = (chunk: Uint8Array) => void;

function validSize(size: number, cap: number): boolean {
  return Number.isSafeInteger(size) && size > 0 && size <= cap;
}

function checkAsset(asset: ReleaseAsset, cap: number): void {
  assert(validSize(asset.size, cap), "Invalid or oversized asset metadata: " + asset.name);
  const url = new URL(asset.browser_download_url);
  const parts = url.pathname.slice(assetPrefix.length).split("/");
  assert(url.origin === assetOrigin && url.pathname.startsWith(assetPrefix) &&
    !url.username && !url.password && !url.search && !url.hash && parts.length === 2 &&
    /^v\d+\.\d+\.\d+(?:-[0-9A-Za-z][0-9A-Za-z.-]*)?$/.test(parts[0] ?? "") &&
    parts[1] === encodeURIComponent(asset.name) && /^[A-Za-z0-9._-]+$/.test(asset.name),
  "Unexpected official asset URL: " + asset.name);
}

/** Consume decoded bytes incrementally, rejecting the first chunk that exceeds
 * either the hard cap or the reviewed exact size. Never buffer archive data. */
export async function consumeBounded(
  response: Response,
  cap: number,
  label: string,
  consume: ChunkConsumer,
  expectedSize?: number,
): Promise<number> {
  const body = response.body;
  assert(body, "Response body missing: " + label);
  const reader = body.getReader();
  let finished = false;
  let total = 0;
  try {
    assert(Number.isSafeInteger(cap) && cap > 0, "Invalid byte cap");
    assert(expectedSize === undefined || validSize(expectedSize, cap), "Invalid expected byte size: " + label);
    const limit = expectedSize ?? cap;
    const claimed = response.headers.get("content-length");
    const encoding = response.headers.get("content-encoding");
    // Fetch exposes decoded data, so a compressed transfer's Content-Length
    // does not describe the bytes that are hashed or parsed.
    if (claimed !== null && (!encoding || encoding.toLowerCase() === "identity")) {
      assert(/^\d+$/.test(claimed) && Number.isSafeInteger(Number(claimed)), "Invalid Content-Length: " + label);
      assert(Number(claimed) <= limit, "Content-Length exceeds byte limit: " + label);
      if (expectedSize !== undefined) assert.equal(Number(claimed), expectedSize, "Content-Length size mismatch: " + label);
    }
    for (;;) {
      const { done, value } = await reader.read();
      if (done) { finished = true; break; }
      assert(value instanceof Uint8Array, "Non-byte response chunk: " + label);
      assert(value.byteLength <= limit - total, "Stream exceeds byte limit: " + label);
      total += value.byteLength;
      consume(value);
    }
    if (expectedSize !== undefined) assert.equal(total, expectedSize, "Downloaded size mismatch: " + label);
    return total;
  } finally {
    if (!finished) await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
}

async function boundedText(response: Response, cap: number, label: string, size?: number): Promise<string> {
  const decoder = new TextDecoder("utf-8", { fatal: true });
  const chunks: string[] = [];
  await consumeBounded(response, cap, label, chunk => {
    chunks.push(decoder.decode(chunk, { stream: true }));
  }, size);
  chunks.push(decoder.decode());
  return chunks.join("");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/** Fail closed on malformed or ambiguous catalogue rows, including pages
 * duplicated while a release is being published during pagination. */
export function validateCatalogueRows(rows: readonly unknown[]): void {
  const tags = new Set<string>();
  let newest = "";
  let newestCount = 0;
  for (const row of rows) {
    assert(isRecord(row) && typeof row.draft === "boolean", "Invalid release catalogue row");
    if (row.draft) continue;
    const tag = row.tag_name;
    const timestamp = row.published_at;
    assert(typeof tag === "string" && /^v\d+\.\d+\.\d+(?:-[0-9A-Za-z][0-9A-Za-z.-]*)?$/.test(tag), "Invalid published release tag");
    assert(typeof timestamp === "string" && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(timestamp) &&
      Number.isFinite(Date.parse(timestamp)) && new Date(timestamp).toISOString() === timestamp.replace(/Z$/, ".000Z"),
    "Invalid published release timestamp: " + tag);
    assert(!tags.has(tag), "Duplicate published release tag: " + tag);
    tags.add(tag);
    if (timestamp > newest) { newest = timestamp; newestCount = 1; }
    else if (timestamp === newest) newestCount++;
  }
  assert(tags.size > 0, "No published Scarp releases found");
  assert.equal(newestCount, 1, "Ambiguous newest published release timestamp");
}

/** Own the transport boundary; only API calls receive the optional token.
 * Asset redirects use public URLs without credentials. */
export function createReleaseAuditClient(fetcher: Fetcher = fetch, token?: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "Scarp-Website-Release-Audit",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = "Bearer " + token;

  async function request(url: string, options: RequestInit): Promise<Response> {
    const response = await fetcher(url, options);
    if (!response.ok) {
      await response.body?.cancel().catch(() => undefined);
      throw new Error("GitHub request failed (HTTP " + response.status + "): " + url);
    }
    return response;
  }

  async function githubJson(path: string, signal = AbortSignal.timeout(timeoutMs)): Promise<unknown> {
    assert(/^\/releases\?per_page=100&page=\d+$/.test(path) ||
      /^\/git\/ref\/tags\/v[0-9A-Za-z.-]+$/.test(path) || /^\/git\/tags\/[0-9a-f]{40}$/.test(path),
    "Unexpected GitHub API path");
    const response = await request(api + path, { headers, signal, redirect: "error", cache: "no-store" });
    return JSON.parse(await boundedText(response, jsonCap, path)) as unknown;
  }

  async function releaseCatalogue(): Promise<unknown[]> {
    const rows: unknown[] = [];
    const signal = AbortSignal.timeout(timeoutMs);
    for (let page = 1; page <= pageLimit; page++) {
      const payload = await githubJson(`/releases?per_page=${pageSize}&page=${page}`, signal);
      assert(Array.isArray(payload) && payload.length <= pageSize, "Invalid release catalogue page: " + page);
      rows.push(...payload);
      if (payload.length < pageSize) {
        validateCatalogueRows(rows);
        return rows;
      }
    }
    throw new Error("Release catalogue exceeds bounded pagination; refusing to audit partial results");
  }

  async function assetResponse(asset: ReleaseAsset, cap: number): Promise<Response> {
    checkAsset(asset, cap);
    return request(asset.browser_download_url, { redirect: "follow", credentials: "omit",
      signal: AbortSignal.timeout(timeoutMs), cache: "no-store" });
  }

  async function checksumText(asset: ReleaseAsset): Promise<string> {
    return boundedText(await assetResponse(asset, checksumCap), checksumCap, asset.name, asset.size);
  }

  async function verifyArchive(asset: ReleaseAsset, archive: ArchiveSnapshot): Promise<void> {
    assert.equal(asset.name, archive.file, "Archive name mismatch");
    assert.match(archive.hash, /^[0-9a-f]{64}$/, "Invalid reviewed archive digest");
    const hash = createHash("sha256");
    await consumeBounded(await assetResponse(asset, archiveCap), archiveCap, asset.name,
      chunk => { hash.update(chunk); }, asset.size);
    assert.equal(hash.digest("hex"), archive.hash, "Downloaded archive digest differs: " + archive.file);
  }

  return { githubJson, releaseCatalogue, checksumText, verifyArchive };
}

/** Audit the complete reviewed snapshot using the injectable transport. A
 * successful receipt is returned only after every manifest, tag and archive
 * check succeeds. Progress callbacks do not imply whole-release success. */
export async function runReleaseAudit(
  client: ReturnType<typeof createReleaseAuditClient>,
  snapshot: ReleaseSnapshot,
  archives: readonly ArchiveSnapshot[],
  onVerified: (name: string) => void = () => {},
): Promise<void> {
  const releases = await client.releaseCatalogue();
  const assets = validatePublicationIndex(releases, snapshot, archives);
  const tagRef = await client.githubJson("/git/ref/tags/" + encodeURIComponent(snapshot.tag));
  let annotation: unknown = null;
  if (isRecord(tagRef) && isRecord(tagRef.object) && tagRef.object.type === "tag") {
    const sha = tagRef.object.sha;
    assert(typeof sha === "string" && /^[0-9a-f]{40}$/.test(sha), "Invalid annotated tag ref SHA");
    annotation = await client.githubJson("/git/tags/" + sha);
  }
  assert.equal(resolvePublishedTag(tagRef, annotation), snapshot.sourceCommit,
    "GitHub tag no longer resolves to the reviewed source commit");
  function requiredAsset(name: string): ReleaseAsset {
    const asset = assets.get(name);
    assert(asset, "Release asset missing: " + name);
    return asset;
  }
  assertManifestMatches(await client.checksumText(requiredAsset("SHA256SUMS")), archives);
  for (const archive of archives) {
    await assertSidecarMatches(await client.checksumText(requiredAsset(archive.file + ".sha256")), archive);
    await client.verifyArchive(requiredAsset(archive.file), archive);
    onVerified(archive.file);
  }
}
