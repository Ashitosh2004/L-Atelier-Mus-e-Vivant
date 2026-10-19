"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { MASTERS } from "@/lib/artworks";
import { EASE, MaskedLine, Reveal, SectionHeading } from "./reveal";

export function Masters() {
  const [active, setActive] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 160, damping: 22, mass: 0.5 });
  const py = useSpring(my, { stiffness: 160, damping: 22, mass: 0.5 });

  const onMove = (e: React.MouseEvent) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  return (
    <section
      id="masters"
      className="relative overflow-hidden bg-ink py-28 sm:py-36"
      aria-label="The masters"
    >
      {/* watermark */}
      <span
        aria-hidden="true"
        className="text-outline pointer-events-none absolute -left-6 bottom-0 select-none font-display text-[22vw] font-bold italic leading-none text-parchment/50 opacity-[0.05]"
      >
        Maîtres
      </span>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            dark
            kicker="The Masters"
            title={
              <>
                <MaskedLine index={0}>Names that outlived</MaskedLine>
                <MaskedLine index={1}>
                  <em className="font-accent font-light italic text-gold-soft">
                    their centuries
                  </em>
                </MaskedLine>
              </>
            }
          />
          <Reveal y={24} delay={0.15} className="max-w-sm">
            <p className="font-sans text-sm leading-relaxed text-parchment/55">
              <span className="md:hidden">Tap a name</span>
              <span className="hidden md:inline">Hover a name</span> — every
              master keeps a portrait in our vault. Six lives, six hands that
              changed how the world sees itself.
            </p>
          </Reveal>
        </div>

        {/* interactive list */}
        <div
          ref={containerRef}
          onMouseMove={onMove}
          className="relative mt-16"
          onMouseLeave={() => setActive(null)}
        >
          {/* floating portrait (desktop) */}
          <AnimatePresence>
            {active !== null && (
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
                animate={{ opacity: 1, scale: 1, rotate: 3 }}
                exit={{ opacity: 0, scale: 0.85, rotate: 8 }}
                transition={{ duration: 0.45, ease: EASE }}
                style={{ x: px, y: py }}
                className="pointer-events-none absolute z-20 hidden lg:block"
              >
                <div className="-translate-x-1/2 -translate-y-[110%]">
                  <div className="h-[300px] w-[230px] border-[8px] border-[#2e2818] bg-[#2e2818] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)]">
                    <img
                      src={MASTERS[active].img}
                      alt={MASTERS[active].name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <ul className="border-t border-parchment/12">
            {MASTERS.map((m, i) => (
              <motion.li
                key={m.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.8, delay: i * 0.06, ease: EASE }}
                className="group border-b border-parchment/12"
              >
                <button
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  className="relative flex w-full items-center justify-between gap-4 py-6 text-left sm:py-8"
                  aria-label={`${m.name}, ${m.role}`}
                >
                  {/* hover wash */}
                  <span className="absolute inset-0 origin-bottom scale-y-0 bg-parchment/[0.045] transition-transform duration-500 ease-out group-hover:scale-y-100" />

                  <span className="relative flex min-w-0 items-baseline gap-4 sm:gap-8">
                    <span className="font-sans text-[10px] font-bold tracking-[0.3em] text-terra sm:w-10">
                      0{i + 1}
                    </span>
                    <span className="truncate font-display text-2xl font-medium tracking-tight text-parchment transition-all duration-500 group-hover:translate-x-2 group-hover:text-gold-soft sm:text-4xl lg:text-[2.75rem]">
                      {m.name}
                    </span>
                  </span>

                  <span className="relative flex shrink-0 items-center gap-4 sm:gap-8">
                    <span className="hidden font-accent text-lg italic text-parchment/45 md:block">
                      {m.role}
                    </span>
                    <span className="hidden font-sans text-[10px] uppercase tracking-[0.25em] text-parchment/35 sm:block">
                      {m.dates}
                    </span>
                    {/* inline thumb (mobile) */}
                    <span className="block h-12 w-12 overflow-hidden rounded-sm border border-parchment/15 lg:hidden">
                      <img
                        src={m.img}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-parchment/30 transition-all duration-500 group-hover:rotate-45 group-hover:text-terra" />
                  </span>
                </button>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
