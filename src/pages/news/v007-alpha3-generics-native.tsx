import Article from "../../layouts/Article.tsx";
import { project } from "../../data/project.ts";

const release = { tag: "v0.0.7-alpha.3", date: "2026-11-27", source: "44a3bb0a91e67570e46ce058a3f6211f8e5db0f5" } as const;

export default function V007Alpha3() {
  const evidence = project.repo + "/releases/tag/" + release.tag;
  return (
    <Article title="Scarp v0.0.7-alpha.3: generics, strings and native aggregate locals"
      description="Published generic functions, bounded strings and private aggregate locals in the experimental native integer subset."
      eyebrow="Language prerelease · Published source" date={release.date}>
      <p><strong>{release.tag}</strong> was published on 27 November 2026 from{" "}
        <a href={project.repo + "/commit/" + release.source}>{release.source}</a>.</p>
      <h2 id="generics">Bounded generic functions</h2>
      <p>Generic <code>funcra</code> declarations support bounded specialization, explicit type arguments and contextual inference. Generic Option and Result payloads extend the supported function signatures. The experimental native integer entry can call concrete integer specializations.</p>
      <h2 id="strings">String operations and literals</h2>
      <p>Strings support bounded concatenation and repetition, raw literals and multiline literals. These are interpreter capabilities; they do not imply a general native string ABI.</p>
      <h2 id="native">Native object emission and aggregate locals</h2>
      <p>Alpha.2 introduced <code>scarp native-object</code>, an experimental x86-64 ELF64 relocatable object emitter for use with an external linker. Alpha.3 adds private flat fixed-array, tuple and record stack locals with integer or Boolean components, and preserves subscript source spans for bounds errors.</p>
      <p>Checked constant folding retains errors, source spans and work accounting. The existing integer entry calling convention remains in use; this does not establish a general executable toolchain or stable ABI.</p>
      <h2 id="lifetime">Interpreter function completion</h2>
      <p>Function completion retires unneeded values and transfers the result without duplicating ownership for contract evaluation. This is a targeted improvement, not a claim of complete native memory management or a total process-memory bound.</p>
      <h2 id="upgrade">Upgrade and verification</h2>
      <p>Use <code>scarp exec</code> for ordinary interpreted execution and <code>scarp verify</code> for static checks. Review the <a href="/migration/">migration guide</a> and <a href="/compatibility/">website fixture coverage</a>. Download the matching archive and verify its checksum from <a href="/downloads/">Downloads</a>.</p>
      <h2 id="evidence">Published evidence</h2>
      <p>See the <a href={evidence}>official release and archive assets</a>, the <a href={project.repo + "/releases/tag/v0.0.7-alpha.2"}>alpha.2 release notes</a>, and the <a href="/news/v007-alpha1-native-loops/">historical alpha.1 overview</a>. All three releases remain experimental.</p>
    </Article>
  );
}
