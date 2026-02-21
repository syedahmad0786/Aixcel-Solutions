"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const GlobeScene = dynamic(() => import("./three/GlobeScene"), { ssr: false });

export default function GlobalSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      <div className="section-padding relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-accent-purple" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent-purple">
                Strategic Expertise
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight mb-6">
              Global Impact{" "}
              <span className="text-white/40">&</span>{" "}
              <span className="text-gradient">Timeline</span>
            </h2>

            <p className="text-white/50 text-lg leading-relaxed mb-8 max-w-lg">
              Operating across 55+ countries, we deliver AI solutions that power
              critical operations for organizations across every major financial hub.
            </p>

            <Link href="/mission" className="btn-primary mb-10">
              Learn More
            </Link>

            {/* Progress bar */}
            <div className="max-w-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/60 text-sm">Client Retention</span>
                <span className="text-accent-purple text-sm font-semibold">85%</span>
              </div>
              <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: "85%" } : {}}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-accent-blue to-accent-purple rounded-full"
                />
              </div>
            </div>
          </motion.div>

          {/* Right - Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            <div className="w-full aspect-square max-w-lg mx-auto">
              <GlobeScene />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
