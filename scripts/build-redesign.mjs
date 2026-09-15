import { cp, copyFile, mkdir, rm } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const dist = new URL("../dist/", import.meta.url);

await rm(dist, { recursive: true, force: true });
await cp(new URL("../redesign/", import.meta.url), dist, { recursive: true });
await rm(new URL("../dist/systems-desk/", import.meta.url), { recursive: true, force: true });
await mkdir(new URL("../dist/assets/", import.meta.url), { recursive: true });
await copyFile(new URL("../site/systems-desk.html", import.meta.url), new URL("../dist/systems-desk.html", import.meta.url));

for (const file of ["systems-desk.css", "systems-desk.js", "systems-desk-config.js", "theme.css", "theme.js"]) {
  await copyFile(new URL(`../site/assets/${file}`, import.meta.url), new URL(`../dist/assets/${file}`, import.meta.url));
}

console.log("Built the public redesign with Systems Desk preserved.");
