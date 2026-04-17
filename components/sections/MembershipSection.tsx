"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const TIERS = [
  {
    name: "Seedling",
    price: "Free",
    label: "Start growing",
    accent: "var(--muted)",
    bg: "var(--card)",
    border: "var(--border-s)",
    popular: false,
    features: ["Monthly newsletter", "Event announcements", "Basic flower library", "Community forum"],
  },
  {
    name: "Gardener",
    price: "$30",
    label: "per month",
    accent: "var(--rose-light)",
    bg: "var(--card)",
    border: "var(--rose)",
    popular: true,
    features: [
      "Everything in Seedling",
      "Full botanical library",
      "Monthly flora gazette",
      "Early event access",
      "10% nursery discount",
      "Seed exchange access",
    ],
  },
  {
    name: "Curator",
    price: "$100",
    label: "per month",
    accent: "var(--gold-light)",
    bg: "var(--card)",
    border: "var(--border-g)",
    popular: false,
    features: [
      "Everything in Gardener",
      "Masterclass archives",
      "1:1 expert consultations",
      "Rare seed priority",
      "Annual garden tour",
      "Club voting rights",
    ],
  },
];

export default function MembershipSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".tier-card", {
        y: 60, opacity: 0, duration: 0.9, stagger: 0.14, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 76%" },
      });
      gsap.from(".mem-head", {
        y: 40, opacity: 0, duration: 0.9,
        scrollTrigger: { trigger: ref.current, start: "top 82%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="section-pad-lg" style={{ background: "var(--surface)" }}>
      <div className="container">
        <div className="mem-head text-center mb-14">
          <div className="eyebrow mb-4" style={{ justifyContent: "center" }}>Membership</div>
          <h2
            style={{
              fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.015em",
              color: "var(--cream)",
              lineHeight: 1.1,
              marginBottom: "1rem",
            }}
          >
            Join Our Circle
          </h2>
          <p
            className="t-accent"
            style={{ color: "var(--muted)", maxWidth: "480px", margin: "0 auto" }}
          >
            Choose the membership that fits your passion for flowers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-7 items-start">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className="tier-card rounded-2xl overflow-hidden relative flex flex-col"
              style={{
                background: tier.bg,
                border: `1px solid ${tier.border}`,
                transform: tier.popular ? "scale(1.03)" : "scale(1)",
                boxShadow: tier.popular ? `0 0 80px rgba(184,43,88,0.18)` : "none",
                minHeight: "520px",
              }}
            >
              {tier.popular && (
                <div
                  className="py-2 text-center text-white"
                  style={{ background: "var(--rose)", fontSize: "9px", letterSpacing: "0.28em", fontFamily: "var(--font-sans)", fontWeight: 700 }}
                >
                  MOST POPULAR
                </div>
              )}
              <div style={{ padding: "36px 36px 40px", display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: tier.accent, marginBottom: "18px" }}>
                  {tier.name}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "8px" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                      fontSize: "3.6rem",
                      fontWeight: 900,
                      color: "var(--cream)",
                      lineHeight: 1,
                      letterSpacing: "-0.035em",
                    }}
                  >
                    {tier.price}
                  </span>
                  {tier.price !== "Free" && (
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--muted)" }}>{tier.label}</span>
                  )}
                </div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--dim)", marginBottom: "30px", lineHeight: 1.5 }}>
                  {tier.label === "per month" ? "Billed monthly · Cancel anytime" : "Perfect for getting started"}
                </p>

                <div className="hr" style={{ marginBottom: "28px" }} />

                <ul style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "36px", flex: 1 }}>
                  {tier.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                      <Check size={15} style={{ color: tier.accent, flexShrink: 0, marginTop: "2px" }} />
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--muted)", lineHeight: 1.55 }}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/join?tier=${tier.name.toLowerCase()}`}
                  className={tier.popular ? "btn btn-primary w-full justify-center" : "btn btn-outline w-full justify-center"}
                >
                  Get Started <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
