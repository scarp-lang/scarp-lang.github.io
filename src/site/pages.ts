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
import OfflineProjects from "../pages/news/offline-projects.tsx";
import Alpha6SymbolNavigation from "../pages/news/alpha6-symbol-navigation.tsx";
import Alpha6CacheApis from "../pages/news/alpha6-cache-apis.tsx";
import Alpha6RankingTemperature from "../pages/news/alpha6-ranking-temperature.tsx";
import Alpha5ProjectInspection from "../pages/news/alpha5-project-inspection.tsx";
import SourceModules from "../pages/news/source-modules.tsx";
import OfficialWebsite from "../pages/news/official-website.tsx";
import NotFound from "../pages/404.tsx";
import Search from "../pages/search.tsx";
import Ecosystem from "../pages/ecosystem.tsx";
import Compatibility from "../pages/compatibility.tsx";
import Migration from "../pages/migration.tsx";

export interface SitePage {
  path: `/${string}`;
  Component: ComponentType;
  noindex?: boolean;
  status?: 200 | 404;
}

export const pages: readonly SitePage[] = [
  { path: "/", Component: Home },
  { path: "/features/", Component: Features },
  { path: "/ecosystem/", Component: Ecosystem },
  { path: "/development/", Component: Development },
  { path: "/roadmap/", Component: Roadmap },
  { path: "/releases/", Component: Releases },
  { path: "/compatibility/", Component: Compatibility },
  { path: "/migration/", Component: Migration },
  { path: "/downloads/", Component: Downloads },
  { path: "/learn/", Component: Learn },
  { path: "/ai/", Component: Ai },
  { path: "/community/", Component: Community },
  { path: "/contribute/", Component: Contribute },
  { path: "/faq/", Component: Faq },
  { path: "/support/", Component: Support },
  { path: "/search/", Component: Search },
  { path: "/news/", Component: News },
  { path: "/news/alpha6-ranking-temperature/", Component: Alpha6RankingTemperature },
  { path: "/news/alpha6-cache-apis/", Component: Alpha6CacheApis },
  { path: "/news/alpha6-symbol-navigation/", Component: Alpha6SymbolNavigation },
  { path: "/news/alpha5-project-inspection/", Component: Alpha5ProjectInspection },
  { path: "/news/offline-projects/", Component: OfflineProjects },
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
