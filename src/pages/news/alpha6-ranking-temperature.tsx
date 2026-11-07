import Article from "../../layouts/Article.tsx";
import CodeBlock from "../../components/CodeBlock.tsx";
import { project } from "../../data/project.ts";

/** Immutable, published alpha.6.3 evidence; do not bind to the mutable latest pin. */
const release = {
  tag: "v0.0.6-alpha.3",
  date: "2026-11-07",
  source: "ceff07d9014f466974e0c9e02fc5d23573f55777",
} as const;
const sourceFile = (path: string) => `${project.repo}/blob/${release.source}/${path}`;

export default function Alpha6RankingPage() {
  return (
    <Article
      title="Scarp alpha.6.3: deterministic Top-K and temperature softmax"
      description="Published Scarp v0.0.6-alpha.3 adds typed Top-K score selection and stable temperature-aware probabilities, with internal scalar IR verification."
      eyebrow="Language prerelease · Reviewed source"
      date={release.date}
    >
      <p>
        <strong>{release.tag}</strong> was published on 7 November 2026.
        It adds four pure numerical built-ins for finite vectors, along with
        internal scalar compiler correctness work. Scarp remains an experimental
        interpreter-backed language; this is not a stable release.
      </p>

      <h2 id="ranking">Deterministic Top-K ranking</h2>
      <p>
        <code>topk(scores, count)</code> returns the original zero-based
        indices of the highest scores, greatest first, as an immutable
        integer collection. <code>topk_values(scores, count)</code> returns
        their original numerical values in the same order. Equal scores
        prefer the earlier input index, and asking for zero results is valid.
        Input scores must be finite; selection is subject to explicit
        work and allocation quotas.
      </p>
      <CodeBlock filename="topk_scores.srp · alpha.6.3" code={"bind scores = [1.0, 5.0, 5.0, -2.0, 3.0];\nprint(topk(scores, 3));\nprint(topk_values(scores, 3));"} />
      <CodeBlock filename="Expected stdout" code={"[integer: 1, 2, 4]\n[5.0, 5.0, 3.0]"} />
      <p>
        <a href={sourceFile("docs/topk-selection.md")}>Top-K source contract</a>
        {" · "}<a href={sourceFile("examples/topk_scores.srp")}>published example</a>
        {" · "}<a href={sourceFile("examples/topk_scores.stdout")}>exact expected stdout</a>.
      </p>

      <h2 id="temperature">Temperature-controlled probabilities</h2>
      <p>
        <code>softmax_temp(scores, temperature)</code> computes a probability
        vector. <code>logsoftmax_temp(scores, temperature)</code> computes
        its log probabilities. Temperature must be a positive finite float.
        Stable maximum-shifting and compensated normalization reduce avoidable
        overflow; unrepresentable log probabilities are diagnosed rather
        than published as infinite values. These are deterministic
        transformations, not random sampling.
      </p>
      <CodeBlock filename="temperature_softmax.srp · alpha.6.3" code={"print(softmax_temp([2.0, 2.0], 0.5));\nprint(logsoftmax_temp([5.0], 2.0));"} />
      <CodeBlock filename="Expected stdout" code={"[0.5, 0.5]\n[0.0]"} />
      <p>
        <a href={sourceFile("docs/temperature-softmax.md")}>Temperature softmax source contract</a>
        {" · "}<a href={sourceFile("examples/temperature_softmax.srp")}>published example</a>
        {" · "}<a href={sourceFile("examples/temperature_softmax.stdout")}>exact expected stdout</a>.
        These example files are separately tested against the pinned published
        compiler in the website's CI.
      </p>

      <h2 id="internals">Compiler correctness, not general native compilation</h2>
      <p>
        The experimental scalar C11 backend now uses compiler-owned typed
        expression and statement IR internally, with validation of branches,
        storage initialization and type expectations. Test-only differential
        execution compares outcomes against the interpreter. This does not add
        a public <code>scarp compile</code> CLI or a general native compiler.
      </p>
      <h2 id="limits">Compatibility and limits</h2>
      <p>
        These functions extend the existing numerical built-ins without new
        source syntax or CLI commands. Earlier read-only symbol inspection,
        vector <code>rms</code> and optional Rust embedding caches remain.
        Rust embedding consumers exhaustively matching the numeric
        built-in enum may need changes. Scarp still has no LSP, general
        tensor engine, GPU backend, model-training framework, top-p sampling,
        package registry or stable ABI.
      </p>
      <p>
        Review the <a href={project.repo + "/releases/tag/" + release.tag}>official published release</a>,
        {" "}<a href={project.repo + "/commit/" + release.source}>exact source commit</a>,
        {" "}<a href="/downloads/">verified platform archives</a>,
        {" "}<a href="/compatibility/">tested fixture scope</a>, or
        {" "}<a href="/news/alpha6-cache-apis/">previous alpha.6.2 cache update</a>.
      </p>
    </Article>
  );
}
