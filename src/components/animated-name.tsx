'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const Name = () => {
  const [isHovered, setIsHovered] = useState(false);

  const pathVariants = {
    straight: { 
        d: "M0 1 L100 1",
        transition: { duration: 0.3, ease: 'easeInOut' }
    },
    wavy: {
      d: [
        "M0,1 C15,5 30,-3 45,2 C60,7 75,-3 90,5 C95,7 100,1 100,1",
        "M0,1 C15,-3 30,5 45,1 C60,-4 75,6 90,2 C95,0 100,1 100,1",
        "M0,1 C15,5 30,-3 45,2 C60,7 75,-3 90,5 C95,7 100,1 100,1",
      ],
      transition: { duration: 1, repeat: Infinity, ease: 'easeInOut', repeatType: 'loop' }
    },
  };

  return (
    <motion.span
      className="relative inline-block z-30 cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.strong
        className="font-bold"
        whileHover={{
          scale: 1.05,
          letterSpacing: "0.08em",
        }}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: 20,
          mass: 0.8,
        }}
      >
        PRETHIV SRIMAN D
      </motion.strong>
      <div className="absolute bottom-[-3px] left-0 right-0 h-[4px]">
        <svg width="100%" height="100%" viewBox="0 0 100 4" preserveAspectRatio="none">
          <motion.path
            variants={pathVariants}
            initial="straight"
            animate={isHovered ? "wavy" : "straight"}
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>
    </motion.span>
  );
};

export default Name;