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
          <h3>Checked Rust host callable handles and cumulative execution quotas.</h3>
          <p>Scarp {publishedCompiler.tag} adds <code>TypeRegistry::accepts_callable</code>
            and checked Rust embedding handles for named functions, including
            positional/named argument mapping, default parameters and
            export-aware module selection. Pure implementations may satisfy
            impure callable requirements, but not the reverse.</p>
          <p><code>ExecutionUsage</code> receipts and
            <code> HostInvocationLedger</code> account for repeated host calls
            and enforce cumulative interpreter work, call, input, output and
            allocation limits. Completed execution remains accounted for
            even if a host-provided output writer panics during replay.</p>
          <p><strong>Source-level function values and closures remain unsupported.</strong>
            Named <code>funcra</code> syntax, <code>scarp exec</code> and
            interpreter behavior from alpha.18 remain available. This is an
            experimental Rust embedding API, not a general native backend.</p>
          <p>Read <a href="/news/alpha19-host-callables/">the alpha.19 overview</a>,
            {" "}<a href="/news/alpha18-exec-lifetime/">alpha.18 interpreter history</a>,
            or <a href={publishedCompiler.release}>official release notes</a>.</p>
          <p>
            Pre-built archives cover Windows x64, Linux x64 GNU and macOS
            Apple Silicon. This is an alpha, not a stable compiler.
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
          version-by-version CLI changes, alpha.18 interpreter behavior and alpha.19 host APIs,
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
