import Article from "../../layouts/Article.tsx";
import CodeBlock from "../../components/CodeBlock.tsx";
import { project } from "../../data/project.ts";

/** Immutable facts from the published alpha.13 tag; never repoint historical releases. */
const release = {
  tag: "v0.0.6-alpha.13",
  date: "2026-11-17",
  source: "e755fda37cdaeed29434e848cb5dd41f2f2e7eb2",
} as const;
const pinnedFile = (path: string) => `${project.repo}/blob/${release.source}/${path}`;

export default function Alpha13EditorCaches() {
  return (
    <Article
      title="Scarp alpha.13: cache control and editor snapshot safety"
      description="Scarp v0.0.6-alpha.13 improves Option/Result propagation, bounded compiler caches and workspace-generation-aware Rust editor integrations."
      eyebrow="Language prerelease · Published source"
      date={release.date}
    >
      <p>
        <strong>{release.tag}</strong> was published on 17 November 2026.
        The release strengthens internal compiler and embedding behavior while
        retaining the existing Scarp CLI commands, project manifests and
        interpreter-based source execution. It is an experimental prerelease.
      </p>
      <h2 id="propagation">Option and Result propagation</h2>
      <p>
        Propagating an existing <code>Result</code> error now reuses its immutable
        error payload. Propagating an empty <code>Option</code> needs no new payload
        allocation. This refines the typed propagation introduced in alpha.12;
        it is not a new general-purpose generics system or a claim of
        allocation-free execution for every expression.
      </p>
      <p>
        Read the <a href={pinnedFile("docs/option-result-propagation.md")}>
        release-pinned propagation reference</a> for the supported typed cases.
      </p>
      <h2 id="caches">Compiler cache retention and revision eviction</h2>
      <p>
        Opt-in Rust syntax and semantic caches can adjust retention limits.
        Semantic cache clients can evict an exact source revision, revisions
        older than a threshold, revisions at or above a ceiling, or a half-open
        revision interval for a trusted source identity. Previously returned
        compiled program values stay valid after eviction. These are Rust
        embedding capabilities, not new Scarp syntax or public CLI flags.
      </p>
      <p>
        Cache quotas count retained compiler records and estimated bytes; they
        are not guarantees about the total memory used by the process. Cache
        invalidation and resource limits remain important for editor hosts.
      </p>
      <h2 id="editor">Safer asynchronous editor results</h2>
      <p>
        Rust integrations can bind a static analysis snapshot to a workspace
        generation. An editor host must track both the workspace generation
        and document revision, then reject late diagnostics or navigation
        results following source edits or import rebinding. Matching document
        revisions by themselves are insufficient when a workspace changes.
      </p>
      <p>
        This is an integration building block, not a bundled LSP server, IDE
        completion, or an assurance that third-party editors already use it.
      </p>
      <h2 id="task-board">Run the existing task-board project</h2>
      <p>
        The tagged compiler still packages the alpha.12 task-board example
        demonstrating records, immutable lists and maps, typed transitions
        and project tests. From the <strong>alpha.13 source checkout</strong>,
        build or install the matching interpreter, then run:
      </p>
      <CodeBlock
        filename="Terminal · from alpha.13 source checkout"
        code={"scarp verify examples/projects/task-board\nscarp launch examples/projects/task-board\nscarp test examples/projects/task-board"}
      />
      <p>
        Explore the <a href={`${project.repo}/tree/${release.source}/examples/projects/task-board`}>
        release-pinned task board</a> and the
        {" "}<a href={`${project.repo}/releases/tag/${release.tag}`}>official alpha.13 notes</a>.
        The <a href="/downloads/">download page</a> provides the pinned
        Windows x64, Linux x64 GNU and Apple Silicon macOS archives and checksums.
      </p>
      <h2 id="compatibility">Compatibility and limitations</h2>
      <p>
        Source programs still execute through the interpreter. Rust 1.74 or
        newer is supported when building from source. Experimental native
        emitters are restricted; this is not general native compilation and
        does not introduce a <code>scarp compile</code> command or stable Rust ABI.
        The <a href="/compatibility/">website compatibility checks</a>
        cover specific tested examples and CLI workflows, not all Scarp projects,
        editor hosts, operating systems or cache behaviors.
      </p>
    </Article>
  );
}
