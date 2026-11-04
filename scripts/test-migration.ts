import assert from "node:assert/strict";
import test from "node:test";
import { cliMilestones, cliMigrations, migrationEvidence } from "../src/data/migration.ts";
import { project } from "../src/data/project.ts";
import { publishedCompiler } from "../src/data/releases.ts";
import { exampleCompatibility } from "../src/data/compatibility.ts";

test("CLI migration milestones are pinned to four published prereleases", () => {
  assert.deepEqual(cliMilestones.map(item => item.tag), [
    project.tag, "v0.0.5-alpha.2", "v0.0.5-alpha.3", publishedCompiler.tag,
  ]);
  assert.equal(new Set(cliMilestones.map(item => item.tag)).size, cliMilestones.length);
  for (const item of cliMilestones) {
    assert.match(item.sourceCommit, /^[0-9a-f]{40}$/);
    assert.equal(item.evidence, project.repo + "/releases/tag/" + item.tag);
    assert(item.title && item.execution && item.validation && item.additional);
  }
  assert.equal(cliMilestones[0]?.sourceCommit, project.source);
  assert.equal(cliMilestones[3]?.sourceCommit, publishedCompiler.sourceCommit);
  assert.equal(migrationEvidence.publishedRelease, publishedCompiler.release);
  assert(migrationEvidence.projectWorkflow.includes(publishedCompiler.sourceCommit));
});

test("only CI-verified fixture releases receive the fixture-tested label", () => {
  const tested = cliMilestones.filter(item => item.fixtureTested);
  assert.deepEqual(tested.map(item => item.tag), exampleCompatibility.versions.map(item => item.tag));
  assert.deepEqual(tested.map(item => item.sourceCommit),
    exampleCompatibility.versions.map(item => item.sourceCommit));
  assert.equal(exampleCompatibility.fixtureNames.length, 3);
});

test("migration guidance preserves the runtime/static distinction", () => {
  assert.equal(cliMilestones[0]?.execution, "scarp run hello.srp");
  assert.equal(cliMilestones[1]?.validation, "scarp check hello.srp");
  assert.equal(cliMilestones[2]?.execution, "scarp exec hello.srp");
  assert.equal(cliMilestones[2]?.validation, "scarp verify hello.srp");
  assert(!cliMilestones[2]?.additional.includes("create DIRECTORY"));
  assert(cliMilestones[3]?.additional.includes("create DIRECTORY"));
  assert(cliMilestones[3]?.additional.includes("launch DIRECTORY"));
  assert.equal(new Set(cliMigrations.map(item => item.id)).size, cliMigrations.length);
  const validation = cliMigrations.find(item => item.id === "validate");
  assert(validation && !validation.equivalent);
  assert.match(validation.meaning, /Not equivalent/);
  assert.match(validation.meaning, /runtime paths/);
  assert.match(validation.meaning, /statically/);
  assert(cliMigrations.find(item => item.id === "modules")?.meaning.includes("alpha.2"));
});
