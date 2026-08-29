"use client";

import { useRef } from "react";
import { useGSAP, gsap, EASE } from "@/lib/animation";

/**
 * Total scroll runway, in vh. The first 100vh is the arrival — the section
 * travelling from the bottom of the viewport to the top, the same range the
 * hero parallax runs over — and the rest is the sticky hold. The hold only
 * begins once the frame is edge-to-edge black, so there is nothing left on
 * screen that could betray it as a pause.
 */
const SECTION_VH = 300;

/** Position where the section lands and the box is already full bleed. */
const ARRIVE = 100 / SECTION_VH;

const ABOUT_TEXT = "ABOUT ME";

const BIO_TEXT =
  "Junior at SRMIST exploring AI research — working with Mechanistic Interpretability, Deep Learning, and Physics-Informed Machine Learning. Building systems, experimenting with ideas, and digging deeper into how intelligence really works. I like working on research problems where there isn’t always an obvious answer—building things, testing ideas, breaking them, and figuring out why they work (or don’t). I’m especially interested in understanding models beyond just their outputs and exploring how we can make AI systems more interpretable, reliable, and capable.";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const topTitleRef = useRef<HTMLDivElement>(null);
  const midIndexRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const aboutTextRef = useRef<HTMLDivElement>(null);

  const whoAmIText = "WHO AM I ?";

  useGSAP(
    () => {
      if (!sectionRef.current || !frameRef.current) return;

      // Explicit resting states, so nothing depends on a tween's "from" having
      // rendered yet — the section can be loaded already scrolled into.
      gsap.set(".about-letter", { yPercent: 115 });
      gsap.set(".bio-word", { rotateX: -92, yPercent: 55, opacity: 0 });

      // The text lives inside the box so the box clips it, but the box's centre
      // travels from ~25vh to 50vh as it opens. Left alone the text would slide
      // down while its letters slide up. Offsetting it by the box's own drift
      // each frame keeps it planted at the middle of the screen.
      const holdTextCentred = () => {
        if (!frameRef.current || !contentRef.current) return;
        const box = frameRef.current.getBoundingClientRect();
        gsap.set(contentRef.current, {
          y: window.innerHeight / 2 - (box.top + box.height / 2),
        });
      };

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        onUpdate: holdTextCentred,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom bottom",
          // Small on purpose: Lenis already smooths the scroll position, so a
          // long scrub here would stack a second lag on top and feel mushy.
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      tl
        // ── Red-stage labels stagger in as the section rises ──
        .fromTo(
          ".who-letter",
          { opacity: 0, x: -14 },
          { opacity: 1, x: 0, stagger: 0.006, duration: 0.05 },
          0.01
        )
        .fromTo(
          midIndexRef.current,
          { opacity: 0, x: -14 },
          { opacity: 1, x: 0, duration: 0.05 },
          0.03
        )

        // ── The box grows in one continuous move, finishing as the section
        // lands. Every edge runs its own ease across the same span rather than
        // being chained through a midpoint, so no edge can change speed
        // abruptly: the sides open first, the bottom follows, and the top holds
        // its red band and closes last on an ease that still lands softly.
        .fromTo(
          frameRef.current,
          { scale: 0.55 },
          { scale: 1, ease: "power2.out", duration: 0.07 },
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
            duration: ARRIVE,
          },
          0
        )
        .fromTo(
          frameRef.current,
          { marginBottom: "68vh" },
          { marginBottom: "0vh", ease: "power2.inOut", duration: ARRIVE },
          0
        )
        .fromTo(
          frameRef.current,
          { marginTop: "18vh" },
          { marginTop: "0vh", ease: EASE.lateSoft, duration: ARRIVE },
          0
        )

        // Red-stage labels dissolve as the top edge closes over them
        .to(
          [topTitleRef.current, midIndexRef.current],
          { opacity: 0, duration: 0.1 },
          0.2
        )

        // ── ABOUT ME rises into view early, while box is still expanding ──
        .fromTo(
          ".about-letter",
          { yPercent: 115 },
          {
            yPercent: 0,
            ease: "power3.out",
            duration: 0.12,
            stagger: { each: 0.014, from: "start" },
          },
          0.06
        )

        // ── Once the box reaches full viewport (ARRIVE), drop the text off ──
        .fromTo(
          ".about-letter",
          { yPercent: 0 },
          {
            yPercent: 115,
            ease: "power3.in",
            duration: 0.1,
            stagger: { each: 0.011, from: "end" },
            immediateRender: false,
          },
          ARRIVE
        )

        // ── Bio unfolds word by word once the title has left ──
        .fromTo(
          ".bio-word",
          { rotateX: -92, yPercent: 55, opacity: 0 },
          {
            rotateX: 0,
            yPercent: 0,
            opacity: 1,
            ease: "power2.out",
            duration: 0.08,
            stagger: { each: 0.0062, from: "start" },
          },
          ARRIVE + 0.15
        )

        // Pads the timeline to a duration of exactly 1 so every position above
        // maps to a fixed fraction of the scroll range.
        .to({}, { duration: 0.02 }, 0.98);
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full select-none"
      style={{ height: `${SECTION_VH}vh`, backgroundColor: "hsl(var(--blood))" }}
    >
      {/* Sticky stage: holds the black screen still while the text plays out */}
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
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

        {/* ── ABOUT ME Text Container — sits above the box, not clipped ── */}
        <div
          ref={aboutTextRef}
          className="pointer-events-none absolute top-[27%] left-1/2 w-screen -translate-x-1/2 -translate-y-1/2 z-30 px-6"
        >
          <h2
            aria-label="About me"
            className="flex justify-center whitespace-nowrap font-moniqa uppercase leading-none tracking-normal text-[10vw] sm:text-[9vw] md:text-[8vw] lg:text-[7vw]"
          >
            {ABOUT_TEXT.split("").map((char, index) => (
              <span
                key={`about-${index}`}
                aria-hidden="true"
                className="inline-block shrink-0 overflow-hidden pb-[0.14em]"
              >
                <span
                  className={`about-letter inline-block will-change-transform ${
                    index === 0 ? "text-blood" : "text-cream"
                  }`}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              </span>
            ))}
          </h2>
        </div>

        {/* ── Expanding Black Box ── */}
        <div
          ref={frameRef}
          className="absolute inset-0 z-20 mt-[18vh] mx-[44vw] mb-[68vh] rounded bg-ink text-cream overflow-hidden shadow-2xl"
        >
          <div ref={contentRef} className="absolute inset-0">
            {/* Bio — unfolds word by word */}
            <div className="pointer-events-none absolute top-1/2 left-1/2 w-screen -translate-x-1/2 -translate-y-1/2 px-6 sm:px-10 md:px-16">
              <p className="w-full text-justify font-body text-base sm:text-xl md:text-2xl lg:text-3xl font-light leading-relaxed text-cream/90">
                {BIO_TEXT.split(" ").map((word, index) => (
                  // Perspective has to sit on the direct parent, or the rotateX
                  // below flattens into a squash instead of an unfold.
                  <span
                    key={`bio-${index}`}
                    className="inline-block mr-[0.28em] [perspective:700px]"
                  >
                    <span className="bio-word inline-block origin-top will-change-transform">
                      {word}
                    </span>
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
