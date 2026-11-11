import Article from "../../layouts/Article.tsx";
import CodeBlock from "../../components/CodeBlock.tsx";
import { project } from "../../data/project.ts";

/** Frozen release evidence: never retarget the source when another prerelease ships. */
const release = {
  tag: "v0.0.6-alpha.7",
  date: "2026-11-11",
  source: "b1c1fd232b418267d95520c69ee563ac99ecae30",
} as const;
const sourceFile = (path: string) => project.repo + "/blob/" + release.source + "/" + path;

export default function Alpha6ConditionalUnicode() {
  return (
    <Article
      title="Scarp alpha.6.7: conditional values and Unicode scalar escapes"
      description="Scarp v0.0.6-alpha.7 adds interpreter conditional expressions and checked Unicode scalar escapes for strings."
      eyebrow="Language prerelease · Reviewed source"
      date={release.date}
    >
      <p>
        <strong>{release.tag}</strong> was published on 11 November 2026.
        This experimental interpreter release introduces two language features:
        value-returning conditionals and explicit Unicode scalar escapes.
        The older examples and their source pins stay available.
      </p>

      <h2 id="conditional">Use a conditional as an expression</h2>
      <p>
        An <code>if</code>/<code>elif</code>/<code>else</code> expression
        produces one value. Each condition must be boolean and each branch
        must yield one expression with the <strong>same exact type</strong>.
        A final <code>else</code> is required.
        Only the selected branch is evaluated, allowing conditional values
        without computing unused branches.
      </p>
      <p>
        This form is for interpreter expressions. It is not accepted in module
        constants or the experimental C11 and ELF64 native backends.
        Existing statement-level conditionals remain distinct.
      </p>

      <h2 id="unicode">Encode Unicode scalars explicitly</h2>
      <p>
        Strings can now contain <code>{"\\u{HEX}"}</code> escapes with one to six
        ASCII hexadecimal digits. The lexer decodes valid Unicode scalar
        values into UTF-8, rejecting malformed syntax, surrogate values and
        code points above U+10FFFF.
        The feature is a string escape, not a separate character type.
      </p>

      <h2 id="example">A tagged source example with exact stdout</h2>
      <p>
        The compiler repository includes the following example at the
        published source commit. The unselected branches intentionally contain
        invalid operations, demonstrating lazy branch evaluation.
      </p>
      <CodeBlock filename="conditional_unicode.srp · alpha.6.7" code={"bind score = 73;\nbind label = if score >= 90 {\n    \"\\u{1F44B}\"\n} elif score >= 60 {\n    \"\\u{0928}\\u{092E}\\u{0938}\\u{094D}\\u{0924}\\u{0947} \\u{1F44B}\"\n} else {\n    text_repeat(\"unreached\", -1)\n};\nprint(label, if true { 7 } else { 1 / 0 });\n"} />
      <CodeBlock filename="Expected stdout" code={"नमस्ते 👋 7"} />
      <p>
        Review the <a href={sourceFile("examples/conditional_unicode.srp")}>exact tagged source</a>
        {" and "}<a href={sourceFile("examples/conditional_unicode.stdout")}>expected output</a>.
        A matching website fixture runs only with the pinned published
        compiler and is checked for byte-for-byte output and static verification.
      </p>

      <h2 id="compatibility">Compatibility limits and next steps</h2>
      <p>
        Exhaustive Rust embedders matching <code>ExpressionKind</code> must
        handle its new <code>Conditional</code> variant.
        There is still no general <code>scarp compile</code> command,
        complete native executable backend, integrated LSP, stable ABI
        or GPU model runtime. The earlier bounded input and tuple features
        remain experimental.
      </p>
      <p>
        See the <a href={project.repo + "/releases/tag/" + release.tag}>official release notes</a>,
        {" "}<a href={sourceFile("docs/releases/v0.0.6-alpha.7-publication.md")}>source-pinned publication record</a>,
        {" "}<a href="/downloads/">three platform downloads</a>,
        and <a href="/compatibility/">limited CI compatibility evidence</a>.
      </p>
    </Article>
  );
}
