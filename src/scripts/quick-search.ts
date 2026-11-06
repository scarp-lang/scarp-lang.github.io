import { searchEntries } from "../data/search.ts";
import { previewSearch, searchDirectoryHref } from "../data/quick-search.ts";

/**
 * Progressively enhance the header search link with a native modal dialog.
 * The permanent /search/ route remains the no-JavaScript / unsupported-browser
 * fallback. Avoid intercepting shortcuts while someone edits text or uses IME.
 */
export function enhanceQuickSearch(doc: Document, win: Window): void {
  const trigger = doc.querySelector<HTMLAnchorElement>("[data-quick-trigger]");
  const directoryInput = doc.querySelector<HTMLInputElement>("[data-search-input]");
  const dialog = doc.querySelector<HTMLDialogElement>("[data-quick-search]");
  const input = dialog?.querySelector<HTMLInputElement>("[data-quick-input]");
  const list = dialog?.querySelector<HTMLElement>("[data-quick-results]");
  const counter = dialog?.querySelector<HTMLElement>("[data-quick-count]");
  const empty = dialog?.querySelector<HTMLElement>("[data-quick-empty]");
  const allResults = dialog?.querySelector<HTMLAnchorElement>("[data-quick-all]");
  const closeButton = dialog?.querySelector<HTMLButtonElement>("[data-quick-close]");

  const focusDirectory = () => {
    if (!directoryInput || directoryInput.closest("form")?.hidden) return false;
    directoryInput.focus();
    directoryInput.select();
    return true;
  };

  let openDialog: (() => void) | undefined;
  if (dialog && input && list && counter && empty && allResults && closeButton &&
      typeof dialog.showModal === "function" && typeof dialog.close === "function") {
    const items = new Map<string, HTMLElement>();
    let valid = true;
    for (const item of list.querySelectorAll<HTMLElement>("[data-quick-item]")) {
      const path = item.dataset.quickPath;
      if (!path || items.has(path)) { valid = false; break; }
      items.set(path, item);
    }
    // Never open a misleading partial search if the static page and its index drift.
    if (valid && items.size === searchEntries.length &&
        searchEntries.every(entry => items.has(entry.path))) {
      const update = (query: string) => {
        const matches = previewSearch(query);
        const visible = new Set(matches.map(entry => entry.path));
        items.forEach((item, path) => { item.hidden = !visible.has(path); });
        matches.forEach(entry => {
          const item = items.get(entry.path);
          if (item) list.append(item);
        });
        counter.textContent = query.trim()
          ? `${matches.length} ${matches.length === 1 ? "result" : "results"}.`
          : `Top ${matches.length} of ${searchEntries.length} website pages.`;
        empty.hidden = matches.length !== 0;
        list.hidden = matches.length === 0;
        allResults.href = searchDirectoryHref(query);
      };

      let returnFocus: HTMLElement | null = null;
      openDialog = () => {
        if (dialog.open) { input.focus(); input.select(); return; }
        returnFocus = doc.activeElement instanceof HTMLElement ? doc.activeElement : null;
        dialog.showModal();
        input.focus();
        input.select();
      };
      update("");
      trigger?.setAttribute("aria-haspopup", "dialog");
      trigger?.setAttribute("aria-controls", dialog.id);
      input.addEventListener("input", () => update(input.value));
      closeButton.addEventListener("click", () => dialog.close());
      dialog.addEventListener("close", () => {
        if (returnFocus?.isConnected && returnFocus !== doc.body) returnFocus.focus();
        else trigger?.focus();
        returnFocus = null;
      });

      // Keep the ordinary tab order; arrow keys are an optional fast path.
      dialog.addEventListener("keydown", event => {
        // Chrome may consume Escape in a nonempty search input to clear it.
        // Closing explicitly gives the dialog predictable keyboard behavior.
        if (event.key === "Escape" && !event.isComposing) {
          event.preventDefault();
          dialog.close();
          return;
        }
        if (event.defaultPrevented || event.isComposing || event.altKey ||
            event.ctrlKey || event.metaKey || event.shiftKey) return;
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
        const links = [...list.querySelectorAll<HTMLAnchorElement>("[data-quick-item]:not([hidden]) a")];
        if (links.length === 0) return;
        const active = doc.activeElement;
        const current = links.findIndex(link => link === active);
        if (active !== input && current === -1) return;
        event.preventDefault();
        const next = active === input
          ? (event.key === "ArrowDown" ? 0 : links.length - 1)
          : event.key === "ArrowDown" ? current + 1 : current - 1;
        if (next < 0 || next >= links.length) input.focus();
        else links[next]?.focus();
      });
    }
  }

  trigger?.addEventListener("click", event => {
    if (event.defaultPrevented || event.button !== 0 ||
        event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    if (focusDirectory()) { event.preventDefault(); return; }
    if (!openDialog) return; // An ordinary link remains usable in older browsers.
    event.preventDefault();
    openDialog();
  });

  doc.addEventListener("keydown", event => {
    if (event.defaultPrevented || event.isComposing ||
        event.altKey || event.shiftKey) return;
    const modK = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";
    const slash = !event.ctrlKey && !event.metaKey && event.key === "/";
    if (!modK && !slash) return;
    const target = event.target as Element | null;
    if (target?.closest?.("input, textarea, select, [contenteditable], [role='textbox']")) return;
    event.preventDefault();
    if (focusDirectory()) return;
    if (openDialog) openDialog();
    else win.location.assign("/search/#site-search-input");
  });
}
