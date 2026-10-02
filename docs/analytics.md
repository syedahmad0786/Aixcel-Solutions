# GA4 implementation and release checks

## Ownership

- Existing shared GA4 measurement ID: `G-W66WJJKGWQ`.
- Public AiXCEL and MANHAJ pages use one consent-gated direct Google tag.
- AhmadBukhari.com is managed separately; its existing tag is unchanged.
- Google Signals, advertising personalization, and all advertising consent states are disabled in this tag.
- No manual route `page_view` is sent. The stream's enhanced page/history measurement owns subsequent pageviews.
- Google tags load only on the two production hostnames, after analytics opt-in. Preview and local hosts show the choices UI but never load the Google tag.

## Consent and data boundaries

The first-party choice is host-specific local storage, expiring after 180 days. Accept and reject have equally prominent buttons. Analytics choices remains available on the page; withdrawal sets the GA disable flag, updates consent, and deletes this tag's host-only `site_ga*` cookies. Its cookie prefix/domain isolates the implementation from the portfolio's existing cookies. Google tag loading does not start before acceptance, even when local storage is unavailable. Existing fonts and other services are outside this GA control.

The initial page URL and referrer sent by our config omit query and fragment. Custom events allow only fixed names and values: an audit form request accepted by the app becomes `lead_form_submit` with `method=audit_form`, and kiosk wrappers use fixed kiosk IDs. No form answers, revenue bands, contact details, free-form text, or identifiers are forwarded by the event helper. AiXCEL contact email drafts are not completed leads. Events that happen before consent are not queued for later replay.

Systems Desk is excluded because authenticated conversation IDs appear in its URLs. Embedded `/kiosks/_app/` documents are untagged to avoid iframe duplicate pageviews and collecting demo inputs. The four public kiosk wrapper pages are covered.

## Stream settings and residual risk

The shared stream has automatic site-search and form-interaction measurement disabled. Page/history views, outbound clicks, scrolls, video engagement, and downloads remain enabled. Email redaction is enabled. These Admin settings are not controlled by source code and must be verified at release.

Initial config cleaning does **not** prove all later enhanced-measurement URLs are sanitized. Google's history and outbound/download collection can include full page or link URLs, including query values. Current public route links use static non-personal paths, but avoid adding personal values to URLs or mailto links. Email redaction is an extra safeguard, not a guarantee against every kind of personal information. For stricter future control, either configure redaction for known query keys or move to a separately reviewed manual-pageview design after disabling automatic history measurement; do not layer manual pageviews on top of automatic history measurement.

## Build integration

The active build is `scripts/build-redesign.mjs`, not the historical generator described in older documentation. It copies `redesign/` to `dist/`, preserves the authenticated Systems Desk, then injects the local loader once per public HTML file. Systems Desk is intentionally excluded. CSP allows only the Google tag host and standard/regional Google Analytics collection hosts, without Ads hosts or `unsafe-eval`.

## Required release verification

1. Run `npm run test:analytics` and the repository build/verification suite.
2. Review the privacy notice changes and verify stream settings.
3. On a supported browser preview, check mobile/desktop consent layout, keyboard use, stored rejection, acceptance, withdrawal, and cross-tab changes. Preview hosts intentionally produce no Google traffic.
4. After an authorized production deployment, use browser network inspection/Tag Assistant: no GA requests before consent or after reject; one initial pageview; one per client-side route/back/forward; no iframe duplicate; correct ID and hostname; correct non-ad consent.
5. Verify actual cookie creation/removal and no measurement after withdrawal, including queued requests. Verify cross-domain linker/session behavior only after opting in on the relevant sites; confirm consent is never inferred from a linked visit.
6. Confirm app-accepted, non-honeypot form requests emit one fixed `lead_form_submit` without form values. This event is not proof of delivery to email, storage, or automation sinks, and must remain unmarked as a key event. The existing backend can treat a returned Resend error as success because it does not inspect the SDK result; that backend behavior is outside this tag change. Do not submit real lead forms merely to test analytics.
7. Inspect actual `page_location`, `page_referrer`, and outbound `link_url` values using synthetic parameters; record any residual query risk. Check CSP console/network violations.

Source-level/unit checks are not proof of Google receipt, Realtime/DebugView visibility, live CSP behavior, or session continuity. Do not describe this setup as live until deployed and checked.
