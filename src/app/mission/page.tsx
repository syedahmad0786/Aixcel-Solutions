"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

const values = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Precision Engineering",
    description:
      "Every system we build is architected for scale, security, and performance. No shortcuts, no compromises — just robust solutions that stand the test of enterprise demands.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Trust & Compliance",
    description:
      "GDPR, SOC 2, and a regulatory-first approach underpin everything we deliver. Your data integrity and privacy are non-negotiable pillars of our partnership.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Global Reach",
    description:
      "Operating across 55+ countries, serving forward-thinking organizations from Dubai to New York, Singapore to London. Wherever your operations extend, we deliver.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "Innovation First",
    description:
      "We don't just implement — we pioneer. Leveraging cutting-edge AI research and emerging technologies to solve tomorrow's challenges today.",
  },
];

const stats = [
  { value: "240%", label: "Average ROI" },
  { value: "500+", label: "Hours Saved" },
  { value: "55+", label: "Countries" },
  { value: "98%", label: "Retention" },
];

const team = [
  {
    initials: "AK",
    name: "Arjun Kapoor",
    role: "CEO & Founder",
    bio: "Former AI lead at a Big Four consultancy. 12+ years driving enterprise transformation for institutional clients across global markets.",
  },
  {
    initials: "SM",
    name: "Sofia Martinez",
    role: "CTO",
    bio: "Ex-Google engineer specializing in distributed AI systems. Architect behind our autonomous workflow engine and voice AI infrastructure.",
  },
  {
    initials: "DL",
    name: "David Lin",
    role: "Head of Data Science",
    bio: "PhD in Machine Learning from MIT. Leads our predictive analytics and data intelligence practice, delivering 240%+ ROI for clients.",
  },
  {
    initials: "NR",
    name: "Nadia Rahman",
    role: "VP of Client Strategy",
    bio: "Decade of experience in wealth management technology. Ensures every engagement delivers measurable outcomes aligned with client objectives.",
  },
];

export default function MissionPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="container">
            <FadeUp>
              <p className="section-label">About Us</p>
            </FadeUp>
            <FadeUp delay={0.05}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary leading-[1.08] mb-6 max-w-3xl">
                We build intelligent futures
              </h1>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-xl md:text-2xl text-secondary italic mb-6 max-w-2xl">
                Decisive action. Real impact.
              </p>
            </FadeUp>
            <FadeUp delay={0.15}>
              <p className="text-secondary text-lg leading-relaxed max-w-2xl mb-4">
                Aixcel Solutions was founded with a singular vision: to bridge
                the gap between cutting-edge AI capabilities and real-world
                business impact. We serve as the strategic technology partner for
                forward-thinking organizations who demand nothing less than
                excellence.
              </p>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="text-muted text-base leading-relaxed max-w-2xl">
                Our team of AI architects, data scientists, and automation
                engineers work at the intersection of innovation and pragmatism
                — delivering systems that don&apos;t just impress, but
                transform how organizations operate at every level.
              </p>
            </FadeUp>
          </div>
        </section>

        {/* Divider */}
        <div className="container"><div className="divider" /></div>

        {/* Values */}
        <section className="py-20 md:py-28">
          <div className="container">
            <FadeUp>
              <p className="section-label">Our Values</p>
            </FadeUp>
            <FadeUp delay={0.05}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-primary mb-14 max-w-2xl">
                Principles that guide us
              </h2>
            </FadeUp>

            <div className="grid sm:grid-cols-2 gap-5 max-w-4xl">
              {values.map((value, i) => (
                <FadeUp key={value.title} delay={0.08 * i}>
                  <div className="card p-7 h-full group">
                    <div className="w-11 h-11 rounded-lg border border-border flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-200">
                      {value.icon}
                    </div>
                    <h3 className="text-base font-semibold text-primary mb-2">
                      {value.title}
                    </h3>
                    <p className="text-secondary text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 md:py-28 bg-bg-alt border-y border-border">
          <div className="container">
            <FadeUp>
              <p className="section-label">By The Numbers</p>
            </FadeUp>
            <FadeUp delay={0.05}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-primary mb-14 max-w-2xl">
                Measurable impact
              </h2>
            </FadeUp>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {stats.map((stat, i) => (
                <FadeUp key={stat.label} delay={0.08 * i}>
                  <div className="card p-8 text-center">
                    <p className="text-4xl md:text-5xl font-bold text-primary mb-2">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted font-mono">
                      {stat.label}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 md:py-28">
          <div className="container">
            <FadeUp>
              <p className="section-label">Team</p>
            </FadeUp>
            <FadeUp delay={0.05}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-primary mb-14 max-w-2xl">
                Our leadership
              </h2>
            </FadeUp>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {team.map((member, i) => (
                <FadeUp key={member.name} delay={0.08 * i}>
                  <div className="card p-7 h-full">
                    <div className="w-14 h-14 rounded-full bg-bg-alt border border-border flex items-center justify-center mb-5">
                      <span className="text-sm font-mono font-semibold text-muted">
                        {member.initials}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-primary mb-0.5">
                      {member.name}
                    </h3>
                    <p className="text-xs font-mono text-muted uppercase tracking-wider mb-3">
                      {member.role}
                    </p>
                    <p className="text-secondary text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 bg-bg-dark text-white">
          <div className="container text-center">
            <FadeUp>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 max-w-2xl mx-auto">
                Partner with us
              </h2>
            </FadeUp>
            <FadeUp delay={0.05}>
              <p className="text-white/60 text-lg leading-relaxed max-w-xl mx-auto mb-10">
                Join the organizations that trust Aixcel Solutions to deliver AI
                systems with real, measurable impact. Let&apos;s build something
                extraordinary together.
              </p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/contact" className="btn-primary-light">
                  Start a Conversation <ArrowRight />
                </Link>
                <Link href="/services" className="btn-secondary-light">
                  Explore Services <ArrowRight />
                </Link>
              </div>
            </FadeUp>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
