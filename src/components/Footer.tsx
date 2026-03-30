"use client";

import Link from "next/link";

const footerLinks = {
  Company: [
    { name: "About", href: "/mission" },
    { name: "Services", href: "/services" },
    { name: "Insights", href: "/insights" },
    { name: "Contact", href: "/contact" },
  ],
  Services: [
    { name: "AI Agents", href: "/services" },
    { name: "Voice AI", href: "/services" },
    { name: "Data Intelligence", href: "/services" },
    { name: "Enterprise Automation", href: "/services" },
    { name: "AI Consulting", href: "/services" },
    { name: "Custom Platforms", href: "/services" },
  ],
  Connect: [
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/aixcel-solutions",
    },
    { name: "Twitter / X", href: "https://x.com/aixcelsolutions" },
    { name: "Email Us", href: "mailto:ahmad.bukhari@aixcelsolutions.com" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.04]">
      <div className="container">
        {/* Main footer */}
        <div className="py-24 md:py-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-14 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-5">
            <Link href="/" className="flex items-center gap-3 mb-8">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-[#A78BFA] flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <span className="text-[15px] font-semibold tracking-[-0.01em] text-text">
                Aixcel Solutions
              </span>
            </Link>
            <p className="text-text-secondary text-[15px] leading-[1.8] max-w-sm mb-10">
              We engineer AI systems that drive real business outcomes. Custom
              agents, workflow automation, and intelligent platforms — built for
              production, not presentations.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {["n8n", "Make", "OpenAI", "Anthropic", "Vapi"].map((tech) => (
                <span key={tech} className="metric-badge">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="lg:col-span-2 lg:first:col-start-7">
              <h4 className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-text-muted mb-6">
                {title}
              </h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-text-secondary hover:text-text transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-10 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-text-muted">
            &copy; {new Date().getFullYear()} Aixcel Solutions. All rights
            reserved.
          </p>
          <p className="text-[12px] text-text-muted">
            Designed &amp; engineered with precision.
          </p>
        </div>
      </div>
    </footer>
  );
}
