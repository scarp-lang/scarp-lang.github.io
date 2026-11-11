# Scarp website visual regression references

## Reviewed alpha.6.7 release snapshots — 11 November 2026

The published Scarp `v0.0.6-alpha.7` announcement adds one homepage news
card, one full-page article, and one item to the searchable directory. The
additional content increases the homepage and search result page heights.
The support page is unchanged and retains its previous approved reference.

All four full-page captures were inspected before approving these changes.
The **three changed captures** from two independent CI runs at the same source
commit were compared byte-for-byte and had identical SHA-256 digests:

- [PR browser run 43026866779](https://github.com/scarp-lang/scarp-lang.github.io/actions/runs/43026866779)
- [Push browser run 43026854671](https://github.com/scarp-lang/scarp-lang.github.io/actions/runs/43026854671)

The updated reference images were committed only after the temporary,
branch-specific baseline refresh job verified the exact reviewed SHA-256 hashes.
That temporary workflow must be removed from the branch before merging.

| Reference PNG | Viewport | Captured page | Approved SHA-256 |
| --- | --- | --- | --- |
| `home-desktop-light.png` | 1280 × 800, light | Homepage | `d60c847707ba9cc6da98ac63204ce10fb3aa6401b14361ed3eb6cfe02ec72a6e` |
| `home-mobile-dark.png` | 390 × 844, dark | Homepage | `24a88727d7a3fe71e52014530bc4f0d8cc41a9fa90b57d50621c13909ddb3c53` |
| `search-mobile-light.png` | 390 × 844, light | Search directory | `c45c2949d3e92e6a709645804d2ecae1c40356910d68322253a6390b4c25a9ce` |
| `support-desktop-dark.png` | 1280 × 800, dark | Support hub (unchanged reference) | `aa137f21abe266bd89c50b02d494e6bbfe0686d389fe81a482c551b342b5aa0a` |

## Review process and historical references

The preceding alpha.6.3 visual references were reviewed in
[runs 42385476100](https://github.com/scarp-lang/scarp-lang.github.io/actions/runs/42385476100)
and [42385531877](https://github.com/scarp-lang/scarp-lang.github.io/actions/runs/42385531877).
Their review and full set of hashes remain in
[commit a8fb15be](https://github.com/scarp-lang/scarp-lang.github.io/tree/a8fb15bec692297ae5020d2b0633d6993edbf547/tests/browser/baselines).

Screenshots are full-page captures (height can exceed the viewport).
The browser suite compares RGBA pixels after PNG decoding: any dimension drift
fails, and more than 0.35% materially changed pixels fails. Failing GitHub
Actions runs attach diff images and new screenshots for manual inspection.

**Recurring CI must never silently approve screenshots.** Each new change
requires visual inspection, repeatability evidence, a temporary hash-gated
branch-specific refresh job, and explicit committed reference PNGs. Remove
that one-time workflow before merging so future changes continue to fail
until reviewed.

These are production website visual regression references, not guarantees of
identical rendering across every browser and operating system.
