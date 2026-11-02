import Article from "../layouts/Article.tsx";
import type { CSSProperties } from "react";

export default function ArticlePage() {
  return (
    <Article
      title={"Help shape the next step."}
      description={
        "Practical ways to contribute to the language, its documentation, and this website."
      }
      eyebrow={"Contribute to Scarp"}
    >
      <h2 id={"start-with-a-small-useful-change"}>
        Start with a small, useful change
      </h2>
      <p>
        Try an example, improve an explanation, or report behavior that differs
        from the reference. A focused contribution with a reproducible result
        makes review easier.
      </p>
      <table>
        <thead>
          <tr>
            <th>Contribution</th>
            <th>Where to begin</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Interpreter bug or language proposal</td>
            <td>
              <a href={"https://github.com/scarp-lang/scarp/issues"}>
                scarp issues
              </a>
            </td>
          </tr>
          <tr>
            <td>Language implementation</td>
            <td>
              <a
                href={
                  "https://github.com/scarp-lang/scarp/blob/main/CONTRIBUTING.md"
                }
              >
                Compiler contribution guide
              </a>
            </td>
          </tr>
          <tr>
            <td>Tutorial or translation correction</td>
            <td>
              <a href={"https://github.com/scarp-lang/scarp-docs/issues"}>
                scarp-docs issues
              </a>
            </td>
          </tr>
          <tr>
            <td>Website copy, accessibility, or interaction</td>
            <td>
              <a
                href={
                  "https://github.com/scarp-lang/scarp-lang.github.io/issues"
                }
              >
                Website issues
              </a>
            </td>
          </tr>
          <tr>
            <td>A numerical use case</td>
            <td>
              <a href={"https://github.com/scarp-lang/scarp/issues"}>
                Language discussions through issues
              </a>
            </td>
          </tr>
        </tbody>
      </table>
      <h2 id={"write-a-useful-bug-report"}>Write a useful bug report</h2>
      <p>
        Include the Scarp version, your operating system and CPU architecture,
        the smallest <code>.srp</code> example that reproduces the issue, the
        command you ran, the expected behavior, and the actual output or
        diagnostic. Remove personal information and credentials before posting.
      </p>
      <h2 id={"work-on-the-website"}>Work on the website</h2>
      <p>
        This website uses <strong>TypeScript and TSX</strong> and deploys to
        GitHub Pages. Page content and shared layout components are maintained
        in TypeScript/TSX; native CSS provides the styling.
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
        data-language={"sh"}
      >
        <code>
          <span className={"line"}>
            <span style={{ color: "#B392F0" } as CSSProperties}>{"npm"}</span>
            <span style={{ color: "#9ECBFF" } as CSSProperties}>{" ci"}</span>
          </span>
          {"\n"}
          <span className={"line"}>
            <span style={{ color: "#B392F0" } as CSSProperties}>{"npm"}</span>
            <span style={{ color: "#9ECBFF" } as CSSProperties}>{" run"}</span>
            <span style={{ color: "#9ECBFF" } as CSSProperties}>
              {" check"}
            </span>
          </span>
          {"\n"}
          <span className={"line"}>
            <span style={{ color: "#B392F0" } as CSSProperties}>{"npm"}</span>
            <span style={{ color: "#9ECBFF" } as CSSProperties}>{" run"}</span>
            <span style={{ color: "#9ECBFF" } as CSSProperties}>{" dev"}</span>
          </span>
        </code>
      </pre>
      <p>
        See the{" "}
        <a
          href={
            "https://github.com/scarp-lang/scarp-lang.github.io/blob/main/CONTRIBUTING.md"
          }
        >
          website contribution guide
        </a>
        . Changes to language claims should link to a pinned source, published
        release, or reviewed documentation page. Keep future work clearly
        labeled.
      </p>
      <h2 id={"licensing"}>Licensing</h2>
      <p>
        The <strong>website</strong> is MIT licensed. The{" "}
        <strong>Scarp language implementation</strong> is Apache-2.0 licensed.
        Check the license of the repository you contribute to.
      </p>
    </Article>
  );
}
