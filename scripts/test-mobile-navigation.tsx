import test from "node:test";
import assert from "node:assert/strict";
import { enhanceMobileNavigation } from "../src/scripts/mobile-navigation.ts";

type EventLike = { target: FakeNode; key?: string };
type Listener = (event: EventLike) => void;

// Minimal DOM doubles keep these interaction tests dependency-free.
class FakeNode {
  parent: FakeNode | null = null;
  hidden = true;
  link = false;
  focusCount = 0;
  private readonly handlers = new Map<string, Listener[]>();
  private readonly attributes = new Map<string, string>();
  private readonly classes = new Set<string>();
  constructor(readonly owner?: FakeDocument) {}

  readonly classList = {
    add: (name: string) => { this.classes.add(name); },
    contains: (name: string) => this.classes.has(name),
    toggle: (name: string, force?: boolean) => {
      const enabled = force ?? !this.classes.has(name);
      if (enabled) this.classes.add(name);
      else this.classes.delete(name);
      return enabled;
    },
  };

  addEventListener(type: string, callback: Listener) {
    const list = this.handlers.get(type) ?? [];
    list.push(callback);
    this.handlers.set(type, list);
  }

  emit(type: string, target: FakeNode = this, details: { key?: string } = {}) {
    for (const callback of this.handlers.get(type) ?? [])
      callback({ target, ...details });
  }

  setAttribute(name: string, value: string) { this.attributes.set(name, value); }
  getAttribute(name: string) { return this.attributes.get(name) ?? null; }

  contains(target: FakeNode | null): boolean {
    for (let node = target; node; node = node.parent)
      if (node === this) return true;
    return false;
  }

  closest(selector: string): FakeNode | null {
    if (selector !== "a") return null;
    for (let node: FakeNode | null = this; node; node = node.parent)
      if (node.link) return node;
    return null;
  }

  append(node: FakeNode) { node.parent = this; return node; }

  focus() {
    this.focusCount++;
    if (this.owner) this.owner.activeElement = this;
  }
}

class FakeDocument extends FakeNode {
  readonly documentElement = new FakeNode(this);
  activeElement: FakeNode | null = null;
}

class FakeViewport extends FakeNode {
  matches = true;
  resize(mobile: boolean) {
    this.matches = mobile;
    this.emit("change");
  }
}

function setup() {
  const doc = new FakeDocument();
  const viewport = new FakeViewport();
  const menu = new FakeNode(doc);
  const nav = new FakeNode(doc);
  const link = nav.append(new FakeNode(doc));
  link.link = true;
  const icon = link.append(new FakeNode(doc));
  const outside = new FakeNode(doc);
  enhanceMobileNavigation({
    menu: menu as unknown as HTMLButtonElement,
    nav: nav as unknown as HTMLElement,
    doc: doc as unknown as Document,
    viewport: viewport as unknown as MediaQueryList,
  });
  return { doc, viewport, menu, nav, link, icon, outside };
}

test("static navigation stays unchanged if a toggle or nav is missing", () => {
  const doc = new FakeDocument();
  const nav = new FakeNode(doc);
  enhanceMobileNavigation({
    menu: null,
    nav: nav as unknown as HTMLElement,
    doc: doc as unknown as Document,
    viewport: new FakeViewport() as unknown as MediaQueryList,
  });
  assert.equal(doc.documentElement.classList.contains("has-js"), false);
  assert.equal(nav.classList.contains("is-open"), false);
});

test("progressive enhancement toggles expanded state, label, and menu visibility", () => {
  const { doc, menu, nav } = setup();
  assert.equal(menu.hidden, false);
  assert.equal(doc.documentElement.classList.contains("has-js"), true);
  assert.equal(menu.getAttribute("aria-expanded"), "false");
  assert.equal(menu.getAttribute("aria-label"), "Open navigation menu");
  menu.emit("click");
  assert.equal(menu.getAttribute("aria-expanded"), "true");
  assert.equal(menu.getAttribute("aria-label"), "Close navigation menu");
  assert.equal(nav.classList.contains("is-open"), true);
  menu.emit("click");
  assert.equal(menu.getAttribute("aria-expanded"), "false");
  assert.equal(nav.classList.contains("is-open"), false);
});

test("navigation links, including nested link content, dismiss the disclosure", () => {
  const { menu, nav, icon } = setup();
  menu.emit("click");
  nav.emit("click", icon);
  assert.equal(menu.getAttribute("aria-expanded"), "false");
});

test("outside pointer actions close the menu; inside actions do not", () => {
  const { doc, menu, nav, icon, outside } = setup();
  menu.emit("click");
  doc.emit("pointerdown", menu);
  doc.emit("pointerdown", icon);
  assert.equal(nav.classList.contains("is-open"), true);
  doc.emit("pointerdown", outside);
  assert.equal(nav.classList.contains("is-open"), false);
});

test("leaving the disclosure via keyboard focus closes it without stealing focus", () => {
  const { doc, menu, nav, icon, outside } = setup();
  menu.emit("click");
  doc.emit("focusin", icon);
  assert.equal(nav.classList.contains("is-open"), true);
  doc.emit("focusin", outside);
  assert.equal(nav.classList.contains("is-open"), false);
  assert.equal(menu.focusCount, 0);
});

test("Escape closes the mobile menu and restores focus to the toggle", () => {
  const { doc, menu, nav } = setup();
  menu.emit("click");
  doc.emit("keydown", doc, { key: "Enter" });
  assert.equal(nav.classList.contains("is-open"), true);
  doc.emit("keydown", doc, { key: "Escape" });
  assert.equal(nav.classList.contains("is-open"), false);
  assert.equal(menu.focusCount, 1);
  assert.equal(doc.activeElement, menu);
});

test("breakpoint changes reset the menu and rescue focus from newly hidden links", () => {
  const { doc, viewport, menu, nav, link } = setup();
  menu.emit("click");
  viewport.resize(false);
  assert.equal(nav.classList.contains("is-open"), false);
  link.focus();
  viewport.resize(true);
  assert.equal(menu.getAttribute("aria-expanded"), "false");
  assert.equal(doc.activeElement, menu);
  assert.equal(menu.focusCount, 1);
});
