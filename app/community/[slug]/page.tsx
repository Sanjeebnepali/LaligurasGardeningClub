"use client";
import { useEffect, useRef } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { MapPin, Users, Leaf, ArrowLeft, ArrowRight, Calendar, Mail } from "lucide-react";
import { useFlowerPool, pick } from "@/lib/useFlowerPool";

/* ── Full chapter data ── */
const CHAPTERS = [
  {
    slug: "the-old-lgc-orchard",
    name: "The Old LGC Orchard",
    tagline: "Where the Laliguras Club first put roots in Daejeon.",
    type: "Community Garden",
    region: "Daejeon, South Korea",
    city: "Dong-gu, Daejeon",
    members: 12,
    founded: "2019",
    meetingDay: "Every Saturday · 9:00 AM – 12:00 PM",
    email: "lgc.orchard@laliguras.club",
    about:
      "The Old LGC Orchard is our founding chapter — the garden that started it all. Nestled near Woosong University, it is a living archive of Himalayan and Korean flowering plants. Members cultivate everything from wild rhododendrons to heritage peonies, and the orchard hosts our annual Bloom Festival every spring.",
    highlights: [
      "Home to 80+ species of flowering plants",
      "Annual Bloom Festival (April)",
      "Open to public on Saturdays 9 AM – 12 PM",
      "Seed-swap library for members",
    ],
    flowerTypes: ["rose", "peony"],
  },
  {
    slug: "riverside-renovators",
    name: "Riverside Renovators",
    tagline: "Reclaiming Seoul's riverbanks one flower bed at a time.",
    type: "Community Garden",
    region: "Seoul, South Korea",
    city: "Mapo-gu, Seoul",
    members: 8,
    founded: "2021",
    meetingDay: "Every Sunday · 10:00 AM – 1:00 PM",
    email: "riverside@laliguras.club",
    about:
      "The Riverside Renovators chapter focuses on ecological restoration along the Han River banks. The group transforms neglected urban patches into wildflower corridors, creating pollinator pathways through the city. Their work has been recognised by the Seoul Metropolitan Government as a model urban greening initiative.",
    highlights: [
      "3 active wildflower corridors along Han River",
      "Partnership with Seoul Metropolitan Government",
      "Monthly riverside clean-up & planting days",
      "Specialises in native Korean wildflowers",
    ],
    flowerTypes: ["tulip", "dahlia"],
  },
  {
    slug: "highline-growing-hub",
    name: "Highline Growing Hub",
    tagline: "Busan's elevated urban farm redefining rooftop floriculture.",
    type: "Urban Farm",
    region: "Busan, South Korea",
    city: "Haeundae-gu, Busan",
    members: 24,
    founded: "2020",
    meetingDay: "Wed & Fri · 5:00 PM – 7:00 PM",
    email: "highline@laliguras.club",
    about:
      "The Highline Growing Hub is our largest and most active chapter. Based in Haeundae, it operates a rooftop urban farm spanning 1,200 m² across three buildings. The Hub is pioneering vertical flower cultivation techniques and runs a popular weekend market selling fresh-cut blooms and seedlings to the local community.",
    highlights: [
      "1,200 m² of rooftop growing space",
      "Weekend bloom market (Saturdays)",
      "Vertical cultivation research programme",
      "Educational tours for schools and universities",
    ],
    flowerTypes: ["orchid", "lily"],
  },
  {
    slug: "inland-botanical-walk",
    name: "Inland Botanical Walk",
    tagline: "Guided floral journeys through Incheon's hidden green corridors.",
    type: "Walking Group",
    region: "Incheon, South Korea",
    city: "Namdong-gu, Incheon",
    members: 15,
    founded: "2022",
    meetingDay: "First & Third Sunday · 8:00 AM – 11:00 AM",
    email: "botanicalwalk@laliguras.club",
    about:
      "The Inland Botanical Walk is a guided nature-walk chapter that explores Incheon's parks, wetlands, and urban green corridors. Each walk is led by a certified botanist and focuses on identifying and documenting wildflowers, invasive species, and seasonal blooms. The group publishes a quarterly field guide distributed to all Laliguras members.",
    highlights: [
      "Guided walks led by certified botanists",
      "Quarterly field guide publication",
      "Species documentation database (500+ entries)",
      "Accessible walks designed for all fitness levels",
    ],
    flowerTypes: ["iris", "peony"],
  },
];

/* ── Scoped tokens ── */
const pageVars = {
  "--surface":   "#160C28",
  "--card":      "#1E1134",
  "--muted":     "rgba(253,248,240,0.72)",
  "--dim":       "rgba(253,248,240,0.40)",
  "--border-s":  "rgba(253,248,240,0.13)",
  "--rose-glow": "rgba(184,43,88,0.22)",
} as React.CSSProperties;

export default function ChapterPage({ params }: { params: { slug: string } }) {
  const chapter = CHAPTERS.find((c) => c.slug === params.slug);
  const pageRef = useRef<HTMLDivElement>(null);
  const pool    = useFlowerPool(chapter?.flowerTypes ?? ["rose", "peony"]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".chapter-hero > *",
        { y: 48, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.13, ease: "power3.out", delay: 0.15 }
      );
    }, pageRef);
    return () => ctx.revert();
  }, []);

  if (!chapter) return notFound();

  return (
    <div ref={pageRef} style={pageVars}>

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden flex items-end"
        style={{ minHeight: "60vh", paddingTop: "68px", paddingBottom: "88px", background: "#0C0618" }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${pick(pool, chapter.flowerTypes[0])})`,
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
            opacity: 0.52,
          }}
        />
        <div className="absolute inset-0" style={{ background: "rgba(6,3,10,0.38)" }} />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 55% at 50% 70%, rgba(184,43,88,0.16) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, #160C28)" }}
        />

        <div className="container relative" style={{ zIndex: 2 }}>
          <div className="chapter-hero">
            {/* Back link */}
            <Link
              href="/community"
              className="btn btn-ghost"
              style={{ marginBottom: "28px", display: "inline-flex", fontSize: "11px", letterSpacing: "0.1em" }}
            >
              <ArrowLeft size={14} /> Back to Community
            </Link>

            {/* Type badge */}
            <div style={{ marginBottom: "16px" }}>
              <span className="badge" style={{ fontSize: "10px", letterSpacing: "0.16em" }}>
                {chapter.type}
              </span>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                fontSize: "clamp(3rem, 8vw, 7rem)",
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: "-0.03em",
                color: "var(--cream)",
                maxWidth: "800px",
                marginBottom: "1.5rem",
              }}
            >
              {chapter.name}
            </h1>

            <p
              style={{
                fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                fontSize: "clamp(1.2rem, 2vw, 1.55rem)",
                fontStyle: "italic",
                color: "var(--muted)",
                maxWidth: "520px",
                lineHeight: 1.85,
              }}
            >
              {chapter.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* ── QUICK INFO BAR ── */}
      <section
        style={{
          background: "var(--surface)",
          borderTop: "1px solid rgba(253,248,240,0.06)",
          borderBottom: "1px solid rgba(253,248,240,0.06)",
          padding: "32px 0",
        }}
      >
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { Icon: MapPin,    label: "Location",    value: chapter.city          },
              { Icon: Users,     label: "Members",     value: `${chapter.members} active` },
              { Icon: Calendar,  label: "Meets",       value: chapter.meetingDay    },
              { Icon: Leaf,      label: "Founded",     value: chapter.founded       },
            ].map(({ Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div
                  style={{
                    width: "38px", height: "38px", borderRadius: "10px", flexShrink: 0,
                    background: "var(--rose-glow)", border: "1px solid var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Icon size={16} style={{ color: "var(--rose-light)" }} />
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--dim)", marginBottom: "3px" }}>
                    {label}
                  </p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--cream)", lineHeight: 1.4 }}>
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT + HIGHLIGHTS ── */}
      <section
        className="section-pad-lg"
        style={{ background: "#0C0618", borderTop: "1px solid rgba(253,248,240,0.06)" }}
      >
        <div className="container">
          <div className="grid lg:grid-cols-5 gap-12 xl:gap-16 items-start">

            {/* About */}
            <div className="lg:col-span-3">
              <div className="eyebrow mb-5" style={{ fontSize: "10px", letterSpacing: "0.2em" }}>
                About This Chapter
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 800,
                  color: "var(--cream)",
                  marginBottom: "1.25rem",
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                }}
              >
                Our Story
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "16px",
                  color: "var(--muted)",
                  lineHeight: 1.9,
                  marginBottom: "2.5rem",
                  maxWidth: "580px",
                }}
              >
                {chapter.about}
              </p>

              {/* Contact strip */}
              <div
                className="flex items-center gap-4 rounded-2xl"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border-s)",
                  padding: "20px 24px",
                  maxWidth: "460px",
                }}
              >
                <div
                  style={{
                    width: "40px", height: "40px", borderRadius: "10px", flexShrink: 0,
                    background: "var(--rose-glow)", border: "1px solid var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Mail size={17} style={{ color: "var(--rose-light)" }} />
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--dim)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "3px" }}>
                    Contact chapter
                  </p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--petal)" }}>
                    {chapter.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div className="lg:col-span-2">
              <div
                className="rounded-2xl"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border-s)",
                  padding: "36px 32px",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    color: "var(--cream)",
                    marginBottom: "20px",
                  }}
                >
                  Chapter Highlights
                </h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "14px" }}>
                  {chapter.highlights.map((h) => (
                    <li
                      key={h}
                      style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}
                    >
                      <span
                        style={{
                          width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
                          background: "var(--rose-glow)", border: "1px solid var(--border)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          marginTop: "1px",
                        }}
                      >
                        <Leaf size={11} style={{ color: "var(--rose-light)" }} />
                      </span>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--muted)", lineHeight: 1.7 }}>
                        {h}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── PHOTO ── */}
      <section
        style={{
          background: "var(--surface)",
          borderTop: "1px solid rgba(253,248,240,0.06)",
          padding: "0",
          height: "340px",
          overflow: "hidden",
        }}
      >
        <img
          src={pick(pool, chapter.flowerTypes[1] ?? chapter.flowerTypes[0])}
          alt={chapter.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.65 }}
        />
      </section>

      {/* ── CTA ── */}
      <section
        className="section-pad-lg"
        style={{ background: "var(--surface)", borderTop: "1px solid rgba(253,248,240,0.06)" }}
      >
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="eyebrow mb-5" style={{ fontSize: "10px", letterSpacing: "0.2em" }}>
                Get Involved
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                  fontSize: "clamp(2rem, 4vw, 3.2rem)",
                  fontWeight: 800,
                  color: "var(--cream)",
                  marginBottom: "1rem",
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                }}
              >
                Ready to join
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, var(--rose-light), var(--petal))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {chapter.name}?
                </span>
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                  fontSize: "clamp(1.1rem, 1.8vw, 1.3rem)",
                  fontStyle: "italic",
                  color: "var(--muted)",
                  lineHeight: 1.85,
                  marginBottom: "2rem",
                  maxWidth: "420px",
                }}
              >
                Membership opens doors to our full network — events, workshops, seed swaps, and a community that grows together.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/join" className="btn btn-primary btn-lg">
                  Become a Member <ArrowRight size={16} />
                </Link>
                <Link href="/contact" className="btn btn-outline btn-lg">
                  Contact Us
                </Link>
              </div>
            </div>

            <div
              className="rounded-2xl overflow-hidden"
              style={{ height: "340px", border: "1px solid var(--border-s)" }}
            >
              <img
                src={pick(pool, chapter.flowerTypes[0])}
                alt="Join us"
                style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.78 }}
              />
            </div>
          </div>

          {/* Back link */}
          <div style={{ marginTop: "56px", paddingTop: "32px", borderTop: "1px solid var(--border-s)" }}>
            <Link
              href="/community"
              className="btn btn-ghost"
              style={{ fontSize: "11px", letterSpacing: "0.1em" }}
            >
              <ArrowLeft size={14} /> Back to All Chapters
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
