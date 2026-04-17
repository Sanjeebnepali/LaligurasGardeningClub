"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Flower2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function NewsletterSection() {
  const ref = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const [done,  setDone]  = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".nl-content", {
        y: 50, opacity: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 80%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // Save to localStorage
      const subs = JSON.parse(localStorage.getItem("lg_subscribers") || "[]");
      if (!subs.includes(email)) subs.push(email);
      localStorage.setItem("lg_subscribers", JSON.stringify(subs));
      setDone(true);
      setEmail("");
    }
  };

  return (
    <section
      ref={ref}
      className="section-pad-lg relative overflow-hidden"
      style={{ background: "var(--surface)" }}
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 100% 80% at 50% 100%, rgba(184,43,88,0.1) 0%, transparent 60%)",
        }}
      />

      <div className="container-sm relative">
        <div className="nl-content text-center">
          <Flower2
            size={48}
            style={{ color: "var(--rose)", margin: "0 auto 1.5rem", opacity: 0.7 }}
          />

          <div className="eyebrow mb-5" style={{ justifyContent: "center" }}>The Bloom Letter</div>

          <h2
            style={{
              fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "var(--cream)",
              lineHeight: 1.05,
              marginBottom: "1.25rem",
            }}
          >
            Stay Rooted<br />
            <span
              style={{
                background: "linear-gradient(135deg, var(--rose-light), var(--petal))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              in Our World
            </span>
          </h2>

          <p
            className="t-accent mb-10"
            style={{ color: "var(--muted)", maxWidth: "460px", margin: "0 auto 2.5rem" }}
          >
            Monthly floral insights, seasonal bloom guides, exclusive event invitations, and rare variety discoveries.
          </p>

          {done ? (
            <div
              className="inline-flex items-center gap-3 px-8 py-5 rounded-xl"
              style={{ background: "var(--rose-glow)", border: "1px solid var(--border)" }}
            >
              <Flower2 size={20} style={{ color: "var(--rose-light)" }} />
              <span style={{ fontFamily: "var(--font-playfair)", fontWeight: 600, color: "var(--cream)" }}>
                Welcome to the bloom community!
              </span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="form-input flex-1"
                required
              />
              <button type="submit" className="btn btn-primary">
                Subscribe <ArrowRight size={14} />
              </button>
            </form>
          )}

          <p className="t-caption mt-4" style={{ color: "var(--dim)" }}>
            No spam. Unsubscribe anytime. Pure flowers.
          </p>
        </div>
      </div>
    </section>
  );
}
