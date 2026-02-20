"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const certifications = [
  {
    name: "GDPR Compliant",
    description: "Full European data protection compliance",
    icon: "🇪🇺",
  },
  {
    name: "SOC 2 Type II",
    description: "Enterprise-grade security controls",
    icon: "🔐",
  },
  {
    name: "ISO 27001",
    description: "Information security management",
    icon: "🛡️",
  },
  {
    name: "AI Ethics Board",
    description: "Responsible AI governance framework",
    icon: "⚖️",
  },
];

const complianceFeatures = [
  {
    title: "Data Sovereignty",
    description:
      "Your data never leaves your jurisdiction. We deploy solutions within your preferred cloud regions with full encryption at rest and in transit.",
  },
  {
    title: "Audit Trail",
    description:
      "Every AI decision, data access, and system interaction is logged and auditable. Complete transparency for regulatory requirements.",
  },
  {
    title: "Access Control",
    description:
      "Role-based permissions, multi-factor authentication, and zero-trust architecture protect your most sensitive operations.",
  },
  {
    title: "Bias Monitoring",
    description:
      "Continuous monitoring for AI bias and fairness, ensuring your systems make equitable decisions across all demographics.",
  },
];

export default function ComplianceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-space-900 via-space-800 to-space-900" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-accent-cyan text-sm font-semibold tracking-widest uppercase">
              Compliance & Security
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 leading-tight">
              Enterprise-Grade
              <span className="gradient-text"> Security</span>
            </h2>
            <p className="text-white/50 text-lg leading-relaxed mb-8">
              In a world where data breaches cost millions and regulatory fines
              can cripple organizations, we build AI systems that exceed the
              highest compliance standards. Your trust is our foundation.
            </p>

            {/* Certifications */}
            <div className="grid grid-cols-2 gap-4">
              {certifications.map((cert, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                  className="glass rounded-xl p-4 flex items-center gap-3 glass-hover transition-all duration-300"
                >
                  <span className="text-2xl">{cert.icon}</span>
                  <div>
                    <h4 className="text-white text-sm font-semibold">{cert.name}</h4>
                    <p className="text-white/40 text-xs">{cert.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            {complianceFeatures.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                className="glass rounded-xl p-6 glass-hover transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="min-w-[40px] h-10 rounded-lg bg-gradient-to-br from-accent-blue/20 to-accent-cyan/20 flex items-center justify-center text-accent-cyan group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
                    <p className="text-white/40 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
