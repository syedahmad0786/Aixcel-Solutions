export interface CaseStudy {
  slug: string;
  title: string;
  industry: string;
  challenge: string;
  solution: string;
  results: { metric: string; value: string; description: string }[];
  tags: string[];
  featured: boolean;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "crm-automation-real-estate",
    title: "94% Reduction in CRM Data Errors for Real Estate Firm",
    industry: "Real Estate",
    challenge: "A growing real estate firm was losing deals due to inconsistent CRM data — duplicate entries, missing follow-ups, and leads falling through the cracks.",
    solution: "Built an end-to-end automation system connecting their CRM, email, calendar, and property management tools with intelligent deduplication and automated follow-up sequences.",
    results: [
      { metric: "Error Reduction", value: "94%", description: "CRM data errors virtually eliminated" },
      { metric: "Response Time", value: "< 2 min", description: "Average lead response time" },
      { metric: "Revenue Impact", value: "+35%", description: "Increase in closed deals within 90 days" },
    ],
    tags: ["CRM", "Automation", "HubSpot", "n8n"],
    featured: true,
  },
  {
    slug: "voice-ai-healthcare",
    title: "3x Qualified Appointments with Voice AI for Healthcare",
    industry: "Healthcare",
    challenge: "A multi-location healthcare provider was missing calls, losing patients to competitors, and spending $15K/month on a call center that couldn't scale.",
    solution: "Deployed a Voice AI agent handling inbound calls 24/7 — qualifying patients, booking appointments, answering FAQs, and integrating directly with their EHR system.",
    results: [
      { metric: "Appointments", value: "3x", description: "Qualified appointment bookings" },
      { metric: "Cost Savings", value: "$12K/mo", description: "Reduction in call center spend" },
      { metric: "Availability", value: "24/7", description: "Never miss a patient call" },
    ],
    tags: ["Voice AI", "Healthcare", "GoHighLevel"],
    featured: true,
  },
  {
    slug: "content-automation-saas",
    title: "10x Content Output for SaaS Company",
    industry: "SaaS",
    challenge: "A B2B SaaS company with 2 marketers needed to produce content at the rate of a 10-person team to compete in their space.",
    solution: "Built an AI-powered content pipeline that repurposes webinars into blog posts, social content, email sequences, and sales collateral — all matching their brand voice.",
    results: [
      { metric: "Content Output", value: "10x", description: "Increase without additional headcount" },
      { metric: "Time Savings", value: "25 hrs/wk", description: "Marketing team time reclaimed" },
      { metric: "Engagement", value: "+150%", description: "Social media engagement increase" },
    ],
    tags: ["Content AI", "Automation", "Marketing"],
    featured: true,
  },
];
