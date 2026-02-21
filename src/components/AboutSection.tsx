"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const values = [
  {
    title: "Precision Engineering",
    description:
      "Every system we build is architected for scale, security, and performance — no shortcuts.",
    gradient: "from-accent-blue to-accent-purple",
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Trust & Compliance",
    description:
      "GDPR, SOC 2, and regulatory-first approach. Your data integrity is non-negotiable.",
    gradient: "from-accent-purple to-accent-cyan",
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Global Reach",
    description:
      "Operating across 55+ countries, serving elite institutions from Dubai to New York.",
    gradient: "from-accent-cyan to-accent-blue",
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Innovation First",
    description:
      "We don&apos;t just implement — we pioneer. Leveraging cutting-edge AI to solve tomorrow&apos;s problems.",
    gradient: "from-accent-blue to-accent-cyan",
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
];

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="mission" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-surface" />

      <div ref={ref} className="relative z-10 section-padding">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {/* Label */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8 bg-accent-purple" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent-purple">
                Our Mission
              </span>
            </div>

            {/* Mono uppercase tagline */}
            <p className="font-mono uppercase tracking-[0.15em] text-white/40 text-sm mb-4">
              We Build Intelligent Futures
            </p>

            {/* Heading */}
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-6">
              We Build{" "}
              <span className="text-gradient">Intelligent Futures</span>
            </h2>

            {/* Italic serif quote */}
            <p className="font-serif italic text-2xl md:text-3xl text-white/80 mb-8 leading-snug">
              Decisive Action. Real Impact.
            </p>

            {/* Description */}
            <p className="text-white/50 text-lg leading-relaxed mb-6">
              Aixcel Solutions was founded with a singular vision: to bridge the
              gap between cutting-edge AI capabilities and real-world business
              impact. We serve as the strategic technology partner for HNWI,
              family offices, and forward-thinking agencies who demand nothing
              less than excellence.
            </p>
            <p className="text-white/40 leading-relaxed">
              Our team of AI architects, data scientists, and automation
              engineers work at the intersection of innovation and pragmatism
              — delivering systems that don&apos;t just impress, but transform.
            </p>
          </motion.div>

          {/* Right grid — value cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.12 }}
                className="glass-panel-hover p-6 group cursor-default"
              >
                {/* Gradient border icon */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${value.gradient} p-[1px] mb-5`}
                >
                  <div className="w-full h-full rounded-xl bg-surface-100 flex items-center justify-center group-hover:bg-surface-200 transition-colors">
                    {value.icon}
                  </div>
                </div>

                <h3 className="text-white font-semibold mb-2 text-sm">
                  {value.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
