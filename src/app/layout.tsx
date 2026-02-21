import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aixcel Solutions | AI-Powered Enterprise Intelligence & Automation",
  description:
    "Aixcel Solutions partners with HNWI, family offices, and leading agencies to deliver enterprise AI solutions, workflow automation, and intelligent business systems.",
  keywords: [
    "AI consulting", "business automation", "HNWI", "enterprise AI",
    "workflow automation", "AI agents", "Agentic AI", "Voice AI",
  ],
  openGraph: {
    title: "Aixcel Solutions | AI-Powered Enterprise Intelligence",
    description: "Enterprise AI solutions for HNWI, family offices, and agencies.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#050505" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="min-h-screen bg-surface antialiased">
        {/* Cosmic background layers */}
        <div className="stars-layer" />
        <div className="grid-overlay" />
        {/* Nebula effects */}
        <div className="fixed top-[-10%] right-[-10%] w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(99,102,241,0.06)_0%,rgba(139,92,246,0.03)_40%,transparent_70%)] rounded-full blur-[80px] pointer-events-none z-0" />
        <div className="fixed bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(6,182,212,0.04)_0%,rgba(99,102,241,0.02)_40%,transparent_70%)] rounded-full blur-[80px] pointer-events-none z-0" />
        <div className="fixed top-[40%] left-[50%] -translate-x-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(139,92,246,0.04)_0%,transparent_60%)] rounded-full blur-[100px] pointer-events-none z-0" />
        {children}
      </body>
    </html>
  );
}
