import { cp, copyFile, mkdir, rm, readdir, readFile, writeFile } from "node:fs/promises";

const dist = new URL("../dist/", import.meta.url);

await rm(dist, { recursive: true, force: true });
await cp(new URL("../redesign/", import.meta.url), dist, { recursive: true });
await rm(new URL("../dist/systems-desk/", import.meta.url), { recursive: true, force: true });
await mkdir(new URL("../dist/assets/", import.meta.url), { recursive: true });
await copyFile(new URL("../site/systems-desk.html", import.meta.url), new URL("../dist/systems-desk.html", import.meta.url));

for (const file of ["systems-desk.css", "systems-desk.js", "systems-desk-config.js", "theme.css", "theme.js"]) {
  await copyFile(new URL(`../site/assets/${file}`, import.meta.url), new URL(`../dist/assets/${file}`, import.meta.url));
}

// Inject once into public pages. The authenticated Systems Desk stays unmeasured.
// Keeping this in the active build avoids hand-editing 64 generated pages.
async function addAnalytics(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const url = new URL(entry.name + (entry.isDirectory() ? "/" : ""), directory);
    if (entry.isDirectory()) await addAnalytics(url);
    else if (entry.name.endsWith(".html") && entry.name !== "systems-desk.html") {
      const html = await readFile(url, "utf8");
      if (!html.includes('src="/assets/site-analytics.js"')) {
        await writeFile(url, html.replace(/<\/head>/i, '  <script defer src="/assets/site-analytics.js"></script>\n</head>'));
      }
    }
  }
}
await addAnalytics(dist);

console.log("Built the public redesign with Systems Desk preserved and consent-gated analytics.");
