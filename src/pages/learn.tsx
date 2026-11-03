import Article from "../layouts/Article.tsx";
import type { CSSProperties } from "react";

export default function ArticlePage() {
  return (
    <Article
      title={"A small start. A new language."}
      description={"Choose a learning path and write your first Scarp program."}
      eyebrow={"Learn Scarp"}
    >
      <h2 id={"01--get-the-interpreter"}>01 · Get the interpreter</h2>
      <p>
        For these pinned example commands, use{" "}
        <a href={"https://github.com/scarp-lang/scarp/releases/tag/v0.0.5-alpha.1"}>the verified v0.0.5-alpha.1 interpreter</a>.
        The <a href={"/downloads/"}>latest published prerelease</a> provides newer
        <code>exec</code>, <code>create</code> and <code>launch</code> commands.
        Follow the{" "}
        <a href={"https://scarp-lang.github.io/scarp-docs/guide/installation"}>
          installation guide
        </a>{" "}
        to verify and extract the package, or build it from source with Rust.
      </p>
      <h2 id={"02--write-your-first-program"}>02 · Write your first program</h2>
      <p>
        Save the following as <code>hello.srp</code>:
      </p>
      <pre
        className={"astro-code github-dark"}
        style={
          {
            backgroundColor: "#24292e",
            color: "#e1e4e8",
            overflowX: "auto",
          } as CSSProperties
        }
        tabIndex={0}
        data-language={"text"}
      >
        <code>
          <span className={"line"}>
            <span>{'print("Hello from Scarp!");'}</span>
          </span>
        </code>
      </pre>
      <p>From the extracted interpreter’s directory, run:</p>
      <pre
        className={"astro-code github-dark"}
        style={
          {
            backgroundColor: "#24292e",
            color: "#e1e4e8",
            overflowX: "auto",
          } as CSSProperties
        }
        tabIndex={0}
        data-language={"sh"}
      >
        <code>
          <span className={"line"}>
            <span style={{ color: "#B392F0" } as CSSProperties}>
              {"./scarp"}
            </span>
            <span style={{ color: "#9ECBFF" } as CSSProperties}>{" run"}</span>
            <span style={{ color: "#9ECBFF" } as CSSProperties}>
              {" hello.srp"}
            </span>
          </span>
        </code>
      </pre>
      <p>
        On Windows PowerShell, use <code>./scarp.exe</code> in place of{" "}
        <code>./scarp</code>. This prints <code>Hello from Scarp!</code>{" "}
        followed by a newline. The{" "}
        <a href={"https://scarp-lang.github.io/scarp-docs/guide/first-program"}>
          first-program guide
        </a>{" "}
        explains each part.
      </p>
      <h2 id={"03--follow-a-path"}>03 · Follow a path</h2>
      <table>
        <thead>
          <tr>
            <th>Your starting point</th>
            <th>Read next</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>New to Scarp</td>
            <td>
              <a
                href={
                  "https://scarp-lang.github.io/scarp-docs/guide/introduction"
                }
              >
                Introduction
              </a>
            </td>
          </tr>
          <tr>
            <td>Learning the syntax</td>
            <td>
              <a
                href={
                  "https://scarp-lang.github.io/scarp-docs/language/overview"
                }
              >
                Language overview
              </a>
            </td>
          </tr>
          <tr>
            <td>Exploring functions</td>
            <td>
              <a
                href={
                  "https://scarp-lang.github.io/scarp-docs/language/functions"
                }
              >
                Typed functions
              </a>
            </td>
          </tr>
          <tr>
            <td>Interested in numerical work</td>
            <td>
              <a
                href={
                  "https://scarp-lang.github.io/scarp-docs/language/numerics"
                }
              >
                Numerics
              </a>
            </td>
          </tr>
          <tr>
            <td>Organizing several files</td>
            <td>
              <a
                href={
                  "https://scarp-lang.github.io/scarp-docs/language/modules"
                }
              >
                Source modules
              </a>
            </td>
          </tr>
          <tr>
            <td>Prefer Hindi</td>
            <td>
              <a href={"https://scarp-lang.github.io/scarp-docs/hi/"}>
                हिंदी दस्तावेज़
              </a>
            </td>
          </tr>
        </tbody>
      </table>
      <h2 id={"the-website-and-the-documentation"}>
        The website and the documentation
      </h2>
      <p>
        This project hub introduces Scarp, tracks its published state, and
        explains the direction ahead. <strong>Scarp Docs</strong> contains the
        detailed tutorials, references, and troubleshooting guides. Both are
        official projects in the{" "}
        <a href={"https://github.com/scarp-lang"}>scarp-lang organization</a>.
      </p>
      <p>
        Examples here target <strong>v0.0.5-alpha.1</strong>. Read the{" "}
        <a href={"/development/"}>current limitations</a> alongside the guides.
      </p>
    </Article>
  );
}
