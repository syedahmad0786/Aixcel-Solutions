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
    meta: "Scope frozen · US enterprise · 06 engines",
  },
  {
    number: "02",
    label: "Observed answer",
    title: "Meridian leads the observed answer set.",
    detail: "Position, framing, sentiment, and citations stay separate from inference.",
    meta: "Observed · 48 answers · 30-day sample",
  },
  {
    number: "03",
    label: "Source evidence",
    title: "Independent comparison sources repeat the same proof.",
    detail: "The answer is traced back to the material influencing it.",
    meta: "24 sources · 4 categories · 8 repeat citations",
  },
  {
    number: "04",
    label: "Diagnosis",
    title: "The advantage is consistency, not content volume.",
    detail: "SIGNAL explains the pattern without presenting opinion as observation.",
    meta: "Inferred · strategy agent · evidence connected",
  },
  {
    number: "05",
    label: "Ranked action",
    title: "Publish one independently verifiable proof system.",
    detail: "The final plane resolves flat because the evidence is ready to operate.",
    meta: "Priority 01 · owner assigned · next operating cycle",
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

function Plane({ step, index, progress, active }) {
  const center = 0.1 + index * 0.2;
  const start = Math.max(0.01, center - 0.13);
  const end = Math.min(0.99, center + 0.15);
  const final = index === steps.length - 1;
  const input = [0, start, center, end, 1];
  const z = useTransform(progress, input, [-480, -300, 0, final ? 0 : -360, final ? 0 : -440]);
  const y = useTransform(progress, input, [150, 85, 0, final ? 0 : -118, final ? 0 : -150]);
  const rotateX = useTransform(progress, input, [18, 12, 0, final ? 0 : -7, final ? 0 : -9]);
  const rotateY = useTransform(progress, input, [index % 2 ? 4 : -4, index % 2 ? 3 : -3, 0, 0, 0]);
  const scale = useTransform(progress, input, [0.86, 0.92, 1, final ? 1 : 0.94, final ? 1 : 0.92]);
  const opacity = useTransform(progress, input, [0, 0.2, 1, final ? 1 : 0.09, final ? 1 : 0.04]);
  return (
    <m.article
      className={`motion-plane${final ? " is-final" : ""}`}
      aria-hidden={!active}
      style={{ z, y, rotateX, rotateY, scale, opacity, zIndex: active ? 20 : index }}
    >
      <div className="motion-plane-index"><i>{step.number}</i><span>{step.label}</span></div>
      <div className="motion-plane-copy"><h3>{step.title}</h3><p>{step.detail}</p></div>
      <div className="motion-plane-meta">{step.meta}</div>
    </m.article>
  );
}

function EvidenceStory() {
  const target = useRef(null);
  const reduced = useReducedMotion();
  const compact = useCompact();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 145, damping: 34, mass: 0.32 });
  const scale = useTransform(progress, [0, 1], [0, 1]);

  useMotionValueEvent(progress, "change", (latest) => {
    const next = Math.min(steps.length - 1, Math.max(0, Math.floor(latest * steps.length)));
    setActive((current) => current === next ? current : next);
  });

  if (reduced || compact) return <LinearStory reduced={reduced} />;

  return (
    <section ref={target} className="motion-story" aria-labelledby="signal-motion-title">
      <div className="motion-sticky">
        <div className="motion-rail">
          <div>
            <span className="motion-kicker">Signature evidence sequence · synthetic demonstration</span>
            <h2 id="signal-motion-title">Depth closes as evidence becomes a decision.</h2>
          </div>
          <ol>
            {steps.map((step, index) => (
              <li key={step.number} className={active === index ? "is-active" : ""}>
                <i>{step.number}</i><span>{step.label}</span>
              </li>
            ))}
          </ol>
          <div className="motion-progress"><m.i style={{ scaleY: scale }} /></div>
          <p>Native page scroll. No snapping, interception, or forced pacing.</p>
        </div>
        <div className="motion-stage" aria-live="polite">
          <div className="motion-stage-label"><span>Evidence trace</span><strong>{steps[active].number} / 05</strong></div>
          {steps.map((step, index) => <Plane key={step.number} step={step} index={index} progress={progress} active={active === index} />)}
          <div className="motion-stage-grid" aria-hidden="true" />
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
