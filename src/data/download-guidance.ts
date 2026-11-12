import type { PublishedDownload } from "./releases.ts";

/**
 * All platforms verify downloads against the exact reviewed digest in
 * releases.ts. Matching a separately downloaded sidecar alone does not prove
 * the archive matches the checksum pinned by this website.
 */
export function checksumCommand(
  item: { platform: PublishedDownload["platform"]; file: string; hash: string },
): string {
  // These values enter shell snippets. Reject metacharacters, traversal,
  // interpolation, and invalid digest metadata even if data provenance changes.
  if (!/^[a-f0-9]{64}$/.test(item.hash) ||
      !/^[A-Za-z0-9][A-Za-z0-9._-]*\.(?:zip|tar\.gz)$/.test(item.file)) {
    throw new Error("Unsafe or malformed published archive metadata");
  }
  switch (item.platform) {
    case "windows":
      return [
        "$hash = (Get-FileHash -Algorithm SHA256 -Path '.\\" + item.file + "').Hash",
        "if ($hash -eq '" + item.hash + "') { 'Checksum OK' } else { throw 'Checksum mismatch: do not run this archive' }",
      ].join("\n");
    case "linux":
      return "printf '%s\\n' '" + item.hash + "  " + item.file + "' | sha256sum --check -";
    case "macos":
      return "printf '%s\\n' '" + item.hash + "  " + item.file + "' | shasum -a 256 --check -";
  }
}
