"use client";

import { useRef, useState } from "react";
import { useGSAP, gsap, ScrollTrigger } from "@/lib/animation";
import LetterSwapForward from "@/components/fancy/text/letter-swap-forward-anim";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const peekRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const indexRef = useRef<HTMLSpanElement>(null);
  const [letterSwapTriggered, setLetterSwapTriggered] = useState(false);
  const letterSwapTriggeredRef = useRef(false);

  useGSAP(
    () => {
      if (!sectionRef.current || !frameRef.current) return;

      // The expansion happens as the section scrolls into view
      // from 10% visible ("top 90%") until it reaches the top of the viewport ("top top")
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 90%", 
          end: "top top",   
          scrub: 1, // smooth scrubbing
          onEnter: () => {
            if (!letterSwapTriggeredRef.current) {
              letterSwapTriggeredRef.current = true;
              setLetterSwapTriggered(true);
            }
          },
        },
      });

      tl.to(
        frameRef.current,
        {
          marginTop: "0vh",
          marginLeft: "0vw",
          marginRight: "0vw",
          marginBottom: "0vh",
          borderRadius: 0,
          ease: "power2.inOut",
        },
        0
      )
        .to(peekRef.current, { height: 0, ease: "power2.inOut" }, 0)
        .fromTo(
          [eyebrowRef.current, indexRef.current],
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.2 },
          0
        );

      // Once it fully expands and the section hits the top of the screen,
      // pin the section for a bit so the user can read it before the next section comes in.
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=1000",
        pin: true,
        pinSpacing: true,
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
      style={{ zIndex: 10, backgroundColor: 'hsl(var(--blood))' }}
    >
      {/* previous section bleed strip (the red top part) */}
      <div
        ref={peekRef}
        className="absolute top-0 left-0 w-full h-[15vh] z-0"
        style={{ backgroundColor: 'hsl(var(--blood))' }}
      />

      {/* inset media frame — starts with margin, animates to 0 */}
      <div
        ref={frameRef}
        className="absolute inset-0 mt-[15vh] mx-[10vw] mb-[10vh] rounded-xl overflow-hidden bg-ink"
      >
        <span
          ref={eyebrowRef}
          className="absolute top-6 left-1/2 -translate-x-1/2 text-blood text-sm tracking-[0.4em] font-bold uppercase opacity-0"
        >
          About Me
        </span>

        <span
          ref={indexRef}
          className="absolute bottom-8 left-8 text-cream text-sm opacity-0 font-elegist"
        >
          01
        </span>

        {/* letter-swap target */}
        <div className="absolute inset-0 flex items-center justify-center">
          <LetterSwapForward
            label="who am i ?"
            reverse={false}
            transition={{ type: "spring", duration: 0.7 }}
            staggerDuration={0.04}
            staggerFrom="first"
            className="font-body text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold uppercase tracking-[0.2em] text-cream"
            trigger={letterSwapTriggered}
          />
        </div>
      </div>
    </section>
  );
}
