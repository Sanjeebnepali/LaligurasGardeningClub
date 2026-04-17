"use client";
export default function Marquee() {
  const items = [
    "Himalayan Rhododendron",
    "Alpine Peony",
    "Cobra Lily",
    "Himalayan Blue Poppy",
    "Edelweiss",
    "Primula",
    "Himalayan Balsam",
    "Tree Peony",
    "Rock Rose",
    "Wild Orchid",
  ];

  const repeated = [...items, ...items];

  return (
    <div
      className="overflow-hidden border-y"
      style={{ background: "var(--c-deep)", borderColor: "rgba(255,255,255,0.06)", padding: "14px 0" }}
    >
      <div className="marquee-track">
        {repeated.map((item, i) => (
          <span
            key={i}
            className="flex items-center"
            style={{ fontFamily: "Georgia, serif", fontSize: "13px", fontStyle: "italic", color: "rgba(255,255,255,0.55)", paddingRight: "48px", flexShrink: 0 }}
          >
            {item}
            <span
              className="inline-block ml-12 w-1 h-1 rounded-full"
              style={{ background: "var(--c-rose)", flexShrink: 0 }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
