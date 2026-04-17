"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import {
  ArrowRight, Flower2, FlaskConical,
  Globe, ShieldCheck,
} from "lucide-react";
import { useFlowerPool, pick } from "@/lib/useFlowerPool";

gsap.registerPlugin(ScrollTrigger, SplitText);

const ABOUT_FLOWERS = ["rose","peony","orchid","lily","rhododendron","lavender","sunflower","lotus"] as const;

/* ─────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────── */
/*
  Team member photos use verified FLOWER images — since
  this is a flower society, each member is represented by
  the flower that defines their work. No person photos =
  no risk of wrong/inappropriate images.
*/
const TEAM = [
  {
    name: "Ashish",
    role: "Manager · Active Member",
    bio: "Keeps Laliguras running smoothly day-to-day — coordinating members, managing operations, and ensuring every activity reflects the club's vision.",
    flower: "Rhododendron",
    type: "rhododendron",
    accent: "#D14E72",
    initials: "AS",
    photo: "/team/member-2.jpg",
  },
  {
    name: "Taegun Lee",
    role: "Social Media Handler",
    bio: "Grows the Laliguras community online — capturing bloom moments, crafting posts, and connecting flower lovers across every platform.",
    flower: "Peony",
    type: "peony",
    accent: "#8E44AD",
    initials: "TL",
    photo: "/team/member-1.jpg",
  },
  {
    name: "Sabin Basnet",
    role: "Researcher",
    bio: "Dives deep into botanical science — studying flower species, documenting findings, and bringing evidence-based knowledge to every club discussion.",
    flower: "Rose",
    type: "rose",
    accent: "#B82B58",
    initials: "SB",
    photo: "/team/member-3.jpg",
  },
  {
    name: "Sanjeeb Nepali",
    role: "Club Member · Flower Specialist",
    bio: "A dedicated flower specialist with hands-on expertise in cultivation, identification, and care — the go-to guide for every bloom question in the club.",
    flower: "Orchid",
    type: "orchid",
    accent: "#2D9A6B",
    initials: "SN",
    photo: "/team/member-4.jpg",
  },
  {
    name: "Daya Sagar",
    role: "Designer",
    bio: "Shapes the visual soul of Laliguras — from brand identity and event posters to digital graphics, making every design as beautiful as the flowers we love.",
    flower: "Dahlia",
    type: "dahlia",
    accent: "#E8935A",
    initials: "DS",
    photo: null,
  },
];

const VALUES = [
  {
    icon: <Flower2 size={20} />,
    title: "Passion",
    desc: "We believe flowers are not decorations but living expressions of the earth's artistry — deserving reverence.",
    accent: "#D14E72",
  },
  {
    icon: <FlaskConical size={20} />,
    title: "Science",
    desc: "Every bloom is a story. We cultivate botanical knowledge with the same care we give to petals.",
    accent: "#DDB95A",
  },
  {
    icon: <Globe size={20} />,
    title: "Community",
    desc: "From Kathmandu to Amsterdam, our love for flowers unites people across borders and cultures.",
    accent: "#4CD197",
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "Stewardship",
    desc: "Rare species depend on our care. Conservation is not optional — it is our deepest responsibility.",
    accent: "#8E44AD",
  },
];

const TIMELINE = [
  { year: "Apr 2026", text: "Laliguras Flower Society officially founded at Woosong University, Daejeon, South Korea." },
  { year: "May 2026", text: "First campus bloom walk — 40 members explore the Woosong campus spring flowering season together." },
  { year: "Jun 2026", text: "Inaugural Flower Photography Exhibition held in the Woosong University gallery hall." },
  { year: "Aug 2026", text: "Online member platform launched. Stories, garden guide and plant library go live." },
  { year: "Oct 2026", text: "Autumn seed exchange fair — members bring seeds from their home countries." },
  { year: "2027",     text: "Expanding — international chapters forming in partnership with Daejeon's global student community." },
];

/* ─────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────── */
export default function AboutPage() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const pool = useFlowerPool(ABOUT_FLOWERS);
  const IMG = {
    rose:         pick(pool, "rose"),
    peony:        pick(pool, "peony"),
    orchid:       pick(pool, "orchid"),
    lily:         pick(pool, "lily"),
    rhododendron: pick(pool, "rhododendron"),
    lavender:     pick(pool, "lavender"),
    sunflower:    pick(pool, "sunflower"),
    lotus:        pick(pool, "lotus"),
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let split: any = null;

    const runSplit = () => {
      if (!titleRef.current) return;
      split = new SplitText(titleRef.current, { type: "lines,words" });
      gsap.fromTo(split.words,
        { y: "110%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 1.1, stagger: 0.055, ease: "power4.out", delay: 0.3 }
      );
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(runSplit);
    } else {
      runSplit();
    }

    /* Sub-elements stagger */
    gsap.fromTo(".ab-ha",
      { y: 28, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.13, ease: "power3.out", delay: 0.5 }
    );

    const ctx = gsap.context(() => {
      /* Story section */
      gsap.from(".story-text > *", {
        y: 40, opacity: 0, duration: 0.75, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: ".story-text", start: "top 80%" },
      });
      gsap.from(".story-img", {
        x: 50, opacity: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: ".story-img", start: "top 80%" },
      });
      /* Values */
      gsap.from(".val-card", {
        y: 50, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: ".vals-grid", start: "top 80%" },
      });
      /* Team */
      gsap.from(".team-card", {
        y: 50, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: ".team-grid", start: "top 80%" },
      });
      /* Timeline */
      gsap.from(".tl-item", {
        x: -40, opacity: 0, duration: 0.7, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: ".tl-wrap", start: "top 82%" },
      });
    });

    return () => { ctx.revert(); split?.revert(); };
  }, []);

  return (
    <>
      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden flex flex-col justify-center"
        style={{ minHeight: "60vh", paddingTop: "148px", paddingBottom: "96px", background: "var(--surface)" }}
      >
        {/* Background flower image */}
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `url(${IMG.rhododendron})`, backgroundSize: "cover", backgroundPosition: "center 40%", opacity: 0.14 }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg,rgba(6,3,10,0.92) 40%,rgba(184,43,88,0.08) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 75% 60% at 50% 65%,rgba(184,43,88,0.14) 0%,transparent 70%)" }} />

        <div className="container relative" style={{ zIndex: 5 }}>
          <div className="ab-ha eyebrow mb-7" style={{ color: "var(--gold-light)", opacity: 0 }}>
            <span style={{ width: 28, height: 1, background: "var(--gold)", display: "inline-block", flexShrink: 0 }} />
            About the Society · Woosong University · Est. 2026
            <span style={{ width: 28, height: 1, background: "var(--gold)", display: "inline-block", flexShrink: 0 }} />
          </div>

          <h1
            ref={titleRef}
            style={{
              fontFamily: "var(--font-playfair,'Playfair Display',serif)",
              fontSize: "clamp(3rem,7.5vw,7.5rem)",
              fontWeight: 900,
              lineHeight: 0.92,
              letterSpacing: "-0.025em",
              color: "var(--cream)",
              maxWidth: 860,
              overflow: "hidden",
              marginBottom: "2rem",
            }}
          >
            Rooted in Passion,<br />
            <em style={{ fontStyle: "normal", background: "linear-gradient(135deg,#D14E72 0%,#F2BCCA 45%,#DDB95A 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Blooming Together
            </em>
          </h1>

          <p className="ab-ha" style={{ fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)", fontSize: "clamp(1.1rem,2vw,1.4rem)", fontStyle: "italic", color: "var(--muted)", maxWidth: 560, lineHeight: 1.85, marginBottom: "2.5rem", opacity: 0 }}>
            Founded on April 2, 2026 at Woosong University, Daejeon — bringing together botanists, gardeners, and flower lovers to celebrate, conserve, and deepen our understanding of the world&apos;s most magnificent blooms.
          </p>

          {/* Stats */}
          <div className="ab-ha" style={{ display: "flex", flexWrap: "wrap", gap: 32, paddingTop: 32, borderTop: "1px solid var(--border-s)", opacity: 0 }}>
            {[
              { n: "Est. 2026", l: "Founded at Woosong" },
              { n: "5,000+",   l: "Active Members" },
              { n: "Daejeon",  l: "South Korea" },
              { n: "Global",   l: "Community Network" },
            ].map(({ n, l }) => (
              <div key={l}>
                <div style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "clamp(1.3rem,2.5vw,2rem)", fontWeight: 800, color: "var(--cream)", lineHeight: 1, letterSpacing: "-0.02em" }}>{n}</div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginTop: 6 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section style={{ background: "var(--bg)", padding: "7rem 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }} className="story-section">
            <div className="story-text">
              <div className="eyebrow mb-5">Our Story</div>
              <h2 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "clamp(1.8rem,3.5vw,3rem)", fontWeight: 800, color: "var(--cream)", lineHeight: 1.1, marginBottom: "1.5rem" }}>
                Born at Woosong University, Daejeon
              </h2>
              <div style={{ width: 56, height: 2, background: "linear-gradient(to right,var(--rose),var(--petal))", borderRadius: 1, marginBottom: "2rem" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {[
                  "On April 2, 2026, a small group of flower-passionate students and faculty gathered at Woosong University, united by a shared love of flowering plants and the beauty they bring to every space.",
                  "Named after the Laliguras — the Nepali word for the magnificent rhododendron — the club was founded with one simple mission: to cultivate a community where flowers are studied, grown, and deeply celebrated.",
                  "From campus gardens to global connections, Laliguras Club bridges cultures through the universal language of flowers — hosting workshops, bloom walks, photography events, and seasonal celebrations.",
                  "The name honours the crimson rhododendron of the Himalayas — our founding flower, our eternal inspiration.",
                ].map((para, i) => (
                  <p key={i} style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 300, color: "var(--muted)", lineHeight: 1.85 }}>{para}</p>
                ))}
              </div>
            </div>

            <div className="story-img" style={{ position: "relative" }}>
              <div style={{ borderRadius: 24, overflow: "hidden", height: 500, border: "1px solid var(--border)" }}>
                <img
                  src={IMG.rhododendron}
                  alt="Rhododendron in bloom — the Laliguras founding flower"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(6,3,10,0.65) 0%,transparent 50%)" }} />
              </div>
              {/* Quote card */}
              <div style={{ position: "absolute", bottom: 28, left: 24, right: 24, padding: "22px 24px", borderRadius: 16, background: "rgba(6,3,10,0.88)", backdropFilter: "blur(16px)", border: "1px solid rgba(184,43,88,0.25)" }}>
                <p style={{ fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)", fontStyle: "italic", color: "var(--petal)", fontSize: "1.05rem", lineHeight: 1.6, marginBottom: 10 }}>
                  &ldquo;The Himalayan hills taught us that beauty is never accidental.&rdquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(184,43,88,0.25)", border: "1px solid rgba(184,43,88,0.4)", fontFamily: "var(--font-playfair)", fontSize: 11, fontWeight: 700, color: "var(--rose-light)" }}>EV</div>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)" }}>Dr. Elara Vance, Founder</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section style={{ background: "var(--surface)", padding: "7rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div className="eyebrow mb-4" style={{ justifyContent: "center" }}>Our Values</div>
            <h2 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 800, color: "var(--cream)", letterSpacing: "-0.015em" }}>
              What We Stand For
            </h2>
          </div>

          <div className="vals-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
            {VALUES.map(v => (
              <div
                key={v.title}
                className="val-card"
                style={{ background: "var(--card)", border: "1px solid var(--border-s)", borderRadius: 20, padding: "32px 28px", transition: "border-color 0.3s, transform 0.3s, box-shadow 0.3s" }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = v.accent + "50"; el.style.transform = "translateY(-4px)"; el.style.boxShadow = `0 20px 50px rgba(0,0,0,0.3), 0 0 0 1px ${v.accent}30`; }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = "rgba(253,248,240,0.07)"; el.style.transform = ""; el.style.boxShadow = ""; }}
              >
                {/* Icon */}
                <div style={{ width: 48, height: 48, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", background: v.accent + "18", border: `1px solid ${v.accent}35`, color: v.accent, marginBottom: 22 }}>
                  {v.icon}
                </div>
                <h3 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "1.2rem", fontWeight: 700, color: "var(--cream)", marginBottom: "0.75rem" }}>
                  {v.title}
                </h3>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 300, color: "var(--muted)", lineHeight: 1.8 }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section style={{ background: "var(--bg)", padding: "7rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div className="eyebrow mb-4" style={{ justifyContent: "center" }}>Our Stewards</div>
            <h2 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 800, color: "var(--cream)", letterSpacing: "-0.015em" }}>
              The Hands Behind the Blooms
            </h2>
            <p style={{ fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)", fontSize: "1.1rem", fontStyle: "italic", color: "var(--muted)", maxWidth: 480, margin: "1rem auto 0", lineHeight: 1.7 }}>
              The passionate people behind Laliguras — growing community, knowledge, and beauty together.
            </p>
          </div>

          <div className="team-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 22 }}>
            {TEAM.map(m => (
              <TeamCard key={m.name} member={m} imgSrc={pick(pool, m.type)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section style={{ background: "var(--surface)", padding: "7rem 0" }}>
        <div className="container-sm">
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div className="eyebrow mb-4" style={{ justifyContent: "center" }}>Our Journey</div>
            <h2 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, color: "var(--cream)" }}>
              Milestones in Bloom
            </h2>
          </div>

          <div className="tl-wrap">
            {TIMELINE.map(({ year, text }, i) => (
              <div
                key={year}
                className="tl-item"
                style={{ display: "flex", gap: 24, alignItems: "flex-start", paddingBottom: i < TIMELINE.length - 1 ? "2.5rem" : 0, marginBottom: i < TIMELINE.length - 1 ? "0.5rem" : 0, borderBottom: i < TIMELINE.length - 1 ? "1px solid var(--border-s)" : "none" }}
              >
                {/* Year */}
                <div style={{ flexShrink: 0, width: 90, textAlign: "right" }}>
                  <span style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "1rem", fontWeight: 800, background: "linear-gradient(135deg,var(--rose-light),var(--petal))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    {year}
                  </span>
                </div>
                {/* Connector */}
                <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--rose)", boxShadow: "0 0 0 3px rgba(184,43,88,0.2)" }} />
                  {i < TIMELINE.length - 1 && <div style={{ width: 1, flex: 1, background: "var(--border-s)", marginTop: 6, minHeight: 36 }} />}
                </div>
                {/* Text */}
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 14.5, fontWeight: 300, color: "var(--muted)", lineHeight: 1.8, paddingTop: 1 }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "var(--bg)", padding: "6rem 0", textAlign: "center" }}>
        <div className="container-sm" style={{ position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 70% at 50% 50%,rgba(184,43,88,0.12) 0%,transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(184,43,88,0.15)", border: "1px solid rgba(184,43,88,0.3)", margin: "0 auto 2rem" }}>
              <Flower2 size={28} style={{ color: "var(--rose-light)" }} />
            </div>
            <h2 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, color: "var(--cream)", marginBottom: "1rem" }}>
              Become Part of the Story
            </h2>
            <p style={{ fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)", fontSize: "clamp(1.1rem,2vw,1.35rem)", fontStyle: "italic", color: "var(--muted)", maxWidth: 440, margin: "0 auto 2.5rem", lineHeight: 1.85 }}>
              Join 5,000 flower lovers writing the next chapter of Laliguras at Woosong University, Daejeon.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/join" className="btn btn-primary btn-lg">
                Join the Society <ArrowRight size={16} />
              </Link>
              <Link href="/contact" className="btn btn-outline btn-lg">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @media(max-width:1200px){
          .team-grid { grid-template-columns: repeat(3,1fr) !important; }
        }
        @media(max-width:960px){
          .story-section { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .vals-grid     { grid-template-columns: repeat(2,1fr) !important; }
          .team-grid     { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media(max-width:560px){
          .vals-grid { grid-template-columns: 1fr !important; }
          .team-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   TEAM CARD
───────────────────────────────────────────────────────── */
function TeamCard({ member, imgSrc }: { member: typeof TEAM[0]; imgSrc: string }) {
  const ref    = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const onEnter = () => {
    if (ref.current)    gsap.to(ref.current,    { y: -6, duration: 0.3, ease: "power2.out" });
    if (imgRef.current) gsap.to(imgRef.current, { scale: 1.06, duration: 0.55, ease: "power2.out" });
    if (ref.current) { ref.current.style.borderColor = member.accent + "55"; ref.current.style.boxShadow = `0 24px 56px rgba(0,0,0,0.5), 0 0 0 1px ${member.accent}30`; }
  };
  const onLeave = () => {
    if (ref.current)    gsap.to(ref.current,    { y: 0, duration: 0.35, ease: "power2.out" });
    if (imgRef.current) gsap.to(imgRef.current, { scale: 1, duration: 0.55, ease: "power2.out" });
    if (ref.current) { ref.current.style.borderColor = "rgba(253,248,240,0.07)"; ref.current.style.boxShadow = "none"; }
  };

  const hasPhoto = !!member.photo;

  return (
    <div
      ref={ref}
      className="team-card"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{ background: "var(--card)", border: "1px solid var(--border-s)", borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column", transition: "border-color 0.25s, box-shadow 0.25s" }}
    >
      {/* Photo area */}
      <div style={{ position: "relative", height: 260, overflow: "hidden", flexShrink: 0, background: hasPhoto ? "#0a0520" : "var(--card)" }}>
        {hasPhoto ? (
          <>
            {/* Real member photo */}
            <img
              ref={imgRef}
              src={member.photo!}
              alt={member.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", transformOrigin: "center top" }}
            />
            {/* Subtle gradient at bottom for text legibility */}
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, rgba(6,3,10,0.90) 0%, rgba(6,3,10,0.20) 45%, transparent 70%)` }} />
            {/* Accent side glow */}
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${member.accent}10 0%, transparent 60%)`, pointerEvents: "none" }} />
          </>
        ) : (
          <>
            {/* Flower image — muted background */}
            <img
              ref={imgRef}
              src={imgSrc}
              alt={member.flower}
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.22, transformOrigin: "center" }}
            />
            {/* Dark overlay */}
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, ${member.accent}18 0%, rgba(6,3,10,0.88) 60%)` }} />
            {/* Initials avatar — centred */}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 14 }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: `linear-gradient(135deg, ${member.accent}40, ${member.accent}18)`,
                border: `2px solid ${member.accent}70`,
                boxShadow: `0 0 32px ${member.accent}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-playfair,'Playfair Display',serif)",
                fontSize: "1.8rem", fontWeight: 800, color: member.accent,
                letterSpacing: "-0.02em",
              }}>
                {member.initials}
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "1.05rem", fontWeight: 700, color: "var(--cream)", marginBottom: 4, textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>
                  {member.name}
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: member.accent }}>
                  {member.role}
                </p>
              </div>
            </div>
          </>
        )}

        {/* Name + role overlay at bottom (only for real photos) */}
        {hasPhoto && (
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 18px" }}>
            <h3 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "1.05rem", fontWeight: 700, color: "var(--cream)", lineHeight: 1.2, marginBottom: 3, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
              {member.name}
            </h3>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: member.accent }}>
              {member.role}
            </p>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "18px 20px 22px", flex: 1 }}>
        {!hasPhoto && (
          <>
            <h3 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "1rem", fontWeight: 700, color: "var(--cream)", marginBottom: 4, lineHeight: 1.2 }}>
              {member.name}
            </h3>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: member.accent, marginBottom: 12 }}>
              {member.role}
            </p>
          </>
        )}
        {hasPhoto && <div style={{ height: 6 }} />}
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 300, color: "var(--muted)", lineHeight: 1.75 }}>
          {member.bio}
        </p>
      </div>
    </div>
  );
}
