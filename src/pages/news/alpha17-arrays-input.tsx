import Article from "../../layouts/Article.tsx";
import CodeBlock from "../../components/CodeBlock.tsx";
import { project } from "../../data/project.ts";

/** Published alpha.17 tag and source are deliberately immutable history. */
const release = {
  tag: "v0.0.6-alpha.17",
  date: "2026-11-21",
  source: "7831a37939965f557ce746e1d86bf82d3d629f74",
} as const;
const pinned = (path: string) => project.repo + "/blob/" + release.source + "/" + path;

export default function Alpha17ArraysInput() {
  return (
    <Article
      title="Scarp alpha.17: array traversal and Boolean prompts"
      description="Scarp v0.0.6-alpha.17 adds array_len and array_get_or to the interpreter, explicit interactive input_boolean, and clearer fixed-array annotation diagnostics."
      eyebrow="Language prerelease · Published source"
      date={release.date}
    >
      <p>
        <strong>{release.tag}</strong> was published on 21 November 2026.
        It is an experimental compiler prerelease with new interpreter behavior,
        not a stable release or a general native code-generation command.
      </p>
      <h2 id="array-traversal">Array lengths and safe fallback access</h2>
      <p>
        <code>array_len(values)</code> returns the length of a fixed array,
        including an empty one. It can be used as the count in
        {" "}<code>repeat</code> loops. <code>array_get_or(values, index, fallback)</code>
        returns a matching typed fallback for a negative or out-of-bounds index.
        The fallback expression is evaluated exactly once, including when the
        index is valid. Ordinary direct indexing still reports <code>E0063</code>
        on invalid indices; this helper does not change indexing semantics.
      </p>
      <CodeBlock filename="array_traversal.srp · alpha.17+" code={"bind readings = [array: 10, 20, 30];\nvar total = 0;\nrepeat array_len(readings) as index {\n    total += readings[index];\n}\nprint(\"Total:\", total);\nprint(\"Missing reading:\", array_get_or(readings, 3, 0));"} />
      <p>
        See the <a href={pinned("examples/array_traversal.srp")}>complete release example</a>,
        {" "}<a href={pinned("examples/array_traversal.stdout")}>expected stdout</a>,
        and the <a href="/compatibility/">website's interpreter regression coverage</a>.
      </p>
      <h2 id="boolean-input">Explicit opt-in Boolean input</h2>
      <p>
        <code>input_boolean(prompt)</code> reads a Boolean from terminal
        input when <code>--interactive</code> is enabled. Only the exact
        lowercase lines <code>true</code> and <code>false</code> are valid.
        Malformed input reports <code>E0084</code>; end of input before a
        new line reports <code>E0055</code>. This does not make terminal
        prompting automatic for every invocation.
      </p>
      <CodeBlock filename="Terminal · opt-in console input" code={"scarp exec --interactive examples/interactive/boolean_prompt.srp"} />
      <p>
        The <a href={pinned("examples/interactive/boolean_prompt.srp")}>published prompt example</a>
        {" "}includes two Boolean decisions. For unattended automation,
        prefer explicit, reviewed input fixtures rather than relying on a
        terminal conversation.
      </p>
      <h2 id="diagnostics">More precise fixed-array diagnostics</h2>
      <p>
        Invalid lengths in nested fixed-array type annotations now retain
        focused repair guidance and a source span for the offending length.
        This improves diagnosis; it does not imply a new collection memory model.
      </p>
      <h2 id="limits">Compatibility and evidence</h2>
      <p>
        The new array and input functions execute with the interpreter.
        Experimental native APIs retain their previous restricted scalar scope.
        Prebuilt archives cover Windows x64, Linux x64 and macOS Apple Silicon;
        source builds require Rust 1.74 or later. The website checks only selected
        programs in Linux CI, not every platform or compiler feature.
      </p>
      <p>
        Review the <a href={project.repo + "/releases/tag/" + release.tag}>official alpha.17 notes</a>,
        {" "}<a href={project.repo + "/commit/" + release.source}>published source</a>,
        {" "}<a href="/downloads/">archive SHA-256 checksums</a> and
        {" "}<a href="/news/alpha16-order-statistics/">alpha.16 history</a>.
      </p>
    </Article>
  );
}
