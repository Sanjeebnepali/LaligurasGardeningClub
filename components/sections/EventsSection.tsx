"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const UPCOMING = [
  {
    id: 1,
    title: "Spring Bloom Symposium",
    date: "May 11, 2025",
    time: "10:00 AM",
    location: "Laliguras Botanical Gardens",
    type: "Symposium",
    color: "var(--rose)",
  },
  {
    id: 2,
    title: "Pruning & Soil Health Workshop",
    date: "May 19, 2025",
    time: "2:00 PM",
    location: "Riverside Annex",
    type: "Workshop",
    color: "var(--gold)",
  },
  {
    id: 3,
    title: "Heritage Estate Garden Tour",
    date: "May 25, 2025",
    time: "9:00 AM",
    location: "South Heritage Park",
    type: "Tour",
    color: "var(--petal)",
  },
];

export default function EventsSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".ev-card", {
        y: 50, opacity: 0, duration: 0.85, stagger: 0.14, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 78%" },
      });
      gsap.from(".ev-head", {
        y: 40, opacity: 0, duration: 0.9,
        scrollTrigger: { trigger: ref.current, start: "top 82%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="section-pad-lg" style={{ background: "var(--surface)" }}>
      <div className="container">

        <div className="ev-head flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="eyebrow-gold mb-4">Upcoming Events</div>
            <h2
              style={{
                fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontWeight: 800,
                letterSpacing: "-0.015em",
                color: "var(--cream)",
                lineHeight: 1.1,
              }}
            >
              Blooms &amp;<br />
              <span
                style={{
                  background: "linear-gradient(135deg, var(--gold), var(--gold-light))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Gatherings
              </span>
            </h2>
          </div>
          <Link href="/events" className="btn btn-outline flex-shrink-0">
            Full Calendar <ArrowRight size={14} />
          </Link>
        </div>

        <div className="flex flex-col gap-5">
          {UPCOMING.map((ev) => (
            <div
              key={ev.id}
              className="ev-card card rounded-xl overflow-hidden"
              style={{ padding: "0" }}
            >
              <div className="flex flex-col sm:flex-row">
                {/* Color stripe */}
                <div
                  className="sm:w-[5px] w-full h-1.5 sm:h-auto flex-shrink-0"
                  style={{ background: ev.color }}
                />

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-7 flex-1">
                  <div className="flex items-start gap-5">
                    {/* Date block */}
                    <div
                      className="flex-shrink-0 rounded-lg flex flex-col items-center justify-center px-4 py-3"
                      style={{ background: "var(--card-hover)", minWidth: "64px", border: "1px solid var(--border-s)" }}
                    >
                      <span className="t-label" style={{ color: "var(--muted)", fontSize: "8px" }}>
                        {ev.date.split(" ")[0].toUpperCase()}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                          fontSize: "1.6rem",
                          fontWeight: 700,
                          color: "var(--cream)",
                          lineHeight: 1,
                        }}
                      >
                        {ev.date.split(" ")[1].replace(",", "")}
                      </span>
                    </div>

                    <div>
                      <span className="badge badge-subtle mb-2">{ev.type}</span>
                      <h3
                        style={{
                          fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          color: "var(--cream)",
                        }}
                      >
                        {ev.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 mt-2">
                        <span className="flex items-center gap-1.5 t-small" style={{ color: "var(--muted)" }}>
                          <Calendar size={12} style={{ color: "var(--rose-light)" }} />
                          {ev.date} · {ev.time}
                        </span>
                        <span className="flex items-center gap-1.5 t-small" style={{ color: "var(--muted)" }}>
                          <MapPin size={12} style={{ color: "var(--rose-light)" }} />
                          {ev.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link href="/events" className="btn btn-outline-rose btn-sm flex-shrink-0">
                    RSVP <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
