import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { project } from "../src/data/project.ts";
import { publishedCompiler } from "../src/data/releases.ts";
import { synchronizeCompilerPins } from "./compiler-pin-lib.ts";

const pins = { baseline: project.source, published: publishedCompiler.sourceCommit };
function checkout(dir: string, sha: string): string {
  return [
    "      - uses: actions/checkout@v4",
    "        with:",
    "          repository: scarp-lang/scarp",
    "          ref: " + sha,
    "          path: " + dir,
    "          persist-credentials: false",
  ].join("\n");
}
function workflow(): string {
  return "name: Demo\n" + checkout(".compiler", "a".repeat(40)) +
    "\n" + checkout(".compiler-published", "b".repeat(40)) +
    "\n      - uses: actions/checkout@v4\n        with:\n          ref: keep-me\n";
}

test("sync edits only two official pinned compiler SHAs, preserving all other YAML", () => {
  const original = workflow();
  const result = synchronizeCompilerPins(original, pins);
  assert(result.includes("ref: " + pins.baseline + "\n          path: .compiler\n"));
  assert(result.includes("ref: " + pins.published + "\n          path: .compiler-published\n"));
  assert(result.includes("ref: keep-me"));
  assert(!result.includes("ref: " + "a".repeat(40)));
  assert.equal(synchronizeCompilerPins(result, pins), result, "Synchronizer must be idempotent");
});

test("sync rejects malformed, missing or duplicate checkout definitions", () => {
  const original = workflow();
  assert.throws(() => synchronizeCompilerPins(original.replace("path: .compiler-published", "path: .compiler"), pins), /Duplicate compiler/);
  assert.throws(() => synchronizeCompilerPins(original.replace("path: .compiler-published", "path: .other"), pins), /Missing pinned published/);
  assert.throws(() => synchronizeCompilerPins(original.replace("ref: " + "b".repeat(40), "ref: main"), pins), /Missing pinned published/);
  assert.throws(() => synchronizeCompilerPins(original.replaceAll("repository: scarp-lang/scarp", "repository: another/repo"), pins), /exactly two/);
  assert.throws(() => synchronizeCompilerPins(original, { ...pins, published: "not-a-sha" }), /Invalid published/);
});

test("Pages artifact retains dotfiles with modern GitHub actions", async () => {
  const pagesWorkflow = await readFile(".github/workflows/pages.yml", "utf8");
  assert.match(pagesWorkflow, /uses: actions\/upload-pages-artifact@v5/);
  assert.match(pagesWorkflow, /uses: actions\/configure-pages@v6/);
  assert.match(pagesWorkflow, /include-hidden-files: true/);
  assert.match(pagesWorkflow, /path: dist/);
  assert.match(pagesWorkflow, /id-token: write/);
});

test("CI and Pages workflow source commits match the reviewed TypeScript snapshots", async () => {
  for (const path of [".github/workflows/ci.yml", ".github/workflows/pages.yml"]) {
    const text = await readFile(path, "utf8");
    assert.equal(synchronizeCompilerPins(text, pins), text,
      "Compiler source pin drift: " + path + " (run npm run sync:compiler-pins)");
    assert(text.includes("SCARP_EXAMPLE_TARGET: published"),
      "Published release compatibility check missing: " + path);
    assert(text.includes(".compiler-published/target/debug/scarp"),
      "Missing version-independent published interpreter path: " + path);
  }
});
