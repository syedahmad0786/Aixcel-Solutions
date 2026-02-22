"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ─────────────── ANIMATION WRAPPER ─────────────── */
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Arrow({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

/* ─────────────── DATA ─────────────── */
const stats = [
  { value: "100+", label: "Automations Built" },
  { value: "50+", label: "Happy Clients" },
  { value: "240%", label: "Average ROI" },
  { value: "500+", label: "Hours Saved / Mo" },
];

const techStack = [
  "n8n", "Make.com", "Zapier", "OpenAI", "Anthropic",
  "LangChain", "HubSpot", "Salesforce", "Vapi", "GoHighLevel",
];

const services = [
  {
    num: "01",
    title: "AI Agents & Autonomous Workflows",
    desc: "Custom-built AI agents that handle real business operations — processing documents, managing requests, and making data-driven decisions autonomously.",
    metrics: ["15x Faster", "90% Cost Reduction"],
    icon: <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />,
    span: "md:col-span-7",
  },
  {
    num: "02",
    title: "Voice AI & Conversational Intelligence",
    desc: "Enterprise-grade voice AI that understands context, manages complex dialogues, and integrates with your existing business infrastructure.",
    metrics: ["98% Accuracy", "40+ Languages"],
    icon: <><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" /></>,
    span: "md:col-span-5",
  },
  {
    num: "03",
    title: "Data Intelligence & Analytics",
    desc: "Transform raw data into strategic intelligence with custom dashboards, predictive analytics, and AI-powered insights for confident decisions.",
    metrics: ["240% Avg ROI", "Real-time Sync"],
    icon: <path d="M18 20V10M12 20V4M6 20v-6" />,
    span: "md:col-span-5",
  },
  {
    num: "04",
    title: "Enterprise Automation & Integration",
    desc: "End-to-end automation using n8n, Make, and custom integrations. Unify CRM, finance, and operations into seamless workflows.",
    metrics: ["500+ Hours Saved", "100+ Integrations"],
    icon: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
    span: "md:col-span-7",
  },
  {
    num: "05",
    title: "AI Consulting & Strategy",
    desc: "We audit workflows, map data flows, and uncover bottlenecks. The result: a clear roadmap of what to automate and what delivers ROI.",
    metrics: ["80% Cost Reduction", "12-wk Roadmap"],
    icon: <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />,
    span: "md:col-span-12",
  },
];

const processSteps = [
  { num: "01", title: "Discovery", desc: "Deep dive into your business — challenges, goals, and systems — to find the highest-impact opportunities." },
  { num: "02", title: "Strategy", desc: "Tailored automation roadmap with clear milestones, prioritized by ROI and implementation complexity." },
  { num: "03", title: "Build", desc: "Rapid development and deployment. We move fast, test rigorously, and deliver results from day one." },
  { num: "04", title: "Scale", desc: "Continuous optimization and expansion of AI capabilities across your entire organization." },
];

const results = [
  { metric: "15x", label: "Faster invoice processing" },
  { metric: "$18K", label: "Saved per year in manual labor" },
  { metric: "40%", label: "Operational cost decrease" },
  { metric: "98%", label: "Client satisfaction rate" },
];

const expectedImpact = [
  {
    scenario: "A mid-size firm drowning in 40 hours/week of manual document processing deploys our AI pipeline.",
    outcome: "Documents processed in minutes instead of days. Team redirected to high-value client work.",
    metric: "$500K+ projected savings",
  },
  {
    scenario: "An advisory firm with slow client onboarding implements our end-to-end AI agents.",
    outcome: "Processing time drops by 15x. Teams focus on relationships instead of paperwork.",
    metric: "15x faster processing",
  },
  {
    scenario: "A growing company losing leads due to missed inbound calls deploys our Voice AI system.",
    outcome: "80% of calls handled autonomously with near-perfect accuracy. Costs cut by 40%.",
    metric: "40% cost reduction",
  },
];

/* ─────────────── PAGE ─────────────── */
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* ════════════════════ HERO ════════════════════ */}
        <section className="hero-mesh relative pt-40 pb-32 md:pt-52 md:pb-40 lg:pb-48 overflow-hidden">
          {/* Ambient glow */}
          <div className="glow w-[700px] h-[700px] bg-accent/20 -top-[250px] left-1/2 -translate-x-1/2" />
          <div className="glow w-[400px] h-[400px] bg-[#A78BFA]/15 top-[100px] -right-[100px]" />

          <div className="container relative z-10">
            <FadeUp>
              <div className="section-label">AI Automation Agency</div>
            </FadeUp>

            <FadeUp delay={0.06}>
              <h1 className="text-[clamp(40px,7vw,80px)] font-extrabold leading-[1.02] tracking-[-0.03em] max-w-[840px] mb-8">
                We automate the work that{" "}
                <span className="text-gradient">slows your business</span> down
              </h1>
            </FadeUp>

            <FadeUp delay={0.12}>
              <p className="text-text-secondary text-[17px] md:text-[19px] leading-[1.8] max-w-[580px] mb-12">
                AI agents, workflow automation, and intelligent systems — built
                for organizations that move fast and expect measurable results.
              </p>
            </FadeUp>

            <FadeUp delay={0.18}>
              <div className="flex flex-wrap items-center gap-4 mb-24 md:mb-28">
                <Link href="/contact" className="btn-primary">
                  Book a Consultation <Arrow />
                </Link>
                <Link href="/services" className="btn-secondary">
                  See Our Services <Arrow />
                </Link>
              </div>
            </FadeUp>

            {/* Stats row */}
            <FadeUp delay={0.24}>
              <div className="pt-12 border-t border-white/[0.06]">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-8">
                  {stats.map((s) => (
                    <div key={s.label}>
                      <p className="stat-number text-gradient mb-2">
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

        {/* ════════════════════ TECH STACK MARQUEE ════════════════════ */}
        <section className="py-12 border-y border-border bg-bg-subtle">
          <div className="container mb-6">
            <p className="text-center font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-text-muted">
              Technologies We Work With
            </p>
          </div>
          <div className="marquee-wrapper">
            <div className="marquee-track">
              {[...techStack, ...techStack].map((name, i) => (
                <span
                  key={i}
                  className="font-mono text-[14px] font-medium text-text-muted whitespace-nowrap opacity-40 grayscale hover:opacity-100 hover:grayscale-0 hover:text-accent transition-all duration-500"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════ SERVICES — BENTO GRID ════════════════════ */}
        <section className="py-32 md:py-40 lg:py-48">
          <div className="container">
            <FadeUp>
              <div className="section-label">What We Do</div>
            </FadeUp>
            <FadeUp delay={0.06}>
              <h2 className="text-[clamp(30px,4.5vw,52px)] font-extrabold tracking-[-0.025em] mb-6 max-w-xl">
                Our Services
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-text-secondary text-[16px] leading-[1.8] max-w-xl mb-20">
                From strategic consulting to full-stack AI deployment — end-to-end
                solutions that transform how your organization operates.
              </p>
            </FadeUp>

            {/* Bento Grid — 12 col */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {services.map((s, i) => (
                <FadeUp key={s.num} delay={0.06 * i} className={`${s.span}`}>
                  <Link href="/services" className="card-glass p-8 md:p-10 block h-full group">
                    {/* Top row */}
                    <div className="flex items-start justify-between mb-7">
                      <div className="w-12 h-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-center text-text-secondary group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-all duration-400">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                          {s.icon}
                        </svg>
                      </div>
                      <span className="font-mono text-[12px] text-text-muted/50">{s.num}</span>
                    </div>

                    <h3 className="text-[17px] font-bold text-text mb-3 leading-snug tracking-[-0.01em]">
                      {s.title}
                    </h3>

                    <p className="text-text-secondary text-[14px] leading-[1.75] mb-7">
                      {s.desc}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-7">
                      {s.metrics.map((m) => (
                        <span key={m} className="metric-badge">{m}</span>
                      ))}
                    </div>

                    <span className="text-[13px] font-medium text-text-muted flex items-center gap-2 group-hover:text-accent group-hover:gap-3 transition-all duration-300">
                      Explore <Arrow size={12} />
                    </span>
                  </Link>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════ PROCESS — STAGGERED TIMELINE ════════════════════ */}
        <section className="py-32 md:py-40 lg:py-48 bg-bg-subtle border-y border-border">
          <div className="container">
            <FadeUp>
              <div className="section-label">Our Process</div>
            </FadeUp>
            <FadeUp delay={0.06}>
              <h2 className="text-[clamp(30px,4.5vw,52px)] font-extrabold tracking-[-0.025em] mb-6 max-w-xl">
                From discovery to delivery
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-text-secondary text-[16px] leading-[1.8] max-w-xl mb-20">
                A proven four-step process that takes you from first
                conversation to measurable ROI — quickly and predictably.
              </p>
            </FadeUp>

            {/* Timeline */}
            <div className="relative">
              {/* Connecting line — desktop only */}
              <div className="hidden lg:block absolute top-[60px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {processSteps.map((step, i) => (
                  <FadeUp key={step.num} delay={0.1 * i}>
                    <div className={`card-glass p-8 md:p-9 h-full relative ${i % 2 === 1 ? 'lg:mt-12' : ''}`}>
                      {/* Step indicator */}
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                          <span className="text-[13px] font-mono font-bold text-accent">{step.num}</span>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-accent/20 to-transparent" />
                      </div>
                      <h3 className="text-[17px] font-bold text-text mb-3">
                        {step.title}
                      </h3>
                      <p className="text-text-secondary text-[14px] leading-[1.75]">
                        {step.desc}
                      </p>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════ RESULTS ════════════════════ */}
        <section className="py-32 md:py-40 lg:py-48">
          <div className="container">
            <FadeUp>
              <div className="section-label">Results</div>
            </FadeUp>
            <FadeUp delay={0.06}>
              <h2 className="text-[clamp(30px,4.5vw,52px)] font-extrabold tracking-[-0.025em] mb-6 max-w-xl">
                Real impact, real numbers
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-text-secondary text-[16px] leading-[1.8] max-w-xl mb-20">
                Our clients don&apos;t just automate — they transform. Here are
                the results that speak for themselves.
              </p>
            </FadeUp>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {results.map((r, i) => (
                <FadeUp key={r.label} delay={0.08 * i}>
                  <div className="card-glass p-8 md:p-12 text-center">
                    <p className="stat-number text-gradient mb-4">
                      {r.metric}
                    </p>
                    <p className="text-[12px] font-mono text-text-muted tracking-[0.08em] uppercase">
                      {r.label}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════ LAB & INCUBATOR — BLUEPRINT ════════════════════ */}
        <section className="py-32 md:py-40 lg:py-48 bg-bg-subtle border-y border-border relative">
          {/* Blueprint grid overlay */}
          <div className="blueprint-grid absolute inset-0 pointer-events-none" />

          <div className="container relative z-10">
            <FadeUp>
              <div className="section-label">The Lab</div>
            </FadeUp>
            <FadeUp delay={0.06}>
              <h2 className="text-[clamp(30px,4.5vw,52px)] font-extrabold tracking-[-0.025em] mb-6 max-w-xl">
                We build what we preach
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-text-secondary text-[16px] leading-[1.8] max-w-xl mb-20">
                Beyond client work, we invest in and build our own AI products
                — proving the same systems we deploy for you work at scale.
              </p>
            </FadeUp>

            {/* Bento — asymmetric */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              <FadeUp className="md:col-span-7">
                <div className="card-glass p-8 md:p-10 h-full group">
                  <div className="flex items-center gap-3 mb-7">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-accent/20 to-[#A78BFA]/20 border border-accent/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-mono font-medium uppercase tracking-[0.15em] text-accent">Internal Project</span>
                  </div>
                  <h3 className="text-[22px] font-extrabold text-text mb-2">Malik Zaid</h3>
                  <p className="text-text-muted text-[13px] italic mb-5">Personal AI Assistant</p>
                  <p className="text-text-secondary text-[15px] leading-[1.8]">
                    Our proprietary AI assistant built to demonstrate what&apos;s possible
                    with autonomous agents. Handles scheduling, research, email triage,
                    and complex multi-step workflows — a live showcase of the technology
                    we deploy for clients.
                  </p>
                </div>
              </FadeUp>
              <FadeUp delay={0.08} className="md:col-span-5">
                <div className="card-glass p-8 md:p-10 h-full group">
                  <div className="flex items-center gap-3 mb-7">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#34D399]/20 to-[#6EE7B7]/20 border border-[#34D399]/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#34D399]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-mono font-medium uppercase tracking-[0.15em] text-[#34D399]">Incubator</span>
                  </div>
                  <h3 className="text-[22px] font-extrabold text-text mb-2">Fynora.ai</h3>
                  <p className="text-text-muted text-[13px] italic mb-5">AI-Powered Financial Intelligence</p>
                  <p className="text-text-secondary text-[15px] leading-[1.8]">
                    Part of the Aixcel ecosystem — an AI startup we&apos;re incubating
                    that brings intelligent financial analytics and automation to
                    businesses. Proof that we don&apos;t just consult on AI — we ship it.
                  </p>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* ════════════════════ EXPECTED IMPACT ════════════════════ */}
        <section className="py-32 md:py-40 lg:py-48">
          <div className="container">
            <FadeUp>
              <div className="section-label">Expected Impact</div>
            </FadeUp>
            <FadeUp delay={0.06}>
              <h2 className="text-[clamp(30px,4.5vw,52px)] font-extrabold tracking-[-0.025em] mb-6 max-w-xl">
                What automation delivers
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-text-secondary text-[16px] leading-[1.8] max-w-xl mb-20">
                Real scenarios showing the kind of impact our AI systems are designed to deliver for your organization.
              </p>
            </FadeUp>

            <div className="grid md:grid-cols-3 gap-5">
              {expectedImpact.map((t, i) => (
                <FadeUp key={t.metric} delay={0.08 * i}>
                  <div className="card-glass p-8 md:p-10 h-full flex flex-col">
                    <span className="metric-badge w-fit mb-7">
                      {t.metric}
                    </span>

                    <p className="text-text-muted text-[13px] leading-[1.75] mb-5">
                      <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent block mb-2">Scenario</span>
                      {t.scenario}
                    </p>

                    <p className="text-text-secondary text-[14px] leading-[1.8] flex-1">
                      <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent block mb-2">Outcome</span>
                      {t.outcome}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════ CTA ════════════════════ */}
        <section className="hero-mesh relative py-32 md:py-44 overflow-hidden">
          <div className="glow w-[600px] h-[600px] bg-accent/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

          <div className="container relative z-10 text-center">
            <FadeUp>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-text-muted mb-6">
                Ready to Get Started?
              </p>
            </FadeUp>
            <FadeUp delay={0.06}>
              <h2 className="text-[clamp(32px,5.5vw,60px)] font-extrabold tracking-[-0.03em] mb-7 max-w-2xl mx-auto">
                Let&apos;s automate your growth
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-text-secondary text-[17px] leading-[1.8] max-w-lg mx-auto mb-12">
                Book a free discovery call — or grab our free automation audit
                checklist to identify quick wins on your own.
              </p>
            </FadeUp>
            <FadeUp delay={0.14}>
              <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                <Link href="/contact" className="btn-primary">
                  Book a Consultation <Arrow />
                </Link>
                <Link href="/contact" className="btn-secondary">
                  Free Automation Audit
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                </Link>
              </div>
            </FadeUp>
            <FadeUp delay={0.18}>
              <p className="text-text-muted text-[13px]">
                No commitment required — 30-minute call or a self-serve checklist. Your choice.
              </p>
            </FadeUp>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
