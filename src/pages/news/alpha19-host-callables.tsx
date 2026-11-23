import Article from "../../layouts/Article.tsx";
import CodeBlock from "../../components/CodeBlock.tsx";
import { project } from "../../data/project.ts";

/** Published alpha.19 historical evidence; do not link it to moving main. */
const release = {
  tag: "v0.0.6-alpha.19",
  date: "2026-11-23",
  source: "e534e73a81c9500e3aef9f3d51cafa0bc7bbcf75",
} as const;
const pinned = (path: string) => project.repo + "/blob/" + release.source + "/" + path;

export default function Alpha19HostCallables() {
  return (
    <Article
      title="Scarp alpha.19: checked host callable handles and execution quotas"
      description="Published alpha.19 introduces experimental Rust embedding handles for named Scarp functions, signature-effect checks and cumulative host execution quotas—not source-level function values."
      eyebrow="Language prerelease · Published source"
      date={release.date}
    >
      <p>
        <strong>{release.tag}</strong> was published on 23 November 2026
        from <a href={project.repo + "/commit/" + release.source}>{release.source}</a>.
        This release expands the <strong>Rust embedding interface</strong>;
        it does not introduce first-class function values to Scarp source.
      </p>

      <h2 id="signatures">Checked callable signatures</h2>
      <p>
        Rust's <code>TypeRegistry::accepts_callable</code> checks named function
        parameter and result types invariantly. A pure implementation may fill
        an impure callable requirement, but an impure implementation cannot fill
        a pure requirement. These are host API compatibility rules, not a new
        function-value syntax or an indirect-call operator in <code>.srp</code>.
      </p>

      <h2 id="handles">Snapshot-bound handles and visibility</h2>
      <p>
        Hosts can obtain checked handles to named functions in an immutable
        compiled snapshot, pass positional or named host arguments, use omitted
        defaults, and rebind compatible callable slots. Linked modules respect
        exports: private functions are not accessible through export-only lookup.
        Handles are tied to the compiled snapshot, not transferable raw pointers
        or stable identities across rebuilds.
      </p>

      <h2 id="quotas">Execution receipts and host-wide limits</h2>
      <p>
        <code>ExecutionUsage</code> records deterministic execution events,
        including failed results and input attempts. <code>HostInvocationLedger</code>
        applies cumulative limits to repeated host calls, covering interpreter
        work, calls, captured output, payload allocation and input. The limits
        are not measurements of elapsed time or peak process memory.
      </p>
      <p>
        Pre-existing Rust arguments are checked for count, UTF-8 string payload
        size and named labels before evaluation. If a host output writer panics
        while replaying completed execution, completed work remains charged to
        the ledger. This does not guarantee recovery from arbitrary input-reader
        panics, crashes or unsafe host code.
      </p>

      <h2 id="try">Try the published source</h2>
      <p>
        Run these commands from the <a href={pinned("Cargo.toml")}>tagged compiler
        source tree</a> with the Rust toolchain. The first runs a Rust host
        embedding example; the second runs an ordinary Scarp source example.
      </p>
      <CodeBlock
        filename="Terminal · Rust host demo and Scarp interpreter"
        code={"cargo run --locked --example host_callable_invocation\nscarp exec examples/callable_effect_boundaries.srp"}
      />
      <p>
        See the <a href={pinned("docs/releases/v0.0.6-alpha.19-publication.md")}>published
        release notes</a>, the <a href={pinned("docs/development/named-callable-reference-lifetime-alpha19.md")}>Lifetime
        design and boundaries</a>, or the <a href={project.repo + "/releases/tag/" + release.tag}>release
        archives and SHA-256 files</a>.
      </p>

      <h2 id="limits">What remains unsupported</h2>
      <p>
        Scarp source still cannot pass functions as values, construct closures,
        capture lexical environments in functions, or indirectly call arbitrary
        values. Named <code>funcra</code> calls continue to work as in alpha.18.
        This is an experimental interpreter and Rust hosting milestone—not a
        stable ABI, cycle-collecting memory manager or general native compiler.
      </p>
      <p>
        For downloads and their <em>version-specific</em> checksum instructions,
        visit <a href="/downloads/">Downloads</a>. For the earlier project
        execution and immutable array changes, read the
        {" "}<a href="/news/alpha18-exec-lifetime/">alpha.18 overview</a>.
      </p>
    </Article>
  );
}
