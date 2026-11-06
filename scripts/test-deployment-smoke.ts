import assert from "node:assert/strict";
import test from "node:test";
import { parseDeploymentMarker, probeDeployment, waitForDeployment, repositoryName } from "./deployment-smoke-lib.ts";

const sha = "a".repeat(40);
const tag = "v0.0.6-alpha.1";
const htmlType = { "content-type": "text/html; charset=utf-8" };
const jsonType = { "content-type": "application/json; charset=utf-8" };
function validRoutes(commit: string | null = sha): Record<string, Response> {
  return {
    "/deployment.json": Response.json({ schemaVersion: 1, repository: repositoryName, commit, compilerTag: tag }),
    "/project.json": Response.json({ website: "https://scarp-lang.github.io", latestPublished: { tag } }),
    "/": new Response('<title>Home</title><link href="https://scarp-lang.github.io/" />', { status: 200, headers: htmlType }),
    "/downloads/": new Response('<title>Downloads</title>' + tag, { status: 200, headers: htmlType }),
    "/support/": new Response("<title>Support</title><main>support</main>", { status: 200, headers: htmlType }),
  };
}
function mocked(routes: Record<string, Response>) {
  const seen: string[] = [];
  const fetcher = (async (input: string | URL) => {
    const url = new URL(String(input));
    seen.push(url.pathname);
    return routes[url.pathname]?.clone() ?? new Response("Not found", { status: 404, headers: htmlType });
  }) as typeof fetch;
  return { fetcher, seen };
}
test("deployment marker is a strict, versioned and repository-specific contract", () => {
  assert.equal(parseDeploymentMarker(JSON.parse(JSON.stringify({
    schemaVersion: 1, repository: repositoryName, commit: sha, compilerTag: tag,
  }))).commit, sha);
  for (const value of [
    null,
    { schemaVersion: 2, repository: repositoryName, commit: sha, compilerTag: tag },
    { schemaVersion: 1, repository: "someone/else", commit: sha, compilerTag: tag },
    { schemaVersion: 1, repository: repositoryName, commit: "../x", compilerTag: tag },
    { schemaVersion: 1, repository: repositoryName, commit: sha, compilerTag: "stable" },
  ]) assert.throws(() => parseDeploymentMarker(value), /Invalid deployment marker/);
});
test("successful smoke test checks provenance, snapshot, and three public HTML routes", async () => {
  const { fetcher, seen } = mocked(validRoutes());
  await probeDeployment(sha, tag, { fetcher });
  assert.deepEqual(seen, ["/deployment.json", "/project.json", "/", "/downloads/", "/support/"]);
});
test("stale deployment marker cannot pass even when all pages look healthy", async () => {
  const { fetcher } = mocked(validRoutes("b".repeat(40)));
  await assert.rejects(() => probeDeployment(sha, tag, { fetcher }), /commit mismatch/);
});
test("missing pages, wrong content types and stale release metadata fail", async () => {
  const missing = validRoutes(); delete missing["/support/"];
  await assert.rejects(() => probeDeployment(sha, tag, mocked(missing)), /HTTP 200/);
  const wrongType = validRoutes();
  wrongType["/downloads/"] = new Response("<title>Downloads</title>" + tag, { headers: jsonType });
  await assert.rejects(() => probeDeployment(sha, tag, mocked(wrongType)), /content type/);
  const oldSnapshot = validRoutes();
  oldSnapshot["/project.json"] = Response.json({ website: "https://scarp-lang.github.io", latestPublished: { tag: "v0.0.5-alpha.1" } });
  await assert.rejects(() => probeDeployment(sha, tag, mocked(oldSnapshot)), /snapshot/);
});
test("polling tolerates one stale edge response before succeeding", async () => {
  const stale = mocked(validRoutes("b".repeat(40)));
  const fresh = mocked(validRoutes());
  let calls = 0;
  let sleeps = 0;
  const fetcher = (async (input: string | URL, init?: RequestInit) =>
    (++calls === 1 ? stale.fetcher(input, init) : fresh.fetcher(input, init))) as typeof fetch;
  const attempt = await waitForDeployment(sha, tag, {
    fetcher, attempts: 3, pauseMs: 0, sleep: async () => { sleeps++; },
  });
  assert.equal(attempt, 2);
  assert.equal(sleeps, 1);
});
test("polling never reports success when the CDN continues serving an old commit", async () => {
  let sleeps = 0;
  await assert.rejects(() => waitForDeployment(sha, tag, {
    fetcher: mocked(validRoutes("b".repeat(40))).fetcher,
    attempts: 2, pauseMs: 0, sleep: async () => { sleeps++; },
  }), /failed after 2 attempts/);
  assert.equal(sleeps, 1);
});
