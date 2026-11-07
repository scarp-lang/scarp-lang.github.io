import { project } from "../data/project.ts";

/**
 * Structured metadata describes the public website, not unshipped language
 * capabilities or a claim that Scarp is production-ready.
 */
export function websiteStructuredData(
  pageTitle: string,
  description: string,
  canonical: string,
): string {
  const websiteId = `${project.origin}/#website`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: "Scarp Programming Language",
        url: `${project.origin}/`,
        description: "Official website for the experimental Scarp Programming Language.",
        publisher: {
          "@type": "Organization",
          name: "Scarp Programming Language",
          url: "https://github.com/scarp-lang",
        },
      },
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: pageTitle,
        description,
        inLanguage: "en",
        isPartOf: { "@id": websiteId },
      },
    ],
  };

  // React inserts JSON-LD as raw script text: escape script-breaking characters
  // so even future data containing "</script>" cannot terminate the element.
  return JSON.stringify(data).replace(/[<>&\u2028\u2029]/g, (char) => {
    switch (char) {
      case "<": return "\\u003c";
      case ">": return "\\u003e";
      case "&": return "\\u0026";
      case "\u2028": return "\\u2028";
      default: return "\\u2029";
    }
  });
}
