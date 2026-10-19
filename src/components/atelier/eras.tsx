"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { MoveRight } from "lucide-react";
import { ERAS, ERA_META, type Era } from "@/lib/artworks";
import { EASE, Reveal } from "./reveal";

/* ------------------------------------------------------------------ */
/* Desktop panel — side-by-side composition for the pinned track       */
/* ------------------------------------------------------------------ */
function EraPanel({ era, index }: { era: Era; index: number }) {
  const meta = ERA_META[era];
  return (
    <article
      className="group relative flex h-full w-[82vw] shrink-0 items-center gap-8 px-[4vw] sm:w-[70vw] lg:w-[62vw]"
      aria-label={`${era} — ${meta.span}`}
    >
      {/* era image */}
      <div className="relative h-[58vh] w-[52%] overflow-hidden sm:h-[64vh]">
        <motion.div
          className="h-full w-full"
          initial={{ scale: 1.12 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={meta.hero}
            alt={`${era} masterwork`}
            className="h-full w-full object-cover vintage-sepia"
            loading="lazy"
          />
        </motion.div>
        {/* frame border */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 border border-parchment/15"
        />
        {/* roman numeral */}
        <span
          aria-hidden="true"
          className="text-outline absolute -bottom-6 left-4 select-none font-display text-7xl font-bold italic text-parchment/70 opacity-60 sm:text-8xl"
        >
          {["I", "II", "III", "IV", "V"][index]}
        </span>
      </div>

      {/* era text */}
      <div className="flex w-[48%] flex-col">
        <span className="font-sans text-[10px] font-bold uppercase tracking-[0.35em] text-gold-soft">
          {meta.span}
        </span>
        <h3 className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight text-parchment sm:text-4xl lg:text-5xl">
          {era}
        </h3>
        <p className="mt-2 font-accent text-lg italic text-terra sm:text-xl" style={{ color: meta.accent }}>
          {meta.motto}
        </p>
        <p className="mt-5 max-w-md font-sans text-[13px] leading-relaxed text-parchment/60 sm:text-sm">
          {meta.blurb}
        </p>
        <div className="mt-7 h-px w-full max-w-md bg-gradient-to-r from-parchment/30 to-transparent" />
        <div className="mt-4 flex items-center gap-6">
          <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-parchment/40">
            Gallery {["I", "II", "III", "IV", "V"][index]} · North Wing
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile card — full-width stacked composition                        */
/* ------------------------------------------------------------------ */
function EraCard({ era, index }: { era: Era; index: number }) {
  const meta = ERA_META[era];
  return (
    <Reveal y={44} className="block">
      <article
        className="relative overflow-hidden border border-parchment/15 bg-ink-soft/70"
        aria-label={`${era} — ${meta.span}`}
      >
        <div className="relative h-[38vh] min-h-[240px] overflow-hidden">
          <motion.img
            src={meta.hero}
            alt={`${era} masterwork`}
            className="h-full w-full object-cover vintage-sepia"
            loading="lazy"
            initial={{ scale: 1.12 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 border border-parchment/10"
          />
          <span
            aria-hidden="true"
            className="text-outline absolute -bottom-3 left-3 select-none font-display text-6xl font-bold italic text-parchment/70 opacity-60"
          >
            {["I", "II", "III", "IV", "V"][index]}
          </span>
        </div>

        <div className="p-5">
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.35em] text-gold-soft">
            {meta.span}
          </span>
          <h3 className="mt-3 font-display text-3xl font-medium leading-tight tracking-tight text-parchment">
            {era}
          </h3>
          <p
            className="mt-1.5 font-accent text-lg italic"
            style={{ color: meta.accent }}
          >
            {meta.motto}
          </p>
          <p className="mt-4 font-sans text-[13px] leading-relaxed text-parchment/60">
            {meta.blurb}
          </p>
          <div className="mt-5 h-px w-full bg-gradient-to-r from-parchment/30 to-transparent" />
          <div className="mt-3.5 flex items-center justify-between">
            <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-parchment/40">
              Gallery {["I", "II", "III", "IV", "V"][index]} · North Wing
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
          </div>
        </div>
      </article>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
export function Eras() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState(0);

  /* measure how far the track must travel (desktop pinned track only) */
  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setRange(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    const t = setTimeout(measure, 800); // after fonts settle
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.4,
  });
  const x = useTransform(smooth, [0, 1], [0, -range]);
  const progressScale = useTransform(smooth, [0, 1], [0, 1]);
  const dotLeft = useTransform(progressScale, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="eras"
      ref={sectionRef}
      className="relative bg-ink"
      aria-label="Journey through the eras"
    >
      {/* ============ desktop & tablet: pinned horizontal journey ============ */}
      <div className="hidden md:block" style={{ height: "560vh" }}>
        <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
          {/* ambient glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 50% at 50% 110%, rgba(180,80,42,0.12), transparent 70%)",
            }}
          />

          {/* header */}
          <div className="flex items-end justify-between px-5 pt-24 sm:px-10 sm:pt-28">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-gold/60" aria-hidden="true" />
                <span className="font-sans text-[11px] font-bold uppercase tracking-[0.35em] text-gold-soft">
                  Journey the Eras
                </span>
              </div>
              <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-parchment sm:text-5xl">
                Five rooms, <span className="font-accent italic text-terra">five hundred years</span>
              </h2>
            </div>
            <div className="hidden items-center gap-3 pb-2 sm:flex">
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-parchment/40">
                Keep scrolling
              </span>
              <MoveRight className="h-4 w-4 animate-pulse text-terra" />
            </div>
          </div>

          {/* horizontal track */}
          <div className="relative flex-1">
            <motion.div
              ref={trackRef}
              style={{ x }}
              className="flex h-full items-center will-change-transform"
            >
              {/* intro panel */}
              <div className="flex h-full w-[30vw] shrink-0 items-center justify-center">
                <div className="text-center">
                  <span className="font-display text-[9rem] font-bold italic leading-none text-parchment/10 sm:text-[12rem]">
                    500
                  </span>
                  <p className="-mt-6 font-accent text-xl italic text-parchment/60 sm:-mt-10">
                    years of light, walked in one breath
                  </p>
                </div>
              </div>

              {ERAS.map((era, i) => (
                <EraPanel key={era} era={era} index={i} />
              ))}

              {/* outro panel */}
              <div className="flex h-full w-[40vw] shrink-0 items-center justify-center">
                <p className="max-w-[260px] text-center font-display text-2xl italic leading-snug text-parchment/50">
                  …and the walls keep whispering long after you leave.
                </p>
              </div>
            </motion.div>
          </div>

          {/* progress rail */}
          <div className="flex items-center gap-5 px-5 pb-8 sm:px-10">
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-parchment/40">
              {["1400", "1900"][0]}
            </span>
            <div className="relative h-px flex-1 bg-parchment/15">
              <motion.div
                className="absolute inset-y-0 left-0 origin-left bg-terra"
                style={{ scaleX: progressScale, width: "100%" }}
              />
              <motion.div
                className="absolute -top-1 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-gold shadow"
                style={{ left: dotLeft }}
              />
            </div>
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-parchment/40">
              1900
            </span>
          </div>
        </div>
      </div>

      {/* ============ mobile: vertical walk through the eras ============ */}
      <div className="relative overflow-hidden px-5 py-24 md:hidden sm:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 40% at 50% 0%, rgba(180,80,42,0.12), transparent 70%)",
          }}
        />
        <div className="relative">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-gold/60" aria-hidden="true" />
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.35em] text-gold-soft">
              Journey the Eras
            </span>
          </div>
          <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-parchment sm:text-5xl">
            Five rooms, <span className="font-accent italic text-terra">five hundred years</span>
          </h2>

          {/* intro block */}
          <Reveal y={30} className="mt-10 block text-center">
            <span className="font-display text-8xl font-bold italic leading-none text-parchment/10">
              500
            </span>
            <p className="-mt-4 font-accent text-lg italic text-parchment/60">
              years of light, walked in one breath
            </p>
          </Reveal>

          <div className="mt-10 space-y-8">
            {ERAS.map((era, i) => (
              <EraCard key={era} era={era} index={i} />
            ))}
          </div>

          {/* outro */}
          <Reveal y={24} className="mt-12 block text-center">
            <p className="mx-auto max-w-[280px] font-display text-xl italic leading-snug text-parchment/50">
              …and the walls keep whispering long after you leave.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
