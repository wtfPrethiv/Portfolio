'use client';

import * as React from 'react';
import { motion, HTMLMotionProps, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';  

 

type StaggerDirection = 'start' | 'middle' | 'end';
type AnimationT = 'left' | 'right' | 'top' | 'bottom' | 'z' | 'blur' | undefined;

function splitText(text: string) {
  if (!text?.trim()) {
    return { words: [], characters: [], wordCount: 0, characterCount: 0 };
  }
  const words = text.split(' ').map(word => word + ' ');
  const characters = words.flatMap(word => word.split(''));
  return {
    words,
    characters,
    wordCount: words.length,
    characterCount: characters.length,
  };
}

function setStaggerDirection({
  direction = 'start',
  staggerValue = 0.02,
  totalItems,
  index,
}: {
  direction?: StaggerDirection;
  staggerValue?: number;
  totalItems: number;
  index: number;
}) {
  switch (direction) {
    case 'start':
      return index * staggerValue;
    case 'middle': {
      const middle = Math.floor(totalItems / 2);
      return Math.abs(index - middle) * staggerValue;
    }
    case 'end':
      return (totalItems - 1 - index) * staggerValue;
    default:
      return 0;
  }
}

function useAnimationVariants(animation?: AnimationT): Variants {
  return React.useMemo(() => ({
    hidden: {
      x: animation === 'left' ? '-100%' : animation === 'right' ? '100%' : 0,
      y: animation === 'top' ? '-100%' : animation === 'bottom' ? '100%' : 0,
      scale: animation === 'z' ? 0 : 1,
      filter: animation === 'blur' ? 'blur(10px)' : 'blur(0px)',
      opacity: 0,
    },
    visible: {
      x: 0,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      opacity: 1,
    },
  }), [animation]);
}

interface ScrollStaggerTextProps extends HTMLMotionProps<'span'> {
  text: string;
  animation?: AnimationT;
  staggerDirection?: StaggerDirection;
  staggerValue?: number;
  trigger?: boolean;  
}

const ScrollStaggerText = ({
  text,
  animation = 'top',
  staggerDirection = 'start',
  staggerValue = 0.03,
  className,
  transition,
  trigger,  
  ...props
}: ScrollStaggerTextProps) => {
  const { characters, characterCount } = splitText(text);
  const variants = useAnimationVariants(animation);

  
  const shouldAnimate = trigger !== undefined ? (trigger ? "visible" : "hidden") : undefined;
  const whileInViewProp = trigger === undefined ? "visible" : undefined;

  return (
    <motion.span
      className={cn('inline-block overflow-hidden whitespace-nowrap', className)}
      initial="hidden"
      animate={shouldAnimate}      
      whileInView={whileInViewProp}  
      viewport={{ once: false, margin: '-10%' }}
      {...props}
    >
      {characters.map((char, index) => {
        const delay = setStaggerDirection({
          direction: staggerDirection,
          staggerValue,
          totalItems: characterCount,
          index,
        });

        return (
          <motion.span
            key={`${char}-${index}`}
            className="inline-block"
            variants={variants}
            transition={{
              delay,
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
              ...transition,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        );
      })}
    </motion.span>
  );
};

export default ScrollStaggerText;