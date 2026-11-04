# Contributing

Use Node.js 22.12+ and npm. Run `npm ci`, develop with `npm run dev`, and validate
with `npm run check`. `npm run preview` serves the production build.

## TypeScript source

Write pages, components, article content, and shared layouts in `.tsx`; write
logic, configuration, build scripts, and tests in `.ts` or `.tsx` as appropriate.
Use native CSS for presentation and keep static files in `public/`.

Register a new page in `src/site/pages.ts` with its canonical URL and component.
The build and sitemap use that registry. Keep directory/index-file aliases and
not-found behavior consistent. Shared TSX layouts provide metadata, navigation,
and browser entry points. React runs during rendering; browser interactions stay
in `src/scripts/` without React hydration.

`npm run typecheck` covers the app, static renderer, and build, plus a separate
strict Node tooling project. Node-only tools use explicit `.ts` imports and
erasable syntax. The TSX build and rendering tests use the tsx loader.

Keep `src/scripts/theme-init.ts` self-contained: its compiled function is inlined
before first paint. Generated-site validation executes that actual script with
stored/system preferences and blocked local storage. Styles and browser modules
are fingerprinted during the production build.

`src/data/examples.ts` reads fixtures only during build/dev rendering. Browser
modules must not import server-only filesystem or rendering code.

## Content and evidence

This is the official project hub. Detailed tutorials live in
[scarp-docs](https://github.com/scarp-lang/scarp-docs). Tie language claims to a
published release or exact compiler commit. Distinguish available capabilities,
planned priorities, and longer-term ambition. Avoid invented dates, completion
percentages, adoption numbers, or performance comparisons.

The reviewed baseline and assets live in `src/data/project.ts`. A baseline update
must check publication status, dereference the release tag, verify filenames and
digests, update relevant copy, and update both workflows' compiler SHAs. Do not
silently follow compiler main.

## Reviewing new compiler releases

The website intentionally separates the historical example baseline in
`src/data/project.ts` from the latest manually reviewed public release in
`src/data/releases.ts`. Never automatically follow the compiler's `main`
branch, release API, or an unverified development tag.

1. Inspect the **published** GitHub release and its exact annotated tag commit,
   platform archives, individual checksum files and `SHA256SUMS`.
2. Run `npm run audit:release` (or the read-only GitHub Actions release audit)
   to verify the published release, the source SHA and downloaded archive hashes.
   A newer release triggers an **expected audit failure** until it is reviewed.
3. Update the reviewed release snapshot, platform hashes, the compiler entry in
   `src/data/ecosystem.ts`, feature/limitation text, and any relevant news
   article only after checking the new implementation and CLI behavior.
4. Keep the older example baseline unless it is independently revalidated.
   When adding a newer example-compatibility pin, update the exact source
   commits and commands in both `.github/workflows/ci.yml` and
   `.github/workflows/pages.yml`, then run real interpreter tests.
5. Refresh release, ecosystem, compatibility, rendering and site tests. Run
   `npm run check` and wait for PR validation and deployment gates. Do not
   treat a green website build as proof of full language compatibility.

The audit requires public GitHub API and release download access; it is
read-only, requires no additional third-party packages, does not create issues
or PRs, and never changes site files. It is a gate for human review, not an
automatic release updater.

## Examples and validation

The `.srp` and `.stdout` files in `src/examples` feed the rendered explorer and
exact-output runner. Verify changes with the pinned interpreter:

```sh
SCARP_BIN=/absolute/path/to/scarp npm run test:examples
```

CI builds the exact published interpreter source without external Rust crates
and tests each example with both `run` and `check`.

Run `npm run check` before a PR. Interaction changes also need keyboard,
mobile/responsive, light/dark, and no-JavaScript review. Use focused commits and
explain the resulting behavior and validation. Preserve existing URLs, article
dates, original blue S branding, and reviewed source evidence during refactors.

Website code is MIT licensed. The compiler is independently Apache-2.0 licensed.
