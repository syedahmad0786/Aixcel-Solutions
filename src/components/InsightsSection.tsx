"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const insights = [
  {
    category: "AI Strategy",
    title: "Why HNWI Are Betting Big on Private AI Infrastructure",
    excerpt:
      "The ultra-wealthy are moving away from public AI services. Here's why private AI deployment is the new frontier for family offices and HNWI.",
    readTime: "8 min read",
    date: "Feb 2026",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    category: "Automation",
    title: "The Hidden Cost of Not Automating: A $2M Wake-Up Call",
    excerpt:
      "A deep dive into how one enterprise discovered they were burning $2M annually on manual processes that AI could handle in seconds.",
    readTime: "6 min read",
    date: "Feb 2026",
    gradient: "from-purple-500 to-pink-400",
  },
  {
    category: "Compliance",
    title: "AI Governance in 2026: What Your Board Needs to Know",
    excerpt:
      "With new EU AI regulations taking effect, here's your comprehensive guide to staying compliant while maximizing AI potential.",
    readTime: "10 min read",
    date: "Jan 2026",
    gradient: "from-amber-500 to-orange-400",
  },
];

export default function InsightsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="insights" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-space-900 via-space-800 to-space-900" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div>
            <span className="text-accent-cyan text-sm font-semibold tracking-widest uppercase">
              Knowledge Hub
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4">
              Latest{" "}
              <span className="gradient-text">Insights</span>
            </h2>
          </div>
          <a
            href="#"
            className="text-accent-cyan text-sm hover:gap-3 flex items-center gap-2 transition-all"
          >
            View all articles
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {insights.map((article, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
              className="glass rounded-2xl overflow-hidden group cursor-pointer glass-hover transition-all duration-500"
            >
              {/* Image placeholder with gradient */}
              <div className={`h-48 bg-gradient-to-br ${article.gradient} opacity-20 group-hover:opacity-30 transition-opacity relative`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center text-white/50">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-semibold tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r ${article.gradient}`}>
                    {article.category}
                  </span>
                  <span className="text-white/30 text-xs">•</span>
                  <span className="text-white/30 text-xs">{article.readTime}</span>
                </div>

                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-accent-cyan transition-colors leading-snug">
                  {article.title}
                </h3>

                <p className="text-white/40 text-sm leading-relaxed mb-4">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-white/30 text-xs">{article.date}</span>
                  <span className="text-accent-cyan text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
