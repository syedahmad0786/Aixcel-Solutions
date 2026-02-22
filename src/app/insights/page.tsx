"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
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

const featuredArticle = {
  category: "AI Strategy",
  title: "Why Forward-Thinking Companies Are Betting Big on Private AI Infrastructure",
  excerpt:
    "Organizations are moving away from public AI services. Private AI deployment is becoming the new frontier for companies seeking competitive advantages, data sovereignty, and bespoke intelligence systems aligned with their unique operational needs.",
  author: "Aixcel Research Team",
  date: "Feb 2026",
};

const articles = [
  {
    category: "AI Strategy",
    title: "Building an AI-First Organization: A Leadership Playbook",
    excerpt:
      "How forward-thinking executives are restructuring their organizations around AI capabilities to unlock exponential growth.",
    date: "Feb 2026",
  },
  {
    category: "Automation ROI",
    title: "The Hidden Cost of Not Automating: A $2M Wake-Up Call",
    excerpt:
      "A deep dive into how one enterprise discovered they were burning $2M annually on manual processes that AI could handle in seconds.",
    date: "Jan 2026",
  },
  {
    category: "Voice AI",
    title: "Voice AI in 2026: Beyond Chatbots to Autonomous Agents",
    excerpt:
      "How voice-first AI interfaces are evolving from simple assistants into fully autonomous agents that can negotiate, persuade, and close deals.",
    date: "Jan 2026",
  },
  {
    category: "Data Intelligence",
    title: "From Data Warehouses to Intelligence Engines",
    excerpt:
      "Why traditional data infrastructure is failing modern enterprises, and how AI-native architectures are delivering 10x faster insights.",
    date: "Dec 2025",
  },
  {
    category: "Enterprise AI",
    title: "Scaling AI Across the Enterprise Without Breaking Things",
    excerpt:
      "A practical framework for rolling out AI capabilities department by department while maintaining security, compliance, and team morale.",
    date: "Dec 2025",
  },
  {
    category: "Compliance",
    title: "AI Governance in 2026: What Your Board Needs to Know",
    excerpt:
      "With new EU AI regulations taking effect, here's your comprehensive guide to staying compliant while maximizing AI potential.",
    date: "Nov 2025",
  },
];

export default function InsightsPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-12 md:pt-40 md:pb-16">
          <div className="container">
            <FadeUp>
              <p className="section-label">Insights</p>
            </FadeUp>
            <FadeUp delay={0.05}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary leading-[1.08] mb-6">
                Knowledge Hub
              </h1>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-secondary text-lg leading-relaxed max-w-2xl">
                Deep dives into AI strategy, automation frameworks, and
                enterprise intelligence. Curated insights from the front lines
                of AI transformation.
              </p>
            </FadeUp>
          </div>
        </section>

        {/* Featured */}
        <section className="pb-16 md:pb-20">
          <div className="container">
            <FadeUp>
              <article className="card overflow-hidden cursor-pointer group">
                {/* Top gradient bar */}
                <div className="h-48 md:h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-border flex items-center justify-center text-muted">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                </div>

                <div className="p-8 md:p-10">
                  <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
                    {featuredArticle.category} — Featured
                  </span>

                  <h2 className="text-2xl md:text-3xl font-bold text-primary mt-3 mb-4 leading-snug group-hover:text-secondary transition-colors">
                    {featuredArticle.title}
                  </h2>

                  <p className="text-secondary text-sm leading-relaxed mb-8 max-w-3xl">
                    {featuredArticle.excerpt}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-bg-alt border border-border flex items-center justify-center">
                        <span className="text-xs font-mono font-medium text-muted">
                          AX
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary">
                          {featuredArticle.author}
                        </p>
                        <p className="text-xs text-muted font-mono">
                          {featuredArticle.date}
                        </p>
                      </div>
                    </div>

                    <span className="btn-primary text-[13px] px-5 py-2.5">
                      Read Article
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-1"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </article>
            </FadeUp>
          </div>
        </section>

        {/* Divider */}
        <div className="container"><div className="divider" /></div>

        {/* Articles Grid */}
        <section className="py-16 md:py-24">
          <div className="container">
            <FadeUp>
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-primary">
                  All Articles
                </h2>
                <span className="text-muted text-sm font-mono">
                  {articles.length} articles
                </span>
              </div>
            </FadeUp>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {articles.map((article, i) => (
                <FadeUp key={article.title} delay={0.06 * i}>
                  <article className="card p-7 cursor-pointer group h-full flex flex-col">
                    {/* Category */}
                    <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted">
                      {article.category}
                    </span>

                    {/* Title */}
                    <h3 className="text-base font-semibold text-primary mt-3 mb-3 leading-snug group-hover:text-secondary transition-colors">
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-secondary text-sm leading-relaxed mb-6 flex-1">
                      {article.excerpt}
                    </p>

                    {/* Bottom */}
                    <div className="flex items-center justify-between pt-5 border-t border-border-light">
                      <span className="text-xs text-muted font-mono">
                        {article.date}
                      </span>
                      <span className="text-sm font-medium text-primary flex items-center gap-1.5 group-hover:gap-3 transition-all duration-200">
                        Read
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
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
