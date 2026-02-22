"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
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

function Arrow({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>;
}

const featured = {
  category: "AI Strategy",
  title: "Why Forward-Thinking Companies Are Betting Big on Private AI Infrastructure",
  excerpt: "Organizations are moving away from public AI services. Private AI deployment is becoming the new frontier for companies seeking competitive advantages, data sovereignty, and bespoke intelligence systems.",
  author: "Aixcel Research Team",
  date: "Feb 2026",
};

const articles = [
  { category: "AI Strategy", title: "Building an AI-First Organization: A Leadership Playbook", excerpt: "How forward-thinking executives are restructuring organizations around AI capabilities to unlock exponential growth.", date: "Feb 2026" },
  { category: "Automation ROI", title: "The Hidden Cost of Not Automating: A $2M Wake-Up Call", excerpt: "How one enterprise discovered they were burning $2M annually on manual processes that AI could handle in seconds.", date: "Jan 2026" },
  { category: "Voice AI", title: "Voice AI in 2026: Beyond Chatbots to Autonomous Agents", excerpt: "How voice-first AI interfaces are evolving from simple assistants into fully autonomous agents.", date: "Jan 2026" },
  { category: "Data Intelligence", title: "From Data Warehouses to Intelligence Engines", excerpt: "Why traditional data infrastructure is failing modern enterprises, and how AI-native architectures deliver 10x faster insights.", date: "Dec 2025" },
  { category: "Enterprise AI", title: "Scaling AI Across the Enterprise Without Breaking Things", excerpt: "A practical framework for rolling out AI capabilities department by department while maintaining security and compliance.", date: "Dec 2025" },
  { category: "Compliance", title: "AI Governance in 2026: What Your Board Needs to Know", excerpt: "With new EU AI regulations taking effect, here's your guide to staying compliant while maximizing AI potential.", date: "Nov 2025" },
];

export default function InsightsPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="hero-mesh relative pt-40 pb-20 md:pt-52 md:pb-28 overflow-hidden">
          <div className="glow w-[600px] h-[600px] bg-accent/15 -top-[200px] left-1/2 -translate-x-1/2" />
          <div className="container relative z-10">
            <FadeUp>
              <div className="section-label">Insights</div>
            </FadeUp>
            <FadeUp delay={0.06}>
              <h1 className="text-[clamp(40px,6vw,72px)] font-extrabold leading-[1.02] tracking-[-0.03em] mb-8">
                Knowledge Hub
              </h1>
            </FadeUp>
            <FadeUp delay={0.12}>
              <p className="text-text-secondary text-[17px] md:text-[19px] leading-[1.8] max-w-xl">
                Deep dives into AI strategy, automation frameworks, and
                enterprise intelligence. Curated insights from the front lines
                of AI transformation.
              </p>
            </FadeUp>
          </div>
        </section>

        {/* Featured */}
        <section className="pb-20 md:pb-28">
          <div className="container">
            <FadeUp>
              <article className="card-glass overflow-hidden cursor-pointer group">
                {/* Banner */}
                <div className="h-52 md:h-72 bg-gradient-to-br from-bg-elevated/50 via-bg-card/30 to-bg-elevated/50 flex items-center justify-center border-b border-white/[0.04]">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-text-muted group-hover:border-accent group-hover:text-accent transition-all duration-400">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                </div>

                <div className="p-8 md:p-12">
                  <span className="font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-accent">
                    {featured.category} — Featured
                  </span>

                  <h2 className="text-[24px] md:text-[32px] font-extrabold text-text mt-5 mb-5 leading-snug tracking-[-0.02em] group-hover:text-text-secondary transition-colors">
                    {featured.title}
                  </h2>

                  <p className="text-text-muted text-[15px] leading-[1.8] mb-10 max-w-2xl">
                    {featured.excerpt}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                        <span className="text-[11px] font-mono font-semibold text-text-muted">AX</span>
                      </div>
                      <div>
                        <p className="text-[14px] font-medium text-text">{featured.author}</p>
                        <p className="text-[12px] font-mono text-text-muted">{featured.date}</p>
                      </div>
                    </div>
                    <span className="btn-primary text-[13px] px-6 py-3">
                      Read Article <Arrow />
                    </span>
                  </div>
                </div>
              </article>
            </FadeUp>
          </div>
        </section>

        <div className="container"><div className="divider-gradient" /></div>

        {/* Grid */}
        <section className="py-32 md:py-40 lg:py-48">
          <div className="container">
            <FadeUp>
              <div className="flex items-center justify-between mb-16">
                <h2 className="text-[26px] md:text-[32px] font-extrabold tracking-[-0.025em]">
                  All Articles
                </h2>
                <span className="text-text-muted text-[13px] font-mono tracking-[0.05em]">
                  {articles.length} articles
                </span>
              </div>
            </FadeUp>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {articles.map((a, i) => (
                <FadeUp key={a.title} delay={0.06 * i}>
                  <article className="card-glass p-8 md:p-9 cursor-pointer group h-full flex flex-col">
                    <span className="font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-accent">
                      {a.category}
                    </span>
                    <h3 className="text-[16px] font-bold text-text mt-5 mb-3 leading-snug group-hover:text-text-secondary transition-colors">
                      {a.title}
                    </h3>
                    <p className="text-text-muted text-[13px] leading-[1.75] mb-8 flex-1">
                      {a.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-5 border-t border-white/[0.04]">
                      <span className="text-[12px] font-mono text-text-muted">{a.date}</span>
                      <span className="text-[13px] font-medium text-text-muted flex items-center gap-2 group-hover:text-accent group-hover:gap-3 transition-all duration-300">
                        Read <Arrow size={12} />
                      </span>
                    </div>
                  </article>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
