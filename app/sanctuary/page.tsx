"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Leaf, Bell, BookOpen, Calendar, Plus, Check, Trash2, Star,
  ChevronRight, LayoutDashboard, Library, Users, PenTool,
  X, Camera, Sprout, Crown, Lock, ArrowRight,
} from "lucide-react";
import { useFlowerPool, pick } from "@/lib/useFlowerPool";
import { useUser } from "@clerk/nextjs";

/* ── Avatar component (outside SanctuaryPage to avoid "component created during render") ── */
function Avatar({ size = 42, profileImg, initial }: { size?: number; profileImg: string | null; initial: string }) {
  return profileImg ? (
    <img
      src={profileImg}
      alt="Profile"
      style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--rose)", flexShrink: 0 }}
    />
  ) : (
    <div
      style={{ width: size, height: size, borderRadius: "50%", background: "var(--rose)", border: "2px solid var(--rose-light)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: size * 0.42, fontWeight: 700, color: "white", flexShrink: 0 }}
    >
      {initial}
    </div>
  );
}

/* ─────────────────────────── STATIC DATA ──────────────────────────── */
const TRACKED_PLANTS = [
  { name: "Rhododendron 'Pink Pearl'", collection: "Laliguras Collection", status: "Blooming",      daysLeft: 8,    type: "rhododendron" },
  { name: "Peonia 'Sarah Bernhardt'",  collection: "Heritage Peonies",     status: "Transplanting", daysLeft: null, type: "peony"        },
  { name: "Himalayan Lily",            collection: "Alpine Collection",     status: "Budding",       daysLeft: 14,   type: "lily"         },
  { name: "Siberian Iris",             collection: "Spring Garden",         status: "Blooming",      daysLeft: 5,    type: "iris"         },
];

const MEETINGS = [
  { title: "Spring Bloom Walk — Woosong Campus",    date: "Apr 14", host: "Marcus Chen",     attending: 18 },
  { title: "Daejeon Flower Photography Session",    date: "Apr 20", host: "Dr. Elara Vance", attending: 24 },
  { title: "Seed Exchange Workshop",                date: "May 3",  host: "Aisha Rajan",     attending: 12 },
];

const INIT_TASKS = [
  { task: "Prune Hydrangeas",  desc: "Cut back by one-third before new growth",       done: false },
  { task: "Mulch Peonies",     desc: "Apply 2-inch layer around base",                done: false },
  { task: "Divide Hostas",     desc: "Soft roots are ideal for division now",          done: true  },
  { task: "Fertilize Roses",   desc: "Use balanced slow-release fertilizer",           done: false },
  { task: "Water Orchids",     desc: "Once weekly, let soil dry between waterings",    done: true  },
];

const SAVED_GEMS = [
  { name: "Casa Blanca Lily", type: "lily",  tag: "Alpine"   },
  { name: "Siberian Iris",    type: "iris",  tag: "Spring"   },
  { name: "Himalayan Rose",   type: "rose",  tag: "Heritage" },
];

const NOTIFICATIONS = [
  { id: 1, msg: "Spring Bloom Walk is tomorrow — 40 members joining!",     time: "2h ago", dot: "var(--rose)"  },
  { id: 2, msg: "Your Rhododendron report was liked by 12 members.",        time: "5h ago", dot: "var(--gold)"  },
  { id: 3, msg: "New story published: 'Peonies in Daejeon Spring'.",        time: "1d ago", dot: "var(--petal)" },
];

const STATUS_COLOR: Record<string, string> = {
  Blooming:      "var(--rose)",
  Transplanting: "var(--gold)",
  Budding:       "#4CD197",
};

const TASK_KEY       = "lg_sanctuary_tasks";
const MEMBERSHIP_KEY = "lg_membership";

type Membership = {
  tier:      string;
  name:      string;
  email:     string;
  joinedAt:  string;
  status:    string;
  unlocks:   string[];
};

type LucideIcon = React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
const TIER_META: Record<string, { label: string; color: string; bg: string; Icon: LucideIcon }> = {
  seedling: { label: "Seedling",  color: "#4CD197",  bg: "rgba(76,209,151,0.12)",  Icon: Sprout },
  gardener: { label: "Gardener",  color: "#D14E72",  bg: "rgba(184,43,88,0.12)",   Icon: Leaf   },
  curator:  { label: "Curator",   color: "#C4A23C",  bg: "rgba(196,162,60,0.12)",  Icon: Crown  },
};

/* ── Shown when a feature requires a higher tier ── */
function UpgradeBanner({ feature, requiredTier }: { feature: string; requiredTier: string }) {
  const meta = TIER_META[requiredTier] ?? TIER_META.gardener;
  const Icon: LucideIcon = meta.Icon;
  return (
    <div style={{
      padding: "52px 36px", textAlign: "center",
      border: "1px dashed rgba(184,43,88,0.25)", borderRadius: 14,
      background: "rgba(184,43,88,0.04)",
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: "50%",
        background: meta.bg, border: `1px solid ${meta.color}40`,
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 18px",
      }}>
        <Lock size={22} style={{ color: meta.color }} />
      </div>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 700, color: "var(--cream)", marginBottom: 8 }}>
        {feature} Locked
      </h3>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted)", lineHeight: 1.65, maxWidth: 360, margin: "0 auto 24px" }}>
        This feature is available for <strong style={{ color: meta.color }}>{meta.label}</strong> members and above.
        Upgrade your membership to unlock it.
      </p>
      <a href="/join" style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "11px 24px", borderRadius: 10,
        background: `linear-gradient(135deg, ${meta.color}22, ${meta.color}11)`,
        border: `1px solid ${meta.color}55`,
        color: meta.color, fontFamily: "var(--font-sans)",
        fontSize: 12, fontWeight: 600, letterSpacing: "0.04em",
        textDecoration: "none",
      }}>
        <Icon size={13} /> Upgrade to {meta.label} <ArrowRight size={13} />
      </a>
    </div>
  );
}

/* ─────────────────────────── PAGE ─────────────────────────────────── */
export default function SanctuaryPage() {
  const pool = useFlowerPool(["rhododendron","peony","lily","iris","rose","orchid","dahlia","tulip"]);
  const { user } = useUser();

  const [tasks, setTasks]       = useState(() => {
    if (typeof window === "undefined") return INIT_TASKS;
    try {
      const saved = localStorage.getItem(TASK_KEY);
      return saved ? (JSON.parse(saved) as typeof INIT_TASKS) : INIT_TASKS;
    } catch { return INIT_TASKS; }
  });
  const [newTask, setNewTask]   = useState("");
  const [activeNav, setActiveNav] = useState("dashboard");
  const [showNotif, setShowNotif] = useState(false);
  const [rsvped, setRsvped]     = useState<Record<number, boolean>>({});
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [membership, setMembership] = useState<Membership | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const notifRef     = useRef<HTMLDivElement>(null);

  /* user — from Clerk, fall back to defaults */
  const userName    = user?.fullName || user?.firstName || "Member";
  const userEmail   = user?.emailAddresses?.[0]?.emailAddress || "";
  const userInitial = userName.charAt(0).toUpperCase();

  /* Load saved profile image from localStorage, fallback to Clerk avatar */
  useEffect(() => {
    const saved = localStorage.getItem("lg_profile_img");
    if (saved) {
      setProfileImg(saved);
    } else if (user?.imageUrl) {
      setProfileImg(user.imageUrl);
    }
  }, [user]);

  /* Load membership tier from localStorage */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(MEMBERSHIP_KEY);
      if (raw) setMembership(JSON.parse(raw) as Membership);
    } catch { /* ignore */ }

    const onUpdate = () => {
      try {
        const raw = localStorage.getItem(MEMBERSHIP_KEY);
        if (raw) setMembership(JSON.parse(raw) as Membership);
      } catch { /* ignore */ }
    };
    window.addEventListener("lg_membership_updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("lg_membership_updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  /* persist tasks — write only; read via lazy useState initializer above */
  useEffect(() => {
    localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
  }, [tasks]);

  /* close notif on outside click */
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* task helpers */
  const toggleTask = (i: number) =>
    setTasks((p) => p.map((t, idx) => idx === i ? { ...t, done: !t.done } : t));
  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks((p) => [...p, { task: newTask.trim(), desc: "", done: false }]);
    setNewTask("");
  };
  const deleteTask = (i: number) => setTasks((p) => p.filter((_, idx) => idx !== i));
  const completedCount = tasks.filter((t) => t.done).length;

  /* tier helpers */
  const tier           = membership?.tier ?? "seedling";
  const tierMeta       = TIER_META[tier] ?? TIER_META.seedling;
  const TierIcon       = tierMeta.Icon;
  const isGardenerPlus = tier === "gardener" || tier === "curator";
  const isCurator      = tier === "curator";

  /* profile photo — read as base64 so it survives page refresh */
  const handleProfilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const b64 = reader.result as string;
      setProfileImg(b64);
      localStorage.setItem("lg_profile_img", b64);
      window.dispatchEvent(new Event("lg_profile_updated"));
    };
    reader.readAsDataURL(file);
  };

  /* nav items */
  const navItems = [
    { id: "dashboard", Icon: LayoutDashboard, label: "Dashboard"      },
    { id: "plants",    Icon: Leaf,            label: "Plant Library"  },
    { id: "meetings",  Icon: Users,           label: "Meetings"       },
    { id: "tasks",     Icon: PenTool,         label: "Seasonal Tasks" },
  ];

  /* ──────────────────────────────────────────────────────────
     PANEL: DASHBOARD
  ────────────────────────────────────────────────────────── */
  const renderDashboard = () => (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* ── left col ── */}
      <div className="lg:col-span-2 space-y-8">

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-5">
          {[
            { label: "Plants Tracked", value: TRACKED_PLANTS.length,                              Icon: Leaf     },
            { label: "Tasks Done",     value: `${completedCount}/${tasks.length}`,                Icon: Check    },
            { label: "Events RSVP'd", value: Object.values(rsvped).filter(Boolean).length,       Icon: Calendar },
          ].map(({ label, value, Icon }) => (
            <div key={label} className="card" style={{ padding: "24px", textAlign: "center" }}>
              <div style={{ color: "var(--petal)", display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                <Icon size={20} />
              </div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, color: "var(--cream)", lineHeight: 1 }}>{value}</p>
              <p className="t-caption" style={{ marginTop: "6px" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Plant tracker (compact) */}
        {renderPlants(true)}

        {/* Tasks (compact) */}
        {renderTasks(true)}
      </div>

      {/* ── right col ── */}
      <div className="space-y-6">
        {renderMeetings(true)}
        {renderSavedGems()}
        {renderQuickLinks()}
      </div>
    </div>
  );

  /* ──────────────────────────────────────────────────────────
     PANEL: PLANTS
  ────────────────────────────────────────────────────────── */
  const renderPlants = (compact = false) => {
    /* Full plant library (non-compact) requires Gardener+ */
    if (!compact && !isGardenerPlus) {
      return (
        <div className="card" style={{ padding: "36px" }}>
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="t-h3" style={{ color: "var(--cream)" }}>My Garden Tracker</h2>
              <p className="t-caption" style={{ marginTop: "6px" }}>Full plant library access</p>
            </div>
          </div>
          <UpgradeBanner feature="Full Plant Library" requiredTier="gardener" />
        </div>
      );
    }
    return (
      <div className="card" style={{ padding: "36px" }}>
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="t-h3" style={{ color: "var(--cream)" }}>My Garden Tracker</h2>
            <p className="t-caption" style={{ marginTop: "6px" }}>{TRACKED_PLANTS.length} plants being monitored</p>
          </div>
          {isGardenerPlus && (
            <button
              className="btn btn-primary btn-sm flex items-center gap-2"
              onClick={() => { window.location.href = "/plants"; }}
            >
              <Plus size={13} /> Add Plant
            </button>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {(compact ? TRACKED_PLANTS.slice(0, 2) : TRACKED_PLANTS).map((plant) => (
            <div
              key={plant.name}
              className="overflow-hidden"
              style={{ border: "1px solid var(--border-s)", borderRadius: "10px", background: "var(--bg)" }}
            >
              {/* image */}
              <div style={{ height: "168px", position: "relative", overflow: "hidden" }}>
                <img
                  src={pick(pool, plant.type)}
                  alt={plant.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .4s ease" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(6,3,10,0.75) 0%, transparent 55%)" }} />
                <span
                  className="absolute t-caption"
                  style={{ top: "12px", left: "12px", padding: "4px 12px", borderRadius: "999px", background: STATUS_COLOR[plant.status] ?? "var(--rose)", color: "white", fontWeight: 600 }}
                >
                  {plant.status}
                </span>
              </div>
              {/* info */}
              <div style={{ padding: "18px 20px" }}>
                <p className="t-small" style={{ color: "var(--cream)", fontWeight: 600, fontFamily: "var(--font-display)" }}>{plant.name}</p>
                <p className="t-caption" style={{ marginTop: "4px" }}>{plant.collection}</p>
                {plant.daysLeft && (
                  <p className="t-caption" style={{ marginTop: "8px", color: "var(--petal)" }}>🌸 Blooms in {plant.daysLeft} days</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {compact && (
          <button
            onClick={() => setActiveNav("plants")}
            className="t-caption"
            style={{ marginTop: "20px", color: "var(--rose-light)", background: "none", border: "none", display: "block" }}
          >
            View all plants →
          </button>
        )}
      </div>
    );
  };

  /* ──────────────────────────────────────────────────────────
     PANEL: TASKS
  ────────────────────────────────────────────────────────── */
  const renderTasks = (compact = false) => (
    <div className="card" style={{ padding: "36px" }}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="t-h3" style={{ color: "var(--cream)" }}>Seasonal Tasks</h2>
          <p className="t-caption" style={{ marginTop: "6px" }}>{tasks.length - completedCount} remaining this season</p>
        </div>
        <span className="badge">{completedCount}/{tasks.length} done</span>
      </div>

      {/* Progress bar */}
      <div style={{ height: "5px", background: "var(--border-s)", borderRadius: "3px", marginBottom: "28px" }}>
        <div
          style={{
            height: "100%",
            width: tasks.length ? `${(completedCount / tasks.length) * 100}%` : "0%",
            background: "linear-gradient(90deg, var(--rose), var(--rose-light))",
            borderRadius: "3px",
            transition: "width .4s ease",
          }}
        />
      </div>

      {/* Task list */}
      <div style={{ marginBottom: compact ? "16px" : "28px" }}>
        {(compact ? tasks.slice(0, 3) : tasks).map((task, i) => (
          <div
            key={i}
            className="flex items-start gap-4"
            style={{ padding: "13px 14px", borderRadius: "8px", transition: "background .15s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
          >
            {/* checkbox */}
            <button
              onClick={() => toggleTask(i)}
              style={{
                width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0, marginTop: "2px",
                background: task.done ? "var(--rose)" : "transparent",
                border: `2px solid ${task.done ? "var(--rose)" : "var(--border-s)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all .2s",
              }}
            >
              {task.done && <Check size={11} color="white" />}
            </button>

            <div className="flex-1 min-w-0">
              <p
                className="t-small"
                style={{ color: task.done ? "var(--dim)" : "var(--cream)", textDecoration: task.done ? "line-through" : "none", fontWeight: 500 }}
              >
                {task.task}
              </p>
              {task.desc && <p className="t-caption" style={{ marginTop: "3px" }}>{task.desc}</p>}
            </div>

            <button
              onClick={() => deleteTask(i)}
              style={{ color: "var(--dim)", background: "none", border: "none", padding: "2px", transition: "color .2s", flexShrink: 0 }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#ff7a7a")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--dim)")}
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      {/* Add task input — Gardener+ only */}
      {!compact && isGardenerPlus ? (
        <div className="flex gap-3">
          <input
            type="text"
            className="form-input flex-1"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <button onClick={addTask} className="btn btn-primary btn-sm" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Plus size={14} /> Add
          </button>
        </div>
      ) : !compact && !isGardenerPlus ? (
        <div style={{ marginTop: 8, padding: "12px 16px", borderRadius: 10, background: "rgba(184,43,88,0.06)", border: "1px dashed rgba(184,43,88,0.2)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Lock size={13} style={{ color: "var(--rose-light)", flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--muted)" }}>
              Add &amp; manage tasks requires <strong style={{ color: "var(--rose-light)" }}>Gardener</strong> membership
            </span>
          </div>
          <a href="/join" style={{ fontSize: 11, color: "var(--rose-light)", fontFamily: "var(--font-sans)", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
            Upgrade →
          </a>
        </div>
      ) : (
        <button
          onClick={() => setActiveNav("tasks")}
          className="t-caption"
          style={{ color: "var(--rose-light)", background: "none", border: "none" }}
        >
          View all tasks →
        </button>
      )}
    </div>
  );

  /* ──────────────────────────────────────────────────────────
     PANEL: MEETINGS
  ────────────────────────────────────────────────────────── */
  const renderMeetings = (compact = false) => (
    <div className="card" style={{ padding: "32px" }}>
      <div className="flex items-center justify-between mb-7">
        <h3 className="t-h3" style={{ color: "var(--cream)" }}>Upcoming Meetings</h3>
        <Link href="/events" className="t-caption" style={{ color: "var(--rose-light)" }}>View all</Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {(compact ? MEETINGS.slice(0, 2) : MEETINGS).map((m, idx) => (
          <div
            key={m.title}
            style={{ padding: "18px 20px", background: "rgba(255,255,255,0.03)", borderRadius: "10px", border: "1px solid var(--border-s)" }}
          >
            <div className="flex items-start gap-4">
              {/* date badge */}
              <div
                style={{
                  width: "48px", height: "52px", borderRadius: "8px",
                  background: "var(--rose-glow)", border: "1px solid var(--border)",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--petal)", fontFamily: "var(--font-sans)", fontWeight: 600 }}>
                  {m.date.split(" ")[0]}
                </span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 700, color: "var(--cream)", lineHeight: 1, marginTop: "2px" }}>
                  {m.date.split(" ")[1]}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="t-small" style={{ color: "var(--cream)", fontWeight: 600 }}>{m.title}</p>
                <p className="t-caption" style={{ marginTop: "4px" }}>Hosted by {m.host}</p>
                <p className="t-caption" style={{ marginTop: "2px" }}>{m.attending} attending</p>
              </div>
            </div>

            <div className="flex justify-end" style={{ marginTop: "14px" }}>
              <button
                onClick={() => setRsvped((p) => ({ ...p, [idx]: !p[idx] }))}
                className={`btn btn-sm ${rsvped[idx] ? "btn-outline" : "btn-primary"}`}
                style={{ minWidth: "90px" }}
              >
                {rsvped[idx] ? "✓ RSVP'd" : "RSVP"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ──────────────────────────────────────────────────────────
     SAVED GEMS
  ────────────────────────────────────────────────────────── */
  const renderSavedGems = () => (
    <div className="card" style={{ padding: "28px" }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="t-h3" style={{ color: "var(--cream)" }}>Saved Flowers</h3>
        <Star size={15} style={{ color: isGardenerPlus ? "var(--gold)" : "var(--dim)" }} />
      </div>

      {!isGardenerPlus ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(196,162,60,0.1)", border: "1px solid rgba(196,162,60,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <Lock size={16} style={{ color: "#C4A23C" }} />
          </div>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--muted)", marginBottom: 14, lineHeight: 1.6 }}>
            Save &amp; bookmark flowers requires <strong style={{ color: "#C4A23C" }}>Gardener</strong> membership
          </p>
          <a href="/join" style={{ fontSize: 11, color: "#C4A23C", fontFamily: "var(--font-sans)", fontWeight: 600, textDecoration: "none" }}>
            Upgrade to unlock →
          </a>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {SAVED_GEMS.map((gem) => (
              <div key={gem.name} className="flex items-center gap-3">
                <img
                  src={pick(pool, gem.type)}
                  alt={gem.name}
                  style={{ width: "54px", height: "54px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }}
                />
                <div className="flex-1 min-w-0">
                  <p className="t-small" style={{ color: "var(--cream)", fontWeight: 500 }}>{gem.name}</p>
                  <span style={{ display: "inline-block", marginTop: "4px", padding: "1px 9px", borderRadius: "999px", background: "var(--rose-glow)", color: "var(--petal)", fontSize: "10px", fontFamily: "var(--font-sans)" }}>
                    {gem.tag}
                  </span>
                </div>
                <Link href="/plants" className="t-caption" style={{ color: "var(--rose-light)", flexShrink: 0 }}>
                  View →
                </Link>
              </div>
            ))}
          </div>

          <Link
            href="/plants"
            className="block text-center t-caption"
            style={{ marginTop: "18px", paddingTop: "14px", borderTop: "1px solid var(--border-s)", color: "var(--muted)" }}
          >
            Explore Flower Library →
          </Link>
        </>
      )}
    </div>
  );

  /* ──────────────────────────────────────────────────────────
     QUICK LINKS
  ────────────────────────────────────────────────────────── */
  const renderQuickLinks = () => (
    <div className="card" style={{ padding: "24px" }}>
      <h3 className="t-h3 mb-4" style={{ color: "var(--cream)", fontSize: "1rem" }}>Quick Links</h3>
      <div>
        {[
          { label: "Flower Library",      href: "/plants",     Icon: Library  },
          { label: "Upcoming Events",     href: "/events",     Icon: Calendar },
          { label: "Community Garden",    href: "/community",  Icon: Users    },
          { label: "Botanical Editorial", href: "/newsletter", Icon: BookOpen },
        ].map(({ label, href, Icon }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-3 t-small"
            style={{ color: "var(--muted)", borderRadius: "6px", padding: "10px 12px", transition: "background .15s, color .15s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.color = "var(--cream)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--muted)"; }}
          >
            <Icon size={14} style={{ flexShrink: 0 }} />
            {label}
            <ChevronRight size={12} style={{ marginLeft: "auto", opacity: 0.4 }} />
          </Link>
        ))}
      </div>

      {/* Curator exclusive badge */}
      {isCurator && (
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border-s)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 12px", borderRadius: 8, background: "rgba(196,162,60,0.08)", border: "1px solid rgba(196,162,60,0.2)" }}>
            <Crown size={12} style={{ color: "#C4A23C", flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "#C4A23C", fontWeight: 600 }}>
              Curator — All features unlocked
            </span>
          </div>
        </div>
      )}
    </div>
  );

  /* ──────────────────────────────────────────────────────────
     ACTIVE PANEL SWITCH
  ────────────────────────────────────────────────────────── */
  const renderContent = () => {
    if (activeNav === "dashboard") return renderDashboard();
    if (activeNav === "plants")    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        {renderPlants(false)}
        {renderSavedGems()}
      </div>
    );
    if (activeNav === "meetings")  return renderMeetings(false);
    if (activeNav === "tasks")     return renderTasks(false);
    return null;
  };

  /* ──────────────────────────────────────────────────────────
     RENDER
  ────────────────────────────────────────────────────────── */
  return (
    <>
      {/* Push footer right by sidebar width — only on this page, md+ screens */}
      <style>{`
        @media (min-width: 768px) {
          body:has([data-sanctuary]) footer {
            margin-left: 268px;
          }
        }
      `}</style>
      <div data-sanctuary className="min-h-screen flex" style={{ background: "var(--bg)", paddingTop: "68px" }}>

      {/* hidden file input for profile photo */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleProfilePick}
        style={{ display: "none" }}
      />

      {/* ═══════════════════════════════ SIDEBAR ═══════════════════════════════ */}
      <aside
        className="hidden md:flex flex-col"
        style={{
          width: "268px",
          position: "fixed",
          left: 0,
          top: "68px",
          bottom: 0,
          background: "var(--surface)",
          borderRight: "1px solid var(--border-s)",
          overflowY: "auto",
          zIndex: 20,
        }}
      >
        {/* Profile section */}
        <div style={{ padding: "28px 24px", borderBottom: "1px solid var(--border-s)" }}>
          <div className="flex items-center gap-3" style={{ marginBottom: "16px" }}>

            {/* Avatar with camera button */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <Avatar size={50} profileImg={profileImg} initial={userInitial} />
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Change profile photo — pick from your gallery"
                style={{
                  position: "absolute",
                  bottom: "-2px",
                  right: "-4px",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: "var(--surface)",
                  border: "1.5px solid var(--rose-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Camera size={10} style={{ color: "var(--petal)" }} />
              </button>
            </div>

            <div className="min-w-0">
              <p className="t-small" style={{ color: "var(--cream)", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {userName}
              </p>
              {/* Tier badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  padding: "2px 8px", borderRadius: 99,
                  background: tierMeta.bg, border: `1px solid ${tierMeta.color}40`,
                }}>
                  <TierIcon size={9} style={{ color: tierMeta.color }} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: tierMeta.color, fontFamily: "var(--font-sans)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {tierMeta.label}
                  </span>
                </div>
                {!membership && (
                  <a href="/join" style={{ fontSize: 9, color: "var(--rose-light)", fontFamily: "var(--font-sans)", textDecoration: "none" }}>
                    Join →
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Season status card */}
          <div
            style={{
              padding: "12px 14px",
              background: "var(--rose-glow)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Leaf size={13} style={{ color: "var(--petal)" }} />
              <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--cream)", fontFamily: "var(--font-sans)", letterSpacing: "0.04em" }}>
                Late Spring Season
              </p>
            </div>
            <p className="t-caption">{tasks.length - completedCount} tasks remaining</p>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ padding: "16px 12px", flex: 1 }}>
          {navItems.map(({ id, Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveNav(id)}
              className="w-full flex items-center gap-3 t-small"
              style={{
                padding: "12px 14px",
                marginBottom: "4px",
                background:   activeNav === id ? "var(--rose-glow)"     : "transparent",
                color:        activeNav === id ? "var(--petal)"          : "var(--muted)",
                boxShadow:    activeNav === id ? "inset 3px 0 0 var(--rose-light)" : "none",
                borderRadius: "0 8px 8px 0",
                fontWeight:   activeNav === id ? 600 : 400,
                textAlign:    "left",
                outline:      "none",
                border:       "none",
                transition:   "background .2s, color .2s",
              }}
            >
              <Icon size={15} style={{ flexShrink: 0 }} />
              {label}
            </button>
          ))}
        </nav>

        {/* View Tasks CTA */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border-s)" }}>
          <button
            onClick={() => setActiveNav("tasks")}
            className="btn btn-primary"
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px" }}
          >
            <Sprout size={14} /> View Seasonal Tasks
          </button>
        </div>
      </aside>

      {/* ═══════════════════════════════ MAIN ══════════════════════════════════ */}
      <main style={{ flex: 1, marginLeft: "268px", minHeight: "100vh" }}>

        {/* Hero strip */}
        <div
          className="relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, var(--surface) 0%, rgba(184,43,88,0.09) 60%, var(--surface) 100%)",
            borderBottom: "1px solid var(--border-s)",
            padding: "52px 52px 44px",
          }}
        >
          {/* Subtle flower bg */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: 0.06 }}
          >
            <img src={pick(pool, "rose")} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(10px)" }} />
          </div>

          <div className="relative">
            <p
              className="t-caption"
              style={{ color: "var(--gold-light)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "10px" }}
            >
              🌸 Late Spring Conservatory
            </p>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                fontWeight: 800,
                color: "var(--cream)",
                lineHeight: 1.08,
              }}
            >
              The Sanctuary
            </h1>
            <p
              className="t-body"
              style={{ color: "var(--muted)", maxWidth: "500px", marginTop: "12px" }}
            >
              Your personal botanical dashboard — track plants, manage garden tasks,
              and stay connected with the Laliguras community.
            </p>

            {/* Membership tier pill */}
            {membership ? (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 20, padding: "8px 18px", borderRadius: 99, background: tierMeta.bg, border: `1px solid ${tierMeta.color}40` }}>
                <TierIcon size={13} style={{ color: tierMeta.color }} />
                <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700, color: tierMeta.color, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {tierMeta.label} Member
                </span>
                {!isGardenerPlus && (
                  <>
                    <span style={{ color: "var(--border-s)", fontSize: 12 }}>·</span>
                    <a href="/join" style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--rose-light)", fontWeight: 600, textDecoration: "none" }}>
                      Upgrade membership →
                    </a>
                  </>
                )}
              </div>
            ) : (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 20, padding: "8px 18px", borderRadius: 99, background: "rgba(184,43,88,0.08)", border: "1px dashed rgba(184,43,88,0.3)" }}>
                <Sprout size={13} style={{ color: "var(--rose-light)" }} />
                <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--muted)" }}>No active membership —</span>
                <a href="/join" style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--rose-light)", fontWeight: 600, textDecoration: "none" }}>
                  Join the club →
                </a>
              </div>
            )}
          </div>

          {/* Top-right actions */}
          <div
            className="absolute flex items-center gap-3"
            style={{ top: "40px", right: "52px" }}
          >
            {/* ── Notification bell ── */}
            <div ref={notifRef} style={{ position: "relative" }}>
              <button
                onClick={() => setShowNotif((p) => !p)}
                className="flex items-center justify-center relative"
                style={{
                  width: "44px", height: "44px", borderRadius: "50%",
                  background: "var(--surface)", border: "1px solid var(--border-s)",
                  transition: "border-color .2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--rose-light)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border-s)")}
              >
                <Bell size={17} style={{ color: showNotif ? "var(--petal)" : "var(--muted)" }} />
                {NOTIFICATIONS.length > 0 && (
                  <span
                    className="absolute"
                    style={{
                      top: "-3px", right: "-3px",
                      width: "19px", height: "19px",
                      borderRadius: "50%",
                      background: "var(--rose)",
                      color: "white", fontSize: "9px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--font-sans)", fontWeight: 700,
                      border: "2px solid var(--bg)",
                    }}
                  >
                    {NOTIFICATIONS.length}
                  </span>
                )}
              </button>

              {/* Notification dropdown */}
              {showNotif && (
                <div
                  style={{
                    position: "absolute",
                    top: "56px",
                    right: 0,
                    width: "330px",
                    background: "var(--surface)",
                    border: "1px solid var(--border-s)",
                    borderRadius: "12px",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.55)",
                    zIndex: 200,
                    overflow: "hidden",
                  }}
                >
                  {/* header */}
                  <div
                    className="flex items-center justify-between"
                    style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-s)" }}
                  >
                    <p className="t-small" style={{ color: "var(--cream)", fontWeight: 600 }}>Notifications</p>
                    <button
                      onClick={() => setShowNotif(false)}
                      style={{ color: "var(--muted)", background: "none", border: "none", display: "flex", alignItems: "center" }}
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {/* items */}
                  {NOTIFICATIONS.map((n) => (
                    <div
                      key={n.id}
                      className="flex items-start gap-3"
                      style={{ padding: "14px 20px", borderBottom: "1px solid var(--border-s)", transition: "background .15s", cursor: "default" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                    >
                      <span
                        style={{ width: "8px", height: "8px", borderRadius: "50%", background: n.dot, flexShrink: 0, marginTop: "6px" }}
                      />
                      <div className="flex-1">
                        <p className="t-small" style={{ color: "var(--cream)" }}>{n.msg}</p>
                        <p className="t-caption" style={{ marginTop: "4px", color: "var(--dim)" }}>{n.time}</p>
                      </div>
                    </div>
                  ))}

                  {/* footer */}
                  <div style={{ padding: "12px 20px" }}>
                    <button
                      className="t-caption"
                      style={{ color: "var(--rose-light)", background: "none", border: "none", width: "100%", textAlign: "center" }}
                      onClick={() => setShowNotif(false)}
                    >
                      Mark all as read
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Profile avatar (click to change photo) ── */}
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Change profile photo — pick from your gallery"
              style={{ border: "none", background: "none", padding: 0 }}
            >
              <Avatar size={44} profileImg={profileImg} initial={userInitial} />
            </button>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: "52px" }}>
          {renderContent()}
        </div>
      </main>
      </div>
    </>
  );
}
