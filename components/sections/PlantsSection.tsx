"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { useFlowerPool, pick } from "@/lib/useFlowerPool";

gsap.registerPlugin(ScrollTrigger);

interface FeaturedFlower {
  name: string;
  latin: string;
  badge: string;
  type: string;
  color: string;
  desc: string;
}

const FEATURED: FeaturedFlower[] = [
  {
    name: "Himalayan Rhododendron",
    latin: "Rhododendron arboreum",
    badge: "National Flower",
    type: "rhododendron",
    color: "var(--rose-light)",
    desc: "The iconic crimson bloom that paints Himalayan hillsides each spring — Nepal's national flower.",
  },
  {
    name: "Garden Rose",
    latin: "Rosa × hybrida",
    badge: "Classic",
    type: "rose",
    color: "#D14E72",
    desc: "The queen of flowers — revered across cultures for fragrance and beauty with thousands of cultivars.",
  },
  {
    name: "Peony",
    latin: "Paeonia lactiflora",
    badge: "Fragrant",
    type: "peony",
    color: "#9B7FD4",
    desc: "Sumptuous bowl-shaped blooms beloved for their rich fragrance and stunning layers of delicate petals.",
  },
];

export default function PlantsSection() {
  const ref = useRef<HTMLElement>(null);
  const pool = useFlowerPool(["rhododendron", "rose", "peony"]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".flower-card", {
        y: 60, opacity: 0, duration: 0.9, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 78%" },
      });
      gsap.from(".plants-head", {
        y: 40, opacity: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 80%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="section-pad-lg" style={{ background: "var(--bg)" }}>
      <div className="container">
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
                lineHeight: 1.1,
              }}
            >
              Our Prized<br />
              <span
                style={{
                  background: "linear-gradient(135deg, var(--rose-light), var(--petal))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Flower Collection
              </span>
            </h2>
          </div>
          <Link href="/plants" className="btn btn-outline-rose flex-shrink-0">
            View All Flowers <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {FEATURED.map((f) => (
            <div key={f.name} className="flower-card card card-glow rounded-2xl overflow-hidden">
              <div className="img-zoom relative" style={{ height: "300px" }}>
                <img
                  src={pick(pool, f.type)}
                  alt={f.name}
                  className="w-full h-full object-cover"
                />
                <div className="overlay-gradient" />
                <span
                  className="badge absolute top-4 left-4"
                  style={{ background: "rgba(0,0,0,0.55)", borderColor: "rgba(255,255,255,0.15)", color: "white" }}
                >
                  {f.badge}
                </span>
              </div>
              <div style={{ padding: "32px 32px 36px" }}>
                <div style={{ width: "4px", height: "36px", borderRadius: "99px", background: f.color, marginBottom: "20px" }} />
                <h3 style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)", fontSize: "1.45rem", fontWeight: 700, color: "var(--cream)", lineHeight: 1.2, marginBottom: "8px" }}>
                  {f.name}
                </h3>
                <p style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "1rem", fontStyle: "italic", color: "var(--dim)", marginBottom: "16px" }}>
                  {f.latin}
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "14.5px", color: "var(--muted)", lineHeight: 1.8 }}>{f.desc}</p>
                <Link href="/plants" className="btn btn-ghost" style={{ marginTop: "24px" }}>
                  Learn more <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
