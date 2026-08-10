import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = relative => readFile(new URL(relative, import.meta.url), "utf8");

test("the public site and Systems Desk expose the shared theme contract", async () => {
  const [home, desk, css, script, build] = await Promise.all([
    source("../site/index.html"),
    source("../site/systems-desk.html"),
    source("../site/assets/theme.css"),
    source("../site/assets/theme.js"),
    source("../scripts/build-site.mjs"),
  ]);

  assert.match(home, /aixcel-color-theme/);
  assert.match(home, /class="aixcel-site"/);
  assert.match(desk, /id="theme-toggle"/);
  assert.match(desk, /class="systems-desk"/);
  assert.match(css, /html\[data-theme="dark"\]/);
  assert.match(css, /html\[data-theme="light"\] body\.systems-desk/);
  assert.match(script, /localStorage\.setItem/);
  assert.match(script, /prefers-color-scheme: dark/);
  assert.match(build, /themeToggle\(\)/);
});
