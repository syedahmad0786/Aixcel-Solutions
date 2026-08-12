(() => {
  "use strict";

  const agentDemo = {
    title: document.getElementById("agent-demo-title"),
    summary: document.getElementById("agent-demo-summary"),
    steps: document.getElementById("agent-demo-steps"),
    buttons: [...document.querySelectorAll("[data-agent-question]")],
  };
  const agentAnswers = {
    competitor: {
      title: "Your competitor has a stronger source footprint.",
      summary: "It appears across more independent comparison and review sources, while your strongest proof is concentrated on your own website.",
      steps: ["Map the exact sources used in the missed answers.", "Publish a comparison page that resolves the repeated buyer question.", "Strengthen independent corroboration, then monitor the same prompt set."],
    },
    sentiment: {
      title: "The negative theme is repeating across two source types.",
      summary: "Review pages raise an expectation gap, while forum discussions repeat an outdated product detail. The answer engines are reflecting both.",
      steps: ["Verify the source, date, and repeated wording.", "Correct the owned trust and product pages with visible evidence.", "Respond at the source where appropriate, then track whether the answer changes."],
    },
    content: {
      title: "The next page should close a decision gap, not chase a keyword.",
      summary: "The observed answers compare providers, but your site does not directly explain who the service fits, how it differs, or what proof supports the choice.",
      steps: ["Draft the buyer comparison question and direct answer.", "Add the evidence, limitations, and relevant independent sources.", "Connect the page to one attributable audit or booking action."],
    },
  };

  for (const button of agentDemo.buttons) button.addEventListener("click", () => {
    const answer = agentAnswers[button.dataset.agentQuestion];
    if (!answer || !agentDemo.title || !agentDemo.summary || !agentDemo.steps) return;
    for (const item of agentDemo.buttons) item.setAttribute("aria-selected", String(item === button));
    agentDemo.title.textContent = answer.title;
    agentDemo.summary.textContent = answer.summary;
    agentDemo.steps.replaceChildren(...answer.steps.map((step) => {
      const item = document.createElement("li");
      item.textContent = step;
      return item;
    }));
    agentDemo.title.closest("[role=tabpanel]")?.focus({ preventScroll: true });
  });

  const sample = document.querySelector("[data-aeo-sample]");
  const sampleViews = {
    visibility: {
      kicker: "Visibility view", title: "Where the brand appears today",
      metrics: [["Visibility", "34%", "Across tracked prompts"], ["Citations", "8", "Observed source links"], ["Answer position", "2.8", "Illustrative average"]],
      bars: [34, 42, 39, 51, 47, 58, 63, 68], change: "Direction: improving",
      finding: "Three buyer questions have strong competitor coverage but weak first party evidence.",
      explanation: "Build one comparison page, strengthen the service proof block, and verify the sources the answer engines already use.",
      rows: [["Buyer questions", "4 of 10 include the sample brand", "Monitor"], ["Competitor gap", "Two rivals lead on evidence depth", "Compare"], ["Source coverage", "Three priority sources do not mention the brand", "Act"]],
    },
    competitors: {
      kicker: "Competitor view", title: "Who owns the answer set",
      metrics: [["Brands tracked", "5", "Illustrative comparison"], ["Largest gap", "18 pts", "Share of answer set"], ["Leaders", "2", "Repeated across prompts"]],
      bars: [72, 61, 49, 44, 37, 33, 29, 24], change: "Sorted by answer presence",
      finding: "The leading competitor wins on independent comparisons, not page volume.",
      explanation: "Inspect the cited comparison sources and repeated proof themes before adding more generic service content.",
      rows: [["Competitor Alpha", "Strong independent comparison coverage", "Inspect"], ["Competitor Beta", "Clear proof blocks on service pages", "Learn"], ["Sample brand", "Strong owned claims, weak corroboration", "Strengthen"]],
    },
    sources: {
      kicker: "Source view", title: "Which evidence shapes the answers",
      metrics: [["Sources observed", "23", "Across the sample set"], ["Coverage gaps", "7", "Relevant pages absent"], ["Priority sources", "3", "Used by competitors"]],
      bars: [26, 33, 41, 38, 52, 59, 55, 71], change: "Authority mix by answer set",
      finding: "Three repeatedly cited sources cover the category but omit the sample brand.",
      explanation: "Confirm fit, improve the owned evidence they would need, and pursue legitimate inclusion without manufactured authority.",
      rows: [["Industry comparison", "Cited in six tracked answers", "Priority"], ["Review source", "Sentiment is accurate but dated", "Correct"], ["Owned service page", "Clear offer, thin evidence block", "Improve"]],
    },
    actions: {
      kicker: "Action view", title: "What the team should do next",
      metrics: [["Open actions", "12", "Ranked by impact and effort"], ["Do now", "3", "Evidence ready"], ["Blocked", "2", "Needs owner input"]],
      bars: [18, 31, 43, 58, 66, 54, 76, 82], change: "Expected evidence coverage",
      finding: "One comparison page and two proof repairs unlock the highest priority prompt cluster.",
      explanation: "Assign an owner, attach the supporting evidence, ship the smallest useful change, then rerun the frozen prompt set.",
      rows: [["Comparison page", "Decision gap with evidence available", "Do now"], ["Service proof block", "Claims need visible support", "Do now"], ["Independent source outreach", "Requires reviewed source fit", "Prepare"]],
    },
  };

  function renderSampleView(key) {
    if (!sample || !sampleViews[key]) return;
    const view = sampleViews[key];
    sample.querySelector("[data-sample-kicker]").textContent = view.kicker;
    sample.querySelector("[data-sample-title]").textContent = view.title;
    view.metrics.forEach(([label, value, note], index) => {
      sample.querySelector(`[data-sample-label="${index}"]`).textContent = label;
      sample.querySelector(`[data-sample-metric="${index}"]`).textContent = value;
      sample.querySelector(`[data-sample-note="${index}"]`).textContent = note;
    });
    sample.querySelectorAll("[data-sample-chart] i").forEach((bar, index) => {
      const value = view.bars[index];
      bar.style.setProperty("--sample-bar", `${value}%`);
      bar.querySelector("span").textContent = value;
    });
    sample.querySelector("[data-sample-change]").textContent = view.change;
    sample.querySelector("[data-sample-finding]").textContent = view.finding;
    sample.querySelector("[data-sample-explanation]").textContent = view.explanation;
    const rows = view.rows.map(([signal, detail, state]) => {
      const row = document.createElement("tr");
      const signalCell = document.createElement("td");
      signalCell.append(document.createElement("i"), document.createTextNode(signal));
      const detailCell = document.createElement("td");
      detailCell.textContent = detail;
      const stateCell = document.createElement("td");
      const badge = document.createElement("span");
      badge.textContent = state;
      stateCell.append(badge);
      row.append(signalCell, detailCell, stateCell);
      return row;
    });
    sample.querySelector("[data-sample-rows]").replaceChildren(...rows);
    sample.querySelector("[data-sample-status]").textContent = `${view.kicker} selected. Illustrative data is now displayed.`;
    for (const button of sample.querySelectorAll("[data-sample-view]")) button.setAttribute("aria-pressed", String(button.dataset.sampleView === key));
  }

  if (sample) {
    for (const button of sample.querySelectorAll("[data-sample-view]")) button.addEventListener("click", () => renderSampleView(button.dataset.sampleView));
    sample.querySelector("[data-sample-agent]")?.addEventListener("click", () => document.querySelector(".agent-demo-section")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }));
  }

  const form = document.getElementById("ai-visibility-form");
  if (!form) return;

  const guideForm = document.getElementById("ai-visibility-guide-form");
  const ui = {
    status: document.getElementById("ai-visibility-form-status"),
    first: form.querySelector('[data-step="1"]'),
    second: form.querySelector('[data-step="2"]'),
    next: form.querySelector("[data-next-step]"),
    back: form.querySelector("[data-previous-step]"),
    submit: form.querySelector('[type="submit"]'),
    submitLabel: form.querySelector("[data-submit-label]"),
    progressLabel: document.getElementById("audit-progress-label"),
    website: form.querySelector('[name="website"]'),
    result: document.getElementById("ai-visibility-result"),
    resultMessage: document.getElementById("ai-visibility-result-message"),
    connectionFallback: document.getElementById("ai-visibility-connection-fallback"),
    fallbackEmail: document.getElementById("ai-visibility-fallback-email"),
    resultPdf: document.getElementById("ai-visibility-result-pdf"),
    resultBooking: document.getElementById("ai-visibility-result-booking"),
    calendar: document.getElementById("ai-visibility-calendar"),
    calendarStatus: document.getElementById("ai-visibility-calendar-status"),
    bookingFallbacks: [...document.querySelectorAll("[data-booking-fallback]")],
    guideTriggers: [...document.querySelectorAll("[data-ai-visibility-pdf]")],
    guideDialog: document.getElementById("ai-visibility-guide-dialog"),
    guideStatus: document.getElementById("ai-visibility-guide-status"),
    guideSubmit: guideForm?.querySelector('[type="submit"]'),
    guideSubmitLabel: guideForm?.querySelector("[data-guide-submit-label]"),
    guideResult: document.getElementById("ai-visibility-guide-result"),
    guideResultMessage: document.getElementById("ai-visibility-guide-result-message"),
    guideDownload: document.getElementById("ai-visibility-guide-download"),
    guideBooking: document.getElementById("ai-visibility-guide-booking"),
    quickForm: document.getElementById("aeo-quick-audit"),
    quickWebsite: document.getElementById("quick-audit-website"),
    quickStatus: document.getElementById("quick-audit-status"),
    auditSection: document.getElementById("free-aeo-audit"),
  };

  let publicConfig = null;
  let leadRef = sessionStorage.getItem("aixcel.aiVisibility.leadRef") || "";
  let calLoaded = false;
  let directEmailMode = false;

  function setStatus(message, kind = "") {
    ui.status.textContent = message;
    ui.status.dataset.kind = kind;
  }

  function setGuideStatus(message, kind = "") {
    if (!ui.guideStatus) return;
    ui.guideStatus.textContent = message;
    ui.guideStatus.dataset.kind = kind;
  }

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
    } catch {
      return "";
    }
  }

  function showStep(step) {
    const second = step === 2;
    ui.first.hidden = second;
    ui.second.hidden = !second;
    form.dataset.currentStep = String(step);
    ui.progressLabel.textContent = second ? "Step 2 of 2 · your details" : "Step 1 of 2 · website";
    form.querySelector(second ? "#baseline-step-two" : "#baseline-step-one")?.focus({ preventScroll: true });
  }

  function currentStepValid() {
    for (const control of ui.first.querySelectorAll("input, select, textarea")) {
      if (!control.reportValidity()) return false;
    }
    return true;
  }

  function recordEvent(eventType) {
    if (!leadRef) return Promise.resolve();
    return fetch("/api/ai-visibility-lead-events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadRef, eventType, eventId: crypto.randomUUID() }),
      keepalive: true,
    }).catch(() => undefined);
  }

  function payloadFrom(targetForm) {
    const data = new FormData(targetForm);
    return {
      requestType: data.get("requestType"),
      name: data.get("name"),
      email: data.get("email"),
      company: data.get("company"),
      website: data.get("website"),
      role: data.get("role") || "",
      aiGoal: data.get("aiGoal") || "",
      timing: data.get("timing") || "",
      annualRevenue: data.get("annualRevenue"),
      consent: data.get("consent") === "yes",
      companyFax: data.get("companyFax"),
      source: sourceContext(),
      formToken: publicConfig?.formToken || "",
    };
  }

  function directEmailUrl(data, requestType = "free_audit") {
    const label = requestType === "guide_download" ? "AI Visibility guide request" : "Free AEO audit request";
    const body = [
      "Hello Ahmad,",
      "",
      `I would like the ${requestType === "guide_download" ? "AI Visibility guide" : "free AEO audit"}.`,
      `Website: ${data.get("website") || ""}`,
      `Name: ${data.get("name") || ""}`,
      `Work email: ${data.get("email") || ""}`,
      `Company: ${data.get("company") || ""}`,
      `Annual revenue range: ${data.get("annualRevenue") || ""}`,
      `Role: ${data.get("role") || ""}`,
      `Priority offer or buyer question: ${data.get("aiGoal") || ""}`,
      `Timing: ${data.get("timing") || ""}`,
      "",
      "I consent to AiXCEL using these details to fulfil and respond to this request.",
    ].join("\n");
    return `mailto:ahmadbukhari4245@gmail.com?subject=${encodeURIComponent(label)}&body=${encodeURIComponent(body)}`;
  }

  function enableDirectEmailMode() {
    directEmailMode = true;
    form.dataset.delivery = "email";
    ui.connectionFallback.hidden = false;
    ui.submitLabel.textContent = "Prepare my audit email";
    if (ui.website.value) ui.fallbackEmail.href = directEmailUrl(new FormData(form));
  }

  function installCal() {
    if (calLoaded || !publicConfig?.bookingCalLink || !ui.calendar) return;
    calLoaded = true;
    (function (windowObject, scriptUrl) {
      const documentObject = windowObject.document;
      windowObject.Cal = windowObject.Cal || function () {
        const cal = windowObject.Cal;
        const args = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          const script = documentObject.createElement("script");
          script.src = scriptUrl;
          documentObject.head.appendChild(script);
          cal.loaded = true;
        }
        cal.q.push(args);
      };
    })(window, "https://app.cal.com/embed/embed.js");
    window.Cal("init", { origin: "https://cal.com" });
    window.Cal("inline", {
      elementOrSelector: "#ai-visibility-calendar",
      calLink: publicConfig.bookingCalLink,
      config: { layout: "month_view", theme: document.documentElement.dataset.theme === "dark" ? "dark" : "light", utm_source: "aixcel_website", utm_medium: "organic", utm_campaign: "free_aeo_audit" },
    });
    window.Cal("ui", { hideEventTypeDetails: false, styles: { branding: { brandColor: "#502c52" } } });
    window.Cal("on", { action: "bookerViewed", callback: () => recordEvent("booking_opened") });
    window.Cal("on", { action: "bookingSuccessfulV2", callback: () => recordEvent("booking_client_success") });
    window.Cal("on", { action: "linkReady", callback: () => { ui.calendarStatus.textContent = "Secure scheduling powered by Cal.com."; } });
    window.Cal("on", { action: "linkFailed", callback: () => { ui.calendarStatus.textContent = "The embedded calendar could not load. Use the direct booking link below."; } });
  }

  async function loadConfig() {
    try {
      publicConfig = await api("/api/ai-visibility-config");
      for (const link of ui.bookingFallbacks) link.href = publicConfig.bookingUrl;
      if (ui.guideBooking) ui.guideBooking.href = publicConfig.bookingUrl;
      if (!publicConfig.captureReady || !publicConfig.formToken) enableDirectEmailMode();
      installCal();
    } catch {
      enableDirectEmailMode();
      if (ui.calendarStatus) ui.calendarStatus.textContent = "The embedded calendar is unavailable. Use the direct booking link below.";
    }
  }

  ui.quickForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const normalized = normalizeWebsite(ui.quickWebsite.value);
    if (!normalized) {
      ui.quickWebsite.setCustomValidity("Enter a valid website, such as yourcompany.com.");
      ui.quickWebsite.reportValidity();
      ui.quickStatus.textContent = "Enter a valid public website to continue.";
      return;
    }
    ui.quickWebsite.setCustomValidity("");
    ui.website.value = normalized;
    ui.quickStatus.textContent = "Website added. Complete your details below.";
    showStep(2);
    if (directEmailMode) ui.fallbackEmail.href = directEmailUrl(new FormData(form));
    ui.auditSection?.scrollIntoView({ behavior: "auto", block: "start" });
  });

  ui.quickWebsite?.addEventListener("input", () => ui.quickWebsite.setCustomValidity(""));
  ui.next.addEventListener("click", () => { if (currentStepValid()) showStep(2); });
  ui.back.addEventListener("click", () => showStep(1));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    if (directEmailMode) {
      const mailto = directEmailUrl(data);
      ui.fallbackEmail.href = mailto;
      setStatus("Your email app is opening. Review and send the prepared message to complete your request.", "notice");
      window.location.href = mailto;
      return;
    }
    ui.submit.disabled = true;
    setStatus("Saving your audit request...", "pending");
    try {
      const result = await api("/api/ai-visibility-leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payloadFrom(form)) });
      leadRef = result.leadRef;
      sessionStorage.setItem("aixcel.aiVisibility.leadRef", leadRef);
      ui.resultPdf.href = result.pdfUrl;
      ui.resultBooking.href = result.bookingUrl;
      ui.resultMessage.textContent = result.delivery?.visitorAcknowledged
        ? "A confirmation is in your inbox. Ahmad can now review the website, priority, revenue range, and source path in the private Lead Desk."
        : "Your request is safely stored in the private Lead Desk. Email confirmation is delayed, but the request is not lost.";
      ui.result.hidden = false;
      form.hidden = true;
      ui.connectionFallback.hidden = true;
      setStatus("");
      ui.result.focus();
    } catch (error) {
      setStatus(error.message, "error");
      ui.submit.disabled = false;
    }
  });

  for (const trigger of ui.guideTriggers) trigger.addEventListener("click", (event) => {
    event.preventDefault();
    if (!ui.guideDialog) return;
    ui.guideDialog.showModal();
    recordEvent("guide_gate_opened");
    guideForm?.querySelector("input:not([type=hidden])")?.focus();
  });

  ui.guideDialog?.addEventListener("click", (event) => {
    if (event.target === ui.guideDialog) ui.guideDialog.close();
  });

  guideForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!guideForm.reportValidity()) return;
    const data = new FormData(guideForm);
    if (directEmailMode) {
      setGuideStatus("Your email app is opening. Send the prepared request and we will reply with the guide.", "notice");
      window.location.href = directEmailUrl(data, "guide_download");
      return;
    }
    ui.guideSubmit.disabled = true;
    setGuideStatus("Saving your request and preparing the guide...", "pending");
    try {
      const result = await api("/api/ai-visibility-leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payloadFrom(guideForm)) });
      leadRef = result.leadRef;
      sessionStorage.setItem("aixcel.aiVisibility.leadRef", leadRef);
      ui.guideDownload.href = result.pdfUrl;
      ui.guideBooking.href = result.bookingUrl;
      ui.guideResultMessage.textContent = result.delivery?.visitorAcknowledged
        ? "We sent the guide to your inbox. You can also download it now."
        : "Your request is stored. Email delivery is delayed, so use the download button below now.";
      guideForm.hidden = true;
      ui.guideResult.hidden = false;
      setGuideStatus("");
      ui.guideResult.focus();
    } catch (error) {
      setGuideStatus(error.message, "error");
      ui.guideSubmit.disabled = false;
    }
  });

  for (const link of ui.bookingFallbacks) link.addEventListener("click", () => recordEvent("booking_opened"));
  ui.resultPdf.addEventListener("click", () => recordEvent("pdf_download"));
  ui.resultBooking.addEventListener("click", () => recordEvent("booking_opened"));
  ui.guideDownload?.addEventListener("click", () => recordEvent("pdf_download"));
  ui.guideBooking?.addEventListener("click", () => recordEvent("booking_opened"));
  loadConfig();
})();
