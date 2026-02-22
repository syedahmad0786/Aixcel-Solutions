import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aixcel Solutions | AI Automation & Intelligent Systems",
  description:
    "We engineer AI systems that drive real business outcomes. Custom AI agents, workflow automation, and intelligent platforms for forward-thinking organizations.",
  icons: {
    icon: "/favicon.svg",
  },
  keywords: [
    "AI automation",
    "AI agents",
    "workflow automation",
    "enterprise AI",
    "voice AI",
    "data intelligence",
    "AI consulting",
    "business automation",
    "AI platforms",
  ],
  openGraph: {
    title: "Aixcel Solutions | AI Automation & Intelligent Systems",
    description:
      "We engineer AI systems that drive real business outcomes. Custom AI agents, workflow automation, and intelligent platforms.",
    type: "website",
    siteName: "Aixcel Solutions",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aixcel Solutions | AI Automation & Intelligent Systems",
    description:
      "We engineer AI systems that drive real business outcomes. Custom AI agents, workflow automation, and intelligent platforms.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#050507" />
      </head>
      <body className="min-h-screen bg-bg antialiased">{children}</body>
    </html>
  );
}
