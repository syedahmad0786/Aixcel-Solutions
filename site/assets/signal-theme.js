(() => {
  "use strict";

  const key = "aixcel.signal.theme";
  const root = document.documentElement;
  const media = matchMedia("(prefers-color-scheme: dark)");

  function storedTheme() {
    try {
      const value = localStorage.getItem(key);
      return value === "light" || value === "dark" ? value : null;
    } catch {
      return null;
    }
  }

  function updateControls(theme) {
    document.querySelectorAll("[data-signal-theme-toggle]").forEach((button) => {
      const next = theme === "dark" ? "light" : "dark";
      button.setAttribute("aria-label", `Switch to ${next} theme`);
      button.setAttribute("title", `Switch to ${next} theme`);
      button.setAttribute("aria-pressed", String(theme === "dark"));
    });
    const color = document.querySelector('meta[name="theme-color"]');
    if (color) color.content = theme === "dark" ? "#0b1211" : "#eef1ef";
  }

  function apply(theme, persist = false) {
    root.dataset.signalTheme = theme;
    root.style.colorScheme = theme;
    if (persist) {
      try { localStorage.setItem(key, theme); } catch { /* Storage can be unavailable. */ }
    }
    updateControls(theme);
    dispatchEvent(new CustomEvent("signal-themechange", { detail: { theme } }));
  }

  apply(storedTheme() || (media.matches ? "dark" : "light"));

  addEventListener("DOMContentLoaded", () => {
    updateControls(root.dataset.signalTheme);
    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-signal-theme-toggle]");
      if (!button) return;
      apply(root.dataset.signalTheme === "dark" ? "light" : "dark", true);
    });
  });

  media.addEventListener("change", (event) => {
    if (!storedTheme()) apply(event.matches ? "dark" : "light");
  });
})();
