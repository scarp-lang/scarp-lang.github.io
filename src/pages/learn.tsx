import Article from "../layouts/Article.tsx";
import CodeBlock from "../components/CodeBlock.tsx";
import { project } from "../data/project.ts";
import { publishedCompiler } from "../data/releases.ts";
import { alpha8ProjectWorkflow } from "../data/project-workflow.ts";

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

      <h2 id="03--try-an-offline-project">03 · Build an offline project (alpha.8)</h2>
      <p>
        With <strong>{publishedCompiler.tag}</strong>, create a new project
        directory from a terminal in its parent folder. <code>init</code>
        refuses to overwrite an existing directory:
      </p>
      <CodeBlock filename="Terminal · Scarp alpha.8" code="scarp init calculator" />
      <p>
        The new project contains a declarative <code>scarp.project</code>
        manifest, <code>src/main.srp</code>, and folders for tests and
        examples. Add the files below to make a reusable calculator:
      </p>
      <CodeBlock filename="Project layout · after creating files" code={"calculator/\n  scarp.project\n  src/\n    main.srp\n    math.srp\n  tests/\n    addition.srp\n    greeting.srp\n    greeting.stdin"} />
      <p>
        The manifest is not TOML or executable Scarp. <code>init</code>
        generates it; this is the copyable declarative content for the
        project named <code>calculator</code>:
      </p>
      <CodeBlock filename="calculator/scarp.project" code={alpha8ProjectWorkflow.manifestSource} />
      <p>
        Create <code>src/math.srp</code> with a public, pure typed
        function. Then replace the generated <code>src/main.srp</code>
        with the following entrypoint:
      </p>
      <CodeBlock filename="calculator/src/math.srp" code={alpha8ProjectWorkflow.moduleSource} />
      <CodeBlock filename="calculator/src/main.srp" code={alpha8ProjectWorkflow.mainSource} />
      <p>
        From the parent of <code>calculator/</code>, verify the project
        without running the program, then run it and inspect the
        validated manifest:
      </p>
      <CodeBlock filename="Terminal · alpha.8" code={"scarp verify calculator\nscarp run calculator\nscarp project info --json calculator"} />
      <CodeBlock filename="Expected stdout from scarp run calculator" code={alpha8ProjectWorkflow.expectedMainStdout} />
      <p>
        The commands work on the project directory, not directly on the
        <code> scarp.project</code> file. <code>run</code> executes the
        declared entrypoint; <code>project info</code> only reads and validates
        metadata, without running application code.
      </p>

      <h3 id="alpha8-projects">Add real Scarp tests</h3>
      <p>
        Scarp discovers ordinary <code>.srp</code> test programs immediately
        inside <code>tests/</code>. Save this file to test the imported
        <code> math.add</code> function:
      </p>
      <CodeBlock filename="calculator/tests/addition.srp" code={alpha8ProjectWorkflow.additionSource} />
      <p>
        To test user input without an interactive terminal, add a second
        test and a matching UTF-8 input fixture. The
        <code> greeting.stdin</code> file contains <code>नमस्ते</code>
        followed by a newline:
      </p>
      <CodeBlock filename="calculator/tests/greeting.srp" code={alpha8ProjectWorkflow.greetingSource} />
      <CodeBlock filename="calculator/tests/greeting.stdin · UTF-8" code={alpha8ProjectWorkflow.greetingInput} />
      <CodeBlock filename="Terminal · alpha.8" code={"scarp test --list calculator\nscarp test --require-tests calculator\nscarp test --json calculator\nscarp test --filter greeting --require-tests calculator"} />
      <p>
        <code>--list</code> does not run tests;
        <code>--require-tests</code> makes an empty suite fail; and
        <code>--filter</code> uses a case-sensitive filename substring.
        The JSON report captures test output rather than mixing application
        text into the report. The compiler's <code>assert</code> statement
        reports error E0065 if its boolean condition is false.
      </p>
      <p>
        These are the exact manifest and Scarp source files run in
        <a href={project.websiteRepo + "/blob/main/scripts/test-project-workflow.ts"}> website CI</a>
        against the pinned published compiler, with verified app output
        <code> 42</code>. See the <a href="/compatibility/#project-workflow">verification scope</a>,
        <a href="/news/alpha8-project-tests/"> alpha.8 release guide</a> and
        <a href={project.repo + "/blob/" + publishedCompiler.sourceCommit + "/examples/projects/calculator/README.md"}> release-pinned example</a>.
        This workflow has no dependency installer, package registry or
        native executable build.
      </p>

      <h2 id="04--explore-new-alpha6-capabilities">04 · Explore alpha.6-only tools</h2>
      <p>
        {publishedCompiler.tag} retains opt-in, read-only symbol and reference
        indexes. These commands type-check source without executing ordinary
        statements; they are not an integrated language server:
      </p>
      <CodeBlock filename="Terminal · alpha.6" code={"scarp inspect symbols --json hello.srp\nscarp inspect references --json hello.srp"} />
      <p>
        The alpha.6 series includes <code>rms(vector)</code> for finite, nonempty
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

      <h2 id="05--rank-with-alpha63">05 · Rank scores in alpha.6.3</h2>
      <p>
        The published {publishedCompiler.tag} interpreter also supports pure{" "}
        <code>topk</code>, <code>topk_values</code>,{" "}
        <code>softmax_temp</code> and <code>logsoftmax_temp</code> numerical
        built-ins. Tie scores keep earlier input indices first; temperature
        must be a positive finite float. No random sampling or GPU runtime
        is included.
      </p>
      <CodeBlock filename="topk.srp · published alpha.6.3"
        code={"bind scores = [1.0, 5.0, 5.0, -2.0, 3.0];\nprint(topk(scores, 3));\nprint(topk_values(scores, 3));"} />
      <CodeBlock filename="Expected stdout" code={"[integer: 1, 2, 4]\n[5.0, 5.0, 3.0]"} />
      <p>
        This follows the exact <a href="/news/alpha6-ranking-temperature/">alpha.6.3 release examples</a>.
        Read the <a href="/compatibility/#published-only">published-only fixture evidence</a>{" "}
        before assuming code works on an older compiler.
      </p>

      <h2 id="06--input-and-tuples-alpha66">06 · Try input and tuples in alpha.6.6</h2>
      <p>
        In <a href="/news/alpha6-input-tuples/">{publishedCompiler.tag}</a>,
        immutable tuples can hold values of different types. A tuple
        annotation names each element's type, and a literal index accesses
        an element:
      </p>
      <CodeBlock filename="pair.srp · alpha.6.6" code={'bind pair: tuple<integer, string> = (42, "नमस्ते");\nprint(pair[0]);'} />
      <p>
        This snippet illustrates the new syntax; it is not part of the
        website's three cross-version CI fixtures. For tested input behavior
        and exact expected output, see the compiler's
        <a href={project.repo + "/blob/" + publishedCompiler.sourceCommit + "/examples/core_input_tuple.srp"}>
          tagged input-and-tuple example
        </a>. <code>read_line()</code> requires a supplied reader; the
        packaged CLI supports redirected stdin but not interactive prompting.
        Rust embedding clients must review the new structural type contracts.
      </p>

      <h2 id="older-example-baseline">Using the older website example baseline?</h2>
      <p>
        The separate alpha.4+ legacy project workflow uses
        <code> Scarp.project</code>, <code>create</code>, and
        <code>launch</code>. These older commands remain accepted by
        alpha.8, but they do not generate the new declarative format:
      </p>
      <CodeBlock filename="Terminal · legacy project workflow" code={"scarp create hello-world\nscarp verify hello-world\nscarp launch hello-world"} />
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
