'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from '@/hooks/use-lenis';
import {
  FIRST_NAME,
  LAST_NAME,
  NAME_FONT,
} from '@/components/preloader';
import Grainient from './grainient';

gsap.registerPlugin(ScrollTrigger);

type HeroScrollTransitionProps = {
  isMenuOpen: boolean;
  /** Set true after the preloader black wipe has fully cleared */
  isReady: boolean;
};

export default function HeroScrollTransition({ isMenuOpen, isReady }: HeroScrollTransitionProps) {
  // ── Refs ───────────────────────────────────────────────────────────────
  const containerRef  = useRef<HTMLDivElement>(null);
  const stickyRef     = useRef<HTMLDivElement>(null);
  const nameWrapRef   = useRef<HTMLDivElement>(null);
  const firstNameRef  = useRef<HTMLDivElement>(null);
  const lastNameRef   = useRef<HTMLDivElement>(null);
  const revealRectRef = useRef<HTMLDivElement>(null);
  const lineRef       = useRef<HTMLDivElement>(null);
  const leftTextRef   = useRef<HTMLDivElement>(null);
  const centerTextRef = useRef<HTMLDivElement>(null);
  const rightTextRef  = useRef<HTMLDivElement>(null);
  const taglineRef    = useRef<HTMLDivElement>(null);

  const lenis = useLenis();

  // ── Scroll restore on mount ────────────────────────────────────────────
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    return () => {
      if ('scrollRestoration' in history) history.scrollRestoration = 'auto';
    };
  }, []);

  // ── Unlock when menu opens ─────────────────────────────────────────────
  useEffect(() => {
    if (isMenuOpen) lenis?.start();
  }, [isMenuOpen, lenis]);

  // ── Intro animation (after preloader) ─────────────────────────────────
  useEffect(() => {
    // Set hidden state immediately so elements are invisible before intro plays
    gsap.set(lineRef.current,   { scaleX: 0 });
    gsap.set([leftTextRef.current, centerTextRef.current, rightTextRef.current],
      { x: -30, autoAlpha: 0 });
    gsap.set(taglineRef.current, { autoAlpha: 0, y: 15 });

    if (!isReady) return;

    const intro = gsap.timeline({ delay: 0.1 });
    intro
      .to(lineRef.current, { scaleX: 1, duration: 0.9, ease: 'power3.inOut' })
      .to([leftTextRef.current, centerTextRef.current, rightTextRef.current], {
        x: 0, autoAlpha: 1, duration: 0.65, stagger: 0.15, ease: 'power3.out',
      }, '-=0.5')
      .to(taglineRef.current, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out' }, '-=0.4');
  }, [isReady]);

  // ── GSAP ScrollTrigger scroll sequence ────────────────────────────────
  useEffect(() => {
    if (!isReady) return;

    // Small delay to let layout settle after preloader
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        const nameWrap   = nameWrapRef.current!;
        const firstName  = firstNameRef.current!;
        const lastName   = lastNameRef.current!;
        const rect       = revealRectRef.current!;
        const left       = leftTextRef.current!;
        const center     = centerTextRef.current!;
        const right      = rightTextRef.current!;
        const tagline    = taglineRef.current!;
        const line       = lineRef.current!;
        const header     = document.querySelector('header') as HTMLElement | null;

        // ── GPU hints ──────────────────────────────────────────────────
        gsap.set([firstName, lastName], { willChange: 'transform' });
        gsap.set(rect, {
          willChange: 'transform',
          transformOrigin: 'center center',
          autoAlpha: 0,
          xPercent: -50,
          yPercent: -50,
        });

        // ── Compute the Y translation needed to move name to viewport center ──
        // nameWrap is absolute bottom-28 (112px). We tween it upward in pixels.
        const computeNameCenterY = () => {
          const vh = window.innerHeight;
          const nameRect = nameWrap.getBoundingClientRect();
          // Current center of name (relative to viewport)
          const nameCenterY = nameRect.top + nameRect.height / 2;
          // Target: viewport center
          const targetY = vh / 2;
          return targetY - nameCenterY; // negative = move up
        };

        // ── Build the timeline ─────────────────────────────────────────
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger:    containerRef.current,
            start:      'top top',
            end:        'bottom bottom',
            pin:        stickyRef.current,
            pinSpacing: false,
            scrub:      1.2,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // ─────────────────────────────────────────────────────────────────
        // PHASE 1  [0 → 0.30]  Name lifts to center, UI fades out
        // ─────────────────────────────────────────────────────────────────
        tl.addLabel('phase1Start', 0);

        // Name lifts to viewport center. Function-based value so it is
        // re-evaluated on every ScrollTrigger.refresh() (e.g. resize).
        tl.to(nameWrap, {
          y: () => computeNameCenterY(),
          scale: 1.04,
          ease: 'power2.inOut',
          duration: 0.3,
        }, 'phase1Start');

        // Bottom-bar elements stagger out
        tl.to([line, left, center, right, tagline], {
          autoAlpha: 0,
          y: 14,
          stagger: 0.04,
          ease: 'power2.out',
          duration: 0.26,
        }, 'phase1Start');

        // Header fades out
        if (header) {
          tl.to(header, { autoAlpha: 0, duration: 0.22, ease: 'power2.out' }, 'phase1Start');
        }

        // ─────────────────────────────────────────────────────────────────
        // PHASE 2  [0.34 → 0.68]  Names split sideways; small box emerges
        //                          in the gap between them as they part.
        // ─────────────────────────────────────────────────────────────────
        tl.addLabel('phase2Start', 0.34);

        // Box becomes visible quickly right as the split begins. Because it
        // sits behind the names (z:5 < z:10) it is only revealed once the
        // names move apart — reading as "a box appears in the gap".
        tl.to(rect, {
          autoAlpha: 1,
          duration: 0.08,
          ease: 'none',
        }, 'phase2Start');

        tl.to(firstName, {
          xPercent: -135,
          ease: 'power3.inOut',
          duration: 0.34,
        }, 'phase2Start');

        tl.to(lastName, {
          xPercent: 135,
          ease: 'power3.inOut',
          duration: 0.34,
        }, 'phase2Start');

        // Box grows gently while the names part.
        tl.to(rect, {
          scaleX: 1.7,
          scaleY: 1.35,
          ease: 'power2.inOut',
          duration: 0.34,
        }, 'phase2Start');

        // ─────────────────────────────────────────────────────────────────
        // PHASE 3  [0.72 → 1.00]  Box floods the whole screen; the split
        //                          names fade so the cover is clean and we
        //                          hand off to the next section.
        // ─────────────────────────────────────────────────────────────────
        tl.addLabel('phase3Start', 0.72);

        // Base box is 8vw × 12vh. To guarantee full coverage:
        //   100vw / 8vw  ≈ 12.5  → use 16 for safe overshoot
        //   100vh / 12vh ≈ 8.3   → use 12 for safe overshoot
        tl.to(rect, {
          scaleX: 16,
          scaleY: 12,
          ease: 'expo.inOut',
          duration: 0.28,
        }, 'phase3Start');

        // Fade the now off-center names out so nothing peeks over the flood.
        tl.to([firstName, lastName], {
          autoAlpha: 0,
          ease: 'power2.in',
          duration: 0.12,
        }, 'phase3Start');

      }, containerRef);

      return () => {
        ctx.revert();
        const header = document.querySelector('header') as HTMLElement | null;
        if (header) gsap.set(header, { clearProps: 'all' });
      };
    }, 300);

    return () => clearTimeout(timer);
  }, [isReady]);

  return (
    /* Outer scroll-driver container — height controls how long the pin lasts */
    <div ref={containerRef} style={{ height: '500vh' }}>

      {/* ── Sticky viewport (GSAP pins this) ──────────────────────────── */}
      <div
        ref={stickyRef}
        style={{
          position: 'relative',
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          background: '#0d0d0d',
        }}
      >

        {/* ── Grainient background ─────────────────────────────────────── */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <Grainient
            color1="#b1b6b8"
            color2="#242426"
            color3="#a49ea9"
            timeSpeed={0.25}
            colorBalance={0.0}
            warpStrength={1}
            warpFrequency={5}
            warpSpeed={2}
            warpAmplitude={50}
            blendAngle={0}
            blendSoftness={0.05}
            rotationAmount={500}
            noiseScale={2}
            grainAmount={0.05}
            grainScale={2}
            grainAnimated={false}
            contrast={1.5}
            gamma={1}
            saturation={1}
            centerX={0.0}
            centerY={0}
            zoom={1}
          />
        </div>

        {/*
         * ── Reveal rectangle ──────────────────────────────────────────────
         * Absolutely positioned to screen center via CSS.
         * GSAP scales it outward; transform-origin: center center.
         * Note: GSAP's xPercent/yPercent move the element by its own width/height,
         * so we set left:50% / top:50% and use xPercent:-50 / yPercent:-50 for
         * true CSS centering — then GSAP scales from that anchor.
         */}
        <div
          ref={revealRectRef}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '8vw',
            height: '12vh',
            background: '#080808',
            borderRadius: 0,
            zIndex: 5,
            transformOrigin: 'center center',
            // GSAP will add translate(-50%,-50%) via xPercent/yPercent
          }}
        />

        {/* ── Tagline — bottom right ───────────────────────────────────── */}
        <div
          ref={taglineRef}
          style={{
            position: 'absolute',
            bottom: '10rem',
            right: '3rem',
            zIndex: 20,
            textAlign: 'right',
            pointerEvents: 'none',
          }}
        >
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              color: 'rgba(255,255,255,0.55)',
              fontSize: '11px',
              lineHeight: '1.7',
              maxWidth: '180px',
              fontWeight: 300,
              letterSpacing: '0.04em',
              margin: 0,
            }}
          >
            Quiet creator, bringing ideas to life,<br />
            through motion, detail and softness.
          </p>
        </div>

        {/*
         * ── Name wrapper ──────────────────────────────────────────────────
         * Positioned bottom-28 (112px) centered horizontally — matching the
         * preloader's landing position. GSAP lifts it to viewport centre.
         * z-index 10: above the reveal rect (z:5).
         */}
        <div
          ref={nameWrapRef}
          style={{
            position: 'absolute',
            bottom: '7rem',
            left: 0,
            right: 0,
            zIndex: 10,
            pointerEvents: 'none',
            padding: '0 3rem',
          }}
        >
          <h1 className="sr-only">Prethiv Sriman — Portfolio</h1>

          <div
            aria-hidden="true"
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'center',
              gap: '3vw',
            }}
          >
            {/* FIRST NAME */}
            <div
              ref={firstNameRef}
              style={{
                display: 'flex',
                ...NAME_FONT,
                willChange: 'transform',
              }}
            >
              {FIRST_NAME.split('').map((char, i) => (
                <span key={`f-${i}`} style={{ display: 'inline-block', color: '#ffffff' }}>
                  {char}
                </span>
              ))}
            </div>

            {/* LAST NAME — italic */}
            <div
              ref={lastNameRef}
              style={{
                display: 'flex',
                ...NAME_FONT,
                fontStyle: 'italic',
                willChange: 'transform',
              }}
            >
              {LAST_NAME.split('').map((char, i) => (
                <span key={`l-${i}`} style={{ display: 'inline-block', color: '#ffffff' }}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ───────────────────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 20,
          }}
        >
          {/* Divider line */}
          <div
            ref={lineRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '1px',
              background: 'rgba(255,255,255,0.18)',
              transformOrigin: 'left center',
            }}
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.5rem 3rem',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <div
              ref={leftTextRef}
              style={{
                color: 'rgba(255,255,255,0.55)',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                fontWeight: 600,
              }}
            >
              → V3.0
            </div>

            <div
              ref={centerTextRef}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                color: 'rgba(255,255,255,0.45)',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                fontWeight: 600,
              }}
            >
              <a href="https://behance.net/prethiv" target="_blank" rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'inherit')}>
                Behance
              </a>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
              <a href="https://linkedin.com/in/prethiv" target="_blank" rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'inherit')}>
                LinkedIn
              </a>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
              <a href="https://github.com/pr3thiv" target="_blank" rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'inherit')}>
                GitHub
              </a>
            </div>

            <div
              ref={rightTextRef}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                color: 'rgba(255,255,255,0.65)',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                fontWeight: 600,
              }}
            >
              <a href="#projects" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'inherit')}>
                Work
              </a>
              <a href="#about" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'inherit')}>
                Info
              </a>
              <a href="mailto:prethiv@example.com" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'inherit')}>
                Contact
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}