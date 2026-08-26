'use client';

import React, { useState, useRef } from 'react';
import HeroSection from '@/components/hero-section';
import CustomCursor from '@/components/custom-cursor';
import AboutSection from '@/components/about-section';
import Header from '@/components/header';
import Preloader from '@/components/preloader';
import { useIdle } from '@/hooks/use-idle';
import { useGSAP } from '@/lib/animation';
import { sectionTransition01 } from '@/lib/section-transitions';

export default function Home() {
  const isIdle = useIdle(3000);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPreloaderCompleted, setIsPreloaderCompleted] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const homeRef = useRef<HTMLDivElement>(null);

  const sectionRefs = {
    HOME: homeRef,
  };

  // Initialise the section transition system once DOM is ready
  useGSAP(
    () => {
      if (!mainRef.current) return;

      const triggers = sectionTransition01(mainRef.current);

      return () => {
        triggers.forEach((t) => t.kill());
      };
    },
    { scope: mainRef }
  );

  return (
    <main ref={mainRef} className="relative">
      {!isPreloaderCompleted && (
        <Preloader onComplete={() => setIsPreloaderCompleted(true)} />
      )}
      <CustomCursor isIdle={isIdle} />
      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        activeSection="HOME"
        sectionRefs={sectionRefs}
        isPreloaderCompleted={isPreloaderCompleted}
      />

      {/*
       * ── HERO ──
       * data-st-01="parallax": hero drifts down (sinks) as the about
       * section scrolls up over it, with a 50 % black overlay fading in.
       */}
      <div
        ref={homeRef}
        data-st-01="parallax"
        data-st-y="300"
        data-st-opacity="0.5"
        data-st-overlay="black"
        className="relative w-full"
        style={{ zIndex: 1 }}
      >
        <HeroSection isPreloaderCompleted={isPreloaderCompleted} />
      </div>

      {/*
       * ── ABOUT ──
       * The next sibling — scrolls naturally over the parallax hero.
       * Its own internal ScrollTrigger handles the pin + black-box animation.
       */}
      <div className="relative w-full" style={{ zIndex: 2 }}>
        <AboutSection />
      </div>
    </main>
  );
}
