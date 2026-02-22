"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeUp, { Arrow } from "@/components/FadeUp";

const values = [
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    ),
    title: "Precision Over Speed",
    desc: "Every system is architected for scale, security, and performance. We don't ship fast and fix later — we ship right and iterate deliberately.",
  },
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    ),
    title: "Trust & Compliance First",
    desc: "GDPR awareness, data encryption, and a regulatory-first approach underpin everything we build. Your data integrity and privacy are non-negotiable.",
  },
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
    title: "Global From Day One",
    desc: "Serving organizations across 55+ countries — from Dubai to New York, Singapore to London. Built for teams that operate across borders and time zones.",
  },
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    ),
    title: "Outcomes, Not Outputs",
    desc: "We measure success by the impact we deliver — not hours logged or lines shipped. Every engagement starts with a clear definition of what 'done' looks like.",
  },
];

const stats = [
  { value: "240%", label: "Average ROI" },
  { value: "500+", label: "Hours Saved Monthly" },
  { value: "55+", label: "Countries Served" },
  { value: "97%", label: "Client Retention" },
];

const milestones = [
  {
    year: "2023",
    title: "Founded",
    desc: "Aixcel Solutions launched with a focus on AI automation for financial services firms across the Middle East.",
  },
  {
    year: "2024",
    title: "Expansion",
    desc: "Expanded services to include Voice AI and custom platform development. Grew to serve clients across 30+ countries.",
  },
  {
    year: "2025",
    title: "Scale",
    desc: "Launched Fynora.ai, our incubated fintech product. Crossed 55+ countries served and 500+ hours saved monthly for clients.",
  },
  {
    year: "2026",
    title: "Today",
    desc: "Building the next generation of enterprise AI systems — autonomous agents, predictive intelligence, and integrated platforms.",
  },
];

export default function MissionPage() {
  return (
    <>
      <Navbar />
      <main className="noise">
        {/* Hero */}
        <section className="hero-mesh relative pt-44 pb-28 md:pt-56 md:pb-36 lg:pt-64 lg:pb-40 overflow-hidden">
          <div className="glow w-[700px] h-[700px] bg-accent/15 -top-[250px] left-1/2 -translate-x-1/2" />
          <div className="container relative z-10">
            <FadeUp>
              <div className="section-label">About Aixcel</div>
            </FadeUp>
            <FadeUp delay={0.06}>
              <h1 className="text-[clamp(42px,7vw,80px)] font-bold leading-[1.02] tracking-[-0.035em] max-w-[780px] mb-10">
                We build{" "}
                <span className="text-gradient">intelligent systems</span>{" "}
                that deliver
              </h1>
            </FadeUp>
            <FadeUp delay={0.12}>
              <p className="text-text-secondary text-[17px] md:text-[20px] leading-[1.85] max-w-[640px]">
                Aixcel Solutions is an AI automation firm that bridges the gap
                between cutting-edge AI capabilities and real-world business
                impact. We serve as the strategic technology partner for
                organizations that demand measurable results — not demos.
              </p>
            </FadeUp>
          </div>
        </section>

        <div className="container">
          <div className="divider-gradient" />
        </div>

        {/* Founder Section */}
        <section className="section-padding">
          <div className="container">
            <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16 lg:gap-24">
              <div>
                <FadeUp>
                  <div className="section-label">The Founder</div>
                </FadeUp>
                <FadeUp delay={0.06}>
                  <h2 className="section-heading mb-8">Ahmad Bukhari</h2>
                </FadeUp>
                <FadeUp delay={0.1}>
                  <p className="font-mono text-[12px] font-medium uppercase tracking-[0.12em] text-accent mb-8">
                    Founder & CEO
                  </p>
                </FadeUp>
                <FadeUp delay={0.14}>
                  <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-accent/20 to-[#A78BFA]/20 border border-accent/20 flex items-center justify-center mb-10">
                    <span className="text-[28px] font-mono font-bold text-accent">
                      AB
                    </span>
                  </div>
                </FadeUp>
              </div>
              <div className="lg:pt-12">
                <FadeUp delay={0.1}>
                  <p className="text-text-secondary text-[16px] leading-[1.9] mb-8">
                    I started Aixcel because I kept seeing the same problem:
                    businesses spending hundreds of thousands on consultants who
                    delivered PowerPoints, not systems. I wanted to build a firm
                    that actually ships — where every engagement ends with a
                    working product in production, not a roadmap gathering dust.
                  </p>
                </FadeUp>
                <FadeUp delay={0.14}>
                  <p className="text-text-secondary text-[16px] leading-[1.9] mb-8">
                    My background is in AI engineering and enterprise automation.
                    Before Aixcel, I spent years building data pipelines,
                    deploying ML models, and designing workflow systems for
                    businesses across financial services, healthcare, and
                    technology.
                  </p>
                </FadeUp>
                <FadeUp delay={0.18}>
                  <p className="text-text-secondary text-[16px] leading-[1.9] mb-10">
                    Today, Aixcel serves organizations across 55+ countries. We
                    work with a lean, senior team of AI architects, data
                    engineers, and automation specialists — no juniors, no
                    outsourcing, no filler. Every person who touches your project
                    can build production-grade systems end to end.
                  </p>
                </FadeUp>
                <FadeUp delay={0.22}>
                  <div className="flex items-center gap-4">
                    <Link href="/contact" className="btn-primary">
                      Work With Us <Arrow />
                    </Link>
                    <a
                      href="mailto:ahmad.bukhari@aixcelsolutions.com"
                      className="btn-secondary"
                    >
                      Email Directly
                    </a>
                  </div>
                </FadeUp>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding bg-bg-subtle border-y border-border">
          <div className="container">
            <FadeUp>
              <div className="section-label">What We Stand For</div>
            </FadeUp>
            <FadeUp delay={0.06}>
              <h2 className="section-heading section-header-gap max-w-xl">
                Principles that guide every engagement
              </h2>
            </FadeUp>
            <div className="grid sm:grid-cols-2 gap-6 max-w-5xl">
              {values.map((v, i) => (
                <FadeUp key={v.title} delay={0.08 * i}>
                  <div className="card-glass p-9 md:p-12 h-full group">
                    <div className="w-14 h-14 rounded-2xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-center text-text-secondary mb-8 group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-all duration-400">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        {v.icon}
                      </svg>
                    </div>
                    <h3 className="text-[18px] font-bold text-text mb-4">
                      {v.title}
                    </h3>
                    <p className="text-text-secondary text-[15px] leading-[1.8]">
                      {v.desc}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="section-padding">
          <div className="container">
            <FadeUp>
              <div className="section-label">By The Numbers</div>
            </FadeUp>
            <FadeUp delay={0.06}>
              <h2 className="section-heading section-header-gap max-w-xl">
                Measurable impact, every time
              </h2>
            </FadeUp>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((s, i) => (
                <FadeUp key={s.label} delay={0.08 * i}>
                  <div className="card-glass p-9 md:p-14 text-center">
                    <p className="stat-number text-gradient mb-5">
                      {s.value}
                    </p>
                    <p className="text-[12px] font-mono text-text-muted tracking-[0.08em] uppercase">
                      {s.label}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="section-padding bg-bg-subtle border-y border-border relative">
          <div className="blueprint-grid absolute inset-0 pointer-events-none" />
          <div className="container relative z-10">
            <FadeUp>
              <div className="section-label">Our Journey</div>
            </FadeUp>
            <FadeUp delay={0.06}>
              <h2 className="section-heading section-header-gap max-w-xl">
                Building since 2023
              </h2>
            </FadeUp>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {milestones.map((m, i) => (
                <FadeUp key={m.year} delay={0.08 * i}>
                  <div className="card-glass p-9 md:p-10 h-full">
                    <span className="text-[32px] font-bold tracking-[-0.03em] text-gradient leading-none block mb-6">
                      {m.year}
                    </span>
                    <h3 className="text-[17px] font-bold text-text mb-4">
                      {m.title}
                    </h3>
                    <p className="text-text-secondary text-[14px] leading-[1.8]">
                      {m.desc}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="hero-mesh relative py-36 md:py-48 lg:py-56 overflow-hidden">
          <div className="glow w-[700px] h-[700px] bg-accent/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <div className="container relative z-10 text-center">
            <FadeUp>
              <h2 className="text-[clamp(34px,5.5vw,64px)] font-bold tracking-[-0.035em] mb-8 max-w-3xl mx-auto leading-[1.05]">
                Partner with us
              </h2>
            </FadeUp>
            <FadeUp delay={0.06}>
              <p className="text-text-secondary text-[17px] md:text-[19px] leading-[1.8] max-w-lg mx-auto mb-14">
                Join the organizations that trust Aixcel to deliver AI systems
                with real, measurable impact. Let&apos;s build something that
                works.
              </p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="flex flex-wrap items-center justify-center gap-5">
                <Link href="/contact" className="btn-primary">
                  Start a Conversation <Arrow />
                </Link>
                <Link href="/services" className="btn-secondary">
                  Explore Services <Arrow />
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
