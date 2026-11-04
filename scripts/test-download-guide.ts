import assert from "node:assert/strict";
import test from "node:test";
import { checksumCommand } from "../src/data/download-guidance.ts";
import { publishedCompiler, publishedDownloads } from "../src/data/releases.ts";
import { developmentAssets } from "../src/site/context.ts";
import { findPage } from "../src/site/pages.ts";
import { renderPage } from "../src/site/render.tsx";

test("checksum commands are derived from the exact reviewed platform archives", () => {
  assert.deepEqual(publishedDownloads.map(item => item.platform), ["windows", "linux", "macos"]);
  for (const item of publishedDownloads) {
    const command = checksumCommand(item);
    assert(command.includes(item.file));
    if (item.platform === "windows") {
      assert(command.includes("Get-FileHash -Algorithm SHA256 -Path '.\\" + item.file + "'"));
      assert(command.includes(item.hash));
      assert(command.includes("throw 'Checksum mismatch"));
    } else if (item.platform === "linux") {
      assert.equal(command, "sha256sum --check '" + item.file + ".sha256'");
    } else {
      assert.equal(command, "shasum -a 256 --check '" + item.file + ".sha256'");
    }
  }
});

test("downloads render accessible platform instructions without JavaScript", () => {
  const page = findPage("/downloads/");
  assert(page);
  const html = renderPage(page, developmentAssets);
  for (const item of publishedDownloads) {
    assert(html.includes('id="verify-' + item.platform + '"'));
    assert(html.includes('href="#verify-' + item.platform + '"'));
    assert(html.includes(item.file));
    assert(html.includes(item.hash));
  }
  assert(html.includes("Get-FileHash"));
  assert(html.includes("sha256sum --check"));
  assert(html.includes("shasum -a 256 --check"));
  assert(html.includes(publishedCompiler.sourceCommit + "/docs/project-workflow.md"));
});
