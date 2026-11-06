import assert from "node:assert/strict";
import { spawn, type ChildProcess } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { before, after, test } from "node:test";
import { chromium, type Browser, type BrowserContextOptions, type Page } from "playwright-core";

const origin = "http://127.0.0.1:4173";
let server: ChildProcess | undefined;
let browser: Browser;

async function startPreview(): Promise<void> {
  server = spawn(process.execPath, [
    resolve("node_modules/vite/bin/vite.js"),
    "preview", "--host", "127.0.0.1", "--port", "4173", "--strictPort",
  ], { stdio: ["ignore", "pipe", "pipe"] });
  let output = "";
  server.stdout?.on("data", chunk => { output += String(chunk); });
  server.stderr?.on("data", chunk => { output += String(chunk); });

  for (let attempt = 0; attempt < 80; attempt++) {
    if (server.exitCode !== null) throw new Error("Preview exited: " + output);
    try {
      const response = await fetch(origin + "/", { signal: AbortSignal.timeout(1000) });
      if (response.ok && (await response.text()).includes("Scarp")) return;
    } catch { /* The server may still be starting. */ }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error("Preview did not start: " + output);
}

before(async () => {
  await startPreview();
  browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--no-sandbox"] });
}, { timeout: 45_000 });

after(async () => {
  if (browser) await browser.close();
  server?.kill("SIGTERM");
});

async function inPage(
  name: string,
  options: BrowserContextOptions,
  run: (page: Page) => Promise<void>,
): Promise<void> {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  try {
    await run(page);
    assert.deepEqual(errors, [], name + ": browser script exceptions");
  } catch (error) {
    await mkdir("test-results/browser", { recursive: true });
    await page.screenshot({
      path: "test-results/browser/" + name + ".png",
      fullPage: true,
      timeout: 6000,
    }).catch(() => undefined);
    throw error;
  } finally {
    await context.close();
  }
}

test("mobile menu toggles, Escape restores focus, and navigation follows links", async () => {
  await inPage("mobile-navigation", { viewport: { width: 390, height: 844 } }, async page => {
    await page.goto(origin + "/", { waitUntil: "networkidle" });
    const menu = page.locator("[data-menu]");
    const nav = page.locator("#main-nav");
    assert.equal(await menu.isVisible(), true);
    assert.equal(await menu.getAttribute("aria-expanded"), "false");
    assert.equal(await nav.isVisible(), false);
    await menu.click();
    assert.equal(await menu.getAttribute("aria-expanded"), "true");
    assert.equal(await nav.isVisible(), true);
    await page.keyboard.press("Escape");
    assert.equal(await menu.getAttribute("aria-expanded"), "false");
    assert.equal(await nav.isVisible(), false);
    assert.equal(await menu.evaluate(element => element === document.activeElement), true);
    await menu.click();
    await page.locator('#main-nav a[href="/features/"]').click();
    await page.waitForURL("**/features/");
    assert.equal(await page.locator("#main-nav").isVisible(), false);
  });
});

test("critical pages fit 320, 390, 768, and 1280 pixel viewports", async () => {
  await inPage("responsive-overflow", { viewport: { width: 320, height: 720 } }, async page => {
    for (const width of [320, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 844 });
      for (const route of ["/", "/search/", "/downloads/", "/support/"]) {
        await page.goto(origin + route, { waitUntil: "networkidle" });
        const metrics = await page.evaluate(() => ({
          document: document.documentElement.scrollWidth,
          viewport: document.documentElement.clientWidth,
        }));
        assert(metrics.document <= metrics.viewport + 1,
          route + " at " + width + "px overflows: document=" + metrics.document +
          ", viewport=" + metrics.viewport);
      }
    }
  });
});

test("global shortcut focuses search and Hindi filtering announces results", async () => {
  await inPage("search-keyboard", { viewport: { width: 390, height: 844 } }, async page => {
    await page.goto(origin + "/", { waitUntil: "networkidle" });
    await page.keyboard.press("/");
    await page.waitForURL(/\/search\/#site-search-input$/);
    const input = page.locator("#site-search-input");
    assert.equal(await input.evaluate(element => element === document.activeElement), true);
    await input.fill("डाउनलोड");
    assert.equal(await page.locator("[data-search-item]:visible").count(), 1);
    assert.equal(await page.locator("[data-search-item]:visible").first().getAttribute("data-search-path"), "/downloads/");
    assert.equal(await page.locator("[data-search-status]").textContent(), "1 result.");
    await input.press("Escape");
    assert.equal(await input.inputValue(), "");
    assert(await page.locator("[data-search-item]:visible").count() >= 20);
    await input.fill("notfoundanywhere12345");
    assert.equal(await page.locator("[data-search-empty]").isVisible(), true);
    await page.locator("[data-search-clear]").click();
    assert.equal(await input.inputValue(), "");
    assert.equal(await page.locator("[data-search-empty]").isVisible(), false);
  });
});

test("example tabs select panels with arrow and Home/End keys", async () => {
  await inPage("example-tabs", { viewport: { width: 1280, height: 800 } }, async page => {
    await page.goto(origin + "/", { waitUntil: "networkidle" });
    const tabs = page.locator("[data-tab]");
    const panels = page.locator("[data-panel]");
    assert.equal(await tabs.count(), 3);
    assert.equal(await tabs.nth(0).getAttribute("aria-selected"), "true");
    assert.equal(await panels.nth(0).isVisible(), true);
    assert.equal(await panels.nth(1).isVisible(), false);
    await tabs.nth(0).focus();
    await page.keyboard.press("ArrowRight");
    assert.equal(await tabs.nth(1).getAttribute("aria-selected"), "true");
    assert.equal(await panels.nth(1).isVisible(), true);
    assert.equal(await tabs.nth(1).evaluate(element => element === document.activeElement), true);
    await page.keyboard.press("End");
    assert.equal(await tabs.nth(2).getAttribute("aria-selected"), "true");
    await page.keyboard.press("Home");
    assert.equal(await tabs.nth(0).getAttribute("aria-selected"), "true");
  });
});

test("with JavaScript disabled examples, directory, and links remain usable", async () => {
  await inPage("no-javascript", { viewport: { width: 390, height: 844 }, javaScriptEnabled: false }, async page => {
    await page.goto(origin + "/", { waitUntil: "domcontentloaded" });
    assert.equal(await page.locator("[data-panel]:visible").count(), 3);
    assert.equal(await page.locator("[data-tabs]").isVisible(), false);
    await page.goto(origin + "/search/", { waitUntil: "domcontentloaded" });
    assert.equal(await page.locator("[data-search-form]").isVisible(), false);
    assert(await page.locator("[data-search-item]:visible").count() >= 20);
    assert.equal(await page.locator("#main-nav").isVisible(), true);
  });
});

test("skip link reaches main and header loads WebP rather than the original PNG", async () => {
  await inPage("skip-and-logo", { viewport: { width: 390, height: 844 } }, async page => {
    await page.goto(origin + "/", { waitUntil: "networkidle" });
    await page.keyboard.press("Tab");
    assert.equal(await page.locator(".skip-link").evaluate(element => element === document.activeElement), true);
    await page.keyboard.press("Enter");
    assert.equal(new URL(page.url()).hash, "#main");
    assert.equal(await page.locator("main").getAttribute("tabindex"), "-1");
    const loaded = await page.evaluate(() =>
      performance.getEntriesByType("resource").map(entry => new URL(entry.name).pathname));
    assert(loaded.includes("/brand/scarp-logo.webp"), "Optimized WebP logo was not loaded");
    assert(!loaded.includes("/brand/scarp-logo.png"), "Source PNG was fetched for the header");
    assert.equal(await page.locator('link[rel="icon"]').getAttribute("href"), "/brand/scarp-favicon.png");
  });
});
