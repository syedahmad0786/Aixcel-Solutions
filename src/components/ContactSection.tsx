"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const processSteps = [
  {
    step: "01",
    title: "Discovery Call",
    desc: "30-minute session to understand your challenges and goals",
  },
  {
    step: "02",
    title: "Custom Roadmap",
    desc: "We deliver a tailored AI & automation strategy within a week",
  },
  {
    step: "03",
    title: "Implementation",
    desc: "Rapid deployment with measurable ROI from day one",
  },
  {
    step: "04",
    title: "Scale & Optimize",
    desc: "Continuous improvement and expansion of AI capabilities",
  },
];

export default function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    budget: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          company: "",
          service: "",
          budget: "",
          message: "",
        });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputClasses =
    "w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3.5 text-white text-sm font-sans placeholder:text-white/20 focus:border-accent-purple/40 focus:outline-none transition-colors duration-300";
  const labelClasses =
    "text-xs font-mono uppercase tracking-[0.15em] text-white/30 mb-2 block";

  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      <div ref={ref} className="section-padding relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20">
          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-8 bg-accent-purple" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent-purple">
                Ready to Transform?
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-[1.1] mb-6">
              Let&apos;s Build Something
              <br />
              <span className="text-gradient">That Compounds</span>
            </h2>

            <p className="text-white/40 text-lg leading-relaxed mb-12 max-w-lg">
              Ready to transform your operations with AI? Schedule a discovery
              call with our team. We&apos;ll analyze your current workflows and
              identify high-impact automation opportunities.
            </p>

            {/* Process Steps */}
            <div className="space-y-6 mb-12">
              {processSteps.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-5 group"
                >
                  <span className="text-lg font-mono font-semibold text-gradient min-w-[36px]">
                    {item.step}
                  </span>
                  <div>
                    <h4 className="text-white font-serif text-lg group-hover:text-accent-purple transition-colors duration-300">
                      {item.title}
                    </h4>
                    <p className="text-white/30 text-sm mt-0.5">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="border-t border-white/[0.06] pt-8 space-y-4">
              <a
                href="mailto:hello@aixcel.solutions"
                className="text-white/40 hover:text-white transition-colors duration-300 text-sm font-mono flex items-center gap-3"
              >
                <svg
                  className="w-4 h-4 text-accent-purple"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                hello@aixcel.solutions
              </a>
              <div className="text-white/40 text-sm font-mono flex items-center gap-3">
                <svg
                  className="w-4 h-4 text-accent-purple"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Dubai &bull; London &bull; New York
              </div>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form
              onSubmit={handleSubmit}
              className="glass-panel p-8 md:p-10 space-y-6"
            >
              {/* Name + Email Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={inputClasses}
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className={labelClasses}>Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={inputClasses}
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              {/* Company */}
              <div>
                <label className={labelClasses}>Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className={inputClasses}
                  placeholder="Acme Corp"
                />
              </div>

              {/* Service + Budget Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Service</label>
                  <select
                    value={formData.service}
                    onChange={(e) =>
                      setFormData({ ...formData, service: e.target.value })
                    }
                    className={`${inputClasses} appearance-none`}
                  >
                    <option value="" className="bg-surface-100">
                      Select a service
                    </option>
                    <option value="ai-agents" className="bg-surface-100">
                      AI Agents &amp; Copilots
                    </option>
                    <option value="automation" className="bg-surface-100">
                      Workflow Automation
                    </option>
                    <option value="analytics" className="bg-surface-100">
                      Data Intelligence
                    </option>
                    <option value="consulting" className="bg-surface-100">
                      Strategic Consulting
                    </option>
                    <option value="platforms" className="bg-surface-100">
                      Custom Platforms
                    </option>
                    <option value="compliance" className="bg-surface-100">
                      AI Governance
                    </option>
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Budget</label>
                  <select
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData({ ...formData, budget: e.target.value })
                    }
                    className={`${inputClasses} appearance-none`}
                  >
                    <option value="" className="bg-surface-100">
                      Select range
                    </option>
                    <option value="5k-15k" className="bg-surface-100">
                      $5K - $15K
                    </option>
                    <option value="15k-50k" className="bg-surface-100">
                      $15K - $50K
                    </option>
                    <option value="50k-100k" className="bg-surface-100">
                      $50K - $100K
                    </option>
                    <option value="100k+" className="bg-surface-100">
                      $100K+
                    </option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className={labelClasses}>Message</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className={`${inputClasses} resize-none`}
                  placeholder="Describe your current challenges and what you'd like to achieve..."
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-primary w-full text-center disabled:opacity-50"
              >
                {status === "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending...
                  </span>
                ) : status === "success" ? (
                  "Message Sent Successfully"
                ) : (
                  "Schedule Discovery Call"
                )}
              </button>

              {status === "error" && (
                <p className="text-red-400/80 text-sm text-center font-mono">
                  Something went wrong. Please try again or email us directly.
                </p>
              )}

              <p className="text-white/20 text-xs text-center font-mono">
                We typically respond within 24 hours. Your data is encrypted and
                protected.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
