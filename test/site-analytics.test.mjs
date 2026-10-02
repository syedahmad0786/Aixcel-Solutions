/**
 * Deterministic, network-free tests of the consent controller and queued gtag
 * commands. This harness does not load Google code or prove browser networking,
 * actual cookie persistence, enhanced measurement, or deployed CSP behavior.
 *
 * Run: npm run test:analytics
 * Override: ANALYTICS_SCRIPT=/absolute/path/site-analytics.js node --test ...
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import test from 'node:test';

const scriptPath = process.env.ANALYTICS_SCRIPT || fileURLToPath(
  new URL('../redesign/assets/site-analytics.js', import.meta.url),
);
const source = readFileSync(scriptPath, 'utf8');
const NOW = Date.parse('2026-10-02T00:00:00Z');
const MAX_AGE = 180 * 24 * 60 * 60 * 1000;
const KEY = 'site-analytics-consent-v1';
const MEASUREMENT_ID = 'G-W66WJJKGWQ';
const DISABLE_KEY = `ga-disable-${MEASUREMENT_ID}`;
const fresh = (value = 'granted') => ({ value, updatedAt: NOW - 1000 });
const plain = (value) => JSON.parse(JSON.stringify(value));

class FixedDate extends Date {
  constructor(...args) { super(...(args.length ? args : [NOW])); }
  static now() { return NOW; }
}

function setup({
  stored = null,
  externalOptOut = false,
  storedRaw,
  hostname = 'aixcelsolutions.com',
  pathname = '/landing',
  query = '?private=synthetic-test#fragment',
  referrer = 'https://referrer.example/path?private=synthetic-test#fragment',
  storageBlocked = false,
  readyState = 'complete',
} = {}) {
  const listeners = {};
  const documentListeners = {};
  const appended = [];
  const nodes = {};
  const values = new Map();
  const cookieWrites = [];
  const cookies = new Map([
    ['site_ga', 'analytics-client'],
    ['site_ga_W66WJJKGWQ', 'analytics-session'],
    ['_ga', 'portfolio-cookie'],
    ['site_gateway', 'unrelated-cookie'],
  ]);
  if (storedRaw !== undefined) values.set(KEY, storedRaw);
  else if (stored !== null) values.set(KEY, JSON.stringify(stored));

  function element(tag) {
    return {
      tag,
      listeners: {},
      attributes: {},
      hidden: false,
      focusCount: 0,
      setAttribute(name, value) { this.attributes[name] = value; },
      addEventListener(name, handler) { this.listeners[name] = handler; },
      querySelector() { return this.firstButton ||= element('button'); },
      focus() { this.focusCount++; },
    };
  }
  const document = {
    readyState,
    referrer,
    activeElement: element('a'),
    createElement: element,
    head: { appendChild(node) { appended.push(node); } },
    body: { appendChild(node) { nodes[node.id] = node; } },
    addEventListener(name, handler) { documentListeners[name] = handler; },
    get cookie() { return [...cookies].map(([k, v]) => `${k}=${v}`).join('; '); },
    set cookie(value) {
      cookieWrites.push(value);
      const [pair] = value.split(';');
      const separator = pair.indexOf('=');
      const name = pair.slice(0, separator);
      if (/Max-Age=0/i.test(value)) cookies.delete(name);
      else cookies.set(name, pair.slice(separator + 1));
    },
  };
  const window = {
    location: new URL(`https://${hostname}${pathname}${query}`),
    localStorage: {
      getItem(key) {
        if (storageBlocked) throw new Error('Storage blocked');
        return values.get(key) ?? null;
      },
      setItem(key, value) {
        if (storageBlocked) throw new Error('Storage blocked');
        values.set(key, value);
      },
    },
    addEventListener(name, handler) { listeners[name] = handler; },
  };
  if (externalOptOut) window[DISABLE_KEY] = true;
  const context = vm.createContext({ window, document, URL, Date: FixedDate });
  const run = () => vm.runInContext(source, context, { filename: scriptPath });
  run();
  return {
    window, document, values, cookies, cookieWrites, nodes, appended, run,
    scripts: () => appended.filter((node) => node.tag === 'script'),
    calls: () => (window.dataLayer || []).map((args) => Array.from(args)),
    choose(value) {
      nodes['site-analytics-panel'].listeners.click({
        target: { getAttribute: () => value },
      });
    },
    storage(value, key = KEY) {
      listeners.storage({ key, newValue: value === null ? null : JSON.stringify(value) });
    },
    storageRaw(newValue, key = KEY) { listeners.storage({ key, newValue }); },
    mount() { document.readyState = 'complete'; documentListeners.DOMContentLoaded(); },
  };
}

test('no choice loads no Google script and queues no events', () => {
  const state = setup();
  assert.equal(state.scripts().length, 0);
  assert.equal(state.window[DISABLE_KEY], true);
  assert.equal(state.nodes['site-analytics-panel'].hidden, false);
  state.window.siteAnalytics.track('lead_form_submit');
  assert.deepEqual(state.calls(), []);
});

test('rejecting before acceptance does not load Google or queue gtag commands', () => {
  const state = setup();
  state.choose('denied');
  assert.equal(state.scripts().length, 0);
  assert.deepEqual(state.calls(), []);
  assert.deepEqual(JSON.parse(state.values.get(KEY)), { value: 'denied', updatedAt: NOW });
  assert.equal(state.nodes['site-analytics-panel'].hidden, true);
});

test('fresh granted choice starts while a fresh denied choice stays stopped', () => {
  const accepted = setup({ stored: fresh() });
  assert.equal(accepted.scripts().length, 1);
  assert.equal(accepted.window[DISABLE_KEY], false);
  assert.equal(accepted.nodes['site-analytics-panel'].hidden, true);
  const denied = setup({ stored: fresh('denied') });
  assert.equal(denied.scripts().length, 0);
  assert.equal(denied.window[DISABLE_KEY], true);
  assert.equal(denied.nodes['site-analytics-panel'].hidden, true);
});

test('acceptance loads exactly one tag with denied advertising consent', () => {
  const state = setup();
  state.choose('granted');
  assert.equal(state.scripts().length, 1);
  assert.equal(state.scripts()[0].src, `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`);
  assert.equal(state.scripts()[0].async, true);
  const calls = state.calls();
  assert.equal(calls[0][0], 'consent');
  assert.equal(calls[0][1], 'default');
  assert.deepEqual(plain(calls[0][2]), {
    analytics_storage: 'denied', ad_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied',
  });
  assert.equal(calls[1][1], 'update');
  assert.deepEqual(plain(calls[1][2]), {
    analytics_storage: 'granted', ad_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied',
  });
  assert.deepEqual(JSON.parse(state.values.get(KEY)), { value: 'granted', updatedAt: NOW });
});

test('config disables signals and uses isolated host-only 180-day cookies', () => {
  const state = setup({ stored: fresh() });
  const config = state.calls().find(([command]) => command === 'config');
  assert.equal(config[1], MEASUREMENT_ID);
  assert.equal(config[2].allow_google_signals, false);
  assert.equal(config[2].allow_ad_personalization_signals, false);
  assert.equal(config[2].cookie_prefix, 'site');
  assert.equal(config[2].cookie_domain, 'none');
  assert.equal(config[2].cookie_expires, MAX_AGE / 1000);
  assert.equal(config[2].cookie_flags, 'SameSite=Lax;Secure');
});

test('initial page and referrer config remove query strings and fragments', () => {
  const state = setup({ stored: fresh() });
  const config = state.calls().find(([command]) => command === 'config')[2];
  assert.equal(config.page_location, 'https://aixcelsolutions.com/landing');
  assert.equal(config.page_referrer, 'https://referrer.example/path');
});

for (const referrer of ['', 'mailto:synthetic@example.test', 'javascript:void(0)']) {
  test(`empty or non-HTTP referrer remains empty: ${JSON.stringify(referrer)}`, () => {
    const state = setup({ stored: fresh(), referrer });
    const config = state.calls().find(([command]) => command === 'config')[2];
    assert.equal(config.page_referrer, '');
  });
}

test('only one initial config pageview exists after repeat acceptance and initialization', () => {
  const state = setup();
  state.choose('granted');
  state.choose('granted');
  state.run();
  const configs = state.calls().filter(([command]) => command === 'config');
  assert.equal(state.scripts().length, 1);
  assert.equal(configs.length, 1);
  assert.equal(configs[0][2].send_page_view, true);
  assert.equal(state.calls().filter(([command, name]) => command === 'event' && name === 'page_view').length, 0);
});

test('known custom events forward only fixed names and fixed payloads', () => {
  const state = setup({ stored: fresh() });
  const expected = {
    lead_form_submit: ['lead_form_submit', { send_to: MEASUREMENT_ID, method: 'audit_form' }],
    audit_view: ['audit_view', { send_to: MEASUREMENT_ID }],
    kiosk_opened: ['kiosk_opened', { send_to: MEASUREMENT_ID }],
    cta_clicked: ['cta_clicked', { send_to: MEASUREMENT_ID }],
  };
  for (const [name, payload] of Object.entries(expected)) {
    state.window.siteAnalytics.track(name, { email: 'synthetic@example.test', formAnswer: 'must-not-forward' });
    assert.deepEqual(plain(state.calls().at(-1)), ['event', ...payload]);
  }
});

test('unknown and prototype event names are rejected', () => {
  const state = setup({ stored: fresh() });
  const count = state.calls().length;
  for (const name of ['unapproved_event', '__proto__', 'constructor', 'toString', '', null, undefined]) {
    state.window.siteAnalytics.track(name);
  }
  assert.equal(state.calls().length, count);
});

test('withdrawal sets hard opt-out, stops custom events, and clears only owned cookies', () => {
  const state = setup({ stored: fresh() });
  state.choose('denied');
  assert.equal(state.window[DISABLE_KEY], true);
  const last = state.calls().at(-1);
  assert.deepEqual(plain(last), ['consent', 'update', {
    analytics_storage: 'denied', ad_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied',
  }]);
  const count = state.calls().length;
  state.window.siteAnalytics.track('lead_form_submit');
  assert.equal(state.calls().length, count);
  assert.equal(state.cookies.has('site_ga'), false);
  assert.equal(state.cookies.has('site_ga_W66WJJKGWQ'), false);
  assert.equal(state.cookies.get('_ga'), 'portfolio-cookie');
  assert.equal(state.cookies.get('site_gateway'), 'unrelated-cookie');
  assert.ok(state.cookieWrites.every((value) => /Max-Age=0; Path=\/; SameSite=Lax; Secure/.test(value)));
});

test('reacceptance reuses the tag rather than creating another initial pageview', () => {
  const state = setup({ stored: fresh() });
  state.choose('denied');
  state.choose('granted');
  assert.equal(state.window[DISABLE_KEY], false);
  assert.equal(state.scripts().length, 1);
  assert.equal(state.calls().filter(([command]) => command === 'config').length, 1);
});

for (const hostname of ['aixcelsolutions.com', 'manhaj.ahmadbukhari.com']) {
  test(`approved production hostname can start: ${hostname}`, () => {
    const state = setup({ hostname, stored: fresh() });
    assert.equal(state.scripts().length, 1);
  });
}

for (const hostname of ['preview.vercel.app', 'localhost', 'ahmadbukhari.com', 'evil-aixcelsolutions.com']) {
  test(`unapproved hostname never sends analytics: ${hostname}`, () => {
    const state = setup({ hostname });
    state.choose('granted');
    state.window.siteAnalytics.track('audit_view');
    assert.equal(state.scripts().length, 0);
    assert.deepEqual(state.calls(), []);
  });
}

for (const pathname of ['/systems-desk', '/systems-desk.html', '/systems-desk/', '/kiosks/_app/command-center.html']) {
  test(`excluded authenticated or embedded path cannot initialize analytics: ${pathname}`, () => {
    const state = setup({ pathname, stored: fresh() });
    assert.equal(state.scripts().length, 0);
    assert.deepEqual(state.calls(), []);
    assert.equal(state.window.siteAnalytics, undefined);
    assert.equal(state.nodes['site-analytics-panel'], undefined);
  });
}

const invalidChoices = {
  expired: { value: 'granted', updatedAt: NOW - MAX_AGE - 1 },
  'at expiration boundary': { value: 'granted', updatedAt: NOW - MAX_AGE },
  'missing timestamp': { value: 'granted' },
  'string timestamp': { value: 'granted', updatedAt: String(NOW) },
  'future timestamp': { value: 'granted', updatedAt: NOW + 86400000 },
  'invalid value': { value: 'yes', updatedAt: NOW },
};

for (const [label, stored] of Object.entries(invalidChoices)) {
  test(`invalid initial consent cannot authorize loading: ${label}`, () => {
    const state = setup({ stored });
    assert.equal(state.scripts().length, 0);
    assert.equal(state.window[DISABLE_KEY], true);
  });
  test(`invalid cross-tab consent cannot authorize loading: ${label}`, () => {
    const state = setup();
    state.storage(stored);
    assert.equal(state.scripts().length, 0);
    assert.equal(state.window[DISABLE_KEY], true);
    state.window.siteAnalytics.track('audit_view');
    assert.deepEqual(state.calls(), []);
  });
}

test('valid cross-tab acceptance starts and withdrawal disables without echoing storage', () => {
  const state = setup();
  state.storage(fresh());
  assert.equal(state.scripts().length, 1);
  assert.equal(state.window[DISABLE_KEY], false);
  assert.equal(state.values.has(KEY), false);
  state.storage(fresh('denied'));
  assert.equal(state.window[DISABLE_KEY], true);
  assert.equal(state.values.has(KEY), false);
});

test('expired cross-tab record revokes an already active tag', () => {
  const state = setup({ stored: fresh() });
  state.storage(invalidChoices.expired);
  assert.equal(state.window[DISABLE_KEY], true);
  assert.equal(state.calls().at(-1)[2].analytics_storage, 'denied');
});

test('unrelated storage records do not change analytics consent', () => {
  const state = setup();
  state.storage(fresh(), 'unrelated-setting');
  assert.equal(state.scripts().length, 0);
  assert.deepEqual(state.calls(), []);
});

test('malformed or removed consent is fail-closed', () => {
  const initial = setup({ storedRaw: '{broken json' });
  assert.equal(initial.scripts().length, 0);
  const state = setup({ stored: fresh() });
  state.storageRaw('{broken json');
  assert.equal(state.window[DISABLE_KEY], true);
  state.storage(fresh());
  state.storage(null);
  assert.equal(state.window[DISABLE_KEY], true);
});

test('blocked storage never silently grants; explicit acceptance works for this page', () => {
  const state = setup({ storageBlocked: true });
  assert.equal(state.scripts().length, 0);
  assert.equal(state.window[DISABLE_KEY], true);
  state.choose('granted');
  assert.equal(state.scripts().length, 1);
  assert.equal(state.values.has(KEY), false);
  state.choose('denied');
  assert.equal(state.window[DISABLE_KEY], true);
});

test('deferred mounting waits for DOMContentLoaded without losing saved consent', () => {
  const state = setup({ readyState: 'loading', stored: fresh() });
  assert.equal(state.scripts().length, 0);
  assert.equal(state.nodes['site-analytics-panel'], undefined);
  state.mount();
  assert.equal(state.scripts().length, 1);
});


test('pre-existing user opt-out is never overridden by a saved analytics grant', () => {
  const state = setup({ stored: fresh(), externalOptOut: true });
  assert.equal(state.scripts().length, 0);
  assert.equal(state.window.siteAnalytics, undefined);
  assert.equal(state.window[DISABLE_KEY], true);
});

test('a standalone kiosk sends a fixed opened event only after acceptance', () => {
  const state = setup({ hostname: 'manhaj.ahmadbukhari.com', pathname: '/kiosks/errorlens' });
  assert.equal(state.calls().length, 0);
  state.choose('granted');
  const events = state.calls().filter(call => call[0] === 'event');
  assert.deepEqual(plain(events), [['event', 'kiosk_opened', { send_to: MEASUREMENT_ID, kiosk: 'errorlens' }]]);
  state.choose('granted');
  assert.equal(state.calls().filter(call => call[0] === 'event').length, 1);
});


test('clearing all local storage in another tab revokes without echoing a write', () => {
  const state = setup({ stored: fresh() });
  const originalPreference = state.values.get(KEY);
  state.storage(null, null);
  assert.equal(state.window[DISABLE_KEY], true);
  assert.equal(state.calls().at(-1)[2].analytics_storage, 'denied');
  assert.equal(state.values.get(KEY), originalPreference);
  const before = state.calls().length;
  state.window.siteAnalytics.track('lead_form_submit');
  assert.equal(state.calls().length, before);
  assert.equal(state.cookies.has('site_ga'), false);
  assert.equal(state.cookies.has('_ga'), true);
});
