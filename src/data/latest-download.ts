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
const releasePageSize = 100;
const maxReleasePages = 10;
export const releasesApiUrl = `https://api.github.com/repos/scarp-lang/scarp/releases?per_page=${releasePageSize}`;
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
  if (!isLatestPlatform(platform)) throw new Error("Unsupported download platform");
  const releases = payload.filter((value): value is Record<string, unknown> => {
    if (!isRecord(value) || value.draft !== false ||
        typeof value.tag_name !== "string" ||
        !/^v\d+\.\d+\.\d+(?:-[0-9A-Za-z][0-9A-Za-z.-]*)?$/.test(value.tag_name) ||
        typeof value.published_at !== "string" ||
        !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(value.published_at)) return false;
    const timestamp = Date.parse(value.published_at);
    // Date.parse normalizes impossible calendar dates (e.g. February 30).
    return Number.isFinite(timestamp) &&
      new Date(timestamp).toISOString() === value.published_at.replace(/Z$/, ".000Z");
  }).sort((a, b) => Date.parse(b.published_at as string) - Date.parse(a.published_at as string));
  const release = releases[0];
  if (!release) return { kind: "none" };

  const tag = release.tag_name as string;
  // Equal publication timestamps and duplicate tags are ambiguous. Do not
  // let API ordering determine which binary a permanent URL downloads.
  if (releases.slice(1).some(candidate =>
    candidate.published_at === release.published_at || candidate.tag_name === tag)) {
    throw new Error("Ambiguous latest published Scarp release");
  }
  const releaseUrl = `${githubReleasesUrl}/tag/${tag}`;
  const filename = `scarp-${tag.slice(1)}-${latestDownloadPlatforms[platform].suffix}`;
  const url = `https://github.com/scarp-lang/scarp/releases/download/${tag}/${filename}`;
  const assets = Array.isArray(release.assets) ? release.assets : [];
  const matches = assets.filter(asset => isRecord(asset) && asset.name === filename);
  const candidate = matches[0];
  // A duplicate name is ambiguous even when one entry has the expected URL.
  // Require the complete metadata provided by GitHub for an uploaded asset.
  const found = matches.length === 1 && isRecord(candidate) &&
    candidate.browser_download_url === url && candidate.state === "uploaded" &&
    typeof candidate.size === "number" && Number.isSafeInteger(candidate.size) &&
    candidate.size > 0;
  return found ? { kind: "ready", tag, filename, url, releaseUrl } :
    { kind: "missing", tag, releaseUrl };
}

export async function fetchLatestDownload(
  platform: LatestPlatform,
  fetcher: typeof fetch = fetch,
): Promise<LatestDownloadResolution> {
  if (!isLatestPlatform(platform)) throw new Error("Unsupported download platform");
  // The GitHub catalogue is ordered by creation, not necessarily publication.
  // An old draft can be published after newer-created releases. Read every
  // page before ranking publication dates; never pick from a partial catalogue.
  const signal = AbortSignal.timeout(12_000);
  const releases: unknown[] = [];
  for (let page = 1; page <= maxReleasePages; page++) {
    const url = new URL(releasesApiUrl);
    if (page > 1) url.searchParams.set("page", String(page));
    const response = await fetcher(url.toString(), {
      headers: { Accept: "application/vnd.github+json" },
      cache: "no-store",
      signal,
    });
    if (!response.ok) throw new Error(`Release lookup failed (HTTP ${response.status})`);
    const payload: unknown = await response.json();
    if (!Array.isArray(payload) || payload.length > releasePageSize) {
      throw new Error("Invalid GitHub releases page");
    }
    releases.push(...payload);
    if (payload.length < releasePageSize) return selectLatestDownload(releases, platform);
  }
  throw new Error("Release catalogue exceeds the bounded lookup; visit GitHub Releases directly");
}
