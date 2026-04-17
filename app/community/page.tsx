"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, ArrowRight, Globe, Heart, Sprout, X, Users } from "lucide-react";
import { useFlowerPool, pick } from "@/lib/useFlowerPool";

gsap.registerPlugin(ScrollTrigger);

/* ── DATA ── */
const NETWORK_NODES = [
  { slug: "the-old-lgc-orchard",   name: "The Old LGC Orchard",   members: 12, region: "Daejeon, South Korea",  type: "Community Garden" },
  { slug: "riverside-renovators",  name: "Riverside Renovators",  members: 8,  region: "Seoul, South Korea",    type: "Community Garden" },
  { slug: "highline-growing-hub",  name: "Highline Growing Hub",  members: 24, region: "Busan, South Korea",    type: "Urban Farm"       },
  { slug: "inland-botanical-walk", name: "Inland Botanical Walk", members: 15, region: "Incheon, South Korea",  type: "Walking Group"    },
];

const COUNTRIES: { name: string; flag: string; members: number; chapter: string; city: string }[] = [
  { name: "South Korea",   flag: "🇰🇷", members: 340, chapter: "Seoul Botanical Circle",       city: "Seoul"        },
  { name: "Japan",         flag: "🇯🇵", members: 210, chapter: "Kyoto Bloom Society",           city: "Kyoto"        },
  { name: "Nepal",         flag: "🇳🇵", members: 185, chapter: "Kathmandu Rhododendron Guild",  city: "Kathmandu"    },
  { name: "India",         flag: "🇮🇳", members: 260, chapter: "Darjeeling Floral League",      city: "Darjeeling"   },
  { name: "China",         flag: "🇨🇳", members: 195, chapter: "Chengdu Peony Society",         city: "Chengdu"      },
  { name: "United Kingdom",flag: "🇬🇧", members: 178, chapter: "Royal Petal Growers Guild",     city: "London"       },
  { name: "Netherlands",   flag: "🇳🇱", members: 220, chapter: "Amsterdam Tulip Network",       city: "Amsterdam"    },
  { name: "Germany",       flag: "🇩🇪", members: 145, chapter: "Berlin Garden Collective",      city: "Berlin"       },
  { name: "France",        flag: "🇫🇷", members: 160, chapter: "Provence Rose Atelier",         city: "Provence"     },
  { name: "Italy",         flag: "🇮🇹", members: 130, chapter: "Firenze Botanical Society",     city: "Florence"     },
  { name: "Spain",         flag: "🇪🇸", members: 115, chapter: "Barcelona Floral Arts Club",    city: "Barcelona"    },
  { name: "Switzerland",   flag: "🇨🇭", members: 98,  chapter: "Geneva Alpine Flora Circle",    city: "Geneva"       },
  { name: "Sweden",        flag: "🇸🇪", members: 87,  chapter: "Stockholm Wildflower Co-op",    city: "Stockholm"    },
  { name: "Norway",        flag: "🇳🇴", members: 74,  chapter: "Oslo Meadow Growers",           city: "Oslo"         },
  { name: "Denmark",       flag: "🇩🇰", members: 82,  chapter: "Copenhagen Flower Guild",       city: "Copenhagen"   },
  { name: "Finland",       flag: "🇫🇮", members: 65,  chapter: "Helsinki Botanical Network",    city: "Helsinki"     },
  { name: "Belgium",       flag: "🇧🇪", members: 90,  chapter: "Brussels Bloom Collective",     city: "Brussels"     },
  { name: "Portugal",      flag: "🇵🇹", members: 78,  chapter: "Lisbon Floral Heritage Club",   city: "Lisbon"       },
  { name: "Austria",       flag: "🇦🇹", members: 92,  chapter: "Vienna Garden Arts Society",    city: "Vienna"       },
  { name: "Australia",     flag: "🇦🇺", members: 155, chapter: "Melbourne Bloom Collective",    city: "Melbourne"    },
  { name: "New Zealand",   flag: "🇳🇿", members: 88,  chapter: "Christchurch Floral Society",   city: "Christchurch" },
  { name: "Canada",        flag: "🇨🇦", members: 168, chapter: "Vancouver Botanical League",    city: "Vancouver"    },
  { name: "United States", flag: "🇺🇸", members: 295, chapter: "Portland Rose Society",         city: "Portland"     },
  { name: "Brazil",        flag: "🇧🇷", members: 122, chapter: "São Paulo Orchid Circle",       city: "São Paulo"    },
  { name: "Argentina",     flag: "🇦🇷", members: 95,  chapter: "Buenos Aires Flora Guild",      city: "Buenos Aires" },
  { name: "South Africa",  flag: "🇿🇦", members: 108, chapter: "Cape Town Protea Society",      city: "Cape Town"    },
  { name: "Kenya",         flag: "🇰🇪", members: 76,  chapter: "Nairobi Flower Growers Union",  city: "Nairobi"      },
  { name: "Morocco",       flag: "🇲🇦", members: 64,  chapter: "Marrakech Garden Society",      city: "Marrakech"    },
  { name: "Egypt",         flag: "🇪🇬", members: 58,  chapter: "Cairo Lotus Circle",            city: "Cairo"        },
  { name: "Turkey",        flag: "🇹🇷", members: 112, chapter: "Istanbul Tulip Guild",           city: "Istanbul"     },
  { name: "Thailand",      flag: "🇹🇭", members: 134, chapter: "Chiang Mai Orchid Society",     city: "Chiang Mai"   },
  { name: "Singapore",     flag: "🇸🇬", members: 143, chapter: "Singapore Botanical Club",      city: "Singapore"    },
  { name: "Malaysia",      flag: "🇲🇾", members: 99,  chapter: "Kuala Lumpur Flora Society",    city: "Kuala Lumpur" },
  { name: "Indonesia",     flag: "🇮🇩", members: 117, chapter: "Bali Floral Arts Collective",   city: "Bali"         },
  { name: "Philippines",   flag: "🇵🇭", members: 88,  chapter: "Manila Bloom Society",          city: "Manila"       },
  { name: "Vietnam",       flag: "🇻🇳", members: 102, chapter: "Hanoi Lotus Growers Club",      city: "Hanoi"        },
  { name: "Taiwan",        flag: "🇹🇼", members: 118, chapter: "Taipei Orchid Society",         city: "Taipei"       },
  { name: "Iran",          flag: "🇮🇷", members: 72,  chapter: "Tehran Rose Garden Society",    city: "Tehran"       },
  { name: "Pakistan",      flag: "🇵🇰", members: 61,  chapter: "Lahore Botanical Society",      city: "Lahore"       },
  { name: "Bangladesh",    flag: "🇧🇩", members: 54,  chapter: "Dhaka Flower Growers Guild",    city: "Dhaka"        },
];

const WHY_WE_DIG = [
  {
    Icon: Globe,
    title: "Growing Biodiversity",
    desc: "Every community garden we establish becomes a micro-habitat for native pollinators, birds, and soil organisms — restoring what urban development takes away.",
  },
  {
    Icon: Heart,
    title: "Wellbeing Through Flowers",
    desc: "Studies show tending to flowering plants reduces stress, sharpens focus, and fosters a sense of belonging. Our gardens are sanctuaries for the mind.",
  },
  {
    Icon: Sprout,
    title: "Botanical Education",
    desc: "We run free workshops at Woosong University and beyond, planting the seeds of a new generation of naturalists and floral cultivators.",
  },
];

const STATS = [
  { num: "5,000+", label: "Global Members"        },
  { num: "40+",    label: "Countries"              },
  { num: "120+",   label: "Community Gardens"      },
  { num: "250+",   label: "Volunteer Hours / Mo"   },
];

/* ── PAGE ── */
export default function CommunityPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const pool    = useFlowerPool(["lavender", "lotus", "peony", "rose"]);
  const [selectedCountry, setSelectedCountry] = useState<typeof COUNTRIES[0] | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Hero text */
      gsap.fromTo(
        ".comm-hero > *",
        { y: 56, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.14, ease: "power3.out", delay: 0.2 }
      );

      /* Stats */
      ScrollTrigger.batch(".stat-item", {
        onEnter: (els) =>
          gsap.fromTo(els,
            { y: 28, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power2.out" }
          ),
        start: "top 90%",
      });

      /* Network cards */
      ScrollTrigger.batch(".network-card", {
        onEnter: (els) =>
          gsap.fromTo(els,
            { y: 44, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out" }
          ),
        start: "top 88%",
      });

      /* WHY WE DIG — separate class, fromTo so it never stays invisible */
      ScrollTrigger.batch(".why-card", {
        onEnter: (els) =>
          gsap.fromTo(els,
            { y: 44, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.75, stagger: 0.12, ease: "power3.out" }
          ),
        start: "top 88%",
        once: true,
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
            backgroundImage: `url(${pick(pool, "lavender")})`,
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
            opacity: 0.55,
          }}
        />
        <div className="absolute inset-0" style={{ background: "rgba(6,3,10,0.36)" }} />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 75% 55% at 50% 70%, rgba(184,43,88,0.16) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-44 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, #160C28)" }}
        />

        <div className="container relative" style={{ zIndex: 2 }}>
          <div className="comm-hero">
            <div
              className="eyebrow eyebrow-gold mb-7"
              style={{ fontSize: "10px", letterSpacing: "0.2em" }}
            >
              Community Network
            </div>
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
              Cultivating Our
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, var(--rose-light), var(--petal), var(--gold-light))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Shared Soil
              </span>
            </h1>
            <p
              style={{
                fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                fontSize: "clamp(1.25rem, 2.2vw, 1.65rem)",
                fontStyle: "italic",
                color: "var(--muted)",
                maxWidth: "540px",
                lineHeight: 1.85,
                marginBottom: "2.5rem",
              }}
            >
              Beyond individual gardens, we are building a global network of growers
              committed to ecological stewardship and the timeless beauty of flowering plants.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/join" className="btn btn-primary btn-lg">
                Join the Network <ArrowRight size={16} />
              </Link>
              <Link href="/events" className="btn btn-outline btn-lg">
                See Upcoming Events
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ STATS ════════════════ */}
      <section
        className="section-pad"
        style={{ background: "var(--surface)", borderTop: "1px solid rgba(253,248,240,0.06)", borderBottom: "1px solid rgba(253,248,240,0.06)" }}
      >
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {STATS.map(({ num, label }) => (
              <div key={label} className="stat-item text-center">
                <div
                  style={{
                    fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                    fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
                    fontWeight: 800,
                    background: "linear-gradient(135deg, var(--rose-light), var(--petal))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    marginBottom: "6px",
                    lineHeight: 1,
                  }}
                >
                  {num}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "11px",
                    color: "var(--muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ GROWING NETWORK ════════════════ */}
      <section
        className="section-pad-lg"
        style={{ background: "#0C0618", borderTop: "1px solid rgba(253,248,240,0.06)" }}
      >
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-14 items-start">

            {/* Left */}
            <div>
              <div className="eyebrow mb-5" style={{ fontSize: "10px", letterSpacing: "0.2em" }}>
                Our Growing Network
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
                Community Gardens
                <br />&amp; Chapters
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                  fontSize: "clamp(1.1rem, 1.8vw, 1.3rem)",
                  fontStyle: "italic",
                  color: "var(--muted)",
                  maxWidth: "460px",
                  lineHeight: 1.85,
                  marginBottom: "2rem",
                }}
              >
                We have chapters and community gardens rooted in Korea and beyond. Each local
                group brings its own botanical traditions while staying connected to our shared
                Himalayan heritage.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "2rem" }}>
                {NETWORK_NODES.map((node) => (
                  <div
                    key={node.name}
                    className="network-card flex items-center gap-4 rounded-xl"
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--border-s)",
                      padding: "16px 20px",
                      transition: "border-color .3s, background .3s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                      (e.currentTarget as HTMLElement).style.background = "rgba(184,43,88,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--border-s)";
                      (e.currentTarget as HTMLElement).style.background = "var(--card)";
                    }}
                  >
                    <div
                      style={{
                        width: "42px", height: "42px", borderRadius: "50%",
                        background: "var(--rose-glow)", border: "1px solid var(--border)",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}
                    >
                      <MapPin size={16} style={{ color: "var(--rose-light)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 600, color: "var(--cream)" }}>
                        {node.name}
                      </p>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--muted)", marginTop: "2px" }}>
                        {node.type} · {node.members} active members · {node.region}
                      </p>
                    </div>
                    <Link
                      href={`/community/${node.slug}`}
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "var(--rose-light)",
                        flexShrink: 0,
                        letterSpacing: "0.06em",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        transition: "color .2s, gap .2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color = "var(--petal)";
                        (e.currentTarget as HTMLElement).style.gap = "8px";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color = "var(--rose-light)";
                        (e.currentTarget as HTMLElement).style.gap = "4px";
                      }}
                    >
                      View <ArrowRight size={13} />
                    </Link>
                  </div>
                ))}
              </div>

              <Link href="/contact" className="btn btn-primary btn-lg">
                Start a Chapter Near You <ArrowRight size={15} />
              </Link>
            </div>

            {/* Right: flower image with overlay */}
            <div
              className="rounded-2xl overflow-hidden relative"
              style={{ height: "500px", border: "1px solid var(--border-s)" }}
            >
              <img
                src={pick(pool, "lotus")}
                alt="Community garden"
                className="w-full h-full object-cover"
                style={{ opacity: 0.65 }}
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to bottom, rgba(6,3,10,0.1), rgba(6,3,10,0.65))" }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center" style={{ padding: "2rem" }}>
                <Globe size={56} style={{ color: "var(--petal)", opacity: 0.8, marginBottom: "1rem" }} />
                <p
                  style={{
                    fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                    fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                    fontWeight: 700,
                    color: "var(--cream)",
                    marginBottom: "6px",
                  }}
                >
                  40+ Countries
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                    fontSize: "1.2rem",
                    fontStyle: "italic",
                    color: "var(--muted)",
                  }}
                >
                  Growing Together
                </p>
              </div>
              {[
                { top: "22%", left: "18%" }, { top: "38%", left: "55%" },
                { top: "28%", left: "74%" }, { top: "60%", left: "80%" },
                { top: "55%", left: "32%" }, { top: "70%", left: "55%" },
              ].map((pos, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 rounded-full animate-pulse"
                  style={{ ...pos, background: "var(--rose-light)", boxShadow: "0 0 14px var(--rose)" }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ 40 COUNTRIES ════════════════ */}
      <section
        className="section-pad-lg"
        style={{ background: "var(--surface)", borderTop: "1px solid rgba(253,248,240,0.06)" }}
      >
        <div className="container">
          {/* Header */}
          <div className="text-center mb-14">
            <div
              className="eyebrow eyebrow-gold mb-5"
              style={{ justifyContent: "center", fontSize: "10px", letterSpacing: "0.2em" }}
            >
              Global Presence
            </div>
            <h2
              style={{
                fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                fontSize: "clamp(2.4rem, 5vw, 4rem)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: "var(--cream)",
                marginBottom: "1rem",
              }}
            >
              Our 40 Countries
            </h2>
            <p
              style={{
                fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
                fontStyle: "italic",
                color: "var(--muted)",
                maxWidth: "480px",
                margin: "0 auto",
                lineHeight: 1.8,
              }}
            >
              Click any country to explore its local chapter and community details.
            </p>
          </div>

          {/* Country grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
              gap: "10px",
              marginBottom: "32px",
            }}
          >
            {COUNTRIES.map((c) => {
              const isActive = selectedCountry?.name === c.name;
              return (
                <button
                  key={c.name}
                  onClick={() => setSelectedCountry(isActive ? null : c)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "13px 16px",
                    borderRadius: "12px",
                    background: isActive ? "var(--rose-glow)" : "rgba(30,17,52,0.6)",
                    border: `1px solid ${isActive ? "var(--border)" : "var(--border-s)"}`,
                    color: isActive ? "var(--petal)" : "var(--cream)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "13px",
                    fontWeight: isActive ? 600 : 400,
                    textAlign: "left",
                    transition: "all .22s ease",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                      (e.currentTarget as HTMLElement).style.background = "rgba(184,43,88,0.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--border-s)";
                      (e.currentTarget as HTMLElement).style.background = "rgba(30,17,52,0.6)";
                    }
                  }}
                >
                  <span style={{ fontSize: "20px", lineHeight: 1, flexShrink: 0 }}>{c.flag}</span>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</span>
                </button>
              );
            })}
          </div>

          {/* Country detail panel */}
          {selectedCountry && (
            <div
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "20px",
                padding: "36px 40px",
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                gap: "24px",
                alignItems: "center",
              }}
            >
              {/* Flag + name */}
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "3.5rem", lineHeight: 1, marginBottom: "8px" }}>
                  {selectedCountry.flag}
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "12px",
                    color: "var(--muted)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {selectedCountry.name}
                </p>
              </div>

              {/* Details */}
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                    fontSize: "1.55rem",
                    fontWeight: 700,
                    color: "var(--cream)",
                    marginBottom: "6px",
                    lineHeight: 1.2,
                  }}
                >
                  {selectedCountry.chapter}
                </p>
                <div className="flex flex-wrap gap-4" style={{ marginTop: "10px" }}>
                  <span
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "6px",
                      fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--muted)",
                    }}
                  >
                    <MapPin size={13} style={{ color: "var(--rose-light)" }} />
                    {selectedCountry.city}
                  </span>
                  <span
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "6px",
                      fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--muted)",
                    }}
                  >
                    <Users size={13} style={{ color: "var(--rose-light)" }} />
                    {selectedCountry.members} active members
                  </span>
                </div>
              </div>

              {/* Close + CTA */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px" }}>
                <button
                  onClick={() => setSelectedCountry(null)}
                  style={{
                    width: "32px", height: "32px", borderRadius: "50%",
                    background: "rgba(253,248,240,0.06)",
                    border: "1px solid var(--border-s)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--muted)",
                  }}
                >
                  <X size={14} />
                </button>
                <Link href="/contact" className="btn btn-primary" style={{ fontSize: "11px", whiteSpace: "nowrap" }}>
                  Contact Chapter
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════ WHY WE DIG ════════════════ */}
      <section
        className="section-pad-lg"
        style={{ background: "#0C0618", borderTop: "1px solid rgba(253,248,240,0.06)" }}
      >
        <div className="container">
          {/* Header */}
          <div className="text-center mb-16">
            <div
              className="eyebrow mb-5"
              style={{ justifyContent: "center", fontSize: "10px", letterSpacing: "0.2em" }}
            >
              Our Mission
            </div>
            <h2
              style={{
                fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                fontSize: "clamp(2.4rem, 5vw, 4rem)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: "var(--cream)",
                marginBottom: "1.1rem",
              }}
            >
              Why We Dig
            </h2>
            <div className="hr-rose" style={{ margin: "0 auto 1.5rem" }} />
            <p
              style={{
                fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
                fontStyle: "italic",
                color: "var(--muted)",
                maxWidth: "460px",
                margin: "0 auto",
                lineHeight: 1.85,
              }}
            >
              Every petal planted is a small act of defiance against a world that forgets its roots.
            </p>
          </div>

          {/* Cards — use "why-card" so GSAP batch is isolated */}
          <div className="grid md:grid-cols-3 gap-6">
            {WHY_WE_DIG.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="why-card rounded-2xl text-center"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border-s)",
                  padding: "44px 36px",
                  transition: "border-color .3s, box-shadow .3s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 40px rgba(184,43,88,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border-s)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: "64px", height: "64px", borderRadius: "18px",
                    background: "var(--rose-glow)", border: "1px solid var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 24px",
                  }}
                >
                  <Icon size={26} style={{ color: "var(--rose-light)" }} />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                    fontSize: "1.45rem",
                    fontWeight: 700,
                    color: "var(--cream)",
                    marginBottom: "14px",
                    lineHeight: 1.2,
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "15px",
                    color: "var(--muted)",
                    lineHeight: 1.85,
                  }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ CTA ════════════════ */}
      <section
        className="section-pad-lg"
        style={{ background: "var(--surface)", borderTop: "1px solid rgba(253,248,240,0.06)" }}
      >
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="eyebrow mb-5" style={{ fontSize: "10px", letterSpacing: "0.2em" }}>
                Stay Rooted
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                  fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)",
                  fontWeight: 800,
                  color: "var(--cream)",
                  marginBottom: "1rem",
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                }}
              >
                Stay Rooted in
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, var(--rose-light), var(--petal))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Our Progress
                </span>
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
                  fontSize: "clamp(1.1rem, 1.8vw, 1.35rem)",
                  fontStyle: "italic",
                  color: "var(--muted)",
                  maxWidth: "420px",
                  lineHeight: 1.85,
                  marginBottom: "2.25rem",
                }}
              >
                Follow our community initiatives, new garden openings, and local
                chapter news in your region.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/join" className="btn btn-primary btn-lg">
                  Join the Community <ArrowRight size={16} />
                </Link>
                <Link href="/newsletter" className="btn btn-outline btn-lg">
                  Get the Newsletter
                </Link>
              </div>
            </div>

            <div
              className="rounded-2xl overflow-hidden"
              style={{ height: "380px", border: "1px solid var(--border-s)" }}
            >
              <img
                src={pick(pool, "peony")}
                alt="Peony flowers in bloom"
                className="w-full h-full object-cover"
                style={{ opacity: 0.80 }}
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
