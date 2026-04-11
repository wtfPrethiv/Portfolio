'use client';

import * as React from 'react';
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps, Variants } from 'framer-motion';
import { usePathname } from 'next/navigation';
import FlowingMenu from './FlowingMenu';


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
}

const ScrollStaggerText = ({
  text,
  animation = 'top',
  staggerDirection = 'start',
  staggerValue = 0.03,
  className,
  transition,
  ...props
}: ScrollStaggerTextProps) => {
  const { characters, characterCount } = splitText(text);
  const variants = useAnimationVariants(animation);

  return (
    <motion.span
      className={cn('inline-block overflow-hidden whitespace-nowrap', className)}
      initial="hidden"
      whileInView="visible"
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


const projects = [
  {
    title: 'FluidFlow V1',
    year: '2025',
    tags: ['Machine learning', 'PINN', 'React'],
    link: '#',
    description:"Developed a Physics-Informed Neural Network (PINN) to predict steady-state fluid flow around variable geometries by embedding Navier-Stokes equations, continuity, and no-slip boundary conditions directly into the loss function. The model generalizes across different flow regimes using physics-based constraints rather than labeled simulation data."
  },
  {
    title: 'verbaTex',
    year: '2025',
    tags: ['Deeplearning', 'Transformers', 'NLP'],
    link: '#',
    description: 'Developed Verbatex, a transformer-driven text-to-LaTeX conversion system that maps natural language math descriptions to structured LaTeX representations. The model leverages attention mechanisms to handle precedence, parentheses, and symbolic expressions, and is exposed via a production-ready FastAPI service.'
  },
  {
    title: 'transformer from scratch',
    year: '2025',
    tags: ['deeplearning', 'pytorch'],
    link: '#',
    description:"Built a Transformer model from scratch in PyTorch by re-implementing the attention mechanism directly from the “Attention Is All You Need” paper, including multi-head attention and positional encodings. The project emphasizes mathematical correctness, efficient tensor operations, and encoder–decoder sequence modeling."
  },
  {
    title: 'Gravitational lensing detection',
    year: '2025',
    tags: ['Deeplearning', 'Convolution nets', 'CV'],
    link: '#',
    description:"Designed a custom Convolutional Neural Network to detect and analyze gravitational lensing patterns using the CASTLES astrophysical dataset. The model leverages optimized convolutional layers and data augmentation to improve generalization on sparse astronomical data"
  },
  {
    title: 'namesniff',
    year: '2024',
    tags: ['Website', 'Full Stack', 'fastapi', 'react'],
    link: '#',
    description:"Built a web platform that takes a user-specified domain and scrapes and analyzes pricing across multiple domain hosting providers to surface better alternatives with added benefits. Integrated a Gemini-powered AI chatbot to assist users with comparisons, questions, and decision-making in real time."
  },
];


export default function ProjectsSection() {
  const pathname = usePathname();

  const menuItems = React.useMemo(
    () =>
      projects.map(project => ({
        link: project.link,
        text: project.title,
        image: '',
        year: project.year,
        tags: project.tags,
        description: project.description,
      })),
    []
  );

  return (
       
      <section className="min-h-screen w-full bg-black px-6 pt-24 pb-24 text-white md:px-12 flex flex-col">

      
      <div key={pathname} className="mb-10 overflow-hidden shrink-0">
        <ScrollStaggerText
          text="PROJECTS"
          animation="bottom"
          staggerDirection="start"
          className="text-[12vw] font-black leading-none tracking-tighter"
        />

        <div className="mt-4 flex justify-between border-t border-white pt-4">
          <span className="text-xs uppercase tracking-widest text-neutral-400">
            Selected Works
          </span>
          <span className="text-xs uppercase tracking-widest text-neutral-400">
            2022 — 2025
          </span>
        </div>
      </div>

      <div className="w-full min-h-[600px] border-t border-neutral-800">
        <FlowingMenu items={menuItems} />
      </div>
    </section>
  );
}
