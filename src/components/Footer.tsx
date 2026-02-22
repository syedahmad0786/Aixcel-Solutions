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
  ],
  Connect: [
    { name: "LinkedIn", href: "https://linkedin.com/company/aixcel-solutions" },
    { name: "Twitter / X", href: "https://x.com/aixcelsolutions" },
    { name: "Email Us", href: "mailto:ahmad.bukhari@aixcelsolutions.com" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container">
        {/* Main footer */}
        <div className="py-16 md:py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-5">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-[#A78BFA] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <span className="text-[15px] font-semibold tracking-[-0.01em] text-text">
                Aixcel Solutions
              </span>
            </Link>
            <p className="text-text-secondary text-[14px] leading-relaxed max-w-sm mb-8">
              We automate the work that slows your business down. AI agents,
              workflow automation, and intelligent systems for forward-thinking
              organizations.
            </p>
            {/* Tech badges */}
            <div className="flex flex-wrap gap-2">
              {["n8n", "Make", "OpenAI", "Zapier"].map((tech) => (
                <span key={tech} className="metric-badge">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="lg:col-span-2 lg:first:col-start-7">
              <h4 className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-text-muted mb-5">
                {title}
              </h4>
              <ul className="space-y-3.5">
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
        <div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-text-muted">
            &copy; {new Date().getFullYear()} Aixcel Solutions. All rights reserved.
          </p>
          <p className="text-[12px] text-text-muted">
            Designed &amp; built with precision.
          </p>
        </div>
      </div>
    </footer>
  );
}
