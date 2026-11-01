---
layout: ../layouts/Article.astro
title: Help shape the next step.
description: Practical ways to contribute to the language, its documentation, and this website.
eyebrow: Contribute to Scarp
---

## Start with a small, useful change

Try an example, improve an explanation, or report behavior that differs from the reference. A focused contribution with a reproducible result makes review easier.

| Contribution | Where to begin |
| --- | --- |
| Interpreter bug or language proposal | [scarp issues](https://github.com/scarp-lang/scarp/issues) |
| Language implementation | [Compiler contribution guide](https://github.com/scarp-lang/scarp/blob/main/CONTRIBUTING.md) |
| Tutorial or translation correction | [scarp-docs issues](https://github.com/scarp-lang/scarp-docs/issues) |
| Website copy, accessibility, or interaction | [Website issues](https://github.com/scarp-lang/scarp-lang.github.io/issues) |
| A numerical use case | [Language discussions through issues](https://github.com/scarp-lang/scarp/issues) |

## Write a useful bug report

Include the Scarp version, your operating system and CPU architecture, the smallest `.srp` example that reproduces the issue, the command you ran, the expected behavior, and the actual output or diagnostic. Remove personal information and credentials before posting.

## Work on the website

This website uses **Astro, TypeScript, and Markdown** and deploys to GitHub Pages. Page content belongs in Markdown or shared TypeScript data where practical; reusable Astro layouts provide structure.

```sh
npm ci
npm run check
npm run dev
```

See the [website contribution guide](https://github.com/scarp-lang/scarp-lang.github.io/blob/main/CONTRIBUTING.md). Changes to language claims should link to a pinned source, published release, or reviewed documentation page. Keep future work clearly labeled.

## Licensing

The **website** is MIT licensed. The **Scarp language implementation** is Apache-2.0 licensed. Check the license of the repository you contribute to.
