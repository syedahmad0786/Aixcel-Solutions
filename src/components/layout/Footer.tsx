"use client";

import Link from "next/link";
import { ArrowUpRight, Mail, Phone, ExternalLink } from "lucide-react";
import { navigation } from "@/data/navigation";

const footerLinks = {
  services: [
    { label: "Agentic AI", href: "/services/agentic-ai" },
    { label: "Voice AI", href: "/services/voice-ai" },
    { label: "Process Automation", href: "/services/process-automation" },
    { label: "Content Operations", href: "/services/content-operations" },
    { label: "Custom Development", href: "/services/custom-development" },
    { label: "AI Strategy", href: "/services/ai-strategy" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Blog", href: "/blog" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]">
      <div className="container-main section-padding">
        {/* Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="relative w-7 h-7">
                <div className="absolute inset-0 rounded-md bg-gradient-to-br from-[var(--color-accent)] to-[#D4763A]" />
                <span className="absolute inset-0 flex items-center justify-center text-[var(--color-bg-primary)] font-bold text-xs">
                  A
                </span>
              </div>
              <span className="text-[var(--color-text-heading)] font-semibold tracking-tight">
                AiXCEL Solutions
              </span>
            </Link>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-6 max-w-xs">
              We automate the work that slows your business down. Production-grade AI systems with 90-day payoff targets.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/in/bukhariahmad"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-all"
                aria-label="LinkedIn"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="mailto:ahmadbukhari4245@gmail.com"
                className="p-2 rounded-lg border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-all"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="tel:+923005174444"
                className="p-2 rounded-lg border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-all"
                aria-label="Phone"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text-heading)] mb-4 tracking-wide uppercase">
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text-heading)] mb-4 tracking-wide uppercase">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text-heading)] mb-4 tracking-wide uppercase">
              Get in Touch
            </h4>
            <div className="space-y-3 text-sm text-[var(--color-text-muted)]">
              <a
                href="mailto:ahmadbukhari4245@gmail.com"
                className="block hover:text-[var(--color-text-heading)] transition-colors"
              >
                ahmadbukhari4245@gmail.com
              </a>
              <a
                href="tel:+923005174444"
                className="block hover:text-[var(--color-text-heading)] transition-colors"
              >
                +92 300 517 4444
              </a>
              <a
                href="https://calendly.com/ahmadbukhari4245"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-[var(--color-accent)] hover:underline"
              >
                Book a Discovery Call
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-[var(--color-border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-text-disabled)]">
            &copy; {new Date().getFullYear()} AiXCEL Solutions. All rights reserved.
          </p>
          <p className="text-xs text-[var(--color-text-disabled)]">
            Built with precision by Ahmad Bukhari
          </p>
        </div>
      </div>
    </footer>
  );
}
