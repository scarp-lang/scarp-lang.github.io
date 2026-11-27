/**
 * Published release snapshot reviewed against the official GitHub release
 * and tag on 27 November 2026. Not an automatically updated feed.
 * The website example baseline remains separately pinned in project.ts.
 */
import { project } from "./project.ts";

const releaseVersion = "0.0.7-alpha.3" as const;
const releaseTag = `v${releaseVersion}` as const;

export const publishedCompiler = {
  version: releaseVersion,
  tag: releaseTag,
  publishedAt: "2026-11-27T12:32:43Z",
  reviewed: "2026-11-27",
  sourceCommit: "44a3bb0a91e67570e46ce058a3f6211f8e5db0f5",
  release: `${project.repo}/releases/tag/${releaseTag}`,
  status: "experimental-prerelease",
} as const;

export const publishedDownloads = [
  {
    name: "Windows",
    platform: "windows",
    architecture: "x64 · MSVC",
    file: `scarp-${releaseVersion}-x86_64-pc-windows-msvc.zip`,
    hash: "b92da1ab3f2c0e57daee46b494c66f67165843e8b4040aad02262062a2bbe310",
  },
  {
    name: "Linux",
    platform: "linux",
    architecture: "x64 · GNU",
    file: `scarp-${releaseVersion}-x86_64-unknown-linux-gnu.tar.gz`,
    hash: "61de8af415f9e9650c3d6865f1821eba799a6fab45e8ff57bc5f4a115f82b989",
  },
  {
    name: "macOS",
    platform: "macos",
    architecture: "ARM64 · Apple Silicon",
    file: `scarp-${releaseVersion}-aarch64-apple-darwin.tar.gz`,
    hash: "7bc234c84b7d21ff359ff2440d5bd179b8c2c3a5105c7cd2e2af7faceb1b2e4e",
  },
] as const;

export type PublishedDownload = (typeof publishedDownloads)[number];

export const publishedDownloadUrl = (file: string) =>
  `${project.repo}/releases/download/${publishedCompiler.tag}/${file}`;
