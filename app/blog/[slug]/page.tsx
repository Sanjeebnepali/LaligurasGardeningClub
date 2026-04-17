"use client";
import { useEffect, useRef } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { ArrowLeft, Clock, Calendar, ArrowRight } from "lucide-react";
import { useFlowerPool, pick } from "@/lib/useFlowerPool";
import POSTS from "@/lib/blogData";

const pageVars = {
  "--surface":   "#160C28",
  "--card":      "#1E1134",
  "--muted":     "rgba(253,248,240,0.72)",
  "--dim":       "rgba(253,248,240,0.40)",
  "--border-s":  "rgba(253,248,240,0.13)",
  "--rose-glow": "rgba(184,43,88,0.22)",
} as React.CSSProperties;

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post    = POSTS.find((p) => p.slug === params.slug);
  const pageRef = useRef<HTMLDivElement>(null);
  const pool    = useFlowerPool(post ? [post.type, "rose", "peony"] : ["rose"]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.fromTo(".post-hero > *",
        { y: 48, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.13, ease: "power3.out", delay: 0.15 }
      );
      gsap.fromTo(".post-body",
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.5 }
      );
    }, pageRef);
    return () => ctx.revert();
  }, [params.slug]);

  if (!post) return notFound();

  const related = POSTS.filter((p) => p.slug !== post.slug && (p.tag === post.tag || p.author === post.author)).slice(0, 3);

  return (
    <div ref={pageRef} style={pageVars}>

      {/* ════ HERO ════ */}
      <section
        className="relative overflow-hidden flex items-end"
        style={{ minHeight: "58vh", paddingTop: "68px", paddingBottom: "88px", background: "#0C0618" }}
      >
        <div className="absolute inset-0" style={{ backgroundImage: `url(${pick(pool, post.type)})`, backgroundSize: "cover", backgroundPosition: "center 40%", opacity: 0.52 }} />
        <div className="absolute inset-0" style={{ background: "rgba(6,3,10,0.40)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 55% at 50% 70%, rgba(184,43,88,0.14) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-44 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, #160C28)" }} />

        <div className="container relative" style={{ zIndex: 2 }}>
          <div className="post-hero">
            <Link href="/blog" className="btn btn-ghost" style={{ marginBottom: "28px", display: "inline-flex", fontSize: "11px", letterSpacing: "0.1em" }}>
              <ArrowLeft size={14} /> Back to Journal
            </Link>
            <span className="badge mb-5" style={{ fontSize: "10px", letterSpacing: "0.16em", display: "block", width: "fit-content" }}>{post.tag}</span>
            <h1 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "clamp(2.8rem,7vw,6.5rem)", fontWeight: 900, lineHeight: 0.93, letterSpacing: "-0.03em", color: "var(--cream)", maxWidth: "860px", marginBottom: "2rem" }}>
              {post.title}
            </h1>
            {/* Author row */}
            <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "var(--rose-glow)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "1.1rem", fontWeight: 700, color: "var(--rose-light)" }}>
                {post.author[0]}
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 600, color: "var(--cream)" }}>{post.author}</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--dim)", marginTop: "2px" }}>{post.authorRole}</p>
              </div>
              <div style={{ height: "32px", width: "1px", background: "rgba(253,248,240,0.15)" }} />
              <div style={{ display: "flex", gap: "16px", alignItems: "center", fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--dim)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><Calendar size={12} />{post.date}</span>
                <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><Clock size={12} />{post.readTime} read</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ ARTICLE BODY ════ */}
      <section style={{ background: "var(--surface)", borderTop: "1px solid rgba(253,248,240,0.06)", padding: "80px 0 100px" }}>
        <div className="post-body" style={{ maxWidth: "760px", margin: "0 auto", padding: "0 40px" }}>

          {/* Excerpt pull-quote */}
          <blockquote
            style={{
              borderLeft: "3px solid var(--rose)",
              paddingLeft: "28px",
              marginBottom: "52px",
              fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)",
              fontSize: "clamp(1.2rem,2vw,1.5rem)",
              fontStyle: "italic",
              color: "var(--muted)",
              lineHeight: 1.8,
            }}
          >
            {post.excerpt}
          </blockquote>

          {/* Content sections */}
          {post.content.map((section, i) => {
            if (section.kind === "intro") {
              return (
                <p key={i} style={{ fontFamily: "var(--font-sans)", fontSize: "17px", color: "rgba(253,248,240,0.88)", lineHeight: 1.95, marginBottom: "40px", fontWeight: 300 }}>
                  {section.text}
                </p>
              );
            }
            if (section.kind === "h2") {
              return (
                <div key={i} style={{ marginBottom: "40px" }}>
                  <h2 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "clamp(1.5rem,2.5vw,1.9rem)", fontWeight: 700, color: "var(--cream)", marginBottom: "16px", lineHeight: 1.2, letterSpacing: "-0.01em" }}>
                    {section.heading}
                  </h2>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "16px", color: "var(--muted)", lineHeight: 1.95, fontWeight: 300 }}>
                    {section.text}
                  </p>
                </div>
              );
            }
            if (section.kind === "body") {
              return (
                <p key={i} style={{ fontFamily: "var(--font-sans)", fontSize: "16px", color: "var(--muted)", lineHeight: 1.95, marginBottom: "32px", fontWeight: 300 }}>
                  {section.text}
                </p>
              );
            }
            if (section.kind === "tip") {
              return (
                <div
                  key={i}
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderLeft: "3px solid var(--rose-light)",
                    borderRadius: "0 12px 12px 0",
                    padding: "24px 28px",
                    marginBottom: "40px",
                  }}
                >
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--rose-light)", marginBottom: "10px" }}>
                    Expert Tip
                  </p>
                  <p style={{ fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)", fontSize: "1.2rem", fontStyle: "italic", color: "var(--muted)", lineHeight: 1.8 }}>
                    {section.text}
                  </p>
                </div>
              );
            }
            if (section.kind === "list") {
              return (
                <div key={i} style={{ marginBottom: "40px" }}>
                  {section.heading && (
                    <h3 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "1.35rem", fontWeight: 700, color: "var(--cream)", marginBottom: "16px" }}>
                      {section.heading}
                    </h3>
                  )}
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                    {section.items?.map((item) => (
                      <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--rose-light)", flexShrink: 0, marginTop: "9px" }} />
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--muted)", lineHeight: 1.75 }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }
            return null;
          })}

          {/* Author card */}
          <div
            style={{
              background: "var(--card)",
              border: "1px solid var(--border-s)",
              borderRadius: "16px",
              padding: "32px 36px",
              display: "flex",
              gap: "20px",
              alignItems: "flex-start",
              marginTop: "60px",
            }}
          >
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "var(--rose-glow)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "1.4rem", fontWeight: 700, color: "var(--rose-light)" }}>
              {post.author[0]}
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "1.1rem", fontWeight: 700, color: "var(--cream)", marginBottom: "4px" }}>{post.author}</p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--rose-light)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>{post.authorRole}</p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--muted)", lineHeight: 1.7 }}>
                A contributing writer and practising horticulturist at the Laliguras Club. Their work focuses on accessible botanical education for growers of all experience levels.
              </p>
            </div>
          </div>

          {/* Share / nav row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "48px", paddingTop: "32px", borderTop: "1px solid var(--border-s)" }}>
            <Link href="/blog" className="btn btn-ghost" style={{ fontSize: "11px", letterSpacing: "0.1em" }}>
              <ArrowLeft size={14} /> All Articles
            </Link>
            <Link href="/newsletter" className="btn btn-outline-rose" style={{ fontSize: "11px" }}>
              Subscribe to Journal
            </Link>
          </div>
        </div>
      </section>

      {/* ════ RELATED POSTS ════ */}
      {related.length > 0 && (
        <section style={{ background: "#0C0618", borderTop: "1px solid rgba(253,248,240,0.06)", padding: "80px 0 100px" }}>
          <div className="container">
            <div className="eyebrow mb-8" style={{ fontSize: "10px", letterSpacing: "0.2em" }}>More to Read</div>
            <h2 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, color: "var(--cream)", marginBottom: "40px", letterSpacing: "-0.02em" }}>
              Related Articles
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  style={{ background: "var(--card)", border: "1px solid var(--border-s)", borderRadius: "16px", overflow: "hidden", textDecoration: "none", display: "block", transition: "border-color .3s, transform .3s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-s)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                >
                  <div style={{ height: "180px", overflow: "hidden" }}>
                    <img src={pick(pool, p.type)} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.72 }} />
                  </div>
                  <div style={{ padding: "24px 24px 28px" }}>
                    <span style={{ display: "inline-block", padding: "3px 11px", borderRadius: "999px", background: "var(--rose-glow)", border: "1px solid var(--border)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--petal)", fontFamily: "var(--font-sans)", marginBottom: "12px" }}>{p.tag}</span>
                    <h3 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "1.1rem", fontWeight: 700, color: "var(--cream)", lineHeight: 1.3, marginBottom: "10px" }}>{p.title}</h3>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--dim)", display: "flex", alignItems: "center", gap: "4px" }}><Clock size={10} />{p.readTime} read</p>
                      <span style={{ color: "var(--rose-light)", fontSize: "11px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px", fontFamily: "var(--font-sans)" }}>Read <ArrowRight size={11} /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
