"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeUp, { Arrow } from "@/components/FadeUp";

/* ─────────────── DATA ─────────────── */
const stats = [
  { value: "97%", label: "Client Retention" },
  { value: "240%", label: "Average ROI" },
  { value: "500+", label: "Hours Saved / Mo" },
  { value: "55+", label: "Countries Served" },
];

const industries = [
  "Financial Services",
  "Private Equity",
  "Wealth Management",
  "Healthcare",
  "Legal & Compliance",
  "SaaS & Technology",
  "Real Estate",
  "Management Consulting",
];

const services = [
  {
    num: "01",
    title: "AI Agents & Autonomous Workflows",
    desc: "Custom-built AI agents that handle document processing, client requests, and data-driven decisions without human intervention.",
    metrics: ["15x Faster", "90% Cost Cut"],
    icon: <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />,
    span: "md:col-span-7",
  },
  {
    num: "02",
    title: "Voice AI & Conversational Intelligence",
    desc: "Enterprise voice systems that understand context, manage complex dialogues, and integrate with your existing infrastructure.",
    metrics: ["98% Accuracy", "40+ Languages"],
    icon: (
      <>
        <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
        <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
      </>
    ),
    span: "md:col-span-5",
  },
  {
    num: "03",
    title: "Data Intelligence & Analytics",
    desc: "Custom dashboards and predictive models that transform raw data into actionable strategic intelligence.",
    metrics: ["240% Avg ROI", "Real-time"],
    icon: <path d="M18 20V10M12 20V4M6 20v-6" />,
    span: "md:col-span-5",
  },
  {
    num: "04",
    title: "Enterprise Automation & Integration",
    desc: "End-to-end workflow automation with n8n, Make, and custom APIs. CRM, finance, and operations unified.",
    metrics: ["500+ Hours Saved", "100+ Integrations"],
    icon: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
    span: "md:col-span-7",
  },
  {
    num: "05",
    title: "AI Consulting & Strategic Advisory",
    desc: "Workflow audits, data flow mapping, and ROI-prioritized automation roadmaps for enterprise transformation.",
    metrics: ["12-wk Roadmap", "Full Audit"],
    icon: <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />,
    span: "md:col-span-6",
  },
  {
    num: "06",
    title: "Custom AI Platforms",
    desc: "Bespoke AI-powered platforms, internal tools, and white-label products architected for your specific workflows.",
    metrics: ["API-first", "Scalable"],
    icon: (
      <>
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </>
    ),
    span: "md:col-span-6",
  },
];

const processSteps = [
  {
    num: "01",
    title: "Discovery",
    desc: "Deep dive into your business — challenges, goals, and systems — to find the highest-impact opportunities.",
  },
  {
    num: "02",
    title: "Strategy",
    desc: "Tailored automation roadmap with clear milestones, prioritized by ROI and implementation complexity.",
  },
  {
    num: "03",
    title: "Build",
    desc: "Rapid development and deployment. We move fast, test rigorously, and deliver results from day one.",
  },
  {
    num: "04",
    title: "Scale",
    desc: "Continuous optimization and expansion of AI capabilities across your entire organization.",
  },
];

const caseStudies = [
  {
    industry: "Financial Services",
    challenge:
      "A mid-size financial advisory firm was losing 40+ hours per week to manual document processing, compliance checks, and client onboarding paperwork.",
    solution:
      "We deployed an autonomous AI pipeline that ingests, classifies, and processes documents end-to-end — extracting data, running compliance checks, and generating client-ready reports.",
    results: [
      { metric: "15x", label: "Faster document processing" },
      { metric: "$480K", label: "Projected annual savings" },
      { metric: "3 weeks", label: "From kickoff to production" },
    ],
  },
  {
    industry: "Private Equity",
    challenge:
      "A PE firm managing 12 portfolio companies had zero visibility across operations — fragmented CRMs, manual reporting, and missed opportunities from slow data.",
    solution:
      "We built a unified intelligence dashboard pulling real-time data from all portfolio companies, with AI-generated insights and anomaly detection.",
    results: [
      { metric: "240%", label: "ROI in first 6 months" },
      { metric: "100%", label: "Portfolio visibility" },
      { metric: "8 hrs/wk", label: "Saved per analyst" },
    ],
  },
  {
    industry: "Enterprise",
    challenge:
      "A growing services company was losing 30% of inbound leads because calls went unanswered outside business hours and during peak times.",
    solution:
      "We deployed a Voice AI system that handles initial calls, qualifies leads, books appointments, and escalates complex requests — operating 24/7 in 12 languages.",
    results: [
      { metric: "80%", label: "Calls handled autonomously" },
      { metric: "40%", label: "Reduction in cost-per-lead" },
      { metric: "98%", label: "Caller satisfaction score" },
    ],
  },
];

const testimonials = [
  {
    quote:
      "Aixcel didn't just automate our workflows — they fundamentally changed how we operate. The ROI was visible within the first month.",
    name: "Managing Director",
    company: "Dubai-based Financial Advisory",
  },
  {
    quote:
      "We evaluated five AI agencies. Aixcel was the only one that understood our compliance requirements and delivered a production-ready system on time.",
    name: "Head of Operations",
    company: "UK Private Equity Firm",
  },
  {
    quote:
      "The voice AI system they built handles 80% of our inbound calls. Our team now focuses on closing deals instead of answering phones.",
    name: "Chief Technology Officer",
    company: "SaaS Growth Company",
  },
];

const techStack = [
  "n8n",
  "Make.com",
  "Zapier",
  "OpenAI",
  "Anthropic",
  "LangChain",
  "HubSpot",
  "Salesforce",
  "Vapi",
  "GoHighLevel",
  "Python",
  "Next.js",
];

/* ─────────────── PAGE ─────────────── */
export default function Home() {
  return (
    <>
      <Navbar />
      <main className="noise">
        {/* ════════════════════ HERO ════════════════════ */}
        <section className="hero-mesh relative pt-44 pb-36 md:pt-56 md:pb-48 lg:pt-64 lg:pb-56 overflow-hidden">
          <div className="glow w-[800px] h-[800px] bg-accent/20 -top-[300px] left-1/2 -translate-x-1/2" />
          <div className="glow w-[500px] h-[500px] bg-[#A78BFA]/12 top-[120px] -right-[150px]" />

          <div className="container relative z-10">
            <FadeUp>
              <div className="section-label">AI Automation Partner</div>
            </FadeUp>

            <FadeUp delay={0.08}>
              <h1 className="text-[clamp(42px,7.5vw,88px)] font-bold leading-[1.02] tracking-[-0.035em] max-w-[900px] mb-10">
                We engineer AI systems that{" "}
                <span className="text-gradient">drive real outcomes</span>
              </h1>
            </FadeUp>

            <FadeUp delay={0.14}>
              <p className="text-text-secondary text-[17px] md:text-[20px] leading-[1.8] max-w-[620px] mb-14">
                Custom AI agents, workflow automation, and intelligent systems
                — built for organizations that move fast and expect measurable
                results. Not theory. Not demos. Production-ready AI.
              </p>
            </FadeUp>

            <FadeUp delay={0.2}>
              <div className="flex flex-wrap items-center gap-5 mb-32">
                <Link href="/contact" className="btn-primary">
                  Schedule a Discovery Call <Arrow />
                </Link>
                <Link href="/services" className="btn-secondary">
                  Explore Our Services <Arrow />
                </Link>
              </div>
            </FadeUp>

            {/* Stats */}
            <FadeUp delay={0.26}>
              <div className="pt-14 border-t border-white/[0.06]">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-10">
                  {stats.map((s) => (
                    <div key={s.label}>
                      <p className="stat-number text-gradient mb-3">
                        {s.value}
                      </p>
                      <p className="text-[12px] font-mono text-text-muted tracking-[0.08em] uppercase">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ════════════════════ TRUST BAR ════════════════════ */}
        <section className="py-16 md:py-20 border-y border-border bg-bg-subtle">
          <div className="container">
            <p className="text-center font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-text-muted mb-10">
              Trusted by teams across industries
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {industries.map((name) => (
                <span
                  key={name}
                  className="font-mono text-[13px] font-medium text-text-muted/50 whitespace-nowrap"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════ SERVICES GRID ════════════════════ */}
        <section className="section-padding">
          <div className="container">
            <FadeUp>
              <div className="section-label">What We Build</div>
            </FadeUp>
            <FadeUp delay={0.06}>
              <h2 className="section-heading max-w-xl">
                End-to-end AI solutions for enterprise
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="section-subtitle section-header-gap">
                From strategic consulting to full-stack deployment — systems
                that transform how your organization operates. Every solution is
                built for production, not a pitch deck.
              </p>
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {services.map((s, i) => (
                <FadeUp key={s.num} delay={0.06 * i} className={`${s.span}`}>
                  <Link
                    href="/services"
                    className="card-glass p-9 md:p-12 block h-full group"
                  >
                    <div className="flex items-start justify-between mb-8">
                      <div className="w-14 h-14 rounded-2xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-center text-text-secondary group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-all duration-400">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-6 h-6"
                        >
                          {s.icon}
                        </svg>
                      </div>
                      <span className="font-mono text-[12px] text-text-muted/40">
                        {s.num}
                      </span>
                    </div>

                    <h3 className="text-[18px] md:text-[20px] font-bold text-text mb-4 leading-snug tracking-[-0.01em]">
                      {s.title}
                    </h3>

                    <p className="text-text-secondary text-[15px] leading-[1.8] mb-8">
                      {s.desc}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {s.metrics.map((m) => (
                        <span key={m} className="metric-badge">
                          {m}
                        </span>
                      ))}
                    </div>

                    <span className="text-[13px] font-medium text-text-muted flex items-center gap-2 group-hover:text-accent group-hover:gap-3 transition-all duration-300">
                      Learn more <Arrow size={12} />
                    </span>
                  </Link>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════ CASE STUDIES ════════════════════ */}
        <section className="section-padding bg-bg-subtle border-y border-border">
          <div className="container">
            <FadeUp>
              <div className="section-label">Proven Results</div>
            </FadeUp>
            <FadeUp delay={0.06}>
              <h2 className="section-heading max-w-xl">
                Real engagements. Real outcomes.
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="section-subtitle section-header-gap">
                Every project we take on is measured by one thing: the impact it
                delivers. Here are three recent engagements that show how we
                work.
              </p>
            </FadeUp>

            <div className="space-y-8">
              {caseStudies.map((cs, i) => (
                <FadeUp key={cs.industry} delay={0.08 * i}>
                  <div className="card-glass overflow-hidden">
                    {/* Industry label bar */}
                    <div className="px-9 md:px-12 py-5 border-b border-white/[0.04] flex items-center gap-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-accent/60" />
                      <span className="font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-accent">
                        {cs.industry}
                      </span>
                    </div>

                    <div className="p-9 md:p-12">
                      <div className="grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 mb-12">
                        <div>
                          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-text-muted mb-4">
                            The Challenge
                          </p>
                          <p className="text-text-secondary text-[15px] leading-[1.85]">
                            {cs.challenge}
                          </p>
                        </div>
                        <div>
                          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-text-muted mb-4">
                            What We Built
                          </p>
                          <p className="text-text-secondary text-[15px] leading-[1.85]">
                            {cs.solution}
                          </p>
                        </div>
                      </div>

                      {/* Results row */}
                      <div className="pt-10 border-t border-white/[0.04]">
                        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-text-muted mb-6">
                          Results
                        </p>
                        <div className="grid grid-cols-3 gap-6">
                          {cs.results.map((r) => (
                            <div key={r.label}>
                              <p className="text-[clamp(28px,4vw,44px)] font-bold tracking-[-0.03em] text-gradient leading-none mb-2">
                                {r.metric}
                              </p>
                              <p className="text-[12px] md:text-[13px] text-text-muted leading-snug">
                                {r.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════ PROCESS ════════════════════ */}
        <section className="section-padding">
          <div className="container">
            <FadeUp>
              <div className="section-label">How We Work</div>
            </FadeUp>
            <FadeUp delay={0.06}>
              <h2 className="section-heading max-w-xl">
                From discovery to production
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="section-subtitle section-header-gap">
                A proven four-step process that takes you from first
                conversation to measurable ROI — quickly and predictably.
              </p>
            </FadeUp>

            <div className="relative">
              <div className="hidden lg:block absolute top-[68px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {processSteps.map((step, i) => (
                  <FadeUp key={step.num} delay={0.1 * i}>
                    <div
                      className={`card-glass p-9 md:p-10 h-full relative ${
                        i % 2 === 1 ? "lg:mt-14" : ""
                      }`}
                    >
                      <div className="flex items-center gap-4 mb-7">
                        <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                          <span className="text-[13px] font-mono font-bold text-accent">
                            {step.num}
                          </span>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-accent/20 to-transparent" />
                      </div>
                      <h3 className="text-[18px] font-bold text-text mb-4">
                        {step.title}
                      </h3>
                      <p className="text-text-secondary text-[15px] leading-[1.8]">
                        {step.desc}
                      </p>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════ TESTIMONIALS ════════════════════ */}
        <section className="section-padding bg-bg-subtle border-y border-border">
          <div className="container">
            <FadeUp>
              <div className="section-label">Client Feedback</div>
            </FadeUp>
            <FadeUp delay={0.06}>
              <h2 className="section-heading max-w-xl section-header-gap">
                What our clients say
              </h2>
            </FadeUp>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <FadeUp key={t.name} delay={0.08 * i}>
                  <div className="card-glass p-9 md:p-11 h-full flex flex-col">
                    <div className="quote-mark mb-4">&ldquo;</div>
                    <p className="text-text-secondary text-[15px] leading-[1.85] mb-10 flex-1">
                      {t.quote}
                    </p>
                    <div className="pt-7 border-t border-white/[0.04]">
                      <p className="text-[14px] font-semibold text-text">
                        {t.name}
                      </p>
                      <p className="text-[12px] text-text-muted mt-1">
                        {t.company}
                      </p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════ TECH STACK ════════════════════ */}
        <section className="py-16 md:py-20 border-b border-border">
          <div className="container mb-8">
            <p className="text-center font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-text-muted">
              Technologies We Work With
            </p>
          </div>
          <div className="marquee-wrapper">
            <div className="marquee-track">
              {[...techStack, ...techStack].map((name, i) => (
                <span
                  key={i}
                  className="font-mono text-[14px] font-medium text-text-muted whitespace-nowrap opacity-35 grayscale hover:opacity-100 hover:grayscale-0 hover:text-accent transition-all duration-500"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════ THE LAB ════════════════════ */}
        <section className="section-padding relative">
          <div className="blueprint-grid absolute inset-0 pointer-events-none" />

          <div className="container relative z-10">
            <FadeUp>
              <div className="section-label">The Lab</div>
            </FadeUp>
            <FadeUp delay={0.06}>
              <h2 className="section-heading max-w-xl">
                We build what we preach
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="section-subtitle section-header-gap">
                Beyond client work, we invest in and build our own AI products
                — proving the same systems we deploy for clients work at scale.
              </p>
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <FadeUp className="md:col-span-7">
                <div className="card-glass p-9 md:p-12 h-full group">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/20 to-[#A78BFA]/20 border border-accent/20 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-mono font-medium uppercase tracking-[0.15em] text-accent">
                      Internal Project
                    </span>
                  </div>
                  <h3 className="text-[24px] font-bold text-text mb-3">
                    Malik Zaid
                  </h3>
                  <p className="text-text-muted text-[13px] italic mb-6">
                    Personal AI Assistant
                  </p>
                  <p className="text-text-secondary text-[15px] leading-[1.85]">
                    Our proprietary AI assistant built to demonstrate what&apos;s
                    possible with autonomous agents. Handles scheduling,
                    research, email triage, and complex multi-step workflows — a
                    live showcase of the technology we deploy for clients.
                  </p>
                </div>
              </FadeUp>
              <FadeUp delay={0.08} className="md:col-span-5">
                <div className="card-glass p-9 md:p-12 h-full group">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#34D399]/20 to-[#6EE7B7]/20 border border-[#34D399]/20 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-[#34D399]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-mono font-medium uppercase tracking-[0.15em] text-[#34D399]">
                      Incubator
                    </span>
                  </div>
                  <h3 className="text-[24px] font-bold text-text mb-3">
                    Fynora.ai
                  </h3>
                  <p className="text-text-muted text-[13px] italic mb-6">
                    AI-Powered Financial Intelligence
                  </p>
                  <p className="text-text-secondary text-[15px] leading-[1.85]">
                    Part of the Aixcel ecosystem — an AI startup we&apos;re
                    incubating that brings intelligent financial analytics and
                    automation to businesses. Proof that we don&apos;t just
                    consult on AI — we ship it.
                  </p>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* ════════════════════ CTA ════════════════════ */}
        <section className="hero-mesh relative py-36 md:py-48 lg:py-56 overflow-hidden border-t border-border">
          <div className="glow w-[700px] h-[700px] bg-accent/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

          <div className="container relative z-10 text-center">
            <FadeUp>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-text-muted mb-8">
                Ready to Get Started?
              </p>
            </FadeUp>
            <FadeUp delay={0.06}>
              <h2 className="text-[clamp(34px,5.5vw,64px)] font-bold tracking-[-0.035em] mb-8 max-w-3xl mx-auto leading-[1.05]">
                Let&apos;s automate your growth
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-text-secondary text-[17px] md:text-[19px] leading-[1.8] max-w-lg mx-auto mb-14">
                Book a free 30-minute discovery call. We&apos;ll analyze your
                workflows and identify the highest-impact automation
                opportunities for your business.
              </p>
            </FadeUp>
            <FadeUp delay={0.14}>
              <div className="flex flex-wrap items-center justify-center gap-5 mb-10">
                <Link href="/contact" className="btn-primary">
                  Schedule a Discovery Call <Arrow />
                </Link>
                <Link href="/services" className="btn-secondary">
                  Explore Services <Arrow />
                </Link>
              </div>
            </FadeUp>
            <FadeUp delay={0.18}>
              <p className="text-text-muted text-[13px]">
                No commitment required. No sales pitch. Just a focused
                conversation about your business.
              </p>
            </FadeUp>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
