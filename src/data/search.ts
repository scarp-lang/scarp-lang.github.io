import { hindiSearchAliases } from "./search-hi.ts";

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
  { path: "/ecosystem/", title: "Scarp ecosystem", section: "Projects", summary: "Find the compiler, official docs, browser Playground, Scarp by Example, and VS Code extension.", keywords: ["projects", "tools", "vscode", "playground", "docs", "editor", "learn", "wasm", "examples"] },
  { path: "/features/", title: "Language features", section: "Language", summary: "Variables, typed functions, source modules, vectors, and numerical foundations.", keywords: ["syntax", "bind", "var", "funcra", "modules", "tiles"] },
  { path: "/development/", title: "Development status", section: "Project", summary: "What is implemented, what is experimental, and what is still planned.", keywords: ["progress", "compiler", "limitations", "status", "verification"] },
  { path: "/roadmap/", title: "Roadmap", section: "Project", summary: "Milestones, priorities, and the path toward the first stable Scarp release.", keywords: ["future", "planned", "milestones", "stable", "progress"] },
  { path: "/compatibility/", title: "Compiler compatibility", section: "Developer guidance", summary: "Evidence-backed results for Scarp alpha.1 and alpha.6 website examples, including exact compiler revisions and CLI changes.", keywords: ["version", "examples", "verify", "exec", "run", "source", "tested", "fixtures", "alpha"] },
  { path: "/migration/", title: "Scarp CLI migration guide", section: "Developer guidance", summary: "Move from legacy run and check to exec and static verify, compare alpha.1 through alpha.6 commands, and learn alpha.4 projects and alpha.5 module inspection and alpha.6 symbol navigation.", keywords: ["migration", "upgrade", "migrate", "cli", "check", "verify", "exec", "modules", "alpha", "projects", "legacy", "versions"] },
  { path: "/releases/", title: "Releases", section: "Get Scarp", summary: "Published compiler versions, alpha release information, and release history.", keywords: ["version", "changelog", "prerelease", "tags", "alpha"] },
  { path: "/downloads/", title: "Downloads", section: "Get Scarp", summary: "Verified interpreter archives, supported platforms, and checksums.", keywords: ["install", "installation", "windows", "linux", "macos", "checksum", "binary"] },
  { path: "/learn/", title: "Learn Scarp", section: "Learning", summary: "Get started with a first Scarp program and discover learning paths.", keywords: ["tutorial", "guide", "hello world", "beginner", "first program", "syntax"] },
  { path: "/ai/", title: "AI development direction", section: "Language", summary: "Numerical capabilities today and longer-term artificial intelligence plans.", keywords: ["machine learning", "neural", "numerics", "tensor", "tiles", "artificial intelligence"] },
  { path: "/community/", title: "Community", section: "Connect", summary: "Find Scarp discussions, GitHub, social channels, and community resources.", keywords: ["discord", "social", "github", "discuss", "help"] },
  { path: "/contribute/", title: "Contributing", section: "Connect", summary: "Ways to help develop Scarp, review changes, and report issues.", keywords: ["contributors", "pull request", "issues", "code", "guidelines"] },
  { path: "/faq/", title: "Frequently asked questions", section: "Help", summary: "Answers to common questions about the language, its maturity, and tooling.", keywords: ["questions", "answers", "faq", "license", "help"] },
  { path: "/support/", title: "Support", section: "Help", summary: "Get troubleshooting guidance or prepare a useful bug report.", keywords: ["bug", "report", "contact", "troubleshoot", "security", "issue"] },
  { path: "/news/alpha8-project-tests/", title: "Scarp alpha.8: declarative projects and tests", section: "News", summary: "The alpha.8 prerelease introduces scarp.project, init/run, test discovery and execution, assertions, JSON reports and input fixtures.", keywords: ["alpha8", "release", "project", "manifest", "scarp.project", "init", "run", "test", "assert", "stdin", "filter", "json"] },
  { path: "/news/alpha6-conditional-unicode/", title: "Scarp alpha.6.7: conditional values and Unicode escapes", section: "News", summary: "Published alpha.6.7 adds value-returning if/elif/else expressions and Unicode scalar escapes in string literals.", keywords: ["conditional", "if", "elif", "else", "lazy", "unicode", "escape", "scalar", "alpha7", "release"] },
  { path: "/news/alpha6-input-tuples/", title: "Scarp alpha.6.6: input and typed tuples", section: "News", summary: "Published alpha.6.6 adds redirected read_line input, checked text conversions and immutable heterogeneous tuples with strict resource bounds.", keywords: ["read_line", "input", "stdin", "tuple", "text_to_integer", "text_to_float", "integer_to_text", "text_trim", "text_replace", "alpha6", "release"] },
  { path: "/news/alpha6-nucleus-correlation/", title: "Scarp alpha.6.5: Top-P and Pearson correlation", section: "News", summary: "Published alpha.6.5 adds deterministic nucleus selection, pearson_correlation and a narrow ELF64 integer-object emitter extension.", keywords: ["nucleus", "top_p", "top_p_values", "pearson_correlation", "correlation", "statistics", "probabilities", "alpha6", "release"] },
  { path: "/news/alpha6-ranking-temperature/", title: "Scarp alpha.6.3: Top-K and temperature softmax", section: "News", summary: "The experimental published alpha.6.3 adds deterministic topk score ranking, temperature-controlled softmax and internal scalar IR correctness work.", keywords: ["alpha6", "alpha3", "topk", "topk_values", "softmax_temp", "logsoftmax_temp", "temperature", "ranking", "inference", "numerical", "release"] },
  { path: "/news/alpha6-cache-apis/", title: "Scarp alpha.6.2: optional compiler caches", section: "News", summary: "Published alpha.6.2 adds opt-in bounded token, syntax and semantic caches plus dependency-aware invalidation and eviction through Rust APIs, not CLI flags.", keywords: ["cache", "caching", "invalidation", "syntax", "tokens", "semantic", "Rust", "embedding", "alpha6", "release"] },
  { path: "/news/alpha6-symbol-navigation/", title: "Scarp alpha.6: symbol navigation and vector RMS", section: "News", summary: "Published alpha.6 adds schema-v1 cross-file symbol/reference inspection and a finite vector RMS builtin, without an LSP or native compile CLI.", keywords: ["rms", "root mean square", "symbols", "references", "goto definition", "source navigation", "alpha6", "inspect", "compiler", "release"] },
  { path: "/news/alpha5-project-inspection/", title: "Scarp alpha.5: project module inspection", section: "News", summary: "Published alpha.5 supports project-directory module inspection and a restricted Rust embedding C11 emitter, without a native compile CLI.", keywords: ["release", "alpha", "C11", "c backend", "native", "inspect", "modules", "project", "embedding", "compiler", "code generation"] },
  { path: "/news/offline-projects/", title: "Scarp alpha.4: offline project workflows", section: "News", summary: "Scarp v0.0.5-alpha.4 adds offline create, verify and launch commands with a Scarp.project manifest.", keywords: ["release", "alpha", "project", "manifest", "create", "verify", "launch", "offline", "cli"] },
  { path: "/news/", title: "Project news", section: "News", summary: "Reviewed announcements and updates from the Scarp project.", keywords: ["announcements", "articles", "updates"] },
  { path: "/news/source-modules/", title: "Source modules arrive", section: "News", summary: "Release article covering imports, exports, and Scarp source modules.", keywords: ["module", "import", "export", "alias", "alpha"] },
  { path: "/news/official-website/", title: "Introducing the official website", section: "News", summary: "How the project hub connects to the documentation and community.", keywords: ["launch", "website", "docs", "introduction"] },
];

/** Preserve Indic vowel signs while folding Latin accents for search. */
function normalizeSearchText(value: string): string {
  return value.normalize("NFKD").toLowerCase()
    .replace(/(\p{Script=Latin})\p{M}+/gu, "$1")
    .replace(/[^\p{L}\p{N}\p{M}]+/gu, " ").trim();
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
        wordMatch(hindiSearchAliases[entry.path]?.join(" ") ?? "", term) * 5,
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
