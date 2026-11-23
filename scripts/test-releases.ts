import assert from "node:assert/strict";
import test from "node:test";
import { project, downloads } from "../src/data/project.ts";
import { publishedCompiler, publishedDownloads, publishedDownloadUrl } from "../src/data/releases.ts";
import { ecosystemProjects } from "../src/data/ecosystem.ts";

test("latest public prerelease is separate from the verified website baseline", () => {
  assert.equal(project.tag, "v0.0.5-alpha.1");
  assert.equal(publishedCompiler.tag, "v0.0.6-alpha.19");
  assert.notEqual(project.source, publishedCompiler.sourceCommit);
  assert.equal(publishedCompiler.reviewed, "2026-11-23");
  assert.equal(publishedCompiler.publishedAt, "2026-11-23T08:33:14Z");
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
    ["scarp-0.0.6-alpha.19-x86_64-pc-windows-msvc.zip", "e00ec9bfd2447fc2c54ae8101933da3c6899251300711627115db5239e559023"],
    ["scarp-0.0.6-alpha.19-x86_64-unknown-linux-gnu.tar.gz", "e9bfb14202c0bc33a6621d7d0545482280f0296531038b34e2215fe124c0366b"],
    ["scarp-0.0.6-alpha.19-aarch64-apple-darwin.tar.gz", "5eb73cacc13b21f40e3448310b4f9e5582935250c833108d0493b02db7f65c96"],
  ]);
  assert.equal(publishedDownloads.length, 3);
  assert.equal(new Set(publishedDownloads.map(item => item.file)).size, 3);
  for (const item of publishedDownloads) {
    assert.equal(item.hash, expected.get(item.file), item.file);
    assert(item.file.startsWith("scarp-" + publishedCompiler.version + "-"), item.file);
    assert.match(item.hash, /^[0-9a-f]{64}$/);
    assert.equal(publishedDownloadUrl(item.file), "https://github.com/scarp-lang/scarp/releases/download/v0.0.6-alpha.19/" + item.file);
    assert(publishedDownloadUrl(item.file + ".sha256").endsWith(item.file + ".sha256"));
  }
  assert.equal(downloads.length, 3, "Preserve older baseline machine-readable archives");
  assert(publishedDownloadUrl("SHA256SUMS").endsWith("/v0.0.6-alpha.19/SHA256SUMS"));
});
