import assert from "node:assert/strict";
import test from "node:test";
import { project, downloads } from "../src/data/project.ts";
import { publishedCompiler, publishedDownloads, publishedDownloadUrl } from "../src/data/releases.ts";
import { ecosystemProjects } from "../src/data/ecosystem.ts";

test("latest public prerelease is separate from the verified website baseline", () => {
  assert.equal(project.tag, "v0.0.5-alpha.1");
  assert.equal(publishedCompiler.tag, "v0.0.6-alpha.1");
  assert.notEqual(project.source, publishedCompiler.sourceCommit);
  assert.equal(publishedCompiler.reviewed, "2026-11-05");
  assert.equal(publishedCompiler.publishedAt, "2026-11-05T11:39:49Z");
  assert.match(publishedCompiler.sourceCommit, /^[0-9a-f]{40}$/);
  assert(publishedCompiler.release.endsWith("/" + publishedCompiler.tag));
  assert.equal(publishedCompiler.status, "experimental-prerelease");
  assert.equal(ecosystemProjects.find(item => item.id === "compiler")?.version, publishedCompiler.tag);
  assert.equal(ecosystemProjects.find(item => item.id === "compiler")?.evidence, publishedCompiler.release);
  assert.equal(publishedCompiler.tag, "v" + publishedCompiler.version);
  assert.equal(publishedCompiler.release, project.repo + "/releases/tag/" + publishedCompiler.tag);
});

test("all three public archive SHA-256 digests and links match the release", () => {
  const expected = new Map([
    ["scarp-0.0.6-alpha.1-x86_64-pc-windows-msvc.zip", "80242b4c1152c4a1c5f3238fb13a7ace881b826ff6faab462e25baf1b039d602"],
    ["scarp-0.0.6-alpha.1-x86_64-unknown-linux-gnu.tar.gz", "d3756492c632a97fba1e317a7523dece1566040a53b10a98c7494567e042e018"],
    ["scarp-0.0.6-alpha.1-aarch64-apple-darwin.tar.gz", "17f447e33580e4fb618803e2cbf01d92e406beed92f5a8229e78f43a6a8933bf"],
  ]);
  assert.equal(publishedDownloads.length, 3);
  assert.equal(new Set(publishedDownloads.map(item => item.file)).size, 3);
  for (const item of publishedDownloads) {
    assert.equal(item.hash, expected.get(item.file), item.file);
    assert(item.file.startsWith("scarp-" + publishedCompiler.version + "-"), item.file);
    assert.match(item.hash, /^[0-9a-f]{64}$/);
    assert.equal(publishedDownloadUrl(item.file), "https://github.com/scarp-lang/scarp/releases/download/v0.0.5-alpha.5/" + item.file);
    assert(publishedDownloadUrl(item.file + ".sha256").endsWith(item.file + ".sha256"));
  }
  assert.equal(downloads.length, 3, "Preserve older baseline machine-readable archives");
  assert(publishedDownloadUrl("SHA256SUMS").endsWith("/v0.0.5-alpha.5/SHA256SUMS"));
});
