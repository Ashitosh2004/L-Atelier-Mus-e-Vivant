"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ARTWORKS, ERAS, type Era } from "@/lib/artworks";
import { EASE, MaskedLine, Reveal, SectionHeading, Italic } from "./reveal";

type Filter = "All" | Era;
const FILTERS: Filter[] = ["All", ...ERAS];

function GalleryCard({
  art,
  index,
}: {
  art: (typeof ARTWORKS)[number];
  index: number;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 44, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.35 } }}
      transition={{ duration: 0.85, ease: EASE, delay: (index % 4) * 0.07 }}
      className="group relative"
      data-cursor="View"
    >
      {/* pinned-card frame */}
      <div className="relative overflow-hidden bg-white p-2.5 pb-4 shadow-[0_18px_45px_-18px_rgba(19,16,9,0.35)] transition-shadow duration-700 group-hover:shadow-[0_32px_70px_-20px_rgba(19,16,9,0.5)]">
        {/* pin dot */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-2 z-10 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-terra shadow-md transition-transform duration-500 group-hover:-translate-y-1"
        />
        <div className="relative overflow-hidden">
          <img
            src={art.src}
            alt={`${art.title} — ${art.artist}`}
            style={{ aspectRatio: String(art.ratio) }}
            className="w-full object-cover vintage-sepia transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
            loading="lazy"
          />
          {/* sheen sweep */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full"
          />
          {/* era chip */}
          <span className="absolute left-2.5 top-2.5 bg-ink/70 px-2.5 py-1 font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-parchment backdrop-blur-sm">
            {art.era}
          </span>
        </div>
        {/* caption */}
        <div className="px-1 pt-3.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg font-semibold leading-snug text-ink transition-colors duration-500 group-hover:text-terra">
              {art.title}
            </h3>
            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-ink/30 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-terra" />
          </div>
          <p className="mt-1 font-accent text-[15px] italic text-ink/55">
            {art.artist} · {art.year}
          </p>
          <p className="mt-1.5 font-sans text-[10px] uppercase tracking-[0.18em] text-ink/35">
            {art.medium}
          </p>
        </div>
      </div>

      {/* catalogue number */}
      <span
        aria-hidden="true"
        className="absolute -right-1 -top-3 z-10 font-display text-sm italic text-ink/40"
      >
        N°{String(index + 1).padStart(3, "0")}
      </span>
    </motion.article>
  );
}

export function Gallery() {
  const [filter, setFilter] = useState<Filter>("All");

  const works = useMemo(
    () =>
      filter === "All"
        ? ARTWORKS
        : ARTWORKS.filter((a) => a.era === filter),
    [filter]
  );

  return (
    <section
      id="collection"
      className="relative bg-parchment py-28 text-ink sm:py-36"
      aria-label="The collection"
    >
      {/* faint paper texture wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(90% 60% at 50% 0%, rgba(255,255,255,0.5), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8">
        {/* header */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionHeading
              kicker="The Permanent Collection"
              title={
                <>
                  <MaskedLine index={0}>Every frame a</MaskedLine>
                  <MaskedLine index={1}>
                    <Italic>small eternity</Italic>
                  </MaskedLine>
                </>
              }
            />
          </div>
          <Reveal y={26} delay={0.15} className="max-w-sm">
            <p className="font-sans text-sm leading-relaxed text-ink/60">
              Thirty-eight works from the museum&rsquo;s vaults — hung salon-style
              for the digital wanderer. Filter by movement, or lose yourself in
              the full wall.
            </p>
          </Reveal>
        </div>

        {/* filter chips */}
        <Reveal y={20} delay={0.1} className="mt-12">
          <div
            className="flex flex-wrap items-center gap-2.5"
            role="tablist"
            aria-label="Filter collection by era"
          >
            {FILTERS.map((f) => {
              const active = filter === f;
              return (
                <button
                  key={f}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(f)}
                  data-cursor="Filter"
                  className={`relative rounded-full border px-5 py-2.5 font-sans text-[10.5px] font-bold uppercase tracking-[0.2em] transition-colors duration-400 ${
                    active
                      ? "border-ink text-parchment"
                      : "border-ink/20 text-ink/60 hover:border-ink/50 hover:text-ink"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 rounded-full bg-ink"
                      transition={{ type: "spring", stiffness: 320, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{f}</span>
                </button>
              );
            })}
            <span className="ml-2 font-display text-sm italic text-ink/40">
              {works.length} works
            </span>
          </div>
        </Reveal>

        {/* masonry wall */}
        <motion.div layout className="masonry mt-14">
          <AnimatePresence mode="popLayout">
            {works.map((art, i) => (
              <GalleryCard key={art.id} art={art} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* bottom note */}
        <Reveal y={24} className="mt-16 flex justify-center">
          <p className="border-t border-ink/15 pt-6 text-center font-accent text-lg italic text-ink/50">
            The rest of the vault opens by appointment —{" "}
            <span className="text-terra">12,000 works and counting.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
