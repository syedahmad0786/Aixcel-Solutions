"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ─── Animation wrapper ─── */
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
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Arrow icon reused across CTAs ─── */
function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

/* ─── Data ─── */
const stats = [
  { value: "100+", label: "Automations Built" },
  { value: "50+", label: "Happy Clients" },
  { value: "240%", label: "Average ROI" },
  { value: "500+", label: "Hours Saved Monthly" },
];

const partners = [
  "Make.com",
  "n8n",
  "Zapier",
  "OpenAI",
  "Anthropic",
  "Langchain",
  "HubSpot",
  "Salesforce",
];

const services = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    title: "AI Agents & Autonomous Workflows",
    description:
      "Custom-built AI agents that handle real business operations — processing documents, managing requests, and making data-driven decisions autonomously.",
    metrics: ["15x Faster Processing", "90% Cost Reduction"],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
        <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
      </svg>
    ),
    title: "Voice AI & Conversational Intelligence",
    description:
      "Enterprise-grade voice AI systems that understand context, manage complex dialogues, and integrate with your existing business infrastructure.",
    metrics: ["98% Accuracy", "40+ Languages"],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
    title: "Data Intelligence & Analytics",
    description:
      "Transform raw data into strategic intelligence with custom dashboards, predictive analytics, and AI-powered insights for confident decision-making.",
    metrics: ["240% Avg ROI", "Real-time Sync"],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: "Enterprise Automation & Integration",
    description:
      "End-to-end automation using n8n, Make, and custom integrations. Unify your CRM, finance, and operations into seamless workflows.",
    metrics: ["500+ Hours Saved", "100+ Integrations"],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
      </svg>
    ),
    title: "AI Consulting & Strategy",
    description:
      "We audit workflows, map data flows, and uncover bottlenecks. The result: a clear roadmap of what to automate and what will bring measurable ROI.",
    metrics: ["80% Cost Reduction", "12-week Roadmap"],
  },
];

const processSteps = [
  {
    step: "01",
    title: "Discovery",
    description:
      "We start with a deep dive into your business — understanding your challenges, goals, and current systems to identify the highest-impact opportunities.",
  },
  {
    step: "02",
    title: "Strategy",
    description:
      "We design a tailored automation roadmap with clear milestones, prioritized by ROI and implementation complexity.",
  },
  {
    step: "03",
    title: "Build",
    description:
      "Rapid development and deployment of your AI systems. We move fast, test rigorously, and deliver measurable results from day one.",
  },
  {
    step: "04",
    title: "Scale",
    description:
      "Continuous optimization and expansion of AI capabilities across your organization. We grow with you.",
  },
];

const testimonials = [
  {
    quote:
      "Aixcel automated our entire document processing pipeline. What used to take our team 40 hours a week now happens in minutes. The ROI has been staggering.",
    name: "Sarah Chen",
    role: "COO",
    company: "Meridian Capital",
    metric: "$500K+ saved annually",
  },
  {
    quote:
      "Their AI agents handle our client onboarding end-to-end. We've reduced processing time by 15x and our team can finally focus on what matters — building relationships.",
    name: "Michael Torres",
    role: "Managing Director",
    company: "Atlas Advisors",
    metric: "15x faster processing",
  },
  {
    quote:
      "The voice AI system they built handles 80% of our inbound calls autonomously. Our clients love it, and we've cut operational costs by 40%.",
    name: "Priya Sharma",
    role: "Head of Operations",
    company: "NovaBridge Group",
    metric: "40% cost reduction",
  },
];

const caseStudyResults = [
  { metric: "15x", label: "Faster invoice processing" },
  { metric: "$18K", label: "Saved per year in manual labor" },
  { metric: "40%", label: "Operational cost decrease" },
  { metric: "98%", label: "Client satisfaction rate" },
];

/* ─── Page ─── */
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* ══════ HERO ══════ */}
        <section className="pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="container">
            <FadeUp>
              <p className="section-label mb-4">AI Automation Agency</p>
            </FadeUp>
            <FadeUp delay={0.05}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-bold leading-[1.08] tracking-tight text-primary max-w-4xl mb-6">
                We automate the work that slows your business down
              </h1>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-secondary text-lg md:text-xl leading-relaxed max-w-2xl mb-10">
                AI agents, workflow automation, and intelligent systems — built
                for organizations that move fast and expect measurable results.
              </p>
            </FadeUp>
            <FadeUp delay={0.15}>
              <div className="flex flex-wrap items-center gap-4 mb-16">
                <Link href="/contact" className="btn-primary">
                  Book a Consultation <ArrowRight />
                </Link>
                <Link href="/services" className="btn-secondary">
                  See Our Services <ArrowRight />
                </Link>
              </div>
            </FadeUp>

            {/* Stats row */}
            <FadeUp delay={0.2}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 pt-10 border-t border-border">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-3xl md:text-4xl font-bold text-primary mb-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted font-mono">{stat.label}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ══════ TRUSTED BY / MARQUEE ══════ */}
        <section className="py-12 border-y border-border bg-bg-alt">
          <div className="container mb-6">
            <p className="section-label text-center">Trusted Technologies</p>
          </div>
          <div className="overflow-hidden">
            <div className="marquee-track">
              {[...partners, ...partners].map((name, i) => (
                <span
                  key={i}
                  className="text-muted font-mono text-sm font-medium whitespace-nowrap opacity-50 hover:opacity-100 transition-opacity"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ SERVICES ══════ */}
        <section className="py-20 md:py-28">
          <div className="container">
            <FadeUp>
              <p className="section-label">What We Do</p>
            </FadeUp>
            <FadeUp delay={0.05}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-primary mb-4 max-w-2xl">
                Our Services
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-secondary text-lg leading-relaxed max-w-2xl mb-14">
                From strategic consulting to full-stack AI deployment — we
                deliver end-to-end solutions that transform how your
                organization operates.
              </p>
            </FadeUp>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((service, i) => (
                <FadeUp key={service.title} delay={0.05 * i}>
                  <Link href="/services" className="card p-7 block h-full group">
                    <div className="w-11 h-11 rounded-lg border border-border flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-200">
                      {service.icon}
                    </div>
                    <h3 className="text-base font-semibold text-primary mb-2 leading-snug">
                      {service.title}
                    </h3>
                    <p className="text-secondary text-sm leading-relaxed mb-5">
                      {service.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {service.metrics.map((m) => (
                        <span
                          key={m}
                          className="px-2.5 py-1 text-[11px] font-mono font-medium text-muted bg-bg-alt border border-border-light rounded-md"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-primary flex items-center gap-2 group-hover:gap-3 transition-all duration-200">
                      Learn more <ArrowRight />
                    </span>
                  </Link>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ PROCESS ══════ */}
        <section className="py-20 md:py-28 bg-bg-alt border-y border-border">
          <div className="container">
            <FadeUp>
              <p className="section-label">Our Process</p>
            </FadeUp>
            <FadeUp delay={0.05}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-primary mb-4 max-w-2xl">
                From discovery to delivery
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-secondary text-lg leading-relaxed max-w-2xl mb-14">
                A proven four-step process that takes you from first
                conversation to measurable ROI — quickly and predictably.
              </p>
            </FadeUp>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step, i) => (
                <FadeUp key={step.step} delay={0.08 * i}>
                  <div className="relative">
                    <span className="text-6xl font-bold text-border-light font-mono block mb-4">
                      {step.step}
                    </span>
                    <h3 className="text-lg font-semibold text-primary mb-2">
                      {step.title}
                    </h3>
                    <p className="text-secondary text-sm leading-relaxed">
                      {step.description}
                    </p>
                    {i < processSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-8 -right-3 text-border">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ RESULTS ══════ */}
        <section className="py-20 md:py-28">
          <div className="container">
            <FadeUp>
              <p className="section-label">Results</p>
            </FadeUp>
            <FadeUp delay={0.05}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-primary mb-4 max-w-2xl">
                Real impact, real numbers
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-secondary text-lg leading-relaxed max-w-2xl mb-14">
                Our clients don&apos;t just automate — they transform. Here are
                the results that speak for themselves.
              </p>
            </FadeUp>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {caseStudyResults.map((result, i) => (
                <FadeUp key={result.label} delay={0.08 * i}>
                  <div className="card p-7 text-center">
                    <p className="text-4xl md:text-5xl font-bold text-primary mb-2">
                      {result.metric}
                    </p>
                    <p className="text-sm text-muted font-mono">
                      {result.label}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ TESTIMONIALS ══════ */}
        <section className="py-20 md:py-28 bg-bg-alt border-y border-border">
          <div className="container">
            <FadeUp>
              <p className="section-label">Testimonials</p>
            </FadeUp>
            <FadeUp delay={0.05}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-primary mb-14 max-w-2xl">
                What our clients say
              </h2>
            </FadeUp>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <FadeUp key={t.name} delay={0.08 * i}>
                  <div className="card p-7 h-full flex flex-col">
                    {/* Metric badge */}
                    <span className="inline-flex px-3 py-1.5 text-[11px] font-mono font-medium text-primary bg-bg-alt border border-border rounded-md w-fit mb-5">
                      {t.metric}
                    </span>

                    {/* Quote */}
                    <blockquote className="text-secondary text-sm leading-relaxed mb-6 flex-1">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-5 border-t border-border-light">
                      <div className="w-9 h-9 rounded-full bg-bg-alt border border-border flex items-center justify-center">
                        <span className="text-xs font-mono font-medium text-muted">
                          {t.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary">
                          {t.name}
                        </p>
                        <p className="text-xs text-muted">
                          {t.role}, {t.company}
                        </p>
                      </div>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ CTA ══════ */}
        <section className="py-20 md:py-28 bg-bg-dark text-white">
          <div className="container text-center">
            <FadeUp>
              <p className="font-mono text-xs font-medium uppercase tracking-wider text-white/50 mb-4">
                Ready to Get Started?
              </p>
            </FadeUp>
            <FadeUp delay={0.05}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 max-w-2xl mx-auto">
                Let&apos;s automate your growth
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-white/60 text-lg leading-relaxed max-w-xl mx-auto mb-10">
                Book a free discovery call. We&apos;ll analyze your workflows
                and show you exactly where AI can deliver measurable ROI.
              </p>
            </FadeUp>
            <FadeUp delay={0.15}>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/contact" className="btn-primary-light">
                  Book a Consultation <ArrowRight />
                </Link>
                <Link href="/services" className="btn-secondary-light">
                  See Our Services <ArrowRight />
                </Link>
              </div>
            </FadeUp>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
