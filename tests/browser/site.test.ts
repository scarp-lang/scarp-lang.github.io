import assert from "node:assert/strict";
import { createServer, type Server } from "node:http";
import { mkdir, readFile, stat } from "node:fs/promises";
import { extname, join, resolve, sep } from "node:path";
import { before, after, test } from "node:test";
import { chromium, type Browser, type BrowserContextOptions, type Page } from "playwright-core";

let origin: string;
let server: Server;
let browser: Browser;
const distRoot = resolve("dist");
const mimeTypes: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".webp": "image/webp",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".xml": "application/xml",
};

async function startStaticServer(): Promise<void> {
  // Serve the exact production dist/ output, without a development-server fallback.
  server = createServer(async (request, response) => {
    try {
      const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
      const relative = decodeURIComponent(pathname).replace(/^\/+/, "");
      const requested = resolve(distRoot, relative || "index.html");
      if (!requested.startsWith(distRoot + sep)) {
        response.writeHead(403).end();
        return;
      }
      const info = await stat(requested);
      const filePath = info.isDirectory() ? join(requested, "index.html") : requested;
      const content = await readFile(filePath);
      response.writeHead(200, {
        "Content-Type": mimeTypes[extname(filePath)] ?? "application/octet-stream",
        "Cache-Control": "no-store",
      }).end(content);
    } catch {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
    }
  });
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      server.off("error", reject);
      resolve();
    });
  });
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Missing HTTP test port");
  origin = "http://127.0.0.1:" + address.port;
}

before(async () => {
  await startStaticServer();
  browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--no-sandbox"] });
}, { timeout: 45_000 });

after(async () => {
  if (browser) await browser.close();
  if (server?.listening) await new Promise<void>((resolve, reject) => {
    server.close(error => error ? reject(error) : resolve());
  });
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


type ColorSample = { foreground: string; background: string; label: string; minimum?: number };

/** Sample actual computed browser colors rather than assuming CSS variables. */
async function requireContrast(page: Page, route: string, samples: ColorSample[]): Promise<void> {
  const results = await page.evaluate((cases) => {
    function channels(css: string): [number, number, number] {
      const match = css.match(/^rgba?\((.+)\)$/);
      if (!match) throw new Error("Unsupported computed color: " + css);
      const components = match[1]!.split(/[\s,/]+/).filter(Boolean).map(Number);
      if (components.length < 3 || components.slice(0, 3).some(v => !Number.isFinite(v)))
        throw new Error("Unparseable computed color: " + css);
      return [components[0]!, components[1]!, components[2]!];
    }
    function luminance(rgb: [number, number, number]): number {
      const [red, green, blue] = rgb.map(value => {
        const linear = value / 255;
        return linear <= 0.04045 ? linear / 12.92 : ((linear + 0.055) / 1.055) ** 2.4;
      });
      return red! * 0.2126 + green! * 0.7152 + blue! * 0.0722;
    }
    return cases.map(sample => {
      const fg = document.querySelector(sample.foreground);
      const bg = document.querySelector(sample.background);
      if (!fg || !bg) return { label: sample.label, error: "Missing foreground/background element" };
      const color = getComputedStyle(fg).color;
      const background = getComputedStyle(bg).backgroundColor;
      const foregroundLuminance = luminance(channels(color));
      const backgroundLuminance = luminance(channels(background));
      const ratio = (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
        (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
      return { label: sample.label, ratio, color, background };
    });
  }, samples);
  for (let i = 0; i < results.length; i++) {
    const sample = samples[i]!;
    const result = results[i]!;
    if ("error" in result) assert.fail(route + " " + sample.label + ": " + result.error);
    assert(result.ratio! >= (sample.minimum ?? 4.5),
      route + " " + sample.label + ": ratio " + result.ratio!.toFixed(2) +
      " is below " + (sample.minimum ?? 4.5) + " (" + result.color +
      " on " + result.background + ")");
  }
}

test("light and dark themes maintain AA text contrast across critical pages", async () => {
  const sampleCases: Array<{ route: string; samples: ColorSample[] }> = [
    { route: "/", samples: [
      { label: "hero heading", foreground: ".hero h1", background: "body" },
      { label: "hero supporting text", foreground: ".hero-detail", background: "body" },
      { label: "primary CTA", foreground: ".hero .primary", background: ".hero .primary" },
      { label: "secondary CTA", foreground: ".hero .secondary", background: ".hero .secondary" },
      { label: "feature description", foreground: ".feature p", background: ".feature" },
      { label: "code panel", foreground: ".code-block", background: ".code-block" },
    ] },
    { route: "/search/", samples: [
      { label: "search input", foreground: ".site-search-controls input", background: ".site-search-controls input" },
      { label: "result card", foreground: ".site-search-results a", background: ".site-search-results a" },
      { label: "result detail", foreground: ".site-search-results p", background: ".site-search-results a" },
    ] },
    { route: "/downloads/", samples: [
      { label: "intro", foreground: ".page-heading .lead", background: "body" },
      { label: "download card", foreground: ".download-card", background: ".download-card" },
      { label: "download details", foreground: ".download-card details", background: ".download-card" },
    ] },
    { route: "/support/", samples: [
      { label: "support intro", foreground: ".page-heading .lead", background: "body" },
      { label: "support topic", foreground: ".support-topic", background: ".support-topic" },
      { label: "support description", foreground: ".support-topic p", background: ".support-topic" },
      { label: "support form input", foreground: ".support-builder input", background: ".support-builder input" },
    ] },
  ];

  for (const theme of ["light", "dark"] as const) {
    await inPage("contrast-" + theme, {
      viewport: { width: 390, height: 844 },
      colorScheme: theme,
      reducedMotion: "reduce",
    }, async page => {
      for (const { route, samples } of sampleCases) {
        await page.goto(origin + route, { waitUntil: "networkidle" });
        assert.equal(await page.locator("html").getAttribute("data-theme"), theme);
        await requireContrast(page, theme + " " + route, samples);
      }
    });
  }
});

test("theme preference survives navigation and reload, and has an accessible toggle label", async () => {
  await inPage("theme-persistence", {
    viewport: { width: 390, height: 844 },
    colorScheme: "light",
  }, async page => {
    await page.goto(origin + "/", { waitUntil: "networkidle" });
    const button = page.locator("[data-theme-toggle]");
    assert.equal(await button.getAttribute("aria-label"), "Switch to dark theme");
    await button.click();
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    assert.equal(await button.getAttribute("aria-label"), "Switch to light theme");
    assert.equal(await page.evaluate(() => localStorage.getItem("scarp-theme")), "dark");
    await page.goto(origin + "/downloads/", { waitUntil: "networkidle" });
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    await page.locator("[data-theme-toggle]").click();
    assert.equal(await page.locator("html").getAttribute("data-theme"), "light");
  });
});

test("capture reproducible light/dark screenshots for visual review", async () => {
  const views = [
    { name: "home-desktop-light", route: "/", theme: "light", width: 1280, height: 800 },
    { name: "home-mobile-dark", route: "/", theme: "dark", width: 390, height: 844 },
    { name: "search-mobile-light", route: "/search/", theme: "light", width: 390, height: 844 },
    { name: "support-desktop-dark", route: "/support/", theme: "dark", width: 1280, height: 800 },
  ] as const;
  await mkdir("test-results/browser/visual", { recursive: true });
  for (const view of views) {
    await inPage("visual-" + view.name, {
      viewport: { width: view.width, height: view.height },
      colorScheme: view.theme,
      reducedMotion: "reduce",
    }, async page => {
      await page.goto(origin + view.route, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator("html").getAttribute("data-theme"), view.theme);
      await page.screenshot({
        path: "test-results/browser/visual/" + view.name + ".png",
        fullPage: true,
        animations: "disabled",
        caret: "hide",
      });
    });
  }
});
