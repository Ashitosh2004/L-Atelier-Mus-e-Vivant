"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { scrollToSection } from "./smooth-scroll";
import { EASE } from "./reveal";
import { useBookingStore } from "./booking-store";

const LINKS = [
  { label: "Collection", href: "#collection" },
  { label: "The Eras", href: "#eras" },
  { label: "Chronicle", href: "#chronicle" },
  { label: "Masters", href: "#masters" },
  { label: "Visit", href: "#visit" },
];

export function Navbar({ ready }: { ready: boolean }) {
  const [open, setOpen] = useState(false);
  const openBooking = useBookingStore((s) => s.openBooking);

  const go = (href: string) => {
    setOpen(false);
    // wait for menu exit before scrolling
    setTimeout(() => scrollToSection(href), open ? 350 : 0);
  };

  const book = () => {
    setOpen(false);
    openBooking();
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
        className="fixed inset-x-0 top-0 z-[80] mix-blend-difference"
      >
        <nav className="flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
          <button
            onClick={() => go("#top")}
            className="group flex items-baseline gap-2"
            aria-label="L'Atelier — back to top"
          >
            <span className="font-display text-xl font-semibold tracking-wide text-parchment sm:text-2xl">
              L&rsquo;Atelier
            </span>
            <span className="hidden font-sans text-[9px] font-bold uppercase tracking-[0.3em] text-parchment/60 sm:inline">
              Musée Vivant
            </span>
          </button>

          <ul className="hidden items-center gap-8 lg:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <button
                  onClick={() => go(l.href)}
                  data-cursor="Go"
                  className="group relative font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-parchment/80 transition-colors hover:text-parchment"
                >
                  {l.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-parchment transition-all duration-500 group-hover:w-full" />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-5">
            <button
              onClick={book}
              data-cursor="Book"
              className="hidden rounded-full border border-parchment/40 px-5 py-2 font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-parchment transition-all duration-500 hover:bg-parchment hover:text-black sm:block"
            >
              Book a Visit
            </button>
            <button
              onClick={() => setOpen(true)}
              className="flex h-10 w-10 items-center justify-center text-parchment lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* full-screen overlay menu (mobile / tablet) */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[85] flex flex-col bg-ink"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
              <span className="font-display text-xl font-semibold text-parchment">
                L&rsquo;Atelier
              </span>
              <button
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center text-parchment"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center px-8">
              {LINKS.map((l, i) => (
                <div key={l.href} className="overflow-hidden py-1">
                  <motion.button
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "110%" }}
                    transition={{ duration: 0.6, delay: 0.08 * i, ease: EASE }}
                    onClick={() => go(l.href)}
                    className="flex items-baseline gap-4 py-2 text-left"
                  >
                    <span className="font-sans text-[10px] font-bold tracking-[0.3em] text-terra">
                      0{i + 1}
                    </span>
                    <span className="font-display text-4xl font-medium text-parchment sm:text-5xl">
                      {l.label}
                    </span>
                  </motion.button>
                </div>
              ))}
            </nav>

            <div className="flex flex-col items-center gap-5 px-8 pb-10">
              <button
                onClick={book}
                className="h-13 w-full rounded-full bg-terra py-4 font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-parchment transition-colors duration-300 hover:bg-terra-deep"
              >
                Book a Visit
              </button>
              <div className="flex w-full items-center justify-between">
                <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-parchment/40">
                  Est. MDCCCXCIII
                </span>
                <span className="font-accent text-lg italic text-gold-soft">
                  Art for those who linger
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
