import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { project } from "../src/data/project.ts";
import { publishedCompiler } from "../src/data/releases.ts";
import { synchronizeCompilerPins } from "./compiler-pin-lib.ts";

const mode = process.argv[2] ?? "--check";
assert(["--check", "--write"].includes(mode), "Usage: sync-compiler-pins.ts [--check|--write]");
const paths = [".github/workflows/ci.yml", ".github/workflows/pages.yml"];
const pins = { baseline: project.source, published: publishedCompiler.sourceCommit };
const changes: { path: string; result: string }[] = [];
for (const path of paths) {
  const current = await readFile(path, "utf8");
  const result = synchronizeCompilerPins(current, pins);
  if (current !== result) changes.push({ path, result });
}
if (mode === "--check") {
  assert.equal(changes.length, 0,
    "Compiler source commits drifted in " + changes.map(change => change.path).join(", ") +
    ". Run npm run sync:compiler-pins after reviewing and verifying the published release.");
  console.log("Compiler workflow SHA pins match reviewed releases (baseline + published) in both workflows.");
} else {
  for (const change of changes) {
    await writeFile(change.path, change.result, "utf8");
    console.log("Synchronized: " + change.path);
  }
  if (!changes.length) console.log("Both compiler workflow pins are already up to date.");
}
