import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { runInNewContext } from 'node:vm';
import { project } from '../src/data/project.ts';
import { publishedCompiler } from '../src/data/releases.ts';
import { accessibilityProblems } from './accessibility-contracts.ts';

const root = resolve('dist');
async function walk(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? walk(join(directory, entry.name)) : join(directory, entry.name)))).flat();
}
const files = await walk(root);
assert(files.includes(join(root, '.nojekyll')), 'Missing GitHub Pages .nojekyll marker in the static build');
const pages = files.filter(path => path.endsWith('.html'));
const logoWebp = await readFile(join(root, 'brand/scarp-logo.webp'));
assert(logoWebp.length > 1024 && logoWebp.length <= 32 * 1024,
  `Optimized display logo must be <= 32 KiB, found ${logoWebp.length} bytes`);
assert.equal(logoWebp.toString('ascii', 0, 4), 'RIFF', 'Logo must have RIFF signature');
assert.equal(logoWebp.toString('ascii', 8, 12), 'WEBP', 'Logo must be genuine WebP');
const favicon = await readFile(join(root, 'brand/scarp-favicon.png'));
assert(favicon.length > 200 && favicon.length <= 16 * 1024,
  `PNG favicon exceeds budget: ${favicon.length} bytes`);
assert.equal(favicon.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
assert.equal(favicon.readUInt32BE(16), 64, 'PNG favicon width must be 64 pixels');
assert.equal(favicon.readUInt32BE(20), 64, 'PNG favicon height must be 64 pixels');
const faviconIco = await readFile(join(root, 'favicon.ico'));
assert(faviconIco.length > 200 && faviconIco.length <= 24 * 1024,
  `ICO favicon exceeds budget: ${faviconIco.length} bytes`);
assert.equal(faviconIco.subarray(0, 4).toString('hex'), '00000100', 'Invalid ICO signature');


/* Guard generated JavaScript/CSS bundle sizes; not a Core Web Vitals claim. */
for (const file of files.filter(path => /\/assets\/[^/]+\.(?:js|css)$/.test(path))) {
  const bytes = (await stat(file)).size;
  assert(bytes <= 128 * 1024, `Oversized frontend asset (${bytes} bytes): ${file}`);
}

const ids = new Map<string, Set<string>>();
for (const page of pages) {
  const html = await readFile(page, 'utf8');
  assert.deepEqual(accessibilityProblems(html), [], `Accessibility contract failed for ${page}`);
  assert.match(html, /src="\/brand\/scarp-logo\.webp"/, `Optimized logo missing from ${page}`);
  assert.match(html, /rel="icon" type="image\/png" sizes="64x64" href="\/brand\/scarp-favicon\.png"/,
    `Compact favicon missing from ${page}`);

  assert(!/<img\\b[^>]*src="\/brand\/scarp-logo\.png"/.test(html),
    `Unoptimized logo still displayed on ${page}`);

  const allIds = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => {
    assert(match[1] !== undefined);
    return match[1];
  });
  assert.equal(new Set(allIds).size, allIds.length, `Duplicate IDs in ${page}`);
  ids.set(page, new Set(allIds));
  assert.match(html, /<title>[^<]+<\/title>/, `Missing title: ${page}`);
  assert.match(html, /name="description"/, `Missing description: ${page}`);
  assert.match(html, /rel="canonical" href="https:\/\/scarp-lang.github.io\//, `Missing canonical: ${page}`);
  assert.match(html, /<html lang="en"/, `Missing language: ${page}`);
  assert.match(html, /id="main"/, `Missing skip target: ${page}`);
}
let links = 0;
for (const page of pages) {
  const html = await readFile(page, 'utf8');
  for (const [, attribute, raw] of html.matchAll(/\b(href|src)="([^"]*)"/g)) {
    if (!raw || /^(https?:|mailto:|data:|\/\/)/.test(raw)) continue;
    const url = new URL(raw.replaceAll('&amp;', '&'), `https://scarp-lang.github.io/${page.slice(root.length + 1)}`);
    let path = resolve(root, '.' + decodeURIComponent(url.pathname));
    assert(path.startsWith(root + '/') || path === root, `Escaping URL: ${raw}`);
    const info = await stat(path).catch(() => assert.fail(`Broken ${attribute} ${raw} in ${page}`));
    if (info.isDirectory()) path = join(path, 'index.html');
    await stat(path);
    if (url.hash && path.endsWith('.html')) assert(ids.get(path)?.has(decodeURIComponent(url.hash.slice(1))), `Missing fragment ${raw} in ${page}`);
    links++;
  }
}
function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
const deployment: unknown = JSON.parse(await readFile(join(root, 'deployment.json'), 'utf8'));
assert(isRecord(deployment), 'Missing machine-readable deployment marker');
assert.equal(deployment.schemaVersion, 1);
assert.equal(deployment.repository, 'scarp-lang/scarp-lang.github.io');
assert.equal(deployment.commit, process.env.GITHUB_SHA ?? null);
assert.equal(deployment.compilerTag, publishedCompiler.tag);
const snapshot: unknown = JSON.parse(await readFile(join(root, 'project.json'), 'utf8'));
assert(isRecord(snapshot), 'Project snapshot must be an object');
const baseline = snapshot.baseline;
assert(isRecord(baseline), 'Project baseline must be an object');
assert.equal(baseline.status, 'experimental-prerelease');
assert(typeof baseline.sourceCommit === 'string', 'Source commit must be a string');
assert.match(baseline.sourceCommit, /^[0-9a-f]{40}$/);
assert(Array.isArray(snapshot.downloads), 'Downloads must be an array');
assert.equal(snapshot.downloads.length, 3);
const published: unknown = snapshot.latestPublished;
assert(isRecord(published), "Missing latest separately reviewed public release");
assert.equal(published.tag, publishedCompiler.tag);
assert.equal(published.sourceCommit, publishedCompiler.sourceCommit);
assert.equal(published.status, "experimental-prerelease");
const latestAssets: unknown = snapshot.latestDownloads;
assert(Array.isArray(latestAssets) && latestAssets.length === 3, "Published release must carry three archives");
const releaseHtml = await readFile(join(root, "releases/index.html"), "utf8");
const downloadsHtml = await readFile(join(root, "downloads/index.html"), "utf8");
for (const html of [releaseHtml, downloadsHtml]) {
  assert(html.includes(publishedCompiler.tag), "Newest release absent");
  assert(html.includes(project.tag), "Pinned example baseline absent");
}
for (const item of latestAssets) {
  assert(isRecord(item) && typeof item.file === "string" && typeof item.hash === "string");
  assert.match(item.hash, /^[0-9a-f]{64}$/);
  assert(downloadsHtml.includes(item.file), "Missing public release asset link");
  assert(downloadsHtml.includes(item.hash), "Missing public release archive digest");
}
assert(downloadsHtml.includes("create hello-world"));
assert(downloadsHtml.includes("launch hello-world"));

const downloads: unknown[] = snapshot.downloads;
for (const item of downloads) {
  assert(isRecord(item) && typeof item.hash === 'string', 'Download checksum must be a string');
  assert.match(item.hash, /^[0-9a-f]{64}$/);
}
const sitemap = await readFile(join(root, 'sitemap.xml'), 'utf8');
for (const page of pages.filter(path => !path.endsWith('/404.html'))) {
  const route = page.slice(root.length).replace(/index\.html$/, '');
  assert(sitemap.includes(`<loc>https://scarp-lang.github.io${route}</loc>`), `Sitemap missing ${route}`);
}
assert(!sitemap.includes('/404'), '404 must not be indexed');
const feedXml = await readFile(join(root, 'feed.xml'), 'utf8');
assert.match(feedXml, /<rss version="2.0">/);
assert(feedXml.includes('<link>https://scarp-lang.github.io/news/offline-projects/</link>'), 'RSS missing historical alpha.4 announcement');
assert(feedXml.includes('<link>https://scarp-lang.github.io/news/alpha5-project-inspection/</link>'), 'RSS missing historical alpha.5 release');
assert(feedXml.includes('<link>https://scarp-lang.github.io/news/alpha6-symbol-navigation/</link>'), 'RSS missing published alpha.6 release');
const alpha5News = await readFile(join(root, 'news/alpha5-project-inspection/index.html'), 'utf8');
for (const token of ['v0.0.5-alpha.5', '2eeed0aa52ccb59523307841ad8ffbd83f8911a8', '4 November 2026', 'C11', 'scarp compile']) {
  assert(alpha5News.includes(token), 'Historical alpha.5 release article missing ' + token);
}
const alpha6News = await readFile(join(root, 'news/alpha6-symbol-navigation/index.html'), 'utf8');
for (const token of ['v0.0.6-alpha.1', 'aa329a22cf2bf92d2c9814a26ff9c8b67a72e6e8', '5 November 2026', 'rms', 'inspect symbols', 'inspect references']) {
  assert(alpha6News.includes(token), 'Historical alpha.6.1 article missing ' + token);
}
const priorCacheNews = await readFile(join(root, 'news/alpha6-cache-apis/index.html'), 'utf8');
for (const token of ['v0.0.6-alpha.2', '398b8ff705154a02423fe458ce3a427401e81e31', '6 November 2026', 'syntax', 'semantic', 'invalidation', 'eviction']) {
  assert(priorCacheNews.includes(token), 'Historical alpha.6.2 article missing ' + token);
}
assert(feedXml.includes('<link>https://scarp-lang.github.io/news/alpha6-cache-apis/</link>'), 'RSS missing historical alpha.6.2 release');
const latestNews = await readFile(join(root, 'news/alpha6-ranking-temperature/index.html'), 'utf8');
for (const token of ['v0.0.6-alpha.3', 'ceff07d9014f466974e0c9e02fc5d23573f55777', '7 November 2026', 'topk_values', 'softmax_temp', 'logsoftmax_temp', 'scalar']) {
  assert(latestNews.includes(token), 'Historical alpha.6.3 article missing ' + token);
}
assert(feedXml.includes('<link>https://scarp-lang.github.io/news/alpha6-ranking-temperature/</link>'), 'RSS missing historical alpha.6.3 release');
const alpha65News = await readFile(join(root, 'news/alpha6-nucleus-correlation/index.html'), 'utf8');
for (const token of ['v0.0.6-alpha.5', '205e92f166f186c3905e5880d41c31717b697b8e', '9 November 2026', 'top_p_values', 'pearson_correlation', 'ELF64']) {
  assert(alpha65News.includes(token), 'Alpha.6.5 article missing ' + token);
}
assert(feedXml.includes('<link>https://scarp-lang.github.io/news/alpha6-nucleus-correlation/</link>'), 'RSS missing alpha.6.5 release');
const alpha4News = await readFile(join(root, 'news/offline-projects/index.html'), 'utf8');
assert(alpha4News.includes('v0.0.5-alpha.4'), 'Alpha.4 news page missing');
assert(alpha4News.includes('3 November 2026'), 'Article publication date missing');
for (const newsView of ['index.html', 'news/index.html']) {
  const newsHtml = await readFile(join(root, newsView), 'utf8');
  assert(newsHtml.includes('href="/news/offline-projects/"'), 'News listing missing from ' + newsView);
  assert(newsHtml.includes('3 November 2026'), 'Historical news date changed in ' + newsView);
  assert(newsHtml.includes('href="/news/alpha5-project-inspection/"'), 'Historical alpha.5 release absent from ' + newsView);
  assert(newsHtml.includes('4 November 2026'), 'Alpha.5 historical date is missing in ' + newsView);
  assert(newsHtml.includes('href="/news/alpha6-symbol-navigation/"'), 'Historical alpha.6.1 release absent from ' + newsView);
  assert(newsHtml.includes('5 November 2026'), 'Alpha.6.1 historical date is missing in ' + newsView);
  assert(newsHtml.includes('href="/news/alpha6-cache-apis/"'), 'Historical alpha.6.2 release absent from ' + newsView);
  assert(newsHtml.includes('6 November 2026'), 'Historical alpha.6.2 date missing in ' + newsView);
  assert(newsHtml.includes('href="/news/alpha6-ranking-temperature/"'), 'Latest alpha.6.3 release absent from ' + newsView);
  assert(newsHtml.includes('7 November 2026'), 'Latest release date missing in ' + newsView);
}
assert(pages.length >= 25, 'Missing alpha.6.3 or historical release articles and website pages');
const searchHtml = await readFile(join(root, 'search/index.html'), 'utf8');
assert.match(searchHtml, /data-search-results/);
assert.match(searchHtml, /data-search-input/);
assert(searchHtml.includes('href="/downloads/"'));
const ecosystemHtml = await readFile(join(root, 'ecosystem/index.html'), 'utf8');
for (const name of ['Scarp compiler', 'Scarp Docs', 'Scarp Playground', 'Scarp by Example', 'Scarp for VS Code']) {
  assert(ecosystemHtml.includes(name), 'Missing ecosystem project: ' + name);
}
assert(ecosystemHtml.includes(publishedCompiler.reviewed), 'Ecosystem snapshot date is missing');
assert(ecosystemHtml.includes(publishedCompiler.release), 'Missing latest published compiler release evidence');
const compatibilityHtml = await readFile(join(root, 'compatibility/index.html'), 'utf8');
for (const token of ['functions.srp', 'hello.srp', 'numerics.srp', project.tag,
  publishedCompiler.tag, 'static-only', 'scarp exec hello.srp', 'scarp verify hello.srp']) {
  assert(compatibilityHtml.includes(token), 'Compatibility page missing ' + token);
}
const compatibility: unknown = snapshot.exampleCompatibility;
assert(isRecord(compatibility), 'Missing machine-readable example compatibility');
assert(Array.isArray(compatibility.fixtureNames) && compatibility.fixtureNames.length === 3);
assert(Array.isArray(compatibility.versions) && compatibility.versions.length === 2);
assert(Array.isArray(compatibility.publishedOnlyFixtureNames) && compatibility.publishedOnlyFixtureNames.includes('rms.srp'), 'Missing published-only RMS fixture');
assert(searchHtml.includes('href="/compatibility/"'), 'Compatibility guide absent from the search directory');
assert(searchHtml.includes('href="/migration/"'), 'Migration guide absent from the search directory');
const migrationHtml = await readFile(join(root, 'migration/index.html'), 'utf8');
for (const command of ['scarp check hello.srp', 'scarp verify hello.srp',
  'scarp exec hello.srp', 'scarp create hello-world', 'scarp launch hello-world']) {
  assert(migrationHtml.includes(command), 'Migration guide missing command: ' + command);
}
for (const evidence of ['v0.0.5-alpha.1', 'v0.0.5-alpha.2', 'v0.0.5-alpha.3',
  'v0.0.5-alpha.4', 'v0.0.5-alpha.5', 'v0.0.6-alpha.1', publishedCompiler.tag, publishedCompiler.sourceCommit]) {
  assert(migrationHtml.includes(evidence), 'Missing released version evidence: ' + evidence);
}
assert(migrationHtml.includes('Not equivalent'), 'Misleading check/verify migration guidance');
const learnHtml = await readFile(join(root, 'learn/index.html'), 'utf8');
for (const command of ['scarp version', 'scarp verify hello.srp', 'scarp exec hello.srp',
  'scarp run hello.srp', 'scarp check hello.srp', 'scarp inspect symbols --json hello.srp']) {
  assert(learnHtml.includes(command), 'Getting started missing version-specific command: ' + command);
}

// Exercise the actual compiled head script, including the storage-blocked case.
const representativePage = pages[0];
assert(representativePage, 'At least one generated page is required');
const representativeHtml = await readFile(representativePage, 'utf8');
const bootstrap = representativeHtml.match(/<script\b[^>]*\bid="scarp-theme"[^>]*>([\s\S]*?)<\/script>/)?.[1];
assert(bootstrap, 'Missing early theme initializer');
const themeCases: Array<{ stored: string | null; systemDark: boolean; blocked?: boolean; expected: string }> = [
  { stored: 'light', systemDark: true, expected: 'light' },
  { stored: 'dark', systemDark: false, expected: 'dark' },
  { stored: null, systemDark: true, expected: 'dark' },
  { stored: null, systemDark: false, expected: 'light' },
  { stored: 'invalid', systemDark: true, expected: 'dark' },
  { stored: null, systemDark: true, blocked: true, expected: 'dark' },
];
for (const scenario of themeCases) {
  const rootElement: { dataset: { theme?: string } } = { dataset: {} };
  runInNewContext(bootstrap, {
    document: { documentElement: rootElement },
    localStorage: { getItem: () => {
      if (scenario.blocked) throw new Error('Storage unavailable');
      return scenario.stored;
    } },
    matchMedia: () => ({ matches: scenario.systemDark }),
  }, { timeout: 1000 });
  assert.equal(rootElement.dataset.theme, scenario.expected, 'Compiled theme bootstrap chose the wrong theme');
}
console.log(`Validated ${pages.length} HTML pages, ${links} local links/assets, snapshot, sitemap, and RSS.`);
console.log(`Validated ${themeCases.length} early-theme scenarios from the generated JavaScript.`);
