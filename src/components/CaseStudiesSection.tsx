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
  },
];

export default function CaseStudiesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section id="case-studies" className="relative py-32 overflow-hidden">
      <div ref={ref} className="section-padding relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-8 bg-accent-purple" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent-purple">
              Proven Results
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white">
            Case Studies
          </h2>
        </motion.div>

        {/* 2x2 Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {caseStudies.map((study, i) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              onMouseEnter={() => setHoveredId(study.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="glass-panel-hover p-8 md:p-10 cursor-pointer group"
            >
              {/* Category */}
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent-purple">
                {study.category}
              </span>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-serif text-white mt-4 mb-4">
                {study.title}
              </h3>

              {/* Description */}
              <p className="text-white/40 text-sm leading-relaxed mb-8">
                {study.description}
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {study.metrics.map((metric, j) => (
                  <div key={j}>
                    <div className="text-xl md:text-2xl font-semibold text-gradient">
                      {metric.value}
                    </div>
                    <div className="text-xs text-white/30 font-mono mt-1">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {study.tags.map((tag, j) => (
                  <span
                    key={j}
                    className="text-xs font-mono px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/40"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
