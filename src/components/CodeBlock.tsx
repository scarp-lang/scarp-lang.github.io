export default function CodeBlock(props: { code: string; filename?: string }) {
  const { code, filename = "terminal" } = props;
  // Render tokens as escaped text nodes. No generated HTML or evaluation of Scarp.
  const parts = code
    .trimEnd()
    .split(
      /(\/\/[^\n]*|"(?:\\.|[^"\\])*"|\b(?:bind|var|pure|funcra|return|repeat|as|print|integer)\b|\b\d+(?:\.\d+)?\b)/g,
    );
  const kind = (token: string) =>
    token.startsWith("//")
      ? "comment"
      : token.startsWith('"')
        ? "string"
        : /^\d/.test(token)
          ? "number"
          : /^(bind|var|pure|funcra|return|repeat|as|integer)$/.test(token)
            ? "keyword"
            : token === "print"
              ? "function"
              : undefined;
  return (
    <div className="code-block">
      <div className="code-title">
        <span>
          <span className="file-dot" aria-hidden="true"></span>
          {filename}
        </span>
        <button
          type="button"
          className="copy-button"
          data-copy
          hidden
          aria-label={`Copy ${filename}`}
        >
          Copy
        </button>
      </div>
      <pre tabIndex={0}>
        <code>
          {parts.map((part, index) => (
            <span key={index} className={kind(part)}>
              {part}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
