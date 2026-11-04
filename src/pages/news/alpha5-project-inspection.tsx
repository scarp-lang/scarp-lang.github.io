import Article from "../../layouts/Article.tsx";
import CodeBlock from "../../components/CodeBlock.tsx";
import { project } from "../../data/project.ts";
import { publishedCompiler } from "../../data/releases.ts";

export default function Alpha5ProjectInspectionPage() {
  return (
    <Article
      title="Scarp alpha.5: inspect projects, explore experimental C11 output"
      description="The published prerelease adds read-only project module inspection and a restricted C11 emitter in the Rust embedding API, not a native compiler command."
      eyebrow="Language release"
      date="2026-11-04"
    >
      <p>
        Scarp <strong>{publishedCompiler.tag}</strong> was published on
        4 November 2026. It builds on alpha.4's offline project workflow:
        developers can inspect a project's module metadata from the CLI
        without executing the program. A separate experimental Rust library
        API can emit freestanding C11 code for a small scalar subset.
      </p>

      <h2 id="inspect-project">Inspect an explicit project</h2>
      <p>
        Use the published Scarp executable to create a new project, inspect
        its modules, verify the source and launch its declared entrypoint:
      </p>
      <CodeBlock filename="terminal" code={"scarp version\nscarp create hello-scarp\nscarp inspect modules --json hello-scarp\nscarp verify hello-scarp\nscarp launch hello-scarp"} />
      <p>
        <code>inspect modules --json DIRECTORY</code> resolves a bounded{" "}
        <code>Scarp.project</code> manifest and emits schema-v1 module
        metadata. The legacy <code>modules --json DIRECTORY</code> form is
        also supported. Both forms reject invalid manifests and source-root
        escapes; inspection does not execute normal runtime statements.
        Earlier alpha.4 builds do not support project-directory module
        inspection, although they do support creating, verifying and launching
        explicit projects.
      </p>

      <h2 id="c11-embedding">What the C11 emitter actually does</h2>
      <p>
        Rust embedding hosts can use the experimental{" "}
        <code>scarp::c_backend::emit_c</code> and{" "}
        <code>emit_program</code> APIs to create a C11 translation unit
        for a deliberately constrained scalar subset. Supported forms
        include certain counted repeat loops, checked integer operations,
        boolean short-circuiting and nested control flow.
      </p>
      <p>
        <strong>No native compilation is exposed through the Scarp CLI.</strong>{" "}
        There is no <code>scarp compile</code> command, and this API does not
        invoke a C compiler or create executable files. A Rust host must
        arrange the downstream C11 toolchain itself. The emitter rejects
        unsupported forms explicitly, including functions and recursion,
        floating-point operations, vector/tile calculations and computed text.
        These are backend limitations, not removals from the interpreter.
      </p>

      <h2 id="get-release">Get the verified prerelease</h2>
      <p>
        Download the <a href="/downloads/">Windows, Linux or macOS archives and
        SHA-256 checksums</a> for {publishedCompiler.tag}, see the{" "}
        <a href="/migration/">version-by-version migration guide</a>, or
        inspect the <a href="/compatibility/">website's limited CI fixture coverage</a>.
        This is an experimental alpha, not a stable ABI, general native compiler
        or package manager.
      </p>
      <p>
        For reproducible evidence, consult{" "}
        <a href={publishedCompiler.release}>the published release record</a>,{" "}
        <a href={project.repo + "/commit/" + publishedCompiler.sourceCommit}>
          the exact annotated-tag source commit
        </a>, and{" "}
        <a href={project.repo + "/blob/" + publishedCompiler.sourceCommit + "/docs/proposals/0035-native-scalar-c11.md"}>
          the pinned backend proposal
        </a>.
      </p>
    </Article>
  );
}
