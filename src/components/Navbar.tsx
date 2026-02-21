"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Services", href: "#services" },
  { name: "Mission", href: "#mission" },
  { name: "Insights", href: "#insights" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
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
            <a href="#home" className="flex items-center gap-3 group">
              {/* Hexagonal logo SVG */}
              <div className="relative w-10 h-10 flex-shrink-0">
                <svg
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  <defs>
                    <linearGradient
                      id="hex-gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#6366F1" />
                      <stop offset="50%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                  {/* Hexagon shape */}
                  <path
                    d="M20 2L36.66 11V29L20 38L3.34 29V11L20 2Z"
                    stroke="url(#hex-gradient)"
                    strokeWidth="1.5"
                    fill="none"
                    className="group-hover:fill-[rgba(139,92,246,0.1)] transition-all duration-300"
                  />
                  {/* Inner hexagon */}
                  <path
                    d="M20 8L30.39 13.5V24.5L20 30L9.61 24.5V13.5L20 8Z"
                    fill="url(#hex-gradient)"
                    opacity="0.15"
                  />
                  {/* A letter */}
                  <text
                    x="20"
                    y="24"
                    textAnchor="middle"
                    fill="url(#hex-gradient)"
                    fontSize="14"
                    fontWeight="700"
                    fontFamily="Inter, sans-serif"
                  >
                    A
                  </text>
                </svg>
              </div>
              <span className="font-serif text-xl tracking-tight">
                <span className="text-white">Aixcel</span>
                <span className="text-gradient"> Solutions</span>
              </span>
            </a>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-5 py-2 text-[13px] font-mono uppercase tracking-[0.08em] text-white/50 hover:text-white transition-colors duration-300"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center">
              <a href="#contact" className="btn-primary text-xs px-6 py-3">
                Get Started
              </a>
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

      {/* Mobile Menu Overlay */}
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
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  onClick={() => setMobileOpen(false)}
                  className="py-4 border-b border-white/[0.06] flex items-center justify-between group"
                >
                  <span className="text-2xl font-serif text-white/80 group-hover:text-white transition-colors">
                    {link.name}
                  </span>
                  <svg
                    className="w-4 h-4 text-white/20 group-hover:text-accent-purple transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="mt-8"
              >
                <a
                  href="#contact"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full text-center"
                >
                  Get Started
                </a>
              </motion.div>

              {/* Contact info at bottom */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-auto pt-12"
              >
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-white/30">
                  hello@aixcelsolutions.com
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
