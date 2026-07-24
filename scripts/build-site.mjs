import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = join(repo, "site");
const outputDir = join(repo, "dist");
const origin = "https://aixcelsolutions.com";
const published = "2026-07-24";
const ogImage = `${origin}/assets/og-aixcel.png`;
const baseBooking = "https://cal.com/ahmad-bukhari/ai-consultancy-call-with-ab";

if (!outputDir.startsWith(`${repo}${sep}`) || relative(repo, outputDir) !== "dist") {
  throw new Error(`Refusing to clear unexpected output path: ${outputDir}`);
}

const sourceHome = await readFile(join(sourceDir, "index.html"), "utf8");
const styleMatch = sourceHome.match(/<style>([\s\S]*?)<\/style>/i);
if (!styleMatch) throw new Error("The production homepage must contain its base <style> block.");

const detailCss = String.raw`
.site-footer{grid-template-columns:.8fr 1.2fr}
.footer-links{grid-template-columns:repeat(3,minmax(0,1fr));gap:30px}
.footer-links a{width:auto}
.service-directory-inline{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:1px;margin-top:42px;background:rgba(244,240,232,.24);border:1px solid rgba(244,240,232,.24)}
.service-directory-inline a{min-height:82px;display:flex;align-items:center;padding:18px;background:var(--aubergine-dark);color:rgba(251,248,242,.86);font-size:13px;line-height:1.35;transition:background 180ms ease,color 180ms ease}
.service-directory-inline a:hover{background:rgba(255,255,255,.08);color:var(--lime)}
.detail-main{padding-bottom:0}
.breadcrumbs{width:min(1160px,calc(100% - 72px));margin:0 auto;padding-top:34px;color:var(--stone);font-family:var(--font-geist-mono,"SFMono-Regular",Consolas,monospace);font-size:12px}
.breadcrumbs ol{display:flex;flex-wrap:wrap;gap:8px;margin:0;padding:0;list-style:none}
.breadcrumbs li+li::before{margin-right:8px;content:"/";opacity:.5}
.breadcrumbs a{text-decoration:underline;text-underline-offset:4px}
.page-hero{width:min(1160px,calc(100% - 72px));margin:0 auto;padding:74px 0 88px;display:grid;grid-template-columns:minmax(0,1.35fr) minmax(280px,.65fr);gap:72px;align-items:end}
.page-hero h1{max-width:850px;margin:0;font-size:clamp(52px,6.2vw,88px);font-weight:430;letter-spacing:-.055em;line-height:.96}
.page-hero h1 em{font-family:var(--serif);font-weight:400}
.page-hero-copy>.eyebrow{margin-bottom:24px}
.page-deck{max-width:760px;margin:30px 0 0;font-size:clamp(18px,2vw,22px);line-height:1.55}
.hero-aside{padding:28px;border:1px solid var(--line);background:rgba(255,255,255,.28)}
.hero-aside strong{display:block;margin-bottom:14px;color:var(--aubergine);font-family:var(--font-geist-mono,"SFMono-Regular",Consolas,monospace);font-size:11px;letter-spacing:.1em;text-transform:uppercase}
.hero-aside p{margin:0;font-size:15px;line-height:1.65}
.hero-aside .button{width:100%;margin-top:24px}
.answer-band{background:var(--lime);color:var(--ink)}
.answer-inner{width:min(1160px,calc(100% - 72px));margin:0 auto;padding:44px 0;display:grid;grid-template-columns:220px 1fr;gap:50px}
.answer-inner strong{font-family:var(--font-geist-mono,"SFMono-Regular",Consolas,monospace);font-size:12px;letter-spacing:.12em;text-transform:uppercase}
.answer-inner p{max-width:850px;margin:0;font-family:var(--serif);font-size:clamp(25px,3vw,38px);line-height:1.2}
.content-section{width:min(1160px,calc(100% - 72px));margin:0 auto;padding:100px 0}
.content-section+.content-section{border-top:1px solid var(--line)}
.section-intro{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(280px,.55fr);gap:70px;align-items:end;margin-bottom:54px}
.section-intro h2{max-width:760px;margin:0;font-size:clamp(40px,5vw,66px);font-weight:430;letter-spacing:-.045em;line-height:1}
.section-intro p{margin:0;font-size:16px;line-height:1.7}
.card-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-top:1px solid var(--ink)}
.content-card{min-height:250px;padding:32px 30px 36px 0;border-right:1px solid var(--line)}
.content-card+.content-card{padding-left:30px}
.content-card:last-child{border-right:0}
.content-card>span{color:var(--aubergine);font-family:var(--font-geist-mono,"SFMono-Regular",Consolas,monospace);font-size:11px;font-weight:700}
.content-card h3{margin:42px 0 16px;font-family:var(--serif);font-size:30px;font-weight:400;line-height:1.08}
.content-card p{margin:0;color:#47433f;font-size:14px;line-height:1.65}
.content-card a{display:inline-block;margin-top:22px;color:var(--aubergine);font-weight:650;text-decoration:underline;text-underline-offset:5px}
.dark-section{max-width:none;width:100%;padding:100px max(36px,calc((100vw - 1160px)/2));background:var(--aubergine-dark);color:var(--paper-bright)}
.dark-section .section-intro p,.dark-section .content-card p{color:rgba(251,248,242,.82)}
.dark-section .content-card{border-color:rgba(244,240,232,.25)}
.dark-section .card-grid{border-color:rgba(244,240,232,.55)}
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
@media(max-width:980px){.article-layout{grid-template-columns:1fr;gap:36px}.article-sources{position:static}.article-visual{width:min(100% - 72px,1160px)}}
@media(max-width:680px){.article-visual,.article-byline{width:calc(100% - 40px)}.field-note-mark{top:12px;left:12px;padding:8px 9px;font-size:8px}.field-note-mark img{width:18px;height:18px}.article-prose p,.article-prose li{font-size:16px}}
@media(max-width:980px){.service-directory-inline{grid-template-columns:repeat(2,minmax(0,1fr))}.page-hero,.section-intro,.cta-grid{grid-template-columns:1fr}.page-hero{gap:40px}.answer-inner{grid-template-columns:1fr;gap:18px}.card-grid{grid-template-columns:1fr}.content-card,.content-card+.content-card{min-height:0;padding:30px 0;border-right:0;border-bottom:1px solid var(--line)}.process-list{grid-template-columns:repeat(2,minmax(0,1fr))}.metric-band{grid-template-columns:1fr}.metric-band>div{border-right:0;border-bottom:1px solid rgba(244,240,232,.25)}.related-links{grid-template-columns:1fr}}
@media(max-width:680px){.footer-links{grid-template-columns:1fr 1fr}.service-directory-inline{grid-template-columns:1fr}.breadcrumbs,.page-hero,.answer-inner,.content-section{width:min(100% - 40px,1160px)}.page-hero{padding:52px 0 68px}.page-hero h1{font-size:clamp(43px,13vw,64px)}.content-section,.dark-section{padding-top:72px;padding-bottom:72px}.dark-section,.cta-band{padding-left:20px;padding-right:20px}.checklist,.process-list{grid-template-columns:1fr}.process-list article{min-height:0;border-right:0;border-bottom:1px solid var(--line)}.metric-band>div{padding:34px 24px}.fact-table th,.fact-table td{display:block;width:100%;padding:12px 0}.fact-table th{padding-top:22px;border-bottom:0}.related-links a{min-height:90px}}
`;

const style = `${styleMatch[1]}\n${detailCss}`;

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const bookingUrl = (content) => `${baseBooking}?utm_source=aixcel_website&utm_medium=organic&utm_campaign=free_systems_audit&utm_content=${encodeURIComponent(content)}`;

const pages = [];
const register = (page) => { pages.push(page); return page; };

const servicePages = [
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
  title: "AI Automation Services & AI Systems | Aixcel Solutions",
  description: "Explore Aixcel's AI automation services: lead generation and appointment setting, CRM automation, voice AI, and governed agentic workflows.",
  eyebrow: "AI automation agency · services",
  h1: "AI automation services built around business outcomes.",
  deck: "Aixcel Solutions is a founder-led AI automation agency for growing businesses. We design connected AI systems for revenue and operations, then make them observable, recoverable, documented, and usable by the team that owns the result.",
  answer: "A capable AI automation agency should connect business goals to data, workflow state, AI decisions, human ownership, integrations, testing, security, observability, and measurable operating outcomes—not simply install isolated tools.",
  aside: "Start with the constraint: missed demand, unreliable follow-up, disconnected CRM state, repetitive multi-tool work, or a voice channel your team cannot cover consistently.",
});

register({
  path: "/about",
  nav: "about",
  type: "about",
  title: "About Aixcel Solutions & Founder Ahmad Bukhari",
  description: "Meet Aixcel Solutions, a founder-led AI automation agency created by AI systems architect Ahmad Bukhari in Islamabad and serving clients worldwide.",
  eyebrow: "About Aixcel Solutions",
  h1: "Business context first. Systems discipline all the way through.",
  deck: "Aixcel Solutions is a founder-led AI automation agency created by Ahmad Bukhari. It brings sales, operations, CRM, automation, and AI architecture into one accountable delivery relationship.",
  answer: "Aixcel designs and implements AI systems for growing businesses, with particular depth in lead operations, CRM automation, voice AI, agentic workflows, integration architecture, and operational reliability.",
  aside: "Based in Islamabad, Pakistan. Working globally. The founder who diagnoses the problem remains close to architecture, testing, and handover.",
});

register({
  path: "/process",
  nav: "process",
  type: "process",
  title: "AI Automation Consulting & Delivery Process | Aixcel",
  description: "See how Aixcel audits, designs, builds, tests, launches, documents, and improves production AI automation and AI systems.",
  eyebrow: "How Aixcel works",
  h1: "Strategy stays close enough to the build to remain honest.",
  deck: "Every Aixcel engagement connects the business case, architecture, operator experience, evaluation, release, and ownership. The work is delivered in measurable slices instead of disappearing into a long speculative build.",
  answer: "Aixcel's delivery method moves from constraint mapping to system design, controlled implementation, real-scenario testing, observable release, documentation, and continuous improvement with a named business owner.",
  aside: "The first conversation is a focused systems audit: identify the constraint, pressure-test whether AI is appropriate, and define the first useful move.",
});

const caseStudies = [
  register({
    path: "/case-studies/lead-operations",
    nav: "case-studies",
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
    nav: "case-studies",
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
    nav: "case-studies",
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
];

register({
  path: "/case-studies",
  nav: "case-studies",
  type: "collection",
  title: "AI Automation Case Studies & System Evidence | Aixcel",
  description: "Inspect anonymized Aixcel AI automation case studies covering lead operations, multi-channel business intelligence, and a Make-to-n8n migration architecture.",
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

const pageByPath = new Map(pages.map((page) => [page.path, page]));

function pageUrl(path) {
  return path === "/" ? `${origin}/` : `${origin}${path}`;
}

function breadcrumbFor(page) {
  const items = [["Home", "/"]];
  if (page.path.startsWith("/services/") ) items.push(["Services", "/services"]);
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
      knowsAbout: ["AI automation", "AI systems", "AI lead generation", "appointment setting", "CRM automation", "voice AI", "agentic workflows", "business process automation"],
    },
    {
      "@type": "Person",
      "@id": "https://ahmadbukhari.com/#person",
      name: "Ahmad Bukhari",
      url: "https://ahmadbukhari.com/about",
      jobTitle: "AI Systems Architect and Founder of Aixcel Solutions",
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
  if (page.type === "service") {
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
    graph.push({
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
  const articleMeta = type === "article" ? `\n  <meta property="article:published_time" content="${page.publishedOn ?? published}T00:00:00.000Z">\n  <meta property="article:modified_time" content="${published}T00:00:00.000Z">` : "";
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="${escapeHtml(page.description)}">
  <meta name="author" content="Ahmad Bukhari">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="google-site-verification" content="Xtikv06HL0T-ndPB43jrrQ1so9WY5rDkA2qoIvTqjr8">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="${type}">
  <meta property="og:locale" content="en_US">
  <meta property="og:site_name" content="Aixcel Solutions">
  <meta property="og:title" content="${escapeHtml(page.title)}">
  <meta property="og:description" content="${escapeHtml(page.description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:image:secure_url" content="${ogImage}">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Aixcel Solutions — AI systems for growing businesses">
${articleMeta}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(page.title)}">
  <meta name="twitter:description" content="${escapeHtml(page.description)}">
  <meta name="twitter:image" content="${ogImage}">
  <meta name="twitter:image:alt" content="Aixcel Solutions — AI systems for growing businesses">
  <meta name="theme-color" content="#f4f0e8">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <style>${style}</style>
  <script type="application/ld+json">${JSON.stringify(schemaFor(page)).replaceAll("<", "\\u003c")}</script>
</head>`;
}

function header(active = "") {
  const link = (href, label, key) => `<a href="${href}"${active === key ? ' aria-current="page"' : ""}>${label}</a>`;
  const book = escapeHtml(bookingUrl(`${active || "page"}_header`));
  const nav = `${link("/services", "Services", "services")}${link("/case-studies", "Case studies", "case-studies")}${link("/insights", "Insights", "insights")}${link("/process", "Process", "process")}${link("/about", "About", "about")}`;
  return `<header class="site-header"><a class="brand" href="/" aria-label="Aixcel Solutions home"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><b></b></span><span>AIXCEL</span></a><nav class="desktop-nav" aria-label="Primary navigation">${nav}</nav><a class="header-cta" href="${book}" target="_blank" rel="noopener noreferrer">Book a strategy call <span class="arrow-icon" aria-hidden="true"></span></a><details class="mobile-menu"><summary aria-label="Menu">Menu</summary><nav aria-label="Mobile navigation">${nav}<a href="${book}" target="_blank" rel="noopener noreferrer">Book a strategy call <span class="arrow-icon" aria-hidden="true"></span></a></nav></details></header>`;
}

function footer() {
  const book = escapeHtml(bookingUrl("footer"));
  return `<footer class="site-footer"><div class="footer-brand"><a class="brand" href="/" aria-label="Aixcel Solutions home"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><b></b></span><span>AIXCEL</span></a><p>Founder-led AI automation agency building dependable AI systems for growing businesses.</p></div><div class="footer-links"><div><strong>Services</strong><a href="/services/ai-lead-generation">AI appointment setting</a><a href="/services/crm-automation">CRM automation</a><a href="/services/voice-ai">Voice AI</a><a href="/services/agentic-workflows">Agentic workflows</a></div><div><strong>Company</strong><a href="/case-studies">Case studies</a><a href="/insights">Insights</a><a href="/process">Process</a><a href="/about">About</a><a href="/contact">Contact</a></div><div><strong>Connect</strong><a href="${book}" target="_blank" rel="noopener noreferrer">Book a call</a><a href="mailto:ahmadbukhari4245@gmail.com">Email</a><a href="https://manhaj.ahmadbukhari.com" target="_blank" rel="noopener noreferrer">MANHAJ</a><a href="https://ahmadbukhari.com/about" target="_blank" rel="noopener noreferrer">Ahmad Bukhari</a></div></div><div class="footer-bottom"><span>© 2026 Aixcel Solutions</span><span>Founder-led in Islamabad · serving clients worldwide · <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a></span></div></footer>`;
}

function breadcrumbs(page) {
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${breadcrumbFor(page).map(([name, path], index, all) => `<li>${index === all.length - 1 ? `<span aria-current="page">${escapeHtml(name)}</span>` : `<a href="${path}">${escapeHtml(name)}</a>`}</li>`).join("")}</ol></nav>`;
}

function pageHero(page) {
  const book = escapeHtml(bookingUrl(page.path.slice(1).replaceAll("/", "_") || "homepage"));
  return `${breadcrumbs(page)}<section class="page-hero"><div class="page-hero-copy"><p class="eyebrow">${escapeHtml(page.eyebrow)}</p><h1>${escapeHtml(page.h1)}</h1><p class="page-deck">${escapeHtml(page.deck)}</p></div><aside class="hero-aside"><strong>At a glance</strong><p>${escapeHtml(page.aside)}</p><a class="button button-primary" href="${book}" target="_blank" rel="noopener noreferrer">Book a free systems audit <span class="arrow-icon" aria-hidden="true"></span></a></aside></section><section class="answer-band" aria-labelledby="direct-answer"><div class="answer-inner"><strong id="direct-answer">Direct answer</strong><p>${escapeHtml(page.answer)}</p></div></section>`;
}

function cards(items) {
  return `<div class="card-grid">${items.map(([number, title, text, href]) => `<article class="content-card"><span>${escapeHtml(number)}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p>${href ? `<a href="${href}">Explore this service →</a>` : ""}</article>`).join("")}</div>`;
}

function faq(items) {
  return `<div class="faq-list">${items.map(([question, answer], index) => `<details${index === 0 ? " open" : ""}><summary><span>${String(index + 1).padStart(2, "0")}</span>${escapeHtml(question)}<i aria-hidden="true">+</i></summary><p>${escapeHtml(answer)}</p></details>`).join("")}</div>`;
}

function cta(page) {
  const book = escapeHtml(bookingUrl(`${page.path.slice(1).replaceAll("/", "_") || "homepage"}_cta`));
  return `<section class="cta-band"><div class="cta-grid"><h2>Bring us the constraint. Leave with a clearer next move.</h2><div class="cta-copy"><p>In 25 focused minutes, we will map where work or revenue is getting stuck, test whether AI is the right intervention, and identify the highest-leverage first step.</p><a class="button" href="${book}" target="_blank" rel="noopener noreferrer">Book a free systems audit <span class="arrow-icon" aria-hidden="true"></span></a></div></div></section>`;
}

function related(items) {
  return `<section class="content-section"><div class="section-intro"><h2>Continue your evaluation.</h2><p>Compare adjacent systems, inspect evidence, or see how Aixcel delivers the work.</p></div><div class="related-links">${items.map(([label, href]) => `<a href="${href}"${href.startsWith("http") ? ' target="_blank" rel="noopener noreferrer"' : ""}>${escapeHtml(label)} →</a>`).join("")}</div></section>`;
}

function insightBody(page) {
  const takeaways = `<section class="article-takeaways"><h2>Key takeaways</h2><ul>${page.takeaways.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>`;
  const sections = page.sections.map((section) => `<section><h2>${escapeHtml(section.heading)}</h2>${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}${section.bullets ? `<ul>${section.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}</section>`).join("");
  const sources = `<aside class="article-sources" aria-label="Primary sources"><h2>Primary sources and notes</h2><ol>${page.sources.map(([label, href, note]) => `<li><a href="${href}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)} ↗</a><small>${escapeHtml(note)}</small></li>`).join("")}</ol></aside>`;
  return `${pageHero(page)}
  <figure class="article-visual"><img src="${page.hero}" alt="${escapeHtml(page.heroAlt)}" width="1660" height="948"><div class="field-note-mark"><img src="/assets/ahmad-ab-axis.svg" alt="">Ahmad Bukhari · Field Series</div><figcaption>${escapeHtml(page.heroAlt)}</figcaption></figure>
  <p class="article-byline">By <a href="https://www.linkedin.com/in/bukhariahmad/" target="_blank" rel="noopener noreferrer">Ahmad Bukhari</a> · Founder, Aixcel Solutions · Published ${page.publishedOn ?? published}</p>
  <section class="content-section"><div class="article-layout"><article class="article-prose">${takeaways}${sections}<section class="detail-faq"><div class="section-intro"><h2>Questions decision-makers ask.</h2><p>Clear answers before a platform choice becomes an operational commitment.</p></div>${faq(page.faqs)}</section></article>${sources}</div></section>
  ${related(page.related)}${cta(page)}`;
}

function insightsBody(page) {
  const insights = pages.filter((item) => item.type === "insight");
  const cardsMarkup = insights.map((item) => `<article class="content-card"><span>${escapeHtml(item.eyebrow)}</span><h3>${escapeHtml(item.h1)}</h3><p>${escapeHtml(item.description)}</p><a href="${item.path}">Read the field note →</a></article>`).join("");
  return `${pageHero(page)}<section class="content-section"><div class="section-intro"><h2>Consequential developments, translated into operational decisions.</h2><p>Every note separates primary-source facts from practical inference, flags availability and benchmark limits, and keeps risk, ownership, and next actions visible.</p></div><div class="card-grid">${cardsMarkup}</div></section>${cta(page)}`;
}

function serviceBody(page) {
  const includes = page.includes.map(([title, text], index) => [String(index + 1).padStart(2, "0"), title, text]);
  return `${pageHero(page)}
  <section class="content-section"><div class="section-intro"><h2>What the system includes.</h2><p>Components are selected around the operating constraint. Every implementation makes ownership, state, exceptions, and measurable outcomes explicit.</p></div>${cards(includes)}</section>
  <section class="content-section dark-section"><div class="section-intro"><h2>From bottleneck to owned system.</h2><p>A staged release keeps the business case, technical architecture, and operator experience connected.</p></div><div class="process-list">${page.steps.map(([title, text]) => `<article><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></article>`).join("")}</div></section>
  <section class="content-section"><div class="section-intro"><h2>Is this the right intervention?</h2><p>AI creates leverage only when the process, owner, boundaries, and evidence are strong enough to support it.</p></div><div class="checklist">${page.fit.map(([yes, text]) => `<article><h3 class="${yes ? "yes" : "no"}">${yes ? "Strong signal" : "Pause and resolve"}</h3><p>${escapeHtml(text)}</p></article>`).join("")}</div></section>
  <section class="content-section detail-faq"><div class="section-intro"><h2>Questions decision-makers ask.</h2><p>Clear answers before tooling, scope, or timelines are discussed.</p></div>${faq(page.faqs)}</section>
  ${related(page.related)}${cta(page)}`;
}

function servicesBody(page) {
  return `${pageHero(page)}
  <section class="content-section"><div class="section-intro"><h2>Choose the constraint—not the trend.</h2><p>Each service is a doorway into a connected operating system. Start where the failure is measurable and expand only when the first path works.</p></div>${cards(serviceCards)}</section>
  <section class="content-section"><div class="section-intro"><h2>How to evaluate an AI automation agency.</h2><p>Use this checklist before comparing tool lists, demos, or proposals.</p></div><div class="checklist">
    <article><h3 class="yes">Business case</h3><p>Can the team name the current constraint, baseline, target outcome, owner, and evidence that will prove movement?</p></article>
    <article><h3 class="yes">System architecture</h3><p>Are data, state, rules, AI decisions, tools, permissions, handoffs, and exception paths visible before the build?</p></article>
    <article><h3 class="yes">Reliability and safety</h3><p>Does the proposal include evaluation, test scenarios, logging, retries, alerts, approvals, security, and rollback?</p></article>
    <article><h3 class="yes">Ownership</h3><p>Will your team receive documentation, access, operating procedures, and a system it can inspect and improve?</p></article>
    <article><h3 class="no">Warning sign</h3><p>Unverifiable guarantees, copied demos, vague “AI transformation,” and no discussion of failure modes or data governance.</p></article>
    <article><h3 class="no">Warning sign</h3><p>A tool-first scope before anyone has mapped the process, users, source of truth, or measurable business outcome.</p></article>
  </div></section>
  <section class="content-section dark-section"><div class="section-intro"><h2>The system behind the services.</h2><p><a class="text-link light" href="https://manhaj.ahmadbukhari.com" target="_blank" rel="noopener noreferrer">MANHAJ</a> is Aixcel's private AI operating system: a governed six-layer architecture configured around the way a business actually works and owned by the client.</p></div><div class="process-list"><article><h3>Data</h3><p>Trusted records, context, access, and provenance.</p></article><article><h3>Decisions</h3><p>Rules, AI interpretation, confidence, and approval.</p></article><article><h3>Actions</h3><p>Tools, workflows, humans, and accountable handoffs.</p></article><article><h3>Learning</h3><p>Evidence, observability, evaluation, and improvement.</p></article></div></section>
  ${cta(page)}`;
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
  return `${pageHero(page)}
  <section class="content-section"><div class="metric-band">${page.metrics.map(([value,label])=>`<div><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`).join("")}<div><strong>Evidence</strong><span>${escapeHtml(page.aside.replace("Evidence basis: ", ""))}</span></div></div><p class="evidence-label">Case-study figures describe this documented engagement and are not forecasts or guarantees.</p></section>
  <section class="content-section"><div class="prose"><h2>The operating constraint</h2><p>${escapeHtml(page.context)}</p><h2>The system Aixcel designed</h2><p>${escapeHtml(page.work)}</p><h2>The documented result</h2><p>${escapeHtml(page.result)}</p><h2>System components</h2><p>${escapeHtml(page.stack)}</p></div></section>
  <section class="content-section dark-section"><div class="section-intro"><h2>How to interpret this evidence.</h2><p>Names and sensitive details are withheld. Metrics retain their stated meaning and evidence label. A scope count is not converted into an outcome, and no engagement result is presented as a universal benchmark.</p></div></section>
  ${related([["All case studies","/case-studies"],["Related AI automation services","/services"],["Ahmad Bukhari's portfolio","https://ahmadbukhari.com/work"]])}${cta(page)}`;
}

function caseStudiesBody(page) {
  const items = caseStudies.map((study,index)=>[String(index+1).padStart(2,"0"),study.h1,study.description,study.path]);
  return `${pageHero(page)}<section class="content-section"><div class="section-intro"><h2>Published system evidence.</h2><p>Each page separates business context, delivered architecture, measured evidence, and interpretation limits.</p></div>${cards(items)}</section><section class="content-section dark-section"><div class="section-intro"><h2>What Aixcel will publish—and what it will not.</h2><p>Evidence is useful only when readers know what it means.</p></div><div class="checklist"><article><h3 class="yes">Clearly labelled</h3><p>Anonymized work, internal records, documented scope, and measured outcomes are identified as such.</p></article><article><h3 class="yes">Specific definitions</h3><p>Metrics retain their original meaning, context, and limits rather than being inflated into a larger claim.</p></article><article><h3 class="no">No borrowed credibility</h3><p>No invented logos, anonymous praise presented as fact, scraped reviews, or implied client endorsement.</p></article><article><h3 class="no">No result guarantees</h3><p>Past evidence informs an evaluation; it does not promise that another business will produce the same result.</p></article></div></section>${cta(page)}`;
}

function contactBody(page) {
  const book = escapeHtml(bookingUrl("contact_primary"));
  return `${pageHero(page)}<section class="content-section" id="engagement"><div class="section-intro"><h2>Choose the simplest useful starting point.</h2><p>You do not need a technical brief. A clear description of the bottleneck, the people affected, and what it costs is enough.</p></div><div class="card-grid"><article class="content-card"><span>01</span><h3>Book the systems audit</h3><p>Choose a time through Ahmad Bukhari's official Cal.com event. The call is 25 minutes and focused on diagnosis.</p><a href="${book}" target="_blank" rel="noopener noreferrer">Open the booking calendar →</a></article><article class="content-card"><span>02</span><h3>Send the messy part</h3><p>Email the current process, tools, failure, approximate volume, and the business outcome you want to improve.</p><a href="mailto:ahmadbukhari4245@gmail.com?subject=Aixcel%20AI%20systems%20brief">Email Ahmad Bukhari →</a></article><article class="content-card"><span>03</span><h3>Inspect the work first</h3><p>Review the published evidence and the founder's systems portfolio before deciding whether the fit is strong.</p><a href="/case-studies">View case studies →</a></article></div></section><section class="content-section dark-section"><div class="section-intro"><h2>A useful first message includes:</h2><p>Context helps the conversation begin at the operating problem instead of a generic list of AI tools.</p></div><div class="checklist"><article><h3 class="yes">The constraint</h3><p>What repeatedly breaks, waits, disappears, or requires manual compensation?</p></article><article><h3 class="yes">The environment</h3><p>Which teams, tools, data, channels, and approximate volumes are involved?</p></article><article><h3 class="yes">The outcome</h3><p>Which operating or customer metric should improve, and how is it measured today?</p></article><article><h3 class="yes">The boundaries</h3><p>What must remain human, what is sensitive, and which compliance or security rules apply?</p></article></div></section>`;
}

function policyBody(page) {
  const privacy = page.path === "/privacy";
  const content = privacy ? `<div class="prose">
    <h2>Who this notice covers</h2><p>Aixcel Solutions is a founder-led business operated by Ahmad Bukhari from Islamabad, Pakistan and serving clients worldwide. This notice covers the public website, direct enquiries, booking interactions, and information processed to evaluate or provide agreed services.</p>
    <h2>Information Aixcel may receive</h2><ul><li>Contact details and information you choose to include in an email, form, booking, call, or project brief.</li><li>Scheduling information processed through the linked Cal.com booking service.</li><li>Basic technical and security data such as request time, device or browser information, referring page, and network identifiers when collected by hosting or security providers.</li><li>Business, system, user, and project information supplied under an agreed engagement.</li></ul>
    <h2>Why it is used</h2><p>Information is used to respond, schedule calls, assess fit, prepare and provide agreed services, maintain security, keep business records, improve operations, and comply with applicable obligations. Aixcel does not sell personal information.</p>
    <h2>Service providers and international processing</h2><p>Website hosting, email, calendars, communications, analytics if enabled, and project tools may process information on Aixcel's behalf. Those providers may operate in other countries and apply their own infrastructure and contractual safeguards.</p>
    <h2>Retention and security</h2><p>Information is retained only as long as reasonably needed for the purpose, an active or prospective business relationship, security, records, disputes, or applicable obligations. Aixcel uses proportionate access, credential, hosting, and operational controls, but no internet transmission or storage method is guaranteed completely secure.</p>
    <h2>Your choices</h2><p>You may ask what personal information Aixcel holds about you, request correction or deletion where applicable, object to certain use, or withdraw consent for future communications. Some records may need to be retained for security, contracts, or legal obligations.</p>
    <h2>Third-party links and updates</h2><p>This website links to Cal.com, AhmadBukhari.com, MANHAJ, LinkedIn, GitHub, n8n, and other external services. Their privacy practices apply when you visit them. Material changes to this notice will be published here with a new update date.</p>
  </div>` : `<div class="prose">
    <h2>Informational website</h2><p>The website describes Aixcel's services, approach, and selected evidence. It does not create a client relationship, statement of work, professional duty, or guarantee that a particular service is appropriate or available.</p>
    <h2>Accuracy and changes</h2><p>Aixcel aims to keep public information accurate but may change, correct, remove, or update content without notice. Examples, technology references, and case studies describe their stated context and should not be treated as universal benchmarks.</p>
    <h2>No result guarantee</h2><p>Automation, AI, CRM, operational, and commercial results depend on data, process, adoption, market conditions, compliance, implementation, and other factors. Published outcomes are not promises of future performance.</p>
    <h2>Your use of the website</h2><p>You may use the website for lawful evaluation of Aixcel. Do not interfere with the site, attempt unauthorized access, introduce malicious code, misrepresent affiliation, or reuse content in a misleading or unlawful way.</p>
    <h2>Intellectual property</h2><p>Unless stated otherwise, the website's original copy, visual design, diagrams, and branding belong to Aixcel Solutions or are used with permission. You may quote and link to reasonable portions with clear attribution; other reuse requires permission.</p>
    <h2>Third-party services</h2><p>Links to external sites and references to platforms do not imply control or endorsement. External services have their own terms, availability, security, and privacy practices.</p>
    <h2>Client engagements</h2><p>A signed proposal, statement of work, order, data-processing agreement, or other written engagement document controls the scope, fees, deliverables, responsibilities, intellectual property, confidentiality, warranties, and liability for client work. If it conflicts with these website terms, the signed agreement controls.</p>
    <h2>Liability</h2><p>To the extent permitted by applicable law, this website is provided without warranties and Aixcel is not responsible for indirect or consequential loss arising solely from reliance on public website content or an external link. Rights that cannot lawfully be excluded remain unaffected.</p>
  </div>`;
  return `${pageHero(page)}<section class="content-section"><p class="legal-note">This page is a transparent operational notice for website visitors. It is not a substitute for terms or privacy documents agreed for a specific client engagement.</p>${content}<div class="prose"><h2>Contact</h2><p>Email <a href="mailto:ahmadbukhari4245@gmail.com">ahmadbukhari4245@gmail.com</a> with questions or requests.</p></div></section>`;
}

function renderPage(page) {
  const body = page.type === "service" ? serviceBody(page)
    : page.path === "/services" ? servicesBody(page)
    : page.type === "about" ? aboutBody(page)
    : page.type === "process" ? processBody(page)
    : page.type === "case-study" ? caseStudyBody(page)
    : page.path === "/case-studies" ? caseStudiesBody(page)
    : page.type === "insight" ? insightBody(page)
    : page.path === "/insights" ? insightsBody(page)
    : page.type === "contact" ? contactBody(page)
    : page.type === "policy" ? policyBody(page)
    : pageHero(page);
  return `${headFor(page)}
<body>
<a class="skip-link" href="#main-content">Skip to content</a>
${header(page.nav)}
<main class="detail-main" id="main-content" tabindex="-1">${body}</main>
${footer()}
<script>(()=>{document.querySelectorAll('.mobile-menu a').forEach(link=>link.addEventListener('click',()=>link.closest('details')?.removeAttribute('open')));})();</script>
</body>
</html>\n`;
}

function homeSchema() {
  const faqItems = [
    ["Who is Aixcel built for?", "Growing service businesses and internal teams where missed leads, manual follow-up, disconnected tools, or fragile handoffs are already costing time or revenue."],
    ["Do you only work with GoHighLevel and n8n?", "No. Aixcel uses GoHighLevel, n8n, Make, HubSpot, Airtable, Vapi, OpenAI, and other platforms when they fit the operating need."],
    ["Can you improve what we already have?", "Yes. Aixcel can audit, repair, migrate, or extend an existing CRM, automation stack, or AI agent."],
    ["What happens on the free systems audit?", "In 25 focused minutes, Aixcel identifies where work or revenue is stuck, tests whether AI or automation is appropriate, and defines the highest-leverage next move."],
    ["Is Aixcel a large agency?", "Aixcel is founder-led by Ahmad Bukhari, with specialist collaborators introduced when a build needs them."],
  ];
  const graph = organizationGraph();
  graph.push({ "@type": "WebPage", "@id": `${origin}/#webpage`, url: `${origin}/`, name: "Aixcel Solutions | AI Automation Agency & AI Systems", description: "Aixcel Solutions is a founder-led AI automation agency designing lead, CRM, voice, workflow, and intelligence systems for growing businesses.", isPartOf: { "@id": `${origin}/#website` }, about: { "@id": `${origin}/#organization` }, inLanguage: "en", dateModified: published });
  graph.push({ "@type": "FAQPage", "@id": `${origin}/#faq`, mainEntity: faqItems.map(([name,text])=>({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) });
  return { "@context": "https://schema.org", "@graph": graph };
}

function buildHome() {
  const oldBooking = `${baseBooking}?utm_source=aixcel_website&amp;utm_medium=website&amp;utm_campaign=free_systems_audit`;
  const newBooking = escapeHtml(bookingUrl("homepage"));
  let home = sourceHome
    .replace("<title>Aixcel Solutions — AI systems for growing businesses</title>", "<title>Aixcel Solutions | AI Automation Agency &amp; AI Systems</title>")
    .replace('content="Founder-led AI agency designing lead, CRM, voice, automation, and intelligence systems for growing businesses."', 'content="Aixcel Solutions is a founder-led AI automation agency designing lead, CRM, voice, workflow, and intelligence systems for growing businesses."')
    .replaceAll("Aixcel Solutions — AI systems for growing businesses", "Aixcel Solutions | AI Automation Agency &amp; AI Systems")
    .replace('<meta property="og:url" content="https://aixcelsolutions.com/">', `<meta property="og:url" content="https://aixcelsolutions.com/">\n  <meta property="og:locale" content="en_US">\n  <meta property="og:image" content="${ogImage}">\n  <meta property="og:image:type" content="image/png">\n  <meta property="og:image:width" content="1200">\n  <meta property="og:image:height" content="630">\n  <meta property="og:image:alt" content="Aixcel Solutions — AI systems for growing businesses">`)
    .replace('<meta name="twitter:card" content="summary">', '<meta name="twitter:card" content="summary_large_image">')
    .replace('</head>', `  <meta name="twitter:image" content="${ogImage}">\n  <meta name="twitter:image:alt" content="Aixcel Solutions — AI systems for growing businesses">\n</head>`)
    .replaceAll(oldBooking, newBooking)
    .replaceAll('summary aria-label="Open navigation"', 'summary aria-label="Menu"')
    .replaceAll('href="#top"', 'href="/"')
    .replaceAll("rgba(251, 248, 242, 0.55)", "rgba(251, 248, 242, 0.78)")
    .replaceAll("rgba(251, 248, 242, 0.62)", "rgba(251, 248, 242, 0.78)")
    .replaceAll("rgba(251, 248, 242, 0.66)", "rgba(251, 248, 242, 0.78)")
    .replaceAll("rgba(251, 248, 242, 0.68)", "rgba(251, 248, 242, 0.78)")
    .replaceAll("Explore the Manhaj product", "Explore the MANHAJ product")
    .replace(styleMatch[0], `<style>${style}</style>`)
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/i, `<script type="application/ld+json">${JSON.stringify(homeSchema()).replaceAll("<", "\\u003c")}</script>`)
    .replace(/<nav class="desktop-nav" aria-label="Primary navigation">[\s\S]*?<\/nav>/, '<nav class="desktop-nav" aria-label="Primary navigation"><a href="/services">Services</a><a href="/case-studies">Case studies</a><a href="/insights">Insights</a><a href="/process">Process</a><a href="/about">About</a></nav>')
    .replace(/<details class="mobile-menu"><summary[\s\S]*?<\/details>/, `<details class="mobile-menu"><summary aria-label="Menu">Menu</summary><nav aria-label="Mobile navigation"><a href="/services">Services</a><a href="/case-studies">Case studies</a><a href="/insights">Insights</a><a href="/process">Process</a><a href="/about">About</a><a href="${newBooking}" target="_blank" rel="noopener noreferrer">Book a strategy call <span class="arrow-icon" aria-hidden="true"></span></a></nav></details>`)
    .replace(/<footer class="site-footer">[\s\S]*?<\/footer>/, footer())
    .replaceAll('href="https://ahmadbukhari.com" target="_blank"', 'href="https://ahmadbukhari.com/about" target="_blank"')
    .replace('href="https://ahmadbukhari.com/work/migration-factory"', 'href="/case-studies/automation-migration"')
    .replace(
      'src="https://ahmadbukhari.com/ahmad-consultation.webp" loading="lazy" decoding="async" alt="Ahmad Bukhari in a consultation setting" width="720" height="900"',
      'src="/assets/ahmad-bukhari.svg" loading="lazy" decoding="async" alt="Ahmad Bukhari, founder of Aixcel Solutions" width="600" height="600"',
    );

  const directory = `<div class="service-directory-inline" aria-label="Detailed AI automation services"><a href="/services/ai-lead-generation">AI lead generation &amp; appointment setting</a><a href="/services/crm-automation">CRM automation</a><a href="/services/voice-ai">Voice AI agents</a><a href="/services/agentic-workflows">Agentic workflows</a><a href="/services">Compare all services</a></div>`;
  home = home.replace('<div class="service-cta">', `${directory}<div class="service-cta">`);
  home = home.replace('<div class="case-stack"><span>CRM</span><span>Dialer</span><span>Workflow automation</span><span>Slack</span></div></article>', '<div class="case-stack"><span>CRM</span><span>Dialer</span><span>Workflow automation</span><span>Slack</span></div><a class="case-link" href="/case-studies/lead-operations">Read the evidence →</a></article>');
  home = home.replace('<div class="case-stack"><span>n8n</span><span>Airtable</span><span>APIs</span><span>Looker Studio</span></div></article>', '<div class="case-stack"><span>n8n</span><span>Airtable</span><span>APIs</span><span>Looker Studio</span></div><a class="case-link" href="/case-studies/business-intelligence">Read the evidence →</a></article>');
  return home;
}

function sitemap() {
  const entries = ["/", ...pages.map((page) => page.path)];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.map((path) => `  <url><loc>${pageUrl(path)}</loc><lastmod>${published}</lastmod></url>`).join("\n")}\n</urlset>\n`;
}

function llmsText() {
  return `# Aixcel Solutions\n\n> Aixcel Solutions is a founder-led AI automation agency that designs dependable AI systems for growing businesses. It is led by AI systems architect Ahmad Bukhari in Islamabad, Pakistan and serves clients worldwide.\n\n## Primary pages\n- [Services](${origin}/services): All AI automation services and an agency-evaluation checklist.\n- [AI lead generation and appointment setting](${origin}/services/ai-lead-generation): Lead capture, qualification, follow-up, routing, booking, and CRM state.\n- [CRM automation](${origin}/services/crm-automation): Lifecycle architecture, pipeline automation, data quality, attribution, and handoffs.\n- [Voice AI](${origin}/services/voice-ai): Inbound and approved outbound voice agents with human handoff, testing, and controls.\n- [Agentic workflows](${origin}/services/agentic-workflows): Bounded AI agents, n8n and API workflows, approvals, recovery, and observability.\n- [Case studies](${origin}/case-studies): Clearly labelled anonymized evidence and documented system scope.\n- [Process](${origin}/process): How Aixcel audits, designs, builds, evaluates, releases, and hands over AI systems.\n- [About](${origin}/about): Company and founder identity.\n- [Contact](${origin}/contact): Official booking and email paths.\n\n## Field notes\n- [Context is not consent](${origin}/insights/context-is-not-consent-ai-private-data): Permission boundaries for AI systems that use private context.\n- [OpenAI Presence](${origin}/insights/openai-presence-enterprise-ai-agent-rollout): Enterprise AI agent operations, controls, evaluation, and escalation.\n\n## Connected entities\n- [Ahmad Bukhari](https://ahmadbukhari.com/about): Founder and AI systems architect.\n- [MANHAJ](https://manhaj.ahmadbukhari.com): Aixcel's private AI operating-system product and methodology.\n- [Verified n8n creator profile](https://n8n.io/creators/ahmadbukhari/)\n\n## Evidence policy\nPublished case studies distinguish anonymized internal project records, measured outcomes, and documented scope. Aixcel does not publish invented testimonials, client logos, ratings, or performance guarantees.\n`;
}

function notFoundPage() {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | Aixcel Solutions</title><meta name="robots" content="noindex,follow"><meta name="description" content="The requested Aixcel Solutions page could not be found."><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><style>${style}</style></head><body><a class="skip-link" href="#main-content">Skip to content</a>${header("")}<main class="detail-main" id="main-content"><section class="page-hero"><div class="page-hero-copy"><p class="eyebrow">404 · page not found</p><h1>This route does not exist.</h1><p class="page-deck">Explore Aixcel's AI automation services, system evidence, or contact page instead.</p><div class="hero-actions"><a class="button button-primary" href="/services">Explore services <span class="arrow-icon" aria-hidden="true"></span></a><a class="button button-secondary" href="/">Return home</a></div></div></section></main>${footer()}</body></html>\n`;
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

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await cp(join(sourceDir, "assets"), join(outputDir, "assets"), { recursive: true });
await writeFile(join(outputDir, "assets", "og-aixcel.png"), socialImagePng());
await writeFile(join(outputDir, "index.html"), buildHome());
for (const page of pages) {
  const file = join(outputDir, `${page.path.slice(1)}.html`);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, renderPage(page));
}
await writeFile(join(outputDir, "404.html"), notFoundPage());
await writeFile(join(outputDir, "robots.txt"), `User-agent: *\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: ChatGPT-User\nAllow: /\n\nUser-agent: GPTBot\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: ClaudeBot\nAllow: /\n\nUser-agent: Applebot-Extended\nAllow: /\n\nUser-agent: Google-Extended\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\nHost: ${origin}\n`);
await writeFile(join(outputDir, "sitemap.xml"), sitemap());
await writeFile(join(outputDir, "llms.txt"), llmsText());
await writeFile(join(outputDir, "b1ec9a276d8f4d568508e4b4d0048c2b.txt"), "b1ec9a276d8f4d568508e4b4d0048c2b");
await mkdir(join(outputDir, ".well-known"), { recursive: true });
await writeFile(join(outputDir, ".well-known", "security.txt"), `Contact: mailto:ahmadbukhari4245@gmail.com\nPreferred-Languages: en\nCanonical: ${origin}/.well-known/security.txt\nExpires: 2027-07-22T00:00:00.000Z\n`);

console.log(`Built ${pages.length + 1} indexable pages in ${outputDir}`);
