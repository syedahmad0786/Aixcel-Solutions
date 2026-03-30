"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const tools = [
  "n8n", "Make", "Zapier", "OpenAI", "Anthropic", "GoHighLevel",
  "Salesforce", "HubSpot", "Slack", "Google Cloud", "AWS",
  "Supabase", "Vercel", "LangChain", "Twilio",
];

export default function LogoBar() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="py-16 border-y border-[var(--color-border-subtle)] overflow-hidden">
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
        className="text-center text-xs tracking-widest uppercase text-[var(--color-text-disabled)] mb-8"
      >
        Powered by the tools that power enterprise
      </motion.p>

      {/* Marquee */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[var(--color-bg-primary)] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[var(--color-bg-primary)] to-transparent z-10" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex gap-12 animate-marquee"
        >
          {[...tools, ...tools].map((tool, i) => (
            <div
              key={`${tool}-${i}`}
              className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)]"
            >
              <span className="text-sm font-medium text-[var(--color-text-muted)] whitespace-nowrap">
                {tool}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
