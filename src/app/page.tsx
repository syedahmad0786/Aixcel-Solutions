"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import GlobalSection from "@/components/GlobalSection";
import ComplianceSection from "@/components/ComplianceSection";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import InsightsSection from "@/components/InsightsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <div className="glow-line" />
        <ServicesSection />
        <div className="glow-line" />
        <AboutSection />
        <div className="glow-line" />
        <GlobalSection />
        <div className="glow-line" />
        <ComplianceSection />
        <div className="glow-line" />
        <CaseStudiesSection />
        <div className="glow-line" />
        <TestimonialsSection />
        <div className="glow-line" />
        <InsightsSection />
        <div className="glow-line" />
        <ContactSection />
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}
