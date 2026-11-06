import assert from "node:assert/strict";
import test from "node:test";
import { enhanceCodeExplorer } from "../src/scripts/code-explorer.ts";

type KeyDetails = { key?: string; ctrlKey?: boolean; altKey?: boolean; metaKey?: boolean };
type FakeEvent = KeyDetails & { preventDefault: () => void };
type Handler = (event: FakeEvent) => void;

class FakeElement {
  id = "";
  hidden = false;
  tabIndex = 0;
  focusCount = 0;
  dataset: Record<string, string> = {};
  private attributes = new Map<string, string>();
  private handlers = new Map<string, Handler[]>();
  private classes = new Set<string>();
  classList = {
    add: (value: string) => { this.classes.add(value); },
    contains: (value: string) => this.classes.has(value),
  };
  getAttribute(name: string) { return this.attributes.get(name) ?? null; }
  setAttribute(name: string, value: string) { this.attributes.set(name, value); }
  addEventListener(type: string, handler: Handler) {
    const handlers = this.handlers.get(type) ?? [];
    handlers.push(handler);
    this.handlers.set(type, handlers);
  }
  emit(type: string, details: KeyDetails = {}) {
    let prevented = false;
    const event = { ...details, preventDefault: () => { prevented = true; } };
    for (const handler of this.handlers.get(type) ?? []) handler(event);
    return prevented;
  }
  focus() { this.focusCount++; }
}
class FakeExplorer extends FakeElement {
  tablist: FakeElement | null = new FakeElement();
  tabs: FakeElement[] = [];
  panels: FakeElement[] = [];
  querySelector<T>(_selector: string): T | null {
    return this.tablist as T | null;
  }
  querySelectorAll<T>(selector: string): T[] {
    return (selector === "[data-tab]" ? this.tabs : this.panels) as T[];
  }
}
function setup() {
  const explorer = new FakeExplorer();
  explorer.tablist!.hidden = true;
  for (const id of ["hello", "functions", "numerics"]) {
    const tab = new FakeElement();
    tab.id = "tab-" + id;
    tab.dataset.tab = id;
    tab.setAttribute("aria-controls", "example-" + id);
    const panel = new FakeElement();
    panel.id = "example-" + id;
    panel.dataset.panel = id;
    panel.setAttribute("aria-labelledby", "heading-" + id);
    explorer.tabs.push(tab);
    explorer.panels.push(panel);
  }
  return explorer;
}
const enhance = (explorer: FakeExplorer) =>
  enhanceCodeExplorer(explorer as unknown as HTMLElement);

test("no-JavaScript example markup is enhanced only after successful pairing", () => {
  const explorer = setup();
  enhance(explorer);
  assert.equal(explorer.tablist?.hidden, false);
  assert.equal(explorer.tablist?.getAttribute("role"), "tablist");
  assert.equal(explorer.tablist?.getAttribute("aria-orientation"), "horizontal");
  assert(explorer.classList.contains("is-enhanced"));
  assert.deepEqual(explorer.tabs.map(tab => tab.getAttribute("aria-selected")), ["true", "false", "false"]);
  assert.deepEqual(explorer.tabs.map(tab => tab.tabIndex), [0, -1, -1]);
  assert.deepEqual(explorer.panels.map(panel => panel.hidden), [false, true, true]);
  explorer.tabs.forEach((tab, index) => {
    assert.equal(tab.getAttribute("role"), "tab");
    assert.equal(explorer.panels[index]?.getAttribute("role"), "tabpanel");
    assert.equal(explorer.panels[index]?.getAttribute("aria-labelledby"), tab.id);
    assert.equal(explorer.panels[index]?.tabIndex, 0);
  });
});

test("click selects a tab without stealing keyboard focus", () => {
  const explorer = setup();
  enhance(explorer);
  explorer.tabs[2]?.emit("click");
  assert.deepEqual(explorer.panels.map(panel => panel.hidden), [true, true, false]);
  assert.deepEqual(explorer.tabs.map(tab => tab.tabIndex), [-1, -1, 0]);
  assert.equal(explorer.tabs[2]?.focusCount, 0);
});

test("arrow keys wrap and Home/End focus exactly the selected tab", () => {
  const explorer = setup();
  enhance(explorer);
  assert.equal(explorer.tabs[0]?.emit("keydown", { key: "ArrowLeft" }), true);
  assert.equal(explorer.tabs[2]?.getAttribute("aria-selected"), "true");
  assert.equal(explorer.tabs[2]?.focusCount, 1);
  assert.equal(explorer.tabs[2]?.emit("keydown", { key: "ArrowRight" }), true);
  assert.equal(explorer.tabs[0]?.getAttribute("aria-selected"), "true");
  assert.equal(explorer.tabs[0]?.focusCount, 1);
  assert.equal(explorer.tabs[0]?.emit("keydown", { key: "End" }), true);
  assert.equal(explorer.tabs[2]?.getAttribute("aria-selected"), "true");
  assert.equal(explorer.tabs[2]?.emit("keydown", { key: "Home" }), true);
  assert.equal(explorer.tabs[0]?.getAttribute("aria-selected"), "true");
  assert.deepEqual(explorer.panels.map(panel => panel.hidden), [false, true, true]);
});

test("other keys and modified browser shortcuts are not intercepted", () => {
  const explorer = setup();
  enhance(explorer);
  for (const event of [
    { key: "Tab" }, { key: "Enter" },
    { key: "ArrowLeft", ctrlKey: true },
    { key: "ArrowRight", metaKey: true },
    { key: "Home", altKey: true },
  ]) assert.equal(explorer.tabs[0]?.emit("keydown", event), false);
  assert.equal(explorer.tabs[0]?.getAttribute("aria-selected"), "true");
  assert.equal(explorer.tabs[0]?.focusCount, 0);
});

test("malformed, duplicate, or incomplete tab lists keep every panel visible", () => {
  for (const kind of ["missing", "wrong-link", "duplicate", "missing-tablist"]) {
    const explorer = setup();
    if (kind === "missing") explorer.panels.pop();
    if (kind === "wrong-link") explorer.tabs[0]?.setAttribute("aria-controls", "missing");
    if (kind === "duplicate") explorer.tabs[1]!.id = explorer.tabs[0]!.id;
    if (kind === "missing-tablist") explorer.tablist = null;
    enhance(explorer);
    assert(!explorer.classList.contains("is-enhanced"), kind);
    assert.equal(explorer.tablist?.hidden ?? true, true, kind);
    assert(explorer.panels.every(panel => !panel.hidden), kind);
    assert(explorer.tabs.every(tab => tab.getAttribute("role") === null), kind);
  }
});
