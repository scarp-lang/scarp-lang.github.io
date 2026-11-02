import type { ComponentType } from "react";
import Home from "../pages/index.tsx";
import Features from "../pages/features.tsx";
import Development from "../pages/development.tsx";
import Roadmap from "../pages/roadmap.tsx";
import Releases from "../pages/releases.tsx";
import Downloads from "../pages/downloads.tsx";
import Learn from "../pages/learn.tsx";
import Ai from "../pages/ai.tsx";
import Community from "../pages/community.tsx";
import Contribute from "../pages/contribute.tsx";
import Faq from "../pages/faq.tsx";
import Support from "../pages/support.tsx";
import News from "../pages/news/index.tsx";
import SourceModules from "../pages/news/source-modules.tsx";
import OfficialWebsite from "../pages/news/official-website.tsx";
import NotFound from "../pages/404.tsx";

export interface SitePage {
  path: `/${string}`;
  Component: ComponentType;
  noindex?: boolean;
  status?: 200 | 404;
}

export const pages: readonly SitePage[] = [
  { path: "/", Component: Home },
  { path: "/features/", Component: Features },
  { path: "/development/", Component: Development },
  { path: "/roadmap/", Component: Roadmap },
  { path: "/releases/", Component: Releases },
  { path: "/downloads/", Component: Downloads },
  { path: "/learn/", Component: Learn },
  { path: "/ai/", Component: Ai },
  { path: "/community/", Component: Community },
  { path: "/contribute/", Component: Contribute },
  { path: "/faq/", Component: Faq },
  { path: "/support/", Component: Support },
  { path: "/news/", Component: News },
  { path: "/news/source-modules/", Component: SourceModules },
  { path: "/news/official-website/", Component: OfficialWebsite },
  { path: "/404.html", Component: NotFound, noindex: true, status: 404 },
];

export function findPage(path: string): SitePage | undefined {
  let normalized = path.split(/[?#]/, 1)[0] || "/";
  if (normalized.endsWith("/index.html")) normalized = normalized.slice(0, -10);
  if (normalized !== "/404.html" && !normalized.endsWith("/"))
    normalized += "/";
  return pages.find((page) => page.path === normalized);
}

export function outputPath(page: SitePage): string {
  return page.path === "/404.html"
    ? "404.html"
    : `${page.path.slice(1)}index.html`;
}
