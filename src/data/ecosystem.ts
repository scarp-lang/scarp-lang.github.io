/**
 * Manually reviewed links and release facts, not a real-time GitHub status feed.
 * Recheck the linked repositories before updating this public snapshot.
 */
import { project } from "./project.ts";
import { publishedCompiler } from "./releases.ts";

export const ecosystemReviewedOn = "2026-11-03";

export interface EcosystemProject {
  id: string;
  name: string;
  category: string;
  status: string;
  version: string | null;
  summary: string;
  limitation: string;
  website: string;
  source: string;
  evidence: string;
}

export const ecosystemProjects = [
  {
    id: "compiler",
    name: "Scarp compiler",
    category: "Language foundation",
    status: "Experimental prerelease",
    version: publishedCompiler.tag,
    summary: "The official Rust interpreter, language implementation, CLI, and release source.",
    limitation: "Published alpha.5 adds explicit project module inspection and an experimental scalar C11 emitter for Rust embedding hosts. There is no native .srp compile command; syntax, manifests and APIs remain experimental.",
    website: `${project.repo}/releases`,
    source: project.repo,
    evidence: publishedCompiler.release,
  },
  {
    id: "docs",
    name: "Scarp Docs",
    category: "Reference & guides",
    status: "Actively developed",
    version: null,
    summary: "Installation, language explanations, tooling reference, and guides in English and Hindi.",
    limitation: "Some examples are pinned to earlier compiler versions; check each page's compatibility notes.",
    website: "https://scarp-lang.github.io/scarp-docs/",
    source: "https://github.com/scarp-lang/scarp-docs",
    evidence: "https://github.com/scarp-lang/scarp-docs/blob/main/README.md",
  },
  {
    id: "playground",
    name: "Scarp Playground",
    category: "Try in the browser",
    status: "Experimental alpha",
    version: "v0.0.1",
    summary: "Monaco-based browser editor that runs a pinned Scarp interpreter via Rust/WebAssembly.",
    limitation: "Experimental browser execution only; native compilation and server-side execution are not offered.",
    website: "https://scarp-lang.github.io/scarp-playground/",
    source: "https://github.com/scarp-lang/scarp-playground",
    evidence: "https://github.com/scarp-lang/scarp-playground/releases/tag/v0.0.1",
  },
  {
    id: "examples",
    name: "Scarp by Example",
    category: "Hands-on learning",
    status: "Early prerelease",
    version: "v0.1.0-alpha.1",
    summary: "Browsable lessons with runnable .srp source, expected output, and bilingual explanations.",
    limitation: "Lessons are checked against compiler v0.0.5-alpha.3; examples do not execute inside this site's browser.",
    website: "https://scarp-lang.github.io/scarp-by-example/",
    source: "https://github.com/scarp-lang/scarp-by-example",
    evidence: "https://github.com/scarp-lang/scarp-by-example/releases/tag/v0.1.0-alpha.1",
  },
  {
    id: "vscode",
    name: "Scarp for VS Code",
    category: "Editor tooling",
    status: "Experimental prerelease",
    version: "v0.1.2",
    summary: "Syntax highlighting and commands for running and verifying Scarp files with the official compiler.",
    limitation: "Requires a compatible Scarp interpreter; native compilation and project builds are not supported.",
    website: "https://scarp-lang.github.io/scarp-vscode/",
    source: "https://github.com/scarp-lang/scarp-vscode",
    evidence: "https://github.com/scarp-lang/scarp-vscode/releases/tag/v0.1.2",
  },
] as const satisfies readonly EcosystemProject[];
