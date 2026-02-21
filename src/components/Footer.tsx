"use client";

import { motion } from "framer-motion";

const footerLinks = {
  services: [
    { name: "AI Agents & Copilots", href: "#services" },
    { name: "Workflow Automation", href: "#services" },
    { name: "Data Intelligence", href: "#services" },
    { name: "Strategic Consulting", href: "#services" },
    { name: "Custom Platforms", href: "#services" },
    { name: "AI Governance", href: "#services" },
  ],
  company: [
    { name: "About Us", href: "#about" },
    { name: "Case Studies", href: "#case-studies" },
    { name: "Insights", href: "#insights" },
    { name: "Careers", href: "#" },
    { name: "Contact", href: "#contact" },
  ],
  resources: [
    { name: "Documentation", href: "#" },
    { name: "API Reference", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
  ],
};

const socials = [
  {
    name: "LinkedIn",
    href: "#",
    icon: (
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    ),
  },
  {
    name: "Twitter",
    href: "#",
    icon: (
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    ),
  },
  {
    name: "YouTube",
    href: "#",
    icon: (
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
    ),
  },
];

export default function Footer() {
  return (
    <footer className="relative">
      {/* Glow Line */}
      <div className="glow-line" />

      <div className="section-padding py-16 relative z-10">
        {/* 5-Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          {/* Brand Column (wider) */}
          <div className="col-span-2">
            <a href="#home" className="inline-flex items-center gap-3 mb-5">
              <div className="relative w-9 h-9">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-blue to-accent-purple rounded-lg" />
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                  A
                </div>
              </div>
              <span className="text-xl font-serif text-white">
                Aixcel Solutions
              </span>
            </a>
            <p className="text-white/30 text-sm leading-relaxed mb-6 max-w-xs">
              AI-powered business intelligence and automation for HNWI, family
              offices, and leading agencies worldwide.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-white hover:border-accent-purple/30 transition-all duration-300"
                  aria-label={social.name}
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {social.icon}
                  </svg>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-white/50 mb-5">
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/30 hover:text-white text-sm transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-white/50 mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/30 hover:text-white text-sm transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-white/50 mb-5">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/30 hover:text-white text-sm transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs font-mono">
            &copy; {new Date().getFullYear()} Aixcel Solutions. All rights
            reserved.
          </p>
          <p className="text-white/15 text-xs font-mono">
            Designed with precision
          </p>
        </div>
      </div>
    </footer>
  );
}
