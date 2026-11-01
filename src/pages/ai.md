---
layout: ../layouts/Article.astro
title: A numerical foundation. An AI ambition.
description: Where Scarp’s AI development direction stands today, and what still needs to be built.
eyebrow: AI development
---

## The direction

Scarp’s long-term ambition is to make AI development more approachable through the language and its developer tools. That ambition guides exploration; it is not a claim of a finished AI ecosystem or a measured advantage over another language.

## Available today

The published **v0.0.5-alpha.1** interpreter includes finite binary64 values, immutable numerical vectors, and two-axis tiles. Numerical operations cover compensated reductions, scaled norms, softmax, log-space operations, matrix products, categorical losses, one-hot targets, and explicit loss gradients.

Read the [numerical guide](https://scarp-lang.github.io/scarp-docs/language/numerics) and the compiler’s [tile reference](https://github.com/scarp-lang/scarp/blob/afe8b5380c9d6c4774162e51c6c9bc8b90901671/docs/tiles.md).

## What that enables

You can explore small numerical programs, combine operations inside typed functions, and organize source across modules. Runtime quotas bound selected execution and numerical allocation resources.

These are interpreter primitives. Explicit loss gradients do not constitute an automatic differentiation engine.

## Future milestones

General tensors, automatic differentiation, GPU backends, native compilation, and domain libraries need separate integration decisions and implementation work. A full model-training framework is not part of the published release.

There are no published speed comparisons with Python, C++, or Rust, and no advertised model-training performance results.

[Follow the roadmap →](/roadmap/) · [Discuss a numerical use case →](https://github.com/scarp-lang/scarp/issues)
