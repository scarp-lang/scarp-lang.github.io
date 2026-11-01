import { project, downloads, verification } from '../data/project';
export const GET = () => Response.json({
  schemaVersion: 1,
  name: 'Scarp Programming Language',
  website: project.origin,
  docs: project.docs,
  repository: project.repo,
  reviewed: project.reviewed,
  baseline: { version: project.version, tag: project.tag, sourceCommit: project.source, release: project.release, status: 'experimental-prerelease', execution: 'interpreter' },
  evidence: { sourceCommit: project.evidenceSource, verification },
  downloads,
  policy: 'Reviewed snapshot. Not a live development feed. No stable release or future date is implied.',
});
