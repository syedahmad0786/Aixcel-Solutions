"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";

const processSteps = [
  {
    num: "01",
    title: "Discovery Call",
    desc: "30-minute session to understand your challenges, goals, and current AI readiness. No sales pitch.",
  },
  {
    num: "02",
    title: "Strategy & Roadmap",
    desc: "Within a week, you'll receive a tailored AI strategy with clear milestones and ROI projections.",
  },
  {
    num: "03",
    title: "Build & Deploy",
    desc: "Rapid development with measurable results from day one. You'll see production systems, not prototypes.",
  },
  {
    num: "04",
    title: "Scale & Optimize",
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
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

  const update = (key: string, val: string) =>
    setFormData({ ...formData, [key]: val });

  return (
    <>
      <Navbar />
      <main className="noise">
        <section className="hero-mesh relative pt-44 pb-36 md:pt-56 md:pb-48 lg:pt-64 lg:pb-56 overflow-hidden">
          <div className="glow w-[600px] h-[600px] bg-accent/15 -top-[200px] right-[-100px]" />

          <div className="container relative z-10">
            <div className="grid lg:grid-cols-[1fr_1.1fr] gap-20 lg:gap-28">
              {/* Left */}
              <div>
                <FadeUp>
                  <div className="section-label">Get In Touch</div>
                </FadeUp>
                <FadeUp delay={0.06}>
                  <h1 className="text-[clamp(42px,6.5vw,72px)] font-bold leading-[1.02] tracking-[-0.035em] mb-10">
                    Let&apos;s build something{" "}
                    <span className="text-gradient">great</span>
                  </h1>
                </FadeUp>
                <FadeUp delay={0.12}>
                  <p className="text-text-secondary text-[16px] leading-[1.85] mb-20 max-w-md">
                    Ready to transform your operations with AI? Schedule a
                    discovery call. We&apos;ll analyze your workflows and
                    identify the highest-impact automation opportunities — no
                    commitment, no sales pitch.
                  </p>
                </FadeUp>

                {/* Process timeline */}
                <FadeUp delay={0.18}>
                  <div className="relative mb-20">
                    <div className="absolute left-[17px] top-2 bottom-2 w-px bg-gradient-to-b from-accent/30 via-border to-transparent" />

                    <div className="space-y-10">
                      {processSteps.map((s) => (
                        <div
                          key={s.num}
                          className="flex items-start gap-7 relative"
                        >
                          <div className="w-[35px] h-[35px] rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 relative z-10">
                            <span className="font-mono text-[11px] font-bold text-accent">
                              {s.num}
                            </span>
                          </div>
                          <div className="pt-1">
                            <h4 className="text-[16px] font-bold text-text mb-2">
                              {s.title}
                            </h4>
                            <p className="text-[14px] text-text-muted leading-[1.7]">
                              {s.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </FadeUp>

                {/* Contact info */}
                <FadeUp delay={0.22}>
                  <div className="pt-10 border-t border-white/[0.06] space-y-5">
                    <a
                      href="mailto:ahmad.bukhari@aixcelsolutions.com"
                      className="text-[14px] text-text-secondary hover:text-text transition-colors flex items-center gap-4 font-mono"
                    >
                      <svg
                        className="w-4 h-4 text-accent flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      ahmad.bukhari@aixcelsolutions.com
                    </a>
                    <p className="text-[13px] text-text-muted leading-relaxed pl-8">
                      We typically respond within 24 hours.
                    </p>
                  </div>
                </FadeUp>
              </div>

              {/* Right — Form */}
              <FadeUp delay={0.1}>
                <form
                  onSubmit={handleSubmit}
                  className="card-glass p-9 md:p-12 space-y-7"
                >
                  <div>
                    <label className="input-label" htmlFor="name">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => update("name", e.target.value)}
                      className="input"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="input-label" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => update("email", e.target.value)}
                      className="input"
                      placeholder="you@company.com"
                    />
                  </div>
                  <div>
                    <label className="input-label" htmlFor="company">
                      Company
                    </label>
                    <input
                      id="company"
                      type="text"
                      value={formData.company}
                      onChange={(e) => update("company", e.target.value)}
                      className="input"
                      placeholder="Your company name"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="input-label" htmlFor="service">
                        Service
                      </label>
                      <select
                        id="service"
                        value={formData.service}
                        onChange={(e) => update("service", e.target.value)}
                        className="input appearance-none"
                      >
                        <option value="">Select a service</option>
                        <option value="ai-agents">AI Agents</option>
                        <option value="voice-ai">Voice AI</option>
                        <option value="data-intelligence">
                          Data Intelligence
                        </option>
                        <option value="enterprise-automation">
                          Enterprise Automation
                        </option>
                        <option value="ai-consulting">AI Consulting</option>
                        <option value="custom-platforms">
                          Custom Platforms
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className="input-label" htmlFor="budget">
                        Budget
                      </label>
                      <select
                        id="budget"
                        value={formData.budget}
                        onChange={(e) => update("budget", e.target.value)}
                        className="input appearance-none"
                      >
                        <option value="">Select range</option>
                        <option value="10k-25k">$10k - $25k</option>
                        <option value="25k-50k">$25k - $50k</option>
                        <option value="50k-100k">$50k - $100k</option>
                        <option value="100k+">$100k+</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="input-label" htmlFor="message">
                      Tell us about your project
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => update("message", e.target.value)}
                      className="input resize-none"
                      placeholder="Describe your current challenges, what you've tried, and what you'd like to achieve..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="btn-primary w-full disabled:opacity-50"
                  >
                    {status === "loading" ? (
                      <span className="flex items-center gap-2">
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
                      "Message Sent — We'll Be in Touch"
                    ) : (
                      "Schedule Discovery Call"
                    )}
                  </button>

                  {status === "error" && (
                    <p className="text-red-400 text-[13px] text-center">
                      Something went wrong. Please try again or email us
                      directly.
                    </p>
                  )}

                  <p className="text-text-muted text-[12px] text-center leading-relaxed">
                    Your data is protected and never shared with third parties.
                    <br />
                    We respond to every inquiry within 24 hours.
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
