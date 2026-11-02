import Base from "../layouts/Base.tsx";
import { project, sourceUrl, verification } from "../data/project";

export default function ReleasesPage() {
  return (
    <Base
      title="Releases"
      description="Read the published Scarp alpha milestone, source baseline, downloads, verification record, and upstream changelog."
    >
      <section className="wrap page-heading">
        <p className="eyebrow">Releases & changelog</p>
        <h1>
          Every milestone.
          <br />A little further.
        </h1>
        <p className="lead">
          Published snapshots of a language in development.
        </p>
      </section>
      <section className="wrap release-entry">
        <div>
          <span className="status-badge">Experimental prerelease</span>
          <p className="mono">1 November 2026</p>
          <h2>v{project.version}</h2>
        </div>
        <div className="prose">
          <h3>Source modules</h3>
          <p>
            Relative <code>.srp</code> imports, explicit aliases, public
            functions and scalar literal constants, bounded source graphs, and
            cycle diagnostics.
          </p>
          <p>
            Builds on the existing numerical runtime, immutable tiles, function
            contracts, and independent execution budgets.
          </p>
          <ul>
            <li>Windows x64 MSVC</li>
            <li>Linux x64 GNU</li>
            <li>macOS ARM64</li>
          </ul>
          <div className="actions">
            <a className="button primary" href="/downloads/">
              Get this release →
            </a>
            <a className="inline-link" href={project.release}>
              Full release notes ↗
            </a>
          </div>
          <p>
            <a href={verification}>Publication and package verification ↗</a>
          </p>
        </div>
      </section>
      <section className="wrap section prose">
        <h2>Release history</h2>
        <p>
          The compiler repository maintains the complete{" "}
          <a href={`${project.repo}/releases`}>release archive</a> and{" "}
          <a href={sourceUrl("CHANGELOG.md")}>
            changelog through this baseline
          </a>
          . Older examples and binary packages can use different syntax or lack
          newer features.
        </p>
        <h2>Version-aware learning</h2>
        <p>
          Use the website’s v{project.version} examples with that interpreter
          version. This page is a reviewed snapshot, not an automatic feed of
          unpublished work. No stable release is represented by this baseline.
        </p>
      </section>
    </Base>
  );
}
