import Article from "../../layouts/Article.tsx";
import { project } from "../../data/project.ts";

const release = { tag: "v0.0.7-alpha.1", date: "2026-11-25", source: "996bd5b83c8cb26e98637563729f67bdacc61cd4" } as const;

export default function V007Alpha1() {
  return (
    <Article title="Scarp v0.0.7-alpha.1: native loops and numerical operations"
      description="The first v0.0.7 prerelease expands bounded native execution, interpreter frame reuse, arrays and numerical functions."
      eyebrow="Language prerelease · Published source" date={release.date}>
      <p><strong>{release.tag}</strong> was published on 25 November 2026 from{" "}
        <a href={project.repo + "/commit/" + release.source}>{release.source}</a>.</p>
      <h2 id="native">Experimental native integer functions</h2>
      <p>The x86-64 ELF64 Rust API now supports pure integer functions with up to 16 required integer arguments, scalar conditional expressions, counted repeats and nested loop control. Bounded execution tracks work and preserves source byte spans for diagnostics.</p>
      <p>The ABI is provisional. General native function calls, executable linking and a native compilation CLI are outside this release. <code>scarp exec</code> still runs through the interpreter.</p>
      <h2 id="memory">Interpreter frame reuse</h2>
      <p>Ordinary calls can reuse one bounded set of frame buffers. Returned immutable values remain valid across later calls. This is not a guarantee of unbounded allocation or complete native memory management.</p>
      <h2 id="numerics">Arrays and numerical operations</h2>
      <p><code>array_concat</code> joins fixed-size arrays with matching element types and infers the result length. <code>integer_gcd</code>, its alias <code>integer_hcf</code> and <code>integer_lcm</code> accept 2–1024 integers. Vector <code>softplus</code> computes stable results for finite inputs.</p>
      <h2 id="cache">Rust host cache controls</h2>
      <p>Hosts can adjust token-cache limits while the cache runs. Eviction follows insertion order and previously compiled snapshots remain valid.</p>
      <h2 id="projects">Project execution</h2>
      <p>Use <code>scarp exec</code> in the project directory. Console input is bounded; new projects use <code>scarp.project</code> and existing <code>Scarp.project</code> files remain supported.</p>
      <h2 id="evidence">Release evidence</h2>
      <p>See the <a href={project.repo + "/releases/tag/" + release.tag}>official release and seven assets</a>, <a href="/downloads/">downloads and checksums</a>, and <a href="/compatibility/">website fixture coverage</a>. The earlier <a href="/news/alpha20-native-decimal-tuples/">alpha.20 article</a> remains available as a historical snapshot.</p>
    </Article>
  );
}
