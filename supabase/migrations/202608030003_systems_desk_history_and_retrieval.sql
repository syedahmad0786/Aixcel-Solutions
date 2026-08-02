-- Broaden natural-language retrieval without allowing unapproved documents into the prompt.
create or replace function public.search_knowledge(
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
    select
      websearch_to_tsquery('pg_catalog.english'::regconfig, btrim(p_query)) as precise_query,
      (
        select to_tsquery(
          'pg_catalog.english'::regconfig,
          string_agg(quote_literal(terms.lexeme), ' | ')
        )
        from (
          select lexeme
          from unnest(
            tsvector_to_array(to_tsvector('pg_catalog.english'::regconfig, btrim(p_query)))
          ) as tokens(lexeme)
          limit 16
        ) as terms
      ) as broad_query
    where p_query is not null
      and char_length(btrim(p_query)) between 2 and 500
      and exists (
        select 1
        from public.agents as agents
        where agents.slug = p_agent_slug
          and agents.is_active
      )
  ),
  eligible as (
    select documents.*
    from public.knowledge_documents as documents
    cross join parsed_query
    where documents.status = 'approved'
      and (
        cardinality(documents.agent_slugs) = 0
        or p_agent_slug = any (documents.agent_slugs)
      )
  ),
  matches as (
    select
      documents.id,
      documents.title,
      documents.canonical_url,
      documents.content,
      documents.updated_at,
      (
        greatest(
          ts_rank_cd(documents.search_vector, parsed_query.precise_query),
          coalesce(ts_rank_cd(documents.search_vector, parsed_query.broad_query), 0)
        )
        + case when documents.search_vector @@ parsed_query.precise_query then 1 else 0 end
      )::real as rank
    from eligible as documents
    cross join parsed_query
    where documents.search_vector @@ parsed_query.precise_query
      or (
        parsed_query.broad_query is not null
        and numnode(parsed_query.broad_query) > 0
        and documents.search_vector @@ parsed_query.broad_query
      )
  )
  select
    matches.id,
    matches.title,
    matches.canonical_url,
    matches.content,
    matches.rank
  from matches
  order by matches.rank desc, matches.updated_at desc
  limit greatest(1, least(coalesce(p_limit, 6), 20));
$$;

revoke all on function public.search_knowledge(text, text, integer) from public, anon, authenticated;
grant execute on function public.search_knowledge(text, text, integer) to authenticated, service_role;

-- Save a complete user-owned turn atomically. Model prompts continue to treat this history as untrusted data.
create or replace function public.save_chat_turn(
  p_thread_id uuid,
  p_agent_slug text,
  p_title text,
  p_user_content text,
  p_assistant_content text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_agent_id uuid;
  v_created_at timestamptz;
  v_thread_id uuid;
begin
  if auth.uid() is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;
  if char_length(btrim(coalesce(p_title, ''))) not between 1 and 200
    or char_length(btrim(coalesce(p_user_content, ''))) not between 1 and 50000
    or char_length(btrim(coalesce(p_assistant_content, ''))) not between 1 and 50000 then
    raise exception 'invalid_chat_turn' using errcode = '22023';
  end if;

  select agents.id
  into v_agent_id
  from public.agents as agents
  where agents.slug = p_agent_slug
    and agents.is_active;

  if v_agent_id is null then
    raise exception 'invalid_agent' using errcode = '22023';
  end if;

  if p_thread_id is null then
    insert into public.chat_threads (user_id, agent_id, title)
    values ((select auth.uid()), v_agent_id, left(btrim(p_title), 200))
    returning id into v_thread_id;
  else
    select threads.id
    into v_thread_id
    from public.chat_threads as threads
    where threads.id = p_thread_id
      and threads.user_id = (select auth.uid())
      and threads.agent_id = v_agent_id;

    if v_thread_id is null then
      raise exception 'thread_not_found' using errcode = '42501';
    end if;

    update public.chat_threads
    set title = coalesce(title, left(btrim(p_title), 200))
    where id = v_thread_id;
  end if;

  v_created_at := clock_timestamp();
  insert into public.chat_messages (thread_id, role, content, created_at)
  values
    (v_thread_id, 'user', btrim(p_user_content), v_created_at),
    (v_thread_id, 'assistant', btrim(p_assistant_content), v_created_at + interval '1 microsecond');

  return v_thread_id;
end;
$$;

revoke all on function public.save_chat_turn(uuid, text, text, text, text) from public, anon;
grant execute on function public.save_chat_turn(uuid, text, text, text, text) to authenticated;
