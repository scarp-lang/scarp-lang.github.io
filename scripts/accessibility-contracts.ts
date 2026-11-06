/**
 * Small dependency-free HTML checks for deterministic site accessibility contracts.
 * This is not a replacement for real browser / assistive-technology testing.
 */
export function accessibilityProblems(html: string): string[] {
  const problems: string[] = [];
  const tags = [...html.matchAll(/<([a-z][a-z0-9:-]*)(?=[\s/>])([^<>]*?)>/gi)]
    .map(match => ({ name: match[1]?.toLowerCase() ?? "", attrs: match[2] ?? "" }));
  const attr = (attrs: string, name: string): string | undefined =>
    new RegExp('(?:^|\\s)' + name + '="([^"]*)"', "i").exec(attrs)?.[1];
  const byName = (name: string) => tags.filter(tag => tag.name === name);
  const ids = new Set(tags.map(tag => attr(tag.attrs, "id")).filter((value): value is string => Boolean(value)));

  const h1 = byName("h1").length;
  if (h1 !== 1) problems.push(`Expected exactly one h1, found ${h1}`);

  const mains = byName("main");
  if (mains.length !== 1 || attr(mains[0]?.attrs ?? "", "id") !== "main" ||
      attr(mains[0]?.attrs ?? "", "tabindex") !== "-1") {
    problems.push("Skip destination must be one focusable main landmark");
  }

  const skips = byName("a").filter(tag =>
    (attr(tag.attrs, "class") ?? "").split(/\s+/).includes("skip-link") &&
    attr(tag.attrs, "href") === "#main");
  if (skips.length !== 1) problems.push("Missing or ambiguous skip-to-content link");

  const nav = byName("nav").filter(tag => attr(tag.attrs, "id") === "main-nav");
  if (nav.length !== 1 || !attr(nav[0]?.attrs ?? "", "aria-label")) {
    problems.push("Main navigation must have an accessible label");
  }

  for (const tag of tags) {
    for (const name of ["aria-labelledby", "aria-describedby", "aria-controls"] as const) {
      const refs = attr(tag.attrs, name);
      if (refs === undefined) continue;
      const values = refs.trim().split(/\s+/).filter(Boolean);
      if (!values.length) problems.push(`Empty ${name} reference`);
      for (const id of values) if (!ids.has(id)) problems.push(`Broken ${name} reference: ${id}`);
    }
    if (tag.name === "img") {
      if (attr(tag.attrs, "alt") === undefined) problems.push("Image missing alt attribute");
      for (const dimension of ["width", "height"] as const) {
        const value = attr(tag.attrs, dimension);
        if (!value || !/^\d+$/.test(value) || Number(value) < 1)
          problems.push(`Image missing a positive ${dimension}`);
      }
    }
    if (tag.name === "button" && !["button", "submit", "reset"].includes(attr(tag.attrs, "type") ?? "")) {
      problems.push("Button missing explicit type");
    }
  }

  const labels = new Set(byName("label")
    .map(tag => attr(tag.attrs, "for")).filter((value): value is string => Boolean(value)));
  for (const name of ["input", "select", "textarea"] as const) {
    for (const tag of byName(name)) {
      if (name === "input" && attr(tag.attrs, "type") === "hidden") continue;
      const id = attr(tag.attrs, "id");
      if (!attr(tag.attrs, "aria-label") && !attr(tag.attrs, "aria-labelledby") &&
          (!id || !labels.has(id))) {
        problems.push(`Unlabelled ${name}${id ? ` #${id}` : ""}`);
      }
    }
  }
  return problems;
}
