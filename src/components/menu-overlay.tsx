'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Menu from './menu';
import { cn } from '@/lib/utils';

type MenuOverlayProps = {
  onClose: () => void;
  sectionRefs: {
    [key: string]: React.RefObject<HTMLElement | null>;
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
      duration: 0.42,
      ease: [0.23, 1, 0.32, 1],
    },
  },
  exit: {
    clipPath: 'inset(0 0 100% 0)',
    transition: {
      duration: 0.3,
      ease: [0.23, 1, 0.32, 1],
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
      id="site-menu"
      className={cn(
        "fixed inset-0 z-40 transition-colors duration-150",
        isDarkTheme ? 'bg-ink text-cream' : 'bg-cream text-ink'
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