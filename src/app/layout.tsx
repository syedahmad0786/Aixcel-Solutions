import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aixcel Solutions | AI-Powered Business Intelligence & Automation",
  description:
    "Aixcel Solutions partners with HNWI, family offices, and leading agencies to deliver enterprise AI solutions, workflow automation, and intelligent business systems that drive measurable ROI.",
  keywords: [
    "AI consulting",
    "business automation",
    "HNWI",
    "enterprise AI",
    "workflow automation",
    "AI agents",
    "digital transformation",
  ],
  openGraph: {
    title: "Aixcel Solutions | AI-Powered Business Intelligence",
    description:
      "Enterprise AI solutions for HNWI, family offices, and agencies.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  );
}
