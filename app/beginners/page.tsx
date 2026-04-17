"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Sprout, Wrench, Globe, BookOpen,
  ChevronDown, ChevronUp, ArrowRight, MessageCircle, X,
} from "lucide-react";
import { useFlowerPool, pick } from "@/lib/useFlowerPool";

gsap.registerPlugin(ScrollTrigger);

const LEARNING_PATH = [
  {
    Icon: Sprout,
    title: "Soil 101",
    level: "30 min lesson",
    step: "01",
    desc: "Understanding the foundation of every thriving flower garden. pH, drainage, nutrients, and how to read your soil's character.",
  },
  {
    Icon: Wrench,
    title: "First Tools",
    level: "30 min lesson",
    step: "02",
    desc: "You don't need a shed full of steel. We've narrowed it down to five essentials every beginning flower grower needs.",
  },
  {
    Icon: Globe,
    title: "Your Zone",
    level: "20 min lesson",
    step: "03",
    desc: "Decoding hardiness zones and microclimates. Find exactly which flowers thrive in your specific garden environment.",
  },
  {
    Icon: BookOpen,
    title: "Reading Flowers",
    level: "40 min lesson",
    step: "04",
    desc: "Flowers communicate. Learn to read yellowing petals, drooping stems, and the subtle signs of a plant in need.",
  },
];

const FAQ = [
  {
    q: "How much sunlight does a 'full sun' flowering plant really need?",
    a: "A 'full sun' plant needs at least 6 hours of direct, unobstructed sunlight per day. South-facing beds typically offer the most consistent full sun in the Northern Hemisphere. Many popular flowering plants — roses, dahlias, zinnias — thrive with 8+ hours.",
  },
  {
    q: "I keep killing my potted flowers. What's the most common mistake?",
    a: "Overwatering is the number one killer of potted flowers. Each species has different needs — succulents want to dry out completely between waterings, while hydrangeas prefer consistently moist (not wet) soil. Always check the top 2 inches of soil before watering.",
  },
  {
    q: "When is the best time to plant flowers?",
    a: "For most temperate climates, late winter to early spring (February–March) is ideal for starting seeds indoors under grow lights. Tender annuals like petunias and dahlias go out after the last frost date. Hardy perennials like peonies and iris can go in the ground in autumn.",
  },
  {
    q: "What flowers are easiest for complete beginners?",
    a: "Zinnias, sunflowers, marigolds, and nasturtiums are almost foolproof. For perennials, rudbeckia (black-eyed Susan), coneflowers (echinacea), and daylilies are extremely forgiving. Start with these to build confidence before attempting roses or dahlias.",
  },
  {
    q: "How deep should I plant bulbs?",
    a: "The general rule is 2–3 times the height of the bulb. A 2-inch tulip bulb goes 4–6 inches deep. Bulb depth affects bloom timing, stability, and winter survival. Planting too shallow means frost damage; too deep means weak stems.",
  },
  {
    q: "What's companion planting and does it help flowers?",
    a: "Companion planting pairs plants that benefit each other. Classic combinations: marigolds deter aphids from roses, basil repels thrips from dahlias, lavender attracts pollinators that benefit the whole garden. There's solid evidence for some pairings, though results vary by region.",
  },
];

const GUIDES = [
  { title: "Starting Your First Flower Container Garden",    type: "lily",  readTime: "5 min", category: "Container Gardening" },
  { title: "Understanding Bloom Cycles for Beginners",       type: "peony", readTime: "7 min", category: "Flower Care"         },
  { title: "The Complete Watering Guide for Flowering Plants", type: "tulip", readTime: "6 min", category: "Watering"          },
];

export default function BeginnersPage() {
  const pageRef   = useRef<HTMLDivElement>(null);
  const pool      = useFlowerPool(["rose", "dahlia", "lily", "peony", "tulip"]);
  const [openFaq, setOpenFaq]     = useState<number | null>(null);
  const [showExpert, setShowExpert] = useState(false);
  const [expertForm, setExpertForm] = useState({ name: "", email: "", question: "" });
  const [expertSent, setExpertSent] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".beg-hero-inner > *", {
        y: 48, opacity: 0, duration: 0.9, stagger: 0.14,
        ease: "power3.out", delay: 0.2,
      });
      ScrollTrigger.batch(".lesson-card", {
        onEnter: (els) =>
          gsap.from(els, { y: 48, opacity: 0, duration: 0.75, stagger: 0.12, ease: "power3.out" }),
        start: "top 88%",
      });
      ScrollTrigger.batch(".guide-card", {
        onEnter: (els) =>
          gsap.from(els, { y: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" }),
        start: "top 88%",
      });
      ScrollTrigger.batch(".faq-item", {
        onEnter: (els) =>
          gsap.from(els, { y: 28, opacity: 0, duration: 0.55, stagger: 0.08, ease: "power2.out" }),
        start: "top 90%",
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const handleExpertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setExpertSent(true);
    setTimeout(() => {
      setShowExpert(false);
      setExpertSent(false);
      setExpertForm({ name: "", email: "", question: "" });
    }, 2800);
  };

  /* ── scoped lighter-dark tokens ── */
  const pageVars = {
    "--surface":   "#160C28",
    "--card":      "#1E1134",
    "--card-hover":"#271540",
    "--muted":     "rgba(253,248,240,0.72)",
    "--dim":       "rgba(253,248,240,0.40)",
    "--border-s":  "rgba(253,248,240,0.13)",
    "--rose-glow": "rgba(184,43,88,0.22)",
  } as React.CSSProperties;

  return (
    <div ref={pageRef} style={pageVars}>

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden flex items-end"
        style={{
          minHeight: "62vh",
          paddingTop: "68px",        /* exact navbar height */
          paddingBottom: "100px",
          background: "#0C0618",
        }}
      >
        {/* Flower bg */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${pick(pool, "rose")})`,
            backgroundSize: "cover",
            backgroundPosition: "center 35%",
            opacity: 0.28,
          }}
        />
        {/* Veil */}
        <div className="absolute inset-0" style={{ background: "rgba(6,3,10,0.50)" }} />
        {/* Gold glow accent */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 75% 55% at 50% 70%, rgba(196,162,60,0.12) 0%, transparent 70%)",
          }}
        />
        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-44 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, #160C28)" }}
        />

        <div className="container relative" style={{ zIndex: 2 }}>
          <div className="beg-hero-inner">
            <span className="badge mb-6" style={{ fontSize: "10px", letterSpacing: "0.18em" }}>
              Introductory Course
            </span>

            <h1
              style={{
                fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                fontSize: "clamp(3.6rem, 9vw, 8rem)",
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: "-0.03em",
                color: "var(--cream)",
                maxWidth: "760px",
                marginBottom: "2rem",
              }}
            >
              Your Journey
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, var(--gold-light), var(--petal), var(--rose-light))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Starts Here
              </span>
            </h1>

            <p
              style={{
                fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                fontSize: "clamp(1.25rem, 2.2vw, 1.65rem)",
                fontStyle: "italic",
                color: "var(--muted)",
                maxWidth: "520px",
                lineHeight: 1.85,
                marginBottom: "2.5rem",
              }}
            >
              Gardening is a slow art. We&apos;re here to help you cultivate your
              first blooms with confidence and curiosity.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="#learning-path" className="btn btn-primary btn-lg">
                Start the Path <ArrowRight size={16} />
              </a>
              <a href="#faq" className="btn btn-outline btn-lg">
                Explore FAQ
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          LEARNING PATH
      ════════════════════════════════════════ */}
      <section
        id="learning-path"
        className="section-pad-lg"
        style={{ background: "var(--surface)", borderTop: "1px solid rgba(253,248,240,0.06)" }}
      >
        <div className="container">
          {/* Section header */}
          <div className="text-center mb-16">
            <div
              className="eyebrow eyebrow-gold mb-5"
              style={{ justifyContent: "center", fontSize: "10px", letterSpacing: "0.2em" }}
            >
              Essentials Learning Path
            </div>
            <h2
              style={{
                fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                fontSize: "clamp(2.4rem, 5vw, 4rem)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: "var(--cream)",
                marginBottom: "1.25rem",
              }}
            >
              Master the Fundamentals
            </h2>
            <div className="hr-gold" style={{ margin: "0 auto 1.5rem" }} />
            <p
              style={{
                fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                fontStyle: "italic",
                color: "var(--muted)",
                maxWidth: "500px",
                margin: "0 auto",
                lineHeight: 1.8,
              }}
            >
              Our curriculum distills flower-growing wisdom to its four essential pillars.
            </p>
          </div>

          {/* Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LEARNING_PATH.map(({ Icon, title, level, step, desc }) => (
              <div
                key={title}
                className="lesson-card card card-glow"
                style={{
                  borderRadius: "16px",
                  padding: "36px 28px",
                  textAlign: "center",
                }}
              >
                {/* Icon ring */}
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "var(--rose-glow)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                  }}
                >
                  <Icon size={24} style={{ color: "var(--rose-light)" }} />
                </div>

                <div
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "var(--gold-light)",
                    marginBottom: "4px",
                  }}
                >
                  Step {step}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "12px",
                    color: "var(--dim)",
                    marginBottom: "14px",
                    letterSpacing: "0.04em",
                  }}
                >
                  {level}
                </div>

                <h3
                  style={{
                    fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                    fontSize: "1.45rem",
                    fontWeight: 700,
                    color: "var(--cream)",
                    marginBottom: "12px",
                    lineHeight: 1.2,
                  }}
                >
                  {title}
                </h3>

                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "14px",
                    color: "var(--muted)",
                    lineHeight: 1.85,
                    marginBottom: "24px",
                  }}
                >
                  {desc}
                </p>

                <Link
                  href="/plants"
                  className="btn-ghost"
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  Begin Lesson <ArrowRight size={12} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          EXPERT CTA
      ════════════════════════════════════════ */}
      <section
        className="section-pad"
        style={{ background: "var(--rose)", position: "relative", overflow: "hidden" }}
      >
        {/* subtle texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${pick(pool, "dahlia")})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.10,
          }}
        />
        <div className="container relative" style={{ zIndex: 2 }}>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div
                className="eyebrow mb-6"
                style={{ color: "rgba(255,255,255,0.60)", fontSize: "10px", letterSpacing: "0.2em" }}
              >
                1-on-1 Consultation
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                  fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)",
                  fontWeight: 800,
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  color: "#fff",
                  marginBottom: "1.25rem",
                }}
              >
                Still lost in the blooms?
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                  fontSize: "clamp(1.15rem, 2vw, 1.45rem)",
                  fontStyle: "italic",
                  color: "rgba(255,255,255,0.78)",
                  lineHeight: 1.8,
                  marginBottom: "2.25rem",
                  maxWidth: "420px",
                }}
              >
                Every master grower was once a beginner. Our guild experts offer
                personalized consultations and rapid question answering.
              </p>
              <button
                onClick={() => setShowExpert(true)}
                className="btn btn-lg"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1.5px solid rgba(255,255,255,0.45)",
                  color: "#fff",
                }}
              >
                <MessageCircle size={17} /> Ask an Expert
              </button>
            </div>

            <div
              className="img-zoom"
              style={{ height: "380px", borderRadius: "16px", overflow: "hidden" }}
            >
              <img
                src={pick(pool, "dahlia")}
                alt="Expert dahlia blooms"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          BEGINNER GUIDES
      ════════════════════════════════════════ */}
      <section
        className="section-pad"
        style={{ background: "#0C0618", borderTop: "1px solid rgba(253,248,240,0.06)" }}
      >
        <div className="container">
          <div className="mb-14">
            <div
              className="eyebrow mb-5"
              style={{ fontSize: "10px", letterSpacing: "0.2em" }}
            >
              Starter Guides
            </div>
            <h2
              style={{
                fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                fontSize: "clamp(2.2rem, 4vw, 3.4rem)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: "var(--cream)",
              }}
            >
              Begin With These
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {GUIDES.map((g) => (
              <div
                key={g.title}
                className="guide-card card card-glow overflow-hidden"
                style={{ borderRadius: "16px" }}
              >
                <div className="img-zoom" style={{ height: "210px" }}>
                  <img
                    src={pick(pool, g.type)}
                    alt={g.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div style={{ padding: "28px 28px 30px" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="badge">{g.category}</span>
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "11px",
                        color: "var(--dim)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {g.readTime} read
                    </span>
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                      fontSize: "1.35rem",
                      fontWeight: 700,
                      color: "var(--cream)",
                      lineHeight: 1.3,
                      marginBottom: "18px",
                    }}
                  >
                    {g.title}
                  </h3>
                  <button
                    className="btn-ghost"
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    Read Guide <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FAQ
      ════════════════════════════════════════ */}
      <section
        id="faq"
        className="section-pad-lg"
        style={{ background: "var(--surface)", borderTop: "1px solid rgba(253,248,240,0.06)" }}
      >
        <div className="container-sm">
          {/* Header */}
          <div className="text-center mb-16">
            <div
              className="eyebrow mb-5"
              style={{ justifyContent: "center", fontSize: "10px", letterSpacing: "0.2em" }}
            >
              Common Questions
            </div>
            <h2
              style={{
                fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                fontSize: "clamp(2.4rem, 5vw, 4rem)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: "var(--cream)",
                marginBottom: "1.25rem",
              }}
            >
              Frequently Asked
            </h2>
            <div className="hr-rose" style={{ margin: "0 auto" }} />
          </div>

          {/* Accordion */}
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div
                key={i}
                className="faq-item rounded-2xl overflow-hidden"
                style={{
                  border: "1px solid var(--border-s)",
                  background: openFaq === i ? "var(--card)" : "rgba(30,17,52,0.55)",
                  transition: "background .25s, border-color .25s",
                  borderColor: openFaq === i ? "var(--border)" : undefined,
                }}
              >
                <button
                  className="w-full flex items-center justify-between text-left"
                  style={{ padding: "24px 28px", gap: "20px" }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                      fontSize: "clamp(1rem, 1.6vw, 1.2rem)",
                      fontWeight: 600,
                      color: openFaq === i ? "var(--cream)" : "rgba(253,248,240,0.88)",
                      lineHeight: 1.45,
                      flex: 1,
                    }}
                  >
                    {item.q}
                  </span>
                  <span
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: openFaq === i ? "var(--rose)" : "var(--rose-glow)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "background .25s",
                    }}
                  >
                    {openFaq === i
                      ? <ChevronUp size={15} color="#fff" />
                      : <ChevronDown size={15} style={{ color: "var(--rose-light)" }} />
                    }
                  </span>
                </button>

                <div className={`acc-body ${openFaq === i ? "open" : ""}`}>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "15px",
                      color: "var(--muted)",
                      lineHeight: 1.9,
                      padding: "0 28px 28px",
                    }}
                  >
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div
            className="mt-14 rounded-2xl text-center"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border-s)",
              padding: "44px 40px",
            }}
          >
            <div style={{ fontSize: "2.4rem", marginBottom: "12px", lineHeight: 1 }}>🌸</div>
            <h3
              style={{
                fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                fontSize: "1.75rem",
                fontWeight: 700,
                color: "var(--cream)",
                marginBottom: "10px",
              }}
            >
              Still have questions?
            </h3>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "15px",
                color: "var(--muted)",
                lineHeight: 1.75,
                maxWidth: "380px",
                margin: "0 auto 28px",
              }}
            >
              Our master growers respond to every question personally within 48 hours.
            </p>
            <button onClick={() => setShowExpert(true)} className="btn btn-outline-rose btn-lg">
              <MessageCircle size={16} /> Ask an Expert
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          EXPERT MODAL
      ════════════════════════════════════════ */}
      {showExpert && (
        <div className="lightbox-overlay" onClick={() => setShowExpert(false)}>
          <div
            style={{
              maxWidth: "540px",
              width: "100%",
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "20px",
              padding: "48px 44px",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setShowExpert(false)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "rgba(253,248,240,0.06)",
                border: "1px solid var(--border-s)",
                color: "var(--muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={16} />
            </button>

            {expertSent ? (
              <div className="text-center" style={{ padding: "20px 0" }}>
                <div style={{ fontSize: "3.5rem", marginBottom: "16px", lineHeight: 1 }}>🌸</div>
                <h3
                  style={{
                    fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: "var(--cream)",
                    marginBottom: "12px",
                  }}
                >
                  Question Received!
                </h3>
                <p style={{ fontSize: "15px", color: "var(--muted)", lineHeight: 1.75 }}>
                  Our experts typically respond within 48 hours.
                </p>
              </div>
            ) : (
              <>
                <div
                  className="eyebrow mb-5"
                  style={{ fontSize: "10px", letterSpacing: "0.2em" }}
                >
                  Expert Consultation
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                    fontSize: "1.9rem",
                    fontWeight: 700,
                    color: "var(--cream)",
                    marginBottom: "10px",
                    lineHeight: 1.15,
                  }}
                >
                  Ask Our Experts
                </h3>
                <p
                  style={{
                    fontSize: "15px",
                    color: "var(--muted)",
                    lineHeight: 1.75,
                    marginBottom: "28px",
                  }}
                >
                  Our master growers respond to every question personally within 48 hours.
                </p>
                <form onSubmit={handleExpertSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label
                        className="form-label"
                        style={{ fontSize: "10px", letterSpacing: "0.15em", marginBottom: "8px", display: "block" }}
                      >
                        Your Name
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Full name"
                        style={{ fontSize: "15px", padding: "13px 15px" }}
                        value={expertForm.name}
                        onChange={(e) => setExpertForm({ ...expertForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="form-label"
                        style={{ fontSize: "10px", letterSpacing: "0.15em", marginBottom: "8px", display: "block" }}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="your@email.com"
                        style={{ fontSize: "15px", padding: "13px 15px" }}
                        value={expertForm.email}
                        onChange={(e) => setExpertForm({ ...expertForm, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      className="form-label"
                      style={{ fontSize: "10px", letterSpacing: "0.15em", marginBottom: "8px", display: "block" }}
                    >
                      Your Question
                    </label>
                    <textarea
                      className="form-input"
                      placeholder="What would you like to know about growing flowers?"
                      style={{ fontSize: "15px", padding: "13px 15px", minHeight: "140px" }}
                      value={expertForm.question}
                      onChange={(e) => setExpertForm({ ...expertForm, question: e.target.value })}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    Send Question <ArrowRight size={15} />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
