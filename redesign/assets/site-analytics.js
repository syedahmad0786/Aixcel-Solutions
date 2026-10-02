/* GA4 basic consent mode. No Google request is made before analytics opt-in. */
(function () {
  'use strict';
  if (window.siteAnalytics) return;

  var measurementId = 'G-W66WJJKGWQ';
  var consentKey = 'site-analytics-consent-v1';
  var disableKey = 'ga-disable-' + measurementId;
  // Never override a previously installed user/extension opt-out.
  if (window[disableKey] === true) return;
  var allowedHosts = ['aixcelsolutions.com', 'manhaj.ahmadbukhari.com'];
  var production = allowedHosts.indexOf(window.location.hostname) !== -1;
  // Keep authenticated content and embedded demo documents unmeasured.
  if (/^\/systems-desk(?:\.html)?(?:\/|$)/.test(window.location.pathname) ||
      /^\/kiosks\/_app(?:\/|$)/.test(window.location.pathname)) return;
  var consent = null;
  var started = false;
  var panel;
  var settings;
  var previousFocus;

  function readChoice(serialized) {
    try {
      var saved = JSON.parse(serialized);
      if (saved && (saved.value === 'granted' || saved.value === 'denied') &&
          typeof saved.updatedAt === 'number' && saved.updatedAt <= Date.now() &&
          Date.now() - saved.updatedAt < 180 * 24 * 60 * 60 * 1000) return saved.value;
    } catch (_) { /* Invalid or absent preference. */ }
    return null;
  }

  // Preference storage is first-party and host-specific. A blocked storage API
  // must not silently opt a visitor in or prevent the site from working.
  try { consent = readChoice(window.localStorage.getItem(consentKey)); }
  catch (_) { /* No stored choice. */ }

  window[disableKey] = consent !== 'granted';

  function gtag() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }

  function cleanUrl(value) {
    if (!value) return '';
    try {
      var url = new URL(value, window.location.origin);
      return /^https?:$/.test(url.protocol) ? url.origin + url.pathname : '';
    } catch (_) { return ''; }
  }

  function start() {
    if (started || consent !== 'granted' || !production) return;
    started = true;
    window[disableKey] = false;
    window.gtag = window.gtag || gtag;
    gtag('consent', 'default', {
      analytics_storage: 'denied', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied'
    });
    gtag('consent', 'update', {
      analytics_storage: 'granted', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied'
    });
    gtag('js', new Date());
    gtag('config', measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      // Isolate these cookies from the portfolio's existing tag/cookies.
      cookie_prefix: 'site',
      cookie_domain: 'none',
      cookie_expires: 180 * 24 * 60 * 60,
      cookie_flags: 'SameSite=Lax;Secure',
      page_location: cleanUrl(window.location.href),
      page_referrer: cleanUrl(document.referrer),
      // Enhanced measurement owns subsequent history pageviews.
      send_page_view: true
    });
    var script = document.createElement('script');
    script.id = 'site-ga4-tag';
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    document.head.appendChild(script);
    // Standalone demo wrappers bypass Next's layout. Record only a fixed kiosk
    // label for the current public page, never its embedded application state.
    var kiosks = {
      '/kiosks': 'hub', '/kiosks/index.html': 'hub',
      '/kiosks/command-center': 'command-center', '/kiosks/command-center/index.html': 'command-center',
      '/kiosks/errorlens': 'errorlens', '/kiosks/errorlens/index.html': 'errorlens',
      '/kiosks/onboarding': 'onboarding', '/kiosks/onboarding/index.html': 'onboarding'
    };
    var kiosk = kiosks[window.location.pathname.replace(/\/$/, '')];
    if (kiosk) gtag('event', 'kiosk_opened', { send_to: measurementId, kiosk: kiosk });
  }

  function clearAnalyticsCookies() {
    document.cookie.split(';').forEach(function (entry) {
      var name = entry.split('=')[0].trim();
      if (/^site_ga(?:_|$)/.test(name)) {
        document.cookie = name + '=; Max-Age=0; Path=/; SameSite=Lax; Secure';
      }
    });
  }

  function closePanel() {
    if (!panel) return;
    panel.hidden = true;
    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
  }

  function choose(value, persist) {
    consent = value;
    window[disableKey] = value !== 'granted';
    if (persist !== false) {
      try {
        window.localStorage.setItem(consentKey, JSON.stringify({ value: value, updatedAt: Date.now() }));
      } catch (_) { /* Keep the choice for this page when storage is blocked. */ }
    }
    if (value === 'granted') {
      if (started) {
        gtag('consent', 'update', {
          analytics_storage: 'granted', ad_storage: 'denied',
          ad_user_data: 'denied', ad_personalization: 'denied'
        });
      } else start();
    } else {
      // The hard opt-out flag blocks GA requests before updating consent.
      if (started) gtag('consent', 'update', {
        analytics_storage: 'denied', ad_storage: 'denied',
        ad_user_data: 'denied', ad_personalization: 'denied'
      });
      clearAnalyticsCookies();
    }
    closePanel();
  }

  function openPanel() {
    if (!panel) return;
    previousFocus = document.activeElement;
    panel.hidden = false;
    panel.querySelector('button').focus();
  }

  window.siteAnalytics = {
    openPreferences: openPanel,
    // Deliberately accept only event names. Never forward form values, labels,
    // mailto URLs, user identifiers, or arbitrary event payloads to Google.
    track: function (eventName) {
      if (!started || consent !== 'granted' || !production) return;
      var events = {
        lead_form_submit: ['lead_form_submit', { method: 'audit_form' }],
        audit_view: ['audit_view', {}],
        kiosk_opened: ['kiosk_opened', {}],
        cta_clicked: ['cta_clicked', {}]
      };
      if (!Object.prototype.hasOwnProperty.call(events, eventName)) return;
      var event = events[eventName];
      gtag('event', event[0], Object.assign({ send_to: measurementId }, event[1]));
    }
  };

  function mount() {
    var style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = '/assets/site-analytics.css';
    document.head.appendChild(style);
    panel = document.createElement('section');
    panel.id = 'site-analytics-panel';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', 'site-analytics-title');
    panel.hidden = true;
    panel.innerHTML = '<h2 id="site-analytics-title">Optional analytics</h2>' +
      '<p>With your permission, Google Analytics helps us understand visits and improve this site. Advertising features are off. You can change your choice at any time. <a href="/privacy">Privacy notice</a></p>' +
      '<div class="site-analytics-actions"><button type="button" data-choice="denied">Reject analytics</button>' +
      '<button type="button" data-choice="granted">Accept analytics</button></div>';
    panel.addEventListener('click', function (event) {
      var value = event.target.getAttribute('data-choice');
      if (value === 'granted' || value === 'denied') choose(value);
    });
    panel.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closePanel();
    });
    document.body.appendChild(panel);
    settings = document.createElement('button');
    settings.id = 'site-analytics-settings';
    settings.type = 'button';
    settings.textContent = 'Analytics choices';
    settings.setAttribute('aria-controls', panel.id);
    settings.addEventListener('click', openPanel);
    document.body.appendChild(settings);
    // Do not steal initial keyboard focus to show a non-modal banner.
    if (consent === null) panel.hidden = false;
    start();
  }

  window.addEventListener('storage', function (event) {
    if (event.key !== consentKey && event.key !== null) return;
    choose(event.key !== null && readChoice(event.newValue) === 'granted' ? 'granted' : 'denied', false);
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
}());
