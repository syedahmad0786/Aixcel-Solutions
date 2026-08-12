import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";

import {
  handleAdminNotificationRetry,
  handleCalWebhook,
  handleLeadConfig,
  handleLeadEvent,
  handleLeadSubmission,
  validateLeadPayload,
} from "../server/ai-visibility-core.mjs";
import { createVercelHandler } from "../server/ai-visibility-web-handler.mjs";

const leadId = "7db3f154-2de1-49bf-9f6d-79161a092386";
const eventId = "609bc97c-0998-4a8a-80d2-0b901570e0c4";

const env = {
  SITE_URL: "https://aixcelsolutions.com",
  SUPABASE_URL: "https://project.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-secret",
  SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test_value_123456",
  LEAD_FINGERPRINT_SECRET: "fingerprint-secret",
  LEAD_REF_SECRET: "lead-ref-secret",
  LEAD_NOTIFICATION_TO: "leads@aixcelsolutions.com",
  LEAD_NOTIFICATION_FROM: "AiXCEL <leads@updates.aixcelsolutions.com>",
  RESEND_API_KEY: "re_test_key",
  CAL_WEBHOOK_SECRET: "cal-webhook-secret",
};

const validLead = {
  requestType: "free_audit",
  name: "  Ada   Founder ",
  email: "ADA@EXAMPLE.COM",
  company: "Example Company",
  website: "example.com/",
  role: "Founder",
  aiGoal: "Explain our governed operations service to qualified buyers.",
  timing: "now",
  annualRevenue: "1m_5m",
  consent: true,
  companyFax: "",
  formToken: "placeholder-token",
  source: { utm_source: "linkedin", landing_page: "https://aixcelsolutions.com/services/ai-search-visibility" },
};

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: { "content-type": "application/json" } });
}

function post(path, body, headers = {}) {
  return new Request(`https://aixcelsolutions.com${path}`, {
    method: "POST",
    headers: { Origin: "https://aixcelsolutions.com", "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

test("passes Vercel's protected runtime OIDC header to the storage environment", async () => {
  let observedToken = null;
  const handler = createVercelHandler(async (_request, runtimeEnv) => {
    observedToken = runtimeEnv.VERCEL_OIDC_TOKEN;
    return jsonResponse({ ok: true });
  }, { env: { SITE_URL: "https://aixcelsolutions.com" } });
  let body = "";
  const response = { statusCode: 0, setHeader() {}, end(chunk) { body = Buffer.from(chunk).toString("utf8"); } };
  await handler({ method: "GET", url: "/api/test", headers: { host: "aixcelsolutions.com", "x-vercel-oidc-token": "runtime-oidc-token" } }, response);
  assert.equal(observedToken, "runtime-oidc-token");
  assert.equal(response.statusCode, 200);
  assert.deepEqual(JSON.parse(body), { ok: true });
});

async function leadWithFreshToken(overrides = {}, environment = env) {
  const response = await handleLeadConfig(new Request("https://aixcelsolutions.com/api/ai-visibility-config"), environment);
  const config = await response.json();
  return { ...validLead, ...overrides, formToken: config.formToken };
}

test("normalizes the bounded lead payload and rejects bot, consent, and client-field bypasses", () => {
  const lead = validateLeadPayload(validLead);
  assert.equal(lead.name, "Ada Founder");
  assert.equal(lead.email, "ada@example.com");
  assert.equal(lead.website, "https://example.com");
  assert.equal(lead.requestType, "free_audit");
  assert.equal(lead.annualRevenue, "1m_5m");
  assert.deepEqual(lead.source, {
    utm_source: "linkedin",
    landing_page: "https://aixcelsolutions.com/services/ai-search-visibility",
  });

  assert.throws(() => validateLeadPayload({ ...validLead, consent: false }), /consent_required/);
  assert.throws(() => validateLeadPayload({ ...validLead, companyFax: "spam" }), /submission_rejected/);
  assert.throws(() => validateLeadPayload({ ...validLead, ownerUserId: leadId }), /invalid_body/);
  assert.throws(() => validateLeadPayload({ ...validLead, website: "javascript:alert(1)" }), /invalid_website/);
  assert.throws(() => validateLeadPayload({ ...validLead, timing: "immediately" }), /invalid_timing/);
  assert.throws(() => validateLeadPayload({ ...validLead, annualRevenue: "enterprise" }), /invalid_revenue/);
  const guide = validateLeadPayload({ ...validLead, requestType: "guide_download", role: "", aiGoal: "", timing: "" });
  assert.equal(guide.requestType, "guide_download");
  assert.equal(guide.role, "");
});

test("returns only public lead configuration", async () => {
  const response = await handleLeadConfig(new Request("https://aixcelsolutions.com/api/ai-visibility-config"), env);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.ok, true);
  assert.equal(body.captureReady, true);
  assert.equal(body.notificationReady, true);
  assert.equal(body.bookingWebhookReady, true);
  assert.match(body.formToken, /^v1\.\d{10}\.[0-9a-f-]{36}\.[A-Za-z0-9_-]{43}$/);
  assert.equal(body.bookingUrl, "https://cal.com/ahmad-bukhari/revenue-handoff-map");
  assert.equal(body.bookingCalLink, "ahmad-bukhari/revenue-handoff-map");
  assert.equal(body.pdfUrl, "/guides/ai-search-visibility-brief.pdf");
  assert.equal(body.consentVersion, "2026-08-12");
});

test("fails the public capture readiness flag closed when server credentials are incomplete", async () => {
  const response = await handleLeadConfig(new Request("https://aixcelsolutions.com/api/ai-visibility-config"), {
    LEAD_REF_SECRET: env.LEAD_REF_SECRET,
  });
  const body = await response.json();
  assert.equal(body.captureReady, false);
  assert.equal(body.formToken, null);
});

test("stores the lead before sending both transactional emails and returns a signed reference", async () => {
  const calls = [];
  const fetchImpl = async (url, options = {}) => {
    const target = String(url);
    calls.push({ target, options });
    if (target.endsWith("/rest/v1/rpc/capture_ai_visibility_lead")) {
      const body = JSON.parse(options.body);
      assert.equal(body.p_email_normalized, "ada@example.com");
      assert.equal(body.p_website_url, "https://example.com");
      assert.equal(body.p_request_type, "free_audit");
      assert.equal(body.p_annual_revenue_range, "1m_5m");
      assert.match(body.p_fingerprint, /^[0-9a-f]{64}$/);
      return jsonResponse({ reason: "created", lead_id: leadId, created: true });
    }
    if (target === "https://api.resend.com/emails") return jsonResponse({ id: `email-${calls.length}` }, 201);
    if (target.includes("/rest/v1/ai_visibility_lead_events?")) return new Response(null, { status: 201 });
    throw new Error(`Unexpected fetch: ${target}`);
  };

  const response = await handleLeadSubmission(post("/api/ai-visibility-leads", await leadWithFreshToken()), env, fetchImpl);
  const data = await response.json();
  assert.equal(response.status, 201);
  assert.equal(data.ok, true);
  assert.equal(data.deduplicated, false);
  assert.deepEqual(data.delivery, { ownerNotified: true, visitorAcknowledged: true });
  assert.match(data.leadRef, new RegExp(`^v1\\.${leadId.replaceAll("-", "\\-")}\\.[A-Za-z0-9_-]{43}$`));
  assert.equal(calls.filter(({ target }) => target === "https://api.resend.com/emails").length, 2);
  assert.ok(calls.findIndex(({ target }) => target.includes("capture_ai_visibility_lead")) < calls.findIndex(({ target }) => target === "https://api.resend.com/emails"));

  let savedEvent = null;
  const eventResponse = await handleLeadEvent(post("/api/ai-visibility-lead-events", { leadRef: data.leadRef, eventType: "pdf_download", eventId }), env, async (url, options = {}) => {
    assert.match(String(url), /ai_visibility_lead_events/);
    savedEvent = JSON.parse(options.body);
    return new Response(null, { status: 201 });
  });
  assert.equal(eventResponse.status, 202);
  assert.deepEqual(savedEvent, { lead_id: leadId, event_type: "pdf_download", event_key: `client:${eventId}`, payload: {} });
});

test("uses the Vercel OIDC storage bridge without exposing a database admin key", async () => {
  const bridgeEnv = {
    ...env,
    SUPABASE_URL: "",
    SUPABASE_SERVICE_ROLE_KEY: "",
    AI_VISIBILITY_STORAGE_URL: "https://project.supabase.co/functions/v1/ai-visibility-storage",
    VERCEL_OIDC_TOKEN: "signed-vercel-oidc-token",
  };
  const actions = [];
  const fetchImpl = async (url, options = {}) => {
    if (String(url) === bridgeEnv.AI_VISIBILITY_STORAGE_URL) {
      assert.equal(options.headers.Authorization, `Bearer ${bridgeEnv.VERCEL_OIDC_TOKEN}`);
      const body = JSON.parse(options.body);
      actions.push(body.action);
      if (body.action === "capture") return jsonResponse({ ok: true, data: { reason: "created", lead_id: leadId, created: true } });
      if (body.action === "record_event") return jsonResponse({ ok: true, data: null });
    }
    if (String(url) === "https://api.resend.com/emails") return jsonResponse({ id: `bridge-email-${actions.length}` }, 201);
    throw new Error(`Unexpected fetch: ${url}`);
  };
  const response = await handleLeadSubmission(post("/api/ai-visibility-leads", await leadWithFreshToken({}, bridgeEnv)), bridgeEnv, fetchImpl);
  assert.equal(response.status, 201);
  assert.equal(actions[0], "capture");
  assert.ok(actions.slice(1).every((action) => action === "record_event"));
  assert.deepEqual((await response.json()).delivery, { ownerNotified: true, visitorAcknowledged: true });
});

test("rejects expired form sessions and cross-origin submissions before storage", async () => {
  let calls = 0;
  const failedToken = await handleLeadSubmission(post("/api/ai-visibility-leads", validLead), env, async () => { calls += 1; throw new Error("should not fetch"); });
  assert.equal(failedToken.status, 400);
  assert.equal((await failedToken.json()).code, "form_token_failed");
  assert.equal(calls, 0);

  calls = 0;
  const crossOrigin = post("/api/ai-visibility-leads", await leadWithFreshToken(), { Origin: "https://evil.example" });
  const denied = await handleLeadSubmission(crossOrigin, env, async () => { calls += 1; throw new Error("should not fetch"); });
  assert.equal(denied.status, 403);
  assert.equal((await denied.json()).code, "origin_denied");
  assert.equal(calls, 0);
});

test("verifies the Cal signature and records an authoritative booking event", async () => {
  const raw = JSON.stringify({
    triggerEvent: "BOOKING_CREATED",
    payload: { uid: "cal-uid-1", attendees: [{ email: "ADA@EXAMPLE.COM" }], title: "AI Visibility Baseline", startTime: "2026-08-20T09:00:00Z" },
  });
  const signature = createHmac("sha256", env.CAL_WEBHOOK_SECRET).update(raw).digest("hex");
  let rpcBody;
  const response = await handleCalWebhook(new Request("https://aixcelsolutions.com/api/cal-booking-webhook", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-cal-signature-256": signature },
    body: raw,
  }), env, async (url, options = {}) => {
    if (String(url).endsWith("/record_ai_visibility_booking")) {
      rpcBody = JSON.parse(options.body);
      return jsonResponse({ matched: true, lead_id: leadId });
    }
    if (String(url) === "https://api.resend.com/emails") return jsonResponse({ id: "booking-email" }, 201);
    throw new Error(`Unexpected fetch: ${url}`);
  });
  assert.equal(response.status, 202);
  assert.deepEqual(await response.json(), { ok: true, matched: true, ownerNotified: true });
  assert.equal(rpcBody.p_email_normalized, "ada@example.com");
  assert.equal(rpcBody.p_event_key, "cal:BOOKING_CREATED:cal-uid-1");

  const invalid = await handleCalWebhook(new Request("https://aixcelsolutions.com/api/cal-booking-webhook", {
    method: "POST",
    headers: { "x-cal-signature-256": "0".repeat(64) },
    body: raw,
  }), env, async () => { throw new Error("should not fetch"); });
  assert.equal(invalid.status, 401);
  assert.equal((await invalid.json()).code, "invalid_signature");
});

test("requires an authenticated admin before retrying a lead notification", async () => {
  const request = post("/api/ai-visibility-admin", { leadId }, { Authorization: "Bearer a-valid-looking-user-token" });
  let calls = 0;
  const response = await handleAdminNotificationRetry(request, env, async (url) => {
    calls += 1;
    assert.match(String(url), /\/auth\/v1\/user$/);
    return jsonResponse({ id: "user-1", app_metadata: { role: "member" } });
  });
  assert.equal(response.status, 403);
  assert.equal((await response.json()).code, "admin_required");
  assert.equal(calls, 1);
});
