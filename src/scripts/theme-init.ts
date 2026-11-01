/** Self-contained so Astro can inline its compiled JavaScript before first paint. */
export function initializeTheme(): void {
  let preference: string | null = null;
  try { preference = localStorage.getItem('scarp-theme'); } catch {}
  document.documentElement.dataset.theme = preference === 'dark' || preference === 'light'
    ? preference
    : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
