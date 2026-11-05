import { searchEntriesFor } from "../data/search.ts";
import { enhanceMobileNavigation } from "./mobile-navigation.ts";

const announcement = document.querySelector<HTMLElement>('[data-announcement]');
const announce = (text: string) => { if (announcement) announcement.textContent = text; };

const theme = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
if (theme) {
  theme.hidden = false;
  const syncThemeLabel = () => theme.setAttribute('aria-label', `Switch to ${document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'} theme`);
  syncThemeLabel();
  theme.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('scarp-theme', next); } catch {}
    syncThemeLabel();
  });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    try { if (localStorage.getItem('scarp-theme')) return; } catch {}
    document.documentElement.dataset.theme = event.matches ? 'dark' : 'light';
    syncThemeLabel();
  });
}

enhanceMobileNavigation({
  menu: document.querySelector<HTMLButtonElement>("[data-menu]"),
  nav: document.getElementById("main-nav"),
  doc: document,
  viewport: matchMedia("(max-width: 950px)"),
});

document.querySelectorAll<HTMLElement>('[data-code-explorer]').forEach(explorer => {
  const tabs = [...explorer.querySelectorAll<HTMLButtonElement>('[data-tab]')];
  const panels = [...explorer.querySelectorAll<HTMLElement>('[data-panel]')];
  const tablist = explorer.querySelector<HTMLElement>('[data-tabs]');
  if (!tablist) return;
  tablist.hidden = false;
  tablist.setAttribute('role', 'tablist');
  const select = (index: number, focus = false) => {
    tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
    panels.forEach((panel, i) => { panel.hidden = i !== index; });
    if (focus) tabs[index]?.focus();
  };
  tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', event => {
      const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      select(event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length, true);
    });
  });
  panels.forEach(panel => { panel.setAttribute('role', 'tabpanel'); panel.tabIndex = 0; });
  select(0);
});

if (navigator.clipboard?.writeText) document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach(button => {
  button.hidden = false;
  button.addEventListener('click', async () => {
    const text = button.closest('.code-block')?.querySelector('code')?.textContent;
    if (!text) return;
    try { await navigator.clipboard.writeText(text); button.textContent = 'Copied!'; announce('Code copied to clipboard.'); setTimeout(() => { button.textContent = 'Copy'; }, 1800); }
    catch { announce('Could not copy. Select the code and copy it manually.'); }
  });
});


// Progressive enhancement: the unfiltered site directory is useful without JS.
const searchInput = document.querySelector<HTMLInputElement>("[data-search-input]");
const searchList = document.querySelector<HTMLElement>("[data-search-results]");
if (searchInput && searchList) {
  const form = searchInput.closest<HTMLFormElement>("form");
  const items = new Map(
    [...searchList.querySelectorAll<HTMLElement>("[data-search-item]")]
      .map(item => [item.dataset.searchPath, item] as const),
  );
  const count = document.querySelector<HTMLElement>("[data-search-count]");
  const empty = document.querySelector<HTMLElement>("[data-search-empty]");
  if (form) form.hidden = false;

  const initial = (new URLSearchParams(window.location.search).get("q") ?? "").slice(0, 120);
  searchInput.value = initial;
  const update = (query: string, syncUrl: boolean) => {
    const matches = searchEntriesFor(query);
    const visible = new Set(matches.map(entry => entry.path));
    items.forEach((item, path) => { item.hidden = !visible.has(path ?? ""); });
    matches.forEach(entry => {
      const item = items.get(entry.path);
      if (item) searchList.append(item);
    });
    if (count) count.textContent = query.trim()
      ? String(matches.length) + (matches.length === 1 ? " result" : " results") + " for “" + query.trim() + "”"
      : "Browse all " + String(matches.length) + " pages";
    if (empty) empty.hidden = matches.length !== 0;
    if (syncUrl) {
      const url = new URL(window.location.href);
      if (query.trim()) url.searchParams.set("q", query.trim());
      else url.searchParams.delete("q");
      window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    }
  };
  searchInput.addEventListener("input", () => update(searchInput.value, true));
  form?.addEventListener("submit", event => {
    event.preventDefault();
    update(searchInput.value, true);
  });
  update(initial, false);
}

// Keyboard access works site-wide; editable fields retain their normal shortcuts.
document.addEventListener("keydown", event => {
  const activeEditor = event.target instanceof Element
    && Boolean(event.target.closest("input, textarea, select, [contenteditable='true']"));
  const shortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";
  const slash = event.key === "/" && !event.ctrlKey && !event.metaKey && !event.altKey && !activeEditor;
  if (!shortcut && !slash) return;
  event.preventDefault();
  if (searchInput) {
    searchInput.focus();
    searchInput.select();
  } else {
    window.location.assign("/search/");
  }
});
