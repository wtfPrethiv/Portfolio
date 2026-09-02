'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useVelocity } from 'framer-motion';

const size = 16;

type CustomCursorProps = {
  isIdle: boolean;
};

export default function CustomCursor({ isIdle }: CustomCursorProps) {
  // Motion values to track actual mouse position
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for trailing effect
  const springConfig = { damping: 28, stiffness: 600, mass: 0.1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Track velocity of the smooth movement
  const velocityX = useVelocity(smoothX);
  const velocityY = useVelocity(smoothY);

  // Direct velocity-based deformation:
  // - Moving horizontally (high vx): scaleX expands (wider), scaleY contracts (shorter)
  // - Moving vertically (high vy): scaleX contracts (squashed from left & right sides), scaleY expands (taller top & bottom)
  const scaleX = useTransform([velocityX, velocityY], (latest) => {
    const vx = Math.abs(Number(latest[0]));
    const vy = Math.abs(Number(latest[1]));
    const sX = 1 + (vx - vy) * 0.00015;
    return Math.min(Math.max(sX, 0.6), 1.4);
  });

  const scaleY = useTransform([velocityX, velocityY], (latest) => {
    const vx = Math.abs(Number(latest[0]));
    const vy = Math.abs(Number(latest[1]));
    const sY = 1 + (vy - vx) * 0.00015;
    return Math.min(Math.max(sY, 0.6), 1.4);
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - size / 2);
      mouseY.set(e.clientY - size / 2);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const variants = {
    visible: { opacity: 1, scale: 1 },
    hidden: { opacity: 0, scale: 0 },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate={isIdle ? 'hidden' : 'visible'}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference"
      style={{
        x: smoothX,
        y: smoothY,
        width: size,
        height: size,
      }}
    >
      <motion.div
        className="w-full h-full rounded-full bg-white"
        style={{
          scaleX,
          scaleY,
        }}
      />
    </motion.div>
  );
}

