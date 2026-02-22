"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

function Arrow() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>;
}

const services = [
  {
    num: "01",
    icon: <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />,
    title: "AI Agents & Autonomous Workflows",
    subtitle: "Intelligent Automation at Scale",
    desc: "Custom-built AI agents that handle real business operations autonomously — processing documents, managing client requests, generating reports, and making data-driven decisions without human intervention.",
    useCase: "Autonomous document processing pipeline for financial compliance",
    metrics: ["15x Faster Processing", "90% Cost Reduction", "24/7 Operation"],
  },
  {
    num: "02",
    icon: <><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" /></>,
    title: "Voice AI & Conversational Intelligence",
    subtitle: "Natural Language Interfaces",
    desc: "Enterprise-grade voice AI systems and conversational interfaces that understand context, manage complex dialogues, and integrate seamlessly with your existing business infrastructure.",
    useCase: "Multilingual voice assistant for global wealth management",
    metrics: ["98% Accuracy", "40+ Languages", "Sub-second Response"],
  },
  {
    num: "03",
    icon: <path d="M18 20V10M12 20V4M6 20v-6" />,
    title: "Data Intelligence & Analytics",
    subtitle: "Strategic Insight Engine",
    desc: "Transform raw data into strategic intelligence with custom dashboards, predictive analytics, and AI-powered insights that empower decision-makers to act with confidence.",
    useCase: "Real-time market intelligence dashboard for hedge fund operations",
    metrics: ["240% Avg ROI", "Real-time Sync", "Predictive Models"],
  },
  {
    num: "04",
    icon: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
    title: "Enterprise Automation & Integration",
    subtitle: "Unified Workflow Architecture",
    desc: "End-to-end automation using n8n, Make, and custom integrations. Transform fragmented processes into unified workflows that keep your CRM, finance, and operations synchronized.",
    useCase: "Cross-platform automation for multi-entity portfolio management",
    metrics: ["500+ Hours Saved", "Zero-error Pipelines", "100+ Integrations"],
  },
  {
    num: "05",
    icon: <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />,
    title: "AI Consulting & Strategic Advisory",
    subtitle: "Expert-led Transformation",
    desc: "We audit workflows, map data flows, and uncover bottlenecks. The result: a clear roadmap of what to automate, what to build, and what will bring measurable ROI to your organization.",
    useCase: "AI readiness assessment and roadmap for global advisory firm",
    metrics: ["80% Cost Reduction", "12-week Roadmap", "Full Audit"],
  },
  {
    num: "06",
    icon: <><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></>,
    title: "Custom AI Platforms",
    subtitle: "Bespoke Enterprise Solutions",
    desc: "Bespoke AI-powered platforms and internal tools designed for your specific workflows. From CRM systems to operational dashboards — architected to scale with your organization.",
    useCase: "White-label AI platform for boutique investment advisory",
    metrics: ["20+ Platforms Built", "API-first", "Scalable Infra"],
  },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="hero-mesh relative pt-40 pb-24 md:pt-52 md:pb-32 overflow-hidden">
          <div className="glow w-[600px] h-[600px] bg-accent/15 -top-[200px] left-1/2 -translate-x-1/2" />
          <div className="container relative z-10">
            <FadeUp>
              <div className="section-label">Services</div>
            </FadeUp>
            <FadeUp delay={0.06}>
              <h1 className="text-[clamp(40px,6vw,72px)] font-extrabold leading-[1.02] tracking-[-0.03em] max-w-[720px] mb-8">
                Precision-engineered{" "}
                <span className="text-gradient">AI systems</span>
              </h1>
            </FadeUp>
            <FadeUp delay={0.12}>
              <p className="text-text-secondary text-[17px] md:text-[19px] leading-[1.8] max-w-[580px]">
                From strategic consulting to full-stack AI deployment — we
                deliver end-to-end solutions that transform how elite
                organizations operate.
              </p>
            </FadeUp>
          </div>
        </section>

        <div className="container"><div className="divider-gradient" /></div>

        {/* Services */}
        <section className="py-32 md:py-40 lg:py-48">
          <div className="container space-y-6">
            {services.map((s, i) => (
              <FadeUp key={s.num} delay={0.04 * i}>
                <div className="card-glass p-8 md:p-12 group">
                  <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-16">
                    {/* Left */}
                    <div>
                      <div className="flex items-center gap-4 mb-7">
                        <div className="w-12 h-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-center text-text-secondary group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-all duration-400">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                            {s.icon}
                          </svg>
                        </div>
                        <span className="font-mono text-[12px] text-text-muted/50">{s.num}</span>
                      </div>
                      <h3 className="text-[22px] md:text-[24px] font-extrabold text-text mb-2 leading-snug tracking-[-0.02em]">
                        {s.title}
                      </h3>
                      <p className="text-[13px] text-text-muted italic mb-6">{s.subtitle}</p>
                      <div className="flex flex-wrap gap-2">
                        {s.metrics.map((m) => (
                          <span key={m} className="metric-badge">{m}</span>
                        ))}
                      </div>
                    </div>

                    {/* Right */}
                    <div>
                      <p className="text-text-secondary text-[15px] leading-[1.8] mb-7">{s.desc}</p>
                      <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/[0.04] mb-7">
                        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-text-muted mb-2">Featured Use Case</p>
                        <p className="text-[14px] text-text-secondary leading-relaxed">{s.useCase}</p>
                      </div>
                      <Link href="/contact" className="text-[13px] font-medium text-text-muted flex items-center gap-2 group-hover:text-accent group-hover:gap-3 transition-all duration-300">
                        Get started <Arrow />
                      </Link>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="hero-mesh relative py-32 md:py-44 border-t border-border overflow-hidden">
          <div className="glow w-[600px] h-[600px] bg-accent/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <div className="container relative z-10 text-center">
            <FadeUp>
              <h2 className="text-[clamp(32px,5.5vw,60px)] font-extrabold tracking-[-0.03em] mb-7 max-w-2xl mx-auto">
                Ready to transform your operations?
              </h2>
            </FadeUp>
            <FadeUp delay={0.06}>
              <p className="text-text-secondary text-[17px] leading-[1.8] max-w-lg mx-auto mb-12">
                Let&apos;s discuss how our AI systems can deliver measurable ROI.
                No fluff — just precision engineering and real results.
              </p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/contact" className="btn-primary">Start a Conversation <Arrow /></Link>
                <Link href="/mission" className="btn-secondary">About Us <Arrow /></Link>
              </div>
            </FadeUp>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
