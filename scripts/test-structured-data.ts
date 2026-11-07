import test from "node:test";
import assert from "node:assert/strict";
import { websiteStructuredData } from "../src/lib/structured-data.ts";

const origin = "https://scarp-lang.github.io";

test("website and page schema use canonical URLs and truthful project identity", () => {
  const text = websiteStructuredData(
    "Downloads · Scarp Programming Language",
    "Scarp experimental compiler downloads.",
    origin + "/downloads/",
  );
  const data = JSON.parse(text);
  assert.equal(data["@context"], "https://schema.org");
  assert.equal(data["@graph"].length, 2);
  const [site, page] = data["@graph"];
  assert.equal(site["@type"], "WebSite");
  assert.equal(site["@id"], origin + "/#website");
  assert.equal(site.url, origin + "/");
  assert.equal(site.publisher.url, "https://github.com/scarp-lang");
  assert.equal(page["@type"], "WebPage");
  assert.equal(page["@id"], origin + "/downloads/#webpage");
  assert.equal(page.url, origin + "/downloads/");
  assert.equal(page.name, "Downloads · Scarp Programming Language");
  assert.equal(page.inLanguage, "en");
  assert.deepEqual(page.isPartOf, { "@id": site["@id"] });
  assert.equal(page.description, "Scarp experimental compiler downloads.");
  assert.equal(Object.hasOwn(data, "SoftwareApplication"), false);
});

test("schema JSON remains valid while script-breaking characters are escaped", () => {
  const dangerous = '</script><script>alert("test")</script> & \u2028\u2029';
  const text = websiteStructuredData(dangerous, dangerous, origin + "/");
  assert.equal(text.includes("</script>"), false);
  assert.equal(text.includes("<"), false);
  assert.equal(text.includes(">"), false);
  assert.equal(text.includes("&"), false);
  assert.equal(text.includes("\u2028"), false);
  assert.equal(text.includes("\u2029"), false);
  const page = JSON.parse(text)["@graph"][1];
  assert.equal(page.name, dangerous);
  assert.equal(page.description, dangerous);
});
