import Article from "../../layouts/Article.tsx";
import CodeBlock from "../../components/CodeBlock.tsx";
import { project } from "../../data/project.ts";

/** Immutable historical release reference, independent of future published releases. */
const release = {
  tag: "v0.0.6-alpha.18",
  date: "2026-11-22",
  source: "84d8de05968a488773e7c5b6eda1376d8957553c",
} as const;
const pinned = (path: string) => project.repo + "/blob/" + release.source + "/" + path;

export default function Alpha18ExecLifetime() {
  return (
    <Article
      title="Scarp alpha.18: one-command exec, Lifetime and immutable array updates"
      description="Published Scarp alpha.18 unifies default project and source execution, starts Lifetime empty-view retention hardening, and adds pure fixed-array updates."
      eyebrow="Language prerelease · Published source"
      date={release.date}
    >
      <p>
        <strong>{release.tag}</strong> was published on 22 November 2026.
        It remains an experimental interpreter prerelease, not a stable language
        or a general native compiler.
      </p>
      <h2 id="exec">One execution command, with or without input</h2>
      <p>
        <code>scarp exec</code> now selects the current directory&apos;s validated
        <code> scarp.project</code> or legacy <code>Scarp.project</code> entrypoint.
        Without a manifest, it selects <code>src/main.srp</code> first, then
        <code>main.srp</code>. An invalid manifest stops execution instead of
        silently running a different file. Explicit file paths are still supported.
        It does not search parent folders or run arbitrary source files.
      </p>
      <CodeBlock filename="Terminal · alpha.18+" code={"scarp exec\nscarp exec main.srp\nscarp exec src/calculator.srp"} />
      <p>
        <code>exec</code> automatically enables bounded interactive prompts when
        the running program asks for input. Terminal and redirected UTF-8 input
        follow the existing quotas. Legacy <code>run</code> still requires
        explicit opt-in for terminal prompts. See the
        {" "}<a href="/migration/#alpha18-exec">alpha.18 CLI migration guide</a>.
      </p>
      <h2 id="array-set">Pure updates of fixed arrays</h2>
      <p>
        <code>array_set(values, index, replacement)</code> creates a new immutable
        fixed-array snapshot while the original retains its values. Replacement
        types must match. Invalid indices report <code>E0063</code>;
        new array storage counts against the cumulative allocation quota
        (<code>E0064</code>). In-place indexed assignments remain unsupported.
      </p>
      <CodeBlock
        filename="array_updates.srp · alpha.18+"
        code={"bind original = [array: 4, 8, 12];\nbind updated = array_set(original, 1, 99);\nprint(original[1]);\nprint(updated[1]);\nprint(array_len(updated));"}
      />
      <p>
        The <a href={pinned("examples/array_updates.srp")}>published source example</a>
        {" "}covers immutable and nested array updates. The website also runs a
        small <a href="/compatibility/#alpha18-coverage">alpha.18 regression fixture</a>
        against the pinned compiler commit in Linux CI.
      </p>
      <h2 id="lifetime">Lifetime: better empty-view memory retention</h2>
      <p>
        Scarp <strong>Lifetime</strong> currently combines compiler-planned
        scope retirement with safe-Rust immutable reference-counted payloads.
        New zero-length finite and integer numerical windows detach from their
        original backing buffers; nonempty windows still share storage and can
        retain larger allocations. This change does <strong>not</strong> implement
        a cycle collector, guarantee operating-system memory reclamation,
        or measure total process RSS.
      </p>
      <p>
        Explore the <a href={pinned("examples/lifetime_windows.srp")}>tagged Lifetime example</a>
        {" "}and <a href={pinned("docs/memory-lifetimes.md")}>implementation and
        verification boundaries</a>. Existing execution budgets still apply.
      </p>
      <h2 id="reliability">Packaging and reliability</h2>
      <p>
        Interactive <code>ask()</code> now retries interrupted prompt flushes
        within existing budgets. JSON inspection has more regression coverage
        for structured types, Unicode and CRLF spans. The release pipeline
        performs strict archive-member verification and per-platform clean
        rebuild comparisons; these checks do not establish reproducibility
        across different operating systems.
      </p>
      <p>
        Published archives cover Windows x64 MSVC, Linux x64 GNU and macOS
        Apple Silicon. Source builds require Rust 1.74 or newer.
        The experimental C11 and ELF64 embedding backends do not expose a
        general-purpose <code>scarp compile</code> command.
      </p>
      <p>
        Review <a href={project.repo + "/releases/tag/" + release.tag}>official release notes</a>,
        {" "}<a href={project.repo + "/commit/" + release.source}>the exact release source</a>,
        {" "}<a href="/downloads/">verified SHA-256 archive downloads</a>,
        and <a href="/news/alpha17-arrays-input/">alpha.17 history</a>.
      </p>
    </Article>
  );
}
