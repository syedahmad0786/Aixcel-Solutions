import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AiXCEL Solutions — AI Automation That Delivers ROI",
    template: "%s | AiXCEL Solutions",
  },
  description:
    "We automate the work that slows your business down. Production-grade AI agents, voice AI, and enterprise automation with 90-day payoff targets. 200+ automations deployed, 50+ clients, 12 industries.",
  keywords: [
    "AI automation",
    "agentic AI",
    "voice AI",
    "enterprise automation",
    "business process automation",
    "AI consulting",
    "fractional CTO",
  ],
  authors: [{ name: "Ahmad Bukhari" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aixcelsolutions.com",
    siteName: "AiXCEL Solutions",
    title: "AiXCEL Solutions — AI Automation That Delivers ROI",
    description:
      "Production-grade AI agents, voice AI, and enterprise automation. 200+ automations deployed across 12 industries.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AiXCEL Solutions — AI Automation That Delivers ROI",
    description:
      "Production-grade AI agents, voice AI, and enterprise automation. 200+ automations deployed across 12 industries.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="noise-overlay">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--color-accent)] focus:text-[var(--color-bg-primary)] focus:rounded-lg focus:text-sm focus:font-medium"
        >
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
