# Contributing

Use a current Node.js 22 LTS (22.12 or later) and npm. Install with `npm ci`,
develop with `npm run dev`, and validate with `npm run check`.

## Content and evidence

This is the official Scarp project hub. Detailed tutorials live in
[scarp-docs](https://github.com/scarp-lang/scarp-docs). Keep claims tied to a
published release or exact compiler source commit. Distinguish available
capabilities, planned priorities, and longer-term ambition. Do not invent dates,
performance comparisons, completion percentages, accounts, or adoption numbers.

The reviewed baseline and release assets live in `src/data/project.ts`.
When updating that baseline, check upstream publication status, dereference the
release tag, verify asset filenames/digests, update related Markdown and news,
and update both workflow compiler SHAs. Never silently follow compiler `main`.

Pages use shared Astro layouts, TypeScript data, and Markdown. Keep CSS in the
shared stylesheet and avoid duplicating page scaffolding.

## TypeScript conventions

Write application logic, configuration, scripts, and tests in `.ts` files.
Astro component scripts also use TypeScript. Keep written page content in Markdown
and presentation styles in CSS.

`npm run typecheck` checks the Astro/app project and the separate strict Node
tooling project. Node scripts use explicit `.ts` import extensions and erasable
TypeScript syntax, so Node 22.12+ can execute them with the type-stripping flag
provided by the npm commands. Type stripping does not replace type checking.

Keep `src/scripts/theme-init.ts` self-contained: the shared layout serializes its
compiled function into an early head script. `check:site` exercises that actual
generated JavaScript with stored preferences, system preferences, and blocked
local storage.

## Examples

Example `.srp` and `.stdout` files in `src/examples` are used by the rendered
explorer and exact-output runner. Verify changes with the pinned interpreter:

```sh
SCARP_BIN=/absolute/path/to/scarp npm run test:examples
```

CI builds the exact published source commit without external Rust crates and
runs every example through both `run` and `check`.

## Review

Use one focused branch/PR, explain the resulting behavior, and include validation.
Check desktop/mobile layouts, both themes, keyboard navigation, and JavaScript
disabled behavior for interaction work. Keep the original blue S branding.

Website code is MIT licensed. The compiler is independently Apache-2.0 licensed.
