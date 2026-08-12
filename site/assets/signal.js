(() => {
  "use strict";

  const one = (selector, root = document) => root.querySelector(selector);
  const all = (selector, root = document) => [...root.querySelectorAll(selector)];
  const prefersReducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const header = one("[data-signal-header]");
  const menu = one("[data-signal-menu]");
  const nav = one("[data-signal-nav]");
  const navLinks = nav ? all("a", nav) : [];
  const updateHeader = () => header?.classList.toggle("is-scrolled", scrollY > 14);
  updateHeader();
  addEventListener("scroll", updateHeader, { passive: true });
  function setMenu(open, { moveFocus = false, returnFocus = false } = {}) {
    if (!menu || !nav) return;
    nav.classList.toggle("is-open", open);
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open && moveFocus) requestAnimationFrame(() => navLinks[0]?.focus());
    if (!open && returnFocus) menu.focus();
  }
  menu?.addEventListener("click", () => {
    const open = !nav?.classList.contains("is-open");
    setMenu(open, { moveFocus: open });
  });
  navLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav?.classList.contains("is-open")) setMenu(false, { returnFocus: true });
  });
  document.addEventListener("pointerdown", (event) => {
    if (!nav?.classList.contains("is-open") || nav.contains(event.target) || menu?.contains(event.target)) return;
    setMenu(false);
  });
  addEventListener("resize", () => { if (innerWidth > 1100) setMenu(false); }, { passive: true });

  const reveals = all("[data-reveal]");
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((item) => item.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }, { threshold: .12, rootMargin: "0px 0px -8%" });
    reveals.forEach((item) => observer.observe(item));
  }

  const dashboard = one("[data-signal-dashboard]");
  const dashboardViews = {
    visibility: {
      kicker: "VISIBILITY", title: "The selected question across six engines",
      labels: ["Answer coverage", "Leading competitor", "Priority gaps"],
      values: ["37%", "62%", "03"], notes: ["Sample company", "Meridian", "Evidence ranked"],
      chartTitle: "Observed answer coverage", chartChange: "Frozen sample set", bars: [31, 35, 33, 36, 37, 39, 37, 37],
      finding: "Meridian appears in 30 of 48 observed answers while the sample company appears in 18.",
      explanation: "The difference is concentrated in comparison questions where independent proof repeats.",
      rows: [["Question scope", "One commercial question across six engines", "Frozen"], ["Observed answers", "48 responses captured in the sample set", "Observed"], ["Answer gap", "12 additional appearances for Meridian", "Inspect"]],
    },
    competitors: {
      kicker: "COMPETITORS", title: "Who wins the answer set",
      labels: ["Brands tracked", "Largest gap", "Repeat leaders"], values: ["7", "25 pts", "3"], notes: ["Agreed comparison set", "Meridian vs sample", "Across engines"],
      chartTitle: "Answer share by brand", chartChange: "Sorted by presence", bars: [82, 68, 54, 46, 39, 32, 29, 23],
      finding: "Meridian leads because the same implementation proof is easy to verify across owned and independent surfaces.",
      explanation: "The same three external sources appear across most of its strongest answers.",
      rows: [["Meridian", "Strong independent comparison coverage", "Leader"], ["Northstar", "Clear proof blocks on service pages", "Compare"], ["Sample company", "Strong claims, weak corroboration", "Strengthen"]],
    },
    sources: {
      kicker: "SOURCES", title: "Which evidence shapes the answers",
      labels: ["Sources observed", "Coverage gaps", "Priority sources"], values: ["24", "8", "4"], notes: ["Across the answer set", "Relevant proof absent", "Repeat citations"],
      chartTitle: "Source coverage over time", chartChange: "Authority mix", bars: [24, 31, 38, 36, 49, 58, 61, 73],
      finding: "Four repeatedly cited sources cover the category but omit the sample brand.",
      explanation: "The owned proof needs to be stronger before legitimate source inclusion is likely.",
      rows: [["Industry comparisons", "Cited in eight observed answers", "Priority"], ["Editorial analysis", "Repeats Meridian's implementation proof", "Inspect"], ["Owned service page", "Clear offer, thin evidence block", "Improve"]],
    },
    actions: {
      kicker: "ACTIONS", title: "What the team should do next",
      labels: ["Open actions", "Do now", "Needs input"], values: ["12", "3", "2"], notes: ["Ranked by impact", "Evidence is ready", "Owner decision needed"],
      chartTitle: "Expected evidence coverage", chartChange: "After prioritized work", bars: [18, 29, 41, 52, 59, 68, 77, 86],
      finding: "One comparison page and two proof repairs unlock the highest priority prompt cluster.",
      explanation: "Assign an owner, attach the evidence, ship the smallest change, then rerun the frozen prompt set.",
      rows: [["Comparison page", "Decision gap with evidence available", "Do now"], ["Service proof block", "Claims need visible support", "Do now"], ["Source outreach", "Requires reviewed source fit", "Prepare"]],
    },
  };

  function renderDashboard(key) {
    const view = dashboardViews[key];
    if (!dashboard || !view) return;
    one("[data-dashboard-kicker]", dashboard).textContent = view.kicker;
    one("[data-dashboard-title]", dashboard).textContent = view.title;
    view.labels.forEach((label, index) => {
      one(`[data-dashboard-label="${index}"]`, dashboard).textContent = label;
      one(`[data-dashboard-value="${index}"]`, dashboard).textContent = view.values[index];
      one(`[data-dashboard-note="${index}"]`, dashboard).textContent = view.notes[index];
    });
    one("[data-chart-title]", dashboard).textContent = view.chartTitle;
    one("[data-chart-change]", dashboard).textContent = view.chartChange;
    all("[data-signal-chart] i", dashboard).forEach((bar, index) => {
      bar.style.setProperty("--value", `${view.bars[index]}%`);
      one("span", bar).textContent = view.bars[index];
    });
    one("[data-dashboard-finding]", dashboard).textContent = view.finding;
    one("[data-dashboard-explanation]", dashboard).textContent = view.explanation;
    const rows = view.rows.map(([signal, detail, status]) => {
      const row = document.createElement("tr");
      const signalCell = document.createElement("td");
      signalCell.append(document.createElement("i"), document.createTextNode(signal));
      const detailCell = document.createElement("td");
      detailCell.textContent = detail;
      const statusCell = document.createElement("td");
      const statusBadge = document.createElement("span");
      statusBadge.textContent = status;
      statusCell.append(statusBadge);
      row.append(signalCell, detailCell, statusCell);
      return row;
    });
    one("[data-dashboard-rows]", dashboard).replaceChildren(...rows);
    all("[data-signal-view]", dashboard).forEach((button) => {
      const active = button.dataset.signalView === key;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }
  all("[data-signal-view]", dashboard || document).forEach((button) => button.addEventListener("click", () => renderDashboard(button.dataset.signalView)));
  all("[data-signal-agent]").forEach((button) => button.addEventListener("click", () => one("#agent")?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" })));
  one("[data-signal-source-view]")?.addEventListener("click", () => {
    renderDashboard("sources");
    dashboard?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });
    setTimeout(() => one('[data-signal-view="sources"]', dashboard || document)?.focus({ preventScroll: true }), prefersReducedMotion ? 0 : 450);
  });

  const agentAnswers = {
    competitor: { question: "Why does Meridian appear more often than us?", title: "Their proof repeats across the answer ecosystem.", summary: "Meridian's implementation method appears on its site and in independent comparisons, while the sample company's strongest proof is concentrated on one owned page.", steps: ["Map the exact sources used in missed answers.", "Publish one decision-grade comparison for the repeated buyer question.", "Strengthen independent corroboration, then rerun the frozen question set."] },
    sentiment: { question: "Where does the negative sentiment start?", title: "Two source types repeat the same expectation gap.", summary: "Review pages raise a delivery concern, while forum threads repeat an outdated service detail. Answer engines are reflecting both.", steps: ["Verify the source, date, and repeated wording.", "Correct the owned trust and service pages with visible evidence.", "Respond at the source where appropriate, then track whether the answer changes."] },
    content: { question: "What should we publish next?", title: "Close the decision gap before chasing more traffic.", summary: "The observed answers compare providers, but the site does not directly explain who the service fits, how it differs, or which proof supports the choice.", steps: ["Draft the direct buyer comparison question and answer.", "Add evidence, limitations, and relevant independent sources.", "Connect the page to one attributable audit or booking action."] },
  };
  const answerPanel = one("[data-agent-answer]");
  all("[data-agent-question]").forEach((button) => button.addEventListener("click", () => {
    const answer = agentAnswers[button.dataset.agentQuestion];
    if (!answer || !answerPanel) return;
    all("[data-agent-question]").forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    one("[data-agent-question-label]").textContent = answer.question;
    one("[data-agent-title]", answerPanel).textContent = answer.title;
    one("[data-agent-summary]", answerPanel).textContent = answer.summary;
    const steps = answer.steps.map((text) => {
      const item = document.createElement("li");
      item.textContent = text;
      return item;
    });
    one("[data-agent-steps]", answerPanel).replaceChildren(...steps);
    answerPanel.focus({ preventScroll: true });
  }));

  const auditForm = one("#signal-audit-form");
  if (!auditForm) return;
  const quickForm = one("#signal-quick-audit");
  const quickWebsite = one("#signal-quick-website");
  const quickStatus = one("#signal-quick-status");
  const auditStatus = one("#signal-audit-status");
  const auditResult = one("#signal-audit-result");
  const auditFallback = one("#signal-audit-fallback");
  const guideDialog = one("#signal-guide-dialog");
  const guideForm = one("#signal-guide-form");
  const guideStatus = one("#signal-guide-status");
  const guideResult = one("#signal-guide-result");
  let publicConfig = null;
  let directEmailMode = false;
  let leadRef = sessionStorage.getItem("aixcel.signal.leadRef") || "";

  function sourceContext() {
    const params = new URLSearchParams(location.search);
    const source = { landing_page: location.href.slice(0, 2048), entry_path: location.pathname.slice(0, 160), referrer: document.referrer.slice(0, 2048) };
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
      const value = params.get(key);
      if (value) source[key] = value.slice(0, 160);
    }
    return source;
  }

  async function api(path, options = {}) {
    const response = await fetch(path, options);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "The request could not be completed.");
    return data;
  }

  function normalizeWebsite(value) {
    let candidate = String(value || "").trim();
    if (!candidate) return "";
    if (!/^https?:\/\//i.test(candidate)) candidate = `https://${candidate}`;
    try {
      const url = new URL(candidate);
      if (!url.hostname.includes(".")) return "";
      return url.href;
    } catch { return ""; }
  }

  function payloadFrom(form) {
    const data = new FormData(form);
    return {
      requestType: data.get("requestType"), name: data.get("name"), email: data.get("email"), company: data.get("company"), website: data.get("website"),
      role: data.get("role") || "", aiGoal: data.get("aiGoal") || "", timing: data.get("timing") || "", annualRevenue: data.get("annualRevenue"),
      consent: data.get("consent") === "yes", companyFax: data.get("companyFax"), source: sourceContext(), formToken: publicConfig?.formToken || "",
    };
  }

  function setStatus(element, message, kind = "") {
    if (!element) return;
    element.textContent = message;
    element.dataset.kind = kind;
  }

  function directEmailUrl(form, requestType = "free_audit") {
    const data = new FormData(form);
    const label = requestType === "guide_download" ? "AIXCEL SIGNAL field guide request" : "AIXCEL SIGNAL free audit request";
    const body = ["Hello Ahmad,", "", `I would like the ${requestType === "guide_download" ? "AI visibility field guide" : "free AI visibility audit"}.`, `Website: ${data.get("website") || ""}`, `Name: ${data.get("name") || ""}`, `Work email: ${data.get("email") || ""}`, `Company: ${data.get("company") || ""}`, `Annual revenue range: ${data.get("annualRevenue") || ""}`, `Role: ${data.get("role") || ""}`, `Priority question: ${data.get("aiGoal") || ""}`, `Timing: ${data.get("timing") || ""}`, "", "I consent to AiXCEL using these details to fulfil and respond to this request."].join("\n");
    return `mailto:ahmadbukhari4245@gmail.com?subject=${encodeURIComponent(label)}&body=${encodeURIComponent(body)}`;
  }

  function recordEvent(eventType) {
    if (!leadRef) return Promise.resolve();
    return fetch("/api/ai-visibility-lead-events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ leadRef, eventType, eventId: crypto.randomUUID() }), keepalive: true }).catch(() => undefined);
  }

  function showAuditStep(step) {
    const first = one('[data-audit-step="1"]', auditForm);
    const second = one('[data-audit-step="2"]', auditForm);
    first.hidden = step !== 1;
    second.hidden = step !== 2;
    auditForm.dataset.currentStep = String(step);
    one("#signal-audit-progress").textContent = `STEP ${step} OF 2`;
    one("h3", step === 1 ? first : second)?.focus?.({ preventScroll: true });
  }

  one("[data-audit-next]", auditForm)?.addEventListener("click", () => {
    const website = one('[name="website"]', auditForm);
    const normalized = normalizeWebsite(website.value);
    if (!normalized) {
      website.setCustomValidity("Enter a valid company website, such as yourcompany.com.");
      website.reportValidity();
      return;
    }
    website.setCustomValidity("");
    website.value = normalized;
    showAuditStep(2);
  });
  one("[data-audit-back]", auditForm)?.addEventListener("click", () => showAuditStep(1));
  one('[name="website"]', auditForm)?.addEventListener("input", (event) => event.currentTarget.setCustomValidity(""));

  quickForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const normalized = normalizeWebsite(quickWebsite.value);
    if (!normalized) {
      quickWebsite.setCustomValidity("Enter a valid company website, such as yourcompany.com.");
      quickWebsite.reportValidity();
      setStatus(quickStatus, "Enter a valid public website to continue.", "error");
      return;
    }
    quickWebsite.setCustomValidity("");
    one('[name="website"]', auditForm).value = normalized;
    showAuditStep(2);
    setStatus(quickStatus, "Website added. Complete the audit context below.", "success");
    one("#audit")?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
  });
  quickWebsite?.addEventListener("input", () => quickWebsite.setCustomValidity(""));

  auditForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!auditForm.reportValidity()) return;
    if (directEmailMode) {
      setStatus(auditStatus, "Your email app is opening. Review and send the prepared request.");
      location.href = directEmailUrl(auditForm);
      return;
    }
    const submit = one('[type="submit"]', auditForm);
    submit.disabled = true;
    setStatus(auditStatus, "Saving your audit request...");
    try {
      const result = await api("/api/ai-visibility-leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payloadFrom(auditForm)) });
      leadRef = result.leadRef;
      sessionStorage.setItem("aixcel.signal.leadRef", leadRef);
      one("#signal-result-booking").href = result.bookingUrl;
      one("#signal-result-pdf").href = result.pdfUrl;
      one("#signal-audit-result-message").textContent = result.delivery?.visitorAcknowledged ? "A confirmation is in your inbox. Ahmad can now review the website, priority, revenue range, and source path in the private Lead Desk." : "Your request is safely stored in the private Lead Desk. Email confirmation is delayed, but the request is not lost.";
      auditForm.hidden = true;
      auditFallback.hidden = true;
      auditResult.hidden = false;
      auditResult.focus();
    } catch (error) {
      setStatus(auditStatus, error.message, "error");
      submit.disabled = false;
    }
  });

  function openGuide() {
    recordEvent("guide_gate_opened");
    if (typeof guideDialog?.showModal === "function") guideDialog.showModal();
    else guideDialog?.setAttribute("open", "");
    one("input", guideForm)?.focus();
  }
  all("[data-guide-open]").forEach((button) => button.addEventListener("click", openGuide));
  one("[data-guide-close]")?.addEventListener("click", () => guideDialog?.close?.());
  guideDialog?.addEventListener("click", (event) => { if (event.target === guideDialog) guideDialog.close(); });

  guideForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!guideForm.reportValidity()) return;
    if (directEmailMode) {
      setStatus(guideStatus, "Your email app is opening. Review and send the prepared guide request.");
      location.href = directEmailUrl(guideForm, "guide_download");
      return;
    }
    const submit = one('[type="submit"]', guideForm);
    submit.disabled = true;
    setStatus(guideStatus, "Preparing your guide...");
    try {
      const result = await api("/api/ai-visibility-leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payloadFrom(guideForm)) });
      leadRef = result.leadRef;
      sessionStorage.setItem("aixcel.signal.leadRef", leadRef);
      one("#signal-guide-download").href = result.pdfUrl;
      one("#signal-guide-booking").href = result.bookingUrl;
      one("#signal-guide-result-message").textContent = result.delivery?.visitorAcknowledged ? "The guide is ready and a copy is on its way to your inbox." : "The request is stored. Email delivery is delayed, so you can download the guide now.";
      guideForm.hidden = true;
      guideResult.hidden = false;
      guideResult.focus();
    } catch (error) {
      setStatus(guideStatus, error.message, "error");
      submit.disabled = false;
    }
  });

  one("#signal-result-pdf")?.addEventListener("click", () => recordEvent("pdf_download"));
  one("#signal-guide-download")?.addEventListener("click", () => recordEvent("pdf_download"));
  all("[data-booking-link]").forEach((link) => link.addEventListener("click", () => recordEvent("booking_opened")));

  (async () => {
    try {
      publicConfig = await api("/api/ai-visibility-config");
      all("[data-booking-link]").forEach((link) => { link.href = publicConfig.bookingUrl; });
      if (!publicConfig.captureReady || !publicConfig.formToken) throw new Error("Lead capture is not ready.");
    } catch {
      directEmailMode = true;
      auditFallback.hidden = false;
      one("[data-audit-submit-label]", auditForm).textContent = "Prepare my audit email";
      if (guideForm) one("[data-guide-submit-label]", guideForm).textContent = "Prepare my guide email";
    }
  })();
})();
