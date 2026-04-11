'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import TextPressure from './TextPressure';

const paragraph1 =
  "I am Prethiv Sriman D, a Computer Science student at SRMIST, driven by a deep interest in physics-informed machine learning, computational modelling, and artificial intelligence. My work focuses on studying complex systems and embedding theoretical constraints into learning models to build robust, interpretable, and principled computational systems, with active experimentation across model design, training dynamics, scientific ML pipelines, backend development, and algorithms.";


const ScrollRevealParagraph = ({
  text,
  progress,
  range,
  className = '',
}: {
  text: string;
  progress: MotionValue<number>;
  range: [number, number];
  className?: string;
}) => {
  const words = text.split(' ');

  return (
    <p className={`flex flex-wrap justify-start text-left ${className}`}>
      {words.map((word, i) => {
        const start = range[0] + (i / words.length) * (range[1] - range[0]);
        const end = start + 0.02;

        return (
          <Word key={i} progress={progress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </p>
  );
};

const Word = ({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) => {
  const opacity = useTransform(progress, range, [0.05, 1]);

  return (
    <motion.span style={{ opacity }} className="mr-2">
      {children}
    </motion.span>
  );
};


export default function WhoAmISection() {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });


  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.2]);
  
  const heroY = useTransform(
    scrollYProgress,
    [0, 0.2, 0.3, 1],
    ['0vh', '-35vh', '-42vh', '-200vh']
  );

  const heroOpacity = useTransform(scrollYProgress, [0.2, 0.3], [1, 0]);

  const paragraphsY = useTransform(
    scrollYProgress,
    [0.35, 0.45, 0.8, 1], 
    ['20vh', '0vh', '0vh', '-100vh'] 
  );

  const paragraphsOpacity = useTransform(
    scrollYProgress,
    [0.3, 0.4],
    [0, 1]
  );

  return (
    <section
      ref={targetRef}
      className="relative min-h-[500vh] bg-black text-white"
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden px-4 sm:px-12">
        
        <motion.div
          style={{ scale: heroScale, y: heroY, opacity: heroOpacity }}
          className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-center z-10 w-full"
        >
          <div className="relative w-full h-[20vw] sm:h-[25vw] max-w-[90vw]">
            <TextPressure
              text="ABOUT ME"
              flex={true}
              alpha={false}
              stroke={false}
              width={true}
              weight={true}
              italic={true}
              textColor="#ffffff"
              strokeColor="#ff0000"
              minFontSize={24}
            />
          </div>
        </motion.div>

        <motion.div
          style={{ y: paragraphsY, opacity: paragraphsOpacity }}
          className="relative z-20 w-full max-w-[90vw] mt-32 pointer-events-none"
        >
          <div className="flex flex-col gap-8 items-start text-left">
            
            <ScrollRevealParagraph
              text={paragraph1}
              progress={scrollYProgress}
              range={[0.45, 0.75]} 
              className="text-2xl sm:text-4xl leading-[1.2] font-medium"
            />

          </div>
        </motion.div>
      </div>
    </section>
  );
}