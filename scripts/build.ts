import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { build, type Manifest } from "vite";
import { pages, outputPath } from "../src/site/pages.ts";
import { dataRoutes, renderPage } from "../src/site/render.tsx";
import type { SiteAssets } from "../src/site/context.ts";

await build({
  configFile: false,
  input: {
    site: resolve("src/scripts/site.ts"),
    support: resolve("src/scripts/support.ts"),
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    manifest: true,
    modulePreload: false,
  },
});

const manifest = JSON.parse(
  await readFile("dist/.vite/manifest.json", "utf8"),
) as Manifest;
function scriptFor(source: string): string {
  const entry = manifest[source];
  assert(
    entry?.isEntry && entry.file.endsWith(".js"),
    `Missing browser entry: ${source}`,
  );
  return "/" + entry.file;
}
async function stylesheet(name: string): Promise<string> {
  const css = await readFile(`src/styles/${name}.css`);
  const hash = createHash("sha256").update(css).digest("hex").slice(0, 12);
  const path = `assets/${name}-${hash}.css`;
  await mkdir("dist/assets", { recursive: true });
  await writeFile(join("dist", path), css);
  return "/" + path;
}
const assets: SiteAssets = {
  siteScript: scriptFor("src/scripts/site.ts"),
  supportScript: scriptFor("src/scripts/support.ts"),
  globalStyle: await stylesheet("global"),
  supportStyle: await stylesheet("support"),
};
for (const page of pages) {
  const path = join("dist", outputPath(page));
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, renderPage(page, assets));
}
for (const route of dataRoutes) {
  await writeFile(
    join("dist", route.path.slice(1)),
    await route.create().text(),
  );
}
console.log(
  `Rendered ${pages.length} static pages from TypeScript/TSX and ${dataRoutes.length} data endpoints.`,
);
