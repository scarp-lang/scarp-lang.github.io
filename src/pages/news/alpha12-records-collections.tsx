import Article from "../../layouts/Article.tsx";
import CodeBlock from "../../components/CodeBlock.tsx";
import { project } from "../../data/project.ts";

/** Historical article: never change this evidence when newer versions ship. */
const release = {
  tag: "v0.0.6-alpha.12",
  date: "2026-11-16",
  source: "a1f9c2fc1c6bc8f3e04878d30d658bb38fab441d",
} as const;
const sourcePath = (path: string) => `${project.repo}/tree/${release.source}/${path}`;

export default function Alpha12RecordsCollections() {
  return (
    <Article
      title="Scarp alpha.12: typed records, variants and collections"
      description="Scarp v0.0.6-alpha.12 introduces interpreter-backed records, variants, option/result, immutable lists and deterministic maps."
      eyebrow="Language prerelease · Published source"
      date={release.date}
    >
      <p>
        <strong>{release.tag}</strong> was published on 16 November 2026. This
        experimental prerelease extends Scarp's interpreted aggregate values;
        it does not make Scarp a stable production compiler.
      </p>
      <h2 id="aggregates">Typed records, variants and destructuring</h2>
      <p>
        Source records and tagged variants carry checked types. Nested
        destructuring is available for records, tuples and fixed-size arrays,
        and variant matching checks that all cases are handled.
        The compiler rejects incomplete matches rather than silently using
        an unhandled alternative.
      </p>
      <h2 id="optional">Option and result types</h2>
      <p>
        Concrete <code>option&lt;T&gt;</code> and
        <code>result&lt;T, E&gt;</code> values model missing data and errors.
        Early return using <code>bind value = expression?;</code> propagates
        a compatible empty option or error result. These are concrete type
        constructors, not a release of general user-defined generics.
        Canonical type identity is retained across source modules.
      </p>
      <h2 id="collections">Immutable lists and deterministic maps</h2>
      <p>
        Typed lists and maps return new snapshots when changed; existing
        values remain immutable. Map key and value projections have canonical
        ordering. Operations are bounded by allocation and work budgets, and
        removing an entry copies only the retained entries into the new snapshot.
      </p>
      <h2 id="task-board">A multi-file project you can inspect</h2>
      <p>
        The tagged compiler source includes a task-board project with typed
        actions, pure transitions, deterministic output, lookups, validation
        and automated project tests. Build the matching prerelease or use its
        platform archive and run the commands below from the tagged source tree.
      </p>
      <CodeBlock filename="Terminal · from the tagged Scarp source root" code={"scarp verify examples/projects/task-board\nscarp launch examples/projects/task-board\nscarp test examples/projects/task-board"} />
      <p>
        Read the <a href={sourcePath("examples/projects/task-board")}>tagged task-board example</a>
        {" "}and <a href={`${project.repo}/releases/tag/${release.tag}`}>official release notes</a>.
        The <a href="/downloads/">download page</a> pins the published
        Windows x64, Linux x64 GNU and Apple Silicon macOS SHA-256 digests.
      </p>
      <h2 id="limits">Compatibility boundaries</h2>
      <p>
        Aggregates are interpreter features. Experimental native emitters
        reject unsupported aggregate programs. A general native compile CLI,
        host-side data engine and user-defined generics are not included.
        Exact <code>decimal</code> values from alpha.11 and interactive
        input from alpha.10 remain available with their documented limits.
        The <a href="/compatibility/">website compatibility matrix</a> only
        covers its specifically tested source fixtures, not every new aggregate
        program.
      </p>
    </Article>
  );
}
