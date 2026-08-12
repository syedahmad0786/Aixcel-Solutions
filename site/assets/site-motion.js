(() => {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const targets = document.querySelectorAll([
    ".section-heading",
    ".services-intro",
    ".content-section > .section-intro",
    ".service-row",
    ".case-card",
    ".process-grid article",
    ".product-chapter",
    ".service-showcase-card",
    ".service-capability",
    ".managed-layer-grid article",
    ".delivery-rhythm-grid article",
  ].join(","));

  targets.forEach((element, index) => {
    element.dataset.reveal = "";
    element.style.setProperty("--reveal-delay", `${Math.min(index % 3, 2) * 70}ms`);
  });

  if (reduced || !("IntersectionObserver" in window)) {
    targets.forEach((element) => { element.dataset.reveal = "visible"; });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const skippedAboveViewport = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      if (!entry.isIntersecting && !skippedAboveViewport) continue;
      entry.target.dataset.reveal = "visible";
      observer.unobserve(entry.target);
    }
  }, { rootMargin: "0px 0px -8%", threshold: 0.12 });

  targets.forEach((element) => observer.observe(element));

  let revealTicking = false;
  const revealPassedTargets = () => {
    revealTicking = false;
    for (const element of targets) {
      if (element.dataset.reveal === "visible") continue;
      if (element.getBoundingClientRect().top > window.innerHeight * 0.92) continue;
      element.dataset.reveal = "visible";
      observer.unobserve(element);
    }
  };
  const schedulePassedReveal = () => {
    if (revealTicking) return;
    revealTicking = true;
    window.requestAnimationFrame(revealPassedTargets);
  };

  window.addEventListener("scroll", schedulePassedReveal, { passive: true });
  window.addEventListener("hashchange", schedulePassedReveal);
  window.requestAnimationFrame(revealPassedTargets);
})();
