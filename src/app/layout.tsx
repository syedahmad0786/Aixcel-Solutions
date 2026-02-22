import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aixcel Solutions | AI Automation & Intelligent Systems",
  description:
    "We automate the work that slows your business down. AI agents, workflow automation, and intelligent systems for forward-thinking organizations.",
  icons: {
    icon: "/favicon.svg",
  },
  keywords: [
    "AI automation",
    "business automation",
    "AI agents",
    "workflow automation",
    "enterprise AI",
    "voice AI",
    "data intelligence",
  ],
  openGraph: {
    title: "Aixcel Solutions | AI Automation & Intelligent Systems",
    description:
      "We automate the work that slows your business down. AI agents, workflow automation, and intelligent systems.",
    type: "website",
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
        <meta name="theme-color" content="#08080A" />
      </head>
      <body className="min-h-screen bg-bg antialiased">{children}</body>
    </html>
  );
}
