import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const root = resolve('dist');
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? walk(join(directory, entry.name)) : join(directory, entry.name)))).flat();
}
const files = await walk(root);
const pages = files.filter(path => path.endsWith('.html'));
const ids = new Map();
for (const page of pages) {
  const html = await readFile(page, 'utf8');
  const allIds = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
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
    let info;
    try { info = await stat(path); } catch { assert.fail(`Broken ${attribute} ${raw} in ${page}`); }
    if (info.isDirectory()) path = join(path, 'index.html');
    await stat(path);
    if (url.hash && path.endsWith('.html')) assert(ids.get(path)?.has(decodeURIComponent(url.hash.slice(1))), `Missing fragment ${raw} in ${page}`);
    links++;
  }
}
const snapshot = JSON.parse(await readFile(join(root, 'project.json'), 'utf8'));
assert.equal(snapshot.baseline.status, 'experimental-prerelease');
assert.match(snapshot.baseline.sourceCommit, /^[0-9a-f]{40}$/);
assert.equal(snapshot.downloads.length, 3);
for (const item of snapshot.downloads) assert.match(item.hash, /^[0-9a-f]{64}$/);
const sitemap = await readFile(join(root, 'sitemap.xml'), 'utf8');
for (const page of pages.filter(path => !path.endsWith('/404.html'))) {
  const route = page.slice(root.length).replace(/index\.html$/, '');
  assert(sitemap.includes(`<loc>https://scarp-lang.github.io${route}</loc>`), `Sitemap missing ${route}`);
}
assert(!sitemap.includes('/404'), '404 must not be indexed');
assert.match(await readFile(join(root, 'feed.xml'), 'utf8'), /<rss version="2.0">/);
assert(pages.length >= 15, 'Missing planned website sections');
console.log(`Validated ${pages.length} HTML pages, ${links} local links/assets, snapshot, sitemap, and RSS.`);
