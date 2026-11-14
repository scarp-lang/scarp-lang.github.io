import assert from "node:assert/strict";
import test from "node:test";
import { project, downloads } from "../src/data/project.ts";
import { publishedCompiler, publishedDownloads, publishedDownloadUrl } from "../src/data/releases.ts";
import { ecosystemProjects } from "../src/data/ecosystem.ts";

test("latest public prerelease is separate from the verified website baseline", () => {
  assert.equal(project.tag, "v0.0.5-alpha.1");
  assert.equal(publishedCompiler.tag, "v0.0.6-alpha.10");
  assert.notEqual(project.source, publishedCompiler.sourceCommit);
  assert.equal(publishedCompiler.reviewed, "2026-11-14");
  assert.equal(publishedCompiler.publishedAt, "2026-11-14T07:03:24Z");
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
    ["scarp-0.0.6-alpha.10-x86_64-pc-windows-msvc.zip", "02da845a634ff3f05e9592f41195c84e9d6f62089f35be44a3c9b41296550190"],
    ["scarp-0.0.6-alpha.10-x86_64-unknown-linux-gnu.tar.gz", "1d3923cb36954f75c63349d0927f293d15b9b8224cd14475b34f4ca3f2550ae1"],
    ["scarp-0.0.6-alpha.10-aarch64-apple-darwin.tar.gz", "74bf15d77e9c8565e2e8cc74e15c21a2015d58e6b90ef8ca88376f26b74e2f4d"],
  ]);
  assert.equal(publishedDownloads.length, 3);
  assert.equal(new Set(publishedDownloads.map(item => item.file)).size, 3);
  for (const item of publishedDownloads) {
    assert.equal(item.hash, expected.get(item.file), item.file);
    assert(item.file.startsWith("scarp-" + publishedCompiler.version + "-"), item.file);
    assert.match(item.hash, /^[0-9a-f]{64}$/);
    assert.equal(publishedDownloadUrl(item.file), "https://github.com/scarp-lang/scarp/releases/download/v0.0.6-alpha.10/" + item.file);
    assert(publishedDownloadUrl(item.file + ".sha256").endsWith(item.file + ".sha256"));
  }
  assert.equal(downloads.length, 3, "Preserve older baseline machine-readable archives");
  assert(publishedDownloadUrl("SHA256SUMS").endsWith("/v0.0.6-alpha.10/SHA256SUMS"));
});
