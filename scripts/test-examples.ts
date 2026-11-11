import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { spawnSync } from "node:child_process";
import { project } from "../src/data/project.ts";
import { publishedCompiler } from "../src/data/releases.ts";
import { exampleCompatibility } from "../src/data/compatibility.ts";

/**
 * Compile the official interpreter outside this script. Every website .srp fixture
 * must produce byte-identical stdout under its selected, exact source revision.
 * Historical alpha.1 uses run/check; published alpha.6+ uses exec/static-only verify.
 */
const target = process.env.SCARP_EXAMPLE_TARGET ?? "baseline";
assert(["baseline", "published"].includes(target), "SCARP_EXAMPLE_TARGET must be baseline or published");
const executable = process.env.SCARP_BIN;
assert(executable, "Set SCARP_BIN to the checked-out Scarp compiler executable");
const executablePath = resolve(executable);
const expectedVersion = target === "published" ? publishedCompiler.version : project.version;
const executeCommand = target === "published" ? "exec" : "run";
const validateCommand = target === "published" ? "verify" : "check";
const run = (args: readonly string[]) => spawnSync(executablePath, args, {
  encoding: "utf8",
  timeout: 15000,
});
const version = run(["--version"]);
assert.equal(version.error, undefined, String(version.error));
assert.equal(version.status, 0, version.stderr);
assert.match(version.stdout, new RegExp(`\\b${expectedVersion.replaceAll(".", "\\.")}\\b`), "Wrong compiler for requested fixture target");

const directory = resolve("src/examples");
const sources = (await readdir(directory)).filter(name => name.endsWith(".srp")).sort();
assert.deepEqual(sources, [...exampleCompatibility.fixtureNames].sort(), "Compatibility index must include every website source fixture");
for (const file of sources) {
  const source = join(directory, file);
  const expected = await readFile(source.replace(/\.srp$/, ".stdout"), "utf8");
  const result = run([executeCommand, source]);
  assert.equal(result.error, undefined, `${file}: ${String(result.error)}`);
  assert.equal(result.status, 0, `${file}: ${executeCommand}: ${result.stderr}`);
  assert.equal(result.stdout, expected, `${file}: output mismatch on ${expectedVersion}`);
  assert.equal(result.stderr, "", `${file}: unexpected stderr on ${expectedVersion}`);

  const validated = run([validateCommand, source]);
  assert.equal(validated.error, undefined, `${file}: ${String(validated.error)}`);
  assert.equal(validated.status, 0, `${file}: ${validateCommand}: ${validated.stderr}`);
  assert.equal(validated.stdout, "", `${file}: ${validateCommand} must be silent`);
  assert.equal(validated.stderr, "", `${file}: unexpected validation stderr`);
  console.log(`PASS ${file}: ${executeCommand} stdout + ${validateCommand} under ${expectedVersion}`);
}
if (target === "published") {
  const alpha6Directory = resolve("src/examples/published");
  const alpha6Sources = (await readdir(alpha6Directory)).filter(name => name.endsWith(".srp")).sort();
  assert.deepEqual(alpha6Sources, [...exampleCompatibility.publishedOnlyFixtureNames].sort(), "Review new published-only fixtures before adding them");
  for (const file of alpha6Sources) {
    const source = join(alpha6Directory, file);
    const expected = await readFile(source.replace(/\.srp$/, ".stdout"), "utf8");
    const executed = run(["exec", source]);
    assert.equal(executed.error, undefined, String(executed.error));
    assert.equal(executed.status, 0, `${file}: ${executed.stderr}`);
    assert.equal(executed.stdout, expected, `${file}: unexpected published output`);
    assert.equal(executed.stderr, "", `${file}: unexpected runtime stderr`);
    const verified = run(["verify", source]);
    assert.equal(verified.status, 0, `${file}: static verification failed: ${verified.stderr}`);
    assert.equal(verified.stdout, "", `${file}: verify must be silent`);
    for (const kind of ["symbols", "references"]) {
      const inspected = run(["inspect", kind, "--json", source]);
      assert.equal(inspected.status, 0, `${file}: inspect ${kind}: ${inspected.stderr}`);
      assert.equal(inspected.stderr, "", `${file}: unexpected inspection stderr`);
      const result = JSON.parse(inspected.stdout) as { schema_version?: number; kind?: string };
      assert.equal(result.schema_version, 1, `${file}: unsupported inspection schema`);
      assert.equal(result.kind, "scarp." + kind, `${file}: inspection kind mismatch`);
    }
    console.log(`PASS ${file}: alpha.6 exec, static verify and schema-v1 symbol navigation`);
  }
}
console.log(`Verified ${sources.length} real website examples using Scarp ${expectedVersion} (${target}).`);
