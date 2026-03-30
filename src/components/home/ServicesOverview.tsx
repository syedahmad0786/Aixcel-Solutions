"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Brain,
  Mic,
  Workflow,
  PenTool,
  Code,
  Compass,
  ArrowRight,
} from "lucide-react";
import { services } from "@/data/services";

const iconMap: Record<string, React.ReactNode> = {
  brain: <Brain className="w-6 h-6" />,
  mic: <Mic className="w-6 h-6" />,
  workflow: <Workflow className="w-6 h-6" />,
  "pen-tool": <PenTool className="w-6 h-6" />,
  code: <Code className="w-6 h-6" />,
  compass: <Compass className="w-6 h-6" />,
};

export default function ServicesOverview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding">
      <div className="container-main">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-[var(--color-accent)] mb-3 block">
            What We Build
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-heading)] mb-4">
            End-to-end AI automation services
          </h2>
          <p className="text-[var(--color-text-body)] max-w-2xl mx-auto">
            From strategy to deployment. Every service designed to deliver measurable ROI
            within 90 days.
          </p>
        </motion.div>

        {/* Service Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <Link
                href={`/services/${service.slug}`}
                className="group block h-full p-7 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-card)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-hover)] transition-all duration-300 hover:-translate-y-1"
              >
                {/* Icon */}
                <div className="mb-5 p-3 w-fit rounded-xl bg-[var(--color-accent-subtle)] text-[var(--color-accent)] group-hover:bg-[var(--color-accent-muted)] transition-colors">
                  {iconMap[service.icon]}
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-[var(--color-text-heading)] mb-2 group-hover:text-[var(--color-accent)] transition-colors">
                  {service.shortTitle}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4">
                  {service.description}
                </p>

                {/* Link indicator */}
                <div className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent)] opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all">
                  Learn more
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
