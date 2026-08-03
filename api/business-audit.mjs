import { lookup } from 'node:dns/promises';
import { BlockList, isIP } from 'node:net';

import {
  PublicHttpError,
  boundedText,
  fetchSupabase,
  getHeader,
  isPlainObject,
  isSameOriginRequest,
  normalizeSourceUrl,
  normalizeSupabaseUrl,
  parseBearerToken,
  readJsonResponse,
  readRequestBody,
  readSupabaseJson,
  sendJson,
  verifySupabaseUser,
} from './systems-desk.mjs';

const DEFAULT_SUPABASE_URL = 'https://ozvltcgrmgzeyoxklozz.supabase.co';
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable__YPV1m0HbigsuHw4XcQ48g_CvyIt9mS';
const TAVILY_SEARCH_ENDPOINT = 'https://api.tavily.com/search';
const TAVILY_EXTRACT_ENDPOINT = 'https://api.tavily.com/extract';
const PAGESPEED_ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
const AUDIT_SELECT = [
  'id',
  'company_name',
  'website_url',
  'linkedin_url',
  'instagram_url',
  'status',
  'attempt_count',
  'report_text',
  'metrics',
  'coverage',
  'sources',
  'error_code',
  'consent_version',
  'consented_at',
  'started_at',
  'completed_at',
  'created_at',
  'updated_at',
].join(',');

export const AUDIT_LIMITS = Object.freeze({
  companyChars: 160,
  sourceCount: 16,
  sourceExcerptChars: 700,
  tavilyResponseBytes: 512 * 1024,
  pagespeedResponseBytes: 5 * 1024 * 1024,
  tavilyTimeoutMs: 12_000,
  pagespeedTimeoutMs: 20_000,
});

const RESERVED_NETWORKS = new BlockList();
for (const [network, prefix] of [
  ['0.0.0.0', 8], ['10.0.0.0', 8], ['100.64.0.0', 10], ['127.0.0.0', 8],
  ['169.254.0.0', 16], ['172.16.0.0', 12], ['192.0.0.0', 24], ['192.0.2.0', 24],
  ['192.168.0.0', 16], ['198.18.0.0', 15], ['198.51.100.0', 24], ['203.0.113.0', 24],
  ['224.0.0.0', 4], ['240.0.0.0', 4],
]) RESERVED_NETWORKS.addSubnet(network, prefix, 'ipv4');
for (const [network, prefix] of [
  ['::', 128], ['::1', 128], ['64:ff9b::', 96],
  ['100::', 64], ['2001:db8::', 32], ['fc00::', 7], ['fe80::', 10], ['ff00::', 8],
]) RESERVED_NETWORKS.addSubnet(network, prefix, 'ipv6');

function cleanText(value) {
  return typeof value === 'string' ? value.replace(/\u0000/g, '').trim() : '';
}

function invalidInput(message) {
  throw new PublicHttpError(400, 'invalid_audit_input', message);
}

function normalizeWebsiteUrl(value) {
  const text = cleanText(value);
  let url;
  try { url = new URL(text); } catch { invalidInput('Enter a valid HTTPS website homepage.'); }
  if (
    url.protocol !== 'https:'
    || url.username
    || url.password
    || url.port
    || url.search
    || url.hash
    || !['', '/'].includes(url.pathname)
    || isIP(url.hostname)
    || /(^|\.)((localhost)|(local)|(internal)|(home)|(test)|(example)|(invalid)|(onion))$/i.test(url.hostname)
    || !url.hostname.includes('.')
  ) invalidInput('Use the public HTTPS homepage without a path, port, query, or fragment.');
  url.hostname = url.hostname.toLowerCase();
  url.pathname = '/';
  return url.href;
}

function normalizeLinkedInUrl(value) {
  const text = cleanText(value);
  if (!text) return null;
  let url;
  try { url = new URL(text); } catch { invalidInput('Enter a valid LinkedIn company page URL.'); }
  if (
    url.protocol !== 'https:'
    || !['linkedin.com', 'www.linkedin.com'].includes(url.hostname.toLowerCase())
    || url.username
    || url.password
    || url.port
    || url.search
    || url.hash
    || !/^\/company\/[a-z0-9][a-z0-9-]{1,99}\/?$/i.test(url.pathname)
  ) invalidInput('Use a LinkedIn company page such as https://www.linkedin.com/company/example/.');
  return `https://www.linkedin.com${url.pathname.replace(/\/$/, '')}/`;
}

function normalizeInstagramUrl(value) {
  const text = cleanText(value);
  if (!text) return null;
  let url;
  try { url = new URL(text); } catch { invalidInput('Enter a valid Instagram company profile URL.'); }
  const match = /^\/([a-z0-9._]{1,30})\/?$/i.exec(url.pathname);
  const reserved = new Set(['accounts', 'about', 'developer', 'directory', 'explore', 'p', 'reel', 'reels', 'stories']);
  if (
    url.protocol !== 'https:'
    || !['instagram.com', 'www.instagram.com'].includes(url.hostname.toLowerCase())
    || url.username
    || url.password
    || url.port
    || url.search
    || url.hash
    || !match
    || reserved.has(match[1].toLowerCase())
  ) invalidInput('Use one public Instagram company profile URL.');
  return `https://www.instagram.com/${match[1].toLowerCase()}/`;
}

export function validateAuditPayload(input) {
  if (!isPlainObject(input)) invalidInput('The request body is invalid.');
  const allowed = new Set(['companyName', 'websiteUrl', 'linkedinUrl', 'instagramUrl', 'consent']);
  if (Object.keys(input).some((key) => !allowed.has(key))) invalidInput('The request body is invalid.');
  const companyName = cleanText(input.companyName);
  if (companyName.length < 2 || companyName.length > AUDIT_LIMITS.companyChars) {
    invalidInput(`Company name must be between 2 and ${AUDIT_LIMITS.companyChars} characters.`);
  }
  if (input.consent !== true) invalidInput('Confirm that these are public business pages before continuing.');
  return {
    companyName,
    websiteUrl: normalizeWebsiteUrl(input.websiteUrl),
    linkedinUrl: normalizeLinkedInUrl(input.linkedinUrl),
    instagramUrl: normalizeInstagramUrl(input.instagramUrl),
  };
}

export function isReservedAddress(address) {
  const version = isIP(address);
  if (!version) return true;
  const mapped = version === 6 && /^::ffff:(\d+\.\d+\.\d+\.\d+)$/i.exec(address);
  if (mapped) return isReservedAddress(mapped[1]);
  return RESERVED_NETWORKS.check(address, version === 4 ? 'ipv4' : 'ipv6');
}

export async function assertPublicWebsite(url, lookupImpl = lookup) {
  let records;
  try {
    records = await lookupImpl(new URL(url).hostname, { all: true, verbatim: true });
  } catch {
    throw new PublicHttpError(400, 'website_unreachable', 'The website hostname could not be resolved.');
  }
  if (!Array.isArray(records) || !records.length || records.some(({ address }) => isReservedAddress(address))) {
    throw new PublicHttpError(400, 'website_not_public', 'Use a publicly reachable business website.');
  }
}

function auditConfig(env, requireProviders) {
  const supabaseUrl = normalizeSupabaseUrl(
    env.SUPABASE_URL || env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL,
  );
  const supabaseKey = env.SUPABASE_PUBLISHABLE_KEY
    || env.SUPABASE_ANON_KEY
    || env.VITE_SUPABASE_ANON_KEY
    || DEFAULT_SUPABASE_PUBLISHABLE_KEY;
  const tavilyKey = env.TAVILY_API_KEY;
  if (!supabaseUrl || typeof supabaseKey !== 'string' || supabaseKey.length < 20) {
    throw new PublicHttpError(503, 'supabase_not_configured', 'The audit service is temporarily unavailable.');
  }
  if (requireProviders && (typeof tavilyKey !== 'string' || tavilyKey.length < 20)) {
    throw new PublicHttpError(503, 'audit_not_configured', 'The audit service is temporarily unavailable.');
  }
  return {
    supabaseUrl,
    supabaseKey,
    tavilyKey,
    pagespeedKey: typeof env.PAGESPEED_API_KEY === 'string' ? env.PAGESPEED_API_KEY : null,
    consentVersion: env.AUDIT_PRIVACY_VERSION || '2026-08-03',
  };
}

function publicAudit(row) {
  if (!isPlainObject(row)) return null;
  return Object.fromEntries(AUDIT_SELECT.split(',').map((key) => [key, row[key] ?? null]));
}

async function fetchOwnedAudit(fetchImpl, config, token) {
  const response = await fetchSupabase(
    fetchImpl,
    config,
    token,
    `/rest/v1/business_audits?select=${AUDIT_SELECT}&limit=1`,
  );
  if (response.status === 401 || response.status === 403) {
    throw new PublicHttpError(401, 'invalid_token', 'Sign in again to continue.');
  }
  if (!response.ok) {
    throw new PublicHttpError(503, 'audit_read_failed', 'The saved audit is temporarily unavailable.');
  }
  const rows = await readSupabaseJson(response);
  return publicAudit(Array.isArray(rows) ? rows[0] : null);
}

async function claimAudit(fetchImpl, config, token, input) {
  const response = await fetchSupabase(
    fetchImpl,
    config,
    token,
    '/rest/v1/rpc/claim_business_audit',
    {
      method: 'POST',
      body: {
        p_company_name: input.companyName,
        p_website_url: input.websiteUrl,
        p_linkedin_url: input.linkedinUrl,
        p_instagram_url: input.instagramUrl,
        p_consent_version: config.consentVersion,
        p_server_secret: config.tavilyKey,
      },
    },
  );
  if (!response.ok) {
    throw new PublicHttpError(503, 'audit_claim_failed', 'The audit could not be reserved.');
  }
  const claim = await readSupabaseJson(response);
  if (!isPlainObject(claim) || typeof claim.should_run !== 'boolean') {
    throw new PublicHttpError(503, 'audit_claim_invalid', 'The audit could not be reserved.');
  }
  return { ...claim, audit: publicAudit(claim.audit) };
}

async function fetchWithTimeout(fetchImpl, url, options, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  timer.unref?.();
  try { return await fetchImpl(url, { ...options, signal: controller.signal }); }
  finally { clearTimeout(timer); }
}

async function tavilyRequest(fetchImpl, apiKey, endpoint, body) {
  const response = await fetchWithTimeout(fetchImpl, endpoint, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }, AUDIT_LIMITS.tavilyTimeoutMs);
  if (!response.ok) throw new Error(`tavily_${response.status}`);
  return readJsonResponse(response, AUDIT_LIMITS.tavilyResponseBytes);
}

function safeAbsoluteUrl(value) {
  const normalized = normalizeSourceUrl(value);
  return normalized.startsWith('https://') ? normalized : '';
}

function searchSources(payload, kind) {
  if (!Array.isArray(payload?.results)) return [];
  return payload.results.slice(0, 5).flatMap((item) => {
    const url = safeAbsoluteUrl(item?.url);
    const excerpt = boundedText(item?.content, AUDIT_LIMITS.sourceExcerptChars, { collapse: true });
    if (!url || !excerpt) return [];
    return [{ kind, title: boundedText(item?.title, 160, { collapse: true }) || url, url, excerpt }];
  });
}

function extractSource(payload, websiteUrl) {
  const item = Array.isArray(payload?.results) ? payload.results[0] : null;
  const raw = Array.isArray(item?.raw_content) ? item.raw_content.join('\n') : item?.raw_content;
  const content = boundedText(raw, 5_000, { collapse: true });
  if (!content) return null;
  return {
    kind: 'website',
    title: 'Company website',
    url: safeAbsoluteUrl(item?.url) || websiteUrl,
    excerpt: content.slice(0, AUDIT_LIMITS.sourceExcerptChars),
    analysisText: content,
  };
}

async function pageSpeed(fetchImpl, websiteUrl, apiKey) {
  const url = new URL(PAGESPEED_ENDPOINT);
  url.searchParams.set('url', websiteUrl);
  url.searchParams.set('strategy', 'mobile');
  for (const category of ['performance', 'accessibility', 'best-practices', 'seo']) {
    url.searchParams.append('category', category);
  }
  if (apiKey) url.searchParams.set('key', apiKey);
  const response = await fetchWithTimeout(fetchImpl, url, { headers: { Accept: 'application/json' } }, AUDIT_LIMITS.pagespeedTimeoutMs);
  if (!response.ok) throw new Error(`pagespeed_${response.status}`);
  const payload = await readJsonResponse(response, AUDIT_LIMITS.pagespeedResponseBytes);
  const categories = payload?.lighthouseResult?.categories || {};
  const audits = payload?.lighthouseResult?.audits || {};
  const score = (key) => Number.isFinite(categories[key]?.score)
    ? Math.round(categories[key].score * 100)
    : null;
  return {
    finalUrl: safeAbsoluteUrl(payload?.lighthouseResult?.finalUrl) || websiteUrl,
    fetchedAt: boundedText(payload?.analysisUTCTimestamp, 40) || new Date().toISOString(),
    performance: score('performance'),
    accessibility: score('accessibility'),
    bestPractices: score('best-practices'),
    seo: score('seo'),
    largestContentfulPaint: boundedText(audits['largest-contentful-paint']?.displayValue, 80),
    cumulativeLayoutShift: boundedText(audits['cumulative-layout-shift']?.displayValue, 80),
  };
}

function socialSlug(url) {
  return url ? new URL(url).pathname.split('/').filter(Boolean).at(-1) : '';
}

function fulfilled(result) {
  return result.status === 'fulfilled' ? result.value : null;
}

function assignCitations(rawSources) {
  const seen = new Set();
  const sources = [];
  for (const source of rawSources) {
    if (!source || sources.length >= AUDIT_LIMITS.sourceCount) continue;
    const url = safeAbsoluteUrl(source.url);
    if (!url || seen.has(url)) continue;
    seen.add(url);
    sources.push({
      citation: `S${sources.length + 1}`,
      kind: source.kind,
      title: boundedText(source.title, 160, { collapse: true }) || url,
      url,
      excerpt: boundedText(source.excerpt, AUDIT_LIMITS.sourceExcerptChars, { collapse: true }),
    });
  }
  return sources;
}

export async function gatherAuditEvidence(fetchImpl, config, input) {
  const hostname = new URL(input.websiteUrl).hostname.replace(/^www\./, '');
  const linkedinHint = socialSlug(input.linkedinUrl);
  const instagramHint = socialSlug(input.instagramUrl);
  const basicSearch = (query, includeDomains) => tavilyRequest(
    fetchImpl,
    config.tavilyKey,
    TAVILY_SEARCH_ENDPOINT,
    {
      query,
      search_depth: 'basic',
      max_results: 5,
      include_answer: false,
      include_raw_content: false,
      include_images: false,
      ...(includeDomains ? { include_domains: includeDomains } : {}),
    },
  );
  const requests = await Promise.allSettled([
    tavilyRequest(fetchImpl, config.tavilyKey, TAVILY_EXTRACT_ENDPOINT, {
      urls: [input.websiteUrl],
      query: 'services audience proof trust signals contact and calls to action',
      extract_depth: 'basic',
      chunks_per_source: 3,
      include_images: false,
      timeout: 10,
    }),
    basicSearch(`"${input.companyName}" "${hostname}"`),
    basicSearch(`"${input.companyName}" ${linkedinHint || ''} site:linkedin.com/company`, ['linkedin.com']),
    basicSearch(`"${input.companyName}" ${instagramHint || ''} site:instagram.com`, ['instagram.com']),
    pageSpeed(fetchImpl, input.websiteUrl, config.pagespeedKey),
  ]);

  const website = extractSource(fulfilled(requests[0]), input.websiteUrl);
  const web = searchSources(fulfilled(requests[1]), 'web');
  const linkedin = searchSources(fulfilled(requests[2]), 'linkedin')
    .filter(({ url }) => {
      try { return Boolean(normalizeLinkedInUrl(url)); } catch { return false; }
    });
  const instagram = searchSources(fulfilled(requests[3]), 'instagram')
    .filter(({ url }) => {
      try { return Boolean(normalizeInstagramUrl(url)); } catch { return false; }
    });
  const metrics = fulfilled(requests[4]);
  const sources = assignCitations([website, ...web, ...linkedin, ...instagram]);
  const coverage = {
    website: { checked: true, found: Boolean(website) },
    webSearch: { checked: true, found: web.length > 0 },
    linkedin: { checked: true, found: linkedin.length > 0, supplied: Boolean(input.linkedinUrl) },
    instagram: { checked: true, found: instagram.length > 0, supplied: Boolean(input.instagramUrl) },
    pageSpeed: { checked: true, found: Boolean(metrics) },
    providerStatus: requests.map((result) => result.status),
  };
  return { sources, coverage, metrics: metrics ? { pageSpeed: metrics } : {}, websiteText: website?.analysisText || '' };
}

function sourceLabels(sources, kind) {
  return sources.filter((source) => source.kind === kind).map((source) => `[${source.citation}]`).join(' ');
}

function detected(text, terms) {
  const normalized = text.toLowerCase();
  return terms.some((term) => normalized.includes(term));
}

export function buildDeterministicReport(input, evidence) {
  const { sources, coverage, metrics, websiteText } = evidence;
  const websiteLabels = sourceLabels(sources, 'website');
  const webLabels = sourceLabels(sources, 'web');
  const linkedinLabels = sourceLabels(sources, 'linkedin');
  const instagramLabels = sourceLabels(sources, 'instagram');
  const page = metrics.pageSpeed;
  const lines = [
    `${input.companyName}: public presence audit`,
    '',
    'Executive read',
    coverage.website.found
      ? `The public website produced readable business evidence ${websiteLabels}.`
      : 'The public website did not produce readable extract evidence in this bounded scan.',
    coverage.webSearch.found
      ? `The company or domain appeared in ${sources.filter(({ kind }) => kind === 'web').length} bounded public search result(s) ${webLabels}.`
      : 'No general company result appeared in the bounded public search. This does not prove that the business is absent from search.',
    '',
    'Website signals',
  ];

  if (coverage.website.found) {
    lines.push(
      detected(websiteText, ['book', 'contact', 'get started', 'request', 'schedule', 'call'])
        ? `A call-to-action phrase was detected in the returned website evidence ${websiteLabels}.`
        : `No clear booking, contact, or get-started phrase was detected in the returned website evidence ${websiteLabels}.`,
      detected(websiteText, ['case study', 'testimonial', 'our clients', 'results', 'success stor'])
        ? `A proof or results phrase was detected in the returned website evidence ${websiteLabels}.`
        : `No case-study, testimonial, client, or results phrase was detected in the returned website evidence ${websiteLabels}.`,
    );
  }
  if (page) {
    lines.push(
      `Google PageSpeed mobile scores: performance ${page.performance ?? 'unavailable'}, accessibility ${page.accessibility ?? 'unavailable'}, best practices ${page.bestPractices ?? 'unavailable'}, SEO ${page.seo ?? 'unavailable'}.`,
      `Observed display metrics: largest contentful paint ${page.largestContentfulPaint || 'unavailable'}; cumulative layout shift ${page.cumulativeLayoutShift || 'unavailable'}.`,
    );
  } else {
    lines.push('Google PageSpeed evidence was unavailable during this run.');
  }

  lines.push(
    '',
    'LinkedIn coverage',
    coverage.linkedin.found
      ? `A company-page result appeared in public search evidence ${linkedinLabels}.`
      : 'No LinkedIn company-page result appeared in the bounded public search. This does not prove that no page exists.',
    '',
    'Instagram coverage',
    coverage.instagram.found
      ? `A company-profile result appeared in public search evidence ${instagramLabels}.`
      : 'No Instagram company-profile result appeared in the bounded public search. This does not prove that no profile exists.',
    '',
    'Priority actions',
  );

  const priorities = [];
  if (!coverage.website.found) priorities.push('Verify that the homepage is publicly crawlable and clearly states the company, offer, and target customer.');
  if (coverage.website.found && !detected(websiteText, ['book', 'contact', 'get started', 'request', 'schedule', 'call'])) priorities.push('Add one specific primary call to action on the homepage.');
  if (coverage.website.found && !detected(websiteText, ['case study', 'testimonial', 'our clients', 'results', 'success stor'])) priorities.push('Add verifiable proof with its scope and evidence limits.');
  if (!coverage.linkedin.found) priorities.push('Confirm the exact LinkedIn company-page URL and align its name and website with the homepage.');
  if (!coverage.instagram.found) priorities.push('Confirm whether Instagram is an intentional business channel; if it is, align the profile identity and website link.');
  if (Number.isFinite(page?.performance) && page.performance < 60) priorities.push('Investigate the mobile performance bottlenecks shown by PageSpeed before adding more front-end features.');
  for (const [index, priority] of priorities.slice(0, 3).entries()) lines.push(`${index + 1}. ${priority}`);
  if (!priorities.length) lines.push('1. Keep company naming, proof, and the primary call to action consistent across the indexed website and company profiles.');

  lines.push(
    '',
    'Evidence limits',
    'This is a point-in-time audit of public website content, public search-index results, and optional PageSpeed data. It does not sign into social networks, scrape private pages, inspect follower or engagement analytics, or prove that a missing search result means a profile does not exist.',
  );
  return lines.join('\n').slice(0, 40_000);
}

async function persistAudit(fetchImpl, config, token, audit, result) {
  const response = await fetchSupabase(
    fetchImpl,
    config,
    token,
    '/rest/v1/rpc/finish_business_audit',
    {
      method: 'POST',
      body: {
        p_audit_id: audit.id,
        p_status: result.status,
        p_report_text: result.report_text ?? null,
        p_metrics: result.metrics ?? {},
        p_coverage: result.coverage ?? {},
        p_sources: result.sources ?? [],
        p_error_code: result.error_code ?? null,
        p_server_secret: config.tavilyKey,
      },
    },
  );
  if (!response.ok) {
    throw new PublicHttpError(503, 'audit_save_failed', 'The audit result could not be saved.');
  }
  const saved = publicAudit(await readSupabaseJson(response));
  if (!saved) throw new PublicHttpError(503, 'audit_save_failed', 'The audit result could not be saved.');
  return saved;
}

function claimResponse(claim) {
  if (claim.reason === 'monthly_capacity') {
    throw new PublicHttpError(429, 'audit_capacity_reached', 'This month’s free audit capacity has been reached.');
  }
  if (claim.reason === 'email_already_used') {
    throw new PublicHttpError(409, 'audit_already_used', 'A one-time audit has already been used for this email.');
  }
  if (claim.reason === 'invalid_claim') {
    throw new PublicHttpError(400, 'invalid_audit_claim', 'The audit request is invalid.');
  }
  if (claim.reason === 'retry_exhausted') return { status: 200, audit: claim.audit };
  if (claim.reason === 'already_running') return { status: 202, audit: claim.audit };
  return { status: 200, audit: claim.audit };
}

export function createAuditHandler({ env = process.env, fetchImpl = globalThis.fetch, lookupImpl = lookup } = {}) {
  return async function businessAuditHandler(request, response) {
    let claimed = null;
    let config = null;
    let token = null;
    try {
      if (!['GET', 'POST'].includes(request.method)) {
        return sendJson(response, 405, { error: 'Only GET and POST are supported.', code: 'method_not_allowed' }, { Allow: 'GET, POST' });
      }
      if (request.method === 'POST' && !isSameOriginRequest(request, env)) {
        return sendJson(response, 403, { error: 'Cross-origin requests are not allowed.', code: 'origin_denied' });
      }
      if (typeof fetchImpl !== 'function') {
        throw new PublicHttpError(503, 'fetch_unavailable', 'The audit service is temporarily unavailable.');
      }

      config = auditConfig(env, request.method === 'POST');
      token = parseBearerToken(getHeader(request, 'authorization'));
      if (!token) throw new PublicHttpError(401, 'authentication_required', 'Sign in to continue.');
      const user = await verifySupabaseUser(fetchImpl, config, token);

      if (request.method === 'GET') {
        const audit = await fetchOwnedAudit(fetchImpl, config, token);
        return sendJson(response, 200, { audit });
      }

      if (!user.email || !user.emailConfirmedAt) {
        throw new PublicHttpError(403, 'email_not_confirmed', 'Confirm your email before starting the audit.');
      }
      const input = validateAuditPayload(await readRequestBody(request));
      await assertPublicWebsite(input.websiteUrl, lookupImpl);
      const claim = await claimAudit(fetchImpl, config, token, input);
      claimed = claim.audit;
      if (!claim.should_run) {
        const existing = claimResponse(claim);
        return sendJson(response, existing.status, { audit: existing.audit, reused: true });
      }

      const claimedInput = validateAuditPayload({
        companyName: claimed.company_name,
        websiteUrl: claimed.website_url,
        linkedinUrl: claimed.linkedin_url || '',
        instagramUrl: claimed.instagram_url || '',
        consent: true,
      });
      await assertPublicWebsite(claimedInput.websiteUrl, lookupImpl);
      const evidence = await gatherAuditEvidence(fetchImpl, config, claimedInput);
      const usable = evidence.sources.length > 0 || Boolean(evidence.metrics.pageSpeed);
      const complete = evidence.coverage.website.found
        && evidence.coverage.providerStatus.slice(0, 4).every((status) => status === 'fulfilled');
      const status = usable ? (complete ? 'completed' : 'partial') : 'failed';
      const reportText = usable ? buildDeterministicReport(claimedInput, evidence) : null;
      const audit = await persistAudit(fetchImpl, config, token, claimed, {
        status,
        report_text: reportText,
        metrics: evidence.metrics,
        coverage: evidence.coverage,
        sources: evidence.sources,
        error_code: usable ? null : 'public_evidence_unavailable',
      });
      return sendJson(response, usable ? 200 : 503, {
        audit,
        ...(usable ? {} : { error: 'Public evidence was unavailable. You can retry this saved audit.', code: 'audit_evidence_unavailable' }),
      });
    } catch (error) {
      if (claimed?.id && config?.tavilyKey && token) {
        await persistAudit(fetchImpl, config, token, claimed, {
          status: 'failed',
          error_code: error instanceof PublicHttpError ? error.code : 'audit_internal_error',
        }).catch(() => {});
      }
      if (error instanceof PublicHttpError) {
        return sendJson(response, error.status, { error: error.publicMessage, code: error.code });
      }
      return sendJson(response, 500, { error: 'The audit could not be completed.', code: 'audit_internal_error' });
    }
  };
}

export default createAuditHandler();
