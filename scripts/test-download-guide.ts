import assert from "node:assert/strict";
import test from "node:test";
import { checksumCommand } from "../src/data/download-guidance.ts";
import { publishedDownloads } from "../src/data/releases.ts";

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

