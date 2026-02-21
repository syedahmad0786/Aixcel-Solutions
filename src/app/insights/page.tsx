"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

const featuredArticle = {
  category: "AI Strategy",
  title: "Why HNWI Are Betting Big on Private AI Infrastructure",
  excerpt:
    "The ultra-wealthy are moving away from public AI services. Private AI deployment is becoming the new frontier for family offices and high-net-worth individuals seeking competitive advantages, data sovereignty, and bespoke intelligence systems that align with their unique operational needs.",
  author: "Aixcel Research Team",
  date: "Feb 2026",
  gradient: "from-accent-blue via-accent-purple to-accent-cyan",
};

const articles = [
  {
    category: "AI Strategy",
    title: "Building an AI-First Organization: A Leadership Playbook",
    excerpt:
      "How forward-thinking executives are restructuring their organizations around AI capabilities to unlock exponential growth.",
    date: "Feb 2026",
    gradient: "from-accent-blue to-accent-cyan",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    ),
  },
  {
    category: "Automation ROI",
    title: "The Hidden Cost of Not Automating: A $2M Wake-Up Call",
    excerpt:
      "A deep dive into how one enterprise discovered they were burning $2M annually on manual processes that AI could handle in seconds.",
    date: "Jan 2026",
    gradient: "from-accent-purple to-pink-400",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    ),
  },
  {
    category: "Voice AI Trends",
    title: "Voice AI in 2026: Beyond Chatbots to Autonomous Agents",
    excerpt:
      "How voice-first AI interfaces are evolving from simple assistants into fully autonomous agents that can negotiate, persuade, and close deals.",
    date: "Jan 2026",
    gradient: "from-accent-cyan to-emerald-400",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
      />
    ),
  },
  {
    category: "Data Intelligence",
    title: "From Data Warehouses to Intelligence Engines",
    excerpt:
      "Why traditional data infrastructure is failing modern enterprises, and how AI-native architectures are delivering 10x faster insights.",
    date: "Dec 2025",
    gradient: "from-blue-400 to-accent-blue",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
      />
    ),
  },
  {
    category: "Enterprise AI",
    title: "Scaling AI Across the Enterprise Without Breaking Things",
    excerpt:
      "A practical framework for rolling out AI capabilities department by department while maintaining security, compliance, and team morale.",
    date: "Dec 2025",
    gradient: "from-accent-purple to-accent-blue",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    ),
  },
  {
    category: "Compliance & AI",
    title: "AI Governance in 2026: What Your Board Needs to Know",
    excerpt:
      "With new EU AI regulations taking effect, here's your comprehensive guide to staying compliant while maximizing AI potential.",
    date: "Nov 2025",
    gradient: "from-amber-500 to-orange-400",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    ),
  },
];

export default function InsightsPage() {
  const heroRef = useRef(null);
  const featuredRef = useRef(null);
  const gridRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const featuredInView = useInView(featuredRef, { once: true, margin: "-100px" });
  const gridInView = useInView(gridRef, { once: true, margin: "-100px" });

  return (
    <>
      <Navbar />
      <main className="relative z-10">
        {/* Hero Section */}
        <section ref={heroRef} className="relative pt-36 pb-16 overflow-hidden">
          <div className="section-padding relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-8 bg-accent-purple" />
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent-purple">
                  Insights
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-[1.1] mb-6">
                Knowledge <span className="text-gradient">Hub</span>
              </h1>
              <p className="text-white/40 text-lg leading-relaxed max-w-2xl">
                Deep dives into AI strategy, automation frameworks, and
                enterprise intelligence. Curated insights from the front lines
                of AI transformation.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Featured Article */}
        <section ref={featuredRef} className="relative pb-20 overflow-hidden">
          <div className="section-padding relative z-10">
            <motion.article
              initial={{ opacity: 0, y: 40 }}
              animate={featuredInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="glass-panel overflow-hidden cursor-pointer group"
            >
              {/* Gradient Top Area */}
              <div
                className={`h-64 md:h-72 bg-gradient-to-br ${featuredArticle.gradient} opacity-10 group-hover:opacity-15 transition-opacity duration-500 relative`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-3xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.08] flex items-center justify-center text-white/30">
                    <svg
                      className="w-10 h-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="p-8 md:p-12">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent-purple">
                  {featuredArticle.category} &mdash; Featured
                </span>

                <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-white mt-4 mb-4 leading-snug group-hover:text-white/90 transition-colors">
                  {featuredArticle.title}
                </h2>

                <p className="text-white/30 text-base leading-relaxed mb-8 max-w-3xl">
                  {featuredArticle.excerpt}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Author Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-purple/30 to-accent-blue/30 border border-white/[0.08] flex items-center justify-center">
                      <span className="text-white/60 text-sm font-mono">AX</span>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">
                        {featuredArticle.author}
                      </p>
                      <p className="text-white/20 text-xs font-mono">
                        {featuredArticle.date}
                      </p>
                    </div>
                  </div>

                  <span className="btn-primary text-sm px-6 py-2.5 group-hover:shadow-glow transition-shadow duration-300">
                    Read Article
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
                  </span>
                </div>
              </div>
            </motion.article>
          </div>
        </section>

        {/* Divider */}
        <div className="section-padding">
          <div className="glow-line" />
        </div>

        {/* Articles Grid */}
        <section ref={gridRef} className="relative py-20 pb-32 overflow-hidden">
          <div className="section-padding relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={gridInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-between mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-serif text-white">
                All Articles
              </h2>
              <span className="text-white/20 text-sm font-mono">
                {articles.length} articles
              </span>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, i) => (
                <motion.article
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  animate={gridInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
                  className="glass-panel-hover overflow-hidden cursor-pointer group"
                >
                  {/* Gradient Top Area */}
                  <div
                    className={`h-32 bg-gradient-to-br ${article.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500 relative`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.08] flex items-center justify-center text-white/30">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          {article.icon}
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 md:p-8">
                    {/* Category Label */}
                    <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent-purple">
                      {article.category}
                    </span>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-white mt-3 mb-3 leading-snug group-hover:text-white/90 transition-colors">
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-white/30 text-sm leading-relaxed mb-6">
                      {article.excerpt}
                    </p>

                    {/* Bottom: Date + Read Arrow */}
                    <div className="flex items-center justify-between">
                      <span className="text-white/20 text-xs font-mono">
                        {article.date}
                      </span>
                      <span className="text-white/40 text-sm font-mono flex items-center gap-1.5 group-hover:text-accent-purple group-hover:gap-3 transition-all duration-300">
                        Read
                        <svg
                          className="w-3.5 h-3.5"
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
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}
