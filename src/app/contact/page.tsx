"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

const processSteps = [
  { num: "01", title: "Discovery", desc: "30-minute session to understand your challenges, goals, and current AI readiness." },
  { num: "02", title: "Roadmap", desc: "Tailored AI and automation strategy with clear milestones within a week." },
  { num: "03", title: "Implementation", desc: "Rapid deployment with measurable ROI from day one." },
  { num: "04", title: "Scale", desc: "Continuous improvement and expansion across your organization." },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", company: "", service: "", budget: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (res.ok) { setStatus("success"); setFormData({ name: "", email: "", company: "", service: "", budget: "", message: "" }); }
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  const update = (key: string, val: string) => setFormData({ ...formData, [key]: val });

  return (
    <>
      <Navbar />
      <main>
        <section className="relative pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden">
          <div className="glow w-[500px] h-[500px] bg-accent/15 -top-[150px] right-[-100px]" />
          <div className="container relative z-10">
            <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 lg:gap-20">
              {/* Left */}
              <div>
                <FadeUp>
                  <div className="section-label">Contact</div>
                </FadeUp>
                <FadeUp delay={0.06}>
                  <h1 className="text-[clamp(36px,5vw,56px)] font-bold leading-[1.06] tracking-[-0.025em] mb-7">
                    Let&apos;s build something{" "}
                    <span className="text-gradient">great</span>
                  </h1>
                </FadeUp>
                <FadeUp delay={0.12}>
                  <p className="text-text-secondary text-[16px] leading-[1.75] mb-14 max-w-md">
                    Ready to transform your operations with AI? Schedule a
                    discovery call. We&apos;ll analyze your workflows and
                    identify high-impact automation opportunities.
                  </p>
                </FadeUp>

                {/* Process steps */}
                <FadeUp delay={0.18}>
                  <div className="space-y-6 mb-14">
                    {processSteps.map((s) => (
                      <div key={s.num} className="flex items-start gap-5">
                        <span className="font-mono text-[13px] font-semibold text-accent min-w-[28px] pt-0.5">
                          {s.num}
                        </span>
                        <div>
                          <h4 className="text-[14px] font-semibold text-text mb-1">{s.title}</h4>
                          <p className="text-[13px] text-text-muted leading-relaxed">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </FadeUp>

                {/* Contact info */}
                <FadeUp delay={0.22}>
                  <div className="pt-8 border-t border-border space-y-4">
                    <a href="mailto:hello@aixcel.solutions" className="text-[14px] text-text-secondary hover:text-text transition-colors flex items-center gap-3 font-mono">
                      <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      hello@aixcel.solutions
                    </a>
                  </div>
                </FadeUp>
              </div>

              {/* Right — Form */}
              <FadeUp delay={0.1}>
                <form onSubmit={handleSubmit} className="card p-8 md:p-10 space-y-5">
                  <div>
                    <label className="input-label">Name</label>
                    <input type="text" required value={formData.name} onChange={(e) => update("name", e.target.value)} className="input" placeholder="John Smith" />
                  </div>
                  <div>
                    <label className="input-label">Email</label>
                    <input type="email" required value={formData.email} onChange={(e) => update("email", e.target.value)} className="input" placeholder="john@company.com" />
                  </div>
                  <div>
                    <label className="input-label">Company</label>
                    <input type="text" value={formData.company} onChange={(e) => update("company", e.target.value)} className="input" placeholder="Acme Corp" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="input-label">Service</label>
                      <select value={formData.service} onChange={(e) => update("service", e.target.value)} className="input appearance-none">
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
                      <label className="input-label">Budget</label>
                      <select value={formData.budget} onChange={(e) => update("budget", e.target.value)} className="input appearance-none">
                        <option value="">Select range</option>
                        <option value="under-10k">Under $10k</option>
                        <option value="10k-50k">$10k - $50k</option>
                        <option value="50k-100k">$50k - $100k</option>
                        <option value="100k+">$100k+</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="input-label">Message</label>
                    <textarea required rows={4} value={formData.message} onChange={(e) => update("message", e.target.value)} className="input resize-none" placeholder="Describe your current challenges and what you'd like to achieve..." />
                  </div>

                  <button type="submit" disabled={status === "loading"} className="btn-primary w-full disabled:opacity-50">
                    {status === "loading" ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                        Sending...
                      </span>
                    ) : status === "success" ? "Message Sent Successfully" : "Schedule Discovery Call"}
                  </button>

                  {status === "error" && (
                    <p className="text-red-400 text-[13px] text-center">Something went wrong. Please try again or email us directly.</p>
                  )}

                  <p className="text-text-muted text-[12px] text-center">
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
