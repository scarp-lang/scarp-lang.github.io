import Article from "../../layouts/Article.tsx";
import { project } from "../../data/project.ts";

/** Historical alpha.14 facts are permanently pinned to its published source. */
const release = {
  tag: "v0.0.6-alpha.14",
  date: "2026-11-18",
  source: "43627b74af5fccccc5e233e98207413983ebafc1",
} as const;
const pinnedFile = (path: string) => `${project.repo}/blob/${release.source}/${path}`;

export default function Alpha14PatternsNative() {
  return (
    <Article
      title="Scarp alpha.14: precise patterns and checked native arithmetic"
      description="Scarp v0.0.6-alpha.14 improves nested pattern diagnostics, live editor cache resizing and a restricted Rust-only checked integer ELF64 object emitter."
      eyebrow="Language prerelease · Published source"
      date={release.date}
    >
      <p>
        <strong>{release.tag}</strong> was published on 18 November 2026.
        Source syntax, Scarp CLI commands, JSON schemas and the original
        experimental ELF64 API remain compatible with alpha.13.
        This is a prerelease, not a stable compiler.
      </p>
      <h2 id="patterns">More actionable destructuring diagnostics</h2>
      <p>
        The parser now identifies missing and duplicate commas and the
        expected closing delimiter in nested tuple, array and record patterns.
        Compiler regression tests also exercise nested nominal payloads,
        immutable arm bindings, exact source spans and deterministic map
        projections. Pattern guards and refutable nested patterns are
        not introduced by this release.
      </p>
      <h2 id="cache">Live editor cache quota changes</h2>
      <p>
        Rust hosts can call <code>EditorCompilationCache::set_limits</code> to
        update all five cache retention limits on a live cache. Eviction follows
        insertion order. Previously issued compiled programs and static editor
        snapshots preserve their original data and revisions. Tests compare
        cold and warm editor results after changes to shared dependencies,
        including navigation, execution and diagnostic locations.
      </p>
      <p>
        These are optional embedding APIs. Scarp does not ship an integrated
        language server or a new cache-control CLI in alpha.14. Applications
        must still discard stale results when their workspace generation
        or document revision changes.
      </p>
      <h2 id="native">A narrowly scoped checked ELF64 object emitter</h2>
      <p>
        The experimental Rust API <code>emit_elf64_checked_integer_kernel</code>
        supports checked addition, subtraction, multiplication, negation,
        division and remainder for a restricted linear integer-binding subset.
        A Linux x86-64 System V result reports a status and UTF-8 source
        operator span on failure. The verifier also rejects a repeat
        operation whose count and index improperly share a slot.
      </p>
      <p>
        The emitted object is not a standalone executable or evidence of a
        general-purpose native compiler. The prebuilt Windows x64, Linux x64
        and macOS Apple Silicon CLI archives still run Scarp programs through
        the interpreter. Read the
        {" "}<a href={pinnedFile("docs/native-elf64.md")}>release-pinned ELF64 ABI reference</a>
        {" "}for exact host contracts and restrictions.
      </p>
      <h2 id="verification">Versioned evidence and next steps</h2>
      <p>
        Review the <a href={`${project.repo}/releases/tag/${release.tag}`}>official alpha.14 release</a>
        {" "}and <a href={`${project.repo}/commit/${release.source}`}>tagged source commit</a>.
        The <a href="/compatibility/">website compatibility page</a> describes
        the specific CLI source fixtures tested in Linux CI; those tests do not
        verify the Rust embedding API or claim cross-platform behavior.
        Install matching archives and verify checksums on the
        {" "}<a href="/downloads/">downloads page</a>.
      </p>
    </Article>
  );
}
