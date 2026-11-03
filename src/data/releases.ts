/**
 * Published release snapshot reviewed against the official GitHub release
 * and annotated tag on 3 November 2026. Not an automatically updated feed.
 * The website example baseline remains separately pinned in project.ts.
 */
import { project } from "./project.ts";

export const publishedCompiler = {
  version: "0.0.5-alpha.4",
  tag: "v0.0.5-alpha.4",
  publishedAt: "2026-11-03T13:16:44Z",
  reviewed: "2026-11-03",
  sourceCommit: "79141329176f5dce51457e90a6652902f6432135",
  release: "https://github.com/scarp-lang/scarp/releases/tag/v0.0.5-alpha.4",
  status: "experimental-prerelease",
} as const;

export const publishedDownloads = [
  {
    name: "Windows",
    architecture: "x64 · MSVC",
    file: "scarp-0.0.5-alpha.4-x86_64-pc-windows-msvc.zip",
    hash: "6be1c56ec475041c6c7d2658bb807d4903e35d8ac433d95841c47f8812ae6d0f",
  },
  {
    name: "Linux",
    architecture: "x64 · GNU",
    file: "scarp-0.0.5-alpha.4-x86_64-unknown-linux-gnu.tar.gz",
    hash: "b8a3431467a2fa4e5baf253fe421645d2f257e422c80ad2ab059e6c9b180df45",
  },
  {
    name: "macOS",
    architecture: "ARM64 · Apple Silicon",
    file: "scarp-0.0.5-alpha.4-aarch64-apple-darwin.tar.gz",
    hash: "20a0fdc01c2da07db0cde45db02fd63a56b0907a826530e43c39cba750ddc94f",
  },
] as const;

export const publishedDownloadUrl = (file: string) =>
  `${project.repo}/releases/download/${publishedCompiler.tag}/${file}`;
