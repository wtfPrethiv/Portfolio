'use client';

import React, { useEffect, useRef } from 'react';
import { useLenis } from '@/hooks/use-lenis';
import { initAnimations, gsap, ScrollTrigger, useGSAP } from '@/lib/animation';

/* Character ramp: dark -> bright, matching the reference's punctuation-heavy look. */
const RAMP = '.,:;!?~<>()[]{}=+*#@';
const HOT_CHARS = '<>()[]{}=+*#@';

const CELL_BASE = 11; // CSS px per grid cell (scaled slightly with viewport)
const PAD = 32; // extra field padding so parallax never reveals bare edges
const HEAT_RADIUS = 5.5; // cells
const IMAGE_SRC = '/images/hands-of-creation.png';

type Grid = {
  cols: number;
  rows: number;
  cell: number;
  brightness: Float32Array;
  baseChar: Uint8Array;
  curChar: Uint8Array;
  gray: Uint8Array; // 1 = render as gray instead of red
  heat: Float32Array;
};

function buildGrid(img: HTMLImageElement, width: number, height: number, cell: number): Grid {
  const cols = Math.ceil((width + PAD * 2) / cell);
  const rows = Math.ceil((height + PAD * 2) / cell);

  // Downsample the artwork to one pixel per cell, cover-fitted.
  const sampler = document.createElement('canvas');
  sampler.width = cols;
  sampler.height = rows;
  const sctx = sampler.getContext('2d', { willReadFrequently: true })!;
  sctx.fillStyle = '#000';
  sctx.fillRect(0, 0, cols, rows);

  const scale = Math.max(cols / img.width, rows / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  sctx.drawImage(img, (cols - dw) / 2, (rows - dh) / 2, dw, dh);

  const data = sctx.getImageData(0, 0, cols, rows).data;
  const n = cols * rows;
  const brightness = new Float32Array(n);
  const baseChar = new Uint8Array(n);
  const gray = new Uint8Array(n);

  for (let i = 0; i < n; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    let lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    // Organic dithering so flat regions don't band.
    lum = Math.min(1, Math.max(0, lum + (Math.random() - 0.5) * 0.08));
    brightness[i] = lum;
    baseChar[i] = Math.min(RAMP.length - 1, Math.floor(lum * (RAMP.length - 1) + Math.random() * 1.5));
    gray[i] = Math.random() < 0.22 ? 1 : 0;
  }

  return {
    cols,
    rows,
    cell,
    brightness,
    baseChar,
    curChar: baseChar.slice(),
    gray,
    heat: new Float32Array(n),
  };
}

function baseColor(lum: number, isGray: boolean): string {
  if (isGray) {
    const v = Math.round(46 + lum * 120);
    return `rgb(${v},${v},${v})`;
  }
  const r = Math.round(55 + lum * 190);
  const g = Math.round(14 + lum * 55);
  const b = Math.round(10 + lum * 30);
  return `rgb(${r},${g},${b})`;
}

function paintBase(grid: Grid, dpr: number): HTMLCanvasElement {
  const { cols, rows, cell } = grid;
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(cols * cell * dpr);
  canvas.height = Math.ceil(rows * cell * dpr);
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.font = `${cell + 1}px "VT323", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x;
      const lum = grid.brightness[i];
      if (lum < 0.07) continue;
      ctx.fillStyle = baseColor(lum, grid.gray[i] === 1);
      ctx.fillText(RAMP[grid.baseChar[i]], x * cell + cell / 2, y * cell + cell / 2);
    }
  }
  return canvas;
}

export default function AsciiHandsSection({
  sectionRefs,
}: {
  sectionRefs?: { [key: string]: React.RefObject<HTMLDivElement | null> };
}) {
  const lenis = useLenis();
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    initAnimations();
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    let grid: Grid | null = null;
    let baseCanvas: HTMLCanvasElement | null = null;
    let active = new Set<number>();
    let running = false;
    let destroyed = false;

    const mouse = { x: 0, y: 0, inside: false };
    const offset = { x: 0, y: 0 };

    const img = new Image();
    img.src = IMAGE_SRC;

    const rebuild = () => {
      if (!img.complete || img.naturalWidth === 0 || destroyed) return;
      const w = section.clientWidth;
      const h = section.clientHeight;
      const cell = Math.round(CELL_BASE * Math.min(1.3, Math.max(0.8, w / 1600)));
      canvas.width = Math.ceil(w * dpr);
      canvas.height = Math.ceil(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      grid = buildGrid(img, w, h, cell);
      baseCanvas = paintBase(grid, dpr);
      active = new Set();
      drawStatic();
    };

    const drawStatic = () => {
      if (!grid || !baseCanvas) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, section.clientWidth, section.clientHeight);
      ctx.drawImage(
        baseCanvas,
        -PAD + offset.x,
        -PAD + offset.y,
        grid.cols * grid.cell,
        grid.rows * grid.cell
      );
    };

    const tick = (time: number, deltaMs: number) => {
      if (!running || !grid || !baseCanvas) return;
      const dt = Math.min(deltaMs / 1000, 0.05);
      const { cols, rows, cell, heat } = grid;
      const w = section.clientWidth;
      const h = section.clientHeight;

      // Field parallax: eases toward the cursor with a lazy idle drift.
      const tx = mouse.inside ? ((mouse.x - w / 2) / w) * 26 : Math.sin(time * 0.25) * 5;
      const ty = mouse.inside ? ((mouse.y - h / 2) / h) * 20 : Math.cos(time * 0.2) * 4;
      offset.x += (tx - offset.x) * Math.min(1, dt * 4);
      offset.y += (ty - offset.y) * Math.min(1, dt * 4);

      // Inject heat around the cursor.
      if (mouse.inside) {
        const fx = mouse.x - offset.x + PAD;
        const fy = mouse.y - offset.y + PAD;
        const cx = fx / cell;
        const cy = fy / cell;
        const r = Math.ceil(HEAT_RADIUS);
        for (let gy = Math.max(0, Math.floor(cy) - r); gy <= Math.min(rows - 1, Math.floor(cy) + r); gy++) {
          for (let gx = Math.max(0, Math.floor(cx) - r); gx <= Math.min(cols - 1, Math.floor(cx) + r); gx++) {
            const dx = gx + 0.5 - cx;
            const dy = gy + 0.5 - cy;
            const d2 = dx * dx + dy * dy;
            if (d2 > HEAT_RADIUS * HEAT_RADIUS) continue;
            const i = gy * cols + gx;
            const gain = Math.exp(-d2 / (HEAT_RADIUS * HEAT_RADIUS * 0.30)) * dt * 9;
            heat[i] = Math.min(1, heat[i] + gain);
            if (heat[i] > 0.02) active.add(i);
          }
        }
      }

      // Repaint: black -> base field -> hot cells on top.
      drawStatic();

      ctx.font = `${cell + 1}px "VT323", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const decay = Math.exp(-dt * 2.4);
      const fieldX = -PAD + offset.x;
      const fieldY = -PAD + offset.y;

      for (const i of active) {
        heat[i] *= decay;
        const hv = heat[i];
        if (hv < 0.02) {
          heat[i] = 0;
          grid.curChar[i] = grid.baseChar[i];
          active.delete(i);
          continue;
        }

        const gx = i % cols;
        const gy = (i / cols) | 0;
        const px = fieldX + gx * cell + cell / 2;
        const py = fieldY + gy * cell + cell / 2;
        const lum = grid.brightness[i];
        const hasGlyph = lum >= 0.07;
        if (!hasGlyph && hv < 0.12) continue;

        // Cover the base glyph so the displaced/heated copy doesn't double.
        ctx.fillStyle = '#000';
        ctx.fillRect(px - cell / 2 - 1, py - cell / 2 - 1, cell + 2, cell + 2);

        // Scramble hot cells.
        if (hv > 0.3 && Math.random() < 0.22) {
          grid.curChar[i] = 255; // sentinel: pick from HOT_CHARS
        } else if (hv < 0.12) {
          grid.curChar[i] = grid.baseChar[i];
        }
        const char =
          grid.curChar[i] === 255
            ? HOT_CHARS[(Math.random() * HOT_CHARS.length) | 0]
            : RAMP[grid.curChar[i]];

        // Displacement: push away from the cursor, scaled by heat.
        let ddx = 0;
        let ddy = 0;
        if (mouse.inside) {
          const vx = px - mouse.x;
          const vy = py - mouse.y;
          const len = Math.sqrt(vx * vx + vy * vy) || 1;
          const mag = hv * 4;
          ddx = (vx / len) * mag;
          ddy = (vy / len) * mag;
        }

        // In-canvas chromatic aberration for the hottest cells.
        if (hv > 0.3) {
          const ab = hv * 2.6;
          ctx.globalCompositeOperation = 'lighter';
          ctx.fillStyle = `rgba(255,30,10,${0.5 * hv})`;
          ctx.fillText(char, px + ddx + ab, py + ddy);
          ctx.fillStyle = `rgba(30,140,255,${0.3 * hv})`;
          ctx.fillText(char, px + ddx - ab, py + ddy);
          ctx.globalCompositeOperation = 'source-over';
        }

        const rr = Math.round(90 + lum * 100 + hv * 165);
        const gg = Math.round(18 + lum * 40 + hv * 80);
        const bb = Math.round(12 + lum * 25 + hv * 30);
        ctx.fillStyle = `rgb(${Math.min(255, rr)},${Math.min(255, gg)},${Math.min(255, bb)})`;
        ctx.fillText(char, px + ddx, py + ddy);
      }
    };

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.inside = true;
    };
    const onLeave = () => {
      mouse.inside = false;
    };

    let visibilityTrigger: ScrollTrigger | null = null;

    img.onload = () => {
      if (destroyed) return;
      rebuild();
      if (reducedMotion) return;

      section.addEventListener('mousemove', onMove);
      section.addEventListener('mouseleave', onLeave);
      gsap.ticker.add(tick);

      visibilityTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          running = self.isActive;
        },
      });
    };

    let resizeTimer: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(rebuild, 150);
    });
    ro.observe(section);

    return () => {
      destroyed = true;
      clearTimeout(resizeTimer);
      ro.disconnect();
      gsap.ticker.remove(tick);
      visibilityTrigger?.kill();
      section.removeEventListener('mousemove', onMove);
      section.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  // Entrance: canvas resolves from blur, name rises letter by letter, links fade in.
  useGSAP(
    () => {
      initAnimations();
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          once: true,
        },
      });

      tl.fromTo(
        canvasRef.current,
        { opacity: 0, filter: 'blur(18px)' },
        { opacity: 1, filter: 'blur(0px)', duration: 1.5, ease: 'slowFastSoft' }
      )
        .fromTo(
          '.finale-letter',
          { yPercent: 115 },
          { yPercent: 0, duration: 1, stagger: 0.04, ease: 'arrive' },
          0.25
        )
        .fromTo(
          '.finale-fade',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.09, ease: 'slowFast' },
          0.55
        );
    },
    { scope: sectionRef }
  );

  const scrollToSection = (key: string) => {
    const el = sectionRefs?.[key]?.current;
    if (!el) return;
    if (lenis) lenis.scrollTo(el);
    else el.scrollIntoView({ behavior: 'smooth' });
  };

  const renderLetters = (word: string, keyPrefix: string) =>
    word.split('').map((char, i) => (
      <span key={`${keyPrefix}-${i}`} className="inline-block overflow-hidden align-bottom">
        <span className={char === '.' ? 'finale-letter inline-block text-[#ff2a1a]' : 'finale-letter inline-block'}>
          {char}
        </span>
      </span>
    ));

  return (
    <section
      ref={sectionRef}
      id="finale"
      className="relative h-screen w-full overflow-hidden bg-black text-white select-none"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 grid grid-cols-2 md:grid-cols-3 items-start p-6 sm:p-10 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em]">
        <div className="flex flex-col gap-1">
          <a href="mailto:prethivshoba@gmail.com" className="finale-fade hover:text-[#ff2a1a] transition-colors w-fit">
            prethivshoba@gmail.com
          </a>
          <span className="finale-fade opacity-60">© 2026</span>
        </div>

        <div className="hidden md:flex flex-col items-center gap-1">
          <a
            href="https://github.com/wtfPrethiv"
            target="_blank"
            rel="noopener noreferrer"
            className="finale-fade hover:text-[#ff2a1a] transition-colors"
          >
            Github
          </a>
          <a
            href="https://linkedin.com/in/prethiv-sriman"
            target="_blank"
            rel="noopener noreferrer"
            className="finale-fade hover:text-[#ff2a1a] transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://behance.net/prethiv"
            target="_blank"
            rel="noopener noreferrer"
            className="finale-fade hover:text-[#ff2a1a] transition-colors"
          >
            Behance
          </a>
        </div>

        <div className="flex flex-col items-end gap-1">
          <button
            onClick={() => scrollToSection('PROJECTS')}
            className="finale-fade uppercase tracking-[0.2em] hover:text-[#ff2a1a] transition-colors"
          >
            Work
          </button>
          <button
            onClick={() => scrollToSection('CONTACT')}
            className="finale-fade uppercase tracking-[0.2em] hover:text-[#ff2a1a] transition-colors"
          >
            Contact
          </button>
        </div>
      </div>

      {/* Giant split-font name */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-4 sm:px-8 pb-2 sm:pb-4 pointer-events-none">
        <h2 className="flex items-end justify-between uppercase leading-[0.85] whitespace-nowrap">
          <span className="font-airone text-[13vw] tracking-[0.01em]">
            {renderLetters('PRETHIV', 'fn')}
          </span>
          <span className="font-built italic text-[13vw] tracking-[0.08em]">
            {renderLetters('SRIMAN.', 'ln')}
          </span>
        </h2>
      </div>
    </section>
  );
}
