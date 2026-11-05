import { project } from "./project.ts";
import { publishedCompiler } from "./releases.ts";

/**
 * CI-backed compatibility coverage for exactly the three website fixtures.
 * This deliberately does not imply full language or platform compatibility.
 * The matching source commits are checked out and executed in ci.yml/pages.yml.
 */
export const exampleCompatibility = {
  reviewed: "2026-11-05",
  fixtureNames: ["functions.srp", "hello.srp", "numerics.srp"],
  versions: [
    {
      tag: project.tag,
      sourceCommit: project.source,
      executionCommand: "run",
      validationCommand: "check",
      validationType: "Legacy evaluating check",
      status: "Verified fixtures",
    },
    {
      tag: publishedCompiler.tag,
      sourceCommit: publishedCompiler.sourceCommit,
      executionCommand: "exec",
      validationCommand: "verify",
      validationType: "Static-only verification",
      status: "Verified fixtures",
    },
  ],
  workflow: "https://github.com/scarp-lang/scarp-lang.github.io/actions/workflows/ci.yml",
  sourceDirectory: "https://github.com/scarp-lang/scarp-lang.github.io/tree/main/src/examples",
} as const;

export const fixtureUrl = (name: string) =>
  "https://github.com/scarp-lang/scarp-lang.github.io/blob/main/src/examples/" + name;
