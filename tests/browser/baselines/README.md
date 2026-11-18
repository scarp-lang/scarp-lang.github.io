# Scarp website visual regression references

## Reviewed alpha.14 release snapshots — 18 November 2026

The source-verified `v0.0.6-alpha.14` compiler release adds a homepage news
card, an independently routed release article, and a searchable directory entry.
The homepage and search-directory full-page captures are therefore taller than
the previous alpha.13 baselines; the support page's image remains unchanged.

All four full-page light/dark screenshots were visually inspected for readable
content, intact layout and mobile overflow. Two independent Chrome CI captures
for the **same source commit** `a4c29b1354420e854b5883ea62653caa21e83c37`
produced **byte-identical PNG files**, confirmed by SHA-256 comparison:

- [Feature branch browser capture 44324024956](https://github.com/scarp-lang/scarp-lang.github.io/actions/runs/44324024956)
- [Pull request browser capture 44324037820](https://github.com/scarp-lang/scarp-lang.github.io/actions/runs/44324037820)

| Reference PNG | Viewport | Captured page | Reviewed SHA-256 |
| --- | --- | --- | --- |
| `home-desktop-light.png` | 1280 × 800, light | Homepage | `18b8ef8aec5cd24ba443ec50663940f8eeffc470e34a80f2cd58e2c3e3383601` |
| `home-mobile-dark.png` | 390 × 844, dark | Homepage | `54eb8e0b1e574d1f8ff9a6b574983daa3a9aa131864cda7bc10b5c4142b69cf6` |
| `search-mobile-light.png` | 390 × 844, light | Search directory | `0a7576bbdae6f01ee788a6dda3dac566ca8167bc8b7a0329fa75b0433167eb5e` |
| `support-desktop-dark.png` | 1280 × 800, dark | Support hub (unchanged) | `aa137f21abe266bd89c50b02d494e6bbfe0686d389fe81a482c551b342b5aa0a` |

A temporary, branch-scoped workflow imported the PNGs from the identified PR
artifact after verifying its exact source SHA and expected artifact name.
It removed itself in the same snapshot-refresh commit
[`8cd9dc2`](https://github.com/scarp-lang/scarp-lang.github.io/commit/8cd9dc2523628ccb171dd6f538df8fed2637fd60).
The production repository does **not** retain this workflow. Normal browser CI
still rejects visual drift; it never silently regenerates approved baselines.

## Review process and historical references

The preceding alpha.10 screenshot review and its original hash references
remain available in the
[previous baseline README](https://github.com/scarp-lang/scarp-lang.github.io/blob/576f5ff9bcd72091db3d59d825d7e43c306aa7b4/tests/browser/baselines/README.md).
Screenshots cover the entire page, so full-image heights can exceed the viewport.
The browser suite compares decoded RGBA pixels: any dimension drift fails,
and more than 0.35% materially changed pixels fails. CI uploads visual diffs
and fresh screenshots for review.

**Do not silently approve changed screenshots.** Any future baseline refresh
must include reviewed visual evidence, repeatable capture hashes and an explicit
traceable commit. Temporary refresh tooling must not be merged into `main`.
