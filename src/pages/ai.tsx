import Article from "../layouts/Article.tsx";

export default function ArticlePage() {
  return (
    <Article
      title={"A numerical foundation. An AI ambition."}
      description={
        "Where Scarp’s AI development direction stands today, and what still needs to be built."
      }
      eyebrow={"AI development"}
    >
      <h2 id={"the-direction"}>The direction</h2>
      <p>
        Scarp’s long-term ambition is to make AI development more approachable
        through the language and its developer tools. That ambition guides
        exploration; it is not a claim of a finished AI ecosystem or a measured
        advantage over another language.
      </p>
      <h2 id={"available-today"}>Available today</h2>
      <p>
        The published <strong>v0.0.5-alpha.1</strong> interpreter includes
        finite binary64 values, immutable numerical vectors, and two-axis tiles.
        Numerical operations cover compensated reductions, scaled norms,
        softmax, log-space operations, matrix products, categorical losses,
        one-hot targets, and explicit loss gradients.
      </p>
      <p>
        Read the{" "}
        <a href={"https://scarp-lang.github.io/scarp-docs/language/numerics"}>
          numerical guide
        </a>{" "}
        and the compiler’s{" "}
        <a
          href={
            "https://github.com/scarp-lang/scarp/blob/afe8b5380c9d6c4774162e51c6c9bc8b90901671/docs/tiles.md"
          }
        >
          tile reference
        </a>
        .
      </p>
      <h2 id={"what-that-enables"}>What that enables</h2>
      <p>
        You can explore small numerical programs, combine operations inside
        typed functions, and organize source across modules. Runtime quotas
        bound selected execution and numerical allocation resources.
      </p>
      <p>
        These are interpreter primitives. Explicit loss gradients do not
        constitute an automatic differentiation engine.
      </p>
      <h2 id={"future-milestones"}>Future milestones</h2>
      <p>
        General tensors, automatic differentiation, GPU backends, native
        compilation, and domain libraries need separate integration decisions
        and implementation work. A full model-training framework is not part of
        the published release.
      </p>
      <p>
        There are no published speed comparisons with Python, C++, or Rust, and
        no advertised model-training performance results.
      </p>
      <p>
        <a href={"/roadmap/"}>Follow the roadmap →</a> ·{" "}
        <a href={"https://github.com/scarp-lang/scarp/issues"}>
          Discuss a numerical use case →
        </a>
      </p>
    </Article>
  );
}
