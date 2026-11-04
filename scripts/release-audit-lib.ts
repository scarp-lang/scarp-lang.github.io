import assert from "node:assert/strict";
import { createHash } from "node:crypto";

export interface ReleaseSnapshot {
  tag: string;
  publishedAt: string;
  sourceCommit: string;
  release: string;
  status: string;
}

export interface ArchiveSnapshot {
  file: string;
  hash: string;
}

export interface ReleaseAsset {
  name: string;
  size: number;
  browser_download_url: string;
}

function record(value: unknown, label: string): Record<string, unknown> {
  assert(value !== null && typeof value === "object" && !Array.isArray(value), label + " must be an object");
  return value as Record<string, unknown>;
}

function stringField(value: Record<string, unknown>, key: string): string {
  assert(typeof value[key] === "string" && value[key].length > 0, "Missing " + key);
  return value[key] as string;
}

/** The site is a reviewed snapshot, never an automatically updated release feed. */
export function validatePublicationIndex(
  payload: unknown,
  expected: ReleaseSnapshot,
  archives: readonly ArchiveSnapshot[],
): Map<string, ReleaseAsset> {
  assert(Array.isArray(payload), "GitHub releases API did not return an array");
  const published = payload
    .map((value: unknown) => record(value, "Release"))
    .filter(item => item.draft === false && typeof item.published_at === "string")
    .sort((a, b) => (b.published_at as string).localeCompare(a.published_at as string));
  const latest = published[0];
  assert(latest, "No published Scarp releases found");
  const latestTag = stringField(latest, "tag_name");
  assert.equal(
    latestTag,
    expected.tag,
    "Published release changed to " + latestTag + " (website still pins " + expected.tag + "). Review the new release before updating site data and CI pins.",
  );
  assert.equal(latest.published_at, expected.publishedAt, "Published release timestamp changed");
  assert.equal(latest.html_url, expected.release, "Release evidence URL changed");
  assert.equal(latest.prerelease, expected.status === "experimental-prerelease",
    "Upstream prerelease status differs from the website");

  assert(Array.isArray(latest.assets), "Published release assets missing");
  const assets = new Map<string, ReleaseAsset>();
  for (const entry of latest.assets) {
    const item = record(entry, "Release asset");
    const name = stringField(item, "name");
    assert(!assets.has(name), "Duplicate release asset " + name);
    assert(typeof item.size === "number" && Number.isSafeInteger(item.size) && item.size > 0,
      "Invalid release asset size: " + name);
    const browser_download_url = stringField(item, "browser_download_url");
    const expectedUrl = "https://github.com/scarp-lang/scarp/releases/download/" +
      encodeURIComponent(expected.tag) + "/" + encodeURIComponent(name);
    assert.equal(browser_download_url, expectedUrl, "Unexpected release asset URL: " + name);
    assets.set(name, { name, size: item.size, browser_download_url });
  }
  assert.equal(archives.length, 3, "The website requires exactly three reviewed platform archives");
  assert.equal(new Set(archives.map(archive => archive.file)).size, archives.length,
    "Duplicate published archive");
  for (const archive of archives) {
    assert.match(archive.hash, /^[0-9a-f]{64}$/, "Invalid published archive SHA-256");
    assert(assets.has(archive.file), "Missing published platform archive: " + archive.file);
    assert(assets.has(archive.file + ".sha256"), "Missing checksum sidecar: " + archive.file);
  }
  assert(assets.has("SHA256SUMS"), "Missing combined SHA256SUMS");
  return assets;
}

/** GitHub releases often use annotated tags; dereference them, never trust target_commitish. */
export function resolvePublishedTag(ref: unknown, annotation: unknown | null): string {
  const refObject = record(record(ref, "Git tag ref").object, "Git tag target");
  const kind = stringField(refObject, "type");
  const target = kind === "tag"
    ? record(record(annotation, "Annotated tag").object, "Annotated tag target")
    : refObject;
  assert.equal(target.type, "commit", "Published tag must ultimately point to a commit");
  const sha = stringField(target, "sha");
  assert.match(sha, /^[0-9a-f]{40}$/, "Invalid tag commit SHA");
  return sha;
}

export function parseChecksums(content: string): Map<string, string> {
  const lines = content.trim().split(/\r?\n/);
  assert(lines.length > 0 && lines.length <= 20, "Invalid SHA256SUMS line count");
  const result = new Map<string, string>();
  for (const line of lines) {
    const match = /^([0-9a-f]{64}) [ *]([A-Za-z0-9._-]+)$/.exec(line);
    assert(match, "Malformed checksum entry: " + line.slice(0, 80));
    const hash = match[1];
    const filename = match[2];
    assert(hash && filename);
    assert(!result.has(filename), "Duplicate checksum filename: " + filename);
    result.set(filename, hash);
  }
  return result;
}

export function assertManifestMatches(
  content: string,
  archives: readonly ArchiveSnapshot[],
): void {
  const checksums = parseChecksums(content);
  assert.equal(checksums.size, archives.length, "SHA256SUMS archive count mismatch");
  for (const archive of archives) {
    assert.equal(checksums.get(archive.file), archive.hash,
      "SHA256SUMS mismatch for " + archive.file);
  }
}

export function assertSidecarMatches(content: string, archive: ArchiveSnapshot): void {
  const checksums = parseChecksums(content);
  assert.equal(checksums.size, 1, "Sidecar must list exactly one archive");
  assert.equal(checksums.get(archive.file), archive.hash,
    "Sidecar checksum mismatch for " + archive.file);
}

export function digestBytes(bytes: Uint8Array): string {
  return createHash("sha256").update(bytes).digest("hex");
}

export function assertArchiveMatches(
  bytes: Uint8Array,
  asset: ReleaseAsset,
  archive: ArchiveSnapshot,
): void {
  assert.equal(bytes.byteLength, asset.size, "Downloaded archive size differs: " + archive.file);
  assert.equal(digestBytes(bytes), archive.hash, "Downloaded archive digest differs: " + archive.file);
}
