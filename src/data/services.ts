export interface Service {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  longDescription: string;
  icon: string;
  features: string[];
  process: { step: number; title: string; description: string }[];
  metrics: { value: string; label: string }[];
}

export const services: Service[] = [
  {
    slug: "agentic-ai",
    title: "Agentic AI & Autonomous Workflows",
    shortTitle: "Agentic AI",
    description: "Self-operating AI agents that handle complex business processes end-to-end — from lead qualification to customer onboarding.",
    longDescription: "We build production-grade AI agent systems that don't just assist — they execute. These autonomous workflows handle multi-step business processes with decision-making capabilities, learning from outcomes to improve over time. Not experiments. Not demos. Real systems handling real work.",
    icon: "brain",
    features: [
      "Multi-agent orchestration systems",
      "Autonomous decision-making with guardrails",
      "Self-improving feedback loops",
      "Enterprise-grade error handling & recovery",
      "Real-time monitoring dashboards",
      "Custom tool & API integration",
    ],
    process: [
      { step: 1, title: "Process Audit", description: "Map every manual step, decision point, and exception in your current workflow." },
      { step: 2, title: "Agent Architecture", description: "Design the agent system with clear boundaries, tools, and safety guardrails." },
      { step: 3, title: "Build & Test", description: "Develop the agents, test against edge cases, and validate with real data." },
      { step: 4, title: "Deploy & Monitor", description: "Launch with real-time monitoring and iterate based on production performance." },
    ],
    metrics: [
      { value: "70%", label: "Reduction in manual tasks" },
      { value: "40%", label: "Increase in lead conversions" },
      { value: "24/7", label: "Autonomous operation" },
    ],
  },
  {
    slug: "voice-ai",
    title: "Voice AI & Conversational Intelligence",
    shortTitle: "Voice AI",
    description: "Human-like voice agents that qualify leads, book appointments, and handle support calls with sub-500ms latency.",
    longDescription: "Our voice AI systems don't sound like robots reading scripts. They understand context, handle objections, and adapt in real-time. Built for high-stakes conversations — sales qualification, appointment booking, customer support — where every second of latency costs you money.",
    icon: "mic",
    features: [
      "Sub-500ms response latency",
      "Natural language understanding & generation",
      "Real-time sentiment analysis",
      "CRM integration & automatic logging",
      "Custom voice & personality design",
      "Multi-language support",
    ],
    process: [
      { step: 1, title: "Conversation Design", description: "Map ideal conversation flows, objection handling, and success criteria." },
      { step: 2, title: "Voice Architecture", description: "Select voice models, optimize for latency, and build the conversation engine." },
      { step: 3, title: "Training & Testing", description: "Train on your data, test with real scenarios, and refine the experience." },
      { step: 4, title: "Launch & Optimize", description: "Deploy to production, monitor conversations, and continuously improve." },
    ],
    metrics: [
      { value: "3x", label: "Qualified appointments" },
      { value: "<500ms", label: "Response latency" },
      { value: "94%", label: "Caller satisfaction" },
    ],
  },
  {
    slug: "process-automation",
    title: "Process Automation & Integration",
    shortTitle: "Process Automation",
    description: "Connect your entire tech stack and eliminate manual data entry with intelligent automation workflows.",
    longDescription: "We architect automation systems that connect every tool in your stack — CRM, email, scheduling, invoicing, project management — into a single, intelligent workflow. No more copy-pasting between tabs. No more 'I forgot to update the spreadsheet.' Everything flows automatically with built-in error handling.",
    icon: "workflow",
    features: [
      "200+ app integrations (n8n, Make, Zapier)",
      "CRM automation (Salesforce, HubSpot, GHL)",
      "Custom API development",
      "Data transformation & enrichment",
      "Error handling & automatic recovery",
      "Real-time monitoring & alerts",
    ],
    process: [
      { step: 1, title: "Stack Audit", description: "Document every tool, data flow, and manual touchpoint in your current setup." },
      { step: 2, title: "Workflow Design", description: "Architect the automation blueprint with fallbacks and edge case handling." },
      { step: 3, title: "Build & Connect", description: "Build workflows, connect APIs, and implement data transformations." },
      { step: 4, title: "Test & Deploy", description: "End-to-end testing with your real data, then deploy with monitoring." },
    ],
    metrics: [
      { value: "94%", label: "Reduction in data errors" },
      { value: "30+", label: "Hours saved per week" },
      { value: "200+", label: "Workflows deployed" },
    ],
  },
  {
    slug: "content-operations",
    title: "Content Operations & Automation",
    shortTitle: "Content Ops",
    description: "10x your content output without hiring — AI-powered creation, repurposing, and distribution pipelines.",
    longDescription: "Content shouldn't be a bottleneck. We build automated pipelines that take a single piece of content and transform it into dozens — blog posts become social threads, podcasts become articles, videos become clips. All on-brand, all on-schedule, all without additional headcount.",
    icon: "pen-tool",
    features: [
      "AI content generation with brand voice",
      "Multi-format repurposing pipelines",
      "Automated social media scheduling",
      "SEO optimization & keyword research",
      "Content calendar automation",
      "Performance tracking & analytics",
    ],
    process: [
      { step: 1, title: "Content Audit", description: "Analyze your existing content, brand voice, and distribution channels." },
      { step: 2, title: "Pipeline Design", description: "Design the content workflow from creation to distribution to analytics." },
      { step: 3, title: "Build & Train", description: "Build the pipeline, train AI on your brand voice, and create templates." },
      { step: 4, title: "Launch & Scale", description: "Start producing, measure performance, and scale what works." },
    ],
    metrics: [
      { value: "10x", label: "Content output" },
      { value: "0", label: "Additional headcount" },
      { value: "60%", label: "Time saved on content" },
    ],
  },
  {
    slug: "custom-development",
    title: "Custom Development & Technical Solutions",
    shortTitle: "Custom Dev",
    description: "Bespoke AI applications, internal tools, and technical integrations built specifically for your use case.",
    longDescription: "When off-the-shelf tools don't cut it, we build custom. From internal dashboards and admin panels to AI-powered applications and complex integrations — we develop the technical solutions that give you a competitive edge. Production-grade code, not prototypes.",
    icon: "code",
    features: [
      "Custom AI application development",
      "Internal tool & dashboard creation",
      "API development & integration",
      "Database design & optimization",
      "Cloud infrastructure setup",
      "Technical documentation & training",
    ],
    process: [
      { step: 1, title: "Requirements", description: "Define the problem, success criteria, and technical constraints." },
      { step: 2, title: "Architecture", description: "Design the system architecture, data models, and integration points." },
      { step: 3, title: "Development", description: "Build in sprints with regular demos and feedback loops." },
      { step: 4, title: "Deployment", description: "Launch, document, and train your team on the new system." },
    ],
    metrics: [
      { value: "50+", label: "Custom solutions built" },
      { value: "2-4 wk", label: "Average delivery time" },
      { value: "99.9%", label: "Uptime SLA" },
    ],
  },
  {
    slug: "ai-strategy",
    title: "AI Strategy & Consulting",
    shortTitle: "AI Strategy",
    description: "Fractional Chief AI Officer services — strategy, roadmapping, and team training for AI adoption.",
    longDescription: "Not every company needs to build. Some need to think first. As your fractional Chief AI Officer, I help you identify where AI creates the most value, build the adoption roadmap, evaluate vendors, and train your team. Strategy with a 90-day payoff target — not a 12-month consulting engagement.",
    icon: "compass",
    features: [
      "AI readiness assessment",
      "Automation opportunity mapping",
      "Vendor evaluation & selection",
      "ROI modeling & business case development",
      "Team training & upskilling",
      "Implementation roadmap with 90-day milestones",
    ],
    process: [
      { step: 1, title: "Assessment", description: "Evaluate your current operations, tech stack, and AI readiness." },
      { step: 2, title: "Strategy", description: "Build the AI roadmap with prioritized opportunities and ROI projections." },
      { step: 3, title: "Execution Plan", description: "Create detailed implementation plans with 90-day milestone targets." },
      { step: 4, title: "Support", description: "Ongoing advisory as you execute — course corrections, vendor reviews, team coaching." },
    ],
    metrics: [
      { value: "90-day", label: "Payoff targets" },
      { value: "12", label: "Industries served" },
      { value: "50+", label: "Clients advised" },
    ],
  },
];
