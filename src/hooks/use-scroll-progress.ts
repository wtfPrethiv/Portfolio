'use client';
import { useScroll, useSpring, MotionValue } from "framer-motion";
import React from "react";

export const useScrollProgress = (targetRef: React.RefObject<HTMLElement>): MotionValue<number> => {
    const { scrollYProgress } = useScroll({
      target: targetRef,
      offset: ["start start", "end start"], 
    });
  
    const scaleX = useSpring(scrollYProgress, {
      stiffness: 100,
      damping: 30,
      restDelta: 0.001
    });

    return scaleX;
};
