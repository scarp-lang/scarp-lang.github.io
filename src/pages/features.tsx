import Base from "../layouts/Base.tsx";
import CodeExplorer from "../components/CodeExplorer.tsx";
import { capabilities, project, sourceUrl } from "../data/project";

export default function FeaturesPage() {
  return (
    <Base
      title="Features"
      description="Explore the language features available in Scarp v0.0.5-alpha.1, from bindings and typed functions to numerical values and source modules."
    >
      <section className="wrap page-heading">
        <p className="eyebrow">The language today</p>
        <h1>
          From small expressions
          <br />
          to bigger ideas.
        </h1>
        <p className="lead">
          Available in v{project.version}. A working foundation, with room to
          evolve.
        </p>
      </section>
      <section className="wrap section compact">
        <div className="feature-grid">
          {capabilities.map((item) => (
            <div key={item.number} className="feature">
              <span className="feature-number">{item.number}</span>
              <h2>{item.title}</h2>
              <p>{item.text}</p>
              <a className="text-link" href={sourceUrl(item.link)}>
                {item.label} ↗
              </a>
            </div>
          ))}
        </div>
      </section>
      <section className="wrap section learning-grid">
        <div>
          <p className="eyebrow">Read it. Run it. Explore it.</p>
          <h2>
            A few lines
            <br />
            of Scarp.
          </h2>
          <p className="section-description">
            Use <code>print</code> for output, <code>bind</code> for an
            immutable value, and <code>var</code> when a value needs to change.
            Typed functions use <code>funcra</code>.
          </p>
          <a className="inline-link" href={project.docs + "language/overview"}>
            Open the language guide ↗
          </a>
        </div>
        <CodeExplorer />
      </section>
      <section className="wrap section prose">
        <h2>More in the current interpreter</h2>
        <ul>
          <li>
            Lexical scopes, shadowing, short-circuit booleans, and{" "}
            <code>if</code>/<code>elif</code>/<code>else</code>.
          </li>
          <li>
            Bounded <code>while</code> and <code>repeat</code> loops, plus{" "}
            <code>break</code> and <code>continue</code>.
          </li>
          <li>
            Independent execution budgets and automatic retirement of
            inaccessible scope values.
          </li>
          <li>
            Source diagnostics with error codes, locations, excerpts, and repair
            guidance.
          </li>
          <li>
            <code>run</code>, <code>check</code>, and <code>tokens</code> CLI
            commands, plus explicit Rust embedding APIs.
          </li>
        </ul>
        <h2>New in the separately published alpha.6.3</h2>
        <p>
          The earlier alpha.6.3 prerelease introduced deterministic numerical
          ranking with <code>topk</code> and <code>topk_values</code>,
          temperature-controlled <code>softmax_temp</code> and{" "}
          <code>logsoftmax_temp</code>, and test-backed internal scalar
          compiler verification. The featured examples above still use the
          older pinned website baseline; newer features are documented with
          their <a href="/news/alpha6-ranking-temperature/">version-specific examples</a>.
          They do not add a native compilation CLI or a training framework.
        </p>
        <h2>Know the boundaries</h2>
        <p>
          The newer <a href="/news/alpha12-records-collections/">alpha.12 release</a>
          supports records, variants, option/result and immutable lists/maps
          in the interpreter; <a href="/news/alpha11-exact-decimal/">alpha.11</a>
          introduced exact decimal arithmetic. A general native compilation
          command, package manager, user-defined generics, general tensor
          engine, GPU execution and automatic differentiation remain outside
          those releases. Execution budgets do not measure total process memory
          or form a security sandbox.
        </p>
        <a className="inline-link" href="/development/">
          Read the full development status →
        </a>
      </section>
    </Base>
  );
}
