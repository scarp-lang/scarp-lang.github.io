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
        <h2>Published v0.0.7-alpha.3 additions</h2>
        <p>Bounded generic functions support explicit type arguments, contextual inference and generic Option and Result payloads. String concatenation and repetition, raw and multiline literals are supported. The experimental native integer subset supports private flat fixed arrays, tuples and records as stack locals. See <a href="/news/v007-alpha3-generics-native/">the release overview</a> for evidence and limits.</p>
        <h2>Know the boundaries</h2>
        <p>
          The earlier <a href="/news/alpha15-runtime-kernels/">alpha.15 release</a>
          limits inspection file sizes, charges string-comparison work,
          validates semantic cache revisions and adds checked shift kernels.
          Earlier <a href="/news/alpha14-patterns-native/">alpha.14</a>
          refined nested pattern diagnostics, live Rust editor cache limits and
          a restricted checked integer ELF64 object API. Earlier
          <a href="/news/alpha13-editor-caches/"> alpha.13</a> improved typed
          Option/Result propagation and editor snapshot safety.
          <a href="/news/alpha12-records-collections/"> Alpha.12</a>
          added records, variants, option/result and immutable lists/maps
          in the interpreter; <a href="/news/alpha11-exact-decimal/">alpha.11</a>
          introduced exact decimal arithmetic. A general native compilation
          command, package manager, user-defined generics, general tensor
          engine, GPU execution and automatic differentiation remain outside
          those releases. Execution budgets do not measure total process memory
          or form a security sandbox. The source snippets above use
          the pinned older example baseline; for alpha.15 use the
          <a href="/compatibility/">compiler-backed compatibility coverage</a>.
          The Rust cache APIs are not a new Scarp source syntax or CLI.
        </p>
        <a className="inline-link" href="/development/">
          Read the full development status →
        </a>
      </section>
    </Base>
  );
}
