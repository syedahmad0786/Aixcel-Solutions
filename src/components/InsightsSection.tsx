"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const insights = [
  {
    category: "AI Strategy",
    title: "Why HNWI Are Betting Big on Private AI Infrastructure",
    excerpt:
      "The ultra-wealthy are moving away from public AI services. Here's why private AI deployment is the new frontier for family offices and HNWI.",
    date: "Feb 2026",
    gradient: "from-accent-blue to-accent-cyan",
  },
  {
    category: "Automation",
    title: "The Hidden Cost of Not Automating: A $2M Wake-Up Call",
    excerpt:
      "A deep dive into how one enterprise discovered they were burning $2M annually on manual processes that AI could handle in seconds.",
    date: "Feb 2026",
    gradient: "from-accent-purple to-pink-400",
  },
  {
    category: "Compliance",
    title: "AI Governance in 2026: What Your Board Needs to Know",
    excerpt:
      "With new EU AI regulations taking effect, here's your comprehensive guide to staying compliant while maximizing AI potential.",
    date: "Jan 2026",
    gradient: "from-amber-500 to-orange-400",
  },
];

export default function InsightsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="insights" className="relative py-32 overflow-hidden">
      <div ref={ref} className="section-padding relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6"
        >
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-8 bg-accent-purple" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent-purple">
                Knowledge Hub
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white">
              Latest Insights
            </h2>
          </div>
          <a
            href="#"
            className="text-white/40 hover:text-white text-sm font-mono uppercase tracking-[0.1em] flex items-center gap-2 transition-all duration-300 hover:gap-3"
          >
            View all
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
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
              className="glass-panel-hover overflow-hidden cursor-pointer group"
            >
              {/* Gradient Top Area */}
              <div
                className={`h-48 bg-gradient-to-br ${article.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500 relative`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.08] flex items-center justify-center text-white/30">
                    <svg
                      className="w-7 h-7"
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

              <div className="p-6 md:p-8">
                {/* Category Label */}
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent-purple">
                  {article.category}
                </span>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-serif text-white mt-3 mb-3 leading-snug group-hover:text-white/90 transition-colors">
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
  );
}
