import Article from "../../layouts/Article.tsx";
import { project } from "../../data/project.ts";

const release = { tag: "v0.0.7-alpha.4", date: "2026-11-28", source: "e620bdcb512fbe909b08f1b4cc625865e4cdf339" } as const;

export default function V007Alpha4() {
  const evidence = project.repo + "/releases/tag/" + release.tag;
  return (
    <Article title="Scarp v0.0.7-alpha.4: bounded native recursion and file-backed BigInt"
      description="Bounded native recursion, nested private aggregates, contextual generic inference and experimental file-backed exact arithmetic."
      eyebrow="Language prerelease · Published source" date={release.date}>
      <p><strong>{release.tag}</strong> was published on 28 November 2026 from{" "}
        <a href={project.repo + "/commit/" + release.source}>{release.source}</a>.</p>
      <h2 id="recursion">Bounded native recursion</h2>
      <p>The experimental Rust ELF64 entry API now supports self and mutual recursion with separate work, active-frame and stack limits. Resource exhaustion retains source spans through active frames. These are bounded execution facilities, not a total memory bound or a general security sandbox.</p>
      <h2 id="aggregates">Nested private aggregate locals</h2>
      <p>Bounded native entries and functions can store nested fixed arrays, tuples and records privately in their frames. Each value may contain at most 32 integer or Boolean leaves. The supported subset preserves checked indexing and initializer order. The public native ABI still accepts integer parameters and returns a checked integer result; aggregate parameters and general executable output are not established.</p>
      <h2 id="generics">Contextual generic inference</h2>
      <p>An expected return type can determine an inner generic call while other arguments determine the remaining outer type parameters. This builds on the bounded specialization introduced in the previous release; it is not unrestricted polymorphism.</p>
      <h2 id="bigint">Exact arithmetic and file-backed BigInt</h2>
      <p>New bounded BigInt operations cover number theory, sequences and wider exponents. Decimal output is chunked, and larger digit budgets require explicit opt-in. The experimental <code>scarp bigint</code> command supports file-backed addition, subtraction, one-limb multiplication and checked division with truncated quotient and signed remainder. Work, buffers and staging storage are explicitly limited. This is not a claim of unlimited digit capacity or general disk-backed source values.</p>
      <h2 id="upgrade">Compatibility and upgrade</h2>
      <p><code>scarp exec</code> remains the interpreter entry point. Experimental x86-64 ELF64 objects require an external linker. Linux x64, Windows x64 and Apple Silicon packages are available; Rust 1.74 remains the minimum supported source-build toolchain. Check the <a href="/compatibility/">website fixture coverage</a>, <a href="/migration/">migration guide</a> and <a href="/downloads/">download checksums</a> before switching versions.</p>
      <h2 id="evidence">Published evidence</h2>
      <p>Review the <a href={evidence}>official release notes and assets</a> and the <a href="/news/v007-alpha3-generics-native/">historical alpha.3 overview</a>. Both releases are experimental.</p>
    </Article>
  );
}
