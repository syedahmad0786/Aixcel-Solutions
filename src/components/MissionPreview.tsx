"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function MissionPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      <div className="section-padding relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          {/* Label */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-accent-purple" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent-purple">
              Mission
            </span>
          </div>

          {/* Tagline */}
          <p className="font-mono uppercase tracking-[0.15em] text-white/30 text-sm mb-6">
            We Build Intelligent Futures
          </p>

          {/* Large italic text */}
          <p className="font-serif italic text-3xl md:text-4xl lg:text-5xl text-white/80 leading-[1.2] mb-6">
            Decisive Action. Real Impact.
          </p>
          <p className="font-serif italic text-xl md:text-2xl text-white/50 leading-relaxed">
            Empowering your organization to lead in the age of intelligence.
            We don&apos;t just advise; we execute and transform.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
