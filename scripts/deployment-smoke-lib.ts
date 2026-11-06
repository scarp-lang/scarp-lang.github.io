/** Read-only checks that GitHub Pages is serving the expected commit. */
export const siteOrigin = "https://scarp-lang.github.io";
export const repositoryName = "scarp-lang/scarp-lang.github.io";

export interface DeploymentMarker {
  schemaVersion: 1;
  repository: string;
  commit: string | null;
  compilerTag: string;
}

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function parseDeploymentMarker(value: unknown): DeploymentMarker {
  if (!record(value) || value.schemaVersion !== 1 ||
      value.repository !== repositoryName ||
      (value.commit !== null && (typeof value.commit !== "string" || !/^[0-9a-f]{40}$/.test(value.commit))) ||
      typeof value.compilerTag !== "string" || !/^v\d+\.\d+\.\d+-alpha\.\d+$/.test(value.compilerTag)) {
    throw new Error("Invalid deployment marker schema or repository");
  }
  return {
    schemaVersion: 1,
    repository: repositoryName,
    commit: value.commit as string | null,
    compilerTag: value.compilerTag,
  };
}

export interface ProbeOptions {
  fetcher?: typeof fetch;
  origin?: string;
}

export async function probeDeployment(
  expectedCommit: string,
  expectedTag: string,
  options: ProbeOptions = {},
): Promise<void> {
  if (!/^[0-9a-f]{40}$/.test(expectedCommit)) throw new Error("Expected commit must be a 40-character SHA");
  if (!/^v\d+\.\d+\.\d+-alpha\.\d+$/.test(expectedTag)) throw new Error("Invalid expected compiler tag");
  const origin = options.origin ?? siteOrigin;
  const fetcher = options.fetcher ?? fetch;
  async function get(path: string, expectedType: string): Promise<string> {
    const url = new URL(path, origin);
    // Bypass stale CDN/browser cache; the response must also carry the expected commit.
    url.searchParams.set("deploy-check", expectedCommit);
    const response = await fetcher(url.toString(), {
      headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      signal: AbortSignal.timeout(20_000),
    });
    if (response.status !== 200) throw new Error(`${path}: expected HTTP 200, received ${response.status}`);
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes(expectedType)) {
      throw new Error(`${path}: unexpected content type ${contentType}`);
    }
    return response.text();
  }

  const marker = parseDeploymentMarker(JSON.parse(await get("/deployment.json", "application/json")) as unknown);
  if (marker.commit !== expectedCommit) {
    throw new Error(`Deployment commit mismatch: expected ${expectedCommit}, got ${marker.commit ?? "none"}`);
  }
  if (marker.compilerTag !== expectedTag) {
    throw new Error(`Deployment compiler tag mismatch: expected ${expectedTag}, got ${marker.compilerTag}`);
  }

  const snapshot: unknown = JSON.parse(await get("/project.json", "application/json"));
  if (!record(snapshot) || !record(snapshot.latestPublished) ||
      snapshot.latestPublished.tag !== expectedTag || snapshot.website !== siteOrigin) {
    throw new Error("Live project snapshot does not match the reviewed compiler release or website");
  }

  const routes = [
    { path: "/", token: 'href="https://scarp-lang.github.io/"' },
    { path: "/downloads/", token: expectedTag },
    { path: "/support/", token: "support" },
  ];
  for (const route of routes) {
    const html = await get(route.path, "text/html");
    if (!html.includes("<title>") || !html.includes(route.token)) {
      throw new Error(`${route.path}: missing expected site content`);
    }
  }
}

export interface RetryOptions extends ProbeOptions {
  attempts?: number;
  pauseMs?: number;
  sleep?: (milliseconds: number) => Promise<void>;
}

export async function waitForDeployment(
  commit: string,
  tag: string,
  options: RetryOptions = {},
): Promise<number> {
  const { attempts = 12, pauseMs = 10_000, sleep = ms => new Promise<void>(resolve => setTimeout(resolve, ms)) } = options;
  if (!Number.isInteger(attempts) || attempts < 1 || attempts > 30 ||
      !Number.isInteger(pauseMs) || pauseMs < 0) {
    throw new Error("Invalid smoke-test retry settings");
  }
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      await probeDeployment(commit, tag, options);
      return attempt;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        console.warn(`Deployment not yet visible (attempt ${attempt}/${attempts}): ${String(error)}`);
        await sleep(pauseMs);
      }
    }
  }
  throw new Error(`Live deployment verification failed after ${attempts} attempts`, { cause: lastError });
}
