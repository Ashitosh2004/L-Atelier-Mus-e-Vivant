"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import { HERO_ART } from "@/lib/artworks";
import { EASE } from "./reveal";
import { scrollToSection } from "./smooth-scroll";

/* letter-staggered giant title */
function StaggeredWord({
  word,
  ready,
  baseDelay,
}: {
  word: string;
  ready: boolean;
  baseDelay: number;
}) {
  return (
    <span className="inline-flex overflow-hidden pb-[0.06em] -mx-[0.02em]">
      {word.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block whitespace-pre will-change-transform"
          initial={{ y: "115%", rotate: 6 }}
          animate={ready ? { y: "0%", rotate: 0 } : {}}
          transition={{
            duration: 1.2,
            delay: baseDelay + i * 0.055,
            ease: EASE,
          }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);

  /* --- scroll parallax --- */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const subY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const art1Y = useTransform(scrollYProgress, [0, 1], [0, 170]);
  const art2Y = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const art3Y = useTransform(scrollYProgress, [0, 1], [0, 240]);
  const art4Y = useTransform(scrollYProgress, [0, 1], [0, -170]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  /* --- mouse parallax --- */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 55, damping: 18 });
  const smy = useSpring(my, { stiffness: 55, damping: 18 });
  const m1x = useTransform(smx, (v) => v * 26);
  const m1y = useTransform(smy, (v) => v * 20);
  const m2x = useTransform(smx, (v) => v * -34);
  const m2y = useTransform(smy, (v) => v * -26);
  const m3x = useTransform(smx, (v) => v * 16);
  const m3y = useTransform(smy, (v) => v * 30);
  const m4x = useTransform(smx, (v) => v * -20);
  const m4y = useTransform(smy, (v) => v * -16);

  const onMouseMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const [a1, a2, a3, a4] = HERO_ART;

  return (
    <section
      id="top"
      ref={ref}
      onMouseMove={onMouseMove}
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-parchment text-ink"
      aria-label="L'Atelier — introduction"
    >
      {/* vintage paper glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, #f7f2e7 0%, #f2ecdf 45%, #e5dcc6 100%)",
        }}
      />
      {/* faint architectural lines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-[8%] hidden w-px bg-ink/[0.06] lg:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-[8%] hidden w-px bg-ink/[0.06] lg:block"
      />

      {/* ---------------- floating artworks ---------------- */}
      {/* left tall painting */}
      <motion.figure
        style={{ y: art1Y }}
        className="absolute left-[4%] top-[16%] z-[5] hidden w-[200px] md:block lg:w-[230px] xl:w-[260px]"
      >
        <motion.div
          style={{ x: m1x, y: m1y }}
          initial={{ opacity: 0, y: 90, rotate: -8 }}
          animate={ready ? { opacity: 1, y: 0, rotate: -3 } : {}}
          transition={{ duration: 1.4, delay: 0.9, ease: EASE }}
          className="group relative"
          data-cursor="C. 1545"
        >
          <div className="border-[10px] border-[#2a2118] bg-[#2a2118] shadow-[0_35px_70px_-20px_rgba(19,16,9,0.5)]">
            <img
              src={a1.src}
              alt={a1.alt}
              style={{ aspectRatio: String(a1.ratio) }}
              className="h-auto w-full object-cover vintage-sepia"
              loading="eager"
            />
          </div>
          <figcaption className="mt-3 text-center font-accent text-sm italic text-ink/60">
            Portrait of a Lady in Crimson
          </figcaption>
        </motion.div>
      </motion.figure>

      {/* right tall mucha */}
      <motion.figure
        style={{ y: art2Y }}
        className="absolute right-[5%] top-[10%] z-[4] hidden w-[170px] md:block lg:w-[195px] xl:w-[215px]"
      >
        <motion.div
          style={{ x: m2x, y: m2y }}
          initial={{ opacity: 0, y: 120, rotate: 9 }}
          animate={ready ? { opacity: 1, y: 0, rotate: 4 } : {}}
          transition={{ duration: 1.4, delay: 1.1, ease: EASE }}
          className="group relative"
          data-cursor="C. 1901"
        >
          <div className="border-[9px] border-[#3a2f1d] bg-[#3a2f1d] shadow-[0_35px_70px_-20px_rgba(19,16,9,0.45)]">
            <img
              src={a2.src}
              alt={a2.alt}
              style={{ aspectRatio: String(a2.ratio) }}
              className="h-auto w-full object-cover vintage-sepia"
              loading="eager"
            />
          </div>
          <figcaption className="mt-3 text-center font-accent text-sm italic text-ink/60">
            Ivy, Panel I — Mucha
          </figcaption>
        </motion.div>
      </motion.figure>

      {/* lower-left sculpture */}
      <motion.figure
        style={{ y: art3Y }}
        className="absolute bottom-[8%] left-[12%] z-[3] hidden w-[150px] lg:block xl:w-[180px]"
      >
        <motion.div
          style={{ x: m3x, y: m3y }}
          initial={{ opacity: 0, y: 110, rotate: -4 }}
          animate={ready ? { opacity: 1, y: 0, rotate: 2 } : {}}
          transition={{ duration: 1.4, delay: 1.3, ease: EASE }}
          className="group relative"
          data-cursor="Marble"
        >
          <div className="border-8 border-[#23201a] bg-[#23201a] shadow-[0_30px_60px_-20px_rgba(19,16,9,0.4)]">
            <img
              src={a3.src}
              alt={a3.alt}
              style={{ aspectRatio: String(a3.ratio) }}
              className="h-auto w-full object-cover vintage-sepia"
              loading="eager"
            />
          </div>
        </motion.div>
      </motion.figure>

      {/* mid-right landscape bust */}
      <motion.figure
        style={{ y: art4Y }}
        className="absolute right-[16%] top-[54%] z-[3] hidden w-[190px] xl:block"
      >
        <motion.div
          style={{ x: m4x, y: m4y }}
          initial={{ opacity: 0, y: 90, rotate: 5 }}
          animate={ready ? { opacity: 1, y: 0, rotate: -2 } : {}}
          transition={{ duration: 1.4, delay: 1.45, ease: EASE }}
          className="group relative"
          data-cursor="C. 60 AD"
        >
          <div className="border-8 border-[#2e2818] bg-[#2e2818] shadow-[0_30px_60px_-20px_rgba(19,16,9,0.4)]">
            <img
              src={a4.src}
              alt={a4.alt}
              style={{ aspectRatio: String(a4.ratio) }}
              className="h-auto w-full object-cover vintage-sepia"
              loading="eager"
            />
          </div>
        </motion.div>
      </motion.figure>

      {/* ---------------- centered type ---------------- */}
      <motion.div
        style={{ opacity: fade }}
        className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
          className="flex items-center gap-3"
        >
          <span className="h-px w-8 bg-terra/70" aria-hidden="true" />
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-terra sm:text-[11px]">
            Musée Vivant — Est. 1893
          </span>
          <span className="h-px w-8 bg-terra/70" aria-hidden="true" />
        </motion.div>

        <motion.h1
          style={{ y: titleY }}
          className="mt-6 font-display font-bold leading-[0.92] tracking-tight text-ink"
          aria-label="L'Atelier"
        >
          <span className="block text-[17.5vw] sm:text-[15vw] lg:text-[12.5vw]">
            <StaggeredWord word="L'ATELIER" ready={ready} baseDelay={0.4} />
          </span>
          <span className="mt-1 block font-accent text-[6.5vw] font-light italic tracking-normal text-terra sm:text-[3.6vw] lg:text-[2.6vw]">
            <StaggeredWord
              word="a living museum of light"
              ready={ready}
              baseDelay={0.95}
            />
          </span>
        </motion.h1>

        <motion.p
          style={{ y: subY }}
          initial={{ opacity: 0, y: 26 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.35, ease: EASE }}
          className="mt-7 max-w-xl font-sans text-sm font-medium leading-relaxed text-ink/65 sm:text-base"
        >
          Five centuries of masterworks — Renaissance, Baroque, Impressionism,
          Art Nouveau and marble — gathered under one glass roof and reimagined
          for the modern eye.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.55, ease: EASE }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <button
            onClick={() => scrollToSection("#collection")}
            data-cursor="Enter"
            className="group relative overflow-hidden rounded-full bg-ink px-9 py-4 font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-parchment"
          >
            <span className="absolute inset-0 translate-y-full bg-terra transition-transform duration-500 ease-out group-hover:translate-y-0" />
            <span className="relative">Enter the Collection</span>
          </button>
          <button
            onClick={() => scrollToSection("#eras")}
            data-cursor="Scroll"
            className="group flex items-center gap-2 font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-ink/70 transition-colors hover:text-ink"
          >
            <span className="underline decoration-terra/60 decoration-2 underline-offset-8">
              Journey the Eras
            </span>
            <ArrowDown className="h-4 w-4 transition-transform duration-500 group-hover:translate-y-1" />
          </button>
        </motion.div>

        {/* mobile-only miniature collage — the hero keeps its salon feel on phones */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotate: 0 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 1.8, ease: EASE }}
          className="hero-mobile-art mt-9 items-center justify-center"
          aria-hidden="true"
        >
          <figure className="z-[5] w-24 -rotate-3 border-[6px] border-[#2a2118] bg-[#2a2118] shadow-[0_18px_40px_-14px_rgba(19,16,9,0.5)]">
            <img
              src={a2.src}
              alt=""
              style={{ aspectRatio: String(a2.ratio) }}
              className="h-28 w-full object-cover vintage-sepia"
            />
          </figure>
          <figure className="-ml-4 w-28 rotate-2 border-[6px] border-[#3a2f1d] bg-[#3a2f1d] shadow-[0_18px_40px_-14px_rgba(19,16,9,0.55)]">
            <img
              src={a1.src}
              alt=""
              style={{ aspectRatio: String(a1.ratio) }}
              className="h-32 w-full object-cover vintage-sepia"
            />
          </figure>
          <figure className="z-[5] -ml-4 w-24 rotate-3 border-[6px] border-[#23201a] bg-[#23201a] shadow-[0_18px_40px_-14px_rgba(19,16,9,0.5)]">
            <img
              src={a3.src}
              alt=""
              style={{ aspectRatio: String(a3.ratio) }}
              className="h-28 w-full object-cover vintage-sepia"
            />
          </figure>
        </motion.div>
      </motion.div>

      {/* ---------------- rotating badge + scroll cue ---------------- */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={ready ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1, delay: 1.7, ease: EASE }}
        className="absolute bottom-8 left-6 z-10 hidden sm:left-10 md:block"
      >
        <div className="relative h-28 w-28">
          <svg
            viewBox="0 0 100 100"
            className="h-full w-full animate-spin-slow"
            aria-hidden="true"
          >
            <defs>
              <path
                id="badge-circle"
                d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
              />
            </defs>
            <text className="fill-ink/70 font-sans text-[8.2px] font-bold uppercase tracking-[0.24em]">
              <textPath href="#badge-circle">
                Musée Vivant · Five Centuries · L&rsquo;Atelier ·
              </textPath>
            </text>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-xl italic text-terra">A</span>
          </div>
        </div>
      </motion.div>

      <motion.button
        onClick={() => scrollToSection("#manifesto")}
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1.9 }}
        style={{ opacity: fade }}
        className="absolute bottom-8 right-6 z-10 flex items-center gap-3 sm:right-10"
        aria-label="Scroll to continue"
        data-cursor="Scroll"
      >
        <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-ink/50">
          Scroll
        </span>
        <span className="relative flex h-10 w-6 items-start justify-center overflow-hidden rounded-full border border-ink/30 pt-2">
          <motion.span
            className="h-2 w-1 rounded-full bg-terra"
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.button>

      {/* bottom hairline */}
      <div className="absolute inset-x-0 bottom-0 z-10 h-px bg-ink/10" />
    </section>
  );
}
