"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Services", href: "/services" },
  { name: "Mission", href: "/mission" },
  { name: "Insights", href: "/insights" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-surface/80 backdrop-blur-xl border-b border-white/[0.06]"
            : "bg-transparent"
        }`}
      >
        <div className="section-padding">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-9 h-9 flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-blue to-accent-purple rounded-lg opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="absolute inset-0 border border-accent-purple/30 rounded-lg" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gradient font-bold text-lg">A</span>
                </div>
              </div>
              <span className="text-lg font-semibold tracking-tight">
                <span className="text-white">Aixcel</span>
                <span className="text-white/60"> Solutions</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-5 py-2 text-sm transition-colors duration-300 ${
                    pathname === link.href
                      ? "text-white"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center">
              <Link href="/contact" className="btn-primary text-sm px-6 py-2.5">
                Get Started
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden relative w-10 h-10 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <div className="flex flex-col gap-[5px]">
                <motion.span
                  animate={
                    mobileOpen
                      ? { rotate: 45, y: 7, width: 24 }
                      : { rotate: 0, y: 0, width: 24 }
                  }
                  transition={{ duration: 0.3 }}
                  className="h-[1.5px] bg-white block origin-center"
                />
                <motion.span
                  animate={
                    mobileOpen ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }
                  }
                  transition={{ duration: 0.2 }}
                  className="w-4 h-[1.5px] bg-white block"
                />
                <motion.span
                  animate={
                    mobileOpen
                      ? { rotate: -45, y: -7, width: 24 }
                      : { rotate: 0, y: 0, width: 16 }
                  }
                  transition={{ duration: 0.3 }}
                  className="h-[1.5px] bg-white block origin-center"
                />
              </div>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-surface/95 backdrop-blur-2xl pt-28 px-8 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="py-4 border-b border-white/[0.06] flex items-center justify-between group"
                  >
                    <span className="text-2xl text-white/80 group-hover:text-white transition-colors">
                      {link.name}
                    </span>
                    <svg
                      className="w-4 h-4 text-white/20 group-hover:text-accent-purple transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="mt-8"
              >
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full text-center"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
