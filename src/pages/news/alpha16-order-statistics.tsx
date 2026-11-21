import Article from "../../layouts/Article.tsx";
import CodeBlock from "../../components/CodeBlock.tsx";
import { project } from "../../data/project.ts";

/** Historical prerelease evidence remains pinned after newer compiler releases. */
const release = {
  tag: "v0.0.6-alpha.16",
  date: "2026-11-20",
  source: "244f713b4fa48f02a98b8e3e3c11025363f35260",
} as const;
const pinned = (path: string) => project.repo + "/blob/" + release.source + "/" + path;

export default function Alpha16OrderStatistics() {
  return (
    <Article
      title="Scarp alpha.16: order statistics and Unicode utilities"
      description="Scarp v0.0.6-alpha.16 adds interpreter median and quantile functions, bounded Unicode transforms, signed integer utilities and optional Rust embedding improvements."
      eyebrow="Language prerelease · Published source"
      date={release.date}
    >
      <p>
        <strong>{release.tag}</strong> was published on 20 November 2026.
        It expands Scarp's interpreter-backed numerical and text facilities.
        These APIs are experimental, not a stable language or native compilation toolchain.
      </p>
      <h2 id="statistics">Median and quantiles on finite vectors</h2>
      <p>
        Pure <code>median(vector)</code> and <code>quantile(vector, fraction)</code>
        operate on finite vectors and visible vector windows. Quantiles use type-7
        interpolation. The interpreter creates a bounded immutable sorted copy,
        charges execution work, and leaves the original vector unchanged.
      </p>
      <CodeBlock filename="order_statistics.srp · alpha.16+" code={"bind samples = [4.0, 1.0, 7.0, 2.0];\nprint(median(samples));\nprint(quantile(samples, 0.25));\nprint(quantile(samples, 0.75));"} />
      <p>
        The <a href={pinned("examples/order_statistics.srp")}>release-tagged program</a>
        {" "}and <a href={pinned("examples/order_statistics.stdout")}>exact expected output</a>
        {" "}demonstrate the calculation. This website also keeps a
        {" "}<a href="/compatibility/">published-only CI fixture</a> for the example.
      </p>
      <h2 id="unicode">Unicode text utilities</h2>
      <p>
        <code>text_lower</code>, <code>text_upper</code>, <code>text_reverse</code>,
        <code>text_from_codepoint</code>, <code>text_rfind</code> and
        <code>text_count</code> provide bounded Unicode-aware operations.
        Case mapping is locale-independent. Reversal moves Unicode scalars, not
        entire grapheme clusters, so combining marks can move independently.
        Matching is exact rather than normalized or locale-sensitive.
      </p>
      <h2 id="integers">Checked integer and bit-pattern helpers</h2>
      <p>
        This release also introduces <code>integer_abs</code>,
        <code>integer_sign</code>, <code>integer_gcd</code>,
        <code>integer_lcm</code>, <code>bits_count_ones</code>,
        <code>bits_reverse</code>, <code>bits_swap_bytes</code> and
        64-bit rotate/count operations. Overflow remains checked, and
        invalid rotate counts are rejected. Read the
        {" "}<a href={pinned("docs/scalar-utilities.md")}>version-pinned utility reference</a>
        {" "}for limits and exact semantics.
      </p>
      <h2 id="rust">Rust-only runtime and kernel maintenance</h2>
      <p>
        Rust embedding hosts gain live <code>ConstantCache</code> retention limits;
        already compiled programs remain usable when old entries are evicted.
        The restricted experimental Linux x86-64 ELF64 integer kernels gain large
        stack-frame probing. Deterministic map tests cover output rollback under
        work limits. None of this adds a public native compilation CLI or an LSP.
      </p>
      <p>
        Review the <a href={project.repo + "/releases/tag/" + release.tag}>official release</a>,
        {" "}<a href={project.repo + "/commit/" + release.source}>source commit</a>,
        {" "}<a href="/downloads/">current download</a> and
        {" "}<a href="/compatibility/">test scope</a>. The website's Linux
        CI tests specific Scarp programs, not Rust embedding behavior or all
        prebuilt operating-system archives.
      </p>
    </Article>
  );
}
