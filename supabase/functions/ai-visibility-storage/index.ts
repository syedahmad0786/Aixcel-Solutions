import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createRemoteJWKSet, jwtVerify } from "npm:jose@6.1.2";

const VERCEL_ISSUER = "https://oidc.vercel.com/ahmad-bukharis-projects-74a52414";
const VERCEL_AUDIENCE = "https://vercel.com/ahmad-bukharis-projects-74a52414";
const VERCEL_OWNER_ID = "team_vb4HzjdVIToaFHTYK5LDS2cx";
const VERCEL_PROJECT_ID = "prj_EcdxcYb9xLdBpZ78Rbk7dHLReRYI";
const VERCEL_PROJECT = "aixcel-solutions";
const ALLOWED_ENVIRONMENTS = new Set(["production", "preview", "development"]);
const JWKS = createRemoteJWKSet(new URL(`${VERCEL_ISSUER}/.well-known/jwks`));

function response(status: number, payload: Record<string, unknown>) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function projectSecretKey() {
  try {
    const keys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}");
    if (typeof keys.default === "string" && keys.default) return keys.default;
  } catch {
    // Fall through to the legacy environment variable for older projects.
  }
  const legacy = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!legacy) throw new Error("storage_key_missing");
  return legacy;
}

async function authorize(request: Request) {
  const authorization = request.headers.get("authorization") || "";
  if (!authorization.startsWith("Bearer ")) throw new Error("authorization_missing");
  if (request.headers.get("x-aixcel-storage-version") !== "2026-08-12") throw new Error("version_mismatch");
  const token = authorization.slice(7);
  const { payload } = await jwtVerify(token, JWKS, { issuer: VERCEL_ISSUER, audience: VERCEL_AUDIENCE });
  const environment = typeof payload.environment === "string" ? payload.environment : "";
  const expectedSubject = `owner:${payload.owner}:project:${VERCEL_PROJECT}:environment:${environment}`;
  if (
    payload.owner_id !== VERCEL_OWNER_ID ||
    payload.project_id !== VERCEL_PROJECT_ID ||
    payload.project !== VERCEL_PROJECT ||
    payload.sub !== expectedSubject ||
    !ALLOWED_ENVIRONMENTS.has(environment)
  ) throw new Error("identity_mismatch");
}

async function dataApi(path: string, options: RequestInit = {}) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  if (!supabaseUrl) throw new Error("storage_url_missing");
  const key = projectSecretKey();
  const headers: Record<string, string> = {
    apikey: key,
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };
  if (!key.startsWith("sb_secret_")) headers.Authorization = `Bearer ${key}`;
  const result = await fetch(`${supabaseUrl.replace(/\/$/, "")}${path}`, { ...options, headers });
  const raw = await result.text();
  let data: unknown = null;
  try { data = raw ? JSON.parse(raw) : null; } catch { data = null; }
  if (!result.ok) {
    console.error("ai_visibility_storage_data_api_error", result.status, isObject(data) ? data.code : "unknown");
    throw new Error("data_api_failed");
  }
  return data;
}

Deno.serve(async (request: Request) => {
  try {
    if (request.method !== "POST") return response(405, { ok: false, code: "method_not_allowed" });
    const declaredLength = Number(request.headers.get("content-length") || 0);
    if (declaredLength > 64 * 1024) return response(413, { ok: false, code: "body_too_large" });
    await authorize(request);
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > 64 * 1024) return response(413, { ok: false, code: "body_too_large" });
    const body = JSON.parse(raw);
    if (!isObject(body) || typeof body.action !== "string" || !isObject(body.payload)) return response(400, { ok: false, code: "invalid_body" });

    let data: unknown;
    if (body.action === "capture") {
      data = await dataApi("/rest/v1/rpc/capture_ai_visibility_lead", { method: "POST", body: JSON.stringify(body.payload) });
    } else if (body.action === "record_event") {
      data = await dataApi("/rest/v1/ai_visibility_lead_events?on_conflict=event_key", {
        method: "POST",
        headers: { Prefer: "resolution=ignore-duplicates,return=minimal" },
        body: JSON.stringify(body.payload),
      });
    } else if (body.action === "record_booking") {
      data = await dataApi("/rest/v1/rpc/record_ai_visibility_booking", { method: "POST", body: JSON.stringify(body.payload) });
    } else if (body.action === "get_lead") {
      const leadId = typeof body.payload.lead_id === "string" ? body.payload.lead_id : "";
      if (!/^[0-9a-f-]{36}$/i.test(leadId)) return response(400, { ok: false, code: "invalid_lead" });
      const rows = await dataApi(`/rest/v1/ai_visibility_leads?id=eq.${encodeURIComponent(leadId)}&select=id,full_name,email_normalized,company_name,website_url,role_title,ai_goal,timing,request_type,annual_revenue_range,source_context&limit=1`);
      data = Array.isArray(rows) ? rows[0] || null : null;
    } else {
      return response(400, { ok: false, code: "invalid_action" });
    }

    return response(200, { ok: true, data });
  } catch (error) {
    const code = error instanceof SyntaxError ? "invalid_json" : "unauthorized_or_unavailable";
    console.error("ai_visibility_storage_error", error instanceof Error ? error.message : "unknown");
    return response(error instanceof SyntaxError ? 400 : 401, { ok: false, code });
  }
});
