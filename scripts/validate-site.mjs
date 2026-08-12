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

const sitemapXml = await text(join(dist, "apex-sitemap.xml"));
const urls = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((item) => item[1]);
if (!urls.length) errors.push("Sitemap contains no URLs.");
if (new Set(urls).size !== urls.length) errors.push("Sitemap contains duplicate URLs.");

const routeFromUrl = (url) => new URL(url).pathname;
const fileForRoute = (route) => route === "/" ? join(dist, "apex.html") : join(dist, `${route.slice(1)}.html`);
const fileForInternalPath = (pathname) => {
  if (pathname === "/") return join(dist, "apex.html");
  if (/\.[a-z0-9]+$/i.test(pathname)) return join(dist, pathname.slice(1));
  return join(dist, `${pathname.slice(1).replace(/\/$/, "")}.html`);
};

const seenTitles = new Map();
const seenDescriptions = new Map();
const seenSocialImages = new Set();
const expectedPrimaryNav = ["Services", "Work", "Insights", "About", "Contact"];
let linksChecked = 0;
let jsonLdBlocks = 0;
let imageAssetsChecked = 0;

const validateImageAssets = async (html, route, baseUrl) => {
  for (const srcMatch of html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/gi)) {
    const src = srcMatch[1].replaceAll("&amp;", "&");
    if (src.startsWith("data:")) continue;
    let parsed;
    try { parsed = new URL(src, baseUrl); } catch { errors.push(`${route}: malformed image source ${src}.`); continue; }
    if (parsed.origin !== origin) continue;
    imageAssetsChecked++;
    const target = fileForInternalPath(parsed.pathname);
    if (!await exists(target)) errors.push(`${route}: missing image asset ${src}.`);
  }
};

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
  try {
    const socialUrl = new URL(ogImage);
    if (socialUrl.origin !== origin || !socialUrl.pathname.startsWith("/assets/") || !socialUrl.pathname.endsWith(".png")) {
      errors.push(`${route}: social image must be a same-origin PNG under /assets/.`);
    } else {
      seenSocialImages.add(socialUrl.pathname);
    }
  } catch {
    errors.push(`${route}: social image is missing or malformed.`);
  }
  if (twitterCard !== "summary_large_image") errors.push(`${route}: Twitter card is not summary_large_image.`);
  if (html.includes("<template")) errors.push(`${route}: route content is hidden in a template element.`);
  if (words < 180) warnings.push(`${route}: only ${words} visible words.`);
  if (title.length > 65) warnings.push(`${route}: title is ${title.length} characters.`);
  if (description.length > 165) warnings.push(`${route}: description is ${description.length} characters.`);

  const primaryNav = match(html, /<nav class="desktop-nav" aria-label="Primary navigation">([\s\S]*?)<\/nav>/i);
  if (primaryNav) {
    const labels = [...primaryNav.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)].map((item) => stripTags(item[1]));
    if (JSON.stringify(labels) !== JSON.stringify(expectedPrimaryNav)) {
      errors.push(`${route}: primary navigation is ${JSON.stringify(labels)}; expected ${JSON.stringify(expectedPrimaryNav)}.`);
    }
    if (/Systems Desk|Agentic systems lab|Labs|Case studies|Process|AI Search/i.test(primaryNav)) {
      errors.push(`${route}: a deep or utility route is still exposed as primary navigation.`);
    }
  }

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
  await validateImageAssets(html, route, url);
}

const previewRoutes = [
  "/services/ai-search-visibility",
  "/solutions/ai-operations-workspace",
  "/insights/aieo-aeo-geo-explained",
  "/insights/measure-ai-search-visibility",
  "/insights/ai-citation-to-qualified-lead",
];
for (const route of previewRoutes) {
  if (urls.includes(`${origin}${route}`)) continue;
  const file = fileForRoute(route);
  if (!await exists(file)) {
    errors.push(`${route}: gated preview target is missing.`);
    continue;
  }
  const html = await text(file);
  const canonical = match(html, /<link\s+rel="canonical"\s+href="([^"]+)"/i);
  const robotsMeta = match(html, /<meta\s+name="robots"\s+content="([^"]+)"/i);
  const h1s = [...html.matchAll(/<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>/gi)];
  const socialImage = match(html, /<meta\s+property="og:image"\s+content="([^"]+)"/i);
  if (canonical !== `${origin}${route}`) errors.push(`${route}: gated preview canonical is incorrect.`);
  if (!/noindex/i.test(robotsMeta) || !/follow/i.test(robotsMeta)) errors.push(`${route}: gated preview must be noindex,follow.`);
  if (h1s.length !== 1) errors.push(`${route}: gated preview expected one H1, found ${h1s.length}.`);
  try {
    const socialUrl = new URL(socialImage);
    if (socialUrl.origin !== origin || !socialUrl.pathname.startsWith("/assets/") || !socialUrl.pathname.endsWith(".png")) {
      errors.push(`${route}: gated preview social image is invalid.`);
    } else {
      seenSocialImages.add(socialUrl.pathname);
    }
  } catch {
    errors.push(`${route}: gated preview social image is missing or malformed.`);
  }
  for (const hrefMatch of html.matchAll(/href="([^"]+)"/gi)) {
    const href = hrefMatch[1].replaceAll("&amp;", "&");
    if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("data:") || href.startsWith("javascript:")) continue;
    let parsed;
    try { parsed = new URL(href, `${origin}${route}`); } catch { errors.push(`${route}: malformed href ${href}.`); continue; }
    if (parsed.origin !== origin) continue;
    linksChecked++;
    const target = fileForInternalPath(parsed.pathname);
    if (!await exists(target)) errors.push(`${route}: broken internal link ${href}.`);
  }
  await validateImageAssets(html, route, `${origin}${route}`);
}

const signalOrigin = "https://signal.aixcelsolutions.com";
const signalRoutes = [
  { route: "/", file: "signal.html" },
  { route: "/method", file: "method.html" },
  { route: "/pricing", file: "pricing.html" },
  { route: "/audit", file: "audit.html" },
];
for (const { route, file: name } of signalRoutes) {
  const file = join(dist, name);
  if (!await exists(file)) { errors.push(`SIGNAL ${route}: page is missing.`); continue; }
  const html = await text(file);
  const canonical = match(html, /<link\s+rel="canonical"\s+href="([^"]+)"/i);
  const robotsMeta = match(html, /<meta\s+name="robots"\s+content="([^"]+)"/i);
  const h1s = [...html.matchAll(/<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>/gi)];
  const socialImage = match(html, /<meta\s+property="og:image"\s+content="([^"]+)"/i);
  const expectedUrl = `${signalOrigin}${route === "/" ? "/" : route}`;
  if (canonical !== expectedUrl) errors.push(`SIGNAL ${route}: canonical is ${canonical || "missing"}.`);
  if (!/index/i.test(robotsMeta) || !/follow/i.test(robotsMeta)) errors.push(`SIGNAL ${route}: robots meta is not index,follow.`);
  if (h1s.length !== 1) errors.push(`SIGNAL ${route}: expected one H1, found ${h1s.length}.`);
  if (socialImage !== `${signalOrigin}/assets/og-aixcel-signal.png`) errors.push(`SIGNAL ${route}: dedicated social image is missing.`);
  seenSocialImages.add("/assets/og-aixcel-signal.png");
  for (const hrefMatch of html.matchAll(/href="([^"]+)"/gi)) {
    const href = hrefMatch[1].replaceAll("&amp;", "&");
    if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("data:") || href.startsWith("javascript:")) continue;
    let parsed;
    try { parsed = new URL(href, expectedUrl); } catch { errors.push(`SIGNAL ${route}: malformed href ${href}.`); continue; }
    if (![signalOrigin, origin].includes(parsed.origin)) continue;
    linksChecked++;
    const target = parsed.origin === signalOrigin && parsed.pathname === "/" ? join(dist, "signal.html") : fileForInternalPath(parsed.pathname);
    if (!await exists(target)) errors.push(`SIGNAL ${route}: broken internal link ${href}.`);
  }
}
for (const [name, label] of [["login.html", "SIGNAL login"], ["workspace.html", "SIGNAL workspace"]]) {
  const html = await text(join(dist, name));
  if (!/<meta\s+name="robots"\s+content="noindex,nofollow(?:,noarchive)?">/i.test(html)) errors.push(`${label} must remain noindex,nofollow.`);
}
const signalHtml = await text(join(dist, "signal.html"));
const auditHtml = await text(join(dist, "audit.html"));
for (const name of ["signal.html", "method.html", "pricing.html", "audit.html", "login.html", "workspace.html"]) {
  const html = await text(join(dist, name));
  if (!html.includes("data-signal-theme-toggle")) errors.push(`${name}: SIGNAL theme control is missing.`);
  if (!html.includes('src="/assets/signal-theme.js"')) errors.push(`${name}: SIGNAL theme runtime is missing.`);
}
for (const asset of [
  "chatgpt-openai-blossom.svg",
  "google.png",
  "gemini.svg",
  "perplexity.svg",
  "claude.svg",
  "copilot.svg",
]) {
  if (!signalHtml.includes(`/assets/platforms/${asset}`)) errors.push(`SIGNAL platform mark is missing from the product page: ${asset}.`);
  if (!await exists(join(dist, "assets", "platforms", asset))) errors.push(`SIGNAL local platform asset is missing: ${asset}.`);
}
if (/google\.com\/s2\/favicons|faviconkit|icon\.horse/i.test(signalHtml)) errors.push("SIGNAL still depends on a remote favicon service.");
for (const asset of ["signal-product-film.mp4", "signal-product-film.webm", "signal-film-poster.webp"]) {
  const path = join(dist, "assets", asset);
  if (!await exists(path)) errors.push(`SIGNAL film asset is missing: ${asset}.`);
  else if ((await stat(path)).size < 50_000) errors.push(`SIGNAL film asset is unexpectedly small: ${asset}.`);
}
if (!signalHtml.includes('id="signal-motion-root"') || !signalHtml.includes('src="/assets/signal-motion.js"')) errors.push("SIGNAL Motion experience is not mounted.");
if (!signalHtml.includes('class="signal-product-film"')) errors.push("SIGNAL product film is not present in the landing page experience.");
for (const html of [signalHtml, auditHtml]) {
  for (const field of ["requestType", "website", "name", "email", "company", "role", "annualRevenue", "aiGoal", "timing", "consent", "companyFax"]) {
    if (!html.includes(`name="${field}"`)) errors.push(`SIGNAL audit funnel is missing ${field}.`);
  }
}
const signalRobots = await text(join(dist, "signal-robots.txt"));
const signalSitemap = await text(join(dist, "signal-sitemap.xml"));
if (!signalRobots.includes(`Sitemap: ${signalOrigin}/sitemap.xml`)) errors.push("SIGNAL robots file does not declare its sitemap.");
for (const { route } of signalRoutes) {
  const expectedUrl = `${signalOrigin}${route === "/" ? "/" : route}`;
  if (!signalSitemap.includes(`<loc>${expectedUrl}</loc>`)) errors.push(`SIGNAL sitemap is missing ${expectedUrl}.`);
}

const leadDeskHtml = await text(join(dist, "lead-desk.html"));
if (!/<meta\s+name="robots"\s+content="noindex,nofollow(?:,noarchive)?">/i.test(leadDeskHtml)) errors.push("Lead Desk must remain noindex,nofollow.");

const workUrl = `${origin}/work`;
if (!urls.includes(workUrl)) {
  errors.push("Work hub is missing from the sitemap.");
} else {
  const workHtml = await text(join(dist, "work.html"));
  for (const path of ["/case-studies", "/labs/agentic-systems", "/process"]) {
    if (!workHtml.includes(`href="${path}"`)) errors.push(`Work hub is missing its ${path} route.`);
  }
  if (!workHtml.includes('aria-current="page">Work</a>')) errors.push("Work hub does not mark Work as the active primary route.");
}

const robots = await text(join(dist, "apex-robots.txt"));
if (!robots.includes(`Sitemap: ${origin}/sitemap.xml`)) errors.push("robots.txt does not declare the canonical sitemap.");
if (/Disallow:\s*\//i.test(robots)) errors.push("robots.txt blocks the site root.");

const indexNowKey = "b1ec9a276d8f4d568508e4b4d0048c2b";
const keyFile = join(dist, `${indexNowKey}.txt`);
if (!await exists(keyFile) || (await text(keyFile)).trim() !== indexNowKey) errors.push("IndexNow verification file is missing or incorrect.");

for (const socialPath of seenSocialImages) {
  const ogPath = join(dist, socialPath.slice(1));
  if (!await exists(ogPath)) {
    errors.push(`Social image file is missing: ${socialPath}.`);
    continue;
  }
  const png = await readFile(ogPath);
  const signature = png.subarray(0, 8).toString("hex");
  const width = png.readUInt32BE(16);
  const height = png.readUInt32BE(20);
  if (signature !== "89504e470d0a1a0a") errors.push(`${socialPath}: social image is not a PNG.`);
  if (width !== 1200 || height !== 630) errors.push(`${socialPath}: social image is ${width}×${height}; expected 1200×630.`);
}

const llms = await text(join(dist, "llms.txt"));
if (!llms.includes("## Primary pages") || !llms.includes("## Evidence policy")) errors.push("llms.txt is incomplete.");

const lab = await text(join(dist, "labs", "agentic-systems.html"));
const labVisualCards = (lab.match(/class="system-card-art"/g) || []).length + (lab.match(/class="system-card-proof"/g) || []).length;
if (labVisualCards !== 10) errors.push("Agentic systems lab must publish ten project cards.");
for (const marker of ["Creator &amp; Talent Campaign OS", "creator-talent-campaign-os.vercel.app", "70 tests", "85.38 percent coverage", "Ten working AI systems"]) {
  if (!lab.includes(marker)) errors.push(`Creator & Talent Campaign OS lab evidence is missing: ${marker}`);
}
for (const marker of ["Agentic Systems Gateway", "agentic-systems-gateway.vercel.app", "85 tests", "40 production Postman assertions", "0 production 5xx"]) {
  if (!lab.includes(marker)) errors.push(`Agentic Systems Gateway lab evidence is missing: ${marker}`);
}

const creativeLearning = await text(join(dist, "case-studies", "creative-learning-os.html"));
for (const marker of ["Why this architecture, not just this tool list.", "Dataset and model boundary", "18 of 18 evaluation measures at target", "20 Prometheus metric objects", "Kubernetes is deferred", "automatic platform mutations"]) {
  if (!creativeLearning.includes(marker)) errors.push(`Creative Learning OS case study evidence is missing: ${marker}`);
}
for (const asset of [
  join(dist, "assets", "linkedin", "creative-learning-os.png"),
  join(dist, "assets", "linkedin", "creative-learning-os.svg"),
  join(dist, "assets", "case-studies", "creative-learning-os-system-context.png"),
  join(dist, "assets", "case-studies", "creative-learning-os-system-context.svg"),
]) {
  if (!await exists(asset)) errors.push(`Creative Learning OS release asset is missing: ${asset}`);
}

const creatorTalent = await text(join(dist, "case-studies", "creator-talent-campaign-os.html"));
for (const marker of ["What each framework is doing here.", "Why this architecture, not just this tool list.", "Dataset and model boundary", "18 of 18 evaluation measures", "24 Prometheus metric objects", "Kubernetes is deferred", "external campaign writes"]) {
  if (!creatorTalent.includes(marker)) errors.push(`Creator & Talent Campaign OS case study evidence is missing: ${marker}`);
}
for (const asset of [
  join(dist, "assets", "linkedin", "creator-talent-campaign-os.png"),
  join(dist, "assets", "linkedin", "creator-talent-campaign-os.svg"),
  join(dist, "assets", "case-studies", "creator-talent-campaign-os-system-context.png"),
  join(dist, "assets", "case-studies", "creator-talent-campaign-os-system-context.svg"),
]) {
  if (!await exists(asset)) errors.push(`Creator & Talent Campaign OS release asset is missing: ${asset}`);
}

const gateway = await text(join(dist, "case-studies", "agentic-systems-gateway.html"));
for (const marker of ["What each framework is doing here.", "Why this architecture, not just this tool list.", "Dataset and model boundary", "18 of 18 evaluation measures", "more than 15 signal families", "LangGraph is intentionally excluded", "zero production 5xx"]) {
  if (!gateway.includes(marker)) errors.push(`Agentic Systems Gateway case study evidence is missing: ${marker}`);
}
for (const asset of [
  join(dist, "assets", "linkedin", "agentic-systems-gateway.png"),
  join(dist, "assets", "linkedin", "agentic-systems-gateway.svg"),
  join(dist, "assets", "case-studies", "agentic-systems-gateway-system-context.png"),
  join(dist, "assets", "case-studies", "agentic-systems-gateway-system-context.svg"),
  join(dist, "assets", "case-studies", "agentic-systems-gateway-security-flow.svg"),
]) {
  if (!await exists(asset)) errors.push(`Agentic Systems Gateway release asset is missing: ${asset}`);
}

console.log(`Checked ${urls.length} sitemap URLs, ${linksChecked} internal links, ${imageAssetsChecked} image assets, and ${jsonLdBlocks} JSON-LD blocks.`);
for (const warning of warnings) console.warn(`WARN ${warning}`);
if (errors.length) {
  for (const error of errors) console.error(`ERROR ${error}`);
  process.exitCode = 1;
} else {
  console.log(`PASS: unique metadata, self-canonicals, one H1, structured data, social metadata, assets, and internal links are valid.`);
}
