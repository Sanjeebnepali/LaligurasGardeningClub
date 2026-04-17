"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ArrowRight, ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";

const ThreeLeaves = dynamic(() => import("./ThreeLeaves"), { ssr: false });

gsap.registerPlugin(SplitText);

const STATS = [
  { n: "Est. 2026", l: "Founded at Woosong" },
  { n: "200+",      l: "Flower Species"     },
  { n: "Daejeon",   l: "South Korea"        },
  { n: "Global",    l: "Community Network"  },
];

export default function Hero() {
  const wrapRef  = useRef<HTMLElement>(null);
  const h1Ref    = useRef<HTMLHeadingElement>(null);
  const subRef   = useRef<HTMLParagraphElement>(null);
  const ctaRef   = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const scrollRef= useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current!;
    gsap.set(wrap, { opacity: 1 });

    // Wait for fonts before SplitText so characters split correctly
    const run = () => {
      if (!h1Ref.current) return;
      const split = new SplitText(h1Ref.current, { type: "lines,words" });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(labelRef.current,  { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.1)
        .fromTo(split.words,       { y: "110%", opacity: 0 }, { y: "0%", opacity: 1, duration: 1.1, stagger: 0.05, ease: "power4.out" }, 0.4)
        .fromTo(subRef.current,    { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, "-=0.4")
        .fromTo(ctaRef.current,    { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.45")
        .fromTo(statsRef.current,  { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.3")
        .fromTo(scrollRef.current, { opacity: 0 },        { opacity: 1, duration: 0.5 },       "-=0.2");

      gsap.to(scrollRef.current, {
        y: 9, duration: 1.6, repeat: -1, yoyo: true, ease: "power1.inOut", delay: 2,
      });

      return () => split.revert();
    };

    let cleanup: (() => void) | undefined;
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => { cleanup = run(); });
    } else {
      cleanup = run();
    }

    const onScroll = () => {
      const y = window.scrollY;
      if (h1Ref.current)  gsap.set(h1Ref.current,  { y: y * 0.18  });
      if (subRef.current) gsap.set(subRef.current,  { y: y * 0.10  });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      cleanup?.();
    };
  }, []);

  return (
    <section
      ref={wrapRef}
      className="relative w-full overflow-hidden flex flex-col"
      style={{ minHeight: "100dvh", opacity: 0 }}
    >
      {/* ── Video background (plays when /public/video/hero.mp4 exists) ── */}
      {!videoFailed && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={() => {
            if (videoRef.current) {
              videoRef.current.playbackRate = 1.25;
              videoRef.current.play().catch(() => {});
            }
          }}
          onError={() => setVideoFailed(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
            opacity: 0.68,
          }}
        >
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
      )}

      {/* ── Dark scrim so text stays readable over video ── */}
      <div className="absolute inset-0" style={{ background: "rgba(6,3,10,0.32)", zIndex: 1 }} />
      {/* ── Rose radial glow ── */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 65% at 50% 55%, rgba(184,43,88,0.22) 0%, transparent 65%)",
          zIndex: 1,
        }}
      />

      {/* ── Three.js petals ── */}
      <div className="absolute inset-0" style={{ zIndex: 2 }}>
        <ThreeLeaves />
      </div>

      {/* ── Vignette ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 3,
          background: "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 25%, rgba(6,3,10,0.65) 100%)",
        }}
      />

      {/* ── Content ── */}
      <div
        className="relative container flex flex-col justify-center flex-1"
        style={{ zIndex: 5, paddingTop: "130px", paddingBottom: "100px" }}
      >
        <div style={{ maxWidth: "860px" }}>

          {/* Eyebrow */}
          <div
            ref={labelRef}
            className="eyebrow mb-8"
            style={{ color: "var(--gold-light)", opacity: 0 }}
          >
            <span style={{ width: "32px", height: "1px", background: "var(--gold)", display: "inline-block", flexShrink: 0 }} />
            Laliguras Flower Society · Woosong University, Daejeon · Est. 2026
            <span style={{ width: "32px", height: "1px", background: "var(--gold)", display: "inline-block", flexShrink: 0 }} />
          </div>

          {/* Headline */}
          <h1
            ref={h1Ref}
            className="mb-4"
            style={{
              fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
              fontSize: "clamp(3.4rem, 9vw, 9.5rem)",
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: "-0.025em",
              color: "var(--cream)",
              overflow: "hidden",
            }}
          >
            Where Flowers<br />
            <em
              className="not-italic"
              style={{
                background: "linear-gradient(135deg, #D14E72 0%, #F2BCCA 45%, #DDB95A 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "inline-block",
              }}
            >
              Bloom Forever
            </em>
          </h1>

          {/* Subtitle */}
          <p
            ref={subRef}
            style={{
              fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
              fontSize: "clamp(1.15rem, 2.2vw, 1.6rem)",
              fontStyle: "italic",
              color: "var(--muted)",
              maxWidth: "540px",
              lineHeight: 1.8,
              marginBottom: "2.5rem",
            }}
          >
            A sanctuary for those who cultivate with passion — celebrating the extraordinary flowering flora of the world, bloom by bloom, at Woosong University, Daejeon, South Korea.
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-wrap items-center gap-4">
            <Link href="/join" className="btn btn-primary btn-lg">
              Join the Society <ArrowRight size={16} />
            </Link>
            <Link href="/plants" className="btn btn-outline btn-lg">
              Explore Flowers
            </Link>
          </div>

          {/* Stats */}
          <div
            ref={statsRef}
            className="flex flex-wrap gap-10 mt-24 pt-10"
            style={{ borderTop: "1px solid var(--border-s)" }}
          >
            {STATS.map(({ n, l }) => (
              <div key={l}>
                <div
                  style={{
                    fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                    fontSize: "clamp(1.4rem, 2.8vw, 2.2rem)",
                    fontWeight: 800,
                    color: "var(--cream)",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {n}
                </div>
                <div className="t-label mt-2.5" style={{ color: "var(--muted)", fontSize: "10px", letterSpacing: "0.1em" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Scroll cue ── */}
      <div
        ref={scrollRef}
        className="absolute flex flex-col items-center gap-2"
        style={{ bottom: "36px", left: "50%", transform: "translateX(-50%)", zIndex: 5, opacity: 0 }}
      >
        <span className="t-label" style={{ color: "var(--dim)", fontSize: "8px" }}>Scroll</span>
        <ChevronDown size={14} style={{ color: "var(--dim)" }} />
      </div>
    </section>
  );
}
