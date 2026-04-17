"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FileText, ArrowRight, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = [
  {
    id: "s1",
    title: "Acceptance of Terms",
    number: "01",
    body: `By accessing or using the Laliguras Flower Society website and services, you agree to be bound by these Terms of Service. If you do not agree to any part of these terms, you may not access the service. These terms apply to all visitors, members, and others who access or use the Service.`,
  },
  {
    id: "s2",
    title: "Membership & Accounts",
    number: "02",
    body: `Membership to Laliguras Flower Society is available to individuals 16 years of age and older. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account. We reserve the right to terminate accounts, remove or edit content, or cancel memberships at our discretion.`,
  },
  {
    id: "s3",
    title: "Membership Tiers & Payments",
    number: "03",
    body: `We offer three membership tiers: Seedling (free), Gardener ($30/year), and Curator ($100/year). Paid memberships are billed annually. All payments are processed securely. Refunds are available within 14 days of purchase for annual memberships, provided no exclusive benefits have been redeemed. Membership fees are subject to change with 30 days' notice to existing members.`,
  },
  {
    id: "s4",
    title: "User-Generated Content",
    number: "04",
    body: `Members may submit photos, stories, and other content to the platform. By submitting content, you grant Laliguras Flower Society a non-exclusive, worldwide, royalty-free license to use, display, and distribute that content in connection with our services. You retain ownership of your content. You are solely responsible for content you submit and must ensure it does not infringe any third-party rights or violate any applicable laws. We reserve the right to remove content that violates these terms.`,
  },
  {
    id: "s5",
    title: "Prohibited Uses",
    number: "05",
    body: `You agree not to use the Service to: upload or transmit content that is unlawful, harmful, or objectionable; impersonate any person or entity; collect or harvest user data without permission; engage in any conduct that restricts or inhibits anyone's use of the Service; attempt to gain unauthorized access to any portion of the Service; or use the Service for commercial solicitation without prior written consent.`,
  },
  {
    id: "s6",
    title: "Events & RSVPs",
    number: "06",
    body: `Event RSVPs are non-transferable. Laliguras reserves the right to cancel, postpone, or modify events. In the event of cancellation by Laliguras, registered attendees will be notified and any paid event fees will be refunded. Members are expected to cancel RSVPs promptly if they cannot attend, as event capacity is often limited.`,
  },
  {
    id: "s7",
    title: "Intellectual Property",
    number: "07",
    body: `The Service and its original content, features, and functionality (excluding user-submitted content) are and will remain the exclusive property of Laliguras Flower Society. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Laliguras Flower Society. The name "Laliguras" and associated logos are protected trademarks.`,
  },
  {
    id: "s8",
    title: "Limitation of Liability",
    number: "08",
    body: `Laliguras Flower Society shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, goodwill, or other intangible losses resulting from your access to or use of (or inability to access or use) the Service. Our total liability for any claim arising from these terms shall not exceed the amount paid by you, if any, for access to the Service in the twelve months preceding the claim.`,
  },
  {
    id: "s9",
    title: "Changes to Terms",
    number: "09",
    body: `We reserve the right to modify these terms at any time. We will provide at least 30 days' notice before any material changes take effect by posting the new Terms on this page and updating the "Last Updated" date. Your continued use of the Service after the effective date of the revised Terms constitutes your acceptance of the terms.`,
  },
  {
    id: "s10",
    title: "Contact",
    number: "10",
    body: `If you have any questions about these Terms of Service, please contact us at legal@laliguras.club or write to us at Laliguras Botanical Gardens, Heritage Park, Kathmandu.`,
  },
];

export default function TermsPage() {
  const pageRef  = useRef<HTMLDivElement>(null);
  const [active,  setActive]  = useState("s1");
  const [hovered, setHovered] = useState<string | null>(null);

  /* ── Hero animation ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".terms-hero-inner > *",
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
            src="https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1600&q=80&fit=crop"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 50%", opacity: 0.32 }}
          />
        </div>

        {/* Overlays */}
        <div className="absolute inset-0" style={{ background: "rgba(6,3,10,0.60)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 55% at 50% 80%, rgba(196,162,60,0.14) 0%, transparent 65%)" }} />
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: "45%", background: "linear-gradient(to bottom, transparent, #060310)" }} />
        <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: "30%", background: "linear-gradient(to bottom, rgba(6,3,10,0.7), transparent)" }} />

        {/* Decorative vertical lines */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(253,248,240,0.025) 0px, rgba(253,248,240,0.025) 1px, transparent 1px, transparent 120px)" }} />

        <div className="container relative" style={{ zIndex: 2 }}>
          <div className="terms-hero-inner" style={{ maxWidth: "780px" }}>

            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "28px" }}>
              <Link href="/" style={{ fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(253,248,240,0.40)" }}>
                Home
              </Link>
              <ChevronRight size={12} style={{ color: "rgba(253,248,240,0.22)" }} />
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold-light)" }}>
                Terms of Service
              </span>
            </div>

            {/* Badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "24px", padding: "7px 16px", borderRadius: "999px", background: "rgba(196,162,60,0.10)", border: "1px solid rgba(196,162,60,0.25)" }}>
              <FileText size={12} style={{ color: "var(--gold-light)" }} />
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold-light)" }}>
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
              Terms of
              <br />
              <span style={{
                background: "linear-gradient(135deg,var(--gold-light),var(--petal))",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                Service
              </span>
            </h1>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
              <div style={{ height: "1px", width: "48px", background: "var(--gold)" }} />
              <span style={{ fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)", fontSize: "1rem", fontStyle: "italic", color: "rgba(253,248,240,0.42)" }}>
                Last updated: January 1, 2025
              </span>
            </div>

            <p style={{
              fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)",
              fontSize: "clamp(1.1rem,1.8vw,1.4rem)", fontStyle: "italic",
              color: "rgba(253,248,240,0.60)", lineHeight: 1.7, maxWidth: "540px",
            }}>
              Welcome to Laliguras Flower Society. These Terms govern your use of our website and membership services. Please read them carefully before joining.
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
                      onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(196,162,60,0.06)"; }}
                      onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                      style={{
                        display: "flex", alignItems: "center", gap: "12px",
                        padding: "9px 14px", borderRadius: "8px", border: "none",
                        background: isActive ? "rgba(196,162,60,0.10)" : "transparent",
                        cursor: "pointer", textAlign: "left", width: "100%",
                        transition: "background .18s",
                      }}
                    >
                      <span style={{
                        fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: 700,
                        letterSpacing: "0.1em",
                        color: isActive ? "var(--gold-light)" : "rgba(253,248,240,0.22)",
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
                        <div style={{ marginLeft: "auto", width: "3px", height: "3px", borderRadius: "50%", background: "var(--gold-light)", flexShrink: 0 }} />
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Accent line */}
              <div style={{ marginTop: "36px", height: "1px", background: "linear-gradient(to right, rgba(196,162,60,0.4), transparent)" }} />

              {/* Related links */}
              <div style={{ marginTop: "28px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <Link href="/privacy" style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-sans)", fontSize: "11px", color: "rgba(253,248,240,0.40)", transition: "color .2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--petal)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(253,248,240,0.40)")}
                >
                  <ArrowRight size={11} /> Privacy Policy
                </Link>
                <Link href="/contact" style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-sans)", fontSize: "11px", color: "rgba(253,248,240,0.40)", transition: "color .2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--petal)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(253,248,240,0.40)")}
                >
                  <ArrowRight size={11} /> Contact Legal Team
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
                borderLeft: "2px solid var(--gold)",
                paddingLeft: "24px",
                marginBottom: "64px",
              }}>
                Welcome to Laliguras Flower Society. These Terms of Service govern your use of our website and membership services. Please read them carefully before joining or using our platform.
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
                        background: isHov ? "rgba(196,162,60,0.05)" : "transparent",
                        boxShadow: isHov ? "inset 3px 0 0 rgba(196,162,60,0.55)" : "inset 3px 0 0 transparent",
                        transition: "background .22s, box-shadow .22s",
                        cursor: "default",
                      }}
                    >
                      {/* Section header — clicking title scrolls to self */}
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", marginBottom: "18px" }}>
                        <span style={{
                          fontFamily: "var(--font-playfair,'Playfair Display',serif)",
                          fontSize: "2.8rem", fontWeight: 900, lineHeight: 1,
                          color: isHov ? "rgba(196,162,60,0.45)" : "rgba(196,162,60,0.18)",
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
                          <span style={{
                            fontSize: "11px", color: "var(--gold-light)",
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
                background: "linear-gradient(135deg, rgba(196,162,60,0.07), rgba(196,162,60,0.03))",
                border: "1px solid rgba(196,162,60,0.18)",
                borderRadius: "16px",
              }}>
                <p style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "1.3rem", fontWeight: 700, color: "var(--cream)", marginBottom: "8px" }}>
                  Questions about these terms?
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "rgba(253,248,240,0.50)", marginBottom: "24px", lineHeight: 1.7 }}>
                  Our legal team is available to help. Reach us at legal@laliguras.club.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  <Link href="/contact" className="btn btn-primary btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "var(--gold)", borderColor: "var(--gold)", color: "#06030A" }}>
                    Contact Legal Team <ArrowRight size={13} />
                  </Link>
                  <Link href="/privacy" className="btn btn-ghost btn-sm">
                    Privacy Policy
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
