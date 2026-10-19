"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const WORDS = [
  "Renaissance",
  "Baroque",
  "Impressionism",
  "Art Nouveau",
  "Sculpture",
  "Chiaroscuro",
];

function Row({ reverse = false }: { reverse?: boolean }) {
  const list = [...WORDS, ...WORDS, ...WORDS];
  return (
    <div className="flex overflow-hidden" aria-hidden="true">
      <div
        className={`flex shrink-0 items-center gap-10 pr-10 ${
          reverse ? "animate-marquee-slow [animation-direction:reverse]" : "animate-marquee"
        }`}
      >
        {list.map((w, i) => (
          <span key={i} className="flex items-center gap-10">
            <span
              className={`whitespace-nowrap font-display text-5xl font-medium tracking-tight sm:text-6xl ${
                i % 2 === 0 ? "text-parchment" : "font-accent font-light italic text-parchment/60"
              }`}
            >
              {w}
            </span>
            <span className="text-2xl text-gold-soft">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Marquee() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [-2, 2]);

  return (
    <section
      ref={ref}
      aria-label="Art movements"
      className="relative z-20 -my-6 overflow-hidden py-6"
    >
      <motion.div
        style={{ rotate }}
        className="w-[104%] -translate-x-[2%] border-y border-ink/20 bg-terra py-5 shadow-[0_20px_60px_-25px_rgba(19,16,9,0.55)] sm:py-6"
      >
        <Row />
        <div className="h-4" />
        <Row reverse />
      </motion.div>
    </section>
  );
}
