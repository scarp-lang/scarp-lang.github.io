import test from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import CodeBlock from '../src/components/CodeBlock.tsx';
import { developmentAssets } from '../src/site/context.ts';
import { findPage, outputPath, pages } from '../src/site/pages.ts';
import { renderPage, renderRequest } from '../src/site/render.tsx';

test('every registered page renders a complete, distinct static document', () => {
  assert.equal(pages.length, 16);
  assert.equal(new Set(pages.map(page => page.path)).size, pages.length);
  assert.equal(new Set(pages.map(outputPath)).size, pages.length);
  for (const page of pages) {
    const html = renderPage(page, developmentAssets);
    assert(html.startsWith('<!doctype html>'));
    assert.match(html, /<html lang="en"/);
    assert.match(html, /<main id="main">/);
    assert(html.includes(`href="https://scarp-lang.github.io${page.path}"`));
  }
});

test('directory and index-file aliases resolve to the canonical page', () => {
  for (const path of ['/', '/index.html', '/?source=test']) assert.equal(findPage(path)?.path, '/');
  for (const path of ['/support', '/support/', '/support/index.html', '/support/?source=test']) assert.equal(findPage(path)?.path, '/support/');
  assert.equal(findPage('/news/source-modules/index.html')?.path, '/news/source-modules/');
  assert.equal(findPage('/not-a-page/'), undefined);
});

test('rendered source examples escape markup instead of executing it', () => {
  const html = renderToStaticMarkup(<CodeBlock code={'print("<script>alert(1)</script>");'} />);
  assert(html.includes('&lt;script&gt;'));
  assert(!html.includes('<script>'));
  assert(html.includes('data-copy'));
});

test('support and examples retain usable static content without JavaScript', () => {
  const support = findPage('/support/');
  const home = findPage('/');
  assert(support && home);
  const html = renderPage(support, developmentAssets);
  assert.match(html, /<form[^>]*hidden/);
  assert.match(html, /<noscript>/);
  assert(html.includes('https://github.com/scarp-lang/scarp/issues'));
  assert(html.includes('hi/tooling/troubleshooting'));
  assert(html.includes('for="support-summary"'));
  const examples = renderPage(home, developmentAssets);
  for (const id of ['hello', 'functions', 'numerics']) assert(examples.includes(`id="example-${id}"`));
});

test('data routes and not-found responses remain distinct from normal pages', async () => {
  const missing = await renderRequest('/404.html', developmentAssets);
  assert.equal(missing?.status, 404);
  assert.match(missing?.body ?? '', /name="robots" content="noindex"/);
  assert.equal(await renderRequest('/not-a-page/', developmentAssets), undefined);
  const snapshot = await renderRequest('/project.json', developmentAssets);
  assert.match(snapshot?.contentType ?? '', /application\/json/);
  assert.equal(JSON.parse(snapshot?.body ?? '{}').baseline.status, 'experimental-prerelease');
  const sitemap = await renderRequest('/sitemap.xml', developmentAssets);
  assert(sitemap?.body.includes('<loc>https://scarp-lang.github.io/support/</loc>'));
  assert(!sitemap?.body.includes('/404.html'));
});
