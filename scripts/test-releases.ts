import assert from "node:assert/strict";
import test from "node:test";
import { project, downloads } from "../src/data/project.ts";
import { publishedCompiler, publishedDownloads, publishedDownloadUrl } from "../src/data/releases.ts";
import { ecosystemProjects } from "../src/data/ecosystem.ts";

test("latest public prerelease is separate from the verified website baseline", () => {
  assert.equal(project.tag, "v0.0.5-alpha.1");
  assert.equal(publishedCompiler.tag, "v0.0.6-alpha.18");
  assert.notEqual(project.source, publishedCompiler.sourceCommit);
  assert.equal(publishedCompiler.reviewed, "2026-11-22");
  assert.equal(publishedCompiler.publishedAt, "2026-11-22T14:19:01Z");
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
    ["scarp-0.0.6-alpha.18-x86_64-pc-windows-msvc.zip", "1dbd8e9f6dbb3e727fb765b5a1bf184f8574c8b139289269b65a7d889d60e6b0"],
    ["scarp-0.0.6-alpha.18-x86_64-unknown-linux-gnu.tar.gz", "175fc419b1469e80dbf3cd7ccee273eb573a9113e27467801ef7095c064b289f"],
    ["scarp-0.0.6-alpha.18-aarch64-apple-darwin.tar.gz", "30aed1c56fc666f86dca6c08234d8ac17d9f5ee513a4270d7a65f80544dc2c52"],
  ]);
  assert.equal(publishedDownloads.length, 3);
  assert.equal(new Set(publishedDownloads.map(item => item.file)).size, 3);
  for (const item of publishedDownloads) {
    assert.equal(item.hash, expected.get(item.file), item.file);
    assert(item.file.startsWith("scarp-" + publishedCompiler.version + "-"), item.file);
    assert.match(item.hash, /^[0-9a-f]{64}$/);
    assert.equal(publishedDownloadUrl(item.file), "https://github.com/scarp-lang/scarp/releases/download/v0.0.6-alpha.18/" + item.file);
    assert(publishedDownloadUrl(item.file + ".sha256").endsWith(item.file + ".sha256"));
  }
  assert.equal(downloads.length, 3, "Preserve older baseline machine-readable archives");
  assert(publishedDownloadUrl("SHA256SUMS").endsWith("/v0.0.6-alpha.18/SHA256SUMS"));
});
