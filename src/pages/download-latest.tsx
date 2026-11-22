import Base from "../layouts/Base.tsx";
import { latestDownloadPlatforms, type LatestPlatform } from "../data/latest-download.ts";
import { publishedCompiler, publishedDownloads, publishedDownloadUrl } from "../data/releases.ts";

function LatestDownloadPage({ platform }: { platform: LatestPlatform }) {
  const choice = latestDownloadPlatforms[platform];
  const pinned = publishedDownloads.find(item => item.platform === platform);
  if (!pinned) throw new Error(`Missing reviewed fallback archive for ${platform}`);

  return (
    <Base
      title={`Latest Scarp for ${choice.name}`}
      noindex
      description={`Automatically find the newest published Scarp ${choice.name} ${choice.architecture} release archive.`}
    >
      <section className="wrap page-heading" data-latest-download={platform}>
        <p className="eyebrow">Permanent download link · {choice.architecture}</p>
        <h1>Latest Scarp for {choice.name}</h1>
        <p className="lead" role="status" aria-live="polite" data-latest-status>
          Checking the newest published Scarp release on GitHub…
        </p>
        <p>
          If an official {choice.architecture} archive is available for the newest published release,
          your browser will open that download. This includes experimental prereleases.
        </p>
        <p>
          <a className="button secondary" data-latest-release href={publishedCompiler.release}>
            View official GitHub release ↗
          </a>
        </p>
        <p>
          If automatic download is unavailable, you can download the independently reviewed
          <strong> {publishedCompiler.tag}</strong> archive instead:
          {" "}<a href={publishedDownloadUrl(pinned.file)}>{pinned.file}</a>.
        </p>
        <p className="small muted">
          A new release may not have an archive for every architecture. Never verify a
          newer archive using the older pinned checksum. Obtain the matching SHA-256
          from the same GitHub release; the <a href="/downloads/">downloads and verification guide</a>
          {" "}has reviewed checksums for {publishedCompiler.tag}.
        </p>
        <noscript>
          JavaScript is needed for automatic latest-version discovery. Use the official
          GitHub release link or the reviewed fallback above.
        </noscript>
      </section>
    </Base>
  );
}

export function WindowsLatestDownload() {
  return <LatestDownloadPage platform="windows" />;
}
export function LinuxLatestDownload() {
  return <LatestDownloadPage platform="linux" />;
}
export function MacosLatestDownload() {
  return <LatestDownloadPage platform="macos" />;
}
