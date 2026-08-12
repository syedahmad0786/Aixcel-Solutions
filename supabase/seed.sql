-- Approved public Systems Desk corpus.
-- The content values below match the Markdown bodies in ../knowledge exactly.
INSERT INTO public.knowledge_documents (
  slug,
  title,
  canonical_url,
  source_type,
  status,
  tags,
  content
)
VALUES
  (
    'case-automation-migration',
    'Make-to-n8n Automation Migration Case Study',
    'https://aixcelsolutions.com/case-studies/automation-migration',
    'case_study',
    'approved',
    ARRAY['aixcel', 'case-study', 'automation-migration', 'n8n', 'architecture']::text[],
    $knowledge$
# Make-to-n8n Automation Migration Case Study

This documented project scope addressed the risk of rebuilding a large Make scenario estate one workflow at a time. A direct copy could repeat logic, create inconsistent quality, weaken traceability, and multiply the testing burden.

The migration-factory architecture inventoried the candidates, grouped them into reusable workflow families, defined target n8n patterns and shared services, established behaviour-parity requirements, and added QA gates, exception handling, and a controlled migration sequence.

The documented scope covered 108 automation migration candidates and established a governable route to implementation.

The number `108` refers only to candidates inventoried in the documented project scope. It does not mean 108 production migrations were completed, released, or proven to deliver a business outcome. The source is documented scope and architecture, not a measured client outcome or performance guarantee.
$knowledge$
  ),
  (
    'case-business-intelligence',
    'Business Intelligence Automation Case Study',
    'https://aixcelsolutions.com/case-studies/business-intelligence',
    'case_study',
    'approved',
    ARRAY['aixcel', 'case-study', 'business-intelligence', 'reporting', 'anonymized']::text[],
    $knowledge$
# Business Intelligence Automation Case Study

This anonymized engagement addressed performance data spread across many channels, formats, and refresh cycles. The operating team spent time assembling repeated views and could not depend on one current reporting path.

Aixcel connected source APIs to n8n, structured the data in Airtable, presented the operating view through Looker Studio, and scheduled concise Slack updates. The delivered pipeline collected and normalized channel data into an auditable structure so the team did not have to rebuild the same report each cycle.

The published internal project record says the pipeline unified more than 15 channels into one operational reporting path.

The `15+` figure describes integrated channel coverage for one anonymized engagement. It is a scope and integration count, not a claim about revenue, profitability, performance improvement, or a guaranteed result. Channel and client identifiers are withheld, and the evidence source is labelled as an anonymized internal project record.
$knowledge$
  ),
  (
    'case-lead-operations',
    'Lead Operations System Case Study',
    'https://aixcelsolutions.com/case-studies/lead-operations',
    'case_study',
    'approved',
    ARRAY['aixcel', 'case-study', 'lead-operations', 'crm', 'anonymized']::text[],
    $knowledge$
# Lead Operations System Case Study

This anonymized engagement addressed a fragmented dialer operation in which lead records were distributed across lists and systems, booked contacts could remain eligible for outreach, activity was difficult to reconcile, and managers lacked one dependable daily view.

Aixcel designed a governed operating flow for list membership, lead selection, dialer activity, CRM updates, booking removal, retries, exceptions, and scheduled Slack reporting. The purpose was to let operators act from one controlled process instead of manually reconciling disconnected tools.

The published internal project record reports more than 180 accounts recovered into the governed flow and a 39.6% unique dial rate for the measured outbound system.

These figures describe one anonymized engagement. They are not a forecast, universal benchmark, revenue claim, conversion claim, or guarantee of future performance. The client identity and commercially sensitive details are intentionally withheld. The evidence source is labelled as an anonymized internal project record rather than independent third-party validation.
$knowledge$
  ),
  (
    'service-ai-search-visibility',
    'AI Search Visibility - AIEO, AEO, and GEO',
    'https://aixcelsolutions.com/services/ai-search-visibility',
    'service',
    'approved',
    ARRAY['aixcel', 'service', 'aieo', 'aeo', 'geo', 'ai-search']::text[],
    $knowledge$
# AI Search Visibility - AIEO, AEO, and GEO

AiXCEL uses AIEO as the operating umbrella for improving how an established service business is retrieved, understood, cited, and connected to a buyer action across AI-assisted search. AEO focuses on clear, directly supported answers. GEO focuses on the entity context, evidence, and independent corroboration generative engines may use. Both depend on sound technical search foundations rather than replacing SEO.

The public starting offer is the AI Visibility Baseline. It records a fixed and dated buyer-prompt set, observed brand and competitor inclusion, answer accuracy, cited sources, relevant owned-page access, entity consistency, and attribution readiness. The baseline preserves engine, date, conditions, sources, and limitations. It is not a universal rank or permanent visibility score.

When the evidence supports implementation, AiXCEL can deliver one bounded Visibility Foundation slice covering the highest-value technical access, entity, content, corroboration, or conversion gap. Managed Monitoring and Content Operations is available only after the foundation and measurement path are clear.

AiXCEL does not guarantee that ChatGPT, Google, Perplexity, or another external answer engine will rank, cite, recommend, or send traffic to a business. It does not claim special AI-only schema, manufacture reviews or citations, or convert an academic benchmark into a client performance promise. Success is measured through separate evidence states: observed representation, citations, identifiable referrals, consented leads, qualified bookings, opportunities, and wins.
$knowledge$
  ),
  (
    'solution-ai-operations-workspace',
    'AiXCEL Operations Workspace - Private Pilot',
    'https://aixcelsolutions.com/solutions/ai-operations-workspace',
    'service',
    'approved',
    ARRAY['aixcel', 'private-pilot', 'qm', 'operations-workspace', 'approval']::text[],
    $knowledge$
# AiXCEL Operations Workspace - Private Pilot

AiXCEL Operations Workspace is a private-pilot architecture for governed AI execution. QM is positioned as a scoped execution workspace for bounded agents, schedules, working state, and artifacts. It is not presented as the CRM database, identity provider, approval authority, credential store, permanent business-record system, or an already-launched customer cloud.

The proposed operating chain is identity, permitted capability, exact action preview, policy check, named human approval, execution, verification, and an inspectable receipt. CRM, projects, files, communication, finance, and other permanent records remain in the client-owned systems responsible for them.

Customer tenancy, client portal access, provider credentials, cloud access, billing, and production acceptance are outside the current website release. They require a separate security, architecture, implementation, and acceptance project before AiXCEL can represent them as available.
$knowledge$
  ),
  (
    'company-and-systems-audit',
    'Aixcel Solutions and the Systems Audit',
    'https://aixcelsolutions.com/',
    'company',
    'approved',
    ARRAY['aixcel', 'company', 'founder-led', 'systems-audit']::text[],
    $knowledge$
# Aixcel Solutions and the Systems Audit

AiXCEL Solutions is a founder-led AI Search Visibility and automation company created by Ahmad Bukhari in Islamabad, Pakistan, and serving clients worldwide. AI Search Visibility - AIEO, AEO, and GEO - is the primary public entry point. Lead operations, CRM automation, voice AI, agentic workflows, integration architecture, and operational reliability remain available as connected services.

The work begins with a business constraint rather than a preferred tool. Aixcel maps the current process, data, decisions, actions, owners, exceptions, and success criteria; ships the highest-leverage path in working slices; tests real and failure scenarios; and hands over logs, alerts, documentation, permissions, and operating procedures.

The primary starting offer is the AI Visibility Baseline: a dated, evidence-preserving review of buyer questions, observed AI answer representation and citations, relevant technical and entity conditions, and lead-attribution readiness. A 25-minute mapping session remains available for qualified requests through Ahmad Bukhari's verified Cal.com event: https://cal.com/ahmad-bukhari/revenue-handoff-map.

The baseline and mapping session are focused diagnoses, not promises of search placement, citations, savings, revenue, implementation, delivery time, or technical fit. A proposal requires enough information about the public evidence, process, systems, data, permissions, risks, and accountable owners.
$knowledge$
  ),
  (
    'evidence-and-privacy-boundaries',
    'Evidence, Privacy, and Answer Boundaries',
    'https://aixcelsolutions.com/case-studies',
    'policy',
    'approved',
    ARRAY['aixcel', 'evidence', 'privacy', 'consent', 'answer-policy']::text[],
    $knowledge$
# Evidence, Privacy, and Answer Boundaries

Systems Desk answers must stay inside the approved public corpus. If the corpus does not establish a fact, the answer should say that the detail needs confirmation from Ahmad Bukhari rather than infer or invent it.

Published case studies distinguish anonymized internal project records, documented scope, measured outcomes, and interpretation limits. Keep `180+ accounts recovered` and `39.6% unique dial rate` adjacent to the fact that they come from one anonymized engagement and are not forecasts or guarantees. Treat `15+ channels` as integrated coverage, not revenue or performance. Treat `108 migration candidates` as inventory, not completed migrations.

Do not invent prices, delivery timelines, savings, ROI, response lift, booked calls, client identities, client logos, testimonials, certifications, compliance conclusions, or guarantees. Do not imply permission to name an anonymized client. Past evidence can support a conversation or evaluation; it cannot promise another business the same result.

Context is not consent. Access to private information does not authorize disclosure or action. Ask for the minimum necessary context, do not request secrets or sensitive client data in public chat, and require a clear human decision before consequential external actions. Legal, privacy, security, medical, financial, employment, and sector-specific decisions require qualified review for the relevant jurisdiction and use case.

Systems Desk may explain approved services, public evidence, and operating principles and may route a visitor to the systems audit. It must not commit Aixcel to scope, price, availability, integrations, legal suitability, or an implementation plan.
$knowledge$
  ),
  (
    'insight-claude-opus-5-controls',
    'Fixed Controls for Model Upgrades',
    'https://aixcelsolutions.com/insights/claude-opus-5-model-upgrade-workflow-controls',
    'insight',
    'approved',
    ARRAY['aixcel', 'insight', 'model-evaluation', 'change-control', 'human-approval']::text[],
    $knowledge$
# Fixed Controls for Model Upgrades

A stronger model can improve a workflow's interpretation or decision step, but it should not silently change permissions, approval gates, stop conditions, or required evidence. Treat a model switch as a controlled production change.

Keep the task set, tool permissions, acceptance criteria, approval rules, logging, and baseline stable while comparing the candidate model. Measure quality together with cost, latency, review effort, tool behavior, refusals, and failure impact. Route work to the new model only where representative evaluations show a material gain for the actual workflow.

Availability, vendor benchmarks, and capability descriptions do not prove that an existing workflow will remain safe, reliable, or economical after a switch. Capability is not authority, and a model upgrade is not a universal performance, safety, or ROI claim.
$knowledge$
  ),
  (
    'insight-context-is-not-consent',
    'Context Is Not Consent',
    'https://aixcelsolutions.com/insights/context-is-not-consent-ai-private-data',
    'insight',
    'approved',
    ARRAY['aixcel', 'insight', 'consent', 'privacy', 'permissions']::text[],
    $knowledge$
# Context Is Not Consent

Connecting an AI system to private data gives it context; it does not automatically give it authority to change, disclose, spend, send, or decide. Every connection should define what data the system may see, what action it may take, when it must ask again, how access is withdrawn, and who can inspect what happened.

The article proposes a five-step permission loop: Connect, Context, Boundary, Confirm, and Revoke. A safe starting point is read access plus one reversible, policy-bounded action. External, irreversible, sensitive, or financially consequential actions should require a fresh confirmation that names the object, outcome, and destination.

The article draws an operating lesson from a consumer-health product announcement. It does not assess that product's medical, legal, security, privacy, compliance, or regulatory suitability, and it does not replace qualified review for a specific business and jurisdiction.
$knowledge$
  ),
  (
    'insight-evidence-levels',
    'Match Evidence Weight to the AI Decision',
    'https://aixcelsolutions.com/insights/sourceevidencebeforeaidecision',
    'insight',
    'approved',
    ARRAY['aixcel', 'insight', 'evidence', 'ai-governance', 'decision-making']::text[],
    $knowledge$
# Match Evidence Weight to the AI Decision

A correct source does not automatically support a broad decision. Evidence must match the people, workflow, data, conditions, comparison, metric, and period behind the claim.

The article uses five evidence levels. An announcement supports watching. Documentation supports designing. A controlled test supports a bounded pilot. A production record supports operation within an approved boundary. A measured business outcome can support expansion while its comparison, period, sample, and limitations remain visible.

Before acting, write the exact claim, classify its evidence, link the primary source where available, record the context and limitations, name the smallest proportionate action, identify the decision owner, and set a review date. AI can organize evidence and identify gaps, but a person owns the claim, relevance, acceptance rule, permitted decision, and residual risk.

The five-level ladder is Ahmad Bukhari's operating synthesis informed by primary assurance guidance. It is not a NIST requirement, certification, or legal advice.
$knowledge$
  ),
  (
    'insight-incident-explanation',
    'Let the LLM Explain the Incident, Not Declare It',
    'https://aixcelsolutions.com/insights/deterministicincidentdetectionbeforellmexplanation',
    'insight',
    'approved',
    ARRAY['aixcel', 'insight', 'incident-management', 'observability', 'llm-boundaries']::text[],
    $knowledge$
# Let the LLM Explain the Incident, Not Declare It

Incident declaration and incident explanation are different jobs. Because an alert interrupts work and can trigger customer response or recovery, the declaring condition should remain visible, reproducible, and owned.

Execution records provide the signal. Explicit rules decide whether a documented condition is met. The language model receives the resulting evidence and explains the likely cause or next useful check. A named operator chooses the response, and the system records the incident, explanation, decision, and threshold changes.

Every trigger should expose its data source, condition, threshold, time window, sample size, severity, and owner. Thresholds are operating assumptions that require a real baseline and noise review. The FlowSentry example proves a local implementation path with seeded fixture data; it does not prove production precision, reliability, customer impact, or reduced recovery time.
$knowledge$
  ),
  (
    'insight-test-the-judge',
    'Test the Judge Before You Trust the Score',
    'https://aixcelsolutions.com/insights/supportagentevaluationbeforelaunch',
    'insight',
    'approved',
    ARRAY['aixcel', 'insight', 'evaluation', 'support-agents', 'release-gates']::text[],
    $knowledge$
# Test the Judge Before You Trust the Score

An automated evaluator can give an AI support agent a passing score while misunderstanding the customer outcome, policy, account state, tool action, or required escalation. Calibrate the evaluator before it influences a release decision.

Domain experts should label representative and costly cases independently, resolve disagreements in the operating rule, and create an explicit rubric and reference set. Measure outcome correctness, policy compliance, tool correctness, escalation quality, and interaction quality rather than fluency alone. Track false passes as carefully as false failures.

Use separate gates for evaluator quality, agent quality, and live operational performance. Keep policy exceptions, consequential account changes, and release ownership with named people. Research figures discussed in the article are reported results, not universal benchmarks for another evaluator or support operation.
$knowledge$
  ),
  (
    'insight-voice-draft-attribution',
    'Give a Voice Draft Attribution Before CRM Commit',
    'https://aixcelsolutions.com/insights/voicedraftattributionbeforecrm',
    'insight',
    'approved',
    ARRAY['aixcel', 'insight', 'voice-dictation', 'crm', 'attribution']::text[],
    $knowledge$
# Give a Voice Draft Attribution Before CRM Commit

Transcription accuracy and record accuracy are different. A clean transcript can flatten observation, report, inference, and commitment into equally confident prose while losing who said what and what still needs verification.

Dictate into a temporary draft. Label each consequential statement as observed, reported, inferred, or promised. Then verify the contact, target record, names, amounts, units, currency, dates, source, confidence, and commitment owner before a person commits the note to shared CRM memory. Any outbound follow-up remains a separate approved action.

Dictation, context, storage, clipboard recovery, and record-history features do not prove CRM accuracy, productivity improvement, organizational permission, legal compliance, or a production result. Transcription and attribution can both be wrong, so consent, privacy configuration, retention, factual review, target selection, and correction ownership remain human responsibilities.
$knowledge$
  ),
  (
    'service-agentic-workflows',
    'Agentic Workflow Automation',
    'https://aixcelsolutions.com/services/agentic-workflows',
    'service',
    'approved',
    ARRAY['aixcel', 'service', 'agentic-workflows', 'n8n', 'human-approval']::text[],
    $knowledge$
# Agentic Workflow Automation

Aixcel builds agentic workflows that interpret variable context and select from bounded tools or actions. Deterministic rules, permissions, human approvals, logs, tests, and recovery paths remain the control plane around the model.

The work begins by mapping inputs, decisions, actions, state, tools, permissions, owners, service levels, and exception paths. Models are used where interpretation adds value; deterministic logic is used where certainty, cost, or policy matters more. Integrations may use n8n, Make, APIs, webhooks, databases, files, messaging systems, CRMs, or internal tools when they fit the operating need.

Production controls can include validation, idempotency, retry policy, dead-letter handling, alerts, logs, correlation IDs, replay procedures, cost and latency measurement, model and tool failure tests, and documented handover. Consequential actions should pause for a person who receives the relevant evidence and context.

This service is a strong fit for recurring multi-step work with a reliable source of truth, known action set, measurable outcome, and accountable owner. It is not a fit for unrestricted autonomy over high-impact actions or for processes whose ownership, data, and success conditions remain undefined.
$knowledge$
  ),
  (
    'service-ai-lead-generation',
    'AI Lead Generation and Appointment Setting',
    'https://aixcelsolutions.com/services/ai-lead-generation',
    'service',
    'approved',
    ARRAY['aixcel', 'service', 'lead-generation', 'appointment-setting', 'crm']::text[],
    $knowledge$
# AI Lead Generation and Appointment Setting

Aixcel designs controlled lead and appointment workflows that connect capture, qualification, follow-up, routing, calendar booking, and CRM state. Sources can include web forms, calls, campaigns, referrals, social enquiries, and approved imports.

The system can gather fit, urgency, need, and routing context; trigger relevant email, SMS, or voice follow-up where consent and channel rules permit; offer the correct calendar; prevent duplicate bookings; update lifecycle stages; notify the responsible person; and expose funnel and exception data.

This service is a strong fit when meaningful enquiry volume makes response speed, contactability, qualification, booking, or follow-up consistency operationally important. A team must still define qualification, ownership, scheduling, escalation, suppression, and human handoff rules.

Success should be measured with agreed operational and business outcomes such as first-response time, contact rate, qualified-booking rate, attendance, pipeline progression, opt-outs, human takeover, exceptions, and attributable revenue. Message volume alone is not proof of value. Aixcel does not promise that AI will create demand, replace human sales judgment, or make unsupervised bulk outreach appropriate.
$knowledge$
  ),
  (
    'service-crm-automation',
    'CRM Automation and Revenue Operations',
    'https://aixcelsolutions.com/services/crm-automation',
    'service',
    'approved',
    ARRAY['aixcel', 'service', 'crm', 'revenue-operations', 'data-quality']::text[],
    $knowledge$
# CRM Automation and Revenue Operations

Aixcel architects CRM automation around the way revenue actually moves. The work can cover lifecycle stages, entry and exit criteria, ownership, required fields, tasks, routing, nurture, escalation, appointments, proposals, attribution, reporting, and sales-to-delivery handoffs.

Data controls can normalize fields, prevent duplicates, validate critical inputs, identify stale records, and preserve an audit trail. Alerts are designed to give the responsible person useful context, a clear next action, and a route back to the source record. Aixcel commonly works with GoHighLevel and HubSpot and can integrate other platforms when appropriate APIs, webhooks, exports, and permissions are available.

This service is a strong fit when teams rely on memory or workarounds because CRM state does not match the actual customer journey. A repair may be preferable to replacement when the platform is capable but lifecycle design, data, permissions, automations, or reporting are weak.

Automation should wait when nobody owns the definitions or the underlying process has not been agreed and tested. Handover should include logs, exception handling, permissions, documentation, training, and the measures operators use to inspect performance. A CRM record is shared business memory, so consequential changes require clear provenance and ownership.
$knowledge$
  ),
  (
    'service-voice-ai',
    'Voice AI Implementation',
    'https://aixcelsolutions.com/services/voice-ai',
    'service',
    'approved',
    ARRAY['aixcel', 'service', 'voice-ai', 'human-handoff', 'consent']::text[],
    $knowledge$
# Voice AI Implementation

Aixcel builds voice AI agents for clearly defined inbound and approved outbound call jobs. A production design combines the speech interface with approved knowledge, business rules, CRM and calendar actions, call-state tracking, monitoring, and human handoff.

The work can include conversation goals, approved statements, questions, branches, interruptions, fallbacks, disclosure, scheduling, disposition, structured outcomes, notifications, and escalation triggers. Evaluation covers representative accents, noise, interruptions, edge cases, tool failures, unsupported requests, prompt injection, policy adherence, latency, and transfer success.

Voice AI is a strong fit for repeatable enquiries, appointment coordination, qualification, reminders, reactivation, or overflow when outcomes and stop conditions can be defined. Important moments must retain a human owner. The system should transfer or create a callback task when confidence, sentiment, policy, or commercial importance requires judgment.

The client remains responsible for legal approval. Jurisdiction, purpose, disclosure, consent, recording policy, calling hours, suppression lists, retention, and access rules must be approved before launch. Aixcel does not support deception, impersonation, pressure, unsupported claims, or autonomous high-stakes decisions that require licensed or accountable human judgment.
$knowledge$
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  canonical_url = EXCLUDED.canonical_url,
  source_type = EXCLUDED.source_type,
  status = EXCLUDED.status,
  tags = EXCLUDED.tags,
  content = EXCLUDED.content;
