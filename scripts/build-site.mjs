import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = join(repo, "site");
const outputDir = join(repo, "dist");
const origin = "https://aixcelsolutions.com";
const published = "2026-08-12";
const ogImage = `${origin}/assets/og-aixcel.png`;
const aiVisibilityOgImage = `${origin}/assets/og-ai-search-visibility.png`;
const baseBooking = "https://cal.com/ahmad-bukhari/revenue-handoff-map";
const aiVisibilityReleaseMode = process.env.AIXCEL_AI_VISIBILITY_RELEASE || "preview";
if (!["preview", "public-no-performance-claims", "approved"].includes(aiVisibilityReleaseMode)) {
  throw new Error(`Unsupported AI Search Visibility release mode: ${aiVisibilityReleaseMode}`);
}
const aiVisibilityRelease = aiVisibilityReleaseMode !== "preview";

if (!outputDir.startsWith(`${repo}${sep}`) || relative(repo, outputDir) !== "dist") {
  throw new Error(`Refusing to clear unexpected output path: ${outputDir}`);
}

const sourceHome = await readFile(join(sourceDir, "index.html"), "utf8");
const systemsDeskSource = await readFile(join(sourceDir, "systems-desk.html"), "utf8");
const leadDeskSource = await readFile(join(sourceDir, "lead-desk.html"), "utf8");
const signalSource = await readFile(join(sourceDir, "signal.html"), "utf8");
const signalLoginSource = await readFile(join(sourceDir, "login.html"), "utf8");
const signalWorkspaceSource = await readFile(join(sourceDir, "workspace.html"), "utf8");
const signalPricingSource = await readFile(join(sourceDir, "pricing.html"), "utf8");
const signalMethodSource = await readFile(join(sourceDir, "method.html"), "utf8");
const signalAuditSource = await readFile(join(sourceDir, "audit.html"), "utf8");
const themeCss = await readFile(join(sourceDir, "assets", "theme.css"), "utf8");
const siteMotionSource = await readFile(join(sourceDir, "assets", "site-motion.js"), "utf8");
const aiVisibilityEvidence = JSON.parse(await readFile(join(repo, "evidence", "ai-search-visibility.json"), "utf8"));
const aiVisibilityClaims = Array.isArray(aiVisibilityEvidence.claims) ? aiVisibilityEvidence.claims : [];
if (aiVisibilityReleaseMode === "public-no-performance-claims" && (
  aiVisibilityEvidence.status !== "public-no-performance-claims"
  || aiVisibilityClaims.length !== 0
)) {
  throw new Error("The no-performance-claims release requires an empty public evidence record.");
}
if (aiVisibilityReleaseMode === "approved" && (
  aiVisibilityEvidence.status !== "approved"
  || !aiVisibilityClaims.length
  || aiVisibilityClaims.some((claim) => claim.publicApproved !== true || !claim.source || !claim.claim)
)) {
  throw new Error("AI Search Visibility public release requires approved, sourced audit evidence.");
}
const styleMatch = sourceHome.match(/<style>([\s\S]*?)<\/style>/i);
if (!styleMatch) throw new Error("The production homepage must contain its base <style> block.");

const detailCss = String.raw`
.site-footer{grid-template-columns:.8fr 1.2fr}
.footer-links{grid-template-columns:repeat(3,minmax(0,1fr));gap:30px}
.footer-links a{width:auto}
.desktop-nav a[aria-current="page"]::after{width:100%}
.header-utility{white-space:nowrap;color:var(--stone);font-family:var(--font-geist-mono,"SFMono-Regular",Consolas,monospace);font-size:11px;letter-spacing:.04em;text-decoration:underline;text-decoration-color:transparent;text-underline-offset:5px;transition:color 180ms ease,text-decoration-color 180ms ease}
.header-utility:hover{color:var(--aubergine);text-decoration-color:currentColor}
.work-hub-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;border:1px solid var(--line);background:var(--line)}
.work-hub-card{min-height:350px;padding:34px;display:flex;flex-direction:column;background:var(--paper)}
.work-hub-card>span,.featured-work-card>span{color:var(--aubergine);font-family:var(--font-geist-mono,"SFMono-Regular",Consolas,monospace);font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
.work-hub-card h3{margin:60px 0 18px;font-family:var(--serif);font-size:34px;font-weight:400;line-height:1.05}
.work-hub-card p{margin:0;color:var(--stone);line-height:1.65}
.work-hub-card a{margin-top:auto;padding-top:28px;color:var(--aubergine);font-weight:700;text-decoration:underline;text-underline-offset:5px}
.work-hub-entry{margin:-18px 0 42px;padding:18px 22px;display:flex;align-items:center;justify-content:space-between;gap:24px;border-left:4px solid var(--lime);background:rgba(80,44,82,.07)}
.work-hub-entry p{margin:0;line-height:1.55}
.work-hub-entry a{flex:0 0 auto;color:var(--aubergine);font-weight:700;text-decoration:underline;text-underline-offset:5px}
.featured-work-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
.featured-work-card{min-height:310px;padding:28px;border:1px solid rgba(244,240,232,.28);display:flex;flex-direction:column}
.featured-work-card>span{color:var(--lime)}
.featured-work-card h3{margin:42px 0 16px;font-family:var(--serif);font-size:30px;font-weight:400;line-height:1.08}
.featured-work-card p{margin:0;color:rgba(251,248,242,.8);font-size:14px;line-height:1.65}
.featured-work-card a{margin-top:auto;padding-top:25px;color:var(--lime);font-weight:700;text-decoration:underline;text-underline-offset:5px}
.mobile-menu .mobile-utility{color:var(--stone);font-family:var(--font-geist-mono,"SFMono-Regular",Consolas,monospace);font-size:11px;letter-spacing:.04em}
.service-directory-inline{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1px;margin-top:42px;background:rgba(244,240,232,.24);border:1px solid rgba(244,240,232,.24)}
.service-directory-inline a{min-height:82px;display:flex;align-items:center;padding:18px;background:var(--aubergine-dark);color:rgba(251,248,242,.86);font-size:13px;line-height:1.35;transition:background 180ms ease,color 180ms ease}
.service-directory-inline a:hover{background:rgba(255,255,255,.08);color:var(--lime)}
.detail-main{padding-bottom:0}
.breadcrumbs{width:min(1180px,calc(100% - 80px));margin:0 auto;padding-top:28px;color:var(--stone);font-family:var(--font-geist-mono,"SFMono-Regular",Consolas,monospace);font-size:12px}
.breadcrumbs ol{display:flex;flex-wrap:wrap;gap:8px;margin:0;padding:0;list-style:none}
.breadcrumbs li+li::before{margin-right:8px;content:"/";opacity:.5}
.breadcrumbs a{text-decoration:underline;text-underline-offset:4px}
.page-hero{width:min(1180px,calc(100% - 80px));margin:0 auto;padding:58px 0 72px;display:grid;grid-template-columns:minmax(0,1.14fr) minmax(320px,.86fr);gap:clamp(38px,5vw,68px);align-items:center}
.page-hero h1{max-width:780px;margin:0;font-size:clamp(48px,5.4vw,74px);font-weight:430;letter-spacing:-.052em;line-height:.98}
.page-hero h1 em{font-family:var(--serif);font-weight:400}
.page-hero-copy>.eyebrow{margin-bottom:24px}
.page-deck{max-width:690px;margin:24px 0 0;font-size:clamp(17px,1.65vw,20px);line-height:1.58}
.hero-aside{padding:28px;border:1px solid var(--line);background:rgba(255,255,255,.28)}
.hero-aside strong{display:block;margin-bottom:14px;color:var(--aubergine);font-family:var(--font-geist-mono,"SFMono-Regular",Consolas,monospace);font-size:11px;letter-spacing:.1em;text-transform:uppercase}
.hero-aside p{margin:0;font-size:15px;line-height:1.65}
.hero-aside .button{width:100%;margin-top:24px}
.answer-band{background:var(--lime);color:var(--ink)}
.answer-inner{width:min(1180px,calc(100% - 80px));margin:0 auto;padding:36px 0;display:grid;grid-template-columns:180px 1fr;gap:42px}
.answer-inner strong{font-family:var(--font-geist-mono,"SFMono-Regular",Consolas,monospace);font-size:12px;letter-spacing:.12em;text-transform:uppercase}
.answer-inner p{max-width:860px;margin:0;font-family:var(--serif);font-size:clamp(23px,2.6vw,34px);line-height:1.22}
.content-section{width:min(1180px,calc(100% - 80px));margin:0 auto;padding:88px 0}
.content-section+.content-section{border-top:1px solid var(--line)}
.section-intro{display:block;max-width:860px;margin:0 0 44px}
.section-intro>.eyebrow{margin:0 0 14px}
.section-intro h2{max-width:820px;margin:0;font-size:clamp(38px,4.5vw,60px);font-weight:430;letter-spacing:-.043em;line-height:1.02}
.section-intro>p:not(.eyebrow){max-width:660px;margin:18px 0 0;font-size:16px;line-height:1.68}
.card-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.content-card{min-height:0;padding:28px;border:1px solid var(--line);background:rgba(255,255,255,.22)}
.content-card+.content-card{padding-left:28px}
.content-card>span{color:var(--aubergine);font-family:var(--font-geist-mono,"SFMono-Regular",Consolas,monospace);font-size:11px;font-weight:700}
.content-card h3{margin:28px 0 14px;font-family:var(--serif);font-size:29px;font-weight:400;line-height:1.08}
.content-card p{margin:0;color:#47433f;font-size:14px;line-height:1.65}
.content-card a{display:inline-block;margin-top:22px;color:var(--aubergine);font-weight:650;text-decoration:underline;text-underline-offset:5px}
.system-card-art{display:block;width:100%;height:auto;aspect-ratio:4/5;margin:0 0 28px;border:1px solid var(--line);object-fit:cover;object-position:top}
.dark-section{max-width:none;width:100%;padding:88px max(40px,calc((100vw - 1180px)/2));background:var(--aubergine-dark);color:var(--paper-bright)}
.dark-section .section-intro p,.dark-section .content-card p{color:rgba(251,248,242,.82)}
.dark-section .content-card{border-color:rgba(244,240,232,.25)}
.dark-section .content-card{background:rgba(255,255,255,.035)}
.dark-section .content-card>span,.dark-section .content-card a{color:var(--lime)}
.checklist{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;background:var(--line);border:1px solid var(--line)}
.checklist article{padding:30px;background:var(--paper)}
.checklist h3{margin:0 0 12px;font-family:var(--serif);font-size:27px;font-weight:400}
.checklist p{margin:0;color:#47433f;line-height:1.65}
.checklist .yes::before,.checklist .no::before{display:inline-grid;width:25px;height:25px;margin:0 12px 4px 0;place-items:center;border-radius:50%;font-family:var(--sans);font-size:13px;font-weight:800;vertical-align:middle}
.checklist .yes::before{background:var(--lime);content:"✓"}
.checklist .no::before{border:1px solid var(--aubergine);content:"×"}
.process-list{counter-reset:steps;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border-top:1px solid var(--ink)}
.process-list article{counter-increment:steps;min-height:290px;padding:30px 26px;border-right:1px solid var(--line)}
.process-list article:last-child{border-right:0}
.process-list article::before{color:var(--aubergine);content:"0" counter(steps);font-family:var(--font-geist-mono,"SFMono-Regular",Consolas,monospace);font-size:11px}
.process-list h3{margin:60px 0 16px;font-family:var(--serif);font-size:28px;font-weight:400}
.process-list p{margin:0;color:#47433f;font-size:14px;line-height:1.65}
.metric-band{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));background:var(--aubergine-dark);color:var(--paper-bright)}
.metric-band>div{padding:48px;border-right:1px solid rgba(244,240,232,.25)}
.metric-band>div:last-child{border-right:0}
.metric-band strong{display:block;color:var(--lime);font-family:var(--serif);font-size:54px;font-weight:400}
.metric-band span{display:block;margin-top:8px;font-size:13px;line-height:1.45}
.evidence-label{margin:18px 0 0;color:var(--stone);font-family:var(--font-geist-mono,"SFMono-Regular",Consolas,monospace);font-size:11px}
.prose{max-width:820px}
.prose h2{margin:70px 0 18px;font-size:clamp(32px,4vw,48px);font-weight:430;letter-spacing:-.035em}
.prose h2:first-child{margin-top:0}
.prose h3{margin:40px 0 14px;font-family:var(--serif);font-size:28px;font-weight:400}
.prose p,.prose li{font-size:16px;line-height:1.75}
.prose a{color:var(--aubergine);font-weight:650;text-decoration:underline;text-underline-offset:4px}
.prose ul{padding-left:22px}
.fact-table{width:100%;border-collapse:collapse}
.fact-table th,.fact-table td{padding:20px 18px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top;line-height:1.55}
.fact-table th{width:31%;color:var(--aubergine);font-family:var(--font-geist-mono,"SFMono-Regular",Consolas,monospace);font-size:11px;letter-spacing:.06em;text-transform:uppercase}
.detail-faq{background:var(--paper-bright)}
.detail-faq .faq-list{max-width:900px;margin-top:50px}
.detail-faq details{border-color:var(--line)}
.detail-faq summary{color:var(--ink)}
.detail-faq details p{color:#47433f}
.cta-band{padding:90px max(36px,calc((100vw - 1160px)/2));background:var(--aubergine);color:var(--paper-bright)}
.cta-grid{display:grid;grid-template-columns:1.25fr .75fr;gap:70px;align-items:end}
.cta-grid h2{max-width:800px;margin:0;font-size:clamp(44px,6vw,76px);font-weight:420;letter-spacing:-.05em;line-height:.98}
.cta-copy p{margin:0 0 28px;color:rgba(251,248,242,.84);font-size:17px;line-height:1.65}
.cta-copy .button{width:100%;border-color:var(--lime);background:var(--lime);color:var(--ink)}
.related-links{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
.related-links a{min-height:120px;padding:24px;border:1px solid var(--line);font-family:var(--serif);font-size:24px;line-height:1.1;transition:background 180ms ease,color 180ms ease}
.related-links a:hover{background:var(--aubergine);color:var(--paper-bright)}
.legal-note{padding:22px;border-left:4px solid var(--lime);background:rgba(200,255,46,.16);font-size:14px;line-height:1.65}
.article-visual{width:min(1160px,calc(100% - 72px));margin:0 auto 24px;position:relative;overflow:hidden;background:var(--aubergine-dark);border:1px solid var(--line)}
.article-visual img{display:block;width:100%;height:auto;aspect-ratio:16/9;object-fit:cover}
.article-visual figcaption{padding:13px 18px;background:var(--aubergine-dark);color:rgba(251,248,242,.8);font-size:12px;line-height:1.5}
.case-architecture img{aspect-ratio:auto;object-fit:contain;background:#101515}
.field-note-mark{position:absolute;top:20px;left:20px;display:flex;align-items:center;gap:10px;padding:10px 12px;background:rgba(27,27,26,.86);border:1px solid rgba(244,240,232,.38);color:var(--paper-bright);font-family:var(--font-geist-mono,"SFMono-Regular",Consolas,monospace);font-size:10px;letter-spacing:.1em;text-transform:uppercase}
.field-note-mark img{width:22px;height:22px;aspect-ratio:1;object-fit:contain}
.article-byline{width:min(1160px,calc(100% - 72px));margin:0 auto 42px;color:var(--stone);font-family:var(--font-geist-mono,"SFMono-Regular",Consolas,monospace);font-size:12px;letter-spacing:.04em}.article-byline a{color:var(--aubergine);font-weight:700;text-decoration:underline;text-underline-offset:4px}
.article-layout{display:grid;grid-template-columns:minmax(0,820px) minmax(220px,1fr);gap:72px;align-items:start}
.article-prose h2{margin:72px 0 20px;font-size:clamp(33px,4vw,50px);font-weight:430;letter-spacing:-.04em;line-height:1.03}
.article-prose h2:first-child{margin-top:0}
.article-prose p,.article-prose li{font-size:17px;line-height:1.8}
.article-prose p{margin:0 0 22px}
.article-prose ul,.article-prose ol{padding-left:24px;margin:0 0 25px}
.article-prose li+li{margin-top:9px}
.article-prose a{color:var(--aubergine);font-weight:650;text-decoration:underline;text-underline-offset:4px}
.article-takeaways{padding:26px;background:var(--aubergine-dark);color:var(--paper-bright)}
.article-takeaways h2{margin:0 0 18px;font-family:var(--serif);font-size:32px;font-weight:400;line-height:1.05}
.article-takeaways ul{margin:0;padding-left:20px}
.article-takeaways li{margin:0 0 12px;font-size:15px;line-height:1.65}
.article-sources{position:sticky;top:24px;padding:22px;border-top:3px solid var(--lime);background:rgba(255,255,255,.34)}
.article-sources h2{margin:0 0 16px;font-size:15px;letter-spacing:.03em}
.article-sources ol{margin:0;padding-left:18px}
.article-sources li{margin:0 0 15px;font-size:13px;line-height:1.55}
.article-sources a{color:var(--aubergine);font-weight:700;text-decoration:underline;text-underline-offset:3px}
.article-sources small{display:block;margin-top:4px;color:#47433f;line-height:1.45}
.product-proof-showcase{position:relative}
.product-proof-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px;align-items:start}
.product-proof-grid.is-three{grid-template-columns:repeat(3,minmax(0,1fr))}
.product-proof{min-width:0;margin:0;overflow:hidden;border:1px solid rgba(80,44,82,.22);border-radius:18px;background:var(--paper-bright);box-shadow:0 22px 70px rgba(35,20,37,.10);color:var(--ink)}
.product-proof.is-wide{grid-column:1/-1}
.product-proof-window{display:block;overflow:hidden;background:#f5f2eb;color:inherit;text-decoration:none}
.proof-window-bar{min-height:42px;padding:0 14px;display:flex;align-items:center;justify-content:space-between;gap:16px;border-bottom:1px solid rgba(80,44,82,.15);background:rgba(251,248,242,.94)}
.proof-window-dots{display:flex;gap:6px}
.proof-window-dots i{width:7px;height:7px;border-radius:50%;background:rgba(80,44,82,.28)}
.proof-window-dots i:first-child{background:var(--lime)}
.proof-window-bar strong{overflow:hidden;color:var(--aubergine);font-family:var(--font-geist-mono,"SFMono-Regular",Consolas,monospace);font-size:9px;font-weight:750;letter-spacing:.08em;text-overflow:ellipsis;text-transform:uppercase;white-space:nowrap}
.product-proof-image{position:relative;overflow:hidden;aspect-ratio:36/25;background:#ece8df}
.product-proof-image::after{position:absolute;inset:0;pointer-events:none;box-shadow:inset 0 0 0 1px rgba(27,27,26,.08);content:""}
.product-proof-image img{display:block;width:100%;height:100%;object-fit:cover;object-position:top center;transition:transform 420ms cubic-bezier(.2,.7,.2,1)}
.product-proof-window:hover .product-proof-image img{transform:scale(1.018)}
.proof-crop-access .product-proof-image img{object-position:right center;transform:scale(1.34);transform-origin:right center}
.proof-crop-access:hover .product-proof-image img{transform:scale(1.37)}
.proof-crop-manhaj .product-proof-image img{object-position:center bottom;transform:scale(1.09);transform-origin:center bottom}
.proof-crop-manhaj:hover .product-proof-image img{transform:scale(1.115)}
.product-proof figcaption{padding:24px 25px 27px}
.product-proof figcaption>span{display:block;margin-bottom:11px;color:var(--aubergine);font-family:var(--font-geist-mono,"SFMono-Regular",Consolas,monospace);font-size:10px;font-weight:750;letter-spacing:.09em;text-transform:uppercase}
.product-proof figcaption h3{margin:0;font-family:var(--serif);font-size:clamp(26px,2.4vw,36px);font-weight:400;line-height:1.03}
.product-proof figcaption p{margin:13px 0 0;color:#514b47;font-size:14px;line-height:1.63}
.product-proof figcaption a{display:inline-block;margin-top:17px;color:var(--aubergine);font-size:13px;font-weight:750;text-decoration:underline;text-underline-offset:5px}
.product-proof-thumbnail{width:100%;height:100%;overflow:hidden;background:#eee9e1}
.product-proof-thumbnail .proof-window-bar{min-height:38px}
.product-proof-thumbnail .product-proof-image{height:100%;min-height:210px;aspect-ratio:36/25}
.product-proof-thumbnail .product-proof-image img{transition:transform 420ms cubic-bezier(.2,.7,.2,1)}
.service-showcase-visual:hover .product-proof-thumbnail .product-proof-image img,.system-card-proof:hover .product-proof-thumbnail .product-proof-image img{transform:scale(1.02)}
.system-card-proof{display:block;margin:0 0 28px;border:1px solid var(--line);border-radius:12px;overflow:hidden}
.system-card-proof .product-proof-thumbnail .product-proof-image{min-height:0;aspect-ratio:36/25}
.system-card-art--screen{aspect-ratio:36/25;object-position:top}
.home-product-proof{max-width:none;width:100%;padding:104px max(40px,calc((100vw - 1180px)/2));background:var(--aubergine-dark);color:var(--paper-bright)}
.home-product-proof .section-intro>p:not(.eyebrow){color:rgba(251,248,242,.78)}
.home-product-proof .product-proof-grid{gap:18px}
.home-product-proof .product-proof figcaption h3{font-size:30px}
.case-live-proof{padding-bottom:48px}
.case-live-proof+.article-visual{margin-top:0}
@media(max-width:980px){.article-layout{grid-template-columns:1fr;gap:36px}.article-sources{position:static}.article-visual{width:min(100% - 72px,1160px)}}
@media(max-width:680px){.article-visual,.article-byline{width:calc(100% - 40px)}.field-note-mark{top:12px;left:12px;padding:8px 9px;font-size:8px}.field-note-mark img{width:18px;height:18px}.article-prose p,.article-prose li{font-size:16px}}
@media(max-width:1180px){.header-utility{display:none}}
@media(max-width:980px){.service-directory-inline{grid-template-columns:repeat(2,minmax(0,1fr))}.page-hero,.cta-grid{grid-template-columns:1fr}.page-hero{gap:36px}.answer-inner{grid-template-columns:1fr;gap:14px}.card-grid,.work-hub-grid,.featured-work-grid{grid-template-columns:1fr}.work-hub-card,.featured-work-card{min-height:0}.content-card,.content-card+.content-card{min-height:0;padding:26px;border:1px solid var(--line)}.process-list{grid-template-columns:repeat(2,minmax(0,1fr))}.metric-band{grid-template-columns:1fr}.metric-band>div{border-right:0;border-bottom:1px solid rgba(244,240,232,.25)}.related-links{grid-template-columns:1fr}.product-proof-grid.is-three{grid-template-columns:1fr 1fr}.product-proof-grid.is-three .product-proof:last-child{grid-column:1/-1}}
@media(max-width:780px){.site-footer{grid-template-columns:1fr}}
@media(max-width:680px){.footer-links{grid-template-columns:1fr;gap:28px}.footer-links,.footer-bottom{min-width:0;max-width:100%}.footer-links a{max-width:100%;overflow-wrap:anywhere}.service-directory-inline{grid-template-columns:1fr}.breadcrumbs,.page-hero,.answer-inner,.content-section{width:min(100% - 40px,1180px)}.breadcrumbs{padding-top:20px}.page-hero{padding:44px 0 58px}.page-hero h1{font-size:clamp(40px,12vw,58px)}.content-section,.dark-section{padding-top:62px;padding-bottom:62px}.dark-section,.cta-band{padding-left:20px;padding-right:20px}.section-intro{margin-bottom:34px}.section-intro h2{font-size:clamp(34px,10vw,46px)}.checklist,.process-list{grid-template-columns:1fr}.process-list article{min-height:0;border-right:0;border-bottom:1px solid var(--line)}.metric-band>div{padding:34px 24px}.fact-table th,.fact-table td{display:block;width:100%;padding:12px 0}.fact-table th{padding-top:22px;border-bottom:0}.related-links a{min-height:90px}.work-hub-card{padding:26px}.work-hub-card h3{margin-top:42px}.work-hub-entry{align-items:flex-start;flex-direction:column}.product-proof-grid,.product-proof-grid.is-three{grid-template-columns:1fr}.product-proof.is-wide,.product-proof-grid.is-three .product-proof:last-child{grid-column:auto}.product-proof{border-radius:14px}.proof-window-bar{min-height:38px;padding:0 11px}.proof-window-bar strong{max-width:74%;font-size:8px}.product-proof figcaption{padding:21px 20px 24px}.product-proof figcaption h3{font-size:29px}.home-product-proof{padding:70px 20px}}
`;

const style = `${styleMatch[1]}\n${detailCss}\n${themeCss}`;

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const publicText = (value) => String(value)
  .replace(/(\d)\s*[–—]\s*(\d)/g, "$1 to $2")
  .replace(/\s*[–—]\s*/g, ", ")
  .replace(/&(?:m|n)dash;|&#(?:8211|8212);|&#x(?:2013|2014);/gi, ", ")
  .replace(/(<a\b[^>]*\bid="ai-visibility-(?:result-pdf|guide-download)"[^>]*?)\s+href="\/guides\/ai-search-visibility-brief\.pdf"/gi, "$1");

const visualPlates = {
  home: {
    src: "/assets/visuals/aixcel-operating-atlas.webp",
    alt: "Five business signals converging through controlled decision layers into one verified evidence receipt",
    caption: "Five operating signals become one decision with evidence attached.",
  },
  aeo: {
    src: "/assets/visuals/aixcel-aeo-answer-trails.webp",
    alt: "Website and buyer question signals becoming citation evidence, competitor context, and a prioritized AEO decision",
    caption: "Answer trails expose visibility, source gaps, and the next useful move.",
  },
  lead: {
    src: "/assets/visuals/aixcel-qualified-demand.webp",
    alt: "Inbound demand signals passing through fit, need, and timing gates into a qualified human owned opportunity",
    caption: "Demand passes through qualification before it reaches a calendar.",
  },
  crm: {
    src: "/assets/visuals/aixcel-revenue-state-spine.webp",
    alt: "Fragmented customer records being reconciled into a reliable revenue state, owner, and evidence receipt",
    caption: "Scattered records reconcile into one owned next action.",
  },
  voice: {
    src: "/assets/visuals/aixcel-voice-intent-routing.webp",
    alt: "A voice signal passing through intent, identity, and policy controls before scheduling or human handoff",
    caption: "Voice intent moves through policy before any business action.",
  },
  agentic: {
    src: "/assets/visuals/aixcel-governed-agent-network.webp",
    alt: "Bounded specialist agents coordinating through a policy core, human approval gate, and verified receipt path",
    caption: "Specialist agents coordinate inside a visible approval boundary.",
  },
};

const servicePlateKey = new Map([
  ["/services/ai-search-visibility", "aeo"],
  ["/services/ai-lead-generation", "lead"],
  ["/services/crm-automation", "crm"],
  ["/services/voice-ai", "voice"],
  ["/services/agentic-workflows", "agentic"],
]);

function plateKeyFor(pageOrPath) {
  const page = typeof pageOrPath === "string" ? { path: pageOrPath } : pageOrPath;
  const path = page.path || "/";
  if (servicePlateKey.has(path)) return servicePlateKey.get(path);
  if (page.type === "insight" || page.type === "policy") return null;
  if (path.includes("voice")) return "voice";
  if (path.includes("lead")) return "lead";
  if (path.includes("crm") || path.includes("deal-rescue") || path.includes("business-intelligence") || path.includes("marketing-revenue")) return "crm";
  if (path.includes("agentic") || path.includes("automation") || path.includes("workspace") || path === "/process") return "agentic";
  if (["/", "/services", "/work", "/about", "/contact", "/case-studies", "/insights"].includes(path)) return "home";
  return null;
}

function visualPlate(pageOrKey, className = "editorial-plate", loading = "lazy") {
  const key = visualPlates[pageOrKey] ? pageOrKey : plateKeyFor(pageOrKey);
  const plate = key ? visualPlates[key] : null;
  if (!plate) return "";
  return `<figure class="${className}"><div class="plate-image"><img src="${plate.src}" alt="${escapeHtml(plate.alt)}" width="1536" height="1024" loading="${loading}" decoding="async"></div><figcaption><span>AiXCEL systems plate</span><p>${escapeHtml(plate.caption)}</p></figcaption></figure>`;
}

function visualPlateThumbnail(pageOrKey) {
  const key = visualPlates[pageOrKey] ? pageOrKey : plateKeyFor(pageOrKey);
  const plate = key ? visualPlates[key] : null;
  if (!plate) return "";
  return `<div class="plate-thumbnail"><img src="${plate.src}" alt="${escapeHtml(plate.alt)}" width="1536" height="1024" loading="eager" decoding="async"><span>AiXCEL systems plate</span></div>`;
}

const productProofs = {
  creator: {
    src: "/assets/product-proof/creator-campaign-command.webp",
    alt: "Creator Campaign Command interface showing a synthetic creator plan ready for human review",
    status: "Public replay · synthetic data",
    eyebrow: "Live product screen",
    title: "Creator Campaign Command",
    caption: "Five bounded roles rank a synthetic creator plan and stop before outreach or spend. Every decision stays inspectable.",
    href: "https://creator-campaign-command.vercel.app",
  },
  marketing: {
    src: "/assets/product-proof/marketing-revenue-assurance.webp",
    alt: "Marketing Revenue Assurance interface showing a synthetic cash collection gap and evidence reconciliation",
    status: "Public replay · synthetic data",
    eyebrow: "Live product screen",
    title: "Marketing Revenue Assurance",
    caption: "Advertising, CRM, funnel, and settlement evidence reconcile into one reviewable revenue risk. No external write is performed.",
    href: "https://marketing-revenue-assurance.vercel.app",
  },
  deal: {
    src: "/assets/product-proof/deal-rescue-forecast-truth.webp",
    alt: "Deal Rescue and Forecast Truth interface comparing synthetic seller confidence with buyer evidence",
    status: "Public replay · synthetic data",
    eyebrow: "Live product screen",
    title: "Deal Rescue and Forecast Truth",
    caption: "Synthetic buyer evidence challenges seller confidence, rebuilds the forecast, and stops at a manager decision gate.",
    href: "https://deal-rescue-forecast-truth.vercel.app",
  },
  revenue: {
    src: "/assets/product-proof/revenue-signal-graph.webp",
    alt: "Revenue Signal Graph interface showing a synthetic qualification score, evidence graph, and agent timeline",
    status: "Public replay · synthetic data",
    eyebrow: "Live product screen",
    title: "Revenue Signal Graph",
    caption: "Fragmented synthetic account signals become an explainable qualification, SLA decision, and human-reviewed next action.",
    href: "https://revenue-signal-graph.vercel.app",
  },
  atlas: {
    src: "/assets/product-proof/atlas-analytics-synthetic-fixture.webp",
    alt: "Atlas advertising analytics dashboard interface rendered with a clearly labelled synthetic fixture",
    status: "Production interface · synthetic fixture",
    eyebrow: "Real interface, safe fixture",
    title: "Atlas campaign analytics",
    caption: "The production interface is shown with its own synthetic fixture. Private production data remains behind Google sign-in.",
    href: "https://meta-ads-platform-production.up.railway.app",
  },
  manhaj: {
    src: "/assets/product-proof/manhaj-live-control-plane.webp",
    alt: "Live MANHAJ control plane showing provider connections and visible gated capabilities",
    status: "Live control plane · connections gated",
    eyebrow: "Live operating surface",
    title: "MANHAJ control plane",
    caption: "A live AiXCEL control-plane surface demonstrates the governed workspace pattern while provider connections remain visibly gated.",
    href: "https://manhaj.aixcelsolutions.com/app",
    crop: "manhaj",
  },
  aitlas: {
    src: "/assets/product-proof/aitlas-agent-access.webp",
    alt: "Aitlas Agent invitation-only client portal access screen with no customer data visible",
    status: "Private access boundary",
    eyebrow: "Real access boundary",
    title: "Aitlas Agent portal",
    caption: "A real invitation-only client portal boundary. No customer account or private workspace was opened for this capture.",
    href: "https://aitlasagent.dev/login",
    crop: "access",
  },
  chirocandy: {
    src: "/assets/product-proof/chirocandy-aios-access.webp",
    alt: "ChiroCandy AI operations staff access screen with no client records visible",
    status: "Private staff access boundary",
    eyebrow: "Real access boundary",
    title: "ChiroCandy AIOS",
    caption: "A real staff-only AI operations access boundary. The screenshot shows no customer records or private operating data.",
    href: "https://chirocandy-aios.vercel.app",
    crop: "access",
  },
};

const serviceProductProofs = new Map([
  ["/services/ai-lead-generation", ["revenue"]],
  ["/services/crm-automation", ["marketing", "atlas"]],
  ["/services/agentic-workflows", ["creator", "deal"]],
]);

const serviceProofIntros = new Map([
  ["/services/ai-lead-generation", ["A lead decision you can inspect.", "See the evidence, qualification, SLA state, and proposed next action in one public synthetic replay."]],
  ["/services/crm-automation", ["From campaign report to revenue truth.", "Inspect how cross-system records become a reviewable commercial decision, plus the real Atlas interface shown with a safe fixture."]],
  ["/services/agentic-workflows", ["Agent work stops at a visible human gate.", "These public synthetic replays show bounded coordination, evidence, and the exact point where human authority resumes."]],
]);

const labProductProofs = new Map([
  ["creator-campaign-command", "creator"],
  ["marketing-revenue-assurance", "marketing"],
  ["deal-rescue-forecast-truth", "deal"],
  ["revenue-signal-graph", "revenue"],
]);

function productProofWindow(key, loading = "lazy") {
  const proof = productProofs[key];
  if (!proof) return "";
  const crop = proof.crop ? ` proof-crop-${proof.crop}` : "";
  return `<div class="product-proof-window${crop}"><div class="proof-window-bar"><span class="proof-window-dots" aria-hidden="true"><i></i><i></i><i></i></span><strong>${escapeHtml(proof.status)}</strong></div><div class="product-proof-image"><img src="${proof.src}" alt="${escapeHtml(proof.alt)}" width="1440" height="1000" loading="${loading}" decoding="async"></div></div>`;
}

function productProofFigure(key, { className = "", loading = "eager" } = {}) {
  const proof = productProofs[key];
  if (!proof) return "";
  return `<figure class="product-proof${className ? ` ${className}` : ""}"><a href="${proof.href}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escapeHtml(proof.title)} live">${productProofWindow(key, loading)}</a><figcaption><span>${escapeHtml(proof.eyebrow)}</span><h3>${escapeHtml(proof.title)}</h3><p>${escapeHtml(proof.caption)}</p><a href="${proof.href}" target="_blank" rel="noopener noreferrer">Inspect the live surface →</a></figcaption></figure>`;
}

function productProofThumbnail(key, loading = "lazy") {
  return `<div class="product-proof-thumbnail">${productProofWindow(key, loading)}</div>`;
}

const bookingUrl = (content) => `${baseBooking}?utm_source=aixcel_website&utm_medium=organic&utm_campaign=free_systems_audit&utm_content=${encodeURIComponent(content)}`;
const aiVisibilityBookingUrl = (content) => `${baseBooking}?utm_source=aixcel_website&utm_medium=organic&utm_campaign=ai_search_visibility&utm_content=${encodeURIComponent(content)}`;

const pages = [];
const register = (page) => { pages.push(page); return page; };

const agenticSystems = [
  ["01", "Creator Campaign Command", "Five bounded roles turn an objective and budget into a ranked creator plan, expose every decision, and stop before outreach or spend.", "5 graph roles, 3 scenario shapes, objective-sensitive ranking, 0 automatic external actions", "https://creator-campaign-command.vercel.app", "https://github.com/syedahmad0786/creator-campaign-command", "creator-campaign-command"],
  ["02", "Marketing Revenue Assurance", "Ten bounded specialists reconcile advertising delivery, CRM state, funnel movement, and collected cash, then stop at a human decision gate before any external action.", "12 of 12 golden scenarios, 31 tests, 81.93 percent coverage, 25 Postman assertions, 0 automatic external writes", "https://marketing-revenue-assurance.vercel.app", null, "marketing-revenue-assurance", "/case-studies/marketing-revenue-assurance"],
  ["03", "Deal Rescue and Forecast Truth", "Bounded evidence roles compare seller confidence with exact buyer language, stakeholder coverage, activity, and dated commitments before a sales manager decides.", "12 of 12 golden deal states, 53 tests, 83.97 percent coverage, 28 live Postman assertions, PostgreSQL checkpoint restart proof, 0 automatic external actions", "https://deal-rescue-forecast-truth.vercel.app", null, "deal-rescue-forecast-truth", "/case-studies/deal-rescue-forecast-truth"],
  ["04", "Creative Learning OS", "Eleven bounded stages separate attributable creative signal from sample, audience, placement, funnel, lag, fatigue, and data-quality confounds before a human decides the next experiment.", "13 of 13 golden scenarios, 68 tests, 82.76 percent coverage, 18 evaluation measures, 34 production Postman assertions, PostgreSQL checkpoint restart proof, 0 platform mutations", "https://creative-learning-os.vercel.app", null, "creative-learning-os", "/case-studies/creative-learning-os"],
  ["05", "LanguageMix Studio", "A timed script becomes culturally reviewed Urdu, Roman Urdu, or Arabic copy with distinct voice registers, safety flags, and native-language approval.", "3 source scenarios, 3 locale routes, 3 voice registers, 27 meaningful combinations", "https://language-mix-studio.vercel.app", "https://github.com/syedahmad0786/language-mix-studio", "language-mix-studio"],
  ["06", "Agentic Systems Evaluation Lab", "A live black-box evaluator probes deployed systems for contracts, evidence, approval gates, idempotency, boundaries, and latency, including labelled fault injection.", "3 target deployments, 7 weighted checks, 4 baseline and fault scenarios, arbitrary URLs blocked", "https://agentic-systems-evaluation-lab.vercel.app", "https://github.com/syedahmad0786/agentic-systems-evaluation-lab", "agentic-systems-evaluation-lab"],
  ["07", "Content Performance Forecaster", "A reproducible historical baseline returns forecast ranges, confidence, cohort fallback, and input sensitivity before a post is published.", "500 licensed public records, 400 training rows, 100 holdout rows, versioned ridge models", "https://content-performance-forecaster.vercel.app", "https://github.com/syedahmad0786/content-performance-forecaster", "content-performance-forecaster"],
  ["08", "Revenue Signal Graph", "Seven bounded agents convert fragmented account evidence into an explainable qualification, speed-to-lead decision, and human-reviewed action proposal.", "12 of 12 golden scenarios, 31 tests, 85.30 percent coverage, 18 Postman assertions, $0 replay inference", "https://revenue-signal-graph.vercel.app", null, "revenue-signal-graph"],
  ["09", "Creator & Talent Campaign OS", "Twelve bounded stages test audience authenticity, campaign fit, conflicts, rights, safety, history, budget, and concentration before a campaign manager decides.", "13 of 13 golden scenarios, 70 tests, 85.38 percent coverage, 18 evaluation measures, 34 production Postman assertions, PostgreSQL checkpoint restart proof, 0 external writes", "https://creator-talent-campaign-os.vercel.app", null, "creator-talent-campaign-os", "/case-studies/creator-talent-campaign-os"],
  ["10", "Agentic Systems Gateway", "A governed model gateway gives nine deployed systems verified replay, visitor-owned live inference, signed receipts, and an evidence-qualified release registry without exposing an owner-funded model key.", "85 tests, 18 of 18 evaluation measures, 40 production Postman assertions, PostgreSQL restart proof, persistent themes, 0 production 5xx", "https://agentic-systems-gateway.vercel.app", null, "agentic-systems-gateway", "/case-studies/agentic-systems-gateway"],
];

const servicePages = [
  register({
    path: "/services/ai-search-visibility",
    nav: "services",
    type: "ai-visibility",
    previewGated: true,
    ogImage: aiVisibilityOgImage,
    title: "AEO Services & Free AI Visibility Audit | AiXCEL",
    description: "See where your brand appears in AI answers. Get a free AEO audit, competitor view, source gaps, and a clear action plan from AiXCEL.",
    eyebrow: "AEO services · free AI visibility audit",
    h1: "See where your business shows up in AI answers.",
    deck: "AiXCEL measures how your brand appears across supported AI answer platforms, shows who is ahead, and turns the gaps into a clear AEO improvement plan.",
    answer: "Answer Engine Optimization (AEO) helps AI search and answer platforms find, understand, cite, and accurately describe a business. AiXCEL combines visibility tracking, competitor analysis, prompt monitoring, technical audits, content actions, and reporting in one managed service.",
    aside: "Best for established service businesses that want a clear starting score, competitor context, and a practical plan for improving AI visibility without ranking promises or opaque reports.",
    faqs: [
      ["Is AIEO different from SEO?", "AIEO builds on sound SEO rather than replacing it. Technical access, useful pages, clear entities, and credible evidence still matter; AIEO adds prompt-level monitoring, citation analysis, answer coverage, and lead attribution."],
      ["Can AiXCEL guarantee that ChatGPT or Google will recommend us?", "No. No responsible provider can guarantee placement or a recommendation inside an external answer engine. AiXCEL can improve the evidence, accessibility, clarity, corroboration, and measurement around your business."],
      ["Do we need special AI schema?", "No special AI-only schema is required. AiXCEL uses appropriate standard structured data only when it matches visible page content, then focuses on the wider technical, entity, evidence, and authority signals engines can inspect."],
      ["What is included in the free AEO audit?", "The audit gives you a scoped AI visibility score, competitor comparison, observed mentions and citations, sentiment and brand-fact checks, plus the most important technical and content gaps. It covers the prompts and supported platforms selected for the audit, not the whole internet."],
      ["Which AI platforms can you monitor?", "Coverage can include ChatGPT, Google AI Overviews, Perplexity, Gemini, Claude, and other supported answer surfaces. The exact platform and prompt set is confirmed before ongoing monitoring begins."],
      ["How long before results appear?", "Timing depends on crawl access, existing authority, content gaps, off-site corroboration, and the engines being observed. AiXCEL reports verified changes and referral outcomes without inventing a fixed ranking timeline."],
    ],
    related: [["AI lead and appointment systems", "/services/ai-lead-generation"], ["CRM automation", "/services/crm-automation"], ["How AiXCEL delivers", "/process"]],
  }),
  register({
    path: "/services/ai-lead-generation",
    nav: "services",
    type: "service",
    title: "AI Lead Generation & Appointment Setting | Aixcel",
    description: "AI lead generation and appointment-setting systems that capture, qualify, follow up, route, and book prospects while keeping your CRM accurate.",
    eyebrow: "AI lead generation & appointment setting",
    h1: "Turn every qualified enquiry into a prompt, relevant next action.",
    deck: "Aixcel designs AI lead generation and appointment-setting systems for growing service businesses—connecting capture, qualification, follow-up, routing, calendar booking, and CRM state in one observable flow.",
    answer: "An AI appointment-setting system is a controlled revenue workflow that responds to enquiries, gathers the right context, prioritizes intent, follows up across approved channels, and books qualified prospects while recording every action in the CRM.",
    aside: "Best for teams with meaningful lead volume, slow first response, inconsistent follow-up, or poor visibility between enquiry and booked appointment.",
    includes: [
      ["Capture every source", "Connect web forms, calls, paid campaigns, referrals, social enquiries, and imports to one governed intake path."],
      ["Qualify with context", "Use explicit business rules and AI-assisted conversation to gather fit, urgency, need, and routing information."],
      ["Follow up without guessing", "Trigger relevant email, SMS, or voice sequences based on consent, lead state, behaviour, and human handoff rules."],
      ["Book and update", "Offer the right calendar, prevent duplicate bookings, update lifecycle stages, and notify the responsible team member."],
      ["Recover dormant demand", "Segment appropriate historical leads and run measured reactivation campaigns with suppression and opt-out controls."],
      ["See the full funnel", "Track response speed, contactability, qualification, booking, attendance, and exceptions instead of celebrating message volume."],
    ],
    steps: [
      ["Map the revenue leak", "Review lead sources, response time, qualification, calendars, handoffs, consent, and the CRM states used today."],
      ["Define the decisions", "Agree what qualifies a lead, when AI can act, where people approve, and what must never be automated."],
      ["Ship the core path", "Connect one high-value lead source through qualification and booking, then test real and failure scenarios."],
      ["Instrument and expand", "Add reporting, alerts, reactivation, additional channels, documentation, and owner training."],
    ],
    fit: [
      [true, "You receive enough enquiries for speed-to-lead and follow-up consistency to affect revenue."],
      [true, "Your team can define qualification, scheduling, ownership, and escalation rules."],
      [false, "You need AI to create demand without an offer, audience, acquisition channel, or human sales capacity."],
      [false, "You want unsupervised bulk outreach without consent, suppression, or reputation controls."],
    ],
    faqs: [
      ["Does AI replace our sales team?", "No. The system handles fast, repetitive coordination and keeps state accurate. People retain judgment-heavy discovery, negotiation, exceptions, and relationship work."],
      ["Which channels can it use?", "Common channels include web chat, forms, email, SMS, WhatsApp where approved, and voice. The right channel mix depends on consent, audience, jurisdiction, and the existing sales process."],
      ["Can it work with our current CRM and calendar?", "Usually. Aixcel works with GoHighLevel, HubSpot, calendars, dialers, and API-accessible tools. An audit confirms data quality, available integrations, and constraints before a build is proposed."],
      ["How should success be measured?", "Measure first-response time, contact rate, qualified-booking rate, attendance, pipeline progression, opt-outs, human takeover, exceptions, and attributable revenue—not messages sent."],
    ],
    related: [["CRM automation", "/services/crm-automation"], ["Voice AI", "/services/voice-ai"], ["Lead operations case study", "/case-studies/lead-operations"]],
  }),
  register({
    path: "/services/crm-automation",
    nav: "services",
    type: "service",
    title: "CRM Automation & Revenue Operations Systems | Aixcel",
    description: "CRM automation services for reliable pipelines, lifecycle workflows, attribution, data quality, alerts, handoffs, and revenue operations.",
    eyebrow: "CRM automation & revenue operations",
    h1: "Make the CRM drive the next action—not document yesterday.",
    deck: "Aixcel architects CRM automation around the way revenue actually moves: clear lifecycle definitions, reliable data, timely actions, human ownership, useful alerts, and recovery when something fails.",
    answer: "CRM automation connects customer data, lifecycle rules, tasks, messages, ownership, and reporting so the correct next action happens consistently and every team works from the same state.",
    aside: "Best for teams whose pipeline stages, follow-up, attribution, data quality, or sales-to-delivery handoffs depend on manual memory.",
    includes: [
      ["Lifecycle architecture", "Define stages, entry and exit criteria, owners, required data, and the events that move a record forward."],
      ["Pipeline automation", "Create tasks, reminders, routing, nurture, escalation, appointment, proposal, and closed-loop workflows."],
      ["Data quality controls", "Normalize fields, prevent duplicates, validate critical inputs, identify stale records, and preserve an audit trail."],
      ["Attribution and reporting", "Connect sources, campaigns, activities, pipeline, and outcomes so teams can inspect what produces movement."],
      ["Human-first alerts", "Send the right context to the responsible person, with a clear action and a path back to the source record."],
      ["Migration and repair", "Audit an existing GoHighLevel, HubSpot, or connected CRM setup before repairing, simplifying, or migrating it."],
    ],
    steps: [
      ["Audit reality", "Map the actual customer journey, data model, automations, edge cases, reporting gaps, and current operating habits."],
      ["Design the state model", "Agree lifecycle stages, ownership, required fields, decisions, service levels, and exception paths."],
      ["Build in slices", "Implement one measurable workflow at a time with test records, reversible releases, and stakeholder review."],
      ["Hand over operations", "Provide alerts, logs, documentation, permissions, training, and a prioritized improvement backlog."],
    ],
    fit: [
      [true, "Your team uses workarounds because the CRM does not reflect how leads and customers actually move."],
      [true, "You need reliable handoffs and reporting across sales, delivery, support, or finance."],
      [false, "Nobody owns CRM definitions, data standards, or the decisions needed to resolve conflicting processes."],
      [false, "You want to automate a process that has not yet been agreed or tested manually."],
    ],
    faqs: [
      ["Which CRMs does Aixcel support?", "Aixcel commonly works with GoHighLevel and HubSpot and can integrate other platforms that provide appropriate APIs, webhooks, exports, and permissions."],
      ["Can you fix an existing CRM instead of replacing it?", "Yes. A repair is often preferable when the platform is capable but lifecycle design, data, automations, permissions, or reporting are weak."],
      ["How do you avoid fragile automations?", "Workflows include explicit states, idempotency where appropriate, validation, retries, alerts, human overrides, logs, and documented ownership."],
      ["Will our team be able to run it?", "That is a delivery requirement. The handover covers operating procedures, exception handling, permissions, documentation, and the metrics used to inspect performance."],
    ],
    related: [["AI appointment setting", "/services/ai-lead-generation"], ["Agentic workflows", "/services/agentic-workflows"], ["Our delivery process", "/process"]],
  }),
  register({
    path: "/services/voice-ai",
    nav: "services",
    type: "service",
    title: "Voice AI Agents for Calls & Appointment Setting | Aixcel",
    description: "Voice AI implementation for inbound and approved outbound calls, qualification, scheduling, CRM updates, human handoff, testing, and monitoring.",
    eyebrow: "Voice AI implementation",
    h1: "Give routine calls a reliable path—and important moments a human owner.",
    deck: "Aixcel builds voice AI agents that answer or place approved calls, gather context, qualify, schedule, update systems, and transfer to people under explicit business, consent, and safety rules.",
    answer: "A production voice AI agent combines a speech interface with business rules, approved knowledge, CRM and calendar actions, human handoff, call-state tracking, monitoring, and compliance controls.",
    aside: "Best for repeatable inbound enquiries, appointment coordination, qualification, reminders, reactivation, and overflow where call outcomes can be defined clearly.",
    includes: [
      ["Conversation architecture", "Design goals, approved statements, questions, branches, fallbacks, interruptions, language, tone, and escalation triggers."],
      ["Business integrations", "Connect calendars, CRM records, lead ownership, knowledge sources, notifications, and approved downstream actions."],
      ["Human handoff", "Transfer or create a clear callback task whenever confidence, sentiment, policy, or commercial importance requires a person."],
      ["Call-state visibility", "Store disposition, structured outcomes, transcript references where appropriate, errors, and the next responsible action."],
      ["Evaluation and QA", "Test accents, noise, interruptions, edge cases, tool failures, prompt injection, unsupported requests, and conversation limits."],
      ["Operational controls", "Configure disclosure, consent, calling hours, suppression, retention, access, and review processes for applicable markets."],
    ],
    steps: [
      ["Choose one call job", "Define a narrow, high-volume call type with clear success, stop, transfer, and follow-up conditions."],
      ["Prototype safely", "Build the conversation and actions against test systems before exposing real customer or lead data."],
      ["Evaluate real scenarios", "Run a documented test set, inspect failures, tune policies, and confirm human takeover and logging."],
      ["Release with oversight", "Start with limited traffic, review calls and outcomes, then expand only when quality and controls hold."],
    ],
    fit: [
      [true, "The call has a repeatable purpose, an approved information source, and a clear human escalation path."],
      [true, "Your team can review early conversations and own policy, consent, and quality decisions."],
      [false, "The use case depends on deception, impersonation, pressure, or unsupported claims."],
      [false, "You need autonomous handling of high-stakes decisions that require licensed or accountable human judgment."],
    ],
    faqs: [
      ["Can a voice AI agent book appointments?", "Yes. It can check approved availability, apply scheduling rules, create or reschedule bookings, update the CRM, and send confirmations when the connected systems support those actions."],
      ["Can callers reach a human?", "They should be able to whenever the use case requires it. Transfer, callback, and exception paths are designed before launch and tested like any other critical action."],
      ["How do you handle consent and disclosure?", "The system is configured for the business's approved jurisdictions, purposes, channels, scripts, recording policy, calling hours, suppression lists, and data-retention rules. Legal approval remains the client's responsibility."],
      ["How is quality measured?", "Use task completion, correct disposition, booking accuracy, transfer success, latency, interruption handling, policy adherence, caller feedback, and reviewed failure examples."],
    ],
    related: [["AI appointment setting", "/services/ai-lead-generation"], ["CRM automation", "/services/crm-automation"], ["Contact Aixcel", "/contact"]],
  }),
  register({
    path: "/services/agentic-workflows",
    nav: "services",
    type: "service",
    title: "Agentic AI Workflow Automation Services | Aixcel",
    description: "Agentic workflow automation using AI agents, n8n, APIs, approvals, recovery paths, observability, documentation, and human control.",
    eyebrow: "Agentic workflow automation",
    h1: "Automate multi-step work without creating an invisible black box.",
    deck: "Aixcel builds agentic workflows that interpret context, choose among approved actions, use business tools, involve people at consequential moments, and leave enough evidence to operate and improve the system.",
    answer: "An agentic workflow is an automation in which AI can interpret context and select from bounded tools or actions, while deterministic rules, permissions, human approvals, logs, tests, and recovery paths control the outcome.",
    aside: "Best for multi-step operational work with variable inputs, repeated decisions, clear tools, measurable outcomes, and an accountable process owner.",
    includes: [
      ["Workflow and tool design", "Map inputs, decisions, actions, tools, permissions, state, owners, service levels, and exception paths."],
      ["Bounded AI decisions", "Use models where interpretation adds value and deterministic logic where certainty, cost, or policy matters more."],
      ["Human approval", "Pause consequential actions for review and provide the evidence, context, and recommended next step a person needs."],
      ["Reliable integrations", "Connect n8n, Make, APIs, webhooks, databases, files, messaging, CRM, and internal tools with controlled credentials."],
      ["Recovery and observability", "Add validation, idempotency, retry policy, dead-letter handling, alerts, logs, correlation IDs, and replay procedures."],
      ["Evaluation and handover", "Test representative scenarios, cost and latency, model failure, tool failure, permissions, and operating procedures."],
    ],
    steps: [
      ["Model the work", "Observe the current process and identify which steps are rules, interpretation, judgment, coordination, or exception handling."],
      ["Set the control plane", "Define tool boundaries, permissions, approval thresholds, data rules, evaluation cases, and measurable success."],
      ["Build and test", "Ship one bounded workflow with synthetic and real-world test cases, failure injection, and operator review."],
      ["Operate and improve", "Monitor quality, cost, latency, exceptions, and business outcomes; version prompts and workflows deliberately."],
    ],
    fit: [
      [true, "A recurring process spans several tools and requires interpretation before a known set of actions."],
      [true, "A business owner can define success, exceptions, permissions, and when a person must decide."],
      [false, "The process has no accountable owner or reliable source of truth."],
      [false, "The desired outcome is unrestricted autonomy over high-impact actions without review, limits, or auditability."],
    ],
    faqs: [
      ["How is agentic automation different from a normal workflow?", "A normal workflow follows predetermined branches. An agentic workflow may interpret unstructured context and select among bounded tools, so it needs stronger evaluation, permissions, and observability."],
      ["Do you use n8n or Make?", "Yes, when they fit. Aixcel also works directly with APIs, webhooks, databases, model providers, CRMs, and messaging tools. Architecture follows the operating need rather than a platform quota."],
      ["How do you keep an AI agent under control?", "Limit tools and permissions, validate inputs and outputs, require approval for consequential actions, log decisions, test adversarial and failure cases, and make rollback and replay possible."],
      ["Can an existing automation be hardened?", "Yes. An audit can identify silent failures, duplicated actions, missing states, credential risk, poor alerts, weak testing, excessive model use, and unclear ownership before targeted repair."],
    ],
    related: [["CRM automation", "/services/crm-automation"], ["Automation migration case study", "/case-studies/automation-migration"], ["MANHAJ AI operating system", "https://manhaj.ahmadbukhari.com"]],
  }),
];

const serviceCards = servicePages.map((page, index) => [String(index + 1).padStart(2, "0"), page.eyebrow, page.answer, page.path]);

register({
  path: "/services",
  nav: "services",
  type: "collection",
  title: "AI Search Visibility & Automation Services | AiXCEL",
  description: "Explore AiXCEL AI Search Visibility, lead, CRM, voice, and governed workflow services for established service businesses.",
  eyebrow: "AI Search Visibility & automation services",
  h1: "Start with visibility. Keep the wider operating stack available.",
  deck: "AI Search Visibility is AiXCEL's primary entry point. CRM, lead, voice, workflow, intelligence, and operations services remain available when the baseline reveals a wider business-system constraint.",
  answer: "A capable AI partner should connect discoverability and evidence to an attributable buyer action, then connect that action to dependable lead, CRM, workflow, and human ownership systems only where the business case supports it.",
  aside: "Primary: AIEO, AEO, and GEO. Secondary: the private-pilot Operations Workspace. Existing revenue and operations services remain fully available.",
});

register({
  path: "/solutions/ai-operations-workspace",
  nav: "services",
  type: "workspace",
  title: "AiXCEL Operations Workspace | Private Pilot",
  description: "A private-pilot AI operations workspace for governed execution, approvals, evidence, and handoffs across the business tools a client already owns.",
  eyebrow: "Featured solution · private pilot",
  h1: "One governed workspace between business intent and AI execution.",
  deck: "AiXCEL Operations Workspace is the proposed control layer for bounded AI work: clear scopes, approved knowledge, human decision gates, execution receipts, and client-owned systems of record.",
  answer: "The Operations Workspace is a private-pilot architecture, not a replacement CRM or an already-launched customer cloud. QM is positioned as the execution workspace while identity, approvals, permanent records, and credentials remain in the systems responsible for them.",
  aside: "Private pilot only. Client portal and cloud-access capabilities are deliberately outside this release until identity, tenancy, provider access, and acceptance evidence are implemented.",
});

register({
  path: "/about",
  nav: "about",
  type: "about",
  title: "About Aixcel Solutions & Founder Ahmad Bukhari",
  description: "Meet Aixcel Solutions, a founder-led AI automation agency founded by Agentic AI & LLM Systems Specialist Ahmad Bukhari in Islamabad.",
  eyebrow: "About Aixcel Solutions",
  h1: "Business context first. Systems discipline all the way through.",
  deck: "Aixcel Solutions is a founder-led AI automation agency created by Ahmad Bukhari. It brings sales, operations, CRM, automation, and AI architecture into one accountable delivery relationship.",
  answer: "Aixcel designs and implements AI systems for growing businesses, with particular depth in lead operations, CRM automation, voice AI, agentic workflows, integration architecture, and operational reliability.",
  aside: "Based in Islamabad, Pakistan. Working globally. The founder who diagnoses the problem remains close to architecture, testing, and handover.",
});

register({
  path: "/process",
  nav: "work",
  type: "process",
  title: "AI Automation Consulting & Delivery Process | Aixcel",
  description: "See how Aixcel audits, designs, builds, tests, launches, documents, and improves production AI automation and AI systems.",
  eyebrow: "How Aixcel works",
  h1: "Strategy stays close enough to the build to remain honest.",
  deck: "Every Aixcel engagement connects the business case, architecture, operator experience, evaluation, release, and ownership. The work is delivered in measurable slices instead of disappearing into a long speculative build.",
  answer: "Aixcel's delivery method moves from constraint mapping to system design, controlled implementation, real-scenario testing, observable release, documentation, and continuous improvement with a named business owner.",
  aside: "The first conversation is a focused systems audit: identify the constraint, pressure-test whether AI is appropriate, and define the first useful move.",
});

register({
  path: "/work",
  nav: "work",
  type: "work",
  title: "AI Systems Work, Evidence & Delivery | AiXCEL",
  description: "Explore AiXCEL case evidence, verified agentic systems, and the delivery method used to audit, build, test, release, and hand over AI systems.",
  eyebrow: "Work · evidence · delivery",
  h1: "Proof, working systems, and delivery discipline—together.",
  deck: "Work is the single place to evaluate what AiXCEL has delivered, what can be inspected live, and how a project moves from diagnosis to a controlled handover.",
  answer: "AiXCEL's Work hub combines three kinds of buyer evidence: responsibly labelled case studies, verified public system demonstrations, and the delivery process used to turn a business constraint into an owned operating system.",
  aside: "Start with the evidence type you need. Client and project records, public technical proof, and delivery controls remain separate so a demo is never presented as production acceptance.",
});

const caseStudies = [
  register({
    path: "/case-studies/lead-operations",
    nav: "work",
    type: "case-study",
    title: "AI Lead Operations System Case Study | Aixcel",
    description: "An anonymized lead-operations case study with multi-list routing, booking removal, lifecycle guards, 180+ recovered accounts, and a 39.6% unique dial rate.",
    eyebrow: "Case study · lead operations · anonymized",
    h1: "A lead engine rebuilt around action—not admin.",
    deck: "A fragmented dialer operation became one controlled lead flow with multi-list routing, booked-lead removal, lifecycle guards, and end-of-day visibility.",
    answer: "The system coordinated lead selection, CRM state, dialer activity, booking suppression, retries, and team reporting so operators could act from one governed process instead of reconciling disconnected tools.",
    aside: "Evidence basis: anonymized internal project record. Client identity and commercially sensitive details are intentionally withheld.",
    metrics: [["180+", "accounts recovered"], ["39.6%", "unique dial rate"]],
    context: "Lead records were distributed across lists and systems. Booked contacts could remain eligible for outreach, activity was difficult to reconcile, and managers lacked one dependable daily view.",
    work: "Aixcel designed a controlled operating flow for list membership, dialer activity, CRM updates, booking removal, retry and exception handling, plus scheduled Slack reporting.",
    result: "The documented project record shows more than 180 accounts recovered into the governed flow and a 39.6% unique dial rate for the measured outbound system. These figures describe this engagement, not a forecast for other businesses.",
    stack: "CRM, dialer, workflow automation, calendars, Slack reporting",
  }),
  register({
    path: "/case-studies/business-intelligence",
    nav: "work",
    type: "case-study",
    title: "Business Intelligence Automation Case Study | Aixcel",
    description: "An anonymized automation case study unifying data from 15+ channels through APIs, n8n, Airtable, Looker Studio, and scheduled Slack reporting.",
    eyebrow: "Case study · business intelligence · anonymized",
    h1: "Fifteen-plus channels. One operational view.",
    deck: "A reporting pipeline moved fragmented channel data through controlled APIs and data models into a single decision layer with scheduled visibility for the operating team.",
    answer: "The system collected channel data, normalized it into an auditable structure, refreshed reporting, and delivered decision-ready updates without requiring a person to rebuild the same report each cycle.",
    aside: "Evidence basis: anonymized internal project record. Channel and client identifiers are withheld.",
    metrics: [["15+", "channels unified"]],
    context: "Performance data lived across many channels, formats, and refresh cycles. The team spent time assembling views and could not depend on one current operating picture.",
    work: "Aixcel connected source APIs to n8n, structured the data in Airtable, presented it through Looker Studio, and scheduled concise Slack updates for the team.",
    result: "The delivered pipeline unified more than 15 channels into one operational reporting path. The claim describes integrated channel coverage, not a revenue or performance guarantee.",
    stack: "n8n, APIs, Airtable, Looker Studio, Slack",
  }),
  register({
    path: "/case-studies/automation-migration",
    nav: "work",
    type: "case-study",
    title: "Make-to-n8n Automation Migration Case Study | Aixcel",
    description: "A documented automation migration architecture that grouped 108 Make scenarios into reusable n8n workflow families with parity and QA gates.",
    eyebrow: "Case study · automation architecture",
    h1: "A migration factory—not 108 copied workflows.",
    deck: "Automation candidates were inventoried, grouped into reusable families, and designed for behaviour parity so a Make-to-n8n migration could be governed and tested.",
    answer: "The migration-factory approach treats a large automation move as a repeatable engineering system: inventory, classification, target patterns, shared components, parity tests, release gates, exception handling, and operational handover.",
    aside: "Evidence basis: documented project scope and architecture. The number refers to migration candidates, not completed production migrations.",
    metrics: [["108", "migration candidates inventoried"]],
    context: "A direct one-for-one rebuild would have repeated logic, inconsistent quality, weak traceability, and an expensive test burden across a large scenario estate.",
    work: "The architecture grouped scenarios into reusable families, defined target n8n patterns, behaviour-parity requirements, QA gates, shared services, and a controlled migration sequence.",
    result: "The documented scope covered 108 migration candidates and established a governable route to implementation. Aixcel does not present the scope count as a completed-migration or outcome claim.",
    stack: "Make, n8n, workflow inventory, reusable architecture, parity testing, QA gates",
  }),
  register({
    path: "/case-studies/creator-campaign-command",
    nav: "work",
    type: "case-study",
    title: "Creator Campaign Command Case Study | Aixcel",
    description: "A live LangGraph campaign-planning council that ranks synthetic creators, enforces budget and risk controls, records evidence, and requires human approval.",
    eyebrow: "Case study · creator operations · verified replay",
    h1: "A creator campaign plan that cannot spend or send on its own.",
    deck: "Five bounded LangGraph nodes turn a campaign brief into a ranked, budgeted creator proposal while keeping evidence, trace state, and the final decision with a campaign owner.",
    answer: "Creator Campaign Command demonstrates a controlled agent route for brief normalization, creator fit, compliance, budget allocation, and approval without connecting client data, outreach, contracts, or advertising spend.",
    aside: "Evidence basis: public source, green CI, live Vercel API, Postman assertions, browser verification, and synthetic replay fixtures.",
    metrics: [["5", "bounded LangGraph nodes"], ["0", "automatic external actions"]],
    context: "Creator and talent teams often move from brief to outreach through subjective selection, fragmented spreadsheets, and unclear approval ownership. The proof needed a useful decision record without exposing creator or client data.",
    work: "Aixcel built a typed FastAPI and LangGraph system with idempotent runs, deterministic creator scoring, a compliance threshold, hard budget allocation, ordered traces, evidence hashes, public quotas, and a human approval state.",
    result: "The live replay ranks four synthetic creators, selects an eligible roster inside budget, exposes five agent traces, and records approval without executing any external action. Python tests, GitHub Actions, Postman assertions, and desktop and 390-pixel browser journeys pass.",
    stack: "Python 3.12, LangGraph, LangChain Core, FastAPI, Pydantic, REST/OpenAPI, Postman, Docker, GitHub Actions, Vercel",
    links: [["Open the live system", "https://creator-campaign-command.vercel.app"], ["Inspect the GitHub repository", "https://github.com/syedahmad0786/creator-campaign-command"]],
  }),
  register({
    path: "/case-studies/language-mix-studio",
    nav: "work",
    type: "case-study",
    title: "LanguageMix Studio Case Study | Aixcel",
    description: "A live multilingual transcreation and QA control plane for Gulf Arabic and Roman Urdu creator content with claim flags and native review.",
    eyebrow: "Case study · multilingual content · verified replay",
    h1: "Translation is easy. Trust is the system.",
    deck: "LanguageMix makes source meaning, cultural wording, risky claims, subtitle constraints, directionality, and native-language approval visible before any voice or publishing provider is allowed near the content.",
    answer: "LanguageMix Studio demonstrates the governance layer missing from generic auto-dubbing: timed source retention, culturally reviewed wording, claims checks, RTL and subtitle QA, and a hard native-review gate.",
    aside: "Evidence basis: public source, green CI, live Vercel API, Postman assertions, browser verification, and curated synthetic language packages.",
    metrics: [["2", "launch language routes"], ["0", "voice or publish actions"]],
    context: "Platform translation and dubbing can generate output, but creator and agency teams remain accountable for meaning, brand terminology, risky claims, timing, consent, and regional language quality.",
    work: "Aixcel built a segment-level FastAPI workflow for transcript QA, cultural transcreation, claims and injection checks, subtitle and direction QA, evidence hashing, usage records, and a native-language approval state.",
    result: "The live replay produces timed Gulf Arabic and Roman Urdu packages, renders Arabic right-to-left, exposes claims flags and five agent states, and prevents voice generation or publishing. Tests, Postman assertions, and responsive browser journeys pass.",
    stack: "Python 3.12, FastAPI, Pydantic, Unicode and RTL handling, REST/OpenAPI, Postman, Docker, GitHub Actions, Vercel",
    links: [["Open the live system", "https://language-mix-studio.vercel.app"], ["Inspect the GitHub repository", "https://github.com/syedahmad0786/language-mix-studio"]],
  }),
  register({
    path: "/case-studies/marketing-revenue-assurance",
    nav: "work",
    type: "case-study",
    title: "Marketing Revenue Assurance Case Study | Aixcel",
    description: "A live marketing revenue assurance system that reconciles paid media, CRM, funnel, and settlement evidence before a recovery action can be approved.",
    eyebrow: "Case study · revenue assurance · verified replay",
    h1: "Revenue leaks hide between systems. Reconcile before action.",
    deck: "Marketing Revenue Assurance compares what ad platforms report, what the CRM received, how demand moved through the funnel, and what finance collected. It explains the gap, ranks the exposure, and stops before any external mutation.",
    answer: "Marketing Revenue Assurance demonstrates how bounded agent collaboration and deterministic controls can identify cross-system revenue leakage without giving a language model authority over arithmetic, access policy, or client systems.",
    aside: "Evidence basis: 12 synthetic golden scenarios, green CI, Docker and PostgreSQL contract runs, Postman assertions, cross-instance signed-receipt checks, live Vercel API, and desktop and mobile browser verification.",
    metrics: [["12/12", "golden scenarios matched"], ["0", "automatic external writes"]],
    context: "A marketing team can report delivered leads while the CRM shows missing records, booked pipeline exceeds collected cash, attribution coverage collapses, or stale exports hide the current state. Looking at one platform at a time makes the leak difficult to see and easy to explain incorrectly.",
    work: "Aixcel built a typed FastAPI control plane and a 12-node LangGraph workflow with ten bounded specialist responsibilities. Deterministic Python services validate source contracts, content-hash evidence, reconcile delivery and cash, calculate funnel benchmarks and risk, enforce role access and quotas, and require a signed human decision. PostgreSQL, Alembic, durable audit records, checkpoints, OpenTelemetry, Prometheus, structured logs, evaluation fixtures, and replay complete the production path.",
    result: "The public system exposes 12 materially different scenarios across Meta Ads, Google Ads, TikTok Ads, GoHighLevel CRM, call tracking, and settlement exports. The cash collection case identifies a $44,700 booked-to-collected gap and proposes a draft recovery plan. The stale-source and multi-failure cases fail closed. Approval and rejection work across isolated serverless instances through a signed receipt, while Docker and PostgreSQL preserve durable runs, hash-chained audit events, and LangGraph checkpoints. The release passed 31 tests, 81.93 percent measured coverage, 25 Postman assertions, 13 golden evaluation metrics, two Docker and PostgreSQL CI paths, and public browser journeys.",
    stack: "Python 3.12, FastAPI, Pydantic v2, LangGraph, SQLAlchemy, PostgreSQL 17, Alembic, REST, OpenAPI, Postman, OpenTelemetry, Prometheus, Docker, GitHub Actions, Playwright, Vercel",
    visual: "/assets/case-studies/marketing-revenue-assurance-system-context.png",
    visualAlt: "Marketing Revenue Assurance system context showing synthetic acquisition sources, deterministic control services, ten bounded agent responsibilities, persistence, approval, observability, and external mutation boundaries.",
    visualCaption: "System context and infrastructure. Deterministic services own arithmetic, evidence policy, authorization, and mutation boundaries. The editable SVG is available with the published asset package.",
    proofKey: "marketing",
    links: [["Open the live system", "https://marketing-revenue-assurance.vercel.app"], ["Inspect the API contract", "https://marketing-revenue-assurance.vercel.app/docs"], ["Open editable architecture SVG", "/assets/case-studies/marketing-revenue-assurance-system-context.svg"]],
  }),
  register({
    path: "/case-studies/deal-rescue-forecast-truth",
    nav: "work",
    type: "case-study",
    title: "Deal Rescue and Forecast Truth Case Study | Aixcel",
    description: "A live B2B forecast control system that compares CRM confidence with buyer evidence, drafts a rescue plan, and stops at manager approval.",
    eyebrow: "Case study · B2B revenue control · verified replay",
    h1: "Your CRM says commit. Does the buyer?",
    deck: "Deal Rescue and Forecast Truth compares seller-entered confidence with exact buyer language, stakeholder coverage, dated commitments, and sales activity. It rebuilds the forecast, drafts the next useful move, and stops before any buyer or CRM action.",
    answer: "Deal Rescue and Forecast Truth demonstrates a governed route from fragmented deal evidence to an explainable forecast and manager-reviewed rescue plan without allowing a language model to invent probability, rewrite source evidence, or execute an external action.",
    aside: "Evidence basis: 12 synthetic golden deal states, green CI, Docker and PostgreSQL checkpoint proof, live Postman assertions, public Vercel API, input-sensitivity testing, and desktop and mobile browser verification.",
    metrics: [["12/12", "top risks and forecast categories correct"], ["0", "automatic external actions"]],
    context: "CRM forecasts often preserve seller confidence after buyer evidence has changed. Budget may remain unapproved, the economic buyer may be absent, security or legal review may still be open, the next step may belong only to the seller, or the buyer may have stopped responding. Managers need the exact evidence and a controlled recovery path, not another generated summary.",
    work: "Aixcel built a typed FastAPI control plane with six parallel LangGraph evidence roles for data contract, conversation evidence, objection intelligence, stakeholder coverage, engagement risk, and commitment integrity. Bounded forecast, rescue, policy, and manager stages join that evidence. Deterministic Python owns source hashes, privacy screening, risk and exposure bounds, forecast policy, tenant and role authorization, quotas, idempotency, and the zero-mutation boundary. PostgreSQL, SQLAlchemy, Alembic, durable LangGraph checkpoints, signed serverless receipts, OpenTelemetry, Prometheus, JSON logs, evaluations, Docker, and GitHub Actions complete the operating path.",
    result: "The public decision room is a live system rather than a fixed animation. A reviewer can change seller confidence, stakeholder counts, buyer silence, next-step integrity, and the latest buyer statement. The verified browser journey changed an evidence-backed Commit at 0 risk into Omitted at 100 risk. The release passed 53 automated tests, 83.97 percent measured coverage, 12 of 12 expected risks, top risks, and forecast categories, 15 evaluation dimensions, 28 live Postman assertions, 16 Prometheus signal families, PostgreSQL checkpoint recovery across an API restart, persistent dark and light themes, and zero external mutations.",
    stack: "Python 3.12, FastAPI, Pydantic v2, LangGraph, SQLAlchemy, PostgreSQL 17, Alembic, REST, OpenAPI, Postman, OpenTelemetry, Prometheus, Docker, GitHub Actions, Playwright, Vercel",
    visual: "/assets/case-studies/deal-rescue-forecast-truth-system-context.png",
    visualAlt: "Deal Rescue and Forecast Truth system context showing signed CRM, transcript, and activity evidence, deterministic controls, bounded agent collaboration, forecast policy, manager approval, persistence, and observability.",
    visualCaption: "System context and infrastructure. Signed evidence enters deterministic policy controls before bounded agent analysis, manager approval, audit, and observability. The editable SVG is published with this case study.",
    proofKey: "deal",
    links: [["Open the live decision room", "https://deal-rescue-forecast-truth.vercel.app"], ["Inspect the API contract", "https://deal-rescue-forecast-truth.vercel.app/docs"], ["Open editable architecture SVG", "/assets/case-studies/deal-rescue-forecast-truth-system-context.svg"]],
  }),
  register({
    path: "/case-studies/creative-learning-os",
    nav: "case-studies",
    type: "case-study",
    title: "Creative Learning OS Case Study | Aixcel",
    description: "A live creative measurement system that checks test validity, evidence, fatigue, and funnel quality before a human approves the next experiment.",
    eyebrow: "Case study · creative intelligence · verified replay",
    h1: "Know what worked. Know why it might have.",
    deck: "Creative Learning OS checks whether a campaign comparison can support a lesson before it drafts the next test. It separates real signal from attribution, audience, placement, sample, lag, funnel-quality, and fatigue confounds.",
    answer: "Creative Learning OS demonstrates a governed route from aggregate campaign evidence to a reviewable creative learning without allowing a model to invent causal certainty, hide limitations, publish content, or change media spend.",
    aside: "Evidence basis: 13 synthetic golden scenarios, a licensed public historical baseline, green CI, Docker and PostgreSQL checkpoint proof, 34 production Postman assertions, live Vercel API, input-sensitivity testing, and desktop and mobile browser verification.",
    metrics: [["13/13", "top findings and decisions correct"], ["0", "automatic platform mutations"]],
    context: "Creative teams can call an asset a winner because CTR rose even when attribution windows, audience warmth, placement, sample size, conversion maturity, or creative variables changed at the same time. A false lesson then enters the next brief and causes the team to spend more money reproducing noise.",
    work: "Aixcel built a typed FastAPI control plane and an 11-node LangGraph workflow. Six analysis responsibilities inspect data integrity, creative taxonomy, measurement validity, normalized funnel performance, fatigue, and the public baseline before synthesis. Deterministic Python owns source hashing, metric formulas, sample and comparison gates, evidence policy, exposure limits, access, quotas, and the zero-mutation boundary. PostgreSQL, SQLAlchemy, Alembic, durable checkpoints, OpenTelemetry, Prometheus, structured logs, evaluations, Docker, Nginx, GitHub Actions, Playwright, Postman, and Vercel complete the operating path.",
    result: "The public workspace is input-sensitive rather than a fixed animation. The verified browser journey produced Scale with positive conversion evidence, then changed to Hold and reported lift as unavailable when the conversion comparator was set to zero. Mixed attribution fails closed. The release passed 68 tests, 82.76 percent measured coverage, 13 of 13 expected top findings and decisions, 18 of 18 evaluation measures at target, 34 production Postman assertions, PostgreSQL checkpoint recovery across an API restart, persistent dark and light themes, 20 Prometheus metric objects, and zero external mutations.",
    stack: "Python 3.12, FastAPI, Pydantic v2, LangGraph, SQLAlchemy, PostgreSQL 17, Alembic, REST, OpenAPI, Postman, OpenTelemetry, Prometheus, Docker, Nginx, GitHub Actions, Playwright, Vercel",
    dataset: "The regression corpus contains 13 synthetic aggregate portfolios covering valid lift, mixed attribution, fatigue, low sample, click-to-conversion conflict, placement and audience confounds, missing taxonomy, conversion lag, hostile caption instructions, multi-variable tests, stable control, and source receipt tampering. A separate CC BY 4.0 UCI Facebook Metrics artifact contains 500 historical rows, with 400 sequential training rows and 100 holdout rows. It has no geography, Florida cohort, influencer identity, or sales-outcome contract, so the public ridge model is disclosed as a low-confidence historical range, not a promised forecast.",
    evaluation: "The release gate measures condition detection, top-finding accuracy, decision accuracy, schema conformance, five evidence-binding dimensions, claim taxonomy, prompt-injection resistance, measurement policy, mutation safety, exposure bounds, source hashes, approval integrity, zero-cost replay, and model-scope disclosure. All 18 measures scored 1.0 across 13 scenarios. Unit, contract, migration, Docker, PostgreSQL restart, Postman, input-sensitivity, desktop, 390-pixel mobile, and theme-persistence journeys must also pass.",
    observability: "Every response carries a trace ID. Structured JSON logs, OpenTelemetry export, a Prometheus endpoint, lifecycle audit receipts, and 20 named metric objects cover traffic, latency, run state, node execution, finding categories, human decisions, observed lift, budget exposure, policy outcomes, idempotency, quotas, safe errors, checkpoint resumes, sample blocks, fatigue, attribution mismatch, and public baseline use. Initial pilot alerts are documented for readiness, 5xx rate, p95 graph time, hash mismatch, approval resume failure, policy shift, fatigue shift, and model drift.",
    decisions: [
      ["Browser and integration API", "REST with FastAPI and Pydantic", "Clear resources, generated OpenAPI, typed validation, simple Postman and browser testing", "GraphQL adds query complexity; gRPC does not fit a browser-first review surface"],
      ["Stateful collaboration", "LangGraph", "Explicit fan-out, deterministic fan-in, checkpoints, branching, and a human pause are visible and testable", "Free-form agent chat and CrewAI are less direct for this control-heavy workflow"],
      ["Measurement policy", "Deterministic Python", "Attribution, sample, formulas, permissions, and exposure limits must be repeatable", "An LLM may explain an approved result later but cannot own arithmetic or policy"],
      ["Durable state", "PostgreSQL with SQLAlchemy and Alembic", "Transactions, tenant relationships, audit queries, migrations, and checkpoint recovery are first-class", "MongoDB offers flexibility that this relational lifecycle does not need"],
      ["Monitoring", "OpenTelemetry, Prometheus, and structured logs", "Vendor-neutral signals work locally and can connect to Langfuse, Grafana, or another approved collector", "A proprietary-only monitor would weaken portability and the zero-cost replay"],
      ["Deployment", "Docker plus Nginx for portable release, Vercel for the public demo", "The container path proves a private API, database, health checks, and durable state while the public site scales to zero", "Kubernetes is deferred until a real target needs cluster scheduling and horizontal scale"],
    ],
    visual: "/assets/case-studies/creative-learning-os-system-context.png",
    visualAlt: "Creative Learning OS system context showing aggregate campaign evidence, typed contracts, deterministic controls, LangGraph collaboration, persistence, human approval, observability, and external mutation boundaries.",
    visualCaption: "System context and infrastructure. Aggregate evidence enters typed and deterministic controls before bounded analysis, evidence policy, human approval, durable records, and observability. The editable SVG is published with this case study.",
    links: [["Open the live creative decision room", "https://creative-learning-os.vercel.app"], ["Inspect the API contract", "https://creative-learning-os.vercel.app/docs"], ["Open editable architecture SVG", "/assets/case-studies/creative-learning-os-system-context.svg"]],
  }),
  register({
    path: "/case-studies/creator-talent-campaign-os",
    nav: "case-studies",
    type: "case-study",
    title: "Creator & Talent Campaign OS Case Study | Aixcel",
    description: "A live campaign control system that tests creator fit, authenticity, rights, conflicts, safety, budget, and evidence before human approval.",
    eyebrow: "Case study · creator operations · verified replay",
    h1: "Build the roster. Keep the decision human.",
    deck: "Creator & Talent Campaign OS converts a typed campaign brief and source-bound creator evidence into a ranked roster, budget position, policy findings, claim receipts, and a human decision.",
    answer: "Creator & Talent Campaign OS demonstrates a governed route from fragmented campaign evidence to a reviewable creator mix without allowing a model to invent performance certainty, contact talent, sign contracts, assign work, change spend, write to a CRM, or publish content.",
    aside: "Evidence basis: 13 synthetic golden campaign states, green CI, Docker and PostgreSQL checkpoint restart proof, 34 production Postman assertions, live Vercel API, input-sensitivity testing, and desktop and mobile browser verification.",
    metrics: [["13/13", "roster decisions and top findings correct"], ["0", "external campaign writes"]],
    context: "Creator selection is often split across spreadsheets, screenshots, talent notes, inboxes, schedules, contract records, and campaign reports. A visible reach number can hide weak audience authenticity, geographic mismatch, an exclusivity conflict, unavailable capacity, unsafe content, missing disclosure readiness, insufficient usage rights, weak measurement history, or an over-concentrated budget.",
    work: "Aixcel built a typed FastAPI control plane and a 12-node LangGraph workflow. Seven specialist responsibilities inspect data integrity, audience quality, campaign fit, availability and conflicts, brand safety, commercial rights, and historical performance before roster synthesis. Deterministic Python owns source hashes, scoring, budget arithmetic, threshold policy, role access, quotas, idempotency, evidence support, and the zero-write boundary. PostgreSQL, SQLAlchemy, Alembic, durable checkpoints, signed serverless receipts, OpenTelemetry, Prometheus, Structlog, evaluations, Docker, Nginx, GitHub Actions, Playwright, Postman, and Vercel complete the operating path.",
    result: "The public decision room is input-sensitive rather than a fixed animation. The verified baseline produced Ready For Review with four creators. Reducing audience authenticity and changing fee evidence produced Hold with three creators. The release passed 70 tests at 85.38 percent measured coverage, 13 of 13 expected decisions and top findings, 18 of 18 evaluation measures, 34 production Postman assertions, PostgreSQL run and checkpoint recovery after an API restart, 24 Prometheus metric objects, persistent dark and light themes, a 390-pixel journey with no horizontal overflow, and zero external writes.",
    stack: "Python 3.12, uv, FastAPI, Pydantic v2, LangGraph, SQLAlchemy, PostgreSQL 17, Alembic, REST, OpenAPI, Postman, OpenTelemetry, Prometheus, Structlog, Docker, Nginx, GitHub Actions, Playwright, Vercel",
    dataset: "The release corpus contains 13 purpose-built synthetic campaign states and five fictional creators. Aggregate records cover audience, geography, language, category, authenticity, availability, exclusivity, disclosure readiness, usage rights, safety, capacity, fee, and historical performance, each with a source hash. Scenarios cover a balanced launch, audience integrity failure, budget overrun, exclusivity conflict, capacity collision, geographic mismatch, brand safety failure, disclosure gap, usage-rights gap, weak measurement, portfolio concentration, prompt injection, and an efficient micro roster. A stronger client pilot would map approved aggregate exports from talent management, campaign reporting, finance, rights, and scheduling systems. Private messages, personal audience records, credentials, health information, and unapproved client identifiers remain outside the contract.",
    evaluation: "The release gate measures scenario decision accuracy, top-finding accuracy, schema conformance, four evidence and claim-binding dimensions, unsupported-claim rejection, prompt-injection containment, approval integrity, external mutation blocking, budget compliance, four vertical policy checks, deterministic replay, and input sensitivity. All 18 measures scored 1.0. Unit, contract, migration, Docker, PostgreSQL restart, Postman, production input-sensitivity, desktop, 390-pixel mobile, and theme-persistence journeys also passed.",
    observability: "Every response carries a trace ID. OpenTelemetry spans record route, run, tenant, scenario, agent, policy, approval, and mutation attributes. Structlog emits matching JSON investigation context without tokens or private raw records. Twenty-four Prometheus metric objects cover HTTP traffic and latency, graph and agent execution, findings, creator scores and selection, budget, audience, safety, conflicts, rights, capacity, evidence, claims, approval, audit, idempotency, quotas, errors, and checkpoints. Suggested pilot alerts cover readiness, 5xx rate, p95 graph time, stale approvals, quota spikes, evidence-policy shifts, checkpoint resume failures, and any external mutation signal above zero.",
    frameworks: [
      ["Python 3.12", "A general-purpose language with a mature AI, API, data, and testing ecosystem.", "It keeps policy, orchestration, contracts, persistence, evaluations, and telemetry in one readable backend language."],
      ["FastAPI and Pydantic v2", "FastAPI is an async Python API framework. Pydantic validates and serializes typed data contracts.", "Together they reject malformed inputs and generate the OpenAPI contract used by the browser and Postman."],
      ["LangGraph", "A stateful graph runtime for nodes, parallel branches, joins, checkpoints, and human pauses.", "Seven specialist checks can run independently, converge before synthesis, and stop at an explicit approval boundary."],
      ["PostgreSQL, SQLAlchemy, and Alembic", "PostgreSQL is a durable relational database. SQLAlchemy maps Python records, and Alembic versions schema changes.", "They preserve related runs, evidence, findings, approvals, quotas, audit events, and checkpoints transactionally."],
      ["OpenTelemetry, Prometheus, and Structlog", "OpenTelemetry standardizes traces, Prometheus exposes time-series metrics, and Structlog emits contextual JSON logs.", "The combination makes failures inspectable without locking the system to a paid monitoring vendor."],
      ["Postman", "A visual and command-line API testing tool for collections, environments, and assertions.", "It gives reviewers a repeatable journey from readiness and authentication to analysis, audit, approval, authorization failure, and input sensitivity."],
      ["Docker Compose", "A declarative way to run the API, web edge, and PostgreSQL together.", "It proves durable restart and approval resume with one command instead of relying only on serverless HTTP success."],
      ["Vercel", "A serverless HTTPS deployment platform that can scale an idle public demo down between requests.", "It supports the no-spend synthetic release while the documented PostgreSQL container path remains the durable client architecture."],
    ],
    decisions: [
      ["Browser and integration API", "REST with FastAPI and Pydantic", "Clear resources, generated OpenAPI, typed validation, and direct Postman and browser testing", "GraphQL adds query and authorization surface; gRPC is less useful for a browser-first review room"],
      ["Stateful collaboration", "LangGraph", "Explicit fan-out, deterministic fan-in, checkpoints, branching, and a human pause are visible and testable", "Free-form agent chat is harder to reproduce; CrewAI provides role collaboration but less direct graph control for this decision path"],
      ["Scoring and governance", "Deterministic Python", "Budget, authenticity thresholds, rights, conflicts, permissions, evidence support, and exposure limits must be repeatable", "A language model may explain an approved result later but cannot own arithmetic, access, or policy"],
      ["Durable state", "PostgreSQL with SQLAlchemy and Alembic", "Transactions, tenant relationships, audit queries, migrations, and checkpoint recovery are first-class", "A document database adds flexibility that this relational lifecycle does not need"],
      ["Monitoring", "OpenTelemetry, Prometheus, and Structlog", "Vendor-neutral traces, metrics, and logs work locally and can feed an approved collector", "A proprietary-only monitor would weaken portability and force an account for the public proof"],
      ["Deployment", "Docker with PostgreSQL for durable proof, Vercel for the public demo", "The container path proves restart behavior while the public release stays available without idle compute cost", "Kubernetes is deferred until real traffic, isolation, or a buyer requirement justifies operating a cluster"],
    ],
    visual: "/assets/case-studies/creator-talent-campaign-os-system-context.png",
    visualAlt: "Creator and Talent Campaign OS context showing aggregate campaign evidence, typed access controls, deterministic policy, seven specialist agent checks, roster synthesis, human approval, durable persistence, observability, and external write boundaries.",
    visualCaption: "System context and infrastructure. Source-bound aggregate evidence enters typed and deterministic controls before bounded specialist analysis, roster synthesis, human approval, durable records, and observability. The editable SVG is published with this case study.",
    links: [["Open the live campaign decision room", "https://creator-talent-campaign-os.vercel.app"], ["Inspect the API contract", "https://creator-talent-campaign-os.vercel.app/docs"], ["Open editable architecture SVG", "/assets/case-studies/creator-talent-campaign-os-system-context.svg"]],
  }),
  register({
    path: "/case-studies/agentic-systems-gateway",
    nav: "case-studies",
    type: "case-study",
    title: "Agentic Systems Gateway Case Study | Aixcel",
    description: "Governed inference gateway for nine deployed systems with replay, visitor-owned keys, signed receipts, observability, and zero external actions.",
    eyebrow: "Case study · agent infrastructure · verified public release",
    h1: "Let people test the systems. Keep cost and credentials bounded.",
    deck: "Agentic Systems Gateway provides one policy boundary for zero-cost replay, optional visitor-owned NVIDIA NIM or OpenRouter inference, system discovery, release evaluation, signed receipts, and operational telemetry.",
    answer: "Agentic Systems Gateway demonstrates how a public portfolio can expose real, input-sensitive system behavior without storing visitor keys, lending an owner-funded provider credential, accepting arbitrary model endpoints, or confusing release evidence with client production acceptance.",
    aside: "Evidence basis: green CI, 85 automated tests, 18 release evaluation measures, Docker and PostgreSQL restart proof, production Postman assertions, exact-artifact Vercel promotion, browser input-sensitivity testing, and a zero 5xx runtime review.",
    metrics: [["18/18", "release evaluation measures at target"], ["0", "external business actions"]],
    context: "A public agent portfolio creates a difficult operating boundary. Visitors need a working path when free providers are unavailable, live model calls cannot create an open-ended owner bill, API keys must not enter logs or storage, and a passing test suite must not be presented as evidence that a client accepted a production integration.",
    work: "Aixcel built a strict FastAPI and Pydantic control plane with a nine-system registry, nine evidence-qualified evaluation records, fixed NVIDIA NIM and OpenRouter provider adapters, deterministic evidence replay, request quotas, prompt-injection checks, HMAC-signed receipts, an optional redacted SQL ledger, generated OpenAPI, and a persistent light and dark workspace. LangGraph is intentionally excluded because this component is a deterministic policy boundary rather than an agent reasoning workflow. The browser sends a visitor key in one request header and clears the field after use. It cannot supply a model name, endpoint, tool, or external action. SQLAlchemy, Alembic, PostgreSQL, OpenTelemetry, Prometheus, Structlog, Docker, GitHub Actions, Postman, Playwright, and a pinned Linux Vercel builder complete the release path.",
    result: "The public deployment exposes nine systems and their tested release boundaries. Replay works without a model account and changes when evidence changes. Live NVIDIA NIM and OpenRouter paths require a visitor-owned key. Shared NVIDIA access exists as a disabled code path and cannot create spend until a durable cross-instance quota store, approved key, monitoring, and an explicit cost decision are supplied. The verified release passed 85 tests at 84.95 percent measured coverage, 18 of 18 evaluation measures, 12 production requests with 40 Postman assertions, four durable redacted receipts across a PostgreSQL API restart, desktop and 390-pixel browser journeys, seven rendered Swagger operations, persistent themes, zero browser errors, and zero production 5xx responses.",
    stack: "Python 3.12, uv, FastAPI, Pydantic v2, httpx, SQLAlchemy, PostgreSQL 17, Alembic, REST, OpenAPI, Postman, HMAC receipts, OpenTelemetry, Prometheus, Structlog, Docker, GitHub Actions, Playwright, Vercel",
    dataset: "The gateway does not train a model. Its controlled release corpus contains nine synthetic system records, nine evaluation records, and fixed replay scenarios for decision explanation, evidence critique, and structured summarization. Records disclose the live URL, data boundary, mutation boundary, tested scope, release proof, and replay scenario for each system. No client credentials, prompts, provider keys, patient information, private records, or raw model output enter the persistent receipt schema.",
    evaluation: "The release suite checks registry completeness, evaluation coverage, passing scores, zero external writes, disclosed data and mutation boundaries, replay availability, fixed HTTPS providers and models, disabled shared spend, redacted receipt schema, theme persistence, Postman contracts, PostgreSQL restart behavior, and the coverage floor. Unit, schema, security, provider, replay, registry, API, generation-drift, Postman, Docker, desktop, mobile, input-sensitivity, key-storage, Swagger, and runtime-log checks form the wider acceptance gate.",
    observability: "Every response receives a trace ID. OpenTelemetry propagates request and provider spans. Prometheus exposes more than 15 signal families across HTTP traffic, latency, provider calls, quotas, injection blocks, live and replay modes, errors, signed receipts, persistence, and registry access. Structlog emits contextual JSON without prompt or key content. Suggested alerts cover readiness, 5xx rate, p95 latency, provider error ratio, quota denials, security blocks, receipt failures, and any unexpected shared-provider activity.",
    frameworks: [
      ["FastAPI and Pydantic v2", "FastAPI is an async Python API framework. Pydantic validates and serializes typed contracts.", "They reject malformed input and generate the same OpenAPI contract used by the browser, Postman, and external reviewers."],
      ["httpx", "httpx is an async HTTP client for Python.", "It provides bounded timeouts and explicit request construction for the two fixed provider adapters without embedding provider behavior in the UI."],
      ["SQLAlchemy, Alembic, and PostgreSQL", "SQLAlchemy maps Python records, Alembic versions schema changes, and PostgreSQL provides durable relational storage.", "The private deployment path can preserve redacted, transactional receipts while the public Vercel release keeps persistence disabled."],
      ["OpenTelemetry, Prometheus, and Structlog", "OpenTelemetry standardizes traces, Prometheus exposes time-series metrics, and Structlog emits contextual JSON logs.", "Together they make requests, provider behavior, limits, security events, and failures inspectable without committing to a paid monitoring vendor."],
      ["Postman", "Postman is a visual and command-line API testing platform for collections, environments, and assertions.", "The 12-scenario collection proves health, capabilities, registry, evaluation, replay, sensitivity, injection blocking, and the no-key live boundary against production."],
      ["Docker and Vercel", "Docker packages a reproducible service and PostgreSQL runtime. Vercel provides on-demand serverless HTTPS deployment.", "Docker proves the durable private path while Vercel keeps the public synthetic gateway available without paid idle compute."],
    ],
    decisions: [
      ["Public API", "REST with FastAPI and Pydantic", "Clear resources, typed errors, generated OpenAPI, and direct browser and Postman testing", "GraphQL adds query and authorization surface; gRPC is less useful for a public browser workspace"],
      ["Policy flow", "Deterministic Python, not LangGraph", "Provider allowlists, quotas, key handling, receipts, and security decisions should be direct and reproducible", "LangGraph is valuable inside stateful agent workflows but would add orchestration where this gateway needs a fixed policy boundary"],
      ["Free demonstration", "Verified deterministic replay", "The system remains inspectable during provider outages and produces no inference bill", "An owner-funded public model key creates cost and abuse risk; a fixed canned page would fail the input-sensitivity requirement"],
      ["Live access", "Visitor-owned keys for fixed providers", "The visitor controls provider quota while the gateway controls model, endpoint, token, timeout, and tool boundaries", "Arbitrary OpenAI-compatible endpoints or model names would expand SSRF, cost, and unsupported capability risk"],
      ["Durable evidence", "HMAC receipts and optional redacted PostgreSQL ledger", "Reviewers can verify provider and content hashes without persisting prompts, keys, or raw output", "Full prompt logging creates unnecessary privacy and credential risk"],
      ["Deployment", "Vercel public release plus Docker and PostgreSQL private path", "The public interface scales down between requests while the container path proves durable restarts", "Kubernetes is deferred until traffic, tenancy, or a buyer requirement justifies cluster operations"],
    ],
    visual: "/assets/case-studies/agentic-systems-gateway-system-context.png",
    visualAlt: "Agentic Systems Gateway context showing visitor and system clients, typed policy controls, replay and fixed provider adapters, signed redacted receipts, evaluation registry, persistence, and observability.",
    visualCaption: "System context and infrastructure. All requests pass through typed validation and deterministic policy before replay or a fixed provider. Receipts retain hashes and usage metadata, never prompts or visitor keys.",
    links: [["Open the live gateway", "https://agentic-systems-gateway.vercel.app"], ["Inspect the API contract", "https://agentic-systems-gateway.vercel.app/docs"], ["Open editable architecture SVG", "/assets/case-studies/agentic-systems-gateway-system-context.svg"], ["Open security and data flow SVG", "/assets/case-studies/agentic-systems-gateway-security-flow.svg"]],
  }),
];

register({
  path: "/case-studies",
  nav: "work",
  type: "collection",
  title: "AI Automation Case Studies & System Evidence | Aixcel",
  description: "Inspect Aixcel evidence across lead operations, forecast control, revenue assurance, creator campaigns, multilingual content, and measurement.",
  eyebrow: "Selected systems · evidence",
  h1: "AI automation work with the theatre removed.",
  deck: "These case studies describe the constraint, architecture, controls, evidence basis, and documented result. Client identities are withheld where required; scope counts are not presented as outcomes; no result is a promise of future performance.",
  answer: "A useful AI automation case study should distinguish verified outcomes from implementation scope, explain how the system worked, identify the evidence source, and state what readers should not infer from the result.",
  aside: "Aixcel currently publishes only evidence it can label responsibly. Additional case studies will be added as disclosure permissions and supporting records allow.",
});

register({
  path: "/contact",
  nav: "contact",
  type: "contact",
  title: "Contact Aixcel Solutions | Book an AI Systems Audit",
  description: "Book a focused 25-minute AI systems audit with Aixcel Solutions or email Ahmad Bukhari about AI automation, CRM, voice AI, or agentic workflows.",
  eyebrow: "Contact Aixcel Solutions",
  h1: "Bring the messy part. We will find the first useful move.",
  deck: "Share where leads disappear, work stalls, systems disagree, or your team keeps compensating for tools. The first conversation is a focused diagnosis—not a generic AI pitch.",
  answer: "The free 25-minute systems audit identifies the operational constraint, tests whether AI or automation is appropriate, and defines a practical next step. There is no obligation and no generic slide deck.",
  aside: "Founder-led in Islamabad and working globally. Calls are booked through Ahmad Bukhari's official Cal.com event.",
});

register({
  path: "/privacy",
  nav: "",
  type: "policy",
  title: "Privacy Notice | Aixcel Solutions",
  description: "Aixcel Solutions privacy notice covering website visits, enquiries, booking links, service delivery, data use, retention, security, and contact choices.",
  eyebrow: "Privacy notice",
  h1: "How Aixcel handles information.",
  deck: "This notice explains what information Aixcel Solutions may receive through this website, enquiries, booking, and service delivery, why it is used, and the choices available to you.",
  answer: "Aixcel collects only information needed to respond to enquiries, schedule conversations, provide agreed services, secure its systems, and meet applicable obligations. It does not sell personal information.",
  aside: `Last updated ${published}. Questions and privacy requests can be sent to ahmadbukhari4245@gmail.com.`,
});

register({
  path: "/terms",
  nav: "",
  type: "policy",
  title: "Website Terms | Aixcel Solutions",
  description: "Terms for using the Aixcel Solutions website, including informational content, intellectual property, third-party links, service proposals, and liability.",
  eyebrow: "Website terms",
  h1: "Terms for using this website.",
  deck: "These terms apply to the public Aixcel Solutions website. Client work is governed by the signed proposal, statement of work, or other agreement for that engagement.",
  answer: "Website content is provided for general information and does not create a consulting relationship, guarantee results, or replace legal, financial, compliance, security, or other professional advice.",
  aside: `Last updated ${published}. Questions can be sent to ahmadbukhari4245@gmail.com.`,
});

register({
  path: "/insights/new-ai-model-business-case-workflow-evaluation",
  nav: "insights",
  type: "insight",
  publishedOn: "2026-07-27",
  title: "A New AI Model Is Not a Business Case | Aixcel",
  description: "A practical framework for testing a new AI model against a real workflow, failure criteria, total cost, latency, and human approval boundaries.",
  eyebrow: "AI, Plain English · Post 006",
  publicLabel: "Post 006",
  h1: "A new AI model is not a business case.",
  deck: "A release becomes useful only after it survives a workflow-specific test with representative inputs, explicit failure criteria, total-cost limits, and a human stop point.",
  answer: "Treat a newly released model as a candidate. Compare it with the current model on one bounded workflow and adopt only when the measured gain exceeds switching and oversight cost.",
  aside: "OpenAI launched GPT-5.6 on 9 July 2026. Capability, benchmark, pricing, and availability statements are taken from OpenAI's materials. The workflow framework is Ahmad Bukhari's operational interpretation; no universal performance or ROI claim is made.",
  hero: "/assets/new-ai-model-business-case.png",
  heroAlt: "A release signal enters a bounded workflow trial, showing that a new AI model must be tested before it becomes a business case.",
  takeaways: [
    "Test one bounded workflow, not a model in the abstract.",
    "Compare quality, severe failures, intervention rate, end-to-end time, and total cost together.",
    "Keep the current model as the control and use representative cases, including exceptions.",
    "Define the human stop point before the pilot, then adopt only where the operating gain is measurable.",
  ],
  sections: [
    {
      heading: "A release and a business case answer different questions",
      paragraphs: [
        "OpenAI launched the GPT-5.6 family on 9 July 2026 with capability, efficiency, pricing, availability, and safety claims. The release is consequential. It is not, by itself, evidence that a service business should switch models.",
        "A model release answers what is newly available. A business case answers what improves in your work, for whom, at what cost, and under which failure conditions.",
        "A benchmark uses a defined test harness. Your workflow includes your inputs, tools, permissions, latency, review burden, customer promises, and exceptions. OpenAI's preview material says no evaluation can represent every product configuration or real-world workflow. Our operational conclusion: treat the new model as a candidate until it passes a workflow-specific test.",
      ],
    },
    {
      heading: "What changed with GPT-5.6",
      paragraphs: [
        "OpenAI describes GPT-5.6 as a family of three models: Sol, Terra, and Luna. Its launch announcement reports improvements across coding, knowledge work, cybersecurity, science, speed, and estimated cost. GPT-5.6 Sol is rolling out in ChatGPT to eligible paid plans; availability can vary by plan and managed-workspace settings. API pricing and access also vary by model and product.",
        "Those facts establish availability and vendor-reported performance. They do not establish performance in your proposal desk, customer-support queue, research process, or intake workflow.",
      ],
    },
    {
      heading: "The smallest useful model evaluation",
      paragraphs: [
        "Choose one recurring workflow with a visible output and a named owner. Build a set of 20–50 representative cases containing normal work, awkward edge cases, incomplete inputs, and cases that must stop for human review.",
        "Run the current and candidate models against the same cases. Do not collapse the results into one impressive average. A modest quality gain is not worth a new high-severity failure mode.",
      ],
      bullets: [
        "Task acceptance: did the result meet the fixed workflow rubric?",
        "Severe failures: did it invent, expose, send, approve, or change anything it should not?",
        "Intervention rate: how often did a person need to repair or rerun the output?",
        "End-to-end time: include tool calls and review, not model latency alone.",
        "Total cost: include tokens, tools, retries, engineering, review, and migration.",
        "Boundary compliance: did the system stop where policy required?",
      ],
    },
    {
      heading: "Worked example: proposal drafting",
      paragraphs: [
        "Imagine a 30-person services firm evaluating GPT-5.6 Sol for first-draft proposals. The following 30-case mix is illustrative—not a measured result or universal sampling formula.",
        "The team selects 18 normal opportunities, six with incomplete discovery notes, four with conflicting pricing records, and two containing restricted client information. The current model and candidate receive the same approved source pack and instruction set.",
        "The team checks whether the candidate cites the approved price, refuses to fill missing discovery facts, keeps restricted material out of the draft, and routes conflicts to the proposal owner. Review time and retry cost are included.",
        "The business case exists only if the candidate reduces total preparation time without increasing material errors, exposure, or approval burden. Better prose with more verification work is not an operating improvement.",
      ],
    },
    {
      heading: "Opportunities, risks, and limitations",
      paragraphs: [
        "A stronger candidate may reduce low-value editing, improve multi-step research, and let teams match capability and cost to task difficulty. A disciplined comparison can also expose weaknesses in the workflow itself, regardless of which model wins.",
        "Launch benchmarks are not your acceptance tests and may use different tools, prompts, reasoning settings, or cost assumptions. Vendor-reported comparisons are useful evidence, not independent proof of your outcome. Rollout, plan eligibility, rate limits, and pricing can change.",
        "A more capable model can create larger consequences when permissions are too broad. Small test sets can miss rare failures, so high-impact workflows need ongoing sampling after launch.",
      ],
    },
    {
      heading: "Who should act now—and who should wait",
      paragraphs: [
        "Act now if you have a costly, frequent workflow; a stable baseline; representative cases; a measurable rubric; and a reversible pilot.",
        "Wait if the workflow is undefined, source data is unreliable, nobody owns exceptions, or adoption requires broad production permissions before value is proven.",
      ],
    },
    {
      heading: "A practical 30/60/90-day adoption framework",
      paragraphs: [
        "Days 1–30: select one workflow and owner, freeze a representative evaluation set and rubric, establish the current model's baseline, and test the candidate offline with no customer-facing side effects.",
        "Days 31–60: run a controlled pilot with approved data and tools. Require review before external actions, measure acceptance, failures, intervention, time, and cost, and add observed exceptions to the test set.",
        "Days 61–90: adopt, restrict, or reject the candidate for that workflow. Document the approved configuration and rollback path, keep sampling live outcomes for drift, and evaluate the next workflow separately.",
      ],
    },
  ],
  faqs: [
    ["Should we always test the newest model?", "No. Test when the possible workflow gain is large enough to justify evaluation and switching cost."],
    ["How many examples are enough?", "Twenty to fifty cases can support an initial bounded comparison, but not universal reliability claims. Increase coverage with risk, variation, and consequence."],
    ["Is the cheapest model the best business choice?", "Not necessarily. Total workflow cost includes retries, review, tool calls, latency, integration, and failures—not only token price."],
    ["Can a public benchmark replace our test?", "No. It helps form a hypothesis. An acceptance decision needs your configuration, inputs, tools, rubric, and boundaries."],
  ],
  sources: [
    ["OpenAI — GPT-5.6 launch", "https://openai.com/index/gpt-5-6/", "Primary 9 July 2026 announcement for the model family, vendor-reported evaluations, pricing, safeguards, and availability."],
    ["OpenAI — GPT-5.6 System Card", "https://deploymentsafety.openai.com/gpt-5-6", "OpenAI's capability, risk, evaluation, and mitigation report for the GPT-5.6 family."],
    ["OpenAI — Model Release Notes", "https://help.openai.com/en/articles/9624314-model-release-notes", "Current ChatGPT rollout record and eligible-plan availability caveats."],
    ["OpenAI — GPT-5.6 preview", "https://openai.com/index/previewing-gpt-5-6-sol/", "Preview announcement and the limitation that evaluations cannot represent every real-world configuration."],
  ],
  related: [["Claude Opus 5 model controls", "/insights/claude-opus-5-model-upgrade-workflow-controls"], ["Agentic workflow delivery", "/services/agentic-workflows"], ["Discuss a workflow evaluation", "/contact"]],
});

register({
  path: "/insights/claude-opus-5-model-upgrade-workflow-controls",
  nav: "insights",
  type: "insight",
  publishedOn: "2026-07-25",
  title: "Claude Opus 5: Fixed Controls for Safer Model Upgrades | Aixcel",
  description: "Claude Opus 5 is available across major AI platforms. Learn why stronger models still need fixed permissions, evaluations, approvals, and evidence.",
  eyebrow: "AI, Plain English · Post 004",
  h1: "Claude Opus 5: why a model upgrade still needs fixed workflow controls.",
  deck: "A stronger model can improve the decision step. It should not quietly change permissions, approval gates, stop conditions, or the evidence your workflow records.",
  answer: "Treat a model change as a controlled production change: keep the task set, permissions, acceptance criteria, approval rules, and logging fixed while you compare outcomes.",
  aside: "Anthropic released Claude Opus 5 on 24 July 2026. Capability and benchmark statements are vendor-reported unless identified as an Aixcel recommendation; no universal performance, safety, or ROI claim is made.",
  hero: "/assets/claude-opus-5-model-upgrade-controls.png",
  heroAlt: "An ivory model module moves through a dark changeover rail while six surrounding workflow-control objects remain fixed.",
  takeaways: [
    "Claude Opus 5 gives teams a new option for complex agentic coding and enterprise work, with a one-million-token context window and standard API pricing of $5 per million input tokens and $25 per million output tokens.",
    "Availability in GitHub Copilot and Microsoft Foundry lowers the friction of testing the model, but does not prove that an existing workflow remains safe, reliable, or economical after the switch.",
    "Keep permissions, test cases, approval gates, stop conditions, and evidence fixed while comparing the new model with a stable baseline.",
    "Route work to Opus 5 only where representative evaluations show a material gain after cost, latency, review effort, and failure impact are included.",
  ],
  sections: [
    {
      heading: "The operating change is easier access, not automatic readiness",
      paragraphs: [
        "On 24 July 2026, Anthropic released Claude Opus 5 for complex agentic coding and enterprise work. Anthropic lists a one-million-token context window, up to 128,000 output tokens, and standard API pricing of $5 per million input tokens and $25 per million output tokens. Its current model overview positions Fable 5—not Opus 5—as the company's highest-capability generally available model.",
        "The model also appeared inside tools many teams already use. GitHub made Opus 5 available across Copilot surfaces including Visual Studio Code, Copilot CLI, the cloud agent, GitHub.com, and several IDEs. GitHub says the rollout is gradual, access is limited to eligible paid plans, and Business or Enterprise administrators must enable the model policy.",
        "Microsoft Foundry exposes Opus 5 through Azure-native endpoints and authentication. Its documentation distinguishes Azure-hosted deployments from Anthropic-hosted deployments. Several features—including structured outputs, server-side tools, MCP connectors, Agent Skills, and programmatic tool calling—are unavailable when the deployment is hosted on Azure.",
        "That wider availability is consequential: a team can test a stronger model without rebuilding its development environment or cloud relationship. But access is not the same as readiness.",
      ],
    },
    {
      heading: "The model is one component inside a decision system",
      paragraphs: [
        "When a new model arrives, the natural question is whether it is smarter. The more useful operating question is which part of the workflow should improve, and which controls must remain fixed while the team finds out.",
        "A model upgrade may improve the decision step. It can also change tool selection, verbosity, token use, latency, refusal behaviour, and how the system interprets old prompts. Anthropic's migration guidance recommends re-running effort settings and task evaluations instead of carrying every previous default forward.",
        "The safest comparison changes one important variable at a time: the model. Keep the task set, permissions, acceptance criteria, approval rules, and logging stable. That turns a launch into an observable experiment rather than an uncontrolled rewrite.",
      ],
      bullets: [
        "Signal: define the request that starts the work.",
        "Context: specify which records, instructions, and tools the system may use.",
        "Decision: define the plan or recommendation the model may form.",
        "Boundary: make prohibited, approval-gated, and out-of-scope actions explicit.",
        "Action: state what the system may actually change.",
        "Evidence: record what happened and whether the outcome met the acceptance criteria.",
      ],
    },
    {
      heading: "Where businesses can use the upgrade",
      paragraphs: [
        "The strongest initial candidates are workflows where deeper reasoning has enough value to justify higher cost or slower responses. For complex software changes, try the model on multi-file work, difficult refactors, or code review while keeping branch protection, tests, security review, and deployment approval outside the model.",
        "For high-value knowledge work, test it on long documents, complex spreadsheets, investigation packs, or research where missing a dependency is costly. Require source links, calculation checks, and a named reviewer before an output becomes a business decision.",
        "For multi-step internal agents, let the model plan and coordinate a bounded workflow across approved systems while preserving least-privilege access, per-action approvals, retry limits, and an explicit human exception path.",
        "The common pattern is not to give the new model more authority. It is to give the same controlled task to a new engine and compare the evidence.",
      ],
    },
    {
      heading: "Worked example: a coding agent changes a refund service",
      paragraphs: [
        "Suppose a team asks an agent to update a refund-eligibility service after a policy change. The model may produce a better change than the previous model. The workflow remains trustworthy because its authority and evidence do not move with the model picker.",
      ],
      bullets: [
        "Signal: a reviewed issue contains the new rule, acceptance criteria, and affected services.",
        "Context: the agent may read the relevant repository, tests, architecture note, and policy source; production credentials and customer data remain unavailable.",
        "Decision: Opus 5 proposes the smallest code change and identifies the tests that should change with it.",
        "Boundary: the agent cannot merge, deploy, change branch protection, or alter unrelated services; ambiguity stops the workflow for clarification.",
        "Action: the agent creates a draft pull request and runs the approved test suite in an isolated environment.",
        "Evidence: the pull request records the model version, issue reference, files changed, tool calls, tests, failures, reviewer, and final decision.",
      ],
    },
    {
      heading: "Opportunities, risks, and limitations",
      paragraphs: [
        "The testable opportunities include fewer abandoned long-running tasks, better review of complex changes, less unnecessary prompt scaffolding, and more selective routing between expensive capability and cheaper routine models. GitHub's observations and Anthropic's capability descriptions are vendor-reported; the real result depends on your work, tools, prompts, and acceptance criteria.",
        "Cost can drift when long context and high effort consume more tokens without a proportional gain. Prompts tuned for an older model may over-constrain, over-verify, or produce longer outputs. The same model name can also involve different hosting, features, billing, rollout status, and data routes across platforms.",
        "Better benchmark performance does not prove reliability on your policies, tools, customer data, or exception cases. Capability is not authority, and stronger performance is not a reason to widen permissions silently. Refusals and safety fallbacks are workflow states that need explicit handling.",
      ],
    },
    {
      heading: "Who should act now—and who should wait",
      paragraphs: [
        "Act now if you already run a controlled evaluation harness, use Opus-class models for difficult multi-step work, and can compare quality, latency, and cost against a stable baseline. Run a small shadow-mode test first when the workflow is valuable but acceptance criteria remain partly subjective.",
        "Wait if you have no representative test set, no record of tool actions, or no rollback path. Also wait for routine, high-volume work that already meets its quality target on a cheaper model. The goal is to route each task to the lowest-cost option that reliably meets the required outcome, not to standardise on the newest model.",
      ],
    },
    {
      heading: "A practical 30/60/90-day upgrade plan",
      paragraphs: [
        "Days 1–30: select 25–50 representative tasks, including failures and exceptions. Record current success, human rework, tool errors, latency, and cost per accepted result. Freeze permissions, stop conditions, approval gates, and evidence fields, and define a rollback trigger before testing.",
        "Days 31–60: run the same task set against the current model and Opus 5 in shadow mode. Sweep effort levels, review tool trajectories as well as final answers, and measure repeated reliability, reviewer acceptance, and cost per accepted outcome.",
        "Days 61–90: enable Opus 5 only for task classes where it clears the acceptance threshold. Keep a cheaper default for routine work, canary the change, retain rollback, monitor new failure patterns, and add production exceptions to the evaluation set.",
      ],
    },
  ],
  faqs: [
    ["Is Claude Opus 5 Anthropic's most capable model?", "Anthropic's model overview currently positions Claude Fable 5 as its highest-capability generally available model and Opus 5 as the advanced option for complex agentic coding and enterprise work."],
    ["Is Claude Opus 5 generally available?", "Anthropic says Opus 5 is available on all of its platforms. GitHub lists it as generally available in Copilot with a gradual rollout and eligible-plan limits, while Microsoft Foundry documents Azure-hosted and Anthropic-hosted deployment options."],
    ["Should every team replace its current model?", "No. Replace a model only where representative evaluations show a worthwhile improvement after cost, latency, review effort, and failure impact are included."],
    ["Does a one-million-token context window remove the need for retrieval design?", "No. A larger window changes capacity, not source quality, access control, freshness, or relevance. The workflow still decides which context is allowed and useful."],
    ["What should remain fixed during a model comparison?", "Keep the task set, data access, tool permissions, stop conditions, approval rules, output criteria, and evidence capture fixed. Otherwise you will not know which change produced the result."],
  ],
  sources: [
    ["Anthropic — Introducing Claude Opus 5", "https://www.anthropic.com/news/claude-opus-5", "Primary announcement for the 24 July 2026 release, availability, pricing, Anthropic-reported evaluations, safeguards, and platform access."],
    ["Anthropic — Models overview", "https://platform.claude.com/docs/en/about-claude/models/overview", "Current model positioning, IDs, context and output limits, and listed standard pricing."],
    ["Anthropic — Prompting Claude Opus 5", "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5", "Model-specific migration and prompting guidance, including effort and evaluation recommendations."],
    ["Anthropic — Claude in Microsoft Foundry", "https://platform.claude.com/docs/en/build-with-claude/claude-in-microsoft-foundry", "Hosting options, access pattern, model IDs, and documented feature differences."],
    ["GitHub — Claude Opus 5 in GitHub Copilot", "https://github.blog/changelog/2026-07-24-claude-opus-5-is-now-available-in-github-copilot/", "Supported Copilot surfaces, eligible plans, gradual rollout, and administrator enablement."],
    ["GitHub — Supported AI models in Copilot", "https://docs.github.com/en/copilot/reference/ai-models/supported-models", "Current Copilot model support and plan information."],
    ["AWS and Motorway — Evaluating AI agents in production", "https://aws.amazon.com/blogs/machine-learning/evaluating-ai-agents-a-production-blueprint-with-strands-and-agentcore/", "A production evaluation blueprint used as supporting context for layered workflow evaluation."],
  ],
  related: [["Context is not consent", "/insights/context-is-not-consent-ai-private-data"], ["OpenAI Presence operating controls", "/insights/openai-presence-enterprise-ai-agent-rollout"], ["Agentic workflow delivery", "/services/agentic-workflows"]],
});

register({
  path: "/insights/context-is-not-consent-ai-private-data",
  nav: "insights",
  type: "insight",
  publishedOn: "2026-07-24",
  title: "Context Is Not Consent: AI Permission Boundaries | Aixcel",
  description: "OpenAI Health shows why an AI system needs a visible permission boundary between private context and consequential action.",
  eyebrow: "AI, Plain English · Field Note 003",
  h1: "Context is not consent: build the permission boundary before the action.",
  deck: "OpenAI’s Health rollout makes a universal implementation lesson visible: giving an AI more private context must not quietly give it more authority.",
  answer: "Treat every connection as a separate decision: define the data an AI may see, the action it may take, when it must ask again, how access is withdrawn, and who can inspect what happened.",
  aside: "OpenAI announced Health in ChatGPT on 23 July 2026 for logged-in U.S. adults on web and iOS. This is an operational design note, not medical, legal, privacy, or compliance advice.",
  hero: "/assets/context-is-not-consent-permission-boundary.svg",
  heroAlt: "A permission-boundary diagram separates AI context from consequential action: Context, Permission Boundary, and Action.",
  takeaways: [
    "A connected data source gives an AI context; it does not automatically grant authority to change, disclose, spend, send, or decide.",
    "A production workflow needs five visible steps: Connect, Context, Boundary, Confirm, and Revoke.",
    "Start with read access and one reversible, policy-bounded action; name an owner for exceptions before widening the scope.",
    "This article draws an operating lesson from a consumer-health launch. It does not assess the product’s clinical, legal, security, or regulatory suitability.",
  ],
  sections: [
    {
      heading: "What the announcement establishes—and what it does not",
      paragraphs: [
        "On 23 July 2026, OpenAI announced Health in ChatGPT. The company says logged-in U.S. users aged 18 and older can connect Apple Health and supported medical records on web and iOS, and that Health information is not used to train its foundation models or target ads. OpenAI also says ChatGPT asks for permission by default before using connected Health information to personalize a response.",
        "Those are product facts from OpenAI, not a transferable implementation guarantee. OpenAI says the experience does not replace qualified medical judgment, and the rollout, connected sources, permissions, and availability are all product-specific. A business should verify its own jurisdiction, contracts, data categories, integration behavior, and controls before using any comparable pattern.",
        "The transferable lesson is narrower and useful: context and authority are different system states. A source connection can make an AI more informed. It should not silently expand what the AI is allowed to do with that information or on the user’s behalf.",
      ],
    },
    {
      heading: "The five-step permission loop",
      paragraphs: [
        "A reliable AI workflow makes the transition from information to action explicit. The simplest useful model is Connect, Context, Boundary, Confirm, and Revoke. It is not a compliance framework by itself. It is a way to stop a convenient integration from becoming an unowned decision path.",
      ],
      bullets: [
        "Connect: specify the source, account, data categories, purpose, and retention expectations. Do not treat a broad OAuth grant as a business rule.",
        "Context: define what the model may retrieve or summarize. Keep source provenance and the currentness of the record visible to the user or operator.",
        "Boundary: map allowed, prohibited, and human-only actions. A useful default is read access before any write access.",
        "Confirm: require a fresh confirmation before an external, irreversible, sensitive, or financially consequential action. The confirmation should state the object, outcome, and destination.",
        "Revoke: let a person disconnect the source, reduce the scope, stop a workflow, and find the audit trail without filing a support ticket.",
      ],
    },
    {
      heading: "Worked example: customer support with private account context",
      paragraphs: [
        "Consider a support agent connected to a customer account, subscription, order history, and service tickets. The connection may let the agent explain the current plan, summarize recent cases, and surface the next delivery date. That is useful context. It is not permission to change the account owner, disclose details to an unverified caller, cancel a contract, or issue an unbounded credit.",
        "A controlled first release could permit the agent to retrieve a verified customer’s order status, create a support case, and resend an existing invoice. It could require confirmation to change a delivery address before fulfilment, and it could stop for a named human owner when the request involves refunds above a defined value, account recovery, a complaint, or a policy exception.",
        "The design target is not a chatbot that sounds certain. It is a service path in which the permitted action, the identity check, the confirmation, the exception owner, and the audit record are all testable. If an operator cannot show those things, the system is carrying more authority than the organisation can govern.",
      ],
    },
    {
      heading: "Controls to design before an AI can act",
      paragraphs: [
        "Start with the smallest route that creates a measurable customer or operational benefit. Then make its controls visible in the workflow, not only in a policy document.",
      ],
      bullets: [
        "Identity and source: verify the actor, use the minimum data scope, record the system of record, and handle stale or conflicting data deliberately.",
        "Action policy: maintain an allowlist of actions, thresholds, prohibited outcomes, and a named exception owner. Model confidence is not an authority boundary.",
        "Confirmation: distinguish between a request to inspect information and a request to disclose, change, send, spend, or commit. Ask again when the consequence changes.",
        "Recovery: give operators a clear stop control, replay or rollback where possible, and a human queue with enough context to resolve the case.",
        "Evidence: log the source used, rule applied, action proposed or taken, user confirmation, handoff, and result. Review samples and exceptions against a defined evaluation set.",
      ],
    },
    {
      heading: "Opportunities, risks, and who should act now",
      paragraphs: [
        "This pattern can improve response speed, reduce repeated data gathering, and give people better context at the moment they need to decide. It is particularly useful in support, sales operations, service delivery, and internal coordination where a bounded action can remove routine work without hiding consequential decisions.",
        "The risks are equally practical: a weak identity check can expose information; stale context can produce the wrong action; a broad tool permission can turn a suggestion into a commitment; and a missing audit trail can make a failure impossible to diagnose. Privacy, consumer protection, security, employment, sector, and cross-border rules may add requirements that this article does not cover.",
        "Act now if you have one repeatable workflow, reliable source data, a named owner, a low-risk starting action, and a way to evaluate the result. Wait if policies change weekly, records conflict, the first action is high stakes, or no one owns the exception queue. In that case, map the process and decision rights before connecting more systems.",
      ],
    },
    {
      heading: "A practical 30/60/90-day implementation plan",
      paragraphs: [
        "Days 1–30: choose one bounded workflow and make the permission map. List data sources, data categories, identity checks, allowed and prohibited actions, confirmation moments, exception owners, retention, and the evidence that proves a correct outcome. Capture baseline volume, completion time, error or re-contact rate, and manual effort.",
        "Days 31–60: build the controlled slice. Connect the minimum source data, start read-only where possible, and add one reversible action behind a clear policy. Test normal, ambiguous, adversarial, stale-data, permission-denied, and revoke scenarios. Review every exception and sample completed work against the acceptance criteria.",
        "Days 61–90: release with observability, then expand one boundary at a time. Compare outcomes with the baseline, inspect confirmation and exception patterns, version the action policy, and give the operating owner a tested stop and recovery path. Do not turn a successful read-only pilot into broad write authority in one jump.",
      ],
    },
  ],
  faqs: [
    ["Does connecting a source mean the AI can act on it?", "No. A connection provides a technical path to data or tools. The organisation still needs an explicit policy for what may be read, changed, disclosed, sent, approved, or escalated."],
    ["What is the safest first action for an AI workflow?", "Usually a read-only or reversible task with reliable data, a clear success criterion, and a visible human exception path. The correct choice depends on the workflow and its consequences."],
    ["When should the system ask for confirmation?", "Before a new or consequential step such as disclosure, an external message, a record change, a financial commitment, or an irreversible action. State exactly what will happen before the user confirms."],
    ["Can this article be used as medical or legal advice?", "No. It is a business implementation note inspired by a product announcement. Health, privacy, security, legal, compliance, and sector-specific decisions need qualified review for the relevant context."],
  ],
  sources: [
    ["OpenAI — Launching Health in ChatGPT", "https://openai.com/index/health-in-chatgpt/", "Primary announcement for the 23 July 2026 rollout, connected-data options, default permission behavior, access controls, and medical-care caveat."],
  ],
  related: [["Agentic workflow delivery", "/services/agentic-workflows"], ["Aixcel delivery process", "/process"], ["Ahmad Bukhari's profile", "https://www.linkedin.com/in/bukhariahmad/"]],
});

register({
  path: "/insights/openai-presence-enterprise-ai-agent-rollout",
  nav: "insights",
  type: "insight",
  title: "OpenAI Presence: Enterprise AI Agent Operations | Aixcel",
  description: "What OpenAI Presence means for enterprise voice and chat agents: policies, testing, escalation, risks, and a practical 30/60/90-day operating plan.",
  eyebrow: "AI, Plain English · Field Note 002",
  h1: "OpenAI Presence: the new standard for enterprise AI agent operations.",
  deck: "The important change is not a more fluent bot. It is the move toward agents with explicit policies, approved actions, evaluations, and accountable handoff.",
  answer: "Treat a customer-facing AI agent as an operating system: define what it may know, what it may do, what it must verify, and when a named person takes over.",
  aside: "OpenAI announced Presence on 22 July 2026. It is an assisted, non-self-service enterprise offering; confirm commercial access, integrations, and terms directly before making a roadmap commitment.",
  hero: "/assets/openai-presence-enterprise-agent-operations.png",
  heroAlt: "An operations leader routes customer requests through a controlled decision gate, with a human exception path.",
  takeaways: [
    "Presence frames a customer-facing agent as a controlled system with policies, approved actions, testing, monitoring, and escalation—not a chat interface that can simply be switched on.",
    "OpenAI says it is generally available to eligible enterprise customers, but not self-service. Field teams and selected systems integrators support deployment.",
    "The first strong use cases are bounded, high-volume requests with reliable data and a visible exception path.",
    "Operational design—not prompt cleverness—sets the ceiling: decision rights, source systems, exception ownership, and evaluation determine whether an agent is safe to scale.",
  ],
  sections: [
    {
      heading: "The release is about control, not a smarter chatbot",
      paragraphs: [
        "On 22 July 2026, OpenAI introduced Presence, a platform for enterprise voice and chat agents. Its important idea is not simply that an agent can speak naturally to a customer. The platform is organised around what a live operation needs before an agent can act: policy controls, approved actions, simulations, evaluations, monitoring, and escalation.",
        "In plain English, the decision moves from ‘Can the agent answer this?’ to ‘Under which conditions may it answer, change something, or hand the case to a person?’ That is the question that matters when an answer can create a promise, an expense, or a compliance obligation.",
        "OpenAI describes Presence as generally available for eligible enterprise customers. That should not be read as a self-service product claim. The company says deployment is assisted by its field teams and selected implementation partners. Pricing, regional coverage, source-system integrations, data handling, and support terms remain buyer-verification items.",
      ],
    },
    {
      heading: "Why this matters to business leaders now",
      paragraphs: [
        "The first wave of business AI mostly drafted things: an email, proposal, summary, or research note. The next wave is operational. It answers a customer, looks up a record, interprets a policy, selects a permitted action, and records what happened. The prize is bigger—faster response, wider coverage, and less repetitive work—but so is the exposure when an agent makes an incorrect promise or acts without authority.",
        "Presence signals where enterprise adoption is heading: agents will be judged by the quality of their controls as much as their conversational capability. The useful implementation is not the one with the most impressive demo. It is the one that can show which requests were handled, which actions were taken, which cases were escalated, and whether the outcomes met a defined standard.",
        "OpenAI reports that its own English phone-support deployment resolved 75% of inbound support requests. This is a vendor-reported result in a particular operating context—not a benchmark a buyer should copy into a forecast. It is evidence of meaningful use, not evidence that every contact centre, language, policy set, or integration will see the same result.",
      ],
    },
    {
      heading: "Where a controlled agent can create value",
      paragraphs: [
        "Start with work that has repeatable intent, reliable data, and a clear safe action. Customer service is the obvious category, but the same pattern appears across operations.",
      ],
      bullets: [
        "Customer support: identify an order, explain its status, make a permitted change, or escalate a disputed case with context attached.",
        "Revenue operations: qualify an inbound request, validate account details, schedule the next step, and route exceptions to a sales or success owner.",
        "Service operations: triage an equipment issue, collect required facts, create a case, and hand off safety-critical work to a certified person.",
        "Finance operations: answer routine invoice-status questions, collect missing documentation, and direct approvals without authorising payment changes.",
      ],
    },
    {
      heading: "Worked example: delivery changes without uncontrolled promises",
      paragraphs: [
        "Imagine an e-commerce company receiving thousands of ‘Where is my order?’ and ‘Can I change my delivery address?’ contacts each week. A conventional chatbot may stop at a help-centre link. An operational agent can do more, but only after the company makes its decision rules explicit.",
        "First, define permitted actions. The agent may look up an order, resend a tracking link, update an address only before carrier handoff, and create a replacement request only when stock and policy conditions are met. It may not refund a high-value order, override a fraud flag, alter an address after carrier handoff, or promise a delivery date.",
        "Next, create tests from real but anonymised conversations: a routine address change; a change after handoff; a suspected account takeover; a damaged order; abusive language; and an unknown case. Each has an expected outcome: complete, verify, or escalate. The agent passes because it selects the correct outcome, not because its wording sounds helpful.",
        "Run the agent in one limited queue. A supervisor reviews completed work, samples the notes, tracks escalation reasons, and measures what customers do next. The real outcome is not ‘AI handled 80% of chats.’ It is a more defensible statement: the agent completed approved delivery updates in a defined window, passed the evaluation set, and routed higher-risk cases to named owners with complete context.",
      ],
    },
    {
      heading: "Opportunities and limitations to put on the dashboard",
      paragraphs: [
        "The near-term opportunity is service capacity, not automatic headcount replacement. A disciplined agent can reduce wait time, cover routine work outside normal hours, give people better case context, and keep straightforward requests from crowding out complex work. Escalation patterns are also operational signals: they can reveal policy gaps, weak data, or broken handoffs.",
        "An agent with access to systems is not automatically reliable, secure, or compliant. Its performance depends on the rules supplied, the accuracy of connected data, and the strength of controls around access and approval.",
      ],
      bullets: [
        "Benchmark caveat: provider demonstrations and reported results may not transfer to your call mix, language coverage, workflow complexity, or current systems.",
        "Security: prompt injection, social engineering, identity failures, and over-broad tool permissions are operational threats, not theoretical edge cases.",
        "Privacy and compliance: recordings, transcripts, customer records, and retention rules need a documented data-flow and governance review.",
        "Brand and fairness: a fluent answer can still be wrong. Evaluate accents, languages, customer segments, and sensitive scenarios rather than relying on an average score.",
        "Commercial uncertainty: Presence is an assisted enterprise offering. Confirm commercial terms, implementation support, and exit options in writing.",
      ],
    },
    {
      heading: "Who should act now—and who should wait",
      paragraphs: [
        "Act now if you own a high-volume workflow with a known backlog, reliable source systems, a named process owner, and a safe low-risk first action. Good candidates already have quality assurance, escalation paths, and a way to measure customer or operational outcomes.",
        "Wait if the process changes weekly, policy is undocumented, core data is unreliable, the first use case touches high-stakes decisions, or no one can own the exception queue. In those situations, a discovery sprint and policy clean-up will create more value than buying platform access early.",
      ],
    },
    {
      heading: "A practical 30/60/90-day action framework",
      paragraphs: [
        "Days 1–30: choose one narrow workflow. Map the customer intent, source systems, allowed and prohibited actions, escalation owners, and evidence of a correct outcome. Capture a baseline for volume, response time, completion, error rate, cost per contact, and customer satisfaction. Build a representative evaluation set that includes difficult cases.",
        "Days 31–60: build a controlled pilot. Connect only the minimum systems. Start with read access where possible and add one reversible write action only after it passes tests. Include normal, ambiguous, adversarial, and privacy-sensitive cases; review every exception; sample completed cases daily; and define stop conditions before launch.",
        "Days 61–90: prove value before expanding scope. Compare the pilot with the baseline using outcome correctness, policy compliance, escalation quality, re-contact rate, customer result, and staff effort—not only containment. Expand one approved action or queue at a time, version policy and tests, and keep an audit trail of every change.",
      ],
    },
  ],
  faqs: [
    ["Is OpenAI Presence available to every business?", "No. OpenAI says Presence is available to eligible enterprise customers through a non-self-service deployment model. Confirm access, implementation support, and commercial terms directly with OpenAI."],
    ["Does Presence replace a contact-centre team?", "Not by itself. The strongest early use absorbs bounded work and improves human handoffs. Staffing effects depend on demand, service levels, workflow design, and what the team can do with recovered capacity."],
    ["What should a pilot measure?", "Measure correct final outcomes, policy compliance, escalation accuracy, re-contact rate, customer satisfaction, speed, and staff effort. Conversation volume alone is incomplete if a customer needs to contact you again."],
    ["What is the first control to put in place?", "Define action boundaries: exactly what the agent may read, change, verify, and when it must stop and hand a case to a named person."],
  ],
  sources: [
    ["OpenAI — Introducing OpenAI Presence", "https://openai.com/index/introducing-openai-presence/", "Primary announcement for capability, availability, deployment model, and OpenAI-reported support outcome."],
    ["OpenAI — Hugging Face model-evaluation security incident", "https://openai.com/index/hugging-face-model-evaluation-security-incident/", "Primary incident statement; used only for the broader lesson about evaluation-environment security."],
    ["Hugging Face — July 2026 security incident", "https://huggingface.co/blog/security-incident-july-2026", "Primary statement from the affected third-party platform."],
  ],
  related: [["Voice AI implementation", "/services/voice-ai"], ["Agentic workflows", "/services/agentic-workflows"], ["Aixcel delivery process", "/process"]],
});

register({
  path: "/insights/supportagentevaluationbeforelaunch",
  nav: "insights",
  type: "insight",
  publishedOn: "2026-07-30",
  publishedLabel: "30 July 2026",
  title: "Test the Judge Before You Trust the Score | Aixcel",
  description: "A practical guide to calibrating an automated evaluator before it scores an AI customer support agent or influences a release decision.",
  eyebrow: "AI, Plain English · Post 009",
  publicLabel: "Post 009",
  h1: "Test the judge before you trust the score.",
  deck: "An AI support agent can pass every test when the evaluator misunderstands the real outcome. Calibrate the judge first, then test the agent.",
  answer: "A support agent score becomes useful only after domain experts agree on representative cases, an explicit rubric, and the failures the automated judge must catch.",
  aside: "The lead research was submitted on 7 June 2026 and revised on 13 June 2026. The figures below are reported by the paper authors and should not be treated as universal benchmarks.",
  hero: "/assets/support-agent-judge-calibration.svg",
  heroAlt: "A calibration bench connecting expert labels, a rubric, an automated judge, and a support agent release gate.",
  takeaways: [
    "Test the evaluator against expert labels before using it to compare support agents.",
    "Measure the final customer outcome and the quality of the interaction, not fluency alone.",
    "Use separate gates for evaluator quality, agent quality, and live operational performance.",
    "Keep policy exceptions, consequential account changes, and release ownership with named people.",
  ],
  sections: [
    {
      heading: "What the research changes",
      paragraphs: [
        "A June 2026 paper accepted at KDD 2026 describes evaluation practices used across five production customer support agent deployments. Three operations analysts independently labelled cases, majority vote established the reference answer, and written rationales helped refine the evaluator rubric.",
        "In one reported evaluator task, the majority baseline scored 77.78, a short manually written judge prompt scored 68.88, and an optimized judge prompt scored 88.89 on a held out set. The lesson is not that 88.89 is a universal target. The lesson is that the judge itself can be wrong enough to reverse a release decision.",
      ],
    },
    {
      heading: "Why one overall score can hide failure",
      paragraphs: [
        "A fluent answer can still violate policy, miss the requested outcome, use the wrong account state, or create a second contact. One average score compresses those failures into a number that looks precise while hiding what matters.",
      ],
      bullets: [
        "Outcome correctness: did the customer receive the right final result?",
        "Policy compliance: did the agent stay inside the approved rules?",
        "Tool correctness: did reads and writes match the case and account state?",
        "Escalation quality: did the agent stop and hand over at the right moment?",
        "Interaction quality: was the conversation clear, efficient, and respectful?",
      ],
    },
    {
      heading: "Calibrate the judge with expert labels",
      paragraphs: [
        "Start with a small set of real and costly cases. Ask several domain experts to label each case independently. Where they disagree, resolve the rule before automating the judgment. Their agreed labels and rationales become the reference set for testing the automated judge.",
        "Track false passes as carefully as false failures. A false pass is dangerous because it tells the release owner that an unsafe or ineffective answer is acceptable. Refine the rubric until the judge catches the failures that experts consider material, then freeze the version used for a release decision.",
      ],
    },
    {
      heading: "Worked example: a subscription downgrade",
      paragraphs: [
        "A customer asks to downgrade immediately and avoid the next charge. A weak judge may reward a polite explanation even if the agent changes the wrong plan, misses the billing cutoff, or promises a refund outside policy.",
        "The evaluator should inspect the requested outcome, the actual account change, policy compliance, the explanation given to the customer, and whether the case required a human decision. The customer outcome is the unit of evaluation. The wording is supporting evidence.",
      ],
    },
    {
      heading: "Connect offline tests to a small live release",
      paragraphs: [
        "The paper authors report that offline improvements correlated with online metrics, then describe small initial launches before broader rollout. Use that as a release pattern, not as a promise. Your traffic, policies, languages, systems, and failure costs will differ.",
      ],
      bullets: [
        "Judge gate: the evaluator agrees with experts on representative and costly cases.",
        "Agent gate: the candidate meets thresholds for outcome, policy, tools, escalation, and interaction.",
        "Live gate: a small release confirms that offline gains survive real customer behavior and system conditions.",
        "Stop condition: named owners can pause the release when a material failure appears.",
      ],
    },
    {
      heading: "Opportunities, risks, and limitations",
      paragraphs: [
        "A calibrated evaluator makes faster iteration possible. Teams can compare prompts, tools, policies, and agent versions with evidence that is closer to expert judgment. It also creates a repeatable release record for quality review.",
        "The method still depends on the quality of cases, expert agreement, and access to the true customer outcome. Policy drift can make an old rubric stale. A judge can also overfit to the reference set. Recheck it when workflows, policies, models, tools, or customer segments change.",
        "Support data may contain sensitive customer information. Minimize collection, pseudonymize where practical, restrict access by role, document retention, and verify contractual and legal duties before using transcripts for evaluation.",
      ],
    },
    {
      heading: "Who should act now and who should wait",
      paragraphs: [
        "Act now if you have a stable support workflow, named policy owners, representative cases, access to final outcomes, and enough expert time to resolve disagreements. These conditions make evaluator calibration practical and useful.",
        "Wait if the policy changes weekly, experts cannot agree on a correct result, the agent cannot observe whether its action succeeded, or no one owns live exceptions. Fix those operating conditions before treating an automated score as release evidence.",
      ],
    },
    {
      heading: "A practical 30, 60, and 90 day framework",
      paragraphs: [
        "Days 1 to 30: choose one support intent. Gather representative, costly, ambiguous, and policy sensitive cases. Have domain experts label outcomes independently, resolve disagreements, and write the first rubric.",
        "Days 31 to 60: test the automated judge against the expert reference set. Review false passes, false failures, and disagreement by case type. Version the rubric and set separate thresholds for the judge and the agent.",
        "Days 61 to 90: release the strongest agent to a small share of eligible traffic. Compare live outcomes with the offline prediction, inspect every material exception, and expand only when the named release owner accepts the evidence.",
      ],
    },
  ],
  faqs: [
    ["Why test the evaluator before the agent?", "Because a weak evaluator can reward the wrong behavior or reject a good result. Its agreement with domain experts is part of the measurement system."],
    ["How many experts are needed?", "There is no universal number. The lead paper used three operations analysts and majority vote. Use enough independent expertise to expose disagreement and document how it is resolved."],
    ["Should one score decide a launch?", "No. Keep separate evidence for outcome correctness, policy, tool use, escalation, interaction quality, and live operational performance."],
    ["When should the rubric be reviewed?", "Review it when policies, workflows, customer segments, models, tools, or failure patterns change, and on a fixed schedule even when they appear stable."],
  ],
  sources: [
    ["Building Customer Support AI Agents at 100M User Scale", "https://arxiv.org/html/2606.08867", "Primary research paper for the five deployment evaluation framework, expert labelling method, reported evaluator results, and small release pattern."],
    ["Anthropic guide to evaluations for AI agents", "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents", "Primary technical guidance for tasks, trials, graders, transcripts, outcomes, and conversational evaluation."],
    ["NIST AI Risk Management Framework evaluation guidance", "https://airc.nist.gov/airmf-resources/airmf/5-sec-core/", "Primary guidance for documented evaluation, deployment like conditions, expert involvement, and production monitoring."],
  ],
  related: [["OpenAI Presence operating controls", "/insights/openai-presence-enterprise-ai-agent-rollout"], ["Agentic workflow delivery", "/services/agentic-workflows"], ["Aixcel delivery process", "/process"]],
});

register({
  path: "/insights/deterministicincidentdetectionbeforellmexplanation",
  nav: "insights",
  type: "insight",
  publishedOn: "2026-07-31",
  publishedLabel: "31 July 2026",
  title: "The LLM Should Explain the Incident, Not Declare It | Aixcel",
  description: "Why visible rules should trigger workflow incidents while a language model explains the evidence for the operator.",
  eyebrow: "AI, Plain English · Post 010",
  publicLabel: "Post 010",
  h1: "The LLM should explain the incident, not declare it.",
  deck: "An alert interrupts work and starts a response. Keep that decision visible, reproducible, and owned. Use the language model to explain the evidence after the rule fires.",
  answer: "Use explicit rules to declare defined incidents, give the resulting evidence to a language model for explanation, then let a named operator choose the response.",
  aside: "FlowSentry provides local implementation evidence using a seeded fixture. Its thresholds are project defaults, not universal production settings or client results.",
  hero: "/assets/incident-authority-relay.svg",
  heroAlt: "Execution records cross a visible rule threshold before a language model explains the evidence and a person chooses the response.",
  takeaways: [
    "Incident declaration and incident explanation are different jobs.",
    "A trigger should expose its data source, threshold, time window, severity, and owner.",
    "A language model can summarize detector evidence without owning the paging decision.",
    "Thresholds are operating assumptions that need a real baseline, a noise review, and a named owner.",
  ],
  sections: [
    {
      heading: "Why incident declaration is a decision",
      paragraphs: [
        "Calling something an incident changes the work. It may notify a team, interrupt planned activity, trigger a customer response, or start a recovery procedure. The operator should be able to inspect the measured signal, condition, time window, sample size, severity, and owner.",
        "A language model can write a persuasive explanation without providing a stable answer to those questions. Its fluency becomes useful after the evidence exists. It is not a substitute for the incident condition.",
      ],
    },
    {
      heading: "What the system separates",
      paragraphs: [
        "FlowSentry is an open source Python project for reviewing n8n execution records. Its detector layer uses visible rules to find defined patterns. Its explanation layer receives those findings and asks a language model to describe the likely cause and one practical next step.",
        "The current implementation checks three patterns. A failure spike fires when at least 30 percent of a workflow group fails across at least five executions, with critical severity at 50 percent. A slow workflow fires when recent successful runs exceed 2.5 standard deviations above the workflow mean. A repeated error fires when the same message appears at least three times.",
        "These are project defaults. They should not be copied into production without a baseline, a noise review, and a named owner.",
      ],
    },
    {
      heading: "A clear authority path",
      paragraphs: [
        "Execution records provide the signal. Deterministic rules decide whether a documented condition is met. The language model explains the detector evidence. A person chooses the response or handoff. The system records the incident, decision, and any threshold change.",
        "This split keeps the consequential decision inspectable while giving the model a bounded evidence package. It also makes later review possible because the original signal, detector result, model explanation, and human response remain distinct.",
      ],
    },
    {
      heading: "Worked example from the seeded fixture",
      paragraphs: [
        "The bundled FlowSentry sample contains 120 executions and three seeded incidents. One sample workflow records 17 failures across 30 runs. The failure rule calculates a 57 percent failure rate. Because that exceeds the documented 50 percent critical threshold, the detector creates a critical finding.",
        "The language model does not decide that the workflow is critical. It receives the structured finding and available error evidence, then turns that evidence into a readable explanation and one suggested check.",
        "This proves that the implemented path runs from sample executions through detection and explanation. It does not prove production reliability, customer impact, alert precision, or reduced recovery time.",
      ],
    },
    {
      heading: "What the language model should and should not own",
      paragraphs: [
        "The model can summarize a finding, group related evidence, suggest an investigation step, and translate technical detail for a service owner.",
        "It should not own the incident threshold, severity rule, notification audience, recovery approval, or final statement of customer impact. People should define the policy, approve thresholds, review false alarms and missed incidents, own the response, and decide when the rule changes.",
      ],
    },
    {
      heading: "Opportunities, risks, and limitations",
      paragraphs: [
        "The split can reduce argument about why an alert fired. An operator can reproduce the calculation and tune the rule. The model can also make incident communication faster because it receives bounded evidence instead of an open request to search for anything unusual.",
        "A visible rule can still be wrong. It may be copied from another environment, based on too little data, or left unchanged after the workflow evolves. A successful execution can also produce the wrong customer outcome, which requires a separate outcome check.",
        "The explanation remains advisory. Minimize the evidence sent to a model, redact sensitive values, control access, and document retention. FlowSentry still lists baseline persistence and recovery time tracking on its roadmap, so production adoption needs additional operating controls and measured alert quality.",
      ],
    },
    {
      heading: "A practical 30, 60, and 90 day framework",
      paragraphs: [
        "Days 1 to 30: choose one workflow. Define the business outcome, one material failure condition, sample size, time window, severity, owner, and stop condition. Collect a baseline before notifications begin.",
        "Days 31 to 60: run the detector in observation mode. Review every trigger and a sample of non triggers. Record false alarms, missed incidents, customer impact, and operator effort. Version every rule change.",
        "Days 61 to 90: add a bounded model explanation using only the evidence required for the finding. Connect the incident to a named response path and measure time to acknowledge, time to recover, false alarm rate, and repeated incident rate.",
      ],
    },
  ],
  faqs: [
    ["Why not let the language model detect incidents directly?", "A model can discover patterns, but a direct paging decision needs stable evidence, reproducibility, and ownership. Treat model based detection as a separately evaluated signal with clear limits, not an invisible replacement for incident policy."],
    ["Are static thresholds always better?", "No. Dynamic thresholds and forecasts can be appropriate when their data, window, behavior, and failure modes are understood. The incident condition still needs to remain inspectable and owned."],
    ["What should the model receive?", "Send the smallest evidence package needed to explain the finding. Include the measured condition, relevant records, allowed context, and a clear instruction not to invent missing facts."],
    ["Does the FlowSentry sample prove production performance?", "No. It proves a local implementation path using 120 fixture executions and three seeded incidents. It does not prove production precision, reliability, or customer outcomes."],
  ],
  sources: [
    ["FlowSentry repository", "https://github.com/syedahmad0786/flowsentry", "Primary project documentation for architecture, rules, sample fixture, boundaries, and roadmap."],
    ["FlowSentry detection engine", "https://github.com/syedahmad0786/flowsentry/blob/main/src/flowsentry/engine.py", "Primary source code for the deterministic failure, duration, and repeated error rules."],
    ["FlowSentry explanation layer", "https://github.com/syedahmad0786/flowsentry/blob/main/src/flowsentry/llm.py", "Primary source code for the bounded explanation prompt and instruction not to invent details."],
    ["n8n execution records", "https://docs.n8n.io/workflows/executions/all-executions/", "Official execution record and retry documentation."],
    ["OpenTelemetry metrics concepts", "https://opentelemetry.io/docs/concepts/signals/metrics/", "Official concepts for measured operating signals."],
    ["Google Cloud alerting concepts", "https://docs.cloud.google.com/monitoring/alerts", "Official guidance for conditions, incidents, notification channels, and threshold windows."],
  ],
  related: [["Support agent evaluation", "/insights/supportagentevaluationbeforelaunch"], ["Agentic workflow delivery", "/services/agentic-workflows"], ["Aixcel delivery process", "/process"]],
});

register({
  path: "/insights/voicedraftattributionbeforecrm",
  nav: "insights",
  type: "insight",
  publishedOn: "2026-08-01",
  publishedLabel: "1 August 2026",
  title: "Voice Dictation Workflow for Accurate CRM Notes | Aixcel",
  description: "A practical workflow for turning dictated field observations into reviewed CRM notes without confusing observation, report, inference, or commitment.",
  eyebrow: "AI, Plain English · Post 011",
  publicLabel: "Post 011",
  h1: "A voice draft needs attribution before it reaches the CRM.",
  deck: "A clean transcript can flatten observation, report, inference, and commitment into equally confident prose. Label the source before shared business memory changes.",
  answer: "Dictate into a temporary draft, label each consequential sentence as observed, reported, inferred, or promised, then verify the facts before a person commits it to the correct record.",
  aside: "Wispr Flow provides current product documentation for dictation, context, privacy, storage, and recovery behavior. It does not prove CRM accuracy, productivity improvement, legal compliance, or a production result.",
  hero: "/assets/voiceattributionsorter.svg",
  heroAlt: "A speech signal enters an attribution review that separates observed, reported, inferred, and promised statements before a reviewed CRM note is committed.",
  takeaways: [
    "Transcription accuracy and record accuracy are different.",
    "Label every consequential sentence as observed, reported, inferred, or promised before it enters the shared record.",
    "A dictation shortcut can capture and recover text. It cannot choose the correct record, source label, or commitment.",
    "A person should approve the final record and any outbound follow up.",
  ],
  sections: [
    {
      heading: "Why an accurate transcript can still produce a wrong record",
      paragraphs: [
        "Speech contains context that plain text can lose. Tone may reveal uncertainty. Conversation may make the speaker obvious. The people in the room may know whether a statement came from the representative, buyer, seller, inspector, or another source.",
        "Consider the sentence: The roof was replaced two years ago. The representative may have verified documentation, the seller may have reported it, the representative may have inferred it from appearance, or someone may have promised proof later. The words can be transcribed perfectly in all four cases. The business meaning is still different.",
        "The useful workflow is speech into a temporary draft, followed by attribution, factual review, and a deliberate commit into the correct record.",
      ],
    },
    {
      heading: "The four labels",
      paragraphs: [
        "Observed means the representative personally saw or measured something during the visit. A personal observation is not automatically a technical inspection.",
        "Reported means a client, seller, colleague, or document supplied the statement. Keep the source attached and do not silently convert it into an independently verified fact.",
        "Inferred means the representative drew a conclusion from behavior or incomplete evidence. Use it to guide a follow up question, not as a confirmed preference.",
        "Promised means someone accepted a future action. A useful commitment names the owner, action, and date.",
      ],
    },
    {
      heading: "What the current product documentation establishes",
      paragraphs: [
        "Wispr Flow documents desktop dictation sessions of up to 20 minutes on Mac and Windows. At the limit it ends the session, transcribes the speech, and pastes the result into the active text field. Recovery controls can paste the latest transcript again.",
        "Its shortcut documentation covers starting, stopping, cancelling, and recovering dictation. Its troubleshooting guidance says the desktop application temporarily uses the system clipboard to paste text. Those controls do not establish an automatic CRM routing decision.",
        "Context Awareness can use nearby application context. Privacy Mode, Private Cloud Sync, and local storage are separate controls. The team still owns privacy configuration, attribution, factual review, target selection, and the final CRM commit.",
      ],
    },
    {
      heading: "A worked property visit example",
      paragraphs: [
        "This fictional scenario contains no client data. A representative dictates: The client liked the corner unit. Budget is about 1.8 million. The roof was replaced two years ago. Send the inspection report Thursday.",
        "The preference is reported only if the client actually said it. Otherwise it is inferred and becomes a follow up question. The budget needs a currency, source, and confidence. The roof statement remains seller reported until evidence verifies it. The report task needs an owner and an exact date.",
        "Only the reviewed statements enter the correct contact and property records. Any client message remains a separate human approved action.",
      ],
    },
    {
      heading: "A visible commit point",
      paragraphs: [
        "Capture personal observations after the visit. Label each consequential statement. Verify the contact, property, names, amounts, units, currency, dates, source, and commitment owner. Then choose the correct CRM record and save only the reviewed note.",
        "The CRM is shared organizational memory. A draft is temporary working material. The user should know whether they are editing a private draft, updating a shared record, or preparing a client message.",
        "Salesforce documents field history tracking for selected fields when enabled. History can record who changed a field and when, but an audit feature does not make the original entry correct. The NIST AI Risk Management Framework supports documenting intended use, human oversight, roles, limits, and context. The four label review is an operational interpretation of those principles.",
      ],
    },
    {
      heading: "Opportunities, risks, and limitations",
      paragraphs: [
        "The pattern can improve handoff quality for property visits, field service, account management, recruiting, insurance, and other work where statements and commitments must remain attributable. Teams can measure how often drafts lack a source, unit, date, or commitment owner before they reach a shared record.",
        "Transcription can mishear names, addresses, amounts, dates, technical terms, and accents. Attribution can still be wrong even when the words are correct. Nearby application context and clipboard recovery can expose sensitive material if controls are poorly configured.",
        "The vendor sources do not establish legal compliance, organizational permission, productivity improvement, CRM accuracy, or a production result. The four labels do not replace professional verification, consent rules, retention policy, or industry duties.",
      ],
    },
    {
      heading: "A practical 30, 60, and 90 day framework",
      paragraphs: [
        "Days 1 to 30: map one field visit workflow. Define the labels, required record fields, approved device and dictation settings, manual commit point, and correction owner. Test only with fictional information.",
        "Days 31 to 60: run a limited pilot. Review every draft for identity, source, amounts, units, dates, and commitments. Record transcript errors, attribution errors, wrong record attempts, clipboard recoveries, and edits before commit.",
        "Days 61 to 90: decide whether the workflow is safe and useful. Add only the minimum structured fields that improve handoff. Configure record history where appropriate. Keep client messages and consequential updates under a named approval rule.",
      ],
    },
  ],
  faqs: [
    ["Is a clean transcript ready for the CRM?", "No. It may still lack the correct contact, property, currency, source, confidence, action owner, or date."],
    ["Should the representative record the property visit?", "This workflow does not require recording another person. It uses personal dictation after the visit. Recording law, consent, and company policy vary, so obtain appropriate guidance before any meeting capture."],
    ["Can a language model assign the four labels?", "It can propose labels, but a person with context should confirm them before the CRM commit. The model may not know who made a statement or whether a commitment was accepted."],
    ["Does field history prove the note is correct?", "No. It can show that a tracked field changed, when it changed, and who changed it. Correctness still depends on the source and review."],
  ],
  sources: [
    ["Wispr Flow longer desktop dictation sessions", "https://docs.wisprflow.ai/articles/4841123325-Longer-dictation-sessions-%E2%80%94-now-up-to-20-minutes", "Official documentation for desktop session length, automatic completion, and transcript recovery."],
    ["Wispr Flow keyboard shortcut controls", "https://docs.wisprflow.ai/articles/5298382595-route-dictation-directly-to-slack-email-or-calendar-with-keyboard-shortcuts", "Official documentation for starting, stopping, cancelling, and recovering dictation."],
    ["Wispr Flow clipboard and paste recovery", "https://docs.wisprflow.ai/articles/7971211038-fix-text-not-pasting-after-dictation", "Official documentation for temporary clipboard use and manual paste recovery."],
    ["Wispr Flow Context Awareness", "https://docs.wisprflow.ai/articles/4678293671-feature-context-awareness", "Official documentation for nearby application context and administrator controls."],
    ["Wispr Flow privacy and storage controls", "https://docs.wisprflow.ai/articles/4709791908-understanding-privacy-mode-and-cloud-sync", "Official documentation distinguishing training use, server storage, and local storage controls."],
    ["Salesforce field history tracking", "https://help.salesforce.com/s/articleView?id=sf.tracking_field_history.htm&language=en_US&type=5", "Official documentation for selected field history behavior and limitations."],
    ["NIST AI Risk Management Framework Core", "https://airc.nist.gov/airmf-resources/airmf/5-sec-core/", "Primary guidance for intended use, oversight, roles, limits, and operating context."],
  ],
  related: [["Context and permission boundaries", "/insights/context-is-not-consent-ai-private-data"], ["Agentic workflow delivery", "/services/agentic-workflows"], ["Aixcel delivery process", "/process"]],
});

register({
  path: "/insights/sourceevidencebeforeaidecision",
  nav: "insights",
  type: "insight",
  publishedOn: "2026-08-02",
  publishedLabel: "2 August 2026",
  title: "AI Evidence Levels for Better Business Decisions | Aixcel",
  description: "A five level evidence ladder that shows what an announcement, documentation, test, production record, and measured outcome can safely support.",
  eyebrow: "AI, Plain English · Post 012",
  publicLabel: "Post 012",
  h1: "A source link is not enough to make an AI decision.",
  deck: "A source can be correct while the decision is still wrong. Match every claim to the evidence strength, operating context, and action it can safely carry.",
  answer: "Use five evidence levels. An announcement supports watching. Documentation supports designing. A controlled test supports a pilot. A production record supports operation. A measured business outcome supports expansion.",
  aside: "The five level ladder is Ahmad's operating synthesis. It is informed by current primary guidance, but it is not a NIST requirement, a certification, or legal advice.",
  hero: "/assets/evidenceweightrig.svg",
  heroAlt: "Five evidence blocks carry increasingly consequential AI decisions from watch to expand.",
  takeaways: [
    "A source proves origin. It does not automatically prove scope.",
    "Evidence should match the people, workflow, conditions, metric, comparison, and period behind the decision.",
    "A controlled test can support a bounded pilot. It cannot automatically prove stable daily operation.",
    "AI can organize evidence. A person still owns the exact claim, its limits, and the decision it supports.",
  ],
  sections: [
    {
      heading: "Why a credible source can still support a weak decision",
      paragraphs: [
        "Evidence has at least two dimensions. Origin asks where the information came from. Fit asks whether the evidence matches the claim and the decision.",
        "Suppose a vendor reports that its assistant reduces response time by 40 percent in a demonstration. The source may be authentic and the number may be reported accurately. A decision to deploy the assistant across every customer conversation can still be unjustified.",
        "The team still needs to know who performed the task, which questions were included, how response time was defined, what comparison was used, whether answer quality remained stable, and whether the conditions resembled daily operations. The source answers where the claim began. Scope determines how far the claim may travel.",
      ],
    },
    {
      heading: "The five levels of evidence weight",
      paragraphs: [
        "Level one is announcement. It can establish that an organization introduced, changed, or plans to offer something. The proportionate decision is watch. It does not prove value, savings, safety, or fit for your workflow.",
        "Level two is documentation. It can establish intended behavior, controls, prerequisites, limits, and configuration choices. The proportionate decision is design. It does not prove performance with your people, data, policies, and failure patterns.",
        "Level three is controlled test. It can establish what happened with a defined task set, method, comparison, and acceptance rule. The proportionate decision is pilot. It does not prove stable operation across every user and exception.",
        "Level four is production record. It can establish how the workflow behaved during real use through volumes, errors, overrides, latency, escalation, source use, and policy exceptions. The proportionate decision is operate within the approved boundary. It does not prove that the customer or business benefited.",
        "Level five is measured business outcome. It can establish whether the workflow improved the result behind the investment, such as faster resolution with stable quality, fewer missed appointments, lower rework, better conversion, or a lower error rate. The proportionate decision is expand, while the comparison, period, sample, and limitations remain visible.",
      ],
    },
    {
      heading: "What current assurance guidance adds",
      paragraphs: [
        "The NIST AI Risk Management Framework Core organizes risk work around Govern, Map, Measure, and Manage. Its Measure guidance covers documented methods, test sets, metrics, performance in conditions similar to deployment, production monitoring, and documented limits on generalization.",
        "The NIST AI Metrology and Evaluation center provides access to metrics, methods, and tools organized by lifecycle and context. It also warns that inclusion does not establish NIST endorsement, validation, or suitability for a particular purpose. A credible collection is not a substitute for judging fit.",
        "The United States Government Accountability Office framework connects accountability to governance, data, performance, and monitoring. United Kingdom guidance describes assurance as measuring, evaluating, and communicating trustworthiness through techniques selected for the context. Together, these sources support matching the method to the claim and consequence. They do not prescribe the five levels used here.",
      ],
    },
    {
      heading: "A real example of scope failure",
      paragraphs: [
        "The United States Federal Trade Commission final order concerning Workado addressed a claim that an AI detection product was 98 percent accurate. According to the agency, the cited testing concerned academic content, while independent testing found far lower performance on general purpose content.",
        "The final order requires competent and reliable evidence for future accuracy claims and requires the company to retain that evidence when the claim is made.",
        "The lesson is not that every vendor claim is false. The lesson is that evidence for one context should not be stretched across another context without proof.",
      ],
    },
    {
      heading: "A fictional service business example",
      paragraphs: [
        "Imagine a service company evaluating an AI assistant that drafts customer replies. The vendor states that the assistant cuts response time by 40 percent. At announcement level, the claim earns attention. Documentation can support a test design, but it cannot support a savings promise.",
        "The company tests 120 fictional and historical questions with private details removed. It compares the current workflow with the proposed workflow and measures response time, factual errors, unsafe commitments, escalation, and reviewer effort. The assistant meets the acceptance rule on simple questions and fails on refund exceptions. The evidence supports a pilot limited to simple questions with mandatory review.",
        "The production record then shows how often staff edit, reject, or escalate drafts during real work. Only after the company compares customer resolution time, repeat contact, quality review, and total handling effort against the prior baseline does it consider expansion.",
      ],
    },
    {
      heading: "Build an evidence receipt before the decision",
      paragraphs: [
        "Write the exact claim the decision depends on. Identify whether the support is an announcement, documentation, controlled test, production record, or measured outcome. Link to the primary source when available.",
        "Record the people, task, data, conditions, comparison, metric, and period. State what the evidence does not prove. Then name the smallest proportionate action: watch, design, pilot, operate, or expand.",
        "Finally, name the decision owner and the date when the evidence must be checked again. This receipt turns a source list into an operating control.",
      ],
    },
    {
      heading: "Where AI can help and where it should stop",
      paragraphs: [
        "AI can collect candidate sources, group evidence by claim, compare terminology, identify missing context, and draft an evidence receipt.",
        "It should not silently decide that a source supports a broader claim than the source actually makes. A person should own the exact business claim, evidence relevance, acceptance rule, permitted decision, residual risk, and next review date.",
        "This division keeps AI useful without turning citation into automatic authorization.",
      ],
    },
    {
      heading: "Opportunities, risks, and limits",
      paragraphs: [
        "Use the ladder in vendor evaluation by asking for the evidence class, method, context, and limitations behind important performance claims. Use it in internal proposals by showing whether each projected benefit comes from a source, calculation, test, or measured result.",
        "Connect every evidence level to an approval boundary so a successful demonstration does not become an uncontrolled rollout. Refresh the evidence when the model, process, customer mix, policy, or operating conditions change.",
        "The ladder can still create false confidence if teams reward the label but ignore the method. A controlled test can be badly designed. A production record can omit failures. A measured outcome can reflect another change. Sensitive decisions may require legal, security, privacy, technical, or domain review beyond this workflow.",
      ],
    },
    {
      heading: "Act now or wait",
      paragraphs: [
        "Act now when the next decision is small, reversible, measured, and supported by evidence that matches the intended context.",
        "Wait when the evidence comes only from an announcement, the success metric is undefined, the operating conditions differ, the source cannot be reproduced, or the decision would create a difficult customer or compliance consequence.",
        "The purpose of waiting is not caution for its own sake. It is to name the next proof required.",
      ],
    },
    {
      heading: "A practical 30, 60, and 90 day plan",
      paragraphs: [
        "Days 1 to 30: choose one AI claim behind a current proposal. Complete the evidence receipt. Remove any claim that cannot state its source, context, limitation, and permitted decision.",
        "Days 31 to 60: run one controlled test with a baseline, representative task set, acceptance rule, failure categories, and named owner. Keep the rollout boundary explicit.",
        "Days 61 to 90: compare the production record with the intended business outcome. Continue, revise, expand, or stop based on the evidence actually collected.",
      ],
    },
  ],
  faqs: [
    ["Is a primary source always enough?", "No. A primary source usually improves confidence about origin. It may still concern a different task, population, metric, or operating condition."],
    ["Does independent evidence automatically carry more weight?", "Not automatically. Independence can reduce some bias, but method and relevance still matter."],
    ["Can a demonstration justify a pilot?", "It can justify designing a controlled test. A pilot should begin only after the team defines the boundary, acceptance rule, monitoring, fallback, and owner."],
    ["When can a pilot expand?", "When production evidence and measured outcomes support the larger scope, the failure modes are acceptable, and the responsible owner approves the change."],
    ["Is the five level ladder an official standard?", "No. It is Ahmad's operational synthesis informed by the primary guidance cited here."],
  ],
  sources: [
    ["NIST AI Risk Management Framework Core", "https://airc.nist.gov/airmf-resources/airmf/5-sec-core/", "Primary guidance for documented measurement, deployment relevant conditions, monitoring, and limits."],
    ["NIST AI Metrology and Evaluation center", "https://airc.nist.gov/metrology/", "Primary resource for metrics, methods, tools, lifecycle context, and the stated suitability limitation."],
    ["NIST Generative AI Profile", "https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence", "Primary voluntary companion resource for generative AI risk management across the lifecycle."],
    ["United States Government Accountability Office AI Accountability Framework", "https://www.gao.gov/products/gao-21-519sp", "Primary framework for governance, data, performance, monitoring, and assessment."],
    ["United Kingdom introduction to AI assurance", "https://www.gov.uk/government/publications/introduction-to-ai-assurance/introduction-to-ai-assurance", "Primary guidance on measuring, evaluating, and communicating system trustworthiness with context appropriate techniques."],
    ["Federal Trade Commission final order concerning Workado", "https://www.ftc.gov/news-events/news/press-releases/2025/08/ftc-approves-final-order-against-workado-llc-which-misrepresented-accuracy-its-artificial", "Primary agency record for the accuracy claim, scope issue, and evidence retention requirement."],
  ],
  related: [["Support agent evaluation", "/insights/supportagentevaluationbeforelaunch"], ["Context and permission boundaries", "/insights/context-is-not-consent-ai-private-data"], ["Aixcel delivery process", "/process"]],
});

register({
  path: "/insights/meetingdecisiontracebeforecrm",
  nav: "insights",
  type: "insight",
  publishedOn: "2026-08-03",
  publishedLabel: "3 August 2026",
  title: "How to Test AI Meeting Notes Before CRM Automation | Aixcel",
  description: "A practical decision trace test for checking AI meeting notes, commitments, owners, dates, sharing, and CRM actions before adoption.",
  eyebrow: "AI, Plain English · Post 013",
  publicLabel: "Post 013",
  h1: "A meeting summary must preserve the decision trace.",
  deck: "The summary can name the right topic and still create the wrong next step. Test whether proposals, objections, conditions, revisions, owners, and final commitments survive before anything reaches a CRM.",
  answer: "Use four states: proposed, challenged, revised, and confirmed. Only a confirmed item can become a candidate action, and a person still verifies its qualifier, owner, date, recipients, and source.",
  aside: "The four state trace is Ahmad's operating synthesis. It is informed by current primary sources, but it is not a vendor feature, an official NIST standard, or legal advice.",
  hero: "/assets/meetingdecisiontrace.svg",
  heroAlt: "Four conversation states move from proposed through challenged and revised to confirmed, with only confirmed connected to an authorized action ticket.",
  takeaways: [
    "A topic is not a decision.",
    "A proposed date is not a confirmed date.",
    "A condition can reverse the meaning of an otherwise accurate sentence.",
    "No recap should create a CRM task or client message until a person confirms the decision state.",
  ],
  sections: [
    {
      heading: "Why fluent prose is the wrong acceptance test",
      paragraphs: [
        "Meeting assistants can reduce the effort needed to create a first draft. That does not make fluency a useful pass condition.",
        "The business risk usually sits in a small fragment that the summary smooths away. No, not Monday. Thursday only if security approves. Sara owns the checklist, not the launch. The client asked a question but did not agree. The statement was later corrected.",
        "Each fragment changes what the business is allowed to record or do. A recap can be mostly accurate and still be unsafe because the one missing qualifier controls the next action.",
      ],
    },
    {
      heading: "The smallest useful decision trace",
      paragraphs: [
        "Proposed means someone introduced an option, date, owner, price, or action. Nothing is committed yet.",
        "Challenged means someone objected, added a constraint, asked for evidence, or rejected part of the proposal. Revised means the date, owner, scope, condition, or wording changed.",
        "Confirmed means an authorized person accepted the final version clearly enough for a named action. Only confirmed should be eligible to create a downstream task. Even then, a person should verify the owner, date, recipients, and source before the pilot writes to a CRM or sends a client message.",
      ],
    },
    {
      heading: "Four traps every pilot should include",
      paragraphs: [
        "Negation: say, Do not send the proposal today. Legal must review it first. The recap fails if it creates a task to send the proposal today.",
        "Changed date: propose Monday, reject Monday, then agree on Thursday. The recap fails if Monday survives as the action date.",
        "Condition: say, We can start Thursday if security approval arrives by Wednesday. The recap fails if it records Thursday as unconditional.",
        "Owner switch: assign the checklist to Sara, then move it to Imran after capacity is discussed. The recap fails if Sara remains the owner. A realistic pilot should also include unclear names, numbers, interruptions, external participants, and an item that must not enter the CRM.",
      ],
    },
    {
      heading: "A fictional meeting example",
      paragraphs: [
        "A client asks whether the team can start Monday. Operations says not until security signs off. The client changes the target to Thursday if approval arrives. Ahmad confirms that Sara will send the checklist on 4 August.",
        "A bad recap says, Launch Monday. Sara owns the launch. The useful trace says Monday was proposed and rejected, Thursday remains provisional because security approval is a condition, and Sara owns only the checklist task.",
        "The purpose of the trace is not to make the note longer. It is to keep a fluent summary from erasing the difference between discussion and commitment.",
      ],
    },
    {
      heading: "What current product documentation establishes",
      paragraphs: [
        "Google documents that Take notes for me requires an eligible Workspace plan, supports specified languages, gives hosts controls over who receives notes, notifies participants, and can produce incomplete or inaccurate summaries. Google also documents decision and next step sections in the current experience, with specific availability conditions.",
        "Google completed rollout of a new administrator setting on 3 August 2026. The setting lets administrators configure automatic notes for meetings with three or more people, while the related user experience is scheduled for a later date. This is an availability and control change, not evidence that notes are accurate for a particular team.",
        "Microsoft documents that Teams intelligent recap uses the meeting transcript to create notes and tasks, subject to configuration and licensing. Microsoft also describes where transcript, recording, note, and task artifacts are stored.",
        "Zoom documents that Meeting Summary uses speech to text data, depends on an eligible licensed account, can be controlled by a host or cohost, and may be distributed according to the selected sharing option. Zoom also states that summaries can be incomplete and can be edited.",
        "Those documents establish product conditions. They do not establish decision state accuracy for a sales team, the correctness of a CRM task, or the appropriateness of a client message.",
      ],
    },
    {
      heading: "The decision trace scorecard",
      paragraphs: [
        "Measure decision state accuracy. Did the assistant distinguish proposed, challenged, revised, and confirmed items correctly?",
        "Measure qualifier retention. Did words such as not, only if, after approval, provisional, and pending survive? Measure owner and date accuracy. Did the final owner and final date replace earlier versions?",
        "Record unauthorized action attempts. Did the workflow try to create a CRM task, update a record, or prepare a client message from an unconfirmed item? Also record how long the responsible person needed to verify and correct the recap.",
        "Do not combine these into one impressive average too early. A recap that scores well overall but creates one false client commitment has failed the control that matters.",
      ],
    },
    {
      heading: "A safe operating flow",
      paragraphs: [
        "Use this sequence: meeting policy, transcript, candidate decision trace, owner review, confirmed action, and CRM record.",
        "The assistant may organize the transcript and propose a trace. A person confirms the state, qualifier, owner, date, recipients, and downstream action. The system records the source moment, reviewer, correction, and final action.",
        "If any material element is unclear, the item remains pending. Silence is not confirmation.",
      ],
    },
    {
      heading: "Opportunities, risks, and limitations",
      paragraphs: [
        "The pattern can speed preparation of a reviewable recap, improve continuity for colleagues who missed a meeting, separate provisional intent from commitment, and create a reusable record of failure modes before automation expands.",
        "Speech recognition can mishear names, dates, numbers, and specialized terms. Summarization can omit a qualifier or merge two speakers into one commitment. Sharing, storage, retention, and recipient behavior vary by plan and configuration.",
        "A transcript makes comparison possible but does not make the assistant's interpretation correct. A small pilot cannot prove performance across every accent, meeting type, customer, or product version. This article is not legal, privacy, security, or compliance advice.",
      ],
    },
    {
      heading: "Who should act now and who should wait",
      paragraphs: [
        "Act now if the team has a controlled meeting platform, a named review owner, representative recordings, and the ability to prevent automatic downstream action.",
        "Test carefully if calls contain sensitive commercial, health, legal, financial, or personal information, or if external guests receive different sharing treatment.",
        "Wait before CRM automation if the team cannot identify the source transcript, final decision state, accountable owner, review record, access rules, and correction path.",
      ],
    },
    {
      heading: "A 30, 60, and 90 day action framework",
      paragraphs: [
        "First 30 days: choose one meeting type. Confirm notices, access, storage, and retention. Build a small test set with negation, changed dates, conditions, and owner switches. Keep every output as a reviewable draft.",
        "By 60 days: run representative meetings. Compare every material item with the transcript. Record state errors, missing qualifiers, wrong owners, wrong dates, unsafe sharing, and attempted downstream actions.",
        "By 90 days: expand only if the trace is reliable enough for the stated use. Keep CRM writes and client messages human confirmed until each downstream action has its own acceptance test and correction record.",
      ],
    },
  ],
  faqs: [
    ["Does a transcript make the summary trustworthy?", "No. It makes source comparison possible. A person still needs to judge whether the state, qualifier, owner, date, and customer record are correct."],
    ["Should the assistant create CRM tasks automatically?", "Not in the first pilot. Start with a candidate decision trace. Consider automation only after the team has a documented threshold for the exact task type and a tested way to block uncertain items."],
    ["Which vendor is most accurate?", "This article makes no comparative accuracy claim. Test the product and configuration your team will actually use, with the meeting types, participants, terminology, and risks that matter in daily work."],
    ["What is the pass condition?", "The team should be able to explain every retained action: what was proposed, what changed, which condition still applies, who owns it, when it is due, where the source moment sits, and which person accepted it."],
  ],
  sources: [
    ["Google Meet Help: Take notes for me", "https://support.google.com/meet/answer/14754931", "Primary documentation for plans, languages, notices, controls, sharing, decision sections, next steps, and output limitations."],
    ["Google Workspace Updates: New meeting note settings", "https://workspaceupdates.googleblog.com/2026/07/new-google-meet-take-notes-for-me-settings-for-admins-and-end-users.html", "Primary announcement for administrator setting behavior, availability, and the 3 August rollout milestone."],
    ["Microsoft Learn: Data privacy and security for intelligent recap", "https://learn.microsoft.com/en-us/microsoftteams/privacy/intelligent-recap", "Primary documentation for transcript use, configuration, licensing, and storage locations."],
    ["Zoom Support: Using Meeting Summary with AI Companion", "https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0058013", "Primary documentation for speech input, licensing, host controls, sharing, editing, and limitations."],
    ["NIST AI Risk Management Framework Core", "https://airc.nist.gov/airmf-resources/airmf/5-sec-core/", "Primary guidance for documented measurement, relevant conditions, monitoring, uncertainty, and stated limits."],
  ],
  related: [["Voice draft attribution", "/insights/voicedraftattributionbeforecrm"], ["Support agent evaluation", "/insights/supportagentevaluationbeforelaunch"], ["CRM automation", "/services/crm-automation"]],
});

register({
  path: "/insights/followupownershipclock",
  nav: "insights",
  type: "insight",
  publishedOn: "2026-08-04",
  publishedLabel: "4 August 2026",
  title: "The Ownership Clock for an AI Follow Up Queue | Aixcel",
  description: "A practical operating model for measuring the time from a qualified sales signal to accepted human ownership.",
  eyebrow: "AI, Plain English · Post 014",
  publicLabel: "Post 014",
  h1: "An AI follow up queue needs an ownership clock.",
  deck: "A message can be ready while the next action remains unowned. Measure the time from a qualified signal to accepted human ownership, not only the time needed to create a draft.",
  answer: "Start the clock when a signal meets the team rule. Stop it only when a named person accepts a specific action and due time. Keep waiting, offered, accepted, and exception states visible.",
  aside: "The ownership clock is Ahmad's operating synthesis. It is not a vendor feature, an official standard, a universal service level, or a performance claim.",
  hero: "/assets/followupownershipclock.svg",
  heroAlt: "A qualified signal moves around an ownership clock from waiting to offered and stops when a named person accepts the next action.",
  takeaways: [
    "A prepared task is not an accepted action.",
    "A proposed owner is not an accepted owner.",
    "Every exception needs a named owner and review time.",
    "Draft speed should not stand in for ownership or customer outcome.",
  ],
  sections: [
    {
      heading: "What the ownership clock measures",
      paragraphs: [
        "The clock starts when a signal meets the business rule for follow up. That could be a qualified form submission, an inbound reply, a pricing request, a meeting outcome, or another event the team has defined.",
        "The clock stops only when a named person accepts responsibility for a specific next action and due time. Creating a task, suggesting an owner, drafting a message, or moving the item into another shared queue does not stop it.",
        "An exception can transfer the clock to a named exception owner, but it should not make the item disappear. The point is to distinguish prepared system work from accepted human responsibility.",
      ],
    },
    {
      heading: "Why the queue can look fast while the handoff stays slow",
      paragraphs: [
        "Imagine a fictional workflow. At 9:05, an inbound contact meets the team rule. At 9:07, AI prepares context and a suggested reply. The dashboard can celebrate a two minute draft.",
        "But the suggested owner is unavailable. Nobody accepts the item. At 1:40, the reply is still a draft and the next action is still unowned. The generation step was fast. The operating system was not.",
        "Automation speed can create a misleading sense of completion. The machine finished its part, so the workflow appears active. The customer experience still depends on whether responsibility became explicit.",
      ],
    },
    {
      heading: "What current product documentation establishes",
      paragraphs: [
        "HubSpot documents that task queues can group, filter, and share tasks. It also documents that workflows can create tasks and add them to a shared queue under applicable subscription conditions. These are useful coordination capabilities. They do not establish that the correct person accepted the correct action within a useful period.",
        "Salesforce describes queues as shared workloads for supported records, including leads. Eligible users can take ownership, and records can remain in a queue until an owner is assigned. Salesforce also documents a specific lead creation constraint and later assignment options.",
        "Microsoft lists planned Dynamics 365 Sales capabilities for lead research, classification, priority, next best actions, and generated email suggestions. The priority capability is listed for public preview in August 2026, and Microsoft warns that planned features and dates may change. A planned preview is not proof of tenant availability, adoption quality, or a business outcome.",
        "NIST calls for documented roles, responsibilities, human oversight, measurement methods, and ongoing monitoring. It does not prescribe a sales ownership clock, but it supports making responsibility and measurement visible.",
      ],
    },
    {
      heading: "The four queue states",
      paragraphs: [
        "Waiting means the signal met the follow up rule, but no owner has been offered the action. Offered means a person has been proposed or notified, but has not accepted responsibility.",
        "Accepted means a named person has accepted a defined next action and due time. This is the only normal state that stops the ownership clock.",
        "Exception means the signal cannot proceed because context, permission, capacity, identity, or another required fact is missing. The exception must have its own named owner and review time.",
      ],
    },
    {
      heading: "Create a small acceptance receipt",
      paragraphs: [
        "Record the source event and time, the verified account or contact, the proposed owner, the accepted owner, the acceptance time, the next action, the due time, and any exception reason and owner.",
        "This is not a new reporting project. It is the minimum evidence needed to distinguish a prepared task from an owned action.",
        "The operating record should answer who accepted what, when, and by when. If it cannot, the ownership clock remains open.",
      ],
    },
    {
      heading: "Where AI helps and where a person remains accountable",
      paragraphs: [
        "AI can collect recent account context, group duplicate signals, propose priority, draft a next action, identify missing fields, and surface items approaching the team limit. It can summarize why an item appears urgent when the explanation links to verified source context.",
        "A person verifies that the signal belongs to the correct account and meets the actual follow up rule. A person checks permission, commercial context, current relationship, and any commitment implied by the action.",
        "A person accepts ownership, due time, and the next action. A named owner decides whether an exception can be resolved, reassigned, or closed. AI can prepare and surface. It should not turn a proposed owner into an accepted owner by inference.",
      ],
    },
    {
      heading: "Set the clock from the work",
      paragraphs: [
        "There is no responsible universal ownership limit for every signal. An urgent service interruption, a routine download, a pricing request, and an existing customer escalation do not carry the same consequence.",
        "Set an acceptance window by signal type, operating hours, customer promise, available capacity, and escalation path. Start with the current manual expectation, make it explicit, observe misses, and change the limit only when the record supports the change.",
        "A stricter clock without enough capacity can create noisy alerts and rushed messages. A generous clock can hide a weak handoff. The aim is not the smallest number. The aim is a credible promise with a visible owner.",
      ],
    },
    {
      heading: "Measures that reveal the real handoff",
      paragraphs: [
        "Track time from qualified signal to offered owner, and from offered owner to accepted owner. Track the share of signals that enter exception, exception age, reassignment reasons, rejection reasons, and whether the accepted action happened by its due time.",
        "Keep draft generation time as a technical measure, but do not let it stand in for ownership or customer outcome.",
        "Inspect missed cases rather than relying on one impressive average. A small number of old exceptions can matter more than a fast median.",
      ],
    },
    {
      heading: "Opportunities, risks, and limitations",
      paragraphs: [
        "The ownership clock can expose quiet queue decay, show whether the problem is generation, routing, capacity, account data, permission, or unclear responsibility, and give managers a measured basis for changing staffing or automation scope.",
        "A bad qualification rule starts the clock on the wrong items. Incomplete CRM data can route a signal to the wrong person. Too many alerts can train people to ignore the queue. An accepted task can still contain a poor action or unsafe commitment.",
        "Product documentation can establish intended behavior and current controls. It cannot establish that the workflow improves conversion, revenue, or customer experience for this business. A small pilot cannot prove performance across every source, region, product, or team.",
      ],
    },
    {
      heading: "Who should act now and who should wait",
      paragraphs: [
        "Act now if one qualified signal type already has a clear source event, a current manual owner, a defined next action, and a manager who can resolve exceptions.",
        "Test carefully if priority depends on sensitive data, inferred intent, regional outreach rules, or incomplete account context.",
        "Wait before automatic outreach if the team cannot identify the correct account, permission basis, accepted owner, source context, due time, and correction path.",
      ],
    },
    {
      heading: "A 30, 60, and 90 day framework",
      paragraphs: [
        "First 30 days: choose one qualified signal type. Define the start event, accepted state, current ownership window, exception reasons, and named exception owner. Keep outreach under human review.",
        "By 60 days: run the clock beside the current process. Measure offered time, acceptance time, exceptions, reassignments, due actions, and reviewer effort.",
        "By 90 days: automate only the preparation steps that passed the test. Adjust routing, staffing, or the ownership promise using the observed record. Expand only when the first signal type has a credible owner and correction path.",
      ],
    },
  ],
  faqs: [
    ["Does a task owner mean the action was accepted?", "Not always. A system can assign or suggest a person without confirming that the person saw the context, has capacity, and accepted the due action. Define acceptance in the actual workflow."],
    ["Should AI choose the owner?", "It can propose an owner from approved rules and current records. A person or an explicit operating rule should remain accountable for the accepted assignment and the exception path."],
    ["Is the fastest response always best?", "No. A rushed message with the wrong account, permission, price, or commitment can be worse than a measured response. Optimize for timely accepted ownership with verified context."],
    ["Is the ownership clock a vendor feature?", "No. It is Ahmad's proposed operating model built from documented queue capabilities, planned AI assistance, and general responsibility and monitoring principles."],
    ["What is the simplest pass condition?", "For every qualified signal, the team can show the source time, accepted owner, acceptance time, next action, due time, and any exception that delayed the handoff."],
  ],
  sources: [
    ["HubSpot task queue documentation", "https://knowledge.hubspot.com/tasks/use-task-queues", "Primary documentation for grouping, filtering, sharing, and workflow creation of queue tasks."],
    ["Salesforce queue documentation", "https://help.salesforce.com/s/articleView?id=sf.queues_overview.htm&language=en_US", "Primary documentation for supported queue records, shared workload, membership, and ownership."],
    ["Salesforce lead owner documentation", "https://help.salesforce.com/s/articleView?id=000381198&language=en_US&type=1", "Primary documentation for the described lead creation constraint and later assignment options."],
    ["Microsoft Dynamics 365 Sales release plan", "https://learn.microsoft.com/en-us/dynamics365/release-plan/2026wave1/sales/dynamics365-sales/planned-features", "Primary plan for lead management capabilities and the warning that plans can change."],
    ["Microsoft lead priority feature plan", "https://learn.microsoft.com/en-us/dynamics365/release-plan/2026wave1/sales/dynamics365-sales/prioritize-hottest-leads-first-next-best-actions-sales-qualification-agent", "Primary plan for lead research, priority, next best actions, suggested email content, and preview timing."],
    ["NIST AI Risk Management Framework Core", "https://airc.nist.gov/airmf-resources/airmf/5-sec-core/", "Primary guidance for roles, human oversight, measurement methods, and monitoring."],
  ],
  related: [["Meeting decision trace", "/insights/meetingdecisiontracebeforecrm"], ["Voice draft attribution", "/insights/voicedraftattributionbeforecrm"], ["CRM automation", "/services/crm-automation"]],
});

register({
  path: "/insights/similarityneedsretrievalreceipt",
  nav: "insights",
  type: "insight",
  publishedOn: "2026-08-05",
  publishedLabel: "5 August 2026",
  title: "Similarity Needs a Receipt Before It Changes Work | Aixcel",
  description: "A practical retrieval receipt for showing which source, version, access rule, passage, filters, and owner supported an AI answer.",
  eyebrow: "AI, Plain English · Post 015",
  publicLabel: "Post 015",
  h1: "Similarity needs a receipt before it changes work.",
  deck: "Embeddings can find plausible records. The retrieval receipt shows why one source was allowed to influence an answer.",
  answer: "Keep the selected record, version, access scope, exact passage, similarity rank, filters, rejected candidates, exception, and decision owner beside every consequential answer.",
  aside: "The retrieval receipt is Ahmad's operating synthesis. It is not a vendor feature, official standard, accuracy guarantee, compliance guarantee, or measured business outcome.",
  hero: "/assets/retrievalreceipt.svg",
  heroAlt: "A client question moves through candidate records, version and access gates, and reaches a receipt showing the selected source and named decision owner.",
  takeaways: [
    "An embedding can locate related meaning without proving business authority.",
    "A similarity result is a candidate, not a verified answer.",
    "Version, access scope, filters, and exceptions shape which record may matter.",
    "A person or an explicit rule still owns the final decision boundary.",
  ],
  sections: [
    {
      heading: "Embeddings are coordinates for meaning",
      paragraphs: [
        "Imagine placing every approved document on a large map. One area contains refund policies. Another contains scheduling rules. Another contains service agreements. A client question also becomes a point on that map.",
        "When the question lands near a group of refund passages, the system has found content that may be related in meaning, even when the wording differs. Google documents embeddings as numerical representations used for semantic search, classification, and clustering.",
        "The map is useful because business questions rarely repeat the exact words used in a policy. It improves discovery. It does not yet decide which record may govern the work.",
      ],
    },
    {
      heading: "Why the closest record can still be wrong",
      paragraphs: [
        "Similarity answers one narrow question: which candidate appears close to this query inside this embedding space?",
        "It does not automatically establish that the record is current, approved, visible to this user, written for this client or region, complete after chunking, or correct for the exception in front of the team.",
        "The retrieval system can be technically healthy while the operating decision remains unsupported. Semantic closeness is therefore search evidence, not permission or policy authority.",
      ],
    },
    {
      heading: "Expose the hidden selection path",
      paragraphs: [
        "First, the team decides which records may enter the source collection. Second, each record is divided into passages. The size and overlap of those passages affect what context survives together.",
        "The passages and query are embedded with a defined model and task setup. The system ranks candidates. Filters then narrow the set by client, service, region, effective date, record state, and access scope.",
        "A passage is selected to support the answer, and a person or explicit control decides whether that passage may change work. Most demonstrations show only the question and answer. The retrieval receipt preserves the decisions between them.",
      ],
    },
    {
      heading: "What current product documentation establishes",
      paragraphs: [
        "OpenAI documents vector store search results that can include file attributes, a file identifier, filename, returned content passages, and a similarity score. It also documents a configurable chunking strategy. These fields are useful raw material for a receipt. They do not establish business permission or policy meaning.",
        "The pgvector project distinguishes exact search from approximate search. Its documentation states that an approximate index can trade some recall for speed and can produce different results. It also explains that filtering after an approximate index scan can reduce returned results.",
        "Google documents material differences between its current embedding model generations, including incompatible embedding spaces that require existing data to be embedded again during a migration. The wider lesson is that a retrieval result depends on choices that can change.",
      ],
    },
    {
      heading: "Create the retrieval receipt",
      paragraphs: [
        "Record the exact question, selected record, version and effective date, access scope, retrieved passage, similarity rank and score, and every filter applied to the candidate set.",
        "For consequential work, retain the leading rejected candidates and the reason each failed. A record may be closer in meaning but invalid because it is expired, restricted, or written for another context.",
        "Name any missing fact, conflict, or policy exception that prevents automatic use. Then name the person or approved rule accountable for allowing the answer to change work.",
      ],
    },
    {
      heading: "A fictional service business example",
      paragraphs: [
        "A client asks a service company whether a rescheduling fee can be waived. The retrieval system finds three passages.",
        "The first passage is highly similar but comes from an expired refund guide. The second comes from a private contract for another client. The third comes from the current service policy and says that a fee may be waived when the interruption was caused by the company.",
        "The effective date rule rejects the expired guide. The access rule rejects the private contract. The current policy survives, but one fact is missing: who caused the interruption. The answer becomes a draft and a named person owns the exception.",
        "The receipt now shows the current policy, exact passage, effective date, access scope, rejected candidates, missing fact, and decision owner. This is a fictional example, not production data.",
      ],
    },
    {
      heading: "Where AI helps and where a person remains accountable",
      paragraphs: [
        "AI can embed approved records, find related passages, group duplicate material, compare candidates, detect missing receipt fields, and draft an answer that cites the selected source.",
        "Explicit controls can enforce document state, effective date, client boundary, region, access group, source owner, and required exception handling.",
        "A person remains accountable for what a policy means in the case at hand, whether an exception applies, whether the action creates a commitment, and whether the evidence is strong enough for the consequence.",
        "NIST calls for documented knowledge limits, human oversight, and internal controls for system components. It does not prescribe a retrieval receipt. The receipt is Ahmad's proposed way to make those concerns visible in retrieval work.",
      ],
    },
    {
      heading: "Practical opportunities",
      paragraphs: [
        "In customer support, attach the exact current policy passage to a draft reply and block sending when version, permission, or exception data is missing.",
        "In sales and account work, keep one client's contract, pricing, and commitments from influencing another client's answer.",
        "For internal knowledge, show employees which source and version supported an answer and make correction easy when the source changes.",
        "When the model, chunking strategy, filter logic, or approximate index changes, compare receipts before and after the change rather than trusting a smooth demonstration.",
      ],
    },
    {
      heading: "Risks and limitations",
      paragraphs: [
        "A receipt can create false confidence if the source collection is incomplete or the access rules are wrong. A current record can still be ambiguous. A high similarity score can still connect the wrong ideas. A filter can exclude valid evidence. A person can approve a poor decision.",
        "The receipt improves traceability. It does not guarantee correctness. Sensitive work may require legal, security, privacy, technical, or domain review beyond this operating model.",
        "Do not expose confidential source text in a receipt shown to someone who lacks access. The receipt itself needs an access rule.",
      ],
    },
    {
      heading: "Who should act now and who should wait",
      paragraphs: [
        "Act now if one repeated question already has a controlled source set, clear access rules, a named record owner, and a human review step. Begin with a consequential but reversible answer and compare receipts with expert decisions.",
        "Wait before automatic action if the source collection mixes clients, versions are unclear, permission is inferred, exceptions are common, or the team cannot explain why the selected passage won.",
        "The purpose of waiting is to name the next control required.",
      ],
    },
    {
      heading: "A 30, 60, and 90 day operating plan",
      paragraphs: [
        "First 30 days: choose one repeated question. Inventory the approved records and add version, effective date, record state, client or region scope, access group, and source owner. Define the receipt fields and keep every answer under human review.",
        "By 60 days: test paraphrases, missing facts, expired records, restricted records, conflicting policies, and common exceptions. Compare approximate search with exact search where practical. Inspect rejected candidates and whether the correct source survives the filters.",
        "By 90 days: review production receipts. Measure source selection, unsupported answers, blocked access, reviewer changes, exceptions, correction time, and business outcome. Automate only the actions that passed the source, access, exception, and owner checks.",
      ],
    },
  ],
  faqs: [
    ["Is the top similarity result usually correct?", "It may be relevant, but relevance is not the same as current authority. Test the actual source collection, filters, task setup, and failure cases."],
    ["Is a similarity score a confidence score?", "It is a search score for the configured system. Do not present it as the probability that a business answer is true or permitted."],
    ["Should every search create a receipt?", "Not every casual search needs the same record. Use the receipt when an answer can change customer communication, policy application, money, access, or another consequential action."],
    ["Can metadata filters solve the problem?", "They are essential, but only as good as the metadata and rules behind them. Test missing, stale, conflicting, and incorrectly assigned fields."],
    ["Is the retrieval receipt an official standard?", "No. It is Ahmad's proposed operating model informed by the primary documentation and guidance cited here."],
  ],
  sources: [
    ["Google AI for Developers embeddings documentation", "https://ai.google.dev/gemini-api/docs/embeddings", "Primary documentation for embedding uses, task formats, dimensions, normalization, and model migration behavior."],
    ["OpenAI vector store API reference", "https://developers.openai.com/api/reference/resources/vector_stores", "Primary documentation for search result fields, file attributes, returned passages, similarity scores, and chunking strategy."],
    ["pgvector project documentation", "https://github.com/pgvector/pgvector", "Primary documentation for exact and approximate search, recall and speed tradeoffs, filters, iterative scans, and tenant isolation options."],
    ["NIST AI Risk Management Framework Core", "https://airc.nist.gov/airmf-resources/airmf/5-sec-core/", "Primary guidance for knowledge limits, human oversight, component controls, measurement, and documentation."],
  ],
  related: [["Evidence weight before an AI decision", "/insights/sourceevidencebeforeaidecision"], ["Context and permission boundaries", "/insights/context-is-not-consent-ai-private-data"], ["Agentic workflow delivery", "/services/agentic-workflows"]],
});

register({
  path: "/insights/rememberthemethodrecheckauthority",
  nav: "insights",
  type: "insight",
  publishedOn: "2026-08-06",
  publishedLabel: "6 August 2026",
  title: "Personal AI Workflow Memory Needs a Fresh Check | Aixcel",
  description: "A practical model for letting a personal AI reuse a proven workflow while current sources, access, instructions, and commitments are checked again.",
  eyebrow: "AI, Plain English · Post 016",
  publicLabel: "Post 016",
  h1: "A personal AI should remember the method, not yesterday's authority.",
  deck: "Workflow memory can remove setup work. It must not turn an old fact, permission, instruction, or commitment into current authority.",
  answer: "Let memory preserve the method. Check the current source, access, instruction, and commitment again before a consequential action.",
  aside: "The stencil model is Ahmad's operating synthesis. It is not a vendor feature, official standard, safety guarantee, compliance guarantee, or measured business outcome.",
  hero: "/assets/workflowmemoryauthority.png",
  heroAlt: "A tactile aubergine and dark metal workflow stencil press beside four current input cartridges, with one lime current input and one rust expired input.",
  takeaways: [
    "Workflow memory is a reusable method, not a permanent statement of business truth.",
    "Benchmark gains do not establish reliability in a client workflow.",
    "Source, access, instruction, and commitment can change while the method remains useful.",
    "Memory may prepare the work. Current evidence and a named owner authorize the action.",
  ],
  sections: [
    {
      heading: "What workflow memory changes",
      paragraphs: [
        "Agent Workflow Memory describes a way to induce commonly reused workflows from prior experience and selectively provide those workflows to guide later generations.",
        "The authors evaluate the method on Mind2Web and WebArena, two web navigation benchmarks. They report relative success improvements of 24.6 percent and 51.1 percent against their baselines.",
        "Those results show why remembering a routine can differ from remembering a transcript. A routine can preserve the steps that helped complete a class of tasks, such as clarifying a request, locating a source, applying a criterion, and pausing at an exception.",
        "The paper also describes a material limitation. A retrieved workflow can guide actions that do not fit the current environment, and the agent may struggle to diverge from the routine. This is research evidence for testing reusable workflows, not proof of reliability, safety, or commercial value in a specific client workflow.",
      ],
    },
    {
      heading: "The deeper risk is lost provenance",
      paragraphs: [
        "A recent preprint, Memory Provenance Laundering in LLM Agents, describes a failure mode in which memory consolidation can preserve an action trigger while obscuring the lower trust origin that should constrain it.",
        "Treat this as a research warning, not a settled universal result. The preprint is recent and needs independent reproduction.",
        "Its business consequence is practical. Any memory that can influence consequential work should preserve who or what supplied it, when it was captured, what scope and authority it carried, and what decision it may influence now.",
        "If those answers are missing, the memory may help form a question. It should not authorize a client message, record change, payment, or commitment.",
      ],
    },
    {
      heading: "The stencil model",
      paragraphs: [
        "Think of workflow memory as a stencil. The stencil preserves the shape of the work. It can hold the brief structure, the source categories to inspect, the questions that reveal a missing assumption, the known failure patterns, and the point where human review begins.",
        "The stencil does not supply today's authority. Four current inputs must be inserted again: source, access, instruction, and commitment.",
        "Source asks whether the evidence is current, complete, and appropriate. Access asks whether this person and this workflow may use it for this client and purpose. Instruction asks whether the current request replaces or narrows the earlier one. Commitment asks who owns the promise, deadline, price, or action implied by the output.",
        "The reusable stencil makes preparation faster. The current inputs decide what may happen today.",
      ],
    },
    {
      heading: "What may persist and what should expire",
      paragraphs: [
        "Useful persistent memory can include the structure of an approved research brief, the categories of primary sources to check, questions that expose missing context, formatting preferences, review expectations, known failure patterns, and the correct stop point.",
        "Mutable memory should carry an expiry or a fresh check. That includes facts copied from external sources, policy versions, service conditions, a person's role or access, client instructions, preferences, prices, deadlines, exceptions, commitments, and tool instructions found inside an untrusted document.",
        "The point is not to delete every old record. The point is to prevent an old record from silently presenting itself as current authority.",
      ],
    },
    {
      heading: "A fictional weekly client brief",
      paragraphs: [
        "Consider a personal AI that helps prepare a weekly client research brief. The remembered method clarifies the decision question, checks approved primary source categories, separates verified facts from inference, drafts in the agreed structure, and stops for review before sending.",
        "Since last week, a source page may have changed. A stakeholder may have left the project. The client may have narrowed the objective. A previous exception may have been resolved. A deadline may have moved.",
        "The agent should reuse the brief method. It should not reuse the old source, access, instruction, conclusion, or commitment without a current check.",
        "Memory accelerates preparation. Current checks authorize what can leave the workspace. This is a fictional example, not production data.",
      ],
    },
    {
      heading: "Separate coordination from authority",
      paragraphs: [
        "The Agent Operating System is a recent architecture preprint. It proposes one plane for governance responsibilities such as policy, trust, authority, auditability, and human oversight, and another plane for runtime coordination that includes workflow, context, and memory coordination.",
        "This is a proposed reference architecture, not an official standard or a production result. The separation is useful for operators. Memory coordinates prior experience. It should not become the policy layer that grants present authority.",
        "A related survey, Self Evolving Coding Agents, describes how coding agents may evolve through memory, skills, tools, models, frameworks, and collaboration structures. Its wider operating lesson is to name exactly what may change from prior work and what must remain controlled.",
      ],
    },
    {
      heading: "A practical operating design",
      paragraphs: [
        "First, memory prepares. The agent retrieves the reusable method, preferred structure, approved source categories, known failure patterns, and stop condition.",
        "Second, current evidence authorizes. The workflow checks the source date and version, current access scope, present instruction, unresolved exception, and any commitment implied by the output.",
        "Third, a named person confirms. That person decides whether the draft may be sent, the record may be changed, or the commitment may be accepted. An explicit current rule may cover low consequence cases only after the team has tested the exact boundary.",
      ],
    },
    {
      heading: "Practical opportunities",
      paragraphs: [
        "For client research, reuse the method for framing the question, selecting source categories, labeling claims, and preparing the draft while checking every mutable record again.",
        "For account preparation, remember the review sequence and preferred output while refreshing the contact role, commercial context, permissions, open commitments, and recent account events.",
        "For internal knowledge work, reuse a proven method for collecting and comparing evidence while keeping the current source, owner, effective date, and correction path visible.",
        "For quality review, store recurring failure patterns and reviewer questions so the next draft begins with stronger checks instead of repeating the same mistake.",
      ],
    },
    {
      heading: "Risks and limitations",
      paragraphs: [
        "A reusable routine can be wrong for the current environment. A stale or lower trust observation can survive in memory after its context disappears. A current access rule can be misconfigured. A new instruction can conflict with an older preference. A person can approve a poor output.",
        "The research cited here does not establish production reliability, privacy compliance, security, cost savings, or return on investment for a specific personal AI.",
        "The stencil model improves the decision boundary. It does not guarantee correctness or replace legal, privacy, security, technical, or professional review where those duties apply.",
      ],
    },
    {
      heading: "Who should act now and who should wait",
      paragraphs: [
        "Act now if one repeated workflow has a stable preparation method, a controlled source set, a clear stop condition, and a named reviewer. Begin with useful but reversible work. Let the agent organize evidence and prepare a draft while the current process remains available.",
        "Test carefully if the workflow includes personal data, client commitments, mutable permissions, regulated decisions, or tools that can act outside the workspace.",
        "Wait before autonomous action if the team cannot identify the source, freshness, access rule, current instruction, commitment owner, exception path, and correction owner for each consequential output.",
      ],
    },
    {
      heading: "A 30, 60, and 90 day framework",
      paragraphs: [
        "First 30 days: choose one read first workflow such as a weekly client brief. Write down the reusable method, current inputs, stop condition, reviewer, and actions that remain prohibited. Keep every output as a draft.",
        "By 60 days: run the remembered method beside the current process. Record where memory saved setup time, introduced an irrelevant step, surfaced a stale item, missed a source change, or required correction. Give mutable records an expiry or a required current check.",
        "By 90 days: expand only where the team can show the method used, the current inputs checked, the named owner, the exception path, and the correction record. Automate a consequential action only when the exact action has its own acceptance test and current authority rule.",
      ],
    },
  ],
  faqs: [
    ["Is workflow memory the same as a knowledge base?", "No. A knowledge base stores records that may be retrieved. Workflow memory stores a reusable method for preparing work. Both still need source, freshness, scope, and authority checks when they influence a real decision."],
    ["Can a personal AI remember client preferences?", "It can retain a preference under an appropriate policy and scope. The preference should carry its source and date, and it should not override a newer instruction, contract, permission, or client decision."],
    ["Do benchmark gains make workflow memory safe?", "No. Benchmark findings can motivate a controlled test. They do not establish reliability, safety, or commercial value in a specific business workflow."],
    ["Should every remembered item expire?", "No. Stable methods can persist. Mutable facts, permissions, instructions, and commitments should carry an expiry or a fresh check before they change work."],
    ["What should the agent be allowed to do first?", "Start with preparation. Let it organize the brief, locate candidate sources, apply the review structure, and flag missing information. Keep sending, changing shared records, spending money, and making commitments behind explicit current checks and a named owner."],
  ],
  sources: [
    ["Agent Workflow Memory", "https://arxiv.org/abs/2409.07429", "Primary paper for reusable workflow induction, authors' reported benchmark results, and the current environment limitation."],
    ["Memory Provenance Laundering in LLM Agents", "https://arxiv.org/abs/2607.29167", "Recent preprint describing provenance loss during persistent memory consolidation. Treat as a research warning pending independent reproduction."],
    ["The Agent Operating System", "https://arxiv.org/abs/2608.03214", "Recent architecture preprint separating governance responsibilities from runtime and memory coordination."],
    ["Self Evolving Coding Agents", "https://arxiv.org/abs/2608.03392", "Recent survey of coding agent evolution across memory, skills, tools, models, frameworks, and collaboration structures."],
  ],
  related: [["Retrieval receipt", "/insights/similarityneedsretrievalreceipt"], ["Evidence weight before an AI decision", "/insights/sourceevidencebeforeaidecision"], ["Agentic workflow delivery", "/services/agentic-workflows"]],
});

register({
  path: "/insights/evidencereaddepthforresearchbriefs",
  nav: "insights",
  type: "insight",
  publishedOn: "2026-08-07",
  publishedLabel: "7 August 2026",
  title: "Evidence Read Depth for AI Research Briefs | AiXCEL",
  description: "Learn how consulting teams can use Paper Scout for faster research triage while keeping the paper section, version, limits, and reviewer visible.",
  eyebrow: "AI, Plain English · Post 017",
  publicLabel: "Post 017",
  h1: "A cited research brief should reveal what it actually read.",
  deck: "A citation gives the reader a route back to the source. It does not reveal which parts of the source were examined before a conclusion changed work.",
  answer: "Use the abstract to scout the field. Record the paper version, sections examined, limiting evidence, named reviewer, and decision use before a material claim shapes client work.",
  aside: "Read depth is Ahmad's proposed operating model. It is not an official standard, a Paper Scout feature, a safety guarantee, or a measured business outcome.",
  hero: "/assets/evidencereaddepth.png",
  heroAlt: "A tactile aubergine and dark metal evidence depth scanner holding a thick stack of ivory paper, with a lime scan line reaching the top sheet and deeper paper layers remaining visible.",
  takeaways: [
    "A citation identifies a source, but it does not reveal which parts of the source were examined.",
    "Paper Scout is currently documented as an abstract grounded research preparation workflow with numbered source links.",
    "Some research questions require evidence from the paper body rather than the abstract.",
    "AI can accelerate discovery and organization. A named person still owns the client meaning and the correction path.",
  ],
  sections: [
    {
      heading: "What Paper Scout currently does",
      paragraphs: [
        "Paper Scout documents a compact preparation workflow. A research question enters. Recent matching arXiv records are collected. A local language model creates paper summaries, a comparison table, open questions, and a topic map. Numbered references keep the brief connected to clickable paper records.",
        "The arXiv API manual explains the metadata behind that trail. Search results can expose paper titles, identifiers, links, published and updated dates, abstracts, authors, categories, and article versions.",
        "This is useful infrastructure for research triage. The brief can preserve an inspectable address instead of offering an untraceable answer.",
        "The boundary is equally important. The Paper Scout repository describes the current digest as grounded in abstracts. Full paper ingestion appears in the roadmap. A roadmap item is not a current capability or a delivery promise.",
      ],
    },
    {
      heading: "Why the abstract is not the complete evidence record",
      paragraphs: [
        "An abstract is designed to compress a paper. Compression is useful for discovery. It is not the same as examining the complete argument.",
        "A paper can place crucial detail deeper inside the document. The methods can reveal a narrower sample. The results can show that one metric improved while another did not. The limitations can identify conditions where the finding may fail. An appendix can contain prompts, exclusions, or evaluation rules that change interpretation. A later version can correct or qualify the earlier record.",
        "The PaperQA2 research makes the coverage issue concrete. The authors designed LitQA2 questions so the relevant answer appears in the main body of a paper and not in its abstract. Their system parses paper text and gathers evidence from ranked sections before producing an answer.",
        "This does not prove that every research task needs the same depth. It establishes that some valid research questions cannot be answered from the abstract alone.",
      ],
    },
    {
      heading: "A citation can still be attached to the wrong claim",
      paragraphs: [
        "Citation presence and citation support are different. A polished reference list does not remove the need to verify that the cited paper supports the specific claim beside it.",
        "The CiteME paper tests whether a language model can identify the paper referenced by a scientific passage. The authors report accuracy between 4.2 and 18.5 percent for the tested language models, 69.7 percent for people, and 35.3 percent for their search and reading agent.",
        "Those figures belong to one attribution benchmark. They are not a universal measure of citation quality, summary accuracy, research reliability, or Paper Scout performance.",
        "The useful lesson is narrower. Showing a source is necessary. Checking whether the source supports the exact claim remains separate work.",
      ],
    },
    {
      heading: "The read depth record",
      paragraphs: [
        "Read depth is Ahmad's proposed operating record for a material research claim. It sits beside the citation and answers six questions.",
        "First, state the exact claim. A broad paper topic is not enough. Write the conclusion that may influence a proposal, product choice, client recommendation, or public statement.",
        "Second, record the paper version. The arXiv manual documents version retrieval. This matters because a later submission can correct, expand, or qualify an earlier one.",
        "Third, name the coverage. Record whether the review included the abstract, methods, results, limitations, appendices, or complete paper. If the workflow stopped at the abstract, say so.",
        "Fourth, capture limiting evidence. Record the important condition, missing comparison, contradictory result, sample boundary, or author stated limitation. A review that records only supporting passages is incomplete.",
        "Fifth, name the reviewer. Identify the analyst or reviewer who decided that the paper supports the claim in the current business context.",
        "Sixth, state the decision use. Research used for discovery can tolerate a lighter review than research used for a client commitment, investment, regulated decision, security control, or public performance claim. The required depth should follow the consequence.",
      ],
    },
    {
      heading: "A fictional consulting example",
      paragraphs: [
        "Suppose a consulting team asks which recent approaches to evaluating AI coding agents should inform a client pilot.",
        "Paper Scout can collect relevant paper records, compare abstract level contributions, expose open questions, and preserve numbered links. That can save meaningful preparation time.",
        "Now imagine one abstract reports improved task success. The analyst still needs to inspect the paper body before recommending the approach. The evaluation might use a narrow task set. The baseline might be weaker than the client's current process. The environment might permit tools that the client cannot use. The reported success measure might ignore review time, failed runs, security risk, or cost.",
        "The safe flow is simple. Paper Scout prepares the candidate brief. The analyst selects the material papers. The analyst reads the methods, results, and limitations that support the claim. The read depth record captures version, coverage, limiting evidence, reviewer, and decision use. A named reviewer approves the client conclusion.",
        "The tool improves discovery and organization. The analyst owns the recommendation. This is a fictional workflow, not client data or a measured outcome.",
      ],
    },
    {
      heading: "Practical business applications",
      paragraphs: [
        "For consulting research, use Paper Scout to build a cited review queue. Require deeper paper coverage for every claim that enters a client deliverable.",
        "For product and technical strategy, separate evidence used to discover an approach from evidence used to approve a product decision. Record the evaluation conditions that must match the intended workflow.",
        "For AI procurement, when a vendor cites research, record whether the team checked the abstract, complete paper, benchmark setup, limitations, and current product conditions.",
        "For evidence led content, show which claims came from source abstracts, paper bodies, vendor documentation, or Ahmad's interpretation.",
        "For internal knowledge work, let AI prepare comparison tables and open questions. Keep material conclusions behind a visible review depth and a named owner.",
      ],
    },
    {
      heading: "Opportunities",
      paragraphs: [
        "The model can make discovery faster without losing the path back to the paper. It can create clearer handoffs between research preparation and expert judgment. It can make review stronger by placing supporting and limiting evidence beside the same claim.",
        "A visible version and reviewer can also make correction easier when a paper changes or an interpretation is revised. The team can communicate more honestly about what it knows, what it inferred, and what it has not yet examined.",
      ],
    },
    {
      heading: "Risks and limitations",
      paragraphs: [
        "The read depth model does not guarantee correctness. A person can read the complete paper and still misunderstand it. A paper can be weak, contradicted, retracted, or irrelevant to the decision. A model can misclassify the section it used. A team can record a review without performing it carefully.",
        "Access to complete papers can be limited by licensing. More reading can add cost without improving a low consequence decision.",
        "The PaperQA2 and CiteME findings are research results under their authors' methods. They do not establish Paper Scout performance or production reliability in a consulting workflow.",
        "The NIST Generative AI Profile provides voluntary guidance for managing generative AI risks across the lifecycle. NIST does not prescribe this read depth record or certify the workflow.",
        "The model should therefore be risk based. The higher the consequence, the stronger the evidence and review required. This article is not legal, medical, investment, security, privacy, or compliance advice.",
      ],
    },
    {
      heading: "Who should act now and who should wait",
      paragraphs: [
        "Act now if your team already uses AI to discover, summarize, or compare research and can name one repeated brief where source coverage is invisible.",
        "Start with a read first workflow. Let AI prepare the candidate set and comparison. Keep every material conclusion under human review while the team records paper version, section coverage, limiting evidence, reviewer, and decision use.",
        "Test carefully if the brief can influence client money, security, policy, regulated work, public claims, or a technical commitment.",
        "Wait before automatic recommendations if the team cannot show the cited paper, current version, reviewed sections, limiting evidence, and named owner behind the conclusion.",
      ],
    },
    {
      heading: "A 30, 60, and 90 day operating plan",
      paragraphs: [
        "First 30 days: choose one repeated research brief. Add a simple read depth block beside every material claim. Record the paper version, sections reviewed, important limitations, reviewer, and intended decision use. Keep the brief in draft state until a named person checks the claim against the source.",
        "By 60 days: compare abstract level conclusions with paper body review. Record where the methods, results, limitations, or later version changed the recommendation. Define a minimum read depth for discovery, internal guidance, client delivery, and consequential approval.",
        "By 90 days: review the correction record. Measure unsupported claims, missed limitations, version changes, reviewer changes, time to verification, and decisions that required deeper evidence. Automate only the preparation steps that preserve the trail and make missing coverage visible.",
      ],
    },
  ],
  faqs: [
    ["Does a citation make an AI research brief accurate?", "No. A citation gives the reader a path to inspect the source. Accuracy still depends on whether the source supports the claim, which version was used, what parts were read, and how the evidence fits the decision."],
    ["Is an abstract ever enough?", "It can be enough for discovery, triage, or deciding what to read next. It is usually not enough for a material conclusion when the methods, results, limitations, or appendices could change the meaning."],
    ["Does every cited paper need a complete paper review?", "No. Match the depth to the consequence. A low consequence research queue can begin with abstracts. A client commitment or material public claim should require stronger review."],
    ["Does Paper Scout currently read complete papers?", "Its public repository describes the current digest as abstract grounded and lists full paper ingestion in the roadmap."],
    ["Can AI create the read depth record?", "AI can prepare it by identifying sections, excerpts, and version metadata. A named person should verify the record before a material conclusion changes work."],
    ["Is read depth an official standard?", "No. It is Ahmad's proposed operating synthesis based on the current Paper Scout boundary, arXiv version support, research on full paper question answering and attribution, and risk based review principles."],
  ],
  sources: [
    ["Paper Scout public repository", "https://github.com/syedahmad0786/paper%2Dscout", "Primary project documentation for the current abstract grounded digest, numbered source links, and the full paper ingestion roadmap item."],
    ["arXiv API User's Manual", "https://info.arxiv.org/help/api/user%2Dmanual.html", "Primary documentation for paper metadata, identifiers, dates, abstracts, links, categories, and article versions."],
    ["Language agents achieve superhuman synthesis of scientific knowledge", "https://arxiv.org/abs/2409.13740", "Primary paper for the LitQA2 body only question design and full text evidence workflow."],
    ["CiteME", "https://arxiv.org/abs/2407.12861", "Primary paper for the authors' scientific claim attribution benchmark and reported results."],
    ["NIST Generative AI Profile", "https://doi.org/10.6028/NIST.AI.600%2D1", "Primary voluntary guidance for managing generative AI risks across the lifecycle."],
  ],
  related: [["Retrieval receipt", "/insights/similarityneedsretrievalreceipt"], ["Evidence weight before an AI decision", "/insights/sourceevidencebeforeaidecision"], ["Agentic workflow delivery", "/services/agentic-workflows"]],
});

register({
  path: "/insights/voicedraftrejectionpath",
  nav: "insights",
  type: "insight",
  publishedOn: "2026-08-08",
  publishedLabel: "8 August 2026",
  title: "Voice Draft Review Before CRM Updates | AiXCEL",
  description: "Learn how to keep captured speech in a reversible review state with accept, correct, and reject outcomes before any CRM record changes.",
  eyebrow: "AI, Plain English · Post 018",
  publicLabel: "Post 018",
  h1: "Your voice workflow needs more than a save button.",
  deck: "Captured speech can create a useful draft. It should not change a customer record until a named reviewer chooses to accept it, correct it, or reject it.",
  answer: "Put a reversible proofing state between speech and CRM. Check record identity, material facts, real commitments, and the next action. Then accept the reviewed note, correct the draft, or reject it with no record change.",
  aside: "The three outcome method is Ahmad's proposed operating model. It is not a vendor feature, a legal conclusion, a safety guarantee, or a measured client result.",
  hero: "/assets/voicedraftrejectionpath.png",
  heroAlt: "A tactile aubergine and dark metal voice draft proofing chamber on an obsidian floor. A lime waveform enters from the left while mechanical lenses inspect one suspended ivory draft card. A lime acceptance key and a rust rejection return chute remain separate.",
  takeaways: [
    "Speech to text creates input. It does not authorize a shared record.",
    "A useful proofing state needs three visible outcomes: accept, correct, and reject.",
    "The reviewer should check record identity, facts, commitments, and the next action before choosing an outcome.",
    "A rejected draft should leave the CRM unchanged and should not send a customer message.",
  ],
  sections: [
    {
      heading: "What the current product evidence supports",
      paragraphs: [
        "HubSpot documents voice input in its mobile app through speech to text. The same page says user permissions determine which Breeze Assistant actions can be performed. The ability to speak into a system is therefore separate from authority to create or change every record.",
        "HubSpot also describes Conversation Intelligence as capturing voice data in Smart CRM, surfacing call insights, using tracked terms, and triggering workflows. This is a vendor description, not independent evidence of accuracy or safe action. It shows why the review boundary matters as voice data moves closer to workflow triggers.",
        "Salesforce describes Agentforce Contact Center as connecting voice, CRM data, AI agents, and human handoffs. Its announcement says a human agent can receive the transcript and customer history during a handoff. The same announcement states a United States and Canada availability boundary for the add on. It does not prove that every transcript is correct or ready for a record.",
        "Microsoft's current Contact Center plan lists voice biometrics and role based controls for recording and transcription downloads. Some items are planned for August or September 2026. Microsoft says delivery timelines can change and projected functionality may not be released.",
        "The evidence supports a narrow conclusion. Voice is moving closer to identity, permissions, CRM context, and workflow action. It does not remove the need for a reviewable state before a consequential record change.",
      ],
    },
    {
      heading: "The missing state between capture and commit",
      paragraphs: [
        "Many workflows show a simple sequence: speak, transcribe, and save. That sequence hides the most important decision.",
        "The reviewer may discover that the wrong contact is selected, a date is vague, a commitment was never accepted, or the next action should be a verification task rather than a customer note.",
        "If save is the only visible outcome, the interface quietly pushes uncertainty into shared memory.",
        "A better sequence captures the representative's own observation, creates a private draft, inspects four material checks, and then offers accept, correct, or reject. Any outbound action remains a separate decision.",
        "This is a workflow recommendation. It is not a claim that the cited vendors already implement Ahmad's exact model.",
      ],
    },
    {
      heading: "Give the draft three valid outcomes",
      paragraphs: [
        "Accept only when the reviewer has confirmed the correct record, material facts, any real commitment, and the intended next action. The mutation should identify the person who approved it and the time of the decision.",
        "Correct when the draft is useful but incomplete or wrong. The reviewer restores missing context, removes unsupported certainty, and runs the checks again. Correction should return to the proofing state. It should not become a hidden save.",
        "Reject when the draft should not change the CRM. Reasons may include the wrong customer, unverified speech, unclear consent, an unsupported commitment, sensitive material in an unapproved field, or a duplicate note.",
        "Rejection should be a complete outcome. The shared record stays unchanged. The organization can retain only the minimum event needed for audit or learning, subject to its policy.",
      ],
    },
    {
      heading: "The four checks inside the proofing state",
      paragraphs: [
        "Record identity asks whether this is the correct person, property, company, deal, or service case. Names that sound similar and nearby records can create confident routing mistakes.",
        "Facts asks whether names, amounts, units, dates, locations, and material details are exact. A fluent sentence can hide uncertainty.",
        "Commitment asks whether someone actually agreed to do something. A useful commitment needs an owner, exact action, and due date. A suggested next step is not automatically a customer commitment.",
        "Next action asks whether the outcome should be a CRM note, an internal task, a verification request, or no action. An outbound message or offer should remain separate unless a specific approved workflow says otherwise.",
      ],
    },
    {
      heading: "A fictional property visit example",
      paragraphs: [
        "A representative leaves a viewing and dictates: The buyers are ready to move next month. Send the revised offer today.",
        "The transcript is clean. The note is not ready. Two buyers attended, but the draft does not identify which contact made the statement. Next month is not an exact date. Ready to move may be an interpretation rather than a confirmed decision. No one has confirmed who approved a revised offer.",
        "The correct outcome is not a saved readiness claim and not an automatic message. The draft takes the correction path. It becomes an internal verification task asking the representative to confirm the contact, move date, requested document, approver, and due time.",
        "Only confirmed information can return to the proofing state. If the details cannot be confirmed, the draft takes the rejection path and the CRM remains unchanged. This is a fictional scenario with no client data or measured result.",
      ],
    },
    {
      heading: "Why rejection is a product feature, not an error message",
      paragraphs: [
        "A useful rejection path preserves agency. A user can decide that no record change is the correct outcome.",
        "It also creates cleaner evaluation. The team can measure why drafts fail without treating every failure as a user mistake.",
        "The NIST AI Risk Management Framework Core calls for documented human oversight, interpretation of AI output in context, safe failure, and mechanisms for people to report problems and appeal outcomes.",
        "The framework does not prescribe a voice draft screen. The proofing chamber is an operating interpretation of those principles.",
      ],
    },
    {
      heading: "What the tool may handle and what a person must own",
      paragraphs: [
        "The tool may handle voice input, speech to text, draft structure, candidate record suggestions, and missing field or ambiguity warnings.",
        "A person must own the final record identity, the meaning of material facts, whether a commitment exists, the accept, correct, or reject decision, any customer facing action, and correction or deletion responsibility.",
        "A human checkpoint assigns responsibility and creates an opportunity to catch errors. It does not guarantee accuracy. This boundary should be documented before a real pilot starts.",
      ],
    },
    {
      heading: "Practical business applications",
      paragraphs: [
        "For real estate and field sales, representatives can capture personal observations after a visit while keeping customer claims, prices, dates, and outbound actions under review.",
        "For field service, technicians can dictate work observations, then confirm the asset, fault, parts, safety issue, and next visit before a service record changes.",
        "For account management, teams can capture conversation notes while separating a useful memory aid from an accepted commercial commitment.",
        "For recruitment, interview observations can remain separate from candidate supplied facts, consent, and follow up decisions.",
        "Health, legal, finance, insurance, and public sector teams may face stricter duties. They should use approved systems, professional review, and applicable policy. This article is not legal or compliance advice.",
      ],
    },
    {
      heading: "Opportunities",
      paragraphs: [
        "A visible proofing state can reveal common failure reasons. Teams may discover that most rejected drafts come from wrong record suggestions, vague dates, unsupported commitments, or outbound actions that lack approval.",
        "That evidence can guide interface design, training, field structure, and permission rules.",
        "The workflow can also create a better pilot metric. Measure how many drafts were accepted without correction, corrected before commit, rejected with no mutation, and repaired after an incorrect commit.",
        "No improvement should be claimed until a real pilot produces evidence.",
      ],
    },
    {
      heading: "Risks and limitations",
      paragraphs: [
        "Speech recognition can mishear names, addresses, amounts, dates, accents, and technical terms. The model can assign the wrong record or turn uncertain language into confident prose.",
        "The reviewer can still make a mistake. A human checkpoint is a responsibility boundary, not a guarantee.",
        "Voice input can expose sensitive information through devices, nearby application context, storage, logs, or integrations. Recording another person may introduce consent and legal duties that personal post visit dictation does not.",
        "Vendor documentation can change. Plans may be delayed, limited by region or edition, or configured differently in a specific account.",
        "The three outcome method and four checks are proposed operating tools. They are not an official standard or measured production result.",
      ],
    },
    {
      heading: "Who should act now and who should wait",
      paragraphs: [
        "Act now if the team already captures personal field observations, has an approved voice tool, knows which records may change, can keep the first pilot fictional, and has a named reviewer for every mutation.",
        "Wait if the tool can write to the wrong record, outbound messages can send automatically, storage and consent rules are unclear, rejection still leaves partial data behind, or no one owns correction and deletion.",
      ],
    },
    {
      heading: "A 30, 60, and 90 day operating plan",
      paragraphs: [
        "First 30 days: map one narrow voice capture workflow. Define the draft state, four checks, three outcomes, permitted records, prohibited data, and the reviewer. Test with fictional information only.",
        "By 60 days: run a limited internal pilot. Record accept, correct, and reject rates. Review wrong record suggestions, transcription errors, missing commitments, unauthorized next actions, and any mutation that occurred before approval.",
        "By 90 days: decide whether the workflow is safe and useful. Improve the most common failure point. Expand only if the team can prove the rejection path leaves the CRM unchanged and every accepted mutation has a named owner.",
      ],
    },
  ],
  faqs: [
    ["Is a clean transcript ready for the CRM?", "No. It may still be attached to the wrong record, omit context, overstate certainty, or imply an action that no one approved."],
    ["Why not let the model correct the draft automatically?", "The model can suggest corrections, but a reviewer should confirm material meaning and the final state change. Automatic rewriting can produce a cleaner sentence without restoring the missing fact."],
    ["Should every rejected draft be stored?", "Not necessarily. Retention should follow a defined purpose, approved location, access rule, and deletion policy. Keeping more speech does not automatically create better evidence."],
    ["Does a human checkpoint guarantee accuracy?", "No. It assigns responsibility and creates an opportunity to catch errors. The workflow still needs testing, monitoring, and correction."],
    ["Is this method specific to HubSpot, Microsoft, or Salesforce?", "No. The product sources show relevant capabilities and control boundaries. The accept, correct, and reject method is vendor neutral."],
    ["What is the first pilot metric?", "Measure whether rejected drafts leave the CRM unchanged. That proves the control before the team optimizes speed."],
  ],
  sources: [
    ["HubSpot mobile Breeze Assistant", "https://knowledge.hubspot.com/ai/use-breeze-assistant-on-the-hubspot-mobile-app", "Primary documentation for mobile voice input, speech to text, feature access, and permission controlled actions."],
    ["HubSpot Conversation Intelligence", "https://www.hubspot.com/products/conversation-intelligence?eco_planType=FREE", "Primary vendor page for CRM connected voice data, call insights, tracked terms, and workflow triggers."],
    ["Microsoft Dynamics 365 Contact Center plan", "https://learn.microsoft.com/en-us/dynamics365/release-plan/2026wave1/service/dynamics365-contact-center/planned-features", "Primary plan for voice biometrics and role based recording and transcription controls. Planned dates are not release proof."],
    ["Salesforce Agentforce Contact Center", "https://www.salesforce.com/uk/news/stories/agentforce-contact-center-announcement/", "Primary vendor announcement for voice, CRM context, AI agents, human handoffs, and the stated availability boundary."],
    ["NIST AI Risk Management Framework Core", "https://airc.nist.gov/airmf-resources/airmf/5-sec-core/", "Primary voluntary guidance for documented oversight, context, safe failure, feedback, and appeal."],
    ["NIST appendix on human and AI interaction", "https://airc.nist.gov/airmf-resources/airmf/appendices/app-c-ai-risk-management-and-human-ai-interaction/", "Primary guidance on roles, responsibilities, oversight, and the loss of context in human and AI interaction."],
  ],
  related: [["Voice draft attribution", "/insights/voicedraftattributionbeforecrm"], ["Agentic workflow delivery", "/services/agentic-workflows"], ["Meeting decision trace", "/insights/meetingdecisiontracebeforecrm"]],
});

register({
  path: "/insights/reversibleaitooladoption",
  nav: "insights",
  type: "insight",
  publishedOn: "2026-08-09",
  publishedLabel: "9 August 2026",
  title: "Reversible AI Tool Adoption and Exit Planning | AiXCEL",
  description: "A practical framework for buying AI tools with clear ownership, measurable evidence, cost boundaries, data portability, and a planned exit.",
  eyebrow: "AI, Plain English · Post 019",
  publicLabel: "Post 019",
  h1: "If removing an AI tool breaks the workflow, the business never owned the system.",
  deck: "An AI tool should enter the business as a removable module. The workflow definition, evidence, owner, action boundary, and fallback should remain under business control.",
  answer: "Design the exit before adoption expands. Keep the operating spine under business control, define the evidence that earns renewal, test the export path, and run one controlled removal drill before the renewal decision.",
  aside: "The reversible AI tool dock is Ahmad's proposed operating model. It is not an official standard, a legal conclusion, a safety guarantee, or a measured client result.",
  hero: "/assets/reversibleaitooladoption.png",
  heroAlt: "A premium obsidian AI tool dock with a faceted smoky glass capability module lifted above a business owned continuity rail. Lime energy still connects seven controls while a rust release latch and ivory recovery capsule remain visible.",
  takeaways: [
    "An AI tool should enter the business as a removable module, not become the business process itself.",
    "The workflow definition, approved inputs, output structure, decision owner, exception history, and fallback should remain under business control.",
    "The evidence for renewal should be defined before licenses or integrations expand.",
    "Data export is necessary, but continuity also depends on recovering context, decisions, responsibilities, and operating instructions.",
    "A real pilot should include a removal drill before the renewal decision.",
  ],
  sections: [
    {
      heading: "A current product transition makes the question urgent",
      paragraphs: [
        "OpenAI scheduled Atlas to stop working on 9 August 2026. Its official transition guidance says bookmarks, open tabs, and browser history may not transfer automatically. Workspace administrators were advised to identify affected users, update internal guidance, preserve important pages, and treat cookies and session files as sensitive.",
        "That is a product transition, not evidence that every AI vendor will disappear. It is also a useful operating lesson.",
        "The best time to design an AI exit is before the tool becomes useful.",
        "Once a team builds habits, templates, records, and decisions around a product, leaving becomes more than cancelling a subscription. The business must know what it still owns, what can be exported, what must be rebuilt, who manages the transition, and how work continues while the replacement is tested.",
        "The purchase decision is therefore incomplete without an exit architecture.",
      ],
    },
    {
      heading: "Treat the tool as a removable module",
      paragraphs: [
        "Most adoption plans begin with features, seats, integrations, and training. A stronger plan begins with the workflow spine.",
        "The workflow spine is the business owned layer that should survive a vendor change. It includes the purpose of the work, approved inputs, output structure, action boundary, decision owner, exception history, evaluation method, export routine, and fallback path.",
        "The AI product plugs into that spine. It may produce a draft, classify a request, search records, prepare code, or suggest an action. It does not own the reason the work exists or the responsibility for the outcome.",
        "This distinction becomes visible when a product changes plan, removes a feature, raises a usage cost, loses access to a connector, merges into another product, or reaches the end of its life.",
        "If the team can remove the product while preserving the workflow, the tool was a module. If removing it destroys the workflow, the product quietly became the operating system.",
      ],
    },
    {
      heading: "Why decommissioning belongs in the buying decision",
      paragraphs: [
        "The NIST AI Risk Management Framework Core is voluntary guidance, but it is unusually clear about the full lifecycle.",
        "It includes processes for safely phasing out AI systems, contingency planning for third party systems, assigned responsibility for disengaging or deactivating systems, and post deployment plans that include decommissioning, recovery, and change management.",
        "Those ideas are often treated as governance work for large enterprises. They are equally useful for a service business buying a seemingly simple subscription.",
        "A tool can become operationally important long before anyone calls it infrastructure. The proposal template lives there. The team remembers the prompts there. A connector writes to the CRM. A founder trusts a weekly summary. A reviewer learns to interpret one interface. The dependency grows one convenient step at a time.",
        "An exit plan does not mean expecting failure. It means preserving the option to change.",
      ],
    },
    {
      heading: "1. What work must survive the tool?",
      paragraphs: [
        "Name the recurring decision or output in business language. Do not begin with the feature. Begin with the work.",
        "For example, prepare a reviewable proposal summary after a discovery call. That purpose should remain stable even if the model, interface, or vendor changes.",
        "Write down the approved input, expected output, reviewer, destination, and stop condition. This becomes the workflow definition that the business owns.",
      ],
    },
    {
      heading: "2. Who owns continuity and exceptions?",
      paragraphs: [
        "The administrator who purchases licenses may not be the person who understands the work.",
        "Name an operating owner who can define a usable result, explain what happens when the result is wrong or unavailable, and decide whether the tool should continue.",
        "Continuity without an owner becomes a list of files that nobody knows how to use.",
      ],
    },
    {
      heading: "3. Which data and operating artifacts can be recovered?",
      paragraphs: [
        "Data export is only one part of portability.",
        "The team may also need approved templates, prompt logic, output schemas, mappings, source permissions, correction history, evaluation cases, user guidance, and decision records.",
        "OpenAI's Atlas transition guidance is a concrete reminder. Bookmarks, open tabs, and browser history may not transfer automatically. Useful material can exist in several forms, each with a different recovery path.",
        "Before purchase, list the artifacts the business must be able to recover and test the export route with real sample material.",
      ],
    },
    {
      heading: "4. Which actions can pause or move elsewhere?",
      paragraphs: [
        "Some tools only prepare drafts. Others create records, send messages, change access, run code, or trigger downstream automation. The replacement risk grows with the action scope.",
        "Document what the tool may change, which actions require approval, and how those actions are paused during migration. Keep a manual or alternate route for the few tasks that cannot stop.",
        "The fallback does not need to be elegant. It needs to be understood and safe.",
      ],
    },
    {
      heading: "5. What evidence earns renewal?",
      paragraphs: [
        "Renewal should not depend on memory, enthusiasm, or the number of people who logged in.",
        "GitHub's Copilot usage metrics documentation shows one vendor specific example of adoption, engagement, usage, and workflow reporting through dashboards, APIs, and exports.",
        "Those measures can show activity. The business must still define the outcome that matters.",
        "For a proposal summary workflow, useful evidence might include review time, correction rate, missing commercial terms, accepted outputs, and customer affecting exceptions. Choose the measures before the pilot begins.",
      ],
    },
    {
      heading: "6. What cost triggers intervention?",
      paragraphs: [
        "License price is only the visible layer.",
        "Usage credits, premium models, agent sessions, integration work, review time, support time, migration effort, and process interruption can change the total operating cost.",
        "GitHub's usage based billing documentation gives a product specific example of consumption and budget controls, including access effects when a user budget is exhausted.",
        "The transferable question is simple. What consumption or total cost should trigger a review, who receives the signal, and how does work continue if access pauses?",
      ],
    },
    {
      heading: "7. How will the business exit and restore service?",
      paragraphs: [
        "Write the exit before the rollout.",
        "Name the export steps, artifact owner, alternative process, connector shutdown sequence, access removal, record reconciliation, communication plan, and recovery test.",
        "Then schedule a removal drill before renewal. The drill can be small. Pause the tool for one controlled workflow, recover the required assets, route the task through the fallback, and confirm that the business can still complete the work safely.",
        "If that test fails, the dependency is already deeper than the adoption plan admits.",
      ],
    },
    {
      heading: "Worked example: proposal summary drafts",
      paragraphs: [
        "Consider a small advisory firm that uses an AI product to prepare internal proposal summaries after discovery calls.",
        "The vendor supplied layer may include the model, interface, prompt execution, and convenient integrations.",
        "The business owned layer should include the approved discovery note template, exact proposal summary structure, required fields, review rule, representative test cases, known failure examples, correction history, exception history, export routine, and manual fallback template.",
        "The pilot then has a clear renewal test. Compare the workflow with its prior state. Measure review time, correction rate, missed terms, accepted drafts, exceptions, usage cost, and operator confidence in the fallback.",
        "Before renewal, remove the tool from five fictional cases. Give the same approved input and output structure to the fallback process. Confirm that an advisor can complete the work, see what changed, and preserve the record.",
        "This does not prove that switching tools will be effortless. It proves that the business understands the dependency it is choosing.",
      ],
    },
    {
      heading: "What exact plan and data boundary are you buying?",
      paragraphs: [
        "Portability does not replace privacy, security, or access review.",
        "OpenAI's business data documentation describes default training treatment and certain retention or residency controls for qualifying offerings. That is useful product evidence. It is not a substitute for checking the exact plan, connected sources, administrator settings, region, retention configuration, contractual duties, and internal policy.",
        "The same discipline applies to every vendor. Ask where inputs, outputs, logs, memories, connectors, and exported files live. Ask who can access them. Ask what is deleted when the account closes and what remains in downstream systems.",
        "An exit plan that copies data into an unapproved location is not a continuity plan.",
      ],
    },
    {
      heading: "Opportunities",
      paragraphs: [
        "The team can test one workflow without surrendering the process definition. Renewal becomes an evidence decision rather than a habit. Vendor changes become manageable operating events rather than emergency rediscovery.",
        "Integration design becomes cleaner because actions, records, and owners are explicit. A business can also compare tools against the same workflow and evaluation cases.",
      ],
    },
    {
      heading: "Risks and limitations",
      paragraphs: [
        "A documented exit can still fail if exports are incomplete, formats are proprietary, access has already ended, or nobody has rehearsed the steps. The fallback can preserve continuity while producing lower quality or higher cost.",
        "Vendor documentation may change and may differ by plan, region, tenant, connector, and administrator configuration.",
        "Portability can create security and privacy risk if sensitive data, cookies, sessions, or credentials are copied without control.",
        "NIST is voluntary guidance. The reversible tool dock is an operating interpretation, not an official standard.",
        "The Atlas transition is one current example. It does not predict the future of another product.",
      ],
    },
    {
      heading: "Who should act now and who should wait",
      paragraphs: [
        "Act now if a tool already supports a recurring workflow, the team can name the business owned artifacts, and a controlled removal drill can be run without affecting customers.",
        "Test carefully if the product writes to shared systems, handles sensitive data, triggers external action, or contains operating knowledge that exists nowhere else.",
        "Wait before expanding if the team cannot export required material, cannot explain the fallback, has no continuity owner, or has not defined what evidence earns renewal.",
      ],
    },
    {
      heading: "A 30, 60, and 90 day operating plan",
      paragraphs: [
        "First 30 days: choose one workflow. Document the seven answers. Keep customer affecting actions under review. Create the business owned templates, output structure, test cases, evidence measures, cost boundary, export routine, and fallback.",
        "By 60 days: review real corrections, exceptions, usage, total operating cost, and workflow evidence. Test the export path with representative material. Remove unnecessary product specific dependencies from the workflow definition.",
        "By 90 days: run a controlled removal drill. Decide whether to renew, change scope, replace the tool, or exit. Expand only if the value is visible and the dependency remains understood.",
      ],
    },
  ],
  faqs: [
    ["Does every AI tool need a formal exit project?", "No. Match the effort to the consequence. A disposable personal experiment may need only a clear data boundary. A tool connected to customer records, shared knowledge, code, identity, or external actions needs stronger continuity planning."],
    ["Is data export enough?", "No. The team may recover files and still lose the workflow logic, output structure, permissions, evaluation cases, exception history, or owner knowledge needed to use them."],
    ["Does an exit plan mean the vendor is not trusted?", "No. It means the business retains the ability to respond to price, access, strategy, product, risk, or performance changes."],
    ["Should a free trial include a removal drill?", "For any tool likely to become operational, yes. A small drill reveals portability and ownership gaps while the dependency is still limited."],
    ["Can the replacement use a different model or vendor?", "Yes, if the business owned workflow definition and evaluation cases remain stable enough to compare the new route fairly."],
    ["What is the first continuity metric?", "Measure whether the team can complete one representative workflow safely after the tool is paused and the required artifacts are recovered."],
  ],
  sources: [
    ["OpenAI Atlas transition guidance", "https://help.openai.com/en/articles/20001371-evolving-atlas-into-chatgpt-for-browser-based-agentic-work", "Primary transition guidance for the scheduled end date, migration boundary, administrator actions, and sensitive session material."],
    ["NIST AI Risk Management Framework Core", "https://airc.nist.gov/airmf-resources/airmf/5-sec-core/", "Primary voluntary guidance for safe phase out, third party contingency, deactivation responsibility, decommissioning, recovery, and change management."],
    ["GitHub Copilot usage metrics", "https://docs.github.com/en/copilot/concepts/copilot-usage-metrics/copilot-metrics", "Primary product documentation for adoption, engagement, usage, workflow reporting, APIs, and exports."],
    ["GitHub usage based billing", "https://docs.github.com/en/copilot/concepts/billing/usage-based-billing-for-organizations-and-enterprises", "Primary product documentation for usage consumption, budget controls, and access effects."],
    ["OpenAI business data controls", "https://openai.com/business-data/", "Primary product documentation for default training treatment and selected retention or residency controls for qualifying offerings."],
  ],
  related: [["A new AI model is not a business case", "/insights/new-ai-model-business-case-workflow-evaluation"], ["Workflow memory and current authority", "/insights/rememberthemethodrecheckauthority"], ["Agentic workflow delivery", "/services/agentic-workflows"]],
});

register({
  path: "/insights/aireleasenoteworkflowchange",
  nav: "insights",
  type: "insight",
  publishedOn: "2026-08-10",
  publishedLabel: "10 August 2026",
  title: "AI Release Note Workflow Change Management | AiXCEL",
  description: "A practical method for turning AI release notes into owned decisions across workflow, scope, control, cost, and evidence.",
  eyebrow: "AI, Plain English · Post 020",
  publicLabel: "Post 020",
  h1: "A release note is not news. It is a change request.",
  deck: "Compare the workflow before and after. Read what moved across workflow, scope, control, cost, and evidence. Then give the change an owner.",
  answer: "Treat every material AI release as a proposed operating change. Compare the current routine with the new one, read five operating fields, and choose Monitor, Test, Configure, or Stop before production work changes.",
  aside: "The operating change table and four response method are Ahmad's proposed framework. They are not an official GitHub process, a formal standard, or a measured client result.",
  hero: "/assets/aireleasenoteworkflowchange.png",
  heroAlt: "A premium obsidian operating change table with two translucent workflow plans aligned before and after a release. Lime markers show moved workflow fields, while aubergine and rust controls remain visible.",
  takeaways: [
    "A product announcement matters when it changes the work, who can use it, what controls apply, what it costs, or what evidence becomes visible.",
    "Compare the workflow before and after the release instead of reacting to the product headline.",
    "Read every material release through five fields: Workflow, Scope, Control, Cost, and Evidence.",
    "Give the change one owner and one response: Monitor, Test, Configure, or Stop.",
    "Do not let a feature reach production until the team can name the affected routine, the test, the stop condition, and the evidence that will close the decision.",
  ],
  sections: [
    {
      heading: "The product headline is rarely the operating change",
      paragraphs: [
        "AI release feeds reward novelty. Operators need consequences.",
        "A new model name can dominate the announcement while a quieter line changes the actual work. Access may be off until an administrator changes policy. A review default may move across every repository. A new metric may change how a rollout is measured. A billing indicator may expose a cost that was previously difficult to see. A connection control may alter what an assistant can reach.",
        "That is why a release note should not be treated as news alone.",
        "It is a proposed change to an operating system.",
        "The team should compare the workflow before and after, decide whether the change is material, name the owner, and choose a response before a production routine moves.",
      ],
    },
    {
      heading: "Current GitHub releases show six different kinds of change",
      paragraphs: [
        "GitHub's Copilot changelog between 6 and 10 August gives a useful current example.",
        "One release added centrally managed MCP allow and deny settings. GitHub says malformed or unverifiable policy fails closed. The important line is not about a new model. It is about connection control and which tools an assistant may reach.",
        "Another release added recognized agent app activity to the Copilot usage metrics API. The important line is not that a new number exists. It is that an operator can separate activity by agent identifier, while also respecting a warning about how two interaction fields should be counted.",
        "GitHub also made Lite and Balanced code review effort levels generally available. A team can choose effort by review, an organization can set a default, and the review record shows which effort was used. That changes the delivery routine, the operating default, the potential cost, and the evidence available later.",
        "Kimi K3 entered GitHub Copilot through a gradual rollout. GitHub says Business and Enterprise access remains off until an administrator enables policy, and usage follows provider list pricing under usage based billing. The model name is visible. The operating decision concerns eligibility, approval, data treatment, and spend.",
        "The Copilot impact dashboard placed estimated AI credit cost, a payroll share model, and pull request output side by side. GitHub explicitly calls the figures directional. The operating consequence is not proven return. It is a new input into a renewal or rollout conversation that still needs business evidence.",
        "On 10 August, GitHub also documented conversation minimization, easier access to recent conversations, and token spend indicators by session and message. A small interface release can therefore change waiting behavior, continuity, and cost visibility.",
        "These releases do not prove better outcomes. They prove that a release stream can move several operating fields even when the product headline sounds simple.",
      ],
    },
    {
      heading: "Compare the workflow before and after",
      paragraphs: [
        "The practical test is a workflow comparison.",
        "Write the current routine in plain business language. Then apply the release and mark only what changes.",
        "Before: every pull request receives the same AI review effort unless a reviewer intervenes.",
        "After: the organization can set a default effort, a reviewer can choose a different effort for one change, and the record shows which effort was used.",
        "The release moved more than a feature setting.",
        "It moved the default, the exception path, the review record, and possibly the cost. Those changes need an owner.",
        "If the workflow comparison shows no material movement, the team can monitor the release. If it moves a field that affects customers, shared systems, access, spend, or evidence, the change deserves an owned decision.",
      ],
    },
    {
      heading: "1. Workflow",
      paragraphs: [
        "What does a person or agent now do differently?",
        "Look for a new action, a changed sequence, a new waiting state, a different review step, or a new exception path. Avoid vague language such as more powerful or easier to use. Name the routine that changed.",
      ],
    },
    {
      heading: "2. Scope",
      paragraphs: [
        "Which plan, account, role, region, repository, client, or user can use the change?",
        "Available does not mean enabled. A gradual rollout, administrator policy, preview flag, tenant setting, or plan limit can decide whether the release exists for the actual team.",
      ],
    },
    {
      heading: "3. Control",
      paragraphs: [
        "What setting, policy, default, permission, or stop condition governs the change?",
        "A control may be centrally managed, locally overridable, on by default, off by default, or blocked when policy cannot be verified. Those details can matter more than the feature itself.",
      ],
    },
    {
      heading: "4. Cost",
      paragraphs: [
        "What changes in credits, effort, seats, infrastructure, review time, or billing?",
        "The visible license price is not the whole operating cost. A new effort level, model provider, agent session, runner, or usage meter can change consumption and human review.",
      ],
    },
    {
      heading: "5. Evidence",
      paragraphs: [
        "What log, label, metric, export, review record, or exception will show what happened?",
        "Usage is not value, and output volume is not return. Evidence should connect the changed routine to the business outcome and risk that matter.",
      ],
    },
    {
      heading: "Choose one response",
      paragraphs: [
        "Monitor when the change is not available to the team, does not move a material operating field, or needs more evidence before local work changes. Record why it is being watched and when it will be reviewed again.",
        "Test when the release could improve a bounded routine but outcome, cost, access, or failure behavior remains uncertain. Define the representative cases, baseline, reviewer, stop condition, and evidence before the test begins.",
        "Configure when the release changes a policy, default, permission, budget, or reporting field that already affects an approved workflow. Record the previous state, new state, owner, scope, validation result, and rollback method.",
        "Stop when the change creates an unacceptable data, access, cost, reliability, or customer risk, or when the required control cannot be established.",
        "Stopping a rollout is a valid operating outcome. It is not a failure to adopt.",
      ],
    },
    {
      heading: "Worked example: AI code review in a service business",
      paragraphs: [
        "Consider a digital services company that uses Copilot code review across internal repositories and selected client projects.",
        "The release about review effort levels arrives.",
        "The team does not announce immediate rollout. It opens an operating change record.",
        "Workflow: The current routine uses one review behavior. The proposed routine applies Balanced effort to higher risk changes and Lite effort to low consequence changes.",
        "Scope: The pilot includes two internal repositories. Client repositories remain unchanged.",
        "Control: Engineering operations owns the organization default. Repository owners can request an exception. Human review and existing branch protection remain required.",
        "Cost: The team records AI credits, review duration, human review time, and any runner cost linked to the changed routine.",
        "Evidence: The team compares missed defects, false alarms, reviewer corrections, time to merge, exceptions, and effort labels across representative pull requests.",
        "Response: Test.",
        "The pilot runs for four weeks. It does not assume that Balanced is better. It asks whether the deeper setting earns its place on the selected work.",
        "At the end, the owner can Configure the default, continue to Monitor, or Stop the change. The release note has become a controlled decision instead of a feed item.",
      ],
    },
    {
      heading: "Opportunities",
      paragraphs: [
        "A release intake method reduces two forms of waste.",
        "The first is hype work. Teams stop creating meetings and experiments for product announcements that do not move a real routine.",
        "The second is silent change. Teams become less likely to miss a new policy default, access boundary, cost condition, or evidence field that affects existing work.",
        "The same record improves procurement, security review, delivery governance, renewal decisions, and vendor comparisons because each change is tied to a named workflow and owner.",
      ],
    },
    {
      heading: "Risks and limitations",
      paragraphs: [
        "Release notes are vendor documents. They can be incomplete, delayed, corrected, plan specific, region specific, or different from the behavior visible in a tenant.",
        "A five field read does not replace security, privacy, legal, procurement, accessibility, or technical review.",
        "GitHub's activity and dashboard fields are product evidence. They do not prove quality, customer value, financial return, or safe use.",
        "The operating change table and four response method are Ahmad's proposed framework. They are not an official GitHub process or a formal standard.",
        "A team can also create too much process. Match the record to the consequence. A personal interface improvement may need one short note. A change to shared access, customer data, production code, external actions, or material spend deserves stronger review.",
      ],
    },
    {
      heading: "Who should act now and who should wait",
      paragraphs: [
        "Act now if several AI tools already affect shared workflows and nobody owns release intake. Start with one vendor and one monthly review.",
        "Test now if a current release changes a production relevant default, permission, review setting, cost condition, or evidence field.",
        "Wait before rollout if the actual plan, tenant access, data boundary, cost, owner, stop condition, or evidence remains unclear.",
        "Stop the change if the team cannot establish the control required for the consequence.",
      ],
    },
    {
      heading: "A 30, 60, and 90 day operating plan",
      paragraphs: [
        "First 30 days: choose one AI vendor and one business critical workflow. Create a short release intake record with the five fields. Name an owner. Baseline the current routine. Classify every material release as Monitor, Test, Configure, or Stop.",
        "By 60 days: run one bounded change test. Compare representative cases before and after. Record corrections, exceptions, cost, access, review effort, and the business outcome that matters. Confirm that the visible settings match the documented settings.",
        "By 90 days: review the decisions. Close abandoned tests. Update the approved workflow and rollback path for configured changes. Remove release feed items that never became material. Keep a monthly change review for the tools that now affect shared work.",
      ],
    },
  ],
  faqs: [
    ["Does every release note need a meeting?", "No. Most items should be closed as Monitor or not material. A meeting is justified only when the change moves a consequential field and needs a decision from several owners."],
    ["Is a model announcement always material?", "No. The material question is whether the model changes access, policy, cost, quality, risk, or a real workflow for the team."],
    ["Can usage metrics prove return?", "No. They can show activity and adoption. Return requires a defined business outcome, cost boundary, comparison, and time window."],
    ["What is the minimum operating change record?", "Record the release, affected workflow, five field comparison, owner, chosen response, required test, stop condition, evidence, and next review date."],
    ["Who should own release intake?", "Use the person accountable for the affected workflow, supported by security, privacy, procurement, engineering, or finance when the consequence requires them. The software administrator alone may not understand the work."],
    ["What is the first useful metric?", "Measure the percentage of material releases that receive a named owner and a closed decision before production changes."],
  ],
  sources: [
    ["MCP allowlists in enterprise managed settings", "https://github.blog/changelog/2026-08-06-mcp-allowlists-in-enterprise-managed-settings/", "Primary release note for centrally managed MCP policy, allow and deny behavior, and fail closed handling."],
    ["Copilot usage metrics API adds agent app activity", "https://github.blog/changelog/2026-08-07-copilot-usage-metrics-api-adds-agent-app-activity/", "Primary release note for agent identifier activity and the stated interaction counting boundary."],
    ["Copilot code review effort levels are generally available", "https://github.blog/changelog/2026-08-07-copilot-code-review-effort-levels-are-generally-available/", "Primary release note for effort selection, organization defaults, review records, and the correctness limitation."],
    ["Kimi K3 is now available in GitHub Copilot", "https://github.blog/changelog/2026-08-06-kimi-k3-is-now-available-in-github-copilot/", "Primary release note for gradual access, administrator policy, and usage based provider pricing."],
    ["Copilot impact dashboard adds a return on investment section", "https://github.blog/changelog/2026-08-07-copilot-impact-dashboard-adds-a-return-on-investment-section/", "Primary release note for directional cost and output indicators and the stated interpretation boundary."],
    ["Copilot on web expands conversation controls", "https://github.blog/changelog/2026-08-10-copilot-on-web-expands-conversation-controls/", "Primary release note for minimized conversations, recent conversation access, and token spend visibility by session and message."],
  ],
  related: [["Claude Opus 5 model controls", "/insights/claude-opus-5-model-upgrade-workflow-controls"], ["Reversible AI tool adoption", "/insights/reversibleaitooladoption"], ["Agentic workflow delivery", "/services/agentic-workflows"]],
});

register({
  path: "/insights/aieo-aeo-geo-explained",
  nav: "insights",
  type: "insight",
  previewGated: true,
  ogImage: aiVisibilityOgImage,
  publishedOn: "2026-08-11",
  publishedLabel: "August 11, 2026",
  title: "AIEO, AEO & GEO Explained | AiXCEL",
  description: "A plain-English guide to AIEO, AEO, GEO, and the search foundations that genuinely improve how AI systems can understand a business.",
  eyebrow: "AI Search Visibility · Guide 01",
  publicLabel: "AI Search Field Guide",
  h1: "AIEO, AEO, and GEO: what is real, and what is relabelling?",
  deck: "AI search creates a new measurement surface, but it does not erase the fundamentals. The useful work begins by separating access, understanding, evidence, corroboration, and buyer action.",
  answer: "AIEO is AiXCEL's umbrella for AI-engine visibility. AEO focuses on answer-ready clarity. GEO focuses on the evidence and context generative engines may use. Both depend on strong technical search foundations and credible public information.",
  aside: "Use the terms to organize the work, not to imply a secret ranking method or guaranteed recommendation.",
  hero: "/assets/og-ai-search-visibility.png",
  heroAlt: "AiXCEL AI Search Visibility visual showing a buyer question moving through evidence and into a qualified business action.",
  takeaways: [
    "AIEO is a practical operating umbrella, not a replacement for SEO.",
    "Google documents no special AI-only schema or separate technical requirement for its AI search features.",
    "Crawl access, entity clarity, useful evidence, and corroboration are more defensible than prompt hacks.",
    "Visibility matters only when measurement continues through referral, enquiry, booking, and opportunity state.",
  ],
  sections: [
    { heading: "Start with one shared model", paragraphs: ["AiXCEL uses AIEO to describe the full operating system around AI-assisted discovery. AEO asks whether a page gives answer engines a clear, directly supported answer. GEO asks whether a business is represented with enough context and corroboration for a generative system to use it responsibly. SEO keeps the underlying pages accessible, useful, and understandable."], bullets: ["SEO: access, relevance, page quality, internal architecture, and search performance.", "AEO: direct answers, visible definitions, question coverage, and appropriate structured data.", "GEO: entity consistency, evidence, citations, source diversity, and prompt-level representation.", "AIEO: the baseline, implementation, monitoring, attribution, and operating cadence across all three."] },
    { heading: "What does not change", paragraphs: ["Google's published guidance says its AI search experiences use the same foundational requirements as normal Search and do not need special schema or an AI text file. OpenAI likewise gives publishers crawler controls and referral guidance, but no paid shortcut to top placement. The engines differ, yet the durable work remains legible pages, honest evidence, and public sources that agree about who the business is and what it does."] },
    { heading: "What does change", paragraphs: ["A blue-link position is no longer the only observable outcome. A business may be mentioned without a click, cited from a third-party source, omitted from a category comparison, or represented with an outdated claim. That creates a new monitoring job: maintain a dated prompt set, capture the answer and sources, classify the evidence, and connect any referral to the next business state."], bullets: ["Brand inclusion and accuracy by buyer question.", "Owned versus third-party citations.", "Unsupported, outdated, or conflicting claims.", "Referral sessions, qualified enquiries, bookings, and opportunities."] },
    { heading: "The responsible commercial promise", paragraphs: ["An AIEO provider can improve access, clarity, evidence, corroboration, measurement, and operating discipline. It cannot control an external model's answer, promise a recommendation, or translate an academic benchmark into a guaranteed client outcome. A credible engagement states that boundary before it recommends content or technical changes."] },
  ],
  faqs: [["Is GEO a replacement for SEO?", "No. GEO depends on many of the same access, relevance, quality, and authority foundations while adding prompt-level and citation-level observation."], ["Should every page have FAQ schema?", "No. Structured data should describe visible content and follow the search platform's documented eligibility rules."], ["Can a brand pay OpenAI for a top answer?", "OpenAI's publisher guidance does not describe a paid path to guaranteed top organic placement. Advertising and organic answer inclusion are separate systems."]],
  sources: [["Google Search Central: AI features and your website", "https://developers.google.com/search/docs/appearance/ai-features", "Official guidance on eligibility, SEO fundamentals, structured data, controls, and Search Console reporting."], ["OpenAI: Publishers and developers FAQ", "https://help.openai.com/en/articles/12627856-publishers-and-developers-faq", "Official crawler, referral, content control, and placement guidance."], ["GEO: Generative Engine Optimization", "https://arxiv.org/abs/2311.09735", "Original academic paper and benchmark; useful research context, not a production guarantee."]],
  related: [["AI Search Visibility service", "/services/ai-search-visibility"], ["Measure AI visibility", "/insights/measure-ai-search-visibility"], ["Request a baseline", "/services/ai-search-visibility#baseline"]],
});

register({
  path: "/insights/measure-ai-search-visibility",
  nav: "insights",
  type: "insight",
  previewGated: true,
  ogImage: aiVisibilityOgImage,
  publishedOn: "2026-08-11",
  publishedLabel: "August 11, 2026",
  title: "How to Measure AI Search Visibility | AiXCEL",
  description: "A practical AI search measurement framework covering dated prompts, citations, answer accuracy, referrals, qualified leads, and decision ownership.",
  eyebrow: "AI Search Visibility · Guide 02",
  publicLabel: "AI Search Field Guide",
  h1: "Measure AI visibility without inventing a universal score.",
  deck: "A prompt screenshot is evidence of one observed answer. A useful baseline preserves the question, date, engine, answer, citations, limitations, referral path, and the business state that followed.",
  answer: "Measure AI search visibility with a fixed, dated buyer-prompt set; record inclusion, accuracy, citation sources, and owned-page access; then connect identifiable referrals to enquiries, bookings, and opportunities.",
  aside: "The unit of evidence is an observed answer under stated conditions, not a permanent rank across every model, user, location, and date.",
  hero: "/assets/og-ai-search-visibility.png",
  heroAlt: "AiXCEL AI Search Visibility measurement visual in the Operational Noir brand system.",
  takeaways: ["Freeze the baseline prompt set before changing content.", "Preserve engine, date, location, answer, citations, and limitations.", "Separate owned-source visibility from third-party corroboration.", "Connect identifiable AI referrals to qualified commercial states."],
  sections: [
    { heading: "Use a measurement ladder", paragraphs: ["A single percentage hides too much. AiXCEL separates four layers so a team can see what changed and where the evidence stops."], bullets: ["Access: can relevant crawlers retrieve the intended public pages?", "Representation: is the business included and described accurately for the buyer question?", "Evidence: which owned and third-party sources are cited or reflected?", "Business movement: did an identifiable visit become an enquiry, booking, opportunity, or client?"] },
    { heading: "Build the prompt set from buyer decisions", paragraphs: ["Prompts should represent actual decisions, not vanity brand lookups. Include category discovery, problem diagnosis, comparison, local or regional fit where relevant, trust and proof, and implementation questions. Freeze the wording and record meaningful variants separately so the next run is comparable."], bullets: ["Who helps a service business become visible in AI search?", "What should I evaluate before hiring an AEO or GEO provider?", "Which sources support the provider's claims?", "How can I connect AI referrals to booked consultations?"] },
    { heading: "Keep the evidence receipt", paragraphs: ["For every observation, store the prompt, engine and surface, date and time, account or anonymous context when known, location when material, answer excerpt or structured notes, cited URLs, brand accuracy, competitors present, and reviewer. If personalization or reproducibility is uncertain, state it instead of smoothing it into a score."] },
    { heading: "Report the funnel honestly", paragraphs: ["ChatGPT referrals can be identified through referral information, and Google reports AI-feature traffic inside the normal Web search type. Those sources can support attribution, but not every mention creates a visit and not every visit is attributable. The dashboard should therefore show observed visibility, identifiable referrals, form submissions, qualified leads, bookings, proposals, and wins as separate stages."] },
  ],
  faqs: [["What is a good AI visibility score?", "There is no universal score that remains valid across engines, prompts, locations, accounts, and dates. Use a clearly defined internal baseline and preserve its conditions."], ["How often should prompts be rerun?", "Use a consistent cadence appropriate to the market and publishing rate, with additional runs after material site, entity, or engine changes."], ["Does a citation prove the source drove a sale?", "No. Citation, referral, enquiry, booking, and revenue are different evidence states and should be measured separately."]],
  sources: [["Google Search Central: AI features and your website", "https://developers.google.com/search/docs/appearance/ai-features", "Explains eligibility and that AI-feature traffic is included in Search Console's Web search reporting."], ["OpenAI: ChatGPT search", "https://help.openai.com/en/articles/9237897-chatgpt-search", "Official explanation of ChatGPT search answers and source links."], ["OpenAI: Publishers and developers FAQ", "https://help.openai.com/en/articles/12627856-publishers-and-developers-faq", "Official guidance on OAI-SearchBot controls and referral tracking."]],
  related: [["AIEO, AEO and GEO explained", "/insights/aieo-aeo-geo-explained"], ["Citation to qualified lead", "/insights/ai-citation-to-qualified-lead"], ["Request a baseline", "/services/ai-search-visibility#baseline"]],
});

register({
  path: "/insights/ai-citation-to-qualified-lead",
  nav: "insights",
  type: "insight",
  previewGated: true,
  ogImage: aiVisibilityOgImage,
  publishedOn: "2026-08-11",
  publishedLabel: "August 11, 2026",
  title: "From AI Citation to Qualified Lead | AiXCEL",
  description: "How to connect AI search citations and referrals to consented lead capture, booking events, CRM state, and evidence-backed revenue decisions.",
  eyebrow: "AI Search Visibility · Guide 03",
  publicLabel: "AI Search Field Guide",
  h1: "A citation is not a lead. Build the handoff between them.",
  deck: "AI visibility becomes commercially useful when the visitor reaches a clear offer, submits consented context, books the right calendar, and remains attributable through qualification and pipeline state.",
  answer: "Connect AI visibility to revenue with tagged landing routes, first-party lead capture, an explicit lifecycle, verified booking webhooks, and CRM handoff. Keep citations, visits, leads, and revenue as separate evidence states.",
  aside: "The goal is a recoverable operating trail, not a claim that every AI mention caused a conversion.",
  hero: "/assets/og-ai-search-visibility.png",
  heroAlt: "AiXCEL AI Search Visibility visual representing the route from an AI answer to a qualified buyer action.",
  takeaways: ["Give AI-referred visitors one offer and one primary next action.", "Keep the useful explanation public, then make the guide exchange clear, consented, and immediately fulfilled.", "Treat the booking webhook as authoritative and the browser event as advisory.", "Measure qualified movement, not form volume alone."],
  sections: [
    { heading: "Design the landing route around intent", paragraphs: ["A buyer arriving from an AI answer may already understand the category but still need evidence, boundaries, and a low-friction next step. The page should define AIEO, show the method, state what cannot be guaranteed, make sources inspectable, offer a public brief, and let a qualified visitor request a baseline or book a focused conversation."] },
    { heading: "Capture enough context to act", paragraphs: ["A short two-step form can collect identity, company, website, role, the question the business wants AI search to understand, timing, and consent. Hidden UTM and referrer fields preserve available source context. A honeypot, server-validated challenge, bounded inputs, rate limiting, and deduplication protect the operating queue without placing a secret in the browser."] },
    { heading: "Make booking state authoritative", paragraphs: ["A browser event can improve the thank-you experience, but it can be blocked or forged. The signed Cal.com webhook should create the authoritative booking, reschedule, and cancellation events. Matching the verified attendee email to the recent lead keeps calendar state connected to the same lifecycle without trusting query parameters as identity."] },
    { heading: "Operate the lead, not just the form", paragraphs: ["The owner dashboard should show new, contacted, qualified, booked, proposal, won, lost, and spam states; the next action and owner; source context; notification health; notes; and an append-only event history. Internal email is an alert, not the database. If email fails, the lead remains stored and the failure becomes visible for retry."] },
  ],
  faqs: [["Should the PDF be gated?", "It can be when the exchange is explicit and useful. Keep the core explanation on the public page, ask only for relevant qualification context, send the guide immediately, and never hide recurring marketing consent inside the request."], ["Can a browser booking event update the CRM?", "It can improve client-side UX, but a verified server webhook should own authoritative booking state."], ["What is the primary conversion metric?", "Qualified booked conversations and downstream opportunities are stronger than raw form fills. Report each stage separately."]],
  sources: [["Cal.com: UTM tracking", "https://cal.com/help/bookings/utm-tracking", "Official guidance on tracking standard UTM parameters with bookings."], ["Cal.com: Embed events", "https://cal.com/help/embedding/embed-events", "Official client event reference, including bookingSuccessfulV2 and linkFailed."], ["Cal.com: Webhooks", "https://cal.com/docs/developing/guides/automation/webhooks", "Official webhook and signature guidance for authoritative server processing."]],
  related: [["AI Search Visibility service", "/services/ai-search-visibility"], ["Measure AI visibility", "/insights/measure-ai-search-visibility"], ["AI lead systems", "/services/ai-lead-generation"]],
});

register({
  path: "/insights",
  nav: "insights",
  type: "insights-collection",
  title: "AI Operations Insights | Aixcel Solutions",
  description: "Evidence-backed field notes for operators building practical, controlled AI systems in sales, service, and operations.",
  eyebrow: "AI, Plain English",
  h1: "Field notes for operators building AI systems that can be owned.",
  deck: "Practical analysis of consequential AI developments: what changed, where it fits, what to test, and where a human owner must remain in the loop.",
  answer: "The value of AI is not a louder demo. It is a system with visible decisions, safe actions, clear exceptions, and evidence that it improves the work.",
  aside: "Published by Ahmad Bukhari. Aixcel applies the operating lessons to client systems.",
});

register({
  path: "/labs/agentic-systems",
  nav: "work",
  type: "labs",
  title: "Agentic Systems Lab | Aixcel Solutions",
  description: "Ten verified revenue, creator, evaluation, and agent infrastructure systems demonstrating typed APIs, human approval, observability, Postman, and Vercel deployment.",
  eyebrow: "Aixcel Labs · Agentic AI & LLM Systems Specialist",
  h1: "Ten working AI systems. One governed delivery standard.",
  deck: "Aixcel Labs turns revenue and creator operations architecture into inspectable public proof: typed contracts, deterministic gates, explicit agent state, evidence, approval, evaluation, replay, and deployment.",
  answer: "A production-minded agentic system is not a free-form conversation. It has typed inputs, bounded tools, durable state, measurable tests, observable failures, human authority, and a replay path when a provider is unavailable.",
  aside: "Ten public demos are live, behavior-tested, and backed by separate source repositories. They use synthetic or licensed public records, not client production data.",
});

const pageByPath = new Map(pages.map((page) => [page.path, page]));

function pageUrl(path) {
  return path === "/" ? `${origin}/` : `${origin}${path}`;
}

function breadcrumbFor(page) {
  const items = [["Home", "/"]];
  if (page.path.startsWith("/services/") ) items.push(["Services", "/services"]);
  if (page.path === "/case-studies" || page.path.startsWith("/case-studies/") || page.path === "/labs/agentic-systems" || page.path === "/process") items.push(["Work", "/work"]);
  if (page.path.startsWith("/case-studies/") ) items.push(["Case studies", "/case-studies"]);
  if (page.path.startsWith("/insights/") ) items.push(["Insights", "/insights"]);
  items.push([page.eyebrow.replace(/ ·.*/, ""), page.path]);
  return items;
}

function organizationGraph() {
  return [
    {
      "@type": ["Organization", "ProfessionalService"],
      "@id": `${origin}/#organization`,
      name: "Aixcel Solutions",
      alternateName: "Aixcel",
      url: `${origin}/`,
      logo: { "@type": "ImageObject", "@id": `${origin}/#logo`, url: `${origin}/assets/favicon.svg`, width: 512, height: 512 },
      image: { "@type": "ImageObject", "@id": `${origin}/#primaryimage`, url: ogImage, width: 1200, height: 630 },
      description: "Founder-led AI automation agency designing AI systems for growing businesses.",
      founder: { "@id": "https://ahmadbukhari.com/#person" },
      areaServed: "Worldwide",
      address: { "@type": "PostalAddress", addressLocality: "Islamabad", addressCountry: "PK" },
      email: "ahmadbukhari4245@gmail.com",
      contactPoint: { "@type": "ContactPoint", contactType: "sales and enquiries", email: "ahmadbukhari4245@gmail.com", areaServed: "Worldwide", availableLanguage: ["English"] },
      knowsAbout: ["AI Search Visibility", "AIEO", "AEO", "GEO", "AI automation", "AI systems", "AI lead generation", "appointment setting", "CRM automation", "voice AI", "agentic workflows", "business process automation"],
    },
    {
      "@type": "Person",
      "@id": "https://ahmadbukhari.com/#person",
      name: "Ahmad Bukhari",
      url: "https://ahmadbukhari.com/about",
      jobTitle: "Agentic AI & LLM Systems Specialist and Founder of Aixcel Solutions",
      worksFor: { "@id": `${origin}/#organization` },
      sameAs: ["https://www.linkedin.com/in/bukhariahmad", "https://github.com/syedahmad0786", "https://n8n.io/creators/ahmadbukhari/"],
    },
    {
      "@type": "Service",
      "@id": "https://manhaj.ahmadbukhari.com/#service",
      name: "MANHAJ",
      alternateName: ["Manhaj", "منهج"],
      url: "https://manhaj.ahmadbukhari.com/",
      description: "A private AI operating system configured around a business's operating model and owned by the client.",
      serviceType: "Private AI operating system architecture and implementation",
      provider: { "@id": `${origin}/#organization` },
      creator: { "@id": "https://ahmadbukhari.com/#person" },
      areaServed: "Worldwide",
      audience: {
        "@type": "BusinessAudience",
        audienceType: "Operator-led B2B service and education companies",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${origin}/#website`,
      url: `${origin}/`,
      name: "Aixcel Solutions",
      publisher: { "@id": `${origin}/#organization` },
      inLanguage: "en",
    },
  ];
}

function schemaFor(page) {
  const canonical = pageUrl(page.path);
  const crumbs = breadcrumbFor(page);
  const graph = organizationGraph();
  const webPageType = page.type === "about" ? "AboutPage" : page.type === "contact" ? "ContactPage" : page.type === "collection" ? "CollectionPage" : "WebPage";
  graph.push({
    "@type": webPageType,
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: page.title,
    description: page.description,
    isPartOf: { "@id": `${origin}/#website` },
    about: { "@id": `${origin}/#organization` },
    breadcrumb: { "@id": `${canonical}#breadcrumb` },
    inLanguage: "en",
    dateModified: published,
  });
  graph.push({
    "@type": "BreadcrumbList",
    "@id": `${canonical}#breadcrumb`,
    itemListElement: crumbs.map(([name, path], index) => ({ "@type": "ListItem", position: index + 1, name, item: pageUrl(path) })),
  });
  if (["service", "ai-visibility", "workspace"].includes(page.type)) {
    graph.push({
      "@type": "Service",
      "@id": `${canonical}#service`,
      name: page.eyebrow,
      serviceType: page.eyebrow,
      url: canonical,
      description: page.description,
      provider: { "@id": `${origin}/#organization` },
      areaServed: "Worldwide",
      audience: { "@type": "BusinessAudience", audienceType: "Growing service businesses and operations teams" },
    });
    if (Array.isArray(page.faqs) && page.faqs.length) graph.push({
      "@type": "FAQPage",
      "@id": `${canonical}#faq`,
      mainEntity: page.faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })),
    });
  }
  if (page.type === "case-study" || page.type === "insight") {
    graph.push({
      "@type": "Article",
      "@id": `${canonical}#article`,
      headline: page.h1,
      description: page.description,
      url: canonical,
      datePublished: page.publishedOn ?? published,
      dateModified: published,
      author: { "@id": "https://ahmadbukhari.com/#person" },
      publisher: { "@id": `${origin}/#organization` },
      about: ["AI automation", page.eyebrow],
      isAccessibleForFree: true,
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

function headFor(page) {
  const canonical = pageUrl(page.path);
  const type = page.type === "case-study" || page.type === "insight" ? "article" : "website";
  const socialImage = page.ogImage || ogImage;
  const robots = page.previewGated && !aiVisibilityRelease
    ? "noindex, nofollow, noarchive"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
  const articleMeta = type === "article" ? `\n  <meta property="article:published_time" content="${page.publishedOn ?? published}T00:00:00.000Z">\n  <meta property="article:modified_time" content="${published}T00:00:00.000Z">` : "";
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="${escapeHtml(page.description)}">
  <meta name="author" content="Ahmad Bukhari">
  <meta name="robots" content="${robots}">
  <meta name="google-site-verification" content="Xtikv06HL0T-ndPB43jrrQ1so9WY5rDkA2qoIvTqjr8">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="${type}">
  <meta property="og:locale" content="en_US">
  <meta property="og:site_name" content="Aixcel Solutions">
  <meta property="og:title" content="${escapeHtml(page.title)}">
  <meta property="og:description" content="${escapeHtml(page.description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${socialImage}">
  <meta property="og:image:secure_url" content="${socialImage}">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${page.ogImage ? "AiXCEL AI Search Visibility: AIEO, AEO and GEO" : "Aixcel Solutions: AI systems for growing businesses"}">
${articleMeta}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(page.title)}">
  <meta name="twitter:description" content="${escapeHtml(page.description)}">
  <meta name="twitter:image" content="${socialImage}">
  <meta name="twitter:image:alt" content="${page.ogImage ? "AiXCEL AI Search Visibility: AIEO, AEO and GEO" : "Aixcel Solutions: AI systems for growing businesses"}">
  <meta name="theme-color" content="#f4f0e8">
  <script>(()=>{try{const k="aixcel-color-theme",v=localStorage.getItem(k),m=matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.dataset.theme=v==="light"||v==="dark"?v:m?"dark":"light"}catch{document.documentElement.dataset.theme="light"}})();</script>
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/assets/ai-visibility.css">
  <style>${style}</style>
  <script defer src="/assets/theme.js"></script>
  <script type="application/ld+json">${JSON.stringify(schemaFor(page)).replaceAll("<", "\\u003c")}</script>
</head>`;
}

function themeToggle() {
  return `<button class="theme-toggle" id="theme-toggle" type="button" aria-label="Switch theme" aria-pressed="false"><span class="theme-icon theme-icon-sun" aria-hidden="true">☼</span><span class="theme-icon theme-icon-moon" aria-hidden="true">◐</span></button>`;
}

function header(active = "") {
  const link = (href, label, key) => `<a href="${href}"${active === key ? ' aria-current="page"' : ""}>${label}</a>`;
  const baseline = "/services/ai-search-visibility#free-aeo-audit";
  const nav = `${link("/services", "Services", "services")}${link("/work", "Work", "work")}${link("/insights", "Insights", "insights")}${link("/about", "About", "about")}${link("/contact", "Contact", "contact")}`;
  return `<header class="site-header"><a class="brand" href="/" aria-label="Aixcel Solutions home"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><b></b></span><span>AIXCEL</span></a><nav class="desktop-nav" aria-label="Primary navigation">${nav}</nav><div class="header-tools"><a class="header-utility" href="/systems-desk">Systems Desk</a>${themeToggle()}<a class="header-cta" href="${baseline}">Free AEO audit <span class="arrow-icon" aria-hidden="true"></span></a></div><details class="mobile-menu"><summary aria-label="Menu">Menu</summary><nav aria-label="Mobile navigation">${nav}<a class="mobile-utility" href="/systems-desk">Systems Desk · utility</a><a href="${baseline}">Free AEO audit <span class="arrow-icon" aria-hidden="true"></span></a></nav></details></header>`;
}

function footer() {
  const book = escapeHtml(bookingUrl("footer"));
  return `<footer class="site-footer"><div class="footer-brand"><a class="brand" href="/" aria-label="Aixcel Solutions home"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><b></b></span><span>AIXCEL</span></a><p>Founder led AI search visibility and automation systems for established service businesses.</p></div><div class="footer-links"><div><strong>Services</strong><a href="/services/ai-search-visibility">AI Search Visibility</a><a href="/solutions/ai-operations-workspace">Operations Workspace · pilot</a><a href="/services/ai-lead-generation">AI appointment setting</a><a href="/services/crm-automation">CRM automation</a><a href="/services/voice-ai">Voice AI</a><a href="/services/agentic-workflows">Agentic workflows</a></div><div><strong>Explore</strong><a href="/work">Work</a><a href="/insights">Insights</a><a href="/about">About</a><a href="/contact">Contact</a></div><div><strong>Utility &amp; connect</strong><a href="/systems-desk">Systems Desk</a><a href="${book}" target="_blank" rel="noopener noreferrer">Book a call</a><a href="mailto:ahmadbukhari4245@gmail.com">Email</a><a href="https://manhaj.ahmadbukhari.com" target="_blank" rel="noopener noreferrer">MANHAJ</a><a href="https://ahmadbukhari.com/about" target="_blank" rel="noopener noreferrer">Ahmad Bukhari</a></div></div><div class="footer-bottom"><span>© 2026 Aixcel Solutions</span><span>Founder led in Islamabad · serving clients worldwide · <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a></span></div></footer>`;
}

function breadcrumbs(page) {
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${breadcrumbFor(page).map(([name, path], index, all) => `<li>${index === all.length - 1 ? `<span aria-current="page">${escapeHtml(name)}</span>` : `<a href="${path}">${escapeHtml(name)}</a>`}</li>`).join("")}</ol></nav>`;
}

function serviceVisual(pageOrPath, compact = false) {
  const path = typeof pageOrPath === "string" ? pageOrPath : pageOrPath.path;
  const mode = compact ? " is-compact" : "";
  const visual = {
    "/services/ai-search-visibility": {
      key: "search",
      label: "AEO visibility, opportunity, and strategy agent flow",
      markup: `<div class="visual-topline"><span>Answer intelligence</span><i>observed</i></div><div class="search-visual-grid"><div class="search-surface"><span></span><span></span><span></span><span></span></div><div class="search-opportunities"><i></i><i></i><i></i></div><div class="search-agent"><b>AI</b><span></span><span></span></div></div><div class="visual-route"><i></i><i></i><i></i></div>`,
    },
    "/services/ai-lead-generation": {
      key: "lead",
      label: "Lead capture, qualification, and booking flow",
      markup: `<div class="visual-topline"><span>Qualified demand</span><i>routed</i></div><div class="lead-sources"><i>WEB</i><i>CALL</i><i>REF</i></div><div class="lead-qualifier"><span>Fit</span><span>Need</span><span>Timing</span></div><div class="lead-calendar"><b></b><b></b><b></b><b></b><strong>BOOKED</strong></div>`,
    },
    "/services/crm-automation": {
      key: "crm",
      label: "CRM lifecycle and next-action system",
      markup: `<div class="visual-topline"><span>Revenue state</span><i>synced</i></div><div class="crm-pipeline"><div><b></b><b></b></div><div><b></b><b></b><b></b></div><div><b></b></div><div><b></b><b></b></div></div><div class="crm-action"><span>Next owner</span><strong>Action ready →</strong></div>`,
    },
    "/services/voice-ai": {
      key: "voice",
      label: "Voice conversation, business action, and human handoff flow",
      markup: `<div class="visual-topline"><span>Call intelligence</span><i>live path</i></div><div class="voice-wave">${Array.from({ length: 13 }, (_, index) => `<i style="--wave:${(index % 5) + 1}"></i>`).join("")}</div><div class="voice-outcomes"><span>QUALIFY</span><span>SCHEDULE</span><span class="is-human">HUMAN</span></div><div class="voice-transcript"><i></i><i></i><i></i></div>`,
    },
    "/services/agentic-workflows": {
      key: "agentic",
      label: "Bounded agent workflow with approval and verified receipt",
      markup: `<div class="visual-topline"><span>Governed execution</span><i>bounded</i></div><div class="agentic-flow"><div class="agentic-input"><i></i><i></i><i></i></div><div class="agentic-decision"><b>AI</b></div><div class="agentic-approval"><span>APPROVE</span><strong>Human gate</strong></div><div class="agentic-receipt"><i>✓</i><span>Verified receipt</span></div></div>`,
    },
  }[path];
  if (!visual) return "";
  return `<div class="service-system-visual visual-${visual.key}${mode}" role="img" aria-label="${escapeHtml(visual.label)}">${visual.markup}</div>`;
}

function servicePageHero(page) {
  const book = escapeHtml(bookingUrl(`${page.path.slice(1).replaceAll("/", "_")}_hero`));
  return `${breadcrumbs(page)}<section class="page-hero service-page-hero"><div class="page-hero-copy"><p class="eyebrow">${escapeHtml(page.eyebrow)}</p><h1>${escapeHtml(page.h1)}</h1><p class="page-deck">${escapeHtml(page.deck)}</p><div class="hero-actions"><a class="button button-primary" href="${book}" target="_blank" rel="noopener noreferrer">Map this system <span class="arrow-icon" aria-hidden="true"></span></a><a class="button button-secondary" href="/services">Compare services</a></div><p class="cta-note">Focused diagnosis · clear operating boundary · no tool-first pitch</p></div><aside class="service-hero-art"><div class="service-art-stack">${visualPlate(page, "editorial-plate service-editorial-plate", "eager")}<div class="service-mini-console">${serviceVisual(page, true)}</div></div><p>${escapeHtml(page.aside)}</p></aside></section><section class="answer-band" aria-labelledby="direct-answer"><div class="answer-inner"><strong id="direct-answer">In plain English</strong><p>${escapeHtml(page.answer)}</p></div></section>`;
}

function pageHero(page) {
  const book = escapeHtml(bookingUrl(page.path.slice(1).replaceAll("/", "_") || "homepage"));
  const plate = plateKeyFor(page);
  const aside = plate
    ? `<aside class="page-hero-visual">${visualPlate(plate, "editorial-plate page-editorial-plate", "eager")}<div class="hero-aside"><strong>At a glance</strong><p>${escapeHtml(page.aside)}</p><a class="button button-primary" href="${book}" target="_blank" rel="noopener noreferrer">Book a free systems audit <span class="arrow-icon" aria-hidden="true"></span></a></div></aside>`
    : `<aside class="hero-aside"><strong>At a glance</strong><p>${escapeHtml(page.aside)}</p><a class="button button-primary" href="${book}" target="_blank" rel="noopener noreferrer">Book a free systems audit <span class="arrow-icon" aria-hidden="true"></span></a></aside>`;
  return `${breadcrumbs(page)}<section class="page-hero"><div class="page-hero-copy"><p class="eyebrow">${escapeHtml(page.eyebrow)}</p><h1>${escapeHtml(page.h1)}</h1><p class="page-deck">${escapeHtml(page.deck)}</p></div>${aside}</section><section class="answer-band" aria-labelledby="direct-answer"><div class="answer-inner"><strong id="direct-answer">Direct answer</strong><p>${escapeHtml(page.answer)}</p></div></section>`;
}

function cards(items) {
  return `<div class="card-grid">${items.map(([number, title, text, href]) => `<article class="content-card"><span>${escapeHtml(number)}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p>${href ? `<a href="${href}">Explore this service →</a>` : ""}</article>`).join("")}</div>`;
}

function faq(items) {
  return `<div class="faq-list">${items.map(([question, answer], index) => `<details${index === 0 ? " open" : ""}><summary><span>${String(index + 1).padStart(2, "0")}</span>${escapeHtml(question)}<i aria-hidden="true">+</i></summary><p>${escapeHtml(answer)}</p></details>`).join("")}</div>`;
}

function cta(page) {
  const book = escapeHtml(bookingUrl(`${page.path.slice(1).replaceAll("/", "_") || "homepage"}_cta`));
  return `<section class="cta-band"><div class="cta-grid"><h2>Bring us the constraint. Leave with a clearer next move.</h2><div class="cta-copy"><p>In 25 focused minutes, we will map where work or revenue is getting stuck, test whether AI is the right intervention, and identify the highest leverage first step.</p><a class="button" href="${book}" target="_blank" rel="noopener noreferrer">Book a free systems audit <span class="arrow-icon" aria-hidden="true"></span></a></div></div></section>`;
}

function related(items) {
  return `<section class="content-section"><div class="section-intro"><h2>Continue your evaluation.</h2><p>Compare adjacent systems, inspect evidence, or see how Aixcel delivers the work.</p></div><div class="related-links">${items.map(([label, href]) => `<a href="${href}"${href.startsWith("http") ? ' target="_blank" rel="noopener noreferrer"' : ""}>${escapeHtml(label)} →</a>`).join("")}</div></section>`;
}

function insightBody(page) {
  const takeaways = `<section class="article-takeaways"><h2>Key takeaways</h2><ul>${page.takeaways.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>`;
  const sections = page.sections.map((section) => `<section><h2>${escapeHtml(section.heading)}</h2>${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}${section.bullets ? `<ul>${section.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}</section>`).join("");
  const sources = `<aside class="article-sources" aria-label="Primary sources"><h2>Primary sources and notes</h2><ol>${page.sources.map(([label, href, note]) => `<li><a href="${href}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)} ↗</a><small>${escapeHtml(note)}</small></li>`).join("")}</ol></aside>`;
  return `${pageHero(page)}
  <figure class="article-visual"><img src="${page.hero}" alt="${escapeHtml(page.heroAlt)}" width="1660" height="948"><div class="field-note-mark"><img src="/assets/ahmad-ab-axis.svg" alt="">Ahmad Bukhari · ${escapeHtml(page.publicLabel ?? "Field Series")}</div><figcaption>${escapeHtml(page.heroAlt)}</figcaption></figure>
  <p class="article-byline">By <a href="https://www.linkedin.com/in/bukhariahmad/" target="_blank" rel="noopener noreferrer">Ahmad Bukhari</a> · Founder, Aixcel Solutions · Published ${page.publishedLabel ?? page.publishedOn ?? published}</p>
  <section class="content-section"><div class="article-layout"><article class="article-prose">${takeaways}${sections}<section class="detail-faq"><div class="section-intro"><h2>Questions decision makers ask.</h2><p>Clear answers before a platform choice becomes an operational commitment.</p></div>${faq(page.faqs)}</section></article>${sources}</div></section>
  ${related(page.related)}${cta(page)}`;
}

function insightsBody(page) {
  const insights = pages.filter((item) => item.type === "insight");
  const cardsMarkup = insights.map((item) => `<article class="content-card"><span>${escapeHtml(item.eyebrow)}</span><h3>${escapeHtml(item.h1)}</h3><p>${escapeHtml(item.description)}</p><a href="${item.path}">Read the field note →</a></article>`).join("");
  return `${pageHero(page)}<section class="content-section"><div class="section-intro"><h2>Consequential developments, translated into operational decisions.</h2><p>Every note separates primary-source facts from practical inference, flags availability and benchmark limits, and keeps risk, ownership, and next actions visible.</p></div><div class="card-grid">${cardsMarkup}</div></section>${cta(page)}`;
}

function agenticSystemsBody(page) {
  const systems = agenticSystems.map(([number, title, text, proof, href, repo, art, caseStudy]) => {
    const screenKey = labProductProofs.get(art);
    const media = screenKey
      ? `<a class="system-card-proof" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escapeHtml(title)} live">${productProofThumbnail(screenKey)}</a>`
      : `<img class="system-card-art" src="/assets/linkedin/${art}.png" alt="${escapeHtml(title)} project visual" width="1080" height="1350" loading="lazy" decoding="async">`;
    return `<article class="content-card">${media}<span>${number} · Verified public demo</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p><p><strong>Measured proof:</strong> ${escapeHtml(proof)}</p><a href="${href}" target="_blank" rel="noopener noreferrer">Open live system →</a>${caseStudy ? `<br><a href="${caseStudy}">Read technical brief →</a>` : ""}${repo ? `<br><a href="${repo}" target="_blank" rel="noopener noreferrer">Inspect repository →</a>` : `<p><strong>Source:</strong> Private implementation repository</p>`}</article>`;
  }).join("");
  return `${pageHero(page)}
  <section class="content-section"><div class="section-intro"><h2>Public proof, not a slide-only claim.</h2><p>Each system has a separate implementation repository, live deployment, typed API contract, Postman collection, evaluation fixtures, architecture diagrams, and a replay path. Private repositories are labelled rather than exposed.</p></div><div class="card-grid">${systems}</div></section>
  <section class="content-section dark-section"><div class="section-intro"><h2>The stack matches each control boundary.</h2><p>Graph orchestration is used where state and branching matter. Deterministic code owns scoring, evidence rules, limits, and safety gates. Human authority remains visible.</p></div>${cards([["01","Runtime and contracts","Python 3.12, FastAPI, Pydantic v2, REST, generated OpenAPI, and LangGraph for explicit state, branching, interruption, and resumption."],["02","State and decision systems","PostgreSQL, SQLAlchemy, Alembic, signed receipts, evidence hashes, idempotency, replay, access policy, and explicit approval states."],["03","Verification and operations","Pytest, Postman, Playwright, GitHub Actions, Docker, Vercel, OpenTelemetry, Prometheus, structured logs, trace IDs, and black-box evaluation."]])}</section>
  <section class="content-section"><div class="section-intro"><h2>Production-shaped proof with honest boundaries.</h2><p>The live portfolio uses synthetic or licensed public records and performs no client-system mutation. It demonstrates architecture and behavior, not client production acceptance.</p></div><div class="checklist"><article><h3 class="yes">Controls change outcomes</h3><p>Objectives alter creator ranking, source freshness and cash evidence alter revenue risk, language and tone alter reviewed copy, faults alter evaluation scores, and content inputs alter forecast ranges.</p></article><article><h3 class="yes">Every run is inspectable</h3><p>Responses expose typed state, traces, evidence, assumptions, limits, approval state, latency, usage, and a request trace ID.</p></article><article><h3 class="no">No invented production claim</h3><p>Green CI, a live URL, or a score of 100 proves the tested portfolio artifact only. Real integration still needs private data review, staging UAT, named owners, rollback, and cost approval.</p></article><article><h3 class="no">No framework theatre</h3><p>LangChain, CrewAI, MCP, a vector database, and Kubernetes remain outside a project unless the real data flow needs them and their operation can be demonstrated.</p></article></div></section>
  ${related([["Return to the Work hub","/work"],["Aixcel delivery process","/process"],["Discuss a bounded pilot","/contact"]])}${cta(page)}`;
}

function aiVisibilityEvidenceMarkup() {
  if (!aiVisibilityRelease) {
    return `<div class="evidence-state"><strong>Audit evidence gate · private preview</strong><h3>Claims are waiting for Ahmad's audit reports.</h3><p>The page structure, method, capture system, and educational content are ready. No performance claim will be published until its report, page, period, limitation, and public approval are recorded.</p></div><div class="evidence-rules"><div><span>Current state</span><strong>Preview content only · no performance claim</strong></div><div><span>Required proof</span><strong>Named report, dated observation, source page, and limitation</strong></div><div><span>Release authority</span><strong>Ahmad Bukhari marks each claim public-approved</strong></div><div><span>Build control</span><strong>Public release fails closed if evidence is missing</strong></div></div>`;
  }
  if (aiVisibilityReleaseMode === "public-no-performance-claims") {
    return `<div class="evidence-state"><strong>Public service release · evidence gate active</strong><h3>No client performance finding is published yet.</h3><p>The service, method, five-page guide, and contact paths are live. Audit-backed findings will be added only after their exact report, page, period, limitation, and public approval are recorded.</p></div><div class="evidence-rules"><div><span>Current state</span><strong>Service live · performance claim set empty</strong></div><div><span>Required proof</span><strong>Named report, dated observation, source page, and limitation</strong></div><div><span>Release authority</span><strong>Ahmad Bukhari marks each claim public-approved</strong></div><div><span>Build control</span><strong>Approved release fails closed if evidence is missing</strong></div></div>`;
  }
  return `<div class="evidence-state"><strong>Approved audit evidence</strong><h3>Every displayed finding retains its source and limitation.</h3><p>The findings below were approved for public use. They describe the stated audit period and are not guarantees of future search, citation, traffic, or revenue performance.</p></div><div class="evidence-rules">${aiVisibilityEvidence.claims.map((claim) => `<div><span>${escapeHtml(claim.period || "Approved evidence")}</span><strong>${escapeHtml(claim.claim)}</strong><a href="${escapeHtml(claim.source)}" target="_blank" rel="noopener noreferrer">Inspect source →</a>${claim.limitation ? `<p>${escapeHtml(claim.limitation)}</p>` : ""}</div>`).join("")}</div>`;
}

function aiVisibilityLegacyBody(page) {
  const book = escapeHtml(aiVisibilityBookingUrl("ai_visibility_page"));
  return `<div class="ai-visibility-page">
  <section class="ai-service-hero">${breadcrumbs(page)}<div class="ai-hero-grid"><div class="ai-hero-copy"><span class="ai-service-lockup">AiXCEL · AIEO / AEO / GEO</span><h1>Become easier to <em>find, understand, cite, and choose</em> in AI search.</h1><p>AiXCEL builds the technical, entity, evidence, content, corroboration, and attribution system that helps an established service business show up more clearly when buyers use AI-assisted search.</p><div class="hero-actions"><a class="button button-primary" href="#baseline">Request your visibility baseline <span class="arrow-icon" aria-hidden="true"></span></a><a class="button button-secondary" href="/guides/ai-search-visibility-brief.pdf" data-ai-visibility-pdf>Read the five-page brief <span aria-hidden="true">↓</span></a></div><p class="cta-note">Evidence first · no ranking guarantees · qualified lead measurement</p></div><div class="query-map" aria-label="AI Search Visibility path from a buyer question to a qualified action"><div class="query-map-label"><span>BUYER QUESTION</span><span>VISIBLE EVIDENCE</span></div><div class="query-path"><div class="query-node"><span>01 · retrieve</span><strong>Can the engine reach the right page?</strong></div><div class="query-node"><span>02 · understand</span><strong>Is the entity and offer unambiguous?</strong></div><div class="query-node"><span>03 · support</span><strong>Do owned and independent sources agree?</strong></div><div class="query-node"><span>04 · act</span><strong>Can the buyer take one attributable next step?</strong></div></div><p class="query-map-note">A citation is an observed evidence state. A qualified lead is a later business state. AiXCEL keeps both visible.</p></div></div></section>
  <section class="content-section"><div class="section-intro"><h2>One operating system. Three useful lenses.</h2><p>The labels organize the work; they do not create a secret shortcut. AI search still depends on accessible pages, useful information, credible evidence, and public sources that agree.</p></div><div class="ai-definition-grid"><article><strong>AIEO</strong><h3>AI Engine Optimization</h3><p>AiXCEL's umbrella for the full visibility system: baseline, technical access, entity clarity, content, corroboration, monitoring, attribution, and operating cadence.</p></article><article><strong>AEO</strong><h3>Answer Engine Optimization</h3><p>Makes important questions easier to answer accurately through direct visible explanations, useful structure, standard schema where appropriate, and source-backed detail.</p></article><article><strong>GEO</strong><h3>Generative Engine Optimization</h3><p>Improves the context, evidence, entity consistency, and independent corroboration generative systems may use when constructing a response.</p></article></div></section>
  <section class="content-section dark-section"><div class="section-intro"><h2>From visibility guesswork to an evidence loop.</h2><p>The engagement starts with a frozen buyer-prompt baseline and ends with a repeatable measurement and improvement cadence.</p></div><div class="visibility-loop"><article><span>01 · BASELINE</span><h3>Observe the current answer surface.</h3><p>Record prompts, engine, date, inclusion, accuracy, citations, competitors, owned-page access, and known limitations.</p></article><article><span>02 · FOUNDATION</span><h3>Repair access and entity clarity.</h3><p>Resolve crawl, indexability, internal architecture, canonical, content, schema, identity, and evidence gaps that can be verified.</p></article><article><span>03 · CORROBORATE</span><h3>Publish evidence worth using.</h3><p>Create answer-ready pages and strengthen legitimate third-party sources without manufactured reviews, fake mentions, or platform spam.</p></article><article><span>04 · ATTRIBUTE</span><h3>Connect discovery to the business.</h3><p>Track available referrals, consented leads, bookings, qualification, proposals, and wins as separate states.</p></article></div></section>
  <section class="content-section"><div class="section-intro"><h2>Start narrow. Expand after the evidence moves.</h2><p>No invented price table and no speculative transformation programme. The offer follows the smallest useful commercial sequence.</p></div><div class="offer-ladder"><article class="offer-card is-primary"><span>01 · Entry point</span><h3>AI Visibility Baseline</h3><p>A dated, evidence-preserving view of how your business is accessible and represented across a fixed set of buyer questions.</p><ul><li>Buyer-prompt and competitor set</li><li>Citation and answer review</li><li>Technical and entity checks</li><li>Attribution readiness</li><li>Prioritized next move</li></ul><a class="text-link" href="#baseline">Request the baseline →</a></article><article class="offer-card"><span>02 · Bounded implementation</span><h3>Visibility Foundation</h3><p>One controlled implementation slice that resolves the highest-value access, clarity, evidence, or conversion gap found in the baseline.</p><ul><li>Technical and page architecture</li><li>Entity and offer consistency</li><li>Answer-ready evidence content</li><li>Standard structured data</li><li>Lead and booking instrumentation</li></ul><a class="text-link" href="#process">See the method →</a></article><article class="offer-card"><span>03 · Ongoing operation</span><h3>Monitoring & Content Operations</h3><p>A managed cadence for prompt observations, source changes, evidence-led publishing, attribution, and human-reviewed next actions.</p><ul><li>Scheduled prompt runs</li><li>Citation and accuracy changes</li><li>Content opportunity backlog</li><li>Referral and lead movement</li><li>Monthly evidence review</li></ul><a class="text-link" href="#sources">Inspect the source policy →</a></article></div></section>
  <section class="content-section" id="process"><div class="section-intro"><h2>What the foundation actually covers.</h2><p>Google documents no special AI-only schema requirement. OpenAI provides crawler and referral controls, not guaranteed placement. The useful work therefore stays inspectable.</p></div>${cards([["01","Technical access","Robots, crawler controls, canonicals, indexability, rendering, internal links, sitemaps, performance, and the pages intended to represent the offer."],["02","Entity and offer clarity","Consistent company, founder, service, audience, location, expertise, and relationship signals across owned public surfaces."],["03","Answer-ready content","Direct definitions, buyer questions, visible evidence, source notes, limitations, and standard structured data that matches the page."],["04","Off-site corroboration","Legitimate profiles, publications, directories, references, and expert contributions that independently support accurate claims."],["05","Prompt and citation monitoring","A fixed prompt set, dated observations, cited sources, answer accuracy, competitor presence, and explicit reproducibility limits."],["06","Lead attribution and operations","First-party form context, UTM and referrer capture, calendar events, lifecycle state, internal alerts, and a human-owned next action."]])}</section>
  <section class="content-section"><div class="section-intro"><h2>Evidence before claims.</h2><p>The public page will show audit-backed findings only after their exact source and interpretation boundary are approved.</p></div><div class="evidence-gate">${aiVisibilityEvidenceMarkup()}</div></section>
  <section class="content-section"><div class="section-intro"><h2>Know when to proceed—and when to pause.</h2><p>AI visibility cannot compensate for an unclear offer, missing proof, or a team that cannot handle qualified demand.</p></div><div class="checklist"><article><h3 class="yes">Established expertise</h3><p>You can name the buyer, problem, service, delivery boundary, and evidence that responsibly supports your expertise.</p></article><article><h3 class="yes">Commercial ownership</h3><p>Someone owns enquiries, qualification, calendar capacity, follow-up, and the CRM or pipeline state after a lead arrives.</p></article><article><h3 class="no">Pause for offer clarity</h3><p>The business still changes its target audience, promise, service definition, or proof every week.</p></article><article><h3 class="no">Reject manufactured authority</h3><p>The desired tactic depends on fake reviews, invented citations, copied expert content, mass-spun pages, or a guaranteed recommendation claim.</p></article></div></section>
  <section class="content-section baseline-section" id="baseline"><div class="baseline-grid"><div class="baseline-copy"><p class="eyebrow">AI Visibility Baseline</p><h2>Give us the buyer question you need your market to understand.</h2><p>We will review the request, the public website, the likely answer surface, and whether there is enough evidence for a useful baseline. This is a fit review, not an automatic audit promise.</p><div class="baseline-points"><div><span>1</span><p>Public guide stays ungated and available to inspect.</p></div><div><span>2</span><p>Your form request is stored before any email alert is attempted.</p></div><div><span>3</span><p>Ahmad reviews fit and owns the next human response.</p></div><div><span>4</span><p>No recurring marketing is added without separate consent.</p></div></div></div><div><form class="baseline-form" id="ai-visibility-form" novalidate data-current-step="1"><div class="baseline-progress"><span>Two focused steps</span></div><fieldset data-step="1"><h3 id="baseline-step-one" tabindex="-1">Your business and role</h3><div class="form-grid"><div class="field"><label for="baseline-name">Your name</label><input id="baseline-name" name="name" autocomplete="name" maxlength="120" required></div><div class="field"><label for="baseline-email">Work email</label><input id="baseline-email" name="email" type="email" autocomplete="email" maxlength="320" required></div><div class="field"><label for="baseline-company">Company</label><input id="baseline-company" name="company" autocomplete="organization" maxlength="160" required></div><div class="field"><label for="baseline-website">Website</label><input id="baseline-website" name="website" type="url" inputmode="url" autocomplete="url" placeholder="https://example.com" maxlength="2048" required></div><div class="field field-wide"><label for="baseline-role">Your role</label><input id="baseline-role" name="role" autocomplete="organization-title" maxlength="120" required><p class="field-help">Founder, marketing lead, revenue leader, operations lead, or the closest match.</p></div><div class="honeypot" aria-hidden="true"><label for="baseline-fax">Company fax</label><input id="baseline-fax" name="companyFax" tabindex="-1" autocomplete="off"></div></div><div class="form-actions"><button class="button button-primary" type="button" data-next-step>Continue <span aria-hidden="true">→</span></button></div></fieldset><fieldset data-step="2" hidden><h3 id="baseline-step-two" tabindex="-1">The question and timing</h3><div class="form-grid"><div class="field field-wide"><label for="baseline-goal">What should AI search understand or recommend you for?</label><textarea id="baseline-goal" name="aiGoal" maxlength="1500" required placeholder="Example: We want operations leaders at established clinics to understand when our managed revenue-cycle service is a fit, and what proof supports it."></textarea></div><div class="field field-wide"><label for="baseline-timing">When do you need a useful baseline?</label><select id="baseline-timing" name="timing" required><option value="">Choose one</option><option value="now">Now / within 30 days</option><option value="30-60-days">Within 30-60 days</option><option value="later">Later this quarter</option><option value="exploring">Exploring the category</option></select></div></div><label class="consent-field"><input name="consent" value="yes" type="checkbox" required><span>I agree that AiXCEL may use this information to review and respond to my request under the <a href="/privacy" target="_blank">privacy notice</a>. This does not subscribe me to recurring marketing.</span></label><div id="ai-visibility-turnstile" aria-label="Security verification"></div><div class="form-actions"><button class="button button-secondary" type="button" data-previous-step>Back</button><button class="button button-primary" type="submit">Request the baseline <span aria-hidden="true">→</span></button></div></fieldset><p class="form-status" id="ai-visibility-form-status" aria-live="polite"></p></form><div class="baseline-result" id="ai-visibility-connection-fallback" hidden tabindex="-1"><span>Direct contact path</span><h3>Send the request through a working channel.</h3><p>The monitored form is not accepting submissions yet. Book the mapping session or email your company, website, role, and the buyer question you want AI search to understand.</p><div class="hero-actions"><a class="button button-primary" data-booking-fallback href="${book}" target="_blank" rel="noopener noreferrer">Book the session</a><a class="button button-secondary" href="mailto:ahmadbukhari4245@gmail.com?subject=AI%20Visibility%20Baseline%20request">Email the request</a></div></div><div class="baseline-result" id="ai-visibility-result" hidden tabindex="-1"><span>Request stored</span><h3>Your baseline request is in the Lead Desk.</h3><p>Ahmad will review the fit and public context. You can read the brief now or choose a time for the focused mapping session.</p><div class="hero-actions"><a class="button button-primary" id="ai-visibility-result-pdf" href="/guides/ai-search-visibility-brief.pdf">Read the brief</a><a class="button button-secondary" id="ai-visibility-result-booking" href="${book}" target="_blank" rel="noopener noreferrer">Book the session</a></div></div></div></div></section>
  <section class="content-section"><div class="section-intro"><h2>Choose a time without leaving the evidence path.</h2><p>The embedded calendar is the convenience layer. The signed booking webhook is the authoritative record used by the Lead Desk.</p></div><div class="calendar-shell"><div id="ai-visibility-calendar" aria-label="Book an AiXCEL AI Visibility mapping session"></div><div class="calendar-fallback"><p id="ai-visibility-calendar-status" aria-live="polite">Loading secure Cal.com availability…</p><a class="text-link" data-booking-fallback href="${book}" target="_blank" rel="noopener noreferrer">Open the calendar directly →</a></div></div></section>
  <section class="content-section dark-section"><div class="section-intro"><h2>The brief is public. The recommendation is earned.</h2><p>Use the five-page guide to evaluate the category before sharing contact information. AiXCEL will recommend implementation only when the baseline supports it.</p></div><div class="related-links"><a href="/guides/ai-search-visibility-brief.pdf" data-ai-visibility-pdf>Download the AI Search Visibility Brief →</a><a href="/insights/aieo-aeo-geo-explained">Read AIEO, AEO and GEO explained →</a><a href="/insights/measure-ai-search-visibility">Inspect the measurement framework →</a></div></section>
  <section class="content-section" id="sources"><div class="section-intro"><h2>Primary sources behind the method.</h2><p>These sources support the factual platform guidance. AiXCEL's service design and commercial recommendations are clearly separated from those source claims.</p></div><ul class="source-list"><li><a href="https://developers.google.com/search/docs/appearance/ai-features" target="_blank" rel="noopener noreferrer">Google Search Central: AI features and your website ↗</a><p>Google's official guidance on eligibility, SEO foundations, crawl controls, structured data, and Search Console reporting.</p></li><li><a href="https://help.openai.com/en/articles/12627856-publishers-and-developers-faq" target="_blank" rel="noopener noreferrer">OpenAI: Publishers and developers FAQ ↗</a><p>Official guidance on OAI-SearchBot, content controls, referral information, and placement boundaries.</p></li><li><a href="https://help.openai.com/en/articles/9237897-chatgpt-search" target="_blank" rel="noopener noreferrer">OpenAI: ChatGPT search ↗</a><p>Official description of web search answers and linked sources.</p></li><li><a href="https://arxiv.org/abs/2311.09735" target="_blank" rel="noopener noreferrer">GEO: Generative Engine Optimization ↗</a><p>The original academic paper. Its benchmark is research context, not a client-production performance guarantee.</p></li></ul></section>
  <section class="content-section detail-faq"><div class="section-intro"><h2>Questions responsible buyers ask.</h2><p>Clear boundaries before content, tooling, or monitoring work is proposed.</p></div>${faq(page.faqs)}</section>
  ${related(page.related)}</div>`;
}

function aiVisibilityBodyV2(page) {
  const book = escapeHtml(aiVisibilityBookingUrl("free_aeo_audit"));
  return `<div class="ai-visibility-page">
  <section class="ai-service-hero">${breadcrumbs(page)}<div class="ai-hero-grid"><div class="ai-hero-copy"><span class="ai-service-lockup">AEO services · AI visibility</span><h1>See where your business <em>shows up in AI answers.</em></h1><p>When buyers ask ChatGPT, Google AI, Perplexity, Gemini, or Claude for help, do they find you—or a competitor? AiXCEL shows you where you stand and what to improve.</p><div class="hero-actions"><a class="button button-primary" href="#free-aeo-audit">Get your free AEO audit <span class="arrow-icon" aria-hidden="true"></span></a><a class="button button-secondary" href="#what-you-get">See what the audit covers <span aria-hidden="true">↓</span></a></div><p class="cta-note">Free · no credit card · human reviewed · no ranking promises</p></div><figure class="answer-visibility-visual"><img src="/assets/aeo-answer-visibility-map.jpg" width="1672" height="941" alt="" aria-hidden="true"><div class="visibility-snapshot"><div class="snapshot-heading"><span>YOUR AEO STARTING POINT</span><strong>One clear view of AI visibility</strong></div><div class="visibility-signal-grid" aria-label="The free audit reviews four visibility signals"><span>Mentions</span><span>Citations</span><span>Competitors</span><span>Site gaps</span></div></div><form class="quick-audit-form" id="aeo-quick-audit" action="/services/ai-search-visibility#free-aeo-audit" method="get" novalidate><label for="quick-audit-website">Start with your website</label><div><input id="quick-audit-website" name="website" inputmode="url" autocomplete="url" placeholder="yourcompany.com" maxlength="2048" required><button type="submit">Check my AI visibility <span aria-hidden="true">→</span></button></div><p id="quick-audit-status" aria-live="polite">We will use public information only for the first review.</p></form><figcaption>Original AiXCEL illustration of a website moving through answer surfaces into measurable signals.</figcaption></figure></div></section>
  <section class="content-section audit-outcomes" id="what-you-get"><div class="section-intro"><p class="eyebrow">Your free AEO audit</p><h2>Know where you stand before you spend.</h2><p>You get a simple starting report—not a wall of charts. Every finding is tied to the prompts and supported platforms checked for your business.</p></div><div class="audit-deliverable-grid"><article><span>01</span><h3>AI visibility score</h3><p>A scoped 0–100 starting score for the buyer questions and answer platforms included in the audit.</p></article><article><span>02</span><h3>Competitor comparison</h3><p>See which competitors appear more often and how your share of the answer set compares.</p></article><article><span>03</span><h3>Mentions and citations</h3><p>See when your brand is mentioned, where it ranks in the answer, and which sources are cited.</p></article><article><span>04</span><h3>Sentiment and facts</h3><p>Check whether AI answers describe your business accurately, positively, and with the right details.</p></article><article><span>05</span><h3>What to fix first</h3><p>Get a short list of technical, content, authority, and measurement gaps in priority order.</p></article></div><p class="audit-scope-note"><strong>Important:</strong> the audit is a dated sample, not a universal score or future ranking guarantee. Coverage depends on the prompt set, market, location, and supported platforms used.</p></section>
  <section class="content-section dark-section managed-service-section"><div class="section-intro"><p class="eyebrow light">Managed AEO service</p><h2>We do the work after the audit.</h2><p>AiXCEL turns the report into a practical operating plan, then helps your team improve and monitor the signals that matter.</p></div><div class="managed-capability-grid"><article><span>01</span><h3>Track buyer questions</h3><p>Monitor the prompts real buyers use across the supported AI platforms selected for your market.</p></article><article><span>02</span><h3>Watch competitors</h3><p>Compare visibility, answer position, share of voice, and changes over time.</p></article><article><span>03</span><h3>Find trusted sources</h3><p>See which pages and third-party sources AI answers rely on, then close credible evidence gaps.</p></article><article><span>04</span><h3>Fix site blockers</h3><p>Prioritize crawl, schema, page structure, entity, and content issues that make your offer harder to understand.</p></article><article><span>05</span><h3>Create better content</h3><p>Build useful answer-ready pages around real questions, clear claims, visible proof, and source-backed detail.</p></article><article><span>06</span><h3>Report what changed</h3><p>Connect visibility movement to content actions, site fixes, available referrals, leads, and next priorities.</p></article></div><div class="term-clarity"><strong>Simple naming:</strong><p>AEO is the service name. AIEO describes the wider AI-engine visibility system, while GEO focuses on generative answers. They are connected parts of the same work—not three separate packages.</p><a class="text-link" href="#free-aeo-audit">Start with the free audit →</a></div></section>
  <section class="content-section simple-process-section" id="process"><div class="section-intro"><p class="eyebrow">How it works</p><h2>Audit first. Improve second. Monitor what moves.</h2><p>You can understand the starting point before deciding whether an ongoing AEO service makes sense.</p></div><div class="simple-process"><article><span>1</span><div><h3>Send your website</h3><p>Tell us the website and the product, service, or buyer question that matters most.</p></div></article><article><span>2</span><div><h3>Review your free audit</h3><p>We map the current visibility, competitors, cited sources, brand facts, and highest-priority gaps.</p></div></article><article><span>3</span><div><h3>Choose the next move</h3><p>Use the report yourself or ask AiXCEL to run the fixes, content work, prompt monitoring, and reporting.</p></div></article></div><div class="platform-strip" aria-label="Example supported AI answer platforms"><span>Coverage can include</span><strong>ChatGPT</strong><strong>Google AI Overviews</strong><strong>Perplexity</strong><strong>Gemini</strong><strong>Claude</strong><small>Exact coverage is confirmed for your scope.</small></div></section>
  <section class="content-section baseline-section" id="free-aeo-audit"><span class="anchor-alias" id="baseline" aria-hidden="true"></span><div class="baseline-grid"><div class="baseline-copy"><p class="eyebrow">Free AEO audit</p><h2>Find out where your brand stands today.</h2><p>Start with your website. We will ask for your contact details and the one offer or buyer question you care about most.</p><div class="baseline-points"><div><span>1</span><p>Scoped AI visibility score and platform breakdown.</p></div><div><span>2</span><p>Competitor, mention, citation, and sentiment review.</p></div><div><span>3</span><p>Priority technical and content actions.</p></div><div><span>4</span><p>Human review with no credit card and no ranking guarantee.</p></div></div><p class="audit-privacy-note">We use public website information for the review. Your contact details are used only to prepare and respond to this request unless you separately opt into marketing.</p></div><div><form class="baseline-form" id="ai-visibility-form" novalidate data-current-step="1"><div class="baseline-progress"><span id="audit-progress-label">Step 1 of 2 · website</span></div><fieldset data-step="1"><h3 id="baseline-step-one" tabindex="-1">Start with your website</h3><div class="form-grid"><div class="field field-wide"><label for="baseline-website">Website address</label><input id="baseline-website" name="website" type="url" inputmode="url" autocomplete="url" placeholder="https://yourcompany.com" maxlength="2048" required><p class="field-help">Enter the public website you want us to review.</p></div><div class="honeypot" aria-hidden="true"><label for="baseline-fax">Company fax</label><input id="baseline-fax" name="companyFax" tabindex="-1" autocomplete="off"></div></div><div class="form-actions"><button class="button button-primary" type="button" data-next-step>Continue to my details <span aria-hidden="true">→</span></button></div></fieldset><fieldset data-step="2" hidden><h3 id="baseline-step-two" tabindex="-1">Where should we send the audit?</h3><div class="form-grid"><div class="field"><label for="baseline-name">Your name</label><input id="baseline-name" name="name" autocomplete="name" maxlength="120" required></div><div class="field"><label for="baseline-email">Work email</label><input id="baseline-email" name="email" type="email" autocomplete="email" maxlength="320" required></div><div class="field"><label for="baseline-company">Company</label><input id="baseline-company" name="company" autocomplete="organization" maxlength="160" required></div><div class="field"><label for="baseline-role">Your role</label><input id="baseline-role" name="role" autocomplete="organization-title" maxlength="120" placeholder="Founder, marketing lead…" required></div><div class="field field-wide"><label for="baseline-goal">Which product, service, or buyer question matters most?</label><textarea id="baseline-goal" name="aiGoal" maxlength="1500" required placeholder="Example: We want operations leaders to find our managed revenue-cycle service when they compare providers."></textarea></div><div class="field field-wide"><label for="baseline-timing">When would you like to act on the findings?</label><select id="baseline-timing" name="timing" required><option value="">Choose one</option><option value="now">Now / within 30 days</option><option value="30-60-days">Within 30–60 days</option><option value="later">Later this quarter</option><option value="exploring">I am exploring AEO</option></select></div></div><label class="consent-field"><input name="consent" value="yes" type="checkbox" required><span>I agree that AiXCEL may use this information to prepare and respond to my audit request under the <a href="/privacy" target="_blank">privacy notice</a>. This does not subscribe me to recurring marketing.</span></label><div id="ai-visibility-turnstile" aria-label="Security verification"></div><div class="form-actions"><button class="button button-secondary" type="button" data-previous-step>Back</button><button class="button button-primary" type="submit"><span data-submit-label>Request my free audit</span> <span aria-hidden="true">→</span></button></div></fieldset><p class="form-status" id="ai-visibility-form-status" aria-live="polite"></p></form><div class="delivery-note" id="ai-visibility-connection-fallback" hidden tabindex="-1"><span>Direct email delivery</span><p>Your request will open as a prepared email on this device so you can review it before sending. Nothing is stored by the page until you send the email. You can also book a short review.</p><div class="delivery-actions"><a class="text-link" id="ai-visibility-fallback-email" href="mailto:ahmadbukhari4245@gmail.com?subject=Free%20AEO%20audit%20request">Email the request →</a><a class="text-link" data-booking-fallback href="${book}" target="_blank" rel="noopener noreferrer">Book a short review →</a></div></div><div class="baseline-result" id="ai-visibility-result" hidden tabindex="-1"><span>Request stored</span><h3>Your free AEO audit is in the Lead Desk.</h3><p>Ahmad will review the website, your priority, and the public context. You can read the brief now or choose a time for a focused review.</p><div class="hero-actions"><a class="button button-primary" id="ai-visibility-result-pdf" href="/guides/ai-search-visibility-brief.pdf">Read the brief</a><a class="button button-secondary" id="ai-visibility-result-booking" href="${book}" target="_blank" rel="noopener noreferrer">Book the review</a></div></div></div></div></section>
  <section class="content-section evidence-section"><div class="section-intro"><p class="eyebrow">Evidence boundary</p><h2>Measured findings, not made-up promises.</h2><p>AI answer platforms control their own outputs. AiXCEL reports the sampled observations, sources, limits, and changes it can verify.</p></div><div class="evidence-gate">${aiVisibilityEvidenceMarkup()}</div></section>
  <section class="content-section calendar-section"><div class="section-intro"><p class="eyebrow">Prefer to talk first?</p><h2>Book a short AEO review.</h2><p>Use the calendar if you want to explain the offer, market, or buyer questions before the audit is prepared.</p></div><div class="calendar-shell"><div id="ai-visibility-calendar" aria-label="Book an AiXCEL AEO audit review"></div><div class="calendar-fallback"><p id="ai-visibility-calendar-status" aria-live="polite">Loading secure Cal.com availability…</p><a class="text-link" data-booking-fallback href="${book}" target="_blank" rel="noopener noreferrer">Open the calendar directly →</a></div></div></section>
  <section class="content-section dark-section"><div class="section-intro"><p class="eyebrow light">Plain-English guide</p><h2>Understand AEO before you buy it.</h2><p>The five-page AI Search Visibility Brief explains the service, the terms, the evidence rules, and how visibility connects to a real lead.</p></div><div class="related-links"><a href="/guides/ai-search-visibility-brief.pdf" data-ai-visibility-pdf>Download the free guide →</a><a href="/insights/aieo-aeo-geo-explained">AIEO, AEO and GEO explained →</a><a href="/insights/measure-ai-search-visibility">How AI visibility is measured →</a></div></section>
  <section class="content-section" id="sources"><div class="section-intro"><h2>Platform facts come from primary sources.</h2><p>Service recommendations are AiXCEL's. Platform behavior and eligibility guidance are checked against first-party documentation and clearly separated from commercial claims.</p></div><ul class="source-list"><li><a href="https://developers.google.com/search/docs/appearance/ai-features" target="_blank" rel="noopener noreferrer">Google Search Central: AI features and your website ↗</a><p>Official guidance on eligibility, SEO foundations, crawl controls, structured data, and Search Console reporting.</p></li><li><a href="https://help.openai.com/en/articles/12627856-publishers-and-developers-faq" target="_blank" rel="noopener noreferrer">OpenAI: publishers and developers FAQ ↗</a><p>Official guidance on OAI-SearchBot, content controls, referral information, and placement boundaries.</p></li><li><a href="https://help.openai.com/en/articles/9237897-chatgpt-search" target="_blank" rel="noopener noreferrer">OpenAI: ChatGPT search ↗</a><p>Official description of web-search answers and linked sources.</p></li><li><a href="https://arxiv.org/abs/2311.09735" target="_blank" rel="noopener noreferrer">GEO: Generative Engine Optimization ↗</a><p>The original academic paper. Its benchmark is research context, not a client performance guarantee.</p></li></ul></section>
  <section class="content-section detail-faq"><div class="section-intro"><h2>Common AEO questions.</h2><p>Simple answers about scope, platforms, measurement, and limits.</p></div>${faq(page.faqs)}</section>
  ${related(page.related)}</div>`;
}

function aeoSampleWorkspace() {
  const bars = [34, 42, 39, 51, 47, 58, 63, 68].map((value) => `<i style="--sample-bar:${value}%"><span>${value}</span></i>`).join("");
  return `<section class="content-section aeo-sample-section" id="sample-workspace"><div class="section-intro"><p class="eyebrow">Interactive sample workspace</p><h2>See the evidence before you book.</h2><p>This sample uses illustrative data, not client results. Switch views to understand how visibility, competitors, sources, and actions stay connected.</p></div><div class="aeo-sample-shell" data-aeo-sample><aside class="sample-sidebar"><div class="sample-domain"><i>AX</i><span>sampleco.com<small>Illustrative project</small></span></div><nav aria-label="Sample workspace views"><button type="button" data-sample-view="visibility" aria-pressed="true"><span>01</span>Visibility</button><button type="button" data-sample-view="competitors" aria-pressed="false"><span>02</span>Competitors</button><button type="button" data-sample-view="sources" aria-pressed="false"><span>03</span>Sources</button><button type="button" data-sample-view="actions" aria-pressed="false"><span>04</span>Actions</button></nav><p>Sample data only</p></aside><div class="sample-main"><header><div><span data-sample-kicker>Visibility view</span><h3 data-sample-title>Where the brand appears today</h3></div><strong>ILLUSTRATIVE</strong></header><div class="sample-metrics"><article><span data-sample-label="0">Visibility</span><strong data-sample-metric="0">34%</strong><small data-sample-note="0">Across tracked prompts</small></article><article><span data-sample-label="1">Citations</span><strong data-sample-metric="1">8</strong><small data-sample-note="1">Observed source links</small></article><article><span data-sample-label="2">Answer position</span><strong data-sample-metric="2">2.8</strong><small data-sample-note="2">Illustrative average</small></article></div><div class="sample-evidence-grid"><article class="sample-chart-card"><div class="sample-card-heading"><span>Observed answer trend</span><i data-sample-change>Direction: improving</i></div><div class="sample-chart" data-sample-chart aria-label="Illustrative answer visibility trend">${bars}</div><div class="sample-axis"><span>Earlier</span><span>Recent</span></div></article><article class="sample-priority-card"><div class="sample-card-heading"><span>Priority finding</span><i>Agent ready</i></div><strong data-sample-finding>Three buyer questions have strong competitor coverage but weak first party evidence.</strong><p data-sample-explanation>Build one comparison page, strengthen the service proof block, and verify the sources the answer engines already use.</p><button type="button" data-sample-agent>Ask why this matters <span aria-hidden="true">→</span></button></article></div><div class="sample-table-wrap"><table><thead><tr><th>Signal</th><th>What the sample shows</th><th>Next state</th></tr></thead><tbody data-sample-rows><tr><td><i></i>Buyer questions</td><td>4 of 10 include the sample brand</td><td><span>Monitor</span></td></tr><tr><td><i></i>Competitor gap</td><td>Two rivals lead on evidence depth</td><td><span>Compare</span></td></tr><tr><td><i></i>Source coverage</td><td>Three priority sources do not mention the brand</td><td><span>Act</span></td></tr></tbody></table></div><p class="sample-live-status" data-sample-status aria-live="polite">Visibility sample selected.</p></div></div></section>`;
}

function aiVisibilityBody(page) {
  const book = escapeHtml(aiVisibilityBookingUrl("managed_aeo_page"));
  const agentExamples = [
    ["competitor", "Why is this competitor cited more than us?"],
    ["sentiment", "Where is negative brand sentiment coming from?"],
    ["content", "What should we publish next?"],
  ];
  return `<div class="ai-visibility-page aeo-product-page">
  <section class="ai-service-hero aeo-product-hero">${breadcrumbs(page)}<div class="ai-hero-grid"><div class="ai-hero-copy"><span class="ai-service-lockup">Managed AEO intelligence</span><h1>Know why competitors appear in AI answers—<em>and what to do next.</em></h1><p>AiXCEL combines visibility data, prioritized opportunities, and a specialist AEO strategy agent in one managed programme.</p><div class="hero-actions"><a class="button button-primary" href="#free-aeo-audit">Get your free AEO audit <span class="arrow-icon" aria-hidden="true"></span></a><a class="button button-secondary" href="#sample-workspace">Explore the sample workspace <span aria-hidden="true">↓</span></a></div><p class="cta-note">No card · white-label report · human reviewed · no ranking guarantee</p></div><div class="answer-intelligence-console" aria-label="Illustrative AiXCEL Answer Intelligence workspace"><div class="console-bar"><span>ANSWER INTELLIGENCE</span><i>Illustrative workspace</i></div><div class="console-score"><div><span>Visibility baseline</span><strong>Where do you stand?</strong></div><div class="score-rings" aria-hidden="true"><i></i><i></i><b></b></div></div><div class="console-lanes"><div><span>01</span><strong>Visibility</strong><p>Mentions, citations, competitors, answer position, sentiment.</p><i class="lane-signal"><b></b></i></div><div><span>02</span><strong>Opportunities</strong><p>Specific gaps ranked by impact and effort.</p><i class="lane-signal"><b></b></i></div><div><span>03</span><strong>Strategy Agent</strong><p>Ask why. Get the sources, diagnosis, and next steps.</p><i class="lane-signal"><b></b></i></div></div><form class="quick-audit-form" id="aeo-quick-audit" action="/services/ai-search-visibility#free-aeo-audit" method="get" novalidate><label for="quick-audit-website">Start with your website</label><div><input id="quick-audit-website" name="website" inputmode="url" autocomplete="url" placeholder="yourcompany.com" maxlength="2048" required><button type="submit">Check my visibility <span aria-hidden="true">→</span></button></div><p id="quick-audit-status" aria-live="polite">Public website information only for the first review.</p></form></div></div><figure class="aeo-panorama"><img src="/assets/visuals/aixcel-aeo-answer-trails.webp" width="1536" height="1024" alt="Website and buyer question signals becoming citation evidence, competitor context, and a prioritized AEO decision"><figcaption>From scattered answer signals to one decision-ready AEO plan.</figcaption></figure></section>
  ${aeoSampleWorkspace()}

  <section class="content-section product-overview" id="product"><span class="anchor-alias" id="what-you-get" aria-hidden="true"></span><div class="section-intro"><p class="eyebrow">The product</p><h2>Three parts. One clear path from data to action.</h2><p>Most tools stop at charts. This service shows what is happening, finds the gaps, and helps decide what to do about them.</p></div><div class="product-chapters">
    <article class="product-chapter"><div class="product-chapter-copy"><span>01 · Visibility</span><h3>See where you stand across AI answers.</h3><p>We build a relevant prompt set from your site, competitors, market, and available search data. Then we track the answer surfaces selected for your scope.</p><ul><li>Brand mentions and answer position</li><li>Citations and source domains</li><li>Competitor share of the prompt set</li><li>Sentiment and factual accuracy</li></ul></div><div class="visibility-board" role="img" aria-label="Illustrative AI visibility comparison across a selected prompt set"><div class="board-head"><span>Prompt set</span><strong>Brand visibility</strong></div><div class="platform-row"><span>Buyer question 01</span><i style="--value:78%"></i><b>YOU</b></div><div class="platform-row"><span>Buyer question 02</span><i style="--value:42%"></i><b>GAP</b></div><div class="platform-row"><span>Buyer question 03</span><i style="--value:64%"></i><b>CITED</b></div><div class="platform-row"><span>Buyer question 04</span><i style="--value:28%"></i><b>RIVAL</b></div><small>Illustrative structure · your audit uses a confirmed scope</small></div></article>
    <article class="product-chapter is-reversed"><div class="product-chapter-copy"><span>02 · Opportunities</span><h3>Turn the gaps into a ranked action list.</h3><p>The system reads the visibility data and surfaces the moves most likely to close a real gap—without sending your team into an endless content backlog.</p><ul><li>Technical and crawl blockers</li><li>Missing comparison, trust, and service pages</li><li>Weak or absent third-party evidence</li><li>Brand facts and sentiment that need attention</li></ul></div><div class="opportunity-board" aria-label="Illustrative prioritized AEO opportunity list"><div class="opportunity-item is-priority"><span>HIGH IMPACT</span><strong>Build a source-backed comparison page</strong><i>Evidence gap</i></div><div class="opportunity-item"><span>QUICK WIN</span><strong>Clarify service entity and proof</strong><i>Owned page</i></div><div class="opportunity-item"><span>WATCH</span><strong>Address repeated negative sentiment source</strong><i>Brand risk</i></div><div class="opportunity-footer"><span>Impact</span><span>Effort</span><span>Owner</span><span>Evidence</span></div></div></article>
    <article class="product-chapter"><div class="product-chapter-copy"><span>03 · Strategy Agent</span><h3>Ask the hard question in plain English.</h3><p>The differentiator is the specialist agent sitting on top of your data. It combines the metrics, source pages, competitor context, and 40+ AEO, GEO, and marketing skills into a strategic answer.</p><ul><li>Why is this competitor cited more?</li><li>Where is negative sentiment coming from?</li><li>What would it take to appear in this answer?</li><li>Which action should the team take first?</li></ul></div><div class="strategy-agent-card"><div class="agent-question"><span>YOU</span><p>Why are competitors being cited more often?</p></div><div class="agent-answer"><span>STRATEGY AGENT</span><p>Three source gaps explain most of the difference. Start with the comparison page, strengthen the proof block, then pursue the two independent sources already used in this answer set.</p><div><i>1</i><strong>Source gap mapped</strong></div><div><i>2</i><strong>Action plan drafted</strong></div><div><i>3</i><strong>Evidence attached</strong></div></div></div></article>
  </div></section>

  <section class="content-section dark-section agent-demo-section"><div class="section-intro"><p class="eyebrow light">The strategy layer</p><h2>Ask a business question—not a dashboard filter.</h2><p>Choose an example to see the kind of structured answer the managed workspace is designed to produce.</p></div><div class="agent-demo"><div class="agent-demo-questions" role="tablist" aria-label="Strategy Agent example questions">${agentExamples.map(([key, label], index) => `<button type="button" role="tab" data-agent-question="${key}" aria-selected="${index === 0 ? "true" : "false"}"><span>0${index + 1}</span>${escapeHtml(label)}</button>`).join("")}</div><div class="agent-demo-answer" role="tabpanel" tabindex="0"><div class="demo-answer-label"><span>Illustrative response</span><i>Source-aware plan</i></div><h3 id="agent-demo-title">Your competitor has a stronger source footprint.</h3><p id="agent-demo-summary">It appears across more independent comparison and review sources, while your strongest proof is concentrated on your own website.</p><ol id="agent-demo-steps"><li>Map the exact sources used in the missed answers.</li><li>Publish a comparison page that resolves the repeated buyer question.</li><li>Strengthen independent corroboration, then monitor the same prompt set.</li></ol><small>Example only. A real answer uses your selected prompts, observed sources, and business context.</small></div></div></section>

  <section class="content-section managed-programme" id="process"><div class="section-intro"><p class="eyebrow">The managed service</p><h2>The platform supplies the signal. AiXCEL supplies the strategy and execution.</h2><p>You are not buying another reporting login. You are buying a measured operating programme with a person accountable for turning findings into useful work.</p></div><div class="managed-layer-grid"><article><span>01</span><h3>Baseline</h3><p>Freeze the prompt set, competitors, mentions, citations, sentiment, and key technical conditions.</p></article><article><span>02</span><h3>Priority sprint</h3><p>Resolve the highest-value source, page, technical, or brand gap with a defined owner and proof.</p></article><article><span>03</span><h3>Ongoing intelligence</h3><p>Monitor answer movement, ask deeper questions, maintain the opportunity backlog, and report what changed.</p></article></div><div class="managed-distinction"><strong>Why a managed engagement?</strong><p>Data without decisions becomes shelfware. AiXCEL connects the visibility evidence to content, technical work, authority building, conversion paths, and the CRM or lead systems you already use.</p></div></section>

  <section class="content-section baseline-section" id="free-aeo-audit"><span class="anchor-alias" id="baseline" aria-hidden="true"></span><div class="baseline-grid"><div class="baseline-copy"><p class="eyebrow">Free AEO audit</p><h2>See where you stand before you spend.</h2><p>Start with one website and the offer or buyer question that matters most. You will receive a scoped, white-label starting report with a clear next move.</p><div class="baseline-points"><div><span>1</span><p>Visibility across the selected prompt and platform set.</p></div><div><span>2</span><p>Competitor, citation, source, and sentiment gaps.</p></div><div><span>3</span><p>Prioritized actions, not a wall of charts.</p></div><div><span>4</span><p>Human review, no credit card, no ranking promise.</p></div></div><p class="audit-privacy-note">We use public website information for the review. Contact and revenue-range details are used to size and respond to this request. They do not subscribe you to recurring marketing.</p></div><div><form class="baseline-form" id="ai-visibility-form" novalidate data-current-step="1"><input type="hidden" name="requestType" value="free_audit"><div class="baseline-progress"><span id="audit-progress-label">Step 1 of 2 · website</span></div><fieldset data-step="1"><h3 id="baseline-step-one" tabindex="-1">Start with your website</h3><div class="form-grid"><div class="field field-wide"><label for="baseline-website">Website address</label><input id="baseline-website" name="website" type="url" inputmode="url" autocomplete="url" placeholder="https://yourcompany.com" maxlength="2048" required><p class="field-help">Enter the public website you want us to review.</p></div><div class="honeypot" aria-hidden="true"><label for="baseline-fax">Company fax</label><input id="baseline-fax" name="companyFax" tabindex="-1" autocomplete="off"></div></div><div class="form-actions"><button class="button button-primary" type="button" data-next-step>Continue to my details <span aria-hidden="true">→</span></button></div></fieldset><fieldset data-step="2" hidden><h3 id="baseline-step-two" tabindex="-1">Where should we send the audit?</h3><div class="form-grid"><div class="field"><label for="baseline-name">Your name</label><input id="baseline-name" name="name" autocomplete="name" maxlength="120" required></div><div class="field"><label for="baseline-email">Work email</label><input id="baseline-email" name="email" type="email" autocomplete="email" maxlength="320" required></div><div class="field"><label for="baseline-company">Company</label><input id="baseline-company" name="company" autocomplete="organization" maxlength="160" required></div><div class="field"><label for="baseline-role">Your role</label><input id="baseline-role" name="role" autocomplete="organization-title" maxlength="120" placeholder="Founder, marketing lead" required></div><div class="field field-wide"><label for="baseline-revenue">Approximate annual company revenue</label><select id="baseline-revenue" name="annualRevenue" required><option value="">Choose a range</option><option value="pre_revenue">Pre-revenue or not yet trading</option><option value="under_250k">Under $250k</option><option value="250k_1m">$250k to $1m</option><option value="1m_5m">$1m to $5m</option><option value="5m_20m">$5m to $20m</option><option value="20m_plus">$20m+</option><option value="prefer_not_to_say">Prefer not to say</option></select><p class="field-help">Approximate is fine. We use this only to size the audit and any later proposal.</p></div><div class="field field-wide"><label for="baseline-goal">Which offer or buyer question matters most?</label><textarea id="baseline-goal" name="aiGoal" maxlength="1500" required placeholder="Example: We want operations leaders to find our managed revenue-cycle service when they compare providers."></textarea></div><div class="field field-wide"><label for="baseline-timing">When would you like to act on the findings?</label><select id="baseline-timing" name="timing" required><option value="">Choose one</option><option value="now">Now / within 30 days</option><option value="30-60-days">Within 30 to 60 days</option><option value="later">Later this quarter</option><option value="exploring">I am exploring AEO</option></select></div></div><label class="consent-field"><input name="consent" value="yes" type="checkbox" required><span>I agree that AiXCEL may use this information to prepare and respond to my audit request under the <a href="/privacy" target="_blank">privacy notice</a>. This does not subscribe me to recurring marketing.</span></label><p class="secure-form-note">Protected with a signed form session, a hidden spam trap, strict origin checks, and rate limits.</p><div class="form-actions"><button class="button button-secondary" type="button" data-previous-step>Back</button><button class="button button-primary" type="submit"><span data-submit-label>Request my free audit</span> <span aria-hidden="true">→</span></button></div></fieldset><p class="form-status" id="ai-visibility-form-status" aria-live="polite"></p></form><div class="delivery-note" id="ai-visibility-connection-fallback" hidden tabindex="-1"><span>Direct contact path</span><p>The monitored form is temporarily unavailable. Email the request or book the focused review directly.</p><div class="delivery-actions"><a class="text-link" id="ai-visibility-fallback-email" href="mailto:ahmadbukhari4245@gmail.com?subject=Free%20AEO%20audit%20request">Email the request →</a><a class="text-link" data-booking-fallback href="${book}" target="_blank" rel="noopener noreferrer">Book a strategy review →</a></div></div><div class="baseline-result" id="ai-visibility-result" hidden tabindex="-1"><span>Request stored</span><h3>Your free AEO audit request is in.</h3><p id="ai-visibility-result-message">We saved your request and are sending the confirmation now.</p><div class="hero-actions"><a class="button button-primary" id="ai-visibility-result-booking" data-booking-fallback href="${book}" target="_blank" rel="noopener noreferrer">Choose a review time</a><a class="button button-secondary" id="ai-visibility-result-pdf" href="/guides/ai-search-visibility-brief.pdf">Read the guide</a></div></div></div></div></section>

  <section class="aeo-resource-band"><div><p class="eyebrow light">Prefer a conversation?</p><h2>Bring the market, offer, and competitor you care about.</h2></div><div><p>Use the booking calendar for a focused AEO review, or have the short guide sent to your inbox first.</p><div class="hero-actions"><a class="button button-primary" data-booking-fallback href="${book}" target="_blank" rel="noopener noreferrer">Open the booking calendar <span class="arrow-icon" aria-hidden="true"></span></a><button class="button button-secondary" type="button" data-ai-visibility-pdf aria-haspopup="dialog">Email me the AEO guide</button></div></div></section>

  <dialog class="guide-gate" id="ai-visibility-guide-dialog" aria-labelledby="guide-gate-title"><form method="dialog" class="guide-gate-close"><button value="close" aria-label="Close guide request">Close</button></form><div class="guide-gate-layout"><div class="guide-gate-copy"><p class="eyebrow">Free five-page field guide</p><h2 id="guide-gate-title">Get the AI Visibility Brief.</h2><p>A practical explanation of AIEO, AEO, GEO, the signals worth measuring, and the questions to ask before paying for a programme.</p><div class="guide-proof"><span>01</span><p>Clear category definitions</p><span>02</span><p>Visibility and citation measurement</p><span>03</span><p>A responsible action framework</p></div><small>No recurring marketing. We send the guide and record the request so you know exactly what happens next.</small></div><div><form class="guide-gate-form" id="ai-visibility-guide-form" novalidate><input type="hidden" name="requestType" value="guide_download"><div class="form-grid"><div class="field"><label for="guide-name">Your name</label><input id="guide-name" name="name" autocomplete="name" maxlength="120" required></div><div class="field"><label for="guide-email">Work email</label><input id="guide-email" name="email" type="email" autocomplete="email" maxlength="320" required></div><div class="field"><label for="guide-company">Company</label><input id="guide-company" name="company" autocomplete="organization" maxlength="160" required></div><div class="field"><label for="guide-website">Company website</label><input id="guide-website" name="website" type="url" inputmode="url" autocomplete="url" placeholder="https://yourcompany.com" maxlength="2048" required></div><div class="field field-wide"><label for="guide-revenue">Approximate annual company revenue</label><select id="guide-revenue" name="annualRevenue" required><option value="">Choose a range</option><option value="pre_revenue">Pre-revenue or not yet trading</option><option value="under_250k">Under $250k</option><option value="250k_1m">$250k to $1m</option><option value="1m_5m">$1m to $5m</option><option value="5m_20m">$5m to $20m</option><option value="20m_plus">$20m+</option><option value="prefer_not_to_say">Prefer not to say</option></select><p class="field-help">Used only to understand fit and size any later recommendation.</p></div><div class="honeypot" aria-hidden="true"><label for="guide-fax">Company fax</label><input id="guide-fax" name="companyFax" tabindex="-1" autocomplete="off"></div></div><label class="consent-field"><input name="consent" value="yes" type="checkbox" required><span>I agree that AiXCEL may use these details to send this guide and respond under the <a href="/privacy" target="_blank">privacy notice</a>. This is not a recurring marketing subscription.</span></label><button class="button button-primary" type="submit"><span data-guide-submit-label>Email me the guide</span> <span aria-hidden="true">→</span></button><p class="form-status" id="ai-visibility-guide-status" aria-live="polite"></p></form><div class="guide-gate-result" id="ai-visibility-guide-result" hidden tabindex="-1"><span>Request stored</span><h3>Your guide is ready.</h3><p id="ai-visibility-guide-result-message">Check your inbox, or download the guide below.</p><div class="hero-actions"><a class="button button-primary" id="ai-visibility-guide-download" href="/guides/ai-search-visibility-brief.pdf">Download the guide</a><a class="button button-secondary" id="ai-visibility-guide-booking" href="${book}" target="_blank" rel="noopener noreferrer">Book an AEO review</a></div></div></div></div></dialog>

  <section class="content-section aeo-detail-drawer"><div class="section-intro"><p class="eyebrow">Before you decide</p><h2>Clear scope. Clear evidence boundary.</h2></div><details class="proof-boundary"><summary>How AiXCEL handles evidence and performance claims <i aria-hidden="true">+</i></summary><div class="evidence-gate">${aiVisibilityEvidenceMarkup()}</div></details><details class="proof-boundary"><summary>Primary platform sources behind the method <i aria-hidden="true">+</i></summary><ul class="source-list"><li><a href="https://developers.google.com/search/docs/appearance/ai-features" target="_blank" rel="noopener noreferrer">Google Search Central: AI features and your website ↗</a><p>Official guidance on eligibility, crawl controls, structured data, and Search Console reporting.</p></li><li><a href="https://help.openai.com/en/articles/12627856-publishers-and-developers-faq" target="_blank" rel="noopener noreferrer">OpenAI: publishers and developers FAQ ↗</a><p>Official guidance on OAI-SearchBot, content controls, referrals, and placement boundaries.</p></li><li><a href="https://arxiv.org/abs/2311.09735" target="_blank" rel="noopener noreferrer">GEO: Generative Engine Optimization ↗</a><p>The original academic paper; its benchmark is research context, not a client guarantee.</p></li></ul></details></section>
  <section class="content-section detail-faq aeo-faq"><div class="section-intro"><p class="eyebrow">Common questions</p><h2>What responsible buyers ask.</h2></div>${faq(page.faqs.slice(0, 4))}</section>
  </div>`;
}

function workspaceBody(page) {
  return `${pageHero(page)}
  <section class="content-section product-proof-showcase"><div class="section-intro"><p class="eyebrow">Real operating surfaces</p><h2>See the control plane and the access boundaries.</h2><p>The public screen is shown as it exists. Private systems stop at their real login boundary, so no customer account, company name, or production record is exposed.</p></div><div class="product-proof-grid">${productProofFigure("manhaj", { className: "is-wide", loading: "eager" })}${productProofFigure("aitlas")}${productProofFigure("chirocandy")}</div></section>
  <section class="content-section"><div class="section-intro"><h2>The second featured solution, kept inside an honest boundary.</h2><p>QM can support scoped execution and workspace coordination. It is not presented as the permanent database, approval authority, identity provider, or client cloud.</p></div>${cards([["01","Scoped execution workspace","Bounded agents, schedules, working state, and artifacts for approved operational jobs."],["02","Human approval gateway","Consequential actions remain proposals until the authorized person reviews the exact preview and approves."],["03","Evidence and receipts","Each run can preserve sources, policy decisions, outputs, verification state, and an immutable execution receipt."],["04","Client-owned systems","CRM, projects, files, communication, billing, and credentials remain in the systems responsible for those records."],["05","Private-pilot status","The architecture can guide a bounded discovery or pilot; it is not sold as a completed multi-tenant portal."],["06","Deferred cloud access","Customer tenancy, identity, provider credentials, and cloud access require a separate security and acceptance project."]])}</section><section class="content-section dark-section"><div class="section-intro"><h2>Propose. Approve. Execute. Verify.</h2><p>The operating memory aid is intentionally simple. It keeps authority visible from the initial request to the final receipt.</p></div><div class="process-list"><article><h3>Identity</h3><p>Confirm the tenant, person, role, and permitted capability.</p></article><article><h3>Preview</h3><p>Show the exact intended external change and its evidence.</p></article><article><h3>Approval</h3><p>Require the named human decision before consequential execution.</p></article><article><h3>Receipt</h3><p>Verify the result and preserve what happened, when, and under whose authority.</p></article></div></section>${related([["Primary: AI Search Visibility","/services/ai-search-visibility"],["Existing AI automation services","/services"],["Discuss a bounded private pilot","/contact"]])}`;
}

function serviceBody(page) {
  const groups = [page.includes.slice(0, 2), page.includes.slice(2, 4), page.includes.slice(4, 6)];
  const capabilities = groups.map((group, index) => `<article class="service-capability"><span>0${index + 1}</span><h3>${escapeHtml(group[0][0])}</h3><p>${escapeHtml(group[0][1])}</p><div><strong>${escapeHtml(group[1][0])}</strong><p>${escapeHtml(group[1][1])}</p></div></article>`).join("");
  const fitSignals = page.fit.slice(0, 3).map(([yes, text]) => `<article class="fit-signal ${yes ? "is-ready" : "is-pause"}"><span>${yes ? "Good fit" : "Pause first"}</span><p>${escapeHtml(text)}</p></article>`).join("");
  const proofKeys = serviceProductProofs.get(page.path) ?? [];
  const proofIntro = serviceProofIntros.get(page.path);
  const proofSection = proofKeys.length && proofIntro ? `<section class="content-section product-proof-showcase"><div class="section-intro"><p class="eyebrow">Inspect before you buy</p><h2>${escapeHtml(proofIntro[0])}</h2><p>${escapeHtml(proofIntro[1])}</p></div><div class="product-proof-grid${proofKeys.length >= 3 ? " is-three" : ""}">${proofKeys.map((key, index) => productProofFigure(key, { className: proofKeys.length === 1 ? "is-wide" : "", loading: index === 0 ? "eager" : "lazy" })).join("")}</div></section>` : "";
  return `${servicePageHero(page)}
  ${proofSection}
  <section class="content-section service-capability-section"><div class="section-intro"><p class="eyebrow">Inside the system</p><h2>Six moving parts, grouped into three outcomes.</h2><p>Enough detail to understand the operating model—without making you read a proposal before you know whether the service fits.</p></div><div class="service-capability-grid">${capabilities}</div></section>
  <section class="content-section dark-section"><div class="section-intro"><h2>From bottleneck to owned system.</h2><p>A staged release keeps the business case, technical architecture, and operator experience connected.</p></div><div class="process-list">${page.steps.map(([title, text]) => `<article><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></article>`).join("")}</div></section>
  <section class="content-section"><div class="section-intro"><p class="eyebrow">Fit check</p><h2>Use the service when the operating conditions are real.</h2></div><div class="fit-signal-grid">${fitSignals}</div></section>
  <section class="content-section detail-faq"><div class="section-intro"><h2>Questions decision-makers ask.</h2><p>Clear answers before tooling, scope, or timelines are discussed.</p></div>${faq(page.faqs)}</section>
  ${cta(page)}`;
}

function servicesBody(page) {
  const showcase = servicePages.map((item, index) => {
    const proofKey = serviceProductProofs.get(item.path)?.[0];
    const visual = proofKey ? productProofThumbnail(proofKey, index < 2 ? "eager" : "lazy") : visualPlateThumbnail(item);
    return `<article class="service-showcase-card${index === 0 ? " is-primary" : ""}"><a class="service-showcase-visual" href="${item.path}" aria-label="Explore ${escapeHtml(item.eyebrow)}">${visual}</a><div class="service-showcase-copy"><span>${String(index + 1).padStart(2, "0")} · ${index === 0 ? "Primary entry" : "Connected service"}</span><h2>${escapeHtml(item.eyebrow)}</h2><p>${escapeHtml(item.answer)}</p><a class="text-link" href="${item.path}">${index === 0 ? "Get the free AEO audit" : "Explore this system"} →</a></div></article>`;
  }).join("");
  return `${breadcrumbs(page)}<section class="services-hero"><div class="services-hero-copy"><p class="eyebrow">AI search visibility &amp; business systems</p><h1>Start where the buyer journey is breaking.</h1><p>AiXCEL’s primary entry point is AEO: see where your brand appears in AI answers, why competitors win citations, and what to improve. Lead, CRM, voice, and workflow systems remain ready when the constraint sits further down the journey.</p><div class="hero-actions"><a class="button button-primary" href="/services/ai-search-visibility#free-aeo-audit">Get the free AEO audit <span class="arrow-icon" aria-hidden="true"></span></a><a class="button button-secondary" href="#service-map">See all five systems</a></div></div>${visualPlate("home", "editorial-plate services-atlas", "eager")}</section>
  <section class="content-section service-showcase" id="service-map"><div class="section-intro"><p class="eyebrow">Five focused systems</p><h2>Every service gets its own operating picture.</h2><p>Choose the constraint you can observe today. Each system can stand alone; together they connect discovery to a dependable business response.</p></div><div class="service-showcase-grid">${showcase}</div></section>
  <section class="content-section dark-section delivery-rhythm"><div class="section-intro"><p class="eyebrow light">One delivery rhythm</p><h2>Diagnose. Build. Prove.</h2><p>High-value work should make the business case, operating boundary, and evidence visible before the scope expands.</p></div><div class="delivery-rhythm-grid"><article><span>01</span><h3>Diagnose the constraint</h3><p>Freeze the current state, desired outcome, accountable owner, and evidence that will show movement.</p></article><article><span>02</span><h3>Build one working path</h3><p>Ship the smallest useful system with clear data, decisions, handoffs, and recovery.</p></article><article><span>03</span><h3>Prove and expand</h3><p>Review quality, commercial impact, exceptions, and operator experience before adding scope.</p></article></div></section>
  <section class="workspace-feature"><div><p class="eyebrow">Second featured solution · private pilot</p><h2>The Operations Workspace governs work across the stack.</h2><p>QM-powered execution, scopes, approvals, evidence, and receipts—while CRM, identity, credentials, and permanent records stay in the client-owned systems responsible for them.</p><a class="text-link" href="/solutions/ai-operations-workspace">Inspect the pilot boundary →</a></div><div class="workspace-mini-flow" aria-label="Operations Workspace approval flow"><span>Scope</span><i></i><span>Preview</span><i></i><span>Approve</span><i></i><span>Receipt</span></div></section>
  ${cta(page)}`;
}

function workBody(page) {
  const featured = [
    pageByPath.get("/case-studies/marketing-revenue-assurance"),
    pageByPath.get("/case-studies/deal-rescue-forecast-truth"),
    pageByPath.get("/case-studies/lead-operations"),
  ].filter(Boolean);
  const featuredMarkup = featured.map((item) => `<article class="featured-work-card"><span>${escapeHtml(item.eyebrow)}</span><h3>${escapeHtml(item.h1)}</h3><p>${escapeHtml(item.description)}</p><a href="${item.path}">Read the evidence →</a></article>`).join("");
  return `${pageHero(page)}
  <section class="content-section product-proof-showcase"><div class="section-intro"><p class="eyebrow">Open the working surfaces</p><h2>Real interfaces. Safe evidence states.</h2><p>These are current public product screens using synthetic replay data. Open each live system and inspect the decision path yourself.</p></div><div class="product-proof-grid is-three">${productProofFigure("marketing", { loading: "eager" })}${productProofFigure("deal", { loading: "eager" })}${productProofFigure("revenue")}</div></section>
  <section class="content-section"><div class="section-intro"><h2>One Work hub. Three distinct proof lanes.</h2><p>The labels below prevent unlike evidence from being blended into one vague portfolio claim. Choose the lane that answers the question you are actually evaluating.</p></div><div class="work-hub-grid">
    <article class="work-hub-card"><span>01 · Case evidence</span><h3>What changed in a documented engagement?</h3><p>Inspect the operating constraint, system architecture, evidence basis, measured result, and interpretation limits for client and project work.</p><a href="/case-studies">Explore case studies →</a></article>
    <article class="work-hub-card"><span>02 · Systems lab</span><h3>Can the technical behavior be inspected?</h3><p>Open live public systems with typed contracts, bounded agents, tests, observability, replay paths, and explicit no-mutation boundaries.</p><a href="/labs/agentic-systems">Open the agentic systems lab →</a></article>
    <article class="work-hub-card"><span>03 · Delivery method</span><h3>How does a project become operable?</h3><p>See the audit, architecture, working-slice, evaluation, controlled release, documentation, and handover stages used across delivery.</p><a href="/process">See the delivery process →</a></article>
  </div></section>
  <section class="content-section dark-section"><div class="section-intro"><h2>Start with selected evidence.</h2><p>These examples cover public technical proof and responsibly labelled project evidence. Each page states what the evidence supports—and what it does not.</p></div><div class="featured-work-grid">${featuredMarkup}</div></section>
  <section class="content-section"><div class="section-intro"><h2>Read the evidence at the right level.</h2><p>A live URL, a green test suite, an anonymized project record, and accepted production use are different states. AiXCEL keeps those boundaries visible.</p></div><div class="checklist">
    <article><h3 class="yes">Verified public system</h3><p>Use it to inspect architecture, behavior, contracts, controls, evaluation, and replay under the stated synthetic or public-data conditions.</p></article>
    <article><h3 class="yes">Documented engagement evidence</h3><p>Use it to understand a specific operating constraint, implementation, metric definition, and result within that engagement.</p></article>
    <article><h3 class="no">Not a universal benchmark</h3><p>Do not turn one project's outcome, a scenario count, or a passing evaluation into a forecast for another business.</p></article>
    <article><h3 class="no">Not production acceptance</h3><p>Public proof does not replace private integration, security review, staging UAT, named ownership, rollback, cost approval, or client sign-off.</p></article>
  </div></section>
  ${related([["Explore services","/services"],["Read operating insights","/insights"],["Discuss the first useful move","/contact"]])}${cta(page)}`;
}

function aboutBody(page) {
  return `${pageHero(page)}
  <section class="content-section"><div class="section-intro"><h2>Founder-led by Ahmad Bukhari.</h2><p>The person who diagnoses the constraint remains close to system architecture, critical implementation choices, evaluation, and handover.</p></div><div class="card-grid"><article class="content-card"><span>01</span><h3>Sales and customer context</h3><p>Years spent around CRM breakdowns, lead conversations, training, and handoffs shaped a practical view of where revenue operations fail.</p></article><article class="content-card"><span>02</span><h3>AI systems architecture</h3><p>Work spans n8n, APIs, CRM platforms, AI agents, voice systems, data pipelines, observability, migration, and operational controls.</p><a href="https://n8n.io/creators/ahmadbukhari/" target="_blank" rel="noopener noreferrer">Verified n8n creator profile →</a></article><article class="content-card"><span>03</span><h3>Accountable delivery</h3><p>Aixcel is intentionally founder-led. Specialist collaborators may join when needed without placing layers between the business problem and the architecture.</p></article></div></section>
  <section class="content-section dark-section"><div class="section-intro"><h2>One connected body of work.</h2><p>Aixcel is the services company. AhmadBukhari.com documents the architect and his work. MANHAJ is the core private AI operating-system product.</p></div><div class="related-links"><a href="https://ahmadbukhari.com/about" target="_blank" rel="noopener noreferrer">Ahmad Bukhari's profile →</a><a href="https://ahmadbukhari.com/work" target="_blank" rel="noopener noreferrer">Systems portfolio →</a><a href="https://manhaj.ahmadbukhari.com" target="_blank" rel="noopener noreferrer">MANHAJ product →</a></div></section>
  <section class="content-section"><div class="section-intro"><h2>Operating principles.</h2><p>These principles shape diagnosis, architecture, implementation, and handover.</p></div>${cards([["01","Business outcomes before tools","The workflow exists to move an operating metric, reduce a known risk, or improve a customer or team experience."],["02","Designed for failure","Recovery, human intervention, alerts, replay, and auditability are part of the first architecture—not a post-launch patch."],["03","Human judgment stays","AI handles repeatable interpretation and coordination. People own consequential decisions and accountability."],["04","Visible by default","State, actions, costs, quality, and exceptions must be inspectable by the people operating the system."],["05","Secure by design","Access is minimized, credentials are controlled, sensitive data is handled deliberately, and integrations respect the system boundary."],["06","Built to hand over","Documentation, ownership, permissions, and operating procedures let the client run and improve what it owns."]])}</section>
  ${cta(page)}`;
}

function processBody(page) {
  const steps = [["Find the constraint","Map the current process, revenue or workload impact, users, systems, data, failure modes, and baseline."],["Design the system","Define state, decisions, actions, ownership, integrations, permissions, exceptions, evidence, and success criteria."],["Ship a working slice","Build the highest-leverage route first, connect real systems carefully, and validate it with representative scenarios."],["Evaluate before expansion","Test quality, failure, security, cost, latency, human handoff, and business usefulness—not only the happy path."],["Release observably","Start with controlled traffic and monitor logs, alerts, model and tool outcomes, user experience, and operational exceptions."],["Hand over and improve","Document architecture and procedures, train owners, resolve the highest-value lessons, and version changes deliberately."]];
  return `${pageHero(page)}
  <section class="content-section"><div class="section-intro"><h2>Six stages from problem to operation.</h2><p>Scope and timing depend on the system, but the control points remain consistent.</p></div>${cards(steps.map(([title,text],index)=>[String(index+1).padStart(2,"0"),title,text]))}</section>
  <section class="content-section dark-section"><div class="section-intro"><h2>What every production handover should include.</h2><p>The system is not complete when the demo works. It is complete when responsible operators can understand, inspect, recover, and improve it.</p></div><div class="checklist"><article><h3 class="yes">Architecture and inventory</h3><p>Purpose, system map, components, data, integrations, owners, permissions, environments, and dependencies.</p></article><article><h3 class="yes">Evaluation evidence</h3><p>Representative cases, acceptance criteria, known limitations, model and tool failure, and release decision.</p></article><article><h3 class="yes">Operating procedures</h3><p>Normal operation, alerts, exception queues, human approval, replay, rollback, changes, and escalation.</p></article><article><h3 class="yes">Measurement</h3><p>Business outcome, reliability, quality, cost, latency, adoption, safety, and a schedule for review.</p></article></div></section>
  ${related([["Explore services","/services"],["Inspect case studies","/case-studies"],["MANHAJ methodology","https://manhaj.ahmadbukhari.com/foundation"]])}${cta(page)}`;
}

function caseStudyBody(page) {
  const proofLinks = page.links ? `<section class="content-section"><div class="related-links">${page.links.map(([label, href]) => `<a href="${href}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)} →</a>`).join("")}</div></section>` : "";
  const architecture = page.visual ? `<figure class="article-visual case-architecture"><img src="${page.visual}" alt="${escapeHtml(page.visualAlt)}" width="1600" height="1000" loading="eager" decoding="async"><figcaption>${escapeHtml(page.visualCaption)}</figcaption></figure>` : "";
  const decisionTable = page.decisions ? `<section class="content-section"><div class="section-intro"><h2>Why this architecture, not just this tool list.</h2><p>Each component owns a specific responsibility. Alternatives were rejected only where they added complexity or weakened the tested control boundary.</p></div><div class="prose"><table class="fact-table"><thead><tr><th>Responsibility</th><th>Choice</th><th>Why it fits</th><th>Alternative and constraint</th></tr></thead><tbody>${page.decisions.map(([responsibility, choice, reason, alternative]) => `<tr><th>${escapeHtml(responsibility)}</th><td>${escapeHtml(choice)}</td><td>${escapeHtml(reason)}</td><td>${escapeHtml(alternative)}</td></tr>`).join("")}</tbody></table></div></section>` : "";
  const frameworkGuide = page.frameworks ? `<section class="content-section"><div class="section-intro"><h2>What each framework is doing here.</h2><p>A framework earns its place by owning a clear responsibility in the system, not by appearing in a technology list.</p></div><div class="card-grid">${page.frameworks.map(([name, definition, use]) => `<article class="content-card"><span>Framework</span><h3>${escapeHtml(name)}</h3><p><strong>What it is:</strong> ${escapeHtml(definition)}</p><p><strong>Why it is here:</strong> ${escapeHtml(use)}</p></article>`).join("")}</div></section>` : "";
  const assurance = page.dataset ? `<section class="content-section dark-section"><div class="section-intro"><h2>Data, evaluation, and observability.</h2><p>The system is credible only when its input limits, release tests, and operating signals are visible together.</p></div><div class="prose"><h2>Dataset and model boundary</h2><p>${escapeHtml(page.dataset)}</p><h2>Evaluation protocol</h2><p>${escapeHtml(page.evaluation)}</p><h2>Observability and error monitoring</h2><p>${escapeHtml(page.observability)}</p></div></section>` : "";
  const liveScreen = page.proofKey ? `<section class="content-section product-proof-showcase case-live-proof"><div class="section-intro"><p class="eyebrow">Live interface</p><h2>Inspect the replay before the architecture.</h2><p>The screen below is the current public system using synthetic scenario data. It does not expose client production records or perform an external write.</p></div>${productProofFigure(page.proofKey, { className: "is-wide", loading: "eager" })}</section>` : "";
  return `${pageHero(page)}${liveScreen}${architecture}
  <section class="content-section"><div class="metric-band">${page.metrics.map(([value,label])=>`<div><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`).join("")}<div><strong>Evidence</strong><span>${escapeHtml(page.aside.replace("Evidence basis: ", ""))}</span></div></div><p class="evidence-label">Case-study figures describe this documented engagement and are not forecasts or guarantees.</p></section>
  <section class="content-section"><div class="prose"><h2>The operating constraint</h2><p>${escapeHtml(page.context)}</p><h2>The system Aixcel designed</h2><p>${escapeHtml(page.work)}</p><h2>The documented result</h2><p>${escapeHtml(page.result)}</p><h2>System components</h2><p>${escapeHtml(page.stack)}</p></div></section>
  ${frameworkGuide}${decisionTable}${assurance}
  ${proofLinks}
  <section class="content-section dark-section"><div class="section-intro"><h2>How to interpret this evidence.</h2><p>Names and sensitive details are withheld. Metrics retain their stated meaning and evidence label. A scope count is not converted into an outcome, and no engagement result is presented as a universal benchmark.</p></div></section>
  ${related([["All case studies","/case-studies"],["Related AI automation services","/services"],["Ahmad Bukhari's portfolio","https://ahmadbukhari.com/work"]])}${cta(page)}`;
}

function caseStudiesBody(page) {
  const items = caseStudies.map((study,index)=>[String(index+1).padStart(2,"0"),study.h1,study.description,study.path]);
  return `${pageHero(page)}<section class="content-section"><div class="section-intro"><h2>Published system evidence.</h2><p>Each page separates business context, delivered architecture, measured evidence, and interpretation limits.</p></div>${cards(items)}</section><section class="content-section dark-section"><div class="section-intro"><h2>What Aixcel will publish—and what it will not.</h2><p>Evidence is useful only when readers know what it means.</p></div><div class="checklist"><article><h3 class="yes">Clearly labelled</h3><p>Anonymized work, internal records, documented scope, and measured outcomes are identified as such.</p></article><article><h3 class="yes">Specific definitions</h3><p>Metrics retain their original meaning, context, and limits rather than being inflated into a larger claim.</p></article><article><h3 class="no">No borrowed credibility</h3><p>No invented logos, anonymous praise presented as fact, scraped reviews, or implied client endorsement.</p></article><article><h3 class="no">No result guarantees</h3><p>Past evidence informs an evaluation; it does not promise that another business will produce the same result.</p></article></div></section>${cta(page)}`;
}

function contactBody(page) {
  const book = escapeHtml(bookingUrl("contact_primary"));
  return `${pageHero(page)}<section class="content-section" id="engagement"><div class="section-intro"><h2>Choose the simplest useful starting point.</h2><p>You do not need a technical brief. A clear description of the bottleneck, the people affected, and what it costs is enough.</p></div><div class="card-grid"><article class="content-card"><span>01</span><h3>Book the systems audit</h3><p>Choose a time through Ahmad Bukhari's official Cal.com event. The call is 25 minutes and focused on diagnosis.</p><a href="${book}" target="_blank" rel="noopener noreferrer">Open the booking calendar →</a></article><article class="content-card"><span>02</span><h3>Send the messy part</h3><p>Email the current process, tools, failure, approximate volume, and the business outcome you want to improve.</p><a href="mailto:ahmadbukhari4245@gmail.com?subject=Aixcel%20AI%20systems%20brief">Email Ahmad Bukhari →</a></article><article class="content-card"><span>03</span><h3>Inspect the work first</h3><p>Review case evidence, verified public systems, and the delivery method before deciding whether the fit is strong.</p><a href="/work">Explore the Work hub →</a></article></div></section><section class="content-section dark-section"><div class="section-intro"><h2>A useful first message includes:</h2><p>Context helps the conversation begin at the operating problem instead of a generic list of AI tools.</p></div><div class="checklist"><article><h3 class="yes">The constraint</h3><p>What repeatedly breaks, waits, disappears, or requires manual compensation?</p></article><article><h3 class="yes">The environment</h3><p>Which teams, tools, data, channels, and approximate volumes are involved?</p></article><article><h3 class="yes">The outcome</h3><p>Which operating or customer metric should improve, and how is it measured today?</p></article><article><h3 class="yes">The boundaries</h3><p>What must remain human, what is sensitive, and which compliance or security rules apply?</p></article></div></section>`;
}

function policyBody(page) {
  const privacy = page.path === "/privacy";
  const content = privacy ? `<div class="prose">
    <h2>Who this notice covers</h2><p>Aixcel Solutions is a founder-led business operated by Ahmad Bukhari from Islamabad, Pakistan and serving clients worldwide. This notice covers the public website, direct enquiries, booking interactions, and information processed to evaluate or provide agreed services.</p>
    <h2>Information Aixcel may receive</h2><ul><li>Contact details and information you choose to include in an email, form, booking, call, or project brief.</li><li>For a free AEO audit, guide, or strategy-call request: the request type, your name, work email, company, website, approximate annual revenue range, role when requested, the question you want AI search to understand when requested, timing, consent record, available UTM and referring-page context, lifecycle status, next action, internal qualification notes, notification state, guide-download events, and matched booking events.</li><li>Systems Desk account identifiers, profile details, consent records, saved business problem briefs, and saved chat conversations. Supabase Auth processes and hashes account passwords; Aixcel does not receive or store the raw password.</li><li>For a one-time public presence audit: the company name and public website, LinkedIn company-page, or Instagram company-profile URLs you submit, plus the audit status, bounded public evidence, coverage record, PageSpeed metrics when available, and saved report.</li><li>Scheduling information processed through the linked Cal.com booking service.</li><li>Basic technical and security data such as request time, device or browser information, referring page, and network identifiers when collected by hosting or security providers. AI Visibility form abuse controls store only a short-lived one-way request fingerprint rather than the raw network identifier.</li><li>Business, system, user, and project information supplied under an agreed engagement.</li></ul>
    <h2>Why it is used</h2><p>Information is used to respond, schedule calls, assess fit, prepare and provide agreed services, maintain security, keep business records, improve operations, and comply with applicable obligations. Aixcel does not sell personal information.</p>
    <h2>Systems Desk, audit, and AI processing</h2><p>When you submit a Systems Desk question, the current problem brief, recent saved conversation history, and relevant approved Aixcel evidence are sent through Aixcel's server and OpenRouter to an available free model to produce an answer. Free-model providers may retain or use submitted content under their own policies, so do not submit passwords, credentials, health information, payment data, confidential client records, or anything you would not share with an external AI provider. Chat turns are saved to your account so the portal can restore conversation history. For the one-time public presence audit, Aixcel sends the public business identifiers you provide to Tavily for bounded public search and website extraction; Google PageSpeed may inspect the submitted website. The audit does not sign into or directly scrape social networks and does not receive private follower, engagement, or account analytics.</p>
    <h2>Service providers and international processing</h2><p>Vercel hosts the website and server functions and supplies signed service identity for the lead-storage connection. Supabase provides authentication and database services. Resend delivers request-related transactional email. OpenRouter routes Systems Desk model requests. Tavily provides bounded public search and website extraction. Google provides PageSpeed and may deliver website font files. Cal.com provides embedded booking and signed booking-event notifications. Email, communications, analytics if enabled, and project tools may also process information on Aixcel's behalf. Those providers may operate in other countries and apply their own infrastructure, terms, and contractual safeguards.</p>
    <h2>Retention and security</h2><p>Information is retained only as long as reasonably needed for the purpose, an active or prospective business relationship, security, records, disputes, or applicable obligations. Inactive AI Visibility leads marked lost, spam, or otherwise closed are scheduled for deletion or anonymization after 12 months unless an active relationship, dispute, security need, or applicable obligation requires longer retention. Aixcel uses proportionate access, credential, hosting, and operational controls, but no internet transmission or storage method is guaranteed completely secure.</p>
    <h2>Your choices</h2><p>You may ask what personal information Aixcel holds about you, request correction or deletion where applicable, object to certain use, or withdraw consent for future communications. Some records may need to be retained for security, contracts, or legal obligations.</p>
    <h2>Third-party links and updates</h2><p>This website links to Cal.com, AhmadBukhari.com, MANHAJ, LinkedIn, GitHub, n8n, and other external services. Their privacy practices apply when you visit them. Material changes to this notice will be published here with a new update date.</p>
  </div>` : `<div class="prose">
    <h2>Informational website</h2><p>The website describes Aixcel's services, approach, and selected evidence. It does not create a client relationship, statement of work, professional duty, or guarantee that a particular service is appropriate or available.</p>
    <h2>Accuracy and changes</h2><p>Aixcel aims to keep public information accurate but may change, correct, remove, or update content without notice. Examples, technology references, and case studies describe their stated context and should not be treated as universal benchmarks.</p>
    <h2>No result guarantee</h2><p>Search, citation, ranking, traffic, automation, AI, CRM, operational, and commercial results depend on external platforms, data, process, authority, adoption, market conditions, compliance, implementation, and other factors. AiXCEL does not guarantee that an answer engine will cite, rank, recommend, or send traffic to a business. Published observations and outcomes are not promises of future performance.</p>
    <h2>Your use of the website</h2><p>You may use the website and Systems Desk for lawful evaluation of Aixcel. Keep account credentials private, provide information you are permitted to share, and independently review AI output before relying on it. Do not interfere with the site, attempt unauthorized access, bypass quotas, introduce malicious code, misrepresent affiliation, or reuse content in a misleading or unlawful way.</p>
    <h2>AI output</h2><p>Systems Desk answers are generated from approved Aixcel evidence but can still be incomplete or wrong. They are informational, do not perform actions, and do not create a quote, guarantee, security representation, professional advice, or client commitment. Scope, pricing, access, integrations, and consequential decisions require human confirmation.</p>
    <h2>Intellectual property</h2><p>Unless stated otherwise, the website's original copy, visual design, diagrams, and branding belong to Aixcel Solutions or are used with permission. You may quote and link to reasonable portions with clear attribution; other reuse requires permission.</p>
    <h2>Third-party services</h2><p>Links to external sites and references to platforms do not imply control or endorsement. External services have their own terms, availability, security, and privacy practices.</p>
    <h2>Client engagements</h2><p>A signed proposal, statement of work, order, data-processing agreement, or other written engagement document controls the scope, fees, deliverables, responsibilities, intellectual property, confidentiality, warranties, and liability for client work. If it conflicts with these website terms, the signed agreement controls.</p>
    <h2>Liability</h2><p>To the extent permitted by applicable law, this website is provided without warranties and Aixcel is not responsible for indirect or consequential loss arising solely from reliance on public website content or an external link. Rights that cannot lawfully be excluded remain unaffected.</p>
  </div>`;
  return `${pageHero(page)}<section class="content-section"><p class="legal-note">This page is a transparent operational notice for website visitors. It is not a substitute for terms or privacy documents agreed for a specific client engagement.</p>${content}<div class="prose"><h2>Contact</h2><p>Email <a href="mailto:ahmadbukhari4245@gmail.com">ahmadbukhari4245@gmail.com</a> with questions or requests.</p></div></section>`;
}

function renderPage(page) {
  const body = page.type === "ai-visibility" ? aiVisibilityBody(page)
    : page.type === "workspace" ? workspaceBody(page)
    : page.type === "service" ? serviceBody(page)
    : page.path === "/services" ? servicesBody(page)
    : page.type === "work" ? workBody(page)
    : page.type === "about" ? aboutBody(page)
    : page.type === "process" ? processBody(page)
    : page.type === "case-study" ? caseStudyBody(page)
    : page.path === "/case-studies" ? caseStudiesBody(page)
    : page.type === "insight" ? insightBody(page)
    : page.path === "/insights" ? insightsBody(page)
    : page.type === "contact" ? contactBody(page)
    : page.type === "labs" ? agenticSystemsBody(page)
    : page.type === "policy" ? policyBody(page)
    : pageHero(page);
  return `${headFor(page)}
<body class="aixcel-site">
<a class="skip-link" href="#main-content">Skip to content</a>
${header(page.nav)}
<main class="detail-main" id="main-content" tabindex="-1">${body}</main>
${footer()}
${page.type === "ai-visibility" ? '<script src="/assets/ai-visibility.js"></script>' : ""}
<script>${siteMotionSource}</script>
<script>(()=>{document.querySelectorAll('.mobile-menu a').forEach(link=>link.addEventListener('click',()=>link.closest('details')?.removeAttribute('open')));})();</script>
</body>
</html>\n`;
}

function homepageAiEntryBase() {
  return `<section class="hero" id="top"><div class="hero-copy"><p class="eyebrow">AIEO / AEO / GEO for established service businesses</p><h1>See where your business <em>shows up in AI answers.</em></h1><p class="hero-intro">AiXCEL measures your visibility, shows which competitors are ahead, and turns technical, content, citation, and brand gaps into a clear AEO action plan.</p><div class="hero-actions"><a class="button button-primary" href="/services/ai-search-visibility#free-aeo-audit">Get your free AEO audit <span class="arrow-icon" aria-hidden="true"></span></a><a class="button button-secondary" href="/services/ai-search-visibility#what-you-get">See what the audit covers <span aria-hidden="true">↓</span></a></div><p class="cta-note">Free · no credit card · human reviewed · no ranking promises</p></div>${visualPlate("home", "editorial-plate home-atlas", "eager")}<div class="proof-bar" aria-label="AI Search Visibility scope"><div class="proof-item"><strong>AIEO</strong><span>full visibility system</span><small>Baseline through lead attribution</small></div><div class="proof-item"><strong>AEO</strong><span>answer clarity</span><small>Direct, supported, inspectable</small></div><div class="proof-item"><strong>GEO</strong><span>generative evidence</span><small>Entity, context, corroboration</small></div><div class="founder-proof"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><b></b></span><span>Founder reviewed by <strong>Ahmad Bukhari</strong><small>AI systems, sales, and operations context in one delivery relationship</small></span></div></div><p class="proof-disclaimer">AiXCEL improves accessibility, clarity, evidence, and measurement. External answer engines retain control of their results.</p></section><section class="featured-solutions" aria-labelledby="featured-solutions-title"><div class="featured-solutions-heading"><p class="eyebrow light">Featured solutions</p><h2 id="featured-solutions-title">One entry point. The wider operating stack remains available.</h2><p>Start with the free AEO audit. Move into managed visibility, governed execution, CRM, lead, voice, and workflow systems only when the business case requires them.</p></div><div class="featured-solution-grid"><article class="featured-solution-card is-primary"><span>01 · PRIMARY ENTRY</span><h3>AiXCEL AEO &amp; AI Visibility</h3><p>Visibility scoring, competitor analysis, prompt monitoring, technical audits, content actions, reporting, and lead measurement.</p><a href="/services/ai-search-visibility#free-aeo-audit">Get the free AEO audit →</a></article><article class="featured-solution-card"><span>02 · PRIVATE PILOT</span><h3>AiXCEL Operations Workspace</h3><p>A proposed QM-powered execution workspace with scopes, approval gates, evidence, verification, and client-owned systems of record.</p><a href="/solutions/ai-operations-workspace">Inspect the pilot boundary →</a></article></div></section>`;
}

function homepageAiEntry() {
  const liveProof = `<section class="home-product-proof" aria-labelledby="home-live-proof-title"><div class="section-intro"><p class="eyebrow light">Working proof</p><h2 id="home-live-proof-title">See the systems, not another slide deck.</h2><p>Open current product interfaces using public synthetic replays or visibly gated connections. Private customer records never appear in these captures.</p></div><div class="product-proof-grid is-three">${productProofFigure("marketing", { loading: "eager" })}${productProofFigure("revenue", { loading: "eager" })}${productProofFigure("manhaj")}</div></section>`;
  return `${homepageAiEntryBase()}${liveProof}`;
}

function homeSchema() {
  const faqItems = [
    ["What is AiXCEL AI Search Visibility?", "It is an evidence-first AIEO, AEO, and GEO service that improves technical access, entity clarity, answer-ready content, corroboration, monitoring, and lead attribution."],
    ["Can AiXCEL guarantee an AI recommendation?", "No. AiXCEL can improve accessibility, clarity, evidence, corroboration, and measurement, but external answer engines control their results."],
    ["What is the starting offer?", "The AI Visibility Baseline records a dated buyer-prompt set, observed answers and citations, technical and entity conditions, and attribution readiness before implementation is proposed."],
    ["Do the existing CRM and automation services remain available?", "Yes. CRM, lead, voice, workflow, intelligence, and related services remain available beneath the primary AI Search Visibility entry point."],
    ["Is the AiXCEL Operations Workspace already a client cloud?", "No. It is a private-pilot architecture. Customer tenancy, cloud access, identity, and provider integrations require separate implementation and acceptance evidence."],
  ];
  const graph = organizationGraph();
  graph.push({ "@type": "WebPage", "@id": `${origin}/#webpage`, url: `${origin}/`, name: "AI Search Visibility & AI Systems | AiXCEL Solutions", description: "AiXCEL helps service businesses become easier to find, understand, cite, and choose in AI search, then connects visibility to qualified lead operations.", isPartOf: { "@id": `${origin}/#website` }, about: { "@id": `${origin}/#organization` }, inLanguage: "en", dateModified: published });
  graph.push({ "@type": "Service", "@id": `${origin}/services/ai-search-visibility#service`, name: "AiXCEL AI Search Visibility", alternateName: ["AIEO", "AEO", "GEO"], url: `${origin}/services/ai-search-visibility`, description: "Evidence-first AI Search Visibility for service businesses, including technical access, entity clarity, answer-ready content, corroboration, monitoring, and lead attribution.", provider: { "@id": `${origin}/#organization` }, areaServed: "Worldwide" });
  graph.push({ "@type": "FAQPage", "@id": `${origin}/#faq`, mainEntity: faqItems.map(([name,text])=>({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) });
  return { "@context": "https://schema.org", "@graph": graph };
}

function buildHome() {
  const oldBooking = `${baseBooking}?utm_source=aixcel_website&amp;utm_medium=website&amp;utm_campaign=free_systems_audit`;
  const newBooking = escapeHtml(bookingUrl("homepage"));
  let home = sourceHome
    .replace("<title>Aixcel Solutions — AI systems for growing businesses</title>", "<title>AI Search Visibility &amp; AI Systems | AiXCEL Solutions</title>")
    .replace('content="Founder-led AI agency designing lead, CRM, voice, automation, and intelligence systems for growing businesses."', 'content="AiXCEL helps service businesses become easier to find, understand, cite, and choose in AI search, then connects visibility to qualified lead operations."')
    .replaceAll("Aixcel Solutions — AI systems for growing businesses", "AI Search Visibility &amp; AI Systems | AiXCEL Solutions")
    .replace('<meta property="og:url" content="https://aixcelsolutions.com/">', `<meta property="og:url" content="https://aixcelsolutions.com/">\n  <meta property="og:locale" content="en_US">\n  <meta property="og:image" content="${aiVisibilityOgImage}">\n  <meta property="og:image:type" content="image/png">\n  <meta property="og:image:width" content="1200">\n  <meta property="og:image:height" content="630">\n  <meta property="og:image:alt" content="AiXCEL AI Search Visibility: AIEO, AEO and GEO">`)
    .replace('<meta name="twitter:card" content="summary">', '<meta name="twitter:card" content="summary_large_image">')
    .replace('</head>', `  <meta name="twitter:image" content="${aiVisibilityOgImage}">\n  <meta name="twitter:image:alt" content="AiXCEL AI Search Visibility: AIEO, AEO and GEO">\n  <link rel="stylesheet" href="/assets/ai-visibility.css">\n</head>`)
    .replaceAll(oldBooking, newBooking)
    .replaceAll('summary aria-label="Open navigation"', 'summary aria-label="Menu"')
    .replaceAll('href="#top"', 'href="/"')
    .replaceAll("rgba(251, 248, 242, 0.55)", "rgba(251, 248, 242, 0.78)")
    .replaceAll("rgba(251, 248, 242, 0.62)", "rgba(251, 248, 242, 0.78)")
    .replaceAll("rgba(251, 248, 242, 0.66)", "rgba(251, 248, 242, 0.78)")
    .replaceAll("rgba(251, 248, 242, 0.68)", "rgba(251, 248, 242, 0.78)")
    .replaceAll("Explore the Manhaj product", "Explore the MANHAJ product")
    .replace(/<style>[\s\S]*?<\/style>/i, `<style>${style}</style>`)
    .replace(/<a class="header-cta"([^>]*)>([\s\S]*?)<\/a><details class="mobile-menu">/, `<div class="header-tools">${themeToggle()}<a class="header-cta"$1>$2</a></div><details class="mobile-menu">`)
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/i, `<script type="application/ld+json">${JSON.stringify(homeSchema()).replaceAll("<", "\\u003c")}</script>`)
    .replace(/<nav class="desktop-nav" aria-label="Primary navigation">[\s\S]*?<\/nav>/, '<nav class="desktop-nav" aria-label="Primary navigation"><a href="/services/ai-search-visibility">AI Search</a><a href="/services">Services</a><a href="/systems-desk">Systems Desk</a><a href="/labs/agentic-systems">Labs</a><a href="/case-studies">Case studies</a><a href="/insights">Insights</a><a href="/about">About</a></nav>')
    .replace(/<details class="mobile-menu"><summary[\s\S]*?<\/details>/, `<details class="mobile-menu"><summary aria-label="Menu">Menu</summary><nav aria-label="Mobile navigation"><a href="/services">Services</a><a href="/systems-desk">Systems Desk</a><a href="/labs/agentic-systems">Agentic systems lab</a><a href="/case-studies">Case studies</a><a href="/insights">Insights</a><a href="/process">Process</a><a href="/about">About</a><a href="${newBooking}" target="_blank" rel="noopener noreferrer">Book a strategy call <span class="arrow-icon" aria-hidden="true"></span></a></nav></details>`)
    .replace(/<footer class="site-footer">[\s\S]*?<\/footer>/, footer())
    .replaceAll('href="https://ahmadbukhari.com" target="_blank"', 'href="https://ahmadbukhari.com/about" target="_blank"')
    .replace('href="https://ahmadbukhari.com/work/migration-factory"', 'href="/case-studies/automation-migration"')
    .replace(
      'src="https://ahmadbukhari.com/ahmad-consultation.webp" loading="lazy" decoding="async" alt="Ahmad Bukhari in a consultation setting" width="720" height="900"',
      'src="/assets/ahmad-bukhari.svg" loading="lazy" decoding="async" alt="Ahmad Bukhari, founder of Aixcel Solutions" width="600" height="600"',
    );

  home = home.replace(/<section class="hero" id="top">[\s\S]*?<\/section><section class="leaks"/, `${homepageAiEntry()}<section class="leaks"`);
  home = home.replace(/<header class="site-header">[\s\S]*?<\/header>/, header(""));
  const homeServiceMap = `<div class="home-service-map" aria-label="AiXCEL service system visuals">${servicePages.map((item, index) => `<a href="${item.path}" class="home-service-visual${index === 0 ? " is-primary" : ""}">${serviceVisual(item, true)}<span>${escapeHtml(item.eyebrow)}</span></a>`).join("")}</div>`;
  home = home.replace('<div class="service-list">', `${homeServiceMap}<div class="service-list">`);
  const directory = `<div class="service-directory-inline" aria-label="Detailed AI services"><a href="/services/ai-search-visibility">AI Search Visibility · AIEO / AEO / GEO</a><a href="/solutions/ai-operations-workspace">Operations Workspace · private pilot</a><a href="/services/ai-lead-generation">AI lead generation &amp; appointment setting</a><a href="/services/crm-automation">CRM automation</a><a href="/services/voice-ai">Voice AI agents</a><a href="/services/agentic-workflows">Agentic workflows</a><a href="/services">Compare all services</a></div>`;
  home = home.replace('<div class="service-cta">', `${directory}<div class="service-cta">`);
  home = home.replace('<div class="case-grid">', '<div class="work-hub-entry"><p>Case studies, verified public systems, and delivery controls now live in one evaluation path.</p><a href="/work">Explore the complete Work hub →</a></div><div class="case-grid">');
  home = home.replace('<div class="case-stack"><span>CRM</span><span>Dialer</span><span>Workflow automation</span><span>Slack</span></div></article>', '<div class="case-stack"><span>CRM</span><span>Dialer</span><span>Workflow automation</span><span>Slack</span></div><a class="case-link" href="/case-studies/lead-operations">Read the evidence →</a></article>');
  home = home.replace('<div class="case-stack"><span>n8n</span><span>Airtable</span><span>APIs</span><span>Looker Studio</span></div></article>', '<div class="case-stack"><span>n8n</span><span>Airtable</span><span>APIs</span><span>Looker Studio</span></div><a class="case-link" href="/case-studies/business-intelligence">Read the evidence →</a></article>');
  return home.replace("</body>", `<script>${siteMotionSource}</script></body>`);
}

function sitemap() {
  const entries = ["/", "/systems-desk", ...pages.filter((page) => !page.previewGated || aiVisibilityRelease).map((page) => page.path)];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.map((path) => `  <url><loc>${pageUrl(path)}</loc><lastmod>${published}</lastmod></url>`).join("\n")}\n</urlset>\n`;
}

function llmsText() {
  return `# AiXCEL Solutions\n\n> AiXCEL is a founder-led AI Search Visibility and automation company. Its primary entry service combines AIEO, AEO, GEO, evidence-led content, monitoring, lead attribution, and human-owned follow-up for established service businesses.\n\n## Primary pages\n- [Services](${origin}/services): AI Search Visibility plus lead, CRM, voice, and governed agentic workflow services.\n- [Work](${origin}/work): Case evidence, verified public systems, and the delivery method in one evaluation hub.\n- [Insights](${origin}/insights): Evidence-backed field notes for operators building controlled AI systems.\n- [About](${origin}/about): Company and founder identity.\n- [Contact](${origin}/contact): Official booking and email paths.\n\n## Service routes\n- [AI Search Visibility](${origin}/services/ai-search-visibility): AIEO, AEO, GEO, technical access, entity clarity, evidence, monitoring, attribution, and the AI Visibility Baseline.\n- [AI Operations Workspace](${origin}/solutions/ai-operations-workspace): Private-pilot QM execution workspace with approval, evidence, and client-owned system boundaries.\n- [AI lead generation and appointment setting](${origin}/services/ai-lead-generation): Lead capture, qualification, follow-up, routing, booking, and CRM state.\n- [CRM automation](${origin}/services/crm-automation): Lifecycle architecture, pipeline automation, data quality, attribution, and handoffs.\n- [Voice AI](${origin}/services/voice-ai): Inbound and approved outbound voice agents with human handoff, testing, and controls.\n- [Agentic workflows](${origin}/services/agentic-workflows): Bounded AI agents, n8n and API workflows, approvals, recovery, and observability.\n\n## Work evidence\n- [Case studies](${origin}/case-studies): Clearly labelled anonymized evidence, public technical briefs, and documented system scope.\n- [Agentic systems lab](${origin}/labs/agentic-systems): Seven verified public systems with source, contracts, evaluation, observability, replay, and deployment proof.\n- [Delivery process](${origin}/process): How AiXCEL audits, designs, builds, evaluates, releases, and hands over AI systems.\n\n## AI Search field guides\n- [AIEO, AEO and GEO explained](${origin}/insights/aieo-aeo-geo-explained): A plain-English category and operating model.\n- [How to measure AI Search Visibility](${origin}/insights/measure-ai-search-visibility): Prompt, citation, accuracy, referral, lead, and commercial evidence states.\n- [From AI citation to qualified lead](${origin}/insights/ai-citation-to-qualified-lead): First-party lead capture, booking events, lifecycle state, and attribution.\n\n## Utility\n- [Systems Desk](${origin}/systems-desk): A signed-in, evidence-grounded diagnostic desk for operating problems, service fit, and bounded workflow mapping.\n\n## Connected entities\n- [Ahmad Bukhari](https://ahmadbukhari.com/about): Founder and Agentic AI and LLM Systems Specialist.\n- [MANHAJ](https://manhaj.ahmadbukhari.com): AiXCEL's private AI operating-system methodology.\n- [Verified n8n creator profile](https://n8n.io/creators/ahmadbukhari/)\n\n## Evidence policy\nAiXCEL separates observed answers, source citations, measured outcomes, implementation scope, and commercial inference. It does not publish invented testimonials, client logos, universal AI visibility scores, ranking guarantees, or guaranteed recommendations.\n`;
}

function notFoundPage() {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | Aixcel Solutions</title><meta name="robots" content="noindex,follow"><meta name="description" content="The requested Aixcel Solutions page could not be found."><meta name="theme-color" content="#f4f0e8"><script>(()=>{try{const k="aixcel-color-theme",v=localStorage.getItem(k),m=matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.dataset.theme=v==="light"||v==="dark"?v:m?"dark":"light"}catch{document.documentElement.dataset.theme="light"}})();</script><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><style>${style}</style><script defer src="/assets/theme.js"></script></head><body class="aixcel-site"><a class="skip-link" href="#main-content">Skip to content</a>${header("")}<main class="detail-main" id="main-content"><section class="page-hero"><div class="page-hero-copy"><p class="eyebrow">404 · page not found</p><h1>This route does not exist.</h1><p class="page-deck">Explore Aixcel's AI automation services, system evidence, or contact page instead.</p><div class="hero-actions"><a class="button button-primary" href="/services">Explore services <span class="arrow-icon" aria-hidden="true"></span></a><a class="button button-secondary" href="/">Return home</a></div></div></section></main>${footer()}</body></html>\n`;
}

function socialImagePng() {
  const width = 1200;
  const height = 630;
  const pixels = Buffer.alloc(width * height * 4);
  const palette = { paper: [244, 240, 232, 255], ink: [27, 27, 26, 255], purple: [80, 44, 82, 255], dark: [50, 27, 52, 255], lime: [200, 255, 46, 255], soft: [223, 216, 205, 255] };
  const pixel = (x, y, color) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const offset = (Math.floor(y) * width + Math.floor(x)) * 4;
    pixels[offset] = color[0]; pixels[offset + 1] = color[1]; pixels[offset + 2] = color[2]; pixels[offset + 3] = color[3];
  };
  const rect = (x, y, w, h, color) => {
    for (let yy = Math.max(0, y); yy < Math.min(height, y + h); yy++) for (let xx = Math.max(0, x); xx < Math.min(width, x + w); xx++) pixel(xx, yy, color);
  };
  const line = (x0, y0, x1, y1, color, thickness = 2) => {
    const dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
    const dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
    let error = dx + dy;
    while (true) {
      rect(x0 - Math.floor(thickness / 2), y0 - Math.floor(thickness / 2), thickness, thickness, color);
      if (x0 === x1 && y0 === y1) break;
      const twice = 2 * error;
      if (twice >= dy) { error += dy; x0 += sx; }
      if (twice <= dx) { error += dx; y0 += sy; }
    }
  };
  const circle = (cx, cy, radius, color, inner = null) => {
    const r2 = radius * radius;
    const inner2 = inner == null ? -1 : inner * inner;
    for (let y = cy - radius; y <= cy + radius; y++) for (let x = cx - radius; x <= cx + radius; x++) {
      const d = (x - cx) ** 2 + (y - cy) ** 2;
      if (d <= r2 && d >= inner2) pixel(x, y, color);
    }
  };
  const font = {
    A:["01110","10001","10001","11111","10001","10001","10001"],B:["11110","10001","10001","11110","10001","10001","11110"],C:["01111","10000","10000","10000","10000","10000","01111"],D:["11110","10001","10001","10001","10001","10001","11110"],E:["11111","10000","10000","11110","10000","10000","11111"],F:["11111","10000","10000","11110","10000","10000","10000"],G:["01111","10000","10000","10111","10001","10001","01110"],I:["11111","00100","00100","00100","00100","00100","11111"],L:["10000","10000","10000","10000","10000","10000","11111"],M:["10001","11011","10101","10101","10001","10001","10001"],N:["10001","11001","10101","10011","10001","10001","10001"],O:["01110","10001","10001","10001","10001","10001","01110"],R:["11110","10001","10001","11110","10100","10010","10001"],S:["01111","10000","10000","01110","00001","00001","11110"],T:["11111","00100","00100","00100","00100","00100","00100"],U:["10001","10001","10001","10001","10001","10001","01110"],W:["10001","10001","10001","10101","10101","10101","01010"],X:["10001","10001","01010","00100","01010","10001","10001"],Y:["10001","10001","01010","00100","00100","00100","00100"]," ":["00000","00000","00000","00000","00000","00000","00000"]
  };
  const drawText = (value, x, y, scale, color) => {
    let cursor = x;
    for (const character of value) {
      const glyph = font[character] ?? font[" "];
      glyph.forEach((row, gy) => [...row].forEach((bit, gx) => { if (bit === "1") rect(cursor + gx * scale, y + gy * scale, scale, scale, color); }));
      cursor += 6 * scale;
    }
  };

  rect(0, 0, width, height, palette.paper);
  rect(790, 0, 410, height, palette.dark);
  for (let x = 810; x < 1200; x += 44) line(x, 0, x, height, [70, 42, 73, 255], 1);
  for (let y = 14; y < height; y += 44) line(790, y, width, y, [70, 42, 73, 255], 1);
  line(80, 78, 710, 78, palette.purple, 3);
  drawText("AIXCEL", 80, 128, 14, palette.purple);
  drawText("SOLUTIONS", 82, 248, 6, palette.ink);
  line(82, 330, 620, 330, palette.soft, 2);
  drawText("AI SYSTEMS FOR", 82, 382, 5, palette.ink);
  drawText("GROWING BUSINESSES", 82, 432, 5, palette.ink);
  drawText("FOUNDER LED   BUILT TO OWN", 82, 526, 3, palette.purple);
  const nodes = [[858,98],[1088,124],[942,270],[1134,336],[844,478],[1054,526]];
  [[0,2],[1,2],[1,3],[2,3],[2,4],[2,5],[3,5],[4,5]].forEach(([a,b]) => line(nodes[a][0],nodes[a][1],nodes[b][0],nodes[b][1],palette.lime,3));
  nodes.forEach(([x,y], index) => { circle(x,y,index === 2 ? 29 : 17,palette.paper); circle(x,y,index === 2 ? 20 : 10,index === 2 ? palette.lime : palette.purple); });
  circle(790, 315, 11, palette.lime);

  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    const row = y * (width * 4 + 1);
    raw[row] = 0;
    pixels.copy(raw, row + 1, y * width * 4, (y + 1) * width * 4);
  }
  const crcTable = Array.from({ length: 256 }, (_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
  });
  const crc32 = (buffer) => {
    let c = 0xffffffff;
    for (const byte of buffer) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
  const chunk = (type, data) => {
    const typeBuffer = Buffer.from(type);
    const length = Buffer.alloc(4); length.writeUInt32BE(data.length);
    const checksum = Buffer.alloc(4); checksum.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])));
    return Buffer.concat([length, typeBuffer, data, checksum]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from("89504e470d0a1a0a", "hex"), chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}

const writePublicFile = (path, value) => writeFile(path, publicText(value), "utf8");

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await cp(join(sourceDir, "assets"), join(outputDir, "assets"), { recursive: true });
await mkdir(join(outputDir, "guides"), { recursive: true });
await cp(join(sourceDir, "assets", "guides"), join(outputDir, "guides"), { recursive: true });
await writeFile(join(outputDir, "assets", "og-aixcel.png"), socialImagePng());
await writePublicFile(join(outputDir, "apex.html"), buildHome());
await writePublicFile(join(outputDir, "systems-desk.html"), systemsDeskSource);
await writePublicFile(join(outputDir, "lead-desk.html"), leadDeskSource);
await writePublicFile(join(outputDir, "signal.html"), signalSource);
await writePublicFile(join(outputDir, "login.html"), signalLoginSource);
await writePublicFile(join(outputDir, "workspace.html"), signalWorkspaceSource);
await writePublicFile(join(outputDir, "pricing.html"), signalPricingSource);
await writePublicFile(join(outputDir, "method.html"), signalMethodSource);
await writePublicFile(join(outputDir, "audit.html"), signalAuditSource);
for (const page of pages) {
  const file = join(outputDir, `${page.path.slice(1)}.html`);
  await mkdir(dirname(file), { recursive: true });
  await writePublicFile(file, renderPage(page));
}
await writePublicFile(join(outputDir, "404.html"), notFoundPage());
await writePublicFile(join(outputDir, "apex-robots.txt"), `User-agent: *\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: ChatGPT-User\nAllow: /\n\nUser-agent: GPTBot\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: ClaudeBot\nAllow: /\n\nUser-agent: Applebot-Extended\nAllow: /\n\nUser-agent: Google-Extended\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\nHost: ${origin}\n`);
await writePublicFile(join(outputDir, "apex-sitemap.xml"), sitemap());
await writePublicFile(join(outputDir, "signal-robots.txt"), `User-agent: *\nAllow: /\nDisallow: /login\nDisallow: /workspace\n\nSitemap: https://signal.aixcelsolutions.com/sitemap.xml\nHost: https://signal.aixcelsolutions.com\n`);
await writePublicFile(join(outputDir, "signal-sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://signal.aixcelsolutions.com/</loc><lastmod>${published}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>\n  <url><loc>https://signal.aixcelsolutions.com/method</loc><lastmod>${published}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n  <url><loc>https://signal.aixcelsolutions.com/pricing</loc><lastmod>${published}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n  <url><loc>https://signal.aixcelsolutions.com/audit</loc><lastmod>${published}</lastmod><changefreq>monthly</changefreq><priority>0.9</priority></url>\n</urlset>\n`);
await writePublicFile(join(outputDir, "llms.txt"), llmsText()
  .replace("AI systems architect Ahmad Bukhari", "Agentic AI & LLM Systems Specialist Ahmad Bukhari")
  .replace("Founder and AI systems architect.", "Founder and Agentic AI & LLM Systems Specialist.")
  .replace("## Primary pages\n", `## Primary pages\n- [Systems Desk](${origin}/systems-desk): A signed-in, evidence-grounded diagnostic desk for operating problems, service fit, and bounded workflow mapping.\n- [Agentic systems lab](${origin}/labs/agentic-systems): Ten verified public systems with source, contracts, evaluation, observability, replay, and deployment proof.\n`)
  .replace("## Field notes\n", `## Field notes\n* [AI release notes as owned change requests](${origin}/insights/aireleasenoteworkflowchange): How to compare workflow, scope, control, cost, and evidence before a product release changes production work.\n- [Reversible AI tool adoption](${origin}/insights/reversibleaitooladoption): How to preserve ownership, evidence, cost boundaries, recoverable operating assets, and a tested exit before an AI tool earns renewal.\n- [Voice draft rejection path](${origin}/insights/voicedraftrejectionpath): How to give captured speech accept, correct, and reject outcomes before a CRM record changes.\n- [Evidence read depth for research briefs](${origin}/insights/evidencereaddepthforresearchbriefs): How to show the paper version, sections examined, limiting evidence, and named reviewer behind a material research claim.\n- [Workflow memory and current authority](${origin}/insights/rememberthemethodrecheckauthority): What a personal AI may carry forward and what must be checked again before action.\n- [Retrieval receipt for embedding search](${origin}/insights/similarityneedsretrievalreceipt): How to show the source, version, access rule, filters, and owner behind a consequential AI answer.\n- [Ownership clock for an AI follow up queue](${origin}/insights/followupownershipclock): How to measure time from a qualified sales signal to accepted human ownership.\n- [Decision trace before CRM action](${origin}/insights/meetingdecisiontracebeforecrm): How to test whether proposals, objections, conditions, revisions, owners, and commitments survive in AI meeting notes.\n- [Evidence weight before an AI decision](${origin}/insights/sourceevidencebeforeaidecision): What an announcement, documentation, controlled test, production record, and measured outcome can safely support.\n- [Voice draft attribution](${origin}/insights/voicedraftattributionbeforecrm): Why dictated field notes need observed, reported, inferred, and promised labels before a CRM commit.\n- [Visible incident authority](${origin}/insights/deterministicincidentdetectionbeforellmexplanation): Why explicit rules should declare incidents before a language model explains the evidence.\n- [Support agent evaluator calibration](${origin}/insights/supportagentevaluationbeforelaunch): How to test an automated judge against expert labels before it influences a release decision.\n- [A new AI model is not a business case](${origin}/insights/new-ai-model-business-case-workflow-evaluation): A bounded workflow-evaluation framework for model adoption.\n`));
await writePublicFile(join(outputDir, "b1ec9a276d8f4d568508e4b4d0048c2b.txt"), "b1ec9a276d8f4d568508e4b4d0048c2b");
await mkdir(join(outputDir, ".well-known"), { recursive: true });
await writePublicFile(join(outputDir, ".well-known", "security.txt"), `Contact: mailto:ahmadbukhari4245@gmail.com\nPreferred-Languages: en\nCanonical: ${origin}/.well-known/security.txt\nExpires: 2027-07-22T00:00:00.000Z\n`);
await mkdir(join(outputDir, "server"), { recursive: true });
await cp(join(repo, "sites", "worker.mjs"), join(outputDir, "server", "index.js"));
await cp(join(repo, "server", "ai-visibility-core.mjs"), join(outputDir, "server", "ai-visibility-core.mjs"));

console.log(`Built ${pages.length + 8} pages (${aiVisibilityRelease ? "public AI Visibility release" : "private AI Visibility preview"}) in ${outputDir}`);
