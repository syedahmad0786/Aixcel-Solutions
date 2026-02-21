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

const features = [
  {
    title: "Data Sovereignty",
    description:
      "Your data never leaves your jurisdiction. We deploy solutions within your preferred cloud regions with full encryption at rest and in transit.",
    gradient: "from-accent-blue to-accent-purple",
  },
  {
    title: "Audit Trail",
    description:
      "Every AI decision, data access, and system interaction is logged and auditable. Complete transparency for regulatory requirements.",
    gradient: "from-accent-purple to-accent-cyan",
  },
  {
    title: "Access Control",
    description:
      "Role-based permissions, multi-factor authentication, and zero-trust architecture protect your most sensitive operations.",
    gradient: "from-accent-cyan to-accent-blue",
  },
  {
    title: "Bias Monitoring",
    description:
      "Continuous monitoring for AI bias and fairness, ensuring your systems make equitable decisions across all demographics.",
    gradient: "from-accent-blue to-accent-cyan",
  },
];

export default function ComplianceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-surface" />

      <div ref={ref} className="relative z-10 section-padding">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-8 bg-accent-purple" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent-purple">
              Security & Compliance
            </span>
          </div>

          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-6">
            Enterprise-Grade{" "}
            <span className="text-gradient">Security</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left — description + certifications */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <p className="text-white/50 text-lg leading-relaxed mb-10">
              In a world where data breaches cost millions and regulatory fines
              can cripple organizations, we build AI systems that exceed the
              highest compliance standards. Your trust is our foundation.
            </p>

            {/* Certification cards */}
            <div className="grid grid-cols-2 gap-4">
              {certifications.map((cert, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                  className="glass-panel-hover p-5 flex items-start gap-3"
                >
                  <span className="text-2xl shrink-0 mt-0.5">{cert.icon}</span>
                  <div>
                    <h4 className="text-white text-sm font-semibold mb-1">
                      {cert.name}
                    </h4>
                    <p className="text-white/40 text-xs leading-relaxed">
                      {cert.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — feature cards stacked */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                className="glass-panel-hover p-6 group"
              >
                <div className="flex items-start gap-4">
                  {/* Checkmark in gradient box */}
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} p-[1px] shrink-0`}
                  >
                    <div className="w-full h-full rounded-xl bg-surface-100 flex items-center justify-center group-hover:bg-surface-200 transition-colors">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold text-sm mb-1">
                      {feature.title}
                    </h4>
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
