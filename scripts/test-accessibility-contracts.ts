import assert from "node:assert/strict";
import test from "node:test";
import { accessibilityProblems } from "./accessibility-contracts.ts";

const valid = `<!doctype html><html lang="en"><body>
  <a class="skip-link" href="#main">Skip to content</a>
  <nav id="main-nav" aria-label="Main navigation"><a href="/">Home</a></nav>
  <button type="button" aria-controls="main-nav" aria-expanded="false">Menu</button>
  <main id="main" tabindex="-1">
    <h1>Scarp</h1>
    <img src="/brand/scarp-logo.png" alt="" width="1254" height="1254" decoding="async">
    <label for="example">Example</label>
    <input id="example" aria-describedby="hint">
    <p id="hint">Type a term</p>
  </main>
</body></html>`;

test("valid landmarks, labels, image dimensions, and reference IDs pass", () => {
  assert.deepEqual(accessibilityProblems(valid), []);
});
test("missing or unfocusable skip destinations and duplicate h1 are rejected", () => {
  assert(accessibilityProblems(valid.replace(' tabindex="-1"', "")).some(x => x.includes("focusable")));
  assert(accessibilityProblems(valid.replace('href="#main"', 'href="#other"')).some(x => x.includes("skip-to-content")));
  assert(accessibilityProblems(valid.replace("<h1>Scarp</h1>", "<h1>Scarp</h1><h1>Other</h1>"))
    .some(x => x.includes("exactly one h1")));
});
test("broken ARIA references are reported rather than silently ignored", () => {
  for (const attribute of [
    'aria-controls="missing"', 'aria-labelledby="missing"', 'aria-describedby="missing"',
  ]) assert(accessibilityProblems(valid.replace('aria-controls="main-nav"', attribute))
    .some(x => x.includes("reference: missing")), attribute);
});
test("all visible form controls must have an accessible name", () => {
  assert(accessibilityProblems(valid.replace('for="example"', 'for="other"'))
    .some(x => x.includes("Unlabelled input #example")));
  assert(accessibilityProblems(valid.replace("</main>", '<select id="mode"></select></main>'))
    .some(x => x.includes("Unlabelled select #mode")));
});
test("decorative images need alt and sizes; buttons require explicit type", () => {
  assert(accessibilityProblems(valid.replace('alt=""', "")).some(x => x.includes("Image missing alt")));
  assert(accessibilityProblems(valid.replace('width="1254"', "")).some(x => x.includes("positive width")));
  assert(accessibilityProblems(valid.replace('type="button"', "")).some(x => x.includes("explicit type")));
});
