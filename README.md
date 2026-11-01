# Scarp official website

The project hub for the **Scarp Programming Language**, built with Astro,
TypeScript, and Markdown. Intended URL: <https://scarp-lang.github.io/>.
Detailed learning material remains at [Scarp Docs](https://scarp-lang.github.io/scarp-docs/).

## Local development

Node.js 22.12+ (Node 22 LTS recommended) and npm are required.

```sh
npm ci
npm run dev
npm run check
```

`check` runs Astro/TypeScript diagnostics, creates the static site, and validates
all generated local links, fragments, assets, metadata, sitemap, RSS, and baseline
data. `npm run preview` serves the built output.

## Content map

- Home, features, development status, and roadmap
- Release notes and platform downloads with SHA-256 values
- Learning paths to English and Hindi Scarp Docs
- AI direction, community, contribution guide, and FAQ
- Markdown project news, RSS, sitemap, and machine-readable `project.json`

The website is a **reviewed snapshot**, not a live compiler-development feed.
Current baseline: **v0.0.5-alpha.1**, source commit
`afe8b5380c9d6c4774162e51c6c9bc8b90901671`, reviewed 1 November 2026.
Read [CONTRIBUTING.md](CONTRIBUTING.md) before updating claims or examples.

## Deploying to GitHub Pages

The `Deploy official website` workflow validates and builds main, tests its
Scarp examples against the exact published compiler source, then deploys the
static artifact through GitHub Actions. Pull requests run the same site checks
without deployment privileges.

Repository Settings → Pages should use **GitHub Actions**. The deployment action
requests first-time enablement; if the repository token cannot enable Pages,
an organization/repository administrator must select that source once. No custom
domain is configured. The organization site uses `/` as its base, while
Scarp Docs keeps `/scarp-docs/`.

## Branding and licenses

`public/brand/scarp-logo.png` is the project's original permanent blue geometric
S and wordmark. Navigation displays the icon area through CSS while preserving
the source image. Do not substitute a different S logo.

Website: [MIT](LICENSE). Scarp implementation: [Apache-2.0](https://github.com/scarp-lang/scarp/blob/main/LICENSE).
