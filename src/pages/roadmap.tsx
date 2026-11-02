import Article from "../layouts/Article.tsx";

export default function ArticlePage() {
  return (
    <Article
      title={"A direction, built step by step."}
      description={
        "The path from a working interpreter toward a stable, useful language."
      }
      eyebrow={"Roadmap & future vision"}
    >
      <h2 id={"published--the-current-foundation"}>
        Published · The current foundation
      </h2>
      <p>
        <strong>v0.0.5-alpha.1</strong> provides typed functions, contracts,
        numerical vectors and tiles, runtime budgets, and relative source
        modules. This is the <a href={"/development/"}>published baseline</a>,
        with experimental syntax and APIs.
      </p>
      <h2 id={"next-priorities--make-modules-easier-to-work-with"}>
        Next priorities · Make modules easier to work with
      </h2>
      <p>
        The compiler repository lists module tooling, additional conformance,
        and source navigation as its next priorities. These are development
        directions; they do not imply a completed feature or a release date.
      </p>
      <h2 id={"planned--stronger-language-and-library-foundations"}>
        Planned · Stronger language and library foundations
      </h2>
      <p>The source roadmap then calls for:</p>
      <ol>
        <li>Explicit constant-expression and library organization design.</li>
        <li>User-defined types and callable values.</li>
        <li>A compiler backend and developer tooling.</li>
        <li>Domain-specific libraries.</li>
      </ol>
      <p>
        See the{" "}
        <a
          href={
            "https://github.com/scarp-lang/scarp/blob/afe8b5380c9d6c4774162e51c6c9bc8b90901671/README.md#prototype-limits-and-planned-roadmap"
          }
        >
          reviewed compiler roadmap
        </a>{" "}
        for the upstream ordering. Priorities may change as implementation
        reveals new requirements.
      </p>
      <h2 id={"future-vision--ai-development-with-less-friction"}>
        Future vision · AI development with less friction
      </h2>
      <p>
        Scarp aims to make AI development more approachable through language and
        tooling design. Today’s numerical values are an early foundation. A
        complete AI framework, automatic differentiation, GPU execution, general
        tensors, and a mature package ecosystem require separate design and
        implementation milestones.
      </p>
      <p>
        <a href={"/ai/"}>Explore the AI direction →</a>
      </p>
      <h2 id={"toward-v100"}>Toward v1.0.0</h2>
      <p>
        A stable release should be grounded in a documented language contract,
        reliable tools and packages, conformance tests, compatibility
        expectations, and clear limitations. These are readiness goals for this
        project hub, not a claim that the compiler team has committed to a fixed
        release checklist.
      </p>
      <p>
        There is no announced v1.0.0 date. We track concrete capabilities and
        reviewed evidence instead of arbitrary completion percentages.
      </p>
      <p>
        <a href={"/releases/"}>See available releases</a> ·{" "}
        <a href={"/contribute/"}>Contribute to the next step</a>
      </p>
    </Article>
  );
}
