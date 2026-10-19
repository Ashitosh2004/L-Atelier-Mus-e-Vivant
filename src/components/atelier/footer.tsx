"use client";

import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { EASE, Reveal } from "./reveal";
import { scrollToSection } from "./smooth-scroll";

const NAV = [
  { label: "Collection", href: "#collection" },
  { label: "The Eras", href: "#eras" },
  { label: "Chronicle", href: "#chronicle" },
  { label: "Masters", href: "#masters" },
  { label: "Visit", href: "#visit" },
];

const MUSEUM = [
  "Membership",
  "Conservation",
  "Publications",
  "Education",
  "Press Room",
];

const SOCIAL = ["Instagram", "Are.na", "YouTube", "Newsletter"];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink pt-24 text-parchment">
      {/* top hairline ornament */}
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-5 sm:px-8">
        <span className="h-px flex-1 bg-parchment/15" aria-hidden="true" />
        <span className="font-accent text-xl italic text-gold-soft">
          ✦
        </span>
        <span className="h-px flex-1 bg-parchment/15" aria-hidden="true" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* quote */}
        <Reveal y={30} className="mt-16 max-w-3xl">
          <p className="font-display text-2xl font-medium leading-snug tracking-tight sm:text-4xl">
            &ldquo;The aim of art is not to represent the outward appearance of
            things,{" "}
            <em className="font-accent font-light italic text-terra sm:text-gold-soft">
              but their inward significance.
            </em>
            &rdquo;
          </p>
          <p className="mt-5 font-sans text-[10px] uppercase tracking-[0.3em] text-parchment/40">
            — Aristotle, engraved above Hall I
          </p>
        </Reveal>

        {/* link columns */}
        <div className="mt-20 grid grid-cols-2 gap-10 border-t border-parchment/12 pt-12 sm:grid-cols-4">
          <div>
            <h3 className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-terra">
              Explore
            </h3>
            <ul className="mt-5 space-y-3">
              {NAV.map((l) => (
                <li key={l.href}>
                  <button
                    onClick={() => scrollToSection(l.href)}
                    className="group font-sans text-sm text-parchment/60 transition-colors hover:text-parchment"
                  >
                    <span className="mr-0 inline-block transition-all duration-300 group-hover:mr-2 group-hover:text-gold-soft">
                      —
                    </span>
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-terra">
              The Museum
            </h3>
            <ul className="mt-5 space-y-3">
              {MUSEUM.map((l) => (
                <li
                  key={l}
                  className="font-sans text-sm text-parchment/60 transition-colors hover:text-parchment"
                >
                  {l}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-terra">
              Elsewhere
            </h3>
            <ul className="mt-5 space-y-3">
              {SOCIAL.map((l) => (
                <li
                  key={l}
                  className="font-sans text-sm text-parchment/60 transition-colors hover:text-parchment"
                >
                  {l}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-terra">
              Correspondence
            </h3>
            <p className="mt-5 font-sans text-sm leading-relaxed text-parchment/60">
              12 Quai des Lumières
              <br />
              75006 Paris
            </p>
            <p className="mt-3 font-accent text-lg italic text-gold-soft">
              bonjour@atelier.musée
            </p>
          </div>
        </div>
      </div>

      {/* giant wordmark */}
      <div className="relative mt-20 select-none overflow-hidden" aria-hidden="true">
        <motion.h2
          initial={{ y: "35%", opacity: 0 }}
          whileInView={{ y: "12%", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.3, ease: EASE }}
          className="whitespace-nowrap text-center font-display text-[16.5vw] font-bold leading-none tracking-tight text-parchment/[0.07]"
        >
          L&rsquo;ATELIER
        </motion.h2>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink to-transparent"
          aria-hidden="true"
        />
      </div>

      {/* bottom bar */}
      <div className="relative border-t border-parchment/12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 sm:flex-row sm:px-8">
          <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-parchment/40">
            © MMXXV L&rsquo;Atelier — Musée Vivant
          </p>
          <p className="font-accent text-base italic text-parchment/45">
            Art for those who linger
          </p>
          <button
            onClick={() => scrollToSection("#top")}
            data-cursor="Top"
            className="group flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-parchment/60 transition-colors hover:text-parchment"
            aria-label="Back to top"
          >
            Back to top
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-parchment/25 transition-all duration-500 group-hover:border-terra group-hover:bg-terra">
              <ArrowUp className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-y-0.5" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
