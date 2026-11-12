import Article from "../../layouts/Article.tsx";
import CodeBlock from "../../components/CodeBlock.tsx";
import { project } from "../../data/project.ts";
import { alpha8ProjectWorkflow } from "../../data/project-workflow.ts";

/** Immutable alpha.8 release evidence, separate from the website example baseline. */
const release = {
  tag: "v0.0.6-alpha.8",
  date: "2026-11-12",
  source: "37253e7805c0ca594560700dd1deb3928458e60d",
} as const;
const sourceFile = (path: string) => project.repo + "/blob/" + release.source + "/" + path;

export default function Alpha8ProjectsAndTests() {
  return (
    <Article
      title="Scarp alpha.8: declarative projects and executable tests"
      description="Scarp v0.0.6-alpha.8 adds scarp.project manifests, a project test runner, assertions and per-test stdin fixtures."
      eyebrow="Language prerelease · Reviewed source"
      date={release.date}
    >
      <p>
        <strong>{release.tag}</strong> was published on 12 November 2026.
        This experimental release introduces declarative offline projects,
        executable Scarp test files, and interpreter assertions. The homepage
        examples remain pinned to their historical compiler baseline.
      </p>

      <h2 id="projects">Create a declarative Scarp project</h2>
      <CodeBlock filename="Terminal · alpha.8" code={"scarp init calculator\nscarp verify calculator\nscarp run calculator\nscarp project info calculator"} />
      <p>
        <code>init</code> requires a new directory and creates a
        <code>scarp.project</code> manifest pointing to a
        <code>src/main.srp</code> entrypoint. <code>verify</code> performs
        static checking; <code>run</code> interprets the entrypoint; and
        <code>project info</code> reads validated metadata without executing
        application code. The manifest is Scarp-specific, not TOML or
        executable source. Existing <code>Scarp.project</code>,
        <code>create</code> and <code>launch</code> remain supported.
      </p>

      <p>
        For a complete starter project, use the
        <a href="/learn/#03--try-an-offline-project"> beginner guide</a>,
        including the following CI-tested files. The application uses a
        public, pure <code>add</code> function imported by its entrypoint
        and its tests:
      </p>
      <CodeBlock filename="src/math.srp · alpha.8" code={alpha8ProjectWorkflow.moduleSource} />
      <CodeBlock filename="src/main.srp · alpha.8" code={alpha8ProjectWorkflow.mainSource} />
      <CodeBlock filename="Expected application stdout" code={alpha8ProjectWorkflow.expectedMainStdout} />
      <h2 id="tests">Run ordinary .srp programs as tests</h2>
      <p>
        Create standalone source files directly inside <code>tests/</code>.
        Discovery is nonrecursive, sorted by UTF-8 filename and limited to
        64 immediate <code>.srp</code> files. A missing or empty suite
        succeeds unless you specify <code>--require-tests</code>.
      </p>
      <CodeBlock filename="tests/addition.srp · alpha.8" code={alpha8ProjectWorkflow.additionSource} />
      <CodeBlock filename="Terminal · alpha.8" code={"scarp test calculator\nscarp test --list calculator\nscarp test --json calculator\nscarp test --require-tests --filter addition calculator"} />
      <p>
        <code>assert(condition, "message")</code> requires a boolean and
        reports source-located E0065 when false. Its optional message
        must be a string literal no longer than 256 UTF-8 bytes. Since
        <code>assert</code> is now reserved, rename older identifiers
        using that spelling. These assertions execute in the interpreter
        and are not supported by experimental native backends.
      </p>
      <p>
        <code>--list</code> discovers tests without executing their source;
        <code>--json</code> emits a schema-v1 suite report without program
        stdout; <code>--filter</code> selects a literal, case-sensitive
        filename substring, not a regular expression.
      </p>

      <h2 id="stdin">Per-test input without shared shell stdin</h2>
      <CodeBlock filename="tests/greeting.srp · alpha.8" code={alpha8ProjectWorkflow.greetingSource} />
      <CodeBlock filename="tests/greeting.stdin · UTF-8" code={alpha8ProjectWorkflow.greetingInput} />
      <p>
        A sibling file such as <code>tests/greeting.stdin</code> supplies
        UTF-8 input exclusively to <code>tests/greeting.srp</code> when it
        calls <code>read_line()</code>. Fixtures are limited to 1 MiB each
        and the interpreter's ordinary per-line and total-input limits
        still apply. Test listing does not read these fixtures.
        The test files shown above are executed against the exact alpha.8
        compiler source by <a href={project.websiteRepo + "/blob/main/scripts/test-project-workflow.ts"}>website CI</a>,
        including empty-suite, structured-report and assertion-failure cases.
      </p>

      <h2 id="limits">Compatibility and limits</h2>
      <p>
        The optional empty <code>dependencies {"{}"}</code> block is
        reserved syntax. Alpha.8 does not install dependencies or provide
        a package registry, general <code>scarp compile</code> command,
        integrated LSP, stable ABI or GPU runtime. This is a prerelease,
        not production-ready tooling. The website's existing compatibility
        tests cover selected examples rather than all compiler behavior.
      </p>
      <p>
        The source-pinned compiler docs may retain their earlier
        development-branch status banners; use the published
        <a href={project.repo + "/releases/tag/" + release.tag}> official release notes</a>
        as the release-status authority. Also see the
        {" "}<a href={sourceFile("docs/project-v2.md")}>declarative manifest reference</a>,
        {" "}<a href={sourceFile("docs/project-testing.md")}>test runner guide</a>,
        {" "}<a href={sourceFile("docs/assertions.md")}>assertion reference</a>,
        {" "}<a href="/downloads/">download checksums</a>, and
        {" "}<a href="/compatibility/">website fixture evidence</a>.
      </p>
    </Article>
  );
}
