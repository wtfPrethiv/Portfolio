'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Menu from './Menu';
import { cn } from '@/lib/utils';

type MenuOverlayProps = {
  onClose: () => void;
  sectionRefs: {
    [key: string]: React.RefObject<HTMLElement>;
  };
  activeSection: string;
};

const menuVars = {
  initial: {
    clipPath: 'inset(100% 0 0 0)',
  },
  animate: {
    clipPath: 'inset(0% 0 0% 0)',
    transition: {
      duration: 1.25,
      ease: [0.9, 0, 0.1, 1],
    },
  },
  exit: {
    clipPath: 'inset(0 0 100% 0)',
    transition: {
      delay: 0.5,
      duration: 1,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const MenuOverlay = ({ onClose, sectionRefs, activeSection }: MenuOverlayProps) => {

  const [targetSection, setTargetSection] = useState<string | null>(null);


  const effectiveSection = targetSection || activeSection;
  

  const isDarkTheme = effectiveSection === 'HOME';

  const handleNavigation = (id: string) => {
    setTargetSection(id);
  };

  return (
    <motion.div
      variants={menuVars}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }} 
      className={cn(
        "fixed inset-0 z-40 transition-colors duration-300",
        isDarkTheme ? 'bg-black text-white' : 'bg-white text-black'
      )}
    >
      <Menu 
        onClose={onClose} 
        sectionRefs={sectionRefs} 
        onNavigate={handleNavigation} 
        isDarkTheme={isDarkTheme}
      />
    </motion.div>
  );
};

export default MenuOverlay;