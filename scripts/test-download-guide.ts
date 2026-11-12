import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { checksumCommand } from "../src/data/download-guidance.ts";
import { publishedDownloads } from "../src/data/releases.ts";

test("checksum commands pin exact reviewed hashes and never trust sidecars alone", () => {
  assert.deepEqual(publishedDownloads.map(item => item.platform), ["windows", "linux", "macos"]);
  for (const item of publishedDownloads) {
    const command = checksumCommand(item);
    assert(command.includes(item.file), "Missing archive filename");
    assert(command.includes(item.hash), "Missing pinned digest");
    assert(!command.includes(item.file + ".sha256"), "Do not trust sidecar by itself");
    if (item.platform === "windows") {
      assert(command.includes("Get-FileHash -Algorithm SHA256"));
      assert(command.includes("throw 'Checksum mismatch"));
    } else if (item.platform === "linux") {
      assert.equal(command,
        "printf '%s\\n' '" + item.hash + "  " + item.file + "' | sha256sum --check -");
    } else {
      assert.equal(command,
        "printf '%s\\n' '" + item.hash + "  " + item.file + "' | shasum -a 256 --check -");
    }
  }
});

test("reject malformed archive names, path traversal and digest values", () => {
  const linux = publishedDownloads[1];
  assert(linux);
  for (const file of [
    "../archive.tar.gz", "missing-extension", "archive';echo pwned;.zip",
    "archive$(date).zip", "/tmp/archive.zip",
  ]) {
    assert.throws(() => checksumCommand({ ...linux, file }), /Unsafe or malformed/);
  }
  assert.throws(() => checksumCommand({ ...linux, hash: "0".repeat(63) }),
    /Unsafe or malformed/);
  assert.throws(() => checksumCommand({ ...linux, hash: "'".repeat(64) }),
    /Unsafe or malformed/);
});

test("Unix verification passes real checksum and rejects modified bytes without sidecar", async () => {
  if (process.platform !== "linux" && process.platform !== "darwin") return;
  const available = (command: string) =>
    spawnSync(command, ["--help"], { stdio: "ignore" }).error === undefined;
  const checkers = ([
    ["linux", "sha256sum"],
    ["macos", "shasum"],
  ] as const).filter(([, executable]) => available(executable));
  assert(checkers.length > 0, "Expected at least one checksum utility in CI");
  const directory = await mkdtemp(join(tmpdir(), "scarp-checksum-test-"));
  const file = "scarp-test.tar.gz";
  const bytes = Buffer.from("Scarp release digest regression fixture\n");
  try {
    await writeFile(join(directory, file), bytes);
    const hash = createHash("sha256").update(bytes).digest("hex");
    for (const [platform] of checkers) {
      const good = spawnSync("sh", ["-c", checksumCommand({ platform, file, hash })],
        { cwd: directory, encoding: "utf8" });
      assert.equal(good.status, 0, platform + ": " + good.stderr);
      assert.match(good.stdout, /: OK/);
    }
    await writeFile(join(directory, file), Buffer.from("Modified archive data"));
    for (const [platform] of checkers) {
      const bad = spawnSync("sh", ["-c", checksumCommand({ platform, file, hash })],
        { cwd: directory, encoding: "utf8" });
      assert.notEqual(bad.status, 0, platform + " must reject modified data");
      assert.doesNotMatch(bad.stdout, /: OK/);
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
