import assert from "node:assert/strict";
import { publishedCompiler, publishedDownloads } from "../src/data/releases.ts";
import {
  assertArchiveMatches, assertManifestMatches, assertSidecarMatches,
  resolvePublishedTag, validatePublicationIndex, type ReleaseAsset,
} from "./release-audit-lib.ts";

const api = "https://api.github.com/repos/scarp-lang/scarp";
const headers: Record<string, string> = {
  Accept: "application/vnd.github+json",
  "User-Agent": "Scarp-Website-Release-Audit",
  "X-GitHub-Api-Version": "2022-11-28",
};
if (process.env.GITHUB_TOKEN) headers.Authorization = "Bearer " + process.env.GITHUB_TOKEN;

async function request(url: string, options: RequestInit = {}): Promise<Response> {
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(60_000) });
  assert(response.ok, "GitHub request failed (HTTP " + response.status + "): " + url);
  return response;
}
async function githubJson(path: string): Promise<unknown> {
  const response = await request(api + path, { headers });
  return response.json() as Promise<unknown>;
}
async function assetBytes(asset: ReleaseAsset, maxBytes: number): Promise<Uint8Array> {
  assert(asset.size <= maxBytes,
    "Asset exceeds audit cap of " + maxBytes + " bytes: " + asset.name);
  const response = await request(asset.browser_download_url);
  const claimedSize = response.headers.get("content-length");
  if (claimedSize && Number(claimedSize) > maxBytes) {
    throw new Error("Download exceeds audit cap: " + asset.name);
  }
  const bytes = new Uint8Array(await response.arrayBuffer());
  assert(bytes.byteLength <= maxBytes, "Oversized download: " + asset.name);
  assert.equal(bytes.byteLength, asset.size, "Asset size mismatch: " + asset.name);
  return bytes;
}
async function smallText(asset: ReleaseAsset): Promise<string> {
  const bytes = await assetBytes(asset, 64 * 1024);
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

const releases = await githubJson("/releases?per_page=30");
const assets = validatePublicationIndex(releases, publishedCompiler, publishedDownloads);

const tagRef = await githubJson("/git/ref/tags/" + encodeURIComponent(publishedCompiler.tag));
const ref = tagRef as { object?: { type?: string; sha?: string } };
let annotation: unknown = null;
if (ref.object?.type === "tag") {
  const sha = ref.object.sha;
  assert(sha && /^[0-9a-f]{40}$/.test(sha), "Invalid annotated tag ref SHA");
  annotation = await githubJson("/git/tags/" + sha);
}
assert.equal(resolvePublishedTag(tagRef, annotation), publishedCompiler.sourceCommit,
  "GitHub tag no longer resolves to the reviewed source commit");

function requiredAsset(name: string): ReleaseAsset {
  const asset = assets.get(name);
  assert(asset, "Release asset missing: " + name);
  return asset;
}
assertManifestMatches(await smallText(requiredAsset("SHA256SUMS")), publishedDownloads);
for (const archive of publishedDownloads) {
  await assertSidecarMatches(await smallText(requiredAsset(archive.file + ".sha256")), archive);
  const binary = await assetBytes(requiredAsset(archive.file), 64 * 1024 * 1024);
  assertArchiveMatches(binary, requiredAsset(archive.file), archive);
  console.log("Verified archive SHA-256: " + archive.file);
}
console.log("Release audit passed: " + publishedCompiler.tag +
  " · tag commit " + publishedCompiler.sourceCommit + " · 3 archives + sidecars + SHA256SUMS.");
