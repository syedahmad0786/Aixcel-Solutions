"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import HeroSection from "@/components/HeroSection";
import MissionPreview from "@/components/MissionPreview";
import GlobalSection from "@/components/GlobalSection";
import ServicesPreview from "@/components/ServicesPreview";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <MissionPreview />
        <GlobalSection />
        <ServicesPreview />
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}
