import Article from "../../layouts/Article.tsx";
import CodeBlock from "../../components/CodeBlock.tsx";
import { project } from "../../data/project.ts";

/** Historical release post: retain this exact published tag and source commit. */
const release = {
  tag: "v0.0.6-alpha.5",
  date: "2026-11-09",
  source: "205e92f166f186c3905e5880d41c31717b697b8e",
} as const;
const sourceFile = (path: string) => `${project.repo}/blob/${release.source}/${path}`;

export default function Alpha6NucleusCorrelation() {
  return (
    <Article
      title="Scarp alpha.6.5: deterministic nucleus selection and Pearson correlation"
      description="Published Scarp v0.0.6-alpha.5 adds Top-P nucleus selection, Pearson correlation and a bounded Rust-only ELF64 object-emission milestone."
      eyebrow="Language prerelease · Reviewed source"
      date={release.date}
    >
      <p>
        <strong>{release.tag}</strong> was published on 9 November 2026.
        It expands the experimental scientific and AI-oriented numerical
        toolbox without adding a model runtime, sampling randomness, or
        stable native compilation. The compiler is still a prerelease.
      </p>

      <h2 id="nucleus">Deterministic Top-P (nucleus) selection</h2>
      <p>
        <code>top_p(probabilities, mass)</code> returns original zero-based
        candidate indices in descending probability order, stopping when
        their combined probability first reaches the requested mass.
        <code>top_p_values</code> returns the corresponding values.
        Equal probabilities retain their original-index order.
        Inputs must be finite, nonnegative and normalized to one within
        the documented tolerance; mass must be greater than zero and at
        most one. Exactly 1.0 retains all candidates, including zero-valued tails.
        Neither operation performs random sampling.
      </p>
      <CodeBlock filename="nucleus_selection.srp · alpha.6.5" code={"bind probabilities = [0.5, 0.25, 0.25];\nprint(top_p(probabilities, 0.75));\nprint(top_p_values(probabilities, 0.75));\nprint(top_p(probabilities, 1.0));"} />
      <CodeBlock filename="Expected stdout" code={"[integer: 0, 1]\n[0.5, 0.25]\n[integer: 0, 1, 2]"} />
      <p>
        <a href={sourceFile("examples/nucleus_selection.srp")}>Tagged example source</a>
        {" · "}<a href={sourceFile("examples/nucleus_selection.stdout")}>Exact stdout fixture</a>.
        The full pinned example also demonstrates composition with
        <code>softmax_temp</code>.
      </p>

      <h2 id="pearson">Centered Pearson correlation</h2>
      <p>
        <code>pearson_correlation(left, right)</code> measures the centered
        relationship between two equally sized finite numerical vectors.
        At least two observations and nonconstant values in each vector are
        required. This differs from <code>cosine_similarity</code>: the two
        axes are centered before correlation is computed. Numerical work
        remains bounded by the interpreter's resource contracts.
      </p>
      <CodeBlock filename="pearson_correlation.srp · alpha.6.5" code={"bind x = [1.0, 2.0, 3.0];\nprint(pearson_correlation(x, [10.0, 20.0, 30.0]));\nprint(pearson_correlation(x, [30.0, 20.0, 10.0]));"} />
      <CodeBlock filename="Expected stdout" code={"1.0\n-1.0"} />
      <p>
        <a href={sourceFile("examples/pearson_correlation.srp")}>Tagged example source</a>
        {" · "}<a href={sourceFile("examples/pearson_correlation.stdout")}>Exact stdout fixture</a>.
        Both numerical examples are included in this website's published-only
        Linux CI fixture suite, with execution, static verification and
        symbol/reference schema checks.
      </p>

      <h2 id="native">A narrow native-object milestone, not an executable compiler</h2>
      <p>
        The experimental Rust API
        <code>scarp::native_object::emit_elf64_integer_kernel</code> now
        accepts a bounded series of integer bindings that can refer to
        previous bindings. It produces an x86-64 ELF64 relocatable object
        exporting a restricted integer kernel; it does not link an executable,
        accept general Scarp programs, or introduce a
        <code>scarp compile</code> CLI. Windows and macOS native executable
        generation, generalized tensors, GPU acceleration, stochastic
        sampling, LSP integration and stable ABI remain unsupported.
      </p>
      <h2 id="next">Verify and explore</h2>
      <p>
        Review the <a href={project.repo + "/releases/tag/" + release.tag}>published release record</a>,
        {" "}<a href={project.repo + "/commit/" + release.source}>exact source commit</a>,
        {" "}<a href="/downloads/">platform archives and SHA-256 hashes</a>,
        {" "}<a href="/compatibility/">bounded website test evidence</a>,
        or the <a href="/news/alpha6-ranking-temperature/">earlier Top-K release overview</a>.
      </p>
    </Article>
  );
}
