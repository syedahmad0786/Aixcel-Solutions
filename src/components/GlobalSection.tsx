"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import dynamic from "next/dynamic";

const GlobeScene = dynamic(() => import("./three/GlobeScene"), { ssr: false });

const stats = [
  { value: "55+", label: "Countries", gradient: "from-accent-blue to-accent-purple" },
  { value: "150+", label: "AI Agents", gradient: "from-accent-purple to-accent-cyan" },
  { value: "$2B+", label: "Assets", gradient: "from-accent-cyan to-accent-blue" },
  { value: "99.9%", label: "Uptime", gradient: "from-accent-blue to-accent-cyan" },
];

const regions = [
  {
    name: "North America",
    clients: "45+",
    focus: "FinTech & Enterprise AI",
  },
  {
    name: "Europe & UK",
    clients: "35+",
    focus: "Regulatory Compliance & Data",
  },
  {
    name: "Middle East",
    clients: "25+",
    focus: "HNWI & Family Offices",
  },
  {
    name: "Asia Pacific",
    clients: "20+",
    focus: "Automation & Analytics",
  },
];

export default function GlobalSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-surface" />

      <div ref={ref} className="relative z-10 section-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-8 bg-accent-purple" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent-purple">
              Global Presence
            </span>
            <div className="h-px w-8 bg-accent-purple" />
          </div>

          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-6">
            Trusted{" "}
            <span className="text-gradient">Worldwide</span>
          </h2>

          <p className="text-white/50 max-w-2xl mx-auto text-lg leading-relaxed">
            Our AI solutions power critical operations for organizations across
            every major financial hub.
          </p>
        </motion.div>

        {/* Globe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-16"
        >
          <GlobeScene />
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
              className="glass-panel-hover p-6 text-center"
            >
              {/* Gradient icon dot */}
              <div className="flex justify-center mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} p-[1px]`}
                >
                  <div className="w-full h-full rounded-xl bg-surface-100 flex items-center justify-center">
                    <span className="text-gradient font-serif text-lg font-bold">
                      {stat.value.charAt(0) === "$" ? "$" : "#"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-2xl md:text-3xl font-serif font-bold text-gradient mb-1">
                {stat.value}
              </div>
              <div className="text-xs font-mono uppercase tracking-[0.15em] text-white/40">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Regional breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-accent-purple" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent-purple">
              Regional Breakdown
            </span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {regions.map((region, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.0 + i * 0.1 }}
              className="glass-panel-hover p-5"
            >
              <h4 className="text-white font-semibold text-sm mb-2">
                {region.name}
              </h4>
              <p className="text-gradient font-mono text-sm font-medium mb-2">
                {region.clients} clients
              </p>
              <p className="text-white/40 text-xs leading-relaxed">
                {region.focus}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
