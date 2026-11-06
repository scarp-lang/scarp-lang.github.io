# Scarp website visual regression references

These four full-page PNG screenshots were captured by the browser-audit GitHub
Actions run [42160811505](https://github.com/scarp-lang/scarp-lang.github.io/actions/runs/42160811505)
on the deployed and verified official website commit
`5289b95720516de48a747d194d4c14d48d76409c`.

- `home-desktop-light.png`: 1280 × 800 viewport, light theme, homepage.
- `home-mobile-dark.png`: 390 × 844 viewport, dark theme, homepage.
- `search-mobile-light.png`: 390 × 844 viewport, light theme, search page.
- `support-desktop-dark.png`: 1280 × 800 viewport, dark theme, support page.

Screenshots are full-page captures (height can exceed the viewport). The
browser tests compare actual RGBA pixels after PNG decoding. Any dimension
drift fails; more than 0.35% materially changed pixels fails. Diff images
are attached to failing GitHub Actions jobs for manual review.

Baseline PNGs are never updated automatically. Changes require reviewing
the current screenshots and explicitly committing new PNGs. CI renders
with GitHub `ubuntu-24.04` and its Chrome installation.

These are reference images of the production website, not guarantees of
exact rendering in every browser or platform.
