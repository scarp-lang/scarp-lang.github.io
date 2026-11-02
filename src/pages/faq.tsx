import Article from "../layouts/Article.tsx";

export default function ArticlePage() {
  return (
    <Article
      title={"A few things to know."}
      description={
        "Answers about Scarp’s status, installation, language features, and long-term direction."
      }
      eyebrow={"Frequently asked questions"}
    >
      <h2 id={"is-scarp-stable"}>Is Scarp stable?</h2>
      <p>
        The reviewed baseline is <strong>v0.0.5-alpha.1</strong>, an
        experimental prerelease. Syntax and APIs can change. A stable v1.0.0
        date has not been announced.
      </p>
      <h2 id={"is-scarp-a-compiler-or-an-interpreter"}>
        Is Scarp a compiler or an interpreter?
      </h2>
      <p>
        The current Rust implementation lexes, parses, resolves, and interprets
        Scarp programs. It does not generate native code for <code>.srp</code>{" "}
        programs. There is no <code>scarp compile</code> CLI command.
      </p>
      <h2 id={"where-can-i-try-it"}>Where can I try it?</h2>
      <p>
        <a href={"/downloads/"}>Download a package</a> for Windows x64, Linux
        x64 GNU, or macOS ARM64, or build from source using Rust and Cargo.
        Follow the{" "}
        <a href={"https://scarp-lang.github.io/scarp-docs/guide/first-program"}>
          first-program guide
        </a>
        .
      </p>
      <h2 id={"is-there-a-browser-playground"}>
        Is there a browser playground?
      </h2>
      <p>
        This website shows runnable CLI examples and their expected output. It
        does not execute Scarp code in the browser. An interactive execution
        playground would require a separate runtime integration.
      </p>
      <h2 id={"can-i-train-ai-models-with-scarp"}>
        Can I train AI models with Scarp?
      </h2>
      <p>
        The interpreter has numerical primitives, including vectors, tiles,
        losses, and explicit loss gradients. It is not a complete model-training
        framework. Automatic differentiation, GPU execution, and general tensors
        need further milestones. See the <a href={"/ai/"}>AI direction</a>.
      </p>
      <h2 id={"does-scarp-require-manual-memory-management"}>
        Does Scarp require manual memory management?
      </h2>
      <p>
        The current interpreter automatically retires inaccessible scope values
        and exposes execution budgets. It does not ask users to write pointer,
        ownership, or manual allocation syntax. Budgets do not represent total
        process memory or a security sandbox. Read the{" "}
        <a href={"https://scarp-lang.github.io/scarp-docs/language/memory"}>
          memory guide
        </a>
        .
      </p>
      <h2 id={"does-check-only-inspect-syntax-and-types"}>
        Does <code>check</code> only inspect syntax and types?
      </h2>
      <p>
        It also evaluates the selected program path in fresh local storage,
        without program output. Reachable arithmetic and execution-budget
        failures can therefore be reported by <code>check</code>.
      </p>
      <h2 id={"where-are-the-detailed-docs"}>Where are the detailed docs?</h2>
      <p>
        <a href={"https://scarp-lang.github.io/scarp-docs/"}>Scarp Docs</a>{" "}
        hosts tutorials and reference material in English and{" "}
        <a href={"https://scarp-lang.github.io/scarp-docs/hi/"}>Hindi</a>. This
        main website hosts project status, releases, news, and the roadmap.
      </p>
      <h2 id={"how-is-it-licensed"}>How is it licensed?</h2>
      <p>
        The language implementation is <strong>Apache-2.0</strong>. This website
        is <strong>MIT</strong>. Both repositories are public.
      </p>
      <h2 id={"how-can-i-help"}>How can I help?</h2>
      <p>
        <a href={"/contribute/"}>Start with a focused contribution</a>: test a
        program, improve an explanation, or open a reproducible bug report.
      </p>
      <h2 id={"where-can-i-get-help"}>Where can I get help?</h2>
      <p>
        The <a href={"/support/"}>support hub</a> points to installation,
        diagnostics, compatibility, and troubleshooting guides, including Hindi
        help. It also explains which issue tracker to use and what information
        makes a report reproducible.
      </p>
    </Article>
  );
}
