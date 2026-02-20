"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const services = [
  {
    id: "ai-agents",
    icon: "🤖",
    title: "AI Agents & Copilots",
    subtitle: "Autonomous Intelligence",
    description:
      "Custom-built AI agents that handle real business operations — processing documents, managing client requests, generating reports, and making data-driven decisions autonomously.",
    features: [
      "Autonomous task execution",
      "Multi-model orchestration",
      "Real-time decision engine",
      "Custom knowledge bases",
    ],
    gradient: "from-blue-500 to-cyan-400",
    metric: "15x",
    metricLabel: "Faster Processing",
  },
  {
    id: "workflow-automation",
    icon: "⚡",
    title: "Workflow Automation",
    subtitle: "Intelligent Process Design",
    description:
      "End-to-end automation using n8n, Make, and custom integrations. Transform fragmented processes into unified workflows that keep your CRM, finance, and operations perfectly synced.",
    features: [
      "n8n & Make integrations",
      "Custom API orchestration",
      "Real-time data sync",
      "Error-proof pipelines",
    ],
    gradient: "from-purple-500 to-pink-400",
    metric: "500+",
    metricLabel: "Hours Saved/Year",
  },
  {
    id: "data-intelligence",
    icon: "📊",
    title: "Data Intelligence & Analytics",
    subtitle: "Strategic Insight Engine",
    description:
      "Transform raw data into strategic intelligence. Custom dashboards, predictive analytics, and AI-powered insights that empower elite decision-makers.",
    features: [
      "Predictive analytics",
      "Real-time dashboards",
      "KPI tracking systems",
      "Anomaly detection",
    ],
    gradient: "from-cyan-500 to-blue-400",
    metric: "240%",
    metricLabel: "Average ROI",
  },
  {
    id: "consulting",
    icon: "🎯",
    title: "Strategic AI Consulting",
    subtitle: "Expert Advisory",
    description:
      "We audit workflows, map data flows, and uncover bottlenecks. The result: a clear roadmap of what to automate and what will bring measurable ROI to your organization.",
    features: [
      "Process audit & mapping",
      "AI readiness assessment",
      "Technology roadmap",
      "Change management",
    ],
    gradient: "from-amber-500 to-orange-400",
    metric: "80%",
    metricLabel: "Cost Reduction",
  },
  {
    id: "custom-platforms",
    icon: "🏗️",
    title: "Custom AI Platforms",
    subtitle: "Enterprise Solutions",
    description:
      "Bespoke AI-powered platforms and internal tools designed for your specific workflows. From CRM systems to operational dashboards — built to scale.",
    features: [
      "Custom SaaS development",
      "API-first architecture",
      "Scalable infrastructure",
      "White-label solutions",
    ],
    gradient: "from-green-500 to-emerald-400",
    metric: "20+",
    metricLabel: "Platforms Built",
  },
  {
    id: "compliance",
    icon: "🛡️",
    title: "AI Governance & Compliance",
    subtitle: "Regulatory Excellence",
    description:
      "Navigate the complex landscape of AI regulation with confidence. We ensure your AI systems meet GDPR, SOC 2, and industry-specific compliance requirements.",
    features: [
      "GDPR compliance",
      "SOC 2 readiness",
      "AI ethics framework",
      "Risk assessment",
    ],
    gradient: "from-red-500 to-rose-400",
    metric: "100%",
    metricLabel: "Compliance Rate",
  },
];

function ServiceCard({
  service,
  index,
  isActive,
  onClick,
}: {
  service: (typeof services)[0];
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onClick={onClick}
      className={`glass rounded-2xl p-6 md:p-8 cursor-pointer transition-all duration-500 group relative overflow-hidden ${
        isActive
          ? "border-accent-blue/30 bg-white/[0.06] scale-[1.02]"
          : "glass-hover"
      }`}
    >
      {/* Glow effect on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-3xl mb-3 block">{service.icon}</span>
            <span className={`text-xs font-semibold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r ${service.gradient}`}>
              {service.subtitle}
            </span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold gradient-text">{service.metric}</div>
            <div className="text-xs text-white/40">{service.metricLabel}</div>
          </div>
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
          {service.title}
        </h3>
        <p className="text-white/50 text-sm leading-relaxed mb-5">
          {service.description}
        </p>

        {/* Features list */}
        <div className="grid grid-cols-2 gap-2">
          {service.features.map((feature, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-xs text-white/40"
            >
              <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${service.gradient}`} />
              {feature}
            </div>
          ))}
        </div>

        {/* Arrow */}
        <div className="mt-5 flex items-center gap-2 text-accent-cyan text-sm group-hover:gap-3 transition-all">
          <span>Learn more</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

export default function ServicesSection() {
  const [activeService, setActiveService] = useState<string | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-space-900 via-space-800/50 to-space-900" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-accent-cyan text-sm font-semibold tracking-widest uppercase">
            What We Do
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Enterprise AI{" "}
            <span className="gradient-text">Services</span>
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto text-lg">
            From strategic consulting to full-stack AI deployment — we deliver
            end-to-end solutions that transform how elite organizations operate.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={i}
              isActive={activeService === service.id}
              onClick={() =>
                setActiveService(activeService === service.id ? null : service.id)
              }
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <a href="#contact" className="btn-primary inline-block">
            Discuss Your Project
            <svg className="inline ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
