import Base from "../layouts/Base.tsx";
import { ecosystemProjects, ecosystemReviewedOn } from "../data/ecosystem.ts";

export default function EcosystemPage() {
  return (
    <Base
      title="Ecosystem"
      description="Explore the Scarp compiler, official documentation, browser playground, practical examples, and VS Code extension, with honest prerelease status."
    >
      <section className="wrap page-heading ecosystem-heading">
        <p className="eyebrow">Official Scarp ecosystem</p>
        <h1>One language.
          <br />Tools to explore it.
        </h1>
        <p className="lead">
          Start with the compiler, learn from the docs, try code in your browser,
          or work in your editor. Each tool is developing at its own pace.
        </p>
        <p className="small muted ecosystem-reviewed">
          Reviewed <time dateTime={ecosystemReviewedOn}>3 November 2026</time>. This is a documented snapshot, not a live availability monitor.
        </p>
      </section>

      <section className="wrap ecosystem-section" aria-labelledby="ecosystem-projects-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Explore the tools</p>
            <h2 id="ecosystem-projects-title">Meet the projects.</h2>
          </div>
          <p>Published prerelease versions are not stable releases. Read each project's compatibility notes before relying on a feature.</p>
        </div>
        <div className="ecosystem-grid">
          {ecosystemProjects.map((item, index) => (
            <article className="ecosystem-card" key={item.id} id={item.id}>
              <div className="ecosystem-card-top">
                <span className="mono ecosystem-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="ecosystem-status">{item.status}</span>
              </div>
              <p className="eyebrow">{item.category}</p>
              <h3>{item.name}</h3>
              {item.version && <p className="ecosystem-version">Published: <strong>{item.version}</strong></p>}
              <p className="ecosystem-summary">{item.summary}</p>
              <p className="ecosystem-limit"><strong>Know before using:</strong> {item.limitation}</p>
              <div className="ecosystem-links">
                <a className="button primary" href={item.website}>Open project <span aria-hidden="true">↗</span></a>
                <a href={item.source}>Source code ↗</a>
                <a href={item.evidence}>Status evidence ↗</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="wrap ecosystem-path" aria-labelledby="ecosystem-path-title">
        <p className="eyebrow">Choose a starting point</p>
        <h2 id="ecosystem-path-title">A practical path through Scarp.</h2>
        <ol>
          <li><strong>Learn:</strong> Read the <a href="https://scarp-lang.github.io/scarp-docs/">official docs</a> or browse the <a href="https://scarp-lang.github.io/scarp-by-example/">example lessons</a>.</li>
          <li><strong>Experiment:</strong> Open the <a href="https://scarp-lang.github.io/scarp-playground/">browser playground</a> or <a href="/downloads/">download a compiler release</a> for local use.</li>
          <li><strong>Build your workflow:</strong> Explore the <a href="https://github.com/scarp-lang/scarp-vscode">VS Code extension</a> and check compatibility with your installed compiler.</li>
          <li><strong>Contribute:</strong> Read the <a href="/contribute/">contribution guide</a> or <a href="/support/">report a problem</a> with a reproducible example.</li>
        </ol>
        <p className="small muted">The homepage examples and downloads use a separately verified compiler v0.0.5-alpha.1 baseline. Newer project prereleases listed above do not automatically update that baseline.</p>
      </section>
    </Base>
  );
}
