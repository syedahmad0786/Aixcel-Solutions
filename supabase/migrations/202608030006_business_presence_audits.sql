create table public.business_audits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  email_normalized text not null unique
    check (
      email_normalized = lower(btrim(email_normalized))
      and char_length(email_normalized) between 3 and 320
    ),
  company_name text not null check (char_length(btrim(company_name)) between 2 and 160),
  website_url text not null check (website_url ~ '^https://[^[:space:]]+$' and char_length(website_url) <= 2048),
  linkedin_url text check (linkedin_url is null or (linkedin_url ~ '^https://[^[:space:]]+$' and char_length(linkedin_url) <= 2048)),
  instagram_url text check (instagram_url is null or (instagram_url ~ '^https://[^[:space:]]+$' and char_length(instagram_url) <= 2048)),
  status text not null default 'running' check (status in ('running', 'completed', 'partial', 'failed')),
  attempt_count smallint not null default 1 check (attempt_count between 1 and 3),
  report_text text check (report_text is null or char_length(report_text) <= 40000),
  metrics jsonb not null default '{}'::jsonb check (jsonb_typeof(metrics) = 'object'),
  coverage jsonb not null default '{}'::jsonb check (jsonb_typeof(coverage) = 'object'),
  sources jsonb not null default '[]'::jsonb check (jsonb_typeof(sources) = 'array'),
  error_code text check (error_code is null or char_length(error_code) <= 80),
  consent_version text not null check (char_length(btrim(consent_version)) between 1 and 64),
  consented_at timestamptz not null default now(),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.business_audit_monthly_usage (
  month_start date primary key,
  used_count integer not null default 0 check (used_count >= 0),
  updated_at timestamptz not null default now()
);

create index business_audits_status_updated_idx
on public.business_audits (status, updated_at desc);

create trigger business_audits_set_updated_at
before update on public.business_audits
for each row execute function public.set_updated_at();

create trigger business_audit_monthly_usage_set_updated_at
before update on public.business_audit_monthly_usage
for each row execute function public.set_updated_at();

alter table public.business_audits enable row level security;
alter table public.business_audits force row level security;
alter table public.business_audit_monthly_usage enable row level security;
alter table public.business_audit_monthly_usage force row level security;

create policy business_audits_select_own
on public.business_audits
for select
to authenticated
using (user_id = (select auth.uid()));

revoke all on table public.business_audits from public, anon, authenticated;
grant select (
  id,
  company_name,
  website_url,
  linkedin_url,
  instagram_url,
  status,
  attempt_count,
  report_text,
  metrics,
  coverage,
  sources,
  error_code,
  consent_version,
  consented_at,
  started_at,
  completed_at,
  created_at,
  updated_at
) on table public.business_audits to authenticated;
grant select, insert, update on table public.business_audits to service_role;

revoke all on table public.business_audit_monthly_usage from public, anon, authenticated;
grant select, insert, update on table public.business_audit_monthly_usage to service_role;

-- A transaction-scoped email lock plus unique constraints makes the one-audit claim atomic.
-- Failed or abandoned runs can resume twice without consuming another monthly slot.
create function public.claim_business_audit(
  p_user_id uuid,
  p_email_normalized text,
  p_company_name text,
  p_website_url text,
  p_linkedin_url text,
  p_instagram_url text,
  p_consent_version text,
  p_monthly_limit integer default 100
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_email text := lower(btrim(coalesce(p_email_normalized, '')));
  v_month date := date_trunc('month', timezone('utc', statement_timestamp()))::date;
  v_used integer;
  v_audit public.business_audits%rowtype;
begin
  if p_user_id is null
    or char_length(v_email) not between 3 and 320
    or char_length(btrim(coalesce(p_company_name, ''))) not between 2 and 160
    or char_length(btrim(coalesce(p_consent_version, ''))) not between 1 and 64
    or p_monthly_limit is null
    or p_monthly_limit < 1
    or p_monthly_limit > 100 then
    return jsonb_build_object('reason', 'invalid_claim', 'should_run', false);
  end if;

  perform pg_advisory_xact_lock(hashtextextended(v_email, 0));

  select audits.*
  into v_audit
  from public.business_audits as audits
  where audits.user_id = p_user_id
     or audits.email_normalized = v_email
  order by (audits.user_id = p_user_id) desc
  limit 1;

  if found then
    if v_audit.user_id <> p_user_id then
      return jsonb_build_object('reason', 'email_already_used', 'should_run', false);
    end if;

    if v_audit.status in ('completed', 'partial') then
      return jsonb_build_object(
        'reason', 'already_completed',
        'should_run', false,
        'audit', to_jsonb(v_audit) - 'email_normalized'
      );
    end if;

    if v_audit.status = 'running'
      and v_audit.updated_at > statement_timestamp() - interval '10 minutes' then
      return jsonb_build_object(
        'reason', 'already_running',
        'should_run', false,
        'audit', to_jsonb(v_audit) - 'email_normalized'
      );
    end if;

    if v_audit.attempt_count >= 3 then
      return jsonb_build_object(
        'reason', 'retry_exhausted',
        'should_run', false,
        'audit', to_jsonb(v_audit) - 'email_normalized'
      );
    end if;

    update public.business_audits
    set
      status = 'running',
      attempt_count = attempt_count + 1,
      report_text = null,
      metrics = '{}'::jsonb,
      coverage = '{}'::jsonb,
      sources = '[]'::jsonb,
      error_code = null,
      started_at = now(),
      completed_at = null
    where id = v_audit.id
    returning * into v_audit;

    return jsonb_build_object(
      'reason', 'retrying',
      'should_run', true,
      'audit', to_jsonb(v_audit) - 'email_normalized'
    );
  end if;

  insert into public.business_audit_monthly_usage (month_start, used_count)
  values (v_month, 0)
  on conflict (month_start) do nothing;

  select usage.used_count
  into v_used
  from public.business_audit_monthly_usage as usage
  where usage.month_start = v_month
  for update;

  if v_used >= p_monthly_limit then
    return jsonb_build_object('reason', 'monthly_capacity', 'should_run', false);
  end if;

  update public.business_audit_monthly_usage
  set used_count = used_count + 1
  where month_start = v_month;

  insert into public.business_audits (
    user_id,
    email_normalized,
    company_name,
    website_url,
    linkedin_url,
    instagram_url,
    consent_version
  ) values (
    p_user_id,
    v_email,
    btrim(p_company_name),
    p_website_url,
    p_linkedin_url,
    p_instagram_url,
    btrim(p_consent_version)
  )
  returning * into v_audit;

  return jsonb_build_object(
    'reason', 'created',
    'should_run', true,
    'audit', to_jsonb(v_audit) - 'email_normalized'
  );
end;
$$;

revoke all on function public.claim_business_audit(uuid, text, text, text, text, text, text, integer)
from public, anon, authenticated;
grant execute on function public.claim_business_audit(uuid, text, text, text, text, text, text, integer)
to service_role;
