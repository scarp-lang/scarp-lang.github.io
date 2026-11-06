import Article from "../../layouts/Article.tsx";
import { project } from "../../data/project.ts";

/** A dated release note: never substitute the mutable latest-publication pin. */
const release = {
  tag: "v0.0.6-alpha.2",
  date: "2026-11-06",
  source: "398b8ff705154a02423fe458ce3a427401e81e31",
} as const;

const sourceDoc = (path: string) => `${project.repo}/blob/${release.source}/${path}`;

export default function Alpha6CacheApisPage() {
  return (
    <Article
      title="Scarp alpha.6.2: bounded compiler caches and careful invalidation"
      description="The experimental Scarp v0.0.6-alpha.2 prerelease adds optional Rust embedding caches, dependency-aware edit planning and source-scoped eviction. These are not new CLI commands."
      eyebrow="Language prerelease · Reviewed source"
      date={release.date}
    >
      <p>
        <strong>{release.tag}</strong> was published on 6 November 2026.
        It adds optional caching and invalidation tools for applications embedding
        the Scarp compiler in Rust. The interpreter-backed CLI, source language
        syntax and supported C11 subset are unchanged. This is not a stable release.
      </p>
      <h2 id="cache-tiers">Three independent cache tiers</h2>
      <p>
        Opt-in per-source <strong>token</strong> and parsed <strong>syntax</strong>
        caches reuse successful lexing and parsing, while a caller-owned
        whole-graph <strong>semantic</strong> cache reuses resolution only when
        the current loader graph, source bytes, imports, limits and supplied
        revisions match. Diagnostics and compiler validation are never bypassed.
        Nested source locations are rebased before reuse.
      </p>
      <p>
        These are Rust embedding APIs for compatible source checkouts, not
        additional <code>scarp</code> flags or prebuilt libraries in the archives.
        Read the <a href={sourceDoc("docs/development/token-cache.md")}>token cache</a>,
        {" "}<a href={sourceDoc("docs/development/syntax-cache.md")}>syntax cache</a> and
        {" "}<a href={sourceDoc("docs/development/semantic-cache.md")}>semantic cache</a> contracts.
      </p>
      <h2 id="invalidate">Dependency-aware planning and source eviction</h2>
      <p>
        A bounded dependency planner identifies transitive importers affected by
        edits using trusted loader identities. Unknown identities cause
        conservative invalidation; malformed edit batches must not mutate caches.
        Embedders can also evict entries associated with a particular source.
        The planner and eviction logic do not provide a file watcher or an
        automatic incremental language server.
      </p>
      <p>
        See the <a href={sourceDoc("docs/development/cache-edit-planning.md")}>edit planning</a>,
        {" "}<a href={sourceDoc("docs/development/incremental-invalidation.md")}>invalidation</a> and
        {" "}<a href={sourceDoc("docs/development/cache-eviction.md")}>eviction</a> contracts.
        Cache quotas bound retained logical payloads, not total process heap usage.
        Performance improvements vary with the embedder and workload.
      </p>
      <h2 id="limits">What does not change?</h2>
      <p>
        The release retains <code>inspect symbols</code>, <code>inspect references</code>,
        offline projects and finite-vector <code>rms</code> from alpha.6.1.
        There is no <code>scarp compile</code> CLI, general native executable
        compiler, stable ABI, LSP, GPU engine or built-in package registry.
        The restricted scalar C11 emitter remains an experimental Rust API.
      </p>
      <p>
        Read the <a href={project.repo + "/releases/tag/" + release.tag}>official release notes</a>,
        {" "}<a href={project.repo + "/commit/" + release.source}>exact source commit</a>,
        {" "}<a href="/downloads/">verified downloads</a> or
        {" "}<a href="/compatibility/">tested example coverage</a>. The
        {" "}<a href="/news/alpha6-symbol-navigation/">earlier alpha.6.1 announcement</a>
        remains pinned to its original release.
      </p>
    </Article>
  );
}
