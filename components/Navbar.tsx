"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { Menu, X, LogOut, Sprout } from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";

const LINKS = [
  { label: "Flowers",  href: "/plants"    },
  { label: "Events",   href: "/events"    },
  { label: "Members",  href: "/members"   },
  { label: "Stories",  href: "/stories"   },
  { label: "Journal",  href: "/blog"      },
  { label: "Garden",   href: "/gallery"   },
  { label: "About",    href: "/about"     },
];

/* ── Custom avatar with dropdown — reads from localStorage so profile
   photo updates in real-time when user changes it in /sanctuary ── */
function NavAvatar() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [img,  setImg]  = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* Load from localStorage, fall back to Clerk avatar */
  useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem("lg_profile_img");
      setImg(saved || user?.imageUrl || null);
    };
    load();
    /* same-tab updates (sanctuary dispatches this event after saving) */
    window.addEventListener("lg_profile_updated", load);
    /* cross-tab updates */
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("lg_profile_updated", load);
      window.removeEventListener("storage", load);
    };
  }, [user]);

  /* Close dropdown on outside click */
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const name    = user?.fullName || user?.firstName || "Member";
  const email   = user?.emailAddresses?.[0]?.emailAddress || "";
  const initial = name.charAt(0).toUpperCase();

  return (
    <div ref={ref} style={{ position: "relative", display: "flex", alignItems: "center" }}>
      {/* Avatar button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: 32, height: 32, borderRadius: "50%",
          border: "2px solid rgba(184,43,88,0.55)",
          overflow: "hidden", cursor: "pointer", padding: 0,
          background: img ? "none" : "var(--rose)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, transition: "border-color .2s",
        }}
        aria-label="Profile menu"
      >
        {img ? (
          <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ color: "white", fontSize: 13, fontWeight: 700, fontFamily: "var(--font-display)" }}>
            {initial}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 10px)", right: 0,
          background: "#130820",
          border: "1px solid rgba(184,43,88,0.22)",
          borderRadius: 12, padding: 6, minWidth: 190, zIndex: 9999,
          boxShadow: "0 20px 50px rgba(0,0,0,0.65)",
        }}>
          {/* User info */}
          <div style={{ padding: "10px 14px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 4 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#FDF8F0", fontFamily: "var(--font-sans)", marginBottom: 2 }}>
              {name}
            </p>
            <p style={{
              fontSize: 10, color: "rgba(253,248,240,0.42)", fontFamily: "var(--font-sans)",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {email}
            </p>
          </div>

          <Link
            href="/sanctuary"
            onClick={() => setOpen(false)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "9px 14px", borderRadius: 8,
              fontSize: 12, color: "#FDF8F0", fontFamily: "var(--font-sans)",
            }}
          >
            <Sprout size={13} style={{ color: "var(--petal)", flexShrink: 0 }} />
            My Garden
          </Link>

          <button
            onClick={() => { setOpen(false); signOut({ redirectUrl: "/" }); }}
            style={{
              display: "flex", alignItems: "center", gap: 8, width: "100%",
              padding: "9px 14px", borderRadius: 8,
              fontSize: 12, color: "#ff7a7a", fontFamily: "var(--font-sans)",
              background: "none", border: "none", cursor: "pointer", textAlign: "left",
            }}
          >
            <LogOut size={13} style={{ flexShrink: 0 }} />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const navRef   = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const lastY    = useRef(0);
  const [open,   setOpen]  = useState(false);
  const [solid,  setSolid] = useState(false);
  const { isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();

  useEffect(() => {
    const nav = navRef.current!;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 60);
      if (y > lastY.current && y > 120) {
        gsap.to(nav, { yPercent: -100, duration: 0.4, ease: "power2.inOut" });
      } else {
        gsap.to(nav, { yPercent: 0, duration: 0.35, ease: "power2.out" });
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: solid ? "rgba(6,3,10,0.95)" : "transparent",
        backdropFilter: solid ? "blur(24px)" : "none",
        borderBottom: solid ? "1px solid rgba(184,43,88,0.18)" : "1px solid transparent",
        transition: "background 0.5s, backdrop-filter 0.5s, border-color 0.5s",
      }}
    >
      <div className="container">
        <div style={{ height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "1.5px solid rgba(184,43,88,0.40)", boxShadow: "0 0 14px rgba(184,43,88,0.25)" }}>
              <Image src="/logo.jpg" alt="Laliguras Club" width={36} height={36} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div>
              <span style={{
                fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                fontSize: 18, fontWeight: 700, color: "var(--cream)",
                letterSpacing: "0.05em", display: "block", lineHeight: 1,
              }}>LALIGURAS</span>
              <span style={{
                fontFamily: "var(--font-sans)", fontSize: 8,
                letterSpacing: "0.28em", textTransform: "uppercase",
                color: "var(--muted)", display: "block", marginTop: 2,
              }}>Flower Society</span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-7">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative group"
                style={{
                  fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 500,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: pathname === link.href ? "var(--petal)" : "var(--muted)",
                  transition: "color .25s",
                }}
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 h-px transition-all duration-300" style={{
                  width: pathname === link.href ? "100%" : "0%",
                  background: "var(--rose-light)",
                }} />
              </Link>
            ))}
          </div>

          {/* Desktop right CTAs — all items use flexbox center alignment */}
          <div className="hidden lg:flex items-center gap-4" style={{ height: 68 }}>
            {isLoaded && isSignedIn ? (
              <NavAvatar />
            ) : isLoaded ? (
              <>
                <Link
                  href="/sign-in"
                  style={{
                    fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 500,
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    color: "var(--muted)", transition: "color .25s",
                    display: "flex", alignItems: "center",
                  }}
                >
                  Sign In
                </Link>
                <Link href="/join" className="btn btn-primary btn-sm">Join Club</Link>
              </>
            ) : null}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2"
            style={{ color: "var(--cream)", background: "none", border: "none" }}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div style={{
        background: "rgba(6,3,10,0.98)", backdropFilter: "blur(24px)",
        maxHeight: open ? "520px" : "0px", overflow: "hidden",
        transition: "max-height .4s cubic-bezier(0.25,0.46,0.45,0.94)",
        borderTop: open ? "1px solid var(--border-s)" : "none",
      }}>
        <div className="container py-5 flex flex-col gap-1">
          {LINKS.map((link) => (
            <Link
              key={link.href} href={link.href}
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded"
              style={{
                fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                fontSize: 22,
                fontWeight: pathname === link.href ? 700 : 500,
                color: pathname === link.href ? "var(--petal)" : "var(--cream)",
                transition: "color .2s",
              }}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-4 mt-3" style={{ borderTop: "1px solid var(--border-s)" }}>
            {isLoaded && isSignedIn ? (
              <>
                <Link href="/sanctuary" onClick={() => setOpen(false)} className="btn btn-outline btn-sm flex-1 justify-center">
                  My Garden
                </Link>
                <button
                  onClick={() => { setOpen(false); signOut({ redirectUrl: "/" }); }}
                  className="btn btn-primary btn-sm flex-1 justify-center"
                  style={{ background: "rgba(184,43,88,0.2)", borderColor: "rgba(184,43,88,0.3)", color: "#ff7a7a" }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/sign-in" onClick={() => setOpen(false)} className="btn btn-outline btn-sm flex-1 justify-center">Sign In</Link>
                <Link href="/join"    onClick={() => setOpen(false)} className="btn btn-primary btn-sm flex-1 justify-center">Join Club</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
