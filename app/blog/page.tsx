"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Clock, ArrowRight, Search } from "lucide-react";
import { useFlowerPool, pick } from "@/lib/useFlowerPool";
import POSTS from "@/lib/blogData";

gsap.registerPlugin(ScrollTrigger);

const TAGS = ["All", ...Array.from(new Set(POSTS.map((p) => p.tag)))];

const pageVars = {
  "--surface":   "#160C28",
  "--card":      "#1E1134",
  "--muted":     "rgba(253,248,240,0.72)",
  "--dim":       "rgba(253,248,240,0.40)",
  "--border-s":  "rgba(253,248,240,0.13)",
  "--rose-glow": "rgba(184,43,88,0.22)",
} as React.CSSProperties;

export default function BlogPage() {
  const pageRef  = useRef<HTMLDivElement>(null);
  const pool     = useFlowerPool(["rose", "dahlia", "peony", "tulip", "orchid", "lily"]);
  const [activeTag,   setActiveTag]   = useState("All");
  const [query,       setQuery]       = useState("");

  const featured = POSTS[0];
  const filtered = POSTS.slice(1).filter((p) => {
    const matchTag   = activeTag === "All" || p.tag === activeTag;
    const matchQuery = query === "" || p.title.toLowerCase().includes(query.toLowerCase()) || p.author.toLowerCase().includes(query.toLowerCase());
    return matchTag && matchQuery;
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".blog-hero > *",
        { y: 52, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.14, ease: "power3.out", delay: 0.2 }
      );
      ScrollTrigger.batch(".post-card", {
        onEnter: (els) =>
          gsap.fromTo(els,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.65, stagger: 0.09, ease: "power3.out" }
          ),
        start: "top 88%", once: true,
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} style={pageVars}>

      {/* ════ HERO ════ */}
      <section
        className="relative overflow-hidden flex items-end"
        style={{ minHeight: "62vh", paddingTop: "68px", paddingBottom: "100px", background: "#0C0618" }}
      >
        <div className="absolute inset-0" style={{ backgroundImage: `url(${pick(pool, "rose")})`, backgroundSize: "cover", backgroundPosition: "center 35%", opacity: 0.52 }} />
        <div className="absolute inset-0" style={{ background: "rgba(6,3,10,0.38)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 75% 55% at 50% 70%, rgba(184,43,88,0.16) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-44 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, #160C28)" }} />

        <div className="container relative" style={{ zIndex: 2 }}>
          <div className="blog-hero">
            <span className="badge mb-6" style={{ fontSize: "10px", letterSpacing: "0.18em" }}>Laliguras Journal</span>
            <h1 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "clamp(3.6rem,9vw,8rem)", fontWeight: 900, lineHeight: 0.9, letterSpacing: "-0.03em", color: "var(--cream)", maxWidth: "780px", marginBottom: "2rem" }}>
              The Bloom
              <br />
              <span style={{ background: "linear-gradient(135deg,var(--rose-light),var(--petal),var(--gold-light))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Journal</span>
            </h1>
            <p style={{ fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)", fontSize: "clamp(1.25rem,2.2vw,1.65rem)", fontStyle: "italic", color: "var(--muted)", maxWidth: "520px", lineHeight: 1.85 }}>
              In-depth articles, growing guides, and botanical wisdom — written by our growers, for our community.
            </p>
          </div>
        </div>
      </section>

      {/* ════ FEATURED POST ════ */}
      <section style={{ background: "var(--surface)", borderTop: "1px solid rgba(253,248,240,0.06)", padding: "80px 0" }}>
        <div className="container">
          <div className="eyebrow mb-8" style={{ fontSize: "10px", letterSpacing: "0.2em" }}>Featured Article</div>
          <Link
            href={`/blog/${featured.slug}`}
            className="grid lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden"
            style={{ background: "var(--card)", border: "1px solid var(--border-s)", textDecoration: "none" }}
          >
            {/* Image */}
            <div style={{ minHeight: "clamp(220px, 35vw, 420px)", overflow: "hidden", position: "relative" }}>
              <img
                src={pick(pool, featured.type)}
                alt={featured.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.75, transition: "transform .6s ease" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent, rgba(30,17,52,0.3))" }} />
            </div>
            {/* Content */}
            <div style={{ padding: "52px 48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <span className="badge mb-5" style={{ fontSize: "9px", letterSpacing: "0.16em", width: "fit-content" }}>{featured.tag}</span>
              <h2 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "clamp(1.9rem,3.5vw,2.8rem)", fontWeight: 800, color: "var(--cream)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "16px" }}>
                {featured.title}
              </h2>
              <p style={{ fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)", fontSize: "1.2rem", fontStyle: "italic", color: "var(--muted)", lineHeight: 1.8, marginBottom: "28px", maxWidth: "420px" }}>
                {featured.excerpt}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 600, color: "var(--cream)" }}>{featured.author}</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--dim)", marginTop: "2px" }}>{featured.date} · {featured.readTime} read</p>
                </div>
              </div>
              <span className="btn btn-primary" style={{ width: "fit-content", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                Read Article <ArrowRight size={15} />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ════ ALL POSTS ════ */}
      <section className="section-pad-lg" style={{ background: "#0C0618", borderTop: "1px solid rgba(253,248,240,0.06)" }}>
        <div className="container">
          {/* Controls row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center", justifyContent: "space-between", marginBottom: "48px" }}>
            {/* Tag filters */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "999px",
                    background: activeTag === tag ? "var(--rose)" : "rgba(30,17,52,0.6)",
                    border: `1px solid ${activeTag === tag ? "var(--rose)" : "var(--border-s)"}`,
                    color: activeTag === tag ? "#fff" : "var(--muted)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    transition: "all .2s ease",
                    cursor: "pointer",
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
            {/* Search */}
            <div style={{ position: "relative", minWidth: "220px" }}>
              <Search size={14} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--dim)", pointerEvents: "none" }} />
              <input
                className="form-input"
                placeholder="Search articles…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ paddingLeft: "38px", fontSize: "14px", borderRadius: "999px" }}
              />
            </div>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center" style={{ padding: "80px 0", color: "var(--muted)", fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)", fontSize: "1.4rem", fontStyle: "italic" }}>
              No articles match that search.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="post-card rounded-2xl overflow-hidden"
                  style={{ background: "var(--card)", border: "1px solid var(--border-s)", textDecoration: "none", display: "block", transition: "border-color .3s, transform .3s, box-shadow .3s" }}
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
                  <div style={{ height: "210px", overflow: "hidden" }}>
                    <img
                      src={pick(pool, post.type)}
                      alt={post.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.72, transition: "transform .5s" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                    />
                  </div>
                  {/* Body */}
                  <div style={{ padding: "26px 26px 30px" }}>
                    <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: "999px", background: "var(--rose-glow)", border: "1px solid var(--border)", fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--petal)", marginBottom: "14px" }}>
                      {post.tag}
                    </span>
                    <h3 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "1.25rem", fontWeight: 700, color: "var(--cream)", lineHeight: 1.3, marginBottom: "12px" }}>
                      {post.title}
                    </h3>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--muted)", lineHeight: 1.75, marginBottom: "18px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>
                      {post.excerpt}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 500, color: "var(--cream)" }}>{post.author}</p>
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--dim)", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Clock size={10} /> {post.readTime} read
                        </p>
                      </div>
                      <span style={{ color: "var(--rose-light)", fontSize: "12px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px", fontFamily: "var(--font-sans)", letterSpacing: "0.06em" }}>
                        Read <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
