import {
  handleAdminNotificationRetry,
  handleCalWebhook,
  handleLeadConfig,
  handleLeadEvent,
  handleLeadSubmission,
} from "./ai-visibility-core.mjs";

const handlers = new Map([
  ["/api/ai-visibility-config", handleLeadConfig],
  ["/api/ai-visibility-leads", handleLeadSubmission],
  ["/api/ai-visibility-lead-events", handleLeadEvent],
  ["/api/ai-visibility-admin", handleAdminNotificationRetry],
  ["/api/cal-booking-webhook", handleCalWebhook],
]);

const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy": "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://app.cal.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://www.google.com https://app.cal.com https://cal.com; frame-src https://challenges.cloudflare.com https://app.cal.com https://cal.com; connect-src 'self' https://ozvltcgrmgzeyoxklozz.supabase.co https://challenges.cloudflare.com https://app.cal.com https://cal.com; upgrade-insecure-requests",
};

function withSecurity(response) {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(securityHeaders)) headers.set(name, value);
  if (response.headers.get("content-type")?.includes("text/html")) headers.set("Cache-Control", "private, no-cache");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

async function staticResponse(request, env) {
  if (!env.ASSETS?.fetch) return new Response("Static asset binding is unavailable.", { status: 503 });
  let response = await env.ASSETS.fetch(request);
  const url = new URL(request.url);
  if (response.status === 404 && request.method === "GET" && !/\.[a-z0-9]+$/i.test(url.pathname) && url.pathname !== "/") {
    const htmlUrl = new URL(request.url);
    htmlUrl.pathname = `${htmlUrl.pathname.replace(/\/$/, "")}.html`;
    response = await env.ASSETS.fetch(new Request(htmlUrl, request));
  }
  return response;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const handler = handlers.get(url.pathname);
    if (handler) return withSecurity(await handler(request, env, fetch));
    if (url.pathname.startsWith("/api/")) {
      return withSecurity(new Response(JSON.stringify({ error: "This private preview API remains available on the canonical AiXCEL deployment." }), { status: 503, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } }));
    }
    return withSecurity(await staticResponse(request, env));
  },
};
