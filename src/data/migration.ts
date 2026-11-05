import { project } from "./project.ts";
import { publishedCompiler } from "./releases.ts";

/** Published CLI milestones. Only the baseline and latest release are in current website CI. */
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
    tag: "v0.0.5-alpha.4",
    sourceCommit: "79141329176f5dce51457e90a6652902f6432135",
    title: "Explicit offline project workflow",
    execution: "scarp exec hello.srp",
    validation: "scarp verify hello.srp",
    inspection: "scarp inspect modules --json hello.srp",
    additional: "scarp create DIRECTORY, verify DIRECTORY and launch DIRECTORY",
    evidence: project.repo + "/releases/tag/v0.0.5-alpha.4",
    fixtureTested: false,
  },
  {
    tag: "v0.0.5-alpha.5",
    sourceCommit: "2eeed0aa52ccb59523307841ad8ffbd83f8911a8",
    title: "Project module inspection and restricted C11 embedding API",
    execution: "scarp exec hello.srp",
    validation: "scarp verify hello.srp",
    inspection: "scarp inspect modules --json PROJECT_DIRECTORY",
    additional: "Project module inspection via CLI; restricted scalar C11 generator for Rust embedding only (no compile CLI)",
    evidence: project.repo + "/releases/tag/v0.0.5-alpha.5",
    fixtureTested: false,
  },
  {
    tag: publishedCompiler.tag,
    sourceCommit: publishedCompiler.sourceCommit,
    title: "Cross-file symbol navigation and finite vector RMS",
    execution: "scarp exec hello.srp",
    validation: "scarp verify hello.srp",
    inspection: "scarp inspect symbols --json PROJECT_DIRECTORY",
    additional: "Static symbol/reference inspection for source files and explicit projects; rms(vector) numerical builtin (no LSP or native compile CLI)",
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
