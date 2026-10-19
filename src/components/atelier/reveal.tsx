"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ---------------- Fade-up on scroll into view ---------------- */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 48,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.1, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- Masked line reveal (editorial) ---------------- */
const lineVariants: Variants = {
  hidden: { y: "110%", rotate: 3 },
  show: (i: number) => ({
    y: "0%",
    rotate: 0,
    transition: { duration: 1.15, delay: 0.12 * i, ease: EASE },
  }),
};

export function MaskedLine({
  children,
  index = 0,
  className,
}: {
  children: ReactNode;
  index?: number;
  className?: string;
}) {
  return (
    <span className={`block overflow-hidden pb-[0.08em] ${className ?? ""}`}>
      <motion.span
        className="block will-change-transform"
        variants={lineVariants}
        custom={index}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-8% 0px" }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* ---------------- Section heading block ---------------- */
export function SectionHeading({
  kicker,
  title,
  dark = false,
  align = "left",
}: {
  kicker: string;
  title: ReactNode;
  dark?: boolean;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <Reveal y={24}>
        <div
          className={`flex items-center gap-3 ${
            align === "center" ? "justify-center" : ""
          }`}
        >
          <span
            className={`h-px w-10 ${dark ? "bg-gold/60" : "bg-terra/70"}`}
            aria-hidden="true"
          />
          <span
            className={`font-sans text-[11px] font-bold uppercase tracking-[0.35em] ${
              dark ? "text-gold-soft" : "text-terra"
            }`}
          >
            {kicker}
          </span>
        </div>
      </Reveal>
      <h2
        className={`mt-5 font-display text-4xl leading-[1.06] font-medium tracking-tight sm:text-5xl lg:text-6xl ${
          dark ? "text-parchment" : "text-ink"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}

/* ---------------- Italic flourish word ---------------- */
export function Italic({ children }: { children: ReactNode }) {
  return (
    <em className="font-accent font-light italic text-terra dark:text-gold-soft">
      {children}
    </em>
  );
}
