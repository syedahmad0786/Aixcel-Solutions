-- Enforce email confirmation and require the server secret inside the public RPC.
drop function public.claim_business_audit(text, text, text, text, text);

create function public.claim_business_audit(
  p_company_name text,
  p_website_url text,
  p_linkedin_url text,
  p_instagram_url text,
  p_consent_version text,
  p_server_secret text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_email text;
  v_month date := date_trunc('month', timezone('utc', statement_timestamp()))::date;
  v_used integer;
  v_audit public.business_audits%rowtype;
begin
  if not exists (
    select 1
    from public.business_audit_server_config as config
    where config.singleton
      and config.secret_hash = encode(extensions.digest(coalesce(p_server_secret, ''), 'sha256'), 'hex')
  ) then
    raise exception 'invalid_audit_server' using errcode = '42501';
  end if;

  select lower(btrim(users.email))
  into v_email
  from auth.users as users
  where users.id = v_user_id
    and users.email_confirmed_at is not null;

  if v_user_id is null
    or v_email is null
    or char_length(v_email) not between 3 and 320
    or char_length(btrim(coalesce(p_company_name, ''))) not between 2 and 160
    or char_length(btrim(coalesce(p_consent_version, ''))) not between 1 and 64 then
    return jsonb_build_object('reason', 'invalid_claim', 'should_run', false);
  end if;

  perform pg_advisory_xact_lock(hashtextextended(v_email, 0));

  select audits.*
  into v_audit
  from public.business_audits as audits
  where audits.user_id = v_user_id
     or audits.email_normalized = v_email
  order by (audits.user_id = v_user_id) desc
  limit 1;

  if found then
    if v_audit.user_id <> v_user_id then
      return jsonb_build_object('reason', 'email_already_used', 'should_run', false);
    end if;

    if v_audit.status in ('completed', 'partial') then
      return jsonb_build_object(
        'reason', 'already_completed',
        'should_run', false,
        'audit', to_jsonb(v_audit) - 'email_normalized' - 'user_id'
      );
    end if;

    if v_audit.status = 'running'
      and v_audit.updated_at > statement_timestamp() - interval '10 minutes' then
      return jsonb_build_object(
        'reason', 'already_running',
        'should_run', false,
        'audit', to_jsonb(v_audit) - 'email_normalized' - 'user_id'
      );
    end if;

    if v_audit.attempt_count >= 3 then
      return jsonb_build_object(
        'reason', 'retry_exhausted',
        'should_run', false,
        'audit', to_jsonb(v_audit) - 'email_normalized' - 'user_id'
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
      'audit', to_jsonb(v_audit) - 'email_normalized' - 'user_id'
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

  if v_used >= 100 then
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
    v_user_id,
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
    'audit', to_jsonb(v_audit) - 'email_normalized' - 'user_id'
  );
end;
$$;

revoke all on function public.claim_business_audit(text, text, text, text, text, text)
from public, anon;
grant execute on function public.claim_business_audit(text, text, text, text, text, text)
to authenticated;
