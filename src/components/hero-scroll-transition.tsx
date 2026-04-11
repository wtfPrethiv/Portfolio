'use client';

import { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from 'framer-motion';
import { useLenis } from '@/hooks/use-lenis';

type HeroScrollTransitionProps = {
  isMenuOpen: boolean;
  isReady: boolean;
};

const NAME = 'PRETHIV SRIMAN';

const nameContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.038,
      delayChildren: 0,
    },
  },
};

const charVariants = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const blackPanelVariants = {
  hidden: { y: '100%' },
  visible: {
    y: '0%',
    transition: {
      duration: 0.9,
      delay: 0,
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

const blackPanelTextVariants = {
  hidden: { y: 16, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, delay: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function HeroScrollTransition({ isMenuOpen, isReady }: HeroScrollTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameWrapRef  = useRef<HTMLDivElement>(null);
  const nameTextRef  = useRef<HTMLSpanElement>(null);

  const lenis = useLenis();
  const [isLocked, setIsLocked] = useState(false);
  const isScrollingRef = useRef(false);
  const [nameFontSize, setNameFontSize] = useState('10vw');

  const { scrollY } = useScroll();

  useEffect(() => {
    const fit = () => {
      const wrap = nameWrapRef.current;
      const text = nameTextRef.current;
      if (!wrap || !text) return;
      text.style.fontSize = '100px';
      const ratio = wrap.offsetWidth / text.scrollWidth;
      const size  = `${100 * ratio}px`;
      text.style.fontSize = size;
      setNameFontSize(size);
    };
    const t = setTimeout(fit, 200);
    window.addEventListener('resize', fit);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', fit);
    };
  }, []);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    return () => {
      if ('scrollRestoration' in history) history.scrollRestoration = 'auto';
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen && isLocked) {
      lenis?.start();
      isScrollingRef.current = false;
      setIsLocked(false);
    }
  }, [isMenuOpen, isLocked, lenis]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    mass: 1,
    stiffness: 50,
    damping: 20,
    restDelta: 0.001,
  });

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const isMobile = window.innerWidth < 768;
    if (!containerRef.current || isLocked || isMenuOpen || isMobile) return;
    if (isScrollingRef.current) return;

    const container    = containerRef.current;
    const startY       = container.offsetTop;
    const endY         = startY + container.offsetHeight - window.innerHeight;
    const triggerPoint = window.innerHeight * 0.8;

    if (latest > startY + triggerPoint && latest < endY - triggerPoint) {
      const isScrollingDown = latest > (scrollY.getPrevious() || 0);
      const targetY = isScrollingDown ? endY : startY;

      setIsLocked(true);
      isScrollingRef.current = true;
      lenis?.stop();
      lenis?.scrollTo(targetY, {
        duration: 1.8,
        easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
        force: true,
        onComplete: () => {
          isScrollingRef.current = false;
          setIsLocked(false);
          lenis?.start();
        },
      } as Parameters<typeof lenis.scrollTo>[1]);
    }
  });

  const nameOpacity = useTransform(smoothProgress, [0.1, 0.55], [1, 0]);
  const panelHeight = useTransform(smoothProgress, [0.05, 0.8], ['28%', '100%']);
  const infoOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);
  const infoY       = useTransform(smoothProgress, [0, 0.2], [0, -60]);

  const sharedFontStyle: React.CSSProperties = {
    fontFamily: "'Big Shoulders Display', 'Bebas Neue', sans-serif",
    fontVariationSettings: "'wght' 900",
    fontWeight: 900,
    fontSize: nameFontSize,
    whiteSpace: 'nowrap',
    lineHeight: 0.88,
    letterSpacing: '-0.01em',
  };

  return (
    <div ref={containerRef} className="relative h-[200vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-white text-black relative">

        <motion.div
          style={{ opacity: nameOpacity }}
          className="absolute inset-0 flex flex-col justify-start"
        >
          <div
            ref={nameWrapRef}
            className="relative w-full overflow-hidden leading-none"
            style={{ paddingTop: 'clamp(4rem, 10vh, 7rem)' }}
          >
            <h1 className="sr-only">Prethiv Sriman D — Portfolio</h1>

            <span
              ref={nameTextRef}
              aria-hidden="true"
              style={{
                ...sharedFontStyle,
                position: 'absolute',
                visibility: 'hidden',
                pointerEvents: 'none',
                top: 0,
                left: 0,
                color: 'transparent',
              }}
            >
              {NAME}
            </span>

            <div className="overflow-hidden">
              <motion.div
                variants={nameContainerVariants}
                initial="hidden"
                animate={isReady ? 'visible' : 'hidden'}
                style={{ ...sharedFontStyle, color: '#0a0a0a', display: 'block' }}
                aria-hidden="true"
              >
                {NAME.split('').map((char, i) => (
                  <motion.span
                    key={i}
                    variants={charVariants}
                    style={{ display: 'inline-block' }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={blackPanelVariants}
          initial="hidden"
          animate={isReady ? 'visible' : 'hidden'}
          style={{ height: panelHeight }}
          className="absolute bottom-0 left-0 right-0 bg-black overflow-hidden z-10"
        >
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
              backgroundSize: '200px 200px',
            }}
          />

          <motion.div
            variants={blackPanelTextVariants}
            initial="hidden"
            animate={isReady ? 'visible' : 'hidden'}
            className="h-full flex flex-col justify-center px-6 sm:px-10 md:px-14"
          >
            <motion.div style={{ y: infoY, opacity: infoOpacity }}>
              <div className="w-full h-[1px] bg-white/10 mb-6" />
              <div className="flex flex-col gap-2">
                <p className="text-white text-lg sm:text-xl md:text-2xl font-medium leading-snug">
                  Hiiii, I&apos;m{' '}
                  <span className="font-black tracking-tight">PRETHIV SRIMAN D</span>
                </p>
                <p className="text-white/50 text-base sm:text-lg md:text-xl font-normal leading-snug">
                  — an aspiring AI researcher and a Developer.
                </p>
              </div>
              <div className="w-full h-[1px] bg-white/10 mt-6" />
            </motion.div>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}