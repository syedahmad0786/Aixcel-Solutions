"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "@/data/testimonials";

export default function Testimonial() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  const t = testimonials[current];

  return (
    <section ref={ref} className="section-padding">
      <div className="container-main max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative text-center"
        >
          {/* Quote icon */}
          <div className="flex justify-center mb-8">
            <div className="p-3 rounded-xl bg-[var(--color-accent-subtle)]">
              <Quote className="w-6 h-6 text-[var(--color-accent)]" />
            </div>
          </div>

          {/* Quote Text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <blockquote className="text-xl md:text-2xl font-medium text-[var(--color-text-heading)] leading-relaxed mb-8">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div>
                <div className="text-sm font-semibold text-[var(--color-text-heading)]">
                  {t.name}
                </div>
                <div className="text-sm text-[var(--color-text-muted)]">
                  {t.title}, {t.company}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={prev}
                className="p-2 rounded-lg border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] hover:border-[var(--color-border-hover)] transition-all"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex gap-1.5">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === current
                        ? "bg-[var(--color-accent)] w-6"
                        : "bg-[var(--color-border-visible)]"
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="p-2 rounded-lg border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] hover:border-[var(--color-border-hover)] transition-all"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
