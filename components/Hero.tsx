"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(SplitText, ScrollTrigger);

const BLOOM_STATUS = [
  { name: "Himalayan Rhododendron", status: "Peak Bloom", color: "#B82B58" },
  { name: "Cherry Blossom",         status: "Early Bloom", color: "#F2BCCA" },
  { name: "Garden Peony",           status: "Budding",     color: "#9B7FD4" },
];

export default function Hero() {
  const wrapRef  = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const h1Ref    = useRef<HTMLHeadingElement>(null);
  const subRef   = useRef<HTMLParagraphElement>(null);
  const ctaRef   = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const scrollRef= useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Zoom parallax on video as page scrolls
      if (videoRef.current) {
        gsap.to(videoRef.current, {
          scale: 1.14,
          ease: "none",
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.8,
          },
        });
      }

      const run = () => {
        if (!h1Ref.current) return;
        const split = new SplitText(h1Ref.current, { type: "lines,words" });

        gsap.set(wrapRef.current, { opacity: 1 });

        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.fromTo(labelRef.current,  { x: -36, opacity: 0 }, { x: 0, opacity: 1, duration: 0.85 }, 0.1)
          .fromTo(split.words,       { y: "115%", opacity: 0 }, { y: "0%", opacity: 1, duration: 1.2, stagger: 0.07 }, 0.35)
          .fromTo(subRef.current,    { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, "-=0.5")
          .fromTo(ctaRef.current,    { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.45")
          .fromTo(statsRef.current,  { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.3")
          .fromTo(glassRef.current,  { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 1.1, ease: "power3.out" }, "-=0.85")
          .fromTo(scrollRef.current, { opacity: 0 },        { opacity: 1, duration: 0.6 }, "-=0.2");

        gsap.to(scrollRef.current, {
          y: 12, duration: 1.9, repeat: -1, yoyo: true, ease: "power1.inOut", delay: 2.6,
        });

        // Subtle text parallax on scroll
        gsap.to(h1Ref.current, {
          y: "16%", ease: "none",
          scrollTrigger: { trigger: wrapRef.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(subRef.current, {
          y: "9%", ease: "none",
          scrollTrigger: { trigger: wrapRef.current, start: "top top", end: "bottom top", scrub: true },
        });

        return () => split.revert();
      };

      if (document.fonts?.ready) {
        document.fonts.ready.then(() => run());
      } else {
        run();
      }
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={wrapRef}
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100dvh", opacity: 0 }}
    >
      {/* Video background */}
      <video
        ref={videoRef}
        autoPlay muted loop playsInline
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover", zIndex: 0,
          transformOrigin: "center center",
        }}
      >
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>

      {/* Left-heavy gradient — text readable, video breathes on the right */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(105deg, rgba(6,3,10,0.94) 0%, rgba(6,3,10,0.80) 38%, rgba(6,3,10,0.30) 68%, rgba(6,3,10,0.12) 100%)",
          zIndex: 1,
        }}
      />
      {/* Bottom vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, rgba(6,3,10,0.88) 0%, transparent 38%)",
          zIndex: 1,
        }}
      />
      {/* Rose glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 55% 60% at 20% 55%, rgba(184,43,88,0.18) 0%, transparent 65%)",
          zIndex: 2,
        }}
      />

      {/* Main grid */}
      <div
        className="hero-grid relative"
        style={{
          zIndex: 5,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: "100dvh",
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "0 clamp(24px, 6vw, 96px)",
        }}
      >
        {/* ── Left: Content ── */}
        <div
          className="flex flex-col justify-center"
          style={{ paddingTop: "clamp(88px,14vh,160px)", paddingBottom: "clamp(60px,8vh,100px)", paddingRight: "clamp(0px, 3vw, 60px)" }}
        >
          {/* Eyebrow */}
          <div
            ref={labelRef}
            style={{
              display: "flex", alignItems: "center", gap: "14px",
              marginBottom: "clamp(28px, 4vw, 48px)", opacity: 0,
            }}
          >
            <span style={{ width: "30px", height: "1px", background: "var(--gold)", flexShrink: 0 }} />
            <span
              style={{
                fontFamily: "var(--font-sans)", fontSize: "10px",
                letterSpacing: "0.22em", textTransform: "uppercase",
                color: "var(--gold-light)",
              }}
            >
              Laliguras Flower Society · Woosong University · Est. 2026
            </span>
          </div>

          {/* Headline — no gradient text per taste-skill */}
          <h1
            ref={h1Ref}
            style={{
              fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
              fontSize: "clamp(3.6rem, 8.5vw, 9.5rem)",
              fontWeight: 900,
              lineHeight: 0.91,
              letterSpacing: "-0.032em",
              color: "var(--cream)",
              marginBottom: "clamp(18px, 2.5vw, 34px)",
              overflow: "hidden",
            }}
          >
            Where<br />
            Flowers<br />
            <em
              className="not-italic"
              style={{ color: "var(--petal)" }}
            >
              Bloom
            </em>
          </h1>

          {/* Subtitle */}
          <p
            ref={subRef}
            style={{
              fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
              fontSize: "clamp(1.1rem, 1.9vw, 1.55rem)",
              fontStyle: "italic",
              color: "var(--muted)",
              maxWidth: "430px",
              lineHeight: 1.85,
              marginBottom: "clamp(28px, 4vw, 48px)",
              opacity: 0,
            }}
          >
            A sanctuary for those who cultivate with passion — celebrating the extraordinary flowering flora of the world, bloom by bloom, at Woosong University, Daejeon.
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-wrap items-center gap-4" style={{ opacity: 0 }}>
            <Link href="/join" className="btn btn-primary btn-lg">
              Join the Society <ArrowRight size={16} />
            </Link>
            <Link href="/plants" className="btn btn-outline btn-lg">
              Explore Flowers
            </Link>
          </div>

          {/* Stats strip */}
          <div
            ref={statsRef}
            className="flex flex-wrap gap-8"
            style={{
              marginTop: "clamp(44px, 7vw, 92px)",
              paddingTop: "clamp(22px, 3vw, 36px)",
              borderTop: "1px solid rgba(255,255,255,0.09)",
              opacity: 0,
            }}
          >
            {[
              { n: "Est. 2026", l: "Founded" },
              { n: "200+",      l: "Flower Species" },
              { n: "Daejeon",   l: "South Korea" },
            ].map(({ n, l }) => (
              <div key={l}>
                <div
                  style={{
                    fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                    fontSize: "clamp(1.3rem, 2.4vw, 2.1rem)",
                    fontWeight: 800,
                    color: "var(--cream)",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {n}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-sans)", fontSize: "9px",
                    color: "var(--muted)", letterSpacing: "0.13em",
                    textTransform: "uppercase", marginTop: "8px",
                  }}
                >
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Glass card + vertical label (desktop only) ── */}
        <div
          className="hidden lg:flex flex-col justify-center items-end gap-6"
          style={{ paddingTop: "clamp(110px,14vh,160px)", paddingBottom: "100px" }}
        >
          <div
            ref={glassRef}
            style={{
              opacity: 0,
              background: "rgba(13,5,22,0.42)",
              backdropFilter: "blur(28px) saturate(1.3)",
              WebkitBackdropFilter: "blur(28px) saturate(1.3)",
              border: "1px solid rgba(242,188,202,0.11)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 40px 80px rgba(0,0,0,0.45)",
              borderRadius: "20px",
              padding: "36px 36px 40px",
              maxWidth: "268px",
              width: "100%",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-sans)", fontSize: "9px",
                letterSpacing: "0.2em", textTransform: "uppercase",
                color: "var(--gold-light)", marginBottom: "22px",
              }}
            >
              Current Bloom Season
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginBottom: "28px" }}>
              {BLOOM_STATUS.map(({ name, status, color }) => (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: "13px" }}>
                  <span
                    style={{
                      width: "7px", height: "7px", borderRadius: "50%",
                      background: color, flexShrink: 0,
                      boxShadow: `0 0 10px ${color}80`,
                    }}
                  />
                  <div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--cream)", fontWeight: 500, lineHeight: 1.3 }}>
                      {name}
                    </div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "10px", color: "var(--dim)", marginTop: "2px" }}>
                      {status}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                paddingTop: "22px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                    fontSize: "30px", fontWeight: 800,
                    color: "var(--cream)", lineHeight: 1,
                  }}
                >
                  12
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-sans)", fontSize: "9px",
                    color: "var(--dim)", letterSpacing: "0.1em",
                    textTransform: "uppercase", marginTop: "5px",
                  }}
                >
                  Events This Month
                </div>
              </div>
              <Link
                href="/events"
                style={{
                  fontFamily: "var(--font-sans)", fontSize: "11px",
                  color: "var(--rose-light)", letterSpacing: "0.1em",
                  textTransform: "uppercase", display: "flex",
                  alignItems: "center", gap: "6px", textDecoration: "none",
                }}
              >
                View <ArrowRight size={11} />
              </Link>
            </div>
          </div>

          {/* Vertical location text */}
          <div
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              transform: "rotate(180deg)",
              fontFamily: "var(--font-sans)",
              fontSize: "9px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.18)",
              paddingRight: "4px",
            }}
          >
            Woosong University · Daejeon · Korea
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        ref={scrollRef}
        className="absolute flex flex-col items-center gap-3"
        style={{ bottom: "32px", left: "50%", transform: "translateX(-50%)", zIndex: 5, opacity: 0 }}
      >
        <span
          style={{
            fontFamily: "var(--font-sans)", fontSize: "8px",
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.22)",
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: "1px", height: "44px",
            background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)",
          }}
        />
      </div>

      {/* Mobile full-height gradient overlay */}
      <style>{`
        @media (max-width: 1023px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
