"use client";

import { SmoothScroll } from "@/components/atelier/smooth-scroll";
import { Grain } from "@/components/atelier/grain";
import { Cursor } from "@/components/atelier/cursor";
import { PreloaderGate } from "@/components/atelier/preloader";
import { Navbar } from "@/components/atelier/navbar";
import { Hero } from "@/components/atelier/hero";
import { Marquee } from "@/components/atelier/marquee";
import { Manifesto } from "@/components/atelier/manifesto";
import { Gallery } from "@/components/atelier/gallery";
import { Eras } from "@/components/atelier/eras";
import { Chronicle } from "@/components/atelier/chronicle";
import { Masters } from "@/components/atelier/masters";
import { Visit } from "@/components/atelier/visit";
import { Footer } from "@/components/atelier/footer";
import { BookingModal } from "@/components/atelier/booking/modal";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Grain />
      <Cursor />

      <PreloaderGate>
        {(isReady) => (
          <>
            <main className="relative flex min-h-screen flex-col">
              <Navbar ready={isReady} />
              <Hero ready={isReady} />
              <Marquee />
              <Manifesto />
              <Gallery />
              <Eras />
              <Chronicle />
              <Masters />
              <Visit />
              <Footer />
            </main>
            <BookingModal />
          </>
        )}
      </PreloaderGate>
    </>
  );
}
