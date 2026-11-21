# Scarp website visual regression references

## Reviewed alpha.17 release snapshots — 21 November 2026

The verified Scarp alpha.17 website synchronization adds two historical
release articles (alpha.16 and alpha.17), two new home news cards, and two
search-directory entries. The homepage and search full-page screenshots
grow; the support page does not change. This is an expected content change,
not an unreviewed relaxation of screenshot comparison rules.

Four light/dark PNGs were visually inspected for readable text, card
alignment, navigation, mobile overflow and asset loading. Two independent
Chrome runs of exactly the same website commit yielded **byte-identical**
PNG files in all four viewports:

- [Browser run 44890833493](https://github.com/scarp-lang/scarp-lang.github.io/actions/runs/44890833493)
- [Browser run 44890846407](https://github.com/scarp-lang/scarp-lang.github.io/actions/runs/44890846407)

Both runs evaluated commit \`f5bf2d0040b84f6e00ad53edc069f088859d8ab6\`.
The comparison included all images, not just the three that changed height.
Capture file hashes were independently verified from both artifact archives
before refreshing these baselines.

| Reference PNG | Viewport | Captured page | Reviewed SHA-256 |
| --- | --- | --- | --- |
| \`home-desktop-light.png\` | 1280 × 800, light | Homepage | \`1196fa9057a9aea9b3817cefded50d419c3d7e89f7edcfbe7b63dcb21c507342\` |
| \`home-mobile-dark.png\` | 390 × 844, dark | Homepage | \`f64d37704fccaa7f32b368f1f79524a7059598ca1f2cafcdb15450f12a00da51\` |
| \`search-mobile-light.png\` | 390 × 844, light | Search directory | \`f756da4100c7e7bd99048ee1caf4144243f6dca55be2221c27df4b8ec215c3d9\` |
| \`support-desktop-dark.png\` | 1280 × 800, dark | Support hub (unchanged) | \`aa137f21abe266bd89c50b02d494e6bbfe0686d389fe81a482c551b342b5aa0a\` |

## Review process and history

The previous alpha.15 review remains available in
[the earlier baseline README](https://github.com/scarp-lang/scarp-lang.github.io/blob/30458005875b8275954afb74de7a8b77d16661f8/tests/browser/baselines/README.md).

Screenshots are full-page and can exceed viewport height. Browser QA still
fails on dimensions and rejects more than 0.35% materially changed pixels.
It uploads fresh screenshots and diffs for independent review.

**Never silently approve future screenshot changes.** The alpha.17 PNG
refresh is a one-off, short-lived branch-only workflow that regenerates the
already-reviewed four PNGs and removes itself in its own commit. Normal
validation and deployment remain read-only and do not auto-accept drift.
