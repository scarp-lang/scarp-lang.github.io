import { searchEntries, searchEntriesFor } from "../data/search.ts";

/**
 * Progressive enhancement for the static website directory.
 * If the page is incomplete, leave the full server-rendered directory visible.
 */
export function enhanceSiteSearch(doc: Document, win: Window): void {
  const input = doc.querySelector<HTMLInputElement>("[data-search-input]");
  const list = doc.querySelector<HTMLElement>("[data-search-results]");

  if (input && list) {
    const form = input.closest<HTMLFormElement>("form");
    const items = new Map<string, HTMLElement>();
    for (const item of list.querySelectorAll<HTMLElement>("[data-search-item]")) {
      const path = item.dataset.searchPath;
      if (!path || items.has(path)) return;
      items.set(path, item);
    }

    // Never hide or reorder the directory if its markup and data drift apart.
    if (form && items.size === searchEntries.length &&
        searchEntries.every(entry => items.has(entry.path))) {
      const count = doc.querySelector<HTMLElement>("[data-search-count]");
      const status = doc.querySelector<HTMLElement>("[data-search-status]");
      const empty = doc.querySelector<HTMLElement>("[data-search-empty]");
      const clear = doc.querySelector<HTMLButtonElement>("[data-search-clear]");
      const fromUrl = () =>
        (new URLSearchParams(win.location.search).get("q") ?? "").slice(0, 120);

      const update = (query: string, syncUrl: boolean) => {
        const matches = searchEntriesFor(query);
        const visible = new Set(matches.map(entry => entry.path));
        items.forEach((item, path) => { item.hidden = !visible.has(path); });
        matches.forEach(entry => {
          const item = items.get(entry.path);
          if (item) list.append(item);
        });

        if (count) count.textContent = query.trim()
          ? `${matches.length} ${matches.length === 1 ? "result" : "results"} for “${query.trim()}”`
          : `Browse all ${matches.length} pages`;
        // A short live-region message avoids reading the full query every keystroke.
        if (status) status.textContent = matches.length === 0
          ? "No matching pages."
          : `${matches.length} ${matches.length === 1 ? "result" : "results"}.`;
        if (empty) empty.hidden = matches.length !== 0;
        if (clear) clear.hidden = input.value.length === 0;

        if (syncUrl) {
          const url = new URL(win.location.href);
          if (query.trim()) url.searchParams.set("q", query.trim());
          else url.searchParams.delete("q");
          win.history.replaceState(null, "", url.pathname + url.search + url.hash);
        }
      };

      form.hidden = false;
      input.value = fromUrl();
      update(input.value, false);
      input.addEventListener("input", () => update(input.value, true));
      input.addEventListener("keydown", event => {
        if (event.key !== "Escape" || !input.value) return;
        event.preventDefault();
        input.value = "";
        update("", true);
      });
      clear?.addEventListener("click", () => {
        input.value = "";
        update("", true);
        input.focus();
      });
      form.addEventListener("submit", event => {
        event.preventDefault();
        update(input.value, true);
      });
      win.addEventListener("popstate", () => {
        input.value = fromUrl();
        update(input.value, false);
      });

      if (win.location.hash === "#site-search-input") input.focus();
    }
  }

  // Do not steal shortcuts from any editor, including contenteditable controls.
  doc.addEventListener("keydown", event => {
    if (event.defaultPrevented || event.isComposing || event.altKey || event.shiftKey) return;
    const target = event.target as Element | null;
    const editing = Boolean(target?.closest?.("input, textarea, select, [contenteditable], [role='textbox']"));
    if (editing) return;
    const modK = (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "k";
    const slash = !event.ctrlKey && !event.metaKey && event.key === "/";
    if (!modK && !slash) return;
    event.preventDefault();
    if (input && !input.closest("form")?.hidden) {
      input.focus();
      input.select();
    } else {
      win.location.assign("/search/#site-search-input");
    }
  });
}
