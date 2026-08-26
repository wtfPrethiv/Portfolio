'use client';

import { gsap, ScrollTrigger, initAnimations } from '@/lib/animation';

/* ─────────────────────────────────────────────────────────
 * Section Transition System
 *
 * data-st-01="parallax"  → moves on Y while next section enters
 * data-st-01="pin"       → pins while next section scrolls over
 * data-st-01="reveal"    → reveals from behind the previous section
 *
 * data-st-y="300"        → Y distance (parallax / reveal)
 * data-st-opacity="0.5"  → overlay opacity 0 → value
 * data-st-overlay="black"→ overlay color
 * ──────────────────────────────────────────────────────── */

interface MobileConfig {
  breakpoint: number;
  strategy: 'simplify' | 'disable' | 'same';
}

interface SectionTransitionConfig {
  parallaxY: number;
  revealY: number;
  overlayColor: string;
  mobile: MobileConfig;
}

const DEFAULT_CONFIG: SectionTransitionConfig = {
  parallaxY: 300,
  revealY: 0,
  overlayColor: 'black',
  mobile: {
    breakpoint: 768,
    strategy: 'simplify',
  },
};

type Mode = 'parallax' | 'pin' | 'reveal' | 'none';

// ── Helpers ──────────────────────────────────────────────

function getYValue(el: HTMLElement, fallback: number): number {
  const v = parseFloat(el.dataset.stY ?? String(fallback));
  return Number.isNaN(v) ? fallback : v;
}

function getOpacityValue(el: HTMLElement): number | null {
  const v = parseFloat(el.dataset.stOpacity ?? '');
  if (Number.isNaN(v)) return null;
  return Math.max(0, Math.min(1, v));
}

function getOverlayColor(el: HTMLElement, fallback: string): string {
  return el.dataset.stOverlay ?? fallback;
}

function ensureOverlay(section: HTMLElement, color: string): HTMLElement {
  let overlay = section.querySelector<HTMLElement>('[data-st-overlay-el]');

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.setAttribute('data-st-overlay-el', '');
    overlay.setAttribute('aria-hidden', 'true');
    section.appendChild(overlay);
  }

  // Make sure section can contain the overlay
  if (getComputedStyle(section).position === 'static') {
    section.style.position = 'relative';
  }
  section.style.isolation = 'isolate';

  Object.assign(overlay.style, {
    position: 'absolute',
    inset: '0',
    zIndex: '2',
    pointerEvents: 'none',
    background: color,
    opacity: '0',
    willChange: 'opacity',
  });

  return overlay;
}

function resetOverlay(section: HTMLElement) {
  const el = section.querySelector<HTMLElement>('[data-st-overlay-el]');
  if (el) gsap.set(el, { opacity: 0 });
}

function configuredY(el: HTMLElement, mode: Mode, config: SectionTransitionConfig): number {
  if (mode === 'reveal') return getYValue(el, config.revealY);
  if (mode === 'parallax') return getYValue(el, config.parallaxY);
  return 0;
}

function hasYMotion(mode: Mode, y: number): boolean {
  return mode === 'parallax' || (mode === 'reveal' && y !== 0);
}

function resolveForMobile(
  mode: Mode,
  y: number,
  strategy: string,
  isMobile: boolean
): { mode: Mode; y: number } {
  if (!isMobile || strategy === 'same' || !hasYMotion(mode, y)) return { mode, y };
  if (strategy === 'disable') return { mode: 'none', y: 0 };
  // "simplify": parallax → pin, reveal keeps mode but drops y
  if (mode === 'parallax') return { mode: 'pin', y: 0 };
  return { mode, y: 0 };
}

// ── Main ─────────────────────────────────────────────────

export function sectionTransition01(
  scope: Element | Document = document,
  overrides: Partial<SectionTransitionConfig> = {}
): ScrollTrigger[] {
  initAnimations();

  const config: SectionTransitionConfig = {
    ...DEFAULT_CONFIG,
    ...overrides,
    mobile: { ...DEFAULT_CONFIG.mobile, ...(overrides.mobile || {}) },
  };

  const isMobile = window.matchMedia(`(max-width: ${config.mobile.breakpoint}px)`).matches;
  const strategy = (['same', 'disable', 'simplify'] as const).includes(
    config.mobile.strategy as 'same' | 'disable' | 'simplify'
  )
    ? config.mobile.strategy
    : DEFAULT_CONFIG.mobile.strategy;

  const triggers: ScrollTrigger[] = [];
  const sections = scope.querySelectorAll<HTMLElement>('[data-st-01]');

  sections.forEach((section) => {
    const rawMode = (section.getAttribute('data-st-01') || 'parallax') as Mode;
    const rawY = configuredY(section, rawMode, config);
    const opacity = getOpacityValue(section);
    const { mode, y } = resolveForMobile(rawMode, rawY, strategy, isMobile);

    if (mode === 'none') {
      resetOverlay(section);
      return;
    }

    // ── REVEAL ───────────────────────────────────────────
    if (mode === 'reveal') {
      const prev = section.previousElementSibling as HTMLElement | null;
      if (!prev) return;

      gsap.set(prev, { zIndex: 1 });
      gsap.set(section, { position: 'sticky', bottom: 0, zIndex: 0 });

      if (opacity === null) resetOverlay(section);
      if (y === 0 && opacity === null) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: prev,
          start: 'bottom bottom',
          end: () => `+=${section.offsetHeight}`,
          scrub: true,
        },
      });

      if (y !== 0) {
        tl.fromTo(section, { y }, { y: 0, ease: 'none', force3D: true }, 0);
      }
      if (opacity !== null) {
        const overlay = ensureOverlay(section, getOverlayColor(section, config.overlayColor));
        gsap.set(overlay, { opacity });
        tl.to(overlay, { opacity: 0, ease: 'none' }, 0);
      }

      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
      return;
    }

    // ── PIN & PARALLAX need a next sibling ────────────────
    const next = section.nextElementSibling as HTMLElement | null;
    if (!next) return;

    if (mode === 'pin') {
      const st = ScrollTrigger.create({
        trigger: next,
        start: 'top bottom',
        end: 'top top',
        pin: section,
        pinSpacing: false,
      });
      triggers.push(st);

      // If fallback from parallax, still honour overlay
      if (rawMode === 'parallax' && opacity !== null) {
        const overlay = ensureOverlay(section, getOverlayColor(section, config.overlayColor));
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: next,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
          },
        }).to(overlay, { opacity, ease: 'none' }, 0);
        if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
        return;
      }

      resetOverlay(section);
      return;
    }

    // ── PARALLAX ─────────────────────────────────────────
    const scrollTrigger: ScrollTrigger.Vars = {
      trigger: next,
      start: 'top bottom',
      end: 'top top',
      scrub: true,
    };

    const tween = { y, ease: 'none' as const, force3D: true };

    if (opacity === null) {
      resetOverlay(section);
      const st = gsap.to(section, { ...tween, scrollTrigger }).scrollTrigger;
      if (st) triggers.push(st);
      return;
    }

    const overlay = ensureOverlay(section, getOverlayColor(section, config.overlayColor));
    const tl = gsap.timeline({ scrollTrigger })
      .to(section, tween, 0)
      .to(overlay, { opacity, ease: 'none' }, 0);
    if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
  });

  return triggers;
}
