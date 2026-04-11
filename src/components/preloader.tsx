'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type PreloaderProps = {
  onContentReady: () => void;
  onComplete: () => void;
};

export default function Preloader({ onContentReady, onComplete }: PreloaderProps) {
  const [counter, setCounter] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const duration = 2800;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const raw = elapsed / duration;
      const eased =
        raw < 0.5
          ? 4 * raw * raw * raw
          : 1 - Math.pow(-2 * raw + 2, 3) / 2;
      const value = Math.min(Math.floor(eased * 100), 100);
      setCounter(value);

      if (value < 100) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => setDone(true), 300);
      }
    };

    requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (done) {
      const t1 = setTimeout(onContentReady, 100);
      const t2 = setTimeout(onComplete, 1220);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [done, onContentReady, onComplete]);

  const sweepVariants = {
    initial: { y: '0%' },
    exit: {
      y: '-100%',
      transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] },
    },
  };

  const counterVariants = {
    initial: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          variants={sweepVariants}
          initial="initial"
          exit="exit"
          className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden"
          aria-label="Loading"
          role="status"
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px)',
            }}
          />

          <motion.div
            variants={counterVariants}
            initial="initial"
            exit="exit"
            className="relative flex flex-col items-center gap-6"
          >
            <div
              className="font-headline text-[18vw] sm:text-[14vw] font-black leading-none text-white tabular-nums select-none"
              style={{ letterSpacing: '-0.04em' }}
            >
              {String(counter).padStart(2, '0')}
            </div>

            <div className="flex items-center gap-3">
              <div className="w-48 sm:w-64 h-[1px] bg-white/20 overflow-hidden">
                <motion.div
                  className="h-full bg-white origin-left"
                  style={{ scaleX: counter / 100 }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <span className="text-white/40 text-xs font-mono uppercase tracking-[0.25em]">
                Loading
              </span>
            </div>

            <p className="text-white/20 text-xs uppercase tracking-[0.4em] font-mono mt-2">
              Portfolio — PR3THIV
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
