"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Leaf, Sun, Cloud, Snowflake, Sparkles } from "lucide-react";
import { useFlowerPool, pick, type FlowerPool } from "@/lib/useFlowerPool";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────
   FLOWER TYPES — used for useFlowerPool hook
───────────────────────────────────────────────────────── */
const GALLERY_FLOWER_TYPES = [
  "rose","peony","tulip","orchid","dahlia","lily",
  "rhododendron","lavender","sunflower","lotus",
] as const;

/* ─────────────────────────────────────────────────────────
   SEASON DEFINITIONS
───────────────────────────────────────────────────────── */
type Season = "Spring" | "Summer" | "Autumn" | "Winter";


const SEASON_META: Record<Season, { icon: React.ReactNode; color: string; bg: string; desc: string }> = {
  Spring: {
    icon:  <Leaf size={16} />,
    color: "#4CD197",
    bg:    "rgba(76,209,151,0.12)",
    desc:  "The garden awakens — peonies, tulips and roses fill the air with fragrance.",
  },
  Summer: {
    icon:  <Sun size={16} />,
    color: "#DDB95A",
    bg:    "rgba(221,185,90,0.12)",
    desc:  "Long days of bloom — dahlias, lilies and lotus reach their peak.",
  },
  Autumn: {
    icon:  <Cloud size={16} />,
    color: "#D14E72",
    bg:    "rgba(209,78,114,0.12)",
    desc:  "Rich tones before rest — dahlias linger and orchids begin their winter show.",
  },
  Winter: {
    icon:  <Snowflake size={16} />,
    color: "#8E44AD",
    bg:    "rgba(142,68,173,0.12)",
    desc:  "A season of quiet beauty — orchids and forced bulbs keep the garden alive.",
  },
};

function getSeason(month: number): Season {
  if ([2,3,4].includes(month))  return "Spring";
  if ([5,6,7].includes(month))  return "Summer";
  if ([8,9,10].includes(month)) return "Autumn";
  return "Winter";
}

/* ─────────────────────────────────────────────────────────
   FLOWER DATA — one entry per photo type, no repetition
───────────────────────────────────────────────────────── */
interface Flower {
  id: number;
  name: string;
  latin: string;
  type: string;
  seasons: Season[];
  desc: string;
  care: string;
  height: string;
  native: string;
}

const FLOWERS: Flower[] = [
  {
    id: 1, name: "Garden Rose", latin: "Rosa × hybrida",
    type: "rose",
    seasons: ["Spring","Summer"],
    desc: "The queen of the garden — thousands of cultivars in every colour, blooming from late spring through summer.",
    care: "Full sun, regular watering, prune after first flush.", height: "0.5–2 m", native: "Garden hybrid",
  },
  {
    id: 2, name: "Chinese Peony", latin: "Paeonia lactiflora",
    type: "peony",
    seasons: ["Spring"],
    desc: "Sumptuous globe-shaped blooms in white, pink and crimson — the most beloved of all spring flowers.",
    care: "Plant in autumn, full sun, stake heavy blooms.", height: "60–90 cm", native: "China · Tibet",
  },
  {
    id: 3, name: "Garden Tulip", latin: "Tulipa gesneriana",
    type: "tulip",
    seasons: ["Spring"],
    desc: "The universal symbol of spring — thousands of cultivars lighting up borders from February to May.",
    care: "Plant bulbs in autumn, well-drained soil, full sun.", height: "30–70 cm", native: "Central Asia",
  },
  {
    id: 4, name: "Moth Orchid", latin: "Phalaenopsis amabilis",
    type: "orchid",
    seasons: ["Winter","Spring"],
    desc: "The world's most popular orchid — arching sprays of pristine white blooms lasting months in the home.",
    care: "Bright indirect light, water weekly, fertilise monthly.", height: "30–60 cm", native: "SE Asia",
  },
  {
    id: 5, name: "Common Dahlia", latin: "Dahlia pinnata",
    type: "dahlia",
    seasons: ["Summer","Autumn"],
    desc: "Extraordinary variety from tiny pompoms to dinner-plate blooms — the star of the summer-to-frost garden.",
    care: "Full sun, rich soil, lift tubers before first frost.", height: "0.5–1.5 m", native: "Mexico",
  },
  {
    id: 6, name: "Regal Lily", latin: "Lilium regale",
    type: "lily",
    seasons: ["Summer"],
    desc: "One of the most fragrant of all lilies — pure white trumpets with a golden throat from Sichuan gorges.",
    care: "Full sun or part shade, well-drained soil, stake tall stems.", height: "1–2 m", native: "W. China",
  },
  {
    id: 7, name: "Tree Rhododendron", latin: "Rhododendron arboreum",
    type: "rhododendron",
    seasons: ["Spring","Winter"],
    desc: "Nepal's national flower — a magnificent tree bearing crimson trusses painting Himalayan hillsides each spring.",
    care: "Acid soil, dappled shade, mulch well, avoid drought.", height: "3–20 m", native: "Himalayas",
  },
  {
    id: 8, name: "Common Lavender", latin: "Lavandula angustifolia",
    type: "lavender",
    seasons: ["Summer"],
    desc: "Intensely fragrant purple spikes beloved for 2,500 years in perfumery, cooking and aromatherapy.",
    care: "Full sun, very well-drained soil, prune after flowering.", height: "30–60 cm", native: "Mediterranean",
  },
  {
    id: 9, name: "Common Sunflower", latin: "Helianthus annuus",
    type: "sunflower",
    seasons: ["Summer"],
    desc: "The most cheerful flower of summer — bold golden heads tracking the sun, beloved by bees and people alike.",
    care: "Full sun, sheltered spot, water at base, stake tall varieties.", height: "0.6–3 m", native: "North America",
  },
  {
    id: 10, name: "Sacred Lotus", latin: "Nelumbo nucifera",
    type: "lotus",
    seasons: ["Summer"],
    desc: "A symbol of purity across Asia — rising pristine from still water to open breathtaking pink and white blooms.",
    care: "Full sun, still water, fertilise monthly in summer.", height: "0.5–1.5 m", native: "Asia · Australia",
  },
];

const SEASONS: Season[] = ["Spring", "Summer", "Autumn", "Winter"];

/* ─────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────── */
export default function GardenPage() {
  const currentMonth  = new Date().getMonth(); // 0-based
  const defaultSeason = getSeason(currentMonth);

  const [season, setSeason] = useState<Season>(defaultSeason);
  const pool = useFlowerPool(GALLERY_FLOWER_TYPES);

  const visible = FLOWERS.filter(f => f.seasons.includes(season));
  const meta    = SEASON_META[season];

  /* Hero entrance */
  useEffect(() => {
    gsap.fromTo(".gd-ha",
      { y: 32, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.85, stagger: 0.12, ease: "power3.out", delay: 0.2 }
    );
  }, []);

  /* Cards animate in when season changes */
  useEffect(() => {
    const id = setTimeout(() => {
      gsap.killTweensOf(".gd-card");
      gsap.fromTo(".gd-card",
        { y: 36, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.55, stagger: 0.08, ease: "power3.out" }
      );
    }, 0);
    return () => clearTimeout(id);
  }, [season]);

  return (
    <>
      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden flex flex-col justify-center"
        style={{ minHeight: "58vh", paddingTop: "148px", paddingBottom: "88px", background: "var(--bg)" }}
      >
        <div className="absolute inset-0" style={{ backgroundImage: `url(${pick(pool, visible[0]?.type ?? "rose")})`, backgroundSize: "cover", backgroundPosition: "center 40%", opacity: 0.16 }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg,rgba(6,3,10,0.9) 40%,rgba(184,43,88,0.08) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 75% 60% at 50% 65%,rgba(184,43,88,0.15) 0%,transparent 70%)" }} />

        <div className="container relative" style={{ zIndex: 5 }}>
          <div className="gd-ha eyebrow mb-6" style={{ color: "var(--gold-light)", opacity: 0 }}>
            <span style={{ width: 28, height: 1, background: "var(--gold)", display: "inline-block", flexShrink: 0 }} />
            Laliguras · Seasonal Garden · {new Date().getFullYear()}
            <span style={{ width: 28, height: 1, background: "var(--gold)", display: "inline-block", flexShrink: 0 }} />
          </div>

          <h1 className="gd-ha" style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "clamp(3.2rem,8vw,8rem)", fontWeight: 900, lineHeight: 0.92, letterSpacing: "-0.025em", color: "var(--cream)", maxWidth: 780, marginBottom: "1.5rem", opacity: 0 }}>
            What&apos;s Blooming<br />
            <span style={{ background: "linear-gradient(135deg,#D14E72 0%,#F2BCCA 45%,#DDB95A 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              This {defaultSeason}
            </span>
          </h1>

          <p className="gd-ha" style={{ fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)", fontSize: "clamp(1.1rem,2vw,1.35rem)", fontStyle: "italic", color: "var(--muted)", maxWidth: 500, lineHeight: 1.8, marginBottom: "2.5rem", opacity: 0 }}>
            Your seasonal garden guide — discover which flowers are in bloom right now and how to care for them.
          </p>

          <div className="gd-ha" style={{ display: "flex", flexWrap: "wrap", gap: 14, opacity: 0 }}>
            <Link href="/plants" className="btn btn-primary btn-lg">
              <Sparkles size={15} /> Full Flower Catalog
            </Link>
            <Link href="/events" className="btn btn-outline btn-lg">
              Upcoming Events <ArrowRight size={15} />
            </Link>
          </div>

          {/* Season stat row */}
          <div className="gd-ha" style={{ display: "flex", flexWrap: "wrap", gap: 32, marginTop: 48, paddingTop: 32, borderTop: "1px solid var(--border-s)", opacity: 0 }}>
            {SEASONS.map(s => {
              const count = FLOWERS.filter(f => f.seasons.includes(s)).length;
              const active = s === defaultSeason;
              return (
                <div key={s}>
                  <div style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "clamp(1.4rem,2.8vw,2.2rem)", fontWeight: 800, color: active ? "var(--rose-light)" : "var(--cream)", lineHeight: 1, letterSpacing: "-0.02em" }}>{count}</div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: active ? "var(--rose-light)" : "var(--muted)", marginTop: 6 }}>{s} Blooms</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SEASON SELECTOR ── */}
      <div style={{ position: "sticky", top: "68px", zIndex: 30, background: "rgba(6,3,10,0.96)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border-s)" }}>
        <div className="container" style={{ paddingTop: 18, paddingBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
            <div style={{ display: "flex", gap: 8 }}>
              {SEASONS.map(s => {
                const m   = SEASON_META[s];
                const act = s === season;
                return (
                  <button key={s} onClick={() => setSeason(s)} style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "10px 20px", borderRadius: 9999, fontSize: 11, fontWeight: act ? 600 : 400,
                    fontFamily: "var(--font-sans)", letterSpacing: "0.08em", textTransform: "uppercase",
                    cursor: "pointer", transition: "all 0.25s",
                    background: act ? m.bg : "rgba(253,248,240,0.05)",
                    color: act ? m.color : "var(--muted)",
                    border: `1px solid ${act ? m.color + "55" : "var(--border-s)"}`,
                    boxShadow: act ? `0 4px 16px ${m.color}30` : "none",
                  }}>
                    <span style={{ color: act ? m.color : "var(--dim)" }}>{m.icon}</span>
                    {s}
                    {s === defaultSeason && <span style={{ fontSize: 8, fontWeight: 700, padding: "2px 7px", borderRadius: 9999, background: m.color + "22", border: `1px solid ${m.color}44`, color: m.color, letterSpacing: "0.1em" }}>NOW</span>}
                  </button>
                );
              })}
            </div>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--dim)" }}>
              {visible.length} flower{visible.length !== 1 ? "s" : ""} blooming in {season}
            </span>
          </div>
        </div>
      </div>

      {/* ── GARDEN GRID ── */}
      <section style={{ background: "var(--surface)", padding: "5rem 0 6rem" }}>
        <div className="container">

          {/* Season banner */}
          <div style={{ marginBottom: "3rem", padding: "28px 32px", borderRadius: 20, background: meta.bg, border: `1px solid ${meta.color}30`, display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: meta.color + "22", border: `1px solid ${meta.color}50`, color: meta.color, flexShrink: 0 }}>
              {meta.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: meta.color, marginBottom: 6 }}>{season} Garden</div>
              <p style={{ fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)", fontSize: "1.1rem", fontStyle: "italic", color: "var(--muted)", lineHeight: 1.6 }}>{meta.desc}</p>
            </div>
          </div>

          {visible.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }} className="gd-grid">
              {visible.map(f => (
                <GardenCard key={f.id} flower={f} seasonColor={meta.color} pool={pool} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "80px 32px", background: "var(--card)", borderRadius: 20, border: "1px solid var(--border-s)" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 14 }}>❄</div>
              <p style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "1.3rem", color: "var(--cream)", marginBottom: 8 }}>A season of rest</p>
              <p style={{ color: "var(--muted)", fontSize: 13 }}>Select another season to explore blooms.</p>
            </div>
          )}

          {/* CTA */}
          <div style={{ marginTop: 64, padding: "52px 44px", borderRadius: 24, background: "var(--card)", border: "1px solid rgba(184,43,88,0.2)", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 60%,rgba(184,43,88,0.18) 0%,transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div className="eyebrow mb-4" style={{ justifyContent: "center" }}>Full Library</div>
              <h3 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 700, color: "var(--cream)", marginBottom: "1rem" }}>
                Explore All 80 Flower Species
              </h3>
              <p style={{ fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)", fontSize: "1.1rem", fontStyle: "italic", color: "var(--muted)", maxWidth: 440, margin: "0 auto 2rem", lineHeight: 1.8 }}>
                Dive into the full Laliguras catalog — search, filter by difficulty, and build your personal garden.
              </p>
              <Link href="/plants" className="btn btn-primary btn-lg">
                Open Flower Catalog <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @media(max-width:1100px){ .gd-grid{ grid-template-columns:repeat(3,1fr) !important; } }
        @media(max-width:720px) { .gd-grid{ grid-template-columns:repeat(2,1fr) !important; gap:16px !important; } }
        @media(max-width:480px) { .gd-grid{ grid-template-columns:1fr !important; } }
      `}</style>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   GARDEN CARD
───────────────────────────────────────────────────────── */
function GardenCard({ flower, seasonColor, pool }: { flower: Flower; seasonColor: string; pool: FlowerPool }) {
  const ref    = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const onEnter = () => {
    if (ref.current)    gsap.to(ref.current,    { y: -6, duration: 0.3, ease: "power2.out" });
    if (imgRef.current) gsap.to(imgRef.current, { scale: 1.07, duration: 0.55, ease: "power2.out" });
    if (ref.current) {
      ref.current.style.borderColor = "rgba(184,43,88,0.3)";
      ref.current.style.boxShadow   = "0 20px 50px rgba(0,0,0,0.4)";
    }
  };
  const onLeave = () => {
    if (ref.current)    gsap.to(ref.current,    { y: 0, duration: 0.35, ease: "power2.out" });
    if (imgRef.current) gsap.to(imgRef.current, { scale: 1, duration: 0.55, ease: "power2.out" });
    if (ref.current) {
      ref.current.style.borderColor = "rgba(253,248,240,0.07)";
      ref.current.style.boxShadow   = "none";
    }
  };

  return (
    <div
      ref={ref}
      className="gd-card"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{ background: "var(--card)", border: "1px solid var(--border-s)", borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column", transition: "border-color 0.25s, box-shadow 0.25s" }}
    >
      {/* Image — 4:5 portrait */}
      <div style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden", flexShrink: 0 }}>
        <img
          ref={imgRef}
          src={pick(pool, flower.type)}
          alt={flower.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", transformOrigin: "center" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(6,3,10,0.8) 0%,rgba(6,3,10,0.06) 50%,transparent 100%)" }} />

        {/* Season badge */}
        <div style={{ position: "absolute", top: 13, left: 13, display: "flex", gap: 5 }}>
          {flower.seasons.map(s => (
            <span key={s} style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 9999, background: SEASON_META[s].bg, border: `1px solid ${SEASON_META[s].color}45`, color: SEASON_META[s].color, backdropFilter: "blur(6px)" }}>
              {s}
            </span>
          ))}
        </div>

        {/* Name overlay */}
        <div style={{ position: "absolute", bottom: 14, left: 16, right: 16 }}>
          <h3 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "1.05rem", fontWeight: 700, color: "white", lineHeight: 1.2, marginBottom: 3 }}>
            {flower.name}
          </h3>
          <p style={{ fontStyle: "italic", color: "rgba(255,255,255,0.55)", fontSize: 11 }}>{flower.latin}</p>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "18px 20px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, fontWeight: 300, color: "var(--muted)", lineHeight: 1.75, flex: 1, marginBottom: 14 }}>
          {flower.desc.length > 90 ? flower.desc.slice(0, 90) + "…" : flower.desc}
        </p>

        {/* Care tip */}
        <div style={{ padding: "11px 13px", borderRadius: 10, background: "rgba(253,248,240,0.04)", border: "1px solid var(--border-s)", marginBottom: 14 }}>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: seasonColor, marginBottom: 4, fontFamily: "var(--font-sans)" }}>Care tip</div>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, color: "var(--dim)", lineHeight: 1.6 }}>{flower.care}</p>
        </div>

        {/* Meta row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid var(--border-s)" }}>
          <div style={{ display: "flex", gap: 12 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--dim)", fontFamily: "var(--font-sans)" }}>
              <Leaf size={10} style={{ color: "var(--rose-light)", flexShrink: 0 }} /> {flower.height}
            </span>
          </div>
          <Link
            href="/plants"
            style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", fontFamily: "var(--font-sans)", color: "var(--rose-light)" }}
          >
            Details <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </div>
  );
}
