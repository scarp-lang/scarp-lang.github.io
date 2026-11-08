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
| Search metadata | Safe, static `WebSite` / `WebPage` JSON-LD from `src/lib/structured-data.ts` |
| RSS, sitemap, and project snapshot | `src/pages/*.ts` |
| Build and development configuration | `scripts/build.ts`, `vite.config.ts` |
| Styles and static assets | `src/styles/*.css`, `public/` |

## Local development

Use Node.js **26 LTS** and npm.

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
- `npm run test:a11y`: check labelled landmarks, ARIA references, images,
  controls, and invalid static HTML fixtures; generated-site validation checks
  every output page using the same contracts.
- `npm run test:render`: static documents, route aliases, escaping, no-JavaScript
  content, data routes, the searchable page directory, and the not-found response.
- `npm run test:search`: search ranking, multi-term matching, and empty queries.
- `npm run test:structured-data`: canonical URLs, project identity, and script-safe JSON-LD; deliberately avoids unsupported stable-software claims.
- `npm run test:search-ui`: accessible result announcements, clear/Escape, browser
  navigation, global keyboard shortcuts, and no-JS fallback.
- `npm run test:nav`: mobile disclosure state, Escape behavior, outside interaction,
  focus restoration, and responsive breakpoint transitions.
- `npm run test:tabs`: accessible example tab selection, arrow/Home/End keyboard
  navigation, focus behavior, and safe fallback when markup is incomplete.
- `npm run test:ecosystem`: audited ecosystem links, versions, and release-stage labels.
- `npm run test:releases`: pinned example baseline versus published compiler release, exact archive hashes, and download URLs.
- `npm run test:download-guide`: ensure OS-specific checksum commands, archive names, and the release-pinned project guide render correctly.
- `npm run test:release-audit`: isolated tests for upstream publication drift, annotated tags, sidecar and archive tampering.
- `npm run audit:release`: optional **online, read-only** release audit against GitHub (requires network); verifies current public release tag, commit, three binary hashes, sidecars, and combined checksums.
- `npm run test:compatibility`: fixture coverage and expected commands for both verified compiler source pins.
- `npm run test:migration`: release-tag evidence, CLI migration semantics and source-backed fixture labels.
- `npm run test:compiler-pins`: check that the pin synchronizer rejects accidental or ambiguous workflow changes.
- `npm run check:compiler-pins`: ensure CI and Pages both use the exact commits declared by the reviewed compiler snapshots.
- `npm run sync:compiler-pins`: update only the two Scarp checkout SHAs in both workflows after a manually reviewed release change.
- `npm run check:site`: generated links, fragments, assets, metadata, sitemap,
  RSS, release snapshot, and six early-theme scenarios.
- `SCARP_BIN=/path/to/scarp npm run test:examples`: exact-output checks against
  the published interpreter used by the website baseline.

## Real-browser mobile and accessibility QA

In addition to static accessibility contracts, `.github/workflows/browser-audit.yml`
runs the **production-built HTML/CSS/TypeScript** in headless Google Chrome
on pull requests and supported branch pushes. Its checks cover:

- Mobile menu disclosure, Escape handling and keyboard focus restoration.
- Horizontal overflow at 320, 390, 768 and 1280px on four critical routes.
- Global search shortcut, Hindi search results and clear-state announcements.
- Keyboard-controlled example tabs, skip-to-content, and optimized image loading.
- Accessible no-JavaScript fallback for examples, navigation and the site directory.
- Browser-computed foreground/background contrast checks in **light and dark** modes
  across home, search, downloads and support (minimum 4.5:1 for representative normal text).
- Explicit theme-toggle label and persistent theme choice across navigation/reload.
- Four full-page Chrome screenshots, uploaded as review artifacts for 14 days.

The test-only runner installs pinned `playwright-core@1.64.1` against Chrome
provided on GitHub's `ubuntu-24.04` runner, without rewriting
`package-lock.json` or including Playwright in production bundles.
TypeScript browser tests are type-checked by `tsconfig.browser.json`.

For local Chrome testing after `npm ci`:

```sh
npm install --no-save --package-lock=false playwright-core@1.64.1
npx tsc -p tsconfig.browser.json
npm run build
npm run test:browser
```

The test runner serves the exact built `dist/` files using a temporary local HTTP server. The workflow uploads
failure screenshots and visual-difference images. Four **checked-in production reference
screenshots** are compared against each browser run pixel by pixel, allowing
no more than **0.35% of pixels** to differ materially (over 40 intensity
levels in any RGBA channel). Width/height differences always fail.
Mismatches produce magenta-highlighted diff PNGs under
`test-results/browser/diffs/` alongside the current screenshot.

Reference screenshots in `tests/browser/baselines/` were imported from the
successful GitHub Actions Chrome run [42160811505](https://github.com/scarp-lang/scarp-lang.github.io/actions/runs/42160811505),
for the verified live production commit `5289b957`. **Reference files are
never regenerated or accepted in CI**. When a design update is intentional,
review its screenshots before explicitly updating and committing reference
images. Hosted Chrome/font updates can introduce genuine differences and should
also be reviewed, not silently approved.

The contrast samples check solid, directly defined foreground/background pairs;
they do not automatically audit every text pixel, overlay, or gradient.
This remains browser regression testing, not a full WCAG audit
or a measured field Core Web Vitals score.
## Content and publication

The hub includes features, development status, roadmap, releases/downloads,
learning paths, AI direction, community, support, contribution guidance, FAQ,
project news, an evidence-linked Scarp ecosystem directory at `/ecosystem/`,
a source-verified compatibility guide at `/compatibility/`, an evidence-linked
published CLI migration guide at `/migration/` (alpha.1–alpha.5), and a local,
privacy-friendly site search at `/search/`.
Search also works as a complete page directory without JavaScript; with JavaScript,
it supports live filtering, curated Hindi search terms for English-language website
pages, clear and Escape interactions, concise screen-reader result announcements,
URL restoration during browser navigation, and the `/` or Ctrl/⌘+K shortcut
(outside editable controls). It is a **reviewed snapshot**, not a live compiler feed.
The featured website programs keep their older verified compiler baseline,
and the same three homepage fixtures also run under the pinned alpha.6 compiler
with byte-exact expected output. Published-only RMS, Top-K and
temperature-softmax fixtures, plus schema-v1 symbol/reference inspection
outputs, are checked only against the latest published compiler. The two compiler sources and distinct CLI
commands are tested in both CI and the Pages workflow. The compatibility page
does **not** promise that all user programs work across versions. The Downloads and Releases pages show the reviewed published
**v0.0.6-alpha.4** prerelease, released on 8 November 2026, with exact
GitHub archive digests. The earlier alpha.6.2 announcement remains an
independently pinned historical article. The ecosystem page independently records project
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

The Pages artifact explicitly includes hidden files, retaining `public/.nojekyll`;
generated-site validation fails if that marker disappears. Keep
`include-hidden-files: true` when updating `actions/upload-pages-artifact`
(v4 and later exclude leading-dot files by default).

GitHub Actions validates PRs and deploys `dist/` from main to GitHub Pages after
checks and the pinned Scarp example tests pass. No custom domain is configured.
The main site uses `/`; the independent documentation site uses `/scarp-docs/`.
See [CONTRIBUTING.md](CONTRIBUTING.md) for source and evidence conventions.

## Live deployment verification

The build emits a small `/deployment.json` containing the Git commit SHA
(when built in GitHub Actions) and the reviewed Scarp compiler tag. This is
public build provenance, not a live release feed; local builds use a null commit.

After `deploy-pages` completes, the deployment job uses Node.js 26 to
re-check the **live** root, downloads, support, `project.json`, and
`deployment.json`. It verifies the exact deployed commit and release tag,
retrying briefly for GitHub Pages CDN propagation. The workflow fails if
publication succeeds but these public endpoints remain stale or broken.

`npm run test:deploy-smoke` tests the probe offline, including a stale CDN,
missing routes, invalid marker, and release drift. `npm run check` includes
these tests; it does **not** make network requests.

## Accessibility and frontend size safeguards

Generated HTML is checked for a single H1, a keyboard-focusable skip-to-content
destination, labelled navigation, resolved ARIA references, labelled form
controls, explicit button types, and image descriptions/dimensions. The
offscreen footer logo loads lazily with async decoding, while the header logo
remains eager. Header search, theme and mobile-menu controls use minimum
44-pixel tap targets.

Generated JavaScript and CSS assets also have a per-file 128 KiB limit to
catch accidental build bloat. This is a **static regression audit**, not a
substitute for screen-reader testing, real mobile-device checks, browser
interaction tests or field Core Web Vitals measurements.

## Optimized display logo

The header/footer reuse a faithful **512 × 512 WebP** version of the approved
Scarp logo (`public/brand/scarp-logo.webp`, 13,250 bytes). The original
1,136,676-byte `scarp-logo.png` remains intact for social previews and
source artwork. The WebP uses about **98.8% fewer bytes** than that original
when a browser loads the logo. The browser never needs the large PNG just
to render the header or footer.

To recreate the optimized display asset from the original using the WebP
reference encoder:

```sh
cwebp -quiet -resize 512 512 -q 90 -m 6 -metadata none \
  public/brand/scarp-logo.png -o public/brand/scarp-logo.webp
```

The generated-site audit requires the WebP asset to be genuine, between
1 KiB and 32 KiB, and referenced on each page. This is an asset-size
reduction, not a measured Core Web Vitals improvement.

## Compact favicons

The site uses a **5,046-byte** 64 × 64 PNG favicon and supplies a
**15,086-byte** root `favicon.ico` for browsers and clients that request
it directly. Both are derived from the original Scarp S mark using the same
crop displayed in the header, without redrawing the logo.

These replace the previous 1,136,676-byte source PNG as the browser-tab
icon. Generated-site validation checks signatures, dimensions and file
budgets. The original PNG remains unchanged for social metadata.

## Branding and licenses

`public/brand/scarp-logo.png` is the permanent blue geometric S and wordmark.
Navigation displays the icon area through CSS while preserving the original image.

Website: [MIT](LICENSE). Scarp implementation:
[Apache-2.0](https://github.com/scarp-lang/scarp/blob/main/LICENSE).
