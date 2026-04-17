"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BookOpen, ArrowRight, Calendar, Clock, Check, Mail } from "lucide-react";
import { useFlowerPool, pick } from "@/lib/useFlowerPool";

gsap.registerPlugin(ScrollTrigger);

/* ── DATA ── */
const ISSUES = [
  {
    slug: "rhododendron-issue",
    title: "The Rhododendron Issue",
    subtitle: "Spring 2025 · Vol. XII",
    type: "rose",
    date: "April 1, 2025",
    readTime: "22 min",
    featured: true,
    tag: "Latest Issue",
    desc: "A deep-dive into the Himalayan rhododendron — the flower at the heart of our society's identity — tracing its ecology, mythology, and cultivation across continents.",
    articles: [
      "The Seasonal Cycle of Arboreum",
      "Soil Preparation for Acid-Lovers",
      "Heritage Archives: 1960s Bloom Records",
    ],
  },
  {
    slug: "roots-remembrance",
    title: "Roots & Remembrance",
    subtitle: "Winter 2024 · Vol. XI",
    type: "iris",
    date: "January 15, 2025",
    readTime: "18 min",
    featured: false,
    tag: "Archive",
    desc: "A winter reflection on the flowers that shaped our founding story — a tribute to the growers who came before us, and the seeds they left behind.",
    articles: [
      "Cold-Frame Composting",
      "Remembering Our Founder",
      "Winter Seed Saving",
    ],
  },
  {
    slug: "alpine-edition",
    title: "The Alpine Edition",
    subtitle: "Autumn 2024 · Vol. X",
    type: "lily",
    date: "October 5, 2024",
    readTime: "20 min",
    featured: false,
    tag: "Archive",
    desc: "Scaling the heights of high-altitude horticulture — the rare flowers that thrive where most plants dare not, from Himalayan edelweiss to Korean mountain wildflowers.",
    articles: [
      "High-Altitude Gardening Secrets",
      "Meet the Himalayan Edelweiss",
      "Photography in the Alps",
    ],
  },
];

const ARTICLES = [
  { title: "The Art of Planting Roses",        author: "Dr. Elara Vance",  date: "Apr 8, 2025",  readTime: "6 min",  type: "rose",   tag: "Technique"    },
  { title: "Dahlia Season Wisdom",              author: "Marcus Chen",      date: "Apr 5, 2025",  readTime: "4 min",  type: "dahlia", tag: "Seasonal"     },
  { title: "Common Pests of Peonies",           author: "Aisha Rajan",      date: "Mar 29, 2025", readTime: "7 min",  type: "peony",  tag: "Pest Control" },
  { title: "Bloom Cycles for Beginners",        author: "Dr. Elara Vance",  date: "Mar 20, 2025", readTime: "9 min",  type: "tulip",  tag: "Education"    },
  { title: "Orchid Care in Urban Apartments",   author: "Jin-ho Park",      date: "Mar 14, 2025", readTime: "5 min",  type: "orchid", tag: "Urban Growing"},
  { title: "Heritage Seeds: Why They Matter",   author: "Priya Subramaniam",date: "Mar 5, 2025",  readTime: "8 min",  type: "lily",   tag: "Heritage"     },
  { title: "Companion Planting for Pollinators",author: "Marcus Chen",      date: "Feb 26, 2025", readTime: "6 min",  type: "peony",  tag: "Ecology"      },
  { title: "Forcing Bulbs Indoors",             author: "Aisha Rajan",      date: "Feb 18, 2025", readTime: "5 min",  type: "tulip",  tag: "Technique"    },
];

const PERKS = [
  "Quarterly botanical editorial — curated by experts",
  "Early access to club events & workshops",
  "Exclusive member seed-swap invitations",
  "Monthly growing tips & seasonal guides",
];

/* ── PAGE ── */
export default function NewsletterPage() {
  const pageRef     = useRef<HTMLDivElement>(null);
  const pool        = useFlowerPool(["rose", "iris", "lily", "dahlia", "peony", "tulip", "orchid"]);
  const [activeIssue, setActiveIssue] = useState(ISSUES[0]);
  const [email, setEmail]             = useState("");
  const [subscribed, setSubscribed]   = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".nl-hero > *",
        { y: 52, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.14, ease: "power3.out", delay: 0.2 }
      );
      ScrollTrigger.batch(".issue-card", {
        onEnter: (els) =>
          gsap.fromTo(els,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out" }
          ),
        start: "top 88%", once: true,
      });
      ScrollTrigger.batch(".article-card", {
        onEnter: (els) =>
          gsap.fromTo(els,
            { y: 36, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.65, stagger: 0.08, ease: "power3.out" }
          ),
        start: "top 88%", once: true,
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

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

      {/* ════════════════ HERO ════════════════ */}
      <section
        className="relative overflow-hidden flex items-end"
        style={{ minHeight: "62vh", paddingTop: "68px", paddingBottom: "100px", background: "#0C0618" }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${pick(pool, "rose")})`,
            backgroundSize: "cover",
            backgroundPosition: "center 35%",
            opacity: 0.52,
          }}
        />
        <div className="absolute inset-0" style={{ background: "rgba(6,3,10,0.38)" }} />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 75% 55% at 50% 70%, rgba(184,43,88,0.16) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-44 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, #160C28)" }}
        />

        <div className="container relative" style={{ zIndex: 2 }}>
          <div className="nl-hero">
            <span className="badge mb-6" style={{ fontSize: "10px", letterSpacing: "0.18em" }}>
              The Botanical Editorial
            </span>
            <h1
              style={{
                fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                fontSize: "clamp(3.6rem, 9vw, 8rem)",
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: "-0.03em",
                color: "var(--cream)",
                maxWidth: "780px",
                marginBottom: "2rem",
              }}
            >
              The Sanctuary
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, var(--rose-light), var(--petal), var(--gold-light))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Editorial
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
              Our quarterly publication — where botanical science meets heritage
              storytelling and the wisdom of our global community.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#issues" className="btn btn-primary btn-lg">
                Browse Issues <ArrowRight size={16} />
              </a>
              <a href="#subscribe" className="btn btn-outline btn-lg">
                Subscribe Free
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ ISSUES ════════════════ */}
      <section
        id="issues"
        className="section-pad-lg"
        style={{ background: "var(--surface)", borderTop: "1px solid rgba(253,248,240,0.06)" }}
      >
        <div className="container">
          {/* Header */}
          <div className="mb-14">
            <div className="eyebrow mb-5" style={{ fontSize: "10px", letterSpacing: "0.2em" }}>
              Publications
            </div>
            <h2
              style={{
                fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                fontSize: "clamp(2.4rem, 5vw, 4rem)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: "var(--cream)",
              }}
            >
              Our Issues
            </h2>
          </div>

          {/* Issue cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {ISSUES.map((issue) => {
              const isActive = activeIssue.slug === issue.slug;
              return (
                <button
                  key={issue.slug}
                  className="issue-card text-left rounded-2xl overflow-hidden"
                  onClick={() => setActiveIssue(issue)}
                  style={{
                    background: isActive ? "var(--card)" : "rgba(30,17,52,0.55)",
                    border: `1.5px solid ${isActive ? "var(--rose)" : "var(--border-s)"}`,
                    transition: "all .25s ease",
                    transform: isActive ? "translateY(-4px)" : "translateY(0)",
                    boxShadow: isActive ? "0 16px 48px rgba(184,43,88,0.18)" : "none",
                  }}
                >
                  {/* Thumbnail */}
                  <div style={{ height: "200px", position: "relative", overflow: "hidden" }}>
                    <img
                      src={pick(pool, issue.type)}
                      alt={issue.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", opacity: isActive ? 0.75 : 0.55, transition: "opacity .25s" }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(6,3,10,0.7))" }}
                    />
                    <span
                      className="absolute top-3 left-3"
                      style={{
                        padding: "5px 12px",
                        borderRadius: "999px",
                        background: isActive ? "var(--rose)" : "rgba(13,5,22,0.85)",
                        border: "1px solid var(--border)",
                        fontFamily: "var(--font-sans)",
                        fontSize: "9px",
                        fontWeight: 700,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: isActive ? "#fff" : "var(--petal)",
                      }}
                    >
                      {issue.tag}
                    </span>
                  </div>

                  {/* Body */}
                  <div style={{ padding: "22px 24px 26px" }}>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "10px",
                        fontWeight: 600,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: isActive ? "var(--gold-light)" : "var(--dim)",
                        marginBottom: "8px",
                      }}
                    >
                      {issue.subtitle}
                    </p>
                    <h3
                      style={{
                        fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                        fontSize: "1.35rem",
                        fontWeight: 700,
                        color: "var(--cream)",
                        lineHeight: 1.2,
                        marginBottom: "10px",
                      }}
                    >
                      {issue.title}
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontFamily: "var(--font-sans)",
                        fontSize: "12px",
                        color: "var(--dim)",
                      }}
                    >
                      <Calendar size={12} /> {issue.date}
                      <span style={{ margin: "0 4px" }}>·</span>
                      <Clock size={12} /> {issue.readTime}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active issue detail */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border-s)",
            }}
          >
            <div className="grid lg:grid-cols-5" style={{ minHeight: "380px" }}>
              {/* Image */}
              <div className="lg:col-span-2 relative overflow-hidden" style={{ minHeight: "280px" }}>
                <img
                  src={pick(pool, activeIssue.type)}
                  alt={activeIssue.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7, transition: "opacity .4s" }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to right, transparent, rgba(30,17,52,0.4))" }}
                />
              </div>

              {/* Content */}
              <div className="lg:col-span-3" style={{ padding: "44px 48px" }}>
                <span className="badge mb-5" style={{ fontSize: "9px", letterSpacing: "0.16em" }}>
                  {activeIssue.subtitle}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                    fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
                    fontWeight: 800,
                    color: "var(--cream)",
                    lineHeight: 1.1,
                    marginBottom: "14px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {activeIssue.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                    fontSize: "1.2rem",
                    fontStyle: "italic",
                    color: "var(--muted)",
                    lineHeight: 1.8,
                    marginBottom: "28px",
                    maxWidth: "460px",
                  }}
                >
                  {activeIssue.desc}
                </p>

                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--gold-light)",
                    marginBottom: "14px",
                  }}
                >
                  In This Issue
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {activeIssue.articles.map((a) => (
                    <li
                      key={a}
                      style={{ display: "flex", alignItems: "center", gap: "12px" }}
                    >
                      <span
                        style={{
                          width: "24px", height: "24px", borderRadius: "6px", flexShrink: 0,
                          background: "var(--rose-glow)", border: "1px solid var(--border)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        <BookOpen size={11} style={{ color: "var(--rose-light)" }} />
                      </span>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--cream)", lineHeight: 1.5 }}>
                        {a}
                      </span>
                    </li>
                  ))}
                </ul>

                <button className="btn btn-primary btn-lg" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                  Read Full Issue <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ RECENT ARTICLES ════════════════ */}
      <section
        className="section-pad-lg"
        style={{ background: "#0C0618", borderTop: "1px solid rgba(253,248,240,0.06)" }}
      >
        <div className="container">
          <div className="mb-14">
            <div className="eyebrow mb-5" style={{ fontSize: "10px", letterSpacing: "0.2em" }}>
              Further Reading
            </div>
            <h2
              style={{
                fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                fontSize: "clamp(2.4rem, 5vw, 4rem)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: "var(--cream)",
              }}
            >
              Recent Articles
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ARTICLES.map((article) => (
              <div
                key={article.title}
                className="article-card rounded-2xl overflow-hidden"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border-s)",
                  transition: "border-color .3s, transform .3s, box-shadow .3s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-5px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 48px rgba(0,0,0,0.4)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border-s)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                {/* Thumbnail */}
                <div style={{ height: "170px", overflow: "hidden" }}>
                  <img
                    src={pick(pool, article.type)}
                    alt={article.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.75, transition: "transform .5s, opacity .3s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                  />
                </div>

                {/* Body */}
                <div style={{ padding: "22px 22px 24px" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 12px",
                      borderRadius: "999px",
                      background: "var(--rose-glow)",
                      border: "1px solid var(--border)",
                      fontFamily: "var(--font-sans)",
                      fontSize: "9px",
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--petal)",
                      marginBottom: "12px",
                    }}
                  >
                    {article.tag}
                  </span>
                  <h3
                    style={{
                      fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: "var(--cream)",
                      lineHeight: 1.35,
                      marginBottom: "12px",
                    }}
                  >
                    {article.title}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                      alignItems: "center",
                      fontFamily: "var(--font-sans)",
                      fontSize: "11px",
                      color: "var(--dim)",
                    }}
                  >
                    <span>{article.author}</span>
                    <span>·</span>
                    <Clock size={11} />
                    <span>{article.readTime} read</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ SUBSCRIBE ════════════════ */}
      <section
        id="subscribe"
        className="section-pad-lg"
        style={{ background: "var(--surface)", borderTop: "1px solid rgba(253,248,240,0.06)" }}
      >
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Left copy */}
            <div>
              <div className="eyebrow eyebrow-gold mb-6" style={{ fontSize: "10px", letterSpacing: "0.2em" }}>
                Stay Connected
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
                Never Miss
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, var(--rose-light), var(--petal), var(--gold-light))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  an Issue
                </span>
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                  fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                  fontStyle: "italic",
                  color: "var(--muted)",
                  lineHeight: 1.85,
                  marginBottom: "2.5rem",
                  maxWidth: "420px",
                }}
              >
                Quarterly publications delivered straight to your inbox — free
                for all members and open to any botanical enthusiast.
              </p>

              {/* Perks list */}
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                {PERKS.map((perk) => (
                  <li key={perk} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    <span
                      style={{
                        width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
                        background: "var(--rose-glow)", border: "1px solid var(--border)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        marginTop: "1px",
                      }}
                    >
                      <Check size={11} style={{ color: "var(--rose-light)" }} />
                    </span>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--muted)", lineHeight: 1.65 }}>
                      {perk}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right form card */}
            <div
              className="rounded-2xl"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border-s)",
                padding: "48px 44px",
              }}
            >
              {subscribed ? (
                <div className="text-center" style={{ padding: "24px 0" }}>
                  <div
                    style={{
                      width: "68px", height: "68px", borderRadius: "50%",
                      background: "var(--rose)", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      margin: "0 auto 20px",
                    }}
                  >
                    <Check size={30} color="#fff" />
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                      fontSize: "2rem",
                      fontWeight: 700,
                      color: "var(--cream)",
                      marginBottom: "12px",
                    }}
                  >
                    You&apos;re Subscribed!
                  </h3>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--muted)", lineHeight: 1.75 }}>
                    Welcome to the Laliguras community. Your first issue arrives next quarter.
                  </p>
                  <button
                    onClick={() => { setSubscribed(false); setEmail(""); }}
                    className="btn btn-outline btn-sm"
                    style={{ marginTop: "24px" }}
                  >
                    Use a different email
                  </button>
                </div>
              ) : (
                <>
                  <div
                    style={{
                      width: "52px", height: "52px", borderRadius: "14px",
                      background: "var(--rose-glow)", border: "1px solid var(--border)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginBottom: "24px",
                    }}
                  >
                    <Mail size={22} style={{ color: "var(--rose-light)" }} />
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
                    Subscribe to the Editorial
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "15px",
                      color: "var(--muted)",
                      lineHeight: 1.7,
                      marginBottom: "32px",
                    }}
                  >
                    Join 5,000+ readers. No spam, no noise — just flowers.
                  </p>

                  <form
                    onSubmit={(e) => { e.preventDefault(); if (email) setSubscribed(true); }}
                    style={{ display: "flex", flexDirection: "column", gap: "16px" }}
                  >
                    <div>
                      <label
                        className="form-label"
                        style={{ fontSize: "10px", letterSpacing: "0.15em", marginBottom: "8px", display: "block" }}
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="your@email.com"
                        style={{ fontSize: "15px", padding: "14px 16px" }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      style={{ width: "100%", justifyContent: "center" }}
                    >
                      Subscribe — It&apos;s Free <ArrowRight size={16} />
                    </button>
                  </form>

                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "12px",
                      color: "var(--dim)",
                      textAlign: "center",
                      marginTop: "16px",
                      lineHeight: 1.6,
                    }}
                  >
                    Unsubscribe any time. See our{" "}
                    <Link href="/privacy" style={{ color: "var(--petal)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
