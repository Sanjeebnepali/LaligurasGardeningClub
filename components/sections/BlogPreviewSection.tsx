"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Clock, ArrowRight } from "lucide-react";
import { useFlowerPool, pick } from "@/lib/useFlowerPool";
import POSTS from "@/lib/blogData";

gsap.registerPlugin(ScrollTrigger);

const PREVIEW = POSTS.slice(0, 3);

export default function BlogPreviewSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pool       = useFlowerPool(["rose", "dahlia", "peony", "tulip", "orchid", "lily"]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".blog-pre-header > *",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: ".blog-pre-header", start: "top 82%", once: true } }
      );
      ScrollTrigger.batch(".blog-pre-card", {
        onEnter: (els) =>
          gsap.fromTo(els,
            { y: 44, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out" }
          ),
        start: "top 85%", once: true,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-pad-lg"
      style={{ background: "#0C0618", borderTop: "1px solid rgba(253,248,240,0.06)" }}
    >
      <div className="container">

        {/* Header */}
        <div className="blog-pre-header" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "20px", marginBottom: "56px" }}>
          <div>
            <div className="eyebrow mb-4" style={{ fontSize: "10px", letterSpacing: "0.2em" }}>Bloom Journal</div>
            <h2 style={{
              fontFamily: "var(--font-playfair,'Playfair Display',serif)",
              fontSize: "clamp(2.4rem,5vw,4rem)", fontWeight: 900,
              color: "var(--cream)", letterSpacing: "-0.02em", lineHeight: 1,
              marginBottom: "14px",
            }}>
              From the Journal
            </h2>
            <p style={{
              fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)",
              fontSize: "clamp(1.1rem,1.8vw,1.4rem)", fontStyle: "italic",
              color: "var(--muted)", lineHeight: 1.7, maxWidth: "460px",
            }}>
              In-depth growing guides, botanical wisdom, and seasonal advice from our community of growers.
            </p>
          </div>
          <Link
            href="/blog"
            className="btn btn-outline-rose"
            style={{ fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "8px", flexShrink: 0 }}
          >
            All Articles <ArrowRight size={14} />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PREVIEW.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="blog-pre-card rounded-2xl overflow-hidden"
              style={{
                background: "#1E1134",
                border: "1px solid rgba(253,248,240,0.1)",
                textDecoration: "none", display: "block",
                transition: "border-color .3s, transform .3s, box-shadow .3s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(184,43,88,0.45)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-5px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 48px rgba(0,0,0,0.4)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(253,248,240,0.1)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              {/* Thumbnail */}
              <div style={{ aspectRatio: "16/9", overflow: "hidden", position: "relative" }}>
                <img
                  src={pick(pool, post.type)}
                  alt={post.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.72, transition: "transform .5s ease" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                />
                {/* Tag overlay */}
                <span style={{
                  position: "absolute", top: "14px", left: "14px",
                  padding: "4px 11px", borderRadius: "999px",
                  background: "rgba(6,3,10,0.72)",
                  border: "1px solid rgba(184,43,88,0.35)",
                  fontFamily: "var(--font-sans)", fontSize: "9px",
                  fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
                  color: "var(--petal)",
                  backdropFilter: "blur(8px)",
                }}>
                  {post.tag}
                </span>
              </div>

              {/* Body */}
              <div style={{ padding: "26px 26px 30px" }}>
                <h3 style={{
                  fontFamily: "var(--font-playfair,'Playfair Display',serif)",
                  fontSize: "1.2rem", fontWeight: 700, color: "var(--cream)",
                  lineHeight: 1.3, marginBottom: "10px",
                }}>
                  {post.title}
                </h3>
                <p style={{
                  fontFamily: "var(--font-sans)", fontSize: "13px",
                  color: "rgba(253,248,240,0.60)", lineHeight: 1.75,
                  marginBottom: "18px",
                  display: "-webkit-box", WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical", overflow: "hidden",
                } as React.CSSProperties}>
                  {post.excerpt}
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 500, color: "var(--cream)" }}>
                      {post.author}
                    </p>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "rgba(253,248,240,0.38)", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={10} /> {post.readTime} read
                    </p>
                  </div>
                  <span style={{ color: "var(--rose-light)", fontSize: "12px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px", fontFamily: "var(--font-sans)" }}>
                    Read <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
