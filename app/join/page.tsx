"use client";
import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, ArrowRight, Leaf, Crown, Sprout, Star } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

/* ── Tier definitions ───────────────────────────────────── */
const TIERS = [
  {
    id: "seedling",
    name: "Seedling",
    price: "Free",
    priceNum: 0,
    period: "",
    icon: <Sprout size={18} />,
    accent: "#6B9E6B",
    accentDim: "rgba(107,158,107,0.15)",
    tag: "Get started",
    features: [
      { label: "Monthly Newsletter", included: true },
      { label: "Event Announcements", included: true },
      { label: "Basic Flower Library (50 species)", included: true },
      { label: "Community Forum Access", included: true },
      { label: "Full Botanical Library (500+ species)", included: false },
      { label: "Monthly Flora Gazette", included: false },
      { label: "Early Event Access & Priority RSVP", included: false },
      { label: "Seed Exchange Access", included: false },
      { label: "Masterclass Archives", included: false },
      { label: "1:1 Expert Consultations", included: false },
    ],
    unlocks: ["newsletter", "events", "basic-plants", "forum"],
  },
  {
    id: "gardener",
    name: "Gardener",
    price: "$30",
    priceNum: 30,
    period: "/ year",
    icon: <Leaf size={18} />,
    accent: "#B82B58",
    accentDim: "rgba(184,43,88,0.15)",
    tag: "Most Popular",
    popular: true,
    features: [
      { label: "Monthly Newsletter", included: true },
      { label: "Event Announcements", included: true },
      { label: "Basic Flower Library (50 species)", included: true },
      { label: "Community Forum Access", included: true },
      { label: "Full Botanical Library (500+ species)", included: true },
      { label: "Monthly Flora Gazette", included: true },
      { label: "Early Event Access & Priority RSVP", included: true },
      { label: "Seed Exchange Access", included: true },
      { label: "Masterclass Archives", included: false },
      { label: "1:1 Expert Consultations", included: false },
    ],
    unlocks: ["newsletter", "events", "basic-plants", "forum", "full-plants", "gazette", "seed-exchange", "early-events"],
  },
  {
    id: "curator",
    name: "Curator",
    price: "$100",
    priceNum: 100,
    period: "/ year",
    icon: <Crown size={18} />,
    accent: "#C4A23C",
    accentDim: "rgba(196,162,60,0.15)",
    tag: "All Access",
    features: [
      { label: "Monthly Newsletter", included: true },
      { label: "Event Announcements", included: true },
      { label: "Basic Flower Library (50 species)", included: true },
      { label: "Community Forum Access", included: true },
      { label: "Full Botanical Library (500+ species)", included: true },
      { label: "Monthly Flora Gazette", included: true },
      { label: "Early Event Access & Priority RSVP", included: true },
      { label: "Seed Exchange Access", included: true },
      { label: "Masterclass Archives", included: true },
      { label: "1:1 Expert Consultations", included: true },
    ],
    unlocks: ["newsletter", "events", "basic-plants", "forum", "full-plants", "gazette", "seed-exchange", "early-events", "masterclass", "consultations", "voting"],
  },
];

const INTERESTS = [
  "Rhododendrons", "Alpine Plants", "Organic Gardening", "Soil Science",
  "Seasonal Planting", "Landscape Architecture", "Medicinal Plants",
  "Conservation", "Flower Photography", "Floral Art", "Bonsai", "Orchids",
];

const STEPS = [
  { label: "Your Details",   short: "Details"  },
  { label: "Pick a Plan",    short: "Plan"     },
  { label: "Your Interests", short: "Interests"},
  { label: "Confirm",        short: "Confirm"  },
];

/* ── Save membership to localStorage ───────────────────── */
function saveMembership(data: {
  tier: string; name: string; email: string;
  phone: string; city: string; interests: string[];
}) {
  const record = {
    ...data,
    joinedAt: new Date().toISOString(),
    status: "active",
    unlocks: TIERS.find(t => t.id === data.tier)?.unlocks ?? [],
  };
  localStorage.setItem("lg_membership", JSON.stringify(record));
  // Fire event so Navbar/Sanctuary react immediately
  window.dispatchEvent(new Event("lg_membership_updated"));
}

/* ── Success screen ─────────────────────────────────────── */
function SuccessScreen({ tier, name }: { tier: string; name: string }) {
  const t = TIERS.find(t => t.id === tier)!;
  const router = useRouter();

  const ACCESS_MAP: Record<string, { label: string; href: string; desc: string }[]> = {
    seedling: [
      { label: "Community Forum",  href: "/community",  desc: "Connect with fellow flower lovers" },
      { label: "Flower Library",   href: "/plants",     desc: "Explore 50 flower species" },
      { label: "Events",           href: "/events",     desc: "See upcoming club events" },
    ],
    gardener: [
      { label: "Full Plant Library", href: "/plants",     desc: "500+ species now unlocked" },
      { label: "My Garden",          href: "/sanctuary",  desc: "Your personal garden dashboard" },
      { label: "Seed Exchange",      href: "/community",  desc: "Trade seeds with members" },
      { label: "Events",             href: "/events",     desc: "Priority RSVP access" },
    ],
    curator: [
      { label: "My Garden",          href: "/sanctuary",  desc: "Full curator dashboard" },
      { label: "Masterclass Archive",href: "/newsletter", desc: "All expert sessions unlocked" },
      { label: "Full Plant Library", href: "/plants",     desc: "Every species + rare varieties" },
      { label: "Community",          href: "/community",  desc: "Voting rights + exclusive forums" },
    ],
  };

  const links = ACCESS_MAP[tier] ?? ACCESS_MAP.seedling;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingTop: "100px", paddingBottom: "100px" }}>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px" }}>

        {/* Glow */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{
            width: 88, height: 88, borderRadius: "50%",
            background: `radial-gradient(circle, ${t.accentDim} 0%, transparent 70%)`,
            border: `2px solid ${t.accent}55`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px",
            boxShadow: `0 0 40px ${t.accent}30`,
          }}>
            <div style={{ color: t.accent, transform: "scale(1.5)" }}>{t.icon}</div>
          </div>

          <h1 style={{
            fontFamily: "var(--font-playfair,'Playfair Display',serif)",
            fontSize: "clamp(2.2rem,5vw,3.5rem)", fontWeight: 900,
            color: "var(--cream)", lineHeight: 1.05, marginBottom: "14px",
          }}>
            Welcome, {name.split(" ")[0]}!
          </h1>
          <p style={{
            fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)",
            fontSize: "1.2rem", fontStyle: "italic",
            color: "rgba(253,248,240,0.55)", lineHeight: 1.7,
          }}>
            You are now a <span style={{ color: t.accent, fontWeight: 600 }}>{t.name}</span> member of Laliguras Gardening Club.
          </p>
        </div>

        {/* Tier badge */}
        <div style={{
          background: `linear-gradient(135deg, ${t.accentDim}, rgba(13,5,22,0.8))`,
          border: `1px solid ${t.accent}40`,
          borderRadius: "16px", padding: "20px 28px",
          display: "flex", alignItems: "center", gap: "16px",
          marginBottom: "32px",
        }}>
          <div style={{ color: t.accent }}>{t.icon}</div>
          <div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(253,248,240,0.40)", marginBottom: "3px" }}>
              Active Membership
            </p>
            <p style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "1.1rem", fontWeight: 700, color: "var(--cream)" }}>
              {t.name} Plan — {t.price}{t.period}
            </p>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4CD197", boxShadow: "0 0 8px rgba(76,209,151,0.7)" }} />
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "#4CD197", fontWeight: 600 }}>Active</span>
          </div>
        </div>

        {/* What you can access */}
        <div style={{ marginBottom: "36px" }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(253,248,240,0.35)", marginBottom: "16px" }}>
            Your Access
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {links.map(link => (
              <Link
                key={link.href + link.label}
                href={link.href}
                style={{
                  background: "rgba(253,248,240,0.04)",
                  border: "1px solid rgba(253,248,240,0.08)",
                  borderRadius: "12px", padding: "16px 18px",
                  textDecoration: "none", display: "block",
                  transition: "border-color .2s, background .2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = t.accent + "50"; (e.currentTarget as HTMLElement).style.background = t.accentDim; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(253,248,240,0.08)"; (e.currentTarget as HTMLElement).style.background = "rgba(253,248,240,0.04)"; }}
              >
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 600, color: "var(--cream)", marginBottom: "4px" }}>{link.label}</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "rgba(253,248,240,0.38)", lineHeight: 1.4 }}>{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            onClick={() => router.push("/sanctuary")}
            className="btn btn-primary"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", flex: 1, justifyContent: "center" }}
          >
            Go to My Garden <ArrowRight size={15} />
          </button>
          <Link href="/" className="btn btn-ghost" style={{ flex: 1, justifyContent: "center", display: "inline-flex" }}>
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}

/* ── Main form ──────────────────────────────────────────── */
function JoinForm() {
  const params  = useSearchParams();
  const defaultTier = params.get("tier") || "gardener";
  const { isSignedIn, user, isLoaded } = useUser();

  const [step,              setStep]              = useState(0);
  const [selectedTier,      setSelectedTier]      = useState(defaultTier);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [submitted,         setSubmitted]         = useState(false);
  const [form,              setForm]              = useState({ name: "", email: "", phone: "", city: "" });

  // Pre-fill from Clerk once loaded
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name:  prev.name  || user.fullName  || user.firstName || "",
        email: prev.email || user.emailAddresses?.[0]?.emailAddress || "",
      }));
    }
  }, [user]);

  const tier = TIERS.find(t => t.id === selectedTier)!;

  const toggleInterest = (i: string) =>
    setSelectedInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  const handleSubmit = () => {
    saveMembership({
      tier: selectedTier,
      name: form.name,
      email: form.email,
      phone: form.phone,
      city: form.city,
      interests: selectedInterests,
    });
    setSubmitted(true);
  };

  if (submitted) return <SuccessScreen tier={selectedTier} name={form.name || "Member"} />;

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* ═══════ HERO ═══════ */}
      <section
        className="relative overflow-hidden flex items-end"
        style={{ minHeight: "52vh", paddingTop: "68px", paddingBottom: "80px", background: "#06030A" }}
      >
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1490750967868-88df5691cc43?w=1600&q=80&fit=crop"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", opacity: 0.28 }}
          />
        </div>
        <div className="absolute inset-0" style={{ background: "rgba(6,3,10,0.65)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 75% 55% at 50% 80%, rgba(184,43,88,0.18) 0%, transparent 65%)" }} />
        <div className="absolute bottom-0 left-0 right-0" style={{ height: "40%", background: "linear-gradient(to bottom, transparent, #06030A)" }} />

        <div className="container relative" style={{ zIndex: 2 }}>
          <div className="eyebrow mb-5">Membership</div>
          <h1 style={{
            fontFamily: "var(--font-playfair,'Playfair Display',serif)",
            fontSize: "clamp(2.8rem,7vw,6.5rem)", fontWeight: 900,
            lineHeight: 0.92, color: "var(--cream)",
            maxWidth: "720px", marginBottom: "1.25rem", letterSpacing: "-0.025em",
          }}>
            Join Our<br />
            <span style={{ background: "linear-gradient(135deg,var(--rose-light),var(--petal),var(--gold-light))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Circle
            </span>
          </h1>
          <p style={{ fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)", fontSize: "clamp(1.1rem,2vw,1.4rem)", fontStyle: "italic", color: "var(--muted)", maxWidth: "460px", lineHeight: 1.8 }}>
            Choose the membership that fits your passion for flowers. Cancel or upgrade anytime.
          </p>
        </div>
      </section>

      {/* ═══════ PRICING CARDS ═══════ */}
      <section style={{ background: "var(--surface)", padding: "80px 0", borderBottom: "1px solid rgba(253,248,240,0.06)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <div className="eyebrow mb-4" style={{ justifyContent: "center" }}>Choose Your Plan</div>
            <h2 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, color: "var(--cream)", letterSpacing: "-0.02em" }}>
              Find Your Level
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "24px", maxWidth: "1000px", margin: "0 auto" }}
            className="join-grid"
          >
            {TIERS.map((t) => {
              const active = selectedTier === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTier(t.id)}
                  style={{
                    background: active ? `linear-gradient(160deg, ${t.accentDim}, rgba(13,5,22,0.95))` : "var(--card)",
                    border: `2px solid ${active ? t.accent : "rgba(253,248,240,0.08)"}`,
                    borderRadius: "24px",
                    padding: "36px 28px",
                    position: "relative",
                    cursor: "pointer",
                    transition: "all .28s ease",
                    transform: active ? "translateY(-8px)" : "none",
                    boxShadow: active ? `0 28px 64px rgba(0,0,0,0.55), 0 0 0 1px ${t.accent}30` : "none",
                  }}
                  onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.borderColor = t.accent + "40"; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; } }}
                  onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.borderColor = "rgba(253,248,240,0.08)"; (e.currentTarget as HTMLElement).style.transform = "none"; } }}
                >
                  {/* Popular badge */}
                  {t.popular && (
                    <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: t.accent, color: "white", fontSize: "9px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", padding: "5px 18px", borderRadius: "999px", fontFamily: "var(--font-sans)", whiteSpace: "nowrap" }}>
                      Most Popular
                    </div>
                  )}

                  {/* Selected checkmark */}
                  {active && (
                    <div style={{ position: "absolute", top: 16, right: 16, width: 26, height: 26, borderRadius: "50%", background: t.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Check size={13} color="white" />
                    </div>
                  )}

                  {/* Icon */}
                  <div style={{ width: 44, height: 44, borderRadius: "12px", background: active ? t.accent + "30" : "rgba(253,248,240,0.06)", border: `1px solid ${active ? t.accent + "60" : "rgba(253,248,240,0.10)"}`, display: "flex", alignItems: "center", justifyContent: "center", color: active ? t.accent : "rgba(253,248,240,0.35)", marginBottom: "20px", transition: "all .28s" }}>
                    {t.icon}
                  </div>

                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: active ? t.accent : "rgba(253,248,240,0.40)", marginBottom: "8px" }}>
                    {t.name}
                  </p>

                  <div style={{ display: "flex", alignItems: "baseline", gap: "5px", marginBottom: "6px" }}>
                    <span style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "clamp(2.2rem,4vw,3rem)", fontWeight: 900, color: "var(--cream)", lineHeight: 1 }}>
                      {t.price}
                    </span>
                    {t.period && <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--muted)" }}>{t.period}</span>}
                  </div>

                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: active ? t.accent : "rgba(253,248,240,0.30)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, marginBottom: "24px" }}>
                    {t.tag}
                  </p>

                  {/* Divider */}
                  <div style={{ height: 1, background: active ? t.accent + "30" : "rgba(253,248,240,0.06)", marginBottom: "20px" }} />

                  {/* Features */}
                  <ul style={{ display: "flex", flexDirection: "column", gap: "11px", margin: 0, padding: 0, listStyle: "none" }}>
                    {t.features.map((f) => (
                      <li key={f.label} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <div style={{ width: 16, height: 16, borderRadius: "50%", flexShrink: 0, marginTop: "1px", background: f.included ? (active ? t.accent + "30" : "rgba(76,209,151,0.15)") : "rgba(253,248,240,0.05)", border: `1px solid ${f.included ? (active ? t.accent + "70" : "rgba(76,209,151,0.40)") : "rgba(253,248,240,0.10)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {f.included
                            ? <Check size={8} style={{ color: active ? t.accent : "#4CD197" }} />
                            : <span style={{ fontSize: "8px", color: "rgba(253,248,240,0.20)", lineHeight: 1 }}>—</span>
                          }
                        </div>
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: "12.5px", color: f.included ? (active ? "rgba(253,248,240,0.85)" : "rgba(253,248,240,0.65)") : "rgba(253,248,240,0.25)", lineHeight: 1.5, fontWeight: f.included ? 400 : 300 }}>
                          {f.label}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Select button */}
                  <button
                    onClick={e => { e.stopPropagation(); setSelectedTier(t.id); }}
                    style={{
                      marginTop: "28px", width: "100%",
                      padding: "11px 0", borderRadius: "10px",
                      border: `1.5px solid ${active ? t.accent : "rgba(253,248,240,0.15)"}`,
                      background: active ? t.accent : "transparent",
                      color: active ? "white" : "rgba(253,248,240,0.55)",
                      fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 600,
                      letterSpacing: "0.08em", cursor: "pointer",
                      transition: "all .2s",
                    }}
                  >
                    {active ? "Selected ✓" : `Choose ${t.name}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ FORM / SIGN-IN GATE ═══════ */}
      <section style={{ background: "var(--bg)", padding: "80px 0 120px" }}>
        <div className="container">
          <div style={{ maxWidth: 640, margin: "0 auto" }}>

            {/* Not signed in */}
            {isLoaded && !isSignedIn && (
              <div style={{ textAlign: "center", padding: "56px 40px", borderRadius: "24px", background: "var(--card)", border: "1px solid rgba(253,248,240,0.08)" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(184,43,88,0.35)", margin: "0 auto 24px" }}>
                  <Image src="/logo.jpg" alt="Laliguras" width={64} height={64} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <h2 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 700, color: "var(--cream)", marginBottom: "10px" }}>
                  Sign in to complete your membership
                </h2>
                <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: 1.75, maxWidth: 360, margin: "0 auto 32px" }}>
                  Create a free account or sign in to join Laliguras and unlock your{" "}
                  <span style={{ color: tier.accent, fontWeight: 600 }}>{tier.name}</span> benefits.
                </p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                  <Link href={`/sign-up?tier=${selectedTier}`} className="btn btn-primary btn-lg">
                    Create Free Account <ArrowRight size={16} />
                  </Link>
                  <Link href={`/sign-in?tier=${selectedTier}`} className="btn btn-outline btn-lg">Sign In</Link>
                </div>
              </div>
            )}

            {/* Signed in — multi-step form */}
            {isLoaded && isSignedIn && (
              <div>

                {/* ── Progress steps ── */}
                <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "48px" }}>
                  {STEPS.map((s, i) => (
                    <div key={s.label} style={{ display: "flex", alignItems: "flex-start", flex: i < STEPS.length - 1 ? 1 : 0 }}>
                      {/* Circle + label */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: "50%",
                          background: i < step ? "var(--rose)" : i === step ? "rgba(184,43,88,0.18)" : "var(--card)",
                          border: `2px solid ${i <= step ? "var(--rose)" : "rgba(253,248,240,0.12)"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 700,
                          color: i < step ? "white" : i === step ? "var(--rose-light)" : "rgba(253,248,240,0.30)",
                          transition: "all .3s",
                          boxShadow: i === step ? "0 0 0 4px rgba(184,43,88,0.12)" : "none",
                        }}>
                          {i < step ? <Check size={14} /> : i + 1}
                        </div>
                        <span style={{
                          fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 600,
                          letterSpacing: "0.08em", textTransform: "uppercase",
                          color: i <= step ? "var(--petal)" : "rgba(253,248,240,0.28)",
                          whiteSpace: "nowrap", transition: "color .3s",
                        }}>
                          {s.short}
                        </span>
                      </div>
                      {/* Connector line — between steps */}
                      {i < STEPS.length - 1 && (
                        <div style={{ flex: 1, height: 2, background: i < step ? "var(--rose)" : "rgba(253,248,240,0.10)", margin: "17px 10px 0", borderRadius: 1, transition: "background .3s" }} />
                      )}
                    </div>
                  ))}
                </div>

                {/* ── Step 0: Personal Info ── */}
                {step === 0 && (
                  <div style={{ background: "var(--card)", border: "1px solid rgba(253,248,240,0.08)", borderRadius: "20px", padding: "40px" }}>
                    <h2 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "1.75rem", fontWeight: 700, color: "var(--cream)", marginBottom: "6px" }}>
                      Personal Details
                    </h2>
                    <p style={{ color: "var(--muted)", fontSize: "13px", marginBottom: "32px" }}>Tell us a little about yourself</p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }} className="form-grid">
                      {[
                        { key: "name",  label: "Full Name",      placeholder: "Your full name",         type: "text",  required: true  },
                        { key: "email", label: "Email Address",   placeholder: "you@example.com",        type: "email", required: true  },
                        { key: "phone", label: "Phone Number",    placeholder: "+82 42-000-0000",        type: "tel",   required: false },
                        { key: "city",  label: "City / Country",  placeholder: "Daejeon, South Korea",   type: "text",  required: false },
                      ].map(f => (
                        <div key={f.key}>
                          <label className="form-label">{f.label}{f.required && <span style={{ color: "var(--rose-light)", marginLeft: 3 }}>*</span>}</label>
                          <input
                            type={f.type}
                            className="form-input"
                            placeholder={f.placeholder}
                            value={form[f.key as keyof typeof form]}
                            onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                          />
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => form.name && form.email && setStep(1)}
                      className="btn btn-primary"
                      style={{ marginTop: "28px", opacity: form.name && form.email ? 1 : 0.4, display: "inline-flex", alignItems: "center", gap: "8px" }}
                    >
                      Continue <ArrowRight size={15} />
                    </button>
                  </div>
                )}

                {/* ── Step 1: Confirm Tier ── */}
                {step === 1 && (
                  <div style={{ background: "var(--card)", border: "1px solid rgba(253,248,240,0.08)", borderRadius: "20px", padding: "40px" }}>
                    <h2 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "1.75rem", fontWeight: 700, color: "var(--cream)", marginBottom: "6px" }}>
                      Confirm Your Plan
                    </h2>
                    <p style={{ color: "var(--muted)", fontSize: "13px", marginBottom: "28px" }}>You can change this at any time from your dashboard.</p>

                    {/* Selected tier summary */}
                    <div style={{ background: `linear-gradient(135deg, ${tier.accentDim}, rgba(6,3,10,0.8))`, border: `1px solid ${tier.accent}40`, borderRadius: "14px", padding: "24px 28px", marginBottom: "20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                        <div style={{ color: tier.accent }}>{tier.icon}</div>
                        <div>
                          <p style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "1.15rem", fontWeight: 700, color: "var(--cream)" }}>{tier.name}</p>
                          <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: tier.accent }}>{tier.price}{tier.period}</p>
                        </div>
                        <div style={{ marginLeft: "auto" }}>
                          <Star size={14} style={{ color: tier.accent }} />
                        </div>
                      </div>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "rgba(253,248,240,0.45)", lineHeight: 1.6 }}>
                        Unlocks: {tier.unlocks.length} feature{tier.unlocks.length !== 1 ? "s" : ""} including {tier.features.filter(f => f.included).slice(0, 2).map(f => f.label).join(", ")} and more.
                      </p>
                    </div>

                    {/* Switch tier options */}
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "rgba(253,248,240,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>Switch plan</p>
                    <div style={{ display: "flex", gap: "10px", marginBottom: "28px" }}>
                      {TIERS.map(t => (
                        <button key={t.id} onClick={() => setSelectedTier(t.id)} style={{ flex: 1, padding: "10px 0", borderRadius: "10px", border: `1.5px solid ${selectedTier === t.id ? t.accent : "rgba(253,248,240,0.10)"}`, background: selectedTier === t.id ? t.accent + "20" : "transparent", color: selectedTier === t.id ? t.accent : "rgba(253,248,240,0.40)", fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", cursor: "pointer", transition: "all .2s" }}>
                          {t.name}
                        </button>
                      ))}
                    </div>

                    <div style={{ display: "flex", gap: "12px" }}>
                      <button onClick={() => setStep(0)} className="btn btn-ghost">← Back</button>
                      <button onClick={() => setStep(2)} className="btn btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                        Continue <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Step 2: Interests ── */}
                {step === 2 && (
                  <div style={{ background: "var(--card)", border: "1px solid rgba(253,248,240,0.08)", borderRadius: "20px", padding: "40px" }}>
                    <h2 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "1.75rem", fontWeight: 700, color: "var(--cream)", marginBottom: "6px" }}>
                      Botanical Interests
                    </h2>
                    <p style={{ color: "var(--muted)", fontSize: "13px", marginBottom: "28px" }}>Help us personalise your experience. Select all that apply.</p>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "32px" }}>
                      {INTERESTS.map((interest) => {
                        const sel = selectedInterests.includes(interest);
                        return (
                          <button
                            key={interest}
                            onClick={() => toggleInterest(interest)}
                            style={{
                              padding: "8px 18px", borderRadius: "999px",
                              border: `1.5px solid ${sel ? tier.accent : "rgba(253,248,240,0.12)"}`,
                              background: sel ? tier.accentDim : "transparent",
                              color: sel ? tier.accent : "rgba(253,248,240,0.55)",
                              fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: sel ? 600 : 400,
                              cursor: "pointer", transition: "all .18s",
                            }}
                          >
                            {interest}
                          </button>
                        );
                      })}
                    </div>

                    <div style={{ display: "flex", gap: "12px" }}>
                      <button onClick={() => setStep(1)} className="btn btn-ghost">← Back</button>
                      <button onClick={() => setStep(3)} className="btn btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                        Review & Confirm <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Step 3: Review ── */}
                {step === 3 && (
                  <div style={{ background: "var(--card)", border: "1px solid rgba(253,248,240,0.08)", borderRadius: "20px", padding: "40px" }}>
                    <h2 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "1.75rem", fontWeight: 700, color: "var(--cream)", marginBottom: "6px" }}>
                      Almost There
                    </h2>
                    <p style={{ color: "var(--muted)", fontSize: "13px", marginBottom: "28px" }}>Review your details before confirming.</p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
                      {[
                        { label: "Name",       value: form.name },
                        { label: "Email",      value: form.email },
                        { label: "Phone",      value: form.phone || "—" },
                        { label: "City",       value: form.city  || "—" },
                        { label: "Membership", value: `${tier.name} — ${tier.price}${tier.period}` },
                      ].map(({ label, value }) => (
                        <div key={label} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "14px 18px", borderRadius: "12px", background: "rgba(253,248,240,0.03)", border: "1px solid rgba(253,248,240,0.07)" }}>
                          <span style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(253,248,240,0.35)", minWidth: "72px" }}>{label}</span>
                          <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: label === "Membership" ? tier.accent : "var(--cream)", fontWeight: label === "Membership" ? 600 : 400 }}>{value}</span>
                        </div>
                      ))}
                      {selectedInterests.length > 0 && (
                        <div style={{ padding: "14px 18px", borderRadius: "12px", background: "rgba(253,248,240,0.03)", border: "1px solid rgba(253,248,240,0.07)" }}>
                          <span style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(253,248,240,0.35)", display: "block", marginBottom: "10px" }}>Interests</span>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                            {selectedInterests.map(i => (
                              <span key={i} style={{ padding: "3px 12px", borderRadius: "999px", background: tier.accentDim, border: `1px solid ${tier.accent}40`, fontFamily: "var(--font-sans)", fontSize: "11px", color: tier.accent }}>{i}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <p style={{ fontSize: "11.5px", color: "rgba(253,248,240,0.35)", marginBottom: "24px", lineHeight: 1.7 }}>
                      By joining, you agree to our{" "}
                      <Link href="/terms" style={{ color: "var(--petal)" }}>Terms of Service</Link> and{" "}
                      <Link href="/privacy" style={{ color: "var(--petal)" }}>Privacy Policy</Link>.
                    </p>

                    <div style={{ display: "flex", gap: "12px" }}>
                      <button onClick={() => setStep(2)} className="btn btn-ghost">← Back</button>
                      <button
                        onClick={handleSubmit}
                        className="btn btn-primary"
                        style={{ flex: 1, justifyContent: "center", display: "inline-flex", alignItems: "center", gap: "8px", background: tier.accent, borderColor: tier.accent }}
                      >
                        <Leaf size={15} /> Complete Membership
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        </div>
      </section>

      <style jsx global>{`
        @media(max-width:700px){
          .join-grid { grid-template-columns: 1fr !important; }
          .form-grid  { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <p style={{ color: "var(--muted)", fontFamily: "var(--font-sans)" }}>Loading…</p>
      </div>
    }>
      <JoinForm />
    </Suspense>
  );
}
