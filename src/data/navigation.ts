export const navigation = {
  main: [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Pricing", href: "/pricing" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  services: [
    { label: "Agentic AI & Autonomous Workflows", href: "/services/agentic-ai", description: "Self-operating AI agents that handle complex business processes end-to-end." },
    { label: "Voice AI & Conversational Intelligence", href: "/services/voice-ai", description: "Sub-500ms voice agents for appointments, support, and qualification." },
    { label: "Process Automation & Integration", href: "/services/process-automation", description: "Connect your entire tech stack with intelligent automation workflows." },
    { label: "Content Operations & Automation", href: "/services/content-operations", description: "10x your content output with AI-powered creation pipelines." },
    { label: "Custom Development & Technical Solutions", href: "/services/custom-development", description: "Bespoke AI applications and integrations built for your use case." },
    { label: "AI Strategy & Consulting", href: "/services/ai-strategy", description: "Fractional Chief AI Officer services and automation roadmapping." },
  ],
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/bukhariahmad", icon: "linkedin" },
    { label: "Email", href: "mailto:ahmadbukhari4245@gmail.com", icon: "mail" },
  ],
} as const;
