import assert from "node:assert/strict";
import test from "node:test";
import { enhanceCopyButtons, type ClipboardWriter } from "../src/scripts/code-copy.ts";

class FakeButton {
  hidden = true;
  disabled = false;
  textContent: string;
  dataset: Record<string, string> = {};
  private label: string | null;
  readonly code: string | null;
  private handlers: Array<() => void | Promise<void>> = [];
  constructor(
    text: string,
    code: string | null = null,
    explicitText?: string,
    label: string | null = null,
  ) {
    this.textContent = text;
    this.label = label;
    this.code = code;
    if (explicitText !== undefined) this.dataset.copyText = explicitText;
  }
  getAttribute(name: string) { return name === "aria-label" ? this.label : null; }
  setAttribute(name: string, value: string) {
    if (name === "aria-label") this.label = value;
  }
  removeAttribute(name: string) {
    if (name === "aria-label") this.label = null;
  }
  closest(selector: string) {
    if (selector !== ".code-block" || this.code === null) return null;
    return { querySelector: (name: string) =>
      name === "code" ? { textContent: this.code } : null };
  }
  addEventListener(type: string, handler: () => void | Promise<void>) {
    if (type === "click") this.handlers.push(handler);
  }
  async click() { await Promise.all(this.handlers.map(handler => handler())); }
}
function enhance(
  buttons: FakeButton[],
  clipboard: ClipboardWriter | undefined,
  announce: (message: string) => void,
  schedule?: (callback: () => void, delayMs: number) => void,
) {
  enhanceCopyButtons(
    buttons,
    clipboard,
    announce,
    schedule,
  );
}

test("copies the code text exactly and restores the original accessible label", async () => {
  const button = new FakeButton("Copy", "print(\"hello\");\n", undefined, "Copy hello.srp");
  const writes: string[] = [];
  const announcements: string[] = [];
  const tasks: Array<() => void> = [];
  enhance([button], { writeText: async text => { writes.push(text); } },
    message => announcements.push(message), callback => { tasks.push(callback); });
  assert.equal(button.hidden, false);
  await button.click();
  assert.deepEqual(writes, ["print(\"hello\");\n"]);
  assert.equal(button.textContent, "Copied!");
  assert.equal(button.getAttribute("aria-label"), "Copy hello.srp — copied");
  assert.deepEqual(announcements, ["Code copied to clipboard."]);
  assert.equal(button.disabled, false);
  assert.equal(tasks.length, 1);
  tasks[0]?.();
  assert.equal(button.textContent, "Copy");
  assert.equal(button.getAttribute("aria-label"), "Copy hello.srp");
});

test("the checksum control copies the reviewed digest, not surrounding markup", async () => {
  const digest = "a".repeat(64);
  const button = new FakeButton("Copy checksum", null, digest, "Copy Linux SHA-256 checksum");
  const writes: string[] = [];
  const announcements: string[] = [];
  enhance([button], { writeText: async text => { writes.push(text); } },
    message => announcements.push(message), () => {});
  await button.click();
  assert.deepEqual(writes, [digest]);
  assert.deepEqual(announcements, ["SHA-256 checksum copied to clipboard."]);
  assert.equal(button.textContent, "Copied!");
});

test("clipboard failure informs the reader and allows a retry", async () => {
  const button = new FakeButton("Copy", "source", undefined, "Copy example");
  let attempts = 0;
  const announcements: string[] = [];
  const tasks: Array<() => void> = [];
  enhance([button], { writeText: async () => { if (++attempts === 1) throw Error("Permission denied"); } },
    message => announcements.push(message), callback => { tasks.push(callback); });
  await button.click();
  assert.equal(button.disabled, false);
  assert.equal(button.textContent, "Copy failed");
  assert.match(announcements[0] ?? "", /Could not copy/);
  await button.click();
  assert.equal(attempts, 2);
  assert.equal(button.textContent, "Copied!");
  tasks[0]?.(); // Stale failure timeout cannot override the successful retry.
  assert.equal(button.textContent, "Copied!");
  tasks[1]?.();
  assert.equal(button.textContent, "Copy");
  assert.equal(button.getAttribute("aria-label"), "Copy example");
});

test("pending copies cannot trigger duplicate writes", async () => {
  const button = new FakeButton("Copy", "source");
  let finish: (() => void) | undefined;
  let writes = 0;
  const pending = new Promise<void>(resolve => { finish = resolve; });
  enhance([button], { writeText: () => { writes++; return pending; } }, () => {}, () => {});
  const first = button.click();
  assert.equal(button.disabled, true);
  await button.click();
  assert.equal(writes, 1);
  finish?.();
  await first;
  assert.equal(button.disabled, false);
});

test("missing content and unsupported clipboard keep copy buttons hidden", async () => {
  const noCode = new FakeButton("Copy");
  const noText = new FakeButton("Copy checksum", null, "");
  const supported = new FakeButton("Copy", "source");
  enhance([noCode, noText, supported], { writeText: async () => {} }, () => {}, () => {});
  assert.equal(noCode.hidden, true);
  assert.equal(noText.hidden, true);
  assert.equal(supported.hidden, false);
  const unsupported = new FakeButton("Copy", "source");
  enhance([unsupported], undefined, () => {});
  assert.equal(unsupported.hidden, true);
  await unsupported.click();
  assert.equal(unsupported.textContent, "Copy");
});
