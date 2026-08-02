(() => {
  "use strict";

  const config = window.AIXCEL_SYSTEMS_DESK;
  if (!config?.supabaseUrl || !config?.publishableKey || !config?.apiPath) return;

  const sessionKey = "aixcel.systemsDesk.session";
  const agents = {
    "systems-auditor": {
      label: "SYSTEMS AUDITOR",
      title: "Where is work or revenue getting stuck?",
      greeting: "Your problem brief is loaded. Ask for a diagnosis, challenge an assumption, or request the smallest useful first implementation.",
    },
    "ask-aixcel": {
      label: "ASK AIXCEL",
      title: "What do you need to verify about AiXCEL?",
      greeting: "Ask about AiXCEL services, evidence, operating boundaries, or whether your problem fits the work we can support.",
    },
    "solution-mapper": {
      label: "SOLUTION MAPPER",
      title: "Which workflow needs a controlled route?",
      greeting: "Describe the workflow you want mapped. The answer will separate stages, decisions, owners, exceptions, and human approval points.",
    },
  };

  const el = (id) => document.getElementById(id);
  const ui = {
    account: el("accountButton"),
    start: el("heroStartButton"),
    authGate: el("authGate"),
    problemGate: el("problemGate"),
    problemForm: el("problemForm"),
    problemStatus: el("problemStatus"),
    chat: el("chatWorkspace"),
    messages: el("messageList"),
    chatForm: el("chatForm"),
    chatInput: el("chatInput"),
    chatStatus: el("chatStatus"),
    sessionBadge: el("sessionBadge"),
    agentLabel: el("agentLabel"),
    conversationTitle: el("conversation-title"),
    context: el("contextSummary"),
    editProblem: el("editProblemButton"),
    sources: el("sourceList"),
    authDialog: el("authDialog"),
    authStatus: el("authStatus"),
  };

  let session = loadSession();
  let problem = null;
  let activeAgent = "systems-auditor";
  let history = [];
  let busy = false;

  function loadSession() {
    try { return JSON.parse(localStorage.getItem(sessionKey)); }
    catch { localStorage.removeItem(sessionKey); return null; }
  }

  function saveSession(next) {
    session = next;
    if (next) localStorage.setItem(sessionKey, JSON.stringify(next));
    else localStorage.removeItem(sessionKey);
  }

  function authHeaders(token = session?.access_token) {
    return {
      apikey: config.publishableKey,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    };
  }

  async function request(path, options = {}) {
    const response = await fetch(`${config.supabaseUrl}${path}`, {
      ...options,
      headers: { ...authHeaders(), ...options.headers },
    });
    const text = await response.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    if (!response.ok) {
      const message = data?.msg || data?.message || data?.error_description || data?.error || "The request could not be completed.";
      throw new Error(message);
    }
    return data;
  }

  function normalizeSession(data) {
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at || Math.floor(Date.now() / 1000) + (data.expires_in || 3600),
      user: data.user || session?.user,
    };
  }

  async function ensureSession() {
    if (!session?.access_token) return false;
    try {
      if (session.expires_at && session.expires_at <= Math.floor(Date.now() / 1000) + 60) {
        const refreshed = await request("/auth/v1/token?grant_type=refresh_token", {
          method: "POST",
          body: JSON.stringify({ refresh_token: session.refresh_token }),
        });
        saveSession(normalizeSession(refreshed));
      }
      const user = await request("/auth/v1/user");
      saveSession({ ...session, user });
      return true;
    } catch {
      saveSession(null);
      return false;
    }
  }

  function setAuthView(view) {
    document.querySelectorAll("[data-auth-panel]").forEach((panel) => { panel.hidden = panel.dataset.authPanel !== view; });
    document.querySelectorAll('[role="tab"][data-auth-view]').forEach((tab) => {
      tab.setAttribute("aria-selected", String(tab.dataset.authView === view));
    });
    document.querySelector(".auth-tabs").hidden = view === "reset";
    ui.authStatus.textContent = "";
  }

  function openAuth(view = "login") {
    setAuthView(view);
    if (!ui.authDialog.open) ui.authDialog.showModal();
  }

  function closeAuth() {
    if (ui.authDialog.open) ui.authDialog.close();
  }

  function updateShell() {
    const signedIn = Boolean(session?.user);
    ui.account.textContent = signedIn ? "Sign out" : "Sign in";
    ui.sessionBadge.textContent = signedIn ? "Verified account" : "Signed out";
    ui.authGate.hidden = signedIn;
    ui.problemGate.hidden = !signedIn || Boolean(problem);
    ui.chat.hidden = !signedIn || !problem;
    ui.editProblem.hidden = !problem;
    if (!signedIn) {
      ui.context.textContent = "Sign in and save a problem brief to give the desk useful operating context.";
    } else if (!problem) {
      ui.context.textContent = "Account verified. Add a problem brief before asking the desk a question.";
    } else {
      ui.context.textContent = `${problem.business_type} · ${problem.team_size}. Current constraint: ${problem.bottleneck}`;
    }
  }

  function setAgent(slug) {
    if (!agents[slug]) return;
    activeAgent = slug;
    document.querySelectorAll("[data-agent]").forEach((button) => button.classList.toggle("is-active", button.dataset.agent === slug));
    ui.agentLabel.textContent = agents[slug].label;
    ui.conversationTitle.textContent = agents[slug].title;
    history = [];
    resetMessages();
  }

  function resetMessages() {
    ui.messages.replaceChildren(messageNode("DESK", agents[activeAgent].greeting, "system"));
    ui.sources.replaceChildren(Object.assign(document.createElement("li"), { textContent: "No answer inspected yet." }));
  }

  function messageNode(label, content, kind, pending = false) {
    const item = document.createElement("li");
    item.className = `message message-${kind}${pending ? " is-pending" : ""}`;
    const meta = document.createElement("span");
    meta.textContent = label;
    const body = document.createElement("p");
    body.textContent = content;
    item.append(meta, body);
    return item;
  }

  function renderSources(sources) {
    ui.sources.replaceChildren();
    if (!Array.isArray(sources) || !sources.length) {
      ui.sources.append(Object.assign(document.createElement("li"), { textContent: "The answer did not claim a supporting source." }));
      return;
    }
    for (const source of sources) {
      const item = document.createElement("li");
      try {
        const url = new URL(source.url);
        if (url.protocol !== "https:" || !["aixcelsolutions.com", "www.aixcelsolutions.com"].includes(url.hostname)) throw new Error();
        const link = document.createElement("a");
        link.href = url.href;
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = source.title || url.pathname;
        item.append(link);
      } catch {
        item.textContent = source.title || "Approved AiXCEL source";
      }
      ui.sources.append(item);
    }
  }

  function formObject(form) {
    return Object.fromEntries(new FormData(form).entries());
  }

  function fillProblemForm() {
    if (!problem) return;
    for (const [name, value] of Object.entries(problem)) {
      const field = ui.problemForm.elements.namedItem(name);
      if (field && typeof value === "string") field.value = value;
    }
    const consent = ui.problemForm.elements.namedItem("consent");
    if (consent) consent.checked = true;
  }

  function parseBusinessContext(value) {
    if (!value) return {};
    if (typeof value === "object") return value;
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch { return { workflow: value }; }
  }

  async function loadProblem() {
    const fields = "problem,business_context,desired_outcome,constraints,status,created_at";
    const userId = encodeURIComponent(session.user.id);
    const rows = await request(`/rest/v1/problem_intakes?select=${fields}&user_id=eq.${userId}&order=created_at.desc&limit=1`);
    const row = rows?.[0];
    problem = row ? { ...parseBusinessContext(row.business_context), bottleneck: row.problem, desired_outcome: row.desired_outcome } : null;
    if (row) {
      const profiles = await request(`/rest/v1/profiles?select=full_name,company_name,role_title&user_id=eq.${userId}&limit=1`);
      const profile = profiles?.[0] || {};
      problem = { ...problem, full_name: profile.full_name || "", company_name: profile.company_name || "", role_title: profile.role_title || "" };
    }
  }

  async function saveProblem(event) {
    event.preventDefault();
    ui.problemStatus.textContent = "Saving…";
    const values = formObject(ui.problemForm);
    if (values.consent !== "on") return;
    try {
      await request(`/rest/v1/profiles?user_id=eq.${encodeURIComponent(session.user.id)}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          full_name: values.full_name.trim(),
          company_name: values.company_name.trim(),
          role_title: values.role_title.trim(),
        }),
      });
      await request("/rest/v1/problem_intakes", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          problem: values.bottleneck.trim(),
          business_context: {
            business_type: values.business_type,
            team_size: values.team_size,
            urgency: values.urgency,
            workflow: values.workflow.trim(),
            current_tools: values.current_tools.trim(),
          },
          desired_outcome: values.desired_outcome.trim(),
          constraints: `Urgency: ${values.urgency}`,
          status: "submitted",
          consent_version: config.privacyVersion,
        }),
      });
      problem = { ...values, consent: undefined };
      ui.problemStatus.textContent = "Saved.";
      updateShell();
      resetMessages();
      ui.chatInput.focus();
    } catch (error) {
      ui.problemStatus.textContent = error.message;
    }
  }

  async function sendMessage(event) {
    event.preventDefault();
    const message = ui.chatInput.value.trim();
    if (!message || busy) return;
    busy = true;
    const submit = ui.chatForm.querySelector('button[type="submit"]');
    submit.disabled = true;
    ui.chatInput.value = "";
    ui.messages.append(messageNode("YOU", message, "user"));
    const pending = messageNode("DESK", "Inspecting the approved evidence", "assistant", true);
    ui.messages.append(pending);
    pending.scrollIntoView({ behavior: "smooth", block: "nearest" });
    ui.chatStatus.textContent = "Grounding the answer…";
    try {
      if (!(await ensureSession())) throw new Error("Your session expired. Sign in again.");
      const response = await fetch(config.apiPath, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ agent: activeAgent, message, history: history.slice(-6) }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "The Systems Desk is unavailable right now.");
      pending.replaceWith(messageNode("DESK", data.answer, "assistant"));
      history.push(
        { role: "user", content: message.slice(0, 1_000) },
        { role: "assistant", content: data.answer.slice(0, 1_000) },
      );
      history = history.slice(-6);
      renderSources(data.sources);
      ui.chatStatus.textContent = Number.isInteger(data.remaining)
        ? `${data.remaining} question${data.remaining === 1 ? "" : "s"} remaining today. Model: ${data.model}.`
        : `Answer grounded. Model: ${data.model}.`;
    } catch (error) {
      pending.replaceWith(messageNode("DESK", error.message, "assistant"));
      ui.chatStatus.textContent = "No question was completed.";
      if (!session) updateShell();
    } finally {
      busy = false;
      submit.disabled = false;
      ui.chatInput.focus();
    }
  }

  async function signOut() {
    try { await request("/auth/v1/logout", { method: "POST" }); } catch { /* local sign-out must still work */ }
    saveSession(null);
    problem = null;
    history = [];
    ui.problemForm.reset();
    resetMessages();
    updateShell();
  }

  async function handleLogin(event) {
    event.preventDefault();
    ui.authStatus.textContent = "Signing in…";
    const values = formObject(event.currentTarget);
    try {
      const data = await request("/auth/v1/token?grant_type=password", {
        method: "POST",
        body: JSON.stringify({ email: values.email.trim(), password: values.password }),
      });
      saveSession(normalizeSession(data));
      await loadProblem();
      closeAuth();
      event.currentTarget.reset();
      updateShell();
      if (problem) ui.chatInput.focus();
    } catch (error) { ui.authStatus.textContent = error.message; }
  }

  async function handleSignup(event) {
    event.preventDefault();
    const values = formObject(event.currentTarget);
    if (values.password !== values.confirm_password) {
      ui.authStatus.textContent = "The passwords do not match.";
      return;
    }
    ui.authStatus.textContent = "Creating the account…";
    try {
      await request(`/auth/v1/signup?redirect_to=${encodeURIComponent(`${location.origin}/systems-desk`)}`, {
        method: "POST",
        body: JSON.stringify({ email: values.email.trim(), password: values.password }),
      });
      event.currentTarget.reset();
      ui.authStatus.textContent = "Check your email and verify the account, then return here to sign in.";
    } catch (error) { ui.authStatus.textContent = error.message; }
  }

  async function handleRecovery(event) {
    event.preventDefault();
    const values = formObject(event.currentTarget);
    ui.authStatus.textContent = "Sending the reset link…";
    try {
      await request(`/auth/v1/recover?redirect_to=${encodeURIComponent(`${location.origin}/systems-desk`)}`, {
        method: "POST",
        body: JSON.stringify({ email: values.email.trim() }),
      });
      event.currentTarget.reset();
      ui.authStatus.textContent = "If that account exists, a reset link is on its way.";
    } catch (error) { ui.authStatus.textContent = error.message; }
  }

  async function handleReset(event) {
    event.preventDefault();
    const values = formObject(event.currentTarget);
    if (values.password !== values.confirm_password) {
      ui.authStatus.textContent = "The passwords do not match.";
      return;
    }
    ui.authStatus.textContent = "Updating the password…";
    try {
      await request("/auth/v1/user", { method: "PUT", body: JSON.stringify({ password: values.password }) });
      event.currentTarget.reset();
      ui.authStatus.textContent = "Password updated. You can close this window and continue.";
      await loadProblem();
      updateShell();
    } catch (error) { ui.authStatus.textContent = error.message; }
  }

  function readAuthFragment() {
    const fragment = new URLSearchParams(location.hash.slice(1));
    const accessToken = fragment.get("access_token");
    if (!accessToken) return false;
    saveSession(normalizeSession({
      access_token: accessToken,
      refresh_token: fragment.get("refresh_token"),
      expires_in: Number(fragment.get("expires_in")) || 3600,
    }));
    window.history.replaceState(null, "", `${location.pathname}${location.search}`);
    if (fragment.get("type") === "recovery") openAuth("reset");
    return true;
  }

  document.querySelectorAll("[data-agent]").forEach((button) => button.addEventListener("click", () => setAgent(button.dataset.agent)));
  document.querySelectorAll("[data-select-agent]").forEach((button) => button.addEventListener("click", () => {
    setAgent(button.dataset.selectAgent);
    document.querySelector(".desk-shell").scrollIntoView({ behavior: "smooth" });
    if (!session) openAuth();
  }));
  document.querySelectorAll("[data-auth-view]").forEach((button) => button.addEventListener("click", () => setAuthView(button.dataset.authView)));
  el("gateSignInButton").addEventListener("click", () => openAuth());
  el("closeAuthButton").addEventListener("click", closeAuth);
  ui.start.addEventListener("click", () => {
    document.querySelector(".desk-shell").scrollIntoView({ behavior: "smooth" });
    if (!session) openAuth();
  });
  ui.account.addEventListener("click", () => session ? signOut() : openAuth());
  ui.editProblem.addEventListener("click", () => { fillProblemForm(); ui.chat.hidden = true; ui.problemGate.hidden = false; });
  ui.problemForm.addEventListener("submit", saveProblem);
  ui.chatForm.addEventListener("submit", sendMessage);
  el("loginForm").addEventListener("submit", handleLogin);
  el("signupForm").addEventListener("submit", handleSignup);
  el("recoverForm").addEventListener("submit", handleRecovery);
  el("resetForm").addEventListener("submit", handleReset);
  ui.authDialog.addEventListener("click", (event) => { if (event.target === ui.authDialog) closeAuth(); });
  document.querySelectorAll("form[inert]").forEach((form) => form.removeAttribute("inert"));

  (async () => {
    readAuthFragment();
    if (await ensureSession()) {
      try { await loadProblem(); } catch { problem = null; }
    }
    updateShell();
  })();
})();
