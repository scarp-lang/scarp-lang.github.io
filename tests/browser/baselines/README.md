# Scarp website visual regression references

The `v0.0.6-alpha.3` website screenshots were reviewed after release
content and the search directory gained their new pages. Visual artifacts from
[run 42385476100](https://github.com/scarp-lang/scarp-lang.github.io/actions/runs/42385476100)
and [run 42385531877](https://github.com/scarp-lang/scarp-lang.github.io/actions/runs/42385531877)
were compared byte-for-byte and produced **identical SHA-256 values** for all
four screenshots. The homepage and search page grew in height from the added
release announcement; the support screenshot is pixel-identical to the
previously approved reference. Review used the complete new rendered
screenshots rather than disabling image comparison.

- `home-desktop-light.png`: 1280 × 800 viewport, light theme, homepage.
- `home-mobile-dark.png`: 390 × 844 viewport, dark theme, homepage.
- `search-mobile-light.png`: 390 × 844 viewport, light theme, search page.
- `support-desktop-dark.png`: 1280 × 800 viewport, dark theme, support page.

Approved alpha.6.3 screenshot SHA-256 values:

```text
a6193a8dae9b8e58b36f089a1ae6288508d7e09866e5c37b1e810301adb19257  home-desktop-light.png
282ab9a5900fb4ad3c5616c166b1ebeac1a64c2ff8edcbab03d563c1be8e85bf  home-mobile-dark.png
d1b256720892af02396c7a29cc5b1627fcc29459a67569a31c3a528469529ebc  search-mobile-light.png
aa137f21abe266bd89c50b02d494e6bbfe0686d389fe81a482c551b342b5aa0a  support-desktop-dark.png
```

The previous alpha.6.2 review is retained in
[commit 51dcc4740f96efde176a100223eb1f11c196f98f](https://github.com/scarp-lang/scarp-lang.github.io/tree/51dcc4740f96efde176a100223eb1f11c196f98f/tests/browser/baselines).

Screenshots are full-page captures (height can exceed the viewport). The
browser tests compare actual RGBA pixels after PNG decoding. Any dimension
drift fails; more than 0.35% materially changed pixels fails. Diff images
are attached to failing GitHub Actions jobs for manual review.

Baseline PNGs must never be silently approved by recurring CI. For the reviewed
release, the four images were manually reviewed, checked for exact
repeatability, and explicitly committed through a **temporary,
hash-gated, branch-specific** GitHub Actions job. That one-time workflow is
removed before merging the website update. Future changes require another
manual review and explicit committed references.

These are reference images of the production website, not guarantees of
exact rendering in every browser or platform.
