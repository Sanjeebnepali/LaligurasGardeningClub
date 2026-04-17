export interface BlogPost {
  slug: string;
  title: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  tag: string;
  type: string;          // flower image key
  excerpt: string;
  content: BlogSection[];
}

export interface BlogSection {
  kind: "intro" | "h2" | "body" | "tip" | "list";
  heading?: string;
  text?: string;
  items?: string[];
}

const POSTS: BlogPost[] = [
  /* ─────────────────────────────────────────────────
     1. The Art of Planting Roses
  ───────────────────────────────────────────────── */
  {
    slug: "the-art-of-planting-roses",
    title: "The Art of Planting Roses",
    author: "Dr. Elara Vance",
    authorRole: "Head of Horticulture, Laliguras Club",
    date: "April 8, 2025",
    readTime: "6 min",
    tag: "Technique",
    type: "rose",
    excerpt:
      "Roses reward patience and precision. Mastering the basics of site selection, soil preparation, and first-year care sets the foundation for decades of bloom.",
    content: [
      {
        kind: "intro",
        text: "There is a reason roses have been cultivated for over five thousand years. They offer unmatched beauty, fragrance, and—when properly understood—a surprising resilience. The art of planting roses is not complicated, but it is specific. The choices you make in the first hour of planting will echo through every bloom for the next twenty years.",
      },
      {
        kind: "h2",
        heading: "Choosing the Right Site",
        text: "Roses are sun-worshippers. A minimum of six hours of direct sunlight is non-negotiable—eight is ideal. South or west-facing beds in the northern hemisphere intercept the most light throughout the day. Beyond light, air circulation is critical: roses planted too close together, or against a wall without airflow, are vulnerable to fungal diseases like black spot and powdery mildew. Space hybrid teas at least 60 cm apart; shrub roses need closer to a metre.",
      },
      {
        kind: "h2",
        heading: "Soil Preparation: The Foundation of Everything",
        text: "Roses are heavy feeders that demand well-draining, fertile soil with a pH between 6.0 and 6.8. Before planting, dig a hole at least 50 cm wide and 40 cm deep—wider than necessary is better than deeper. Amend the removed soil with one part garden compost, one part aged manure, and a generous handful of bone meal. This creates a rich, slightly acidic environment that roots will actively seek out. If your soil is clay-heavy, incorporate grit or perlite to improve drainage; waterlogged roots are as fatal as drought.",
      },
      {
        kind: "tip",
        text: "Soak bare-root roses in a bucket of lukewarm water for 12–24 hours before planting. This rehydrates the roots after transport and dramatically improves establishment rates.",
      },
      {
        kind: "h2",
        heading: "Planting Depth and the Bud Union",
        text: "The bud union—the swollen knob where the rose was grafted onto its rootstock—is the most important anatomical point in planting. In temperate climates, the bud union should sit 2–5 cm below the soil surface. This protects it from frost damage and encourages the scion to develop its own roots over time, making the plant increasingly self-sufficient. In warm climates, it can sit at or just above the soil surface. Firm the soil gently around the roots in stages, watering in each layer to eliminate air pockets.",
      },
      {
        kind: "h2",
        heading: "First-Year Care: Restrained Patience",
        text: "In the first growing season, resist the urge to push your roses hard. Deadhead spent blooms to redirect energy to root establishment rather than seed production. Mulch the base with 8–10 cm of composted bark or wood chip, keeping it clear of the stem to prevent rot. Water deeply—but infrequently—to encourage roots to chase moisture downward, building drought resilience. Avoid heavy fertilising in the first year; a top dressing of blood, fish, and bone in late spring is sufficient.",
      },
      {
        kind: "list",
        heading: "Quick-Reference Checklist",
        items: [
          "Site: 6–8 hours of direct sun daily",
          "Soil pH: 6.0–6.8, well-draining and fertile",
          "Planting depth: bud union 2–5 cm below soil surface",
          "Hole size: at least 50 cm wide × 40 cm deep",
          "Soak bare roots for 12–24 hours before planting",
          "Mulch 8–10 cm deep, clear of the stem",
          "Water deeply once or twice a week in first season",
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────────
     2. Dahlia Season Wisdom
  ───────────────────────────────────────────────── */
  {
    slug: "dahlia-season-wisdom",
    title: "Dahlia Season Wisdom",
    author: "Marcus Chen",
    authorRole: "Club Senior Member & Dahlia Specialist",
    date: "April 5, 2025",
    readTime: "4 min",
    tag: "Seasonal",
    type: "dahlia",
    excerpt:
      "Dahlias are the most dramatic flowers of late summer. Knowing when to start tubers, how to stake, and when to lift makes the difference between a good season and a spectacular one.",
    content: [
      {
        kind: "intro",
        text: "Dahlias arrive in late summer like a crescendo — the whole garden seems to bow to their colour. From dinner-plate giants to delicate pompons, they offer more variety than almost any other flower genus. But they demand specific seasonal management. Get the timing and technique right, and they will repay you with armfuls of blooms from July to frost.",
      },
      {
        kind: "h2",
        heading: "Starting Tubers: Timing Is Everything",
        text: "In temperate climates, dahlia tubers should go into the ground after the last frost date — typically May in South Korea. Planting too early risks tuber rot in cold, wet soil. If you are impatient (most dahlia growers are), start tubers in pots indoors under grow lights in April, transplanting the rooted plants outdoors in late May. Plant tubers 10–15 cm deep, eyes (small pink growth nodes) pointing upward. Space dahlias generously — 60–90 cm apart — as they will expand significantly.",
      },
      {
        kind: "h2",
        heading: "Staking: Do It at Planting, Not After",
        text: "One of the most common dahlia mistakes is waiting to stake until the plant is already tall. By then, roots are disrupted and stems may already be wind-damaged. Place a sturdy wooden or bamboo stake at planting time, before the tuber produces any growth. Use soft ties — never wire — loosely attached to allow stem movement. For dinner-plate varieties that can exceed 1.5 metres, consider a wire cage or trellis system.",
      },
      {
        kind: "tip",
        text: "Pinch out the growing tip when the plant reaches 30–40 cm. This single act forces the plant to produce multiple stems instead of one, multiplying your bloom count dramatically.",
      },
      {
        kind: "h2",
        heading: "Feeding the Beast",
        text: "Dahlias are hungry plants. A low-nitrogen, high-potassium fertiliser applied fortnightly from first bud to first frost will sustain their extraordinary production rate. Avoid high-nitrogen feeds which push lush leafy growth at the expense of flowers. Once the first buds appear, switch to a tomato feed — this is a practical, affordable option with exactly the right NPK balance for flowering plants.",
      },
      {
        kind: "h2",
        heading: "Lifting and Storing Tubers",
        text: "After the first blackening frost, cut dahlia stems to 10 cm and carefully lift the tubers with a garden fork. Shake off excess soil and allow them to dry upside-down for 48 hours in a frost-free space. Store in trays of barely moist peat, vermiculite, or coir at 5–10°C. Check monthly for rot or shrivelling — slightly wrinkled tubers can be revived with a brief soak before replanting.",
      },
    ],
  },

  /* ─────────────────────────────────────────────────
     3. Common Pests of Peonies
  ───────────────────────────────────────────────── */
  {
    slug: "common-pests-of-peonies",
    title: "Common Pests of Peonies",
    author: "Aisha Rajan",
    authorRole: "Plant Pathologist & Club Member",
    date: "March 29, 2025",
    readTime: "7 min",
    tag: "Pest Control",
    type: "peony",
    excerpt:
      "Peonies are generally robust, but a handful of pests can ruin a season if not caught early. Learn to identify and address each threat before it escalates.",
    content: [
      {
        kind: "intro",
        text: "Peonies are among the longest-lived garden plants — a well-sited peony can outlive its planter by decades. Their resilience is extraordinary. But 'resilient' does not mean 'immune'. A small number of insects, fungi, and other organisms exploit specific vulnerabilities in the peony lifecycle. Early identification and targeted intervention is always preferable to chemical blanket treatments.",
      },
      {
        kind: "h2",
        heading: "Botrytis Blight (Grey Mould)",
        text: "Botrytis paeoniae is the single most destructive peony pathogen. It presents as blackened, wilting shoots in spring, grey fuzzy mould on buds and petals, and a general collapse of stems at soil level. It thrives in cool, wet springs and poor air circulation. Management: remove and dispose of (do not compost) all infected material immediately. Improve airflow by thinning surrounding plantings. A copper-based fungicide applied as shoots emerge in spring provides preventive protection. Avoid overhead watering — water at the base.",
      },
      {
        kind: "h2",
        heading: "Ants: Friends Misunderstood",
        text: "The sight of ants crawling over peony buds alarms many gardeners. In reality, ants are drawn to the sweet nectar secreted by the buds and cause no direct harm to the plant. They do not 'open' the buds — that is a myth. The ants may, however, be farming aphids. If you observe ants tending clusters of small soft-bodied insects on stems or undersides of leaves, that is the problem — not the ants themselves.",
      },
      {
        kind: "h2",
        heading: "Aphids",
        text: "Aphid colonies on peonies are usually of the green peach aphid (Myzus persicae) variety. They congregate on new growth and bud stems, sucking sap and excreting honeydew that promotes sooty mould. Small infestations can be dealt with by knocking them off with a jet of water or applying insecticidal soap. Larger infestations may warrant a pyrethrin-based spray. Encourage natural predators — ladybirds, lacewings, and parasitic wasps — by avoiding broad-spectrum insecticides.",
      },
      {
        kind: "tip",
        text: "A healthy, well-fed peony in the right location has natural resistance to most pests. The majority of serious pest problems originate from stress — incorrect planting depth, waterlogged soil, or nutrient deficiency. Fix the conditions first.",
      },
      {
        kind: "h2",
        heading: "Peony Leaf Blotch",
        text: "Caused by the fungus Cladosporium paeoniae, leaf blotch appears as glossy purple-red or brown spots on upper leaf surfaces, with corresponding grey mould on the underside. It is primarily aesthetic rather than fatal, but severe infections can weaken plants over multiple seasons. Remove affected leaves as they appear. A general garden fungicide will slow spread, but the most effective control is cutting down all foliage to ground level in autumn and disposing of it — not composting — to break the fungal lifecycle.",
      },
      {
        kind: "list",
        heading: "Integrated Pest Management Summary",
        items: [
          "Botrytis blight: remove infected material, improve airflow, apply copper fungicide in spring",
          "Ants on buds: harmless — monitor for aphid-farming instead",
          "Aphids: water jet, insecticidal soap, or pyrethrin for heavy infestations",
          "Leaf blotch: remove affected foliage, cut down fully in autumn",
          "Prevention: correct planting depth, good drainage, and strong nutrition",
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────────
     4. Bloom Cycles for Beginners
  ───────────────────────────────────────────────── */
  {
    slug: "bloom-cycles-for-beginners",
    title: "Bloom Cycles for Beginners",
    author: "Dr. Elara Vance",
    authorRole: "Head of Horticulture, Laliguras Club",
    date: "March 20, 2025",
    readTime: "9 min",
    tag: "Education",
    type: "tulip",
    excerpt:
      "Understanding when and why different flowers bloom — and how to sequence them — is the foundation of a garden that never goes quiet.",
    content: [
      {
        kind: "intro",
        text: "The beginner's greatest frustration is a garden that does nothing for months, then bursts into bloom all at once, then goes silent again. This is not the garden's fault — it reflects a lack of sequencing. Understanding bloom cycles transforms a single-season garden into one that moves through a continuous, overlapping performance from February to November.",
      },
      {
        kind: "h2",
        heading: "What Drives a Bloom Cycle?",
        text: "Flowering is ultimately a reproductive strategy, triggered by a combination of day-length (photoperiod), temperature accumulation (degree days), and internal hormonal signals. Spring bulbs like tulips and narcissus require a cold vernalisation period — extended exposure to temperatures below 9°C — to flower. Summer perennials like dahlias and zinnias are long-day plants that need extended daylight hours before initiating buds. Autumn bloomers like chrysanthemums are short-day plants triggered by the decreasing day length of late summer. Understanding these triggers lets you predict and manipulate flowering times.",
      },
      {
        kind: "h2",
        heading: "Building a Four-Season Sequence",
        text: "A well-sequenced garden layers bloom times so that as one plant finishes, another begins. A practical Korean climate sequence: Snowdrops and crocuses push through February–March, followed by tulips and daffodils in April. Late spring sees alliums, peonies, and irises. Summer belongs to roses, dahlias, echinacea, and rudbeckia. Autumn is chrysanthemums, asters, and the last dahlias before frost. Even winter has its performers — hamamelis (witch hazel) blooms on bare stems in January, and hellebores flower under snow.",
      },
      {
        kind: "tip",
        text: "Plant in drifts of at least 5–7 bulbs or plants of the same variety. Single specimens look sparse and disconnected. Mass planting is the simplest way to make a garden look intentional and professional.",
      },
      {
        kind: "h2",
        heading: "Succession Planting for Continuous Cutting",
        text: "For cut flower growers, succession planting — sowing the same variety every two to three weeks — ensures a continuous supply rather than a single glut. Zinnias, cosmos, and sweet peas respond particularly well to this approach. Make three sowings of your favourite varieties: one in late April, one in mid-May, and one in early June. Your cutting garden will produce from July through to the first autumn frost with staggered peaks rather than a single overwhelming harvest.",
      },
      {
        kind: "h2",
        heading: "Reading Your Plants' Cues",
        text: "Plants communicate their stage in the bloom cycle visually. Yellowing and dying foliage on spring bulbs is not disease — it is the plant storing energy in the bulb for next year. Do not remove it for at least six weeks after flowering. 'Blindness' in daffodils (green stem, no flower) usually indicates the bulb was planted too shallow or is overcrowded and needs lifting and dividing. A rose that suddenly stops producing new buds in mid-summer may be experiencing heat dormancy — a brief summer rest before the autumn flush. Patience is always the correct first response.",
      },
    ],
  },

  /* ─────────────────────────────────────────────────
     5. Orchid Care in Urban Apartments
  ───────────────────────────────────────────────── */
  {
    slug: "orchid-care-in-urban-apartments",
    title: "Orchid Care in Urban Apartments",
    author: "Jin-ho Park",
    authorRole: "Urban Botanist & Club Member",
    date: "March 14, 2025",
    readTime: "5 min",
    tag: "Urban Growing",
    type: "orchid",
    excerpt:
      "The Phalaenopsis orchid is the most forgiving of its family — and one of the best plants for apartment life. The secrets to keeping it blooming year after year are simpler than most people think.",
    content: [
      {
        kind: "intro",
        text: "The orchid has a reputation it does not deserve — exotic, fragile, impossible to grow without a greenhouse. The moth orchid (Phalaenopsis), which accounts for the vast majority of orchids sold globally, is in truth a remarkably durable houseplant when its basic needs are understood. In the right apartment conditions, it will bloom for months at a time and rebloom reliably for years.",
      },
      {
        kind: "h2",
        heading: "Light: Bright, but Never Direct",
        text: "Phalaenopsis orchids evolved growing on tree branches in the dappled light of Southeast Asian forests. In an apartment, this translates to a position near (but not on) an east or west-facing window. Direct midday sun will scorch the thick, fleshy leaves; insufficient light prevents reblooming. The ideal light level produces leaves of medium green — too dark means insufficient light, yellowing means too much. A sheer curtain between the orchid and a south-facing window is an ideal compromise.",
      },
      {
        kind: "h2",
        heading: "Watering: Less Than You Think",
        text: "Overwatering kills more orchids than any other cause. Phalaenopsis are epiphytes — in nature, their roots dry out completely between tropical rainstorms. In a pot, this means watering thoroughly, then waiting until the growing medium is almost completely dry before watering again. In a typical heated apartment, this is usually once every 10–14 days in winter and once every 7–10 days in summer. Lift the pot — a dry orchid pot feels startlingly light. Water by soaking the pot in a bowl of room-temperature water for 15 minutes, then draining completely. Never let roots sit in standing water.",
      },
      {
        kind: "tip",
        text: "The aerial roots — those thick, silver-green tendrils growing out of the pot — are healthy and normal. Do not cut them off or try to bury them. They absorb moisture from the air and indicate a thriving plant.",
      },
      {
        kind: "h2",
        heading: "Triggering Reblooming",
        text: "After the first bloom spike finishes, many orchids are discarded. This is a mistake. Phalaenopsis will rebloom reliably if given a period of cool nights — 13–16°C — for 4–6 weeks in autumn. This temperature drop signals the plant to initiate a new spike. In most Korean apartments, simply moving the orchid near a drafty window in October–November is sufficient. Once you see a new spike emerging from the base, move the plant back to its normal warm position and resume regular care.",
      },
      {
        kind: "h2",
        heading: "Repotting and Medium",
        text: "Orchids should be repotted every two years, or sooner if the bark medium has broken down into fine compost. Use a clear plastic pot — this allows light to reach the roots and lets you monitor moisture levels. Fill with coarse orchid bark, not standard potting compost. Standard compost retains too much moisture and suffocates the roots. After repotting, do not fertilise for 4–6 weeks while the plant recovers.",
      },
    ],
  },

  /* ─────────────────────────────────────────────────
     6. Heritage Seeds: Why They Matter
  ───────────────────────────────────────────────── */
  {
    slug: "heritage-seeds-why-they-matter",
    title: "Heritage Seeds: Why They Matter",
    author: "Priya Subramaniam",
    authorRole: "Seed Librarian & Conservation Officer",
    date: "March 5, 2025",
    readTime: "8 min",
    tag: "Heritage",
    type: "lily",
    excerpt:
      "Modern hybrid flower seeds are optimised for uniformity and shelf life. Heritage seeds carry centuries of selection, local adaptation, and irreplaceable genetic diversity — and they are quietly vanishing.",
    content: [
      {
        kind: "intro",
        text: "Walk into any garden centre and the seed display is a triumph of marketing: uniform packets, standardised sizes, F1 hybrid varieties bred for maximum visual impact. What you will not find are the thousands of open-pollinated, heritage varieties that gardeners and farmers saved and traded for generations. Many of these are now held only in a handful of seed libraries worldwide. Some are already gone.",
      },
      {
        kind: "h2",
        heading: "What Is a Heritage Seed?",
        text: "A heritage (or heirloom) seed is an open-pollinated variety that has been maintained — selected, saved, and replanted — for at least 50 years, and in many cases for centuries. Unlike F1 hybrids, which are created by crossing two distinct parent lines and do not reliably reproduce true to type from their own seed, heritage varieties breed true. Save seed from a heritage sweet pea and the offspring will be identical to the parent. This is what makes them saveable, shareable, and self-sustaining.",
      },
      {
        kind: "h2",
        heading: "The Case for Genetic Diversity",
        text: "The global flower industry has progressively narrowed its genetic base. The most commercially successful variants of roses, tulips, and carnations are replicated at industrial scale, crowding out thousands of older varieties from commerce. This genetic narrowing is a biological risk: a pathogen that targets a specific genetic trait can devastate an entire commercial supply chain. The Irish Potato Famine is the catastrophic historical example. In flowers, the near-extinction of the original 'Picotee' sweet pea strains in the 1970s offered a smaller but instructive warning.",
      },
      {
        kind: "tip",
        text: "The Laliguras Club maintains a seed library for members. You can borrow seed each spring and return double the quantity at harvest — the most practical way to participate in heritage conservation.",
      },
      {
        kind: "h2",
        heading: "How to Save Seeds Correctly",
        text: "Seed saving is straightforward for most open-pollinated flowers but requires attention to a few key principles. Let the best specimens go fully to seed — select plants that demonstrate the traits you want to preserve: vigour, colour, form, fragrance. Allow seed pods to mature and dry fully on the plant before harvesting. Clean seeds thoroughly, removing all chaff and damp material. Store in paper envelopes (not plastic — condensation kills seeds) in a cool, dark, dry location. Properly stored, most flower seeds remain viable for 2–5 years.",
      },
      {
        kind: "h2",
        heading: "The Broader Responsibility",
        text: "Heritage seed preservation is not nostalgia. It is an act of practical conservation — maintaining biological options that we cannot yet know we will need. The Korean peninsular climate is home to dozens of endemic wildflower varieties that have never been commercially cultivated. As climate patterns shift, the cold-hardiness and drought tolerance encoded in these local varieties may become precisely the traits future cultivators require. Saving heritage seed is a gift to a future we cannot see.",
      },
    ],
  },

  /* ─────────────────────────────────────────────────
     7. Companion Planting for Pollinators
  ───────────────────────────────────────────────── */
  {
    slug: "companion-planting-for-pollinators",
    title: "Companion Planting for Pollinators",
    author: "Marcus Chen",
    authorRole: "Club Senior Member & Dahlia Specialist",
    date: "February 26, 2025",
    readTime: "6 min",
    tag: "Ecology",
    type: "peony",
    excerpt:
      "The most beautiful flower garden is one that hums with insect life. Strategic companion planting turns a flower bed into a working ecosystem.",
    content: [
      {
        kind: "intro",
        text: "A garden without pollinators is a garden quietly failing. Bees, hoverflies, butterflies, and moths do not merely make the garden more lively — they are directly responsible for the fertilisation of the vast majority of flowering plants. Designing companion planting schemes that attract and sustain pollinator populations is both ecologically sound and, in practical terms, produces more abundant, better-formed flowers.",
      },
      {
        kind: "h2",
        heading: "Understanding Pollinator Needs",
        text: "Different pollinators have different needs. Honeybees and bumblebees favour open, single-petalled flowers in the blue-violet spectrum — lavender, borage, phacelia, and single dahlias are irresistible to them. Hoverflies — important and under-appreciated pollinators — prefer shallow, open flowers where they can access nectar without specialised mouthparts: umbellifers like dill and fennel in flower are hoverfly magnets. Butterflies need landing platforms and prefer flowers in dense, flat-topped clusters: sedum, verbena bonariensis, and echinacea. Moths, active at dusk and dawn, favour white or pale flowers with strong evening fragrance: white tobacco plants, evening primrose, and phlox.",
      },
      {
        kind: "h2",
        heading: "Classic Flower Companion Combinations",
        text: "Some combinations have proven their value across centuries of gardening practice. Marigolds (Tagetes) alongside roses repel aphids and whitefly through root-exuded compounds. The effect is most pronounced with French marigolds planted in dense rings around rose beds. Lavender planted at the front of a rose border attracts bumblebees whose presence in turn improves rose pollination and discourages pests. Alliums among tulips and peonies not only add vertical interest — their strong scent deters many soil-dwelling grubs that would otherwise damage bulbs.",
      },
      {
        kind: "tip",
        text: "Leave a small patch of your garden deliberately 'wild' — allow some grass to grow long, leave a section of bare soil, and resist the urge to cut back all seedheads in autumn. Ground-nesting bees and overwintering insects depend on exactly this kind of unmanaged habitat.",
      },
      {
        kind: "h2",
        heading: "Extending the Pollinator Season",
        text: "The critical periods for pollinator support are early spring (when colonies are emerging from winter and early food sources are scarce) and late autumn (when pollinators are building reserves before winter). For early spring: plant crocus, pulmonaria, and hellebores — these flower when almost nothing else does and provide essential early nutrition. For late autumn: sedum, asters, and single-flowered dahlias left uncut until frost will support bees and butterflies into October.",
      },
    ],
  },

  /* ─────────────────────────────────────────────────
     8. Forcing Bulbs Indoors
  ───────────────────────────────────────────────── */
  {
    slug: "forcing-bulbs-indoors",
    title: "Forcing Bulbs Indoors",
    author: "Aisha Rajan",
    authorRole: "Plant Pathologist & Club Member",
    date: "February 18, 2025",
    readTime: "5 min",
    tag: "Technique",
    type: "tulip",
    excerpt:
      "Forcing spring bulbs to bloom in midwinter is one of the most rewarding tricks in the flower grower's repertoire — and far simpler than most people assume.",
    content: [
      {
        kind: "intro",
        text: "In the depths of a Korean winter, the sight of tulips or hyacinths blooming on an indoor windowsill is nothing short of extraordinary. Forcing — the technique of artificially providing the cold period that spring bulbs need to flower, then bringing them into warmth to bloom ahead of their natural schedule — has been practised by Dutch growers since the seventeenth century. With a refrigerator and a little patience, any gardener can do it.",
      },
      {
        kind: "h2",
        heading: "Choosing Bulbs for Forcing",
        text: "Not all bulbs force equally well. The most reliable results come from: tulips (especially Darwin Hybrid and triumph types), hyacinths, narcissus, crocus, and paperwhites (Narcissus papyraceus — these require no cold period at all). Buy the largest, firmest bulbs you can find — 'top size' bulbs have more stored energy and produce stronger flowers. Avoid any that show softness, mould, or damage.",
      },
      {
        kind: "h2",
        heading: "The Cold Period: Your Refrigerator as a Climate Tool",
        text: "Spring bulbs require 12–16 weeks of sustained cold (1–9°C) to initiate flowering. In the garden, they receive this naturally from autumn through winter. Indoors, your refrigerator provides an almost perfect analogue. Place dry bulbs in a paper bag (not sealed — they need air circulation) and store in the main compartment of your refrigerator for 12–16 weeks from October onwards. Keep them away from fruit, particularly apples, which emit ethylene gas that can damage bulbs.",
      },
      {
        kind: "tip",
        text: "For a continuous indoor display, stagger your cold treatment start dates. Plant one batch in refrigerator storage in early October, a second in late October, and a third in November. Bringing them into warmth at two-week intervals gives you blooms from January through March.",
      },
      {
        kind: "h2",
        heading: "Planting and Bringing Into Bloom",
        text: "After the cold period, plant bulbs in pots with the tips just above the soil surface. Use a free-draining, gritty compost mix. Place the pots in a cool but frost-free space (10–12°C) with indirect light for the first two weeks — this allows roots and shoots to establish before the warmth kicks in. Then move to a bright, warm windowsill (18–21°C). Within 2–4 weeks, flowers should appear. Water moderately throughout, avoiding both drought and waterlogging.",
      },
      {
        kind: "h2",
        heading: "After Flowering: Saving or Discarding?",
        text: "Forced bulbs have spent their stored energy reserves in an accelerated bloom. They rarely force successfully a second time. However, tulip and narcissus bulbs can be planted outdoors after forcing — they will recover over 1–3 seasons and eventually bloom naturally in the garden. Allow the foliage to die down naturally after flowering indoors. Hyacinths and crocus forced indoors are typically best composted, as they seldom recover sufficient vigour for outdoor replanting.",
      },
    ],
  },
];

export default POSTS;
