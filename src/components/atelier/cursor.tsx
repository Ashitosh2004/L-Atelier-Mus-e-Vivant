"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Custom atelier cursor — a small ring that trails the pointer and
 * blooms over interactive elements marked with [data-cursor].
 * Hidden on touch devices.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    // defer the state flip out of the synchronous effect body
    const raf = requestAnimationFrame(() => setEnabled(true));
    document.documentElement.classList.add("cursor-none-desktop");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = (e.target as HTMLElement)?.closest(
        "[data-cursor], a, button"
      ) as HTMLElement | null;
      if (target) {
        setHovering(true);
        setLabel(target.getAttribute("data-cursor"));
      } else {
        setHovering(false);
        setLabel(null);
      }
    };

    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      document.documentElement.classList.remove("cursor-none-desktop");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* dot */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[120] h-1.5 w-1.5 rounded-full bg-parchment mix-blend-difference"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      />
      {/* trailing ring / label bubble */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[120] flex items-center justify-center rounded-full border border-parchment/80 mix-blend-difference"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: label ? 84 : hovering ? 56 : 32,
          height: label ? 84 : hovering ? 56 : 32,
          opacity: 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        {label && (
          <span className="select-none text-center font-sans text-[9px] font-semibold uppercase tracking-[0.2em] text-parchment">
            {label}
          </span>
        )}
      </motion.div>
    </>
  );
}
