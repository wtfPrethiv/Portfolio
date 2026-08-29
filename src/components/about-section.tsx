"use client";

import { useRef, useState } from "react";
import { useGSAP, gsap, EASE } from "@/lib/animation";
import LetterSwapForward from "@/components/fancy/text/letter-swap-forward-anim";

/**
 * The whole sequence plays out across the section's arrival — the single
 * viewport of scroll where its top travels from the bottom of the screen to the
 * top, which is the exact range the hero parallax runs over. Nothing pins or
 * sticks, so the box must be done growing before the section lands.
 *
 * Position where the box has swallowed the whole viewport — no red left.
 */
const FULL = 0.76;

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const topTitleRef = useRef<HTMLDivElement>(null);
  const midIndexRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const aboutTitleContainerRef = useRef<HTMLDivElement>(null);
  const aboutContentRef = useRef<HTMLDivElement>(null);
  const cardBadgeRef = useRef<HTMLDivElement>(null);
  const [letterSwapTriggered, setLetterSwapTriggered] = useState(false);
  const letterSwapTriggeredRef = useRef(false);

  const whoAmIText = "WHO AM I ?";

  useGSAP(
    () => {
      if (!sectionRef.current || !frameRef.current) return;

      // Runs from the instant the section's top touches the bottom of the
      // viewport until it reaches the top — identical to the hero parallax
      // range, so the two move together and both finish as the section lands.
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "top top",
          // Small on purpose: Lenis already smooths the scroll position, so a
          // long scrub here would stack a second lag on top and feel mushy.
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (self.progress >= FULL && !letterSwapTriggeredRef.current) {
              letterSwapTriggeredRef.current = true;
              setLetterSwapTriggered(true);
            }
          },
        },
      });

      tl
        // ── Red-stage labels stagger in as the section rises ──
        .fromTo(
          ".who-letter",
          { opacity: 0, x: -14 },
          { opacity: 1, x: 0, stagger: 0.012, duration: 0.1 },
          0.02
        )
        .fromTo(
          midIndexRef.current,
          { opacity: 0, x: -14 },
          { opacity: 1, x: 0, duration: 0.1 },
          0.06
        )

        // ── The box grows in one continuous move ──
        // Every edge runs its own ease across the same span rather than being
        // chained through a midpoint, so no edge can change speed abruptly. The
        // three beats come from the easing, not from handoffs: the sides open
        // first, the bottom follows, and the top holds its red band and closes
        // last on an ease that still lands softly.
        .fromTo(
          frameRef.current,
          { scale: 0.55 },
          { scale: 1, ease: "power2.out", duration: 0.16 },
          0
        )
        .fromTo(
          frameRef.current,
          { marginLeft: "44vw", marginRight: "44vw", borderRadius: 4 },
          {
            marginLeft: "0vw",
            marginRight: "0vw",
            borderRadius: 0,
            ease: "power1.out",
            duration: FULL,
          },
          0
        )
        .fromTo(
          frameRef.current,
          { marginBottom: "68vh" },
          { marginBottom: "0vh", ease: "power2.inOut", duration: FULL },
          0
        )
        .fromTo(
          frameRef.current,
          { marginTop: "18vh" },
          { marginTop: "0vh", ease: EASE.lateSoft, duration: FULL },
          0
        )

        // Red-stage labels dissolve as the top edge closes over them
        .to(
          [topTitleRef.current, midIndexRef.current],
          { opacity: 0, duration: 0.14 },
          0.5
        )

        // Title tracks the frame so it never overflows the small card
        .fromTo(
          aboutTitleContainerRef.current,
          { scale: 0.34 },
          { scale: 1, ease: "power1.out", duration: FULL },
          0
        )

        // ── Full black: title glides up, bio arrives ──
        .to(
          aboutTitleContainerRef.current,
          { yPercent: -34, ease: "power2.out", duration: 0.24 },
          FULL - 0.06
        )
        .fromTo(
          cardBadgeRef.current,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.14 },
          FULL - 0.08
        )
        .fromTo(
          aboutContentRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.22 },
          FULL - 0.02
        )

        // Pads the timeline to a duration of exactly 1 so every position above
        // maps to a fixed fraction of the scroll range.
        .to({}, { duration: 0.04 }, 0.96);
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative h-screen w-full overflow-hidden select-none"
      style={{ backgroundColor: "hsl(var(--blood))" }}
    >
      {/* ── Top Header on Red Background ── */}
      <div
        ref={topTitleRef}
        className="absolute top-[8.5vh] sm:top-[9vh] md:top-[9.5vh] left-1/2 -translate-x-1/2 z-30 pointer-events-none flex items-center justify-center"
      >
        <h2 className="font-body text-[11px] sm:text-[13px] md:text-[14px] font-bold uppercase tracking-[0.35em] sm:tracking-[0.4em] text-ink flex">
          {whoAmIText.split("").map((char, index) => (
            <span key={`who-${index}`} className="who-letter inline-block opacity-0">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h2>
      </div>

      {/* ── Mid-Left Indicator on Red Background ── */}
      <div
        ref={midIndexRef}
        className="absolute left-2 sm:left-4 md:left-6 lg:left-8 top-[24vh] sm:top-[25vh] md:top-[26vh] -translate-y-1/2 z-30 pointer-events-none opacity-0"
      >
        <span className="font-body text-xs sm:text-sm md:text-base font-bold tracking-[0.25em] text-ink">
          ( 1 )
        </span>
      </div>

      {/* ── Expanding Black Box ── */}
      <div
        ref={frameRef}
        className="absolute inset-0 z-20 mt-[18vh] mx-[44vw] mb-[68vh] rounded bg-ink text-cream overflow-hidden flex flex-col items-center justify-center p-3 sm:p-6 md:p-10 shadow-2xl"
      >
        <div
          ref={cardBadgeRef}
          className="absolute top-6 left-6 right-6 flex items-center justify-between text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-cream/40 pointer-events-none opacity-0"
        >
          <span>[ PERSPECTIVE // 01 ]</span>
          <span>EST. 2026</span>
        </div>

        {/* ── ABOUT ME Title ── */}
        <div
          ref={aboutTitleContainerRef}
          className="flex flex-col items-center justify-center text-center z-10 will-change-transform"
        >
          <div className="cursor-pointer group">
            <LetterSwapForward
              label="ABOUT ME"
              reverse={false}
              transition={{ type: "spring", duration: 0.7 }}
              staggerDuration={0.035}
              staggerFrom="first"
              className="font-airone text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-[0.08em] text-cream group-hover:text-blood transition-colors duration-300"
              trigger={letterSwapTriggered}
            />
          </div>
          <div className="mt-2.5 flex items-center gap-3 whitespace-nowrap">
            <span className="h-[1px] w-5 bg-blood/60" />
            <span className="text-[9px] sm:text-[11px] md:text-xs uppercase tracking-[0.35em] font-semibold text-blood font-body">
              Creative Developer &amp; AI Researcher
            </span>
            <span className="h-[1px] w-5 bg-blood/60" />
          </div>
        </div>

        {/* ── Bio Content ── */}
        <div
          ref={aboutContentRef}
          className="absolute bottom-8 sm:bottom-12 md:bottom-14 left-6 right-6 sm:left-12 sm:right-12 md:left-16 md:right-16 flex flex-col items-center text-center z-10 max-w-2xl mx-auto opacity-0"
        >
          <p className="font-body text-xs sm:text-sm md:text-base leading-relaxed text-cream/90 font-light">
            Obsessed with the confluence of high-impact visuals, mathematical rigor,
            and machine intelligence. Engineering fluid web architectures, physics-informed
            neural simulations, and immersive digital systems.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] md:text-[11px] font-mono font-medium uppercase tracking-[0.2em]">
            <span className="px-3.5 py-1.5 border border-cream/20 bg-cream/5 text-cream/90 transition-colors hover:border-blood hover:text-white">
              [ Interactive Systems ]
            </span>
            <span className="px-3.5 py-1.5 border border-cream/20 bg-cream/5 text-cream/90 transition-colors hover:border-blood hover:text-white">
              [ Machine Learning ]
            </span>
            <span className="px-3.5 py-1.5 border border-cream/20 bg-cream/5 text-cream/90 transition-colors hover:border-blood hover:text-white">
              [ WebGL &amp; Shaders ]
            </span>
          </div>
        </div>

        {/* Subtle Ambient Background Depth */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
