import { useContext, type ReactNode } from "react";
import Brand from "../components/Brand.tsx";
import { navigation, project } from "../data/project.ts";
import { initializeTheme } from "../scripts/theme-init.ts";
import { SiteContext } from "../site/context.ts";

export interface BaseProps {
  title: string;
  description?: string;
  noindex?: boolean;
  children: ReactNode;
}

export default function Base({
  title,
  description = "Explore Scarp, an experimental programming language. Discover current features, runnable examples, downloads, and the roadmap ahead.",
  noindex = false,
  children,
}: BaseProps) {
  const { path, assets } = useContext(SiteContext);
  const canonical = new URL(path, project.origin).href;
  const themeBootstrap = `(${initializeTheme.toString()})();`;
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="generator" content="Scarp TypeScript static renderer" />
        <title>
          {title === "Home"
            ? "Scarp — Build Beyond Boundaries"
            : `${title} · Scarp Programming Language`}
        </title>
        <meta name="description" content={description} />
        {noindex && <meta name="robots" content="noindex" />}
        <link rel="canonical" href={canonical} />
        <link rel="icon" type="image/png" href="/brand/scarp-logo.png" />
        <meta name="theme-color" content="#f7f9fc" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`${title === "Home" ? "Build Beyond Boundaries" : title} · Scarp`}
        />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta
          property="og:image"
          content={`${project.origin}/brand/scarp-logo.png`}
        />
        <meta
          property="og:image:alt"
          content="Scarp blue geometric S logo and wordmark"
        />
        <meta name="twitter:card" content="summary" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Scarp News"
          href="/feed.xml"
        />
        <script
          id="scarp-theme"
          dangerouslySetInnerHTML={{ __html: themeBootstrap }}
        />
        <link rel="stylesheet" href={assets.globalStyle} />
        {path === "/support/" && (
          <link rel="stylesheet" href={assets.supportStyle} />
        )}
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <div className="header-inner">
            <Brand />
            <button
              className="menu-toggle"
              type="button"
              aria-expanded="false"
              aria-controls="main-nav"
              hidden
              data-menu
            >
              Menu <span aria-hidden="true">☰</span>
            </button>
            <nav id="main-nav" aria-label="Main navigation">
              {navigation.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  aria-current={
                    path.startsWith(href) && href.startsWith("/")
                      ? "page"
                      : undefined
                  }
                >
                  {label}
                </a>
              ))}
            </nav>
            <a href="/search/" className="site-search-link" aria-label="Search website" aria-current={path === "/search/" ? "page" : undefined}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="m16 16 5 5" />
              </svg>
              <span>Search</span>
            </a>
            <button
              className="theme-toggle"
              type="button"
              data-theme-toggle
              aria-label="Toggle color theme"
              hidden
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M20.8 13A9 9 0 0 1 11 3.2 9 9 0 1 0 20.8 13Z" />
              </svg>
            </button>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div className="footer-top">
            <div>
              <Brand large />
              <p>
                An experimental language.
                <br />A future built in the open.
              </p>
            </div>
            <div>
              <h2>Explore</h2>
              <a href="/learn/">Learn Scarp</a>
              <a href="/downloads/">Downloads</a>
              <a href="/compatibility/">Compatibility</a>
              <a href="/ecosystem/">Scarp ecosystem</a>
              <a href="/ai/">AI development</a>
              <a href="/faq/">FAQ</a>
            </div>
            <div>
              <h2>Build together</h2>
              <a href={project.repo}>Language source ↗</a>
              <a href="/contribute/">Contribute</a>
              <a href="/community/">Community</a>
              <a href={project.websiteRepo}>Website source ↗</a>
            </div>
            <div>
              <h2>Stay in the loop</h2>
              <a href="/news/">Project news</a>
              <a href="/feed.xml">RSS feed ↗</a>
              <a href="/support/">Get support</a>
              <a href={`mailto:${project.contact}`}>Contact ↗</a>
              <a href={project.docs + "hi/"} lang="hi">
                हिंदी में सीखें ↗
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Scarp Programming Language</span>
            <span>Website: MIT · Language: Apache-2.0</span>
            <span>Built with curiosity. Shared openly.</span>
          </div>
        </footer>
        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          data-announcement
        />
        <script type="module" src={assets.siteScript} />
        {path === "/support/" && (
          <script type="module" src={assets.supportScript} />
        )}
      </body>
    </html>
  );
}
