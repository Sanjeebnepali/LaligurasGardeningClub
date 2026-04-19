"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const FEATURED_TIER = {
  name: "Gardener",
  price: "$30",
  label: "per month",
  features: [
    "Everything in Seedling",
    "Full botanical library",
    "Monthly flora gazette",
    "Early event access",
    "10% nursery discount",
    "Seed exchange access",
  ],
};

const SIDE_TIERS = [
  {
    name: "Seedling",
    price: "Free",
    accent: "var(--muted)",
    border: "var(--border-s)",
    features: ["Monthly newsletter", "Event announcements", "Basic flower library", "Community forum"],
  },
  {
    name: "Curator",
    price: "$100",
    accent: "var(--gold-light)",
    border: "var(--border-g)",
    features: ["Everything in Gardener", "Masterclass archives", "1:1 expert consultations", "Rare seed priority", "Annual garden tour"],
  },
];

export default function MembershipSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".mem-head", {
        y: 40, opacity: 0, duration: 0.9,
        scrollTrigger: { trigger: ref.current, start: "top 82%" },
      });
      gsap.from(".mem-featured", {
        x: -55, opacity: 0, duration: 1.1, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 76%" },
      });
      gsap.from(".mem-side", {
        x: 55, opacity: 0, duration: 0.95, stagger: 0.14, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 76%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="section-pad-lg" style={{ background: "var(--surface)" }}>
      <div className="container">

        {/* Head */}
        <div className="mem-head mb-14">
          <div className="eyebrow mb-4">Membership</div>
          <div
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
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
              Join Our Circle
            </h2>
            <p
              className="t-accent"
              style={{ color: "var(--muted)", maxWidth: "340px", textAlign: "right" }}
            >
              Choose the membership that fits your passion for flowers.
            </p>
          </div>
        </div>

        {/* Asymmetric grid — featured left (55%) + stacked right (45%) */}
        <div
          className="mem-grid grid gap-5 items-stretch"
          style={{ gridTemplateColumns: "55fr 45fr" }}
        >
          {/* Featured "Gardener" tier */}
          <div
            className="mem-featured relative flex flex-col rounded-2xl overflow-hidden"
            style={{
              background: "var(--card)",
              border: "1px solid var(--rose)",
              boxShadow: "0 0 80px rgba(184,43,88,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            {/* Popular badge bar */}
            <div
              className="py-2.5 text-center text-white"
              style={{
                background: "var(--rose)",
                fontSize: "9px",
                letterSpacing: "0.28em",
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
              }}
            >
              MOST POPULAR
            </div>

            <div style={{ padding: "clamp(28px, 4vw, 52px)", flex: 1, display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontFamily: "var(--font-sans)", fontSize: "11px",
                  fontWeight: 700, letterSpacing: "0.2em",
                  textTransform: "uppercase", color: "var(--rose-light)",
                  marginBottom: "20px",
                }}
              >
                {FEATURED_TIER.name}
              </div>

              <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "8px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                    fontSize: "clamp(3rem, 5vw, 5rem)",
                    fontWeight: 900, color: "var(--cream)",
                    lineHeight: 1, letterSpacing: "-0.04em",
                  }}
                >
                  {FEATURED_TIER.price}
                </span>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--muted)" }}>
                  {FEATURED_TIER.label}
                </span>
              </div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--dim)", marginBottom: "36px" }}>
                Billed monthly · Cancel anytime
              </p>

              <div className="hr" style={{ marginBottom: "32px" }} />

              <ul style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1, marginBottom: "40px" }}>
                {FEATURED_TIER.features.map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                    <Check size={15} style={{ color: "var(--rose-light)", flexShrink: 0, marginTop: "2px" }} />
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--muted)", lineHeight: 1.55 }}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link href="/join?tier=gardener" className="btn btn-primary w-full justify-center">
                Get Started <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Stacked side tiers */}
          <div className="flex flex-col gap-5">
            {SIDE_TIERS.map((tier) => (
              <div
                key={tier.name}
                className="mem-side rounded-2xl flex flex-col flex-1"
                style={{
                  background: "var(--card)",
                  border: `1px solid ${tier.border}`,
                  padding: "clamp(22px, 3vw, 38px)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-sans)", fontSize: "11px",
                    fontWeight: 700, letterSpacing: "0.2em",
                    textTransform: "uppercase", color: tier.accent,
                    marginBottom: "16px",
                  }}
                >
                  {tier.name}
                </div>

                <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "24px" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                      fontSize: "clamp(2rem, 3vw, 3rem)",
                      fontWeight: 900, color: "var(--cream)",
                      lineHeight: 1, letterSpacing: "-0.03em",
                    }}
                  >
                    {tier.price}
                  </span>
                  {tier.price !== "Free" && (
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--muted)" }}>/ mo</span>
                  )}
                </div>

                <ul style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1, marginBottom: "28px" }}>
                  {tier.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                      <Check size={13} style={{ color: tier.accent, flexShrink: 0, marginTop: "3px" }} />
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "13.5px", color: "var(--muted)", lineHeight: 1.5 }}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link href={`/join?tier=${tier.name.toLowerCase()}`} className="btn btn-outline w-full justify-center" style={{ fontSize: "13px" }}>
                  Choose {tier.name} <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: single column */}
        <style>{`
          @media (max-width: 767px) {
            .mem-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </section>
  );
}
