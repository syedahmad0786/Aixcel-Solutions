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
    { name: "LinkedIn", href: "#" },
    { name: "Twitter / X", href: "#" },
    { name: "Email Us", href: "mailto:hello@aixcel.solutions" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container py-16 md:py-20">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-[15px] font-semibold tracking-tight text-primary">
                Aixcel
              </span>
            </Link>
            <p className="text-secondary text-sm leading-relaxed max-w-sm mb-6">
              We automate the work that slows your business down. AI agents,
              workflow automation, and intelligent systems for forward-thinking
              organizations.
            </p>
            <div className="flex items-center gap-3">
              {/* Partner badges */}
              {["Make.com", "n8n", "OpenAI"].map((partner) => (
                <span
                  key={partner}
                  className="px-3 py-1.5 text-[11px] font-mono font-medium text-muted border border-border rounded-md"
                >
                  {partner}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-mono text-xs font-medium uppercase tracking-wider text-muted mb-4">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-secondary hover:text-primary transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border-light flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} Aixcel Solutions. All rights
            reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-xs text-muted hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-xs text-muted hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
