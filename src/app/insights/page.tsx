"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeUp, { Arrow } from "@/components/FadeUp";

const featured = {
  category: "AI Strategy",
  title:
    "Why Forward-Thinking Companies Are Building Private AI Infrastructure",
  excerpt:
    "The era of relying solely on public AI APIs is ending. Organizations serious about competitive advantage are investing in private, purpose-built AI systems — not just for data sovereignty, but because generic models can't match the precision of systems trained on your specific workflows, data, and domain expertise. Here's what the shift looks like and why it matters.",
  author: "Ahmad Bukhari",
  role: "Founder, Aixcel Solutions",
  date: "Feb 2026",
  readTime: "8 min read",
};

const articles = [
  {
    category: "AI Strategy",
    title: "Building an AI-First Organization: A Leadership Playbook",
    excerpt:
      "The difference between companies that succeed with AI and those that don't isn't technology — it's organizational design. How forward-thinking executives are restructuring teams, incentives, and decision-making around AI capabilities.",
    date: "Feb 2026",
    readTime: "6 min",
  },
  {
    category: "Automation ROI",
    title: "The Hidden Cost of Not Automating: A $2M Case Study",
    excerpt:
      "A real breakdown of how one enterprise discovered they were burning $2M annually on manual processes — document handling, data entry, compliance checks — that purpose-built AI agents could handle in seconds.",
    date: "Jan 2026",
    readTime: "5 min",
  },
  {
    category: "Voice AI",
    title: "Voice AI in 2026: From Chatbots to Autonomous Phone Agents",
    excerpt:
      "Voice-first AI has evolved far beyond 'press 1 for sales.' Today's autonomous voice agents handle complex conversations, qualify leads, book meetings, and escalate intelligently — replacing entire call center workflows.",
    date: "Jan 2026",
    readTime: "7 min",
  },
  {
    category: "Data Intelligence",
    title: "From Data Warehouses to Intelligence Engines",
    excerpt:
      "Traditional BI dashboards show you what happened. AI-native intelligence engines tell you what's happening now and what will happen next. Here's the architecture shift that's delivering 10x faster insights for enterprise teams.",
    date: "Dec 2025",
    readTime: "8 min",
  },
  {
    category: "Enterprise AI",
    title: "Scaling AI Across the Enterprise Without Breaking Things",
    excerpt:
      "A practical framework for rolling out AI capabilities department by department — starting with quick wins, building internal champions, and maintaining security and compliance at every stage.",
    date: "Dec 2025",
    readTime: "6 min",
  },
  {
    category: "Compliance",
    title: "AI Governance in 2026: What Your Board Needs to Know",
    excerpt:
      "New regulations are reshaping how enterprises deploy AI. This guide covers the regulatory landscape, risk frameworks, and practical governance structures that keep you compliant while maximizing AI's potential.",
    date: "Nov 2025",
    readTime: "9 min",
  },
];

export default function InsightsPage() {
  return (
    <>
      <Navbar />
      <main className="noise">
        {/* Hero */}
        <section className="hero-mesh relative pt-44 pb-24 md:pt-56 md:pb-32 lg:pt-64 lg:pb-36 overflow-hidden">
          <div className="glow w-[700px] h-[700px] bg-accent/15 -top-[250px] left-1/2 -translate-x-1/2" />
          <div className="container relative z-10">
            <FadeUp>
              <div className="section-label">Insights</div>
            </FadeUp>
            <FadeUp delay={0.06}>
              <h1 className="text-[clamp(42px,7vw,80px)] font-bold leading-[1.02] tracking-[-0.035em] mb-10">
                Knowledge Hub
              </h1>
            </FadeUp>
            <FadeUp delay={0.12}>
              <p className="text-text-secondary text-[17px] md:text-[20px] leading-[1.8] max-w-[620px]">
                Deep dives into AI strategy, automation frameworks, and
                enterprise intelligence. Practical insights from the front lines
                of AI transformation — written by practitioners, not pundits.
              </p>
            </FadeUp>
          </div>
        </section>

        {/* Featured Article */}
        <section className="pb-24 md:pb-32">
          <div className="container">
            <FadeUp>
              <article className="card-glass overflow-hidden cursor-pointer group">
                {/* Banner */}
                <div className="h-56 md:h-80 bg-gradient-to-br from-bg-elevated/50 via-bg-card/30 to-bg-elevated/50 flex items-center justify-center border-b border-white/[0.04] relative">
                  <div className="blueprint-grid absolute inset-0 pointer-events-none opacity-40" />
                  <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-text-muted group-hover:border-accent group-hover:text-accent transition-all duration-400 relative z-10">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="p-9 md:p-14">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-accent">
                      {featured.category}
                    </span>
                    <span className="text-text-muted text-[11px]">
                      &mdash;
                    </span>
                    <span className="font-mono text-[11px] text-text-muted">
                      Featured
                    </span>
                  </div>

                  <h2 className="text-[24px] md:text-[36px] font-bold text-text mb-7 leading-[1.15] tracking-[-0.02em] group-hover:text-text-secondary transition-colors max-w-3xl">
                    {featured.title}
                  </h2>

                  <p className="text-text-muted text-[16px] leading-[1.85] mb-12 max-w-3xl">
                    {featured.excerpt}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-8 border-t border-white/[0.04]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/20 to-[#A78BFA]/20 border border-accent/20 flex items-center justify-center">
                        <span className="text-[12px] font-mono font-semibold text-accent">
                          AB
                        </span>
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-text">
                          {featured.author}
                        </p>
                        <p className="text-[12px] font-mono text-text-muted">
                          {featured.date} &middot; {featured.readTime}
                        </p>
                      </div>
                    </div>
                    <span className="btn-primary text-[13px] px-7 py-3.5">
                      Read Article <Arrow />
                    </span>
                  </div>
                </div>
              </article>
            </FadeUp>
          </div>
        </section>

        <div className="container">
          <div className="divider-gradient" />
        </div>

        {/* Grid */}
        <section className="section-padding">
          <div className="container">
            <FadeUp>
              <div className="flex items-center justify-between mb-16 md:mb-20">
                <h2 className="text-[28px] md:text-[36px] font-bold tracking-[-0.025em]">
                  All Articles
                </h2>
                <span className="text-text-muted text-[13px] font-mono tracking-[0.05em]">
                  {articles.length} articles
                </span>
              </div>
            </FadeUp>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((a, i) => (
                <FadeUp key={a.title} delay={0.06 * i}>
                  <article className="card-glass p-9 md:p-10 cursor-pointer group h-full flex flex-col">
                    <span className="font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-accent">
                      {a.category}
                    </span>
                    <h3 className="text-[17px] font-bold text-text mt-6 mb-4 leading-snug group-hover:text-text-secondary transition-colors">
                      {a.title}
                    </h3>
                    <p className="text-text-muted text-[14px] leading-[1.8] mb-10 flex-1">
                      {a.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-white/[0.04]">
                      <span className="text-[12px] font-mono text-text-muted">
                        {a.date} &middot; {a.readTime}
                      </span>
                      <span className="text-[13px] font-medium text-text-muted flex items-center gap-2 group-hover:text-accent group-hover:gap-3 transition-all duration-300">
                        Read <Arrow size={12} />
                      </span>
                    </div>
                  </article>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
