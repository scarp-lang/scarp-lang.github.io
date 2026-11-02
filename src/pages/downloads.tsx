import Base from "../layouts/Base.tsx";
import CodeBlock from "../components/CodeBlock.tsx";
import { project, downloads, downloadUrl, verification } from "../data/project";

export default function DownloadsPage() {
  return (
    <Base
      title="Downloads"
      description="Download Scarp v0.0.5-alpha.1 for Windows x64, Linux x64, or macOS ARM64, with SHA-256 checksums and first-run instructions."
    >
      <section className="wrap page-heading">
        <p className="eyebrow">Try the published alpha</p>
        <h1>
          Your next experiment
          <br />
          starts here.
        </h1>
        <p className="lead">
          Scarp v{project.version}. Choose the archive matching your operating
          system and CPU.
        </p>
        <p className="notice">
          Experimental prerelease · Syntax and APIs may change.
        </p>
      </section>
      <section className="wrap download-grid">
        {downloads.map((item) => (
          <article key={item.file} className="download-card">
            <span className="eyebrow">{item.architecture}</span>
            <h2>{item.name}</h2>
            <a className="button primary" href={downloadUrl(item.file)}>
              Download {item.file.endsWith(".zip") ? "ZIP" : ".tar.gz"}{" "}
              <span aria-hidden="true">↓</span>
            </a>
            <a
              className="inline-link"
              href={downloadUrl(item.file + ".sha256")}
            >
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
          <li>
            Download the archive and its checksum file. Compare the archive’s
            SHA-256 digest with the published value before extracting.
          </li>
          <li>Extract the whole package, including its examples directory.</li>
          <li>
            Run the executable directly from that directory and confirm its
            version.
          </li>
        </ol>
        <h3>Linux / macOS</h3>
        <CodeBlock
          filename="terminal"
          code={"./scarp --version\n./scarp run examples/hello.srp"}
        />
        <h3>Windows PowerShell</h3>
        <CodeBlock
          filename="PowerShell"
          code={"./scarp.exe --version\n./scarp.exe run examples/hello.srp"}
        />
        <p>
          For checksum commands and source builds, follow the{" "}
          <a href={project.docs + "guide/installation"}>installation guide</a>.
          The release publishes{" "}
          <a href={downloadUrl("SHA256SUMS")}>combined checksums</a> and a{" "}
          <a href={verification}>package verification record</a>.
        </p>
        <h2>Prefer the source?</h2>
        <p>
          Build the interpreter with a stable Rust toolchain and Cargo. The
          current language implementation has no third-party Rust crate
          dependencies. See the{" "}
          <a href={project.docs + "guide/installation"}>
            source installation instructions
          </a>
          .
        </p>
        <p>
          These packages contain an interpreter for Scarp programs. Native
          compilation, one-click installers, and package-manager installation
          channels are not advertised as available.
        </p>
      </section>
      <section className="wrap prose">
        <h2>Need help getting started?</h2>
        <p>
          The <a href="/support/#help">support hub</a> covers installation,
          version mismatches, silent checks, and common runtime problems. If a
          problem persists,{" "}
          <a href="/support/#report">find the correct issue tracker</a>.
        </p>
      </section>
    </Base>
  );
}
