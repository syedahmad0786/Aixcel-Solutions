"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const services = [
  {
    title: "AI Agents & Autonomous Workflows",
    description: "Custom-built AI agents that handle real business operations autonomously.",
    icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    gradient: "from-accent-blue to-accent-purple",
  },
  {
    title: "Voice AI & Conversational Intelligence",
    description: "Enterprise-grade voice AI systems and conversational interfaces.",
    icon: "M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3zM19 10v2a7 7 0 01-14 0v-2",
    gradient: "from-accent-purple to-accent-cyan",
  },
  {
    title: "Data Intelligence & Analytics",
    description: "Transform raw data into strategic intelligence with custom dashboards.",
    icon: "M18 20V10M12 20V4M6 20v-6",
    gradient: "from-accent-cyan to-accent-blue",
  },
];

export default function ServicesPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      <div className="section-padding relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-accent-purple" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent-purple">
                Services
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold">
              What We <span className="text-gradient">Build</span>
            </h2>
          </div>
          <Link
            href="/services"
            className="hidden md:inline-flex btn-secondary text-sm px-5 py-2.5"
          >
            View All
          </Link>
        </motion.div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
            >
              <Link href="/services" className="glass-panel-hover p-6 block group h-full">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} p-[1px] mb-5`}>
                  <div className="w-full h-full rounded-xl bg-surface-100 flex items-center justify-center group-hover:bg-surface-200 transition-colors">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={service.icon} />
                    </svg>
                  </div>
                </div>
                <h3 className="text-white font-semibold mb-2">{service.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{service.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="md:hidden mt-8 text-center">
          <Link href="/services" className="btn-secondary text-sm px-6 py-2.5">
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}
