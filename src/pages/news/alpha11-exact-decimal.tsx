import Article from "../../layouts/Article.tsx";
import CodeBlock from "../../components/CodeBlock.tsx";
import { project } from "../../data/project.ts";

/** Historical alpha.11 facts, pinned independently of the latest release. */
const release = {
  tag: "v0.0.6-alpha.11",
  date: "2026-11-15",
  source: "79b57395957f47e1270ee542a856c844b82386de",
} as const;

export default function Alpha11ExactDecimal() {
  return (
    <Article
      title="Scarp alpha.11: exact decimal arithmetic"
      description="Scarp alpha.11 introduces an experimental exact decimal type with explicit conversion, rounding and interactive input."
      eyebrow="Language prerelease · Published source"
      date={release.date}
    >
      <p>
        <strong>{release.tag}</strong> was published on 15 November 2026.
        Its experimental <code>decimal</code> type represents exact base-10
        values without silently converting them into floating-point numbers.
      </p>
      <h2 id="decimal">Explicit arithmetic and rounding</h2>
      <p>
        Use <code>decimal("199.99")</code> to parse decimal text.
        Arithmetic preserves the exact type; conversions from or to integers
        are explicit. <code>decimal_round</code> changes a value,
        <code>decimal_format</code> produces text, and
        <code>decimal_div_rounded</code> takes a requested scale and
        rounding mode.
      </p>
      <CodeBlock filename="pricing.srp" code={'bind price: decimal = decimal("199.99");\nbind tax = decimal("0.18");\nprint(decimal_format(price + price * tax, 2, "half_even"));'} />
      <CodeBlock filename="Expected stdout" code={"235.99"} />
      <p>
        Interactive programs can use <code>input_decimal(prompt)</code>
        with <code>scarp exec --interactive</code>; scripted programs can
        supply <code>--input-file</code> or parse a redirected line.
      </p>
      <h2 id="limits">Known limits in this prerelease</h2>
      <p>
        Decimal values are limited to 28 canonical coefficient digits and
        18 fractional places. Text parsing rejects exponents and digit
        separators; inexact division needs explicit rounding. Decimal
        execution is interpreter-only, and the experimental native emitters
        reject it. This version is not a stable API.
      </p>
      <p>
        See the <a href={`${project.repo}/releases/tag/${release.tag}`}>published alpha.11 notes</a>
        {" "}and <a href={`${project.repo}/tree/${release.source}`}>exact release source</a>.
        The newer <a href="/news/alpha12-records-collections/">alpha.12 overview</a>
        explains subsequent aggregate-type features.
      </p>
    </Article>
  );
}
