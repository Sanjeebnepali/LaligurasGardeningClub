import { NextRequest, NextResponse } from "next/server";

/* ── Search queries — each anchored to a specific botanical term ──────────
   Rule: every query MUST contain the word "flower" or "bloom".
   No orientation filter — most macro flower shots are portrait.
   We fetch 30, filter strictly on tags, keep the best N.
──────────────────────────────────────────────────────────────────────── */
const QUERIES: Record<string, string> = {
  rose:          "rose flower",
  peony:         "peony flower",
  tulip:         "tulip flower",
  orchid:        "orchid flower",
  dahlia:        "dahlia flower",
  lily:          "lily flower bloom",
  rhododendron:  "rhododendron flower bloom",
  lavender:      "lavender flower bloom",
  sunflower:     "sunflower flower bloom",
  lotus:         "lotus flower bloom",
  iris:          "iris flower bloom",
  wildflower:    "wildflower bloom",
};

/* ── Tag-based allow list — a photo MUST have at least one of these ─── */
const FLOWER_TAGS = new Set([
  "flower","bloom","blossom","petal","floral","botanical","bouquet","flora",
  "rose","peony","tulip","orchid","dahlia","lily","lavender","sunflower",
  "lotus","iris","rhododendron","wildflower","poppy","daisy","carnation",
  "chrysanthemum","hydrangea","magnolia","camellia","azalea","zinnia",
]);

/* ── Tag blocklist — reject if ANY tag matches ──────────────────────── */
const BAD_TAGS = new Set([
  "person","man","woman","girl","boy","child","people","human","face",
  "portrait","selfie","crowd","model",
  "cat","dog","horse","bird","eagle","animal","insect","deer","fox","bear",
  "mountain","ocean","sea","lake","river","forest","sky","architecture",
  "building","city","street","food","car","vehicle",
]);

type UnsplashPhoto = {
  urls:            { regular: string };
  alt_description: string | null;
  tags?:           Array<{ type: string; title: string }>;
};

/* ── Server-side in-memory cache ────────────────────────────────────── */
const _cache = new Map<string, { urls: string[]; ts: number }>();
const TTL    = 3_600_000; // 1 h

function isFlowerPhoto(photo: UnsplashPhoto): boolean {
  const tags    = (photo.tags ?? []).map(t => t.title.toLowerCase());
  const desc    = (photo.alt_description ?? "").toLowerCase();
  const allText = [...tags, ...desc.split(/\W+/)];

  const hasBad  = allText.some(w => BAD_TAGS.has(w));
  if (hasBad) return false;

  // Accept if at least one flower tag confirmed, OR tags array is empty
  // (many good flower shots have no tags — trust the strict query instead)
  const hasGood = tags.length === 0 || allText.some(w => FLOWER_TAGS.has(w));
  return hasGood;
}

async function searchUnsplash(type: string, count: number): Promise<string[]> {
  const cached = _cache.get(type);
  if (cached && Date.now() - cached.ts < TTL) return cached.urls;

  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return [];

  const query = QUERIES[type] ?? `${type} flower`;

  // Fetch extra (30) so we still have enough after filtering
  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query",          query);
  url.searchParams.set("per_page",       "30");
  url.searchParams.set("content_filter", "high");
  // NO orientation filter — removes most macro flower shots

  try {
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Client-ID ${key}` },
      next:    { revalidate: 3600 },
    });
    if (!res.ok) return [];

    const data = await res.json() as { results: UnsplashPhoto[] };

    const urls = data.results
      .filter(isFlowerPhoto)
      .slice(0, count)
      .map(p => `${p.urls.regular}&w=800&q=80&auto=format&fit=crop`);

    if (urls.length) _cache.set(type, { urls, ts: Date.now() });
    return urls;
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const types = searchParams.getAll("types");
  const count = Math.min(Number(searchParams.get("count") ?? "8"), 30);

  if (!types.length) return NextResponse.json({});

  const result: Record<string, string[]> = {};
  await Promise.allSettled(
    types.map(async t => {
      const urls = await searchUnsplash(t, count);
      if (urls.length) result[t] = urls;
    })
  );

  return NextResponse.json(result, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" },
  });
}
