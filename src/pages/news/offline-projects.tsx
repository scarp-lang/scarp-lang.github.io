import Article from "../../layouts/Article.tsx";
import CodeBlock from "../../components/CodeBlock.tsx";

export default function OfflineProjectsPage() {
  return (
    <Article
      title="Scarp alpha.4: projects you can create and launch"
      description="A published prerelease introduces offline project creation, manifest-based execution, and static verification."
      eyebrow="Language release"
      date="2026-11-03"
    >
      <p>
        Scarp <strong>v0.0.5-alpha.4</strong>, published on 3 November 2026,
        adds a local project workflow to the experimental Rust interpreter.
        You can create a project, validate its entrypoint without running the
        program, and launch it using an explicit project directory.
      </p>

      <h2 id="first-project">Create your first project</h2>
      <p>
        With the alpha.4 Scarp executable available in your terminal, run:
      </p>
      <CodeBlock
        filename="terminal"
        code={"scarp version\nscarp create hello-world\nscarp verify hello-world\nscarp launch hello-world"}
      />
      <p>
        The <code>create</code> command writes a new <code>Scarp.project</code>
        manifest and <code>src/main.srp</code>. It refuses to adopt or overwrite
        an existing destination, even if the directory is empty. Both
        <code>verify</code> and <code>launch</code> require an explicit path
        rather than searching parent directories.
      </p>
      <p>A generated manifest follows this development format:</p>
      <CodeBlock
        filename="Scarp.project"
        code={"scarp-project: 1\nname: hello-world\nentry: src/main.srp"}
      />

      <h2 id="verification">Static verification is not execution</h2>
      <p>
        <code>scarp verify hello-world</code> checks the declared entrypoint
        and imported source modules statically, without executing ordinary
        program statements. <code>scarp launch hello-world</code> executes the
        entrypoint through the interpreter and applies runtime budgets.
        The older <code>check</code> command can evaluate a program, so it is
        not a substitute for the newer static-only <code>verify</code>.
      </p>

      <h2 id="limitations">An alpha, not a stable project standard</h2>
      <p>
        The manifest is a versioned development format, not a stable package
        standard. Scarp does not yet provide native executable generation from
        <code>.srp</code> files, a package registry, general tensor training,
        GPU execution, or language-level asynchronous concurrency. The new
        project commands work locally without downloading dependencies or
        sending source code to a remote service.
      </p>

      <h2 id="sources">Try the published build and inspect the evidence</h2>
      <p>
        Download the <a href="/downloads/">three-platform alpha.4 archives
        and checksums</a>, read the
        <a href="https://github.com/scarp-lang/scarp/releases/tag/v0.0.5-alpha.4"> official release notes</a>,
        or inspect the
        <a href="https://github.com/scarp-lang/scarp/commit/79141329176f5dce51457e90a6652902f6432135"> exact published source commit</a>.
        The website's <a href="/compatibility/">compatibility guide</a>
        separately identifies the three examples verified against alpha.4
        and the older alpha.1 baseline; it is not a guarantee for all programs.
      </p>
    </Article>
  );
}
