"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { useFlowerPool, pick } from "@/lib/useFlowerPool";

gsap.registerPlugin(ScrollTrigger);

const ROW1_TYPES = ["rhododendron", "rose",     "tulip",    "peony",       "orchid",  "lavender", "dahlia", "lily"] as const;
const ROW2_TYPES = ["peony",        "lavender",  "orchid",   "rhododendron","rose",    "tulip",    "lily",   "dahlia"] as const;

const ROW1_ALTS = ["Rhododendron", "Rose", "Tulip", "Peony", "Orchid", "Lavender", "Dahlia", "Lily"];
const ROW2_ALTS = ["Peony", "Lavender", "Orchid", "Rhododendron", "Rose", "Tulip", "Lily", "Dahlia"];

export default function GallerySection() {
  const ref     = useRef<HTMLElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const pool    = useFlowerPool([...new Set([...ROW1_TYPES, ...ROW2_TYPES])]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".gal-head", {
        y: 40, opacity: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 82%" },
      });
      gsap.from(".gal-cta", {
        y: 24, opacity: 0, duration: 0.75, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 78%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  // Resolved URLs for both rows (duplicated for seamless loop)
  const row1Imgs = [...ROW1_TYPES, ...ROW1_TYPES].map((t, i) => ({
    src: pick(pool, t, i % ROW1_TYPES.length),
    alt: ROW1_ALTS[i % ROW1_ALTS.length]!,
    key: `r1-${i}`,
  }));
  const row2Imgs = [...ROW2_TYPES, ...ROW2_TYPES].map((t, i) => ({
    src: pick(pool, t, i % ROW2_TYPES.length),
    alt: ROW2_ALTS[i % ROW2_ALTS.length]!,
    key: `r2-${i}`,
  }));

  return (
    <section ref={ref} className="section-pad-lg overflow-hidden" style={{ background: "var(--bg)" }}>

      {/* ── Heading ── */}
      <div className="container">
        <div className="gal-head flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="eyebrow mb-4">Gallery</div>
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
              Petals &amp;<br />
              <span style={{ color: "var(--petal)" }}>Portraits</span>
            </h2>
          </div>
          <Link href="/gallery" className="gal-cta btn btn-outline-rose flex-shrink-0">
            Full Gallery <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* ── Kinetic marquee rows ── */}
      <div
        className="gal-rows"
        style={{ display: "flex", flexDirection: "column", gap: "12px", margin: "0 calc(-1 * clamp(24px, 5vw, 80px))" }}
      >
        {/* Row 1 — scrolls left */}
        <div
          ref={row1Ref}
          style={{ overflow: "hidden", cursor: "default" }}
          onMouseEnter={() => { if (row1Ref.current) row1Ref.current.style.setProperty("--gal-play", "paused"); }}
          onMouseLeave={() => { if (row1Ref.current) row1Ref.current.style.setProperty("--gal-play", "running"); }}
        >
          <div
            className="gal-strip"
            style={{
              display: "flex",
              gap: "12px",
              width: "max-content",
              animation: "galScrollLeft 38s linear infinite",
              animationPlayState: "var(--gal-play, running)",
            }}
          >
            {row1Imgs.map(({ src, alt, key }) => (
              <div
                key={key}
                className="img-zoom rounded-xl overflow-hidden flex-shrink-0"
                style={{ width: "clamp(180px, 22vw, 300px)", height: "clamp(130px, 16vw, 210px)", border: "1px solid var(--border-s)" }}
              >
                <img src={src} alt={alt} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div
          ref={row2Ref}
          style={{ overflow: "hidden", cursor: "default" }}
          onMouseEnter={() => { if (row2Ref.current) row2Ref.current.style.setProperty("--gal-play2", "paused"); }}
          onMouseLeave={() => { if (row2Ref.current) row2Ref.current.style.setProperty("--gal-play2", "running"); }}
        >
          <div
            className="gal-strip"
            style={{
              display: "flex",
              gap: "12px",
              width: "max-content",
              animation: "galScrollRight 42s linear infinite",
              animationPlayState: "var(--gal-play2, running)",
            }}
          >
            {row2Imgs.map(({ src, alt, key }) => (
              <div
                key={key}
                className="img-zoom rounded-xl overflow-hidden flex-shrink-0"
                style={{ width: "clamp(180px, 22vw, 300px)", height: "clamp(130px, 16vw, 210px)", border: "1px solid var(--border-s)" }}
              >
                <img src={src} alt={alt} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes galScrollLeft {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes galScrollRight {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
