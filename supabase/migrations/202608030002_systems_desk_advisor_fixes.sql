create index chat_threads_agent_idx on public.chat_threads (agent_id);

drop policy profiles_select_own_or_admin on public.profiles;
create policy profiles_select_own_or_admin
on public.profiles
for select
to authenticated
using (
  user_id = (select auth.uid())
  or coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin'
);

drop policy problem_intakes_select_own_or_admin on public.problem_intakes;
create policy problem_intakes_select_own_or_admin
on public.problem_intakes
for select
to authenticated
using (
  user_id = (select auth.uid())
  or coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin'
);

drop policy problem_intakes_update_own_or_admin on public.problem_intakes;
create policy problem_intakes_update_own_or_admin
on public.problem_intakes
for update
to authenticated
using (
  user_id = (select auth.uid())
  or coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin'
)
with check (
  user_id = (select auth.uid())
  or coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin'
);

drop policy problem_intakes_delete_own_or_admin on public.problem_intakes;
create policy problem_intakes_delete_own_or_admin
on public.problem_intakes
for delete
to authenticated
using (
  user_id = (select auth.uid())
  or coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin'
);

drop policy agents_admin_manage on public.agents;
create policy agents_admin_manage
on public.agents
for all
to authenticated
using (coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin')
with check (coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin');

drop policy knowledge_documents_admin_manage on public.knowledge_documents;
create policy knowledge_documents_admin_manage
on public.knowledge_documents
for all
to authenticated
using (coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin')
with check (coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin');
