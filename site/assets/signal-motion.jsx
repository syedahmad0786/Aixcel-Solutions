import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

const steps = [
  {
    number: "01",
    label: "Buyer question",
    title: "Which firm should I hire for enterprise revenue operations?",
    detail: "One commercial question becomes the stable unit of analysis.",
    meta: "Scope frozen · US enterprise · 09 answer surfaces",
    metrics: [["Question set", "01"], ["Market", "US"]],
  },
  {
    number: "02",
    label: "Observed answer",
    title: "Meridian leads the observed answer set.",
    detail: "Position, framing, sentiment, and citations stay separate from inference.",
    meta: "Observed · 48 answers · 30-day sample",
    metrics: [["Sample company", "37%"], ["Leader", "62%"]],
  },
  {
    number: "03",
    label: "Source evidence",
    title: "Independent comparison sources repeat the same proof.",
    detail: "The answer is traced back to the material influencing it.",
    meta: "24 sources · 4 categories · 8 repeat citations",
    metrics: [["Sources", "24"], ["Repeat", "08"]],
  },
  {
    number: "04",
    label: "Diagnosis",
    title: "The advantage is consistency, not content volume.",
    detail: "SIGNAL explains the pattern without presenting opinion as observation.",
    meta: "Inferred · strategy agent · evidence connected",
    metrics: [["Confidence", "High"], ["State", "Inferred"]],
  },
  {
    number: "05",
    label: "Ranked action",
    title: "Publish one independently verifiable proof system.",
    detail: "The final plane resolves flat because the evidence is ready to operate.",
    meta: "Priority 01 · owner assigned · next operating cycle",
    metrics: [["Priority", "01"], ["Owner", "Assigned"]],
  },
];

function useCompact() {
  const query = "(max-width: 767px)";
  const [compact, setCompact] = useState(() => matchMedia(query).matches);
  useEffect(() => {
    const media = matchMedia(query);
    const update = () => setCompact(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return compact;
}

function LinearStory({ reduced }) {
  return (
    <section className="motion-linear" aria-labelledby="signal-motion-linear-title">
      <header>
        <span>{reduced ? "Reduced-motion evidence sequence" : "Mobile evidence sequence"}</span>
        <h2 id="signal-motion-linear-title">The complete reasoning chain stays in view.</h2>
        <p>Question, observation, source, diagnosis, and action remain readable without a 3D camera.</p>
      </header>
      <div className="motion-linear-list">
        {steps.map((step, index) => (
          <article key={step.number} className={index === steps.length - 1 ? "is-final" : ""}>
            <div><i>{step.number}</i><span>{step.label}</span></div>
            <h3>{step.title}</h3>
            <p>{step.detail}</p>
            <small>{step.meta}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function ActivePlane({ step, active }) {
  const final = active === steps.length - 1;
  return (
    <article className={`motion-active-plane${final ? " is-final" : ""}`} data-motion-active-plane>
      <div className="motion-plane-index"><i>{step.number}</i><span>{step.label}</span></div>
      <m.div
        key={step.number}
        className="motion-plane-copy"
        initial={{ opacity: 0.45, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42 }}
      >
        <h3>{step.title}</h3>
        <p>{step.detail}</p>
      </m.div>
      <div className="motion-plane-metrics">
        {step.metrics.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
      </div>
      <div className="motion-plane-meta">{step.meta}</div>
    </article>
  );
}

function EvidenceStory() {
  const target = useRef(null);
  const reduced = useReducedMotion();
  const compact = useCompact();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 145, damping: 34, mass: 0.32 });
  const scale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const cameraY = useTransform(progress, [0, 0.5, 1], [16, 0, -16]);
  const cameraRotateX = useTransform(progress, [0, 0.5, 1], [2.4, 0, -2.4]);
  const cameraRotateY = useTransform(progress, [0, 0.25, 0.5, 0.75, 1], [-1.4, 1.2, -0.8, 1.1, 0]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const next = Math.min(steps.length - 1, Math.max(0, Math.round(latest * (steps.length - 1))));
    setActive((current) => current === next ? current : next);
  });

  const selectStep = (index) => {
    if (!target.current) return;
    const rect = target.current.getBoundingClientRect();
    const sectionTop = scrollY + rect.top;
    const travel = Math.max(0, target.current.offsetHeight - innerHeight);
    const position = sectionTop + (index / (steps.length - 1)) * travel;
    scrollTo({ top: position, behavior: reduced ? "auto" : "smooth" });
  };

  if (reduced || compact) return <LinearStory reduced={reduced} />;

  const step = steps[active];
  return (
    <section ref={target} className="motion-story" aria-labelledby="signal-motion-title">
      <div className="motion-sticky">
        <div className="motion-rail">
          <div>
            <span className="motion-kicker">Signature evidence sequence · synthetic demonstration</span>
            <h2 id="signal-motion-title">Depth closes as evidence becomes a decision.</h2>
          </div>
          <ol>
            {steps.map((item, index) => (
              <li key={item.number} className={active === index ? "is-active" : ""}>
                <button type="button" onClick={() => selectStep(index)} aria-current={active === index ? "step" : undefined}>
                  <i>{item.number}</i><span>{item.label}</span>
                </button>
              </li>
            ))}
          </ol>
          <div className="motion-progress"><m.i style={{ scaleY: scale }} /></div>
          <p>Scroll naturally or select a stage. The active evidence card remains visible at every point.</p>
        </div>
        <div className="motion-stage" aria-live="polite">
          <div className="motion-stage-label"><span>Evidence trace</span><strong>{step.number} / 05</strong></div>
          <div className="motion-stage-grid" aria-hidden="true" />
          <m.div className="motion-stage-camera" style={{ y: cameraY, rotateX: cameraRotateX, rotateY: cameraRotateY }}>
            <div className="motion-depth-plane depth-plane-three" aria-hidden="true" />
            <div className="motion-depth-plane depth-plane-two" aria-hidden="true" />
            <div className="motion-depth-plane depth-plane-one" aria-hidden="true" />
            <ActivePlane step={step} active={active} />
          </m.div>
          <div className="motion-stage-caption"><span>Observed</span><i /> <span>Inferred</span><i /> <span>Actionable</span></div>
        </div>
      </div>
    </section>
  );
}

function App() {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: [0.16, 1, 0.3, 1] }}>
      <LazyMotion features={domAnimation} strict>
        <EvidenceStory />
      </LazyMotion>
    </MotionConfig>
  );
}

const mount = document.getElementById("signal-motion-root");
if (mount) createRoot(mount).render(<App />);
