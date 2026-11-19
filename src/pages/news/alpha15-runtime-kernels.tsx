import Article from "../../layouts/Article.tsx";
import { project } from "../../data/project.ts";

/** Historical alpha.15 facts pinned to the official published source. */
const release = {
  tag: "v0.0.6-alpha.15",
  date: "2026-11-19",
  source: "a21b7b6d942bd1ca9abbbbb522f92f9c8e21e281",
} as const;

export default function Alpha15RuntimeKernels() {
  return (
    <Article
      title="Scarp alpha.15: bounded inspections and checked ELF64 shifts"
      description="Scarp v0.0.6-alpha.15 enforces inspection file limits, accounts for equal-length string comparison work, rejects stale cache revisions and extends restricted checked integer ELF64 kernels."
      eyebrow="Language prerelease · Published source"
      date={release.date}
    >
      <p>
        <strong>{release.tag}</strong> was published on 19 November 2026.
        It keeps Scarp source syntax and existing CLI commands while tightening
        resource and revision checks. This is an experimental prerelease,
        not a stable language release.
      </p>
      <h2 id="inspection">Bounded inspection inputs</h2>
      <p>
        <code>scarp inspect tokens</code>, <code>scarp inspect ast</code> and
        the legacy <code>scarp tokens</code> command accept ordinary UTF-8
        files up to 1 MiB. Larger files are rejected before tokenization.
        This is an input limit for these inspections, not a claim that every
        Scarp command or source file shares the same limit.
      </p>
      <h2 id="comparison-budget">String comparison work budgets</h2>
      <p>
        Equality and inequality comparisons of equal-length strings charge
        one execution step per started block of 64 UTF-8 bytes. The rule applies
        both during runtime execution and constant evaluation, including
        cold and warm constant compilation. Programs close to a configured
        work limit can therefore exceed that limit sooner than in alpha.14.
        This is work accounting, not a memory or security sandbox.
      </p>
      <h2 id="revision">Semantic cache revision safety</h2>
      <p>
        For Rust embedding hosts, semantic compilation checks the revisions
        reported by its loader against the requested revisions before reusing
        a cached program. Callers matching <code>CachedCompileError</code>
        exhaustively must handle <code>RevisionMismatch</code>.
        This does not introduce an integrated language server or new
        cache-management CLI switches.
      </p>
      <h2 id="native">Checked shifts in experimental ELF64 kernels</h2>
      <p>
        The experimental checked x86-64 ELF64 integer kernel now supports
        <code> &lt;&lt;</code>, <code> &gt;&gt;</code> and <code> &gt;&gt;&gt;</code>.
        Shift counts outside 0 through 63 produce status 3 and report the
        UTF-8 byte span of the first failing operator. Both kernel APIs
        accept linear sequences of immutable integer bindings, and emitted
        machine-code size is bounded. Rust hosts should recognize
        <code> CHECKED_KERNEL_INVALID_SHIFT</code>.
      </p>
      <p>
        These Rust APIs emit restricted relocatable Linux x86-64 objects,
        not standalone programs or a general native compiler. The Windows x64,
        Linux x64 and macOS Apple Silicon Scarp CLI packages still execute
        source programs with the interpreter.
      </p>
      <h2 id="verification">Evidence and compatibility</h2>
      <p>
        Review the <a href={`${project.repo}/releases/tag/${release.tag}`}>official alpha.15 release</a>
        and <a href={`${project.repo}/commit/${release.source}`}>published source commit</a>.
        The <a href="/compatibility/">website fixture tests</a> cover only
        selected Scarp CLI source programs on Linux CI; they do not verify the
        Rust embedding kernels, cache internals or other release platforms.
        Install packages from <a href="/downloads/">downloads</a> and compare
        their SHA-256 digests to the values pinned on this site.
      </p>
    </Article>
  );
}
