import { enhanceSiteSearch } from "./site-search.ts";
import { enhanceQuickSearch } from "./quick-search.ts";
import { enhanceMobileNavigation } from "./mobile-navigation.ts";
import { enhanceCodeExplorer } from "./code-explorer.ts";
import { enhanceCopyButtons } from "./code-copy.ts";

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

document.querySelectorAll<HTMLElement>('[data-code-explorer]').forEach(enhanceCodeExplorer);

enhanceCopyButtons(document.querySelectorAll<HTMLButtonElement>("[data-copy]"), navigator.clipboard, announce);

enhanceSiteSearch(document, window);
enhanceQuickSearch(document, window);
