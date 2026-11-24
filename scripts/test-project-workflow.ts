import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { publishedCompiler } from "../src/data/releases.ts";
import { alpha8ProjectWorkflow } from "../src/data/project-workflow.ts";

/**
 * Read-only compiler verification except for a disposable project in the OS temp
 * directory. CI builds Scarp at the exact published source commit beforehand.
 * This intentionally does not run against the historical alpha.1 baseline.
 */
assert.equal(publishedCompiler.tag, alpha8ProjectWorkflow.releaseTag,
  "Review the project workflow fixture before pinning another compiler release");
const binary = process.env.SCARP_BIN;
assert(binary, "SCARP_BIN must point to the pinned published compiler");
const executable = resolve(binary);

interface CommandResult {
  status: number | null;
  stdout: string;
  stderr: string;
  error?: Error;
}

function command(args: string[], options: { cwd?: string } = {}): CommandResult {
  const result = spawnSync(executable, args, {
    encoding: "utf8",
    timeout: 15000,
    maxBuffer: 1024 * 1024,
    cwd: options.cwd,
  });
  assert.equal(result.error, undefined, args.join(" ") + ": " + String(result.error));
  return result;
}
function expectExit(args: string[], expectedStatus: number, cwd?: string): CommandResult {
  const result = command(args, { cwd });
  assert.equal(result.status, expectedStatus, args.join(" ") +
    ": unexpected exit status; stdout=" + result.stdout + "; stderr=" + result.stderr);
  return result;
}
interface TestReport {
  schema_version: number;
  mode: "run" | "list";
  discovered: number;
  passed: number;
  failed: number;
  tests: Array<{ path: string; status: string; error?: string }>;
}
function report(result: CommandResult): TestReport {
  assert(result.stdout.trim().startsWith("{"), "Test runner must emit a single JSON report");
  const parsed = JSON.parse(result.stdout) as TestReport;
  assert.equal(parsed.schema_version, 1, "Unexpected JSON report schema");
  assert(Array.isArray(parsed.tests), "Missing per-test results");
  return parsed;
}

const version = expectExit(["--version"], 0);
assert(version.stdout.includes(publishedCompiler.version), "Compiler version mismatch");

const workspace = await mkdtemp(join(tmpdir(), "scarp-website-project-test-"));
const projectDirectory = join(workspace, "calculator");
try {
  expectExit(["init", projectDirectory], 0);
  const manifest = await readFile(join(projectDirectory, "scarp.project"), "utf8");
  assert(manifest.includes('project "calculator"'), "Expected declarative project manifest");
  assert(manifest.includes('entry: "src/main.srp"'), "Missing manifest entrypoint");
  // The site publishes a complete copy-ready project. Check that the documented
  // declarative manifest and module files work with this exact release, not a
  // mocked parser or a later unreleased compiler branch.
  await writeFile(join(projectDirectory, "scarp.project"), alpha8ProjectWorkflow.manifestSource, "utf8");
  await writeFile(join(projectDirectory, "src", "math.srp"), alpha8ProjectWorkflow.moduleSource, "utf8");
  await writeFile(join(projectDirectory, "src", "main.srp"), alpha8ProjectWorkflow.mainSource, "utf8");
  expectExit(["verify", projectDirectory], 0);
  const executedApp = expectExit(["run", projectDirectory], 0);
  assert.equal(executedApp.stdout, alpha8ProjectWorkflow.expectedMainStdout,
    "Documented module import and executable project output diverged");
  assert.equal(executedApp.stderr, "", "Unexpected application stderr");
  // Alpha.18 resolves a valid local manifest without a source argument.
  const autoProject = expectExit(["exec"], 0, projectDirectory);
  assert.equal(autoProject.stdout, alpha8ProjectWorkflow.expectedMainStdout);
  assert.equal(autoProject.stderr, "", "Auto-resolved project emitted unexpected stderr");
  const standalone = join(workspace, "standalone");
  await mkdir(join(standalone, "src"), { recursive: true });
  await writeFile(join(standalone, "main.srp"), 'print("root choice");\n', "utf8");
  await writeFile(join(standalone, "src", "main.srp"), 'print("src choice");\n', "utf8");
  assert.equal(expectExit(["exec"], 0, standalone).stdout, "src choice\n",
    "No-arg exec must prioritize src/main.srp over main.srp");
  await rm(join(standalone, "src", "main.srp"));
  assert.equal(expectExit(["exec"], 0, standalone).stdout, "root choice\n",
    "No-arg exec must fall back to main.srp");
  await writeFile(join(standalone, "scarp.project"), "broken manifest\n", "utf8");
  assert.notEqual(command(["exec"], { cwd: standalone }).status, 0,
    "Invalid local manifest must never execute the fallback program");

  const metadata = expectExit(["project", "info", "--json", projectDirectory], 0);
  const info = JSON.parse(metadata.stdout) as {
    schema_version: number; name: string; entry: string; format: string; manifest: string;
  };
  assert.deepEqual(
    [info.schema_version, info.name, info.entry, info.format, info.manifest],
    [1, "calculator", "src/main.srp", "v2", "scarp.project"],
  );

  const empty = report(expectExit(["test", "--json", projectDirectory], 0));
  assert.deepEqual([empty.mode, empty.discovered, empty.passed, empty.failed],
    ["run", 0, 0, 0]);
  const requiredEmpty = report(expectExit(["test", "--json", "--require-tests", projectDirectory], 1));
  assert.equal(requiredEmpty.discovered, 0, "Empty-suite guard must reject zero tests");

  const testsDir = join(projectDirectory, "tests");
  await mkdir(testsDir, { recursive: true });
  await writeFile(join(testsDir, "addition.srp"), alpha8ProjectWorkflow.additionSource, "utf8");
  await writeFile(join(testsDir, "greeting.srp"), alpha8ProjectWorkflow.greetingSource, "utf8");
  await writeFile(join(testsDir, "greeting.stdin"), alpha8ProjectWorkflow.greetingInput, "utf8");

  const listing = report(expectExit(["test", "--json", "--list", projectDirectory], 0));
  assert.deepEqual([listing.mode, listing.discovered, listing.passed, listing.failed],
    ["list", 2, 0, 0]);
  assert.deepEqual(listing.tests.map(test => test.path),
    ["tests/addition.srp", "tests/greeting.srp"]);
  assert(listing.tests.every(test => test.status === "discovered"));

  const full = expectExit(["test", "--json", "--require-tests", projectDirectory], 0);
  const suite = report(full);
  assert.deepEqual([suite.mode, suite.discovered, suite.passed, suite.failed],
    ["run", 2, 2, 0]);
  assert(suite.tests.every(test => test.status === "passed"));
  assert(!full.stdout.includes("captured test output"),
    "Program output must not contaminate structured JSON reports");

  const filtered = report(expectExit(
    ["test", "--json", "--require-tests", "--filter", "greeting", projectDirectory], 0));
  assert.deepEqual([filtered.discovered, filtered.passed, filtered.failed], [1, 1, 0]);
  assert.deepEqual(filtered.tests.map(test => test.path), ["tests/greeting.srp"]);

  await writeFile(join(testsDir, "failure.srp"), alpha8ProjectWorkflow.failureSource, "utf8");
  const failureListing = report(expectExit(["test", "--json", "--list", projectDirectory], 0));
  assert.equal(failureListing.discovered, 3,
    "Read-only listing must not execute the deliberately failing assertion");

  const failed = report(expectExit(["test", "--json", "--filter", "failure", projectDirectory], 1));
  assert.deepEqual([failed.discovered, failed.passed, failed.failed], [1, 0, 1]);
  assert.equal(failed.tests[0]?.status, "failed");
  assert.match(failed.tests[0]?.error ?? "", /E0065|assertion/i);

  // Alpha.9 adds source-oriented structured diagnostics without changing v1 reports.
  const detailed = expectExit(["test", "--json=v2", "--filter", "failure", projectDirectory], 1);
  const structured = JSON.parse(detailed.stdout) as {
    schema_version: number; mode: string; discovered: number; failed: number;
    tests: Array<{ path: string; status: string; phase?: string; diagnostic?: { code?: string | null } }>;
  };
  assert.equal(structured.schema_version, 2);
  assert.equal(structured.mode, "run");
  assert.deepEqual([structured.discovered, structured.failed], [1, 1]);
  assert.equal(structured.tests[0]?.path, "tests/failure.srp");
  assert.equal(structured.tests[0]?.status, "failed");
  assert.equal(structured.tests[0]?.phase, "runtime");
  assert.equal(structured.tests[0]?.diagnostic?.code, "E0065");
  assert(!detailed.stdout.includes("captured test output"),
    "V2 structured diagnostics must not include other program output");

  // Static verification checks types; the false assertion fails only at runtime.
  expectExit(["verify", join(testsDir, "failure.srp")], 0);

  // Alpha.20 create now uses the same canonical v2 scaffolding as init.
  const createdDirectory = join(workspace, "created-calculator");
  expectExit(["create", createdDirectory], 0);
  const createdManifest = await readFile(join(createdDirectory, "scarp.project"), "utf8");
  assert.equal(createdManifest, alpha8ProjectWorkflow.manifestSource.replace('"calculator"', '"created-calculator"'));
  expectExit(["verify", createdDirectory], 0);
  expectExit(["launch", createdDirectory], 0);
  const createdMetadata = JSON.parse(
    expectExit(["project", "info", "--json", createdDirectory], 0).stdout,
  ) as { schema_version: number; name: string; manifest: string; format: string };
  assert.deepEqual([createdMetadata.schema_version, createdMetadata.name,
    createdMetadata.manifest, createdMetadata.format],
    [1, "created-calculator", "scarp.project", "v2"]);

  // Use a real legacy v1 fixture; create no longer generates this format.
  const legacyDirectory = join(workspace, "legacy-calculator");
  await mkdir(join(legacyDirectory, "src"), { recursive: true });
  const legacyManifest = "scarp-project: 1\nname: legacy-calculator\nentry: src/main.srp\n";
  await writeFile(join(legacyDirectory, "Scarp.project"), legacyManifest, "utf8");
  await writeFile(join(legacyDirectory, "src", "main.srp"), 'print("legacy");\n', "utf8");
  expectExit(["verify", legacyDirectory], 0);
  assert.equal(expectExit(["launch", legacyDirectory], 0).stdout, "legacy\n");
  const legacyMetadata = JSON.parse(
    expectExit(["project", "info", "--json", legacyDirectory], 0).stdout,
  ) as { schema_version: number; name: string; manifest: string; format: string };
  assert.deepEqual([legacyMetadata.schema_version, legacyMetadata.name, legacyMetadata.format],
    [1, "legacy-calculator", "legacy-v1"]);
  assert.match(legacyMetadata.manifest, /^scarp\.project$/i);
  for (const directory of [legacyDirectory, projectDirectory, createdDirectory]) {
    expectExit(["init", directory], 1);
    expectExit(["create", directory], 1);
  }
  assert.equal(await readFile(join(legacyDirectory, "Scarp.project"), "utf8"),
    legacyManifest, "Failed scaffolding must leave legacy manifest unchanged");
  assert.equal(await readFile(join(createdDirectory, "scarp.project"), "utf8"), createdManifest);
  console.log("Verified canonical v2 create and legacy v1 verify/launch/info; no-overwrite scaffolding.");
  console.log("Verified Scarp " + publishedCompiler.tag +
    ": copy-ready manifest, source-module import and exact application stdout;" +
    " init/verify/run/info; empty-suite guard; isolated UTF-8 input;" +
    " JSON v1/v2 listing, filtering, passing and failing assertions.");
} finally {
  await rm(workspace, { recursive: true, force: true });
}
