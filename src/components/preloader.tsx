'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // 1. Animate Name (simulating framer motion from center outwards)
      const letters = gsap.utils.toArray('.char');
      const centerIndex = 6.5;
      
      letters.forEach((letter, i) => {
        const distanceFromCenter = Math.abs(i - centerIndex);
        const delay = 0.1 + (distanceFromCenter / 6.5) * 0.5;
        
        gsap.to(letter as Element, {
          yPercent: -110,
          duration: 0.72,
          ease: 'power3.out',
          delay: delay,
        });
      });

      // 2. Animate Counter
      tl.to({ val: 0 }, {
        val: 100,
        duration: 1.6,
        ease: 'power1.inOut',
        onUpdate: function () {
          if (counterRef.current) {
            counterRef.current.innerText = Math.round(this.targets()[0].val).toString();
          }
        },
        delay: 0.35
      });

      // 3. Counter reaches 100: Push name down
      tl.to([nameRef.current, counterRef.current], {
        y: 48,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.in',
      });

      // 4. Portal open
      // Initially portal is width 0, height 2px, centered.
      tl.to(portalRef.current, {
        width: '30vw', // expand width smoothly
        duration: 0.6,
        ease: 'power3.inOut'
      })
      .to(portalRef.current, {
        width: '100vw',
        height: '100vh',
        duration: 0.8,
        ease: 'power3.inOut',
        onComplete: () => {
            gsap.to(containerRef.current, {
                opacity: 0,
                duration: 0.3,
                onComplete: onComplete
            });
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 flex flex-col items-center justify-end bg-blood overflow-hidden">
      {/* Portal */}
      <div 
        ref={portalRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cream"
        style={{ width: '0px', height: '2px' }}
      ></div>

      {/* Name and Counter */}
      <div className="relative z-10 flex flex-col items-center mb-12 sm:mb-16">
        <h1 ref={nameRef} className="flex flex-row items-end justify-center gap-4 sm:gap-6 md:gap-8 uppercase select-none text-black">
            <span className="font-airone text-[5vw] sm:text-[4vw] md:text-[3.5vw] lg:text-[3vw] tracking-[0.02em] inline-flex leading-none gap-[0.02em]">
              {"PRETHIV".split('').map((char, index) => (
                <span key={`p-${index}`} className="inline-block overflow-hidden pb-1">
                  <span className="char inline-block translate-y-[110%]">
                    {char}
                  </span>
                </span>
              ))}
            </span>
            <span className="font-built text-[5vw] sm:text-[4vw] md:text-[3.5vw] lg:text-[3vw] tracking-[0.15em] inline-flex leading-none gap-[0.25em]">
              {"SRIMAN.".split('').map((char, index) => (
                <span key={`s-${index}`} className="inline-block overflow-hidden pb-1">
                  <span className="char inline-block translate-y-[110%]">
                    {char}
                  </span>
                </span>
              ))}
            </span>
        </h1>
        
        <div ref={counterRef} className="mt-6 font-sans text-black text-sm md:text-base font-medium tracking-widest">
          0
        </div>
      </div>
    </div>
  );
}
