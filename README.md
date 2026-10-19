<div align="center">

### ✦ LANDING PAGE UI DESIGN ✦

# L’Atelier — Musée Vivant

**A living museum, designed to make you linger.**

An editorial landing page for an imagined Parisian art museum. Explore five centuries of art through warm, gallery-inspired visuals, expressive typography, and considered motion—then book your visit in a few simple steps.

<br />

![Next.js](https://img.shields.io/badge/Next.js-16-131009?style=for-the-badge&logo=next.js&logoColor=F2ECDF)
![React](https://img.shields.io/badge/React-19-131009?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-131009?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8)
![Prisma](https://img.shields.io/badge/Prisma-6-131009?style=for-the-badge&logo=prisma&logoColor=B08D57)

<br />

*PARIS · ART · A PLACE TO LINGER*

</div>

---

> **The experience:** a cinematic, responsive museum landing page with scroll-led storytelling, an artwork-rich collection, and a complete reservation flow.

---

## ✨ Features

- **Cinematic preloader** — eased 0→100 counter with rotating phrases and curtain exit
- **Lenis smooth scrolling** with anchor-aware section navigation
- **Custom spring cursor** with contextual labels (`data-cursor`)
- **Hero** — letter-staggered display type, 4 parallax art frames (scroll + mouse transforms)
- **Dual marquee strips** — counter-scrolling, rotation driven by scroll velocity
- **Manifesto** — word-by-word scroll-linked opacity/color reveal with sticky column
- **Gallery** — 38 works in Pinterest-style white frames, CSS masonry, animated filter pills
- **Eras** — pinned horizontal-scroll journey through 5 art movements (desktop) / vertical era cards (mobile)
- **Chronicle** — alternating timeline with scroll-drawn terracotta rail
- **Masters** — hover rows with cursor-following framed portraits
- **Booking system** — real, server-validated reservations with capacity control
- **Fully responsive** — dedicated mobile layouts, zero horizontal overflow at 390px
- **No dev clutter** — Next.js DevTools floating indicator is disabled (`devIndicators: false`)

## 🎟️ Booking System

| | |
|---|---|
| Day slots | 9 entry slots (09:00 – 17:00) |
| Nocturne | 4 extra evening slots on Thursdays (18:00 – 21:00) |
| Capacity | 14 visitors per slot · max 8 per booking |
| Tickets | Adult €14 · Senior €10 · Under 26 free · Under 12 free |
| Closure | Closed Mondays |
| Flow | 4-step wizard → confirmation with `ATL-XXXXXX` reference → manage / cancel |

Availability is **computed server-side** from confirmed bookings, and the final capacity
check runs inside a transaction, so two users can never overbook the same slot.

### API

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/availability?date=YYYY-MM-DD` | Remaining spots per slot for a date |
| `POST` | `/api/bookings` | Create a booking (validated, capacity-checked) |
| `GET` | `/api/bookings/[reference]?email=` | Look up a booking (email-gated) |
| `DELETE` | `/api/bookings/[reference]?email=` | Cancel a booking (frees the slots) |

## 🚀 Getting Started

**Prerequisites:** Node.js 20+ (or Bun 1.1+)

```bash
# 1 — install dependencies
npm install        # or: bun install

# 2 — create the SQLite database (prisma/schema.prisma → db/custom.db)
npm run db:push    # or: bun run db:push

# 3 — start the dev server
npm run dev        # or: bun run dev
```

Open **http://localhost:3000** — done. A `.env` file with the portable database URL is included;
if it's missing, copy `.env.example` to `.env`.

### Production build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
├── prisma/schema.prisma        # Booking model (SQLite)
├── db/                         # custom.db lives here (created by db:push)
├── public/art/                 # 38 optimised artwork images (immutable-cached)
└── src/
    ├── app/
    │   ├── page.tsx            # the one-page experience (section composition)
    │   ├── layout.tsx          # fonts (Playfair / Cormorant / Manrope — self-hosted)
    │   ├── globals.css         # vintage palette, grain, masonry, scrollbar
    │   └── api/
    │       ├── availability/   # GET  remaining spots per slot
    │       └── bookings/       # POST create · GET lookup · DELETE cancel
    ├── components/atelier/     # navbar, hero, marquee, manifesto, gallery, eras,
    │   └── booking/            # chronicle, masters, visit, footer, cursor, grain…
    ├── lib/
    │   ├── artworks.ts         # single source of truth for all artwork data
    │   ├── museum.ts           # slots, ticket types, capacity, date helpers
    │   ├── bookings.ts         # server-side availability + create/lookup/cancel
    │   └── db.ts               # Prisma client singleton
    └── hooks/                  # use-toast, use-mobile
```

## 🎨 Design Tokens

| Token | Value | Used for |
|---|---|---|
| `ink` | `#131009` | text, dark surfaces |
| `parchment` | `#f2ecdf` | page background |
| `terra` | `#b4502a` | accents, rails, CTAs |
| `gold` | `#b08d57` | fine details, borders |

## 🖼️ Images

All 38 artwork & museum photographs are bundled locally in `public/art/` with
content-addressed filenames and served with `Cache-Control: immutable` — the site
makes **zero external requests** at runtime.

## 📄 License

Shipped as a demo/portfolio project — artwork photography is sourced from public
stock libraries for illustrative purposes.
