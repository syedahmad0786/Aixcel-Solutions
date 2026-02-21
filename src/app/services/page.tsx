"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

interface Service {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  featuredUseCase: string;
  metrics: string[];
  icon: React.ReactNode;
  gradient: string;
}

const services: Service[] = [
  {
    number: "01",
    title: "AI Agents & Autonomous Workflows",
    subtitle: "Intelligent Automation at Scale",
    description:
      "Custom-built AI agents that handle real business operations autonomously -- processing documents, managing client requests, generating reports, and making data-driven decisions without human intervention.",
    featuredUseCase:
      "Autonomous document processing pipeline for financial compliance",
    metrics: ["15x Faster Processing", "90% Cost Reduction", "24/7 Operation"],
    gradient: "from-[#6366F1] to-[#8B5CF6]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path
          d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Voice AI & Conversational Intelligence",
    subtitle: "Natural Language Interfaces",
    description:
      "Enterprise-grade voice AI systems and conversational interfaces that understand context, manage complex dialogues, and integrate seamlessly with your existing business infrastructure.",
    featuredUseCase:
      "Multilingual voice assistant for global wealth management",
    metrics: ["98% Accuracy", "40+ Languages", "Sub-second Response"],
    gradient: "from-[#8B5CF6] to-[#06B6D4]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path
          d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Data Intelligence & Analytics",
    subtitle: "Strategic Insight Engine",
    description:
      "Transform raw data into strategic intelligence with custom dashboards, predictive analytics, and AI-powered insights that empower elite decision-makers to act with confidence.",
    featuredUseCase:
      "Real-time market intelligence dashboard for hedge fund operations",
    metrics: ["240% Avg ROI", "Real-time Sync", "Predictive Models"],
    gradient: "from-[#06B6D4] to-[#6366F1]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path
          d="M18 20V10M12 20V4M6 20v-6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Enterprise Automation & Integration",
    subtitle: "Unified Workflow Architecture",
    description:
      "End-to-end automation using n8n, Make, and custom integrations. Transform fragmented processes into unified workflows that keep your CRM, finance, and operations perfectly synchronized.",
    featuredUseCase:
      "Cross-platform automation for multi-entity portfolio management",
    metrics: ["500+ Hours Saved", "Zero-error Pipelines", "100+ Integrations"],
    gradient: "from-[#6366F1] to-[#06B6D4]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path
          d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    number: "05",
    title: "AI Consulting & Strategic Advisory",
    subtitle: "Expert-led Transformation",
    description:
      "We audit workflows, map data flows, and uncover bottlenecks. The result: a clear roadmap of what to automate, what to build, and what will bring measurable ROI to your organization.",
    featuredUseCase:
      "AI readiness assessment and roadmap for global advisory firm",
    metrics: ["80% Cost Reduction", "12-week Roadmap", "Full Audit"],
    gradient: "from-[#8B5CF6] to-[#6366F1]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path
          d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    number: "06",
    title: "Custom AI Platforms",
    subtitle: "Bespoke Enterprise Solutions",
    description:
      "Bespoke AI-powered platforms and internal tools designed for your specific workflows. From CRM systems to operational dashboards -- architected to scale with your organization.",
    featuredUseCase:
      "White-label AI platform for boutique investment advisory",
    metrics: ["20+ Platforms Built", "API-first", "Scalable Infra"],
    gradient: "from-[#06B6D4] to-[#8B5CF6]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path
          d="M12 2L2 7l10 5 10-5-10-5z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 17l10 5 10-5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 12l10 5 10-5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="glass-panel-hover p-8 group relative"
    >
      <div className="relative z-10">
        {/* Icon box + Number row */}
        <div className="flex items-start justify-between mb-6">
          {/* Gradient icon box */}
          <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-30`}
            />
            <div className="absolute inset-[1px] bg-surface-100 rounded-[10px] flex items-center justify-center">
              <span className="text-white/70 group-hover:text-white transition-colors duration-300">
                {service.icon}
              </span>
            </div>
          </div>

          {/* Number */}
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-white/20">
            {service.number}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-xl md:text-2xl text-white mb-1 leading-tight">
          {service.title}
        </h3>

        {/* Subtitle */}
        <p className="text-sm font-serif italic text-white/40 mb-4">
          {service.subtitle}
        </p>

        {/* Description */}
        <p className="text-white/50 text-sm leading-relaxed mb-6">
          {service.description}
        </p>

        {/* Featured use case */}
        <div className="mb-6">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent-purple mb-2 block">
            Featured Use Case
          </span>
          <p className="text-white/60 text-xs leading-relaxed">
            {service.featuredUseCase}
          </p>
        </div>

        {/* Metric pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {service.metrics.map((metric, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-[10px] font-mono uppercase tracking-wider text-white/50"
            >
              {metric}
            </span>
          ))}
        </div>

        {/* Explore link */}
        <div className="flex items-center gap-2 text-accent-purple text-sm font-mono tracking-wide group-hover:gap-3 transition-all duration-300">
          <span className="text-xs uppercase tracking-[0.15em]">Explore</span>
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

export default function ServicesPage() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  return (
    <>
      <Navbar />
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative pt-40 pb-20 overflow-hidden">
          <div className="section-padding relative z-10">
            <motion.div
              ref={heroRef}
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              {/* Purple accent line + label */}
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-8 bg-accent-purple" />
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent-purple">
                  Services
                </span>
              </div>

              {/* Heading */}
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6">
                Precision-Engineered{" "}
                <span className="text-gradient">AI Systems</span>
              </h1>

              {/* Subtitle */}
              <p className="text-white/40 text-lg md:text-xl max-w-2xl leading-relaxed">
                From strategic consulting to full-stack AI deployment -- we
                deliver end-to-end solutions that transform how elite
                organizations operate. Every system is architected for scale,
                security, and measurable impact.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Glow divider */}
        <div className="section-padding">
          <div className="glow-line" />
        </div>

        {/* Services Grid */}
        <section className="relative py-20 overflow-hidden">
          <div className="section-padding relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, i) => (
                <ServiceCard key={service.number} service={service} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Glow divider */}
        <div className="section-padding">
          <div className="glow-line" />
        </div>

        {/* CTA Section */}
        <section className="relative py-32 overflow-hidden">
          <div className="section-padding relative z-10">
            <motion.div
              ref={ctaRef}
              initial={{ opacity: 0, y: 40 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-6 leading-tight">
                Ready to{" "}
                <span className="text-gradient">Transform</span> Your
                Operations?
              </h2>
              <p className="text-white/40 text-lg leading-relaxed mb-10">
                Let&apos;s discuss how our AI systems can deliver measurable ROI
                for your organization. No fluff -- just precision engineering
                and real results.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link href="/contact" className="btn-primary">
                  Start a Conversation
                </Link>
                <Link href="/mission" className="btn-secondary">
                  Our Mission
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}
