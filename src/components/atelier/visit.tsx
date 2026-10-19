"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Clock, MapPin, Ticket } from "lucide-react";
import { MUSEUM_IMAGES } from "@/lib/artworks";
import { MaskedLine, Reveal } from "./reveal";
import { useBookingStore } from "./booking-store";

const INFO = [
  {
    icon: Clock,
    title: "Hours",
    lines: ["Tue — Sun · 9:00 — 18:00", "Nocturne Thursdays until 22:00"],
  },
  {
    icon: MapPin,
    title: "Where",
    lines: ["12 Quai des Lumières", "75006 Paris, Left Bank"],
  },
  {
    icon: Ticket,
    title: "Admission",
    lines: ["General · €14", "Under 26 · Always free"],
  },
];

export function Visit() {
  const openBooking = useBookingStore((s) => s.openBooking);
  const openManage = useBookingStore((s) => s.openManage);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [140, -60]);
  const y3 = useTransform(scrollYProgress, [0, 1], [40, -110]);

  return (
    <section
      id="visit"
      ref={ref}
      className="relative overflow-hidden bg-terra py-28 text-parchment sm:py-36"
      aria-label="Plan your visit"
    >
      {/* texture wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(100% 80% at 50% -10%, rgba(255,255,255,0.14), transparent 55%), radial-gradient(80% 60% at 50% 110%, rgba(19,16,9,0.35), transparent 60%)",
        }}
      />

      {/* floating photo cluster (right, desktop) */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[38%] lg:block">
        <motion.figure
          style={{ y: y1 }}
          className="absolute right-[8%] top-[8%] w-64 rotate-3 border-[7px] border-[#2a2118] bg-[#2a2118] shadow-[0_40px_80px_-20px_rgba(19,16,9,0.55)]"
        >
          <img
            src={MUSEUM_IMAGES.grandHall}
            alt="The Grand Salon"
            className="h-44 w-full object-cover"
            loading="lazy"
          />
        </motion.figure>
        <motion.figure
          style={{ y: y2 }}
          className="absolute right-[38%] top-[38%] w-56 -rotate-2 border-[7px] border-[#2a2118] bg-[#2a2118] shadow-[0_40px_80px_-20px_rgba(19,16,9,0.55)]"
        >
          <img
            src={MUSEUM_IMAGES.salon}
            alt="The picture gallery"
            className="h-52 w-full object-cover"
            loading="lazy"
          />
        </motion.figure>
        <motion.figure
          style={{ y: y3 }}
          className="absolute right-[12%] top-[62%] w-64 rotate-1 border-[7px] border-[#2a2118] bg-[#2a2118] shadow-[0_40px_80px_-20px_rgba(19,16,9,0.55)]"
        >
          <img
            src={MUSEUM_IMAGES.archive}
            alt="The print archive"
            className="h-40 w-full object-cover"
            loading="lazy"
          />
        </motion.figure>
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal y={24}>
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-parchment/60" aria-hidden="true" />
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.35em] text-parchment/85">
              Plan Your Visit
            </span>
          </div>
        </Reveal>

        <h2 className="mt-6 max-w-3xl font-display text-5xl font-medium leading-[1.02] tracking-tight sm:text-7xl">
          <MaskedLine index={0}>Come stand where</MaskedLine>
          <MaskedLine index={1}>
            <em className="font-accent font-light italic text-parchment/85">
              time slows down
            </em>
          </MaskedLine>
        </h2>

        <Reveal y={26} delay={0.15} className="mt-8 max-w-xl">
          <p className="font-sans text-sm leading-relaxed text-parchment/85 sm:text-base">
            The doors open at nine. By ten the Grand Salon fills with that
            particular honeyed light painters have chased for five centuries.
            Come early, walk slowly, and let the rooms do what they were built
            to do — linger in your memory long after you leave.
          </p>
        </Reveal>

        {/* info cards */}
        <div className="mt-14 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          {INFO.map((card, i) => (
            <Reveal key={card.title} y={30} delay={0.1 + i * 0.1}>
              <div className="group h-full border border-parchment/25 bg-terra-deep/60 p-6 backdrop-blur-sm transition-all duration-500 hover:border-parchment/60 hover:bg-terra-deep">
                <card.icon
                  className="h-5 w-5 text-parchment/80 transition-transform duration-500 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
                <h3 className="mt-4 font-sans text-[11px] font-bold uppercase tracking-[0.3em] text-parchment/70">
                  {card.title}
                </h3>
                <div className="mt-3 space-y-1">
                  {card.lines.map((l) => (
                    <p key={l} className="font-display text-lg leading-snug">
                      {l}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <Reveal y={26} delay={0.25} className="mt-14">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <button
              onClick={openBooking}
              data-cursor="Book"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-parchment/50 px-10 py-5 font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-parchment"
            >
              <span className="absolute inset-0 translate-y-full bg-parchment transition-transform duration-500 ease-out group-hover:translate-y-0" />
              <span className="relative transition-colors duration-500 group-hover:text-terra">
                Book Your Visit
              </span>
              <ArrowUpRight className="relative h-4 w-4 transition-all duration-500 group-hover:rotate-45 group-hover:text-terra" />
            </button>
            <button
              onClick={openManage}
              className="group font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-parchment/70 transition-colors hover:text-parchment"
            >
              <span className="underline decoration-parchment/40 underline-offset-8 transition-colors group-hover:decoration-parchment">
                Find an existing booking
              </span>
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
