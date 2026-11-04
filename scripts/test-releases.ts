import assert from "node:assert/strict";
import test from "node:test";
import { project, downloads } from "../src/data/project.ts";
import { publishedCompiler, publishedDownloads, publishedDownloadUrl } from "../src/data/releases.ts";
import { ecosystemProjects } from "../src/data/ecosystem.ts";

test("latest public prerelease is separate from the verified website baseline", () => {
  assert.equal(project.tag, "v0.0.5-alpha.1");
  assert.equal(publishedCompiler.tag, "v0.0.5-alpha.5");
  assert.notEqual(project.source, publishedCompiler.sourceCommit);
  assert.equal(publishedCompiler.reviewed, "2026-11-04");
  assert.equal(publishedCompiler.publishedAt, "2026-11-04T11:59:57Z");
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
    ["scarp-0.0.5-alpha.5-x86_64-pc-windows-msvc.zip", "bda472096e64ccaa33d277e28e3206d727ab0cdc4f9a681feeaf9ecb35539f68"],
    ["scarp-0.0.5-alpha.5-x86_64-unknown-linux-gnu.tar.gz", "07f62d23c2902b03071286b5fceef1bb7896374f8345b42f85cb0fd1b6478375"],
    ["scarp-0.0.5-alpha.5-aarch64-apple-darwin.tar.gz", "feeaa8216bb2fed7017794c5f6e0b8278ead5544b383990667c0862488089d28"],
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
