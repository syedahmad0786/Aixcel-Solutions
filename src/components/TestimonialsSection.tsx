"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const testimonials = [
  {
    quote:
      "Aixcel Solutions transformed our entire operations. Their AI agents now handle what used to take our team 200+ hours monthly. The ROI was visible within the first month.",
    author: "Sarah Mitchell",
    role: "COO, Meridian Capital Partners",
    metric: "200+ hrs/mo saved",
  },
  {
    quote:
      "Working with Aixcel was a game-changer for our family office. Their compliance-first approach gave us confidence in deploying AI across our portfolio management systems.",
    author: "James Al-Rashid",
    role: "Managing Director, Al-Rashid Family Office",
    metric: "40% cost reduction",
  },
  {
    quote:
      "The custom analytics platform they built for us processes data from 15+ sources in real-time. Our decision-making speed improved by 50%. Truly world-class execution.",
    author: "Elena Petrova",
    role: "VP Operations, Nordic Agency Group",
    metric: "50% faster decisions",
  },
];

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [active, setActive] = useState(0);

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-space-900 via-space-800/50 to-space-900" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-accent-cyan text-sm font-semibold tracking-widest uppercase">
            Client Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4">
            Trusted by{" "}
            <span className="gradient-text">Industry Leaders</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {/* Active testimonial */}
          <div className="glass rounded-3xl p-10 md:p-14 text-center mb-8 relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-accent-purple/5" />

            <div className="relative z-10">
              {/* Quote mark */}
              <div className="text-accent-blue/20 text-8xl font-serif leading-none mb-4">&ldquo;</div>

              <p className="text-xl md:text-2xl text-white/80 leading-relaxed mb-8 font-light">
                {testimonials[active].quote}
              </p>

              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white font-bold">
                  {testimonials[active].author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="text-left">
                  <h4 className="text-white font-semibold">
                    {testimonials[active].author}
                  </h4>
                  <p className="text-white/40 text-sm">
                    {testimonials[active].role}
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-blue/10 border border-accent-blue/20">
                <span className="text-accent-cyan text-sm font-semibold">
                  {testimonials[active].metric}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation dots */}
          <div className="flex items-center justify-center gap-3">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === active
                    ? "w-10 bg-gradient-to-r from-accent-blue to-accent-cyan"
                    : "w-2 bg-white/20 hover:bg-white/40"
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
