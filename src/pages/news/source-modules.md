---
layout: ../../layouts/Article.astro
title: Source modules arrive in v0.0.5-alpha.1
description: Relative imports, explicit exports, and a published three-platform prerelease.
eyebrow: Language release
date: '2026-11-01'
---

The published **v0.0.5-alpha.1** milestone introduces source modules: relative `.srp` imports, explicit aliases, public functions and scalar literal constants, cycle diagnostics, and bounded source graphs.

The release builds on the existing functions, numerical runtime, tiles, and execution budgets. Packages are available for Windows x64 MSVC, Linux x64 GNU, and macOS ARM64.

## Start with a multi-file example

The package includes examples. Follow the [module guide](https://scarp-lang.github.io/scarp-docs/language/modules) and the compiler’s [three-file example](https://github.com/scarp-lang/scarp/blob/afe8b5380c9d6c4774162e51c6c9bc8b90901671/examples/module_demo.srp).

## Keep the alpha context

This is an experimental prerelease. Modules do not yet include runtime globals or re-exports, and Scarp remains an interpreter. Read the [current state](/development/) for the wider set of limits.

[Download the release →](/downloads/)

Sources: [published release](https://github.com/scarp-lang/scarp/releases/tag/v0.0.5-alpha.1) · [publication verification](https://github.com/scarp-lang/scarp/blob/1d3b69a79bb0f656b4da3517560ce59e1e41f3bc/docs/releases/v0.0.5-alpha.1-validation.md).
