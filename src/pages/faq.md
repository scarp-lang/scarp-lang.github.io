---
layout: ../layouts/Article.astro
title: A few things to know.
description: Answers about Scarp’s status, installation, language features, and long-term direction.
eyebrow: Frequently asked questions
---

## Is Scarp stable?

The reviewed baseline is **v0.0.5-alpha.1**, an experimental prerelease. Syntax and APIs can change. A stable v1.0.0 date has not been announced.

## Is Scarp a compiler or an interpreter?

The current Rust implementation lexes, parses, resolves, and interprets Scarp programs. It does not generate native code for `.srp` programs. There is no `scarp compile` CLI command.

## Where can I try it?

[Download a package](/downloads/) for Windows x64, Linux x64 GNU, or macOS ARM64, or build from source using Rust and Cargo. Follow the [first-program guide](https://scarp-lang.github.io/scarp-docs/guide/first-program).

## Is there a browser playground?

This website shows runnable CLI examples and their expected output. It does not execute Scarp code in the browser. An interactive execution playground would require a separate runtime integration.

## Can I train AI models with Scarp?

The interpreter has numerical primitives, including vectors, tiles, losses, and explicit loss gradients. It is not a complete model-training framework. Automatic differentiation, GPU execution, and general tensors need further milestones. See the [AI direction](/ai/).

## Does Scarp require manual memory management?

The current interpreter automatically retires inaccessible scope values and exposes execution budgets. It does not ask users to write pointer, ownership, or manual allocation syntax. Budgets do not represent total process memory or a security sandbox. Read the [memory guide](https://scarp-lang.github.io/scarp-docs/language/memory).

## Does `check` only inspect syntax and types?

It also evaluates the selected program path in fresh local storage, without program output. Reachable arithmetic and execution-budget failures can therefore be reported by `check`.

## Where are the detailed docs?

[Scarp Docs](https://scarp-lang.github.io/scarp-docs/) hosts tutorials and reference material in English and [Hindi](https://scarp-lang.github.io/scarp-docs/hi/). This main website hosts project status, releases, news, and the roadmap.

## How is it licensed?

The language implementation is **Apache-2.0**. This website is **MIT**. Both repositories are public.

## How can I help?

[Start with a focused contribution](/contribute/): test a program, improve an explanation, or open a reproducible bug report.
