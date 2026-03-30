export interface Testimonial {
  quote: string;
  name: string;
  title: string;
  company: string;
}

export const testimonials: Testimonial[] = [
  {
    quote: "Ahmad didn't just automate our workflows — he re-architected how our entire team operates. We went from drowning in manual data entry to having systems that think for us. The ROI was visible within the first month.",
    name: "Sarah Mitchell",
    title: "VP of Operations",
    company: "A Mid-Market Real Estate Firm",
  },
  {
    quote: "The Voice AI system Ahmad built handles our patient scheduling better than our previous call center. Patients actually prefer it — no hold times, available 24/7, and it never makes a booking error.",
    name: "Dr. James Park",
    title: "Managing Director",
    company: "A Healthcare Provider Network",
  },
  {
    quote: "We were skeptical about AI content — worried it would sound generic. Ahmad's pipeline produces content that our team can't distinguish from human-written. Our output went from 4 posts a month to 40.",
    name: "Maria Gonzalez",
    title: "Head of Marketing",
    company: "A B2B SaaS Company",
  },
];
