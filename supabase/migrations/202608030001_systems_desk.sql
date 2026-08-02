create table public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  full_name text check (full_name is null or char_length(full_name) between 1 and 120),
  company_name text check (company_name is null or char_length(company_name) between 1 and 160),
  role_title text check (role_title is null or char_length(role_title) between 1 and 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.problem_intakes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  problem text not null check (char_length(btrim(problem)) between 1 and 10000),
  business_context jsonb not null default '{}'::jsonb check (jsonb_typeof(business_context) = 'object'),
  desired_outcome text check (desired_outcome is null or char_length(desired_outcome) <= 10000),
  constraints text check (constraints is null or char_length(constraints) <= 10000),
  consent_version text not null check (char_length(btrim(consent_version)) between 1 and 64),
  consented_at timestamptz not null default now(),
  status text not null default 'open' check (status in ('open', 'submitted', 'resolved', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.agents (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (char_length(btrim(name)) between 1 and 120),
  description text not null check (char_length(btrim(description)) between 1 and 500),
  system_prompt text not null check (char_length(btrim(system_prompt)) between 1 and 20000),
  is_active boolean not null default true,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(btrim(title)) between 1 and 300),
  canonical_url text check (canonical_url is null or char_length(canonical_url) <= 2048),
  source_type text not null default 'internal' check (source_type in ('case_study', 'company', 'policy', 'insight', 'service', 'internal')),
  status text not null default 'draft' check (status in ('draft', 'approved', 'archived')),
  tags text[] not null default '{}'::text[] check (cardinality(tags) <= 50 and array_position(tags, null) is null),
  agent_slugs text[] not null default '{}'::text[] check (cardinality(agent_slugs) <= 20 and array_position(agent_slugs, null) is null),
  content text not null check (char_length(btrim(content)) > 0),
  search_vector tsvector generated always as (
    setweight(to_tsvector('pg_catalog.english'::regconfig, coalesce(title, '')), 'A') ||
    setweight(to_tsvector('pg_catalog.english'::regconfig, coalesce(content, '')), 'B')
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.chat_threads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  agent_id uuid not null references public.agents (id) on delete restrict,
  title text check (title is null or char_length(title) between 1 and 200),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.chat_threads (id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system', 'tool')),
  content text not null check (char_length(btrim(content)) between 1 and 50000),
  citations jsonb not null default '[]'::jsonb check (jsonb_typeof(citations) = 'array'),
  model text check (model is null or char_length(model) <= 200),
  created_at timestamptz not null default now()
);

create table public.chat_user_daily_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  usage_date date not null,
  used_count integer not null default 0 check (used_count >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, usage_date)
);

create table public.chat_global_daily_usage (
  usage_date date primary key,
  used_count integer not null default 0 check (used_count >= 0),
  updated_at timestamptz not null default now()
);

create index problem_intakes_user_created_idx on public.problem_intakes (user_id, created_at desc);
create index agents_active_order_idx on public.agents (sort_order, slug) where is_active;
create index knowledge_documents_search_idx on public.knowledge_documents using gin (search_vector);
create index knowledge_documents_status_updated_idx on public.knowledge_documents (status, updated_at desc);
create index knowledge_documents_agent_slugs_idx on public.knowledge_documents using gin (agent_slugs);
create index chat_threads_user_updated_idx on public.chat_threads (user_id, updated_at desc);
create index chat_messages_thread_created_idx on public.chat_messages (thread_id, created_at, id);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

revoke all on function public.set_updated_at() from public, anon, authenticated;

-- Changing the accepted privacy version refreshes the corresponding consent timestamp without allowing direct timestamp edits.
create function public.record_consent_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.consent_version is distinct from old.consent_version then
    new.consented_at := now();
  end if;
  return new;
end;
$$;

revoke all on function public.record_consent_update() from public, anon, authenticated;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger problem_intakes_set_updated_at
before update on public.problem_intakes
for each row execute function public.set_updated_at();

create trigger problem_intakes_record_consent_update
before update of consent_version on public.problem_intakes
for each row execute function public.record_consent_update();

create trigger agents_set_updated_at
before update on public.agents
for each row execute function public.set_updated_at();

create trigger knowledge_documents_set_updated_at
before update on public.knowledge_documents
for each row execute function public.set_updated_at();

create trigger chat_threads_set_updated_at
before update on public.chat_threads
for each row execute function public.set_updated_at();

create trigger chat_user_daily_usage_set_updated_at
before update on public.chat_user_daily_usage
for each row execute function public.set_updated_at();

create trigger chat_global_daily_usage_set_updated_at
before update on public.chat_global_daily_usage
for each row execute function public.set_updated_at();

-- This definer trigger copies only non-sensitive profile metadata; credentials remain exclusively in auth.users.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id, full_name, company_name, role_title)
  values (
    new.id,
    left(nullif(btrim(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', '')), ''), 120),
    left(nullif(btrim(coalesce(new.raw_user_meta_data ->> 'company_name', new.raw_user_meta_data ->> 'organization', '')), ''), 160),
    left(nullif(btrim(coalesce(new.raw_user_meta_data ->> 'role_title', '')), ''), 120)
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created_systems_desk
after insert on auth.users
for each row execute function public.handle_new_user();

insert into public.profiles (user_id, full_name, company_name, role_title)
select
  users.id,
  left(nullif(btrim(coalesce(users.raw_user_meta_data ->> 'full_name', users.raw_user_meta_data ->> 'name', '')), ''), 120),
  left(nullif(btrim(coalesce(users.raw_user_meta_data ->> 'company_name', users.raw_user_meta_data ->> 'organization', '')), ''), 160),
  left(nullif(btrim(coalesce(users.raw_user_meta_data ->> 'role_title', '')), ''), 120)
from auth.users as users
on conflict (user_id) do nothing;

insert into public.agents (slug, name, description, system_prompt, is_active, sort_order)
values
  (
    'ask-aixcel',
    'Ask Aixcel',
    'Answers questions about Aixcel Solutions, its work, methods, and published evidence.',
    'Answer using only the approved Aixcel knowledge supplied to you. Cite the relevant source when one is available. If the evidence does not support an answer, say so plainly and offer the safest next step. Do not invent clients, outcomes, capabilities, prices, or commitments.',
    true,
    10
  ),
  (
    'systems-auditor',
    'Systems Auditor',
    'Diagnoses operational bottlenecks, control gaps, and automation risks from a submitted problem.',
    'Act as a concise business systems auditor. Separate the stated problem, observed evidence, assumptions, operational risks, and missing information. Identify the primary constraint and recommend one bounded diagnostic next step. Do not claim an implementation or result has been verified when it has not.',
    true,
    20
  ),
  (
    'solution-mapper',
    'Solution Mapper',
    'Turns a defined business problem into a bounded architecture with owners, controls, and delivery stages.',
    'Translate the approved problem context into a practical solution map. Separate deterministic workflow, model-assisted judgment, data, integrations, human approvals, exceptions, observability, and acceptance evidence. Keep consequential actions human-gated and distinguish a proposed design from a deployed system.',
    true,
    30
  );

alter table public.profiles enable row level security;
alter table public.profiles force row level security;
alter table public.problem_intakes enable row level security;
alter table public.problem_intakes force row level security;
alter table public.agents enable row level security;
alter table public.agents force row level security;
alter table public.knowledge_documents enable row level security;
alter table public.knowledge_documents force row level security;
alter table public.chat_threads enable row level security;
alter table public.chat_threads force row level security;
alter table public.chat_messages enable row level security;
alter table public.chat_messages force row level security;
alter table public.chat_user_daily_usage enable row level security;
alter table public.chat_user_daily_usage force row level security;
alter table public.chat_global_daily_usage enable row level security;
alter table public.chat_global_daily_usage force row level security;

-- Administrative policies trust app_metadata because authenticated users cannot edit that JWT namespace themselves.
create policy profiles_select_own_or_admin
on public.profiles
for select
to authenticated
using (
  user_id = (select auth.uid())
  or (select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin')
);

create policy profiles_insert_own
on public.profiles
for insert
to authenticated
with check (user_id = (select auth.uid()));

create policy profiles_update_own
on public.profiles
for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy problem_intakes_select_own_or_admin
on public.problem_intakes
for select
to authenticated
using (
  user_id = (select auth.uid())
  or (select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin')
);

create policy problem_intakes_insert_own
on public.problem_intakes
for insert
to authenticated
with check (user_id = (select auth.uid()));

create policy problem_intakes_update_own_or_admin
on public.problem_intakes
for update
to authenticated
using (
  user_id = (select auth.uid())
  or (select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin')
)
with check (
  user_id = (select auth.uid())
  or (select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin')
);

create policy problem_intakes_delete_own_or_admin
on public.problem_intakes
for delete
to authenticated
using (
  user_id = (select auth.uid())
  or (select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin')
);

create policy agents_select_active
on public.agents
for select
to anon, authenticated
using (is_active);

create policy agents_admin_manage
on public.agents
for all
to authenticated
using ((select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'))
with check ((select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'));

create policy knowledge_documents_admin_manage
on public.knowledge_documents
for all
to authenticated
using ((select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'))
with check ((select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'));

create policy chat_threads_select_own
on public.chat_threads
for select
to authenticated
using (user_id = (select auth.uid()));

create policy chat_threads_insert_own
on public.chat_threads
for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and exists (
    select 1
    from public.agents as selected_agent
    where selected_agent.id = chat_threads.agent_id
      and selected_agent.is_active
  )
);

create policy chat_threads_update_own
on public.chat_threads
for update
to authenticated
using (user_id = (select auth.uid()))
with check (
  user_id = (select auth.uid())
  and exists (
    select 1
    from public.agents as selected_agent
    where selected_agent.id = chat_threads.agent_id
      and selected_agent.is_active
  )
);

create policy chat_threads_delete_own
on public.chat_threads
for delete
to authenticated
using (user_id = (select auth.uid()));

create policy chat_messages_select_own_thread
on public.chat_messages
for select
to authenticated
using (
  exists (
    select 1
    from public.chat_threads as threads
    where threads.id = chat_messages.thread_id
      and threads.user_id = (select auth.uid())
  )
);

create policy chat_messages_insert_user_role
on public.chat_messages
for insert
to authenticated
with check (
  role = 'user'
  and exists (
    select 1
    from public.chat_threads as threads
    where threads.id = chat_messages.thread_id
      and threads.user_id = (select auth.uid())
  )
);

revoke all on table public.profiles from anon, authenticated;
grant select on table public.profiles to authenticated;
grant insert (user_id, full_name, company_name, role_title) on table public.profiles to authenticated;
grant update (full_name, company_name, role_title) on table public.profiles to authenticated;

revoke all on table public.problem_intakes from anon, authenticated;
grant select, delete on table public.problem_intakes to authenticated;
grant insert (problem, business_context, desired_outcome, constraints, consent_version, status) on table public.problem_intakes to authenticated;
grant update (problem, business_context, desired_outcome, constraints, consent_version, status) on table public.problem_intakes to authenticated;

revoke all on table public.agents from anon, authenticated;
grant select (id, slug, name, description, is_active, sort_order, created_at, updated_at) on table public.agents to anon, authenticated;
grant insert (slug, name, description, system_prompt, is_active, sort_order) on table public.agents to authenticated;
grant update (slug, name, description, system_prompt, is_active, sort_order) on table public.agents to authenticated;
grant delete on table public.agents to authenticated;

revoke all on table public.knowledge_documents from anon, authenticated;
grant select, insert, update, delete on table public.knowledge_documents to authenticated;

revoke all on table public.chat_threads from anon, authenticated;
grant select, delete on table public.chat_threads to authenticated;
grant insert (agent_id, title) on table public.chat_threads to authenticated;
grant update (agent_id, title) on table public.chat_threads to authenticated;

revoke all on table public.chat_messages from anon, authenticated;
grant select on table public.chat_messages to authenticated;
grant insert (thread_id, role, content) on table public.chat_messages to authenticated;

revoke all on table public.chat_user_daily_usage from anon, authenticated;
revoke all on table public.chat_global_daily_usage from anon, authenticated;

-- Row locks and fixed hard maxima make both counters atomic and prevent callers from raising their own limits.
create function public.consume_chat_quota(
  p_user_limit integer default 8,
  p_global_limit integer default 600
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_usage_date date := (timezone('utc', statement_timestamp()))::date;
  v_user_used integer;
  v_global_used integer;
  v_remaining integer;
begin
  if v_user_id is null then
    return jsonb_build_object('allowed', false, 'remaining', 0, 'reason', 'authentication_required');
  end if;

  if p_user_limit is null
    or p_global_limit is null
    or p_user_limit < 1
    or p_global_limit < 1
    or p_user_limit > 8
    or p_global_limit > 600 then
    return jsonb_build_object('allowed', false, 'remaining', 0, 'reason', 'invalid_limits');
  end if;

  insert into public.chat_global_daily_usage (usage_date, used_count)
  values (v_usage_date, 0)
  on conflict (usage_date) do nothing;

  select usage.used_count
  into v_global_used
  from public.chat_global_daily_usage as usage
  where usage.usage_date = v_usage_date
  for update;

  if v_global_used >= p_global_limit then
    return jsonb_build_object('allowed', false, 'remaining', 0, 'reason', 'global_limit');
  end if;

  insert into public.chat_user_daily_usage (user_id, usage_date, used_count)
  values (v_user_id, v_usage_date, 0)
  on conflict (user_id, usage_date) do nothing;

  select usage.used_count
  into v_user_used
  from public.chat_user_daily_usage as usage
  where usage.user_id = v_user_id
    and usage.usage_date = v_usage_date
  for update;

  if v_user_used >= p_user_limit then
    return jsonb_build_object('allowed', false, 'remaining', 0, 'reason', 'user_limit');
  end if;

  update public.chat_global_daily_usage
  set used_count = used_count + 1
  where usage_date = v_usage_date;

  update public.chat_user_daily_usage
  set used_count = used_count + 1
  where user_id = v_user_id
    and usage_date = v_usage_date;

  v_remaining := greatest(
    least(
      p_user_limit - (v_user_used + 1),
      p_global_limit - (v_global_used + 1)
    ),
    0
  );

  return jsonb_build_object('allowed', true, 'remaining', v_remaining, 'reason', 'ok');
end;
$$;

revoke all on function public.consume_chat_quota(integer, integer) from public, anon, authenticated;
grant execute on function public.consume_chat_quota(integer, integer) to authenticated, service_role;

-- The definer boundary exposes only published content while direct document access remains admin-only under RLS.
create function public.search_knowledge(
  p_query text,
  p_agent_slug text,
  p_limit integer default 6
)
returns table (
  id uuid,
  title text,
  canonical_url text,
  content text,
  rank real
)
language sql
stable
security definer
set search_path = ''
as $$
  with parsed_query as (
    select websearch_to_tsquery('pg_catalog.english'::regconfig, btrim(p_query)) as query
    where p_query is not null
      and char_length(btrim(p_query)) between 2 and 500
      and exists (
        select 1
        from public.agents as agents
        where agents.slug = p_agent_slug
          and agents.is_active
      )
  )
  select
    documents.id,
    documents.title,
    documents.canonical_url,
    documents.content,
    ts_rank_cd(documents.search_vector, parsed_query.query)::real as rank
  from public.knowledge_documents as documents
  cross join parsed_query
  where documents.status = 'approved'
    and (
      cardinality(documents.agent_slugs) = 0
      or p_agent_slug = any (documents.agent_slugs)
    )
    and documents.search_vector @@ parsed_query.query
  order by ts_rank_cd(documents.search_vector, parsed_query.query) desc, documents.updated_at desc
  limit greatest(1, least(coalesce(p_limit, 6), 20));
$$;

revoke all on function public.search_knowledge(text, text, integer) from public, anon, authenticated;
grant execute on function public.search_knowledge(text, text, integer) to authenticated, service_role;
