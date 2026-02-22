"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Services", href: "/services" },
  { name: "About", href: "/mission" },
  { name: "Insights", href: "/insights" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#050507]/85 backdrop-blur-2xl border-b border-white/[0.04]"
            : "bg-transparent"
        }`}
      >
        <div className="container">
          <div className="flex items-center justify-between h-[80px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
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

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1.5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-5 py-2.5 rounded-xl text-[13px] font-medium transition-colors duration-200 ${
                    pathname === link.href
                      ? "text-text bg-white/[0.04]"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <Link
              href="/contact"
              className="hidden md:inline-flex items-center gap-2.5 px-6 py-3 bg-white text-[#050507] text-[13px] font-semibold rounded-xl hover:bg-[#E4E4E7] transition-all duration-200 hover:shadow-[0_0_24px_rgba(255,255,255,0.1)]"
            >
              Book a Call
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-11 h-11 flex items-center justify-center rounded-xl hover:bg-white/[0.04] transition-colors"
              aria-label="Toggle menu"
            >
              <div className="flex flex-col gap-[6px]">
                <motion.span
                  animate={
                    mobileOpen
                      ? { rotate: 45, y: 7.5, width: 20 }
                      : { rotate: 0, y: 0, width: 20 }
                  }
                  transition={{ duration: 0.2 }}
                  className="h-[1.5px] bg-text block origin-center"
                />
                <motion.span
                  animate={
                    mobileOpen
                      ? { opacity: 0, width: 20 }
                      : { opacity: 1, width: 14 }
                  }
                  transition={{ duration: 0.15 }}
                  className="h-[1.5px] bg-text block"
                />
                <motion.span
                  animate={
                    mobileOpen
                      ? { rotate: -45, y: -7.5, width: 20 }
                      : { rotate: 0, y: 0, width: 16 }
                  }
                  transition={{ duration: 0.2 }}
                  className="h-[1.5px] bg-text block origin-center"
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-bg pt-[80px] md:hidden"
          >
            <div className="container py-10 flex flex-col h-[calc(100%-80px)]">
              <div className="flex flex-col gap-2 flex-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.25 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="py-5 border-b border-white/[0.04] flex items-center justify-between group"
                    >
                      <span className="text-xl font-medium text-text">
                        {link.name}
                      </span>
                      <svg
                        className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.25 }}
                className="pb-10"
              >
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full"
                >
                  Book a Call
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
