export type Era =
  | "Renaissance"
  | "Baroque"
  | "Impressionism"
  | "Art Nouveau"
  | "Sculpture";

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: string;
  era: Era;
  src: string;
  ratio: number; // width / height
  medium: string;
}

// All images are served locally from /public/art (pre-optimized, immutable cache)
const CDN = "/art";

export const ARTWORKS: Artwork[] = [
  // ---------- Renaissance ----------
  {
    id: "ren-01",
    title: "Madonna of the Quiet Hours",
    artist: "Circle of Giovanni Bellini",
    year: "c. 1490",
    era: "Renaissance",
    src: `${CDN}/6c1934f9aaae.webp`,
    ratio: 1,
    medium: "Oil on poplar panel",
  },
  {
    id: "ren-02",
    title: "The Feast of San Marco",
    artist: "Attributed to Veronese",
    year: "c. 1562",
    era: "Renaissance",
    src: `${CDN}/8835a2b9e612.jpg`,
    ratio: 1.337,
    medium: "Oil on canvas",
  },
  {
    id: "ren-03",
    title: "Allegory of the Spring Thaw",
    artist: "Florentine School",
    year: "c. 1485",
    era: "Renaissance",
    src: `${CDN}/01014d027caf.jpg`,
    ratio: 1.274,
    medium: "Tempera on panel",
  },
  {
    id: "ren-04",
    title: "Portrait of a Lady in Crimson",
    artist: "Agnolo Bronzino",
    year: "c. 1545",
    era: "Renaissance",
    src: `${CDN}/2b6d74f65d8a.jpg`,
    ratio: 0.721,
    medium: "Oil on wood",
  },
  {
    id: "ren-05",
    title: "The Annunciation Study",
    artist: "Workshop of Botticelli",
    year: "c. 1481",
    era: "Renaissance",
    src: `${CDN}/03c4832b40e2.jpg`,
    ratio: 1,
    medium: "Oil and gold leaf",
  },
  {
    id: "ren-06",
    title: "Procession at Dusk",
    artist: "Vittore Carpaccio",
    year: "c. 1496",
    era: "Renaissance",
    src: `${CDN}/95e2b9e5e766.jpg`,
    ratio: 2,
    medium: "Fresco transferred to canvas",
  },
  {
    id: "ren-07",
    title: "Young Man with a Lute",
    artist: "Lorenzo Lotto",
    year: "c. 1528",
    era: "Renaissance",
    src: `${CDN}/9b798e3dd59c.jpg`,
    ratio: 0.774,
    medium: "Oil on canvas",
  },
  {
    id: "ren-08",
    title: "The School of Light",
    artist: "Raffaello Sanzio",
    year: "c. 1511",
    era: "Renaissance",
    src: `${CDN}/7d362150c4db.webp`,
    ratio: 1.799,
    medium: "Fresco",
  },

  // ---------- Baroque ----------
  {
    id: "bar-01",
    title: "The Denial, Reconsidered",
    artist: "After Caravaggio",
    year: "c. 1610",
    era: "Baroque",
    src: `${CDN}/e11d07bda1dc.jpg`,
    ratio: 1.739,
    medium: "Oil on canvas",
  },
  {
    id: "bar-02",
    title: "Supper by Candlelight",
    artist: "Gerard van Honthorst",
    year: "c. 1622",
    era: "Baroque",
    src: `${CDN}/80fb3f9c1fa9.jpg`,
    ratio: 1.351,
    medium: "Oil on canvas",
  },
  {
    id: "bar-03",
    title: "Judith Before the Dawn",
    artist: "Artemisia Gentileschi",
    year: "c. 1625",
    era: "Baroque",
    src: `${CDN}/047b0cd5a6c5.jpg`,
    ratio: 0.702,
    medium: "Oil on canvas",
  },
  {
    id: "bar-04",
    title: "The Martyrdom of St. Cecilia",
    artist: "Neapolitan School",
    year: "c. 1650",
    era: "Baroque",
    src: `${CDN}/5ac6133ef2f6.jpg`,
    ratio: 2.514,
    medium: "Oil on canvas",
  },
  {
    id: "bar-05",
    title: "Ecce Homo, Restored",
    artist: "Jusepe de Ribera",
    year: "c. 1635",
    era: "Baroque",
    src: `${CDN}/cf96644ae743.jpg`,
    ratio: 0.763,
    medium: "Oil on canvas",
  },
  {
    id: "bar-06",
    title: "Still Life with Skull & Roses",
    artist: "Pieter Claesz",
    year: "c. 1643",
    era: "Baroque",
    src: `${CDN}/1f5b3b0a9c26.jpg`,
    ratio: 0.972,
    medium: "Oil on oak panel",
  },

  // ---------- Impressionism ----------
  {
    id: "imp-01",
    title: "Water Lilies, Last Light",
    artist: "Claude Monet",
    year: "c. 1906",
    era: "Impressionism",
    src: `${CDN}/bf1481861c46.jpg`,
    ratio: 1.778,
    medium: "Oil on canvas",
  },
  {
    id: "imp-02",
    title: "The Garden at Giverny",
    artist: "Claude Monet",
    year: "c. 1900",
    era: "Impressionism",
    src: `${CDN}/d3824afa0194.jpg`,
    ratio: 1,
    medium: "Oil on canvas",
  },
  {
    id: "imp-03",
    title: "Haystacks in July",
    artist: "Claude Monet",
    year: "c. 1891",
    era: "Impressionism",
    src: `${CDN}/9e71554b96e8.jpg`,
    ratio: 1.217,
    medium: "Oil on canvas",
  },
  {
    id: "imp-04",
    title: "The Seine at Argenteuil",
    artist: "Édouard Manet",
    year: "c. 1874",
    era: "Impressionism",
    src: `${CDN}/e64a779e270e.jpg`,
    ratio: 1.027,
    medium: "Oil on canvas",
  },
  {
    id: "imp-05",
    title: "Dancer Resting",
    artist: "Edgar Degas",
    year: "c. 1879",
    era: "Impressionism",
    src: `${CDN}/0df9f9faeb0d.jpg`,
    ratio: 0.715,
    medium: "Pastel on paper",
  },
  {
    id: "imp-06",
    title: "Rouen Cathedral, Noon",
    artist: "Claude Monet",
    year: "c. 1894",
    era: "Impressionism",
    src: `${CDN}/b2edf202e493.jpg`,
    ratio: 1,
    medium: "Oil on canvas",
  },

  // ---------- Art Nouveau ----------
  {
    id: "nou-01",
    title: "Panorama Moderne",
    artist: "Alphonse Mucha",
    year: "c. 1902",
    era: "Art Nouveau",
    src: `${CDN}/163bc5b7c926.webp`,
    ratio: 1.778,
    medium: "Lithograph in colour",
  },
  {
    id: "nou-02",
    title: "Ivy, Panel I",
    artist: "Alphonse Mucha",
    year: "c. 1901",
    era: "Art Nouveau",
    src: `${CDN}/68d867d79671.jpg`,
    ratio: 0.377,
    medium: "Colour lithograph",
  },
  {
    id: "nou-03",
    title: "Reverie in Gold",
    artist: "Alphonse Mucha",
    year: "c. 1898",
    era: "Art Nouveau",
    src: `${CDN}/c01fa54f142d.jpg`,
    ratio: 1,
    medium: "Lithograph",
  },
  {
    id: "nou-04",
    title: "The Four Seasons — Autumn",
    artist: "Alphonse Mucha",
    year: "c. 1896",
    era: "Art Nouveau",
    src: `${CDN}/64b515b0e51c.jpg`,
    ratio: 1,
    medium: "Colour lithograph",
  },
  {
    id: "nou-05",
    title: "Primrose & Peacock",
    artist: "Will Bradley",
    year: "c. 1895",
    era: "Art Nouveau",
    src: `${CDN}/b4299376a050.jpg`,
    ratio: 1,
    medium: "Poster lithograph",
  },
  {
    id: "nou-06",
    title: "La Belle Époque",
    artist: "Henri Privat-Livemont",
    year: "c. 1899",
    era: "Art Nouveau",
    src: `${CDN}/29e9085c11ca.jpg`,
    ratio: 1,
    medium: "Chromolithograph",
  },

  // ---------- Sculpture ----------
  {
    id: "scu-01",
    title: "Aphrodite of the Halls",
    artist: "Hellenistic School",
    year: "c. 130 BC",
    era: "Sculpture",
    src: `${CDN}/6b2a74dfc912.jpg`,
    ratio: 0.667,
    medium: "Parian marble",
  },
  {
    id: "scu-02",
    title: "The Wrestlers",
    artist: "Attic Workshop",
    year: "c. 300 BC",
    era: "Sculpture",
    src: `${CDN}/a8bf527aefa6.jpg`,
    ratio: 1.5,
    medium: "Pentelic marble",
  },
  {
    id: "scu-03",
    title: "Bust of an Unknown Poet",
    artist: "Roman Copyist",
    year: "c. 60 AD",
    era: "Sculpture",
    src: `${CDN}/ea109df06e81.jpg`,
    ratio: 1.475,
    medium: "Marble",
  },
  {
    id: "scu-04",
    title: "Torso, Restored",
    artist: "After the antique",
    year: "c. 1560",
    era: "Sculpture",
    src: `${CDN}/6c616fb8d923.jpg`,
    ratio: 0.667,
    medium: "Carrara marble",
  },
  {
    id: "scu-05",
    title: "The Veiled Muse",
    artist: "Giovanni Strazza",
    year: "c. 1850",
    era: "Sculpture",
    src: `${CDN}/66c48c957f8f.jpg`,
    ratio: 0.776,
    medium: "Carrara marble",
  },
  {
    id: "scu-06",
    title: "Winged Victory Study",
    artist: "Auguste Rodin",
    year: "c. 1886",
    era: "Sculpture",
    src: `${CDN}/d05d7e2bcc84.jpg`,
    ratio: 0.736,
    medium: "Bronze cast",
  },
];

export const ERAS: Era[] = [
  "Renaissance",
  "Baroque",
  "Impressionism",
  "Art Nouveau",
  "Sculpture",
];

export const ERA_META: Record<
  Era,
  { span: string; motto: string; blurb: string; hero: string; accent: string }
> = {
  Renaissance: {
    span: "1400 — 1600",
    motto: "The Rebirth of Light",
    blurb:
      "Perspective is invented, the divine takes human form, and Florence becomes the crucible of Western art. Gold grounds melt away into painted windows opened onto the world.",
    hero: `${CDN}/01014d027caf.jpg`,
    accent: "#8A6B3D",
  },
  Baroque: {
    span: "1600 — 1750",
    motto: "Theatre of Shadow",
    blurb:
      "Chiaroscuro becomes a language of ecstasy and doubt. Painters carve figures out of darkness, and every canvas becomes a stage lit by a single, theatrical flame.",
    hero: `${CDN}/047b0cd5a6c5.jpg`,
    accent: "#7A3B2E",
  },
  Impressionism: {
    span: "1860 — 1890",
    motto: "Painting the Passing Hour",
    blurb:
      "Paint leaves the studio for the riverbank. Broken colour, trembling water, steam and sunlight — the Impressionists commit to canvas the fleeting sensation of a moment.",
    hero: `${CDN}/bf1481861c46.jpg`,
    accent: "#5E6B4A",
  },
  "Art Nouveau": {
    span: "1890 — 1910",
    motto: "Nature in Ornament",
    blurb:
      "Whiplash lines, gilded hair and flowering vines swallow architecture, posters and glass. Art Nouveau dissolves the boundary between fine and decorative art.",
    hero: `${CDN}/64b515b0e51c.jpg`,
    accent: "#8A6B3D",
  },
  Sculpture: {
    span: "Antiquity — 1900",
    motto: "The Body Eternal",
    blurb:
      "From Hellenistic marble to Rodin's bronze — the sculptor's long conversation with stone, flesh and breath, preserved across two thousand years of hands.",
    hero: `${CDN}/6b2a74dfc912.jpg`,
    accent: "#6E655A",
  },
};

export const MASTERS = [
  {
    name: "Leonardo da Vinci",
    role: "Polymath of the High Renaissance",
    dates: "1452 – 1519",
    img: `${CDN}/8835a2b9e612.jpg`,
  },
  {
    name: "Caravaggio",
    role: "Master of Chiaroscuro",
    dates: "1571 – 1610",
    img: `${CDN}/cf96644ae743.jpg`,
  },
  {
    name: "Claude Monet",
    role: "Father of Impressionism",
    dates: "1840 – 1926",
    img: `${CDN}/bf1481861c46.jpg`,
  },
  {
    name: "Alphonse Mucha",
    role: "Icon of Art Nouveau",
    dates: "1860 – 1939",
    img: `${CDN}/68d867d79671.jpg`,
  },
  {
    name: "Artemisia Gentileschi",
    role: "Baroque Revolutionary",
    dates: "1593 – 1656",
    img: `${CDN}/047b0cd5a6c5.jpg`,
  },
  {
    name: "Auguste Rodin",
    role: "Poet of Marble & Bronze",
    dates: "1840 – 1917",
    img: `${CDN}/66c48c957f8f.jpg`,
  },
];

export const HERO_ART = [
  {
    src: `${CDN}/2b6d74f65d8a.jpg`,
    alt: "Portrait of a Lady in Crimson",
    ratio: 0.721,
  },
  {
    src: `${CDN}/68d867d79671.jpg`,
    alt: "Ivy panel by Alphonse Mucha",
    ratio: 0.377,
  },
  {
    src: `${CDN}/6b2a74dfc912.jpg`,
    alt: "Hellenistic marble sculpture",
    ratio: 0.667,
  },
  {
    src: `${CDN}/ea109df06e81.jpg`,
    alt: "Marble bust of an unknown poet",
    ratio: 1.475,
  },
];

export const MUSEUM_IMAGES = {
  grandHall: `${CDN}/c8b8716344b3.jpeg`,
  gallery: `${CDN}/9a2f044bffbd.jpg`,
  salon: `${CDN}/4b7263e5b347.jpg`,
  stairway: `${CDN}/5e5db11ed78d.jpg`,
  archive: `${CDN}/32e1e0e257bf.jpg`,
  reading: `${CDN}/e717e132fa70.jpg`,
};

export const CHRONICLE = [
  {
    year: "1893",
    title: "The Founding",
    text: "Élise Marchand, a Parisian collector with nineteen paintings and one obsession, opens the doors of a converted printworks on the Left Bank. L'Atelier is born with a single promise: art for those who linger.",
    img: `${CDN}/32e1e0e257bf.jpg`,
  },
  {
    year: "1904",
    title: "The Grand Salon",
    text: "The glass-roofed Grand Salon is completed — a cathedral of daylight designed to hang canvases exactly where the sun touches them at three in the afternoon. Critics call it 'a room that breathes'.",
    img: `${CDN}/4b7263e5b347.jpg`,
  },
  {
    year: "1927",
    title: "The Impressionist Bequest",
    text: "Forty-one canvases arrive from Giverny in eleven crates of straw. Monet's water lilies find their permanent home here, and queue around the block follows within the week.",
    img: `${CDN}/ea109df06e81.jpg`,
  },
  {
    year: "1968",
    title: "Restoration Ateliers",
    text: "The museum opens its conservation studios to the public. Visitors watch, behind glass, as centuries of varnish are lifted from Old Masters one cotton swab at a time.",
    img: `${CDN}/9a2f044bffbd.jpg`,
  },
  {
    year: "Today",
    title: "A Living Museum",
    text: "L'Atelier holds 12,000 works across five centuries. The collection remains what it was on the first night in 1893 — an invitation to slow down, look longer, and let the centuries speak.",
    img: `${CDN}/c8b8716344b3.jpeg`,
  },
];
