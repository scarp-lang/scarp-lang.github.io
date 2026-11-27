import Base from "../layouts/Base.tsx";
import { project, sourceUrl, verification } from "../data/project";
import { publishedCompiler } from "../data/releases.ts";
import { formatNewsDate } from "../lib/date.ts";

export default function DevelopmentPage() {
  return (
    <Base
      title="Development"
      description="An evidence-backed snapshot of Scarp development: published alpha capabilities, limitations, source baseline, and next priorities."
    >
      <section className="wrap page-heading">
        <p className="eyebrow">Current development state</p>
        <h1>
          A clear view
          <br />
          of where we are.
        </h1>
        <p className="lead">
          An experimental language, developed in public. This page documents
          the website's historical example baseline as of{" "}
          <time dateTime={project.reviewed}>{formatNewsDate(project.reviewed)}</time>;{" "}
          <a href={publishedCompiler.release}>{publishedCompiler.tag}</a> is the
          newest reviewed public prerelease as of{" "}
          <time dateTime={publishedCompiler.reviewed}>{formatNewsDate(publishedCompiler.reviewed)}</time>.
        </p>
      </section>
      <section className="wrap status-summary">
        <div>
          <span className="eyebrow">Verified website example baseline</span>
          <h2>v{project.version}</h2>
          <p>Source modules · Experimental prerelease</p>
        </div>
        <div>
          <a className="button primary" href={project.release}>
            Release notes ↗
          </a>
          <a className="inline-link" href={verification}>
            Verification record ↗
          </a>
        </div>
      </section>
      <section className="wrap section prose">
        <h2>What you can use</h2>
        <p>
          The current public <a href={publishedCompiler.release}>{publishedCompiler.tag}</a>
          adds bounded generic functions, contextual inference, generic Option and Result payloads, bounded string operators and raw and multiline literals. The experimental native integer backend supports concrete integer specializations and flat fixed arrays, tuples and records as private stack locals. Alpha.2 introduced the native-object CLI for relocatable x86-64 ELF64 objects; alpha.1 introduced bounded native loops, reusable interpreter frames and additional numerical operations. Alpha.20 added decimal literals, tuple operations and canonical lowercase project scaffolding; alpha.19 introduced checked host handles;
          alpha.15 bounded CLI inspections and expanded checked shift kernels.
          Alpha.14 previously improved nested pattern diagnostics, editor cache
          quotas and checked arithmetic; alpha.13 added workspace-safe
          snapshots, alpha.12 typed aggregates, alpha.11 exact decimals and
          alpha.10 interactive input. Numerical ranking, symbol inspection and
          project tests remain. Read the
          {" "}<a href="/news/v007-alpha3-generics-native/">v0.0.7-alpha.3 overview</a>,
          {" "}<a href="/news/v007-alpha1-native-loops/">historical alpha.1 overview</a>,
          {" "}<a href="/releases/">release comparison</a> or
          {" "}<a href="/downloads/">current packages</a>.
          Source execution remains interpreter-backed, and Rust embedding
          APIs are not a bundled LSP or general native compiler.
        </p>
        <p>
          The published interpreter includes scalar values, typed functions and
          contracts, control flow, numerical vectors and tiles, relative source
          modules, explicit output streams, and execution budgets. Windows x64,
          Linux x64 GNU, and macOS ARM64 packages are published for the
          current prerelease. Homepage examples separately retain their
          historical verified baseline.
        </p>
        <h2>What “alpha” means</h2>
        <p>
          Syntax, library APIs, diagnostics, and runtime behavior can change.
          Try small programs, keep the version with your examples, and report
          reproducible problems. A prerelease is not a stable compatibility
          promise.
        </p>
        <h2>Known limitations</h2>
        <ul>
          <li>
            Ordinary program execution is interpreted. The experimental native-object
            command emits restricted x86-64 ELF64 relocatable objects, not executables.
          </li>
          <li>
            Source imports are bounded and relative. Runtime module globals and
            re-exports need further milestones.
          </li>
          <li>
            The latest published interpreter supports bounded records, variants, lists and maps; native backend support for aggregates remains limited. Bounded user-defined generic functions are available; unrestricted generic types, a broad standard library and package manager are not established.
          </li>
          <li>
            There is no general tensor engine, automatic differentiation, or GPU
            backend.
          </li>
          <li>
            The interpreter reports the first error. Execution limits bound
            selected resources rather than total process RAM.
          </li>
          <li>
            <code>check</code> evaluates the selected program path without
            output. It is not a purely static type checker.
          </li>
        </ul>
        <h2 id="systems-programming">Systems programming: evidence and direction</h2>
        <p>
          Scarp aims to grow toward low-level and systems programming, including
          eventual operating-system and kernel research. This is a development
          direction, not a claim that an operating system can already be built
          with the published compiler. The evidence below is limited to{" "}
          <a href={publishedCompiler.release}>{publishedCompiler.tag}</a>.
        </p>
        <h3>Experimental foundations available today</h3>
        <ul>
          <li>Checked signed integer arithmetic and bitwise operations, with
            explicit failure reporting in the experimental native kernel API.</li>
          <li>Compiler-owned x86-64 ELF64 relocatable object emission for a
            restricted integer subset through Rust host APIs and native-object;
            bounded calls, loops and private flat aggregate locals are supported.</li>
          <li>Lifetime scope retirement and immutable shared storage in the
            interpreter, with bounded reuse of completed function frame buffers.</li>
        </ul>
        <p>
          See the pinned{" "}
          <a href={`${project.repo}/blob/${publishedCompiler.sourceCommit}/docs/native-elf64.md`}>native object design</a>
          {" "}and{" "}
          <a href={`${project.repo}/blob/${publishedCompiler.sourceCommit}/docs/memory-lifetimes.md`}>Lifetime design</a>.
          The native object API targets x86-64 ELF64 even when the compiler runs
          on Windows or macOS. It is not a portable executable toolchain.
        </p>
        <h3>Proposed engineering gates for kernel development</h3>
        <ol>
          <li>Specify fixed-width integers, addressable memory and explicit
            layout/alignment rules with independently tested ABI contracts.</li>
          <li>Define a freestanding target model, native calls, relocations,
            linking and runtime-independent entry points.</li>
          <li>Define safe boundaries for external pointers, allocation,
            volatile access and hardware-facing operations.</li>
          <li>Qualify an isolated emulator-based boot demonstration with
            reproducible builds, diagnostics and documented target limits.</li>
        </ol>
        <p>
          None of these proposed gates is a shipped feature or a promised
          release date. In particular, there is no supported kernel-build CLI,
          general native executable linking or complete native memory manager.
          <code>scarp exec</code> continues to use the interpreter. Work budgets
          are not wall-clock guarantees, total memory limits or a security sandbox.
        </p>
        <h2>Next development priorities</h2>
        <p>
          Read-only symbol navigation and constant-expression work have
          progressed beyond the original alpha.1 baseline. Further editor
          integration, an integrated language server, language conformance
          and expanded generic coverage require separate implementation and tests.
          Alpha.13 provides workspace-aware editor snapshot primitives, not an
          end-to-end editor server.{" "}
          <a href="/roadmap/">Explore the longer path toward v1.0.0</a>.
        </p>
        <h2 id="evidence">Evidence and freshness</h2>
        <p>
          This website uses a reviewed snapshot. It makes no live claim about
          unmerged branches or unpublished work. The compiler repository and
          release record are authoritative when development moves ahead.
        </p>
        <dl className="evidence-list">
          <dt>Verified example version</dt>
          <dd>
            <a href={project.release}>{project.tag}</a>
          </dd>
          <dt>Newest reviewed public release</dt>
          <dd><a href={publishedCompiler.release}>{publishedCompiler.tag}</a></dd>
          <dt>Source commit</dt>
          <dd>
            <a
              className="mono"
              href={`${project.repo}/commit/${project.source}`}
            >
              {project.source}
            </a>
          </dd>
          <dt>Capability reference</dt>
          <dd>
            <a href={sourceUrl("README.md")}>Pinned compiler README ↗</a>
          </dd>
          <dt>Release verification</dt>
          <dd>
            <a href={verification}>Package and publication record ↗</a>
          </dd>
          <dt>Roadmap evidence</dt>
          <dd>
            <a
              href={
                sourceUrl("README.md") + "#prototype-limits-and-planned-roadmap"
              }
            >
              Pinned source roadmap ↗
            </a>
          </dd>
          <dt>Social links</dt>
          <dd>
            <a href="https://github.com/scarp-lang/scarp-docs/blob/e38696bf97ba5b078f3a0802f0be9567aeec9d42/docs/community/social.md">
              Reviewed official account directory ↗
            </a>
          </dd>
          <dt>Machine-readable snapshot</dt>
          <dd>
            <a href="/project.json">project.json ↗</a>
          </dd>
        </dl>
      </section>
    </Base>
  );
}
