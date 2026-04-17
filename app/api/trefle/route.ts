import { NextRequest, NextResponse } from "next/server";

const TREFLE_BASE = "https://trefle.io/api/v1";
const TOKEN = process.env.TREFLE_API_KEY;

export async function GET(req: NextRequest) {
  if (!TOKEN) {
    return NextResponse.json({ error: "Trefle API key not configured" }, { status: 500 });
  }

  const { searchParams } = req.nextUrl;
  const q      = searchParams.get("q");
  const page   = searchParams.get("page") || "1";
  const perPage = searchParams.get("per_page") || "20";

  let trefleUrl: string;

  if (q) {
    // Search endpoint
    trefleUrl = `${TREFLE_BASE}/plants/search?q=${encodeURIComponent(q)}&token=${TOKEN}&page=${page}&per_page=${perPage}&filter[has_images]=true`;
  } else {
    // List endpoint — filter for plants that have images and are flowers
    trefleUrl = `${TREFLE_BASE}/plants?token=${TOKEN}&page=${page}&per_page=${perPage}&filter[has_images]=true`;
  }

  try {
    const res = await fetch(trefleUrl, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 }, // cache for 1 hour
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Trefle API error:", res.status, text);
      return NextResponse.json({ error: "Trefle API error", status: res.status }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Trefle fetch failed:", err);
    return NextResponse.json({ error: "Failed to fetch from Trefle" }, { status: 500 });
  }
}
