"use client";
import { useState, useEffect } from "react";

/* ── Verified fallbacks ───────────────────────────────────────────────────
   Every URL below was manually confirmed to show only flowers.
   These display instantly (zero flicker) and are replaced by type-accurate
   Unsplash API results once UNSPLASH_ACCESS_KEY is set in .env.local.

   Source key:
     P(id)  → images.pexels.com
     U(id)  → images.unsplash.com
──────────────────────────────────────────────────────────────────────── */
const P = (id: number, file = `pexels-photo-${id}.jpeg`) =>
  `https://images.pexels.com/photos/${id}/${file}?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop`;

const U = (id: string) =>
  `https://images.unsplash.com/${id}?w=800&q=80&auto=format&fit=crop`;

export const FLOWER_FALLBACKS: Record<string, string[]> = {
  // ── 3 unique verified photos per type ──
  rose:          [ P(56866, "garden-rose-red-pink-56866.jpeg"), P(931177),                           U("photo-1519378058457-4c29a0a2efac") ],
  peony:         [ P(931177),                                   P(977455),                           U("photo-1525310072745-f49212b5ac6d") ],
  tulip:         [ U("photo-1525310072745-f49212b5ac6d"),       P(931177),                           P(56866, "garden-rose-red-pink-56866.jpeg") ],
  orchid:        [ P(977455),                                   U("photo-1525310072745-f49212b5ac6d"), P(931177) ],
  dahlia:        [ P(977455),                                   U("photo-1519378058457-4c29a0a2efac"), P(56866, "garden-rose-red-pink-56866.jpeg") ],
  lily:          [ U("photo-1525310072745-f49212b5ac6d"),       U("photo-1519378058457-4c29a0a2efac"), P(977455) ],
  rhododendron:  [ U("photo-1462275646964-a0e3386b89fa"),       P(977455),                           P(931177) ],
  lavender:      [ P(207518),                                   U("photo-1499002238440-d264edd596ec"), P(977455) ],
  sunflower:     [ P(33044, "sunflower-sun-summer-yellow-33044.jpg"), U("photo-1470509037663-253afd7f0f51"), U("photo-1597848212624-a19eb35e2651") ],
  lotus:         [ P(977455),                                   U("photo-1519378058457-4c29a0a2efac"), P(931177) ],
  iris:          [ P(207518),                                   U("photo-1525310072745-f49212b5ac6d"), P(977455) ],
  wildflower:    [ U("photo-1574684891174-df6b02ab38d7"),       P(977455),                           U("photo-1462275646964-a0e3386b89fa") ],
};

export type FlowerPool = Record<string, string[]>;

/** Global client-side cache — each type fetched at most once per session */
const _cache = new Map<string, string[]>();

/**
 * Auto-incrementing counters per type so that every call to pick()
 * without an explicit index gets a different photo from the array.
 * Resets on page refresh (module reload).
 */
const _counters = new Map<string, number>();

/**
 * Pick one URL for a given flower type.
 *
 * - With an explicit `index` (e.g. grid slots): returns arr[index % len]
 * - Without an index: auto-increments per type so each call on the page
 *   gets a different photo — no duplicates even when the same type is used
 *   in multiple components.
 */
export function pick(pool: FlowerPool, type: string, index?: number): string {
  const arr = pool[type] ?? FLOWER_FALLBACKS[type] ?? FLOWER_FALLBACKS.rose!;
  if (index !== undefined) {
    return arr[index % arr.length]!;
  }
  // Auto-increment
  const i = (_counters.get(type) ?? 0) % arr.length;
  _counters.set(type, i + 1);
  return arr[i]!;
}

/**
 * Returns a pool initialised with verified fallback photos immediately,
 * then silently upgrades to type-accurate Unsplash photos once
 * UNSPLASH_ACCESS_KEY is configured and /api/flowers responds.
 */
export function useFlowerPool(types: readonly string[], perType = 8): FlowerPool {
  const key = types.join(",");

  const [pool, setPool] = useState<FlowerPool>(() =>
    Object.fromEntries(
      types.map(t => [t, _cache.get(t) ?? FLOWER_FALLBACKS[t] ?? FLOWER_FALLBACKS.rose!])
    )
  );

  useEffect(() => {
    const missing = types.filter(t => !_cache.has(t));
    if (!missing.length) return;

    const params = new URLSearchParams({ count: String(perType) });
    missing.forEach(t => params.append("types", t));

    fetch(`/api/flowers?${params}`)
      .then(r => r.ok ? r.json() : {})
      .then((data: Record<string, string[]>) => {
        let changed = false;
        missing.forEach(t => {
          if (data[t]?.length) { _cache.set(t, data[t]); changed = true; }
        });
        if (!changed) return;
        setPool(prev => ({
          ...prev,
          ...Object.fromEntries(
            missing.map(t => [t, _cache.get(t) ?? FLOWER_FALLBACKS[t] ?? FLOWER_FALLBACKS.rose!])
          ),
        }));
      })
      .catch(() => { /* keep fallbacks silently */ });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return pool;
}
