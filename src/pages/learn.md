---
layout: ../layouts/Article.astro
title: A small start. A new language.
description: Choose a learning path and write your first Scarp program.
eyebrow: Learn Scarp
---

## 01 · Get the interpreter

[Download the published alpha](/downloads/) for Windows x64, Linux x64 GNU, or macOS ARM64. Follow the [installation guide](https://scarp-lang.github.io/scarp-docs/guide/installation) to verify and extract the package, or build it from source with Rust.

## 02 · Write your first program

Save the following as `hello.srp`:

```text
print("Hello from Scarp!");
```

From the extracted interpreter’s directory, run:

```sh
./scarp run hello.srp
```

On Windows PowerShell, use `./scarp.exe` in place of `./scarp`. This prints `Hello from Scarp!` followed by a newline. The [first-program guide](https://scarp-lang.github.io/scarp-docs/guide/first-program) explains each part.

## 03 · Follow a path

| Your starting point | Read next |
| --- | --- |
| New to Scarp | [Introduction](https://scarp-lang.github.io/scarp-docs/guide/introduction) |
| Learning the syntax | [Language overview](https://scarp-lang.github.io/scarp-docs/language/overview) |
| Exploring functions | [Typed functions](https://scarp-lang.github.io/scarp-docs/language/functions) |
| Interested in numerical work | [Numerics](https://scarp-lang.github.io/scarp-docs/language/numerics) |
| Organizing several files | [Source modules](https://scarp-lang.github.io/scarp-docs/language/modules) |
| Prefer Hindi | [हिंदी दस्तावेज़](https://scarp-lang.github.io/scarp-docs/hi/) |

## The website and the documentation

This project hub introduces Scarp, tracks its published state, and explains the direction ahead. **Scarp Docs** contains the detailed tutorials, references, and troubleshooting guides. Both are official projects in the [scarp-lang organization](https://github.com/scarp-lang).

Examples here target **v0.0.5-alpha.1**. Read the [current limitations](/development/) alongside the guides.
