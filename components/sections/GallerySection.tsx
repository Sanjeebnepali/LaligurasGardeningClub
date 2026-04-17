"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { useFlowerPool, pick } from "@/lib/useFlowerPool";

gsap.registerPlugin(ScrollTrigger);

const GALLERY_TYPES = ["rhododendron", "tulip", "peony", "rose", "orchid", "lavender"] as const;
const GALLERY_ALTS  = ["Rhododendron", "Parrot Tulips", "Peony", "Rose", "Orchid", "Lavender"];

export default function GallerySection() {
  const ref = useRef<HTMLElement>(null);
  const pool = useFlowerPool(GALLERY_TYPES);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".gal-img", {
        scale: 0.88, opacity: 0, duration: 0.85, stagger: 0.08, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 78%" },
      });
      gsap.from(".gal-head", {
        y: 40, opacity: 0, duration: 0.9,
        scrollTrigger: { trigger: ref.current, start: "top 82%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="section-pad-lg" style={{ background: "var(--bg)" }}>
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
                lineHeight: 1.1,
              }}
            >
              Petals &amp;<br />
              <span
                style={{
                  background: "linear-gradient(135deg, var(--rose-light), var(--petal))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Portraits
              </span>
            </h2>
          </div>
          <Link href="/gallery" className="btn btn-outline-rose flex-shrink-0">
            Full Gallery <ArrowRight size={14} />
          </Link>
        </div>

        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
        >
          {GALLERY_TYPES.map((type, i) => (
            <Link
              href="/gallery"
              key={type}
              className="gal-img img-zoom rounded-xl overflow-hidden block"
              style={{
                height: i === 0 || i === 3 ? "340px" : "240px",
                border: "1px solid var(--border-s)",
                gridColumn: i === 0 ? "1 / 2" : i === 3 ? "2 / 4" : "auto",
              }}
            >
              <img
                src={pick(pool, type)}
                alt={GALLERY_ALTS[i]}
                className="w-full h-full object-cover"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
