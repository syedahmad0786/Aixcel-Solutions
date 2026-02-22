"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

const services = [
  {
    number: "01",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    title: "AI Agents & Autonomous Workflows",
    subtitle: "Intelligent Automation at Scale",
    description:
      "Custom-built AI agents that handle real business operations autonomously — processing documents, managing client requests, generating reports, and making data-driven decisions without human intervention.",
    useCase: "Autonomous document processing pipeline for financial compliance",
    metrics: ["15x Faster Processing", "90% Cost Reduction", "24/7 Operation"],
  },
  {
    number: "02",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
        <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
      </svg>
    ),
    title: "Voice AI & Conversational Intelligence",
    subtitle: "Natural Language Interfaces",
    description:
      "Enterprise-grade voice AI systems and conversational interfaces that understand context, manage complex dialogues, and integrate seamlessly with your existing business infrastructure.",
    useCase: "Multilingual voice assistant for global wealth management",
    metrics: ["98% Accuracy", "40+ Languages", "Sub-second Response"],
  },
  {
    number: "03",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
    title: "Data Intelligence & Analytics",
    subtitle: "Strategic Insight Engine",
    description:
      "Transform raw data into strategic intelligence with custom dashboards, predictive analytics, and AI-powered insights that empower decision-makers to act with confidence.",
    useCase: "Real-time market intelligence dashboard for hedge fund operations",
    metrics: ["240% Avg ROI", "Real-time Sync", "Predictive Models"],
  },
  {
    number: "04",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: "Enterprise Automation & Integration",
    subtitle: "Unified Workflow Architecture",
    description:
      "End-to-end automation using n8n, Make, and custom integrations. Transform fragmented processes into unified workflows that keep your CRM, finance, and operations perfectly synchronized.",
    useCase: "Cross-platform automation for multi-entity portfolio management",
    metrics: ["500+ Hours Saved", "Zero-error Pipelines", "100+ Integrations"],
  },
  {
    number: "05",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
      </svg>
    ),
    title: "AI Consulting & Strategic Advisory",
    subtitle: "Expert-led Transformation",
    description:
      "We audit workflows, map data flows, and uncover bottlenecks. The result: a clear roadmap of what to automate, what to build, and what will bring measurable ROI to your organization.",
    useCase: "AI readiness assessment and roadmap for global advisory firm",
    metrics: ["80% Cost Reduction", "12-week Roadmap", "Full Audit"],
  },
  {
    number: "06",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: "Custom AI Platforms",
    subtitle: "Bespoke Enterprise Solutions",
    description:
      "Bespoke AI-powered platforms and internal tools designed for your specific workflows. From CRM systems to operational dashboards — architected to scale with your organization.",
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
        <section className="pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="container">
            <FadeUp>
              <p className="section-label">Services</p>
            </FadeUp>
            <FadeUp delay={0.05}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary leading-[1.08] mb-6 max-w-3xl">
                Precision-engineered AI systems
              </h1>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-secondary text-lg md:text-xl leading-relaxed max-w-2xl">
                From strategic consulting to full-stack AI deployment — we
                deliver end-to-end solutions that transform how elite
                organizations operate. Every system is architected for scale,
                security, and measurable impact.
              </p>
            </FadeUp>
          </div>
        </section>

        {/* Divider */}
        <div className="container"><div className="divider" /></div>

        {/* Services */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="space-y-6">
              {services.map((service, i) => (
                <FadeUp key={service.number} delay={0.05 * i}>
                  <div className="card p-8 md:p-10 group">
                    <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8 lg:gap-12">
                      {/* Left */}
                      <div>
                        <div className="flex items-center gap-4 mb-5">
                          <div className="w-11 h-11 rounded-lg border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-200">
                            {service.icon}
                          </div>
                          <span className="text-xs font-mono text-muted">
                            {service.number}
                          </span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-primary mb-1 leading-tight">
                          {service.title}
                        </h3>
                        <p className="text-sm text-muted italic mb-4">
                          {service.subtitle}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {service.metrics.map((m) => (
                            <span
                              key={m}
                              className="px-2.5 py-1 text-[11px] font-mono font-medium text-muted bg-bg-alt border border-border-light rounded-md"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right */}
                      <div>
                        <p className="text-secondary text-sm leading-relaxed mb-5">
                          {service.description}
                        </p>
                        <div className="p-4 bg-bg-alt rounded-lg border border-border-light mb-5">
                          <p className="text-[11px] font-mono uppercase tracking-wider text-muted mb-1">
                            Featured Use Case
                          </p>
                          <p className="text-sm text-secondary">
                            {service.useCase}
                          </p>
                        </div>
                        <Link
                          href="/contact"
                          className="text-sm font-medium text-primary flex items-center gap-2 group-hover:gap-3 transition-all duration-200"
                        >
                          Get started <ArrowRight />
                        </Link>
                      </div>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 bg-bg-dark text-white">
          <div className="container text-center">
            <FadeUp>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 max-w-2xl mx-auto">
                Ready to transform your operations?
              </h2>
            </FadeUp>
            <FadeUp delay={0.05}>
              <p className="text-white/60 text-lg leading-relaxed max-w-xl mx-auto mb-10">
                Let&apos;s discuss how our AI systems can deliver measurable ROI
                for your organization. No fluff — just precision engineering and
                real results.
              </p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/contact" className="btn-primary-light">
                  Start a Conversation <ArrowRight />
                </Link>
                <Link href="/mission" className="btn-secondary-light">
                  About Us <ArrowRight />
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
