import { searchEntriesFor } from "./search.ts";

/** A compact, reviewed subset of the same directory used by /search/. */
export const quickSearchLimit = 6;

export function previewSearch(query: string) {
  return searchEntriesFor(query).slice(0, quickSearchLimit);
}

/** Preserve the user's query without ever allowing an external destination. */
export function searchDirectoryHref(query: string): string {
  const trimmed = query.trim().slice(0, 120);
  return trimmed ? `/search/?q=${encodeURIComponent(trimmed)}` : "/search/";
}
