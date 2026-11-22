/**
 * Unpinned release discovery for permanent platform download URLs.
 * The official downloads guide continues to display independently reviewed hashes.
 */
export const latestDownloadPlatforms = {
  windows: { name: "Windows", architecture: "x64 · MSVC", suffix: "x86_64-pc-windows-msvc.zip" },
  linux: { name: "Linux", architecture: "x64 · GNU", suffix: "x86_64-unknown-linux-gnu.tar.gz" },
  macos: { name: "macOS", architecture: "ARM64 · Apple Silicon", suffix: "aarch64-apple-darwin.tar.gz" },
} as const;

export type LatestPlatform = keyof typeof latestDownloadPlatforms;
export const releasesApiUrl = "https://api.github.com/repos/scarp-lang/scarp/releases?per_page=30";
export const githubReleasesUrl = "https://github.com/scarp-lang/scarp/releases";

export function isLatestPlatform(value: string | null): value is LatestPlatform {
  return value !== null && Object.hasOwn(latestDownloadPlatforms, value);
}

export type LatestDownloadResolution =
  | { kind: "ready"; tag: string; filename: string; url: string; releaseUrl: string }
  | { kind: "missing"; tag: string; releaseUrl: string }
  | { kind: "none" };

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/**
 * Choose the newest *published* release, including prereleases (GitHub's
 * /releases/latest excludes them). Never silently choose an older version when
 * the newest release is missing an archive for the requested architecture.
 * Only navigate to the exact official GitHub release asset URL.
 */
export function selectLatestDownload(payload: unknown, platform: LatestPlatform): LatestDownloadResolution {
  if (!Array.isArray(payload)) throw new Error("GitHub releases response is not an array");
  const releases = payload.filter((value): value is Record<string, unknown> => {
    if (!isRecord(value) || value.draft !== false ||
        typeof value.tag_name !== "string" ||
        !/^v\d+\.\d+\.\d+(?:-[0-9A-Za-z][0-9A-Za-z.-]*)?$/.test(value.tag_name) ||
        typeof value.published_at !== "string" ||
        !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(value.published_at)) return false;
    return Number.isFinite(Date.parse(value.published_at));
  }).sort((a, b) => Date.parse(b.published_at as string) - Date.parse(a.published_at as string));
  const release = releases[0];
  if (!release) return { kind: "none" };

  const tag = release.tag_name as string;
  const releaseUrl = `${githubReleasesUrl}/tag/${tag}`;
  const filename = `scarp-${tag.slice(1)}-${latestDownloadPlatforms[platform].suffix}`;
  const url = `https://github.com/scarp-lang/scarp/releases/download/${tag}/${filename}`;
  const assets = Array.isArray(release.assets) ? release.assets : [];
  const found = assets.some(asset =>
    isRecord(asset) && asset.name === filename &&
    asset.browser_download_url === url &&
    (asset.state === undefined || asset.state === "uploaded") &&
    (asset.size === undefined || (typeof asset.size === "number" && asset.size > 0))
  );
  return found ? { kind: "ready", tag, filename, url, releaseUrl } :
    { kind: "missing", tag, releaseUrl };
}

export async function fetchLatestDownload(
  platform: LatestPlatform,
  fetcher: typeof fetch = fetch,
): Promise<LatestDownloadResolution> {
  const response = await fetcher(releasesApiUrl, {
    headers: { Accept: "application/vnd.github+json" },
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error(`Release lookup failed (HTTP ${response.status})`);
  return selectLatestDownload(await response.json() as unknown, platform);
}
