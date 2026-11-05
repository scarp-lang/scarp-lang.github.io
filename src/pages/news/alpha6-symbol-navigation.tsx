import Article from "../../layouts/Article.tsx";
import CodeBlock from "../../components/CodeBlock.tsx";
import { project } from "../../data/project.ts";
import { publishedCompiler } from "../../data/releases.ts";

export default function Alpha6SymbolNavigationPage() {
  return (
    <Article
      title="Scarp alpha.6: navigate symbols and measure vector RMS"
      description="The published v0.0.6-alpha.1 prerelease adds opt-in static symbol/reference inspection and an RMS numerical builtin, with an experimental compiler and no LSP integration."
      eyebrow="Language prerelease · Reviewed source"
      date={publishedCompiler.reviewed}
    >
      <p>
        <strong>{publishedCompiler.tag}</strong> was published on{" "}
        <strong>5 November 2026</strong>. It extends the earlier project-aware
        Scarp CLI with read-only, cross-file source symbol and reference
        inspection, plus a finite vector <code>rms</code> builtin. The language
        remains experimental and the website does not claim an integrated
        language server, automatic refactoring, or stable APIs.
      </p>

      <h2 id="navigate-source">Inspect declarations and references</h2>
      <p>
        Use the <a href="/downloads/">published interpreter</a> with a Scarp
        source file or explicit project directory. These commands statically
        resolve the program without running ordinary statements:
      </p>
      <CodeBlock filename="Terminal · alpha.6" code={"scarp inspect symbols --json hello.srp\nscarp inspect references --json hello.srp"} />
      <p>
        Both JSON outputs identify schema version 1 and their respective
        <code>kind</code> values. They retain source locations for supported
        declarations and reference sites, including cross-file uses and
        shadowed names. Symbol IDs are compilation-local; consumers must
        rebuild indexes after edits rather than persisting IDs.
      </p>
      <p>
        Read the{" "}
        <a href={project.repo + "/blob/" + publishedCompiler.sourceCommit + "/docs/symbol-index.md"}>
          source-pinned symbol-index contract
        </a>{" "}
        for JSON fields, failure modes, size limits and what is deliberately
        excluded. This is not an LSP server or a rename operation.
      </p>

      <h2 id="vector-rms">RMS for finite numerical vectors</h2>
      <p>
        The <code>rms(vector)</code> builtin computes a scaled,
        compensated root mean square for a nonempty finite vector.
        It is intended to avoid intermediate overflow when input values
        are large. An empty input produces a diagnostic. The following
        example is executed in website CI under the published alpha.6
        source—not under the historical alpha.1 baseline:
      </p>
      <CodeBlock filename="rms.srp" code={"print(rms([2.0, -2.0]));"} />
      <CodeBlock filename="Expected stdout" code="2.0" />
      <p>
        See the{" "}
        <a href={project.repo + "/blob/" + publishedCompiler.sourceCommit + "/docs/root-mean-square.md"}>
          pinned RMS reference
        </a>{" "}
        and <a href="/compatibility/#published-only">verified example scope</a>.
        This feature does not introduce general tensors, GPU computation,
        automatic differentiation or a model-training framework.
      </p>

      <h2 id="compatibility">What remains experimental?</h2>
      <p>
        <code>exec</code>, static <code>verify</code>, offline project
        creation and inspection retain their established CLI meanings.
        The earlier limited C11 emitter remains a Rust embedding API,
        not a <code>scarp compile</code> command. No general native
        executable generator or package registry is included.
      </p>
      <p>
        The <a href={publishedCompiler.release}>GitHub release record</a> and{" "}
        <a href={project.repo + "/commit/" + publishedCompiler.sourceCommit}>
          annotated-tag source commit
        </a>{" "}
        establish publication and source identity. The compiler's
        source-pinned design notes still contain candidate-stage wording;
        publication status here is based on the actual GitHub release.
      </p>
      <p>
        Continue with the <a href="/learn/">version-aware quickstart</a>,{" "}
        <a href="/migration/">CLI migration guidance</a> or{" "}
        <a href="/downloads/">SHA-256 verified downloads</a>.
      </p>
    </Article>
  );
}
