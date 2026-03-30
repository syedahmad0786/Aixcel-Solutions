"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const HeroScene = dynamic(() => import("./three/HeroScene"), { ssr: false });

export default function HeroSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });

  return (
    <section ref={sectionRef} className="relative min-h-screen pt-24 pb-16 overflow-hidden">
      <div className="section-padding relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-start">
          {/* Left Column - Hero Text */}
          <div className="flex flex-col justify-center min-h-[80vh]">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight mb-6"
            >
              AI Solutions for the{" "}
              <span className="text-gradient">Modern Enterprise</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="text-white/50 text-lg max-w-lg leading-relaxed mb-8"
            >
              We partner with forward-thinking organizations to deploy
              precision-engineered AI systems that drive measurable outcomes
              and unlock strategic intelligence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/services" className="btn-primary">
                Explore Services
                <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="/mission" className="btn-secondary">
                Our Mission
              </Link>
            </motion.div>
          </div>

          {/* Right Column - 3D + Cards */}
          <div className="flex flex-col gap-6">
            {/* 3D Visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative w-full aspect-[4/3] max-w-lg mx-auto lg:ml-auto"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.12)_0%,rgba(99,102,241,0.06)_40%,transparent_70%)] rounded-full" />
              <HeroScene />
            </motion.div>

            {/* Service Cards - 2 side by side */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-2 gap-4"
            >
              {/* AI Consulting */}
              <Link href="/services" className="glass-panel-hover p-5 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 border border-accent-purple/20 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-sm mb-2">AI Consulting</h3>
                <p className="text-white/40 text-xs leading-relaxed mb-3">
                  Strategic AI roadmaps and implementation guidance for enterprise transformation.
                </p>
                <span className="text-accent-purple text-xs group-hover:underline">Learn More</span>
              </Link>

              {/* Custom Software */}
              <Link href="/services" className="glass-panel-hover p-5 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-blue/20 border border-accent-cyan/20 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-accent-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-sm mb-2">Custom Software</h3>
                <p className="text-white/40 text-xs leading-relaxed mb-3">
                  Bespoke AI-powered platforms and tools designed for your workflows.
                </p>
                <span className="text-accent-cyan text-xs group-hover:underline">Learn More</span>
              </Link>
            </motion.div>

            {/* Compliance Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="flex gap-3"
            >
              {[
                { label: "ISO", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
                { label: "GDPR", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
                { label: "Security", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
              ].map((badge) => (
                <div key={badge.label} className="flex-1 glass-panel p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent-purple/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={badge.icon} />
                    </svg>
                  </div>
                  <span className="text-white/60 text-xs font-medium">{badge.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Case Study Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="glass-panel-hover p-5 group cursor-pointer">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-white/40 uppercase tracking-wider">Case Study</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/20">
                    Verified
                  </span>
                </div>
                <h3 className="text-white font-semibold mb-2">
                  Decisive Action. Real Impact.
                </h3>
                <p className="text-white/40 text-sm mb-4 leading-relaxed">
                  See how we helped a global family office achieve 240% ROI through intelligent automation.
                </p>
                <span className="text-accent-purple text-sm group-hover:underline">
                  View Case Study &rarr;
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
