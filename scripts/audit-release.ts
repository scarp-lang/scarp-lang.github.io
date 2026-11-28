import { publishedCompiler, publishedDownloads } from "../src/data/releases.ts";
import { createReleaseAuditClient, runReleaseAudit } from "./release-audit-transport.ts";

const client = createReleaseAuditClient(fetch, process.env.GITHUB_TOKEN);
await runReleaseAudit(client, publishedCompiler, publishedDownloads,
  name => console.log("Verified archive SHA-256: " + name));
console.log("Release audit passed: " + publishedCompiler.tag +
  " · tag commit " + publishedCompiler.sourceCommit + " · 3 archives + sidecars + SHA256SUMS.");
