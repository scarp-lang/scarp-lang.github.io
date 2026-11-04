import type { PublishedDownload } from "./releases.ts";

/** Commands are derived from the reviewed artifact metadata, never hand-copied. */
export function checksumCommand(item: PublishedDownload): string {
  switch (item.platform) {
    case "windows":
      return [
        "$hash = (Get-FileHash -Algorithm SHA256 -Path '.\\\\" + item.file + "').Hash",
        "if ($hash -eq '" + item.hash + "') { 'Checksum OK' } else { throw 'Checksum mismatch: do not run this archive' }",
      ].join("\n");
    case "linux":
      return "sha256sum --check '" + item.file + ".sha256'";
    case "macos":
      return "shasum -a 256 --check '" + item.file + ".sha256'";
  }
}
