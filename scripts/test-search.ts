import test from "node:test";
import assert from "node:assert/strict";
import { searchEntries, searchEntriesFor } from "../src/data/search.ts";

test("site search data contains distinct, canonical page paths", () => {
  assert.equal(searchEntries.length, 20);
  assert.equal(new Set(searchEntries.map(entry => entry.path)).size, searchEntries.length);
  for (const entry of searchEntries) {
    assert(entry.path.startsWith("/"));
    assert(entry.path === "/" || entry.path.endsWith("/"));
    assert(entry.title && entry.summary && entry.section);
  }
});

test("blank queries preserve the complete directory order", () => {
  assert.deepEqual(searchEntriesFor("   "), searchEntries);
  assert.deepEqual(searchEntriesFor(""), searchEntries);
});

test("keywords, casing, prefixes, and multiple terms find relevant pages", () => {
  assert.equal(searchEntriesFor("INSTALL")[0]?.path, "/downloads/");
  assert.equal(searchEntriesFor("playground")[0]?.path, "/ecosystem/");
  assert.equal(searchEntriesFor("compatibility")[0]?.path, "/compatibility/");
  assert.equal(searchEntriesFor("migrate cli")[0]?.path, "/migration/");
  assert.equal(searchEntriesFor("offline project")[0]?.path, "/news/offline-projects/");
  assert.equal(searchEntriesFor("C11 embedding")[0]?.path, "/news/alpha5-project-inspection/");
  assert.equal(searchEntriesFor("roadmap")[0]?.path, "/roadmap/");
  assert.equal(searchEntriesFor("module import")[0]?.path, "/news/source-modules/");
  assert.equal(searchEntriesFor("bug report")[0]?.path, "/support/");
  assert.equal(searchEntriesFor("ARTIFICIAL INTELLIGENCE")[0]?.path, "/ai/");
});

test("missing terms do not produce broad or partial-word false positives", () => {
  assert.deepEqual(searchEntriesFor("unknown-super-unique-phrase"), []);
  assert.deepEqual(searchEntriesFor("roadmap nonexistent"), []);
  assert(!searchEntriesFor("ai").some(entry => entry.path === "/downloads/"));
});

test("search does not mutate the website directory", () => {
  const original = searchEntries.map(entry => entry.path);
  searchEntriesFor("source");
  searchEntriesFor("ai");
  assert.deepEqual(searchEntries.map(entry => entry.path), original);
});
