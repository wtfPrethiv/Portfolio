'use client';

import { motion, useReducedMotion } from 'framer-motion';
import FluidTypography from './fluid-typography';

export default function HeroSection({ isPreloaderCompleted }: { isPreloaderCompleted: boolean }) {
  const shouldReduceMotion = useReducedMotion();
  const totalChars = 14;
  const centerIndex = (totalChars - 1) / 2; // 6.5

  const letterVariants = {
    hidden: { y: '110%' },
    visible: (i: number) => {
      const distanceFromCenter = Math.abs(i - centerIndex);
      const delay = 0.1 + (distanceFromCenter / 6.5) * 0.5;
      return {
        y: '0%',
        transition: {
          duration: shouldReduceMotion ? 0.2 : 0.62,
          ease: [0.215, 0.61, 0.355, 1], // equivalent to power3.out
          delay: shouldReduceMotion ? 0 : delay,
        }
      };
    }
  };

  return (
    <section className="relative flex h-screen w-full flex-col justify-between overflow-hidden bg-cream p-6 text-ink selection:bg-ink selection:text-cream sm:p-12">
      {/* Fluid Typography Canvas */}
      {!shouldReduceMotion && <FluidTypography isPreloaderCompleted={isPreloaderCompleted} />}
      {/* Top Row */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={isPreloaderCompleted ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: shouldReduceMotion ? 0.2 : 0.5, delay: shouldReduceMotion ? 0 : 0.28, ease: [0.23, 1, 0.32, 1] }}
        className="grid grid-cols-3 w-full items-center"
      >
        <div className="text-left">
          {/* Empty spacer so the dynamic logo from header shows */}
        </div>
        <div className="font-body text-center text-[10px] font-semibold uppercase tracking-[0.22em] sm:text-[11px] md:text-[12px]">
          PORTFOLIO
        </div>
        <div className="text-right">
          {/* Empty spacer so the menu button from header shows */}
        </div>
      </motion.div>

      {/* Bottom Section: Prethiv Sriman. */}
      <div className="mt-8 mb-12 flex w-full flex-1 items-center justify-center">
        <div className="text-center">
          <h1 aria-label="Prethiv Sriman" className="flex flex-row items-end justify-center gap-5 uppercase text-ink sm:gap-8 md:gap-10">
            <span aria-hidden="true" className="inline-flex gap-[0.02em] font-airone text-[9.2vw] leading-none tracking-[0.02em] sm:text-[8.2vw] md:text-[7.2vw] lg:text-[6.5vw]">
              {"PRETHIV".split('').map((char, index) => (
                <span key={`p-${index}`} className="inline-block overflow-hidden">
                  <motion.span
                    custom={index}
                    variants={letterVariants}
                    initial="hidden"
                    animate={isPreloaderCompleted ? "visible" : "hidden"}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                </span>
              ))}
            </span>
            <span aria-hidden="true" className="inline-flex gap-[0.25em] font-built text-[9.15vw] leading-none tracking-[0.12em] sm:text-[8.15vw] md:text-[7.15vw] lg:text-[6.45vw]">
              {"SRIMAN.".split('').map((char, index) => (
                <span key={`s-${index}`} className="inline-block overflow-hidden">
                  <motion.span
                    custom={index + 7}
                    variants={letterVariants}
                    initial="hidden"
                    animate={isPreloaderCompleted ? "visible" : "hidden"}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                </span>
              ))}
            </span>
          </h1>
        </div>
      </div>

      {/* Bottom Row - Matches Home Page Footer Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isPreloaderCompleted ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: shouldReduceMotion ? 0.2 : 0.5, delay: shouldReduceMotion ? 0 : 0.38, ease: [0.23, 1, 0.32, 1] }}
        className="grid w-full grid-cols-3 items-center font-body text-[9px] font-semibold uppercase tracking-[0.13em] text-ink sm:text-[10px]"
      >
        {/* Left: Version */}
        <div className="text-left opacity-60">
          → V3.0
        </div>

        {/* Center: Social Links */}
        <div className="flex items-center justify-center gap-3 text-center text-ink/60 sm:gap-5">
          <a
            href="https://behance.net/prethiv"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-150 hover:text-ink"
          >
            BEHANCE
          </a>
          <span className="opacity-30">/</span>
          <a
            href="https://linkedin.com/in/prethiv"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-150 hover:text-ink"
          >
            LINKEDIN
          </a>
          <span className="opacity-30">/</span>
          <a
            href="https://github.com/pr3thiv"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-150 hover:text-ink"
          >
            GITHUB
          </a>
        </div>

        {/* Right: Copyright */}
        <div className="text-right opacity-60">
          © COPYRIGHT 2024
        </div>
      </motion.div>
    </section>
  );
}
