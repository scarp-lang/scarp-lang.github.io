import assert from "node:assert/strict";
import test from "node:test";
import {
  assertArchiveMatches, assertManifestMatches, assertSidecarMatches,
  digestBytes, parseChecksums, resolvePublishedTag, validatePublicationIndex,
} from "./release-audit-lib.ts";

const sha = "a".repeat(40);
const bytes = new TextEncoder().encode("scarp audit fixture");
const digest = digestBytes(bytes);
const archives = [
  { file: "scarp-windows.zip", hash: digest },
  { file: "scarp-linux.tar.gz", hash: digest },
  { file: "scarp-macos.tar.gz", hash: digest },
];
const snapshot = {
  tag: "v0.0.5-alpha.4",
  publishedAt: "2026-11-03T13:16:44Z",
  sourceCommit: sha,
  release: "https://github.com/scarp-lang/scarp/releases/tag/v0.0.5-alpha.4",
  status: "experimental-prerelease",
};
function asset(name: string) {
  return {
    name,
    size: name.endsWith(".sha256") || name === "SHA256SUMS" ? 128 : bytes.length,
    browser_download_url: "https://github.com/scarp-lang/scarp/releases/download/" +
      snapshot.tag + "/" + name,
  };
}
interface TestRelease {
  tag_name: string;
  published_at: string;
  draft: boolean;
  prerelease?: boolean;
  html_url?: string;
  assets?: ReturnType<typeof asset>[];
}
function upstream(): TestRelease[] {
  return [
    {
      tag_name: snapshot.tag,
      published_at: snapshot.publishedAt,
      html_url: snapshot.release,
      draft: false,
      prerelease: true,
      assets: [
        ...archives.flatMap(archive => [asset(archive.file), asset(archive.file + ".sha256")]),
        asset("SHA256SUMS"),
      ],
    },
    { tag_name: "v0.0.5-alpha.3", published_at: "2026-11-02T14:00:00Z", draft: false },
    { tag_name: "v9-draft", published_at: "2026-11-04T00:00:00Z", draft: true },
  ];
}

test("published release index is complete and ignores unshipped drafts", () => {
  const checked = validatePublicationIndex(upstream(), snapshot, archives);
  assert.equal(checked.size, 7);
  assert(checked.has("SHA256SUMS"));
});

test("a newer published release requires a human website review", () => {
  const changed = upstream();
  changed[1] = { tag_name: "v0.0.5-alpha.5", published_at: "2026-11-04T10:00:00Z", draft: false };
  assert.throws(() => validatePublicationIndex(changed, snapshot, archives), /Published release changed/);
});

test("missing or tampered downloads cannot pass audit metadata", () => {
  const changed = upstream();
  const release = changed[0];
  assert(release?.assets);
  release.assets = release.assets.filter(entry => entry.name !== "SHA256SUMS");
  assert.throws(() => validatePublicationIndex(changed, snapshot, archives), /Missing combined SHA256SUMS/);
  const duplicate = upstream();
  const next = duplicate[0];
  assert(next?.assets);
  next.assets.push(asset("SHA256SUMS"));
  assert.throws(() => validatePublicationIndex(duplicate, snapshot, archives), /Duplicate release asset/);
});

test("tag verification accepts annotated or lightweight commits and rejects moved pins", () => {
  assert.equal(resolvePublishedTag({ object: { type: "tag", sha: "b".repeat(40) } },
    { object: { type: "commit", sha } }), sha);
  assert.equal(resolvePublishedTag({ object: { type: "commit", sha } }, null), sha);
  assert.throws(() => resolvePublishedTag({ object: { type: "tag", sha } }, null), /Annotated tag/);
  assert.throws(() => resolvePublishedTag({ object: { type: "blob", sha } }, null), /commit/);
});

test("combined and per-platform checksums require exact reviewed hashes", () => {
  const manifest = archives.map(item => item.hash + "  " + item.file).join("\n") + "\n";
  assertManifestMatches(manifest, archives);
  assertSidecarMatches(digest + "  " + archives[0]?.file + "\n", archives[0]!);
  assert.equal(parseChecksums(manifest).size, 3);
  assert.throws(() => assertManifestMatches(manifest.replace(digest, "b".repeat(64)), archives), /mismatch/);
  assert.throws(() => assertSidecarMatches(digest + "  wrong-file.zip", archives[0]!), /mismatch/);
  assert.throws(() => parseChecksums(digest + "  a.zip\n" + digest + "  a.zip"), /Duplicate/);
});

test("archive bytes must match both asset metadata size and pinned SHA-256", () => {
  const archive = archives[0]!;
  assertArchiveMatches(bytes, asset(archive.file), archive);
  assert.throws(() => assertArchiveMatches(new TextEncoder().encode("tampered"), asset(archive.file), archive), /size differs/);
  assert.throws(() => assertArchiveMatches(bytes, asset(archive.file), { ...archive, hash: "0".repeat(64) }), /digest differs/);
});
