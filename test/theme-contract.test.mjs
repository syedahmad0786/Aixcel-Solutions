import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = relative => readFile(new URL(relative, import.meta.url), "utf8");

test("the public site, lab, case studies, and Systems Desk expose the shared theme contract", async () => {
  const [home, desk, lab, creativeLearning, creatorTalent, gateway, css, script, build] = await Promise.all([
    source("../site/index.html"),
    source("../site/systems-desk.html"),
    source("../dist/labs/agentic-systems.html"),
    source("../dist/case-studies/creative-learning-os.html"),
    source("../dist/case-studies/creator-talent-campaign-os.html"),
    source("../dist/case-studies/agentic-systems-gateway.html"),
    source("../site/assets/theme.css"),
    source("../site/assets/theme.js"),
    source("../scripts/build-site.mjs"),
  ]);

  assert.match(home, /aixcel-color-theme/);
  assert.match(home, /class="aixcel-site"/);
  assert.match(desk, /id="theme-toggle"/);
  assert.match(desk, /class="systems-desk"/);
  assert.match(lab, /id="theme-toggle"/);
  assert.match(lab, /Ten working AI systems/);
  assert.match(creativeLearning, /id="theme-toggle"/);
  assert.match(creativeLearning, /Why this architecture, not just this tool list/);
  assert.match(creatorTalent, /id="theme-toggle"/);
  assert.match(creatorTalent, /What each framework is doing here/);
  assert.match(gateway, /id="theme-toggle"/);
  assert.match(gateway, /LangGraph is intentionally excluded/);
  assert.match(css, /html\[data-theme="dark"\]/);
  assert.match(css, /html\[data-theme="light"\] body\.systems-desk/);
  assert.match(script, /localStorage\.setItem/);
  assert.match(script, /prefers-color-scheme: dark/);
  assert.match(build, /themeToggle\(\)/);
});
