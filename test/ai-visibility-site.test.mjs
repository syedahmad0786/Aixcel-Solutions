import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const read = (path, encoding = "utf8") => readFile(new URL(path, import.meta.url), encoding);
const distDir = fileURLToPath(new URL("../dist/", import.meta.url));

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}

test("uses AIEO, AEO, and GEO consistently and makes AI Search Visibility the entry service", async () => {
  const [build, home, knowledge, readme] = await Promise.all([
    read("../scripts/build-site.mjs"),
    read("../site/index.html"),
    read("../knowledge/service-ai-search-visibility.md"),
    read("../README.md"),
  ]);
  const content = [build, home, knowledge, readme].join("\n");
  assert.match(build, /AIEO \/ AEO \/ GEO for established service businesses/);
  assert.match(build, /01 · PRIMARY ENTRY/);
  assert.match(build, /02 · PRIVATE PILOT/);
  assert.match(knowledge, /AIEO.*AEO.*GEO/s);
  assert.doesNotMatch(content, /\bAIEU\b|\bGEU\b|AI-consultancy-call-with-ab/i);
});

test("uses one buyer-oriented primary navigation and a consolidated Work hub", async () => {
  const build = await read("../scripts/build-site.mjs");
  const headerSource = build.match(/function header\(active = ""\)[\s\S]*?\r?\n}\r?\n\r?\nfunction footer/)?.[0] ?? "";
  assert.ok(headerSource);
  const primaryLabels = [...headerSource.matchAll(/link\("\/[^"]+", "([^"]+)", "[^"]+"\)/g)].map((item) => item[1]);
  assert.deepEqual(primaryLabels, ["Services", "Work", "Insights", "About", "Contact"]);
  assert.doesNotMatch(headerSource.match(/const nav = `[\s\S]*?`;/)?.[0] ?? "", /AI Search|Systems Desk|Labs|Case studies|Process/);
  assert.match(headerSource, /class="header-utility" href="\/systems-desk"/);
  assert.match(build, /path: "\/work"[\s\S]*?type: "work"/);
  assert.match(build, /function workBody\(page\)/);
  assert.match(build, /@media\(max-width:780px\)\{\.site-footer\{grid-template-columns:1fr\}\}/);
  for (const path of ["/case-studies", "/labs/agentic-systems", "/process"]) {
    assert.match(build, new RegExp(`href=\\"${path.replaceAll("/", "\\/")}\\"`));
  }
});

test("ships the qualified audit funnel, gated guide, calendar, and noindex admin desk", async () => {
  const [build, script, core, desk, page, pdf, sitePdf] = await Promise.all([
    read("../scripts/build-site.mjs"),
    read("../site/assets/ai-visibility.js"),
    read("../server/ai-visibility-core.mjs"),
    read("../site/lead-desk.html"),
    read("../dist/services/ai-search-visibility.html"),
    read("../output/pdf/ai-search-visibility-brief.pdf", null),
    read("../site/assets/guides/ai-search-visibility-brief.pdf", null),
  ]);
  for (const field of ["requestType", "name", "email", "company", "website", "role", "aiGoal", "timing", "annualRevenue", "consent", "companyFax"]) {
    assert.match(build, new RegExp(`name=\\"${field}\\"`));
  }
  assert.match(build, /Get your free AEO audit/);
  assert.match(build, /id="aeo-quick-audit"/);
  assert.match(build, /id="free-aeo-audit"/);
  assert.match(build, /AI visibility score/);
  assert.match(build, /Competitor comparison/);
  assert.match(build, /Mentions and citations/);
  assert.match(build, /id="ai-visibility-guide-dialog"/);
  assert.match(build, /id="ai-visibility-guide-form"/);
  assert.match(build, /value="guide_download"/);
  assert.match(build, /Approximate annual company revenue/);
  assert.match(script, /guideDialog\.showModal/);
  assert.match(script, /formToken/);
  assert.doesNotMatch(script, /turnstile/i);
  assert.doesNotMatch(script, /window\.open/);
  assert.doesNotMatch(page, /href="\/guides\/ai-search-visibility-brief\.pdf"/);
  assert.match(script, /ui\.guideDownload\.href = result\.pdfUrl/);
  assert.match(script, /bookingSuccessfulV2/);
  assert.match(script, /utm_campaign: "free_aeo_audit"/);
  assert.match(script, /normalizeWebsite/);
  assert.match(script, /Prepare my audit email/);
  assert.match(core, /captureReady/);
  assert.match(script, /connectionFallback\.hidden = false/);
  assert.match(build, /id="ai-visibility-connection-fallback"/);
  assert.match(build, /Email the request/);
  assert.match(desk, /name="robots" content="noindex,nofollow(?:,noarchive)?"/);
  assert.match(desk, /AI Visibility Lead Desk/);
  assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
  assert.ok(pdf.byteLength > 10_000);
  assert.deepEqual(pdf, sitePdf);
});

test("presents the white-labelled offer as visibility, opportunities, and a strategy agent", async () => {
  const [build, page, script, motion] = await Promise.all([
    read("../scripts/build-site.mjs"),
    read("../dist/services/ai-search-visibility.html"),
    read("../site/assets/ai-visibility.js"),
    read("../site/assets/site-motion.js"),
  ]);
  for (const label of ["Visibility", "Opportunities", "Strategy Agent"]) {
    assert.match(page, new RegExp(`>${label}<`));
  }
  assert.match(build, /40\+ AEO, GEO, and marketing skills/);
  assert.match(page, /data-agent-question="competitor"/);
  assert.match(page, /data-agent-question="sentiment"/);
  assert.match(page, /data-agent-question="content"/);
  assert.match(script, /const agentAnswers =/);
  assert.match(script, /agentDemo\.steps\.replaceChildren/);
  assert.match(script, /const sampleViews =/);
  assert.match(script, /renderSampleView/);
  assert.match(motion, /IntersectionObserver/);
  assert.match(motion, /skippedAboveViewport/);
  assert.match(motion, /revealPassedTargets/);
  assert.match(build, /aixcel-aeo-answer-trails\.webp/);
  assert.match(build, /Interactive sample workspace/);
  assert.match(build, /service-system-visual/);
  assert.match(build, /home-service-visual/);
});

test("ships AIXCEL SIGNAL as a focused product with pricing, method, audit, and an activation-safe auth entry", async () => {
  const [home, pricing, method, audit, login, workspace, script, auth, workspaceScript, vercel, social] = await Promise.all([
    read("../dist/signal.html"),
    read("../dist/pricing.html"),
    read("../dist/method.html"),
    read("../dist/audit.html"),
    read("../dist/login.html"),
    read("../dist/workspace.html"),
    read("../site/assets/signal.js"),
    read("../site/assets/signal-auth.js"),
    read("../site/assets/signal-workspace.js"),
    read("../vercel.json"),
    read("../site/assets/og-aixcel-signal.png", null),
  ]);
  assert.match(home, /AIXCEL SIGNAL/);
  assert.match(home, /Know where[\s\S]*recommends you/);
  assert.match(home, /ILLUSTRATIVE WORKSPACE/);
  assert.match(home, /Visibility[\s\S]*Who appears instead[\s\S]*What to do next/);
  assert.match(home, /data-signal-view="competitors"/);
  assert.match(script, /const dashboardViews =/);
  assert.match(script, /requestType: data\.get\("requestType"\)/);
  assert.match(pricing, /\$8,000[\s\S]*\$15,000[\s\S]*\$20,000/);
  assert.match(pricing, /\$4,500/);
  assert.match(pricing, /100% credit/);
  assert.match(pricing, /No program includes a ranking or citation guarantee/);
  assert.match(method, /Visibility is a signal\. Qualified demand is the business result/);
  assert.match(method, /Buyer question[\s\S]*Observed answer[\s\S]*Source evidence[\s\S]*Priority action[\s\S]*Qualified demand/);
  for (const field of ["requestType", "website", "name", "email", "company", "role", "annualRevenue", "aiGoal", "timing", "consent", "companyFax"]) {
    assert.match(audit, new RegExp(`name=\\"${field}\\"`));
  }
  assert.match(login, /Private workspace/);
  assert.match(login, /Identity confirmation does not grant access/);
  assert.match(login, /Request activation/);
  assert.match(auth, /auth\/v1\/token\?grant_type=password/);
  assert.doesNotMatch(auth, /auth\/v1\/signup/);
  assert.match(auth, /auth\/v1\/recover/);
  assert.match(workspace, /No monitored brand is connected yet/);
  assert.match(workspace, /no client data/i);
  assert.match(workspace, /server-side authorization/);
  assert.match(workspace, /HttpOnly session boundary/);
  assert.match(workspaceScript, /auth\/v1\/user/);
  const routing = JSON.parse(vercel);
  const hasHostRewrite = (source, host, destination) => routing.rewrites.some((rule) => (
    rule.source === source
    && rule.destination === destination
    && rule.has?.some((condition) => condition.type === "host" && condition.value === host)
  ));
  assert.ok(hasHostRewrite("/", "signal.aixcelsolutions.com", "/signal"));
  assert.ok(hasHostRewrite("/robots.txt", "signal.aixcelsolutions.com", "/signal-robots.txt"));
  assert.ok(hasHostRewrite("/sitemap.xml", "signal.aixcelsolutions.com", "/signal-sitemap.xml"));
  assert.ok(hasHostRewrite("/", "aixcelsolutions.com", "/apex"));
  assert.ok(hasHostRewrite("/robots.txt", "aixcelsolutions.com", "/apex-robots.txt"));
  assert.ok(hasHostRewrite("/sitemap.xml", "aixcelsolutions.com", "/apex-sitemap.xml"));
  const rootFiles = new Set(await readdir(distDir));
  for (const name of ["apex.html", "apex-robots.txt", "apex-sitemap.xml", "signal.html", "signal-robots.txt", "signal-sitemap.xml"]) {
    assert.ok(rootFiles.has(name), `${name} must be emitted for host routing`);
  }
  for (const collision of ["index.html", "robots.txt", "sitemap.xml"]) {
    assert.ok(!rootFiles.has(collision), `${collision} would bypass the host rewrite because filesystem routes take precedence`);
  }
  assert.equal(social.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.equal(social.readUInt32BE(16), 1200);
  assert.equal(social.readUInt32BE(20), 630);
});

test("ships SIGNAL V2 with persistent dual themes, local platform marks, Motion depth, and a synthetic product film", async () => {
  const [home, method, pricing, audit, login, workspace, theme, motionSource, motionBundle, mp4, webm, poster] = await Promise.all([
    read("../dist/signal.html"),
    read("../dist/method.html"),
    read("../dist/pricing.html"),
    read("../dist/audit.html"),
    read("../dist/login.html"),
    read("../dist/workspace.html"),
    read("../site/assets/signal-theme.js"),
    read("../site/assets/signal-motion.jsx"),
    read("../site/assets/signal-motion.js"),
    read("../site/assets/signal-product-film.mp4", null),
    read("../site/assets/signal-product-film.webm", null),
    read("../site/assets/signal-film-poster.webp", null),
  ]);

  for (const page of [home, method, pricing, audit, login, workspace]) {
    assert.match(page, /data-signal-theme-toggle/);
    assert.match(page, /src="\/assets\/signal-theme\.js"/);
  }
  assert.match(theme, /aixcel\.signal\.theme/);
  assert.match(theme, /prefers-color-scheme: dark/);
  assert.match(theme, /localStorage\.setItem/);
  assert.match(theme, /aria-pressed/);

  for (const asset of [
    "chatgpt-openai-blossom.svg",
    "openai-wordmark.svg",
    "google.png",
    "gemini.svg",
    "perplexity.svg",
    "claude.svg",
    "copilot.svg",
    "deepseek.svg",
    "grok.svg",
  ]) assert.match(home, new RegExp(`/assets/platforms/${asset.replaceAll(".", "\\.")}`));
  assert.doesNotMatch(home, /google\.com\/s2\/favicons|faviconkit|icon\.horse/i);
  assert.equal((home.match(/class="platform-item/g) || []).length, 10);
  for (const marker of ["data-platform-explorer", "data-platform-spotlight-mark", "data-trend-primary", "data-source-donut", "data-engine-bars"]) {
    assert.match(home, new RegExp(marker));
  }

  for (const marker of ["MotionConfig", "LazyMotion", "useScroll", "useSpring", "useTransform", "useReducedMotion"]) {
    assert.match(motionSource, new RegExp(marker));
  }
  assert.match(motionSource, /max-width: 767px/);
  assert.match(motionSource, /data-motion-active-plane/);
  assert.match(motionSource, /selectStep/);
  assert.match(home, /id="signal-motion-root"/);
  assert.match(home, /src="\/assets\/signal-motion\.js"/);
  assert.ok(motionBundle.length > 25_000);

  assert.match(home, /class="signal-product-film"/);
  assert.match(home, /signal-product-film\.webm/);
  assert.match(home, /signal-product-film\.mp4/);
  assert.match(home, /signal-film-poster\.webp/);
  assert.match(home, /Synthetic demonstration · 21 seconds · no client data/);
  assert.equal(mp4.subarray(4, 8).toString(), "ftyp");
  assert.equal(webm.subarray(0, 4).toString("hex"), "1a45dfa3");
  assert.equal(poster.subarray(0, 4).toString(), "RIFF");
  assert.equal(poster.subarray(8, 12).toString(), "WEBP");
  assert.ok(mp4.byteLength > 1_000_000);
  assert.ok(webm.byteLength > 1_000_000);
});

test("removes long dash characters from every public text page and ships the visual plate suite", async () => {
  const files = await walk(distDir);
  const publicTextFiles = files.filter((file) => /\.(?:html|txt|xml|js|css)$/i.test(file));
  const content = (await Promise.all(publicTextFiles.map((file) => readFile(file, "utf8")))).join("\n");
  assert.doesNotMatch(content, /[—–]|&(?:m|n)dash;|&#(?:8211|8212);|&#x(?:2013|2014);/i);

  const plates = [
    "aixcel-operating-atlas.webp",
    "aixcel-aeo-answer-trails.webp",
    "aixcel-qualified-demand.webp",
    "aixcel-revenue-state-spine.webp",
    "aixcel-voice-intent-routing.webp",
    "aixcel-governed-agent-network.webp",
  ];
  for (const name of plates) {
    const image = await read(`../site/assets/visuals/${name}`, null);
    assert.equal(image.subarray(0, 4).toString(), "RIFF");
    assert.equal(image.subarray(8, 12).toString(), "WEBP");
    assert.ok(image.byteLength > 90_000);
    assert.ok(image.byteLength < 300_000);
  }
});

test("ships privacy-safe product screens across the buyer journey", async () => {
  const assets = [
    "aitlas-agent-access.webp",
    "atlas-analytics-synthetic-fixture.webp",
    "chirocandy-aios-access.webp",
    "creator-campaign-command.webp",
    "deal-rescue-forecast-truth.webp",
    "manhaj-live-control-plane.webp",
    "marketing-revenue-assurance.webp",
    "revenue-signal-graph.webp",
  ];
  for (const name of assets) {
    const image = await read(`../site/assets/product-proof/${name}`, null);
    assert.equal(image.subarray(0, 4).toString(), "RIFF");
    assert.equal(image.subarray(8, 12).toString(), "WEBP");
    assert.ok(image.byteLength > 30_000);
    assert.ok(image.byteLength < 120_000);
  }

  const [build, home, services, workspace, lead, crm, agentic, work, labs, marketingCase, dealCase] = await Promise.all([
    read("../scripts/build-site.mjs"),
    read("../dist/apex.html"),
    read("../dist/services.html"),
    read("../dist/solutions/ai-operations-workspace.html"),
    read("../dist/services/ai-lead-generation.html"),
    read("../dist/services/crm-automation.html"),
    read("../dist/services/agentic-workflows.html"),
    read("../dist/work.html"),
    read("../dist/labs/agentic-systems.html"),
    read("../dist/case-studies/marketing-revenue-assurance.html"),
    read("../dist/case-studies/deal-rescue-forecast-truth.html"),
  ]);
  assert.match(build, /Public replay · synthetic data/);
  assert.match(build, /Production interface · synthetic fixture/);
  assert.match(build, /Private access boundary/);
  assert.doesNotMatch(build, /searchable-agency-reference/);
  for (const page of [home, services, lead, work, labs]) assert.match(page, /revenue-signal-graph\.webp/);
  for (const page of [home, services, crm, work, labs, marketingCase]) assert.match(page, /marketing-revenue-assurance\.webp/);
  for (const page of [agentic, work, labs, dealCase]) assert.match(page, /deal-rescue-forecast-truth\.webp/);
  assert.match(crm, /atlas-analytics-synthetic-fixture\.webp/);
  assert.match(workspace, /manhaj-live-control-plane\.webp/);
  assert.match(workspace, /aitlas-agent-access\.webp/);
  assert.match(workspace, /chirocandy-aios-access\.webp/);
});

test("keeps public claims behind an evidence approval gate", async () => {
  const [build, evidence] = await Promise.all([
    read("../scripts/build-site.mjs"),
    read("../evidence/ai-search-visibility.json"),
  ]);
  const parsed = JSON.parse(evidence);
  assert.equal(parsed.status, "public-no-performance-claims");
  assert.deepEqual(parsed.claims, []);
  assert.match(build, /public-no-performance-claims/);
  assert.match(build, /no-performance-claims release requires an empty public evidence record/);
  assert.match(build, /Public service release · evidence gate active/);
  assert.match(build, /No client performance finding is published yet/);
  assert.match(build, /public release requires approved, sourced audit evidence/);
  assert.match(build, /claim\.publicApproved !== true/);
  assert.match(build, /previewGated/);
});

test("enforces server-only capture, admin RLS, booking reconciliation, and auditable changes", async () => {
  const [sql, core, envExample, storageBridge] = await Promise.all([
    read("../supabase/migrations/202608110001_ai_visibility_leads.sql"),
    read("../server/ai-visibility-core.mjs"),
    read("../.env.example"),
    read("../supabase/functions/ai-visibility-storage/index.ts"),
  ]);
  assert.match(sql, /force row level security/g);
  assert.match(sql, /app_metadata' ->> 'role'.*= 'admin'/);
  assert.match(sql, /grant execute on function public\.capture_ai_visibility_lead[\s\S]*to service_role/);
  assert.match(sql, /record_ai_visibility_booking/);
  assert.match(sql, /ai_visibility_booking_events/);
  assert.match(sql, /annual_revenue_range/);
  assert.match(sql, /request_type/);
  assert.match(sql, /lead_capture_rate_limits/);
  assert.match(sql, /create unique index ai_visibility_leads_identity_idx/);
  assert.match(sql, /pg_advisory_xact_lock/);
  assert.match(sql, /ai_visibility_lead_change_event/);
  assert.doesNotMatch(sql, /grant execute on function public\.capture_ai_visibility_lead[\s\S]{0,200}to anon/);
  assert.match(core, /verifyFormToken/);
  assert.match(core, /AI_VISIBILITY_STORAGE_URL/);
  assert.match(core, /await notifyLead/);
  assert.match(core, /signedLeadRef/);
  assert.match(storageBridge, /jwtVerify/);
  assert.match(storageBridge, /VERCEL_PROJECT_ID/);
  assert.match(storageBridge, /SUPABASE_SECRET_KEYS/);
  for (const key of ["AI_VISIBILITY_STORAGE_URL", "SUPABASE_SERVICE_ROLE_KEY", "LEAD_FINGERPRINT_SECRET", "LEAD_REF_SECRET", "RESEND_API_KEY", "CAL_WEBHOOK_SECRET"]) {
    assert.match(envExample, new RegExp(`^${key}=`, "m"));
  }
});

test("ships a correctly sized dedicated social image", async () => {
  const png = await read("../site/assets/og-ai-search-visibility.png", null);
  assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
});

test("ships an optimized original AEO answer-intelligence panorama", async () => {
  const jpg = await read("../site/assets/aeo-answer-intelligence-panorama-v2.jpg", null);
  assert.equal(jpg.subarray(0, 3).toString("hex"), "ffd8ff");
  assert.ok(jpg.byteLength > 100_000);
  assert.ok(jpg.byteLength < 400_000);
});
