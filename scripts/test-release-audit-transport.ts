import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import { consumeBounded, createReleaseAuditClient, runReleaseAudit, validateCatalogueRows } from "./release-audit-transport.ts";

const encoder = new TextEncoder();
const payload = encoder.encode("scarp test archive");
const digest = createHash("sha256").update(payload).digest("hex");
const asset = { name: "scarp-test.zip", size: payload.length,
  browser_download_url: "https://github.com/scarp-lang/scarp/releases/download/v0.0.7-alpha.4/scarp-test.zip" };
const archive = { file: asset.name, hash: digest };

function stream(chunks: readonly Uint8Array[], headers: Record<string, string> = {}, hold = false) {
  let index = 0;
  let cancelled = false;
  const response = new Response(new ReadableStream<Uint8Array>({
    pull(controller) {
      const chunk = chunks[index++];
      if (chunk) controller.enqueue(chunk);
      else if (!hold) controller.close();
    },
    cancel() { cancelled = true; },
  }, { highWaterMark: 0 }), { headers });
  return { response, cancelled: () => cancelled };
}

function row(i: number, date = "2026-11-27T01:00:00Z") {
  return { tag_name: `v0.0.7-alpha.${i}`, draft: false, published_at: date };
}
function json(value: unknown): Response { return new Response(JSON.stringify(value)); }
function unexpected(): never { throw new Error("Unexpected request"); }

test("stream reader consumes chunks without whole-body buffering", async () => {
  const { response } = stream([payload.slice(0, 4), payload.slice(4)]);
  const seen: Uint8Array[] = [];
  const size = await consumeBounded(response, 32, "fixture", chunk => seen.push(chunk), payload.length);
  assert.equal(size, payload.length);
  assert.deepEqual(Buffer.concat(seen), Buffer.from(payload));
  assert.equal(response.body?.locked, false);
});

test("declared oversize cancels before consuming any bytes", async () => {
  const s = stream([payload], { "content-length": "100" }, true);
  await assert.rejects(consumeBounded(s.response, 32, "fixture", unexpected), /Content-Length exceeds/);
  assert(s.cancelled());
  assert.equal(s.response.body?.locked, false);
});

test("oversized streamed chunk is rejected before consumer receives it", async () => {
  const s = stream([new Uint8Array(3), new Uint8Array(9)], {}, true);
  let total = 0;
  await assert.rejects(consumeBounded(s.response, 8, "fixture", c => { total += c.length; }), /Stream exceeds/);
  assert.equal(total, 3);
  assert(s.cancelled());
});

test("exact reviewed size is enforced even below hard cap", async () => {
  const s = stream([new Uint8Array(9)], {}, true);
  await assert.rejects(consumeBounded(s.response, 32, "fixture", unexpected, 8), /Stream exceeds/);
  assert(s.cancelled());
});

test("truncated response and inconsistent declared sizes fail", async () => {
  await assert.rejects(consumeBounded(stream([new Uint8Array(3)]).response, 8, "fixture", () => {}, 4), /Downloaded size mismatch/);
  const s = stream([new Uint8Array(4)], { "content-length": "3" }, true);
  await assert.rejects(consumeBounded(s.response, 8, "fixture", unexpected, 4), /Content-Length size mismatch/);
  assert(s.cancelled());
});

test("compressed transfer length does not override decoded byte cap", async () => {
  const { response } = stream([payload], { "content-length": "100", "content-encoding": "gzip" });
  assert.equal(await consumeBounded(response, payload.length, "fixture", () => {}, payload.length), payload.length);
});

test("missing response body and invalid length are rejected", async () => {
  await assert.rejects(consumeBounded(new Response(null), 4, "fixture", unexpected), /body missing/);
  const s = stream([], { "content-length": "2.5" }, true);
  await assert.rejects(consumeBounded(s.response, 4, "fixture", unexpected), /Invalid Content-Length/);
  assert(s.cancelled());
});

test("consumer failure cancels the response and unlocks the reader", async () => {
  const s = stream([payload], {}, true);
  await assert.rejects(consumeBounded(s.response, 32, "fixture", unexpected), /Unexpected request/);
  assert(s.cancelled());
  assert.equal(s.response.body?.locked, false);
});

test("archive verification accepts split bytes and rejects same-length tampering", async () => {
  const client = createReleaseAuditClient(async () => stream([payload.slice(0, 3), payload.slice(3)]).response);
  await client.verifyArchive(asset, archive);
  const tampered = payload.slice(); tampered[0] = 0;
  const bad = createReleaseAuditClient(async () => stream([tampered]).response);
  await assert.rejects(bad.verifyArchive(asset, archive), /digest differs/);
});

test("invalid archive URL, digest, name, or metadata fail before fetching", async () => {
  const client = createReleaseAuditClient(async () => unexpected());
  for (const url of ["https://example.com/scarp-test.zip", asset.browser_download_url + "?token=bad",
    asset.browser_download_url.replace("scarp-lang/scarp", "other/scarp"),
    asset.browser_download_url.replace("scarp-test.zip", "other.zip")]) {
    await assert.rejects(client.verifyArchive({ ...asset, browser_download_url: url }, archive), /Unexpected official asset URL/);
  }
  await assert.rejects(client.verifyArchive({ ...asset, size: 64 * 1024 * 1024 + 1 }, archive), /oversized asset metadata/);
  await assert.rejects(client.verifyArchive(asset, { ...archive, hash: "x" }), /Invalid reviewed archive digest/);
  await assert.rejects(client.verifyArchive(asset, { ...archive, file: "other.zip" }), /Archive name mismatch/);
});

test("checksum UTF-8 decoding supports split code points and rejects invalid bytes", async () => {
  const bytes = encoder.encode("é");
  const client = createReleaseAuditClient(async () => stream([bytes.slice(0, 1), bytes.slice(1)]).response);
  assert.equal(await client.checksumText({ ...asset, size: bytes.length }), "é");
  const bad = createReleaseAuditClient(async () => stream([new Uint8Array([0xff])]).response);
  await assert.rejects(bad.checksumText({ ...asset, size: 1 }), /encoded data|UTF-8/i);
  await assert.rejects(client.checksumText({ ...asset, size: 65537 }), /oversized asset metadata/);
});

test("full release pages are followed and share a deadline", async () => {
  const calls: { url: string; signal: AbortSignal | null | undefined }[] = [];
  const first = Array.from({ length: 100 }, (_, i) => row(i));
  const newest = row(100, "2026-11-28T01:00:00Z");
  const client = createReleaseAuditClient(async (input, init) => {
    calls.push({ url: String(input), signal: init?.signal });
    return json(calls.length === 1 ? first : [newest]);
  });
  const rows = await client.releaseCatalogue();
  assert.equal(rows.length, 101);
  assert.deepEqual(rows.at(-1), newest);
  assert(calls[0]?.url.endsWith("page=1"));
  assert(calls[1]?.url.endsWith("page=2"));
  assert.equal(calls[0]?.signal, calls[1]?.signal);
});

test("full catalogue bound fails closed without accepting a partial list", async () => {
  let calls = 0;
  const client = createReleaseAuditClient(async () => {
    const page = calls++;
    return json(Array.from({ length: 100 }, (_, i) => row(page * 100 + i)));
  });
  await assert.rejects(client.releaseCatalogue(), /bounded pagination/);
  assert.equal(calls, 10);
});

test("a failed later page cannot pass based on first page data", async () => {
  let calls = 0;
  const client = createReleaseAuditClient(async () => ++calls === 1
    ? json(Array.from({ length: 100 }, (_, i) => row(i))) : new Response("rate limit", { status: 429 }));
  await assert.rejects(client.releaseCatalogue(), /HTTP 429/);
  assert.equal(calls, 2);
});

test("malformed and oversized catalogue pages are rejected", async () => {
  for (const value of [{ message: "unexpected" }, Array.from({ length: 101 }, (_, i) => row(i)), [null]]) {
    const client = createReleaseAuditClient(async () => json(value));
    await assert.rejects(client.releaseCatalogue(), /Invalid release catalogue/);
  }
  const badJson = createReleaseAuditClient(async () => new Response("not JSON"));
  await assert.rejects(badJson.releaseCatalogue(), SyntaxError);
});

test("published catalogue rejects duplicates, invalid dates and ambiguous newest ties", () => {
  assert.throws(() => validateCatalogueRows([row(1), row(1)]), /Duplicate published release tag/);
  assert.throws(() => validateCatalogueRows([row(1), row(2)]), /Ambiguous newest/);
  for (const date of ["2026-02-30T00:00:00Z", "2026-11-28T25:00:00Z", "yesterday"]) {
    assert.throws(() => validateCatalogueRows([row(1, date)]), /Invalid published release timestamp/);
  }
  assert.throws(() => validateCatalogueRows([{ ...row(1), tag_name: "invalid" }]), /Invalid published release tag/);
  assert.throws(() => validateCatalogueRows([{ ...row(1), draft: true }]), /No published/);
  validateCatalogueRows([row(1), row(2), row(3, "2026-11-28T00:00:00Z"), { draft: true }]);
});

test("API token is isolated from asset requests and API paths are constrained", async () => {
  const calls: RequestInit[] = [];
  const client = createReleaseAuditClient(async (input, init) => {
    assert(init); calls.push(init);
    return String(input).startsWith("https://api.github.com") ? json([row(1)]) : stream([payload]).response;
  }, "fake-test-token");
  await client.releaseCatalogue();
  await client.verifyArchive(asset, archive);
  assert.equal(new Headers(calls[0]?.headers).get("authorization"), "Bearer fake-test-token");
  assert.equal(calls[0]?.redirect, "error");
  assert.equal(new Headers(calls[1]?.headers).get("authorization"), null);
  assert.equal(calls[1]?.credentials, "omit");
  assert.equal(calls[1]?.redirect, "follow");
  await assert.rejects(client.githubJson("/../../other"), /Unexpected GitHub API path/);
  assert.equal(calls.length, 2);
});

test("non-success HTTP responses are cancelled rather than read", async () => {
  let cancelled = false;
  const client = createReleaseAuditClient(async () => new Response(new ReadableStream({
    cancel() { cancelled = true; },
  }), { status: 503 }));
  await assert.rejects(client.releaseCatalogue(), /HTTP 503/);
  assert(cancelled);
});

const snapshot = {
  tag: "v0.0.7-alpha.4", publishedAt: "2026-11-28T02:52:45Z",
  sourceCommit: "e620bdcb512fbe909b08f1b4cc625865e4cdf339",
  release: "https://github.com/scarp-lang/scarp/releases/tag/v0.0.7-alpha.4",
  status: "experimental-prerelease",
};
function completeFixture(fault?: "moved-tag" | "manifest" | "sidecar" | "archive" | "new-release" | "bad-tag-ref") {
  const archives = ["windows.zip", "linux.tar.gz", "macos.tar.gz"].map(file => ({ file, hash: digest }));
  const bodies = new Map<string, Uint8Array>();
  for (const archive of archives) {
    bodies.set(archive.file, payload);
    bodies.set(archive.file + ".sha256", encoder.encode(`${digest}  ${archive.file}\n`));
  }
  bodies.set("SHA256SUMS", encoder.encode(archives.map(a => `${a.hash}  ${a.file}\n`).join("")));
  if (fault === "manifest") bodies.set("SHA256SUMS", encoder.encode("invalid manifest"));
  if (fault === "sidecar") bodies.set("windows.zip.sha256", encoder.encode(`${"0".repeat(64)}  windows.zip\n`));
  if (fault === "archive") bodies.set("windows.zip", new Uint8Array(payload.length));
  const assets = [...bodies].map(([name, body]) => ({ name, size: body.length,
    browser_download_url: `https://github.com/scarp-lang/scarp/releases/download/${snapshot.tag}/${name}` }));
  const requests: string[] = [];
  const client = createReleaseAuditClient(async input => {
    const url = String(input); requests.push(url);
    if (url.includes("/releases?")) return json([
      { ...row(4, snapshot.publishedAt), html_url: snapshot.release, prerelease: true, assets },
      ...(fault === "new-release" ? [row(5, "2026-11-29T00:00:00Z")] : []),
    ]);
    if (url.includes("/git/ref/tags/")) return json({ object: { type: "tag", sha: fault === "bad-tag-ref" ? "invalid" : "a".repeat(40) } });
    if (url.includes("/git/tags/")) return json({ object: { type: "commit", sha: fault === "moved-tag" ? "b".repeat(40) : snapshot.sourceCommit } });
    const body = bodies.get(url.split("/").at(-1) ?? "");
    assert(body, "Unexpected fixture asset");
    return stream([body.slice(0, 3), body.slice(3)]).response;
  });
  return { client, archives, requests };
}

test("complete release audit validates tag, manifest, all sidecars and archive streams in order", async () => {
  const { client, archives, requests } = completeFixture();
  const verified: string[] = [];
  await runReleaseAudit(client, snapshot, archives, name => verified.push(name));
  assert.deepEqual(verified, archives.map(a => a.file));
  assert.equal(requests.length, 10);
  assert(requests[3]?.endsWith("/SHA256SUMS"));
  assert(requests[4]?.endsWith("/windows.zip.sha256"));
  assert(requests[5]?.endsWith("/windows.zip"));
});

for (const [fault, expected] of [
  ["moved-tag", /no longer resolves/], ["manifest", /Malformed checksum/],
  ["sidecar", /Sidecar checksum mismatch/], ["archive", /digest differs/],
  ["new-release", /Published release changed/], ["bad-tag-ref", /Invalid annotated tag ref SHA/],
] as const) {
  test(`complete release audit fails closed on ${fault}`, async () => {
    const { client, archives, requests } = completeFixture(fault);
    const verified: string[] = [];
    await assert.rejects(runReleaseAudit(client, snapshot, archives, name => verified.push(name)), expected);
    assert.deepEqual(verified, []);
    assert(!requests.some(url => url.endsWith("/macos.tar.gz")));
  });
}
