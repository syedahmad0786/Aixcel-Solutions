"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { caseStudies } from "@/data/case-studies";

export default function CaseStudies() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const featured = caseStudies.filter((c) => c.featured);

  return (
    <section ref={ref} className="section-padding bg-[var(--color-bg-elevated)]">
      <div className="container-main">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
        >
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-[var(--color-accent)] mb-3 block">
              Proof of Work
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-heading)]">
              Real results, real businesses
            </h2>
          </div>
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent)] hover:underline"
          >
            View all case studies
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((study, i) => (
            <motion.div
              key={study.slug}
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: i * 0.12,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <Link
                href={`/case-studies/${study.slug}`}
                className="group block h-full p-7 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-card)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-hover)] transition-all duration-300 hover:-translate-y-1"
              >
                {/* Industry Tag */}
                <div className="inline-flex px-3 py-1 rounded-full bg-[var(--color-accent-subtle)] text-xs font-medium text-[var(--color-accent)] mb-4">
                  {study.industry}
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-[var(--color-text-heading)] mb-3 leading-snug group-hover:text-[var(--color-accent)] transition-colors">
                  {study.title}
                </h3>

                {/* Metrics */}
                <div className="flex flex-wrap gap-4 mt-auto pt-4 border-t border-[var(--color-border-subtle)]">
                  {study.results.slice(0, 2).map((result) => (
                    <div key={result.metric}>
                      <div className="text-xl font-bold text-[var(--color-text-heading)] font-[family-name:var(--font-mono)]">
                        {result.value}
                      </div>
                      <div className="text-xs text-[var(--color-text-muted)]">
                        {result.metric}
                      </div>
                    </div>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
