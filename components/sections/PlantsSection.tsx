"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { useFlowerPool, pick } from "@/lib/useFlowerPool";

gsap.registerPlugin(ScrollTrigger);

const FEATURED = {
  name: "Himalayan Rhododendron",
  latin: "Rhododendron arboreum",
  badge: "National Flower",
  type: "rhododendron",
  desc: "The iconic crimson bloom that paints Himalayan hillsides each spring. Nepal's national flower — and the soul of Laliguras.",
};

const SUPPORTING = [
  {
    name: "Garden Rose",
    latin: "Rosa × hybrida",
    badge: "Classic",
    type: "rose",
    accent: "#D14E72",
    desc: "The queen of flowers — revered across cultures for fragrance and beauty.",
  },
  {
    name: "Peony",
    latin: "Paeonia lactiflora",
    badge: "Fragrant",
    type: "peony",
    accent: "#9B7FD4",
    desc: "Sumptuous bowl-shaped blooms beloved for their rich fragrance.",
  },
];

export default function PlantsSection() {
  const ref  = useRef<HTMLElement>(null);
  const pool = useFlowerPool(["rhododendron", "rose", "peony"]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".plants-head", {
        y: 40, opacity: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 80%" },
      });
      gsap.from(".plants-featured", {
        x: -55, opacity: 0, duration: 1.1, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
      gsap.from(".plants-side-card", {
        x: 55, opacity: 0, duration: 0.95, stagger: 0.16, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="section-pad-lg" style={{ background: "var(--bg)" }}>
      <div className="container">

        {/* Head row */}
        <div className="plants-head flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="eyebrow mb-4">Featured Blooms</div>
            <h2
              style={{
                fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontWeight: 800,
                letterSpacing: "-0.015em",
                color: "var(--cream)",
                lineHeight: 1.08,
              }}
            >
              Our Prized<br />
              <span style={{ color: "var(--petal)" }}>Flower Collection</span>
            </h2>
          </div>
          <Link href="/plants" className="btn btn-outline-rose flex-shrink-0">
            View All Flowers <ArrowRight size={14} />
          </Link>
        </div>

        {/* Asymmetric grid: 3fr featured + 2fr stacked side */}
        <div
          className="plants-grid grid gap-5"
          style={{ gridTemplateColumns: "3fr 2fr", alignItems: "stretch" }}
        >
          {/* Featured card — large, image fills, text overlay at bottom */}
          <Link
            href="/plants"
            className="plants-featured relative overflow-hidden rounded-2xl block"
            style={{
              minHeight: "clamp(400px, 58vw, 660px)",
              border: "1px solid var(--border)",
            }}
          >
            <img
              src={pick(pool, FEATURED.type)}
              alt={FEATURED.name}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}
            />
            {/* Gradient overlay for text */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to top, rgba(6,3,10,0.92) 0%, rgba(6,3,10,0.55) 38%, rgba(6,3,10,0.08) 65%, transparent 100%)",
              }}
            />
            {/* Badge */}
            <span
              className="badge absolute top-5 left-5"
              style={{ background: "rgba(0,0,0,0.5)", borderColor: "rgba(255,255,255,0.14)", color: "white" }}
            >
              {FEATURED.badge}
            </span>
            {/* Text overlay */}
            <div className="absolute inset-x-0 bottom-0" style={{ padding: "clamp(24px, 3.5vw, 48px)" }}>
              <div style={{ width: "3px", height: "30px", borderRadius: "99px", background: "var(--rose-light)", marginBottom: "18px" }} />
              <h3
                style={{
                  fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                  fontSize: "clamp(1.6rem, 3vw, 2.6rem)",
                  fontWeight: 800,
                  color: "var(--cream)",
                  lineHeight: 1.1,
                  marginBottom: "8px",
                  letterSpacing: "-0.015em",
                }}
              >
                {FEATURED.name}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                  fontSize: "1.05rem",
                  fontStyle: "italic",
                  color: "var(--dim)",
                  marginBottom: "14px",
                }}
              >
                {FEATURED.latin}
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--muted)", lineHeight: 1.75, maxWidth: "360px" }}>
                {FEATURED.desc}
              </p>
              <div className="flex items-center gap-2 mt-5" style={{ color: "var(--rose-light)", fontFamily: "var(--font-sans)", fontSize: "12px", letterSpacing: "0.08em" }}>
                Discover more <ArrowRight size={13} />
              </div>
            </div>
          </Link>

          {/* Stacked side cards */}
          <div className="flex flex-col gap-5">
            {SUPPORTING.map((f) => (
              <Link
                href="/plants"
                key={f.name}
                className="plants-side-card relative overflow-hidden rounded-2xl block flex-1"
                style={{
                  minHeight: "clamp(180px, 25vw, 310px)",
                  border: "1px solid var(--border)",
                  background: "var(--card)",
                }}
              >
                <img
                  src={pick(pool, f.type)}
                  alt={f.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to top, rgba(6,3,10,0.88) 0%, rgba(6,3,10,0.35) 50%, transparent 100%)",
                  }}
                />
                <span
                  className="badge absolute top-4 left-4"
                  style={{ background: "rgba(0,0,0,0.5)", borderColor: "rgba(255,255,255,0.12)", color: "white" }}
                >
                  {f.badge}
                </span>
                <div className="absolute inset-x-0 bottom-0" style={{ padding: "clamp(16px, 2.5vw, 28px)" }}>
                  <div style={{ width: "3px", height: "22px", borderRadius: "99px", background: f.accent, marginBottom: "12px" }} />
                  <h3
                    style={{
                      fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                      fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
                      fontWeight: 700,
                      color: "var(--cream)",
                      lineHeight: 1.15,
                      marginBottom: "4px",
                    }}
                  >
                    {f.name}
                  </h3>
                  <p style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "0.9rem", fontStyle: "italic", color: "var(--dim)" }}>
                    {f.latin}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile override */}
        <style>{`
          @media (max-width: 767px) {
            .plants-featured ~ div { margin-top: 0; }
          }
        `}</style>
      </div>
    </section>
  );
}
