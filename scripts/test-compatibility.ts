import assert from "node:assert/strict";
import test from "node:test";
import { readdir, readFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { exampleCompatibility } from "../src/data/compatibility.ts";
import { project } from "../src/data/project.ts";
import { publishedCompiler } from "../src/data/releases.ts";

test("CI coverage is explicitly limited to the exact existing fixtures", async () => {
  const directory = resolve("src/examples");
  const actual = (await readdir(directory)).filter(name => name.endsWith(".srp")).sort();
  assert.deepEqual(actual, [...exampleCompatibility.fixtureNames].sort());
  for (const name of actual) {
    const program = await readFile(join(directory, name), "utf8");
    const expectedOutput = await readFile(join(directory, name.replace(".srp", ".stdout")), "utf8");
    assert(program.length > 0, name + " is blank");
    assert(expectedOutput.length > 0, name + " has no expected output");
  }
  assert.deepEqual([...exampleCompatibility.publishedOnlyFixtureNames].sort(), ["conditional_unicode.srp", "nucleus_selection.srp", "pearson_correlation.srp", "rms.srp", "temperature_softmax.srp", "topk_scores.srp"]);
  const publishedRoot = resolve("src/examples/published");
  assert.deepEqual((await readdir(publishedRoot)).filter(name => name.endsWith(".srp")).sort(),
    [...exampleCompatibility.publishedOnlyFixtureNames].sort());
  for (const name of exampleCompatibility.publishedOnlyFixtureNames) {
    assert((await readFile(join(publishedRoot, name), "utf8")).trim().length > 0, name);
    assert((await readFile(join(publishedRoot, name.replace(".srp", ".stdout")), "utf8")).length > 0, name);
  }
  assert.match(await readFile(join(publishedRoot, "rms.srp"), "utf8"), /rms\(/);
  assert.match(await readFile(join(publishedRoot, "conditional_unicode.srp"), "utf8"), /elif score >= 60/);
  assert.match(await readFile(join(publishedRoot, "nucleus_selection.srp"), "utf8"), /top_p\(/);
  assert.match(await readFile(join(publishedRoot, "pearson_correlation.srp"), "utf8"), /pearson_correlation\(/);
  assert.match(await readFile(join(publishedRoot, "topk_scores.srp"), "utf8"), /topk\(/);
  assert.match(await readFile(join(publishedRoot, "temperature_softmax.srp"), "utf8"), /logsoftmax_temp\(/);
  assert.equal(await readFile(join(publishedRoot, "rms.stdout"), "utf8"), "2.0\n");
  assert.equal(exampleCompatibility.reviewed, publishedCompiler.reviewed);
  assert.match(exampleCompatibility.workflow, /github\.com\/scarp-lang\/scarp-lang\.github\.io\/actions\/workflows\/ci\.yml/);
});

test("versions and CLI semantics are sourced from exact release pins", () => {
  assert.equal(exampleCompatibility.versions.length, 2);
  const [baseline, published] = exampleCompatibility.versions;
  assert(baseline && published);
  assert.equal(baseline.tag, project.tag);
  assert.equal(baseline.sourceCommit, project.source);
  assert.equal(baseline.executionCommand, "run");
  assert.equal(baseline.validationCommand, "check");
  assert.equal(published.tag, publishedCompiler.tag);
  assert.equal(published.sourceCommit, publishedCompiler.sourceCommit);
  assert.equal(published.executionCommand, "exec");
  assert.equal(published.validationCommand, "verify");
  for (const version of exampleCompatibility.versions) {
    assert.match(version.sourceCommit, /^[0-9a-f]{40}$/);
    assert.equal(version.status, "Verified fixtures");
  }
});
