'use client';

import React, { useEffect, useRef, useMemo, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
  wordAnimationStart?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  enableBlur = true,
  baseOpacity = 0,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom center',
  wordAnimationEnd = 'bottom center',
  wordAnimationStart = 'top 70%' 
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="inline-block word" key={index}>
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { transformOrigin: '0% 50%', rotate: baseRotation },
      {
        ease: 'none',
        rotate: 0,
        scrollTrigger: {
          trigger: el,
          start: wordAnimationStart, 
          end: rotationEnd,
          scrub: 1.5,  
        }
      }
    );

    const wordElements = el.querySelectorAll<HTMLElement>('.word');

  
    gsap.fromTo(
      wordElements,
      { 
        opacity: baseOpacity, 
        willChange: 'opacity, filter',
        filter: enableBlur ? `blur(${blurStrength}px)` : 'blur(0px)' 
      },
      {
        ease: 'none',
        opacity: 1,
        filter: 'blur(0px)',
        stagger: 0.1, 
        scrollTrigger: {
          trigger: el,
          start: wordAnimationStart, 
          end: wordAnimationEnd,
          scrub: 1.5,  
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, wordAnimationStart, blurStrength]);

  return (
    <h2 ref={containerRef} className={`my-5 ${containerClassName}`}>
      <p className={`text-[clamp(1.6rem,4vw,3rem)] leading-[1.5] font-semibold ${textClassName}`}>
        {splitText}
      </p>
    </h2>
  );
};

export default ScrollReveal;