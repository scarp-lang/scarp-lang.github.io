import test from "node:test";
import assert from "node:assert/strict";
import { searchEntries, searchEntriesFor } from "../src/data/search.ts";
import { hindiSearchAliases } from "../src/data/search-hi.ts";

test("site search data contains distinct, canonical page paths", () => {
  assert.equal(searchEntries.length, 26);
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
  assert.equal(searchEntriesFor("root mean square")[0]?.path, "/news/alpha6-symbol-navigation/");
  assert.equal(searchEntriesFor("कंपाइलर कैश")[0]?.path, "/news/alpha6-cache-apis/");
  assert.equal(searchEntriesFor("syntax cache")[0]?.path, "/news/alpha6-cache-apis/");
  assert.equal(searchEntriesFor("softmax_temp")[0]?.path, "/news/alpha6-ranking-temperature/");
  assert.equal(searchEntriesFor("topk_values")[0]?.path, "/news/alpha6-ranking-temperature/");
  assert.equal(searchEntriesFor("read_line")[0]?.path, "/news/alpha6-input-tuples/");
  assert.equal(searchEntriesFor("elif")[0]?.path, "/news/alpha6-conditional-unicode/");
  assert.equal(searchEntriesFor("यूनिकोड")[0]?.path, "/news/alpha6-conditional-unicode/");
  assert.equal(searchEntriesFor("टपल")[0]?.path, "/news/alpha6-input-tuples/");
  assert.equal(searchEntriesFor("pearson_correlation")[0]?.path, "/news/alpha6-nucleus-correlation/");
  assert.equal(searchEntriesFor("न्यूक्लियस चयन")[0]?.path, "/news/alpha6-nucleus-correlation/");
  assert.equal(searchEntriesFor("स्कोर रैंकिंग")[0]?.path, "/news/alpha6-ranking-temperature/");
  assert(searchEntriesFor("अल्फा छह").some(entry => entry.path === "/news/alpha6-symbol-navigation/"));
  assert.equal(searchEntriesFor("सोर्स नेविगेशन")[0]?.path, "/news/alpha6-symbol-navigation/");
  assert.equal(searchEntriesFor("roadmap")[0]?.path, "/roadmap/");
  assert.equal(searchEntriesFor("module import")[0]?.path, "/news/source-modules/");
  assert.equal(searchEntriesFor("bug report")[0]?.path, "/support/");
  assert.equal(searchEntriesFor("ARTIFICIAL INTELLIGENCE")[0]?.path, "/ai/");
});

test("Hindi aliases cover the entire published page directory without orphan paths", () => {
  assert.deepEqual(Object.keys(hindiSearchAliases).sort(), searchEntries.map(entry => entry.path).sort());
});

test("Hindi discovery works across downloads, learning, help, and project resources", () => {
  assert.equal(searchEntriesFor("डाउनलोड")[0]?.path, "/downloads/");
  assert.equal(searchEntriesFor("विंडोज इंस्टॉल")[0]?.path, "/downloads/");
  assert.equal(searchEntriesFor("हिंदी में सीखें")[0]?.path, "/learn/");
  assert.equal(searchEntriesFor("कृत्रिम बुद्धिमत्ता")[0]?.path, "/ai/");
  assert.equal(searchEntriesFor("समुदाय")[0]?.path, "/community/");
  assert.equal(searchEntriesFor("मदद")[0]?.path, "/support/");
  assert.equal(searchEntriesFor("रोडमैप")[0]?.path, "/roadmap/");
  assert.equal(searchEntriesFor("फ़ंक्शन")[0]?.path, "/features/");
  assert.deepEqual(searchEntriesFor("डाउनलोड अज्ञातशब्द"), []);
});

test("Latin diacritics still normalize, while Indic vowel signs remain distinct", () => {
  const fixture = [{ path: "/test/", title: "Café", section: "Demo", summary: "Test", keywords: [] }];
  assert.equal(searchEntriesFor("cafe", fixture)[0]?.path, "/test/");
  assert.equal(searchEntriesFor("सीखें")[0]?.path, "/learn/");
  assert.deepEqual(searchEntriesFor("सख")[0]?.path, undefined);
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

test("quick search uses existing ranking and encodes only local directory links", async () => {
  const { quickSearchLimit, previewSearch, searchDirectoryHref } =
    await import("../src/data/quick-search.ts");
  assert.equal(quickSearchLimit, 6);
  assert.deepEqual(previewSearch(""), searchEntries.slice(0, quickSearchLimit));
  assert.equal(previewSearch("डाउनलोड")[0]?.path, "/downloads/");
  assert.equal(previewSearch("root mean square")[0]?.path, "/news/alpha6-symbol-navigation/");
  assert.deepEqual(previewSearch("unlikely-no-results-987"), []);
  assert.equal(searchDirectoryHref(""), "/search/");
  assert.equal(searchDirectoryHref("  roadmap  "), "/search/?q=roadmap");
  assert.equal(searchDirectoryHref("मदद"), "/search/?q=%E0%A4%AE%E0%A4%A6%E0%A4%A6");
  assert.equal(searchDirectoryHref("a&redirect=https://example.com"), "/search/?q=a%26redirect%3Dhttps%3A%2F%2Fexample.com");
});
