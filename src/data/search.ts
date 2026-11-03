export interface SearchEntry {
  path: string;
  title: string;
  section: string;
  summary: string;
  keywords: readonly string[];
}

/** Reviewed website routes, not a crawler or a live compiler feature feed. */
export const searchEntries: readonly SearchEntry[] = [
  { path: "/", title: "Scarp home", section: "Overview", summary: "Introduction, verified language examples, current status, and next steps.", keywords: ["start", "programming", "language", "official"] },
  { path: "/features/", title: "Language features", section: "Language", summary: "Variables, typed functions, source modules, vectors, and numerical foundations.", keywords: ["syntax", "bind", "var", "funcra", "modules", "tiles"] },
  { path: "/development/", title: "Development status", section: "Project", summary: "What is implemented, what is experimental, and what is still planned.", keywords: ["progress", "compiler", "limitations", "status", "verification"] },
  { path: "/roadmap/", title: "Roadmap", section: "Project", summary: "Milestones, priorities, and the path toward the first stable Scarp release.", keywords: ["future", "planned", "milestones", "stable", "progress"] },
  { path: "/releases/", title: "Releases", section: "Get Scarp", summary: "Published compiler versions, alpha release information, and release history.", keywords: ["version", "changelog", "prerelease", "tags", "alpha"] },
  { path: "/downloads/", title: "Downloads", section: "Get Scarp", summary: "Verified interpreter archives, supported platforms, and checksums.", keywords: ["install", "installation", "windows", "linux", "macos", "checksum", "binary"] },
  { path: "/learn/", title: "Learn Scarp", section: "Learning", summary: "Get started with a first Scarp program and discover learning paths.", keywords: ["tutorial", "guide", "hello world", "beginner", "first program", "syntax"] },
  { path: "/ai/", title: "AI development direction", section: "Language", summary: "Numerical capabilities today and longer-term artificial intelligence plans.", keywords: ["machine learning", "neural", "numerics", "tensor", "tiles", "artificial intelligence"] },
  { path: "/community/", title: "Community", section: "Connect", summary: "Find Scarp discussions, GitHub, social channels, and community resources.", keywords: ["discord", "social", "github", "discuss", "help"] },
  { path: "/contribute/", title: "Contributing", section: "Connect", summary: "Ways to help develop Scarp, review changes, and report issues.", keywords: ["contributors", "pull request", "issues", "code", "guidelines"] },
  { path: "/faq/", title: "Frequently asked questions", section: "Help", summary: "Answers to common questions about the language, its maturity, and tooling.", keywords: ["questions", "answers", "faq", "license", "help"] },
  { path: "/support/", title: "Support", section: "Help", summary: "Get troubleshooting guidance or prepare a useful bug report.", keywords: ["bug", "report", "contact", "troubleshoot", "security", "issue"] },
  { path: "/news/", title: "Project news", section: "News", summary: "Reviewed announcements and updates from the Scarp project.", keywords: ["announcements", "articles", "updates"] },
  { path: "/news/source-modules/", title: "Source modules arrive", section: "News", summary: "Release article covering imports, exports, and Scarp source modules.", keywords: ["module", "import", "export", "alias", "alpha"] },
  { path: "/news/official-website/", title: "Introducing the official website", section: "News", summary: "How the project hub connects to the documentation and community.", keywords: ["launch", "website", "docs", "introduction"] },
];

/** Normalization preserves non-Latin letters while making common Latin accents searchable. */
function normalizeSearchText(value: string): string {
  return value.normalize("NFKD").toLowerCase()
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

function wordMatch(haystack: string, term: string): number {
  const words = normalizeSearchText(haystack).split(" ").filter(Boolean);
  if (words.includes(term)) return 3;
  if (words.some(word => word.startsWith(term))) return 2;
  if (term.length >= 4 && words.some(word => word.includes(term))) return 1;
  return 0;
}

/** All query terms must match. Titles and keywords rank above descriptions. */
export function searchEntriesFor(
  query: string,
  entries: readonly SearchEntry[] = searchEntries,
): SearchEntry[] {
  const terms = [...new Set(normalizeSearchText(query).split(/\s+/).filter(Boolean))].slice(0, 8);
  if (terms.length === 0) return [...entries];

  const matches: { entry: SearchEntry; score: number; order: number }[] = [];
  entries.forEach((entry, order) => {
    let score = 0;
    for (const term of terms) {
      const strength = Math.max(
        wordMatch(entry.title, term) * 6,
        wordMatch(entry.keywords.join(" "), term) * 5,
        wordMatch(entry.summary, term) * 2,
        wordMatch(entry.section, term) * 2,
        wordMatch(entry.path, term),
      );
      if (strength === 0) return;
      score += strength;
    }
    matches.push({ entry, score, order });
  });
  return matches.sort((a, b) => b.score - a.score || a.order - b.order).map(match => match.entry);
}
