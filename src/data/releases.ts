/**
 * Published release snapshot reviewed against the official GitHub release
 * and annotated tag on 7 November 2026. Not an automatically updated feed.
 * The website example baseline remains separately pinned in project.ts.
 */
import { project } from "./project.ts";

const releaseVersion = "0.0.6-alpha.3" as const;
const releaseTag = `v${releaseVersion}` as const;

export const publishedCompiler = {
  version: releaseVersion,
  tag: releaseTag,
  publishedAt: "2026-11-07T12:23:26Z",
  reviewed: "2026-11-07",
  sourceCommit: "ceff07d9014f466974e0c9e02fc5d23573f55777",
  release: `${project.repo}/releases/tag/${releaseTag}`,
  status: "experimental-prerelease",
} as const;

export const publishedDownloads = [
  {
    name: "Windows",
    platform: "windows",
    architecture: "x64 · MSVC",
    file: `scarp-${releaseVersion}-x86_64-pc-windows-msvc.zip`,
    hash: "74721b3848a6148d817404d529d3f0aad43c6c9d228ae4c019d0a4353391db53",
  },
  {
    name: "Linux",
    platform: "linux",
    architecture: "x64 · GNU",
    file: `scarp-${releaseVersion}-x86_64-unknown-linux-gnu.tar.gz`,
    hash: "b4b59e134cb21b0d48a529ea0bd12fc460c273a8e5e238645c719fec1723996a",
  },
  {
    name: "macOS",
    platform: "macos",
    architecture: "ARM64 · Apple Silicon",
    file: `scarp-${releaseVersion}-aarch64-apple-darwin.tar.gz`,
    hash: "4f655133a6d7c91c28aa0df433119bb9abc45f14df023d15d7eafd5988000a16",
  },
] as const;

export type PublishedDownload = (typeof publishedDownloads)[number];

export const publishedDownloadUrl = (file: string) =>
  `${project.repo}/releases/download/${publishedCompiler.tag}/${file}`;
