"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const QUOTES = [
  {
    text: "Laliguras transformed my understanding of flowers. I've grown species I thought impossible in my climate, with guidance from the most generous community I've ever encountered.",
    name: "Emilia Voss",
    role: "Curator Member · Germany",
    initials: "EV",
  },
  {
    text: "The monthly gazette alone is worth every penny. The depth of botanical knowledge shared freely here would cost hundreds elsewhere. I've become a genuine flower scientist.",
    name: "Marcus Chen",
    role: "Gardener Member · Singapore",
    initials: "MC",
  },
  {
    text: "I joined as a complete novice. Within three months, my rhododendrons were blooming like I'd tended them for years. The community is endlessly patient and passionate.",
    name: "Aisha Rajan",
    role: "Gardener Member · India",
    initials: "AR",
  },
];

export default function TestimonialsSection() {
  const ref      = useRef<HTMLElement>(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".test-head", {
        y: 40, opacity: 0, duration: 0.9,
        scrollTrigger: { trigger: ref.current, start: "top 80%" },
      });
      gsap.from(".test-card", {
        y: 50, opacity: 0, duration: 0.9,
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const q = QUOTES[idx];

  const prev = () => setIdx((i) => (i - 1 + QUOTES.length) % QUOTES.length);
  const next = () => setIdx((i) => (i + 1) % QUOTES.length);

  return (
    <section
      ref={ref}
      className="section-pad-lg relative overflow-hidden"
      style={{
        background: "var(--bg)",
      }}
    >
      {/* Decorative rose glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "600px", height: "600px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(184,43,88,0.08) 0%, transparent 70%)",
          top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        }}
      />

      <div className="container-sm relative">
        <div className="test-head text-center mb-12">
          <div className="eyebrow mb-4" style={{ justifyContent: "center" }}>Member Stories</div>
          <h2
            style={{
              fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 800,
              color: "var(--cream)",
              letterSpacing: "-0.015em",
            }}
          >
            Voices from the Garden
          </h2>
        </div>

        {/* Quote card */}
        <div
          className="test-card card-glass rounded-2xl text-center"
          style={{ border: "1px solid var(--border-s)", padding: "clamp(2.5rem, 5vw, 4rem)" }}
        >
          <Quote
            size={44}
            style={{ color: "var(--rose)", margin: "0 auto 2.5rem", opacity: 0.5 }}
          />
          <p
            key={idx}
            style={{
              fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
              fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
              fontStyle: "italic",
              color: "var(--cream)",
              lineHeight: 1.8,
              marginBottom: "3rem",
              maxWidth: "680px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            &ldquo;{q.text}&rdquo;
          </p>

          {/* Author */}
          <div className="flex items-center justify-center gap-4 pb-2">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--rose)", color: "white", fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: "15px" }}
            >
              {q.initials}
            </div>
            <div className="text-left">
              <div
                style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)", fontWeight: 700, color: "var(--cream)", fontSize: "1.05rem" }}
              >
                {q.name}
              </div>
              <div className="t-caption mt-0.5">{q.role}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-6 mt-10">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            style={{ border: "1px solid var(--border-s)", background: "var(--card)", color: "var(--muted)" }}
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex gap-2">
            {QUOTES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className="rounded-full transition-all"
                style={{
                  width: i === idx ? "24px" : "6px",
                  height: "6px",
                  background: i === idx ? "var(--rose)" : "var(--border)",
                }}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            style={{ border: "1px solid var(--border-s)", background: "var(--card)", color: "var(--muted)" }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
