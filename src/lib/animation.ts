'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import { useGSAP } from '@gsap/react';

let registered = false;

/**
 * Registers GSAP plugins and shared custom eases exactly once.
 * Safe to call from any client component before creating animations.
 */
export function initAnimations() {
  if (registered || typeof window === 'undefined') return;
  registered = true;

  gsap.registerPlugin(ScrollTrigger, CustomEase, useGSAP);

  // Slow start -> fast finish. The signature ease of the site.
  CustomEase.create('slowFast', 'M0,0 C0.7,0 0.84,0.4 1,1');
  // Softer variant for larger travel distances.
  CustomEase.create('slowFastSoft', 'M0,0 C0.55,0 0.7,0.3 1,1');
  // Fast out, long settle — for elements arriving into place.
  CustomEase.create('arrive', 'M0,0 C0.16,1 0.3,1 1,1');
  // Holds, then travels and eases to a stop. For the edge that must move last
  // without snapping when it arrives.
  CustomEase.create('lateSoft', 'M0,0 C0.45,0 0.55,0.1 0.72,0.42 0.85,0.72 0.9,1 1,1');
}

// Auto-register on first client import so plugins are available
// before any useGSAP / useLayoutEffect hooks fire.
initAnimations();

export const EASE = {
  slowFast: 'slowFast',
  slowFastSoft: 'slowFastSoft',
  arrive: 'arrive',
  lateSoft: 'lateSoft',
} as const;

export { gsap, ScrollTrigger, useGSAP };

