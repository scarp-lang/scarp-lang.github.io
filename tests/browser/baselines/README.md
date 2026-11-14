# Scarp website visual regression references

## Reviewed alpha.10 release snapshots — 14 November 2026

The verified `v0.0.6-alpha.10` compiler release adds a homepage news card,
a full release article, and a searchable directory entry. These changes
increase homepage and search-directory full-page capture heights; the support
page is unchanged.

All four full-page light/dark captures were inspected for visible content,
layout, and mobile overflow. Two independent Chrome CI captures for the same
source commit produced **byte-identical PNG files**, with SHA-256 verification
performed before this change:

- [Feature branch browser run 43583117005](https://github.com/scarp-lang/scarp-lang.github.io/actions/runs/43583117005)
- [PR browser run 43583175020](https://github.com/scarp-lang/scarp-lang.github.io/actions/runs/43583175020)

| Reference PNG | Viewport | Captured page | Reviewed SHA-256 |
| --- | --- | --- | --- |
| `home-desktop-light.png` | 1280 × 800, light | Homepage | `a423d1af283b65c7dac6b549764564bcc03e9cdcffc348f6ed74309719ea5fa2` |
| `home-mobile-dark.png` | 390 × 844, dark | Homepage | `ec20709b7dc0deb248ea7bfbe37607df6468451fbdd76854abd90acba990b7fd` |
| `search-mobile-light.png` | 390 × 844, light | Search directory | `254371ea86fdc67d1717d0bb47fe0e9de6dee7fcccec4219658f255a67473ac6` |
| `support-desktop-dark.png` | 1280 × 800, dark | Support hub (unchanged) | `aa137f21abe266bd89c50b02d494e6bbfe0686d389fe81a482c551b342b5aa0a` |

After reviewing the screenshots, a **temporary branch-specific hash-gated workflow**
refreshes only the three changed references. Remove that workflow before merging.
Ordinary CI never sets `SCARP_UPDATE_VISUAL_BASELINES` and continues to reject
unexpected screenshot changes.

## Review process and historical references

The preceding alpha.6.7 review and hash references remain available in
[the previous snapshot README](https://github.com/scarp-lang/scarp-lang.github.io/blob/154b9c7372ac0d77b3b962c07473e73f1abb84db/tests/browser/baselines/README.md).
Screenshots cover the entire page, so their heights can exceed the viewport.
The browser suite compares decoded RGBA pixels: dimension drift always fails;
more than 0.35% materially changed pixels fails. CI uploads visual diffs and
fresh screenshots for review.

**Do not silently approve changed screenshots.** Every baseline refresh needs
human visual review, repeatable matching hashes, and an explicit reviewed commit.
Temporary refresh tooling must not remain in the production branch.
