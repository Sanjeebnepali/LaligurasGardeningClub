"use client";
import { SignIn, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/* ── Subtle botanical line-art ornament ── */
function FloralMark({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="140" height="140" viewBox="0 0 140 140" fill="none"
      style={{ transform: flip ? "rotate(180deg)" : undefined }}
    >
      {[0,72,144,216,288].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const cx  = 70 + Math.cos(rad) * 28;
        const cy  = 70 + Math.sin(rad) * 28;
        const tx  = 70 + Math.cos(rad) * 60;
        const ty  = 70 + Math.sin(rad) * 60;
        const lx  = 70 + Math.cos(rad - 0.48) * 48;
        const ly  = 70 + Math.sin(rad - 0.48) * 48;
        const rx  = 70 + Math.cos(rad + 0.48) * 48;
        const ry  = 70 + Math.sin(rad + 0.48) * 48;
        return (
          <path key={deg}
            d={`M${cx.toFixed(1)},${cy.toFixed(1)} Q${lx.toFixed(1)},${ly.toFixed(1)} ${tx.toFixed(1)},${ty.toFixed(1)} Q${rx.toFixed(1)},${ry.toFixed(1)} ${cx.toFixed(1)},${cy.toFixed(1)}`}
            stroke="rgba(184,43,88,0.18)" strokeWidth="1" fill="none" strokeLinecap="round"
          />
        );
      })}
      <circle cx="70" cy="70" r="5" stroke="rgba(184,43,88,0.14)" strokeWidth="1" fill="none" />
      {[0,72,144,216,288].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x = 70 + Math.cos(rad) * 68;
        const y = 70 + Math.sin(rad) * 68;
        return <circle key={`dot-${deg}`} cx={x.toFixed(1)} cy={y.toFixed(1)} r="1.5" fill="rgba(184,43,88,0.12)" />;
      })}
    </svg>
  );
}

/* ── Clerk appearance ── */
const CLERK: object = {
  variables: {
    colorPrimary:        "#B82B58",
    colorBackground:     "transparent",
    colorText:           "#FDF8F0",
    colorTextSecondary:  "rgba(253,248,240,0.55)",
    colorInputBackground:"#0c0420",
    colorInputText:      "#FDF8F0",
    colorNeutral:        "#FDF8F0",
    colorDanger:         "#ff7a7a",
    colorSuccess:        "#6fcf97",
    borderRadius:        "10px",
    fontSize:            "13px",
  },
  elements: {
    card:           { background:"transparent", boxShadow:"none", border:"none", padding:0, width:"100%" },
    rootBox:        { width:"100%" },
    headerTitle:    { display:"none" },
    headerSubtitle: { display:"none" },
  },
};

export default function SignInPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) router.replace("/sanctuary");
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || isSignedIn) return null;

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "stretch",
      background: "#06030A",
    }}>

      {/* ════════════════════
          LEFT — form panel
      ════════════════════ */}
      <div style={{
        width: "100%",
        maxWidth: 480,
        flexShrink: 0,
        background: "#08030F",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 52px",
        position: "relative",
        overflow: "hidden",
        zIndex: 1,
      }}>
        {/* Corner ornaments */}
        <div style={{ position:"absolute", top:-24, left:-24, pointerEvents:"none", opacity: 0.7 }}>
          <FloralMark />
        </div>
        <div style={{ position:"absolute", bottom:-24, right:-24, pointerEvents:"none", opacity: 0.7 }}>
          <FloralMark flip />
        </div>

        {/* Subtle glow */}
        <div style={{
          position:"absolute", top:"30%", left:"-20%",
          width:300, height:300, borderRadius:"50%",
          background:"radial-gradient(circle, rgba(184,43,88,0.08) 0%, transparent 70%)",
          pointerEvents:"none",
        }} />

        {/* Logo */}
        <Link href="/" style={{
          display:"inline-flex", alignItems:"center", gap:10,
          marginBottom:44, width:"fit-content",
          textDecoration: "none",
        }}>
          <div style={{ width:36, height:36, borderRadius:"50%", overflow:"hidden", flexShrink:0, border:"1.5px solid rgba(184,43,88,0.45)", boxShadow:"0 0 20px rgba(184,43,88,0.45)" }}>
            <NextImage src="/logo.jpg" alt="Laliguras" width={36} height={36} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          </div>
          <div>
            <span style={{
              fontFamily:"var(--font-playfair,'Playfair Display',serif)",
              fontSize:13, fontWeight:700,
              color:"rgba(253,248,240,0.75)", letterSpacing:"0.16em",
              display:"block", lineHeight:1,
            }}>LALIGURAS</span>
            <span style={{
              fontFamily:"var(--font-sans,'Inter',sans-serif)",
              fontSize:8, letterSpacing:"0.22em",
              textTransform:"uppercase",
              color:"rgba(253,248,240,0.32)", display:"block", marginTop:3,
            }}>Flower Society</span>
          </div>
        </Link>

        {/* Heading */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontFamily:"var(--font-playfair,'Playfair Display',serif)",
            fontSize:"2.2rem", fontWeight:800,
            color:"#FDF8F0", lineHeight:1.1,
            marginBottom:10, letterSpacing:"-0.02em",
          }}>Welcome back</h1>
          <p style={{
            fontFamily:"var(--font-cormorant,'Cormorant Garamond',serif)",
            fontSize:"1.1rem", fontStyle:"italic",
            color:"rgba(253,248,240,0.42)", lineHeight:1.5,
          }}>Sign in to your Laliguras account</p>
          {/* Decorative divider */}
          <div style={{
            display:"flex", alignItems:"center", gap:10, marginTop:18,
          }}>
            <div style={{ height:1, flex:1, background:"linear-gradient(to right, rgba(184,43,88,0.5), transparent)" }} />
            <div style={{ width:8, height:8, borderRadius:"50%", background:"rgba(184,43,88,0.5)" }} />
            <div style={{ height:1, flex:1, background:"linear-gradient(to left, rgba(184,43,88,0.5), transparent)" }} />
          </div>
        </div>

        {/* Clerk form */}
        <div style={{ width:"100%" }}>
          <SignIn appearance={CLERK} />
        </div>

        {/* Footer */}
        <p style={{
          marginTop:24, fontSize:12,
          color:"rgba(253,248,240,0.30)",
          fontFamily:"var(--font-sans,'Inter',sans-serif)",
          lineHeight: 1.6,
        }}>
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" style={{ color:"#D14E72", fontWeight:600, textDecoration:"none" }}>
            Sign up for free
          </Link>
        </p>
      </div>

      {/* ═══════════════════════
          RIGHT — flower photo panel
      ═══════════════════════ */}
      <div
        className="hidden sm:block"
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Flower photo */}
        <Image
          src="https://images.unsplash.com/photo-1490750967868-88df5691cc43?w=1200&q=85&fit=crop"
          alt="Rhododendron flowers"
          fill
          style={{ objectFit:"cover", objectPosition:"center" }}
          priority
          sizes="(max-width: 768px) 0vw, calc(100vw - 480px)"
        />

        {/* Dark overlay — left edge fades into form panel */}
        <div style={{
          position:"absolute", inset:0,
          background:"linear-gradient(to right, rgba(8,3,15,0.92) 0%, rgba(8,3,15,0.4) 25%, rgba(8,3,15,0.1) 60%, rgba(8,3,15,0.35) 100%)",
        }} />

        {/* Bottom gradient for text legibility */}
        <div style={{
          position:"absolute", bottom:0, left:0, right:0, height:"45%",
          background:"linear-gradient(to top, rgba(6,3,10,0.88) 0%, transparent 100%)",
        }} />

        {/* Top vignette */}
        <div style={{
          position:"absolute", top:0, left:0, right:0, height:"30%",
          background:"linear-gradient(to bottom, rgba(6,3,10,0.55) 0%, transparent 100%)",
        }} />

        {/* Branding overlay — bottom */}
        <div style={{
          position:"absolute", bottom:0, left:0, right:0,
          padding:"40px 48px",
        }}>
          <p style={{
            fontFamily:"var(--font-cormorant,'Cormorant Garamond',serif)",
            fontSize:"1.85rem", fontStyle:"italic", fontWeight:500,
            color:"rgba(253,248,240,0.88)", lineHeight:1.35,
            marginBottom:16,
            textShadow:"0 2px 20px rgba(0,0,0,0.5)",
          }}>
            &ldquo;Where every petal tells<br />a story of belonging.&rdquo;
          </p>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{
              width:28, height:1,
              background:"rgba(184,43,88,0.7)",
            }} />
            <span style={{
              fontFamily:"var(--font-sans,'Inter',sans-serif)",
              fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase",
              color:"rgba(253,248,240,0.45)",
            }}>Laliguras · Woosong University</span>
          </div>
        </div>

        {/* Top-right badge */}
        <div style={{
          position:"absolute", top:36, right:36,
          background:"rgba(8,3,15,0.65)",
          border:"1px solid rgba(184,43,88,0.25)",
          borderRadius:40, padding:"8px 16px",
          backdropFilter:"blur(12px)",
          display:"flex", alignItems:"center", gap:6,
        }}>
          <div style={{
            width:6, height:6, borderRadius:"50%",
            background:"#6fcf97",
            boxShadow:"0 0 6px rgba(111,207,151,0.7)",
          }} />
          <span style={{
            fontFamily:"var(--font-sans,'Inter',sans-serif)",
            fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase",
            color:"rgba(253,248,240,0.65)",
          }}>Members online</span>
        </div>
      </div>

    </div>
  );
}
