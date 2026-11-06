import test from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import CodeBlock from '../src/components/CodeBlock.tsx';
import { developmentAssets } from '../src/site/context.ts';
import { findPage, outputPath, pages } from '../src/site/pages.ts';
import { renderPage, renderRequest } from '../src/site/render.tsx';
import { searchEntries } from '../src/data/search.ts';
import { ecosystemProjects, ecosystemReviewedOn } from '../src/data/ecosystem.ts';
import { publishedCompiler, publishedDownloads, publishedDownloadUrl } from '../src/data/releases.ts';
import { news, project } from '../src/data/project.ts';
import { formatNewsDate } from '../src/lib/date.ts';
import { exampleCompatibility } from '../src/data/compatibility.ts';
import { cliMilestones, cliMigrations, migrationEvidence } from '../src/data/migration.ts';

test('every registered page renders a complete, distinct static document', () => {
  assert.equal(pages.length, 23);
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

test('mobile navigation has disclosure semantics and works as static links without JavaScript', () => {
  for (const route of ['/', '/downloads/', '/support/']) {
    const page = findPage(route);
    assert(page);
    const html = renderPage(page, developmentAssets);
    const nav = html.match(/<nav id="main-nav"[\s\S]*?<\/nav>/)?.[0];
    assert(nav, 'Main navigation missing from ' + route);
    assert(!/\shidden(?:=|\s|>)/.test(nav), 'Static navigation must not be hidden');
    assert(html.includes('aria-controls="main-nav"'));
    assert(html.includes('aria-expanded="false"'));
    assert(html.includes('aria-label="Open navigation menu"'));
    assert(html.includes('class="menu-toggle"'));
    assert(html.includes('class="skip-link"'));
  }
});

test('code examples are labelled, visible and navigable without JavaScript', () => {
  const page = findPage('/');
  assert(page);
  const html = renderPage(page, developmentAssets);
  assert.match(html, /class="example-tabs"[^>]*hidden/);
  for (const id of ['hello', 'functions', 'numerics']) {
    assert(html.includes(`id="heading-${id}"`));
    assert(html.includes(`aria-labelledby="heading-${id}"`));
    assert(html.includes(`id="tab-${id}"`));
    assert(html.includes(`aria-controls="example-${id}"`));
    assert(html.includes(`id="example-${id}"`));
  }
  assert.equal((html.match(/class="example-panel-title"/g) ?? []).length, 3);
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


test('search directory lists all canonical, public pages without JavaScript', () => {
  const searchable = pages.filter(page => !page.noindex && page.path !== '/search/').map(page => page.path);
  assert.deepEqual(new Set(searchEntries.map(entry => entry.path)), new Set(searchable));
  const search = findPage('/search/');
  assert(search);
  const html = renderPage(search, developmentAssets);
  assert(html.includes('role="search"'));
  assert.match(html, /<form[^>]*data-search-form=""[^>]*hidden/);
  for (const entry of searchEntries) assert(html.includes('href="' + entry.path + '"'));
  assert(html.includes('data-search-results=""'));
  assert(html.includes('Search in English or हिंदी'));
  assert(html.includes('डाउनलोड'));
  assert(html.includes('कृत्रिम बुद्धिमत्ता'));
});


test('ecosystem route renders all verified project cards and evidence links', () => {
  const ecosystem = findPage('/ecosystem/');
  const home = findPage('/');
  assert(ecosystem && home);
  assert.equal(findPage('/ecosystem/index.html')?.path, '/ecosystem/');
  const html = renderPage(ecosystem, developmentAssets);
  assert(html.includes('id="ecosystem-projects-title"'));
  assert(html.includes(`dateTime="${ecosystemReviewedOn}"`) || html.includes(`datetime="${ecosystemReviewedOn}"`));
  for (const project of ecosystemProjects) {
    assert(html.includes(`id="${project.id}"`));
    assert(html.includes(`href="${project.website}"`));
    assert(html.includes(`href="${project.source}"`));
    assert(html.includes(`href="${project.evidence}"`));
    if (project.version) assert(html.includes(project.version));
  }
  assert(html.includes(publishedCompiler.tag + '</strong>'), 'latest published compiler version must be visible');
  assert(!html.includes('not a published release'), 'stale unpublished compiler claim');
  assert(renderPage(home, developmentAssets).includes('href="/ecosystem/"'));
});


test('published alpha.6 is distinct from the pinned alpha.1 example baseline', async () => {
  const downloadsPage = findPage('/downloads/');
  const releasesPage = findPage('/releases/');
  const home = findPage('/');
  assert(downloadsPage && releasesPage && home);
  const downloadsHtml = renderPage(downloadsPage, developmentAssets);
  const releasesHtml = renderPage(releasesPage, developmentAssets);
  const homeHtml = renderPage(home, developmentAssets);
  for (const html of [downloadsHtml, releasesHtml, homeHtml]) {
    assert(html.includes(publishedCompiler.tag));
    assert(html.includes(project.tag));
  }
  assert(downloadsHtml.includes('create hello-world'));
  assert(downloadsHtml.includes('verify hello-world'));
  assert(downloadsHtml.includes('launch hello-world'));
  assert(downloadsHtml.includes('Get-FileHash'));
  assert(downloadsHtml.includes('sha256sum --check'));
  assert(downloadsHtml.includes('shasum -a ')); // Numeric 256 is highlighted separately.
  assert(downloadsHtml.includes(publishedCompiler.sourceCommit + '/docs/project-workflow.md'));
  for (const item of publishedDownloads) {
    assert(downloadsHtml.includes('id="verify-' + item.platform + '"'));
    assert(downloadsHtml.includes('href="#verify-' + item.platform + '"'));
  }
  for (const item of publishedDownloads) {
    assert(downloadsHtml.includes(publishedDownloadUrl(item.file)), item.file);
    assert(downloadsHtml.includes(publishedDownloadUrl(item.file + '.sha256')), item.file);
    assert(downloadsHtml.includes(item.hash), item.file);
  }
  const response = await renderRequest('/project.json', developmentAssets);
  assert(response);
  const data = JSON.parse(response.body) as {
    baseline?: { tag?: string };
    downloads?: unknown[];
    latestPublished?: { tag?: string; sourceCommit?: string };
    latestDownloads?: unknown[];
  };
  assert.equal(data.baseline?.tag, project.tag);
  assert.equal(data.latestPublished?.tag, publishedCompiler.tag);
  assert.equal(data.latestPublished?.sourceCommit, publishedCompiler.sourceCommit);
  assert.equal(data.downloads?.length, 3);
  assert.equal(data.latestDownloads?.length, 3);
});


test('getting started clearly separates published and legacy CLI commands', () => {
  const page = findPage('/learn/');
  assert(page);
  const html = renderPage(page, developmentAssets);
  for (const token of [publishedCompiler.tag, project.tag, 'scarp verify hello.srp',
    'scarp exec hello.srp', 'scarp run hello.srp', 'scarp check hello.srp',
    'scarp create hello-world', 'scarp launch hello-world',
    'scarp inspect symbols --json hello.srp', 'rms', '2.0']) {
    assert(html.includes(token), 'Getting started missing: ' + token);
  }
  assert(html.includes('id="04--explore-new-alpha6-capabilities"'));
  assert(html.includes('href="/migration/"'));
  assert(html.includes('href="/downloads/"'));
});

test('compiler compatibility guide exposes only CI-backed fixture coverage', async () => {
  const page = findPage('/compatibility/');
  assert(page);
  const html = renderPage(page, developmentAssets);
  for (const id of ['versions', 'fixtures', 'reproducibility', 'limits']) {
    assert(html.includes('id="' + id + '"'), 'Missing compatibility section ' + id);
  }
  assert(html.includes('href="/releases/"'));
  assert(html.includes('href="/downloads/"'));
  assert(html.includes('github.com/scarp-lang/scarp-lang.github.io/actions/workflows/ci.yml'));
  for (const version of exampleCompatibility.versions) {
    assert(html.includes(version.tag), 'Missing compiler version');
    assert(html.includes(version.sourceCommit), 'Missing source pin');
    assert(html.includes('scarp ' + version.executionCommand + ' hello.srp'));
    assert(html.includes('scarp ' + version.validationCommand + ' hello.srp'));
  }
  for (const fixture of exampleCompatibility.fixtureNames) {
    assert(html.includes('/src/examples/' + fixture));
    assert(html.includes('/src/examples/' + fixture.replace('.srp', '.stdout')));
  }
  const response = await renderRequest('/project.json', developmentAssets);
  assert(response);
  const snapshot = JSON.parse(response.body) as {
    exampleCompatibility?: { fixtureNames?: string[]; versions?: { tag: string }[] };
  };
  assert.deepEqual(snapshot.exampleCompatibility?.fixtureNames, [...exampleCompatibility.fixtureNames]);
  assert.deepEqual(snapshot.exampleCompatibility?.versions?.map(v => v.tag),
    exampleCompatibility.versions.map(v => v.tag));
});

test('migration route displays source-backed version guidance with no JavaScript', () => {
  const page = findPage('/migration/');
  assert(page);
  assert.equal(findPage('/migration/index.html')?.path, '/migration/');
  const html = renderPage(page, developmentAssets);
  for (const id of ['release-matrix', 'commands', 'workflow', 'alpha4-example', 'what-to-retest']) {
    assert(html.includes('id="' + id + '"'), 'Missing migration section: ' + id);
  }
  for (const item of cliMilestones) {
    assert(html.includes(item.tag), 'Missing published version');
    assert(html.includes(item.sourceCommit), 'Missing release source commit');
    assert(html.includes(item.evidence), 'Missing published release link');
  }
  for (const entry of cliMigrations) {
    assert(html.includes(entry.previous), 'Missing older command: ' + entry.id);
    assert(html.includes(entry.current), 'Missing new command: ' + entry.id);
  }
  assert(html.includes('Do not automatically substitute'));
  assert(html.includes('not in current CI fixtures'));
  assert(html.includes(migrationEvidence.projectWorkflow));
  assert(html.includes('scarp launch hello-world'));
  for (const route of ['/compatibility/', '/releases/']) {
    const linkedPage = findPage(route);
    assert(linkedPage);
    assert(renderPage(linkedPage, developmentAssets).includes('href="/migration/"'));
  }
  assert(renderPage(findPage('/faq/')!, developmentAssets).includes('href="/migration/"'));
});

test('current alpha.6 announcement is dated, source-backed and included in RSS', async () => {
  const announcement = news[0];
  assert(announcement);
  assert.equal(announcement.href, '/news/alpha6-symbol-navigation/');
  assert.equal(announcement.date, publishedCompiler.reviewed);
  assert.equal(formatNewsDate('2026-11-05'), '5 November 2026');
  assert.throws(() => formatNewsDate('not-a-date'), RangeError);

  for (const route of ['/', '/news/']) {
    const page = findPage(route);
    assert(page);
    const html = renderPage(page, developmentAssets);
    assert(html.includes('href="' + announcement.href + '"'), 'Alpha.6 announcement absent from ' + route);
    assert(html.includes('>5 November 2026</time>'), 'Latest announcement date absent from ' + route);
  }

  const article = findPage(announcement.href);
  assert(article, 'Alpha.6 article not registered');
  const html = renderPage(article, developmentAssets);
  for (const token of [publishedCompiler.tag, publishedCompiler.sourceCommit, 'rms',
    'inspect symbols', 'inspect references', '/compatibility/', '/migration/']) {
    assert(html.includes(token), 'Alpha.6 article missing source-backed detail: ' + token);
  }
  assert(searchEntries.some(entry => entry.path === announcement.href), 'Alpha.6 news absent from search');

  const feed = await renderRequest('/feed.xml', developmentAssets);
  assert(feed?.body.includes('<link>https://scarp-lang.github.io/news/alpha6-symbol-navigation/</link>'));
  assert(feed?.body.includes('<pubDate>' + new Date(announcement.date + 'T00:00:00Z').toUTCString() + '</pubDate>'));
});

test('historical alpha.5 article keeps its original release and source references', async () => {
  const historical = news[1];
  assert(historical);
  assert.equal(historical.href, '/news/alpha5-project-inspection/');
  assert.equal(historical.date, '2026-11-04');
  const article = findPage(historical.href);
  assert(article);
  const html = renderPage(article, developmentAssets);
  for (const token of ['v0.0.5-alpha.5', '2eeed0aa52ccb59523307841ad8ffbd83f8911a8',
    'emit_c', 'C11', '/compatibility/']) {
    assert(html.includes(token), 'Historical alpha.5 evidence changed: ' + token);
  }
  assert(!html.includes('Scarp <strong>' + publishedCompiler.tag + '</strong>'),
    'Historical alpha.5 article must not claim to announce the latest release');
});

test('historical alpha.4 article retains original release date and source evidence', async () => {
  const historical = news[2];
  assert(historical);
  assert.equal(historical.href, '/news/offline-projects/');
  assert.equal(historical.date, '2026-11-03');
  assert.equal(formatNewsDate(historical.date), '3 November 2026');

  for (const route of ['/', '/news/']) {
    const page = findPage(route);
    assert(page);
    const html = renderPage(page, developmentAssets);
    assert(html.includes('href="' + historical.href + '"'), 'Historical article absent from ' + route);
  }

  const article = findPage(historical.href);
  assert(article, 'Missing historical alpha.4 page');
  const html = renderPage(article, developmentAssets);
  for (const token of ['v0.0.5-alpha.4', 'Scarp.project', 'scarp create hello-world',
    'scarp verify hello-world', 'scarp launch hello-world',
    '79141329176f5dce51457e90a6652902f6432135', '/compatibility/']) {
    assert(html.includes(token), 'Historical article changed unexpectedly: ' + token);
  }
  assert(html.includes('3 November 2026'), 'Historical publication date changed');
  const feed = await renderRequest('/feed.xml', developmentAssets);
  assert(feed?.body.includes('<link>https://scarp-lang.github.io/news/offline-projects/</link>'));
  assert(feed?.body.includes('<pubDate>' + new Date(historical.date + 'T00:00:00Z').toUTCString() + '</pubDate>'));
});
