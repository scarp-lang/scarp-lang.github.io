import Base from "../layouts/Base.tsx";
import { project, sourceUrl, verification } from "../data/project";
import { publishedCompiler } from "../data/releases.ts";

export default function DevelopmentPage() {
  return (
    <Base
      title="Development"
      description="An evidence-backed snapshot of Scarp development: published alpha capabilities, limitations, source baseline, and next priorities."
    >
      <section className="wrap page-heading">
        <p className="eyebrow">Current development state</p>
        <h1>
          A clear view
          <br />
          of where we are.
        </h1>
        <p className="lead">
          An experimental language, developed in public. This page documents
          the website's verified examples as of 1 November 2026;{" "}
          <a href={publishedCompiler.release}>{publishedCompiler.tag}</a> is the
          newer published prerelease reviewed 5 November 2026.
        </p>
      </section>
      <section className="wrap status-summary">
        <div>
          <span className="eyebrow">Verified website example baseline</span>
          <h2>v{project.version}</h2>
          <p>Source modules · Experimental prerelease</p>
        </div>
        <div>
          <a className="button primary" href={project.release}>
            Release notes ↗
          </a>
          <a className="inline-link" href={verification}>
            Verification record ↗
          </a>
        </div>
      </section>
      <section className="wrap section prose">
        <h2>What you can use</h2>
        <p>
          The current public <a href={publishedCompiler.release}>{publishedCompiler.tag}</a>{" "}
          release adds opt-in source symbol/reference inspection and finite
          vector <code>rms</code>. Earlier offline project commands{" "}
          <code>create</code>, directory <code>verify</code> and{" "}
          <code>launch</code> remain available. See{" "}
          <a href="/releases/">release notes</a> and{" "}
          <a href="/downloads/">current packages</a>. The information below
          describes the separately tested older example baseline.
        </p>
        <p>
          The published interpreter includes scalar values, typed functions and
          contracts, control flow, numerical vectors and tiles, relative source
          modules, explicit output streams, and execution budgets. Windows x64,
          Linux x64 GNU, and macOS ARM64 packages are published for this
          baseline.
        </p>
        <h2>What “alpha” means</h2>
        <p>
          Syntax, library APIs, diagnostics, and runtime behavior can change.
          Try small programs, keep the version with your examples, and report
          reproducible problems. A prerelease is not a stable compatibility
          promise.
        </p>
        <h2>Known limitations</h2>
        <ul>
          <li>
            Programs are interpreted; there is no native-code generation
            command.
          </li>
          <li>
            Source imports are bounded and relative. Runtime module globals and
            re-exports need further milestones.
          </li>
          <li>
            General-purpose collections, user-defined types, a standard library,
            and a package manager are not available.
          </li>
          <li>
            There is no general tensor engine, automatic differentiation, or GPU
            backend.
          </li>
          <li>
            The interpreter reports the first error. Execution limits bound
            selected resources rather than total process RAM.
          </li>
          <li>
            <code>check</code> evaluates the selected program path without
            output. It is not a purely static type checker.
          </li>
        </ul>
        <h2>Next development priorities</h2>
        <p>
          Read-only symbol navigation and constant-expression work have
          progressed beyond the original alpha.1 baseline. Further editor
          integration, language conformance and user-defined types require
          separate implementation and tests.{" "}
          <a href="/roadmap/">Explore the longer path toward v1.0.0</a>.
        </p>
        <h2 id="evidence">Evidence and freshness</h2>
        <p>
          This website uses a reviewed snapshot. It makes no live claim about
          unmerged branches or unpublished work. The compiler repository and
          release record are authoritative when development moves ahead.
        </p>
        <dl className="evidence-list">
          <dt>Verified example version</dt>
          <dd>
            <a href={project.release}>{project.tag}</a>
          </dd>
          <dt>Newest reviewed public release</dt>
          <dd><a href={publishedCompiler.release}>{publishedCompiler.tag}</a></dd>
          <dt>Source commit</dt>
          <dd>
            <a
              className="mono"
              href={`${project.repo}/commit/${project.source}`}
            >
              {project.source}
            </a>
          </dd>
          <dt>Capability reference</dt>
          <dd>
            <a href={sourceUrl("README.md")}>Pinned compiler README ↗</a>
          </dd>
          <dt>Release verification</dt>
          <dd>
            <a href={verification}>Package and publication record ↗</a>
          </dd>
          <dt>Roadmap evidence</dt>
          <dd>
            <a
              href={
                sourceUrl("README.md") + "#prototype-limits-and-planned-roadmap"
              }
            >
              Pinned source roadmap ↗
            </a>
          </dd>
          <dt>Social links</dt>
          <dd>
            <a href="https://github.com/scarp-lang/scarp-docs/blob/e38696bf97ba5b078f3a0802f0be9567aeec9d42/docs/community/social.md">
              Reviewed official account directory ↗
            </a>
          </dd>
          <dt>Machine-readable snapshot</dt>
          <dd>
            <a href="/project.json">project.json ↗</a>
          </dd>
        </dl>
      </section>
    </Base>
  );
}
