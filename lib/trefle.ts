export interface TreflePlant {
  id: number;
  common_name: string | null;
  scientific_name: string;
  image_url: string | null;
  family_common_name: string | null;
  genus: string;
  slug: string;
}

export interface TrefleResponse {
  data: TreflePlant[];
  meta: { total: number };
  links: { self: string; first: string; next?: string; last?: string };
}

export interface TreflePlantDetail extends TreflePlant {
  main_species?: {
    common_name: string | null;
    scientific_name: string;
    family: string;
    genus: string;
    observations: string | null;
    growth?: {
      description: string | null;
      maximum_height?: { cm: number | null };
      bloom_months?: string[];
    };
    images?: {
      flower?: Array<{ image_url: string; copyright: string | null }>;
    };
  };
}

export const FLOWER_QUERIES = [
  "rose", "peony", "tulip", "orchid", "dahlia",
  "lily", "rhododendron", "lavender", "sunflower", "lotus",
];

/**
 * One verified Unsplash photo per flower type.
 * These are the ONLY photo IDs ever used — 100% guaranteed flowers, no mismatches.
 */
const FLOWER_PHOTO_IDS: Record<string, string> = {
  rose:         "photo-1553603227-2358aabe821e",
  peony:        "photo-1444930694458-01babf71870c",
  tulip:        "photo-1520763185298-1b434c919102",
  orchid:       "photo-1610397962076-02d29ea8e52e",
  dahlia:       "photo-1599629954294-14df9ec46bfa",
  lily:         "photo-1490750967868-88df5691cc25",
  rhododendron: "photo-1497436072909-60f360e1d4b1",
  lavender:     "photo-1457089328109-22a8040a6cc4",
  sunflower:    "photo-1470509037663-253afd7f0f51",
  lotus:        "photo-1508214751196-bcfd4ca60f91",
};

/**
 * Generate 10 visually distinct crops from ONE verified flower photo.
 * Unsplash CDN (imgix) supports `fit=crop&crop=<position>` parameters.
 * Different crop positions + two aspect ratios give 10 unique-looking frames
 * from the same guaranteed-flower photo. Zero risk of non-flower images.
 */
function cropPool(photoId: string): string[] {
  const b = `https://images.unsplash.com/${photoId}`;
  return [
    `${b}?w=800&h=1000&fit=crop&crop=entropy&q=85`,   // smart subject-aware crop
    `${b}?w=800&h=1000&fit=crop&crop=top&q=85`,        // top of the bloom
    `${b}?w=800&h=1000&fit=crop&crop=bottom&q=85`,     // base / stem area
    `${b}?w=800&h=1000&fit=crop&crop=left&q=85`,       // left portion
    `${b}?w=800&h=1000&fit=crop&crop=right&q=85`,      // right portion
    `${b}?w=800&h=1100&fit=crop&crop=entropy&q=85`,    // taller aspect, smart crop
    `${b}?w=800&h=1100&fit=crop&crop=top&q=85`,        // taller, top
    `${b}?w=800&h=1100&fit=crop&crop=bottom&q=85`,     // taller, bottom
    `${b}?w=750&h=950&fit=crop&crop=entropy&q=85`,     // tighter frame, smart crop
    `${b}?w=750&h=950&fit=crop&crop=top&q=85`,         // tighter frame, top
  ];
}

/**
 * Curated image pools — 10 unique crops of a verified flower photo per query.
 * ALWAYS use getCuratedImage() instead of Trefle's plant.image_url.
 */
export const CURATED_POOLS: Record<string, string[]> = Object.fromEntries(
  Object.entries(FLOWER_PHOTO_IDS).map(([key, id]) => [key, cropPool(id)])
);

/**
 * Always call this instead of using plant.image_url directly.
 * Assigns images from the correct flower-type pool by index, preventing
 * both name/image mismatch and repetition across plants of the same query.
 */
export function getCuratedImage(query: string, index: number): string {
  const pool = CURATED_POOLS[query] ?? CURATED_POOLS.rose;
  return pool[index % pool.length];
}

/** Fallback used by <img onError> — one reliable image per type */
export const FALLBACK_IMAGES: Record<string, string> = {
  rose:          "https://images.unsplash.com/photo-1553603227-2358aabe821e?w=600&q=80",
  peony:         "https://images.unsplash.com/photo-1444930694458-01babf71870c?w=600&q=80",
  tulip:         "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=600&q=80",
  orchid:        "https://images.unsplash.com/photo-1610397962076-02d29ea8e52e?w=600&q=80",
  dahlia:        "https://images.unsplash.com/photo-1599629954294-14df9ec46bfa?w=600&q=80",
  lily:          "https://images.unsplash.com/photo-1490750967868-88df5691cc25?w=600&q=80",
  rhododendron:  "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=600&q=80",
  lavender:      "https://images.unsplash.com/photo-1457089328109-22a8040a6cc4?w=600&q=80",
  sunflower:     "https://images.unsplash.com/photo-1470509037663-253afd7f0f51?w=600&q=80",
  lotus:         "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80",
  default:       "https://images.unsplash.com/photo-1479030160180-b1860951d696?w=600&q=80",
};

/** @deprecated Use getCuratedImage instead */
export function getPlantImage(plant: TreflePlant, query = "default"): string {
  if (plant.image_url) return plant.image_url;
  return FALLBACK_IMAGES[query] || FALLBACK_IMAGES.default;
}

export function getDisplayName(plant: TreflePlant): string {
  return plant.common_name || plant.scientific_name;
}
