(() => {
  "use strict";
  const config = window.AIXCEL_SYSTEMS_DESK;
  const status = document.getElementById("signal-auth-status");
  const unavailable = document.getElementById("signal-auth-unavailable");
  if (!config?.supabaseUrl || !config?.publishableKey) {
    document.querySelectorAll(".signal-auth-form input, .signal-auth-form button").forEach((control) => { control.disabled = true; });
    if (unavailable) unavailable.hidden = false;
    if (status) { status.textContent = "Secure sign in is unavailable. No details were submitted."; status.dataset.kind = "error"; }
    return;
  }
  // Launch boundary: this session proves identity only. Do not fetch client data until
  // server-side tenant entitlements and an HttpOnly session boundary are implemented.
  const sessionKey = "aixcel.signal.session";
  const existing = document.getElementById("signal-existing-session");
  const panels = [...document.querySelectorAll("[data-auth-panel]")];
  let session = loadSession();

  function loadSession() { try { return JSON.parse(localStorage.getItem(sessionKey)); } catch { localStorage.removeItem(sessionKey); return null; } }
  function saveSession(value) { session = value; if (value) localStorage.setItem(sessionKey, JSON.stringify(value)); else localStorage.removeItem(sessionKey); }
  function normalizeSession(data) { return { access_token: data.access_token, refresh_token: data.refresh_token, expires_at: data.expires_at || Math.floor(Date.now() / 1000) + Number(data.expires_in || 3600), user: data.user || null }; }
  function setStatus(message, kind = "") { if (!status) return; status.textContent = message; status.dataset.kind = kind; }
  function authRedirect() { return `${location.origin}/login`; }

  async function request(path, options = {}, accessToken = session?.access_token) {
    const response = await fetch(`${config.supabaseUrl}${path}`, { ...options, headers: { apikey: config.publishableKey, ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}), "Content-Type": "application/json", ...options.headers } });
    const text = await response.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    if (!response.ok) throw new Error(data?.msg || data?.message || data?.error_description || data?.error || "The request could not be completed.");
    return data;
  }

  async function refreshSession() {
    if (!session?.refresh_token) return false;
    try {
      const data = await request("/auth/v1/token?grant_type=refresh_token", { method: "POST", body: JSON.stringify({ refresh_token: session.refresh_token }) }, null);
      saveSession(normalizeSession(data));
      return true;
    } catch { saveSession(null); return false; }
  }

  function showPanel(name) {
    panels.forEach((panel) => { panel.hidden = panel.dataset.authPanel !== name; });
    setStatus("");
    document.querySelector(`[data-auth-panel="${name}"] input`)?.focus();
  }
  document.querySelectorAll("[data-auth-view]").forEach((button) => button.addEventListener("click", () => showPanel(button.dataset.authView)));

  document.getElementById("signal-login-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    setStatus("Signing in...");
    try {
      const result = await request("/auth/v1/token?grant_type=password", { method: "POST", body: JSON.stringify({ email: String(data.get("email")).trim(), password: data.get("password") }) }, null);
      saveSession(normalizeSession(result));
      setStatus("Signed in. Opening your workspace.", "success");
      location.assign("/workspace");
    } catch (error) { setStatus(/email not confirmed/i.test(error.message) ? "Confirm your email before signing in. Use Resend confirmation if needed." : error.message, "error"); }
  });

  document.getElementById("signal-recover-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const email = new FormData(form).get("email");
    setStatus("Sending the reset link...");
    try { await request(`/auth/v1/recover?redirect_to=${encodeURIComponent(authRedirect())}`, { method: "POST", body: JSON.stringify({ email: String(email).trim() }) }, null); form.reset(); setStatus("If that account exists, a reset link is on its way.", "success"); }
    catch (error) { setStatus(error.message, "error"); }
  });

  document.getElementById("signal-reset-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    if (data.get("password") !== data.get("confirm_password")) { setStatus("The passwords do not match.", "error"); return; }
    setStatus("Updating your password...");
    try { await request("/auth/v1/user", { method: "PUT", body: JSON.stringify({ password: data.get("password") }) }); form.reset(); setStatus("Password updated. Opening your workspace.", "success"); setTimeout(() => location.assign("/workspace"), 500); }
    catch (error) { setStatus(error.message, "error"); }
  });

  document.querySelectorAll("[data-resend-confirmation]").forEach((button) => button.addEventListener("click", async () => {
    const form = button.closest("form");
    const email = form?.elements.namedItem("email");
    if (!email?.reportValidity()) return;
    button.disabled = true;
    setStatus("Requesting a new confirmation email...");
    try { await request(`/auth/v1/resend?redirect_to=${encodeURIComponent(authRedirect())}`, { method: "POST", body: JSON.stringify({ type: "signup", email: email.value.trim() }) }, null); setStatus("Confirmation email requested. Check your inbox and spam.", "success"); }
    catch (error) { setStatus(error.message, "error"); }
    finally { button.disabled = false; }
  }));

  function readAuthFragment() {
    const fragment = new URLSearchParams(location.hash.slice(1));
    const accessToken = fragment.get("access_token");
    if (!accessToken) return false;
    saveSession(normalizeSession({ access_token: accessToken, refresh_token: fragment.get("refresh_token"), expires_in: Number(fragment.get("expires_in")) || 3600 }));
    history.replaceState(null, "", `${location.pathname}${location.search}`);
    if (fragment.get("type") === "recovery") showPanel("reset");
    return true;
  }

  (async () => {
    readAuthFragment();
    if (session && session.expires_at <= Math.floor(Date.now() / 1000) + 60) await refreshSession();
    if (session?.access_token) {
      try { const user = await request("/auth/v1/user", { method: "GET" }); session.user = user; saveSession(session); existing.hidden = false; }
      catch { saveSession(null); }
    }
  })();
})();
