/**
 * Progressively enhance the server-rendered example list into an accessible tab set.
 * Without JavaScript (or with unexpected markup), every example stays visible.
 */
export function enhanceCodeExplorer(explorer: HTMLElement): void {
  const tablist = explorer.querySelector<HTMLElement>("[data-tabs]");
  const tabs = [...explorer.querySelectorAll<HTMLButtonElement>("[data-tab]")];
  const panels = [...explorer.querySelectorAll<HTMLElement>("[data-panel]")];

  // Never hide content when a tab cannot be paired with its panel.
  if (!tablist || tabs.length === 0 || tabs.length !== panels.length) return;
  const seen = new Set<string>();
  for (let index = 0; index < tabs.length; index++) {
    const tab = tabs[index];
    const panel = panels[index];
    if (!tab || !panel || !tab.id || !panel.id ||
        tab.getAttribute("aria-controls") !== panel.id ||
        !tab.dataset.tab || tab.dataset.tab !== panel.dataset.panel ||
        seen.has(tab.id) || seen.has(panel.id)) return;
    seen.add(tab.id);
    seen.add(panel.id);
  }

  const activate = (index: number, focus = false) => {
    tabs.forEach((tab, current) => {
      const selected = current === index;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel, current) => {
      panel.hidden = current !== index;
    });
    if (focus) tabs[index]?.focus();
  };

  tablist.setAttribute("role", "tablist");
  tablist.setAttribute("aria-orientation", "horizontal");
  tabs.forEach((tab, index) => {
    tab.setAttribute("role", "tab");
    const panel = panels[index];
    if (panel) {
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", tab.id);
      panel.tabIndex = 0;
    }
    tab.addEventListener("click", () => activate(index));
    tab.addEventListener("keydown", event => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      let next: number;
      switch (event.key) {
        case "ArrowRight": next = (index + 1) % tabs.length; break;
        case "ArrowLeft": next = (index - 1 + tabs.length) % tabs.length; break;
        case "Home": next = 0; break;
        case "End": next = tabs.length - 1; break;
        default: return;
      }
      event.preventDefault();
      activate(next, true);
    });
  });
  activate(0);
  explorer.classList.add("is-enhanced");
  tablist.hidden = false;
}
