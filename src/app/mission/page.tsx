"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

const values = [
  {
    title: "Precision Engineering",
    description:
      "Every system we build is architected for scale, security, and performance. No shortcuts, no compromises -- just robust solutions that stand the test of enterprise demands.",
    gradient: "from-[#6366F1] to-[#8B5CF6]",
    icon: (
      <svg
        className="w-5 h-5 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    title: "Trust & Compliance",
    description:
      "GDPR, SOC 2, and a regulatory-first approach underpin everything we deliver. Your data integrity and privacy are non-negotiable pillars of our partnership.",
    gradient: "from-[#8B5CF6] to-[#06B6D4]",
    icon: (
      <svg
        className="w-5 h-5 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    title: "Global Reach",
    description:
      "Operating across 55+ countries, serving elite institutions from Dubai to New York, Singapore to London. Wherever your operations extend, we deliver.",
    gradient: "from-[#06B6D4] to-[#6366F1]",
    icon: (
      <svg
        className="w-5 h-5 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Innovation First",
    description:
      "We don&apos;t just implement -- we pioneer. Leveraging cutting-edge AI research and emerging technologies to solve tomorrow&apos;s challenges today.",
    gradient: "from-[#6366F1] to-[#06B6D4]",
    icon: (
      <svg
        className="w-5 h-5 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
  },
];

const stats = [
  { value: "240%", label: "Average ROI", suffix: "" },
  { value: "500+", label: "Hours Saved", suffix: "" },
  { value: "55+", label: "Countries", suffix: "" },
  { value: "98%", label: "Retention", suffix: "" },
];

const team = [
  {
    initials: "AK",
    name: "Arjun Kapoor",
    role: "CEO & Founder",
    bio: "Former AI lead at a Big Four consultancy. 12+ years driving enterprise transformation for HNWI and institutional clients across global markets.",
    gradient: "from-[#6366F1] to-[#8B5CF6]",
  },
  {
    initials: "SM",
    name: "Sofia Martinez",
    role: "CTO",
    bio: "Ex-Google engineer specializing in distributed AI systems. Architect behind our autonomous workflow engine and voice AI infrastructure.",
    gradient: "from-[#8B5CF6] to-[#06B6D4]",
  },
  {
    initials: "DL",
    name: "David Lin",
    role: "Head of Data Science",
    bio: "PhD in Machine Learning from MIT. Leads our predictive analytics and data intelligence practice, delivering 240%+ ROI for clients.",
    gradient: "from-[#06B6D4] to-[#6366F1]",
  },
  {
    initials: "NR",
    name: "Nadia Rahman",
    role: "VP of Client Strategy",
    bio: "Decade of experience in wealth management technology. Ensures every engagement is aligned with client objectives and delivers measurable outcomes.",
    gradient: "from-[#6366F1] to-[#06B6D4]",
  },
];

export default function MissionPage() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const valuesRef = useRef(null);
  const valuesInView = useInView(valuesRef, { once: true, margin: "-100px" });
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const teamRef = useRef(null);
  const teamInView = useInView(teamRef, { once: true, margin: "-100px" });
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  return (
    <>
      <Navbar />
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative pt-40 pb-20 overflow-hidden">
          <div className="section-padding relative z-10">
            <motion.div
              ref={heroRef}
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              {/* Purple accent line + label */}
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-8 bg-accent-purple" />
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent-purple">
                  Mission
                </span>
              </div>

              {/* Heading */}
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6">
                We Build{" "}
                <span className="text-gradient">Intelligent Futures</span>
              </h1>

              {/* Italic serif quote */}
              <p className="font-serif italic text-2xl md:text-3xl lg:text-4xl text-white/80 mb-8 leading-snug">
                Decisive Action. Real Impact.
              </p>

              {/* Description */}
              <p className="text-white/50 text-lg md:text-xl max-w-2xl leading-relaxed mb-4">
                Aixcel Solutions was founded with a singular vision: to bridge
                the gap between cutting-edge AI capabilities and real-world
                business impact. We serve as the strategic technology partner for
                HNWI, family offices, and forward-thinking agencies who demand
                nothing less than excellence.
              </p>
              <p className="text-white/40 text-base max-w-2xl leading-relaxed">
                Our team of AI architects, data scientists, and automation
                engineers work at the intersection of innovation and pragmatism
                -- delivering systems that don&apos;t just impress, but
                transform how organizations operate at every level.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Glow divider */}
        <div className="section-padding">
          <div className="glow-line" />
        </div>

        {/* Values Grid */}
        <section className="relative py-24 overflow-hidden">
          <div className="section-padding relative z-10">
            <motion.div
              ref={valuesRef}
              initial={{ opacity: 0, y: 30 }}
              animate={valuesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="mb-14"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-8 bg-accent-purple" />
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent-purple">
                  Our Values
                </span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white leading-tight max-w-2xl">
                Principles That{" "}
                <span className="text-gradient">Guide Us</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl">
              {values.map((value, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.12 }}
                  className="glass-panel-hover p-7 group cursor-default"
                >
                  {/* Gradient border icon */}
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${value.gradient} p-[1px] mb-5`}
                  >
                    <div className="w-full h-full rounded-xl bg-surface-100 flex items-center justify-center group-hover:bg-surface-200 transition-colors">
                      {value.icon}
                    </div>
                  </div>

                  <h3 className="text-white font-semibold mb-2">
                    {value.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Glow divider */}
        <div className="section-padding">
          <div className="glow-line" />
        </div>

        {/* Stats Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="section-padding relative z-10">
            <motion.div
              ref={statsRef}
              initial={{ opacity: 0, y: 30 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="mb-14"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-8 bg-accent-purple" />
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent-purple">
                  By the Numbers
                </span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white leading-tight max-w-2xl">
                Measurable <span className="text-gradient">Impact</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
                  className="glass-panel p-8 text-center"
                >
                  <p className="text-gradient font-serif text-4xl md:text-5xl font-bold mb-2">
                    {stat.value}
                  </p>
                  <p className="text-white/40 text-sm font-mono uppercase tracking-[0.15em]">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Glow divider */}
        <div className="section-padding">
          <div className="glow-line" />
        </div>

        {/* Team Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="section-padding relative z-10">
            <motion.div
              ref={teamRef}
              initial={{ opacity: 0, y: 30 }}
              animate={teamInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="mb-14"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-8 bg-accent-purple" />
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent-purple">
                  Team
                </span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white leading-tight max-w-2xl">
                Our <span className="text-gradient">Leadership</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={teamInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
                  className="glass-panel-hover p-7 group cursor-default"
                >
                  {/* Avatar circle */}
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${member.gradient} p-[1px] mb-5`}
                  >
                    <div className="w-full h-full rounded-full bg-surface-100 flex items-center justify-center group-hover:bg-surface-200 transition-colors">
                      <span className="text-white/80 font-semibold text-lg font-mono">
                        {member.initials}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-white font-semibold mb-0.5">
                    {member.name}
                  </h3>
                  <p className="text-accent-purple text-xs font-mono uppercase tracking-[0.15em] mb-3">
                    {member.role}
                  </p>
                  <p className="text-white/40 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Glow divider */}
        <div className="section-padding">
          <div className="glow-line" />
        </div>

        {/* CTA Section */}
        <section className="relative py-32 overflow-hidden">
          <div className="section-padding relative z-10">
            <motion.div
              ref={ctaRef}
              initial={{ opacity: 0, y: 40 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-6 leading-tight">
                Partner With{" "}
                <span className="text-gradient">Us</span>
              </h2>
              <p className="text-white/40 text-lg leading-relaxed mb-10">
                Join the organizations that trust Aixcel Solutions to deliver
                AI systems with real, measurable impact. Let&apos;s build
                something extraordinary together.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link href="/contact" className="btn-primary">
                  Start a Conversation
                </Link>
                <Link href="/services" className="btn-secondary">
                  Explore Services
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}
