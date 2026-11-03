import assert from "node:assert/strict";
import test from "node:test";
import { project, downloads } from "../src/data/project.ts";
import { publishedCompiler, publishedDownloads, publishedDownloadUrl } from "../src/data/releases.ts";
import { ecosystemProjects } from "../src/data/ecosystem.ts";

test("latest public prerelease is separate from the verified website baseline", () => {
  assert.equal(project.tag, "v0.0.5-alpha.1");
  assert.equal(publishedCompiler.tag, "v0.0.5-alpha.4");
  assert.notEqual(project.source, publishedCompiler.sourceCommit);
  assert.equal(publishedCompiler.reviewed, "2026-11-03");
  assert.match(publishedCompiler.publishedAt, /^2026-11-03T/);
  assert.match(publishedCompiler.sourceCommit, /^[0-9a-f]{40}$/);
  assert(publishedCompiler.release.endsWith("/" + publishedCompiler.tag));
  assert.equal(publishedCompiler.status, "experimental-prerelease");
  assert.equal(ecosystemProjects.find(item => item.id === "compiler")?.version, publishedCompiler.tag);
});

test("all three public archive SHA-256 digests and links match the release", () => {
  const expected = new Map([
    ["scarp-0.0.5-alpha.4-x86_64-pc-windows-msvc.zip", "6be1c56ec475041c6c7d2658bb807d4903e35d8ac433d95841c47f8812ae6d0f"],
    ["scarp-0.0.5-alpha.4-x86_64-unknown-linux-gnu.tar.gz", "b8a3431467a2fa4e5baf253fe421645d2f257e422c80ad2ab059e6c9b180df45"],
    ["scarp-0.0.5-alpha.4-aarch64-apple-darwin.tar.gz", "20a0fdc01c2da07db0cde45db02fd63a56b0907a826530e43c39cba750ddc94f"],
  ]);
  assert.equal(publishedDownloads.length, 3);
  assert.equal(new Set(publishedDownloads.map(item => item.file)).size, 3);
  for (const item of publishedDownloads) {
    assert.equal(item.hash, expected.get(item.file), item.file);
    assert.match(item.hash, /^[0-9a-f]{64}$/);
    assert.equal(publishedDownloadUrl(item.file), "https://github.com/scarp-lang/scarp/releases/download/v0.0.5-alpha.4/" + item.file);
    assert(publishedDownloadUrl(item.file + ".sha256").endsWith(item.file + ".sha256"));
  }
  assert.equal(downloads.length, 3, "Preserve older baseline machine-readable archives");
  assert(publishedDownloadUrl("SHA256SUMS").endsWith("/v0.0.5-alpha.4/SHA256SUMS"));
});
