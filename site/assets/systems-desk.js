(() => {
  "use strict";

  const config = window.AIXCEL_SYSTEMS_DESK;
  if (!config?.supabaseUrl || !config?.publishableKey || !config?.apiPath || !config?.auditApiPath) return;

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
    newThread: el("newThreadButton"),
    threadList: el("threadList"),
    historyStatus: el("historyStatus"),
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
    auditSummary: el("auditSummary"),
    auditOpen: el("auditOpenButton"),
    auditDialog: el("auditDialog"),
    auditForm: el("auditForm"),
    auditResult: el("auditResult"),
    auditReport: el("auditReport"),
    auditScores: el("auditScores"),
    auditSources: el("auditSourceList"),
    auditResultStatus: el("auditResultStatus"),
    auditResultDate: el("auditResultDate"),
    auditRetry: el("auditRetryButton"),
    auditStatus: el("auditStatus"),
    authDialog: el("authDialog"),
    authStatus: el("authStatus"),
  };

  let session = loadSession();
  let problem = null;
  let audit = null;
  let activeAgent = "systems-auditor";
  let activeThreadId = null;
  let threads = [];
  const agentById = new Map();
  let busy = false;
  let auditBusy = false;

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
      ui.historyStatus.textContent = "Sign in to load";
    } else if (!problem) {
      ui.context.textContent = "Account verified. Add a problem brief before asking the desk a question.";
    } else {
      ui.context.textContent = `${problem.business_type} · ${problem.team_size}. Current constraint: ${problem.bottleneck}`;
    }
    updateAuditCard();
  }

  function setThreadUrl(threadId) {
    const url = new URL(location.href);
    if (threadId) url.searchParams.set("thread", threadId);
    else url.searchParams.delete("thread");
    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
  }

  function setAgent(slug, startNew = true) {
    if (busy || !agents[slug]) return;
    activeAgent = slug;
    document.querySelectorAll("[data-agent]").forEach((button) => {
      const selected = button.dataset.agent === slug;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    ui.agentLabel.textContent = agents[slug].label;
    ui.conversationTitle.textContent = agents[slug].title;
    if (startNew) newConversation();
  }

  function newConversation() {
    if (busy) return;
    activeThreadId = null;
    setThreadUrl(null);
    renderThreads();
    resetMessages();
    ui.chatStatus.textContent = "Verified sources will appear beside the answer.";
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

  function renderThreads() {
    ui.threadList.replaceChildren();
    if (!session?.user) return;
    ui.historyStatus.textContent = threads.length ? `${threads.length} saved` : "No conversations yet";
    for (const thread of threads) {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("aria-current", thread.id === activeThreadId ? "page" : "false");
      const title = document.createElement("span");
      title.textContent = thread.title || "Untitled conversation";
      const meta = document.createElement("small");
      const slug = agentById.get(thread.agent_id);
      const date = new Date(thread.updated_at);
      meta.textContent = `${agents[slug]?.label || "DESK"} · ${Number.isNaN(date.valueOf()) ? "Saved" : date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
      button.append(title, meta);
      button.addEventListener("click", () => loadConversation(thread.id));
      item.append(button);
      ui.threadList.append(item);
    }
  }

  async function loadThreads() {
    const rows = await request("/rest/v1/chat_threads?select=id,title,agent_id,updated_at&order=updated_at.desc&limit=50");
    threads = Array.isArray(rows) ? rows : [];
    renderThreads();
  }

  async function loadDeskState() {
    const rows = await request("/rest/v1/agents?select=id,slug&is_active=eq.true&order=sort_order.asc");
    agentById.clear();
    for (const row of rows || []) if (agents[row.slug]) agentById.set(row.id, row.slug);
    await loadThreads();
    const requested = new URLSearchParams(location.search).get("thread");
    if (requested && threads.some(({ id }) => id === requested)) await loadConversation(requested);
  }

  async function loadConversation(threadId) {
    if (busy) return;
    const thread = threads.find(({ id }) => id === threadId);
    const slug = thread && agentById.get(thread.agent_id);
    if (!thread || !slug) return;
    ui.historyStatus.textContent = "Loading…";
    try {
      const rows = await request(`/rest/v1/chat_messages?select=role,content&thread_id=eq.${encodeURIComponent(threadId)}&role=in.(user,assistant)&order=created_at.asc,role.desc,id.asc&limit=200`);
      activeThreadId = threadId;
      setAgent(slug, false);
      setThreadUrl(threadId);
      ui.messages.replaceChildren();
      for (const row of rows || []) {
        const kind = row.role === "user" ? "user" : "assistant";
        const content = String(row.content || "").replace(/\[S\d+\]/gi, "").trim();
        if (content) ui.messages.append(messageNode(kind === "user" ? "YOU" : "DESK", content, kind));
      }
      if (!ui.messages.childElementCount) resetMessages();
      ui.sources.replaceChildren(Object.assign(document.createElement("li"), { textContent: "Sources are shown for new answers in this session." }));
      ui.chatStatus.textContent = "Saved conversation loaded.";
      renderThreads();
      ui.messages.lastElementChild?.scrollIntoView({ block: "end" });
    } catch (error) {
      ui.chatStatus.textContent = error.message;
      renderThreads();
    }
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

  function updateAuditCard() {
    ui.auditOpen.disabled = auditBusy;
    if (!session?.user) {
      ui.auditSummary.textContent = "Sign in with a confirmed email to use the one-time public audit.";
      ui.auditOpen.textContent = "Sign in to audit";
      return;
    }
    if (!audit) {
      ui.auditSummary.textContent = "One evidence-bound public presence audit is available for this verified account and email.";
      ui.auditOpen.textContent = "Start audit";
      return;
    }
    const retryable = isAuditRetryable();
    const labels = {
      running: retryable
        ? "The saved audit was interrupted and can now be resumed."
        : "The saved audit is running or waiting to resume.",
      completed: "Your completed public presence audit is saved to this account.",
      partial: "Your saved audit includes evidence with clearly marked coverage gaps.",
      failed: audit.attempt_count < 3
        ? "The saved audit could not collect evidence. It can be retried."
        : "The saved audit reached its retry limit.",
    };
    ui.auditSummary.textContent = labels[audit.status] || "Your saved audit is available.";
    ui.auditOpen.textContent = retryable ? "Review and retry" : "View audit";
  }

  function isAuditRetryable() {
    if (!audit || audit.attempt_count >= 3) return false;
    if (audit.status === "failed") return true;
    if (audit.status !== "running") return false;
    const updated = new Date(audit.updated_at).valueOf();
    return Number.isFinite(updated) && Date.now() - updated >= 10 * 60 * 1000;
  }

  function closeAudit() {
    if (ui.auditDialog.open) ui.auditDialog.close();
  }

  function appendAuditScore(label, value) {
    const item = document.createElement("div");
    const term = document.createElement("dt");
    const detail = document.createElement("dd");
    term.textContent = label;
    detail.textContent = Number.isInteger(value) ? String(value) : "N/A";
    item.append(term, detail);
    ui.auditScores.append(item);
  }

  function renderAudit() {
    const hasAudit = Boolean(audit);
    ui.auditForm.hidden = hasAudit;
    ui.auditResult.hidden = !hasAudit;
    ui.auditStatus.textContent = "";
    if (!hasAudit) {
      if (problem?.company_name) ui.auditForm.elements.namedItem("companyName").value = problem.company_name;
      return;
    }

    const statusLabels = {
      running: "Audit in progress",
      completed: "Completed audit",
      partial: "Completed with coverage gaps",
      failed: "Evidence collection stopped",
    };
    ui.auditResultStatus.textContent = statusLabels[audit.status] || "Saved audit";
    const completed = new Date(audit.completed_at || audit.updated_at || audit.created_at);
    ui.auditResultDate.textContent = Number.isNaN(completed.valueOf())
      ? "Saved to your account"
      : completed.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
    ui.auditReport.textContent = audit.report_text || (
      audit.status === "running"
        ? isAuditRetryable()
          ? "The previous run was interrupted. Retry to resume this saved audit."
          : "The audit is still running. Close this panel and reopen it shortly to refresh the saved status."
        : "No usable public evidence was collected in this attempt."
    );

    const scores = audit.metrics?.pageSpeed || {};
    ui.auditScores.replaceChildren();
    appendAuditScore("Performance", scores.performance);
    appendAuditScore("Accessibility", scores.accessibility);
    appendAuditScore("Best practices", scores.bestPractices);
    appendAuditScore("SEO", scores.seo);

    ui.auditSources.replaceChildren();
    for (const source of Array.isArray(audit.sources) ? audit.sources : []) {
      const item = document.createElement("li");
      try {
        const url = new URL(source.url);
        if (url.protocol !== "https:") throw new Error();
        const link = document.createElement("a");
        link.href = url.href;
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = `[${source.citation}] ${source.title || url.hostname}`;
        item.append(link);
      } catch {
        item.textContent = `[${source.citation || "S"}] ${source.title || "Public source"}`;
      }
      ui.auditSources.append(item);
    }
    if (!ui.auditSources.childElementCount) {
      ui.auditSources.append(Object.assign(document.createElement("li"), { textContent: "No public source was saved for this attempt." }));
    }
    ui.auditRetry.hidden = !isAuditRetryable();
  }

  async function openAudit() {
    if (!session?.user) {
      openAuth();
      return;
    }
    let loadError = "";
    try { await loadAudit(); } catch (error) { loadError = error.message; }
    renderAudit();
    if (!ui.auditDialog.open) ui.auditDialog.showModal();
    if (loadError) ui.auditStatus.textContent = loadError;
  }

  async function loadAudit() {
    const response = await fetch(config.auditApiPath, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "The saved audit could not be loaded.");
    audit = data.audit || null;
    updateAuditCard();
  }

  async function runAudit(payload) {
    if (auditBusy) return;
    auditBusy = true;
    ui.auditForm.querySelector('button[type="submit"]').disabled = true;
    ui.auditRetry.disabled = true;
    ui.auditStatus.textContent = "Checking the public website and bounded search evidence…";
    updateAuditCard();
    try {
      if (!(await ensureSession())) throw new Error("Your session expired. Sign in again.");
      const response = await fetch(config.auditApiPath, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (data.audit) audit = data.audit;
      renderAudit();
      updateAuditCard();
      if (!response.ok) throw new Error(data.error || "The audit could not be completed.");
      ui.auditStatus.textContent = audit.status === "running"
        ? "The saved audit is already running. Reopen this panel shortly to refresh it."
        : "Audit saved to your account.";
    } catch (error) {
      ui.auditStatus.textContent = error.message;
      if (!session) updateShell();
    } finally {
      auditBusy = false;
      ui.auditForm.querySelector('button[type="submit"]').disabled = false;
      ui.auditRetry.disabled = false;
      updateAuditCard();
    }
  }

  function submitAudit(event) {
    event.preventDefault();
    const values = formObject(event.currentTarget);
    return runAudit({
      companyName: values.companyName.trim(),
      websiteUrl: values.websiteUrl.trim(),
      linkedinUrl: values.linkedinUrl.trim(),
      instagramUrl: values.instagramUrl.trim(),
      consent: values.consent === "on",
    });
  }

  function retryAudit() {
    if (!audit) return;
    return runAudit({
      companyName: audit.company_name,
      websiteUrl: audit.website_url,
      linkedinUrl: audit.linkedin_url || "",
      instagramUrl: audit.instagram_url || "",
      consent: true,
    });
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
      newConversation();
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
        body: JSON.stringify({ agent: activeAgent, message, threadId: activeThreadId }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "The Systems Desk is unavailable right now.");
      pending.replaceWith(messageNode("DESK", data.answer, "assistant"));
      activeThreadId = data.threadId || activeThreadId;
      setThreadUrl(activeThreadId);
      if (data.historySaved) await loadThreads();
      renderSources(data.sources);
      ui.chatStatus.textContent = data.historySaved === false
        ? "Answer received, but conversation history could not be saved. Copy anything you need before leaving."
        : data.model === "none"
          ? "Saved without using model quota."
          : Number.isInteger(data.remaining)
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
    audit = null;
    activeThreadId = null;
    threads = [];
    ui.problemForm.reset();
    ui.auditForm.reset();
    closeAudit();
    setThreadUrl(null);
    renderThreads();
    resetMessages();
    updateShell();
  }

  async function handleLogin(event) {
    event.preventDefault();
    const form = event.currentTarget;
    ui.authStatus.textContent = "Signing in…";
    const values = formObject(form);
    try {
      const data = await request("/auth/v1/token?grant_type=password", {
        method: "POST",
        body: JSON.stringify({ email: values.email.trim(), password: values.password }),
      });
      saveSession(normalizeSession(data));
      await loadProblem();
      await loadDeskState();
      try { await loadAudit(); } catch { audit = null; }
      closeAuth();
      form.reset();
      updateShell();
      if (problem) ui.chatInput.focus();
    } catch (error) {
      ui.authStatus.textContent = /email not confirmed/i.test(error.message)
        ? "Confirm your email before signing in. Use Resend confirmation email if needed."
        : error.message;
    }
  }

  async function handleSignup(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = formObject(form);
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
      form.elements.namedItem("password").value = "";
      form.elements.namedItem("confirm_password").value = "";
      ui.authStatus.textContent = "Account created. Open the confirmation email before signing in. Check spam if it is not in your inbox.";
    } catch (error) { ui.authStatus.textContent = error.message; }
  }

  async function handleResendConfirmation(event) {
    const button = event.currentTarget;
    const form = button.closest("form");
    const email = form.elements.namedItem("email");
    if (!email.reportValidity()) return;

    button.disabled = true;
    ui.authStatus.textContent = "Requesting a new confirmation email…";
    try {
      await request(`/auth/v1/resend?redirect_to=${encodeURIComponent(`${location.origin}/systems-desk`)}`, {
        method: "POST",
        body: JSON.stringify({ type: "signup", email: email.value.trim() }),
      });
      ui.authStatus.textContent = "Confirmation email requested. Check your inbox and spam before trying to sign in.";
    } catch (error) { ui.authStatus.textContent = error.message; }
    finally { button.disabled = false; }
  }

  function handleAuthInvalid(event) {
    if (event.target !== event.currentTarget.querySelector(":invalid")) return;
    const names = {
      email: "Email",
      password: "Password",
      confirm_password: "Confirm password",
      terms: "Terms acceptance",
    };
    ui.authStatus.textContent = `${names[event.target.name] || "Required field"}: ${event.target.validationMessage}`;
  }

  async function handleRecovery(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = formObject(form);
    ui.authStatus.textContent = "Sending the reset link…";
    try {
      await request(`/auth/v1/recover?redirect_to=${encodeURIComponent(`${location.origin}/systems-desk`)}`, {
        method: "POST",
        body: JSON.stringify({ email: values.email.trim() }),
      });
      form.reset();
      ui.authStatus.textContent = "If that account exists, a reset link is on its way.";
    } catch (error) { ui.authStatus.textContent = error.message; }
  }

  async function handleReset(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = formObject(form);
    if (values.password !== values.confirm_password) {
      ui.authStatus.textContent = "The passwords do not match.";
      return;
    }
    ui.authStatus.textContent = "Updating the password…";
    try {
      await request("/auth/v1/user", { method: "PUT", body: JSON.stringify({ password: values.password }) });
      form.reset();
      ui.authStatus.textContent = "Password updated. You can close this window and continue.";
      await loadProblem();
      try { await loadAudit(); } catch { audit = null; }
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
  document.querySelectorAll("[data-auth-view]").forEach((button) => button.addEventListener("click", () => setAuthView(button.dataset.authView)));
  el("gateSignInButton").addEventListener("click", () => openAuth());
  el("closeAuthButton").addEventListener("click", closeAuth);
  ui.newThread.addEventListener("click", newConversation);
  ui.account.addEventListener("click", () => session ? signOut() : openAuth());
  ui.auditOpen.addEventListener("click", openAudit);
  el("closeAuditButton").addEventListener("click", closeAudit);
  ui.auditForm.addEventListener("submit", submitAudit);
  ui.auditRetry.addEventListener("click", retryAudit);
  ui.editProblem.addEventListener("click", () => { fillProblemForm(); ui.chat.hidden = true; ui.problemGate.hidden = false; });
  ui.problemForm.addEventListener("submit", saveProblem);
  ui.chatForm.addEventListener("submit", sendMessage);
  el("loginForm").addEventListener("submit", handleLogin);
  el("signupForm").addEventListener("submit", handleSignup);
  el("recoverForm").addEventListener("submit", handleRecovery);
  el("resetForm").addEventListener("submit", handleReset);
  document.querySelectorAll("[data-resend-confirmation]").forEach((button) => button.addEventListener("click", handleResendConfirmation));
  document.querySelectorAll(".auth-form").forEach((form) => form.addEventListener("invalid", handleAuthInvalid, true));
  ui.authDialog.addEventListener("click", (event) => { if (event.target === ui.authDialog) closeAuth(); });
  ui.auditDialog.addEventListener("click", (event) => { if (event.target === ui.auditDialog) closeAudit(); });
  document.querySelectorAll("form[inert]").forEach((form) => form.removeAttribute("inert"));

  (async () => {
    readAuthFragment();
    if (await ensureSession()) {
      try { await loadProblem(); } catch { problem = null; }
      try { await loadDeskState(); } catch { threads = []; renderThreads(); }
      try { await loadAudit(); } catch { audit = null; }
    }
    updateShell();
  })();
})();
