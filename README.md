# Aixcel Solutions

Production source for [aixcelsolutions.com](https://aixcelsolutions.com).

The site is a statically generated company website. `site/index.html` remains the source for the production homepage visual, while `scripts/build-site.mjs` produces the homepage plus route-specific service, company, case-study, contact, and policy pages in `dist/`. Every published page has server-visible content, unique metadata, a self-canonical, social metadata, breadcrumbs, and structured data.

The primary booking CTA is the same Cal.com event used by AhmadBukhari.com:

`https://cal.com/ahmad-bukhari/ai-consultancy-call-with-ab`

The founder photograph is bundled locally so the company page does not depend on another site at render time. No environment variables are required.

Build and verify locally:

```bash
npm run verify
```

The validation step checks every sitemap URL, unique metadata and canonicals, one H1 per page, JSON-LD validity, social-image references, and internal links. Vercel runs the static generator and publishes `dist/`.

Vercel deploys the production site from the `main` branch.
