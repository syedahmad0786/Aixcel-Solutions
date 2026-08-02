-- Keep history user-owned and protected by row-level security without elevated function privileges.
drop policy chat_messages_insert_user_role on public.chat_messages;

create policy chat_messages_insert_own_thread
on public.chat_messages
for insert
to authenticated
with check (
  role in ('user', 'assistant')
  and exists (
    select 1
    from public.chat_threads as threads
    where threads.id = chat_messages.thread_id
      and threads.user_id = (select auth.uid())
  )
);

create or replace function public.save_chat_turn(
  p_thread_id uuid,
  p_agent_slug text,
  p_title text,
  p_user_content text,
  p_assistant_content text
)
returns uuid
language plpgsql
security invoker
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
    insert into public.chat_threads (agent_id, title)
    values (v_agent_id, left(btrim(p_title), 200))
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
