"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";

export default function FounderPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative p-8 md:p-12 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-card)] overflow-hidden"
        >
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Avatar placeholder */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-[#D4763A] flex items-center justify-center">
                <span className="text-4xl md:text-5xl font-bold text-[var(--color-bg-primary)]">
                  A
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-bold text-[var(--color-text-heading)] mb-1">
                Ahmad Bukhari
              </h3>
              <p className="text-sm text-[var(--color-accent)] font-medium mb-4">
                Agentic AI & Enterprise Automation Architect
              </p>
              <p className="text-[var(--color-text-body)] leading-relaxed mb-6 max-w-xl">
                From economics to AI architecture — I&apos;ve spent years building the
                systems that let businesses scale without scaling headcount.
                200+ automations deployed across 12 industries, always with a
                90-day ROI target.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent)] hover:underline"
                >
                  Read my story
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="https://www.linkedin.com/in/bukhariahmad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* Background accent */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[var(--color-accent)] opacity-[0.03] rounded-full blur-[60px]" />
        </motion.div>
      </div>
    </section>
  );
}
