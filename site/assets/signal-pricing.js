(() => {
  "use strict";
  const header = document.querySelector("[data-signal-header]");
  const menu = document.querySelector("[data-signal-menu]");
  const nav = document.querySelector("[data-signal-nav]");
  const navLinks = nav ? [...nav.querySelectorAll("a")] : [];
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

  const pricingButtons = [...document.querySelectorAll("[data-pricing-view]")];
  const pricingPanels = [...document.querySelectorAll("[data-pricing-panel]")];
  pricingButtons.forEach((button) => button.addEventListener("click", () => {
    pricingButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    pricingPanels.forEach((panel) => { panel.hidden = panel.dataset.pricingPanel !== button.dataset.pricingView; });
  }));

  const details = [...document.querySelectorAll(".signal-faq-list details")];
  details.forEach((item) => item.addEventListener("toggle", () => {
    if (!item.open) return;
    details.forEach((other) => { if (other !== item) other.open = false; });
  }));

  fetch("/api/ai-visibility-config").then((response) => response.ok ? response.json() : null).then((config) => {
    if (!config?.bookingUrl) return;
    document.querySelectorAll("[data-booking-link]").forEach((link) => { link.href = config.bookingUrl; });
  }).catch(() => undefined);
})();
