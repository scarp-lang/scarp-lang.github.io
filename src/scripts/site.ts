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

const menu = document.querySelector<HTMLButtonElement>('[data-menu]');
const nav = document.getElementById('main-nav');
if (menu && nav) {
  menu.hidden = false;
  document.documentElement.classList.add('has-js');
  const close = () => { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); };
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open); });
  nav.addEventListener('click', event => { if ((event.target as HTMLElement).closest('a')) close(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { close(); menu.focus(); } });
}

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
