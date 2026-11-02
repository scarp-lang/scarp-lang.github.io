import Article from "../../layouts/Article.tsx";

export default function ArticlePage() {
  return (
    <Article
      title={"A home for the language, and the work ahead"}
      description={
        "Introducing Scarp’s official project hub and its connection to Scarp Docs."
      }
      eyebrow={"Project"}
      date={"2026-11-01"}
    >
      <p>
        Scarp’s official project website brings the language’s published state,
        examples, releases, roadmap, and community links into one place.
      </p>
      <h2 id={"a-project-hub-and-a-documentation-home"}>
        A project hub and a documentation home
      </h2>
      <p>
        The main site at <strong>scarp-lang.github.io</strong> explains what
        Scarp can do today and where it aims to go.{" "}
        <a href={"https://scarp-lang.github.io/scarp-docs/"}>Scarp Docs</a>{" "}
        remains the home for detailed guides and references in English and
        Hindi.
      </p>
      <h2 id={"evidence-beside-ambition"}>Evidence beside ambition</h2>
      <p>
        The site uses a reviewed <strong>v0.0.5-alpha.1</strong> baseline.
        Implemented features appear separately from planned capabilities.
        Release information points to upstream records; future work carries no
        invented dates or progress percentages.
      </p>
      <h2 id={"built-in-the-open"}>Built in the open</h2>
      <p>
        The website launched with Astro, TypeScript, and Markdown. Its source is{" "}
        <a href={"https://github.com/scarp-lang/scarp-lang.github.io"}>
          public and MIT licensed
        </a>
        . Corrections to copy, accessibility, examples, and source evidence are
        welcome.
      </p>
      <p>
        <a href={"/roadmap/"}>Explore the roadmap →</a> ·{" "}
        <a href={"/contribute/"}>Help improve the website →</a>
      </p>
    </Article>
  );
}
