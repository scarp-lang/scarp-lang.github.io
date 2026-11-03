import { project, downloads, verification } from "../data/project.ts";
import { publishedCompiler, publishedDownloads } from "../data/releases.ts";
import { exampleCompatibility } from "../data/compatibility.ts";

export const GET = () => Response.json({
  schemaVersion: 1,
  name: "Scarp Programming Language",
  website: project.origin,
  docs: project.docs,
  repository: project.repo,
  reviewed: project.reviewed,
  baseline: {
    version: project.version,
    tag: project.tag,
    sourceCommit: project.source,
    release: project.release,
    status: "experimental-prerelease",
    execution: "interpreter",
  },
  evidence: { sourceCommit: project.evidenceSource, verification },
  // Preserve previous v1 fields for existing consumers; these checksums belong to alpha.1.
  downloads,
  latestPublished: {
    ...publishedCompiler,
    execution: "interpreter",
  },
  latestDownloads: publishedDownloads,
  exampleCompatibility,
  policy: "Reviewed snapshots, not a live feed. The pinned website example baseline differs from the latest published prerelease; no stable release is implied.",
});
