import { renderToStaticMarkup } from "react-dom/server";
import { SiteContext, type SiteAssets } from "./context.ts";
import { findPage, type SitePage } from "./pages.ts";
import { GET as projectData } from "../pages/project.json.ts";
import { GET as feed } from "../pages/feed.xml.ts";
import { GET as sitemap } from "../pages/sitemap.xml.ts";

export const dataRoutes = [
  { path: "/project.json", create: projectData },
  { path: "/feed.xml", create: feed },
  { path: "/sitemap.xml", create: sitemap },
] as const;

export function renderPage(page: SitePage, assets: SiteAssets): string {
  const Component = page.Component;
  return (
    "<!doctype html>\n" +
    renderToStaticMarkup(
      <SiteContext.Provider value={{ path: page.path, assets }}>
        <Component />
      </SiteContext.Provider>,
    )
  );
}

export async function renderRequest(path: string, assets: SiteAssets) {
  const page = findPage(path);
  if (page)
    return {
      body: renderPage(page, assets),
      status: page.status ?? 200,
      contentType: "text/html; charset=utf-8",
    };
  const data = dataRoutes.find((route) => route.path === path);
  if (!data) return undefined;
  const response = data.create();
  return {
    body: await response.text(),
    status: response.status,
    contentType:
      response.headers.get("content-type") ?? "text/plain; charset=utf-8",
  };
}
