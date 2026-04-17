"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Flower } from "lucide-react";
import { useFlowerPool, pick } from "@/lib/useFlowerPool";

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  "Conservation of rare Himalayan flowering species",
  "Scientific education through workshops & field study",
  "A global network of passionate flower cultivators",
];

export default function AboutSection() {
  const ref  = useRef<HTMLElement>(null);
  const pool = useFlowerPool(["rhododendron"]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".ab-left", {
        x: -70, opacity: 0, duration: 1.1, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
      gsap.from(".ab-right", {
        x: 70, opacity: 0, duration: 1.1, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
      gsap.from(".ab-stat", {
        y: 35, opacity: 0, duration: 0.8, stagger: 0.13, ease: "power2.out",
        scrollTrigger: { trigger: ".ab-stats", start: "top 85%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="section-pad-lg" style={{ background: "var(--surface)" }}>
      <div className="container">

        {/* ── Rule ── */}
        <div className="flex items-center gap-6" style={{ marginBottom: "64px" }}>
          <div className="hr-rose flex-shrink-0" />
          <span className="t-label" style={{ color: "var(--muted)", flexShrink: 0 }}>Our Founding</span>
          <div className="hr" />
          <span className="t-label" style={{ color: "var(--muted)", flexShrink: 0 }}>Est. April 2, 2026</span>
        </div>

        {/* ── Two-column grid ── */}
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-28 items-start">

          {/* Left: image */}
          <div className="ab-left relative">
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid var(--border)", background: "var(--card)" }}
            >
              <img
                src="/images/about-gardening.webp"
                alt="Flower gardening at Laliguras"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>

            {/* Floating inset photo */}
            <div
              className="img-zoom absolute hidden md:block rounded-xl overflow-hidden shadow-2xl"
              style={{
                width: "190px", height: "230px",
                right: "-24px", bottom: "32px",
                border: "3px solid var(--surface)",
              }}
            >
              <img
                src={pick(pool, "rhododendron")}
                alt="Himalayan rhododendron blooms"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Founded badge */}
            <div
              className="absolute top-6 left-6 rounded-xl"
              style={{ padding: "16px 20px", background: "var(--card)", border: "1px solid var(--border)", backdropFilter: "blur(12px)" }}
            >
              <Flower size={18} style={{ color: "var(--rose-light)", marginBottom: "8px" }} />
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "9px", color: "var(--muted)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "4px" }}>Founded</div>
              <div style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)", fontSize: "19px", fontStyle: "italic", color: "var(--rose-light)", lineHeight: 1.2, fontWeight: 700 }}>Apr 2, 2026</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "9px", color: "var(--muted)", marginTop: "6px" }}>Woosong Univ · Daejeon, KR</div>
            </div>
          </div>

          {/* Right: content */}
          <div className="ab-right" style={{ paddingTop: "12px" }}>

            <div className="eyebrow" style={{ marginBottom: "20px" }}>Our Mission</div>

            <h2
              style={{
                fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                fontSize: "clamp(2rem, 4.5vw, 4rem)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: "var(--cream)",
                marginBottom: "28px",
              }}
            >
              To Cultivate,<br />
              Conserve &amp;<br />
              <em
                style={{
                  fontStyle: "italic",
                  background: "linear-gradient(135deg, var(--rose-light), var(--petal))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Celebrate
              </em>
            </h2>

            <div className="hr-rose" style={{ marginBottom: "32px" }} />

            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "15px",
                color: "var(--muted)",
                lineHeight: 1.8,
                marginBottom: "20px",
              }}
            >
              Founded on April 2, 2026 at Woosong University, Daejeon, South Korea — Laliguras was born from one simple conviction: flowers deserve a dedicated community of passionate cultivators and storytellers.
            </p>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "15px",
                color: "var(--muted)",
                lineHeight: 1.8,
                marginBottom: "40px",
              }}
            >
              From campus bloom walks to international flower exchanges, our growing community celebrates the extraordinary diversity of flowering plants — bloom by bloom, season by season.
            </p>

            {/* Pillars */}
            <ul style={{ marginBottom: "44px", display: "flex", flexDirection: "column", gap: "16px" }}>
              {PILLARS.map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                  <span
                    style={{
                      marginTop: "8px",
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: "var(--rose-light)",
                    }}
                  />
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--muted)", lineHeight: 1.7 }}>{item}</span>
                </li>
              ))}
            </ul>

            <Link href="/about" className="btn btn-primary">
              Our Full Story <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* ── Stats strip ── */}
        <div
          className="ab-stats grid grid-cols-2 md:grid-cols-4 rounded-2xl overflow-hidden"
          style={{ border: "1px solid var(--border)", marginTop: "80px" }}
        >
          {[
            { n: "Est. 2026", l: "Woosong University" },
            { n: "200+",      l: "Flower Species"     },
            { n: "Daejeon",   l: "South Korea"        },
            { n: "Global",    l: "Community Network"  },
          ].map(({ n, l }, i) => (
            <div
              key={l}
              className="ab-stat flex flex-col items-center justify-center text-center"
              style={{
                padding: "44px 24px",
                borderRight: i < 3 ? "1px solid var(--border)" : "none",
                borderBottom: i < 2 ? "1px solid var(--border)" : "none",
                background: i % 2 === 0 ? "var(--card)" : "var(--surface)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                  fontSize: "clamp(1.8rem, 4vw, 3rem)",
                  fontWeight: 800,
                  lineHeight: 1,
                  background: "linear-gradient(135deg, var(--rose-light), var(--petal))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                {n}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "11px",
                  color: "var(--muted)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {l}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
