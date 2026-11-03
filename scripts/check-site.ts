import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { runInNewContext } from 'node:vm';

const root = resolve('dist');
async function walk(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? walk(join(directory, entry.name)) : join(directory, entry.name)))).flat();
}
const files = await walk(root);
const pages = files.filter(path => path.endsWith('.html'));
const ids = new Map<string, Set<string>>();
for (const page of pages) {
  const html = await readFile(page, 'utf8');
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
const snapshot: unknown = JSON.parse(await readFile(join(root, 'project.json'), 'utf8'));
assert(isRecord(snapshot), 'Project snapshot must be an object');
const baseline = snapshot.baseline;
assert(isRecord(baseline), 'Project baseline must be an object');
assert.equal(baseline.status, 'experimental-prerelease');
assert(typeof baseline.sourceCommit === 'string', 'Source commit must be a string');
assert.match(baseline.sourceCommit, /^[0-9a-f]{40}$/);
assert(Array.isArray(snapshot.downloads), 'Downloads must be an array');
assert.equal(snapshot.downloads.length, 3);
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
assert.match(await readFile(join(root, 'feed.xml'), 'utf8'), /<rss version="2.0">/);
assert(pages.length >= 18, 'Missing planned website sections, ecosystem, and search');
const searchHtml = await readFile(join(root, 'search/index.html'), 'utf8');
assert.match(searchHtml, /data-search-results/);
assert.match(searchHtml, /data-search-input/);
assert(searchHtml.includes('href="/downloads/"'));
const ecosystemHtml = await readFile(join(root, 'ecosystem/index.html'), 'utf8');
for (const name of ['Scarp compiler', 'Scarp Docs', 'Scarp Playground', 'Scarp by Example', 'Scarp for VS Code']) {
  assert(ecosystemHtml.includes(name), 'Missing ecosystem project: ' + name);
}
assert(ecosystemHtml.includes('2026-11-03'), 'Ecosystem snapshot date is missing');
assert(ecosystemHtml.includes('releases/tag/v0.0.5-alpha.3'), 'Missing published compiler release evidence');

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
