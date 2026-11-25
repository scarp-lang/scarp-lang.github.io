import Article from "../../layouts/Article.tsx";
import { project } from "../../data/project.ts";

/** Immutable evidence for this historical release article. */
const release = {
  tag: "v0.0.6-alpha.20",
  date: "2026-11-24",
  source: "b1a9347f93540fdf95b0ddecba4adc55a3b4bb98",
} as const;
const releaseUrl = project.repo + "/releases/tag/" + release.tag;

export default function Alpha20NativeDecimalTuples() {
  return (
    <Article title="Scarp alpha.20: native integer functions, decimal literals and tuples"
      description="The published prerelease expands the experimental Rust ELF64 emitter, adds exact decimal literal syntax and tuple operations, and hardens nested host string quotas."
      eyebrow="Language prerelease · Published source" date={release.date}>
      <p><strong>{release.tag}</strong> was published on 24 November 2026 from
        {" "}<a href={project.repo + "/commit/" + release.source}>{release.source}</a>.
        The release continues interpreter development alongside a narrowly
        scoped experimental systems-programming foundation.</p>
      <h2 id="native">Native integer function subset</h2>
      <p>The Rust embedding API can emit deterministic Linux x86-64 ELF64
        objects targeting the System V ABI for pure functions with one to six
        integer parameters. The supported subset includes integer and Boolean
        locals, local assignments, checked arithmetic, short-circuit logic
        and early integer returns. Existing zero-argument symbols remain;
        the new <code>scarp_checked_integer_function</code> symbol has a fixed
        signature for each object. Arithmetic errors return a status and a
        source-span index.</p>
      <p>Loops, calls, contracts, defaults and heap-backed values are excluded.
        This is a Rust API for emitting objects, not a general compiler CLI,
        stable ABI, executable generator or Windows/macOS native backend.
        <code> scarp exec</code> remains interpreter-backed.</p>
      <h2 id="decimal">Exact decimal literals</h2>
      <p>A suffixed literal such as <code>0.1d</code> denotes an exact
        base-ten decimal rather than an ordinary floating-point value.
        Unsuffixed floating-point syntax retains its existing behavior.
        This distinction matters when decimal representation is required;
        it is not a claim of unlimited precision or unbounded allocation.</p>
      <h2 id="tuples">Tuple updates and ordering</h2>
      <p>Mutable tuple bindings support persistent replacement at a constant
        member index. This does not imply arbitrary dynamic tuple indexing
        or in-place mutation of shared values. Compatible numeric tuples
        support lexicographic ordering: comparison considers earlier members
        before later ones.</p>
      <h2 id="projects">Project manifest compatibility</h2>
      <p>New projects use the lowercase <code>scarp.project</code> filename.
        Existing <code>Scarp.project</code> projects remain readable.
        Match the project format as well as its filename when migrating;
        simply renaming a legacy manifest is not a format conversion.</p>
      <h2 id="quotas">Nested host payload accounting</h2>
      <p>Rust host argument admission now counts string payloads inside
        composites toward cumulative quotas. Shared strings count by
        logical occurrence. This accounts for logical UTF-8 bytes, not
        physical heap allocations, process RSS or elapsed time.
        The earlier <a href="/news/alpha19-host-callables/">alpha.19 host
        callable APIs</a> remain a separate embedding milestone.</p>
      <h2 id="evidence">Release evidence</h2>
      <p>Read the <a href={releaseUrl}>official release notes and archives</a>,
        the <a href={project.repo + "/tree/" + release.source}>exact source tree</a>,
        and the <a href="/downloads/">version-specific downloads</a>.
        All features remain experimental and should be evaluated against
        the relevant version and supported execution mode.</p>
    </Article>
  );
}
