"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("./three/HeroScene"), { ssr: false });

const stats = [
  { value: "240%", label: "Average ROI" },
  { value: "500+", label: "Hours Saved / Year" },
  { value: "55+", label: "Countries Served" },
  { value: "98%", label: "Client Retention" },
];

const trustedBy = [
  "Vertex Capital",
  "Meridian Group",
  "Atlas Ventures",
  "Pinnacle Advisory",
  "Helix Partners",
];

export default function HeroSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Subtle gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface/60 via-transparent to-surface z-[1]" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-surface to-transparent z-[1]" />

      {/* Content */}
      <div className="relative z-10 w-full section-padding pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8 items-center">
          {/* Left column - Text (60%) */}
          <div className="lg:col-span-3">
            {/* Purple accent line + mono label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="h-px w-8 bg-accent-purple" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent-purple">
                Enterprise AI &middot; Automation &middot; Intelligence
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-8"
            >
              <span className="text-white">AI Solutions</span>
              <br />
              <span className="text-white">for the </span>
              <span className="text-gradient">Modern</span>
              <br />
              <span className="text-gradient">Enterprise</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-white/50 text-lg md:text-xl max-w-xl leading-relaxed mb-10"
            >
              We partner with forward-thinking organizations to deploy
              precision-engineered AI systems that drive measurable outcomes,
              automate complex workflows, and unlock strategic intelligence.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="flex flex-col sm:flex-row gap-4 mb-16"
            >
              <a href="#services" className="btn-primary">
                Explore Services
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
              <a href="#mission" className="btn-secondary">
                Our Mission
              </a>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-x-10 gap-y-6"
            >
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-2xl md:text-3xl font-serif font-semibold text-gradient">
                    {stat.value}
                  </span>
                  <span className="text-xs font-mono uppercase tracking-[0.15em] text-white/40 mt-1">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right column - 3D Scene (40%) */}
          <div className="lg:col-span-2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative w-full aspect-square max-w-lg mx-auto"
            >
              {/* Glow behind the 3D object */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.12)_0%,rgba(99,102,241,0.06)_40%,transparent_70%)] rounded-full" />
              <HeroScene />
            </motion.div>
          </div>
        </div>

        {/* Trusted by section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-24 pt-10 border-t border-white/[0.06]"
        >
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-white/30 mb-6">
            Trusted by forward-thinking teams
          </p>
          <div className="flex flex-wrap gap-x-12 gap-y-4 items-center">
            {trustedBy.map((name, i) => (
              <span
                key={i}
                className="text-sm font-mono tracking-wider text-white/20 uppercase"
              >
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
