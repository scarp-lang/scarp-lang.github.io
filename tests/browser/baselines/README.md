# Scarp website visual regression references

## Reviewed alpha.15 release snapshots — 19 November 2026

The source-verified `v0.0.6-alpha.15` website sync adds an official
release story, a homepage announcement card and an extra searchable
directory entry. Three full-page screenshots grow in height; the
support hub remains visually and byte-for-byte unchanged.

Four light/dark screenshots were reviewed for layout, readable text,
navigation, mobile overflow and asset loading. The `home-desktop-light`
capture initially exposed a race in full-page lazy-image decoding.
The browser suite now awaits all image decodes before capture.

Two independent Chrome runs of the same rendered website content
produced **byte-identical reviewed PNGs** in all four cases:
- [PR Chrome run 44563198321](https://github.com/scarp-lang/scarp-lang.github.io/actions/runs/44563198321), source `10ef936bd4169c8233f59c711923b3ee27bb3994`
- [PR Chrome run 44564162151](https://github.com/scarp-lang/scarp-lang.github.io/actions/runs/44564162151), source `902431db99de1fae8a73fe5ee452fbc13a2f390a`

The only source change between these captures is a browser-test
image-decoding guard; rendered website code and assets are unchanged.
The second capture is the one imported here. Downloaded artifact
filenames and SHA-256 hashes were checked before replacing any PNG.

| Reference PNG | Viewport | Captured page | Reviewed SHA-256 |
| --- | --- | --- | --- |
| `home-desktop-light.png` | 1280 × 800, light | Homepage | `d714db50986974ba2b10d264ef8fc2a449d845e8bf91f893bff7a481dc4b66d7` |
| `home-mobile-dark.png` | 390 × 844, dark | Homepage | `f005e632cb7f7ce369886f9afef097d03231c272ec07e7e4105b861e708fec12` |
| `search-mobile-light.png` | 390 × 844, light | Search directory | `1dd8921812da74c3f4821b7d083cf3126dbf9d6e5cbcb479295a1059d42a159b` |
| `support-desktop-dark.png` | 1280 × 800, dark | Support hub (unchanged) | `aa137f21abe266bd89c50b02d494e6bbfe0686d389fe81a482c551b342b5aa0a` |

## Review process and history

The preceding alpha.14 screenshot review is preserved in the
[previous baseline README](https://github.com/scarp-lang/scarp-lang.github.io/blob/63d0b29e4372577a3a244904afc2609c69ad8a2d/tests/browser/baselines/README.md).
Screenshots are full-page, so heights can exceed viewport dimensions.
Browser QA compares decoded RGBA pixels, fails on dimensions and
rejects more than 0.35% materially changed pixels. It uploads
visual diffs and fresh images for independent human review.

**Never silently approve future screenshot changes.** Recheck layout,
reproduce capture hashes and document the review before updating
baselines. This import was performed by a short-lived branch-only
workflow that deletes itself in the same commit; the normal CI
remains read-only and never auto-accepts visual changes.
