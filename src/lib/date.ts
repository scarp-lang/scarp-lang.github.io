/**
 * Deterministic publication dates in static HTML, independent of the build
 * runner's timezone and locale. All news views use the same formatter.
 */
export function formatNewsDate(value: string): string {
  const date = new Date(value + "T00:00:00Z");
  if (!Number.isFinite(date.valueOf())) {
    throw new RangeError("Invalid news publication date: " + value);
  }
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
