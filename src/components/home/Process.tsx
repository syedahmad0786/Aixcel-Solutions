"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Search, Layers, Hammer, Rocket } from "lucide-react";

const steps = [
  {
    icon: <Search className="w-6 h-6" />,
    title: "Discovery",
    description:
      "We audit your current operations — every manual step, every data flow, every bottleneck. No guessing. Just data.",
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: "Architecture",
    description:
      "Design the system blueprint with clear boundaries, error handling, and integration points. You approve before we build.",
  },
  {
    icon: <Hammer className="w-6 h-6" />,
    title: "Build",
    description:
      "We build in 2-4 week sprints with weekly demos. Production-grade code with monitoring, not a demo that breaks in the real world.",
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: "Deploy",
    description:
      "Launch with real-time monitoring and iterate based on production data. We stay on until ROI targets are hit.",
  },
];

export default function Process() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-[var(--color-bg-elevated)]">
      <div className="container-main">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-[var(--color-accent)] mb-3 block">
            Our Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-heading)] mb-4">
            From discovery to deployment in weeks, not months
          </h2>
          <p className="text-[var(--color-text-body)] max-w-2xl mx-auto">
            A proven 4-step process refined across 200+ automation deployments.
            Every engagement targets ROI within 90 days.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: i * 0.12,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="relative"
            >
              <div className="p-7 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-card)] h-full">
                {/* Step Number */}
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3 rounded-xl bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">
                    {step.icon}
                  </div>
                  <span className="text-4xl font-bold text-[var(--color-border-visible)] font-[family-name:var(--font-mono)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-[var(--color-text-heading)] mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector line (desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-[var(--color-border-visible)]" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
