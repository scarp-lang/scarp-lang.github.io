import assert from "node:assert/strict";
import test from "node:test";
import { enhanceSiteSearch } from "../src/scripts/site-search.ts";
import { searchEntries } from "../src/data/search.ts";

type Options = { key?: string; ctrlKey?: boolean; metaKey?: boolean; altKey?: boolean; shiftKey?: boolean; isComposing?: boolean; defaultPrevented?: boolean };
type FakeEvent = Options & { target: FakeElement; preventDefault(): void };
type Handler = (event: FakeEvent) => void;

class FakeElement {
  hidden = false;
  value = "";
  textContent = "";
  focusCount = 0;
  selectCount = 0;
  editor = false;
  parent: FakeElement | null = null;
  dataset: Record<string, string> = {};
  private handlers = new Map<string, Handler[]>();
  addEventListener(type: string, listener: Handler) {
    const list = this.handlers.get(type) ?? [];
    list.push(listener);
    this.handlers.set(type, list);
  }
  emit(type: string, opts: Options = {}, target: FakeElement = this) {
    let prevented = Boolean(opts.defaultPrevented);
    const event: FakeEvent = {
      ...opts, target,
      preventDefault() { prevented = true; event.defaultPrevented = true; },
    };
    for (const handler of this.handlers.get(type) ?? []) handler(event);
    return prevented;
  }
  closest(selector: string): FakeElement | null {
    if (selector === "form") {
      for (let current: FakeElement | null = this; current; current = current.parent)
        if (current instanceof FakeForm) return current;
      return null;
    }
    return this.editor ? this : null;
  }
  focus() { this.focusCount++; }
  select() { this.selectCount++; }
}

class FakeForm extends FakeElement { hidden = true; }
class FakeList extends FakeElement {
  items: FakeElement[] = [];
  querySelectorAll<T>(selector: string): T[] {
    if (selector !== "[data-search-item]") throw new Error("Unexpected selector " + selector);
    return this.items as T[];
  }
  append(item: FakeElement) {
    this.items = this.items.filter(old => old !== item);
    this.items.push(item);
  }
}
class FakeDocument extends FakeElement {
  elements = new Map<string, FakeElement>();
  querySelector<T>(selector: string): T | null {
    return (this.elements.get(selector) ?? null) as T | null;
  }
}
class FakeWindow {
  url: URL;
  navigated: string | null = null;
  replaces: string[] = [];
  private handlers = new Map<string, Array<() => void>>();
  constructor(url = "https://scarp-lang.github.io/search/") { this.url = new URL(url); }
  get location() {
    const self = this;
    return {
      get search() { return self.url.search; },
      get hash() { return self.url.hash; },
      get href() { return self.url.href; },
      assign: (target: string) => { self.navigated = target; },
    };
  }
  history = {
    replaceState: (_state: unknown, _title: string, next: string) => {
      this.replaces.push(next);
      this.url = new URL(next, this.url);
    },
  };
  addEventListener(type: string, callback: () => void) {
    const handlers = this.handlers.get(type) ?? [];
    handlers.push(callback);
    this.handlers.set(type, handlers);
  }
  popstate(target: string) {
    this.url = new URL(target, this.url);
    for (const callback of this.handlers.get("popstate") ?? []) callback();
  }
}
function setup(url?: string) {
  const doc = new FakeDocument();
  const win = new FakeWindow(url);
  const form = new FakeForm();
  const input = new FakeElement();
  input.parent = form;
  const list = new FakeList();
  list.items = searchEntries.map(entry => {
    const el = new FakeElement();
    el.dataset.searchPath = entry.path;
    return el;
  });
  const count = new FakeElement();
  const status = new FakeElement();
  const empty = new FakeElement();
  empty.hidden = true;
  const clear = new FakeElement();
  clear.hidden = true;
  doc.elements.set("[data-search-input]", input);
  doc.elements.set("[data-search-results]", list);
  doc.elements.set("[data-search-count]", count);
  doc.elements.set("[data-search-status]", status);
  doc.elements.set("[data-search-empty]", empty);
  doc.elements.set("[data-search-clear]", clear);
  const enhance = () => enhanceSiteSearch(doc as unknown as Document, win as unknown as Window);
  return { doc, win, form, input, list, count, status, empty, clear, enhance };
}
test("deep-link query initializes directory, concise live status, and clear action", () => {
  const s = setup("https://scarp-lang.github.io/search/?q=%E0%A4%A1%E0%A4%BE%E0%A4%89%E0%A4%A8%E0%A4%B2%E0%A5%8B%E0%A4%A1");
  s.enhance();
  assert.equal(s.form.hidden, false);
  assert.equal(s.input.value, "डाउनलोड");
  assert.equal(s.list.items.filter(x => !x.hidden).length, 1);
  assert(s.count.textContent.includes("डाउनलोड"));
  assert.equal(s.status.textContent, "1 result.");
  assert.equal(s.status.textContent.includes("डाउनलोड"), false);
  assert.equal(s.empty.hidden, true);
  assert.equal(s.clear.hidden, false);
});
test("typing keeps URL params, ranks results, and exposes the empty state", () => {
  const s = setup("https://scarp-lang.github.io/search/?from=docs#anchor");
  s.enhance();
  s.input.value = "migrate cli";
  s.input.emit("input");
  assert.equal(s.list.items.filter(x => !x.hidden).length > 0, true);
  assert.equal(s.list.items.find(x => !x.hidden)?.dataset.searchPath, "/migration/");
  assert.equal(s.win.url.searchParams.get("from"), "docs");
  assert.equal(s.win.url.searchParams.get("q"), "migrate cli");
  assert.equal(s.win.url.hash, "#anchor");
  s.input.value = "noresultsunmatchedword";
  s.input.emit("input");
  assert.equal(s.status.textContent, "No matching pages.");
  assert.equal(s.empty.hidden, false);
  assert(s.list.items.every(item => item.hidden));
});
test("clear button and Escape restore complete directory without stealing focus", () => {
  const s = setup();
  s.enhance();
  s.input.value = "download";
  s.input.emit("input");
  s.clear.emit("click");
  assert.equal(s.input.value, "");
  assert.equal(s.clear.hidden, true);
  assert.equal(s.input.focusCount, 1);
  assert.equal(s.list.items.filter(x => !x.hidden).length, searchEntries.length);
  assert.equal(s.win.url.searchParams.has("q"), false);
  s.input.value = "install";
  s.input.emit("input");
  assert.equal(s.input.emit("keydown", { key: "Escape" }), true);
  assert.equal(s.input.value, "");
  assert.equal(s.input.emit("keydown", { key: "Escape" }), false);
});
test("back/forward navigation restores the query and result visibility", () => {
  const s = setup();
  s.enhance();
  s.input.value = "help";
  s.input.emit("input");
  const replacements = s.win.replaces.length;
  s.win.popstate("/search/?q=roadmap");
  assert.equal(s.input.value, "roadmap");
  assert.equal(s.list.items.find(x => !x.hidden)?.dataset.searchPath, "/roadmap/");
  assert.equal(s.win.replaces.length, replacements);
});
test("global search shortcuts focus the search input or navigate from other pages", () => {
  const s = setup("https://scarp-lang.github.io/search/#site-search-input");
  s.enhance();
  assert.equal(s.input.focusCount, 1);
  const outside = new FakeElement();
  assert.equal(s.doc.emit("keydown", { key: "/", defaultPrevented: false }, outside), true);
  assert.equal(s.input.focusCount, 2);
  assert.equal(s.input.selectCount, 1);
  assert.equal(s.doc.emit("keydown", { key: "K", ctrlKey: true }, outside), true);
  assert.equal(s.doc.emit("keydown", { key: "k", metaKey: true }, outside), true);
  const other = setup();
  other.doc.elements.clear();
  other.enhance();
  assert.equal(other.doc.emit("keydown", { key: "/" }, outside), true);
  assert.equal(other.win.navigated, "/search/#site-search-input");
});
test("editing, modifier keys, IME and previously-handled keys remain untouched", () => {
  const s = setup();
  s.enhance();
  const editor = new FakeElement();
  editor.editor = true;
  const outside = new FakeElement();
  for (const opts of [
    { key: "/", ctrlKey: false },
    { key: "k", ctrlKey: true },
    { key: "k", metaKey: true },
  ]) assert.equal(s.doc.emit("keydown", opts, editor), false);
  for (const opts of [
    { key: "/", shiftKey: true },
    { key: "k", ctrlKey: true, altKey: true },
    { key: "k", ctrlKey: true, defaultPrevented: true },
    { key: "/", isComposing: true },
    { key: "c", ctrlKey: true },
  ]) assert.equal(s.doc.emit("keydown", opts, outside), Boolean(opts.defaultPrevented));
  assert.equal(s.input.focusCount, 0);
});
test("incomplete directory keeps static results and form hidden", () => {
  const s = setup();
  s.list.items.pop();
  s.enhance();
  assert.equal(s.form.hidden, true);
  assert(s.list.items.every(item => !item.hidden));
  assert.equal(s.win.replaces.length, 0);
});
