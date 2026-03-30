"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";

export default function FinalCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative p-12 md:p-20 rounded-3xl bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] text-center overflow-hidden"
        >
          {/* Background effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[var(--color-accent)] opacity-[0.06] rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-1/4 w-[300px] h-[200px] bg-[var(--color-secondary)] opacity-[0.04] rounded-full blur-[80px]" />
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-[var(--color-border-visible)] bg-[var(--color-bg-card)]"
            >
              <Calendar className="w-3.5 h-3.5 text-[var(--color-accent)]" />
              <span className="text-xs font-medium text-[var(--color-text-muted)]">
                Free 30-minute discovery call
              </span>
            </motion.div>

            <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-text-heading)] mb-4 leading-tight">
              Ready to eliminate
              <br />
              <span className="gradient-text">manual work?</span>
            </h2>

            <p className="text-lg text-[var(--color-text-body)] max-w-xl mx-auto mb-10">
              Let&apos;s map out exactly how AI automation will save your team
              30+ hours per week — with a concrete plan you can execute.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/book" className="btn-primary text-base px-10 py-4">
                Book a Discovery Call
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/contact" className="btn-ghost text-base px-8 py-4">
                Or send a message
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
