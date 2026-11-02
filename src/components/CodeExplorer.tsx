import { getExamples } from "../data/examples";
import CodeBlock from "./CodeBlock.tsx";

export default function CodeExplorer() {
  const examples = getExamples();
  return (
    <div className="code-explorer" data-code-explorer>
      <div
        className="example-tabs"
        aria-label="Scarp examples"
        data-tabs
        hidden
      >
        {examples.map((example) => (
          <button
            key={example.id}
            type="button"
            id={`tab-${example.id}`}
            aria-controls={`example-${example.id}`}
            data-tab={example.id}
          >
            {example.label}
          </button>
        ))}
      </div>
      {examples.map((example) => (
        <section
          key={example.id}
          className="example-panel"
          id={`example-${example.id}`}
          aria-labelledby={`tab-${example.id}`}
          data-panel={example.id}
        >
          <CodeBlock code={example.code} filename={example.filename} />
          <div className="code-output">
            <span className="output-label">Expected output</span>
            <pre>
              <code>{example.output.trimEnd()}</code>
            </pre>
          </div>
        </section>
      ))}
      <div className="code-caption">
        <span className="status-dot" aria-hidden="true"></span>Scarp
        v0.0.5-alpha.1 <span>·</span> CLI examples
      </div>
    </div>
  );
}
