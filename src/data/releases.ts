/**
 * Published release snapshot reviewed against the official GitHub release
 * and annotated tag on 11 November 2026. Not an automatically updated feed.
 * The website example baseline remains separately pinned in project.ts.
 */
import { project } from "./project.ts";

const releaseVersion = "0.0.6-alpha.7" as const;
const releaseTag = `v${releaseVersion}` as const;

export const publishedCompiler = {
  version: releaseVersion,
  tag: releaseTag,
  publishedAt: "2026-11-11T08:33:59Z",
  reviewed: "2026-11-11",
  sourceCommit: "b1c1fd232b418267d95520c69ee563ac99ecae30",
  release: `${project.repo}/releases/tag/${releaseTag}`,
  status: "experimental-prerelease",
} as const;

export const publishedDownloads = [
  {
    name: "Windows",
    platform: "windows",
    architecture: "x64 · MSVC",
    file: `scarp-${releaseVersion}-x86_64-pc-windows-msvc.zip`,
    hash: "e7efe469adf050e84d322c72bb283a0a0822d4a4cd914096a95ac0dd4da07609",
  },
  {
    name: "Linux",
    platform: "linux",
    architecture: "x64 · GNU",
    file: `scarp-${releaseVersion}-x86_64-unknown-linux-gnu.tar.gz`,
    hash: "53d37e19c74003568a53da3a3bce513dd9513ea6608bd30de1cf859f56f61b17",
  },
  {
    name: "macOS",
    platform: "macos",
    architecture: "ARM64 · Apple Silicon",
    file: `scarp-${releaseVersion}-aarch64-apple-darwin.tar.gz`,
    hash: "b146a375460474e1bdb327babf752c932453293a8a96e6c2e3ce4ae09c031aaf",
  },
] as const;

export type PublishedDownload = (typeof publishedDownloads)[number];

export const publishedDownloadUrl = (file: string) =>
  `${project.repo}/releases/download/${publishedCompiler.tag}/${file}`;
