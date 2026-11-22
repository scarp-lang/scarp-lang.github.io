/**
 * Published release snapshot reviewed against the official GitHub release
 * and annotated tag on 22 November 2026. Not an automatically updated feed.
 * The website example baseline remains separately pinned in project.ts.
 */
import { project } from "./project.ts";

const releaseVersion = "0.0.6-alpha.18" as const;
const releaseTag = `v${releaseVersion}` as const;

export const publishedCompiler = {
  version: releaseVersion,
  tag: releaseTag,
  publishedAt: "2026-11-22T14:19:01Z",
  reviewed: "2026-11-22",
  sourceCommit: "84d8de05968a488773e7c5b6eda1376d8957553c",
  release: `${project.repo}/releases/tag/${releaseTag}`,
  status: "experimental-prerelease",
} as const;

export const publishedDownloads = [
  {
    name: "Windows",
    platform: "windows",
    architecture: "x64 · MSVC",
    file: `scarp-${releaseVersion}-x86_64-pc-windows-msvc.zip`,
    hash: "1dbd8e9f6dbb3e727fb765b5a1bf184f8574c8b139289269b65a7d889d60e6b0",
  },
  {
    name: "Linux",
    platform: "linux",
    architecture: "x64 · GNU",
    file: `scarp-${releaseVersion}-x86_64-unknown-linux-gnu.tar.gz`,
    hash: "175fc419b1469e80dbf3cd7ccee273eb573a9113e27467801ef7095c064b289f",
  },
  {
    name: "macOS",
    platform: "macos",
    architecture: "ARM64 · Apple Silicon",
    file: `scarp-${releaseVersion}-aarch64-apple-darwin.tar.gz`,
    hash: "30aed1c56fc666f86dca6c08234d8ac17d9f5ee513a4270d7a65f80544dc2c52",
  },
] as const;

export type PublishedDownload = (typeof publishedDownloads)[number];

export const publishedDownloadUrl = (file: string) =>
  `${project.repo}/releases/download/${publishedCompiler.tag}/${file}`;
