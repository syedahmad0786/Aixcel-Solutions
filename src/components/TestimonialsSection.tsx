"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

const testimonials = [
  {
    quote:
      "Aixcel Solutions transformed our entire operations. Their AI agents now handle what used to take our team 200+ hours monthly. The ROI was visible within the first month.",
    author: "Sarah Mitchell",
    role: "COO, Meridian Capital Partners",
    initials: "SM",
  },
  {
    quote:
      "Working with Aixcel was a game-changer for our family office. Their compliance-first approach gave us confidence in deploying AI across our portfolio management systems.",
    author: "James Al-Rashid",
    role: "Managing Director, Al-Rashid Family Office",
    initials: "JA",
  },
  {
    quote:
      "The custom analytics platform they built for us processes data from 15+ sources in real-time. Our decision-making speed improved by 50%. Truly world-class execution.",
    author: "Elena Petrova",
    role: "VP Operations, Nordic Agency Group",
    initials: "EP",
  },
];

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [active, setActive] = useState(0);

  return (
    <section className="relative py-32 overflow-hidden">
      <div ref={ref} className="section-padding relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-8 bg-accent-purple" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent-purple">
              Client Voices
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white">
            What Our Clients Say
          </h2>
        </motion.div>

        {/* Quote Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-panel p-10 md:p-16 relative overflow-hidden">
            {/* Large Quote Mark */}
            <div className="text-accent-purple/15 text-[120px] md:text-[160px] font-serif leading-none absolute top-4 left-8 select-none">
              &ldquo;
            </div>

            <div className="relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Quote Text */}
                  <p className="text-xl md:text-2xl lg:text-3xl font-serif italic text-white/80 leading-relaxed mb-10 pt-8">
                    {testimonials[active].quote}
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    {/* Avatar with gradient circle */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
                      <span className="text-white text-sm font-mono font-semibold">
                        {testimonials[active].initials}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-white font-serif text-lg">
                        {testimonials[active].author}
                      </h4>
                      <p className="text-white/40 text-sm font-mono">
                        {testimonials[active].role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex items-center justify-center gap-3 mt-10">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`rounded-full transition-all duration-500 ${
                  i === active
                    ? "w-10 h-2 bg-accent-purple"
                    : "w-2 h-2 bg-white/15 hover:bg-white/30"
                }`}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
