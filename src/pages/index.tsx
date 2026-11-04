import Base from "../layouts/Base.tsx";
import CodeExplorer from "../components/CodeExplorer.tsx";
import CodeBlock from "../components/CodeBlock.tsx";
import { formatNewsDate } from "../lib/date.ts";
import { capabilities, news, project, sourceUrl } from "../data/project";
import { publishedCompiler } from "../data/releases.ts";

export default function IndexPage() {
  return (
    <Base title="Home">
      <section className="hero wrap">
        <a className="release-pill" href="/releases/">
          <span className="status-dot" aria-hidden="true"></span>
          {publishedCompiler.tag}
          <span className="pill-label">Latest published alpha</span>
          <span aria-hidden="true">↗</span>
        </a>
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">The Scarp Programming Language</p>
            <h1>
              Build beyond
              <br />
              <span>boundaries.</span>
            </h1>
            <p className="hero-description">
              A language taking shape.
              <br />A new space for your ideas.
            </p>
            <p className="hero-detail">
              Explore clear syntax, typed functions, and numerical foundations
              in an open, experimental language.
            </p>
            <div className="actions">
              <a className="button primary" href="/learn/">
                Start with Scarp <span aria-hidden="true">→</span>
              </a>
              <a className="button secondary" href={project.repo}>
                Explore the source <span aria-hidden="true">↗</span>
              </a>
            </div>
            <p className="small muted">
              Early alpha. Try it, question it, help shape it.
            </p>
          </div>
          <div className="hero-code">
            <div className="code-overline">
              <span>Ideas into expressions</span>
              <span aria-hidden="true">.srp</span>
            </div>
            <CodeExplorer />
            <p className="code-footnote">
              Real syntax. Expected output.{" "}
              <a href="/compatibility/">Verified on two releases ↗</a>
            </p>
          </div>
        </div>
        <div className="foundation-strip">
          <span>
            <b>Rust</b> interpreter implementation
          </span>
          <span>
            <b>Apache-2.0</b> language source
          </span>
          <span>
            <b>Open development</b> from the beginning
          </span>
        </div>
      </section>

      <section className="section wrap" aria-labelledby="foundations-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Built from the fundamentals</p>
            <h2 id="foundations-title">
              Small language.
              <br />
              Serious foundations.
            </h2>
          </div>
          <p>
            Explore what you can use today.
            <br />
            Every capability here is part of the published alpha.
          </p>
        </div>
        <div className="feature-grid">
          {capabilities.map((feature) => (
            <a
              key={feature.number}
              className="feature"
              href={sourceUrl(feature.link)}
            >
              <span className="feature-number">
                {feature.number} <span aria-hidden="true">↗</span>
              </span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
              <span className="text-link">{feature.label}</span>
            </a>
          ))}
        </div>
        <a className="inline-link" href="/features/">
          Explore the language features <span aria-hidden="true">→</span>
        </a>
      </section>

      <section
        className="development-section"
        aria-labelledby="development-title"
      >
        <div className="wrap development-grid">
          <div>
            <p className="eyebrow">An honest look at the present</p>
            <h2 id="development-title">
              Early days.
              <br />
              Real progress.
            </h2>
            <p>
              Scarp is a working interpreter with a growing numerical core. Its
              syntax and APIs are evolving, and the path to a stable language is
              still ahead.
            </p>
            <a className="inline-link" href="/development/">
              Explore the current state <span aria-hidden="true">→</span>
            </a>
          </div>
          <div className="status-board">
            <div className="status-board-header">
              <span className="status-badge">Reviewed alpha.1</span>
              <span className="mono">v{project.version}</span>
            </div>
            <h3>Source modules</h3>
            <p>
              The verified website baseline brings relative imports and
              explicit public exports to multi-file programs.
            </p>
            <ol className="milestone-list">
              <li>
                <span className="milestone-marker done" aria-hidden="true">
                  ✓
                </span>
                <div>
                  <b>Available now</b>
                  <span>Functions, numerical values & source modules</span>
                </div>
              </li>
              <li>
                <span className="milestone-marker" aria-hidden="true">
                  02
                </span>
                <div>
                  <b>Next priorities</b>
                  <span>Module tooling, conformance & navigation</span>
                </div>
              </li>
              <li>
                <span className="milestone-marker" aria-hidden="true">
                  03
                </span>
                <div>
                  <b>Further ahead</b>
                  <span>Types, compiler backend & domain libraries</span>
                </div>
              </li>
            </ol>
            <a className="inline-link" href="/roadmap/">
              Follow the roadmap <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      <section
        className="section wrap learning-grid"
        aria-labelledby="learning-title"
      >
        <div>
          <p className="eyebrow">Your first few lines</p>
          <h2 id="learning-title">
            Curiosity is
            <br />
            all you need.
          </h2>
          <p className="section-description">
            Start with a small program. Learn the fundamentals in English or
            Hindi, then explore functions and numerical examples.
          </p>
          <div className="actions">
            <a
              className="button primary"
              href={project.docs + "guide/first-program"}
            >
              Read the first-program guide <span aria-hidden="true">↗</span>
            </a>
            <a className="inline-link" href={project.docs + "hi/"} lang="hi">
              हिंदी में सीखें ↗
            </a>
          </div>
        </div>
        <div className="quickstart">
          <p className="eyebrow">01 / Get the interpreter</p>
          <p>
            For this tested example, use the <a href={project.release}>{project.tag} interpreter</a>.
            The <a href="/downloads/">latest alpha downloads</a> use newer CLI commands.
          </p>
          <p className="eyebrow">02 / Save hello.srp</p>
          <CodeBlock
            filename="hello.srp"
            code={'print("Hello from Scarp!");'}
          />
          <p className="eyebrow">03 / Run from its folder</p>
          <CodeBlock filename="terminal" code={"./scarp run hello.srp"} />
          <p className="small muted">
            Verified against {project.tag}. Windows PowerShell: use <code>./scarp.exe</code>.
            Newer versions offer <code>exec</code> and project commands; see the <a href="/downloads/">current setup guide</a>.
          </p>
        </div>
      </section>

      <section className="wrap ecosystem-teaser" aria-labelledby="ecosystem-teaser-title">
        <div>
          <p className="eyebrow">Beyond the compiler</p>
          <h2 id="ecosystem-teaser-title">Explore the Scarp ecosystem.</h2>
          <p>Documentation, a browser playground, tested examples, and editor support are growing alongside the language. Find the right tool and check its prerelease status.</p>
        </div>
        <a className="button primary" href="/ecosystem/">Explore all tools <span aria-hidden="true">→</span></a>
      </section>

      <section
        className="section news-section wrap"
        aria-labelledby="news-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">From the project</p>
            <h2 id="news-title">The latest chapter.</h2>
          </div>
          <a className="inline-link" href="/news/">
            All project news <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="news-grid">
          {news.map((item) => (
            <a key={item.href} className="news-card" href={item.href}>
              <div className="news-meta">
                <span>{item.category}</span>
                <time dateTime={item.date}>{formatNewsDate(item.date)}</time>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="text-link">
                Read the update <span aria-hidden="true">↗</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="community-callout wrap">
        <span className="eyebrow">Made in the open</span>
        <h2>
          A language grows
          <br />
          with its community.
        </h2>
        <p>
          Bring a question, a test case, or a different perspective.
          <br />
          There’s room to help shape what comes next.
        </p>
        <div className="actions">
          <a className="button primary" href="/contribute/">
            Find your way to contribute <span aria-hidden="true">→</span>
          </a>
          <a className="button secondary" href="/community/">
            Meet the community <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </Base>
  );
}
