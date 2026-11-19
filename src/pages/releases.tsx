import Base from "../layouts/Base.tsx";
import { project, sourceUrl, verification } from "../data/project.ts";
import { publishedCompiler } from "../data/releases.ts";
import { formatNewsDate } from "../lib/date.ts";

export default function ReleasesPage() {
  return (
    <Base
      title="Releases"
      description={`Compare the latest published Scarp ${publishedCompiler.tag} prerelease with the verified ${project.tag} website example baseline.`}
    >
      <section className="wrap page-heading">
        <p className="eyebrow">Releases & changelog</p>
        <h1>Progress worth checking.
          <br />Versions worth keeping.
        </h1>
        <p className="lead">
          Every Scarp prerelease is experimental. The newest public download and
          the version used to test this website's examples are listed separately.
        </p>
        <p className="small muted">
          Published release information reviewed <time dateTime={publishedCompiler.reviewed}>{formatNewsDate(publishedCompiler.reviewed)}</time>.
          The <a href={`${project.repo}/releases`}>GitHub release archive</a> is authoritative if another version ships.
        </p>
      </section>

      <section className="wrap release-entry" id="latest-release">
        <div>
          <span className="status-badge">Latest published prerelease</span>
          <p className="mono"><time dateTime={publishedCompiler.publishedAt}>{formatNewsDate(publishedCompiler.publishedAt.slice(0, 10))}</time></p>
          <h2>{publishedCompiler.tag}</h2>
        </div>
        <div className="prose">
          <h3>Bounded inspections, revision safety and checked ELF64 shifts.</h3>
          <p>
            Scarp {publishedCompiler.tag} rejects files larger than 1 MiB before
            tokenization in <code>inspect tokens</code>, <code>inspect ast</code>
            and the legacy <code>tokens</code> command. Equal-length string
            comparisons charge one step per started 64 UTF-8 bytes, at runtime
            and in constant evaluation. Programs near a work budget may now
            reach it earlier.
          </p>
          <p>
            The Rust semantic compiler cache checks loader-supplied revisions
            before reusing cached programs. Embedding integrations should
            handle <code>CachedCompileError::RevisionMismatch</code>.
            This does not add an integrated language server.
          </p>
          <p>
            The experimental checked x86-64 ELF64 integer kernel now supports
            left, arithmetic right and logical right shifts. Counts outside
            0–63 yield status 3 and the failing operator's UTF-8 byte span.
            This is a restricted Rust embedding API, not a general native
            compilation CLI; the release packages still run the interpreter.
          </p>
          <p>
            <a href="/news/alpha14-patterns-native/">Alpha.14</a> previously
            improved nested pattern diagnostics, cache resizing and checked
            arithmetic kernels. Scarp source syntax and CLI commands remain
            compatible in alpha.15, but embedding APIs are experimental.
          </p>
          <p>
            Read the <a href="/news/alpha15-runtime-kernels/">alpha.15 release overview</a>,
            {" "}<a href="/news/alpha14-patterns-native/">alpha.14 history</a>,
            or <a href={publishedCompiler.release}>authoritative release notes</a>.
          </p>
          <p>
            Pre-built archives are available for Windows x64, Linux x64 GNU
            and macOS Apple Silicon. This is an alpha—not a stable compiler.
          </p>
          <div className="actions">
            <a className="button primary" href="/downloads/">Download {publishedCompiler.tag} →</a>
            <a className="inline-link" href={publishedCompiler.release}>Read official release notes ↗</a>
          </div>
          <p className="small muted">
            Release source:{" "}
            <a className="mono" href={`${project.repo}/commit/${publishedCompiler.sourceCommit}`}>
              {publishedCompiler.sourceCommit.slice(0, 12)}
            </a>. See the complete release page for compatibility and migration guidance.
          </p>
        </div>
      </section>

      <section className="wrap release-entry" id="example-baseline">
        <div>
          <span className="status-badge">Website example baseline</span>
          <p className="mono"><time dateTime={project.reviewed}>{formatNewsDate(project.reviewed)}</time></p>
          <h2>{project.tag}</h2>
        </div>
        <div className="prose">
          <h3>Tested Scarp examples</h3>
          <p>
            The runnable snippets on this website are checked against the exact{" "}
            <a href={project.release}>{project.tag}</a> interpreter source,
            including source modules, typed functions and numerical foundations.
            This baseline is intentionally older than the current published release.
          </p>
          <p>
            Use the matching version for reproducing the featured examples. Newer
            compiler packages use updated CLI commands and may change behavior;
            three homepage fixtures have also passed their exact-output checks
            under {publishedCompiler.tag}; that does not certify every Scarp
            program or page example. <a href="/compatibility/">See the compatibility evidence</a>.
          </p>
          <div className="actions">
            <a className="button secondary" href={project.release}>Older baseline release ↗</a>
            <a className="inline-link" href={verification}>Baseline verification record ↗</a>
          </div>
        </div>
      </section>

      <section className="wrap section prose">
        <h2>Release history and compatibility</h2>
        <p>
          GitHub maintains the authoritative <a href={`${project.repo}/releases`}>release archive</a>.
          The pinned <a href={sourceUrl("CHANGELOG.md")}>baseline changelog</a>{" "}
          provides historical context. Syntax and commands can differ between
          prereleases, so match examples to the compiler version shown with them.
        </p>
        <p>
          To update scripts and existing programs, read the{" "}
          <a href="/migration/">published CLI migration guide</a> for the
          version-by-version CLI changes and alpha.15 embedding compatibility,
          including project workflows and the new read-only symbol index.
        </p>
        <p>
          See <a href="/ecosystem/">the ecosystem directory</a> to find Scarp Docs,
          the browser Playground, Scarp by Example and editor tooling. Each project
          publishes its own compatibility information.
        </p>
      </section>
    </Base>
  );
}
