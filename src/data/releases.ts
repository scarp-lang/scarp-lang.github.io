/**
 * Published release snapshot reviewed against the official GitHub release
 * and annotated tag on 17 November 2026. Not an automatically updated feed.
 * The website example baseline remains separately pinned in project.ts.
 */
import { project } from "./project.ts";

const releaseVersion = "0.0.6-alpha.14" as const;
const releaseTag = `v${releaseVersion}` as const;

export const publishedCompiler = {
  version: releaseVersion,
  tag: releaseTag,
  publishedAt: "2026-11-18T12:43:31Z",
  reviewed: "2026-11-18",
  sourceCommit: "43627b74af5fccccc5e233e98207413983ebafc1",
  release: `${project.repo}/releases/tag/${releaseTag}`,
  status: "experimental-prerelease",
} as const;

export const publishedDownloads = [
  {
    name: "Windows",
    platform: "windows",
    architecture: "x64 · MSVC",
    file: `scarp-${releaseVersion}-x86_64-pc-windows-msvc.zip`,
    hash: "d6c523ba4a5bef283a6ce8065ecb05262d07d90e0cb8c8414a3edfa84ee72138",
  },
  {
    name: "Linux",
    platform: "linux",
    architecture: "x64 · GNU",
    file: `scarp-${releaseVersion}-x86_64-unknown-linux-gnu.tar.gz`,
    hash: "a13595b6ce7c6fbdc487626c3fd02e3ac0d6cc9f56104c917bc8ef11b5b86062",
  },
  {
    name: "macOS",
    platform: "macos",
    architecture: "ARM64 · Apple Silicon",
    file: `scarp-${releaseVersion}-aarch64-apple-darwin.tar.gz`,
    hash: "298f5aaa5cf0c250ecbd43c4bf1cdf06f8bdbdbc4c9e94677a8f81cc63cdccaf",
  },
] as const;

export type PublishedDownload = (typeof publishedDownloads)[number];

export const publishedDownloadUrl = (file: string) =>
  `${project.repo}/releases/download/${publishedCompiler.tag}/${file}`;
