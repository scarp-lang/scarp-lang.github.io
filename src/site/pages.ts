import type { ComponentType } from "react";
import Home from "../pages/index.tsx";
import Features from "../pages/features.tsx";
import Development from "../pages/development.tsx";
import Roadmap from "../pages/roadmap.tsx";
import Releases from "../pages/releases.tsx";
import Downloads from "../pages/downloads.tsx";
import { WindowsLatestDownload, LinuxLatestDownload, MacosLatestDownload } from "../pages/download-latest.tsx";
import Learn from "../pages/learn.tsx";
import Ai from "../pages/ai.tsx";
import Community from "../pages/community.tsx";
import Contribute from "../pages/contribute.tsx";
import Faq from "../pages/faq.tsx";
import Support from "../pages/support.tsx";
import News from "../pages/news/index.tsx";
import Alpha6ConditionalUnicode from "../pages/news/alpha6-conditional-unicode.tsx";
import Alpha8ProjectsAndTests from "../pages/news/alpha8-project-tests.tsx";
import Alpha9BigIntReports from "../pages/news/alpha9-bigint-reports.tsx";
import Alpha10InteractiveArrays from "../pages/news/alpha10-interactive-arrays.tsx";
import Alpha11ExactDecimal from "../pages/news/alpha11-exact-decimal.tsx";
import Alpha17ArraysInput from "../pages/news/alpha17-arrays-input.tsx";
import Alpha18ExecLifetime from "../pages/news/alpha18-exec-lifetime.tsx";
import V007Alpha3 from "../pages/news/v007-alpha3-generics-native.tsx";
import V007Alpha1 from "../pages/news/v007-alpha1-native-loops.tsx";
import Alpha20NativeDecimalTuples from "../pages/news/alpha20-native-decimal-tuples.tsx";
import Alpha19HostCallables from "../pages/news/alpha19-host-callables.tsx";
import Alpha16OrderStatistics from "../pages/news/alpha16-order-statistics.tsx";
import Alpha15RuntimeKernels from "../pages/news/alpha15-runtime-kernels.tsx";
import Alpha14PatternsNative from "../pages/news/alpha14-patterns-native.tsx";
import Alpha13EditorCaches from "../pages/news/alpha13-editor-caches.tsx";
import Alpha12RecordsCollections from "../pages/news/alpha12-records-collections.tsx";
import OfflineProjects from "../pages/news/offline-projects.tsx";
import Alpha6SymbolNavigation from "../pages/news/alpha6-symbol-navigation.tsx";
import Alpha6CacheApis from "../pages/news/alpha6-cache-apis.tsx";
import Alpha6RankingTemperature from "../pages/news/alpha6-ranking-temperature.tsx";
import Alpha6NucleusCorrelation from "../pages/news/alpha6-nucleus-correlation.tsx";
import Alpha6InputTuples from "../pages/news/alpha6-input-tuples.tsx";
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
  { path: "/downloads/windows/latest/", Component: WindowsLatestDownload, noindex: true },
  { path: "/downloads/linux/latest/", Component: LinuxLatestDownload, noindex: true },
  { path: "/downloads/macos/latest/", Component: MacosLatestDownload, noindex: true },
  { path: "/learn/", Component: Learn },
  { path: "/ai/", Component: Ai },
  { path: "/community/", Component: Community },
  { path: "/contribute/", Component: Contribute },
  { path: "/faq/", Component: Faq },
  { path: "/support/", Component: Support },
  { path: "/search/", Component: Search },
  { path: "/news/", Component: News },
  { path: "/news/v007-alpha3-generics-native/", Component: V007Alpha3 },
  { path: "/news/v007-alpha1-native-loops/", Component: V007Alpha1 },
  { path: "/news/alpha20-native-decimal-tuples/", Component: Alpha20NativeDecimalTuples },
  { path: "/news/alpha19-host-callables/", Component: Alpha19HostCallables },
  { path: "/news/alpha18-exec-lifetime/", Component: Alpha18ExecLifetime },
  { path: "/news/alpha17-arrays-input/", Component: Alpha17ArraysInput },
  { path: "/news/alpha16-order-statistics/", Component: Alpha16OrderStatistics },
  { path: "/news/alpha15-runtime-kernels/", Component: Alpha15RuntimeKernels },
  { path: "/news/alpha14-patterns-native/", Component: Alpha14PatternsNative },
  { path: "/news/alpha13-editor-caches/", Component: Alpha13EditorCaches },
  { path: "/news/alpha12-records-collections/", Component: Alpha12RecordsCollections },
  { path: "/news/alpha11-exact-decimal/", Component: Alpha11ExactDecimal },
  { path: "/news/alpha10-interactive-arrays/", Component: Alpha10InteractiveArrays },
  { path: "/news/alpha9-bigint-reports/", Component: Alpha9BigIntReports },
  { path: "/news/alpha8-project-tests/", Component: Alpha8ProjectsAndTests },
  { path: "/news/alpha6-conditional-unicode/", Component: Alpha6ConditionalUnicode },
  { path: "/news/alpha6-input-tuples/", Component: Alpha6InputTuples },
  { path: "/news/alpha6-nucleus-correlation/", Component: Alpha6NucleusCorrelation },
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
