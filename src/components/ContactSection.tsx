"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";

const NetworkScene = dynamic(() => import("./three/NetworkScene"), {
  ssr: false,
});

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
        setFormData({ name: "", email: "", company: "", service: "", budget: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      <NetworkScene />
      <div className="absolute inset-0 bg-gradient-to-b from-space-900 via-space-800/90 to-space-900 z-[1]" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-accent-cyan text-sm font-semibold tracking-widest uppercase">
              Get Started
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 leading-tight">
              Let&apos;s Build Something
              <span className="gradient-text"> Extraordinary</span>
            </h2>
            <p className="text-white/50 text-lg leading-relaxed mb-10">
              Ready to transform your operations with AI? Schedule a discovery
              call with our team. We&apos;ll analyze your current workflows and
              identify high-impact automation opportunities.
            </p>

            {/* Process steps */}
            <div className="space-y-6">
              {[
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
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-4 group"
                >
                  <span className="text-xl font-bold gradient-text min-w-[40px]">
                    {item.step}
                  </span>
                  <div>
                    <h4 className="text-white font-semibold group-hover:text-accent-cyan transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-white/40 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Contact info */}
            <div className="mt-10 pt-8 border-t border-white/5 flex flex-col gap-3">
              <a
                href="mailto:hello@aixcel.solutions"
                className="text-white/50 hover:text-accent-cyan transition-colors text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                hello@aixcel.solutions
              </a>
              <span className="text-white/50 text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Dubai &bull; London &bull; New York
              </span>
            </div>
          </motion.div>

          {/* Right side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form
              onSubmit={handleSubmit}
              className="glass rounded-2xl p-8 space-y-5"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/50 text-xs font-medium mb-2 block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-accent-blue/50 focus:outline-none transition-colors"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="text-white/50 text-xs font-medium mb-2 block">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-accent-blue/50 focus:outline-none transition-colors"
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-white/50 text-xs font-medium mb-2 block">
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-accent-blue/50 focus:outline-none transition-colors"
                  placeholder="Acme Corp"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/50 text-xs font-medium mb-2 block">
                    Service Interest
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) =>
                      setFormData({ ...formData, service: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-accent-blue/50 focus:outline-none transition-colors appearance-none"
                  >
                    <option value="" className="bg-space-800">Select a service</option>
                    <option value="ai-agents" className="bg-space-800">AI Agents & Copilots</option>
                    <option value="automation" className="bg-space-800">Workflow Automation</option>
                    <option value="analytics" className="bg-space-800">Data Intelligence</option>
                    <option value="consulting" className="bg-space-800">Strategic Consulting</option>
                    <option value="platforms" className="bg-space-800">Custom Platforms</option>
                    <option value="compliance" className="bg-space-800">AI Governance</option>
                  </select>
                </div>
                <div>
                  <label className="text-white/50 text-xs font-medium mb-2 block">
                    Budget Range
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData({ ...formData, budget: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-accent-blue/50 focus:outline-none transition-colors appearance-none"
                  >
                    <option value="" className="bg-space-800">Select range</option>
                    <option value="5k-15k" className="bg-space-800">$5K - $15K</option>
                    <option value="15k-50k" className="bg-space-800">$15K - $50K</option>
                    <option value="50k-100k" className="bg-space-800">$50K - $100K</option>
                    <option value="100k+" className="bg-space-800">$100K+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-white/50 text-xs font-medium mb-2 block">
                  Tell us about your project *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-accent-blue/50 focus:outline-none transition-colors resize-none"
                  placeholder="Describe your current challenges and what you'd like to achieve..."
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-primary w-full text-center disabled:opacity-50"
              >
                {status === "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </span>
                ) : status === "success" ? (
                  "Message Sent Successfully!"
                ) : (
                  "Schedule Discovery Call"
                )}
              </button>

              {status === "error" && (
                <p className="text-red-400 text-sm text-center">
                  Something went wrong. Please try again or email us directly.
                </p>
              )}

              <p className="text-white/30 text-xs text-center">
                We typically respond within 24 hours. Your data is encrypted and protected.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
