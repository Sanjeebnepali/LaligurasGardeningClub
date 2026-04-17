"use client";
import { useState } from "react";
import { MapPin, Mail, Phone, Clock, Send, Check, ExternalLink } from "lucide-react";
import { useFlowerPool, pick } from "@/lib/useFlowerPool";

const INFO = [
  {
    Icon: MapPin,
    label: "Club Location",
    value: "171 Dongdaejeon-ro, Dong-gu\nDaejeon 34606, South Korea\nWoosong University Campus",
  },
  {
    Icon: Clock,
    label: "Meeting Hours",
    value: "Wednesday & Friday  ·  4:00 – 6:00 PM\nSaturday  ·  10:00 AM – 1:00 PM",
  },
  {
    Icon: Mail,
    label: "Email Us",
    value: "laligurasgardeningclub@gmail.com",
  },
  {
    Icon: Phone,
    label: "Phone",
    value: "+82 42-630-9000\nWoosong University Main Office",
  },
];

const MAPS_EMBED =
  "https://maps.google.com/maps?q=Woosong+University+171+Dongdaejeon-ro+Dong-gu+Daejeon+South+Korea&output=embed&z=16&hl=en";

export default function ContactPage() {
  const pool = useFlowerPool(["orchid", "rose"]);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1500);
  };

  /* ── scoped lighter-dark tokens (contact page only) ── */
  const pageVars = {
    "--surface":  "#160C28",
    "--card":     "#1E1134",
    "--card-hover":"#271540",
    "--muted":    "rgba(253,248,240,0.72)",
    "--dim":      "rgba(253,248,240,0.40)",
    "--border-s": "rgba(253,248,240,0.13)",
    "--rose-glow":"rgba(184,43,88,0.22)",
  } as React.CSSProperties;

  return (
    <div style={pageVars}>
      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden flex items-end"
        style={{
          minHeight: "62vh",
          paddingTop: "68px",
          paddingBottom: "100px",
          background: "#0C0618",
        }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${pick(pool, "orchid")})`,
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
            opacity: 0.55,
          }}
        />
        {/* Light veil — just enough contrast for text */}
        <div className="absolute inset-0" style={{ background: "rgba(6,3,10,0.36)" }} />
        {/* Rose glow accent */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 55% at 50% 70%, rgba(184,43,88,0.16) 0%, transparent 70%)" }}
        />
        {/* Bottom fade into section below */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, #160C28)" }}
        />

        <div className="container relative" style={{ zIndex: 2 }}>
          <div
            className="eyebrow-gold mb-8 eyebrow"
            style={{ fontSize: "11px", letterSpacing: "0.18em" }}
          >
            Get In Touch
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
            Connect with
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, var(--rose-light), var(--petal), var(--gold-light))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Our Society
            </span>
          </h1>

          <p
            style={{
              fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
              fontSize: "clamp(1.25rem, 2.2vw, 1.65rem)",
              fontStyle: "italic",
              color: "var(--muted)",
              maxWidth: "520px",
              lineHeight: 1.85,
            }}
          >
            Whether you have a question, a partnership inquiry, or simply want
            to say hello — we&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* ── MAIN LAYOUT ── */}
      <section className="section-pad-lg" style={{ background: "var(--surface)", borderTop: "1px solid rgba(253,248,240,0.06)" }}>
        <div className="container">
          <div className="grid lg:grid-cols-5 gap-8 xl:gap-10 items-start">

            {/* ── LEFT: INFO + MAP — wrapped in matching card ── */}
            <div
              className="lg:col-span-2 rounded-2xl flex flex-col"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border-s)",
                padding: "44px 36px",
                gap: "0",
              }}
            >
              {/* Header matches the form card */}
              <h2
                style={{
                  fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                  fontSize: "clamp(1.7rem, 3vw, 2.4rem)",
                  fontWeight: 700,
                  color: "var(--cream)",
                  marginBottom: "8px",
                  lineHeight: 1.1,
                }}
              >
                Find Us
              </h2>
              <p
                style={{
                  color: "var(--muted)",
                  fontSize: "15px",
                  marginBottom: "32px",
                  lineHeight: 1.7,
                }}
              >
                Visit us on campus or reach out any time.
              </p>

              {/* Info rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                {INFO.map(({ Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex gap-4 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid var(--border-s)",
                      padding: "16px 18px",
                      transition: "border-color .3s, background .3s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                      (e.currentTarget as HTMLElement).style.background = "rgba(184,43,88,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--border-s)";
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--rose-glow)", border: "1px solid var(--border)" }}
                    >
                      <Icon size={18} style={{ color: "var(--rose-light)" }} />
                    </div>
                    <div style={{ paddingTop: "1px" }}>
                      <p
                        className="form-label"
                        style={{ marginBottom: "4px", fontSize: "10px", letterSpacing: "0.15em" }}
                      >
                        {label}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "14px",
                          color: "var(--cream)",
                          lineHeight: 1.75,
                          whiteSpace: "pre-line",
                        }}
                      >
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Real Google Maps embed ── */}
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  height: "240px",
                  border: "1px solid var(--border-s)",
                  position: "relative",
                }}
              >
                <iframe
                  src={MAPS_EMBED}
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: "block", filter: "grayscale(30%) contrast(1.05)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Woosong University, Daejeon"
                />
                <a
                  href="https://maps.google.com/?q=Woosong+University+Daejeon+South+Korea"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 flex items-center gap-2 rounded-xl"
                  style={{
                    background: "rgba(13,5,22,0.92)",
                    border: "1px solid var(--border)",
                    padding: "7px 12px",
                    color: "var(--petal)",
                    fontSize: "11px",
                    fontFamily: "var(--font-sans)",
                    fontWeight: 500,
                    textDecoration: "none",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <MapPin size={12} />
                  Open in Maps
                  <ExternalLink size={10} style={{ opacity: 0.7 }} />
                </a>
              </div>
            </div>

            {/* ── RIGHT: FORM ── */}
            <div className="lg:col-span-3 flex flex-col gap-5">
              <div
                className="rounded-2xl"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border-s)",
                  padding: "44px 48px",
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                    fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
                    fontWeight: 700,
                    color: "var(--cream)",
                    marginBottom: "10px",
                    lineHeight: 1.1,
                  }}
                >
                  Send a Message
                </h2>
                <p
                  style={{
                    color: "var(--muted)",
                    fontSize: "16px",
                    marginBottom: "36px",
                    lineHeight: 1.7,
                  }}
                >
                  We respond to all inquiries within 1–2 business days.
                </p>

                {submitted ? (
                  <div
                    className="text-center rounded-2xl"
                    style={{
                      background: "var(--rose-glow)",
                      border: "1px solid var(--border)",
                      padding: "56px 40px",
                    }}
                  >
                    <div
                      className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                      style={{ background: "var(--rose)" }}
                    >
                      <Check size={28} color="white" />
                    </div>
                    <h3
                      style={{
                        fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                        fontSize: "2.1rem",
                        fontWeight: 700,
                        color: "var(--cream)",
                        marginBottom: "12px",
                      }}
                    >
                      Message Sent!
                    </h3>
                    <p style={{ color: "var(--muted)", fontSize: "16px", lineHeight: 1.7 }}>
                      Thank you for reaching out. We&apos;ll be in touch soon.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="btn btn-outline btn-sm mt-8"
                    >
                      Send Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label
                          className="form-label"
                          style={{ fontSize: "11px", letterSpacing: "0.14em", marginBottom: "8px", display: "block" }}
                        >
                          Full Name *
                        </label>
                        <input
                          className="form-input"
                          placeholder="Your full name"
                          style={{ fontSize: "15px", padding: "14px 16px" }}
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label
                          className="form-label"
                          style={{ fontSize: "11px", letterSpacing: "0.14em", marginBottom: "8px", display: "block" }}
                        >
                          Email Address *
                        </label>
                        <input
                          type="email"
                          className="form-input"
                          placeholder="you@example.com"
                          style={{ fontSize: "15px", padding: "14px 16px" }}
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        className="form-label"
                        style={{ fontSize: "11px", letterSpacing: "0.14em", marginBottom: "8px", display: "block" }}
                      >
                        Subject
                      </label>
                      <select
                        className="form-input"
                        style={{ fontSize: "15px", padding: "14px 16px" }}
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      >
                        <option value="">Select a topic…</option>
                        <option>Membership Inquiry</option>
                        <option>Event Information</option>
                        <option>Plant Consultation</option>
                        <option>Partnership Proposal</option>
                        <option>Press & Media</option>
                        <option>General Question</option>
                      </select>
                    </div>

                    <div>
                      <label
                        className="form-label"
                        style={{ fontSize: "11px", letterSpacing: "0.14em", marginBottom: "8px", display: "block" }}
                      >
                        Your Message *
                      </label>
                      <textarea
                        className="form-input"
                        placeholder="Tell us how we can help…"
                        style={{ fontSize: "15px", padding: "14px 16px", minHeight: "150px" }}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        required
                        rows={5}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      style={{ width: "100%", justifyContent: "center" }}
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center gap-3">
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Sending…
                        </span>
                      ) : (
                        <span className="flex items-center gap-3">
                          <Send size={16} />
                          Send Message
                        </span>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* FAQ shortcut */}
              <div
                className="flex items-center gap-5 rounded-2xl"
                style={{
                  background: "var(--rose-glow)",
                  border: "1px solid var(--border)",
                  padding: "24px 28px",
                }}
              >
                <div style={{ fontSize: "2.2rem", flexShrink: 0, lineHeight: 1 }}>🌿</div>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                      fontSize: "18px",
                      fontWeight: 600,
                      color: "var(--cream)",
                      marginBottom: "6px",
                    }}
                  >
                    Have a quick question?
                  </p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--muted)", lineHeight: 1.6 }}>
                    Check our{" "}
                    <a href="/beginners#faq" style={{ color: "var(--petal)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                      FAQ section
                    </a>{" "}
                    — most common questions are answered there.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
