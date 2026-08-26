'use client';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import MenuOverlay from './menu-overlay';
import { useScrollProgress } from '@/hooks/use-scroll-progress';

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `[ ${hours} : ${minutes} ]`;
  };

  return <div className="text-sm font-medium uppercase tracking-wider">{formatTime(time)}</div>;
}

type HeaderProps = {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeSection: string;
  sectionRefs: {
    [key: string]: React.RefObject<HTMLElement | null>;
  };
  isPreloaderCompleted: boolean;
};

export default function Header({ 
  isMenuOpen, 
  setIsMenuOpen, 
  activeSection, 
  sectionRefs,
  isPreloaderCompleted,
}: HeaderProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const currentRef = sectionRefs[activeSection];
  const scaleX = useScrollProgress(currentRef);

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 mix-blend-difference text-white"
        initial={{ y: '-100%' }}
        animate={isPreloaderCompleted ? { y: '0%' } : { y: '-100%' }}
        transition={{ duration: shouldReduceMotion ? 0.2 : 0.55, ease: [0.23, 1, 0.32, 1], delay: shouldReduceMotion ? 0 : 0.3 }}
      >
        <div className="flex items-center justify-between p-6 sm:p-12">
          <div className="font-sans font-semibold text-[10px] sm:text-[12px] md:text-[14px] uppercase tracking-[0.25em] flex items-center">
            <div className="mr-2">
              PR3THIV
            </div>
            <div className="relative">
              <AnimatePresence initial={false} mode="wait">
                <motion.span
                  key={activeSection}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                  className="flex"
                >
                  <span>.</span>
                  <span>{activeSection}</span>
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
          <nav>
            <ul className="flex items-center gap-4 sm:gap-8">
               <li>
                  <motion.div 
                    className="relative cursor-pointer"
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                  >
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-expanded={isMenuOpen} aria-controls="site-menu" className="-m-2 p-2 text-sm font-medium uppercase tracking-wider">
                      {isMenuOpen ? "Close" : "Menu"}
                    </button>
                    <motion.div
                      className="absolute bottom-[-2px] left-0 right-0 h-[1px] bg-white"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isHovered ? 1 : 0 }}
                      transition={{ duration: shouldReduceMotion ? 0.01 : 0.18, ease: [0.23, 1, 0.32, 1] }}
                      style={{ originX: 0 }}
                    />
                  </motion.div>
              </li>
              <li>
                  <Clock />
              </li>
            </ul>
          </nav>
        </div>
      </motion.header>
      <AnimatePresence>
        {isMenuOpen && <MenuOverlay onClose={() => setIsMenuOpen(false)} sectionRefs={sectionRefs} activeSection={activeSection} />}
      </AnimatePresence>
    </>
  );
}
