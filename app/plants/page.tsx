"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Search, X, Heart, ChevronLeft, ChevronRight,
  Ruler, Globe, Leaf, Sparkles,
} from "lucide-react";
import { useFlowerPool, pick, type FlowerPool } from "@/lib/useFlowerPool";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────
   IMAGE SYSTEM
   One verified Unsplash photo per flower type (same 10 IDs
   that were working from day one). 8 different entropy crops
   per photo using distinct aspect ratios — entropy always
   focuses on the most visually interesting region = the flower.
───────────────────────────────────────────────────────── */
const PH: Record<string, string> = {
  rose:         "https://images.unsplash.com/photo-1553603227-2358aabe821e",
  peony:        "https://images.unsplash.com/photo-1444930694458-01babf71870c",
  tulip:        "https://images.unsplash.com/photo-1520763185298-1b434c919102",
  orchid:       "https://images.unsplash.com/photo-1610397962076-02d29ea8e52e",
  dahlia:       "https://images.unsplash.com/photo-1599629954294-14df9ec46bfa",
  lily:         "https://images.unsplash.com/photo-1490750967868-88df5691cc25",
  rhododendron: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1",
  lavender:     "https://images.unsplash.com/photo-1457089328109-22a8040a6cc4",
  sunflower:    "https://images.unsplash.com/photo-1470509037663-253afd7f0f51",
  lotus:        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91",
};

/* 8 genuinely different aspect ratios — entropy picks the
   flower-rich sub-region for each ratio, giving 8 visually
   distinct frames of the same verified flower photo.        */
const C = [
  "?w=800&h=1000&fit=crop&crop=entropy&q=85",  // 4:5  portrait
  "?w=800&h=800&fit=crop&crop=entropy&q=85",   // 1:1  square
  "?w=900&h=600&fit=crop&crop=entropy&q=85",   // 3:2  landscape
  "?w=600&h=900&fit=crop&crop=entropy&q=85",   // 2:3  portrait
  "?w=800&h=1100&fit=crop&crop=entropy&q=85",  // 8:11 tall portrait
  "?w=1100&h=800&fit=crop&crop=entropy&q=85",  // 11:8 landscape
  "?w=750&h=1000&fit=crop&crop=entropy&q=85",  // 3:4  portrait
  "?w=1000&h=750&fit=crop&crop=entropy&q=85",  // 4:3  landscape
];

const p = (t: string, i: number) => `${PH[t]}${C[i % C.length]}`;

const FB: Record<string, string> = {
  rose:         PH.rose         + "?w=600&q=80",
  peony:        PH.peony        + "?w=600&q=80",
  tulip:        PH.tulip        + "?w=600&q=80",
  orchid:       PH.orchid       + "?w=600&q=80",
  dahlia:       PH.dahlia       + "?w=600&q=80",
  lily:         PH.lily         + "?w=600&q=80",
  rhododendron: PH.rhododendron + "?w=600&q=80",
  lavender:     PH.lavender     + "?w=600&q=80",
  sunflower:    PH.sunflower    + "?w=600&q=80",
  lotus:        PH.lotus        + "?w=600&q=80",
};

/* ─────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────── */
type Diff = "Easy" | "Moderate" | "Expert";
interface Flower {
  id: number; name: string; latin: string; genus: string;
  family: string; img: string; desc: string; badge: string;
  bc: string; bloom: number[]; diff: Diff;
  h: string; nat: string; q: string;
}

/* ─────────────────────────────────────────────────────────
   STATIC FLOWER DATABASE — 80 flowers, 8 per type
   All images are entropy crops of the 10 verified photos.
───────────────────────────────────────────────────────── */
const ALL: Flower[] = [
  /* ROSES */
  { id:1,  name:"Damask Rose",          latin:"Rosa damascena",                  genus:"Rosa",         family:"Rosaceae",     img:p("rose",0), desc:"The legendary rose of Persia, prized for millennia for its exquisite fragrance and precious attar oil.",    badge:"Fragrant",     bc:"#D14E72", bloom:[4,5,6,7],          diff:"Moderate", h:"1.2–2 m",  nat:"Middle East",       q:"rose" },
  { id:2,  name:"French Rose",          latin:"Rosa gallica",                    genus:"Rosa",         family:"Rosaceae",     img:p("rose",1), desc:"One of the oldest cultivated roses, its rich crimson petals have graced apothecary gardens since antiquity.", badge:"Heritage",     bc:"#C0392B", bloom:[4,5,6],            diff:"Easy",     h:"0.8–1.2 m",nat:"Europe",            q:"rose" },
  { id:3,  name:"China Rose",           latin:"Rosa chinensis",                  genus:"Rosa",         family:"Rosaceae",     img:p("rose",2), desc:"A remarkable repeat-bloomer that revolutionised rose breeding, flowering almost continuously from spring to frost.", badge:"Everbloom",  bc:"#E91E8C", bloom:[3,4,5,6,7,8,9,10], diff:"Moderate", h:"0.5–2 m",  nat:"China",             q:"rose" },
  { id:4,  name:"Cabbage Rose",         latin:"Rosa centifolia",                 genus:"Rosa",         family:"Rosaceae",     img:p("rose",3), desc:"The 'hundred-petal' rose immortalised by Dutch masters — densely layered globe-shaped blooms of extraordinary beauty.", badge:"Painterly",  bc:"#FF6B9D", bloom:[4,5,6],            diff:"Moderate", h:"1.2–2 m",  nat:"Europe",            q:"rose" },
  { id:5,  name:"Beach Rose",           latin:"Rosa rugosa",                     genus:"Rosa",         family:"Rosaceae",     img:p("rose",4), desc:"Hardy and salt-tolerant with intensely fragrant single blooms followed by large vitamin C-rich scarlet hips.", badge:"Hardy",       bc:"#B82B58", bloom:[4,5,6,7,8,9],      diff:"Easy",     h:"1–2 m",    nat:"Northeast Asia",    q:"rose" },
  { id:6,  name:"Baby Rose",            latin:"Rosa multiflora",                 genus:"Rosa",         family:"Rosaceae",     img:p("rose",5), desc:"Graceful arching canes bearing masses of tiny fragrant white flowers in large clusters, beloved in Japanese gardens.", badge:"Delicate",   bc:"#F48FB1", bloom:[3,4,5],            diff:"Easy",     h:"2–5 m",    nat:"East Asia",         q:"rose" },
  { id:7,  name:"Dog Rose",             latin:"Rosa canina",                     genus:"Rosa",         family:"Rosaceae",     img:p("rose",6), desc:"The quintessential wild rose of European hedgerows with soft pink blooms giving way to plump scarlet hips.", badge:"Wild",         bc:"#E84B7A", bloom:[4,5],              diff:"Easy",     h:"1–5 m",    nat:"Europe · Asia",     q:"rose" },
  { id:8,  name:"Garden Rose",          latin:"Rosa × hybrida",                  genus:"Rosa",         family:"Rosaceae",     img:p("rose",7), desc:"The queen of the modern garden — bred for spectacular blooms, intoxicating fragrance and remarkable repeat-flowering.", badge:"Classic",     bc:"#D14E72", bloom:[4,5,6,7,8,9],      diff:"Moderate", h:"0.5–2 m",  nat:"Garden hybrid",     q:"rose" },

  /* PEONIES */
  { id:9,  name:"Chinese Peony",        latin:"Paeonia lactiflora",              genus:"Paeonia",      family:"Paeoniaceae",  img:p("peony",0), desc:"The most cultivated peony — sumptuous fragrant double blooms in white, pink and crimson, grown for over a millennium.", badge:"Fragrant",   bc:"#C2185B", bloom:[4,5,6],            diff:"Easy",     h:"60–90 cm", nat:"China · Tibet",     q:"peony" },
  { id:10, name:"Tree Peony",           latin:"Paeonia suffruticosa",            genus:"Paeonia",      family:"Paeoniaceae",  img:p("peony",1), desc:"The 'king of flowers' in Chinese tradition — a woody shrub bearing enormous crepe-paper blooms up to 30 cm across.", badge:"Majestic",   bc:"#AD1457", bloom:[3,4,5],            diff:"Moderate", h:"1–2 m",    nat:"China",             q:"peony" },
  { id:11, name:"Common Peony",         latin:"Paeonia officinalis",             genus:"Paeonia",      family:"Paeoniaceae",  img:p("peony",2), desc:"A beloved cottage stalwart with richly fragrant crimson blooms, revered since Roman times for medicinal properties.", badge:"Heritage",   bc:"#E91E63", bloom:[4,5],              diff:"Easy",     h:"60–90 cm", nat:"Europe",            q:"peony" },
  { id:12, name:"Caucasus Peony",       latin:"Paeonia mlokosewitschii",         genus:"Paeonia",      family:"Paeoniaceae",  img:p("peony",3), desc:"Nicknamed 'Molly the Witch' — enchanting single luminous pale yellow blooms, a rare and much-coveted collector's peony.", badge:"Rare",      bc:"#F06292", bloom:[3,4],              diff:"Moderate", h:"60–80 cm", nat:"Georgia · Russia",  q:"peony" },
  { id:13, name:"Fernleaf Peony",       latin:"Paeonia tenuifolia",              genus:"Paeonia",      family:"Paeoniaceae",  img:p("peony",4), desc:"A jewel of early spring with finely cut ferny foliage and brilliant single crimson blooms that open before others wake.", badge:"Early",     bc:"#C2185B", bloom:[2,3,4],            diff:"Moderate", h:"30–50 cm", nat:"SE Europe",         q:"peony" },
  { id:14, name:"Japanese Peony",       latin:"Paeonia obovata",                 genus:"Paeonia",      family:"Paeoniaceae",  img:p("peony",5), desc:"A woodland species with elegant cupped pale pink blooms and blue-green foliage that colours richly in autumn.", badge:"Elegant",    bc:"#E91E63", bloom:[3,4,5],            diff:"Moderate", h:"40–70 cm", nat:"Japan · Korea",     q:"peony" },
  { id:15, name:"Iberian Peony",        latin:"Paeonia broteri",                 genus:"Paeonia",      family:"Paeoniaceae",  img:p("peony",6), desc:"A protected species of the Iberian Peninsula with vivid magenta-pink blooms — precious Mediterranean floral heritage.", badge:"Protected",  bc:"#AD1457", bloom:[3,4,5],            diff:"Expert",   h:"50–70 cm", nat:"Spain · Portugal",  q:"peony" },
  { id:16, name:"Hybrid Tree Peony",    latin:"Paeonia × lemoinei",              genus:"Paeonia",      family:"Paeoniaceae",  img:p("peony",7), desc:"A spectacular hybrid combining herbaceous hardiness with tree peony scale, producing breathtaking semi-double blooms.", badge:"Hybrid",     bc:"#F48FB1", bloom:[4,5],              diff:"Moderate", h:"1–1.5 m",  nat:"Garden hybrid",     q:"peony" },

  /* TULIPS */
  { id:17, name:"Garden Tulip",         latin:"Tulipa gesneriana",               genus:"Tulipa",       family:"Liliaceae",    img:p("tulip",0), desc:"The iconic garden tulip — thousands of cultivars in every colour imaginable, the universal symbol of spring's arrival.", badge:"Classic",    bc:"#E84B7A", bloom:[2,3,4],            diff:"Easy",     h:"30–70 cm", nat:"Central Asia",      q:"tulip" },
  { id:18, name:"Lady Tulip",           latin:"Tulipa clusiana",                 genus:"Tulipa",       family:"Liliaceae",    img:p("tulip",1), desc:"A refined species tulip with star-shaped white blooms streaked with cherry red — delicate as porcelain and long-lived.", badge:"Delicate",  bc:"#F06292", bloom:[2,3,4],            diff:"Easy",     h:"25–45 cm", nat:"Asia Minor",         q:"tulip" },
  { id:19, name:"Wild Tulip",           latin:"Tulipa sylvestris",               genus:"Tulipa",       family:"Liliaceae",    img:p("tulip",2), desc:"A naturalising species with fragrant bright yellow blooms that spread happily in meadows, rewarding benign neglect.", badge:"Wild",       bc:"#FFD700", bloom:[2,3,4],            diff:"Easy",     h:"20–40 cm", nat:"Europe · Asia",     q:"tulip" },
  { id:20, name:"Late Tulip",           latin:"Tulipa tarda",                    genus:"Tulipa",       family:"Liliaceae",    img:p("tulip",3), desc:"A charming dwarf species bearing up to 5 star-shaped white blooms per stem each with a golden centre — ideal for rockeries.", badge:"Dwarf",    bc:"#FFC107", bloom:[3,4],              diff:"Easy",     h:"10–20 cm", nat:"Central Asia",      q:"tulip" },
  { id:21, name:"Turkestan Tulip",      latin:"Tulipa turkestanica",             genus:"Tulipa",       family:"Liliaceae",    img:p("tulip",4), desc:"One of the most floriferous tulip species, producing up to 12 small white blooms with yellow centres per stem in early spring.", badge:"Prolific", bc:"#FF8F00", bloom:[1,2,3],            diff:"Easy",     h:"15–30 cm", nat:"Central Asia",      q:"tulip" },
  { id:22, name:"Waterlily Tulip",      latin:"Tulipa kaufmanniana",             genus:"Tulipa",       family:"Liliaceae",    img:p("tulip",5), desc:"The earliest tulips to bloom — wide-opening star-shaped flowers in cream, red or yellow that evoke the beauty of waterlilies.", badge:"Early",   bc:"#FF7043", bloom:[1,2,3],            diff:"Easy",     h:"15–25 cm", nat:"Tien Shan Mts",     q:"tulip" },
  { id:23, name:"Greig's Tulip",        latin:"Tulipa greigii",                  genus:"Tulipa",       family:"Liliaceae",    img:p("tulip",6), desc:"Distinguished by attractively mottled foliage and brilliant scarlet blooms — one of the showiest of all species tulips.", badge:"Striking",  bc:"#E53935", bloom:[2,3,4],            diff:"Easy",     h:"20–35 cm", nat:"Kazakhstan",        q:"tulip" },
  { id:24, name:"Dwarf Tulip",          latin:"Tulipa humilis",                  genus:"Tulipa",       family:"Liliaceae",    img:p("tulip",7), desc:"A tiny gem with rose-violet blooms illuminated by a yellow and black centre — perfect for containers and alpine troughs.", badge:"Miniature",bc:"#E91E63", bloom:[1,2,3],            diff:"Easy",     h:"10–15 cm", nat:"Middle East",       q:"tulip" },

  /* ORCHIDS */
  { id:25, name:"Moth Orchid",          latin:"Phalaenopsis amabilis",           genus:"Phalaenopsis", family:"Orchidaceae",  img:p("orchid",0), desc:"The world's most popular orchid — arching sprays of pristine white blooms lasting months, with butterfly-wing petals.", badge:"Exotic",    bc:"#9B59B6", bloom:[0,1,2,3,10,11],    diff:"Easy",     h:"30–60 cm", nat:"SE Asia",            q:"orchid" },
  { id:26, name:"Crimson Cattleya",     latin:"Cattleya labiata",                genus:"Cattleya",     family:"Orchidaceae",  img:p("orchid",1), desc:"The original 'corsage orchid' — ruffled lavender-pink blooms with a stunning magenta lip carrying powerful sweet fragrance.", badge:"Fragrant", bc:"#8E44AD", bloom:[8,9,10,11],         diff:"Expert",   h:"30–60 cm", nat:"Brazil",            q:"orchid" },
  { id:27, name:"Noble Dendrobium",     latin:"Dendrobium nobile",               genus:"Dendrobium",   family:"Orchidaceae",  img:p("orchid",2), desc:"Clusters of elegant white-tipped pink blooms covering leafless canes in winter — spectacular fragrant display.", badge:"Winter",     bc:"#7B1FA2", bloom:[0,1,2,11],          diff:"Moderate", h:"30–90 cm", nat:"Himalayas",         q:"orchid" },
  { id:28, name:"Blue Orchid",          latin:"Vanda coerulea",                  genus:"Vanda",        family:"Orchidaceae",  img:p("orchid",3), desc:"The rarest colour in the orchid world — crystalline blue-violet tessellated blooms, now an endangered species of northeast India.", badge:"Rare", bc:"#5E35B1", bloom:[8,9,10],            diff:"Expert",   h:"60–120 cm",nat:"NE India",           q:"orchid" },
  { id:29, name:"Cymbidium Orchid",     latin:"Cymbidium insigne",               genus:"Cymbidium",    family:"Orchidaceae",  img:p("orchid",4), desc:"Elegant arching sprays of up to 30 cream-white blooms with crimson-spotted lips from the montane forests of Asia.", badge:"Elegant",   bc:"#673AB7", bloom:[0,1,2,11],          diff:"Moderate", h:"40–90 cm", nat:"Vietnam · Yunnan",  q:"orchid" },
  { id:30, name:"Lady's Slipper",       latin:"Paphiopedilum insigne",           genus:"Paphiopedilum",family:"Orchidaceae",  img:p("orchid",5), desc:"An aristocratic orchid with a distinctive apple-green and brown pouch lip, naturalised in the temples of Nepal.", badge:"Sculptural",bc:"#4A148C", bloom:[9,10,11,0],         diff:"Moderate", h:"20–40 cm", nat:"Nepal · India",     q:"orchid" },
  { id:31, name:"Dancing Lady",         latin:"Oncidium sphacelatum",            genus:"Oncidium",     family:"Orchidaceae",  img:p("orchid",6), desc:"Exuberant branching sprays of hundreds of yellow and brown blooms that sway in the breeze — the 'golden shower orchid'.", badge:"Floriferous",bc:"#FF9800",bloom:[2,3,4,5],           diff:"Easy",     h:"30–60 cm", nat:"Mexico",            q:"orchid" },
  { id:32, name:"Reed Orchid",          latin:"Epidendrum ibaguense",            genus:"Epidendrum",   family:"Orchidaceae",  img:p("orchid",7), desc:"A vigorous epiphyte bearing clusters of small orange-red blooms throughout the year — among the easiest exotic orchids.", badge:"Hardy",     bc:"#FF5722", bloom:[0,1,2,3,4,5,6,7,8,9,10,11],diff:"Easy",h:"30–100 cm",nat:"Central America",   q:"orchid" },

  /* DAHLIAS */
  { id:33, name:"Common Dahlia",        latin:"Dahlia pinnata",                  genus:"Dahlia",       family:"Asteraceae",   img:p("dahlia",0), desc:"Extraordinary genetic diversity spans from tiny pompoms to enormous dinner-plate blooms in every colour except true blue.", badge:"Showstopper",bc:"#E67E22",bloom:[6,7,8,9],           diff:"Moderate", h:"0.5–1.5 m",nat:"Mexico",            q:"dahlia" },
  { id:34, name:"Scarlet Dahlia",       latin:"Dahlia coccinea",                 genus:"Dahlia",       family:"Asteraceae",   img:p("dahlia",1), desc:"The species closest to dahlias' wild ancestors — vivid single blooms beloved by bees and butterflies throughout summer.", badge:"Wildlife",  bc:"#D35400", bloom:[6,7,8,9],           diff:"Easy",     h:"1–1.5 m",  nat:"Mexico",            q:"dahlia" },
  { id:35, name:"Tree Dahlia",          latin:"Dahlia imperialis",               genus:"Dahlia",       family:"Asteraceae",   img:p("dahlia",2), desc:"A magnificent giant reaching 6 metres, bearing soft lilac-pink blooms at the top — a spectacular autumn focal point.", badge:"Towering",  bc:"#9B59B6", bloom:[9,10,11],           diff:"Moderate", h:"3–6 m",    nat:"Mexico",            q:"dahlia" },
  { id:36, name:"Bishop of Llandaff",   latin:"Dahlia 'Bishop of Llandaff'",     genus:"Dahlia",       family:"Asteraceae",   img:p("dahlia",3), desc:"Fiery scarlet blooms of perfect symmetry against dark bronze-black foliage — one of the most dramatic dahlias ever bred.", badge:"Dramatic", bc:"#C0392B", bloom:[6,7,8,9,10],        diff:"Moderate", h:"1–1.2 m",  nat:"Garden hybrid",     q:"dahlia" },
  { id:37, name:"Café au Lait Dahlia",  latin:"Dahlia 'Café au Lait'",           genus:"Dahlia",       family:"Asteraceae",   img:p("dahlia",4), desc:"The most sought-after dahlia for weddings — enormous blooms in warm tones of cream, blush and caramel.", badge:"Bridal",     bc:"#DEB887", bloom:[6,7,8,9],           diff:"Moderate", h:"1–1.2 m",  nat:"Garden hybrid",     q:"dahlia" },
  { id:38, name:"Fascination Dahlia",   latin:"Dahlia 'Fascination'",            genus:"Dahlia",       family:"Asteraceae",   img:p("dahlia",5), desc:"Vivid magenta-pink blooms above dark reddish foliage — a prolific bloomer from summer until the first frosts.", badge:"Prolific",  bc:"#E91E63", bloom:[6,7,8,9,10],        diff:"Easy",     h:"60–90 cm", nat:"Garden hybrid",     q:"dahlia" },
  { id:39, name:"Ball Dahlia",          latin:"Dahlia 'Karma Choc'",             genus:"Dahlia",       family:"Asteraceae",   img:p("dahlia",6), desc:"Deep burgundy-brown ball-shaped blooms with a velvety texture — a sophisticated, moody colour unrivalled in the dahlia world.", badge:"Velvety",  bc:"#4E342E", bloom:[6,7,8,9],           diff:"Moderate", h:"90–120 cm",nat:"Garden hybrid",     q:"dahlia" },
  { id:40, name:"Cactus Dahlia",        latin:"Dahlia 'Bishop of York'",         genus:"Dahlia",       family:"Asteraceae",   img:p("dahlia",7), desc:"Golden yellow cactus-type blooms with spiky rolled petals above dark foliage — the warm counterpart to the Bishop's crimson sibling.", badge:"Warm Gold",bc:"#F4D03F",bloom:[6,7,8,9,10],        diff:"Moderate", h:"0.9–1.2 m",nat:"Garden hybrid",     q:"dahlia" },

  /* LILIES */
  { id:41, name:"Asiatic Lily",         latin:"Lilium asiatic",                  genus:"Lilium",       family:"Liliaceae",    img:p("lily",0), desc:"The most widely grown lily — upward-facing blooms in vivid oranges, pinks and yellows, naturally unscented but dazzling.", badge:"Hardy",     bc:"#F39C12", bloom:[5,6,7],            diff:"Easy",     h:"60–120 cm",nat:"East Asia",          q:"lily" },
  { id:42, name:"Easter Lily",          latin:"Lilium longiflorum",              genus:"Lilium",       family:"Liliaceae",    img:p("lily",1), desc:"Pristine white trumpet-shaped blooms with an irresistible sweet fragrance — the universal symbol of purity.", badge:"Sacred",     bc:"#ECEFF1", bloom:[5,6],              diff:"Easy",     h:"60–100 cm",nat:"Japan",              q:"lily" },
  { id:43, name:"Golden-rayed Lily",    latin:"Lilium auratum",                  genus:"Lilium",       family:"Liliaceae",    img:p("lily",2), desc:"Japan's 'queen of lilies' — enormous blooms up to 30 cm across, each petal adorned with a golden central stripe.", badge:"Queen",      bc:"#F4D03F", bloom:[6,7,8],            diff:"Moderate", h:"1–2 m",    nat:"Japan",              q:"lily" },
  { id:44, name:"Regal Lily",           latin:"Lilium regale",                   genus:"Lilium",       family:"Liliaceae",    img:p("lily",3), desc:"One of the most fragrant of all lilies — pure white trumpets with a golden throat, discovered in remote Sichuan gorges.", badge:"Fragrant",  bc:"#DDA0DD", bloom:[5,6,7],            diff:"Easy",     h:"1–2 m",    nat:"W. China",           q:"lily" },
  { id:45, name:"Madonna Lily",         latin:"Lilium candidum",                 genus:"Lilium",       family:"Liliaceae",    img:p("lily",4), desc:"The oldest cultivated lily, prized since Minoan times — pure white fragrant trumpets on tall stems above rosette foliage.", badge:"Ancient",  bc:"#F0F0F0", bloom:[5,6],              diff:"Moderate", h:"1–1.5 m",  nat:"W. Asia",            q:"lily" },
  { id:46, name:"Turk's Cap Lily",      latin:"Lilium martagon",                 genus:"Lilium",       family:"Liliaceae",    img:p("lily",5), desc:"Exquisite nodding blooms with strongly reflexed 'turban' petals in dusky pink spotted with purple, naturalising in shade.", badge:"Woodland", bc:"#E8A0B4", bloom:[5,6,7],            diff:"Easy",     h:"1–2 m",    nat:"Europe · Siberia",  q:"lily" },
  { id:47, name:"Japanese Lily",        latin:"Lilium speciosum",                genus:"Lilium",       family:"Liliaceae",    img:p("lily",6), desc:"Fragrant nodding blooms with reflexed white petals densely spotted and flushed with carmine — magnificent late-summer scent.", badge:"Late",      bc:"#C2185B", bloom:[7,8,9],            diff:"Moderate", h:"1–1.5 m",  nat:"Japan · China",     q:"lily" },
  { id:48, name:"Tiger Lily",           latin:"Lilium lancifolium",              genus:"Lilium",       family:"Liliaceae",    img:p("lily",7), desc:"Unmistakable orange blooms with dark purple-black spots and reflexed petals — naturalises into striking summer colonies.", badge:"Bold",       bc:"#FF5722", bloom:[6,7,8],            diff:"Easy",     h:"1–1.5 m",  nat:"China · Japan",     q:"lily" },

  /* RHODODENDRONS */
  { id:49, name:"Tree Rhododendron",    latin:"Rhododendron arboreum",           genus:"Rhododendron", family:"Ericaceae",    img:p("rhododendron",0), desc:"Nepal's national flower — a magnificent tree that smothers itself in crimson trusses painting Himalayan hillsides red each spring.", badge:"National",  bc:"#C0392B", bloom:[1,2,3,4],          diff:"Moderate", h:"3–20 m",   nat:"Himalayas",         q:"rhododendron" },
  { id:50, name:"Common Rhododendron", latin:"Rhododendron ponticum",            genus:"Rhododendron", family:"Ericaceae",    img:p("rhododendron",1), desc:"One of the most spectacular flowering shrubs — vast purple-lilac trusses smothering dense glossy-leaved bushes in late spring.", badge:"Vigorous",  bc:"#9B59B6", bloom:[4,5,6],            diff:"Easy",     h:"2–5 m",    nat:"Black Sea region",  q:"rhododendron" },
  { id:51, name:"Alpine Rose",          latin:"Rhododendron ferrugineum",        genus:"Rhododendron", family:"Ericaceae",    img:p("rhododendron",2), desc:"The mountain flower of the Alps — massed crimson-pink blooms on compact shrubs above the treeline, symbol of the high mountains.", badge:"Alpine",    bc:"#E53935", bloom:[5,6,7],            diff:"Moderate", h:"0.5–1 m",  nat:"Alps · Pyrenees",   q:"rhododendron" },
  { id:52, name:"Great Rhododendron",  latin:"Rhododendron maximum",            genus:"Rhododendron", family:"Ericaceae",    img:p("rhododendron",3), desc:"The largest native North American rhododendron — enormous glossy-leaved shrubs in vast Appalachian colonies.", badge:"Grand",      bc:"#F48FB1", bloom:[5,6,7],            diff:"Easy",     h:"2–6 m",    nat:"Eastern USA",       q:"rhododendron" },
  { id:53, name:"Catawba Rhododendron",latin:"Rhododendron catawbiense",        genus:"Rhododendron", family:"Ericaceae",    img:p("rhododendron",4), desc:"A frost-hardy North American species with rich lilac-purple blooms — the parent of countless cold-climate garden hybrids.", badge:"Hardy",     bc:"#7B1FA2", bloom:[4,5,6],            diff:"Easy",     h:"1.5–3 m",  nat:"SE USA",            q:"rhododendron" },
  { id:54, name:"Yakushima Rhodo.",    latin:"Rhododendron yakushimanum",        genus:"Rhododendron", family:"Ericaceae",    img:p("rhododendron",5), desc:"A compact dome-shaped Japanese species with extraordinary silvery new growth and soft pink blooms that fade to white.", badge:"Compact",   bc:"#FF80AB", bloom:[4,5],              diff:"Easy",     h:"1–2 m",    nat:"Yakushima, Japan",  q:"rhododendron" },
  { id:55, name:"Chinese Azalea",      latin:"Rhododendron molle",              genus:"Rhododendron", family:"Ericaceae",    img:p("rhododendron",6), desc:"A deciduous azalea producing vibrant yellow, orange and red blooms before leaves emerge — spectacular autumn colour too.", badge:"Deciduous", bc:"#FF9800", bloom:[3,4,5],            diff:"Moderate", h:"1.5–2 m",  nat:"China",             q:"rhododendron" },
  { id:56, name:"Flame Azalea",        latin:"Rhododendron calendulaceum",      genus:"Rhododendron", family:"Ericaceae",    img:p("rhododendron",7), desc:"'The most profuse and elegant wild shrub in North America' — stunning flame-orange and red blooms in Appalachian woodlands.", badge:"Flame",     bc:"#FF5722", bloom:[4,5,6],            diff:"Moderate", h:"1.5–3 m",  nat:"Eastern USA",       q:"rhododendron" },

  /* LAVENDER */
  { id:57, name:"Common Lavender",     latin:"Lavandula angustifolia",          genus:"Lavandula",    family:"Lamiaceae",    img:p("lavender",0), desc:"The most prized lavender — intensely fragrant purple spikes used in perfumery, culinary arts and aromatherapy for 2,500 years.", badge:"Aromatic",  bc:"#8E44AD", bloom:[5,6,7,8],           diff:"Easy",     h:"30–60 cm", nat:"Mediterranean",     q:"lavender" },
  { id:58, name:"Spike Lavender",      latin:"Lavandula latifolia",             genus:"Lavandula",    family:"Lamiaceae",    img:p("lavender",1), desc:"A robust camphor-scented lavender with broader grey-green leaves, beloved for essential oil in paint and varnish industries.", badge:"Robust",    bc:"#7B1FA2", bloom:[6,7,8],            diff:"Easy",     h:"40–80 cm", nat:"W. Mediterranean",  q:"lavender" },
  { id:59, name:"French Lavender",     latin:"Lavandula stoechas",              genus:"Lavandula",    family:"Lamiaceae",    img:p("lavender",2), desc:"Instantly recognisable by pineapple-shaped heads topped with showy purple bracts — the most ornamental of all lavenders.", badge:"Ornamental",bc:"#9C27B0", bloom:[4,5,6,7],           diff:"Easy",     h:"30–60 cm", nat:"Mediterranean",     q:"lavender" },
  { id:60, name:"Fringed Lavender",    latin:"Lavandula dentata",               genus:"Lavandula",    family:"Lamiaceae",    img:p("lavender",3), desc:"Distinctive serrated grey-green leaves and lavender-blue spikes — unusually tolerant of summer humidity for a lavender.", badge:"Textured",  bc:"#673AB7", bloom:[5,6,7,8,9],        diff:"Easy",     h:"40–70 cm", nat:"Mediterranean",     q:"lavender" },
  { id:61, name:"Fernleaf Lavender",   latin:"Lavandula multifida",             genus:"Lavandula",    family:"Lamiaceae",    img:p("lavender",4), desc:"Finely dissected lacy grey foliage and deep violet flower spikes — among the most striking in form of all lavenders.", badge:"Lacy",       bc:"#4A148C", bloom:[4,5,6,7,8],        diff:"Moderate", h:"30–50 cm", nat:"S. Europe",         q:"lavender" },
  { id:62, name:"Green Lavender",      latin:"Lavandula viridis",               genus:"Lavandula",    family:"Lamiaceae",    img:p("lavender",5), desc:"The rare green lavender — bright green foliage and white-yellow spikes with a fresh, unusual scent quite unlike typical lavender.", badge:"Unusual",  bc:"#388E3C", bloom:[5,6,7],            diff:"Moderate", h:"40–60 cm", nat:"Madeira · Portugal",q:"lavender" },
  { id:63, name:"Woolly Lavender",     latin:"Lavandula lanata",                genus:"Lavandula",    family:"Lamiaceae",    img:p("lavender",6), desc:"Striking silver-white woolly stems and leaves with deep violet-blue spikes — the most ornamental silver-leaved lavender.", badge:"Silver",    bc:"#9E9E9E", bloom:[6,7,8],            diff:"Moderate", h:"40–60 cm", nat:"S. Spain",          q:"lavender" },
  { id:64, name:"Dutch Lavender",      latin:"Lavandula × intermedia",          genus:"Lavandula",    family:"Lamiaceae",    img:p("lavender",7), desc:"A vigorous natural hybrid with tall richly fragrant spikes — the chief source of lavandin oil in commercial perfume production.", badge:"Productive",bc:"#7E57C2", bloom:[6,7,8],            diff:"Easy",     h:"50–80 cm", nat:"Garden hybrid",     q:"lavender" },

  /* SUNFLOWERS */
  { id:65, name:"Common Sunflower",    latin:"Helianthus annuus",               genus:"Helianthus",   family:"Asteraceae",   img:p("sunflower",0), desc:"The icon of summer — its great golden head tracking the sun in youth, the universal emblem of warmth and optimism.", badge:"Solar",      bc:"#F4D03F", bloom:[6,7,8,9],           diff:"Easy",     h:"1–3 m",    nat:"N. America",        q:"sunflower" },
  { id:66, name:"Jerusalem Artichoke", latin:"Helianthus tuberosus",            genus:"Helianthus",   family:"Asteraceae",   img:p("sunflower",1), desc:"A sunflower valued for its starchy tubers — tall stems bearing masses of small golden daisy blooms throughout late summer.", badge:"Edible",    bc:"#F39C12", bloom:[7,8,9,10],          diff:"Easy",     h:"1.5–3 m",  nat:"N. America",        q:"sunflower" },
  { id:67, name:"Maximilian Sunflower",latin:"Helianthus maximiliani",          genus:"Helianthus",   family:"Asteraceae",   img:p("sunflower",2), desc:"A towering prairie sunflower bearing hundreds of small golden blooms along tall stems — spectacular en masse for pollinators.", badge:"Prairie",  bc:"#FF8F00", bloom:[7,8,9,10],          diff:"Easy",     h:"1.5–3 m",  nat:"Great Plains USA",  q:"sunflower" },
  { id:68, name:"Giant Sunflower",     latin:"Helianthus giganteus",            genus:"Helianthus",   family:"Asteraceae",   img:p("sunflower",3), desc:"The tallest sunflower species reaching 4 metres with multiple pale yellow blooms — forms impressive colonies in wet prairies.", badge:"Giant",     bc:"#FDD835", bloom:[7,8,9],            diff:"Easy",     h:"2–4 m",    nat:"E. North America",  q:"sunflower" },
  { id:69, name:"Ashy Sunflower",      latin:"Helianthus mollis",               genus:"Helianthus",   family:"Asteraceae",   img:p("sunflower",4), desc:"Silver-grey downy leaves contrast beautifully with clear yellow blooms — tolerates dry alkaline soils with ease.", badge:"Silvery",   bc:"#FFD54F", bloom:[7,8,9],            diff:"Easy",     h:"0.6–1.5 m",nat:"Central USA",       q:"sunflower" },
  { id:70, name:"Willow-leaf Sunflower",latin:"Helianthus salicifolius",        genus:"Helianthus",   family:"Asteraceae",   img:p("sunflower",5), desc:"Striking long arching willow-like leaves and terminal clusters of golden blooms — architecturally bold in the autumn garden.", badge:"Architectural",bc:"#FFA000",bloom:[8,9,10],           diff:"Easy",     h:"1.5–2.5 m",nat:"Central USA",       q:"sunflower" },
  { id:71, name:"Double Sunflower",    latin:"Helianthus × multiflorus",        genus:"Helianthus",   family:"Asteraceae",   img:p("sunflower",6), desc:"A perennial hybrid bearing fully double golden pompom blooms — long-lasting, non-seeding and vigorous in sunny borders.", badge:"Double",    bc:"#FFC107", bloom:[7,8,9],            diff:"Easy",     h:"1–1.5 m",  nat:"Garden hybrid",     q:"sunflower" },
  { id:72, name:"Dark-eye Sunflower",  latin:"Helianthus atrorubens",           genus:"Helianthus",   family:"Asteraceae",   img:p("sunflower",7), desc:"A forest-edge sunflower with distinctive dark-centred golden blooms on slender branching stems — elegant in naturalistic plantings.", badge:"Elegant",  bc:"#E65100", bloom:[7,8,9],            diff:"Easy",     h:"1–2 m",    nat:"SE United States",  q:"sunflower" },

  /* LOTUS */
  { id:73, name:"Sacred Lotus",        latin:"Nelumbo nucifera",                genus:"Nelumbo",      family:"Nelumbonaceae",img:p("lotus",0), desc:"The divine flower of Buddhism and Hinduism — rising from muddy water each day to bloom in pristine beauty, symbol of enlightenment.", badge:"Sacred",    bc:"#FF6B9D", bloom:[5,6,7,8],           diff:"Moderate", h:"1–2 m",    nat:"Asia",               q:"lotus" },
  { id:74, name:"American Lotus",      latin:"Nelumbo lutea",                   genus:"Nelumbo",      family:"Nelumbonaceae",img:p("lotus",1), desc:"The only lotus native to the Americas — enormous pale yellow blooms up to 25 cm across above circular blue-green leaves.", badge:"American",  bc:"#FFF176", bloom:[5,6,7,8,9],        diff:"Moderate", h:"1–2 m",    nat:"E. North America",  q:"lotus" },
  { id:75, name:"White Sacred Lotus",  latin:"Nelumbo nucifera 'Alba'",         genus:"Nelumbo",      family:"Nelumbonaceae",img:p("lotus",2), desc:"Pure white blooms of transcendent simplicity — the most revered colour in Buddhist iconography, representing perfect purity.", badge:"Pure",       bc:"#FAFAFA", bloom:[5,6,7,8],           diff:"Moderate", h:"1–1.5 m",  nat:"Asia",               q:"lotus" },
  { id:76, name:"Pink Sacred Lotus",   latin:"Nelumbo nucifera 'Rosea'",        genus:"Nelumbo",      family:"Nelumbonaceae",img:p("lotus",3), desc:"Deep rose-pink petals fading to cream at their tips — the classic cultivar most associated with lotus imagery worldwide.", badge:"Classic",    bc:"#F48FB1", bloom:[5,6,7,8],           diff:"Moderate", h:"1–1.5 m",  nat:"Asia",               q:"lotus" },
  { id:77, name:"Double Lotus",        latin:"Nelumbo nucifera 'Momo Botan'",   genus:"Nelumbo",      family:"Nelumbonaceae",img:p("lotus",4), desc:"A magnificent double-flowered Japanese cultivar with up to 200 petals per bloom — more like a peony than a typical lotus.", badge:"Double",    bc:"#F06292", bloom:[5,6,7,8],           diff:"Expert",   h:"0.6–1 m",  nat:"Japan",              q:"lotus" },
  { id:78, name:"Red Sacred Lotus",    latin:"Nelumbo nucifera 'Red Lotus'",    genus:"Nelumbo",      family:"Nelumbonaceae",img:p("lotus",5), desc:"Deep crimson-red blooms of remarkable intensity — rare and prized in ceremonial traditions across South and Southeast Asia.", badge:"Rare",       bc:"#D32F2F", bloom:[5,6,7,8],           diff:"Expert",   h:"1–1.5 m",  nat:"Asia",               q:"lotus" },
  { id:79, name:"Bowl Lotus",          latin:"Nelumbo nucifera 'Chawan Basu'",  genus:"Nelumbo",      family:"Nelumbonaceae",img:p("lotus",6), desc:"A miniature lotus with petite pale pink blooms perfect for small ponds, terrace containers and Japanese water gardens.", badge:"Miniature", bc:"#F48FB1", bloom:[5,6,7,8],           diff:"Moderate", h:"0.4–0.6 m",nat:"Japan",              q:"lotus" },
  { id:80, name:"Giant Lotus",         latin:"Nelumbo nucifera 'Perry's Giant'",genus:"Nelumbo",      family:"Nelumbonaceae",img:p("lotus",7), desc:"The largest lotus cultivar — breathtaking shell-pink blooms up to 35 cm across on stems towering above the water magnificently.", badge:"Giant",     bc:"#FF80AB", bloom:[5,6,7,8,9],        diff:"Expert",   h:"1.5–2.5 m",nat:"Garden hybrid",     q:"lotus" },
];

/* ─────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────── */
const MONTHS   = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const PER_PAGE = 20;
const TYPES    = ["All","Rose","Peony","Tulip","Orchid","Dahlia","Lily","Rhododendron","Lavender","Sunflower","Lotus"];
const DIFFS    = ["All","Easy","Moderate","Expert"];
const DIFF_CLR: Record<string,string> = { Easy:"#22c55e", Moderate:"var(--gold)", Expert:"var(--rose)" };

/* ─────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────── */
export default function PlantsPage() {
  const pool = useFlowerPool(["rose","peony","tulip","orchid","dahlia","lily","rhododendron","lavender","sunflower","lotus"]);
  const [search,   setSearch]   = useState("");
  const [cat,      setCat]      = useState("All");
  const [diff,     setDiff]     = useState("All");
  const [month,    setMonth]    = useState(new Date().getMonth());
  const [selected, setSelected] = useState<Flower | null>(null);
  const [saved,    setSaved]    = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("lg_saved_flowers") || "[]"); }
    catch { return []; }
  });
  const [page,     setPage]     = useState(0);

  const heroRef     = useRef<HTMLDivElement>(null);
  const gridRef     = useRef<HTMLDivElement>(null);
  const modalRef    = useRef<HTMLDivElement>(null);

  /* hero entrance */
  useEffect(() => {
    if (!heroRef.current) return;
    gsap.fromTo(heroRef.current.querySelectorAll(".ha"),
      { y: 32, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.85, stagger: 0.12, ease: "power3.out", delay: 0.1 }
    );
  }, []);

  /* card animation */
  const animCards = useCallback(() => {
    if (!gridRef.current) return;
    gsap.fromTo(gridRef.current.querySelectorAll(".fc"),
      { y: 32, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.035, ease: "power3.out" }
    );
  }, []);

  useEffect(() => {
    const t = setTimeout(animCards, 60);
    return () => clearTimeout(t);
  }, [page, cat, diff, search, animCards]);

  /* modal open */
  useEffect(() => {
    if (selected && modalRef.current) {
      gsap.fromTo(modalRef.current,
        { opacity: 0, scale: 0.93, y: 24 },
        { opacity: 1, scale: 1,    y: 0, duration: 0.4, ease: "power3.out" }
      );
    }
  }, [selected]);

  /* close modal */
  const closeModal = useCallback(() => {
    if (!modalRef.current) { setSelected(null); return; }
    gsap.to(modalRef.current, {
      opacity: 0, scale: 0.95, y: 12, duration: 0.22, ease: "power2.in",
      onComplete: () => setSelected(null),
    });
  }, []);

  /* save */
  const toggleSave = (id: number) => {
    setSaved(prev => {
      const n = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem("lg_saved_flowers", JSON.stringify(n));
      return n;
    });
  };

  /* filter */
  const filtered = ALL.filter(f => {
    const ms = search.toLowerCase();
    return (
      (!ms || f.name.toLowerCase().includes(ms) || f.latin.toLowerCase().includes(ms)) &&
      (cat  === "All" || f.q === cat.toLowerCase()) &&
      (diff === "All" || f.diff === diff)
    );
  });

  const totalPages   = Math.ceil(filtered.length / PER_PAGE);
  const paginated    = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const monthFlowers = ALL.filter(f => f.bloom.includes(month));

  const goPage = (n: number) => {
    setPage(n);
    window.scrollTo({ top: 500, behavior: "smooth" });
  };
  const handleCat  = (c: string) => { setCat(c);  setPage(0); };
  const handleDiff = (d: string) => { setDiff(d); setPage(0); };
  const handleSrch = (s: string) => { setSearch(s); setPage(0); };

  /* ── RENDER ──────────────────────────────────────── */
  return (
    <>
      {/* HERO */}
      <section
        ref={heroRef}
        style={{
          background: "var(--surface)",
          paddingTop: "calc(68px + 5rem)",
          paddingBottom: "5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 80% at 80% 50%, rgba(184,43,88,0.12) 0%, transparent 60%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 60% at 20% 80%, rgba(196,162,60,0.08) 0%, transparent 55%)" }} />
        <div className="absolute left-0 right-0 bottom-0 pointer-events-none" style={{ height:"1px", background:"linear-gradient(90deg,transparent,rgba(184,43,88,0.35),transparent)" }} />

        <div className="container relative">
          <div className="ha" style={{ display:"inline-flex", alignItems:"center", gap:8, borderRadius:9999, padding:"6px 16px", marginBottom:20, background:"rgba(184,43,88,0.12)", border:"1px solid rgba(184,43,88,0.3)", fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--petal)", fontFamily:"var(--font-sans)", fontWeight:500, opacity:0 }}>
            <Sparkles size={11} /> Flower Library · 80 Species
          </div>
          <h1 className="ha" style={{ fontFamily:"var(--font-playfair,'Playfair Display',serif)", fontSize:"clamp(2.8rem,7vw,6.5rem)", fontWeight:900, lineHeight:0.93, letterSpacing:"-0.025em", color:"var(--cream)", maxWidth:760, marginBottom:"1.5rem", opacity:0 }}>
            The Himalayan<br />
            <span style={{ background:"linear-gradient(135deg,var(--rose-light) 0%,var(--petal) 50%,var(--gold-light) 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              Flower Collection
            </span>
          </h1>
          <p className="ha" style={{ fontFamily:"var(--font-cormorant,'Cormorant Garamond',serif)", fontSize:"clamp(1.1rem,2vw,1.35rem)", fontStyle:"italic", color:"var(--muted)", maxWidth:520, lineHeight:1.8, opacity:0 }}>
            Explore 80 curated flower species — from national treasures to rare alpine gems, bloom by bloom.
          </p>
        </div>
      </section>

      {/* BLOOM CALENDAR */}
      <section style={{ background:"var(--bg)", padding:"5rem 0" }}>
        <div className="container">
          <div style={{ marginBottom:"2rem" }}>
            <div className="eyebrow mb-3">Bloom Calendar</div>
            <h2 style={{ fontFamily:"var(--font-playfair,'Playfair Display',serif)", fontSize:"clamp(1.7rem,3.2vw,2.6rem)", fontWeight:700, color:"var(--cream)", marginBottom:"0.4rem" }}>
              What&apos;s Blooming This Month
            </h2>
            <p style={{ color:"var(--muted)", fontSize:13 }}>Select a month to discover which flowers are in season</p>
          </div>

          {/* Month tabs */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:40 }}>
            {MONTHS.map((m, i) => (
              <button key={m} onClick={() => setMonth(i)} style={{
                padding:"8px 18px", borderRadius:9999, fontSize:11, fontWeight:month===i?700:400,
                fontFamily:"var(--font-sans)", letterSpacing:"0.08em",
                background: month===i ? "linear-gradient(135deg,var(--rose),var(--rose-light))" : "rgba(253,248,240,0.06)",
                color: month===i ? "white" : "var(--muted)",
                border:`1px solid ${month===i ? "transparent" : "rgba(253,248,240,0.1)"}`,
                boxShadow: month===i ? "0 4px 16px rgba(184,43,88,0.35)" : "none",
                transition:"all 0.2s", cursor:"pointer",
              }}>{m}</button>
            ))}
          </div>

          {monthFlowers.length > 0 ? (
            <div className="bloom-grid">
              {monthFlowers.slice(0, 8).map(f => (
                <div key={f.id} onClick={() => setSelected(f)}
                  className="bloom-card"
                  style={{ background:"var(--card)", border:"1px solid var(--border-s)", borderRadius:16, overflow:"hidden", cursor:"pointer" }}
                >
                  <div style={{ position:"relative", height:200, overflow:"hidden" }}>
                    <img src={pick(pool, f.q, (f.id-1) % 8)} alt={f.name}
                      style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.5s" }}
                    />
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(6,3,10,0.75) 0%,transparent 55%)" }} />
                    <span style={{ position:"absolute", bottom:12, left:14, fontSize:9, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", background:f.bc+"28", border:`1px solid ${f.bc}50`, color:f.bc, borderRadius:9999, padding:"3px 10px" }}>
                      {f.badge}
                    </span>
                  </div>
                  <div style={{ padding:"16px 18px 18px" }}>
                    <h4 style={{ fontFamily:"var(--font-playfair,'Playfair Display',serif)", fontSize:"1rem", fontWeight:700, color:"var(--cream)", marginBottom:3, lineHeight:1.3 }}>{f.name}</h4>
                    <p style={{ fontStyle:"italic", color:"var(--dim)", fontSize:12 }}>{f.latin}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign:"center", padding:"60px 32px", background:"var(--card)", borderRadius:20, border:"1px solid var(--border-s)" }}>
              <div style={{ fontSize:"2.5rem", marginBottom:12 }}>❄</div>
              <p style={{ color:"var(--muted)", fontFamily:"var(--font-cormorant)", fontStyle:"italic", fontSize:"1.1rem" }}>
                A season of rest — no featured blooms in {MONTHS[month]}.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ALL FLOWER SPECIES */}
      <section style={{ background:"var(--surface)", padding:"5rem 0 6rem" }}>
        <div className="container">

          {/* Header */}
          <div style={{ marginBottom:"2.5rem" }}>
            <div className="eyebrow mb-3">Full Library</div>
            <div style={{ display:"flex", flexWrap:"wrap", alignItems:"flex-end", justifyContent:"space-between", gap:16 }}>
              <h2 style={{ fontFamily:"var(--font-playfair,'Playfair Display',serif)", fontSize:"clamp(1.7rem,3.2vw,2.6rem)", fontWeight:700, color:"var(--cream)" }}>
                All Flower Species
              </h2>
              <p style={{ color:"var(--dim)", fontSize:13 }}>
                {filtered.length} species{page > 0 && ` · Page ${page+1} of ${totalPages}`}
              </p>
            </div>
          </div>

          {/* Category pills */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:24, paddingBottom:24, borderBottom:"1px solid var(--border-s)" }}>
            {TYPES.map(c => (
              <button key={c} onClick={() => handleCat(c)} style={{
                padding:"7px 18px", borderRadius:9999, fontSize:11,
                fontWeight: cat===c ? 600 : 400, fontFamily:"var(--font-sans)",
                letterSpacing:"0.07em", whiteSpace:"nowrap", cursor:"pointer",
                background: cat===c ? "linear-gradient(135deg,var(--rose),var(--rose-light))" : "rgba(253,248,240,0.06)",
                color: cat===c ? "white" : "var(--muted)",
                border:`1px solid ${cat===c ? "transparent" : "rgba(253,248,240,0.1)"}`,
                boxShadow: cat===c ? "0 4px 14px rgba(184,43,88,0.3)" : "none",
                transition:"all 0.2s",
              }}>{c}</button>
            ))}
          </div>

          {/* Search + difficulty */}
          <div style={{ display:"flex", gap:12, marginBottom:40, flexWrap:"wrap" }}>
            <div style={{ position:"relative", flex:"1 1 280px", minWidth:0 }}>
              <Search size={14} style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:"var(--muted)", pointerEvents:"none" }} />
              <input type="text" placeholder="Search by name or scientific name…"
                value={search} onChange={e => handleSrch(e.target.value)}
                className="form-input" style={{ paddingLeft:40, width:"100%" }}
              />
            </div>
            <select value={diff} onChange={e => handleDiff(e.target.value)}
              className="form-input" style={{ flex:"0 0 auto", width:200, minWidth:160 }}
            >
              {DIFFS.map(d => <option key={d} value={d}>{d==="All" ? "All Difficulty Levels" : d}</option>)}
            </select>
          </div>

          {/* Grid */}
          {paginated.length > 0 ? (
            <div ref={gridRef} className="fl-grid">
              {paginated.map(f => (
                <Card key={f.id} f={f} saved={saved.includes(f.id)}
                  onOpen={() => setSelected(f)}
                  onSave={() => toggleSave(f.id)}
                  pool={pool}
                />
              ))}
            </div>
          ) : (
            <div style={{ textAlign:"center", padding:"80px 32px", background:"var(--card)", borderRadius:20, border:"1px solid var(--border-s)" }}>
              <div style={{ fontSize:"3rem", marginBottom:12 }}>🌿</div>
              <p style={{ fontFamily:"var(--font-playfair,'Playfair Display',serif)", fontSize:"1.3rem", color:"var(--cream)", marginBottom:8 }}>No flowers found</p>
              <p style={{ color:"var(--muted)", fontSize:14 }}>Try adjusting your search or filters.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16, marginTop:48 }}>
              <button onClick={() => goPage(Math.max(0, page-1))} disabled={page===0}
                style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 24px", borderRadius:9999, fontSize:12, fontWeight:500, fontFamily:"var(--font-sans)", letterSpacing:"0.07em", background:"rgba(253,248,240,0.07)", color: page===0 ? "var(--dim)" : "var(--cream)", border:"1px solid var(--border-s)", opacity: page===0 ? 0.45 : 1, cursor: page===0 ? "not-allowed" : "pointer" }}
              ><ChevronLeft size={14} /> Previous</button>

              <div style={{ display:"flex", gap:6 }}>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i} onClick={() => goPage(i)} style={{ width: i===page ? 28 : 8, height:8, borderRadius:9999, border:"none", cursor:"pointer", transition:"all 0.3s", background: i===page ? "linear-gradient(135deg,var(--rose),var(--rose-light))" : "rgba(253,248,240,0.18)" }} />
                ))}
              </div>

              <button onClick={() => goPage(Math.min(totalPages-1, page+1))} disabled={page===totalPages-1}
                style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 24px", borderRadius:9999, fontSize:12, fontWeight:600, fontFamily:"var(--font-sans)", letterSpacing:"0.07em", background: page===totalPages-1 ? "rgba(253,248,240,0.07)" : "linear-gradient(135deg,var(--rose),var(--rose-light))", color:"white", border:"none", boxShadow: page===totalPages-1 ? "none" : "0 4px 16px rgba(184,43,88,0.35)", opacity: page===totalPages-1 ? 0.45 : 1, cursor: page===totalPages-1 ? "not-allowed" : "pointer" }}
              >Next <ChevronRight size={14} /></button>
            </div>
          )}
        </div>
      </section>

      {/* MODAL */}
      {selected && (
        <div onClick={closeModal} style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(6,3,10,0.88)", backdropFilter:"blur(12px)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <div ref={modalRef} onClick={e => e.stopPropagation()}
            style={{ width:"100%", maxWidth:720, maxHeight:"92vh", overflowY:"auto", background:"var(--card)", border:"1px solid rgba(184,43,88,0.25)", borderRadius:24, boxShadow:"0 40px 100px rgba(0,0,0,0.6)", opacity:0 }}
          >
            {/* Image */}
            <div style={{ position:"relative", height:380, overflow:"hidden", borderRadius:"24px 24px 0 0" }}>
              <img src={pick(pool, selected.q, (selected.id-1) % 8)} alt={selected.name}
                style={{ width:"100%", height:"100%", objectFit:"cover" }}
              />
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(6,3,10,0.92) 0%,rgba(6,3,10,0.35) 50%,transparent 100%)" }} />
              <button onClick={closeModal} style={{ position:"absolute", top:20, right:20, width:40, height:40, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(6,3,10,0.7)", border:"1px solid rgba(255,255,255,0.15)", color:"white", cursor:"pointer", backdropFilter:"blur(8px)" }}>
                <X size={16} />
              </button>
              <div style={{ position:"absolute", bottom:28, left:32, right:80 }}>
                <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap" }}>
                  <span style={{ fontSize:9, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", padding:"4px 12px", borderRadius:9999, background:selected.bc+"30", border:`1px solid ${selected.bc}55`, color:selected.bc }}>{selected.badge}</span>
                  <span style={{ fontSize:9, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", padding:"4px 12px", borderRadius:9999, background:(DIFF_CLR[selected.diff]||"var(--muted)")+"25", border:`1px solid ${(DIFF_CLR[selected.diff]||"var(--muted)")}40`, color:DIFF_CLR[selected.diff]||"var(--muted)" }}>{selected.diff}</span>
                </div>
                <h2 style={{ fontFamily:"var(--font-playfair,'Playfair Display',serif)", fontSize:"clamp(1.6rem,3vw,2.2rem)", fontWeight:800, color:"white", lineHeight:1.1, marginBottom:6 }}>{selected.name}</h2>
                <p style={{ fontStyle:"italic", color:"rgba(255,255,255,0.6)", fontSize:14 }}>{selected.latin}</p>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding:"32px 36px 36px" }}>
              <p style={{ fontFamily:"var(--font-cormorant,'Cormorant Garamond',serif)", fontSize:"1.18rem", lineHeight:1.85, color:"var(--muted)", marginBottom:28, fontStyle:"italic" }}>
                {selected.desc}
              </p>

              {/* Info grid */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:28 }}>
                {[
                  { icon:<Leaf size={13}/>,     label:"Family",     value:selected.family },
                  { icon:<Ruler size={13}/>,    label:"Height",     value:selected.h       },
                  { icon:<Globe size={13}/>,    label:"Native",     value:selected.nat     },
                  { icon:<Sparkles size={13}/>, label:"Difficulty", value:selected.diff    },
                  { icon:<Leaf size={13}/>,     label:"Genus",      value:selected.genus   },
                  { icon:<Sparkles size={13}/>, label:"Blooms",     value:selected.bloom.map(i => MONTHS[i]).join(", ") },
                ].map(({ icon, label, value }) => (
                  <div key={label} style={{ padding:"15px 17px", background:"var(--surface)", border:"1px solid var(--border-s)", borderRadius:14 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, color:"var(--rose-light)", marginBottom:6, fontSize:10, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:"var(--font-sans)" }}>
                      {icon} {label}
                    </div>
                    <div style={{ color:"var(--cream)", fontSize:13, fontWeight:500, lineHeight:1.4 }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Bloom bar */}
              <div style={{ marginBottom:32, padding:"20px 22px", background:"var(--surface)", borderRadius:14, border:"1px solid var(--border-s)" }}>
                <div style={{ fontSize:10, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--rose-light)", marginBottom:12, fontFamily:"var(--font-sans)" }}>Bloom Season</div>
                <div style={{ display:"flex", gap:4 }}>
                  {MONTHS.map((m, i) => (
                    <div key={m} style={{ flex:1, textAlign:"center" }}>
                      <div style={{ height:6, borderRadius:9999, background: selected.bloom.includes(i) ? "linear-gradient(135deg,var(--rose),var(--rose-light))" : "rgba(253,248,240,0.1)", marginBottom:6, boxShadow: selected.bloom.includes(i) ? "0 2px 8px rgba(184,43,88,0.4)" : "none" }} />
                      <span style={{ fontSize:8, color: selected.bloom.includes(i) ? "var(--petal)" : "var(--dim)", fontWeight: selected.bloom.includes(i) ? 600 : 400 }}>{m.charAt(0)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display:"flex", gap:12 }}>
                <button onClick={() => toggleSave(selected.id)}
                  style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"14px 24px", borderRadius:12, fontSize:12, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", fontFamily:"var(--font-sans)", background: saved.includes(selected.id) ? "linear-gradient(135deg,var(--rose),var(--rose-light))" : "transparent", color: saved.includes(selected.id) ? "white" : "var(--rose-light)", border:`1.5px solid ${saved.includes(selected.id) ? "transparent" : "var(--rose-light)"}`, boxShadow: saved.includes(selected.id) ? "0 8px 24px rgba(184,43,88,0.35)" : "none", cursor:"pointer", transition:"all 0.25s" }}
                >
                  <Heart size={14} fill={saved.includes(selected.id) ? "white" : "none"} color={saved.includes(selected.id) ? "white" : "var(--rose-light)"} />
                  {saved.includes(selected.id) ? "Saved to Garden" : "Save to My Garden"}
                </button>
                <button onClick={closeModal}
                  style={{ padding:"14px 28px", borderRadius:12, fontSize:12, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", fontFamily:"var(--font-sans)", background:"rgba(253,248,240,0.06)", color:"var(--muted)", border:"1.5px solid rgba(253,248,240,0.12)", cursor:"pointer" }}
                >Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .bloom-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
        .bloom-card { transition:transform 0.25s,box-shadow 0.25s,border-color 0.25s; }
        .bloom-card:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(184,43,88,0.18); border-color:rgba(184,43,88,0.3) !important; }
        .bloom-card:hover img { transform:scale(1.06); }
        .fl-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; }
        @media(max-width:1100px){ .bloom-grid,.fl-grid { grid-template-columns:repeat(3,1fr); } }
        @media(max-width:720px){ .bloom-grid { grid-template-columns:repeat(2,1fr); gap:14px; } .fl-grid { grid-template-columns:repeat(2,1fr); gap:16px; } }
        @media(max-width:480px){ .bloom-grid,.fl-grid { grid-template-columns:1fr; gap:12px; } }
      `}</style>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   CARD COMPONENT
───────────────────────────────────────────────────────── */
function Card({ f, saved, onOpen, onSave, pool }: { f: Flower; saved: boolean; onOpen: () => void; onSave: () => void; pool: FlowerPool }) {
  const ref = useRef<HTMLDivElement>(null);
  const onEnter = () => {
    if (!ref.current) return;
    gsap.to(ref.current, { y: -6, duration: 0.3, ease: "power2.out" });
    gsap.to(ref.current.querySelector(".ci"), { scale: 1.07, duration: 0.5, ease: "power2.out" });
    ref.current.style.boxShadow = "0 20px 50px rgba(184,43,88,0.2),0 0 0 1px rgba(184,43,88,0.2)";
    ref.current.style.borderColor = "rgba(184,43,88,0.3)";
  };
  const onLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, { y: 0, duration: 0.4, ease: "power2.out" });
    gsap.to(ref.current.querySelector(".ci"), { scale: 1, duration: 0.5, ease: "power2.out" });
    ref.current.style.boxShadow = "none";
    ref.current.style.borderColor = "rgba(253,248,240,0.07)";
  };

  return (
    <div ref={ref} className="fc"
      onClick={onOpen} onMouseEnter={onEnter} onMouseLeave={onLeave}
      style={{ background:"var(--card)", border:"1px solid var(--border-s)", borderRadius:20, overflow:"hidden", cursor:"pointer", display:"flex", flexDirection:"column" }}
    >
      {/* Image — 4:5 portrait */}
      <div style={{ position:"relative", aspectRatio:"4/5", overflow:"hidden" }}>
        <img className="ci" src={pick(pool, f.q, (f.id-1) % 8)} alt={f.name}
          style={{ width:"100%", height:"100%", objectFit:"cover" }}
        />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(6,3,10,0.78) 0%,rgba(6,3,10,0.08) 50%,transparent 100%)" }} />
        {/* Badge */}
        <span style={{ position:"absolute", top:13, left:13, fontSize:9, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", padding:"4px 11px", borderRadius:9999, background:f.bc+"30", border:`1px solid ${f.bc}55`, color:f.bc, backdropFilter:"blur(6px)" }}>{f.badge}</span>
        {/* Heart */}
        <button onClick={e => { e.stopPropagation(); onSave(); }}
          style={{ position:"absolute", top:11, right:11, width:34, height:34, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", background: saved ? "linear-gradient(135deg,var(--rose),var(--rose-light))" : "rgba(6,3,10,0.55)", border:"1px solid rgba(255,255,255,0.15)", backdropFilter:"blur(6px)", cursor:"pointer", boxShadow: saved ? "0 4px 12px rgba(184,43,88,0.4)" : "none", transition:"all 0.2s" }}
        >
          <Heart size={13} fill={saved?"white":"none"} color={saved?"white":"rgba(255,255,255,0.85)"} />
        </button>
        {/* Name overlay */}
        <div style={{ position:"absolute", bottom:13, left:15, right:15 }}>
          <h3 style={{ fontFamily:"var(--font-playfair,'Playfair Display',serif)", fontSize:"1.05rem", fontWeight:700, color:"white", lineHeight:1.2, marginBottom:2 }}>{f.name}</h3>
          <p style={{ fontStyle:"italic", color:"rgba(255,255,255,0.6)", fontSize:11 }}>{f.latin}</p>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding:"17px 19px 19px", flex:1, display:"flex", flexDirection:"column" }}>
        <p style={{ color:"var(--muted)", fontSize:12.5, lineHeight:1.7, flex:1, marginBottom:14 }}>
          {f.desc.length > 95 ? f.desc.slice(0, 95) + "…" : f.desc}
        </p>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:13, borderTop:"1px solid var(--border-s)", gap:8 }}>
          <div style={{ display:"flex", gap:11, flexWrap:"wrap" }}>
            <span style={{ display:"flex", alignItems:"center", gap:4, color:"var(--dim)", fontSize:11 }}>
              <Ruler size={11} style={{ color:"var(--rose-light)", flexShrink:0 }} /> {f.h}
            </span>
            <span style={{ display:"flex", alignItems:"center", gap:4, color:"var(--dim)", fontSize:11 }}>
              <Leaf size={11} style={{ color:"var(--gold)", flexShrink:0 }} /> {f.genus}
            </span>
          </div>
          <span style={{ fontSize:9, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", padding:"3px 9px", borderRadius:9999, background:(DIFF_CLR[f.diff]||"var(--muted)")+"20", border:`1px solid ${(DIFF_CLR[f.diff]||"var(--muted)")}35`, color:DIFF_CLR[f.diff]||"var(--muted)", flexShrink:0 }}>
            {f.diff}
          </span>
        </div>
      </div>
    </div>
  );
}
