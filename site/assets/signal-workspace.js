(() => {
  "use strict";
  const config = window.AIXCEL_SYSTEMS_DESK;
  const sessionKey = "aixcel.signal.session";
  const loading = document.getElementById("signal-workspace-loading");
  const app = document.getElementById("signal-workspace-app");
  // Identity-only launch shell. Keep client data disconnected until a server endpoint
  // enforces tenant entitlement through an HttpOnly session and returns only that tenant's data.
  let session = null;
  try { session = JSON.parse(localStorage.getItem(sessionKey)); } catch { localStorage.removeItem(sessionKey); }
  const saveSession = (value) => { session = value; if (value) localStorage.setItem(sessionKey, JSON.stringify(value)); else localStorage.removeItem(sessionKey); };
  const redirectToLogin = () => location.replace(`/login?next=${encodeURIComponent("/workspace")}`);

  async function request(path, options = {}, token = session?.access_token) {
    const response = await fetch(`${config.supabaseUrl}${path}`, { ...options, headers: { apikey: config.publishableKey, ...(token ? { Authorization: `Bearer ${token}` } : {}), "Content-Type": "application/json", ...options.headers } });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || data.error || "Your session could not be checked.");
    return data;
  }

  async function refresh() {
    if (!session?.refresh_token) return false;
    try {
      const data = await request("/auth/v1/token?grant_type=refresh_token", { method: "POST", body: JSON.stringify({ refresh_token: session.refresh_token }) }, null);
      saveSession({ access_token: data.access_token, refresh_token: data.refresh_token, expires_at: data.expires_at || Math.floor(Date.now() / 1000) + Number(data.expires_in || 3600), user: data.user });
      return true;
    } catch { saveSession(null); return false; }
  }

  document.getElementById("signal-signout")?.addEventListener("click", async () => {
    try { await request("/auth/v1/logout", { method: "POST" }); } catch { /* local sign-out still completes */ }
    saveSession(null);
    redirectToLogin();
  });

  (async () => {
    if (!config?.supabaseUrl || !config?.publishableKey || !session?.access_token) { redirectToLogin(); return; }
    if (session.expires_at <= Math.floor(Date.now() / 1000) + 60 && !(await refresh())) { redirectToLogin(); return; }
    try {
      const user = await request("/auth/v1/user", { method: "GET" });
      session.user = user;
      saveSession(session);
      document.getElementById("signal-workspace-email").textContent = user.email || "Signed in";
      loading.hidden = true;
      app.hidden = false;
      fetch("/api/ai-visibility-config").then((response) => response.ok ? response.json() : null).then((publicConfig) => { if (!publicConfig?.bookingUrl) return; document.querySelectorAll("[data-booking-link]").forEach((link) => { link.href = publicConfig.bookingUrl; }); }).catch(() => undefined);
    } catch { saveSession(null); redirectToLogin(); }
  })();
})();
