"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

const processSteps = [
  {
    step: "01",
    title: "Discovery",
    desc: "30-minute session to understand your challenges, goals, and current AI readiness.",
  },
  {
    step: "02",
    title: "Roadmap",
    desc: "We deliver a tailored AI and automation strategy with clear milestones within a week.",
  },
  {
    step: "03",
    title: "Implementation",
    desc: "Rapid deployment with measurable ROI from day one and continuous feedback loops.",
  },
  {
    step: "04",
    title: "Scale",
    desc: "Continuous improvement and expansion of AI capabilities across your organization.",
  },
];

export default function ContactPage() {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const leftInView = useInView(leftRef, { once: true, margin: "-100px" });
  const rightInView = useInView(rightRef, { once: true, margin: "-100px" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    budget: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

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
    "w-full bg-white/[0.03] border border-white/[0.06] rounded-lg p-3 text-white text-sm font-sans placeholder:text-white/20 focus:border-accent-purple/40 focus:outline-none transition-colors duration-300";
  const labelClasses =
    "text-xs font-mono uppercase tracking-wider text-white/40 mb-2 block";

  return (
    <>
      <Navbar />
      <main className="relative z-10">
        <section className="relative pt-36 pb-32 overflow-hidden">
          <div className="section-padding relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-20">
              {/* Left Side */}
              <motion.div
                ref={leftRef}
                initial={{ opacity: 0, x: -40 }}
                animate={leftInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
              >
                {/* Section Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px w-8 bg-accent-purple" />
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent-purple">
                    Contact
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-[1.1] mb-6">
                  Let&apos;s Build
                  <br />
                  <span className="text-gradient">Something</span> Great
                </h1>

                <p className="text-white/40 text-lg leading-relaxed mb-12 max-w-lg">
                  Ready to transform your operations with AI? Schedule a
                  discovery call with our team. We&apos;ll analyze your current
                  workflows and identify high-impact automation opportunities
                  tailored to your business.
                </p>

                {/* Process Steps */}
                <div className="space-y-6 mb-12">
                  {processSteps.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={leftInView ? { opacity: 1, x: 0 } : {}}
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
                        <p className="text-white/30 text-sm mt-0.5">
                          {item.desc}
                        </p>
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
                  <a
                    href="tel:+14155551234"
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
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    +1 (415) 555-1234
                  </a>
                </div>
              </motion.div>

              {/* Right Side - Form */}
              <motion.div
                ref={rightRef}
                initial={{ opacity: 0, x: 40 }}
                animate={rightInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <form
                  onSubmit={handleSubmit}
                  className="glass-panel p-8 md:p-10 space-y-6"
                >
                  {/* Name */}
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

                  {/* Email */}
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

                  {/* Service of Interest */}
                  <div>
                    <label className={labelClasses}>Service of Interest</label>
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
                        AI Agents
                      </option>
                      <option value="voice-ai" className="bg-surface-100">
                        Voice AI
                      </option>
                      <option value="data-intelligence" className="bg-surface-100">
                        Data Intelligence
                      </option>
                      <option value="enterprise-automation" className="bg-surface-100">
                        Enterprise Automation
                      </option>
                      <option value="ai-consulting" className="bg-surface-100">
                        AI Consulting
                      </option>
                      <option value="custom-platforms" className="bg-surface-100">
                        Custom Platforms
                      </option>
                    </select>
                  </div>

                  {/* Budget Range */}
                  <div>
                    <label className={labelClasses}>Budget Range</label>
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
                      <option value="under-10k" className="bg-surface-100">
                        Under $10k
                      </option>
                      <option value="10k-50k" className="bg-surface-100">
                        $10k - $50k
                      </option>
                      <option value="50k-100k" className="bg-surface-100">
                        $50k - $100k
                      </option>
                      <option value="100k+" className="bg-surface-100">
                        $100k+
                      </option>
                    </select>
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
                      Something went wrong. Please try again or email us
                      directly.
                    </p>
                  )}

                  <p className="text-white/20 text-xs text-center font-mono">
                    We typically respond within 24 hours. Your data is encrypted
                    and protected.
                  </p>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}
