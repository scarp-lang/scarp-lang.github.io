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
        <p className="eyebrow">Latest website-reviewed prerelease</p>
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
            <a className="button primary" href={`/downloads/${item.platform}/latest/`}>
              Get newest Scarp for {item.name} <span aria-hidden="true">↓</span>
            </a>
            <a className="inline-link" href={publishedDownloadUrl(item.file)}>
              Download reviewed {publishedCompiler.tag} {item.file.endsWith(".zip") ? "ZIP" : ".tar.gz"} ↗
            </a>
            <p className="small muted">
              The SHA-256 value below verifies only the reviewed {publishedCompiler.tag} archive,
              not a newer download from the permanent link.
            </p>
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

      <section className="wrap section prose" aria-labelledby="permanent-download-links">
        <h2 id="permanent-download-links">Permanent latest-version links</h2>
        <p>
          Bookmark one URL for your platform. These links check GitHub for the most
          recently published Scarp release, including prereleases, and open the
          matching archive when it exists. No link needs changing for a new tag.
        </p>
        <ul>
          {publishedDownloads.map(item => (
            <li key={item.platform}>
              <a href={`/downloads/${item.platform}/latest/`}>Latest Scarp for {item.name} ({item.architecture})</a>
            </li>
          ))}
        </ul>
        <p className="small muted">
          Latest-version links use the live release catalogue. The checksums
          shown on this page apply <strong>only to {publishedCompiler.tag}</strong>.
          For a newer download, verify against the SHA-256 published with that
          specific release. The links require JavaScript to discover a new version.
        </p>
      </section>

      <section className="wrap section prose" id="verify-download">
        <h2>Verify your download before extracting</h2>
        <p>
          Save the archive in a folder you control, then open a terminal there.
          The command for your operating system checks it against the
          <strong> SHA-256 digest pinned on this page</strong>.
          The separately downloadable <code>.sha256</code> sidecar is optional
          for this verification. Do not extract or run an archive if verification fails.
        </p>
        <div className="download-verify-panels">
          {publishedDownloads.map((item) => (
            <details key={item.file} id={`verify-${item.platform}`}>
              <summary>{item.name}: verify {item.file.endsWith(".zip") ? "ZIP" : ".tar.gz"}</summary>
              <p>
                File: <code>{item.file}</code>. Use the archive link above
                for this exact {publishedCompiler.tag} prerelease. The command
                verifies its bytes against the reviewed digest shown here.
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
          All three commands use the pinned SHA-256 digests reviewed for
          {publishedCompiler.tag}. If you also download the official
          <code> .sha256</code> sidecar, confirm that its digest agrees with
          this page. A sidecar matching a modified archive is not sufficient
          evidence that it matches the independently reviewed value.
          SHA-256 verifies file integrity, not whether the prerelease is production-ready.
        </p>
        <h2>Extract and run the verified interpreter</h2>
        <ol>
          <li>Download the archive and optionally its <code>.sha256</code> sidecar. Verify the archive against the pinned digest using the appropriate command above before extraction.</li>
          <li>Extract the archive into a directory you control, including any bundled example files.</li>
          <li>Run the extracted interpreter's <code>version</code> command to confirm the release before creating a project.</li>
        </ol>
        <h2>Running existing projects (alpha.18 and later)</h2>
        <p>From a folder containing a valid <code>scarp.project</code> or
          <code>Scarp.project</code>, run <code>scarp exec</code>. Without a
          manifest it checks <code>src/main.srp</code> then <code>main.srp</code>.
          A malformed manifest is an error; arbitrary source files are never
          selected. Existing input quotas still apply.</p>
        <h2>Declarative projects (introduced in alpha.8)</h2>
        <p>
          These commands create a new offline project with a
          <code>scarp.project</code> manifest, verify it statically and run it.
          The list command discovers tests without execution; a newly initialized
          project may legitimately have zero tests.
        </p>
        <CodeBlock filename="Terminal · alpha.8+" code={"scarp init calculator\nscarp verify calculator\nscarp run calculator\nscarp project info calculator\nscarp test --list calculator"} />
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
        <h2>New in {publishedCompiler.tag}: native loops and numerical operations</h2>
        <p>The experimental x86-64 ELF64 Rust API supports pure integer functions with up to 16 required integer arguments, counted repeats and nested loop control. This is not a native compilation command or stable ABI. The interpreter adds frame reuse, <code>array_concat</code>, variadic integer GCD/HCF/LCM and stable vector <code>softplus</code>. New projects use <code>scarp.project</code>; legacy manifests remain readable. Read <a href="/news/v007-alpha1-native-loops/">the new release guide</a> and <a href={publishedCompiler.release}>official release notes</a>.</p>
        <p>For the earlier Rust callable handles and execution receipts, see
          <a href="/news/alpha19-host-callables/"> the alpha.19 guide</a>.</p>
        <h2>Introduced in alpha.18: execution and immutable arrays</h2>
        <p><code>scarp exec</code> runs the current project's validated
          manifest entrypoint, otherwise <code>src/main.srp</code> or
          <code> main.srp</code>, with no source argument. An invalid manifest
          fails rather than silently running an arbitrary file. Explicit
          source paths continue to work. The <code>exec</code> command enables
          bounded interactive prompts automatically; legacy <code>run</code>
          remains opt-in for terminal prompts.</p>
        <CodeBlock filename="Terminal · alpha.18+" code={"scarp exec\nscarp exec src/main.srp\nscarp exec examples/array_updates.srp"} />
        <p>Pure <code>array_set</code> creates a new immutable fixed array and
          leaves existing snapshots unchanged. Bad indices report E0063 and
          allocation quotas remain enforced. <strong>Lifetime</strong> begins
          detaching empty numerical views from their original buffers; it is
          not yet a cycle collector or a complete native memory manager.</p>
        <p><a href="/news/alpha17-arrays-input/">Alpha.17</a> introduced
          <code>array_len</code>, <code>array_get_or</code> and
          <code>input_boolean</code>. Read
          {" "}<a href="/news/alpha18-exec-lifetime/">the alpha.18 guide</a>,
          {" "}<a href="/news/alpha16-order-statistics/">alpha.16 history</a>
          and <a href={project.repo + "/releases/tag/v0.0.6-alpha.18"}>alpha.18 release notes</a>.</p>
        <h2>Introduced in alpha.12</h2>
        <p>
          Alpha.12 added typed records, tagged variants, nested destructuring,
          exhaustively checked matches, concrete <code>option&lt;T&gt;</code>
          and <code>result&lt;T, E&gt;</code> values, plus immutable
          lists and deterministic maps. These aggregate operations remain
          interpreter-backed.
        </p>
        <CodeBlock
          filename="Terminal · alpha.12+ task-board (from the tagged source tree)"
          code={"scarp verify examples/projects/task-board\nscarp launch examples/projects/task-board\nscarp test examples/projects/task-board"}
        />
        <p>
          Read the <a href="/news/alpha12-records-collections/">alpha.12 feature overview</a>
          {" "}and the <a href={project.repo + "/tree/" + publishedCompiler.sourceCommit + "/examples/projects/task-board"}>release-tagged task-board source</a>.
        </p>
        <h2>Introduced in alpha.11</h2>
        <p>
          Alpha.11 introduced interpreter-only exact base-10
          <code> decimal</code> values, explicit decimal/integer conversions,
          controlled rounding and <code>input_decimal(prompt)</code> with
          opt-in interactive mode. Inexact division requires explicit rounding.
          See the <a href="/news/alpha11-exact-decimal/">alpha.11 decimal guide</a>.
        </p>
        <h2>Introduced in alpha.10</h2>
        <p>
          Alpha.10 added opt-in interactive prompts with <code>input(prompt)</code>,
          <code>ask(prompt)</code>, <code>ask_or(prompt, fallback)</code>, typed
          numeric input and <code>try_read_line()</code>. Supply
          <code> --interactive</code> for terminal prompts on legacy
          <code> run</code> or pre-alpha.18 releases; alpha.18 <code>exec</code>
          prompts automatically. Use <code> --input-file</code> for
          reproducible UTF-8 input.
        </p>
        <CodeBlock filename="Terminal · alpha.10+" code={"scarp exec --interactive app.srp\nscarp exec --input-file DATA.txt app.srp"} />
        <p>
          Immutable <code>array&lt;T, N&gt;</code> values support checked indexing.
          BigInt added powers, GCD/LCM, integer square roots, radix conversion,
          shifts and bitwise operators. Tests also gained exact stdout/stderr
          fixture comparisons. See the
          {" "}<a href="/news/alpha10-interactive-arrays/">alpha.10 feature guide</a>.
        </p>
        <h2>Introduced in alpha.9</h2>
        <p>
          Alpha.9 introduced bounded exact signed <code>bigint</code> values
          and <code>scarp test --json=v2</code> with structured diagnostics.
          The older <code>--json</code> remains schema v1.
          Read the <a href="/news/alpha9-bigint-reports/">alpha.9 feature guide</a>.
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
          also available. Interactive prompts now require alpha.10's explicit --interactive mode.
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
