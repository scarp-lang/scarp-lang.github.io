import Base from "../layouts/Base.tsx";
import CodeBlock from "../components/CodeBlock.tsx";
import SupportReport from "../components/SupportReport.tsx";
import { project } from "../data/project";
import { helpTopics, supportRoutes } from "../data/support";

export default function SupportPage() {
  return (
    <Base
      title="Support"
      description="Get help with Scarp installation, errors, source modules, and runtime limits. Find the right issue tracker or contact the project."
    >
      <section className="wrap page-heading support-heading">
        <p className="eyebrow">Scarp support</p>
        <h1>
          A question is
          <br />a good place to start.
        </h1>
        <p className="lead">
          Find a guide, narrow down a problem, or bring a reproducible example
          to the project.
        </p>
        <div className="actions">
          <a className="button primary" href="#help">
            Find a guide <span aria-hidden="true">↓</span>
          </a>
          <a className="button secondary" href="#report">
            Report a problem <span aria-hidden="true">→</span>
          </a>
        </div>
        <p className="support-baseline">
          Guidance targets <a href="/releases/">v{project.version}</a> ·
          Experimental prerelease
        </p>
      </section>

      <section
        className="wrap section compact"
        id="help"
        aria-labelledby="help-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">Start with the right guide</p>
            <h2 id="help-title">
              What are you
              <br />
              working through?
            </h2>
          </div>
          <a
            className="inline-link"
            href={project.docs + "tooling/troubleshooting"}
          >
            Open troubleshooting ↗
          </a>
        </div>
        <div className="support-topic-grid">
          {helpTopics.map((topic) => (
            <article
              key={topic.id}
              className="support-topic"
              id={`help-${topic.id}`}
            >
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
              <a className="inline-link" href={project.docs + topic.path}>
                {topic.label} ↗
              </a>
            </article>
          ))}
        </div>
        <p className="support-language">
          <span lang="hi">हिंदी में सहायता चाहिए?</span>{" "}
          <a href={project.docs + "hi/tooling/troubleshooting"} lang="hi">
            हिंदी समस्या समाधान गाइड खोलें ↗
          </a>
        </p>
      </section>

      <section className="support-common">
        <div className="wrap support-split">
          <div>
            <p className="eyebrow">A quick first check</p>
            <h2>
              Confirm the version.
              <br />
              Then try a small example.
            </h2>
            <p>
              Run the extracted executable directly. This avoids accidentally
              using another Scarp installation on your PATH.
            </p>
            <CodeBlock
              filename="Linux / macOS"
              code={"./scarp --version\n./scarp run examples/hello.srp"}
            />
            <p className="small muted">
              Windows PowerShell: use <code>./scarp.exe</code> in place of{" "}
              <code>./scarp</code>.
            </p>
          </div>
          <div className="support-questions">
            <details>
              <summary>The command is not found</summary>
              <p>
                Run Scarp from its extracted folder with <code>./scarp</code> or{" "}
                <code>./scarp.exe</code> in PowerShell. Check the executable’s
                location before changing your PATH. See the{" "}
                <a href={project.docs + "guide/installation"}>
                  installation guide
                </a>
                .
              </p>
            </details>
            <details>
              <summary>
                <code>check</code> succeeds but prints nothing
              </summary>
              <p>
                A successful <code>scarp check file.srp</code> is intentionally
                silent. It evaluates the selected path without replaying output.
                Use <code>scarp run file.srp</code> to see the program’s output.
              </p>
            </details>
            <details>
              <summary>An example reports old or unknown syntax</summary>
              <p>
                Compare <code>--version</code> with the tutorial’s baseline.
                Older releases may use <code>let</code> or <code>println</code>.
                The current baseline uses <code>bind</code> and{" "}
                <code>print</code>; see{" "}
                <a href={project.docs + "reference/compatibility"}>
                  compatibility
                </a>
                .
              </p>
            </details>
            <details>
              <summary>
                <code>build</code> or <code>compile</code> is rejected
              </summary>
              <p>
                The published interpreter provides <code>run</code>,{" "}
                <code>check</code>, and <code>tokens</code>. Native-code
                compilation is future work.{" "}
                <a href="/development/">Review the current capabilities</a>.
              </p>
            </details>
          </div>
        </div>
      </section>

      <section
        className="wrap section"
        id="report"
        aria-labelledby="report-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">Make the next step useful</p>
            <h2 id="report-title">
              Bring the problem
              <br />
              to the right place.
            </h2>
          </div>
          <p>
            Search existing issues first.
            <br />
            Include a small example others can reproduce.
          </p>
        </div>
        <div className="support-route-grid">
          {supportRoutes.map((route) => (
            <article key={route.id} className="support-route">
              <h3>{route.title}</h3>
              <p>{route.description}</p>
              <a className="inline-link" href={`${route.repo}/issues`}>
                {route.label} ↗
              </a>
            </article>
          ))}
        </div>
        <div className="support-report-notes prose">
          <h3>What to include in a report</h3>
          <p>
            <a href="#draft-builder">Prepare a guided report draft →</a>
          </p>
          <ul>
            <li>Your Scarp version, operating system, and CPU architecture.</li>
            <li>
              The exact command and the smallest example that reproduces the
              issue.
            </li>
            <li>
              What you expected and the actual output or complete diagnostic.
            </li>
            <li>
              For a website or docs issue: the page URL and, when relevant, your
              browser.
            </li>
          </ul>
          <p>
            GitHub issues are public. Remove credentials and private paths
            before posting. The <a href="/contribute/">contribution guide</a>{" "}
            explains how to follow up with a focused change.
          </p>
        </div>
      </section>

      <div className="wrap support-builder-wrap">
        <SupportReport />
      </div>

      <section className="wrap support-contact">
        <div>
          <p className="eyebrow">Project correspondence</p>
          <h2>
            Need to contact
            <br />
            the project?
          </h2>
          <p>
            For general correspondence, email{" "}
            <a href={`mailto:${project.contact}`}>{project.contact}</a>. Public,
            reproducible technical questions belong in the issue trackers above.
          </p>
          <p className="small muted">
            Scarp is an early open-source project. Support is community based;
            no guaranteed response time or paid support plan is advertised.
          </p>
        </div>
        <div>
          <a className="button primary" href={`mailto:${project.contact}`}>
            Email the project ↗
          </a>
          <a className="inline-link" href="/community/">
            Find official community accounts →
          </a>
        </div>
      </section>
    </Base>
  );
}
