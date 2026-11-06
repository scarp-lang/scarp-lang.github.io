# Scarp website visual regression references

These four full-page PNG screenshots were visually reviewed for the
`v0.0.6-alpha.2` release website update. The approved current images were
captured by GitHub Actions run
[42215258361](https://github.com/scarp-lang/scarp-lang.github.io/actions/runs/42215258361)
from source commit `73956f7cd3a290ee16b85d14f4f07f6cf0be3cf7`.
A separate push run reproduced **identical SHA-256 digests** for every image.

- `home-desktop-light.png`: 1280 × 800 viewport, light theme, homepage.
- `home-mobile-dark.png`: 390 × 844 viewport, dark theme, homepage.
- `search-mobile-light.png`: 390 × 844 viewport, light theme, search page.
- `support-desktop-dark.png`: 1280 × 800 viewport, dark theme, support page.

Approved screenshot SHA-256 values:

```text
cecf1b3828746d460c54d5c3f19a8c9a363675e36b449e6ae2624c4a0677d2c3  home-desktop-light.png
9e83c765a8ba581170a9bbff4df6d2ad93d36275bf1ed57f563466fce3f898ec  home-mobile-dark.png
827059743db09d66061498e338e323af55fe9d2aadc476b2a3193e01b652cd55  search-mobile-light.png
aa137f21abe266bd89c50b02d494e6bbfe0686d389fe81a482c551b342b5aa0a  support-desktop-dark.png
```

Screenshots are full-page captures (height can exceed the viewport). The
browser tests compare actual RGBA pixels after PNG decoding. Any dimension
drift fails; more than 0.35% materially changed pixels fails. Diff images
are attached to failing GitHub Actions jobs for manual review.

Baseline PNGs must never be silently approved by recurring CI. For this
specific release, the four images were manually reviewed, checked for exact
repeatability, and explicitly committed through a **temporary,
hash-gated, branch-specific** GitHub Actions job. That one-time workflow is
removed before merging the website update. Future changes require another
manual review and explicit committed references.

These are reference images of the production website, not guarantees of
exact rendering in every browser or platform.
