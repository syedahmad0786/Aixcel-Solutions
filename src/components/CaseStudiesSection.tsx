"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const caseStudies = [
  {
    id: 1,
    category: "Family Office",
    title: "Automated Portfolio Intelligence System",
    description:
      "Built a custom AI-powered analytics platform for a Dubai-based family office managing $500M+ in assets. Real-time risk assessment, market signal detection, and automated reporting.",
    metrics: [
      { value: "15x", label: "Faster Reporting" },
      { value: "40%", label: "Cost Reduction" },
      { value: "$2.3M", label: "Annual Savings" },
    ],
    tags: ["AI Agents", "Data Intelligence", "Automation"],
    gradient: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/20",
  },
  {
    id: 2,
    category: "Marketing Agency",
    title: "End-to-End Campaign Automation Engine",
    description:
      "Deployed an intelligent workflow system for a top-tier agency, automating client onboarding, campaign tracking, financial reconciliation, and performance reporting across 200+ accounts.",
    metrics: [
      { value: "90%", label: "Less Manual Work" },
      { value: "500+", label: "Hours Saved/Year" },
      { value: "3x", label: "Client Capacity" },
    ],
    tags: ["Workflow Automation", "CRM Integration", "AI Agents"],
    gradient: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/20",
  },
  {
    id: 3,
    category: "Financial Services",
    title: "Compliance & Document Processing AI",
    description:
      "Created an AI document processing system for a European financial services firm, handling KYC verification, invoice processing, and regulatory compliance checks across 12 jurisdictions.",
    metrics: [
      { value: "99.7%", label: "Accuracy Rate" },
      { value: "80%", label: "Processing Faster" },
      { value: "12", label: "Jurisdictions" },
    ],
    tags: ["AI Governance", "Data Extraction", "Compliance"],
    gradient: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/20",
  },
  {
    id: 4,
    category: "Enterprise",
    title: "Intelligent Operations Command Center",
    description:
      "Designed and deployed a real-time operations dashboard integrating 15+ data sources for a multinational enterprise, providing AI-driven insights and predictive maintenance alerts.",
    metrics: [
      { value: "50%", label: "Decision Time Saved" },
      { value: "15+", label: "Integrations" },
      { value: "24/7", label: "AI Monitoring" },
    ],
    tags: ["Custom Platforms", "Data Intelligence", "AI Agents"],
    gradient: "from-green-500/20 to-emerald-500/20",
    borderColor: "border-green-500/20",
  },
];

export default function CaseStudiesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section id="case-studies" className="relative py-32 overflow-hidden">
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
            Proven Results
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Case{" "}
            <span className="gradient-text">Studies</span>
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto text-lg">
            Real impact for real organizations. See how we&apos;ve transformed
            operations for our clients.
          </p>
        </motion.div>

        {/* Case Studies Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {caseStudies.map((study, i) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              onMouseEnter={() => setHoveredId(study.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`glass rounded-2xl p-8 transition-all duration-500 cursor-pointer group ${
                hoveredId === study.id ? "scale-[1.02] border-accent-blue/20" : ""
              }`}
            >
              {/* Background gradient */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${study.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="relative z-10">
                {/* Category */}
                <span className="text-xs font-semibold tracking-widest uppercase text-accent-cyan">
                  {study.category}
                </span>

                <h3 className="text-xl md:text-2xl font-bold text-white mt-3 mb-4">
                  {study.title}
                </h3>

                <p className="text-white/50 text-sm leading-relaxed mb-6">
                  {study.description}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {study.metrics.map((metric, j) => (
                    <div key={j}>
                      <div className="text-xl font-bold gradient-text">{metric.value}</div>
                      <div className="text-xs text-white/40">{metric.label}</div>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {study.tags.map((tag, j) => (
                    <span
                      key={j}
                      className="text-xs px-3 py-1 rounded-full bg-white/5 text-white/50 border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
