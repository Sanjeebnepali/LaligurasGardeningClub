"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowRight, MapPin, Mail, Phone, Clock } from "lucide-react";

const NAV = {
  Discover: [
    { label: "Flower Library", href: "/plants"    },
    { label: "Events",         href: "/events"    },
    { label: "Member Gallery", href: "/members"   },
    { label: "Photo Gallery",  href: "/gallery"   },
    { label: "Stories",        href: "/stories"   },
    { label: "Bloom Journal",  href: "/blog"      },
    { label: "About Us",       href: "/about"     },
  ],
  Membership: [
    { label: "Join the Club",     href: "/join"      },
    { label: "My Garden",         href: "/sanctuary" },
    { label: "Share a Story",     href: "/stories"   },
    { label: "Community Members", href: "/members"   },
    { label: "Beginners Guide",   href: "/beginners" },
  ],
  Help: [
    { label: "Contact Us",     href: "/contact" },
    { label: "Community",      href: "/community"},
    { label: "Newsletter",     href: "/newsletter"},
    { label: "Privacy Policy", href: "/privacy"  },
    { label: "Terms",          href: "/terms"    },
  ],
};

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/lali.garden?igsh=MXIybWl2NDFlYWFpOA==",
    color: "#E1306C",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  },
  {
    label: "WhatsApp",
    href: "https://chat.whatsapp.com/KZOYndKPyFt55rB30uSbo9",
    color: "#25D366",
    path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com",
    color: "#1877F2",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [done,  setDone]  = useState(false);

  const handleSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) { setDone(true); setEmail(""); }
  };

  return (
    <footer style={{ background: "var(--surface)", borderTop: "1px solid var(--border-s)" }}>

      {/* ── Newsletter band ── */}
      <div style={{ background: "var(--rose)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="container" style={{ paddingTop: "60px", paddingBottom: "60px" }}>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div style={{ maxWidth: "420px" }}>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: "10px" }}>
                Monthly Newsletter
              </div>
              <h3 style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "white", marginBottom: "8px", lineHeight: 1.2 }}>
                The Bloom Letter
              </h3>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
                Monthly floral insights, bloom calendars &amp; exclusive member invitations — straight to your inbox.
              </p>
            </div>
            <form onSubmit={handleSub} className="flex gap-3 w-full lg:w-auto" style={{ maxWidth: "440px" }}>
              {done ? (
                <div className="flex items-center gap-3 py-3">
                  <span style={{ fontSize: "1.5rem" }}>🌸</span>
                  <p style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "1.1rem", fontStyle: "italic", color: "rgba(255,255,255,0.9)" }}>
                    Welcome to the society!
                  </p>
                </div>
              ) : (
                <>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="form-input flex-1"
                    style={{ background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.25)", color: "white", minWidth: "220px" }}
                    required
                  />
                  <button type="submit" className="btn btn-outline" style={{ color: "white", borderColor: "rgba(255,255,255,0.45)", whiteSpace: "nowrap", flexShrink: 0 }}>
                    Subscribe <ArrowRight size={14} />
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* ── Main footer body ── */}
      <div className="container" style={{ paddingTop: "80px", paddingBottom: "64px" }}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 xl:gap-16">

          {/* Brand column */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              {/* Real club logo */}
              <div style={{ width: 52, height: 52, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid rgba(184,43,88,0.30)", boxShadow: "0 0 20px rgba(184,43,88,0.20)" }}>
                <Image src="/logo.jpg" alt="Laliguras Gardening Club" width={52} height={52} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div>
                <span style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)", fontSize: "20px", fontWeight: 800, color: "var(--cream)", display: "block", letterSpacing: "0.05em" }}>
                  LALIGURAS
                </span>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "10px", color: "var(--muted)", display: "block", marginTop: "1px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Gardening Club
                </span>
              </div>
            </div>

            <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--muted)", maxWidth: "300px", lineHeight: 1.75, marginBottom: "28px" }}>
              Where passionate flower lovers gather to celebrate the art and science of floral cultivation — from the Himalayas to every garden on earth.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 mb-8">
              {SOCIALS.map(({ label, href, color, path }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                  style={{ background: "rgba(253,248,240,0.06)", border: "1px solid var(--border-s)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = color + "22"; (e.currentTarget as HTMLElement).style.borderColor = color + "60"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(253,248,240,0.06)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border-s)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--muted)", transition: "color .2s" }}>
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>

            {/* Contact info */}
            <div className="space-y-3">
              {[
                { Icon: MapPin,  text: "Woosong University, Daejeon, South Korea" },
                { Icon: Mail,    text: "laligurasgardeningclub@gmail.com" },
                { Icon: Phone,   text: "+82 42-630-9000" },
                { Icon: Clock,   text: "Wed & Fri · 4–6 PM · Sat · 10 AM–1 PM" },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-start gap-2.5">
                  <Icon size={13} style={{ color: "var(--rose-light)", flexShrink: 0, marginTop: "3px" }} />
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--dim)", lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-10">
            {Object.entries(NAV).map(([cat, links]) => (
              <div key={cat}>
                <h5 style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "20px" }}>
                  {cat}
                </h5>
                <ul className="space-y-3.5">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--dim)", transition: "color 0.2s", display: "block" }}
                        onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--cream)")}
                        onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--dim)")}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "var(--border-s)", margin: "56px 0 32px" }} />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--dim)" }}>
            © 2026 Laliguras Flower Society · Woosong University, Daejeon, South Korea. All rights reserved.
          </p>
          <p style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)", fontSize: "14px", fontStyle: "italic", color: "var(--muted)" }}>
            In bloom, always.
          </p>
        </div>
      </div>
    </footer>
  );
}
