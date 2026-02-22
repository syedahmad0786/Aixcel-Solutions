"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

function Arrow() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>;
}

const values = [
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />,
    title: "Precision Engineering",
    desc: "Every system architected for scale, security, and performance. No shortcuts — just robust solutions that stand the test of enterprise demands.",
  },
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    title: "Trust & Compliance",
    desc: "GDPR, SOC 2, and a regulatory-first approach underpin everything we deliver. Your data integrity and privacy are non-negotiable.",
  },
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    title: "Global Reach",
    desc: "Operating across 55+ countries, serving forward-thinking organizations from Dubai to New York, Singapore to London.",
  },
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
    title: "Innovation First",
    desc: "We don't just implement — we pioneer. Leveraging cutting-edge AI research and emerging technologies to solve tomorrow's challenges today.",
  },
];

const stats = [
  { value: "240%", label: "Average ROI" },
  { value: "500+", label: "Hours Saved" },
  { value: "55+", label: "Countries" },
  { value: "98%", label: "Retention" },
];

const team = [
  { initials: "AK", name: "Arjun Kapoor", role: "CEO & Founder", bio: "Former AI lead at a Big Four consultancy. 12+ years driving enterprise transformation for institutional clients across global markets." },
  { initials: "SM", name: "Sofia Martinez", role: "CTO", bio: "Ex-Google engineer specializing in distributed AI systems. Architect behind our autonomous workflow engine and voice AI infrastructure." },
  { initials: "DL", name: "David Lin", role: "Head of Data Science", bio: "PhD in Machine Learning from MIT. Leads our predictive analytics and data intelligence practice, delivering 240%+ ROI." },
  { initials: "NR", name: "Nadia Rahman", role: "VP of Client Strategy", bio: "Decade of experience in wealth management technology. Ensures every engagement delivers measurable outcomes." },
];

export default function MissionPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-36 pb-20 md:pt-44 md:pb-24 overflow-hidden">
          <div className="glow w-[500px] h-[500px] bg-accent/15 -top-[150px] left-1/2 -translate-x-1/2" />
          <div className="container relative z-10">
            <FadeUp>
              <div className="section-label">About Us</div>
            </FadeUp>
            <FadeUp delay={0.06}>
              <h1 className="text-[clamp(36px,5.5vw,64px)] font-bold leading-[1.06] tracking-[-0.025em] max-w-[700px] mb-7">
                We build{" "}
                <span className="text-gradient">intelligent futures</span>
              </h1>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-[20px] italic text-text-secondary mb-7 max-w-lg">
                Decisive action. Real impact.
              </p>
            </FadeUp>
            <FadeUp delay={0.14}>
              <p className="text-text-secondary text-[16px] leading-[1.75] max-w-xl mb-5">
                Aixcel Solutions was founded with a singular vision: to bridge
                the gap between cutting-edge AI capabilities and real-world
                business impact. We serve as the strategic technology partner
                for forward-thinking organizations who demand nothing less
                than excellence.
              </p>
            </FadeUp>
            <FadeUp delay={0.18}>
              <p className="text-text-muted text-[15px] leading-[1.75] max-w-xl">
                Our team of AI architects, data scientists, and automation
                engineers work at the intersection of innovation and pragmatism
                — delivering systems that don&apos;t just impress, but
                transform how organizations operate at every level.
              </p>
            </FadeUp>
          </div>
        </section>

        <div className="container"><div className="divider-gradient" /></div>

        {/* Values */}
        <section className="py-24 md:py-32">
          <div className="container">
            <FadeUp><div className="section-label">Our Values</div></FadeUp>
            <FadeUp delay={0.06}>
              <h2 className="text-[clamp(28px,4vw,48px)] font-bold tracking-[-0.02em] mb-16 max-w-xl">
                Principles that guide us
              </h2>
            </FadeUp>
            <div className="grid sm:grid-cols-2 gap-5 max-w-4xl">
              {values.map((v, i) => (
                <FadeUp key={v.title} delay={0.08 * i}>
                  <div className="card p-7 md:p-8 h-full group">
                    <div className="w-11 h-11 rounded-xl border border-border flex items-center justify-center text-text-secondary mb-6 group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-all duration-300">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">{v.icon}</svg>
                    </div>
                    <h3 className="text-[16px] font-semibold text-text mb-3">{v.title}</h3>
                    <p className="text-text-secondary text-[14px] leading-[1.7]">{v.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-24 md:py-32 bg-bg-subtle border-y border-border">
          <div className="container">
            <FadeUp><div className="section-label">By The Numbers</div></FadeUp>
            <FadeUp delay={0.06}>
              <h2 className="text-[clamp(28px,4vw,48px)] font-bold tracking-[-0.02em] mb-16 max-w-xl">
                Measurable impact
              </h2>
            </FadeUp>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {stats.map((s, i) => (
                <FadeUp key={s.label} delay={0.08 * i}>
                  <div className="card p-8 md:p-10 text-center">
                    <p className="text-[40px] md:text-[52px] font-bold tracking-[-0.03em] text-gradient leading-none mb-3">{s.value}</p>
                    <p className="text-[13px] font-mono text-text-muted tracking-wide">{s.label}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-24 md:py-32">
          <div className="container">
            <FadeUp><div className="section-label">Team</div></FadeUp>
            <FadeUp delay={0.06}>
              <h2 className="text-[clamp(28px,4vw,48px)] font-bold tracking-[-0.02em] mb-16 max-w-xl">
                Our leadership
              </h2>
            </FadeUp>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {team.map((m, i) => (
                <FadeUp key={m.name} delay={0.08 * i}>
                  <div className="card p-7 md:p-8 h-full">
                    <div className="w-14 h-14 rounded-full bg-bg-elevated border border-border flex items-center justify-center mb-6">
                      <span className="text-[13px] font-mono font-semibold text-text-muted">{m.initials}</span>
                    </div>
                    <h3 className="text-[15px] font-semibold text-text mb-1">{m.name}</h3>
                    <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-accent mb-4">{m.role}</p>
                    <p className="text-text-secondary text-[13px] leading-[1.7]">{m.bio}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-28 md:py-36 border-t border-border overflow-hidden">
          <div className="glow w-[500px] h-[500px] bg-accent/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <div className="container relative z-10 text-center">
            <FadeUp>
              <h2 className="text-[clamp(28px,5vw,52px)] font-bold tracking-[-0.02em] mb-6 max-w-2xl mx-auto">
                Partner with us
              </h2>
            </FadeUp>
            <FadeUp delay={0.06}>
              <p className="text-text-secondary text-[17px] leading-[1.75] max-w-lg mx-auto mb-10">
                Join the organizations that trust Aixcel to deliver AI systems
                with real, measurable impact. Let&apos;s build something
                extraordinary.
              </p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/contact" className="btn-primary">Start a Conversation <Arrow /></Link>
                <Link href="/services" className="btn-secondary">Explore Services <Arrow /></Link>
              </div>
            </FadeUp>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
