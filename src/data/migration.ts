import { project } from "./project.ts";
import { publishedCompiler } from "./releases.ts";

/** Release-documented CLI milestones; only alpha.1/alpha.4 website fixtures have CI execution evidence. */
export const cliMilestones = [
  {
    tag: project.tag,
    sourceCommit: project.source,
    title: "Source modules and legacy CLI",
    execution: "scarp run hello.srp",
    validation: "scarp check hello.srp",
    inspection: "scarp tokens hello.srp",
    additional: "Relative .srp imports and explicit public source declarations",
    evidence: project.release,
    fixtureTested: true,
  },
  {
    tag: "v0.0.5-alpha.2",
    sourceCommit: "e4db8e191cd7ea623123cae7348450ca6c95b170",
    title: "Module metadata and diagnostics",
    execution: "scarp run hello.srp",
    validation: "scarp check hello.srp",
    inspection: "scarp modules --json hello.srp",
    additional: "Checked module inventory and structured module metadata",
    evidence: project.repo + "/releases/tag/v0.0.5-alpha.2",
    fixtureTested: false,
  },
  {
    tag: "v0.0.5-alpha.3",
    sourceCommit: "7715c28df09c7703b39e14fddb963275b25df476",
    title: "Scarp-first file commands",
    execution: "scarp exec hello.srp",
    validation: "scarp verify hello.srp",
    inspection: "scarp inspect modules --json hello.srp",
    additional: "guide, diagnose, exec, verify FILE and nested inspect",
    evidence: project.repo + "/releases/tag/v0.0.5-alpha.3",
    fixtureTested: false,
  },
  {
    tag: publishedCompiler.tag,
    sourceCommit: publishedCompiler.sourceCommit,
    title: "Explicit offline project workflow",
    execution: "scarp exec hello.srp",
    validation: "scarp verify hello.srp",
    inspection: "scarp inspect modules --json hello.srp",
    additional: "scarp create DIRECTORY, verify DIRECTORY and launch DIRECTORY",
    evidence: publishedCompiler.release,
    fixtureTested: true,
  },
] as const;

export const cliMigrations = [
  {
    id: "execute",
    previous: "scarp run hello.srp",
    current: "scarp exec hello.srp",
    meaning: "Execute a file with the Scarp interpreter; the legacy run spelling remains temporarily accepted.",
    equivalent: true,
  },
  {
    id: "validate",
    previous: "scarp check hello.srp",
    current: "scarp verify hello.srp",
    meaning: "Not equivalent: check can evaluate selected runtime paths without printing; verify statically checks names and types without running ordinary statements.",
    equivalent: false,
  },
  {
    id: "tokens",
    previous: "scarp tokens hello.srp",
    current: "scarp inspect tokens hello.srp",
    meaning: "Inspect lexer tokens rather than execute the program.",
    equivalent: true,
  },
  {
    id: "modules",
    previous: "scarp modules --json hello.srp",
    current: "scarp inspect modules --json hello.srp",
    meaning: "Inspect checked module metadata. The older standalone modules command began in alpha.2, not alpha.1.",
    equivalent: true,
  },
] as const;

export const migrationEvidence = {
  publishedSource: project.repo + "/blob/" + publishedCompiler.sourceCommit + "/docs/reference/cli.md",
  projectWorkflow: project.repo + "/blob/" + publishedCompiler.sourceCommit + "/docs/project-workflow.md",
  publishedRelease: publishedCompiler.release,
  baselineRelease: project.release,
} as const;
