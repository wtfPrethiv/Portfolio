'use client';

import Lenis from 'lenis';
import { useEffect, useState } from 'react';
import { LenisContext } from '@/hooks/use-lenis';
import { initAnimations, gsap, ScrollTrigger } from '@/lib/animation';

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    initAnimations();

    const lenisInstance = new Lenis({
      duration: 2.4,
      easing: (t: number) => {
        // Spring-like ease: overshoots ~2% then settles — gives a tactile bounce
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
      },
      smoothWheel: true,
      touchMultiplier: 1.5,
      infinite: false,
    });

    setLenis(lenisInstance);

    // Keep ScrollTrigger's measurements in lockstep with Lenis' virtual scroll.
    lenisInstance.on('scroll', ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker so both share a single rAF loop.
    const tick = (time: number) => {
      lenisInstance.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenisInstance.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
}
