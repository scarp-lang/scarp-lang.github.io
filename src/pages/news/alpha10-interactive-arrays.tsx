import Article from "../../layouts/Article.tsx";
import CodeBlock from "../../components/CodeBlock.tsx";
import { project } from "../../data/project.ts";

/** Immutable evidence for the published alpha.10 release. */
const release = { tag: "v0.0.6-alpha.10", date: "2026-11-14", source: "44fcd0f77ccb92648cdb1fc7632495c506c87cb3" } as const;
const sourceFile = (path: string) => project.repo + "/blob/" + release.source + "/" + path;

export default function Alpha10InteractiveArrays() {
  return (
    <Article
      title="Scarp alpha.10: interactive input, fixed arrays and exact BigInt"
      description="Scarp v0.0.6-alpha.10 adds opt-in interactive prompts, immutable fixed arrays, exact stdout/stderr test fixtures and bounded BigInt tools."
      eyebrow="Language prerelease · Published source"
      date={release.date}
    >
      <p><strong>{release.tag}</strong> was published on 14 November 2026. This is an experimental interpreter prerelease, not a stable compiler.</p>
      <h2 id="interactive-input">Interactive input is explicitly opt-in</h2>
      <p>
        Enable prompts using <code>scarp exec --interactive app.srp</code>.
        The impure <code>input(prompt)</code>, <code>ask(prompt)</code>,
        <code>ask_or(prompt, fallback)</code>, <code>input_integer</code>,
        <code>input_float</code> and <code>input_bigint</code> functions
        read bounded input. Prompts flush before input; <code>run</code> and
        <code>launch</code> also accept the interactive flag.
      </p>
      <CodeBlock filename="app.srp" code={'bind name = ask_or("Name: ", "Guest");\nprint("Hello", name);'} />
      <CodeBlock filename="Terminal" code={"scarp exec --interactive app.srp"} />
      <p>
        For repeatable input use <code>scarp exec --input-file DATA.txt app.srp</code>.
        <code>try_read_line()</code> distinguishes end of file from an empty line.
        Invalid UTF-8, I/O failures and input quota exhaustion report diagnostics.
        Projects can compare exact UTF-8 output with sibling <code>.stdout</code>
        and <code>.stderr</code> fixtures; JSON reports omit stream contents.
      </p>
      <h2 id="fixed-arrays">Typed immutable fixed-size arrays</h2>
      <p>
        <code>array&lt;integer, 2&gt;</code> declares a homogeneous array of two integers.
        The <code>[array: 10, 20]</code> literal and <code>[array: &lt;integer&gt;]</code>
        typed empty form are distinct from existing vector notation. Indexing is
        bounds-checked; equality, nested values and typed imports are available.
      </p>
      <CodeBlock filename="array.srp" code={'bind values: array<integer, 2> = [array: 10, 20];\nprint(values[1]);'} />
      <CodeBlock filename="Expected stdout" code={"20"} />
      <p>
        Arrays are limited by shape, work and allocation quotas. Module inspection
        uses schema 3 if a serialized type includes an array; earlier primitive
        and tuple inventories retain schema 1 or 2. Native emitters reject arrays.
        Read the <a href={sourceFile("docs/fixed-arrays.md")}>tagged array reference</a>.
      </p>
      <h2 id="bigint">Exact BigInt and compiler tooling</h2>
      <p>
        BigInt gains powers, GCD/LCM, square roots, bit lengths, radix conversion,
        signed bitwise operations, shifts, modular exponentiation and
        <code>bigint_divmod</code>. All retain resource budgets. Modular
        exponentiation uses variable-time arithmetic, unsuitable for secrets.
      </p>
      <p>
        Rust hosts can opt into bounded scalar-constant and editor-snapshot caches.
        Experimental Decimal foundations are Rust-only. Filesystem read/write,
        a dependency registry, integrated LSP, general native compile CLI and
        stable Rust embedding ABI are not included.
      </p>
      <p>
        See the <a href={project.repo + "/releases/tag/" + release.tag}>published release</a>,
        {" "}<a href={sourceFile("docs/program-input.md")}>source input reference</a>,
        {" "}<a href={sourceFile("docs/project-testing.md")}>testing reference</a> and
        {" "}<a href="/downloads/">checksummed platform downloads</a>.
      </p>
    </Article>
  );
}
