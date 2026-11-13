import Article from "../../layouts/Article.tsx";
import CodeBlock from "../../components/CodeBlock.tsx";
import { project } from "../../data/project.ts";

/** Immutable evidence for the published alpha.9 release. */
const release = {
  tag: "v0.0.6-alpha.9",
  date: "2026-11-13",
  source: "0814997dc43982eb707a9a1aee72aab3a7ac8b41",
} as const;
const sourceFile = (path: string) => project.repo + "/blob/" + release.source + "/" + path;

export default function Alpha9BigIntReports() {
  return (
    <Article
      title="Scarp alpha.9: exact BigInt and actionable test reports"
      description="Scarp v0.0.6-alpha.9 introduces bounded signed BigInt arithmetic and structured JSON v2 test diagnostics."
      eyebrow="Language prerelease · Published source"
      date={release.date}
    >
      <p>
        <strong>{release.tag}</strong> was published on 13 November 2026.
        It brings exact, resource-limited large integers and a new structured
        test report format for editors and CI. The older project workflow
        and JSON report format remain available.
      </p>
      <h2 id="bigint">Exact signed integers beyond i64</h2>
      <p>
        The existing <code>integer</code> remains signed 64-bit. A separate
        <code> bigint</code> type supports exact signed arithmetic, comparisons,
        functions, modules and tuples. There is no implicit mixing with
        <code>integer</code> or <code>float</code>. Use explicit
        <code> bigint_from_integer</code> and <code>bigint_to_integer</code>
        conversions; the latter rejects values outside the i64 range.
      </p>
      <CodeBlock filename="large_numbers.srp · alpha.9" code={'bind large: bigint = bigint("999999999999999999999");\nprint(large + bigint_from_integer(1));'} />
      <CodeBlock filename="Expected stdout" code={"1000000000000000000000"} />
      <p>
        BigInt supports <code>+</code>, <code>-</code>, <code>*</code>,
        <code>/</code> and <code>%</code>. Division truncates toward zero;
        the remainder takes the dividend's sign. The website CI also checks
        a longer <a href="/compatibility/#published-only">BigInt source fixture</a>,
        copied from the <a href={sourceFile("examples/bigint_arithmetic.srp")}>tagged compiler example</a>
        {" "}and verified against <a href={sourceFile("examples/bigint_arithmetic.stdout")}>its exact output</a>.
      </p>
      <h2 id="limits">Bounded by design</h2>
      <p>
        Defaults are 10,000 decimal digits and an 8 MiB cumulative BigInt
        limb-allocation budget. The configurable digit ceiling is 1,000,000,
        but arithmetic work and memory limits can stop large computations
        well before that. BigInt is interpreter-only. BigInt-to-float conversion,
        arbitrary exponentiation, native BigInt backends, and a general native
        executable CLI are outside this release.
      </p>
      <h2 id="json-v2">Structured failures from scarp test</h2>
      <CodeBlock filename="Terminal · alpha.9" code={"scarp test --json=v2 calculator\nscarp test --json=v2 --filter addition calculator"} />
      <p>
        Schema v2 reports distinguish <code>compile</code>,
        <code>fixture</code> and <code>runtime</code> failure phases. Failed
        tests include structured diagnostics with codes, project-relative
        file paths, UTF-8 byte spans, and Unicode-scalar line and column
        positions when available. Program output and source excerpts are
        omitted, but explicitly supplied diagnostic messages may contain
        program text. Do not treat the report as a secrecy boundary.
      </p>
      <p>
        The old <code>--json</code> format stays at schema v1. Test discovery,
        filename filters, exit codes, input fixtures, and alpha.8
        <code> scarp.project</code> workflows keep their existing behavior.
      </p>
      <h2 id="compatibility">Compatibility and evidence</h2>
      <p>
        Rust integrations with exhaustive <code>ExecutionOptions</code>,
        <code>Value</code>, <code>PrimitiveType</code> or diagnostic matches
        may need new BigInt cases. Scarp remains experimental: no package
        registry, general native compilation CLI, integrated LSP, GPU runtime
        or stable ABI is claimed.
      </p>
      <p>
        The <a href={project.repo + "/releases/tag/" + release.tag}>official alpha.9 release</a>
        {" "}is the publication authority. See the
        {" "}<a href={sourceFile("docs/bigint.md")}>BigInt reference</a>,
        {" "}<a href={sourceFile("docs/project-testing.md")}>test report specification</a>,
        {" "}<a href="/downloads/">platform downloads and checksums</a>,
        and <a href="/news/alpha8-project-tests/">earlier alpha.8 project guide</a>.
        Source docs may retain development-era banners; the release record
        establishes which features were published.
      </p>
    </Article>
  );
}
