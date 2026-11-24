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
          <h3>Checked native integer functions, decimal literals and tuple operations.</h3>
          <p>Scarp {publishedCompiler.tag} expands the experimental Rust ELF64
            emitter to pure functions with one to six integer parameters on
            Linux x86-64 System V. Checked arithmetic, integer and Boolean
            locals, short-circuit logic and early integer returns are supported
            within this restricted native subset.</p>
          <p>Interpreter additions include exact decimal literals such as
            <code> 0.1d</code>, persistent replacement of constant-index tuple
            members and lexicographic ordering for compatible numeric tuples.
            New projects use <code>scarp.project</code>; the legacy filename
            remains readable. Host string quotas now include nested composites.</p>
          <p><strong>The CLI still interprets Scarp source.</strong> Native loops,
            calls, contracts, defaults and heap-backed values remain outside
            this subset. There is no general native compile CLI or stable ABI.</p>
          <p>Read <a href="/news/alpha20-native-decimal-tuples/">the alpha.20 overview</a>,
            {" "}<a href="/news/alpha19-host-callables/">alpha.19 host API history</a>,
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
          version-by-version CLI changes, alpha.18 interpreter behavior and alpha.19–20 host APIs,
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
