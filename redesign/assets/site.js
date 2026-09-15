const menu = document.querySelector('.menu-toggle');
menu?.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); document.querySelector('.nav').classList.toggle('open', open); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') { menu.click(); menu.focus(); } });
let reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const motion = document.querySelector('.motion-toggle');
if(motion)motion.disabled=reduced;
if (reduced) { document.body.classList.add('motion-paused'); if (motion) { motion.textContent='Motion paused'; motion.setAttribute('aria-pressed','true'); } }
motion?.addEventListener('click', () => { const pause = !document.body.classList.contains('motion-paused'); document.body.classList.toggle('motion-paused',pause); motion.textContent=pause?'Resume motion':'Pause motion'; motion.setAttribute('aria-pressed',String(pause)); });
document.querySelector('.stack-toggle')?.addEventListener('click', e => {const b=e.currentTarget; const expanded=b.getAttribute('aria-pressed')!=='true'; b.setAttribute('aria-pressed',String(expanded)); b.textContent=expanded?'Flatten view':'Expand 3D view'; document.querySelector('.flow-stack').classList.toggle('expanded',expanded);});
const scenarios = {
  normal: {states:['done','done','done','hold'],labels:['Recorded','Context available','Rules passed','Approval required'],result:'A complete request reaches the owner for review. The example stops before any customer message.'},
  duplicate: {states:['done','done','hold','skip'],labels:['Duplicate detected','Existing record found','New record blocked','No second handoff'],result:'The existing request is reused. No duplicate contact or second owner handoff is created.'},
  missing: {states:['done','hold','skip','skip'],labels:['Recorded','Information missing','Not evaluated','Waiting for context'],result:'The request stays in an exception queue. A person can supply the missing contact details before it proceeds.'},
  offline: {states:['done','hold','skip','skip'],labels:['Recorded','CRM unavailable','Not evaluated','Owner alerted'],result:'The example holds the request and prepares an owner alert. It does not guess CRM state or write incomplete records.'}
};
document.querySelector('#run-demo')?.addEventListener('click',()=>{const selected=scenarios[document.querySelector('#scenario').value]; if(!selected)return; document.querySelectorAll('.flow-step').forEach((s,i)=>{s.dataset.state=selected.states[i];s.querySelector('span').textContent=selected.labels[i];}); document.querySelector('.lab-result').textContent=selected.result;});
const problems={
handoffs:['An enquiry-to-owner workflow.','Capture an enquiry once, check the required information, assign an owner, and make the next step visible in your CRM.',['One intake and a clear owner','A duplicate check before creating records','A visible queue for exceptions'],'/services/ai-lead-generation'],
onboarding:['A client onboarding checklist that moves.','Connect the signed agreement to the tasks, access requests, and welcome steps your team needs to complete.',['An agreed checklist and completion rules','Reminders tied to the responsible person','A clear place to resolve blocked steps'],'/services/crm-automation'],
reporting:['A report with traceable inputs.','Bring a small set of agreed metrics into one view, with source dates and the gaps made visible.',['Defined metrics and source systems','Scheduled data collection','Checks for missing or stale data'],'/case-studies/business-intelligence'],
knowledge:['A grounded internal assistant.','Help your team find answers in an approved set of documents, with links back to the material behind each answer.',['An approved document collection','Source-linked answers and an uncertainty path','An evaluation set before rollout'],'/services/agentic-workflows']};
document.querySelectorAll('[data-problem]').forEach(b=>b.addEventListener('click',()=>{const p=problems[b.dataset.problem];if(!p)return;document.querySelectorAll('[data-problem]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.querySelector('#finder-title').textContent=p[0];document.querySelector('#finder-copy').textContent=p[1];const list=document.querySelector('#finder-list');list.replaceChildren(...p[2].map(t=>{const li=document.createElement('li');li.textContent=t;return li;}));document.querySelector('#finder-link').href=p[3];}));
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>{reduced=e.matches;if(motion)motion.disabled=reduced;if(reduced){document.body.classList.add('motion-paused');document.querySelectorAll('[data-tilt] img').forEach(i=>{i.style.transform='';i.style.animation='none';});if(motion){motion.textContent='Motion paused';motion.setAttribute('aria-pressed','true');}}});
function filterPages(){
  const term=(document.querySelector('#page-search')?.value||'').trim().toLowerCase();const category=document.querySelector('#page-category')?.value||'';let count=0;
  document.querySelectorAll('.directory-card').forEach(card=>{card.hidden=!(card.dataset.search.includes(term)&&(!category||card.dataset.category===category));if(!card.hidden)count++;});
  const status=document.querySelector('#page-count');if(status)status.textContent=`${count} ${count===1?'page':'pages'}`;const empty=document.querySelector('#no-results');if(empty)empty.hidden=count!==0;
}
document.querySelector('#page-search')?.addEventListener('input',filterPages);document.querySelector('#page-category')?.addEventListener('change',filterPages);
document.querySelector('#brief-fields')?.removeAttribute('disabled');
document.querySelector('#brief-form')?.addEventListener('submit',e=>{
  e.preventDefault();const form=e.currentTarget;if(!form.reportValidity())return;const data=new FormData(form);
  const value=(key,max)=>String(data.get(key)||'').trim().slice(0,max);
  const name=value('name',100),email=value('email',200),interest=value('interest',100),tools=value('tools',300),problem=value('problem',2500);
  if(!name||!email||problem.length<15){document.querySelector('#brief-status').textContent='Please add your name, email, and a little more detail about the work.';return;}
  const body=`Name: ${name}\nReply email: ${email}\nInterest: ${interest}\nCurrent tools: ${tools||'To discuss'}\n\nThe useful change:\n${problem}`;
  const url='mailto:ahmadbukhari4245@gmail.com?subject='+encodeURIComponent('Website conversation: '+interest)+'&body='+encodeURIComponent(body);
  document.querySelector('#brief-copy').value=body;document.querySelector('#brief-fallback').hidden=false;document.querySelector('#brief-status').textContent='Your draft is ready below. If your email app opens, review it before sending.';
  window.location.href=url;
});
