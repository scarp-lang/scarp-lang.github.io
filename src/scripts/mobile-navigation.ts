/**
 * Enhance the static, always-available navigation with a mobile disclosure.
 * Without JavaScript the links remain visible at every viewport size.
 */
export function enhanceMobileNavigation({
  menu,
  nav,
  doc,
  viewport,
}: {
  menu: HTMLButtonElement | null;
  nav: HTMLElement | null;
  doc: Document;
  viewport: MediaQueryList;
}): void {
  if (!menu || !nav) return;

  const isOpen = () => menu.getAttribute("aria-expanded") === "true";
  const setOpen = (open: boolean) => {
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute(
      "aria-label",
      open ? "Close navigation menu" : "Open navigation menu",
    );
    nav.classList.toggle("is-open", open);
  };

  // The button is meaningful only when the browser behavior is available.
  menu.hidden = false;
  doc.documentElement.classList.add("has-js");
  setOpen(false);

  menu.addEventListener("click", () => setOpen(!isOpen()));

  nav.addEventListener("click", (event) => {
    if ((event.target as Element | null)?.closest?.("a")) setOpen(false);
  });

  doc.addEventListener("pointerdown", (event) => {
    if (!viewport.matches || !isOpen()) return;
    const target = event.target as Node | null;
    if (target && !menu.contains(target) && !nav.contains(target))
      setOpen(false);
  });

  // Tabbing beyond the disclosure leaves focus in the normal document flow.
  doc.addEventListener("focusin", (event) => {
    if (!viewport.matches || !isOpen()) return;
    const target = event.target as Node | null;
    if (target && !menu.contains(target) && !nav.contains(target))
      setOpen(false);
  });

  doc.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !isOpen()) return;
    setOpen(false);
    if (viewport.matches) menu.focus();
  });

  viewport.addEventListener("change", () => {
    const focusWasInNav = nav.contains(doc.activeElement);
    setOpen(false);
    // Prevent focus from remaining on a now-hidden mobile navigation link.
    if (viewport.matches && focusWasInNav) menu.focus();
  });
}
