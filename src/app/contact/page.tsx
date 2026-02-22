"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

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

  return (
    <>
      <Navbar />
      <main>
        <section className="pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-20">
              {/* Left */}
              <div>
                <FadeUp>
                  <p className="section-label">Contact</p>
                </FadeUp>
                <FadeUp delay={0.05}>
                  <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold tracking-tight text-primary leading-[1.08] mb-6">
                    Let&apos;s build something great
                  </h1>
                </FadeUp>
                <FadeUp delay={0.1}>
                  <p className="text-secondary text-lg leading-relaxed mb-12 max-w-lg">
                    Ready to transform your operations with AI? Schedule a
                    discovery call with our team. We&apos;ll analyze your
                    current workflows and identify high-impact automation
                    opportunities.
                  </p>
                </FadeUp>

                {/* Process */}
                <FadeUp delay={0.15}>
                  <div className="space-y-6 mb-12">
                    {processSteps.map((item) => (
                      <div key={item.step} className="flex items-start gap-5">
                        <span className="text-sm font-mono font-semibold text-muted min-w-[32px]">
                          {item.step}
                        </span>
                        <div>
                          <h4 className="text-sm font-semibold text-primary mb-0.5">
                            {item.title}
                          </h4>
                          <p className="text-sm text-secondary leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </FadeUp>

                {/* Contact info */}
                <FadeUp delay={0.2}>
                  <div className="pt-8 border-t border-border space-y-3">
                    <a
                      href="mailto:hello@aixcel.solutions"
                      className="text-sm text-secondary hover:text-primary transition-colors flex items-center gap-3 font-mono"
                    >
                      <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      hello@aixcel.solutions
                    </a>
                  </div>
                </FadeUp>
              </div>

              {/* Right — Form */}
              <FadeUp delay={0.1}>
                <form
                  onSubmit={handleSubmit}
                  className="bg-bg-alt border border-border rounded-xl p-8 md:p-10 space-y-5"
                >
                  <div>
                    <label className="input-label">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="input"
                      placeholder="John Smith"
                    />
                  </div>

                  <div>
                    <label className="input-label">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="input"
                      placeholder="john@company.com"
                    />
                  </div>

                  <div>
                    <label className="input-label">Company</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      className="input"
                      placeholder="Acme Corp"
                    />
                  </div>

                  <div>
                    <label className="input-label">Service of Interest</label>
                    <select
                      value={formData.service}
                      onChange={(e) =>
                        setFormData({ ...formData, service: e.target.value })
                      }
                      className="input appearance-none"
                    >
                      <option value="">Select a service</option>
                      <option value="ai-agents">AI Agents</option>
                      <option value="voice-ai">Voice AI</option>
                      <option value="data-intelligence">Data Intelligence</option>
                      <option value="enterprise-automation">Enterprise Automation</option>
                      <option value="ai-consulting">AI Consulting</option>
                      <option value="custom-platforms">Custom Platforms</option>
                    </select>
                  </div>

                  <div>
                    <label className="input-label">Budget Range</label>
                    <select
                      value={formData.budget}
                      onChange={(e) =>
                        setFormData({ ...formData, budget: e.target.value })
                      }
                      className="input appearance-none"
                    >
                      <option value="">Select range</option>
                      <option value="under-10k">Under $10k</option>
                      <option value="10k-50k">$10k - $50k</option>
                      <option value="50k-100k">$50k - $100k</option>
                      <option value="100k+">$100k+</option>
                    </select>
                  </div>

                  <div>
                    <label className="input-label">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="input resize-none"
                      placeholder="Describe your current challenges and what you'd like to achieve..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="btn-primary w-full justify-center disabled:opacity-50"
                  >
                    {status === "loading" ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
                    <p className="text-red-500 text-sm text-center">
                      Something went wrong. Please try again or email us
                      directly.
                    </p>
                  )}

                  <p className="text-muted text-xs text-center">
                    We typically respond within 24 hours. Your data is protected.
                  </p>
                </form>
              </FadeUp>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
