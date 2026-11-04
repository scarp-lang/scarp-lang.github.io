# Scarp official website

The official project hub for the **Scarp Programming Language**:
<https://scarp-lang.github.io/>. Detailed tutorials remain at
[Scarp Docs](https://scarp-lang.github.io/scarp-docs/).

## TypeScript implementation

All website pages, components, rendering, configuration, browser behavior,
build scripts, and tests are authored in **TypeScript (`.ts` / `.tsx`)**.
React renders the TSX components into complete static HTML during the build.
The published site uses the small TypeScript browser modules for interactions;
it does not hydrate a browser React application.

Native CSS provides styling, Scarp `.srp` fixtures provide language examples,
and Markdown is used for these repository guides. The build generates the HTML,
CSS, and JavaScript that browsers consume.

| Area | Source |
| --- | --- |
| Pages and articles | `src/pages/**/*.tsx` |
| Shared layouts and components | `src/layouts/*.tsx`, `src/components/*.tsx` |
| Route registry and static renderer | `src/site/pages.ts`, `src/site/render.tsx` |
| Browser interactions and early theme initialization | `src/scripts/*.ts` |
| Project data and shared logic | `src/data/*.ts`, `src/lib/*.ts` |
| RSS, sitemap, and project snapshot | `src/pages/*.ts` |
| Build and development configuration | `scripts/build.ts`, `vite.config.ts` |
| Styles and static assets | `src/styles/*.css`, `public/` |

## Local development

Use Node.js **22.12+** and npm.

```sh
npm ci
npm run dev
npm run check
npm run preview
```

`npm run check` runs the support and rendering tests, both strict TypeScript
projects, the production build, and generated-site validation. `preview` serves
that built output. The build uses the tsx loader through `node --import tsx`.
Node-only validation tools use native type stripping; type checking runs
separately because stripping does not validate types.

The production build bundles only the browser entry points with Vite, fingerprints
scripts and styles, renders every registered page, and writes RSS, sitemap, and
project JSON. Existing page URLs and the root GitHub Pages base are retained.

## Validation

- `npm run typecheck`: application/render/build types and strict Node tooling.
- `npm run test:support`: repository routing, Unicode, code fences, and long drafts.
- `npm run test:render`: static documents, route aliases, escaping, no-JavaScript
  content, data routes, the searchable page directory, and the not-found response.
- `npm run test:search`: search ranking, multi-term matching, and empty queries.
- `npm run test:ecosystem`: audited ecosystem links, versions, and release-stage labels.
- `npm run test:releases`: pinned example baseline versus published compiler release, exact archive hashes, and download URLs.
- `npm run test:download-guide`: ensure OS-specific checksum commands, archive names, and the release-pinned project guide render correctly.
- `npm run test:release-audit`: isolated tests for upstream publication drift, annotated tags, sidecar and archive tampering.
- `npm run audit:release`: optional **online, read-only** release audit against GitHub (requires network); verifies current public release tag, commit, three binary hashes, sidecars, and combined checksums.
- `npm run test:compatibility`: fixture coverage and expected commands for both verified compiler source pins.
- `npm run test:compiler-pins`: check that the pin synchronizer rejects accidental or ambiguous workflow changes.
- `npm run check:compiler-pins`: ensure CI and Pages both use the exact commits declared by the reviewed compiler snapshots.
- `npm run sync:compiler-pins`: update only the two Scarp checkout SHAs in both workflows after a manually reviewed release change.
- `npm run check:site`: generated links, fragments, assets, metadata, sitemap,
  RSS, release snapshot, and six early-theme scenarios.
- `SCARP_BIN=/path/to/scarp npm run test:examples`: exact-output checks against
  the published interpreter used by the website baseline.

## Content and publication

The hub includes features, development status, roadmap, releases/downloads,
learning paths, AI direction, community, support, contribution guidance, FAQ,
project news, an evidence-linked Scarp ecosystem directory at `/ecosystem/`,
a source-verified compatibility guide at `/compatibility/`, an evidence-linked
published CLI migration guide at `/migration/` (alpha.1–alpha.4), and a local,
privacy-friendly site search at `/search/`.
Search also works as a complete page directory without JavaScript; with JavaScript,
it supports live filtering and the `/` or Ctrl/⌘+K keyboard shortcut. It is a **reviewed snapshot**, not a live compiler feed.
The featured website programs keep their older verified compiler baseline,
and the same three homepage fixtures also run under the pinned alpha.4 compiler
with byte-exact expected output. The two compiler sources and distinct CLI
commands are tested in both CI and the Pages workflow. The compatibility page
does **not** promise that all user programs work across versions. The Downloads and Releases pages show the published
**v0.0.5-alpha.4** prerelease, released on 3 November 2026, with exact
GitHub archive digests. The ecosystem page independently records project
versions; these are reviewed snapshots, not a live GitHub feed.
Baseline: **v0.0.5-alpha.1**, source
`afe8b5380c9d6c4774162e51c6c9bc8b90901671`, reviewed 1 November 2026.

A separate [release audit workflow](.github/workflows/release-audit.yml) runs daily,
can be run manually, and checks PRs that change release evidence. It never
publishes a release, changes website content, or merges a PR. A newer upstream
public release intentionally fails the audit with a request for human review;
`npm run check` remains offline and always includes the audit's unit tests.
Use [the release review checklist](CONTRIBUTING.md#reviewing-new-compiler-releases)
to update versioned content and both compiler CI pins together. The site derives
compiler ecosystem version/evidence, page metadata, release dates, and download
filenames from its reviewed TypeScript release snapshot. Both workflows use
version-independent compiler build paths; the pin synchronizer keeps their exact
source commits aligned without following moving tags.

GitHub Actions validates PRs and deploys `dist/` from main to GitHub Pages after
checks and the pinned Scarp example tests pass. No custom domain is configured.
The main site uses `/`; the independent documentation site uses `/scarp-docs/`.
See [CONTRIBUTING.md](CONTRIBUTING.md) for source and evidence conventions.

## Branding and licenses

`public/brand/scarp-logo.png` is the permanent blue geometric S and wordmark.
Navigation displays the icon area through CSS while preserving the original image.

Website: [MIT](LICENSE). Scarp implementation:
[Apache-2.0](https://github.com/scarp-lang/scarp/blob/main/LICENSE).
