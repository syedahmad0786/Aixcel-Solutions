import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  assertPublicWebsite,
  buildDeterministicReport,
  createAuditHandler,
  validateAuditPayload,
} from '../api/business-audit.mjs';

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function mockResponse() {
  const headers = new Map();
  return {
    statusCode: 0,
    headers,
    body: '',
    setHeader(name, value) { headers.set(name.toLowerCase(), value); },
    end(value = '') { this.body = value; },
  };
}

const env = {
  SUPABASE_URL: 'https://project.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test_value_123456',
  TAVILY_API_KEY: 'tvly-test-value-123456789012345',
  SYSTEMS_DESK_ALLOWED_ORIGIN: 'https://aixcelsolutions.com',
};

const requestBody = {
  companyName: 'Example Company',
  websiteUrl: 'https://example.com/',
  linkedinUrl: 'https://www.linkedin.com/company/example/',
  instagramUrl: 'https://www.instagram.com/example/',
  consent: true,
};

function postRequest(body = requestBody) {
  return {
    method: 'POST',
    headers: {
      origin: 'https://aixcelsolutions.com',
      host: 'aixcelsolutions.com',
      'x-forwarded-proto': 'https',
      'content-type': 'application/json',
      authorization: 'Bearer a-valid-looking-user-jwt-token',
    },
    body,
  };
}

test('accepts only bounded public business URLs and rejects identity injection', async () => {
  assert.deepEqual(validateAuditPayload(requestBody), {
    companyName: requestBody.companyName,
    websiteUrl: requestBody.websiteUrl,
    linkedinUrl: requestBody.linkedinUrl,
    instagramUrl: requestBody.instagramUrl,
  });
  for (const invalid of [
    { ...requestBody, email: 'attacker@example.com' },
    { ...requestBody, websiteUrl: 'http://example.com/' },
    { ...requestBody, websiteUrl: 'https://example.com/private' },
    { ...requestBody, websiteUrl: 'https://127.0.0.1/' },
    { ...requestBody, linkedinUrl: 'https://www.linkedin.com/in/person/' },
    { ...requestBody, instagramUrl: 'https://www.instagram.com/explore/' },
  ]) assert.throws(() => validateAuditPayload(invalid), /invalid_audit_input/);

  await assert.rejects(
    assertPublicWebsite('https://internal.example/', async () => [{ address: '10.0.0.8', family: 4 }]),
    /website_not_public/,
  );
  await assert.doesNotReject(
    assertPublicWebsite('https://example.com/', async () => [{ address: '93.184.216.34', family: 4 }]),
  );
});

test('requires a confirmed server-owned email before claiming or searching', async () => {
  let calls = 0;
  const handler = createAuditHandler({
    env,
    lookupImpl: async () => [{ address: '93.184.216.34', family: 4 }],
    fetchImpl: async (url) => {
      calls += 1;
      assert.match(String(url), /\/auth\/v1\/user$/);
      return jsonResponse({ id: 'user-1', email: 'owner@example.com', email_confirmed_at: null });
    },
  });
  const response = mockResponse();
  await handler(postRequest(), response);
  assert.equal(response.statusCode, 403);
  assert.equal(JSON.parse(response.body).code, 'email_not_confirmed');
  assert.equal(calls, 1);
});

test('loads the RLS-owned audit without filtering on the hidden user_id column', async () => {
  const handler = createAuditHandler({
    env,
    fetchImpl: async (url) => {
      const target = String(url);
      if (target.endsWith('/auth/v1/user')) {
        return jsonResponse({ id: 'user-1', email: 'owner@example.com', email_confirmed_at: 'now' });
      }
      if (target.includes('/rest/v1/business_audits?')) {
        assert.doesNotMatch(target, /user_id/);
        return jsonResponse([]);
      }
      throw new Error(`Unexpected fetch: ${target}`);
    },
  });
  const response = mockResponse();
  await handler({ method: 'GET', headers: { authorization: 'Bearer a-valid-looking-user-jwt-token' } }, response);
  assert.equal(response.statusCode, 200, response.body);
  assert.equal(JSON.parse(response.body).audit, null);
});

test('runs one bounded audit, keeps social URLs out of extract, and saves server-owned evidence', async () => {
  const auditId = 'c879eb92-f0f9-4b35-9b5b-fdc05d83e06e';
  const providerBodies = [];
  let patchBody;
  const baseAudit = {
    id: auditId,
    company_name: requestBody.companyName,
    website_url: requestBody.websiteUrl,
    linkedin_url: requestBody.linkedinUrl,
    instagram_url: requestBody.instagramUrl,
    status: 'running',
    attempt_count: 1,
    created_at: '2026-08-03T00:00:00.000Z',
    updated_at: '2026-08-03T00:00:00.000Z',
  };
  const fetchImpl = async (url, options = {}) => {
    const target = String(url);
    if (target.endsWith('/auth/v1/user')) {
      return jsonResponse({ id: 'user-1', email: 'OWNER@EXAMPLE.COM', email_confirmed_at: '2026-08-03T00:00:00Z' });
    }
    if (target.endsWith('/rest/v1/rpc/claim_business_audit')) {
      assert.equal(options.headers.Authorization, 'Bearer a-valid-looking-user-jwt-token');
      const body = JSON.parse(options.body);
      assert.equal('p_email_normalized' in body, false);
      assert.equal('p_user_id' in body, false);
      assert.equal(body.p_server_secret, env.TAVILY_API_KEY);
      return jsonResponse({ reason: 'created', should_run: true, audit: baseAudit });
    }
    if (target === 'https://api.tavily.com/extract') {
      const body = JSON.parse(options.body);
      providerBodies.push(body);
      assert.deepEqual(body.urls, [requestBody.websiteUrl]);
      return jsonResponse({ results: [{ url: requestBody.websiteUrl, raw_content: 'Example Company services. Contact us to book. Read our case study and results.' }] });
    }
    if (target === 'https://api.tavily.com/search') {
      const body = JSON.parse(options.body);
      providerBodies.push(body);
      assert.equal(body.search_depth, 'basic');
      assert.equal(body.max_results, 5);
      assert.equal(body.include_answer, false);
      assert.equal(body.include_raw_content, false);
      assert.equal(body.include_images, false);
      if (body.query.includes('linkedin.com')) {
        return jsonResponse({ results: [{ title: 'Example on LinkedIn', url: requestBody.linkedinUrl, content: 'Example Company business page.' }] });
      }
      if (body.query.includes('instagram.com')) {
        return jsonResponse({ results: [
          { title: 'Example post', url: 'https://www.instagram.com/p/not-a-profile/', content: 'Example Company post.' },
          { title: 'Explore', url: 'https://www.instagram.com/explore/', content: 'Explore results.' },
          { title: 'Example on Instagram', url: requestBody.instagramUrl, content: 'Example Company profile.' },
        ] });
      }
      return jsonResponse({ results: [{ title: 'Example mention', url: 'https://directory.example.org/example', content: 'Independent public company listing.' }] });
    }
    if (target.startsWith('https://www.googleapis.com/pagespeedonline/')) {
      return jsonResponse({
        analysisUTCTimestamp: '2026-08-03T00:01:00Z',
        lighthouseResult: {
          finalUrl: requestBody.websiteUrl,
          categories: {
            performance: { score: 0.78 },
            accessibility: { score: 0.91 },
            'best-practices': { score: 0.96 },
            seo: { score: 0.88 },
          },
          audits: {
            'largest-contentful-paint': { displayValue: '2.7 s' },
            'cumulative-layout-shift': { displayValue: '0.04' },
          },
        },
      });
    }
    if (target.endsWith('/rest/v1/rpc/finish_business_audit')) {
      patchBody = JSON.parse(options.body);
      assert.equal(options.headers.Authorization, 'Bearer a-valid-looking-user-jwt-token');
      assert.equal(patchBody.p_server_secret, env.TAVILY_API_KEY);
      return jsonResponse({
        ...baseAudit,
        status: patchBody.p_status,
        report_text: patchBody.p_report_text,
        metrics: patchBody.p_metrics,
        coverage: patchBody.p_coverage,
        sources: patchBody.p_sources,
        error_code: patchBody.p_error_code,
      });
    }
    throw new Error(`Unexpected fetch: ${target}`);
  };

  const handler = createAuditHandler({
    env,
    fetchImpl,
    lookupImpl: async () => [{ address: '93.184.216.34', family: 4 }],
  });
  const response = mockResponse();
  await handler(postRequest(), response);

  assert.equal(response.statusCode, 200, response.body);
  assert.equal(patchBody.p_status, 'completed');
  assert.equal(patchBody.p_sources.length, 4);
  assert.match(patchBody.p_report_text, /LinkedIn coverage/);
  assert.match(patchBody.p_report_text, /Evidence limits/);
  assert.doesNotMatch(patchBody.p_report_text, /follower count|engagement rate/i);
  assert.equal(providerBodies.filter((body) => Array.isArray(body.urls)).length, 1);
  assert.equal(providerBodies.some((body) => body.urls?.some((url) => /linkedin|instagram/.test(url))), false);
  assert.equal(patchBody.p_sources.some(({ url }) => /instagram\.com\/(?:p|explore)\//.test(url)), false);
});

test('reuses a completed claim without calling Tavily', async () => {
  const saved = {
    id: '8bb89482-9464-4c65-a0e3-4729e163beec',
    company_name: 'Example Company',
    website_url: 'https://example.com/',
    status: 'completed',
    attempt_count: 1,
    report_text: 'Saved report',
  };
  let tavilyCalls = 0;
  const handler = createAuditHandler({
    env,
    lookupImpl: async () => [{ address: '93.184.216.34', family: 4 }],
    fetchImpl: async (url) => {
      const target = String(url);
      if (target.endsWith('/auth/v1/user')) return jsonResponse({ id: 'user-1', email: 'owner@example.com', email_confirmed_at: 'now' });
      if (target.endsWith('/rest/v1/rpc/claim_business_audit')) return jsonResponse({ reason: 'already_completed', should_run: false, audit: saved });
      if (target.includes('tavily.com')) tavilyCalls += 1;
      throw new Error(`Unexpected fetch: ${target}`);
    },
  });
  const response = mockResponse();
  await handler(postRequest(), response);
  assert.equal(response.statusCode, 200, response.body);
  assert.equal(JSON.parse(response.body).reused, true);
  assert.equal(tavilyCalls, 0);
});

test('retries only the business identifiers saved in the claimed audit row', async () => {
  const saved = {
    id: '8bb89482-9464-4c65-a0e3-4729e163beec',
    company_name: 'Saved Company',
    website_url: 'https://saved.example.com/',
    linkedin_url: null,
    instagram_url: null,
    status: 'running',
    attempt_count: 2,
  };
  const providerBodies = [];
  const handler = createAuditHandler({
    env,
    lookupImpl: async () => [{ address: '93.184.216.34', family: 4 }],
    fetchImpl: async (url, options = {}) => {
      const target = String(url);
      if (target.endsWith('/auth/v1/user')) return jsonResponse({ id: 'user-1', email: 'owner@example.com', email_confirmed_at: 'now' });
      if (target.endsWith('/rest/v1/rpc/claim_business_audit')) return jsonResponse({ reason: 'retrying', should_run: true, audit: saved });
      if (target.includes('tavily.com')) {
        const body = JSON.parse(options.body);
        providerBodies.push(body);
        return jsonResponse(body.urls
          ? { results: [{ url: saved.website_url, raw_content: 'Contact Saved Company for services.' }] }
          : { results: [] });
      }
      if (target.includes('pagespeedonline')) return jsonResponse({}, 503);
      if (target.endsWith('/rest/v1/rpc/finish_business_audit')) {
        return jsonResponse({ ...saved, status: 'completed', report_text: 'Saved report' });
      }
      throw new Error(`Unexpected fetch: ${target}`);
    },
  });
  const response = mockResponse();
  await handler(postRequest({ ...requestBody, companyName: 'Different Company', websiteUrl: 'https://different.example.com/' }), response);
  assert.equal(response.statusCode, 200, response.body);
  const extract = providerBodies.find((body) => Array.isArray(body.urls));
  assert.deepEqual(extract.urls, [saved.website_url]);
  assert.equal(providerBodies.some((body) => JSON.stringify(body).includes('Different Company')), false);
});

test('migration and portal enforce one verified email and recover stale runs', async () => {
  const [sql, rpc, verifiedEmail, portal] = await Promise.all([
    readFile(new URL('../supabase/migrations/202608030006_business_presence_audits.sql', import.meta.url), 'utf8'),
    readFile(new URL('../supabase/migrations/202608030007_business_audit_authenticated_rpc.sql', import.meta.url), 'utf8'),
    readFile(new URL('../supabase/migrations/202608030008_business_audit_verified_email.sql', import.meta.url), 'utf8'),
    readFile(new URL('../site/assets/systems-desk.js', import.meta.url), 'utf8'),
  ]);
  assert.match(sql, /user_id uuid not null unique/);
  assert.match(sql, /email_normalized text not null unique/);
  assert.match(sql, /force row level security/);
  assert.match(sql, /pg_advisory_xact_lock/);
  assert.match(sql, /for update/);
  assert.match(sql, /p_monthly_limit > 100/);
  assert.match(rpc, /v_user_id uuid := auth\.uid\(\)/);
  assert.match(rpc, /auth\.jwt\(\) ->> 'email'/);
  assert.match(rpc, /extensions\.digest\(coalesce\(p_server_secret/);
  assert.match(rpc, /grant execute[\s\S]*to authenticated/);
  assert.doesNotMatch(rpc, /p_user_id|p_email_normalized/);
  assert.match(verifiedEmail, /from auth\.users as users/);
  assert.match(verifiedEmail, /users\.email_confirmed_at is not null/);
  assert.match(verifiedEmail, /or v_email is null/);
  assert.match(verifiedEmail, /extensions\.digest\(coalesce\(p_server_secret/);
  assert.match(verifiedEmail, /revoke all on function public\.claim_business_audit\(text, text, text, text, text, text\)/);
  assert.doesNotMatch(verifiedEmail, /auth\.jwt\(\) ->> 'email'/);
  assert.match(portal, /Date\.now\(\) - updated >= 10 \* 60 \* 1000/);
  assert.match(portal, /try \{ await loadAudit\(\); \}/);
});

test('deterministic report never turns missing social search evidence into a claim of absence', () => {
  const report = buildDeterministicReport(requestBody, {
    sources: [],
    websiteText: '',
    metrics: {},
    coverage: {
      website: { found: false },
      webSearch: { found: false },
      linkedin: { found: false },
      instagram: { found: false },
    },
  });
  assert.match(report, /does not prove that no page exists/);
  assert.match(report, /does not prove that no profile exists/);
  assert.match(report, /does not sign into social networks/);
});
