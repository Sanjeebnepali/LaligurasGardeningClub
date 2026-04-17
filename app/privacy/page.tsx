"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shield, ArrowRight, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = [
  {
    id: "s1",
    title: "Information We Collect",
    number: "01",
    body: `We collect information you provide directly to us, such as when you create an account, join as a member, submit stories or photos, RSVP to events, or contact us. This includes: name, email address, membership tier, payment information (processed securely via our payment provider), content you upload, and communications you send us. We also automatically collect certain technical information when you visit our website, including IP address, browser type, referring URLs, and pages visited.`,
  },
  {
    id: "s2",
    title: "How We Use Your Information",
    number: "02",
    body: `We use the information we collect to: provide, maintain, and improve our services; process your membership and payments; send you transactional communications (receipts, RSVP confirmations, password resets); send our newsletter and event announcements if you've opted in; display your name and submitted content to the community as part of the service; respond to your comments and questions; monitor usage patterns to improve the platform; and comply with legal obligations.`,
  },
  {
    id: "s3",
    title: "Information Sharing",
    number: "03",
    body: `We do not sell, trade, or rent your personal information to third parties. We may share your information with: service providers who assist us in operating the website and providing services (payment processors, email service providers); other members, but only information you've chosen to make public (your name, submitted photos and stories, profile); and when required by law or to protect rights. We ensure any third-party service providers maintain appropriate data protection standards.`,
  },
  {
    id: "s4",
    title: "Cookies & Tracking",
    number: "04",
    body: `We use cookies and similar technologies to maintain your session, remember your preferences, and understand how you use our site. Essential cookies are required for the service to function. Analytics cookies help us understand usage patterns — you may opt out of these. We do not use third-party advertising cookies. You can control cookies through your browser settings, though disabling certain cookies may limit functionality.`,
  },
  {
    id: "s5",
    title: "Data Retention",
    number: "05",
    body: `We retain your personal information for as long as your account is active or as needed to provide services. If you close your account, we will delete or anonymize your personal data within 90 days, except where retention is required for legal compliance, dispute resolution, or legitimate business purposes. Public content you've submitted (photos, stories) may remain visible in anonymized form unless you specifically request removal.`,
  },
  {
    id: "s6",
    title: "Your Rights",
    number: "06",
    body: `You have the right to: access the personal information we hold about you; correct inaccurate information; request deletion of your personal data (subject to legitimate business and legal reasons for retention); opt out of marketing communications at any time via the unsubscribe link in emails; export your data in a portable format; and lodge a complaint with a data protection authority. To exercise any of these rights, contact us at privacy@laliguras.club.`,
  },
  {
    id: "s7",
    title: "Children's Privacy",
    number: "07",
    body: `Our Service is not directed to children under 16. We do not knowingly collect personal information from children under 16. If you believe we have inadvertently collected information from a child under 16, please contact us and we will promptly delete it.`,
  },
  {
    id: "s8",
    title: "Security",
    number: "08",
    body: `We implement reasonable security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These include encrypted data transmission (HTTPS), secure password storage, and access controls. However, no method of internet transmission or electronic storage is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    id: "s9",
    title: "Policy Changes",
    number: "09",
    body: `We may update this Privacy Policy from time to time. We will notify you of significant changes by emailing registered members or posting a prominent notice on our website. The date of the most recent revision is noted at the top of this page. Continued use of the Service after changes constitute acceptance of the revised policy.`,
  },
  {
    id: "s10",
    title: "Contact Us",
    number: "10",
    body: `If you have questions or concerns about this Privacy Policy or our data practices, please contact our Privacy Team at privacy@laliguras.club or write to: Laliguras Flower Society, Privacy Team, Laliguras Botanical Gardens, Heritage Park, Kathmandu.`,
  },
];

export default function PrivacyPage() {
  const pageRef    = useRef<HTMLDivElement>(null);
  const [active,   setActive]   = useState("s1");
  const [hovered,  setHovered]  = useState<string | null>(null);

  /* ── Hero animation ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".priv-hero-inner > *",
        { y: 52, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.13, ease: "power3.out", delay: 0.2 }
      );
    }, pageRef);
    return () => ctx.revert();
  }, []);

  /* ── Active section tracking ── */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={pageRef}>

      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <section
        className="relative overflow-hidden flex items-end"
        style={{ minHeight: "70vh", paddingTop: "68px", paddingBottom: "100px", background: "#060310" }}
      >
        {/* Flower photo */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1490750967868-88df5691cc43?w=1600&q=80&fit=crop"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%", opacity: 0.30 }}
          />
        </div>

        {/* Overlays */}
        <div className="absolute inset-0" style={{ background: "rgba(6,3,10,0.62)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 80%, rgba(184,43,88,0.18) 0%, transparent 65%)" }} />
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: "45%", background: "linear-gradient(to bottom, transparent, #060310)" }} />
        <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: "30%", background: "linear-gradient(to bottom, rgba(6,3,10,0.7), transparent)" }} />

        {/* Decorative vertical lines */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(253,248,240,0.025) 0px, rgba(253,248,240,0.025) 1px, transparent 1px, transparent 120px)" }} />

        <div className="container relative" style={{ zIndex: 2 }}>
          <div className="priv-hero-inner" style={{ maxWidth: "780px" }}>

            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "28px" }}>
              <Link href="/" style={{ fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(253,248,240,0.40)" }}>
                Home
              </Link>
              <ChevronRight size={12} style={{ color: "rgba(253,248,240,0.22)" }} />
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--petal)" }}>
                Privacy Policy
              </span>
            </div>

            {/* Badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "24px", padding: "7px 16px", borderRadius: "999px", background: "rgba(184,43,88,0.12)", border: "1px solid rgba(184,43,88,0.28)" }}>
              <Shield size={12} style={{ color: "var(--rose-light)" }} />
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--petal)" }}>
                Legal Document
              </span>
            </div>

            {/* Heading */}
            <h1 style={{
              fontFamily: "var(--font-playfair,'Playfair Display',serif)",
              fontSize: "clamp(3.2rem,8vw,7rem)", fontWeight: 900,
              lineHeight: 0.92, letterSpacing: "-0.03em",
              color: "var(--cream)", marginBottom: "28px",
            }}>
              Privacy
              <br />
              <span style={{
                background: "linear-gradient(135deg,var(--rose-light),var(--petal))",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                Policy
              </span>
            </h1>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
              <div style={{ height: "1px", width: "48px", background: "var(--rose)" }} />
              <span style={{ fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)", fontSize: "1rem", fontStyle: "italic", color: "rgba(253,248,240,0.42)" }}>
                Last updated: January 1, 2025
              </span>
            </div>

            <p style={{
              fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)",
              fontSize: "clamp(1.1rem,1.8vw,1.4rem)", fontStyle: "italic",
              color: "rgba(253,248,240,0.60)", lineHeight: 1.7, maxWidth: "540px",
            }}>
              Laliguras Flower Society is committed to protecting your privacy and being transparent about how your information is used.
            </p>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          IN-PAGE NAV + CONTENT
      ══════════════════════════════════ */}
      <section style={{ background: "#0D0516", borderTop: "1px solid rgba(253,248,240,0.06)" }}>
        <div className="container" style={{ paddingTop: "80px", paddingBottom: "120px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "64px", alignItems: "start" }}>

            {/* ── Sticky Sidebar Nav ── */}
            <aside style={{ position: "sticky", top: "92px" }}>
              <p style={{
                fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: 700,
                letterSpacing: "0.22em", textTransform: "uppercase",
                color: "rgba(253,248,240,0.30)", marginBottom: "20px",
              }}>
                Contents
              </p>
              <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {SECTIONS.map((sec) => {
                  const isActive = active === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollTo(sec.id)}
                      onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(184,43,88,0.07)"; }}
                      onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                      style={{
                        display: "flex", alignItems: "center", gap: "12px",
                        padding: "9px 14px", borderRadius: "8px", border: "none",
                        background: isActive ? "rgba(184,43,88,0.12)" : "transparent",
                        cursor: "pointer", textAlign: "left", width: "100%",
                        transition: "background .18s",
                      }}
                    >
                      <span style={{
                        fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: 700,
                        letterSpacing: "0.1em",
                        color: isActive ? "var(--rose-light)" : "rgba(253,248,240,0.22)",
                        flexShrink: 0, transition: "color .2s",
                      }}>
                        {sec.number}
                      </span>
                      <span style={{
                        fontFamily: "var(--font-sans)", fontSize: "12px",
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? "var(--cream)" : "rgba(253,248,240,0.48)",
                        lineHeight: 1.4, transition: "color .2s",
                      }}>
                        {sec.title}
                      </span>
                      {isActive && (
                        <div style={{ marginLeft: "auto", width: "3px", height: "3px", borderRadius: "50%", background: "var(--rose-light)", flexShrink: 0 }} />
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Left accent line */}
              <div style={{ marginTop: "36px", height: "1px", background: "linear-gradient(to right, rgba(184,43,88,0.4), transparent)" }} />

              {/* Related links */}
              <div style={{ marginTop: "28px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <Link href="/terms" style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-sans)", fontSize: "11px", color: "rgba(253,248,240,0.40)", transition: "color .2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--petal)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(253,248,240,0.40)")}
                >
                  <ArrowRight size={11} /> Terms of Service
                </Link>
                <Link href="/contact" style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-sans)", fontSize: "11px", color: "rgba(253,248,240,0.40)", transition: "color .2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--petal)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(253,248,240,0.40)")}
                >
                  <ArrowRight size={11} /> Contact Privacy Team
                </Link>
              </div>
            </aside>

            {/* ── Main Content ── */}
            <div>
              {/* Intro */}
              <p style={{
                fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)",
                fontSize: "1.25rem", fontStyle: "italic",
                color: "rgba(253,248,240,0.65)", lineHeight: 1.85,
                borderLeft: "2px solid var(--rose)",
                paddingLeft: "24px",
                marginBottom: "64px",
              }}>
                Laliguras Flower Society (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share information about you when you use our website and services.
              </p>

              {/* Sections */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                {SECTIONS.map((sec, i) => {
                  const isHov = hovered === sec.id;
                  return (
                    <div
                      key={sec.id}
                      id={sec.id}
                      onMouseEnter={() => setHovered(sec.id)}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        paddingTop: "44px",
                        paddingBottom: "44px",
                        paddingLeft: "20px",
                        paddingRight: "20px",
                        borderBottom: i < SECTIONS.length - 1 ? "1px solid rgba(253,248,240,0.07)" : "none",
                        borderRadius: "12px",
                        scrollMarginTop: "110px",
                        background: isHov ? "rgba(184,43,88,0.05)" : "transparent",
                        boxShadow: isHov ? "inset 3px 0 0 rgba(184,43,88,0.55)" : "inset 3px 0 0 transparent",
                        transition: "background .22s, box-shadow .22s",
                        cursor: "default",
                      }}
                    >
                      {/* Section header — clicking title scrolls to self */}
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", marginBottom: "18px" }}>
                        <span style={{
                          fontFamily: "var(--font-playfair,'Playfair Display',serif)",
                          fontSize: "2.8rem", fontWeight: 900, lineHeight: 1,
                          color: isHov ? "rgba(184,43,88,0.45)" : "rgba(184,43,88,0.20)",
                          flexShrink: 0, letterSpacing: "-0.04em",
                          transition: "color .22s",
                        }}>
                          {sec.number}
                        </span>
                        <button
                          onClick={() => scrollTo(sec.id)}
                          title="Jump to this section"
                          style={{
                            background: "none", border: "none", padding: 0,
                            cursor: "pointer", textAlign: "left",
                            display: "flex", alignItems: "center", gap: "10px",
                            paddingTop: "6px",
                          }}
                        >
                          <h2 style={{
                            fontFamily: "var(--font-playfair,'Playfair Display',serif)",
                            fontSize: "clamp(1.4rem,2.2vw,1.75rem)", fontWeight: 700,
                            color: isHov ? "var(--cream)" : "rgba(253,248,240,0.88)",
                            lineHeight: 1.2, letterSpacing: "-0.01em",
                            transition: "color .2s",
                          }}>
                            {sec.title}
                          </h2>
                          {/* Anchor indicator on hover */}
                          <span style={{
                            fontSize: "11px", color: "var(--rose-light)",
                            opacity: isHov ? 1 : 0,
                            transition: "opacity .2s",
                            fontFamily: "var(--font-sans)",
                            flexShrink: 0,
                          }}>
                            #
                          </span>
                        </button>
                      </div>

                      <p style={{
                        fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 300,
                        color: isHov ? "rgba(253,248,240,0.80)" : "rgba(253,248,240,0.60)",
                        lineHeight: 1.95,
                        transition: "color .22s",
                      }}>
                        {sec.body}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Footer CTA */}
              <div style={{
                marginTop: "64px", padding: "40px 44px",
                background: "linear-gradient(135deg, rgba(184,43,88,0.08), rgba(184,43,88,0.04))",
                border: "1px solid rgba(184,43,88,0.18)",
                borderRadius: "16px",
              }}>
                <p style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "1.3rem", fontWeight: 700, color: "var(--cream)", marginBottom: "8px" }}>
                  Questions about your privacy?
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "rgba(253,248,240,0.50)", marginBottom: "24px", lineHeight: 1.7 }}>
                  Our Privacy Team is happy to help. Reach us at privacy@laliguras.club.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  <Link href="/contact" className="btn btn-primary btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    Contact Privacy Team <ArrowRight size={13} />
                  </Link>
                  <Link href="/terms" className="btn btn-ghost btn-sm">
                    Terms of Service
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
