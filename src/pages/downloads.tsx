import Base from "../layouts/Base.tsx";
import CodeBlock from "../components/CodeBlock.tsx";
import { project, verification } from "../data/project.ts";
import { publishedCompiler, publishedDownloads, publishedDownloadUrl } from "../data/releases.ts";

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
          Experimental alpha · Reviewed <time dateTime={publishedCompiler.reviewed}>3 November 2026</time> · Not a stable release.
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
            <details>
              <summary>Archive checksum</summary>
              <code className="checksum">{item.hash}</code>
            </details>
          </article>
        ))}
      </section>

      <section className="wrap section prose">
        <h2>Verify, extract, run</h2>
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
          are explicit.
        </p>
        <p>
          For platform-specific setup and checksum commands, follow the{" "}
          <a href={project.docs + "guide/installation"}>installation guide</a>.
          Get the <a href={publishedDownloadUrl("SHA256SUMS")}>combined SHA-256 checksums</a>{" "}
          or review the <a href={publishedCompiler.release}>official release record</a>.
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
          Native Scarp executable generation, one-click installers and package
          registry installation are not advertised as available.
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
