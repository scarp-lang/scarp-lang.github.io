import Article from "../../layouts/Article.tsx";

export default function ArticlePage() {
  return (
    <Article
      title={"Source modules arrive in v0.0.5-alpha.1"}
      description={
        "Relative imports, explicit exports, and a published three-platform prerelease."
      }
      eyebrow={"Language release"}
      date={"2026-11-01"}
    >
      <p>
        The published <strong>v0.0.5-alpha.1</strong> milestone introduces
        source modules: relative <code>.srp</code> imports, explicit aliases,
        public functions and scalar literal constants, cycle diagnostics, and
        bounded source graphs.
      </p>
      <p>
        The release builds on the existing functions, numerical runtime, tiles,
        and execution budgets. Packages are available for Windows x64 MSVC,
        Linux x64 GNU, and macOS ARM64.
      </p>
      <h2 id={"start-with-a-multi-file-example"}>
        Start with a multi-file example
      </h2>
      <p>
        The package includes examples. Follow the{" "}
        <a href={"https://scarp-lang.github.io/scarp-docs/language/modules"}>
          module guide
        </a>{" "}
        and the compiler’s{" "}
        <a
          href={
            "https://github.com/scarp-lang/scarp/blob/afe8b5380c9d6c4774162e51c6c9bc8b90901671/examples/module_demo.srp"
          }
        >
          three-file example
        </a>
        .
      </p>
      <h2 id={"keep-the-alpha-context"}>Keep the alpha context</h2>
      <p>
        This is an experimental prerelease. Modules do not yet include runtime
        globals or re-exports, and Scarp remains an interpreter. Read the{" "}
        <a href={"/development/"}>current state</a> for the wider set of limits.
      </p>
      <p>
        <a href={"/downloads/"}>Download the release →</a>
      </p>
      <p>
        Sources:{" "}
        <a
          href={
            "https://github.com/scarp-lang/scarp/releases/tag/v0.0.5-alpha.1"
          }
        >
          published release
        </a>{" "}
        ·{" "}
        <a
          href={
            "https://github.com/scarp-lang/scarp/blob/1d3b69a79bb0f656b4da3517560ce59e1e41f3bc/docs/releases/v0.0.5-alpha.1-validation.md"
          }
        >
          publication verification
        </a>
        .
      </p>
    </Article>
  );
}
