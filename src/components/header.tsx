'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import MenuOverlay from './MenuOverlay';
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
    [key: string]: React.RefObject<HTMLElement>;
  };
};


export default function Header({ isMenuOpen, setIsMenuOpen, activeSection, sectionRefs }: HeaderProps) {
  const [isHovered, setIsHovered] = useState(false);
  const currentRef = sectionRefs[activeSection];
  const scaleX = useScrollProgress(currentRef);


  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 mix-blend-difference text-white"
        initial={{ y: '-100%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center justify-between p-4 sm:p-8">
          <div 
            className="text-lg font-bold uppercase tracking-widest flex items-center"
          >
            <div className="mr-2">
              PR3THIV
            </div>
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeSection}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="flex"
                >
                  <span>.</span>
                  <span>{activeSection}</span>
                </motion.span>
              </AnimatePresence>
                
              {/* <div className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-gray-500 mix-blend-difference z-0" />
                <motion.div
                    style={{ scaleX }}
                    className="absolute bottom-[-2px] left-0 h-[2px] w-full origin-left bg-foreground z-10"
                /> */}

            </div>
          </div>
          <nav>
            <ul className="flex items-center gap-8">
               <li>
                  <motion.div 
                    className="relative cursor-pointer"
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                  >
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-sm font-medium uppercase tracking-wider">
                      {isMenuOpen ? "Close" : "Menu"}
                    </button>
                    <motion.div
                      className="absolute bottom-[-2px] left-0 right-0 h-[1px] bg-white"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isHovered ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
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
