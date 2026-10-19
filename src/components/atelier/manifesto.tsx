"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { MUSEUM_IMAGES } from "@/lib/artworks";
import { Reveal } from "./reveal";

const SENTENCE =
  "Art is not merely to be seen — it is to be felt, remembered, and lived. We keep five centuries of light burning, so that every wandering eye may find its way home.";

function Word({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = index / total;
  const end = start + 1 / total;
  const opacity = useTransform(progress, [start, end], [0.14, 1]);
  const color = useTransform(progress, [start, end], ["#4a4234", "#f2ecdf"]);

  return (
    <motion.span style={{ opacity, color }} className="inline-block">
      {word}&nbsp;
    </motion.span>
  );
}

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const words = SENTENCE.split(" ");

  return (
    <section
      id="manifesto"
      ref={ref}
      className="relative overflow-hidden bg-ink py-28 sm:py-36"
      aria-label="Manifesto"
    >
      {/* ghost watermark */}
      <span
        aria-hidden="true"
        className="text-outline pointer-events-none absolute -right-8 top-10 select-none font-display text-[26vw] font-bold italic leading-none text-parchment/60 opacity-[0.07]"
      >
        1893
      </span>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_minmax(0,760px)] lg:gap-20">
        {/* left column — sticky intro */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal y={24}>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-gold/60" aria-hidden="true" />
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.35em] text-gold-soft">
                The Manifesto
              </span>
            </div>
          </Reveal>
          <Reveal y={30} delay={0.1}>
            <p className="mt-6 max-w-xs font-accent text-2xl font-light italic leading-snug text-parchment/70">
              A museum is not a warehouse of the past — it is a promise made to
              the future.
            </p>
          </Reveal>

          <Reveal y={40} delay={0.2} className="mt-10">
            <figure className="group relative w-56 overflow-hidden sm:w-64">
              <img
                src={MUSEUM_IMAGES.stairway}
                alt="The grand staircase of L'Atelier"
                style={{ aspectRatio: "1.415" }}
                className="h-auto w-full object-cover vintage-sepia"
                loading="lazy"
                data-cursor="1893"
              />
              <figcaption className="mt-3 font-sans text-[10px] uppercase tracking-[0.25em] text-parchment/40">
                The Grand Staircase, Hall II
              </figcaption>
            </figure>
          </Reveal>
        </div>

        {/* right column — word-by-word reveal */}
        <div className="relative">
          <motion.figure
            style={{ y: imgY }}
            className="mb-12 ml-auto w-48 rotate-2 border-[6px] border-[#2e2818] bg-[#2e2818] shadow-2xl sm:w-60"
          >
            <img
              src={MUSEUM_IMAGES.gallery}
              alt="Visitors in the long gallery"
              style={{ aspectRatio: "1.778" }}
              className="h-auto w-full object-cover vintage-sepia"
              loading="lazy"
            />
          </motion.figure>

          <p className="font-display text-3xl font-medium leading-[1.35] tracking-tight sm:text-4xl lg:text-[2.9rem] lg:leading-[1.32]">
            {words.map((w, i) => (
              <Word
                key={i}
                word={w}
                index={i}
                total={words.length}
                progress={scrollYProgress}
              />
            ))}
          </p>

          <Reveal y={30} delay={0.1} className="mt-12">
            <div className="flex items-center gap-5">
              <span className="h-14 w-px bg-gold/50" aria-hidden="true" />
              <div>
                <p className="font-display text-lg font-semibold text-parchment">
                  Élise Marchand
                </p>
                <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-parchment/45">
                  Founder, 1893
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
