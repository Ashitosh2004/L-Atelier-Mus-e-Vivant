"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CHRONICLE } from "@/lib/artworks";
import { EASE, MaskedLine, Reveal, SectionHeading } from "./reveal";

function Entry({
  item,
  index,
}: {
  item: (typeof CHRONICLE)[number];
  index: number;
}) {
  const left = index % 2 === 0;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.35"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [50, 0]);
  const imgOpacity = useTransform(scrollYProgress, [0, 1], [0.4, 1]);

  return (
    <div
      ref={ref}
      className={`relative flex flex-col gap-6 md:mb-24 md:flex-row md:items-center ${
        left ? "" : "md:flex-row-reverse"
      }`}
    >
      {/* node */}
      <div
        aria-hidden="true"
        className="absolute left-[-7px] top-2 z-10 flex h-4 w-4 items-center justify-center md:left-1/2 md:-translate-x-1/2"
      >
        <motion.span
          className="block h-3 w-3 rounded-full border-2 border-terra bg-parchment"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
        />
      </div>

      {/* text card */}
      <motion.div
        className={`w-full md:w-[44%] ${
          left ? "md:pr-4 md:text-right" : "md:pl-4"
        }`}
        initial={{ opacity: 0, y: 40, x: left ? -24 : 24 }}
        whileInView={{ opacity: 1, y: 0, x: 0 }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{ duration: 1, ease: EASE }}
      >
        <span className="font-display text-5xl font-bold italic leading-none text-terra/90 sm:text-6xl">
          {item.year}
        </span>
        <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink">
          {item.title}
        </h3>
        <p className="mt-3 font-sans text-sm leading-relaxed text-ink/60">
          {item.text}
        </p>
      </motion.div>

      {/* image card */}
      <motion.figure
        style={{ y: imgY, opacity: imgOpacity }}
        className={`w-full md:w-[44%] ${left ? "md:pl-4" : "md:pr-4"}`}
      >
        <div className="group relative overflow-hidden border-[6px] border-white shadow-[0_20px_50px_-18px_rgba(19,16,9,0.35)]">
          <img
            src={item.img}
            alt={`${item.title} — ${item.year}`}
            className="h-56 w-full object-cover vintage-sepia transition-transform duration-[1.2s] group-hover:scale-105 sm:h-64"
            loading="lazy"
          />
        </div>
        <figcaption
          className={`mt-2 font-sans text-[10px] uppercase tracking-[0.25em] text-ink/40 ${
            left ? "md:text-right" : ""
          }`}
        >
          Plate {["I", "II", "III", "IV", "V"][index]} — Museum Archive
        </figcaption>
      </motion.figure>
    </div>
  );
}

export function Chronicle() {
  const lineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ["start 0.8", "end 0.6"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="chronicle"
      className="relative overflow-hidden bg-parchment py-28 text-ink sm:py-36"
      aria-label="Museum chronicle"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          align="center"
          kicker="The Chronicle"
          title={
            <>
              <MaskedLine index={0}>A house built on</MaskedLine>
              <MaskedLine index={1}>
                <em className="font-accent font-light italic text-terra">
                  quiet obsession
                </em>
              </MaskedLine>
            </>
          }
        />
        <Reveal y={24} delay={0.15} className="mx-auto mt-6 max-w-xl text-center">
          <p className="font-sans text-sm leading-relaxed text-ink/60">
            From nineteen paintings in a converted printworks to twelve thousand
            works across five centuries — the story of L&rsquo;Atelier, told in
            five turning points.
          </p>
        </Reveal>

        {/* timeline */}
        <div ref={lineRef} className="relative mt-20">
          {/* rail */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-[7px] w-px bg-ink/10 md:left-1/2"
          />
          <motion.div
            aria-hidden="true"
            style={{ scaleY: lineScale }}
            className="absolute inset-y-0 left-[7px] w-px origin-top bg-terra md:left-1/2"
          />

          <div className="flex flex-col gap-16 md:gap-0">
            {CHRONICLE.map((item, i) => (
              <Entry key={item.year} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
