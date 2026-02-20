"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import dynamic from "next/dynamic";

const GlobeScene = dynamic(() => import("./three/GlobeScene"), { ssr: false });

const stats = [
  { value: "55+", label: "Countries Served", icon: "🌍" },
  { value: "150+", label: "AI Agents Deployed", icon: "🤖" },
  { value: "$2B+", label: "Assets Under Advisory", icon: "💎" },
  { value: "99.9%", label: "System Uptime", icon: "⚡" },
];

const regions = [
  { name: "North America", clients: "45+", focus: "FinTech & Enterprise AI" },
  { name: "Europe & UK", clients: "35+", focus: "Regulatory Compliance & Data" },
  { name: "Middle East", clients: "25+", focus: "HNWI & Family Offices" },
  { name: "Asia Pacific", clients: "20+", focus: "Automation & Analytics" },
];

export default function GlobalSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-space-900 via-space-800 to-space-900" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <span className="text-accent-cyan text-sm font-semibold tracking-widest uppercase">
            Global Impact
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Trusted{" "}
            <span className="gradient-text">Worldwide</span>
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto text-lg">
            Our AI solutions power critical operations for organizations across
            every major financial hub.
          </p>
        </motion.div>

        {/* Globe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <GlobeScene />
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
              className="glass rounded-2xl p-6 text-center glass-hover transition-all duration-300"
            >
              <span className="text-3xl mb-3 block">{stat.icon}</span>
              <div className="text-3xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-white/50 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Regional breakdown */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {regions.map((region, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 + i * 0.1 }}
              className="glass rounded-xl p-5 glass-hover transition-all duration-300"
            >
              <h4 className="text-white font-semibold mb-1">{region.name}</h4>
              <p className="text-accent-cyan text-sm font-medium">{region.clients} clients</p>
              <p className="text-white/40 text-xs mt-2">{region.focus}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
