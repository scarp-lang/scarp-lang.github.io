import { enhanceSiteSearch } from "./site-search.ts";
import { enhanceMobileNavigation } from "./mobile-navigation.ts";
import { enhanceCodeExplorer } from "./code-explorer.ts";

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

if (navigator.clipboard?.writeText) document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach(button => {
  button.hidden = false;
  button.addEventListener('click', async () => {
    const text = button.closest('.code-block')?.querySelector('code')?.textContent;
    if (!text) return;
    try { await navigator.clipboard.writeText(text); button.textContent = 'Copied!'; announce('Code copied to clipboard.'); setTimeout(() => { button.textContent = 'Copy'; }, 1800); }
    catch { announce('Could not copy. Select the code and copy it manually.'); }
  });
});


enhanceSiteSearch(document, window);
