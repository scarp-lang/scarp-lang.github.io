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
  assert.deepEqual([...exampleCompatibility.publishedOnlyFixtureNames].sort(), ["array_traversal.srp", "array_updates.srp", "bigint_arithmetic.srp", "bigint_exact.srp", "conditional_unicode.srp", "fixed_arrays.srp", "map_projection_snapshots.srp", "nucleus_selection.srp", "order_statistics.srp", "pearson_correlation.srp", "rms.srp", "temperature_softmax.srp", "topk_scores.srp", "typed_propagation.srp"]);
  const interactiveRoot = resolve("src/examples/interactive");
  assert.deepEqual((await readdir(interactiveRoot)).filter(name => name.endsWith(".srp")).sort(),
    [...exampleCompatibility.interactiveFixtureNames].sort());
  assert.match(await readFile(join(interactiveRoot, "boolean_prompt.srp"), "utf8"), /input_boolean\(/);
  assert.equal(await readFile(join(interactiveRoot, "boolean_prompt.stdin"), "utf8"), "true\nfalse\n");
  assert.equal(await readFile(join(interactiveRoot, "boolean_prompt.stdout"), "utf8"),
    "Continue (true/false)? Continue (true/false)? Continuing\nStopped\n");
  const publishedRoot = resolve("src/examples/published");
  assert.deepEqual((await readdir(publishedRoot)).filter(name => name.endsWith(".srp")).sort(),
    [...exampleCompatibility.publishedOnlyFixtureNames].sort());
  for (const name of exampleCompatibility.publishedOnlyFixtureNames) {
    assert((await readFile(join(publishedRoot, name), "utf8")).trim().length > 0, name);
    assert((await readFile(join(publishedRoot, name.replace(".srp", ".stdout")), "utf8")).length > 0, name);
  }
  assert.match(await readFile(join(publishedRoot, "typed_propagation.srp"), "utf8"), /validate_title\(value\)\?/);
  assert.match(await readFile(join(publishedRoot, "map_projection_snapshots.srp"), "utf8"), /map_keys\(reduced\)/);
  assert.equal(await readFile(join(publishedRoot, "typed_propagation.stdout"), "utf8"),
    "Saved Review PR\nRejected title empty\nRejected title missing\nNo title\ntrue\n");
  assert.equal(await readFile(join(publishedRoot, "map_projection_snapshots.stdout"), "utf8"),
    '[list: 1, 2, 3]\n[list: "one", "two", "three"]\n[list: 2, 3]\n[list: "TWO", "three"]\n3 2\n');
  assert.match(await readFile(join(publishedRoot, "rms.srp"), "utf8"), /rms\(/);
  assert.match(await readFile(join(publishedRoot, "bigint_arithmetic.srp"), "utf8"), /bigint\(/);
  assert.equal((await readFile(join(publishedRoot, "bigint_arithmetic.stdout"), "utf8")).split("\n")[0], "1000000000000000000000000000000");
  assert.match(await readFile(join(publishedRoot, "bigint_exact.srp"), "utf8"), /bigint_pow\(/);
  assert.match(await readFile(join(publishedRoot, "fixed_arrays.srp"), "utf8"), /array<string, 2>/);
  assert.match(await readFile(join(publishedRoot, "array_traversal.srp"), "utf8"), /repeat array_len\(readings\)/);
  assert.match(await readFile(join(publishedRoot, "array_traversal.srp"), "utf8"), /array_get_or\(/);
  assert.match(await readFile(join(publishedRoot, "array_updates.srp"), "utf8"), /array_set\(/);
  assert.equal(await readFile(join(publishedRoot, "array_updates.stdout"), "utf8"), "8\n99\n3\n");
  assert.equal(await readFile(join(publishedRoot, "array_traversal.stdout"), "utf8"),
    "Total: 60\nMissing reading: 0\nEmpty length: 0\n");
  assert.match(await readFile(join(publishedRoot, "order_statistics.srp"), "utf8"), /quantile\(/);
  assert.equal(await readFile(join(publishedRoot, "order_statistics.stdout"), "utf8"),
    "3.0\n1.75\n4.75\n2.0\n[4.0, 1.0, 7.0, 2.0]\n");
  assert.equal(await readFile(join(publishedRoot, "bigint_exact.stdout"), "utf8"), "111111111111111111111111111111 8\n129 100000000000000000000000000000000\n18446744073709551616 6\n");
  assert.equal(await readFile(join(publishedRoot, "fixed_arrays.stdout"), "utf8"), "Scarp 3 [array: <array<integer, 2>>]\n[array: \"नमस्ते\", \"Scarp\"] true\n");
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

test("published project workflow CI smoke checks use the exact reviewed compiler source", async () => {
  const { alpha8ProjectWorkflow } = await import("../src/data/project-workflow.ts");
  assert.equal(alpha8ProjectWorkflow.releaseTag, publishedCompiler.tag);
  assert.match(alpha8ProjectWorkflow.manifestSource, /project "calculator"/);
  assert.match(alpha8ProjectWorkflow.moduleSource, /pub pure funcra add/);
  assert.match(alpha8ProjectWorkflow.mainSource, /import "math.srp" as math/);
  assert.equal(alpha8ProjectWorkflow.expectedMainStdout, "42\n");
  assert.match(alpha8ProjectWorkflow.additionSource, /assert\(math\.add\(2, 3\) == 5/);
  assert.match(alpha8ProjectWorkflow.greetingSource, /read_line\(\)/);
  assert.equal(alpha8ProjectWorkflow.greetingInput, "नमस्ते\n");
  assert.match(alpha8ProjectWorkflow.failureSource, /assert\(false/);
  const runner = await readFile("scripts/test-project-workflow.ts", "utf8");
  for (const token of ["--require-tests", "--filter", "--list", "--json", "E0065", "scarp.project"]) {
    assert(runner.includes(token), "Missing CLI smoke coverage: " + token);
  }
  for (const file of [".github/workflows/ci.yml", ".github/workflows/pages.yml"]) {
    const yaml = await readFile(file, "utf8");
    assert(yaml.includes("npm run test:project-workflow"), file + " must run the project smoke check");
    assert(yaml.includes("SCARP_BIN: .compiler-published/target/debug/scarp"),
      file + " must use the separately pinned published binary");
  }
});
