/**
 * Manually reviewed links and release facts, not a real-time GitHub status feed.
 * Recheck the linked repositories before updating this public snapshot.
 */
import { project } from "./project.ts";
import { publishedCompiler } from "./releases.ts";

export const ecosystemReviewedOn = "2026-11-19";

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
    limitation: "Published v0.0.6-alpha.15 limits inspection inputs, accounts for equal-length string comparison work, guards semantic cache revisions and adds checked shifts to restricted ELF64 kernels. Alpha.14 improved nested destructuring diagnostics, Rust cache limits and the original checked integer object emitter. Alpha.13 improved propagation and workspace-safe snapshots; alpha.12 introduced typed records, variants and immutable lists/maps; alpha.11 exact decimals; alpha.10 interactive input and fixed arrays. CLI program execution remains interpreter-backed; general native compilation, integrated LSP, GPU runtime and stable Rust ABI are not provided.",
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
    version: "v0.0.2",
    summary: "Monaco-based browser editor that runs a pinned Scarp interpreter via Rust/WebAssembly.",
    limitation: "Experimental browser execution only; native compilation and server-side execution are not offered.",
    website: "https://scarp-lang.github.io/scarp-playground/",
    source: "https://github.com/scarp-lang/scarp-playground",
    evidence: "https://github.com/scarp-lang/scarp-playground/releases/tag/v0.0.2",
  },
  {
    id: "examples",
    name: "Scarp by Example",
    category: "Hands-on learning",
    status: "Early prerelease",
    version: "v0.1.0-alpha.5",
    summary: "Browsable lessons with runnable .srp source, expected output, and bilingual explanations.",
    limitation: "Lessons are pinned to a separately checked Scarp compiler source revision; examples do not execute inside this site's browser.",
    website: "https://scarp-lang.github.io/scarp-by-example/",
    source: "https://github.com/scarp-lang/scarp-by-example",
    evidence: "https://github.com/scarp-lang/scarp-by-example/releases/tag/v0.1.0-alpha.5",
  },
  {
    id: "vscode",
    name: "Scarp for VS Code",
    category: "Editor tooling",
    status: "Experimental prerelease",
    version: "v0.1.4",
    summary: "Syntax highlighting and commands for running and verifying Scarp files with the official compiler.",
    limitation: "Requires a compatible Scarp interpreter; native compilation and project builds are not supported.",
    website: "https://scarp-lang.github.io/scarp-vscode/",
    source: "https://github.com/scarp-lang/scarp-vscode",
    evidence: "https://github.com/scarp-lang/scarp-vscode/releases/tag/v0.1.4",
  },
] as const satisfies readonly EcosystemProject[];
