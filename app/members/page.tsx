"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ZoomIn, X, Heart, MessageCircle, Upload,
  PenLine, ArrowRight, Clock, Sparkles, Check, ImageIcon,
} from "lucide-react";
import { useFlowerPool, pick, type FlowerPool } from "@/lib/useFlowerPool";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────── */
interface Photo {
  id: number;
  src: string;
  author: string;
  caption: string;
  type: string;
  likes: number;
  comments: number;
}

/* ─────────────────────────────────────────────────────────
   IMAGES — plain ?w=800&q=80 only (no imgix transforms that
   require an API key — those fail without auth).
   All 10 IDs are the same verified flower photos used
   throughout the whole site.
───────────────────────────────────────────────────────── */
const INITIAL_PHOTOS: Photo[] = [
  { id:1, src:"", author:"Priya Khatri",    caption:"Crimson climbing rose at dawn",        type:"rose",         likes:84,  comments:12 },
  { id:2, src:"", author:"Elena Vasquez",   caption:"Sarah Bernhardt peony in full glory",  type:"peony",        likes:117, comments:19 },
  { id:3, src:"", author:"Aisha Rajan",     caption:"Parrot tulip cascade — spring harvest",type:"tulip",        likes:63,  comments:8  },
  { id:4, src:"", author:"Yuki Tanaka",     caption:"Phalaenopsis in morning light",        type:"orchid",       likes:92,  comments:14 },
  { id:5, src:"", author:"Jin Wei",         caption:"Café au Lait dahlia, October",         type:"dahlia",       likes:48,  comments:6  },
  { id:6, src:"", author:"Marcus Lehmann",  caption:"Casa Blanca lily cluster",             type:"lily",         likes:71,  comments:11 },
  { id:7, src:"", author:"Priya Khatri",    caption:"Sacred lotus in still water",          type:"lotus",        likes:55,  comments:9  },
  { id:8, src:"", author:"Carlos Rivera",   caption:"Lavender fields at golden hour",       type:"lavender",     likes:78,  comments:13 },
  { id:9, src:"", author:"Aisha Rajan",     caption:"Sunflower crown, full summer",         type:"sunflower",    likes:103, comments:17 },
];

const FEATURED_STORIES = [
  {
    title:    "My First Peony Season",
    subtitle: "A love letter to Sarah Bernhardt",
    author:   "Priya Khatri",
    initials: "PK",
    date:     "April 2, 2026",
    type:     "peony",
    excerpt:  "After three failed seasons, I finally understood what a peony asks of you. Patience. Restraint. The willingness to wait twelve full months for a bloom that lasts only two weeks — and makes every moment worthwhile.",
    readTime: "8 min",
    accent:   "#D14E72",
  },
  {
    title:    "Chasing the Himalayan Bloom",
    subtitle: "A three-year rhododendron obsession",
    author:   "Marcus Lehmann",
    initials: "ML",
    date:     "March 15, 2026",
    type:     "rhododendron",
    excerpt:  "Rhododendron arboreum. Nepal&apos;s national flower. When I first saw an entire hillside turned crimson in late winter, I made a decision that would consume three summers of my life in Daejeon.",
    readTime: "11 min",
    accent:   "#8E44AD",
  },
];

/* ─────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────── */
export default function MembersPage() {
  const heroRef   = useRef<HTMLElement>(null);
  const uploadRef = useRef<HTMLDivElement>(null);
  const pool      = useFlowerPool(["rose","peony","tulip","orchid","dahlia","lily","lotus","lavender","sunflower","rhododendron"]);

  /* photos is state so newly submitted ones appear instantly */
  const [photos,     setPhotos]     = useState<Photo[]>(INITIAL_PHOTOS);
  const [lightbox,   setLightbox]   = useState<Photo | null>(null);
  const [liked,      setLiked]      = useState<Record<number, boolean>>({});
  const [activeTab,  setActiveTab]  = useState<"gallery" | "stories">("gallery");
  const [showUpload, setShowUpload] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);

  /* upload form state */
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [caption,    setCaption]    = useState("");
  const [authorName, setAuthorName] = useState("");
  const [flowerType, setFlowerType] = useState("");

  /* ── Hero entrance ── */
  useEffect(() => {
    gsap.fromTo(".mem-ha",
      { y: 32, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.85, stagger: 0.12, ease: "power3.out", delay: 0.2 }
    );
  }, []);

  /* ── Gallery reveal ── */
  useEffect(() => {
    if (activeTab !== "gallery") return;
    const id = setTimeout(() => {
      gsap.killTweensOf(".gallery-item");
      gsap.fromTo(".gallery-item",
        { y: 40, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.07, ease: "power3.out" }
      );
    }, 0);
    return () => clearTimeout(id);
  }, [activeTab, photos]);   // re-run when photos array changes

  /* ── Story cards reveal ── */
  useEffect(() => {
    if (activeTab !== "stories") return;
    const id = setTimeout(() => {
      gsap.killTweensOf(".story-card");
      gsap.fromTo(".story-card",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, stagger: 0.15, ease: "power3.out" }
      );
    }, 0);
    return () => clearTimeout(id);
  }, [activeTab]);

  /* ── Upload modal open animation ── */
  useEffect(() => {
    if (showUpload && uploadRef.current) {
      gsap.fromTo(uploadRef.current,
        { scale: 0.93, opacity: 0, y: 24 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
      );
    }
  }, [showUpload]);

  /* ── File input handler ── */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewSrc && previewSrc.startsWith("blob:")) URL.revokeObjectURL(previewSrc);
    setPreviewSrc(URL.createObjectURL(file));
    /* reset so the same file can be re-selected after clearing */
    e.target.value = "";
  };

  /* ── Close upload modal with animation ── */
  const closeUpload = () => {
    if (uploadRef.current) {
      gsap.to(uploadRef.current, {
        scale: 0.95, opacity: 0, y: 16, duration: 0.28, ease: "power2.in",
        onComplete: () => {
          setShowUpload(false);
          setUploadDone(false);
          setPreviewSrc(null);
          setCaption("");
          setAuthorName("");
          setFlowerType("");

        },
      });
    } else {
      setShowUpload(false);
    }
  };

  /* ── Submit: add photo to gallery state ── */
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewSrc || !caption || !authorName) return;

    const newPhoto: Photo = {
      id:       Date.now(),
      src:      previewSrc,
      author:   authorName,
      caption,
      type:     flowerType || "Other",
      likes:    0,
      comments: 0,
    };

    setPhotos(prev => [newPhoto, ...prev]);
    setUploadDone(true);

    /* switch to gallery tab and close modal after short delay */
    setTimeout(() => {
      setActiveTab("gallery");
      closeUpload();
    }, 2200);
  };

  return (
    <>
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden flex flex-col justify-center"
        style={{ minHeight: "60vh", paddingTop: "150px", paddingBottom: "90px", background: "var(--bg)" }}
      >
        <div className="absolute inset-0" style={{ backgroundImage: `url(${pick(pool, "rose")})`, backgroundSize: "cover", backgroundPosition: "center 35%", opacity: 0.18 }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg,rgba(6,3,10,0.88) 35%,rgba(184,43,88,0.1) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 60%,rgba(184,43,88,0.16) 0%,transparent 70%)" }} />

        <div className="container relative" style={{ zIndex: 5 }}>
          <div className="mem-ha eyebrow mb-6" style={{ color: "var(--gold-light)", opacity: 0 }}>
            <span style={{ width: 28, height: 1, background: "var(--gold)", display: "inline-block", flexShrink: 0 }} />
            Member Community · 5,000+ Growers Worldwide
            <span style={{ width: 28, height: 1, background: "var(--gold)", display: "inline-block", flexShrink: 0 }} />
          </div>

          <h1 className="mem-ha" style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "clamp(3.2rem,8vw,8rem)", fontWeight: 900, lineHeight: 0.92, letterSpacing: "-0.025em", color: "var(--cream)", maxWidth: 780, marginBottom: "1.5rem", opacity: 0 }}>
            Through Our<br />
            <span style={{ background: "linear-gradient(135deg,#D14E72 0%,#F2BCCA 45%,#DDB95A 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Members&apos; Eyes
            </span>
          </h1>

          <p className="mem-ha" style={{ fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)", fontSize: "clamp(1.1rem,2vw,1.35rem)", fontStyle: "italic", color: "var(--muted)", maxWidth: 500, lineHeight: 1.8, marginBottom: "2.5rem", opacity: 0 }}>
            A living gallery of gardens, discoveries, and stories shared by our worldwide community of passionate flower growers.
          </p>

          <div className="mem-ha" style={{ display: "flex", flexWrap: "wrap", gap: 14, opacity: 0 }}>
            <button onClick={() => setShowUpload(true)} className="btn btn-primary btn-lg">
              <Upload size={15} /> Share Your Photos
            </button>
            <Link href="/stories" className="btn btn-outline btn-lg">
              <PenLine size={15} /> Submit a Story
            </Link>
          </div>

          <div className="mem-ha" style={{ display: "flex", flexWrap: "wrap", gap: 32, marginTop: 48, paddingTop: 32, borderTop: "1px solid var(--border-s)", opacity: 0 }}>
            {[
              { n: "5,000+", l: "Active Members" },
              { n: String(photos.length), l: "Gallery Photos" },
              { n: "2",      l: "Featured Stories" },
            ].map(({ n, l }) => (
              <div key={l}>
                <div style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "clamp(1.4rem,2.8vw,2.2rem)", fontWeight: 800, color: "var(--cream)", lineHeight: 1, letterSpacing: "-0.02em" }}>{n}</div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginTop: 6 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TABS BAR ── */}
      <div style={{ position: "sticky", top: "68px", zIndex: 30, background: "rgba(6,3,10,0.96)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border-s)" }}>
        <div className="container" style={{ paddingTop: 16, paddingBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", gap: 6 }}>
              {(["gallery", "stories"] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "9px 22px", borderRadius: 9999, fontSize: 11, fontWeight: activeTab === tab ? 600 : 400, fontFamily: "var(--font-sans)", letterSpacing: "0.09em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.25s", background: activeTab === tab ? "linear-gradient(135deg,var(--rose),var(--rose-light))" : "rgba(253,248,240,0.06)", color: activeTab === tab ? "white" : "var(--muted)", border: `1px solid ${activeTab === tab ? "transparent" : "var(--border-s)"}`, boxShadow: activeTab === tab ? "0 4px 16px rgba(184,43,88,0.35)" : "none" }}>
                  {tab === "gallery" ? "Photo Gallery" : "Member Stories"}
                </button>
              ))}
            </div>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--dim)", letterSpacing: "0.06em" }}>
              {activeTab === "gallery" ? `${photos.length} photos from our community` : `${FEATURED_STORIES.length} featured stories`}
            </span>
          </div>
        </div>
      </div>

      {/* ── GALLERY TAB ── */}
      {activeTab === "gallery" && (
        <section style={{ background: "var(--surface)", padding: "4rem 0 5rem" }}>
          <div className="container">
            <div style={{ marginBottom: "2.5rem" }}>
              <div className="eyebrow mb-3">Community Gallery</div>
              <h2 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "clamp(1.7rem,3.2vw,2.6rem)", fontWeight: 700, color: "var(--cream)" }}>
                Flowers Through Every Lens
              </h2>
            </div>

            <div className="masonry">
              {photos.map((photo, i) => (
                <GalleryCard
                  key={photo.id}
                  photo={photo}
                  height={[320, 260, 240, 300, 280, 220, 300, 260, 340][i % 9]}
                  liked={!!liked[photo.id]}
                  onLike={() => setLiked(l => ({ ...l, [photo.id]: !l[photo.id] }))}
                  onOpen={() => setLightbox(photo)}
                  pool={pool}
                />
              ))}
            </div>

            <div style={{ marginTop: 48, textAlign: "center" }}>
              <Link href="/plants" className="btn btn-outline btn-lg">
                Explore Flower Catalog <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── STORIES TAB ── */}
      {activeTab === "stories" && (
        <section style={{ background: "var(--surface)", padding: "4rem 0 5rem" }}>
          <div className="container">
            <div style={{ marginBottom: "2.5rem" }}>
              <div className="eyebrow mb-3">Member Stories</div>
              <h2 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "clamp(1.7rem,3.2vw,2.6rem)", fontWeight: 700, color: "var(--cream)" }}>
                Bloom Journals
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,480px),1fr))", gap: 28, marginBottom: 48 }}>
              {FEATURED_STORIES.map(story => (
                <StoryCard key={story.title} story={story} pool={pool} />
              ))}
            </div>

            {/* Submit CTA */}
            <div style={{ position: "relative", overflow: "hidden", borderRadius: 24, padding: "56px 48px", background: "var(--card)", border: "1px solid rgba(184,43,88,0.22)", textAlign: "center" }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 70% at 50% 60%,rgba(184,43,88,0.22) 0%,transparent 70%)", pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div className="eyebrow mb-5" style={{ justifyContent: "center" }}>Add Your Voice</div>
                <h3 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 700, color: "var(--cream)", marginBottom: "1rem", lineHeight: 1.1 }}>Share Your Bloom Story</h3>
                <p style={{ fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)", fontSize: "clamp(1rem,1.8vw,1.25rem)", fontStyle: "italic", color: "var(--muted)", maxWidth: 480, margin: "0 auto 2.5rem", lineHeight: 1.8 }}>
                  Share your garden journal, flower experiments, or botanical discoveries with our global community.
                </p>
                <Link href="/stories" className="btn btn-primary btn-lg">
                  Go to Stories Page <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── LIGHTBOX ── */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(4,2,8,0.96)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ maxWidth: 860, width: "100%", position: "relative" }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setLightbox(null)} style={{ position: "absolute", top: -48, right: 0, width: 38, height: 38, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.75)", cursor: "pointer" }}>
              <X size={18} />
            </button>
            <img src={pick(pool, lightbox.type.toLowerCase())} alt={lightbox.caption} style={{ width: "100%", maxHeight: "76vh", objectFit: "contain", display: "block", borderRadius: 16 }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 18, paddingLeft: 4, paddingRight: 4 }}>
              <div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, color: "var(--cream)", marginBottom: 4 }}>{lightbox.caption}</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--dim)", letterSpacing: "0.05em" }}>by {lightbox.author} · {lightbox.type}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <button onClick={() => setLiked(l => ({ ...l, [lightbox.id]: !l[lightbox.id] }))} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontFamily: "var(--font-sans)", color: liked[lightbox.id] ? "var(--rose-light)" : "var(--muted)", background: "none", border: "none", cursor: "pointer" }}>
                  <Heart size={16} fill={liked[lightbox.id] ? "var(--rose-light)" : "none"} />
                  {lightbox.likes + (liked[lightbox.id] ? 1 : 0)}
                </button>
                <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontFamily: "var(--font-sans)", color: "var(--muted)" }}>
                  <MessageCircle size={15} /> {lightbox.comments}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── UPLOAD MODAL ── */}
      {showUpload && (
        <div onClick={closeUpload} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(6,3,10,0.88)", backdropFilter: "blur(14px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div ref={uploadRef} onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 560, maxHeight: "92vh", overflowY: "auto", background: "var(--card)", border: "1px solid rgba(184,43,88,0.22)", borderRadius: 24, boxShadow: "0 40px 100px rgba(0,0,0,0.65)", opacity: 0 }}>

            {uploadDone ? (
              /* ── Success ── */
              <div style={{ padding: "64px 40px", textAlign: "center" }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,rgba(45,154,107,0.2),rgba(45,154,107,0.1))", border: "1px solid rgba(45,154,107,0.4)", margin: "0 auto 24px" }}>
                  <Check size={28} style={{ color: "#4CD197" }} />
                </div>
                <h3 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "1.6rem", fontWeight: 700, color: "var(--cream)", marginBottom: 12 }}>Photo Added!</h3>
                <p style={{ fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)", fontSize: "1.1rem", fontStyle: "italic", color: "var(--muted)", lineHeight: 1.8 }}>
                  Your flower photo has been added to the gallery.
                </p>
              </div>
            ) : (
              /* ── Form ── */
              <>
                {/* Header */}
                <div style={{ padding: "28px 32px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div>
                    <div className="eyebrow mb-3">Community Gallery</div>
                    <h3 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "1.55rem", fontWeight: 700, color: "var(--cream)", lineHeight: 1.1 }}>Share a Flower Photo</h3>
                    <p style={{ fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)", fontSize: "1rem", fontStyle: "italic", color: "var(--muted)", marginTop: 8 }}>
                      Flowers only — no animals, people or landscapes.
                    </p>
                  </div>
                  <button onClick={closeUpload} style={{ flexShrink: 0, marginLeft: 16, width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(253,248,240,0.07)", border: "1px solid var(--border-s)", color: "var(--muted)", cursor: "pointer" }}>
                    <X size={16} />
                  </button>
                </div>

                <div style={{ height: 1, background: "var(--border-s)", margin: "20px 0" }} />

                <form onSubmit={handleUploadSubmit} style={{ padding: "0 32px 32px" }}>

                  {/* Label wrapping the file input — most reliable cross-browser approach.
                      The <label> with htmlFor triggers the input natively on click,
                      no programmatic .click() needed.                               */}
                  <label
                    htmlFor="member-photo-upload"
                    style={{
                      display: "block", position: "relative", borderRadius: 16, marginBottom: 24,
                      cursor: "pointer",
                      border: `2px dashed ${previewSrc ? "rgba(184,43,88,0.55)" : "rgba(184,43,88,0.35)"}`,
                      background: previewSrc ? "transparent" : "rgba(184,43,88,0.05)",
                      overflow: "hidden", minHeight: 200,
                      transition: "border-color 0.2s, background 0.2s",
                    }}
                  >
                    <input
                      id="member-photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
                    />

                    {previewSrc ? (
                      <>
                        <img
                          src={previewSrc}
                          alt="Preview"
                          style={{ width: "100%", height: 220, objectFit: "cover", display: "block", pointerEvents: "none" }}
                        />
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 0", background: "rgba(6,3,10,0.7)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, pointerEvents: "none" }}>
                          <ImageIcon size={13} style={{ color: "var(--petal)" }} />
                          <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, color: "var(--petal)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                            Click to change photo
                          </span>
                        </div>
                      </>
                    ) : (
                      <div style={{ padding: "40px 24px", textAlign: "center", pointerEvents: "none" }}>
                        <div style={{ width: 52, height: 52, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(184,43,88,0.15)", border: "1px solid rgba(184,43,88,0.3)", margin: "0 auto 16px" }}>
                          <Upload size={22} style={{ color: "var(--rose-light)" }} />
                        </div>
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, color: "var(--cream)", marginBottom: 6 }}>
                          Click to choose a photo
                        </p>
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--dim)", letterSpacing: "0.04em" }}>
                          JPG, PNG · Max 10 MB · Flowers only
                        </p>
                      </div>
                    )}
                  </label>

                  {/* Fields */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    <div>
                      <label className="form-label">Caption *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Describe your flower — variety, season, location"
                        style={{ borderRadius: 10 }}
                        value={caption}
                        onChange={e => setCaption(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">Your Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="How you'd like to be credited"
                        style={{ borderRadius: 10 }}
                        value={authorName}
                        onChange={e => setAuthorName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">Flower Type</label>
                      <select
                        className="form-input"
                        style={{ borderRadius: 10 }}
                        value={flowerType}
                        onChange={e => setFlowerType(e.target.value)}
                      >
                        <option value="">Select type…</option>
                        {["Rose","Peony","Tulip","Orchid","Dahlia","Lily","Rhododendron","Lavender","Sunflower","Lotus","Other"].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {!previewSrc && (
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--rose-light)", marginTop: 14, textAlign: "center" }}>
                      Please select a photo first
                    </p>
                  )}

                  {/* Buttons */}
                  <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                    <button
                      type="submit"
                      disabled={!previewSrc}
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 24px", borderRadius: 12, fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-sans)", background: previewSrc ? "linear-gradient(135deg,var(--rose),var(--rose-light))" : "rgba(253,248,240,0.06)", color: previewSrc ? "white" : "var(--dim)", border: "none", boxShadow: previewSrc ? "0 8px 24px rgba(184,43,88,0.35)" : "none", cursor: previewSrc ? "pointer" : "not-allowed", transition: "all 0.25s" }}
                    >
                      <Sparkles size={14} /> Add to Gallery
                    </button>
                    <button
                      type="button"
                      onClick={closeUpload}
                      style={{ padding: "14px 22px", borderRadius: 12, fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-sans)", background: "rgba(253,248,240,0.06)", color: "var(--muted)", border: "1.5px solid rgba(253,248,240,0.12)", cursor: "pointer" }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   GALLERY CARD
───────────────────────────────────────────────────────── */
function GalleryCard({ photo, height, liked, onLike, onOpen, pool }: {
  photo: Photo;
  height: number;
  liked: boolean;
  onLike: () => void;
  onOpen: () => void;
  pool: FlowerPool;
}) {
  const imgRef     = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const onEnter = () => {
    if (imgRef.current)     gsap.to(imgRef.current,     { scale: 1.07, duration: 0.6, ease: "power2.out" });
    if (overlayRef.current) gsap.to(overlayRef.current, { opacity: 1, duration: 0.3 });
  };
  const onLeave = () => {
    if (imgRef.current)     gsap.to(imgRef.current,     { scale: 1,    duration: 0.6, ease: "power2.out" });
    if (overlayRef.current) gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 });
  };

  return (
    <div className="gallery-item masonry-item" onMouseEnter={onEnter} onMouseLeave={onLeave}
      style={{ position: "relative", borderRadius: 14, overflow: "hidden", cursor: "pointer" }}
    >
      <div style={{ height, overflow: "hidden" }}>
        <img
          ref={imgRef}
          src={pick(pool, photo.type.toLowerCase())}
          alt={photo.caption}
          onClick={onOpen}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transformOrigin: "center" }}
          onError={e => { (e.currentTarget as HTMLImageElement).style.background = "var(--card)"; }}
        />
      </div>

      <div ref={overlayRef} onClick={onOpen}
        style={{ position: "absolute", inset: 0, opacity: 0, background: "linear-gradient(to top,rgba(6,3,10,0.92) 0%,rgba(6,3,10,0.2) 55%,transparent 100%)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "20px 18px 18px" }}
      >
        <span style={{ alignSelf: "flex-start", fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 11px", borderRadius: 9999, background: "rgba(184,43,88,0.3)", border: "1px solid rgba(184,43,88,0.5)", color: "var(--petal)", marginBottom: 10 }}>
          {photo.type}
        </span>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500, color: "white", lineHeight: 1.4, marginBottom: 6 }}>
          {photo.caption}
        </p>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "rgba(255,255,255,0.55)", letterSpacing: "0.03em", marginBottom: 14 }}>
          by {photo.author}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 16, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <button
            onClick={e => { e.stopPropagation(); onLike(); }}
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontFamily: "var(--font-sans)", color: liked ? "var(--rose-light)" : "rgba(255,255,255,0.6)", background: "none", border: "none", cursor: "pointer", transition: "color 0.2s" }}
          >
            <Heart size={13} fill={liked ? "var(--rose-light)" : "none"} />
            {photo.likes + (liked ? 1 : 0)}
          </button>
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontFamily: "var(--font-sans)", color: "rgba(255,255,255,0.45)" }}>
            <MessageCircle size={12} /> {photo.comments}
          </span>
          <span style={{ marginLeft: "auto", color: "rgba(255,255,255,0.45)" }}>
            <ZoomIn size={14} />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   STORY CARD
───────────────────────────────────────────────────────── */
function StoryCard({ story, pool }: { story: typeof FEATURED_STORIES[0]; pool: FlowerPool }) {
  const ref    = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const onEnter = () => {
    if (ref.current)    gsap.to(ref.current,    { y: -6, duration: 0.3, ease: "power2.out" });
    if (imgRef.current) gsap.to(imgRef.current, { scale: 1.06, duration: 0.55, ease: "power2.out" });
    if (ref.current) { ref.current.style.borderColor = "rgba(184,43,88,0.3)"; ref.current.style.boxShadow = "0 24px 64px rgba(0,0,0,0.45)"; }
  };
  const onLeave = () => {
    if (ref.current)    gsap.to(ref.current,    { y: 0, duration: 0.35, ease: "power2.out" });
    if (imgRef.current) gsap.to(imgRef.current, { scale: 1,    duration: 0.55, ease: "power2.out" });
    if (ref.current) { ref.current.style.borderColor = "rgba(253,248,240,0.07)"; ref.current.style.boxShadow = "none"; }
  };

  return (
    <div ref={ref} className="story-card" onMouseEnter={onEnter} onMouseLeave={onLeave}
      style={{ background: "var(--card)", border: "1px solid var(--border-s)", borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column", transition: "border-color 0.25s, box-shadow 0.25s" }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 280, overflow: "hidden", flexShrink: 0 }}>
        <img
          ref={imgRef}
          src={pick(pool, story.type)}
          alt={story.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", transformOrigin: "center" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(6,3,10,0.75) 0%,transparent 55%)" }} />
        <span style={{ position: "absolute", top: 16, right: 16, display: "flex", alignItems: "center", gap: 5, fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", padding: "5px 12px", borderRadius: 9999, background: "rgba(6,3,10,0.65)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)" }}>
          <Clock size={10} /> {story.readTime} read
        </span>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(to right,${story.accent},transparent)` }} />
      </div>

      {/* Body */}
      <div style={{ padding: "26px 28px 28px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 9999, background: story.accent + "22", border: `1px solid ${story.accent}45`, color: story.accent }}>Story</span>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--dim)", letterSpacing: "0.04em" }}>{story.date}</span>
        </div>

        <h3 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "clamp(1.2rem,2vw,1.5rem)", fontWeight: 700, color: "var(--cream)", lineHeight: 1.2, marginBottom: 6 }}>
          {story.title}
        </h3>
        <p style={{ fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)", fontSize: "1.05rem", fontStyle: "italic", color: "var(--rose-light)", marginBottom: 16, lineHeight: 1.4 }}>
          {story.subtitle}
        </p>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 300, color: "var(--muted)", lineHeight: 1.85, flex: 1, marginBottom: 22 }}>
          {story.excerpt}
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 18, borderTop: "1px solid var(--border-s)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg,${story.accent}55,${story.accent}22)`, border: `1px solid ${story.accent}50`, fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: 13, fontWeight: 700, color: story.accent, flexShrink: 0 }}>
              {story.initials}
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500, color: "var(--cream)", lineHeight: 1 }}>{story.author}</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 10, color: "var(--dim)", marginTop: 3, letterSpacing: "0.04em" }}>Club Member</div>
            </div>
          </div>
          <Link href="/stories" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", fontFamily: "var(--font-sans)", color: "var(--rose-light)" }}>
            Read <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
