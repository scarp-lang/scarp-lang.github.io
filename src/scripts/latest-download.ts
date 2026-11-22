import { fetchLatestDownload, githubReleasesUrl, isLatestPlatform } from "../data/latest-download.ts";

/** Progressive enhancement: no navigation until the exact official asset is verified. */
export function enhanceLatestDownload(): void {
  const root = document.querySelector<HTMLElement>("[data-latest-download]");
  if (!root) return;
  const platform = root.getAttribute("data-latest-download");
  if (!isLatestPlatform(platform)) return;

  const status = root.querySelector<HTMLElement>("[data-latest-status]");
  const releaseLink = root.querySelector<HTMLAnchorElement>("[data-latest-release]");
  const setStatus = (message: string) => { if (status) status.textContent = message; };

  void (async () => {
    try {
      const result = await fetchLatestDownload(platform);
      if (result.kind === "ready") {
        if (releaseLink) releaseLink.href = result.releaseUrl;
        setStatus(`Found Scarp ${result.tag}. Opening the official ${platform} archive…`);
        window.location.assign(result.url);
      } else if (result.kind === "missing") {
        if (releaseLink) releaseLink.href = result.releaseUrl;
        setStatus(`The newest release (${result.tag}) has no matching ${platform} archive yet. No older file was downloaded automatically. Check its release page or use the reviewed fallback below.`);
      } else {
        if (releaseLink) releaseLink.href = githubReleasesUrl;
        setStatus("No published Scarp releases were found. Check the official release list or use the reviewed fallback below.");
      }
    } catch {
      setStatus("Could not check GitHub Releases (network error or API limit). Nothing was downloaded automatically. You can open GitHub Releases or use the reviewed fallback below.");
    }
  })();
}
