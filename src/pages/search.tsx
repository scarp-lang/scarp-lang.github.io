import Base from "../layouts/Base.tsx";
import { searchEntries } from "../data/search.ts";

export default function SearchPage() {
  return (
    <Base title="Search" description="Search the official Scarp website for learning resources, features, downloads, roadmap information, and support.">
      <section className="wrap search-page">
        <div className="page-heading">
          <p className="eyebrow">Website directory</p>
          <h1>Find your way around Scarp.</h1>
          <p className="lead">Search official website pages, from the first program to development status and support. Detailed language documentation lives on <a href="https://scarp-lang.github.io/scarp-docs/">Scarp Docs ↗</a>.</p>
          <p className="small muted">Search in English or हिंदी. For example: <code>डाउनलोड</code>, <code>मदद</code>, or <code>कृत्रिम बुद्धिमत्ता</code>. Results link to website pages; Hindi lessons are in Scarp Docs.</p>
        </div>
        <form className="site-search-form" action="/search/" method="get" role="search" data-search-form="" hidden>
          <label htmlFor="site-search-input">Search website pages</label>
          <div className="site-search-controls">
            <input id="site-search-input" data-search-input="" name="q" type="search" maxLength={120} autoComplete="off" placeholder="Try install, इंस्टॉल, or रोडमैप" />
            <button className="button primary" type="submit">Search</button>
          </div>
          <p className="small muted">Tip: press / or Ctrl/⌘+K to open search from anywhere on this site.</p>
        </form>
        <div className="search-results-heading">
          <h2>Explore the website</h2>
          <p data-search-count="" aria-live="polite">Browse all {searchEntries.length} pages</p>
        </div>
        <p className="search-empty" data-search-empty="" hidden>No matching pages. Try another term or browse the <a href="/faq/">FAQ</a>.</p>
        <ul className="site-search-results" data-search-results="">
          {searchEntries.map(entry => (
            <li key={entry.path} data-search-item="" data-search-path={entry.path}>
              <a href={entry.path}>
                <div className="search-item-meta"><span>{entry.section}</span><span className="mono">{entry.path}</span></div>
                <h3>{entry.title}</h3>
                <p>{entry.summary}</p>
              </a>
            </li>
          ))}
        </ul>
        <noscript><p className="notice">JavaScript is off, so live filtering is unavailable. Every website page remains listed above.</p></noscript>
      </section>
    </Base>
  );
}
