import { searchEntries } from "../data/search.ts";
import { quickSearchLimit } from "../data/quick-search.ts";

/**
 * A native modal dialog, hidden by the browser until progressive enhancement.
 * Without JavaScript, the permanent /search/ header link still works.
 */
export default function QuickSearch() {
  return (
    <dialog className="quick-search" id="quick-search" data-quick-search
      aria-labelledby="quick-search-title" aria-describedby="quick-search-description">
      <div className="quick-search-inner">
        <div className="quick-search-heading">
          <div>
            <p className="eyebrow">Official website</p>
            <h2 id="quick-search-title">Quick search</h2>
          </div>
          <button type="button" className="quick-search-close"
            data-quick-close aria-label="Close quick search">Close <kbd>Esc</kbd></button>
        </div>
        <p id="quick-search-description" className="quick-search-help">
          Search pages in English or हिंदी. Detailed language reference is in Scarp Docs.
        </p>
        <form action="/search/" method="get" role="search" className="quick-search-form">
          <label htmlFor="quick-search-input" className="sr-only">Search official Scarp pages</label>
          <input id="quick-search-input" data-quick-input type="search" name="q"
            maxLength={120} autoComplete="off" placeholder="Try install, roadmap, or डाउनलोड"
            aria-controls="quick-search-results" />
          <button type="submit">Search all</button>
        </form>
        <div className="quick-search-content">
          <p className="quick-search-count" data-quick-count role="status"
            aria-live="polite" aria-atomic="true">Top {quickSearchLimit} website pages</p>
          <p className="quick-search-empty" data-quick-empty hidden>
            No matching pages. Try different words or browse the directory.
          </p>
          <ul className="quick-search-results" id="quick-search-results" data-quick-results>
            {searchEntries.map(entry => (
              <li key={entry.path} data-quick-item data-quick-path={entry.path}>
                <a href={entry.path} data-quick-link>
                  <span className="quick-search-section">{entry.section}</span>
                  <strong>{entry.title}</strong>
                  <span className="quick-search-summary">{entry.summary}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="quick-search-footer">
          <a data-quick-all href="/search/">Browse all {searchEntries.length} pages →</a>
          <span>↑ ↓ to navigate · Enter to open</span>
        </div>
      </div>
    </dialog>
  );
}
