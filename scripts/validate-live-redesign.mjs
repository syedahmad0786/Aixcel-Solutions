import { readdir, readFile } from "node:fs/promises";

const root = new URL("../dist/", import.meta.url);
const textExtensions = new Set([".html", ".css", ".js", ".mjs", ".json", ".xml", ".txt", ".svg"]);

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => {
    const url = new URL(entry.name + (entry.isDirectory() ? "/" : ""), directory);
    return entry.isDirectory() ? files(url) : [url];
  }))).flat();
}

const required = ["index.html", "products/openxcel-ai/index.html", "systems-desk.html", "robots.txt", "sitemap.xml", "llms.txt"];
for (const path of required) await readFile(new URL(path, root));

const documents = await files(root);
const text = (await Promise.all(documents.filter((url) => textExtensions.has(url.pathname.slice(url.pathname.lastIndexOf(".")))).map((url) => readFile(url, "utf8")))).join("\n");
if (/[—–]/u.test(text)) throw new Error("Long dash found in deployable text.");
if (text.includes("chatgpt.site")) throw new Error("Preview domain found in deployable text.");

const home = await readFile(new URL("index.html", root), "utf8");
if (!home.includes('rel="canonical" href="https://aixcelsolutions.com/"')) throw new Error("Live canonical is missing.");
if (!home.includes('name="google-site-verification"')) throw new Error("Google verification is missing.");
if (!text.includes("linear-gradient") && !text.includes("radial-gradient")) throw new Error("Gradient design assets are missing.");
if (!home.includes("Your AI system.") || !home.includes("Owned by you.") || !home.includes("/assets/openxcel/01-projects.png")) throw new Error("OpenXCEL homepage feature is incomplete.");

const product = await readFile(new URL("products/openxcel-ai/index.html", root), "utf8");
if ((product.match(/role="tab"/g) || []).length !== 11) throw new Error("OpenXCEL product tour must contain 11 tabs.");
if ((product.match(/assets\/openxcel\/tools\/official-/g) || []).length !== 12 || !product.includes("Official Make logo")) throw new Error("OpenXCEL integration marks are incomplete.");
if (!product.includes("The graph did not render during this capture") || !product.includes("a proposed workspace direction")) throw new Error("OpenXCEL evidence boundaries are incomplete.");
if (!product.includes("https://cal.com/ahmad-bukhari/revenue-handoff-map") || !product.includes("/assets/OpenXCEL-AI-Brief.pdf")) throw new Error("OpenXCEL conversion links are incomplete.");
if (product.includes("internal/") || product.includes("internal\\")) throw new Error("Private asset path found on the OpenXCEL page.");

const robots = await readFile(new URL("robots.txt", root), "utf8");
if (!robots.includes("Allow: /") || !robots.includes("https://aixcelsolutions.com/sitemap.xml")) throw new Error("Production robots policy is invalid.");

const sitemap = await readFile(new URL("sitemap.xml", root), "utf8");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
if (urls.length < 50 || urls.some((url) => !url.startsWith("https://aixcelsolutions.com/"))) throw new Error("Production sitemap is invalid.");

console.log(`Validated ${documents.length} deployable files and ${urls.length} sitemap URLs.`);
