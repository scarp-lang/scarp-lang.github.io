# Scarp website visual regression references

## Reviewed v0.0.7-alpha.1 release snapshots — 25 November 2026

The alpha.20 and v0.0.7-alpha.1 announcements add two news cards and two
search directory entries relative to the reviewed alpha.19 baseline.
All four captures from [Chrome browser QA run 45643537277](https://github.com/scarp-lang/scarp-lang.github.io/actions/runs/45643537277)
were inspected for placement, wrapping, light/dark layout and mobile readability.
All other 14 browser tests passed in that run. The support snapshot is byte-identical
to the existing reference. The branch-only refresh verifies the exact artifact
SHA-256 digests before copying three images; normal browser QA remains read-only
and its 0.35% pixel threshold and dimension checks are unchanged.

| Reference PNG | Viewport | Snapshot height | Reviewed SHA-256 |
| --- | --- | --- | --- |
| `home-desktop-light.png` | 1280 × 800, light | 8,515px | `7e7060fdcf1d3f739b724645b7850155fb6865955e4531f306ec730651b82f10` |
| `home-mobile-dark.png` | 390 × 844, dark | 14,440px | `58c5033bfbe7f8be1149b4bee517cf55885bf14b532463ded772f1e581b2db7f` |
| `search-mobile-light.png` | 390 × 844, light | 9,984px | `3e6ccfe52af3b25d29f232a1ff766e32902af47b40e150462829ab3540b496cc` |
| `support-desktop-dark.png` | 1280 × 800, dark | 4,549px (unchanged) | `aa137f21abe266bd89c50b02d494e6bbfe0686d389fe81a482c551b342b5aa0a` |

## Reviewed alpha.19 release snapshots — 23 November 2026

The published alpha.19 release adds a first-position news card and a new
search result. This changes the full-page homepage and search screenshot
heights; the support page stays pixel-identical to its prior baseline.
The browser QA generated full-page Chrome images using the established
light/dark viewports and static production build.

The generated captures were inspected for typography, page flow, new release
card placement, dark/light contrast, navigation, and mobile readability.
A single branch-only, commit-message-gated refresh job reproduced **all four
PNG files byte-for-byte against SHA-256 values from that inspected capture**,
committed only the three changed baseline images, and then was removed
before merge. Independent Git blob SHA-1 recomputation confirmed the
commit contains the same bytes as the reviewed artifact.

- [Original reviewed alpha.19 browser screenshots](https://github.com/scarp-lang/scarp-lang.github.io/actions/runs/45140894942)
- [Scoped exact-hash baseline refresh (successful)](https://github.com/scarp-lang/scarp-lang.github.io/actions/runs/45141667422)

| Reference PNG | Viewport | Snapshot height | Reviewed SHA-256 |
| --- | --- | --- | --- |
| `home-desktop-light.png` | 1280 × 800, light | 8,157px | `76ae6b20f5c06e66e23d2834778f3e2e767ee549dd0c6b2911ee2c0592a639e0` |
| `home-mobile-dark.png` | 390 × 844, dark | 13,727px | `5f3919e991ef32f2023fd6680d18ce63fa64f0bbb75eb1154996f200ca7456ed` |
| `search-mobile-light.png` | 390 × 844, light | 9,483px | `23fd8e262351e31c35736076c2088a87acabacb73c73a0b557894309b4f251c8` |
| `support-desktop-dark.png` | 1280 × 800, dark | 4,549px (unchanged) | `aa137f21abe266bd89c50b02d494e6bbfe0686d389fe81a482c551b342b5aa0a` |

No visual threshold was relaxed. Normal browser validation remains
**read-only**, with dimension drift rejected and a maximum of 0.35% materially
changed pixels. The temporary job used to regenerate approved images
must not be included in production workflows.

## Earlier reviewed alpha.18 snapshots — 22 November 2026

The published alpha.18 release adds one first-position news card to the home
page and a matching entry to the searchable site directory. Consequently,
the homepage (desktop light / mobile dark) and mobile search screenshots are
intentionally taller. The support page layout is unchanged.

Three new PNG captures from the real Chrome browser QA artifacts were inspected
for card placement, readable text, navigation, dark-mode styling, scrollable
layout and horizontal overflow. Exact Git blob SHA-1 identities were checked
against the generated artifact images **after** the scoped baseline-refresh
job committed them, confirming that the reviewed captures and committed PNG
bytes are identical. The regular browser QA workflow remains read-only.

- [Alpha.18 Chrome capture and diffs](https://github.com/scarp-lang/scarp-lang.github.io/actions/runs/45036422249)
- [One-time visual refresh, including Chrome checks](https://github.com/scarp-lang/scarp-lang.github.io/actions/runs/45036903466)

| Reference PNG | Viewport | Snapshot height | Reviewed SHA-256 |
| --- | --- | --- | --- |
| `home-desktop-light.png` | 1280 × 800, light | 8,134px | `0ab188a82ec9687d155b167c583604c96effa27b78356f22281b647e3f399aff` |
| `home-mobile-dark.png` | 390 × 844, dark | 13,375px | `eadda2c3ad6ffb4dce3f2c39a4806bf62bc85fbcb4af878f7754fe879a444271` |
| `search-mobile-light.png` | 390 × 844, light | 9,200px | `84f31f5029558db1984b4e3924206474436d71a7115438b2cbcfb5579a4422cf` |
| `support-desktop-dark.png` | 1280 × 800, dark | 4,549px (unchanged) | `aa137f21abe266bd89c50b02d494e6bbfe0686d389fe81a482c551b342b5aa0a` |

Full-page visual comparisons continue to reject dimension drift and any
screenshot with more than 0.35% of pixels materially changed. CI never
automatically accepts differences. The temporary write-scoped,
feature-branch-only workflow used for this reviewed refresh was removed
before merge.

## Earlier alpha.17 release snapshots — 21 November 2026

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
