import Base from "../layouts/Base.tsx";
import CodeBlock from "../components/CodeBlock.tsx";
import { project, verification } from "../data/project.ts";
import { publishedCompiler, publishedDownloads, publishedDownloadUrl } from "../data/releases.ts";
import { checksumCommand } from "../data/download-guidance.ts";
import { formatNewsDate } from "../lib/date.ts";

export default function DownloadsPage() {
  return (
    <Base
      title="Downloads"
      description={`Download published Scarp ${publishedCompiler.tag} for Windows, Linux, or macOS with official SHA-256 checksums and version-aware first-run commands.`}
    >
      <section className="wrap page-heading">
        <p className="eyebrow">Latest published prerelease</p>
        <h1>Your next experiment
          <br />starts here.
        </h1>
        <p className="lead">
          Scarp {publishedCompiler.tag} is available for three platforms.
          Choose the archive matching your operating system and CPU.
        </p>
        <p className="notice">
          Experimental alpha · Reviewed <time dateTime={publishedCompiler.reviewed}>{formatNewsDate(publishedCompiler.reviewed)}</time> · Not a stable release.
        </p>
      </section>

      <section className="wrap download-grid" aria-label="Published Scarp downloads">
        {publishedDownloads.map((item) => (
          <article key={item.file} className="download-card">
            <span className="eyebrow">{item.architecture}</span>
            <h2>{item.name}</h2>
            <a className="button primary" href={publishedDownloadUrl(item.file)}>
              Download {item.file.endsWith(".zip") ? "ZIP" : ".tar.gz"}{" "}
              <span aria-hidden="true">↓</span>
            </a>
            <a className="inline-link" href={publishedDownloadUrl(item.file + ".sha256")}>
              SHA-256 file ↗
            </a>
            <a className="inline-link" href={`#verify-${item.platform}`}>
              How to verify this archive ↓
            </a>
            <details>
              <summary>Archive checksum</summary>
              <code className="checksum">{item.hash}</code>
              <button
                type="button"
                className="checksum-copy"
                data-copy
                data-copy-text={item.hash}
                aria-label={`Copy ${item.name} SHA-256 checksum`}
                hidden
              >
                Copy checksum
              </button>
            </details>
          </article>
        ))}
      </section>

      <section className="wrap section prose" id="verify-download">
        <h2>Verify your download before extracting</h2>
        <p>
          Save the archive and its matching <code>.sha256</code> file into the
          same folder. Open a terminal in that folder, then use the command for
          your operating system. Do not extract or run an archive if verification fails.
        </p>
        <div className="download-verify-panels">
          {publishedDownloads.map((item) => (
            <details key={item.file} id={`verify-${item.platform}`}>
              <summary>{item.name}: verify {item.file.endsWith(".zip") ? "ZIP" : ".tar.gz"}</summary>
              <p>
                File: <code>{item.file}</code>. Use the download links above
                for this exact {publishedCompiler.tag} archive and checksum file.
              </p>
              <CodeBlock
                filename={item.platform === "windows" ? "PowerShell" : "Terminal"}
                code={checksumCommand(item)}
              />
              <p>
                {item.platform === "windows"
                  ? "PowerShell prints Checksum OK on a match and raises an error on a mismatch."
                  : "A valid download prints the archive filename followed by OK. A mismatch or missing checksum file produces an error."}
              </p>
            </details>
          ))}
        </div>
        <p className="small muted">
          The checks use the published SHA-256 values reviewed for {publishedCompiler.tag}.
          On Windows, the command compares the archive directly against the pinned hash
          displayed above. Linux and macOS validate against the release sidecar;
          confirm that it agrees with the hash displayed on this page.
          SHA-256 verifies file integrity, not whether the prerelease is production-ready.
        </p>
        <h2>Extract and run the verified interpreter</h2>
        <ol>
          <li>Download the archive and its matching <code>.sha256</code> file. Compare the archive digest against the published checksum before extraction.</li>
          <li>Extract the archive into a directory you control, including any bundled example files.</li>
          <li>Run the extracted interpreter's <code>version</code> command to confirm the release before creating a project.</li>
        </ol>
        <h2>New alpha.8 declarative project workflow</h2>
        <p>
          These commands create a new offline project with a
          <code>scarp.project</code> manifest, verify it statically and run it.
          The list command discovers tests without execution; a newly initialized
          project may legitimately have zero tests.
        </p>
        <CodeBlock filename="Terminal · alpha.8" code={"scarp init calculator\nscarp verify calculator\nscarp run calculator\nscarp project info calculator\nscarp test --list calculator"} />
        <p>
          Add standalone <code>tests/*.srp</code> files, then use
          <code>scarp test --require-tests calculator</code> in CI.
          Optional <code>.stdin</code> fixtures supply bounded per-test input.
          Read the <a href="/news/alpha8-project-tests/">alpha.8 project guide</a>
          and the <a href={project.repo + "/blob/" + publishedCompiler.sourceCommit + "/docs/project-testing.md"}>release-pinned test runner documentation</a>.
        </p>
        <h3>Legacy project commands (still supported)</h3>
                <h3>Linux / macOS</h3>
        <CodeBlock
          filename="terminal"
          code={"./scarp version\n./scarp create hello-world\n./scarp verify hello-world\n./scarp launch hello-world"}
        />
        <h3>Windows PowerShell</h3>
        <CodeBlock
          filename="PowerShell"
          code={"./scarp.exe version\n./scarp.exe create hello-world\n./scarp.exe verify hello-world\n./scarp.exe launch hello-world"}
        />
        <p>
          These commands belong to <a href={publishedCompiler.release}>{publishedCompiler.tag}</a>.
          <code>create</code> needs a new destination directory;
          <code>verify</code> checks it without normal runtime execution, and
          <code>launch</code> executes its manifest entrypoint. All project paths
          are explicit. This release also supports{" "}
          <code>inspect modules --json PROJECT_DIRECTORY</code>, which inspects
          project modules without execution. Alpha.6 additionally offers{" "}
          <code>inspect symbols --json PROJECT_DIRECTORY</code> and{" "}
          <code>inspect references --json PROJECT_DIRECTORY</code> for
          read-only cross-file source indexing.
        </p>
        <p>
          For the exact {publishedCompiler.tag} project commands and manifest details,
          see the{" "}
          <a href={`${project.repo}/blob/${publishedCompiler.sourceCommit}/docs/project-workflow.md`}>
            release-pinned project workflow guide
          </a>.
          Get the <a href={publishedDownloadUrl("SHA256SUMS")}>combined SHA-256 checksums</a>{" "}
          or review the <a href={publishedCompiler.release}>official release record</a>.
          The <a href={project.docs + "guide/installation"}>older installation guide</a>
          has separate instructions pinned to {project.tag}; do not use its old
          CLI commands with the new package.
        </p>
        <h2>New in {publishedCompiler.tag}</h2>
        <p>
          Alpha.8 adds declarative <code>scarp.project</code> projects,
          <code>scarp init</code> and <code>scarp run</code>, read-only
          <code>scarp project info</code>, and executable <code>scarp test</code>
          suites with JSON, filters, per-test input and assertions.
          False assertions report source-located E0065 diagnostics;
          assertions remain interpreter-only. See the
          {" "}<a href={publishedCompiler.release}>alpha.8 release details</a>.
        </p>
        <h2>Introduced in preceding alpha.6.7</h2>
        <p>
          Use <code>if</code>/<code>elif</code>/<code>else</code> as
          a value-returning expression with boolean conditions, exactly
          matching branch types and a required final <code>else</code>.
          Only the selected branch executes.
          String literals also support checked Unicode scalar
          <code>{"\\u{HEX}"}</code> escapes with one to six ASCII hex digits.
        </p>
        <p>
          Conditional expressions work in the interpreter, not module constants
          or the experimental C11/ELF64 backends. See the
          {" "}<a href="/news/alpha6-conditional-unicode/">alpha.6.7 release details</a>
          and <a href={publishedCompiler.release}>upstream compatibility notes</a>.
        </p>
        <h2>Introduced in the preceding alpha.6.6</h2>
        <p>
          <code>read_line()</code> adds bounded UTF-8 input from redirected
          standard input when a program executes. Checked explicit
          conversions (<code>text_to_integer</code>,
          <code>text_to_float</code>, <code>integer_to_text</code>,
          <code>float_to_text</code>), Unicode text operations
          (<code>text_trim</code>, <code>text_replace</code>) and immutable
          heterogeneous <code>tuple&lt;integer, string&gt;</code> values are
          also available. There is no interactive prompt API.
        </p>
        <p>
          Input defaults: 65,536 raw bytes per line, 1,048,576 total bytes
          and 4,096 reads, adjustable via the three
          <code>--max-input-*</code> options. Tuple arity is 1–32,
          nesting at most 32 and the default cumulative tuple payload
          limit is 8 MiB. Native backends reject input and tuple
          operations. Read the{" "}
          <a href="/news/alpha6-input-tuples/">alpha.6.6 overview</a>{" "}
          and <a href={publishedCompiler.release}>official compatibility notes</a>.
        </p>
        <h2>Using examples from this website?</h2>
        <p>
          The homepage and verified examples still target the older{" "}
          <a href={project.release}>{project.tag}</a> compiler, which uses
          historical <code>run</code> commands. Download that specific version
          for exact reproductions. The{" "}
          <a href={verification}>baseline verification record</a> describes its
          tested archives. The three homepage source fixtures also pass against{" "}
          <a href={publishedCompiler.release}>{publishedCompiler.tag}</a> with the
          newer <code>exec</code> and <code>verify</code> commands. Read the{" "}
          <a href="/compatibility/">exact compatibility evidence</a> before
          assuming other code works unchanged.
        </p>
        <h2>Prefer building from source?</h2>
        <p>
          Use the Rust toolchain and Cargo with the{" "}
          <a href={`${project.repo}/tree/${publishedCompiler.sourceCommit}`}>exact release source</a>.
          This builds the Scarp interpreter itself, not a native executable
          compiled from a <code>.srp</code> program.
        </p>
        <p>
          The earlier alpha.6.3 release introduced <strong>deterministic Top-K ranking</strong>
          using <code>topk</code> and <code>topk_values</code>, and
          temperature-aware numerical functions <code>softmax_temp</code> and
          <code>logsoftmax_temp</code>. These are interpreter built-ins,
          not new CLI commands or a full model-training framework.
          See the <a href="/news/alpha6-ranking-temperature/">alpha.6.3 numerical overview</a>.
          Earlier <strong>optional Rust embedding caches</strong>,
          dependency-aware edit planning and source-scoped eviction remain
          available from a matching Cargo source checkout,
          not as CLI flags or bundled binary libraries.
          See the <a href="/news/alpha6-cache-apis/">cache feature overview</a>.
          Alpha.6 still supports symbol/reference navigation and vector{" "}
          <code>rms</code>; see the <a href="/news/alpha6-symbol-navigation/">earlier alpha.6 announcement</a>.
          The restricted C11 emitter introduced in alpha.5 remains an
          <strong> experimental Rust embedding API only</strong>. There is no{" "}
          <code>scarp compile</code> command, general native executable
          generation, one-click installer or package registry.
          Read the <a href="/learn/">version-specific quickstart</a>.
        </p>
      </section>
      <section className="wrap prose">
        <h2>Need help getting started?</h2>
        <p>
          See the <a href="/support/#help">support hub</a> for installation or
          compatibility problems, and <a href="/support/#report">report issues</a>{" "}
          with your exact compiler version.
        </p>
      </section>
    </Base>
  );
}
