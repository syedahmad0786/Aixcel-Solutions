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
    <main>
      <Navbar />
      <HeroSection />
      <div className="section-divider" />
      <AboutSection />
      <div className="section-divider" />
      <ServicesSection />
      <div className="section-divider" />
      <GlobalSection />
      <div className="section-divider" />
      <ComplianceSection />
      <div className="section-divider" />
      <CaseStudiesSection />
      <div className="section-divider" />
      <TestimonialsSection />
      <div className="section-divider" />
      <InsightsSection />
      <div className="section-divider" />
      <ContactSection />
      <Footer />
      <Chatbot />
    </main>
  );
}
