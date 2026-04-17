"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Heart, BookOpen, PenLine, X, Upload, Clock, Calendar } from "lucide-react";
import { useFlowerPool, pick } from "@/lib/useFlowerPool";

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = ["All", "Growing Journey", "Rare Finds", "Seasonal", "Tips & Tricks", "Floral Art"];

const CAT_COLORS: Record<string, string> = {
  "Growing Journey": "#D14E72",
  "Rare Finds":      "#9B59B6",
  "Seasonal":        "#E67E22",
  "Tips & Tricks":   "#27AE60",
  "Floral Art":      "#C4A23C",
};

const STORIES = [
  {
    id: 1,
    title: "My First Peony Season",
    subtitle: "A love letter to Sarah Bernhardt",
    author: "Priya Khatri",
    initials: "PK",
    role: "Gardener Member",
    category: "Growing Journey",
    date: "April 2, 2026",
    readTime: "8 min",
    type: "peony",
    excerpt: "After three failed seasons and countless pots of tea poured over yellowing leaves, I finally understood what a peony asks of you. Patience. Restraint. The willingness to wait twelve full months for a single bloom that lasts only two weeks.",
    likes: 124,
    featured: true,
  },
  {
    id: 2,
    title: "Chasing the Blue Himalayan Poppy",
    subtitle: "A three-year obsession",
    author: "Marcus Lehmann",
    initials: "ML",
    role: "Curator Member",
    category: "Rare Finds",
    date: "March 15, 2026",
    readTime: "11 min",
    type: "iris",
    excerpt: "Meconopsis betonicifolia. The name alone sounds like a spell. When I saw my first photograph of it — that impossible, electric blue — I made a decision that would consume three summers and one particularly cold Scottish winter.",
    likes: 87,
    featured: true,
  },
  {
    id: 3,
    title: "Orchids in a Studio Apartment",
    subtitle: "Proving small space is no excuse",
    author: "Yuki Tanaka",
    initials: "YT",
    role: "Seedling Member",
    category: "Tips & Tricks",
    date: "February 28, 2026",
    readTime: "6 min",
    type: "orchid",
    excerpt: "My apartment is 340 square feet. I have 23 orchids. My neighbors think I&apos;m eccentric. My orchids think they live in paradise.",
    likes: 203,
    featured: false,
  },
  {
    id: 4,
    title: "The Rose That Survived Everything",
    subtitle: "On resilience and stubborn beauty",
    author: "Elena Vasquez",
    initials: "EV",
    role: "Gardener Member",
    category: "Growing Journey",
    date: "January 20, 2026",
    readTime: "9 min",
    type: "rose",
    excerpt: "It had survived a drought, an aphid apocalypse, my over-enthusiastic pruning, and a particularly aggressive neighbourhood cat. And yet, every June, it bloomed. Deep crimson, forty petals, defiant.",
    likes: 156,
    featured: false,
  },
  {
    id: 5,
    title: "Spring Tulip Arrangements",
    subtitle: "The geometry of seasonal abundance",
    author: "Aisha Rajan",
    initials: "AR",
    role: "Curator Member",
    category: "Floral Art",
    date: "March 5, 2026",
    readTime: "5 min",
    type: "tulip",
    excerpt: "There is a mathematics to the tulip that most people overlook. The spiral of its petals follows the Fibonacci sequence. Once you see it, you can never arrange flowers the same way again.",
    likes: 94,
    featured: false,
  },
  {
    id: 6,
    title: "Dahlias at Dusk",
    subtitle: "Why evening light changes everything",
    author: "Jin Wei",
    initials: "JW",
    role: "Gardener Member",
    category: "Seasonal",
    date: "August 12, 2026",
    readTime: "7 min",
    type: "dahlia",
    excerpt: "I&apos;ve been photographing my dahlias at every hour of the day for three months. The results confirm what I suspected: the hour before sunset is when they become something else entirely.",
    likes: 71,
    featured: false,
  },
];

export default function StoriesPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const pool = useFlowerPool(["peony","iris","orchid","rose","tulip","dahlia","lily"]);
  const [likedStories, setLikedStories] = useState<Record<number, boolean>>({});
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", title: "", category: "", story: "", email: "" });
  const [submitted, setSubmitted] = useState(false);

  const filtered = activeCategory === "All" ? STORIES : STORIES.filter((s) => s.category === activeCategory);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".stories-hero-text", { y: 40, opacity: 0, duration: 0.9, stagger: 0.15, ease: "power3.out", delay: 0.2 });
      ScrollTrigger.batch(".story-card", {
        onEnter: (els) => gsap.fromTo(els, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, stagger: 0.1, ease: "power3.out" }),
        start: "top 90%",
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const toggleLike = (id: number) => setLikedStories((l) => ({ ...l, [id]: !l[id] }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setShowModal(false); setSubmitted(false); setForm({ name: "", role: "", title: "", category: "", story: "", email: "" }); }, 2800);
  };

  return (
    <div ref={pageRef}>

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--bg)", paddingTop: "140px", paddingBottom: "100px" }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 55% at 50% 40%, rgba(184,43,88,0.13) 0%, transparent 70%)" }} />
        {/* floating petals */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="petal-particle" style={{ left: `${8 + i * 16}%`, bottom: "-20px", width: `${8 + (i % 3) * 3}px`, height: `${8 + (i % 3) * 3}px`, borderRadius: "50% 30% 50% 30%", background: i % 2 === 0 ? "rgba(184,43,88,0.35)" : "rgba(196,162,60,0.25)", animationDuration: `${9 + i * 2}s`, animationDelay: `${i * 1.5}s` }} />
        ))}
        <div className="container relative" style={{ zIndex: 2 }}>
          <div className="stories-hero-text eyebrow mb-6" style={{ color: "var(--gold-light)" }}>Member Voices · Community Stories</div>
          <h1 className="stories-hero-text" style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)", fontSize: "clamp(3rem, 8vw, 7.5rem)", fontWeight: 900, lineHeight: 0.92, letterSpacing: "-0.025em", color: "var(--cream)", maxWidth: "840px", marginBottom: "1.5rem" }}>
            Stories From<br />
            <span style={{ background: "linear-gradient(135deg, var(--rose-light), var(--petal), var(--gold-light))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Our Garden
            </span>
          </h1>
          <p className="stories-hero-text" style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "clamp(1.1rem, 2vw, 1.5rem)", fontStyle: "italic", color: "var(--muted)", maxWidth: "520px", lineHeight: 1.8, marginBottom: "2.5rem" }}>
            Real stories from real flower growers — the triumphs, the failures, and the extraordinary moments that happen between seasons.
          </p>
          <div className="stories-hero-text flex flex-wrap items-center gap-4">
            <button onClick={() => setShowModal(true)} className="btn btn-primary btn-lg">
              <PenLine size={16} /> Share Your Story
            </button>
            <Link href="/gallery" className="btn btn-outline btn-lg">
              Photo Gallery <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FILTER TABS ── */}
      <div className="sticky z-30 py-4" style={{ top: "68px", background: "rgba(6,3,10,0.96)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border-s)" }}>
        <div className="container">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="tag whitespace-nowrap flex-shrink-0 transition-all"
                style={activeCategory === cat ? {
                  background: `${CAT_COLORS[cat] || "var(--rose)"}22`,
                  borderColor: CAT_COLORS[cat] || "var(--rose)",
                  color: CAT_COLORS[cat] || "var(--petal)",
                } : {}}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURED (2-col editorial) ── */}
      {activeCategory === "All" && (
        <section className="section-pad" style={{ background: "var(--surface)" }}>
          <div className="container">
            <div className="eyebrow mb-10">Featured Stories</div>
            <div className="grid lg:grid-cols-2 gap-8">
              {STORIES.filter((s) => s.featured).map((story) => {
                const catColor = CAT_COLORS[story.category] || "var(--rose)";
                return (
                  <article key={story.id} className="story-card group" style={{ background: "var(--card)", border: "1px solid var(--border-s)", borderRadius: "24px", overflow: "hidden", transition: "transform .35s, box-shadow .35s, border-color .35s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-8px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 32px 72px rgba(0,0,0,0.6), 0 0 48px rgba(184,43,88,0.1)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border-s)"; }}
                  >
                    {/* image */}
                    <div style={{ position: "relative", height: "300px", overflow: "hidden" }}>
                      <img src={pick(pool, story.type)} alt={story.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .7s cubic-bezier(0.25,0.46,0.45,0.94)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.07)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                      />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(6,3,10,0.88) 0%, rgba(6,3,10,0.2) 55%, transparent 100%)" }} />
                      {/* category badge */}
                      <span style={{ position: "absolute", top: "16px", left: "16px", padding: "5px 16px", borderRadius: "999px", background: `${catColor}22`, border: `1px solid ${catColor}55`, color: catColor, fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                        {story.category}
                      </span>
                      {/* author initials */}
                      <div style={{ position: "absolute", bottom: "16px", left: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `${catColor}cc`, border: "2px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 700, color: "white", flexShrink: 0 }}>{story.initials}</div>
                        <div>
                          <p style={{ color: "white", fontSize: "12px", fontWeight: 600, fontFamily: "var(--font-sans)" }}>{story.author}</p>
                          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "10px", fontFamily: "var(--font-sans)", letterSpacing: "0.05em" }}>{story.role}</p>
                        </div>
                      </div>
                    </div>
                    {/* body */}
                    <div style={{ padding: "2rem" }}>
                      {/* colored accent bar */}
                      <div style={{ width: "40px", height: "3px", borderRadius: "2px", background: `linear-gradient(to right, ${catColor}, transparent)`, marginBottom: "1rem" }} />
                      <h3 style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)", fontSize: "clamp(1.3rem, 2vw, 1.7rem)", fontWeight: 700, color: "var(--cream)", lineHeight: 1.2, marginBottom: "0.4rem" }}>
                        {story.title}
                      </h3>
                      <p style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "1.1rem", fontStyle: "italic", color: "var(--muted)", marginBottom: "1rem" }}>{story.subtitle}</p>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--dim)", lineHeight: 1.85, marginBottom: "1.5rem" }}>
                        {story.excerpt.substring(0, 160)}…
                      </p>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "1rem", borderTop: "1px solid var(--border-s)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-sans)" }}>
                            <Calendar size={11} /> {story.date}
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-sans)" }}>
                            <Clock size={11} /> {story.readTime}
                          </span>
                        </div>
                        <button
                          onClick={() => toggleLike(story.id)}
                          style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", background: "none", border: "none", color: likedStories[story.id] ? "var(--rose-light)" : "var(--muted)", transition: "color .2s", fontFamily: "var(--font-sans)" }}
                        >
                          <Heart size={14} fill={likedStories[story.id] ? "var(--rose-light)" : "none"} />
                          {story.likes + (likedStories[story.id] ? 1 : 0)}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── ALL STORIES GRID ── */}
      <section className="section-pad" style={{ background: "var(--bg)" }}>
        <div className="container">
          {activeCategory !== "All" && (
            <div className="mb-10">
              <h2 style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 700, color: "var(--cream)", marginBottom: "0.75rem" }}>{activeCategory}</h2>
              <div className="hr-rose" />
            </div>
          )}
          {activeCategory === "All" && <div className="eyebrow mb-10">All Member Stories</div>}

          <div className="grid gap-8" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
            {filtered.map((story) => {
              const catColor = CAT_COLORS[story.category] || "var(--rose)";
              return (
                <article
                  key={story.id}
                  className="story-card"
                  style={{ background: "var(--card)", border: "1px solid var(--border-s)", borderRadius: "20px", overflow: "hidden", display: "flex", flexDirection: "column", transition: "transform .35s, box-shadow .35s, border-color .35s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-8px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 28px 60px rgba(0,0,0,0.55), 0 0 36px rgba(184,43,88,0.1)"; (e.currentTarget as HTMLElement).style.borderColor = catColor + "55"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border-s)"; }}
                >
                  {/* image */}
                  <div style={{ position: "relative", height: "220px", overflow: "hidden", flexShrink: 0 }}>
                    <img src={pick(pool, story.type)} alt={story.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .7s" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.08)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                    />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(6,3,10,0.75) 0%, transparent 55%)" }} />
                    <span style={{ position: "absolute", top: "14px", left: "14px", padding: "4px 12px", borderRadius: "999px", background: `${catColor}25`, border: `1px solid ${catColor}50`, color: catColor, fontSize: "9px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "var(--font-sans)" }}>
                      {story.category}
                    </span>
                    <div style={{ position: "absolute", bottom: "12px", right: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Clock size={10} style={{ color: "rgba(255,255,255,0.6)" }} />
                      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-sans)" }}>{story.readTime}</span>
                    </div>
                  </div>

                  {/* colored top accent */}
                  <div style={{ height: "3px", background: `linear-gradient(to right, ${catColor}, transparent)`, flexShrink: 0 }} />

                  {/* body */}
                  <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                    <h3 style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)", fontSize: "1.2rem", fontWeight: 700, color: "var(--cream)", lineHeight: 1.25, marginBottom: "0.3rem" }}>
                      {story.title}
                    </h3>
                    <p style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "1rem", fontStyle: "italic", color: "var(--muted)", marginBottom: "0.9rem" }}>{story.subtitle}</p>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--dim)", lineHeight: 1.8, flexGrow: 1, marginBottom: "1.25rem" }}>
                      {story.excerpt.substring(0, 120)}…
                    </p>

                    {/* footer */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "1rem", borderTop: "1px solid var(--border-s)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: CAT_COLORS[story.category] || "var(--rose)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 700, color: "white", flexShrink: 0, border: "1.5px solid var(--border-s)" }}>{story.initials}</div>
                        <div>
                          <p style={{ fontSize: "12px", fontWeight: 500, color: "var(--cream)", fontFamily: "var(--font-sans)", lineHeight: 1 }}>{story.author}</p>
                          <p style={{ fontSize: "10px", color: "var(--dim)", fontFamily: "var(--font-sans)", marginTop: "2px" }}>{story.date}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleLike(story.id)}
                        style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", background: "none", border: "none", color: likedStories[story.id] ? "var(--rose-light)" : "var(--muted)", transition: "color .2s, transform .2s", fontFamily: "var(--font-sans)", padding: "6px 10px", borderRadius: "8px" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--rose-glow)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
                      >
                        <Heart size={13} fill={likedStories[story.id] ? "var(--rose-light)" : "none"} />
                        {story.likes + (likedStories[story.id] ? 1 : 0)}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <BookOpen size={40} style={{ color: "var(--dim)", margin: "0 auto 16px" }} />
              <p className="t-h3 mb-3" style={{ color: "var(--muted)" }}>No stories yet in this category</p>
              <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm mt-2">Be the first to share</button>
            </div>
          )}
        </div>
      </section>

      {/* ── SHARE CTA BAND ── */}
      <section className="section-pad" style={{ background: "var(--surface)", borderTop: "1px solid var(--border-s)", borderBottom: "1px solid var(--border-s)" }}>
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="eyebrow mb-5">Share Your Journey</div>
              <h2 style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 800, color: "var(--cream)", lineHeight: 1.05, marginBottom: "1rem" }}>
                Your Story<br />
                <span style={{ background: "linear-gradient(135deg, var(--rose-light), var(--petal))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Belongs Here
                </span>
              </h2>
              <p style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "1.2rem", fontStyle: "italic", color: "var(--muted)", lineHeight: 1.8, marginBottom: "2rem", maxWidth: "440px" }}>
                Every garden holds a story worth telling. Share your experience — beginners and veterans welcome.
              </p>
              <button onClick={() => setShowModal(true)} className="btn btn-primary btn-lg">
                Submit Your Story <PenLine size={16} />
              </button>
            </div>
            <div style={{ position: "relative", height: "320px", borderRadius: "20px", overflow: "hidden" }}>
              <img src={pick(pool, "lily")} alt="Lily flowers" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(184,43,88,0.3), rgba(6,3,10,0.5))" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "2rem" }}>
                <p style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, color: "white", lineHeight: 1 }}>
                  {STORIES.length}
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginTop: "6px" }}>
                  Stories Shared
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SUBMIT MODAL ── */}
      {showModal && (
        <div className="lightbox-overlay" onClick={() => setShowModal(false)}>
          <div
            className="relative w-full"
            style={{ maxWidth: "640px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "24px", padding: "3rem", maxHeight: "90vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setShowModal(false)} style={{ position: "absolute", top: "1.5rem", right: "1.5rem", color: "var(--muted)", background: "none", border: "none" }}>
              <X size={20} />
            </button>

            {submitted ? (
              <div className="text-center py-8">
                <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🌸</div>
                <h3 style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)", fontSize: "2rem", fontWeight: 700, color: "var(--cream)", marginBottom: "0.75rem" }}>Story Received!</h3>
                <p style={{ fontFamily: "var(--font-sans)", color: "var(--muted)", lineHeight: 1.7 }}>
                  Thank you, {form.name}. Your story will be reviewed and published within 48 hours.
                </p>
              </div>
            ) : (
              <>
                <div className="eyebrow mb-4">Share Your Story</div>
                <h3 style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)", fontSize: "1.8rem", fontWeight: 700, color: "var(--cream)", marginBottom: "0.5rem" }}>Tell the Community</h3>
                <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "2rem" }}>Your experience matters. Every grower has a story worth sharing.</p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Your Name</label>
                      <input type="text" className="form-input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div>
                      <label className="form-label">Email</label>
                      <input type="email" className="form-input" placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Story Title</label>
                    <input type="text" className="form-input" placeholder="Give your story a compelling title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                  </div>
                  <div>
                    <label className="form-label">Category</label>
                    <select className="form-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                      <option value="">Select a category</option>
                      {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Your Story</label>
                    <textarea className="form-input" placeholder="Share your flower growing experience, discovery, or insight…" value={form.story} onChange={(e) => setForm({ ...form, story: e.target.value })} style={{ minHeight: "160px" }} required />
                  </div>
                  <div className="flex items-center justify-center gap-3 p-5" style={{ border: "1.5px dashed var(--border-s)", borderRadius: "12px", color: "var(--muted)" }}>
                    <Upload size={18} />
                    <span className="t-small">Attach a photo (optional) — drag &amp; drop or click</span>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                    Submit Story <ArrowRight size={15} />
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
