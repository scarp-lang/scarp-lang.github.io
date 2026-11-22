import assert from "node:assert/strict";
import test from "node:test";
import { developmentAssets } from "../src/site/context.ts";
import { findPage } from "../src/site/pages.ts";
import { renderPage } from "../src/site/render.tsx";
import {
  fetchLatestDownload, githubReleasesUrl, isLatestPlatform,
  latestDownloadPlatforms, releasesApiUrl, selectLatestDownload,
} from "../src/data/latest-download.ts";
import { publishedDownloads, publishedCompiler, publishedDownloadUrl } from "../src/data/releases.ts";

const tag = "v0.0.6-alpha.18";
const published = (name: string, date: string, assets: unknown[]) =>
  ({ tag_name: name, published_at: date, draft: false, prerelease: true, assets });
const urlFor = (name: string, file: string) =>
  `https://github.com/scarp-lang/scarp/releases/download/${name}/${file}`;
const asset = (platform: keyof typeof latestDownloadPlatforms, name = tag) => {
  const file = `scarp-${name.slice(1)}-${latestDownloadPlatforms[platform].suffix}`;
  return { name: file, browser_download_url: urlFor(name, file), state: "uploaded", size: 12345 };
};
const newer = published(tag, "2026-11-22T12:00:00Z",
  [asset("windows"), asset("linux"), asset("macos")]);
const olderTag = "v0.0.6-alpha.17";
const older = published(olderTag, "2026-11-21T03:44:23Z",
  [asset("windows", olderTag), asset("linux", olderTag), asset("macos", olderTag)]);

test("stable permanent routes are valid, noindex pages with explicit reviewed fallbacks", () => {
  assert.deepEqual(Object.keys(latestDownloadPlatforms), ["windows", "linux", "macos"]);
  for (const platform of Object.keys(latestDownloadPlatforms) as Array<keyof typeof latestDownloadPlatforms>) {
    const path = `/downloads/${platform}/latest`;
    const page = findPage(path);
    assert(page, path);
    assert.equal(page.noindex, true);
    const html = renderPage(page, developmentAssets);
    const fallback = publishedDownloads.find(item => item.platform === platform);
    assert(fallback);
    assert(html.includes(`data-latest-download="${platform}"`));
    assert(html.includes(`href="${publishedDownloadUrl(fallback.file)}"`));
    assert(html.includes(publishedCompiler.tag));
    assert(html.includes('name="robots" content="noindex"'));
    assert(html.includes('data-latest-status'));
  }
  assert.equal(isLatestPlatform("macos"), true);
  assert.equal(isLatestPlatform("freebsd"), false);
  assert.equal(isLatestPlatform("__proto__"), false);
});

test("select newest published prerelease by publication timestamp, not API array order", () => {
  const releases = [older, newer];
  for (const platform of Object.keys(latestDownloadPlatforms) as Array<keyof typeof latestDownloadPlatforms>) {
    const selected = selectLatestDownload(releases, platform);
    assert.equal(selected.kind, "ready");
    if (selected.kind === "ready") {
      assert.equal(selected.tag, tag);
      assert.equal(selected.url, asset(platform).browser_download_url);
      assert.equal(selected.releaseUrl, `${githubReleasesUrl}/tag/${tag}`);
    }
  }
});

test("latest missing architecture must not silently download an older release", () => {
  assert.deepEqual(selectLatestDownload([
    published(tag, "2026-11-22T12:00:00Z", [asset("windows")]), older,
  ], "linux"), {
    kind: "missing", tag, releaseUrl: `${githubReleasesUrl}/tag/${tag}`,
  });
});

test("ignore drafts, unsupported names, malformed assets, forged URLs and fake prereleases", () => {
  const malicious = [
    published("v0.0.7-alpha.19", "2026-11-24T12:00:00Z", [
      { ...asset("windows"), browser_download_url: "https://example.org/file.zip" },
    ]),
    { ...published("v0.0.7-alpha.20", "2026-11-25T12:00:00Z", [asset("windows")]), draft: true },
    { ...published("../download", "2026-11-26T12:00:00Z", [asset("windows")]) },
  ];
  assert.deepEqual(selectLatestDownload([...malicious, older], "windows"), {
    kind: "missing", tag: "v0.0.7-alpha.19",
    releaseUrl: `${githubReleasesUrl}/tag/v0.0.7-alpha.19`,
  });
  assert.deepEqual(selectLatestDownload([], "linux"), { kind: "none" });
  assert.throws(() => selectLatestDownload({ message: "API rate limit" }, "linux"), /not an array/);
});

test("API failures and malformed responses do not return a download URL", async () => {
  const errorFetcher = (async () => new Response("rate limit", { status: 403 })) as typeof fetch;
  await assert.rejects(() => fetchLatestDownload("windows", errorFetcher), /HTTP 403/);
  const invalidFetcher = (async () => Response.json({ message: "bad data" })) as typeof fetch;
  await assert.rejects(() => fetchLatestDownload("linux", invalidFetcher), /not an array/);
  const fetcher = (async (input: RequestInfo | URL, init?: RequestInit) => {
    assert.equal(String(input), releasesApiUrl);
    assert.equal(init?.cache, "no-store");
    return Response.json([older, newer]);
  }) as typeof fetch;
  const success = await fetchLatestDownload("macos", fetcher);
  assert.equal(success.kind, "ready");
});
