const DEFAULT_BOOKING_URL = "https://cal.com/ahmad-bukhari/revenue-handoff-map";
const DEFAULT_PDF_URL = "/guides/ai-search-visibility-brief.pdf";
const CONSENT_VERSION = "2026-08-12";
const LEAD_EVENTS = new Set(["pdf_download", "guide_gate_opened", "booking_opened", "booking_client_success"]);
const TIMING_VALUES = new Set(["now", "30-60-days", "later", "exploring"]);
const REQUEST_TYPES = new Set(["free_audit", "guide_download", "strategy_call"]);
const REVENUE_VALUES = new Set(["pre_revenue", "under_250k", "250k_1m", "1m_5m", "5m_20m", "20m_plus", "prefer_not_to_say"]);
const REQUEST_LABELS = {
  free_audit: "Free AEO audit",
  guide_download: "AI Visibility guide",
  strategy_call: "Strategy call",
};
const REVENUE_LABELS = {
  pre_revenue: "Pre-revenue or not yet trading",
  under_250k: "Under $250k",
  "250k_1m": "$250k to $1m",
  "1m_5m": "$1m to $5m",
  "5m_20m": "$5m to $20m",
  "20m_plus": "$20m+",
  prefer_not_to_say: "Prefer not to say",
};

export class PublicLeadError extends Error {
  constructor(status, code, publicMessage) {
    super(code);
    this.name = "PublicLeadError";
    this.status = status;
    this.code = code;
    this.publicMessage = publicMessage;
  }
}

function json(status, payload, headers = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...headers,
    },
  });
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function cleanText(value, max, { required = false } = {}) {
  if (typeof value !== "string") {
    if (required) throw new PublicLeadError(400, "invalid_field", "Please complete every required field.");
    return "";
  }
  const cleaned = value.replace(/\u0000/g, "").replace(/\s+/g, " ").trim();
  if ((required && !cleaned) || cleaned.length > max) {
    throw new PublicLeadError(400, "invalid_field", "Please check the form fields and try again.");
  }
  return cleaned;
}

function normalizeEmail(value) {
  const email = cleanText(value, 320, { required: true }).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new PublicLeadError(400, "invalid_email", "Enter a valid work email address.");
  }
  return email;
}

function normalizeWebsite(value) {
  let website = cleanText(value, 2_048, { required: true });
  if (!/^https?:\/\//i.test(website)) website = `https://${website}`;
  try {
    const url = new URL(website);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || !url.hostname.includes(".")) throw new Error();
    url.hash = "";
    url.hostname = url.hostname.toLowerCase();
    if (url.pathname === "/") url.pathname = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    throw new PublicLeadError(400, "invalid_website", "Enter a valid company website.");
  }
}

function normalizeSource(input) {
  if (!isPlainObject(input)) return {};
  const allowed = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "landing_page", "entry_path", "referrer"];
  return Object.fromEntries(allowed.map((key) => [key, cleanText(input[key] || "", key === "landing_page" || key === "referrer" ? 2_048 : 160)]).filter(([, value]) => value));
}

export function validateLeadPayload(input) {
  if (!isPlainObject(input)) throw new PublicLeadError(400, "invalid_body", "The form could not be read.");
  const allowed = new Set(["requestType", "name", "email", "company", "website", "role", "aiGoal", "timing", "annualRevenue", "consent", "source", "formToken", "companyFax"]);
  if (Object.keys(input).some((key) => !allowed.has(key))) throw new PublicLeadError(400, "invalid_body", "The form contains unsupported fields.");
  if (cleanText(input.companyFax || "", 200)) throw new PublicLeadError(400, "submission_rejected", "The form could not be submitted.");
  if (input.consent !== true) throw new PublicLeadError(400, "consent_required", "Please agree to the privacy notice so AiXCEL can respond.");
  const requestType = cleanText(input.requestType, 40, { required: true });
  if (!REQUEST_TYPES.has(requestType)) throw new PublicLeadError(400, "invalid_request_type", "Choose a valid request type.");
  const annualRevenue = cleanText(input.annualRevenue, 40, { required: true });
  if (!REVENUE_VALUES.has(annualRevenue)) throw new PublicLeadError(400, "invalid_revenue", "Choose a valid annual revenue range.");
  const requiresAuditContext = requestType === "free_audit";
  const timing = cleanText(input.timing || "", 40, { required: requiresAuditContext });
  if (timing && !TIMING_VALUES.has(timing)) throw new PublicLeadError(400, "invalid_timing", "Choose a valid timing option.");
  return {
    requestType,
    name: cleanText(input.name, 120, { required: true }),
    email: normalizeEmail(input.email),
    company: cleanText(input.company, 160, { required: true }),
    website: normalizeWebsite(input.website),
    role: cleanText(input.role || "", 120, { required: requiresAuditContext }),
    aiGoal: cleanText(input.aiGoal || "", 1_500, { required: requiresAuditContext }),
    timing,
    annualRevenue,
    source: normalizeSource(input.source),
    formToken: cleanText(input.formToken, 512, { required: true }),
  };
}

async function readJson(request, maxBytes = 24 * 1024) {
  if (!/^application\/json(?:;|$)/i.test(request.headers.get("content-type") || "")) {
    throw new PublicLeadError(415, "unsupported_media_type", "Use application/json.");
  }
  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > maxBytes) throw new PublicLeadError(413, "body_too_large", "The request is too large.");
  try { return JSON.parse(raw); } catch { throw new PublicLeadError(400, "invalid_json", "The form could not be read."); }
}

function requirePost(request) {
  if (request.method !== "POST") throw new PublicLeadError(405, "method_not_allowed", "Only POST is supported.");
}

function assertSameOrigin(request, env) {
  const supplied = request.headers.get("origin");
  if (!supplied) throw new PublicLeadError(403, "origin_denied", "Cross-origin requests are not allowed.");
  const allowed = new Set([new URL(request.url).origin]);
  for (const value of String(env.SITE_URL || "").split(",")) {
    try { if (value.trim()) allowed.add(new URL(value.trim()).origin); } catch { /* ignore malformed configuration */ }
  }
  if (!allowed.has(supplied)) throw new PublicLeadError(403, "origin_denied", "Cross-origin requests are not allowed.");
}

function requireEnv(env, names) {
  const missing = names.filter((name) => typeof env[name] !== "string" || !env[name]);
  if (missing.length) throw new PublicLeadError(503, "service_unconfigured", "Lead capture is being configured. Please use the booking or email option.");
}

function requestIp(request) {
  return (request.headers.get("cf-connecting-ip") || request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim().slice(0, 80);
}

function bytesToHex(bytes) {
  return [...bytes].map((value) => value.toString(16).padStart(2, "0")).join("");
}

async function hmac(value, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
}

async function fingerprint(request, secret) {
  const raw = `${requestIp(request)}|${(request.headers.get("user-agent") || "unknown").slice(0, 300)}`;
  return bytesToHex(await hmac(raw, secret));
}

function base64Url(bytes) {
  if (typeof Buffer !== "undefined") return Buffer.from(bytes).toString("base64url");
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

async function signedLeadRef(leadId, secret) {
  return `v1.${leadId}.${base64Url(await hmac(`v1.${leadId}`, secret))}`;
}

async function createFormToken(secret) {
  const issuedAt = Math.floor(Date.now() / 1_000);
  const nonce = crypto.randomUUID();
  const unsigned = `v1.${issuedAt}.${nonce}`;
  return `${unsigned}.${base64Url(await hmac(unsigned, secret))}`;
}

async function verifyFormToken(value, secret) {
  const match = /^v1\.(\d{10})\.([0-9a-f-]{36})\.([A-Za-z0-9_-]{43})$/i.exec(value || "");
  if (!match) return false;
  const issuedAt = Number(match[1]);
  const now = Math.floor(Date.now() / 1_000);
  if (!Number.isSafeInteger(issuedAt) || issuedAt > now + 60 || now - issuedAt > 1_800) return false;
  const expected = base64Url(await hmac(`v1.${match[1]}.${match[2]}`, secret));
  let difference = expected.length ^ match[3].length;
  for (let index = 0; index < Math.max(expected.length, match[3].length); index++) difference |= (expected.charCodeAt(index) || 0) ^ (match[3].charCodeAt(index) || 0);
  return difference === 0;
}

async function verifyLeadRef(value, secret) {
  if (typeof value !== "string") return null;
  const match = /^v1\.([0-9a-f-]{36})\.([A-Za-z0-9_-]{43})$/i.exec(value);
  if (!match) return null;
  const expected = base64Url(await hmac(`v1.${match[1]}`, secret));
  let difference = expected.length ^ match[2].length;
  for (let index = 0; index < Math.max(expected.length, match[2].length); index++) difference |= (expected.charCodeAt(index) || 0) ^ (match[2].charCodeAt(index) || 0);
  return difference === 0 ? match[1] : null;
}

async function supabase(env, path, options = {}, fetchImpl = fetch) {
  requireEnv(env, ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]);
  const response = await fetchImpl(`${env.SUPABASE_URL.replace(/\/$/, "")}${path}`, {
    ...options,
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const raw = await response.text();
  let data = null;
  try { data = raw ? JSON.parse(raw) : null; } catch { data = raw; }
  if (!response.ok) {
    console.error("ai_visibility_supabase_error", response.status, data?.code || "unknown");
    throw new PublicLeadError(503, "storage_unavailable", "The request could not be stored. Please try again or use the booking link.");
  }
  return data;
}

async function storageBridge(env, action, payload, fetchImpl = fetch) {
  requireEnv(env, ["AI_VISIBILITY_STORAGE_URL", "VERCEL_OIDC_TOKEN"]);
  const response = await fetchImpl(env.AI_VISIBILITY_STORAGE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.VERCEL_OIDC_TOKEN}`,
      "Content-Type": "application/json",
      "X-AiXCEL-Storage-Version": "2026-08-12",
    },
    body: JSON.stringify({ action, payload }),
  });
  const raw = await response.text();
  let result = null;
  try { result = raw ? JSON.parse(raw) : null; } catch { result = null; }
  if (!response.ok || result?.ok !== true) {
    console.error("ai_visibility_storage_bridge_error", response.status, result?.code || "unknown");
    throw new PublicLeadError(503, "storage_unavailable", "The request could not be stored. Please try again or use the booking link.");
  }
  return result.data;
}

function usesDirectStorage(env) {
  return Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
}

function storageReady(env) {
  return usesDirectStorage(env) || Boolean(env.AI_VISIBILITY_STORAGE_URL && env.VERCEL_OIDC_TOKEN);
}

async function captureLeadRecord(env, params, fetchImpl) {
  if (usesDirectStorage(env)) {
    return supabase(env, "/rest/v1/rpc/capture_ai_visibility_lead", {
      method: "POST",
      body: JSON.stringify(params),
    }, fetchImpl);
  }
  return storageBridge(env, "capture", params, fetchImpl);
}

async function recordBookingRecord(env, params, fetchImpl) {
  if (usesDirectStorage(env)) {
    return supabase(env, "/rest/v1/rpc/record_ai_visibility_booking", {
      method: "POST",
      body: JSON.stringify(params),
    }, fetchImpl);
  }
  return storageBridge(env, "record_booking", params, fetchImpl);
}

async function loadLeadRecord(env, leadId, fetchImpl) {
  if (usesDirectStorage(env)) {
    const rows = await supabase(env, `/rest/v1/ai_visibility_leads?id=eq.${encodeURIComponent(leadId)}&select=id,full_name,email_normalized,company_name,website_url,role_title,ai_goal,timing,request_type,annual_revenue_range,source_context&limit=1`, {}, fetchImpl);
    return rows?.[0] || null;
  }
  return storageBridge(env, "get_lead", { lead_id: leadId }, fetchImpl);
}

function safeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

async function sendEmail(env, message, idempotencyKey, fetchImpl) {
  requireEnv(env, ["RESEND_API_KEY", "LEAD_NOTIFICATION_FROM"]);
  const response = await fetchImpl("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
    body: JSON.stringify({ from: env.LEAD_NOTIFICATION_FROM, ...message }),
  });
  if (!response.ok) throw new Error(`resend_${response.status}`);
  return response.json().catch(() => ({}));
}

async function recordEvent(env, leadId, eventType, eventKey, payload, fetchImpl) {
  try {
    const event = { lead_id: leadId, event_type: eventType, event_key: eventKey, payload };
    if (usesDirectStorage(env)) {
      await supabase(env, "/rest/v1/ai_visibility_lead_events?on_conflict=event_key", {
        method: "POST",
        headers: { Prefer: "resolution=ignore-duplicates,return=minimal" },
        body: JSON.stringify(event),
      }, fetchImpl);
    } else {
      await storageBridge(env, "record_event", event, fetchImpl);
    }
  } catch (error) {
    console.error("ai_visibility_event_save_failed", eventType, error?.code || error?.name || "unknown");
  }
}

function emailShell(kicker, title, content) {
  return `<div style="margin:0;background:#f5f0e8;padding:32px 16px;color:#1b1b1a;font-family:Arial,sans-serif"><div style="max-width:620px;margin:0 auto;border:1px solid #d9d0c4;background:#fffdf8"><div style="padding:14px 24px;background:#502c52;color:#c8ff37;font-size:12px;font-weight:700;letter-spacing:.08em">${safeHtml(kicker)}</div><div style="padding:32px 24px"><h1 style="margin:0 0 18px;font-size:30px;line-height:1.08;font-weight:500">${safeHtml(title)}</h1>${content}<p style="margin:30px 0 0;padding-top:18px;border-top:1px solid #e2d9cd;color:#736b62;font-size:12px;line-height:1.6">AiXCEL Solutions · Founder-led AEO, AI visibility, and business systems</p></div></div></div>`;
}

function bookingUrlFor(env, requestType, channel = "transactional_email") {
  const url = new URL(env.AI_VISIBILITY_BOOKING_URL || DEFAULT_BOOKING_URL);
  url.searchParams.set("utm_source", "aixcel_website");
  url.searchParams.set("utm_medium", channel);
  url.searchParams.set("utm_campaign", requestType);
  return url.href;
}

async function notifyLead(env, lead, leadId, notificationKey, fetchImpl) {
  const to = env.LEAD_NOTIFICATION_TO;
  if (!to) throw new Error("notification_recipient_missing");
  const delivery = { ownerNotified: false, visitorAcknowledged: false };
  const label = REQUEST_LABELS[lead.requestType];
  const revenue = REVENUE_LABELS[lead.annualRevenue];
  const siteUrl = env.SITE_URL || "https://aixcelsolutions.com";
  const guideUrl = new URL(DEFAULT_PDF_URL, siteUrl).href;
  const bookingUrl = bookingUrlFor(env, lead.requestType);
  const source = lead.source?.utm_source || lead.source?.entry_path || lead.source?.landing_page || "Direct website";
  const contextRows = [
    `<p style="margin:0 0 10px"><strong>Request:</strong> ${safeHtml(label)}</p>`,
    `<p style="margin:0 0 10px"><strong>Lead:</strong> ${safeHtml(lead.name)} at ${safeHtml(lead.company)}</p>`,
    `<p style="margin:0 0 10px"><strong>Email:</strong> <a href="mailto:${safeHtml(lead.email)}">${safeHtml(lead.email)}</a></p>`,
    `<p style="margin:0 0 10px"><strong>Website:</strong> <a href="${safeHtml(lead.website)}">${safeHtml(lead.website)}</a></p>`,
    `<p style="margin:0 0 10px"><strong>Annual revenue:</strong> ${safeHtml(revenue)}</p>`,
    `<p style="margin:0 0 10px"><strong>Role:</strong> ${safeHtml(lead.role || "Not provided")}</p>`,
    `<p style="margin:0 0 10px"><strong>Timing:</strong> ${safeHtml(lead.timing || "Not provided")}</p>`,
    `<p style="margin:0 0 10px"><strong>Source:</strong> ${safeHtml(source)}</p>`,
    lead.aiGoal ? `<p style="margin:18px 0 0"><strong>Priority offer or buyer question:</strong><br>${safeHtml(lead.aiGoal)}</p>` : "",
    `<p style="margin:24px 0 0"><a style="color:#502c52;font-weight:700" href="${safeHtml(new URL("/lead-desk", siteUrl).href)}">Open the private Lead Desk</a></p>`,
  ].join("");
  try {
    const internal = await sendEmail(env, {
      to: [to],
      reply_to: lead.email,
      subject: `${label}: ${lead.company} · ${revenue}`,
      html: emailShell("NEW AIXCEL LEAD", `${label} request from ${lead.company}`, contextRows),
    }, `ai-visibility-internal/${notificationKey}`, fetchImpl);
    delivery.ownerNotified = true;
    await recordEvent(env, leadId, "notification_sent", `notification:internal:${notificationKey}`, { providerId: internal?.id || null, requestType: lead.requestType }, fetchImpl);
  } catch (error) {
    await recordEvent(env, leadId, "notification_failed", `notification:internal-failed:${notificationKey}`, { reason: error?.message || "unknown", requestType: lead.requestType }, fetchImpl);
  }
  const visitorTitle = lead.requestType === "guide_download" ? "Your AI Visibility guide is ready." : lead.requestType === "strategy_call" ? "Choose a time for your AiXCEL strategy call." : "We received your free AEO audit request.";
  const visitorIntro = lead.requestType === "guide_download"
    ? "Use the short guide to understand what AEO measures, where visibility gaps come from, and what a responsible next step looks like."
    : lead.requestType === "strategy_call"
      ? "Use the calendar below to choose a focused time with Ahmad. Your website and company context are already attached to the request."
      : "Ahmad will review your website, priority offer, competitor context, and public AI answer surface before replying with the most useful next step.";
  try {
    const visitor = await sendEmail(env, {
      to: [lead.email],
      reply_to: to,
      subject: visitorTitle,
      html: emailShell("AIXCEL · REQUEST RECEIVED", visitorTitle, `<p style="margin:0 0 16px;line-height:1.7">Hi ${safeHtml(lead.name)},</p><p style="margin:0 0 22px;line-height:1.7">${safeHtml(visitorIntro)}</p><p style="margin:0 0 12px"><a style="display:inline-block;padding:13px 18px;background:#c8ff37;color:#1b1b1a;text-decoration:none;font-weight:700" href="${safeHtml(lead.requestType === "guide_download" ? guideUrl : bookingUrl)}">${lead.requestType === "guide_download" ? "Download the guide" : "Choose a time"}</a></p>${lead.requestType !== "guide_download" ? `<p style="margin:10px 0 0"><a style="color:#502c52" href="${safeHtml(guideUrl)}">Read the AI Visibility guide first</a></p>` : `<p style="margin:10px 0 0"><a style="color:#502c52" href="${safeHtml(bookingUrl)}">Book a focused AEO review</a></p>`}<p style="margin:24px 0 0;color:#736b62;font-size:13px;line-height:1.6">This is a transactional response to your request. It does not subscribe you to recurring marketing.</p>`),
    }, `ai-visibility-visitor/${notificationKey}`, fetchImpl);
    delivery.visitorAcknowledged = true;
    await recordEvent(env, leadId, "acknowledgement_sent", `notification:visitor:${notificationKey}`, { providerId: visitor?.id || null, requestType: lead.requestType }, fetchImpl);
  } catch (error) {
    await recordEvent(env, leadId, "acknowledgement_failed", `notification:visitor-failed:${notificationKey}`, { reason: error?.message || "unknown", requestType: lead.requestType }, fetchImpl);
  }
  return delivery;
}

async function notifyBooking(env, booking, fetchImpl) {
  if (!env.LEAD_NOTIFICATION_TO) return false;
  try {
    await sendEmail(env, {
      to: [env.LEAD_NOTIFICATION_TO],
      subject: `AEO booking event: ${booking.email}`,
      html: emailShell("AIXCEL · CALENDAR EVENT", "An AEO calendar event was recorded.", `<p style="margin:0 0 10px"><strong>Email:</strong> ${safeHtml(booking.email)}</p><p style="margin:0 0 10px"><strong>Event:</strong> ${safeHtml(booking.eventType)}</p><p style="margin:0 0 10px"><strong>Lead matched:</strong> ${booking.matched ? "Yes" : "No"}</p><p style="margin:20px 0 0;color:#736b62">The signed Cal.com webhook is the authoritative booking record.</p>`),
    }, `ai-visibility-booking/${booking.eventKey}`, fetchImpl);
    return true;
  } catch (error) {
    console.error("ai_visibility_booking_notification_failed", error?.message || "unknown");
    return false;
  }
}

function publicError(error) {
  if (error instanceof PublicLeadError) return json(error.status, { ok: false, code: error.code, error: error.publicMessage }, error.status === 405 ? { Allow: "POST" } : {});
  console.error("ai_visibility_unhandled", error?.name || "unknown");
  return json(500, { ok: false, code: "internal_error", error: "The request could not be completed. Please try again or use the booking link." });
}

export async function handleLeadConfig(request, env) {
  if (request.method !== "GET") return json(405, { ok: false, code: "method_not_allowed", error: "Only GET is supported." }, { Allow: "GET" });
  const captureReady = storageReady(env) && ["LEAD_FINGERPRINT_SECRET", "LEAD_REF_SECRET"].every((key) => Boolean(env[key]));
  const notificationReady = ["RESEND_API_KEY", "LEAD_NOTIFICATION_FROM", "LEAD_NOTIFICATION_TO"].every((key) => Boolean(env[key]));
  return json(200, {
    ok: true,
    captureReady,
    notificationReady,
    bookingWebhookReady: storageReady(env) && Boolean(env.CAL_WEBHOOK_SECRET),
    formToken: captureReady ? await createFormToken(env.LEAD_REF_SECRET) : null,
    bookingUrl: env.AI_VISIBILITY_BOOKING_URL || DEFAULT_BOOKING_URL,
    bookingCalLink: env.AI_VISIBILITY_CAL_LINK || "ahmad-bukhari/revenue-handoff-map",
    pdfUrl: DEFAULT_PDF_URL,
    consentVersion: CONSENT_VERSION,
  });
}

export async function handleLeadSubmission(request, env, fetchImpl = fetch) {
  try {
    requirePost(request);
    assertSameOrigin(request, env);
    requireEnv(env, ["LEAD_FINGERPRINT_SECRET", "LEAD_REF_SECRET"]);
    if (!storageReady(env)) throw new PublicLeadError(503, "service_unconfigured", "Lead capture is being configured. Please use the booking or email option.");
    const lead = validateLeadPayload(await readJson(request));
    if (!await verifyFormToken(lead.formToken, env.LEAD_REF_SECRET)) throw new PublicLeadError(400, "form_token_failed", "The secure form session expired. Refresh the page and try again.");
    const submissionId = crypto.randomUUID();
    const result = await captureLeadRecord(env, {
      p_submission_id: submissionId,
      p_fingerprint: await fingerprint(request, env.LEAD_FINGERPRINT_SECRET),
      p_request_type: lead.requestType,
      p_name: lead.name,
      p_email_normalized: lead.email,
      p_company_name: lead.company,
      p_website_url: lead.website,
      p_role_title: lead.role || null,
      p_ai_goal: lead.aiGoal || null,
      p_timing: lead.timing || null,
      p_annual_revenue_range: lead.annualRevenue,
      p_source_context: lead.source,
      p_consent_version: CONSENT_VERSION,
    }, fetchImpl);
    if (result?.reason === "rate_limited") throw new PublicLeadError(429, "rate_limited", "Too many attempts were received. Please use the booking link or try again later.");
    if (!result?.lead_id) throw new PublicLeadError(503, "storage_unavailable", "The request could not be stored. Please use the booking link.");
    let delivery = { ownerNotified: false, visitorAcknowledged: false };
    try {
      delivery = await notifyLead(env, lead, result.lead_id, submissionId, fetchImpl);
    } catch (error) {
      console.error("ai_visibility_notification_failed", error?.message || "unknown");
      try {
        await recordEvent(env, result.lead_id, "notification_failed", `notification:internal-failed:${submissionId}`, { reason: error?.message || "unknown", requestType: lead.requestType }, fetchImpl);
      } catch (recordError) {
        console.error("ai_visibility_notification_failure_log_failed", recordError?.message || "unknown");
      }
    }
    return json(result.created ? 201 : 200, {
      ok: true,
      leadRef: await signedLeadRef(result.lead_id, env.LEAD_REF_SECRET),
      bookingUrl: env.AI_VISIBILITY_BOOKING_URL || DEFAULT_BOOKING_URL,
      pdfUrl: DEFAULT_PDF_URL,
      requestType: lead.requestType,
      delivery,
      deduplicated: !result.created,
    });
  } catch (error) {
    return publicError(error);
  }
}

export async function handleLeadEvent(request, env, fetchImpl = fetch) {
  try {
    requirePost(request);
    assertSameOrigin(request, env);
    requireEnv(env, ["LEAD_REF_SECRET"]);
    const body = await readJson(request, 8 * 1024);
    if (!isPlainObject(body) || Object.keys(body).some((key) => !["leadRef", "eventType", "eventId"].includes(key))) throw new PublicLeadError(400, "invalid_body", "The event could not be recorded.");
    if (!LEAD_EVENTS.has(body.eventType) || !/^[0-9a-f-]{36}$/i.test(body.eventId || "")) throw new PublicLeadError(400, "invalid_event", "The event could not be recorded.");
    const leadId = await verifyLeadRef(body.leadRef, env.LEAD_REF_SECRET);
    if (!leadId) throw new PublicLeadError(403, "invalid_lead_ref", "The event could not be recorded.");
    await recordEvent(env, leadId, body.eventType, `client:${body.eventId}`, {}, fetchImpl);
    return json(202, { ok: true });
  } catch (error) {
    return publicError(error);
  }
}

function webhookEmail(payload) {
  const candidates = [payload?.email, payload?.attendee?.email, payload?.responses?.email?.value, ...(Array.isArray(payload?.attendees) ? payload.attendees.map((item) => item?.email) : [])];
  const email = candidates.find((value) => typeof value === "string" && value.includes("@"));
  return email ? email.trim().toLowerCase().slice(0, 320) : null;
}

export async function handleCalWebhook(request, env, fetchImpl = fetch) {
  try {
    requirePost(request);
    requireEnv(env, ["CAL_WEBHOOK_SECRET"]);
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > 128 * 1024) throw new PublicLeadError(413, "body_too_large", "The webhook payload is too large.");
    const supplied = (request.headers.get("x-cal-signature-256") || "").replace(/^sha256=/i, "").toLowerCase();
    const expected = bytesToHex(await hmac(raw, env.CAL_WEBHOOK_SECRET));
    let difference = expected.length ^ supplied.length;
    for (let index = 0; index < Math.max(expected.length, supplied.length); index++) difference |= (expected.charCodeAt(index) || 0) ^ (supplied.charCodeAt(index) || 0);
    if (difference !== 0) throw new PublicLeadError(401, "invalid_signature", "The webhook signature is invalid.");
    const body = JSON.parse(raw);
    const eventType = cleanText(body.triggerEvent || body.eventType || body.type || "booking_event", 120);
    const payload = isPlainObject(body.payload) ? body.payload : body;
    const email = webhookEmail(payload);
    const uid = cleanText(payload.uid || payload.bookingUid || body.uid || crypto.randomUUID(), 200);
    if (!email) return json(202, { ok: true, matched: false });
    const eventKey = `cal:${eventType}:${uid}`;
    const result = await recordBookingRecord(env, {
      p_email_normalized: email,
      p_event_type: eventType,
      p_event_key: eventKey,
      p_payload: { uid, title: cleanText(payload.title || "", 200), startTime: cleanText(payload.startTime || payload.start || "", 120), status: cleanText(payload.status || "", 80), source: "cal_webhook" },
    }, fetchImpl);
    const ownerNotified = await notifyBooking(env, { email, eventType, eventKey, matched: Boolean(result?.matched) }, fetchImpl);
    return json(202, { ok: true, matched: Boolean(result?.matched), ownerNotified });
  } catch (error) {
    if (error instanceof SyntaxError) return json(400, { ok: false, code: "invalid_json", error: "The webhook payload is invalid." });
    return publicError(error);
  }
}

async function verifyAdmin(request, env, fetchImpl) {
  requireEnv(env, ["SUPABASE_URL", "SUPABASE_PUBLISHABLE_KEY"]);
  const authorization = request.headers.get("authorization") || "";
  if (!/^Bearer \S{20,}$/i.test(authorization)) throw new PublicLeadError(401, "authentication_required", "Sign in as an administrator.");
  const response = await fetchImpl(`${env.SUPABASE_URL.replace(/\/$/, "")}/auth/v1/user`, { headers: { apikey: env.SUPABASE_PUBLISHABLE_KEY, Authorization: authorization } });
  const user = await response.json().catch(() => ({}));
  if (!response.ok || user?.app_metadata?.role !== "admin") throw new PublicLeadError(403, "admin_required", "Administrator access is required.");
  return user;
}

export async function handleAdminNotificationRetry(request, env, fetchImpl = fetch) {
  try {
    requirePost(request);
    assertSameOrigin(request, env);
    const user = await verifyAdmin(request, env, fetchImpl);
    const body = await readJson(request, 8 * 1024);
    if (!isPlainObject(body) || !/^[0-9a-f-]{36}$/i.test(body.leadId || "")) throw new PublicLeadError(400, "invalid_lead", "Choose a valid lead.");
    const row = await loadLeadRecord(env, body.leadId, fetchImpl);
    if (!row) throw new PublicLeadError(404, "lead_not_found", "The lead could not be found.");
    await notifyLead(env, { requestType: row.request_type, name: row.full_name, email: row.email_normalized, company: row.company_name, website: row.website_url, role: row.role_title || "", aiGoal: row.ai_goal || "", timing: row.timing || "", annualRevenue: row.annual_revenue_range, source: row.source_context || {} }, row.id, `retry-${crypto.randomUUID()}`, fetchImpl);
    await recordEvent(env, row.id, "notification_retried", `notification:retry:${row.id}:${crypto.randomUUID()}`, { actorUserId: user.id }, fetchImpl);
    return json(200, { ok: true });
  } catch (error) {
    return publicError(error);
  }
}
