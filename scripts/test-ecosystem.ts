import assert from "node:assert/strict";
import test from "node:test";
import { ecosystemProjects, ecosystemReviewedOn } from "../src/data/ecosystem.ts";

test("official ecosystem snapshot is complete and stable to audit", () => {
  assert.equal(ecosystemReviewedOn, "2026-11-03");
  assert.equal(ecosystemProjects.length, 5);
  assert.deepEqual(ecosystemProjects.map(project => project.id), [
    "compiler", "docs", "playground", "examples", "vscode",
  ]);
  assert.equal(new Set(ecosystemProjects.map(project => project.source)).size, 5);
});

test("all projects link to the verified organization and public evidence", () => {
  for (const project of ecosystemProjects) {
    assert.match(project.source, /^https:\/\/github\.com\/scarp-lang\/[a-z-]+$/);
    assert(project.website.startsWith("https://"), project.name);
    assert(project.evidence.startsWith(project.source + "/"), project.name);
    assert(project.status.length > 0 && project.summary.length > 0);
    assert(project.limitation.length >= 30, "Missing clear limitation: " + project.name);
    assert(!/stable release|production.ready/i.test(project.status), "Misleading status: " + project.name);
  }
});

test("published versions are recorded only where source evidence supports them", () => {
  const versions = new Map(ecosystemProjects.map(project => [project.id, project.version]));
  assert.equal(versions.get("compiler"), "v0.0.5-alpha.4");
  assert.equal(versions.get("docs"), null);
  assert.equal(versions.get("playground"), "v0.0.1");
  assert.equal(versions.get("examples"), "v0.1.0-alpha.1");
  assert.equal(versions.get("vscode"), "v0.1.2");
  for (const project of ecosystemProjects) {
    if (project.version) assert(project.evidence.endsWith("/" + project.version));
  }
});
