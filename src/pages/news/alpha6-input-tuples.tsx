import Article from "../../layouts/Article.tsx";
import CodeBlock from "../../components/CodeBlock.tsx";
import { project } from "../../data/project.ts";

/** Historical release snapshot; keep this source commit immutable. */
const release = {
  tag: "v0.0.6-alpha.6",
  date: "2026-11-10",
  source: "cdf6a3924ec2a36c7beca5a9aec4f01a0bce515e",
} as const;
const sourceFile = (path: string) => project.repo + "/blob/" + release.source + "/" + path;

export default function Alpha6InputTuples() {
  return (
    <Article
      title="Scarp alpha.6.6: bounded input, text conversion and typed tuples"
      description="Published Scarp v0.0.6-alpha.6 introduces redirected UTF-8 line input, explicit text conversions and immutable heterogeneous tuples."
      eyebrow="Language prerelease · Reviewed source"
      date={release.date}
    >
      <p>
        <strong>{release.tag}</strong> was published on 10 November 2026.
        It adds three connected language foundations while keeping Scarp an
        experimental interpreter—not an interactive shell or general native compiler.
      </p>

      <h2 id="input">Bounded program input</h2>
      <p>
        <code>read_line()</code> returns a UTF-8 string from an explicitly
        supplied reader. Packaged <code>exec</code>, <code>run</code> and
        <code>launch</code> accept redirected standard input. An attached
        interactive terminal does not become a prompt interface. LF and CRLF
        line endings are removed from the returned text but count toward input quotas.
      </p>
      <p>
        Default limits are 65,536 raw bytes per line, 1,048,576 total bytes,
        and 4,096 reads. Three <code>--max-input-*</code> options adjust these
        limits. EOF, encoding, reader and quota errors have distinct diagnostics.
        <code>verify</code> and inspection remain static.
      </p>

      <h2 id="text">Explicit conversions and Unicode text tools</h2>
      <p>
        Checked <code>text_to_integer</code>, <code>text_to_float</code>,
        <code>integer_to_text</code> and <code>float_to_text</code> avoid
        implicit number/string coercion. Integer parsing respects the signed
        i64 range, and float parsing requires finite values. Unicode-aware
        <code>text_trim</code> and <code>text_replace</code> extend text handling.
      </p>

      <h2 id="tuples">Immutable heterogeneous tuples</h2>
      <p>
        Tuple literals such as <code>(42, "नमस्ते")</code>, singleton literals,
        <code>tuple&lt;integer, string&gt;</code> annotations and literal-index
        projection like <code>record[0]</code> are supported. Tuples work in
        functions, defaults, contracts, recursion and imported interfaces.
        They support structural equality but not element mutation; whole-value
        replacement must preserve the exact structural type.
      </p>
      <p>
        Tuple arity is 1–32, nesting is limited to 32, structural shape to
        4,096 nodes, and the default cumulative tuple payload cap is 8 MiB.
        Empty tuples, computed indices, destructuring, BigInt, maps and
        general arrays remain unimplemented in this release.
      </p>

      <h2 id="example">Tag-pinned integrated example</h2>
      <p>
        The bundled example imports a helper that reads redirected input,
        parses a number and transforms Unicode text. Keep the imported
        module alongside the source; this is not a standalone one-file example.
      </p>
      <CodeBlock filename="core_input_tuple.srp · alpha.6.6" code={'import "modules/input_record.srp" as records;\nbind entry: tuple<integer, string> = records.read();\nprint(entry);\nprint(records.describe(entry));'} />
      <CodeBlock filename="Expected stdout with tagged stdin fixture" code={'(42, "नमस्ते 🌍")\n42: नमस्ते 🌍'} />
      <p>
        Inspect the <a href={sourceFile("examples/core_input_tuple.srp")}>tagged source</a>,
        {" "}<a href={sourceFile("examples/modules/input_record.srp")}>imported helper</a>,
        {" "}<a href={sourceFile("examples/core_input_tuple.stdin")}>redirected stdin fixture</a>,
        and <a href={sourceFile("examples/core_input_tuple.stdout")}>exact stdout</a>.
        The tagged compiler contains dedicated conformance and integration tests.
      </p>

      <h2 id="limits">Compatibility and release limits</h2>
      <p>
        Input consumption cannot be rolled back. Rust embedders must account
        for structural <code>SourceType</code>, <code>Value::Tuple</code>,
        <code>max_tuple_bytes</code> and schema-2 inventories for tuple signatures.
        Native backends reject input and tuples. Earlier numerical built-ins,
        source navigation and restricted Rust-only C11/ELF64 emitters remain;
        there is no <code>scarp compile</code> CLI, stable ABI, package registry,
        GPU runtime or integrated language server.
      </p>
      <p>
        See <a href="/downloads/">platform downloads and SHA-256 values</a>,
        {" "}<a href="/compatibility/">limited website CI compatibility evidence</a>
        and the <a href={project.repo + "/releases/tag/" + release.tag}>official release record</a>.
        Read the <a href={sourceFile("docs/tuples.md")}>tuple contract</a>,
        {" "}<a href={sourceFile("docs/program-input.md")}>input contract</a>,
        and <a href={sourceFile("docs/text-foundations.md")}>text contract</a>
        for version-specific behavior.
      </p>
    </Article>
  );
}
