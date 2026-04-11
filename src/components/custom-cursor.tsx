'use client';

import { motion } from 'framer-motion';
import { useMousePosition } from '@/hooks/use-mouse-position';

const size = 16;

type CustomCursorProps = {
  isIdle: boolean;
};

export default function CustomCursor({ isIdle }: CustomCursorProps) {
  const { x, y } = useMousePosition();

  const variants = {
    visible: { opacity: 1, scale: 1 },
    hidden: { opacity: 0, scale: 0 },
  };

  return (
    <motion.div
      variants={variants}
      animate={isIdle ? 'hidden' : 'visible'}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full bg-white mix-blend-difference"
      style={{
        width: size,
        height: size,
        x: x - size / 2,
        y: y - size / 2,
      }}
    />
  );
}
