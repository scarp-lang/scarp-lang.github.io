import assert from "node:assert/strict";

export interface CompilerSourcePins {
  baseline: string;
  published: string;
}

/**
 * Only change SHA pins attached to the two known scarp-lang/scarp checkouts.
 * Do not touch action versions, third-party checkouts or unrelated YAML.
 */
export function synchronizeCompilerPins(
  workflow: string,
  pins: CompilerSourcePins,
): string {
  for (const [role, sha] of Object.entries(pins)) {
    assert.match(sha, /^[0-9a-f]{40}$/, "Invalid " + role + " release source commit");
  }
  const declared = [...workflow.matchAll(/^[ \t]*repository: scarp-lang\/scarp\r?$/gm)];
  assert.equal(declared.length, 2, "Workflow must declare exactly two Scarp source checkouts");
  const seen = new Set<string>();
  const regex = /(^([ \t]*)repository: scarp-lang\/scarp\r?\n\2ref: )([0-9a-f]{40})(\r?\n\2path: )(\.compiler|\.compiler-published)(?=\r?$)/gm;
  const synced = workflow.replace(regex, (_match, before: string, _indent: string, _oldSha: string, after: string, directory: string) => {
    assert(!seen.has(directory), "Duplicate compiler checkout directory: " + directory);
    seen.add(directory);
    const sha = directory === ".compiler" ? pins.baseline : pins.published;
    return before + sha + after + directory;
  });
  assert(seen.has(".compiler"), "Missing pinned baseline compiler checkout");
  assert(seen.has(".compiler-published"), "Missing pinned published compiler checkout");
  assert.equal(seen.size, 2, "Unexpected extra compiler checkout");
  return synced;
}
