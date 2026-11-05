import Article from "../layouts/Article.tsx";
import CodeBlock from "../components/CodeBlock.tsx";
import { project } from "../data/project.ts";
import { publishedCompiler } from "../data/releases.ts";

export default function LearnPage() {
  return (
    <Article
      title="Your first Scarp program."
      description="Start Scarp with version-specific interpreter commands, verified examples, and links to the official English and Hindi guides."
      eyebrow="Learn Scarp · Getting started"
    >
      <p>
        Scarp is an experimental interpreter. Start by choosing a matching
        release, rather than mixing commands from different prereleases.
        The latest reviewed published release is{" "}
        <a href={publishedCompiler.release}>{publishedCompiler.tag}</a>. The
        older <a href={project.release}>{project.tag}</a> version remains the
        baseline for the homepage examples and some documentation.
      </p>

      <h2 id="01--get-the-interpreter">01 · Get the interpreter</h2>
      <ol>
        <li>
          <a href="/downloads/">Download the {publishedCompiler.tag} archive</a> for
          Windows x64, Linux x64 GNU or Apple Silicon macOS.
        </li>
        <li>
          Download its <code>.sha256</code> file, compare the digest with the{" "}
          <a href="/downloads/#verify-download">published checksum</a> and
          extract the archive only after verification succeeds.
        </li>
        <li>
          Open a terminal in the extracted folder and confirm the version:
          <CodeBlock filename="Terminal" code="scarp version" />
          Run the local executable as <code>./scarp</code> on Linux/macOS or{" "}
          <code>.\\scarp.exe</code> on Windows PowerShell if it is not in
          your <code>PATH</code>. The commands below use <code>scarp</code>{" "}
          for readability.
        </li>
      </ol>
      <p className="small muted">
        Keep the archive's bundled files together. The published package is
        an interpreter, not an installer or a native-code compiler.
        Building from source is also possible using the{" "}
        <a href={project.repo + "/tree/" + publishedCompiler.sourceCommit}>
          exact published Rust source
        </a>.
      </p>

      <h2 id="02--write-your-first-program">02 · Write and run hello.srp</h2>
      <p>
        Save a UTF-8 text file named <code>hello.srp</code> in the current folder:
      </p>
      <CodeBlock filename="hello.srp" code={'print("Hello from Scarp!");'} />
      <p>
        With <strong>{publishedCompiler.tag}</strong>, statically check the
        source and then execute it:
      </p>
      <CodeBlock filename="Terminal · published alpha.6" code={"scarp verify hello.srp\nscarp exec hello.srp"} />
      <p>
        Expected output when executed:
      </p>
      <CodeBlock filename="stdout" code="Hello from Scarp!" />
      <p>
        <code>verify</code> checks source without executing normal runtime
        statements; <code>exec</code> runs the interpreter. A successful
        static check does not guarantee that runtime operations will succeed.
      </p>

      <h2 id="03--try-an-offline-project">03 · Create an offline project</h2>
      <p>
        Starting with alpha.4, Scarp can create a small project with an
        explicit <code>Scarp.project</code> manifest. Choose a destination
        that does not already exist:
      </p>
      <CodeBlock filename="Terminal · published alpha.6" code={"scarp create hello-world\nscarp verify hello-world\nscarp launch hello-world"} />
      <p>
        Project verification is static; <code>launch</code> executes the
        declared entrypoint. No package registry, dependency resolution,
        installer, or native executable is produced. See the{" "}
        <a href={project.repo + "/blob/" + publishedCompiler.sourceCommit + "/docs/project-workflow.md"}>
          release-pinned project workflow
        </a>.
      </p>

      <h2 id="04--explore-new-alpha6-capabilities">04 · Explore alpha.6-only tools</h2>
      <p>
        {publishedCompiler.tag} adds opt-in, read-only symbol and reference
        indexes. These commands type-check source without executing ordinary
        statements; they are not an integrated language server:
      </p>
      <CodeBlock filename="Terminal · alpha.6" code={"scarp inspect symbols --json hello.srp\nscarp inspect references --json hello.srp"} />
      <p>
        The same release adds <code>rms(vector)</code> for finite, nonempty
        numerical vectors. This example is separately tested in website CI
        against the published alpha.6 interpreter:
      </p>
      <CodeBlock filename="rms.srp · alpha.6 only" code={"print(rms([2.0, -2.0]));"} />
      <CodeBlock filename="Expected stdout" code="2.0" />
      <p>
        See the <a href="/compatibility/">exact tested fixture scope</a> and{" "}
        <a href={project.repo + "/blob/" + publishedCompiler.sourceCommit + "/docs/symbol-index.md"}>
          symbol-index reference
        </a>. Do not run alpha.6-only examples with the older alpha.1 interpreter.
      </p>

      <h2 id="older-example-baseline">Using the older website example baseline?</h2>
      <p>
        The featured homepage examples are pinned to{" "}
        <a href={project.release}>{project.tag}</a>. Under that older
        interpreter, use these historical commands instead:
      </p>
      <CodeBlock filename="Terminal · historical alpha.1" code={"scarp run hello.srp\nscarp check hello.srp"} />
      <p>
        Legacy <code>check</code> can evaluate selected program paths while
        suppressing output. It is <strong>not</strong> equivalent to the
        later static-only <code>verify</code>. Consult the{" "}
        <a href="/migration/">version-by-version migration guide</a>.
      </p>

      <h2 id="choose-what-to-learn-next">Choose what to learn next</h2>
      <table>
        <thead><tr><th>Goal</th><th>Official resource</th></tr></thead>
        <tbody>
          <tr><td>First Scarp program</td><td><a href={project.docs + "guide/first-program"}>First-program guide</a></td></tr>
          <tr><td>Language syntax</td><td><a href={project.docs + "language/overview"}>Language overview</a></td></tr>
          <tr><td>Typed functions</td><td><a href={project.docs + "language/functions"}>Function reference</a></td></tr>
          <tr><td>Numerical foundations</td><td><a href={project.docs + "language/numerics"}>Numerics guide</a></td></tr>
          <tr><td>Multiple source files</td><td><a href={project.docs + "language/modules"}>Source modules</a></td></tr>
          <tr><td>हिंदी में सीखें</td><td><a lang="hi" href={project.docs + "hi/"}>हिंदी दस्तावेज़</a></td></tr>
        </tbody>
      </table>
      <p className="small muted">
        The documentation website may use an older compiler baseline: read
        each guide's version notes before copying its commands into the
        latest prerelease.
      </p>
    </Article>
  );
}
