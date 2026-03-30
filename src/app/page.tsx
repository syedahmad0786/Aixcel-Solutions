import Hero from "@/components/home/Hero";
import LogoBar from "@/components/home/LogoBar";
import ProblemSolution from "@/components/home/ProblemSolution";
import ServicesOverview from "@/components/home/ServicesOverview";
import Process from "@/components/home/Process";
import Metrics from "@/components/home/Metrics";
import CaseStudies from "@/components/home/CaseStudies";
import Testimonial from "@/components/home/Testimonial";
import FounderPreview from "@/components/home/FounderPreview";
import FinalCTA from "@/components/home/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LogoBar />
      <ProblemSolution />
      <ServicesOverview />
      <Process />
      <Metrics />
      <CaseStudies />
      <Testimonial />
      <FounderPreview />
      <FinalCTA />
    </>
  );
}
