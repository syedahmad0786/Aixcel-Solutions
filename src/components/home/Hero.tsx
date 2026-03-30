"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { heroMetrics } from "@/data/metrics";

const headingWords = "We automate the work that slows your business down".split(" ");

export default function Hero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[var(--color-accent)] opacity-[0.04] rounded-full blur-[120px]" />
        {/* Secondary glow */}
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--color-secondary)] opacity-[0.03] rounded-full blur-[100px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(var(--color-border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--color-border-subtle) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="container-main relative z-10 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-[var(--color-border-visible)] bg-[var(--color-bg-elevated)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
            <span className="text-xs font-medium text-[var(--color-text-muted)] tracking-wide">
              AI Automation Architect &bull; 50+ Clients &bull; 12 Industries
            </span>
          </motion.div>

          {/* Heading — word by word reveal */}
          <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.08] tracking-tight mb-6">
            {headingWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.2 + i * 0.06,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="inline-block mr-[0.3em]"
              >
                {word === "automate" ? (
                  <span className="gradient-text">{word}</span>
                ) : (
                  <span className="text-[var(--color-text-heading)]">{word}</span>
                )}
              </motion.span>
            ))}
          </h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-lg md:text-xl text-[var(--color-text-body)] max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Production-grade AI agents, voice systems, and enterprise automations
            that deliver ROI in 90 days — not 12 months.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link href="/book" className="btn-primary text-base px-8 py-4">
              Book a Discovery Call
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/case-studies" className="btn-ghost text-base px-8 py-4">
              <Play className="w-4 h-4" />
              See Our Work
            </Link>
          </motion.div>

          {/* Floating Metrics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex items-center justify-center gap-8 md:gap-12"
          >
            {heroMetrics.map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 1.3 + i * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl font-bold text-[var(--color-text-heading)] font-[var(--font-mono)]">
                  {metric.value}
                </div>
                <div className="text-xs text-[var(--color-text-muted)] mt-1 tracking-wide">
                  {metric.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-[var(--color-border-visible)] flex items-start justify-center p-1.5"
        >
          <motion.div className="w-1 h-1.5 rounded-full bg-[var(--color-accent)]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
