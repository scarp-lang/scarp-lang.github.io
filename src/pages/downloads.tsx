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
          project modules without executing source statements.
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
          Alpha.5 includes an <strong>experimental scalar C11 emitter</strong> in
          the Rust embedding API only. It does not offer a{" "}
          <code>scarp compile</code> command or manage a C compiler. General native
          Scarp executable generation, one-click installers and package registry
          installation are not available.
          See <a href="/news/alpha5-project-inspection/">the release overview</a>.
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
