import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(repo, "dist");
const origin = "https://aixcelsolutions.com";
const errors = [];
const warnings = [];

const text = async (path) => readFile(path, "utf8");
const exists = async (path) => stat(path).then(() => true, () => false);
const match = (html, pattern) => html.match(pattern)?.[1]?.trim() ?? "";
const stripTags = (html) => html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " ").replace(/\s+/g, " ").trim();

const sitemapXml = await text(join(dist, "sitemap.xml"));
const urls = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((item) => item[1]);
if (!urls.length) errors.push("Sitemap contains no URLs.");
if (new Set(urls).size !== urls.length) errors.push("Sitemap contains duplicate URLs.");

const routeFromUrl = (url) => new URL(url).pathname;
const fileForRoute = (route) => route === "/" ? join(dist, "index.html") : join(dist, `${route.slice(1)}.html`);
const fileForInternalPath = (pathname) => {
  if (pathname === "/") return join(dist, "index.html");
  if (/\.[a-z0-9]+$/i.test(pathname)) return join(dist, pathname.slice(1));
  return join(dist, `${pathname.slice(1).replace(/\/$/, "")}.html`);
};

const seenTitles = new Map();
const seenDescriptions = new Map();
let linksChecked = 0;
let jsonLdBlocks = 0;

for (const url of urls) {
  const route = routeFromUrl(url);
  const file = fileForRoute(route);
  if (!await exists(file)) {
    errors.push(`${route}: sitemap target is missing (${file}).`);
    continue;
  }
  const html = await text(file);
  const title = match(html, /<title>([\s\S]*?)<\/title>/i).replaceAll("&amp;", "&");
  const description = match(html, /<meta\s+name="description"\s+content="([^"]+)"/i);
  const canonical = match(html, /<link\s+rel="canonical"\s+href="([^"]+)"/i);
  const robots = match(html, /<meta\s+name="robots"\s+content="([^"]+)"/i);
  const h1s = [...html.matchAll(/<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>/gi)];
  const ogImage = match(html, /<meta\s+property="og:image"\s+content="([^"]+)"/i);
  const twitterCard = match(html, /<meta\s+name="twitter:card"\s+content="([^"]+)"/i);
  const words = stripTags(html).split(/\s+/).filter(Boolean).length;

  if (!title) errors.push(`${route}: missing title.`);
  if (!description) errors.push(`${route}: missing meta description.`);
  if (canonical !== url) errors.push(`${route}: canonical ${canonical || "(missing)"} does not equal ${url}.`);
  if (!/index/i.test(robots) || !/follow/i.test(robots)) errors.push(`${route}: robots meta is not index,follow.`);
  if (h1s.length !== 1) errors.push(`${route}: expected one H1, found ${h1s.length}.`);
  if (ogImage !== `${origin}/assets/og-aixcel.png`) errors.push(`${route}: social image is missing or inconsistent.`);
  if (twitterCard !== "summary_large_image") errors.push(`${route}: Twitter card is not summary_large_image.`);
  if (html.includes("<template")) errors.push(`${route}: route content is hidden in a template element.`);
  if (words < 180) warnings.push(`${route}: only ${words} visible words.`);
  if (title.length > 65) warnings.push(`${route}: title is ${title.length} characters.`);
  if (description.length > 165) warnings.push(`${route}: description is ${description.length} characters.`);

  if (seenTitles.has(title)) errors.push(`${route}: duplicate title also used by ${seenTitles.get(title)}.`);
  else seenTitles.set(title, route);
  if (seenDescriptions.has(description)) errors.push(`${route}: duplicate description also used by ${seenDescriptions.get(description)}.`);
  else seenDescriptions.set(description, route);

  const ldBlocks = [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  if (!ldBlocks.length) errors.push(`${route}: missing JSON-LD.`);
  for (const block of ldBlocks) {
    jsonLdBlocks++;
    try {
      const data = JSON.parse(block[1]);
      const graph = data["@graph"] ?? [data];
      const types = graph.flatMap((node) => Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]]);
      if (!types.includes("BreadcrumbList") && route !== "/") errors.push(`${route}: JSON-LD is missing BreadcrumbList.`);
      if (route.startsWith("/services/") && !types.includes("Service")) errors.push(`${route}: JSON-LD is missing Service.`);
      if ((route.startsWith("/case-studies/") || route.startsWith("/insights/")) && !types.includes("Article")) errors.push(`${route}: JSON-LD is missing Article.`);
    } catch (error) {
      errors.push(`${route}: invalid JSON-LD (${error.message}).`);
    }
  }

  for (const hrefMatch of html.matchAll(/href="([^"]+)"/gi)) {
    const href = hrefMatch[1].replaceAll("&amp;", "&");
    if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("data:") || href.startsWith("javascript:")) continue;
    let parsed;
    try { parsed = new URL(href, url); } catch { errors.push(`${route}: malformed href ${href}.`); continue; }
    if (parsed.origin !== origin) continue;
    linksChecked++;
    const target = fileForInternalPath(parsed.pathname);
    if (!await exists(target)) errors.push(`${route}: broken internal link ${href}.`);
  }
}

const robots = await text(join(dist, "robots.txt"));
if (!robots.includes(`Sitemap: ${origin}/sitemap.xml`)) errors.push("robots.txt does not declare the canonical sitemap.");
if (/Disallow:\s*\//i.test(robots)) errors.push("robots.txt blocks the site root.");

const indexNowKey = "b1ec9a276d8f4d568508e4b4d0048c2b";
const keyFile = join(dist, `${indexNowKey}.txt`);
if (!await exists(keyFile) || (await text(keyFile)).trim() !== indexNowKey) errors.push("IndexNow verification file is missing or incorrect.");

const ogPath = join(dist, "assets", "og-aixcel.png");
if (!await exists(ogPath)) {
  errors.push("Social image file is missing.");
} else {
  const png = await readFile(ogPath);
  const signature = png.subarray(0, 8).toString("hex");
  const width = png.readUInt32BE(16);
  const height = png.readUInt32BE(20);
  if (signature !== "89504e470d0a1a0a") errors.push("Social image is not a PNG.");
  if (width !== 1200 || height !== 630) errors.push(`Social image is ${width}×${height}; expected 1200×630.`);
}

const llms = await text(join(dist, "llms.txt"));
if (!llms.includes("## Primary pages") || !llms.includes("## Evidence policy")) errors.push("llms.txt is incomplete.");

console.log(`Checked ${urls.length} sitemap URLs, ${linksChecked} internal links, and ${jsonLdBlocks} JSON-LD blocks.`);
for (const warning of warnings) console.warn(`WARN ${warning}`);
if (errors.length) {
  for (const error of errors) console.error(`ERROR ${error}`);
  process.exitCode = 1;
} else {
  console.log(`PASS: unique metadata, self-canonicals, one H1, structured data, social metadata, assets, and internal links are valid.`);
}
