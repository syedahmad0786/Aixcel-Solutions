"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AlertTriangle, Sparkles } from "lucide-react";

export default function ProblemSolution() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-stretch">
          {/* Problem */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative p-8 md:p-10 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-card)]"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[var(--color-error)]/10">
                <AlertTriangle className="w-5 h-5 text-[var(--color-error)]" />
              </div>
              <span className="text-xs font-semibold tracking-widest uppercase text-[var(--color-error)]">
                The Problem
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-text-heading)] mb-4 leading-tight">
              Your team spends 60% of their day on tasks a system could handle.
            </h3>
            <p className="text-[var(--color-text-body)] leading-relaxed">
              Manual data entry. Copy-pasting between tools. Following up on
              leads that should have been contacted hours ago. Generating reports
              that take a full day to compile. Your best people are doing work
              that doesn&apos;t need a human.
            </p>

            {/* Visual accent */}
            <div className="absolute -bottom-px -right-px w-24 h-24 bg-gradient-to-tl from-[var(--color-error)]/5 to-transparent rounded-br-2xl" />
          </motion.div>

          {/* Solution */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative p-8 md:p-10 rounded-2xl border border-[var(--color-accent-muted)] bg-[var(--color-bg-card)]"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[var(--color-accent-muted)]">
                <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
              </div>
              <span className="text-xs font-semibold tracking-widest uppercase text-[var(--color-accent)]">
                The Solution
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-text-heading)] mb-4 leading-tight">
              We build AI systems that eliminate that entirely.
            </h3>
            <p className="text-[var(--color-text-body)] leading-relaxed">
              Autonomous agents that qualify leads at 2 AM. Workflows that
              sync your entire stack without human intervention. Content
              pipelines that produce in a day what used to take a month.
              Systems that think, decide, and execute — so your team can
              focus on what actually grows the business.
            </p>

            {/* Visual accent */}
            <div className="absolute -bottom-px -right-px w-24 h-24 bg-gradient-to-tl from-[var(--color-accent)]/5 to-transparent rounded-br-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
