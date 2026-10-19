"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "./reveal";

const PHRASES = [
  "Curating the archive",
  "Stretching the canvases",
  "Mixing the varnish",
  "Lighting the salon",
  "Opening the doors",
];

export function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // lock scroll while preloading
    if (window.__lenis) window.__lenis.stop();
    document.body.style.overflow = "hidden";

    const start = performance.now();
    const DURATION = 2100;
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      // ease-out for a natural counting feel
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setExiting(true);
        setTimeout(() => {
          document.body.style.overflow = "";
          if (window.__lenis) window.__lenis.start();
          onDone();
        }, 950);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, [onDone]);

  const phraseIndex = Math.min(
    PHRASES.length - 1,
    Math.floor((count / 100) * PHRASES.length)
  );

  return (
    <motion.div
      className="fixed inset-0 z-[95] flex flex-col items-center justify-center bg-ink"
      aria-hidden="true"
      animate={exiting ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      {/* top row */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-6 py-5 sm:px-10">
        <span className="font-display text-lg font-semibold tracking-wide text-parchment">
          L&rsquo;Atelier
        </span>
        <span className="font-sans text-[10px] font-bold uppercase tracking-[0.35em] text-gold-soft">
          Musée Vivant
        </span>
      </div>

      {/* center */}
      <div className="relative flex flex-col items-center">
        <motion.span
          key={phraseIndex}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-4 font-accent text-lg italic text-parchment/70 sm:text-xl"
        >
          {PHRASES[phraseIndex]}…
        </motion.span>

        <div className="flex items-baseline overflow-hidden">
          <motion.span
            className="font-display text-[22vw] font-bold leading-none tracking-tight text-parchment sm:text-[13rem]"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            {count}
          </motion.span>
          <span className="ml-2 font-display text-3xl italic text-terra sm:text-5xl">
            %
          </span>
        </div>

        <div className="mt-8 h-px w-56 overflow-hidden bg-parchment/15 sm:w-72">
          <motion.div
            className="h-full bg-terra"
            style={{ width: `${count}%` }}
            transition={{ ease: "linear" }}
          />
        </div>
      </div>

      {/* bottom row */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-6 py-5 sm:px-10">
        <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-parchment/40">
          Est. MDCCCXCIII
        </span>
        <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-parchment/40">
          Five centuries of light
        </span>
      </div>
    </motion.div>
  );
}

/* Exits mounted state cleanly */
export function PreloaderGate({
  children,
}: {
  children: (ready: boolean) => React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const [show, setShow] = useState(true);

  return (
    <>
      <AnimatePresence>
        {show && (
          <Preloader
            onDone={() => {
              setReady(true);
              setShow(false);
            }}
          />
        )}
      </AnimatePresence>
      {children(ready)}
    </>
  );
}
