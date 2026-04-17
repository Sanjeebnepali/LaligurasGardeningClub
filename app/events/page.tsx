"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Calendar, MapPin, Clock, Users, X,
  ChevronLeft, ChevronRight, Sparkles, Check,
} from "lucide-react";
import { useFlowerPool, pick } from "@/lib/useFlowerPool";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────── */
const EVENTS = [
  /* ── APRIL ── */
  {
    id: 1, title: "Spring Bloom Opening Ceremony",
    date: "2026-04-05", time: "10:00 AM – 1:00 PM",
    location: "Laliguras Botanical Gardens", type: "Ceremony",
    accent: "#D14E72", attendees: 72, spots: 30,
    desc: "Celebrate the season's first bloom — a formal opening ceremony marking the start of Laliguras's 2026 botanical calendar, with guided walks and refreshments.",
    speaker: "Dr. Elara Vance",
    tags: ["Opening", "Seasonal", "Community"],
    flowerType: "rose",
  },
  {
    id: 2, title: "Rhododendron Spotting Walk",
    date: "2026-04-13", time: "8:00 AM – 11:00 AM",
    location: "Woosong University Campus Trail", type: "Field Trip",
    accent: "#8E44AD", attendees: 24, spots: 18,
    desc: "An early-morning guided walk to observe Nepal's national flower at peak bloom across the campus trail — binoculars and notebooks welcome.",
    speaker: "Prof. Ji-woo Kim",
    tags: ["Outdoors", "Rhododendron", "Field Trip"],
    flowerType: "rhododendron",
  },
  {
    id: 3, title: "Pressed Flower Art Workshop",
    date: "2026-04-20", time: "2:00 PM – 5:00 PM",
    location: "Laliguras Studio, Room 204", type: "Workshop",
    accent: "#DDB95A", attendees: 18, spots: 8,
    desc: "Learn the art of botanical pressing — create framed pressed flower compositions using specimens from the society's spring collection.",
    speaker: "Soo-yeon Park",
    tags: ["Art", "Hands-on", "Workshop"],
    flowerType: "peony",
  },
  /* ── MAY ── */
  {
    id: 4, title: "Monthly Heritage Symposium",
    date: "2026-05-11", time: "10:00 AM – 1:00 PM",
    location: "Laliguras Botanical Gardens", type: "Symposium",
    accent: "#D14E72", attendees: 48, spots: 10,
    desc: "Our flagship monthly gathering for plant enthusiasts to share experiences, discoveries, and seasonal cultivation techniques from across the Himalayan region.",
    speaker: "Dr. Elara Vance",
    tags: ["Heritage", "Community", "Monthly"],
    flowerType: "lotus",
  },
  {
    id: 5, title: "Pruning & Soil Health Workshop",
    date: "2026-05-19", time: "2:00 PM – 5:00 PM",
    location: "Riverside Annex", type: "Workshop",
    accent: "#DDB95A", attendees: 22, spots: 5,
    desc: "Hands-on workshop covering advanced pruning techniques and soil microbiome health — practical skills for thriving Himalayan garden beds.",
    speaker: "Marcus Chen",
    tags: ["Hands-on", "Soil", "Workshop"],
    flowerType: "lavender",
  },
  {
    id: 6, title: "Gardens Estate Tour",
    date: "2026-05-25", time: "9:00 AM – 3:00 PM",
    location: "South Heritage Park, Suite 8", type: "Tour",
    accent: "#B82B58", attendees: 65, spots: 20,
    desc: "A guided tour through the Laliguras estate showcasing rare specimens, conservation plots, and heritage garden structures.",
    speaker: "Aisha Rajan",
    tags: ["Tour", "Heritage", "Outdoors"],
    flowerType: "tulip",
  },
  /* ── JUNE ── */
  {
    id: 7, title: "Himalayan Plant Photography",
    date: "2026-06-07", time: "8:00 AM – 12:00 PM",
    location: "Alpine Meadow, North Section", type: "Field Trip",
    accent: "#8E44AD", attendees: 18, spots: 15,
    desc: "Early morning photographic field trip to capture peak bloom season in our alpine meadow collection at the height of summer.",
    speaker: "Community Led",
    tags: ["Photography", "Outdoors", "Field Trip"],
    flowerType: "orchid",
  },
  /* ── JULY ── */
  {
    id: 8, title: "Seed Exchange Fair",
    date: "2026-07-14", time: "10:00 AM – 3:00 PM",
    location: "Laliguras Main Hall", type: "Fair",
    accent: "#1A8FA0", attendees: 90, spots: 50,
    desc: "Our annual seed exchange event — bring seeds from your garden and take home rare varieties from across the Himalayas and beyond.",
    speaker: "Community Event",
    tags: ["Seeds", "Community", "Annual"],
    flowerType: "sunflower",
  },
  /* ── SEPTEMBER ── */
  {
    id: 9, title: "Autumn Equinox & Soil Prep",
    date: "2026-09-22", time: "11:00 AM – 4:00 PM",
    location: "South Heritage Park", type: "Workshop",
    accent: "#2D9A6B", attendees: 34, spots: 12,
    desc: "Prepare your garden for the cool season — composting, bed preparation, and establishing winter-hardy plantings.",
    speaker: "Dr. Elara Vance",
    tags: ["Seasonal", "Soil", "Workshop"],
    flowerType: "lily",
  },
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTHS_FULL = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const TYPES = ["All", ...Array.from(new Set(EVENTS.map(e => e.type)))];

/* ─────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────── */
export default function EventsPage() {
  const [selected,   setSelected]   = useState<typeof EVENTS[0] | null>(null);
  const [month,      setMonth]      = useState(3); // April
  const [typeFilter, setTypeFilter] = useState("All");
  const [rsvp,       setRsvp]       = useState<number[]>([]);

  const modalRef  = useRef<HTMLDivElement>(null);
  const listRef   = useRef<HTMLDivElement>(null);
  const heroRef   = useRef<HTMLElement>(null);
  const pool      = useFlowerPool(["rose","rhododendron","peony","lotus","lavender","tulip","orchid","sunflower","lily","dahlia"]);

  const filtered = EVENTS.filter(e => {
    const m = new Date(e.date).getMonth();
    return m === month && (typeFilter === "All" || e.type === typeFilter);
  });

  /* ── Hero entrance ── */
  useEffect(() => {
    if (!heroRef.current) return;
    gsap.fromTo(".ev-ha",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power3.out", delay: 0.2 }
    );
  }, []);

  /* ── Cards stagger on filter change ──
     Bug fix: defer one frame so React has committed the new .ev-row
     elements to the DOM before GSAP tries to select them.
     killTweensOf clears any stale in-progress animations.        */
  useEffect(() => {
    const id = setTimeout(() => {
      const rows = document.querySelectorAll<HTMLElement>(".ev-row");
      if (!rows.length) return;
      gsap.killTweensOf(rows);
      gsap.fromTo(rows,
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, stagger: 0.09, ease: "power2.out" }
      );
    }, 0);
    return () => clearTimeout(id);
  }, [month, typeFilter]);

  /* ── Modal open ── */
  useEffect(() => {
    if (selected && modalRef.current) {
      gsap.fromTo(modalRef.current,
        { scale: 0.94, opacity: 0, y: 20 },
        { scale: 1,    opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }
      );
    }
  }, [selected]);

  const openModal  = (e: typeof EVENTS[0]) => setSelected(e);
  const closeModal = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        scale: 0.95, opacity: 0, y: 16, duration: 0.3, ease: "power2.in",
        onComplete: () => setSelected(null),
      });
    } else {
      setSelected(null);
    }
  };

  const toggleRsvp = (id: number) =>
    setRsvp(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <>
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden flex flex-col justify-center"
        style={{ minHeight: "58vh", paddingTop: "140px", paddingBottom: "90px", background: "var(--bg)" }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${pick(pool, "rose")})`,
            backgroundSize: "cover", backgroundPosition: "center 40%", opacity: 0.22,
          }}
        />
        {/* Scrim */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg,rgba(6,3,10,0.85) 40%,rgba(184,43,88,0.12) 100%)" }} />
        {/* Rose glow */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 75% 60% at 50% 60%,rgba(184,43,88,0.18) 0%,transparent 70%)" }} />

        <div className="container relative" style={{ zIndex: 5 }}>
          <div className="ev-ha eyebrow mb-6" style={{ color: "var(--gold-light)", opacity: 0 }}>
            <span style={{ width: 28, height: 1, background: "var(--gold)", display: "inline-block", flexShrink: 0 }} />
            Laliguras · Event Calendar · 2026
            <span style={{ width: 28, height: 1, background: "var(--gold)", display: "inline-block", flexShrink: 0 }} />
          </div>

          <h1
            className="ev-ha"
            style={{
              fontFamily: "var(--font-playfair,'Playfair Display',serif)",
              fontSize: "clamp(3.2rem,8vw,8rem)",
              fontWeight: 900,
              lineHeight: 0.92,
              letterSpacing: "-0.025em",
              color: "var(--cream)",
              maxWidth: 780,
              marginBottom: "1.5rem",
              opacity: 0,
            }}
          >
            Bloom<br />
            <span style={{
              background: "linear-gradient(135deg,#D14E72 0%,#F2BCCA 45%,#DDB95A 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              Calendar
            </span>
          </h1>

          <p
            className="ev-ha"
            style={{
              fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)",
              fontSize: "clamp(1.1rem,2vw,1.35rem)",
              fontStyle: "italic",
              color: "var(--muted)",
              maxWidth: 500,
              lineHeight: 1.8,
              opacity: 0,
            }}
          >
            Explore our community workshops, flower tours, garden symposiums, and annual celebrations — all at Woosong University, Daejeon.
          </p>

          {/* Stats row */}
          <div
            className="ev-ha"
            style={{ display: "flex", flexWrap: "wrap", gap: 32, marginTop: 48, paddingTop: 32, borderTop: "1px solid var(--border-s)", opacity: 0 }}
          >
            {[
              { n: "9", l: "Events in 2026" },
              { n: "6", l: "Event Types" },
              { n: "391+", l: "Members Attending" },
            ].map(({ n, l }) => (
              <div key={l}>
                <div style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "clamp(1.4rem,2.8vw,2.2rem)", fontWeight: 800, color: "var(--cream)", lineHeight: 1, letterSpacing: "-0.02em" }}>{n}</div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginTop: 6 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTROLS BAR ── */}
      <section style={{ background: "var(--surface)", borderTop: "1px solid var(--border-s)", borderBottom: "1px solid var(--border-s)" }}>
        <div className="container" style={{ paddingTop: 28, paddingBottom: 28 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20 }}>

            {/* Month navigation */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button
                onClick={() => setMonth(m => Math.max(0, m - 1))}
                style={{
                  width: 38, height: 38, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(253,248,240,0.06)", border: "1px solid var(--border-s)",
                  color: "var(--muted)", cursor: "pointer", transition: "all 0.2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(184,43,88,0.15)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(184,43,88,0.35)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--petal)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(253,248,240,0.06)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-s)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)"; }}
              >
                <ChevronLeft size={15} />
              </button>

              <div style={{ textAlign: "center", minWidth: 160 }}>
                <div style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "clamp(1.3rem,2.5vw,1.7rem)", fontWeight: 700, color: "var(--cream)", lineHeight: 1 }}>
                  {MONTHS_FULL[month]}
                </div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", marginTop: 4 }}>2026</div>
              </div>

              <button
                onClick={() => setMonth(m => Math.min(11, m + 1))}
                style={{
                  width: 38, height: 38, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(253,248,240,0.06)", border: "1px solid var(--border-s)",
                  color: "var(--muted)", cursor: "pointer", transition: "all 0.2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(184,43,88,0.15)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(184,43,88,0.35)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--petal)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(253,248,240,0.06)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-s)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)"; }}
              >
                <ChevronRight size={15} />
              </button>
            </div>

            {/* Month dots */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {MONTHS.map((m, i) => {
                const hasEvents = EVENTS.some(e => new Date(e.date).getMonth() === i);
                return (
                  <button
                    key={m} onClick={() => setMonth(i)}
                    title={MONTHS_FULL[i]}
                    style={{
                      padding: "6px 12px", borderRadius: 9999, fontSize: 10, fontWeight: month === i ? 700 : 400,
                      fontFamily: "var(--font-sans)", letterSpacing: "0.08em", cursor: "pointer", transition: "all 0.2s",
                      background: month === i ? "linear-gradient(135deg,var(--rose),var(--rose-light))" : "rgba(253,248,240,0.05)",
                      color: month === i ? "white" : hasEvents ? "var(--muted)" : "var(--dim)",
                      border: `1px solid ${month === i ? "transparent" : hasEvents ? "rgba(253,248,240,0.1)" : "rgba(253,248,240,0.04)"}`,
                      boxShadow: month === i ? "0 4px 14px rgba(184,43,88,0.35)" : "none",
                      position: "relative",
                    }}
                  >
                    {m}
                    {hasEvents && month !== i && (
                      <span style={{ position: "absolute", bottom: 3, left: "50%", transform: "translateX(-50%)", width: 3, height: 3, borderRadius: "50%", background: "var(--rose-light)" }} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Type pills */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {TYPES.map(t => (
                <button key={t} onClick={() => setTypeFilter(t)} style={{
                  padding: "7px 16px", borderRadius: 9999, fontSize: 10, fontWeight: typeFilter === t ? 600 : 400,
                  fontFamily: "var(--font-sans)", letterSpacing: "0.07em", cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap",
                  background: typeFilter === t ? "rgba(184,43,88,0.18)" : "transparent",
                  color: typeFilter === t ? "var(--petal)" : "var(--muted)",
                  border: `1px solid ${typeFilter === t ? "rgba(184,43,88,0.4)" : "var(--border-s)"}`,
                }}>
                  {t}
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── EVENTS LIST ── */}
      <section style={{ background: "var(--bg)", padding: "5rem 0 6rem" }}>
        <div className="container">

          {/* Section heading */}
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div className="eyebrow mb-3">Upcoming Events</div>
                <h2 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "clamp(1.7rem,3.2vw,2.6rem)", fontWeight: 700, color: "var(--cream)" }}>
                  {MONTHS_FULL[month]} 2026
                </h2>
              </div>
              <p style={{ color: "var(--dim)", fontSize: 13, fontFamily: "var(--font-sans)", paddingBottom: 6 }}>
                {filtered.length} event{filtered.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          {filtered.length > 0 ? (
            <div ref={listRef} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {filtered.map(ev => (
                <EventRow
                  key={ev.id}
                  ev={ev}
                  rsvpd={rsvp.includes(ev.id)}
                  onOpen={() => openModal(ev)}
                  onRsvp={() => toggleRsvp(ev.id)}
                />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "80px 32px", background: "var(--card)", borderRadius: 20, border: "1px solid var(--border-s)" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 14 }}>🗓</div>
              <p style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "1.3rem", color: "var(--cream)", marginBottom: 8 }}>
                No events in {MONTHS_FULL[month]}
              </p>
              <p style={{ color: "var(--muted)", fontSize: 14, fontFamily: "var(--font-sans)" }}>
                Try another month or remove the type filter.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── MODAL ── */}
      {selected && (
        <div
          onClick={closeModal}
          style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(6,3,10,0.88)", backdropFilter: "blur(14px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
        >
          <div
            ref={modalRef}
            onClick={e => e.stopPropagation()}
            style={{ width: "100%", maxWidth: 680, maxHeight: "92vh", overflowY: "auto", background: "var(--card)", border: "1px solid rgba(184,43,88,0.22)", borderRadius: 24, boxShadow: "0 40px 100px rgba(0,0,0,0.65)", opacity: 0 }}
          >
            {/* Image header */}
            <div style={{ position: "relative", height: 280, overflow: "hidden", borderRadius: "24px 24px 0 0" }}>
              <img
                src={pick(pool, selected.flowerType)} alt={selected.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top,rgba(6,3,10,0.95) 0%,rgba(6,3,10,0.3) 50%,transparent 100%)` }} />
              <div style={{ position: "absolute", inset: 0, background: `${selected.accent}18` }} />

              {/* Close */}
              <button
                onClick={closeModal}
                style={{ position: "absolute", top: 18, right: 18, width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(6,3,10,0.7)", border: "1px solid rgba(255,255,255,0.15)", color: "white", cursor: "pointer", backdropFilter: "blur(8px)" }}
              >
                <X size={16} />
              </button>

              {/* Date badge */}
              <div style={{ position: "absolute", top: 18, left: 18, textAlign: "center", padding: "10px 16px", background: selected.accent, borderRadius: 12, boxShadow: `0 8px 24px ${selected.accent}55` }}>
                <div style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "1.8rem", fontWeight: 800, color: "white", lineHeight: 1 }}>
                  {new Date(selected.date).getDate()}
                </div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)", marginTop: 2 }}>
                  {MONTHS[new Date(selected.date).getMonth()]}
                </div>
              </div>

              {/* Title overlay */}
              <div style={{ position: "absolute", bottom: 24, left: 28, right: 60 }}>
                <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 9999, background: selected.accent + "35", border: `1px solid ${selected.accent}55`, color: selected.accent, marginBottom: 10, display: "inline-block" }}>
                  {selected.type}
                </span>
                <h2 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "clamp(1.4rem,3vw,1.9rem)", fontWeight: 800, color: "white", lineHeight: 1.1 }}>
                  {selected.title}
                </h2>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: "30px 32px 32px" }}>
              <p style={{ fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)", fontSize: "1.15rem", lineHeight: 1.85, color: "var(--muted)", marginBottom: 26, fontStyle: "italic" }}>
                {selected.desc}
              </p>

              {/* Info grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 26 }}>
                {[
                  { icon: <Clock size={13} />,    label: "Time",      value: selected.time },
                  { icon: <MapPin size={13} />,   label: "Location",  value: selected.location },
                  { icon: <Users size={13} />,    label: "Speaker",   value: selected.speaker },
                  { icon: <Calendar size={13} />, label: "Spots Left",value: `${selected.spots} spots remaining` },
                ].map(({ icon, label, value }) => (
                  <div key={label} style={{ padding: "14px 16px", background: "var(--surface)", border: "1px solid var(--border-s)", borderRadius: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--rose-light)", marginBottom: 6, fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-sans)" }}>
                      {icon} {label}
                    </div>
                    <div style={{ color: "var(--cream)", fontSize: 13, fontWeight: 500, lineHeight: 1.4, fontFamily: "var(--font-sans)" }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 28 }}>
                {selected.tags.map(t => (
                  <span key={t} style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.08em", padding: "5px 13px", borderRadius: 9999, background: "rgba(253,248,240,0.06)", border: "1px solid var(--border-s)", color: "var(--muted)", fontFamily: "var(--font-sans)" }}>{t}</span>
                ))}
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => { toggleRsvp(selected.id); }}
                  style={{
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    padding: "14px 24px", borderRadius: 12, fontSize: 11, fontWeight: 600,
                    letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-sans)", cursor: "pointer",
                    background: rsvp.includes(selected.id) ? "linear-gradient(135deg,#2D9A6B,#3DB87F)" : "linear-gradient(135deg,var(--rose),var(--rose-light))",
                    color: "white", border: "none",
                    boxShadow: rsvp.includes(selected.id) ? "0 8px 24px rgba(45,154,107,0.35)" : "0 8px 24px rgba(184,43,88,0.35)",
                    transition: "all 0.25s",
                  }}
                >
                  {rsvp.includes(selected.id)
                    ? <><Check size={14} /> RSVP Confirmed</>
                    : <><Sparkles size={14} /> Confirm RSVP</>
                  }
                </button>
                <button
                  onClick={closeModal}
                  style={{ padding: "14px 26px", borderRadius: 12, fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-sans)", background: "rgba(253,248,240,0.06)", color: "var(--muted)", border: "1.5px solid rgba(253,248,240,0.12)", cursor: "pointer" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   EVENT ROW COMPONENT
───────────────────────────────────────────────────────── */
function EventRow({ ev, rsvpd, onOpen, onRsvp }: {
  ev: typeof EVENTS[0];
  rsvpd: boolean;
  onOpen: () => void;
  onRsvp: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onEnter = () => {
    if (!ref.current) return;
    gsap.to(ref.current, { y: -3, duration: 0.25, ease: "power2.out" });
    ref.current.style.borderColor = "rgba(184,43,88,0.28)";
    ref.current.style.boxShadow = "0 12px 40px rgba(0,0,0,0.35)";
  };
  const onLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, { y: 0, duration: 0.3, ease: "power2.out" });
    ref.current.style.borderColor = "rgba(253,248,240,0.07)";
    ref.current.style.boxShadow = "none";
  };

  const dayNum  = new Date(ev.date).getDate();
  const monthAb = MONTHS[new Date(ev.date).getMonth()];

  return (
    <div
      ref={ref}
      className="ev-row"
      onClick={onOpen}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        background: "var(--card)", border: "1px solid var(--border-s)", borderRadius: 20,
        overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "row",
        transition: "border-color 0.25s, box-shadow 0.25s",
      }}
    >
      {/* Date column */}
      <div style={{
        flexShrink: 0, width: 90, display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "24px 0", gap: 2,
        background: `linear-gradient(160deg, ${ev.accent}22 0%, ${ev.accent}10 100%)`,
        borderRight: `1px solid ${ev.accent}28`,
      }}>
        <div style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "2.2rem", fontWeight: 800, color: ev.accent, lineHeight: 1, letterSpacing: "-0.02em" }}>
          {dayNum}
        </div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: ev.accent + "bb" }}>
          {monthAb}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "22px 28px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>

        {/* Main info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 11px", borderRadius: 9999, background: ev.accent + "28", border: `1px solid ${ev.accent}45`, color: ev.accent }}>
              {ev.type}
            </span>
            {ev.spots <= 15 && !rsvpd && (
              <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 11px", borderRadius: 9999, background: "rgba(196,162,60,0.15)", border: "1px solid rgba(196,162,60,0.35)", color: "var(--gold-light)" }}>
                {ev.spots} spots left
              </span>
            )}
            {rsvpd && (
              <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 11px", borderRadius: 9999, background: "rgba(45,154,107,0.15)", border: "1px solid rgba(45,154,107,0.35)", color: "#4CD197" }}>
                ✓ RSVP&apos;d
              </span>
            )}
          </div>

          <h3 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "clamp(1rem,2vw,1.25rem)", fontWeight: 700, color: "var(--cream)", marginBottom: 10, lineHeight: 1.2 }}>
            {ev.title}
          </h3>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            {[
              { icon: <Clock size={12} />,  text: ev.time },
              { icon: <MapPin size={12} />, text: ev.location },
              { icon: <Users size={12} />,  text: `${ev.attendees} attending` },
            ].map(({ icon, text }) => (
              <span key={text} style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--dim)", fontSize: 12, fontFamily: "var(--font-sans)" }}>
                <span style={{ color: "var(--rose-light)", flexShrink: 0 }}>{icon}</span>
                {text}
              </span>
            ))}
          </div>
        </div>

        {/* RSVP button */}
        <div style={{ flexShrink: 0 }}>
          <button
            onClick={e => { e.stopPropagation(); onRsvp(); }}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "12px 24px", borderRadius: 12, fontSize: 11,
              fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
              fontFamily: "var(--font-sans)", cursor: "pointer", transition: "all 0.25s",
              ...(rsvpd
                ? { background: "rgba(45,154,107,0.15)", color: "#4CD197", border: "1.5px solid rgba(45,154,107,0.35)" }
                : { background: "linear-gradient(135deg,var(--rose),var(--rose-light))", color: "white", border: "none", boxShadow: "0 6px 20px rgba(184,43,88,0.3)" }
              ),
            }}
          >
            {rsvpd ? <><Check size={13} /> RSVP&apos;d</> : <><Sparkles size={13} /> RSVP Now</>}
          </button>
        </div>

      </div>
    </div>
  );
}
