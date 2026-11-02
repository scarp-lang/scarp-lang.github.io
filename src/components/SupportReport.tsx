import { project } from "../data/project";
import { supportRoutes } from "../data/support";

export default function SupportReport() {
  return (
    <section
      className="support-builder"
      id="draft-builder"
      aria-labelledby="builder-title"
      data-report-builder
    >
      <div className="support-builder-heading">
        <p className="eyebrow">A little structure helps</p>
        <h3 id="builder-title">Prepare a report for GitHub.</h3>
        <p>
          Choose the destination, add the details you want to share, and review
          your draft. You submit the issue on GitHub.
        </p>
      </div>
      <noscript>
        <p>
          Use the checklist and issue trackers above to write a report. The
          optional draft builder needs JavaScript.
        </p>
      </noscript>
      <form data-support-form hidden>
        <div className="support-fields">
          <div>
            <label htmlFor="support-target">Where is the problem?</label>
            <select id="support-target" name="target">
              {supportRoutes.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="support-kind">What would you like to share?</label>
            <select id="support-kind" name="kind">
              <option value="bug">A bug</option>
              <option value="question">A question</option>
              <option value="feature">A feature idea</option>
            </select>
          </div>
          <div className="full">
            <label htmlFor="support-summary">
              Short summary <span>(required)</span>
            </label>
            <input
              id="support-summary"
              name="summary"
              required
              minLength={3}
              maxLength={100}
              placeholder="Describe the problem or question"
            />
          </div>
          <div>
            <label htmlFor="support-version">Scarp version</label>
            <input
              id="support-version"
              name="version"
              defaultValue={project.version}
              maxLength={80}
              aria-describedby="support-version-help"
            />
            <p id="support-version-help" className="field-help">
              Use your executable’s <code>--version</code> output.
            </p>
          </div>
          <div>
            <label htmlFor="support-environment">
              Operating system, CPU, and browser
            </label>
            <input
              id="support-environment"
              name="environment"
              maxLength={160}
              placeholder="For example: Windows 11, x64, Firefox"
            />
          </div>
          <div className="full">
            <label htmlFor="support-page">
              Affected page URL <span>(website or docs)</span>
            </label>
            <input
              id="support-page"
              type="url"
              name="page"
              maxLength={400}
              placeholder="https://scarp-lang.github.io/…"
            />
          </div>
        </div>
        <details className="support-technical">
          <summary>Add a command, example, or diagnostic</summary>
          <div className="support-fields">
            <div className="full">
              <label htmlFor="support-command">Exact command</label>
              <input
                id="support-command"
                name="command"
                maxLength={200}
                placeholder="For example: ./scarp run hello.srp"
              />
            </div>
            <div className="full">
              <label htmlFor="support-reproducer">
                Smallest example or steps to reproduce
              </label>
              <textarea
                id="support-reproducer"
                name="reproducer"
                rows={5}
                maxLength={1200}
                placeholder="Paste a small .srp program or list the steps."
              ></textarea>
            </div>
            <div>
              <label htmlFor="support-expected">
                Expected behavior or proposed improvement
              </label>
              <textarea
                id="support-expected"
                name="expected"
                rows={4}
                maxLength={600}
              ></textarea>
            </div>
            <div>
              <label htmlFor="support-actual">
                Actual behavior, diagnostic, or question
              </label>
              <textarea
                id="support-actual"
                name="actual"
                rows={4}
                maxLength={600}
              ></textarea>
            </div>
          </div>
        </details>
        <p className="field-help">
          This builder works in your browser. Details are not saved on this
          website. GitHub issues are public, so review the draft before
          continuing.
        </p>
        <div className="actions">
          <button className="button primary" type="submit">
            Prepare draft <span aria-hidden="true">→</span>
          </button>
          <button className="button secondary" type="reset">
            Clear form
          </button>
        </div>
      </form>
      <p
        className="support-report-status"
        role="status"
        aria-live="polite"
        data-report-status
      ></p>
      <div className="support-draft" data-report-output hidden>
        <h4 tabIndex={-1} data-draft-heading>
          Review your draft
        </h4>
        <p className="support-draft-title" data-draft-title></p>
        <label htmlFor="support-draft-body">
          Report details <span>(you can edit this draft)</span>
        </label>
        <textarea
          id="support-draft-body"
          rows={17}
          data-report-draft
          spellCheck="false"
        ></textarea>
        <p className="field-help" data-issue-note></p>
        <div className="actions">
          <button
            type="button"
            className="button secondary"
            data-copy-report
            hidden
          >
            Copy report details
          </button>
          <button type="button" className="button secondary" data-select-report>
            Select draft text
          </button>
          <a className="button primary" data-issue-link>
            Continue on GitHub ↗
          </a>
        </div>
      </div>
    </section>
  );
}
