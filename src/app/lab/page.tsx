'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useLenis } from '@/hooks/use-lenis';

/* ─────────────────────── helpers ─────────────────────── */

function MarqueeRow({
  text,
  speed = 40,
  reverse = false,
  bgBlack = true,
}: {
  text: string;
  speed?: number;
  reverse?: boolean;
  bgBlack?: boolean;
}) {
  const items = Array(8).fill(text);
  return (
    <div
      className={`overflow-hidden w-full ${bgBlack ? 'bg-black text-white' : 'bg-white text-black'}`}
    >
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: reverse ? ['0%', '50%'] : ['0%', '-50%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      >
        {[...items, ...items].map((t, i) => (
          <span
            key={i}
            className="inline-block font-black uppercase tracking-tight"
            style={{
              fontFamily: "'Big Shoulders Display', 'Bebas Neue', sans-serif",
              fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
              lineHeight: 1,
              paddingRight: '4rem',
            }}
          >
            {t}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function SectionTag({ label }: { label: string }) {
  return (
    <span className="inline-block border border-current px-2 py-0.5 text-[10px] uppercase tracking-widest font-medium mr-2 mb-2">
      {label}
    </span>
  );
}

function RevealBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: '-10%' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SlashHeading({ text }: { text: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: false, margin: '-10%' });
  return (
    <motion.h2
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6"
      style={{ fontFamily: "'Big Shoulders Display', 'Bebas Neue', sans-serif" }}
    >
      /{text}
    </motion.h2>
  );
}

/* ─────────────────────── data ─────────────────────── */

const FEATURED_PROJECTS = [
  {
    id: 'fluidflow',
    slug: '/lab/fluidflow',
    year: '2025',
    category: 'Physics-ML',
    title: 'FluidFlow V1',
    subtitle: 'Physics-Informed Neural Network for CFD',
    abstract:
      'A PINN that encodes Navier–Stokes equations, continuity, and no-slip boundary conditions directly into the loss function. Trained entirely on physics residuals — zero labeled CFD data required — generalizing across flow regimes and arbitrary geometries.',
    tags: ['PINN', 'PyTorch', 'Navier-Stokes', 'Mesh-free simulation'],
    status: 'Published',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=900&q=80',
  },
  {
    id: 'verbatex',
    slug: '/lab/verbatex',
    year: '2025',
    category: 'NLP',
    title: 'verbaTex',
    subtitle: 'Natural Language → LaTeX Transformer',
    abstract:
      'A seq2seq transformer trained to translate free-form math descriptions into valid LaTeX. Handles nested expressions, operator precedence, and symbolic ambiguities. Production-ready FastAPI backend with sub-150ms inference.',
    tags: ['Transformers', 'NLP', 'FastAPI', 'LaTeX'],
    status: 'Ongoing',
    image: '/transformer-arch.png',
  },
];

const EXPERIMENTS = [
  {
    title: 'DeSynth',
    year: '2025',
    tags: ['Neural Nets', 'Adversarial ML', 'Steganography'],
    desc: 'An experiment in removing Google\'s SynthID watermark from AI-generated content using a trained neural network. The model learns the invisible perturbation signature embedded by SynthID and applies a learned inverse transform to neutralize it — probing the robustness limits of imperceptible watermarking schemes.',
  },
  {
    title: 'Neural Three-Body Solver & Sim',
    year: '2025',
    tags: ['Physics Sim', 'Neural ODE', 'Chaos Theory'],
    desc: 'A neural ODE trained to approximate trajectories of the classical three-body gravitational problem — an inherently chaotic system with no closed-form solution. The model learns to predict short-horizon orbital paths and feeds into a real-time WebGL simulation, letting you watch attractors and ejection events unfold.',
  },
  {
    title: 'MemPINN — Non-Markovian Physics-Informed Neural Networks',
    year: '2025',
    tags: ['PINN', 'Non-Markov', 'Viscoelasticity'],
    desc: 'Extends traditional PINNs by incorporating temporal memory so the model can learn systems whose evolution depends not only on current state but also on history. Instead of assuming Markovian dynamics, the network integrates past information via recurrent layers and learned integral kernels into the physics-constrained loss — enabling it to model viscoelastic materials, anomalous diffusion, and other history-dependent real-world phenomena.',
  },
  {
    title: 'Neural Quantum Noise Mitigation',
    year: '2025',
    tags: ['Quantum ML', 'Error Mitigation', 'Qiskit'],
    desc: 'A neural network trained to learn and invert the noise channel of a real quantum device. Given noisy expectation values from a Qiskit-executed circuit, the model predicts the ideal zero-noise output — functioning as a learned error-mitigation layer that sits between the quantum processor and classical post-processing.',
  },
];

const PUBLICATIONS = [
  {
    title: 'Physics-Informed Neural Networks for Incompressible Flow Generalization',
    venue: 'Pre-print — arXiv',
    year: '2025',
    tags: ['PINN', 'CFD', 'Deep Learning'],
    abstract:
      'We demonstrate that embedding Navier–Stokes residuals into the loss landscape enables a single network to generalize across Reynolds numbers 10²–10⁴ without simulation data, outperforming purely data-driven baselines on unseen geometries.',
    status: 'Under Review',
  },
  {
    title: 'verbaTex: Transformer-Driven Math-to-LaTeX Generation',
    venue: 'Pre-print — arXiv',
    year: '2025',
    tags: ['Seq2Seq', 'LaTeX', 'NLP'],
    abstract:
      'We present verbaTex, a fine-tuned T5-based model augmented with a custom tokenizer for LaTeX symbol sequences. The system achieves 91.4% exact-match accuracy on the im2latex-100k benchmark.',
    status: 'Pre-print',
  },
];

const ONGOING = [
  {
    codename: 'Project Ω',
    title: 'Sparse-Attention Vision Transformer for Low-Resource Medical Imaging',
    started: 'Jan 2025',
    progress: 62,
    tags: ['ViT', 'Medical AI', 'Sparse Attention'],
    desc: 'Adapting axial sparse attention patterns to reduce quadratic complexity for high-resolution histopathology slides. Targeting TCGA breast cancer dataset with limited label regime.',
  },
  {
    codename: 'Project Σ',
    title: 'Neural Symbolic Solver for Multi-Step Math Word Problems',
    started: 'Mar 2025',
    progress: 38,
    tags: ['Neurosymbolic', 'LLM', 'Reasoning'],
    desc: 'Combining chain-of-thought prompting with a symbolic algebra engine to verify intermediate reasoning steps. Evaluated on MATH and GSM8K datasets.',
  },
];

const ARCHIVES = [
  {
    title: 'namesniff',
    year: '2024',
    tags: ['Full Stack', 'FastAPI', 'Web Scraping', 'Gemini'],
    desc: 'Domain price comparison platform with a Gemini-powered AI chatbot. Scraped 15+ registrars in real time and surfaced best alternatives with add-on benefits.',
  },
  {
    title: 'CouponThryft',
    year: '2024',
    tags: ['Full Stack', 'Marketplace', 'React', 'Node.js'],
    desc: 'A secure and easy-to-use platform for trading unused coupons and promo codes, connecting people who have discounts with those who need them. Built with end-to-end encrypted coupon transfers, reputation scoring, and real-time availability matching.',
  },
  {
    title: 'Genetic Algorithm Route Optimizer',
    year: '2023',
    tags: ['Genetic Algorithm', 'TSP', 'Python'],
    desc: 'Solved TSP variant for 200+ city delivery networks using elitist selection, order crossover, and 2-opt mutation. Benchmarked against nearest-neighbor heuristic.',
  },
];

/* ─────────────────────── sub-components ─────────────────────── */

function LabHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { label: '#experiments', href: '#experiments' },
    { label: '#publications', href: '#publications' },
    { label: '#ongoing', href: '#ongoing' },
    { label: '#archives', href: '#archives' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference text-white">
      <div className="flex items-center justify-between px-6 py-4 sm:px-10">
        <Link
          href="/"
          className="text-lg font-bold uppercase tracking-widest"
          style={{ fontFamily: "'Big Shoulders Display', 'Bebas Neue', sans-serif" }}
        >
          PR3THIV
          <span className="font-normal opacity-60">.LAB</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wider font-medium">
          {navItems.map((n) => (
            <a key={n.href} href={n.href} className="hover:opacity-60 transition-opacity">
              {n.label}
            </a>
          ))}
          <Link href="/" className="border border-white px-3 py-1 hover:bg-white hover:text-black transition-colors">
            ← Home
          </Link>
        </nav>

        <button
          className="md:hidden text-xs uppercase tracking-wider"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 bg-black z-40 flex flex-col justify-center items-start px-10 gap-8"
          >
            {navItems.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setMenuOpen(false)}
                className="text-white text-4xl font-black uppercase tracking-tight"
                style={{ fontFamily: "'Big Shoulders Display', sans-serif" }}
              >
                {n.label}
              </a>
            ))}
            <Link href="/" className="text-white/50 text-lg mt-4 uppercase tracking-widest">
              ← Back to Portfolio
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function HeroSection() {
  const nameWrapRef = useRef<HTMLDivElement>(null);
  const nameTextRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState('12vw');

  useEffect(() => {
    const fit = () => {
      const wrap = nameWrapRef.current;
      const text = nameTextRef.current;
      if (!wrap || !text) return;
      text.style.fontSize = '100px';
      const ratio = wrap.offsetWidth / text.scrollWidth;
      const size = `${100 * ratio}px`;
      text.style.fontSize = size;
      setFontSize(size);
    };
    const t = setTimeout(fit, 100);
    window.addEventListener('resize', fit);
    return () => { clearTimeout(t); window.removeEventListener('resize', fit); };
  }, []);

  const LABEL = 'THE LAB';
  const charVars = {
    hidden: { y: '110%' },
    visible: (i: number) => ({
      y: '0%',
      transition: { duration: 0.6, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    }),
  };

  const sharedFont: React.CSSProperties = {
    fontFamily: "'Big Shoulders Display', 'Bebas Neue', sans-serif",
    fontWeight: 900,
    whiteSpace: 'nowrap',
    lineHeight: 0.88,
    letterSpacing: '-0.01em',
  };

  return (
    <section className="relative bg-white text-black min-h-screen flex flex-col justify-between overflow-hidden">
      {/* Giant heading */}
      <div ref={nameWrapRef} className="w-full overflow-hidden pt-28 px-0">
        <span
          ref={nameTextRef}
          aria-hidden
          style={{ ...sharedFont, fontSize: '100px', position: 'absolute', visibility: 'hidden', pointerEvents: 'none' }}
        >
          {LABEL}
        </span>
        <div className="overflow-hidden">
          <motion.div
            initial="hidden"
            animate="visible"
            style={{ ...sharedFont, fontSize, color: '#0a0a0a', display: 'block' }}
            aria-hidden
          >
            {LABEL.split('').map((char, i) => (
              <motion.span key={i} custom={i} variants={charVars} style={{ display: 'inline-block' }}>
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Intro text black panel */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
        className="bg-black text-white px-6 sm:px-10 md:px-14 py-10 mt-auto"
      >
        <div className="w-full h-[1px] bg-white/10 mb-6" />
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-white text-xl sm:text-2xl md:text-3xl font-medium leading-snug max-w-2xl">
              A living laboratory of{' '}
              <span className="font-black tracking-tight">ideas, experiments & research</span>{' '}
              at the intersection of AI, physics, and computation.
            </p>
            <p className="text-white/50 text-base md:text-lg mt-3 max-w-xl">
              — where half-formed hypotheses meet working code.
            </p>
          </div>
          <div className="text-white/30 text-xs uppercase tracking-widest shrink-0">
            <div>Prethiv Sriman D</div>
            <div>AI Researcher &amp; Developer</div>
            <div className="mt-1 text-white/20">Chennai, India · 2025</div>
          </div>
        </div>
        <div className="w-full h-[1px] bg-white/10 mt-6" />
      </motion.div>
    </section>
  );
}

function FeaturedProjects() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section className="bg-white text-black">
      {/* Marquee */}
      <MarqueeRow text="latest projects  /  selected work  /  research  /" bgBlack={false} speed={35} />

      <div className="px-6 sm:px-10 md:px-14 pt-16 pb-20">
        <SlashHeading text="latest" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-black">
          {FEATURED_PROJECTS.map((p, idx) => (
            <RevealBlock key={p.id} delay={idx * 0.12}>
              <div
                className={`group border-b border-black md:border-r last:md:border-r-0 cursor-pointer transition-colors duration-300 ${active === p.id ? 'bg-black text-white' : 'hover:bg-neutral-50'}`}
                onClick={() => setActive(active === p.id ? null : p.id)}
              >
                {/* Image */}
                <div className="relative overflow-hidden h-64 md:h-80 w-full">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`text-xs uppercase tracking-widest border px-2 py-1 ${active === p.id ? 'border-white text-white' : 'border-black text-black bg-white'}`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 text-xs uppercase tracking-widest text-white bg-black/70 px-2 py-1">
                    {p.year}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                  <div className="text-xs uppercase tracking-widest opacity-50 mb-2">{p.category}</div>
                  <h3
                    className="text-2xl md:text-3xl font-black uppercase leading-none mb-2"
                    style={{ fontFamily: "'Big Shoulders Display', sans-serif" }}
                  >
                    {p.title}
                  </h3>
                  <p className="text-sm opacity-60 mb-4">{p.subtitle}</p>

                  <AnimatePresence>
                    {active === p.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="text-sm leading-relaxed mt-2 mb-4 opacity-80">{p.abstract}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {p.tags.map((t) => (
                            <span key={t} className="border border-current text-xs px-2 py-0.5 uppercase tracking-wider">
                              {t}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-wrap gap-2">
                      {p.tags.slice(0, 2).map((t) => (
                        active !== p.id ? (
                          <span key={t} className="border border-current text-[10px] px-2 py-0.5 uppercase tracking-wider opacity-50">
                            {t}
                          </span>
                        ) : null
                      ))}
                    </div>
                    <span className="text-xs uppercase tracking-widest opacity-40">
                      {active === p.id ? '↑ collapse' : '→ expand'}
                    </span>
                  </div>
                </div>
              </div>
            </RevealBlock>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperimentsSection() {
  return (
    <section id="experiments" className="bg-black text-white">
      <MarqueeRow text="experiments  /  proofs of concept  /  explorations  /" speed={45} />

      <div className="px-6 sm:px-10 md:px-14 pt-16 pb-20">
        <SlashHeading text="experiments" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
          {EXPERIMENTS.map((e, idx) => (
            <RevealBlock key={e.title} delay={idx * 0.08}>
              <div className="bg-black p-8 md:p-10 h-full border border-white/10 hover:border-white/30 transition-colors duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-[10px] uppercase tracking-widest text-white/30">{e.year}</span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {e.tags.map((t) => (
                      <SectionTag key={t} label={t} />
                    ))}
                  </div>
                </div>
                <h3
                  className="text-xl md:text-2xl font-black uppercase leading-tight mb-3 group-hover:text-white/80 transition-colors"
                  style={{ fontFamily: "'Big Shoulders Display', sans-serif" }}
                >
                  {e.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">{e.desc}</p>
              </div>
            </RevealBlock>
          ))}
        </div>
      </div>
    </section>
  );
}

function PublicationsSection() {
  return (
    <section id="publications" className="bg-white text-black">
      <MarqueeRow text="publications  /  research papers  /  pre-prints  /" bgBlack={false} speed={38} reverse />

      <div className="px-6 sm:px-10 md:px-14 pt-16 pb-20">
        <SlashHeading text="publications" />

        <div className="flex flex-col gap-0 border-t border-black">
          {PUBLICATIONS.map((pub, idx) => (
            <RevealBlock key={pub.title} delay={idx * 0.1}>
              <div className="border-b border-black py-10 group hover:bg-neutral-50 transition-colors px-2 md:px-4 -mx-2 md:-mx-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {pub.tags.map((t) => <SectionTag key={t} label={t} />)}
                      <span className="inline-block border border-black/30 bg-neutral-100 text-black px-2 py-0.5 text-[10px] uppercase tracking-widest font-medium">
                        {pub.status}
                      </span>
                    </div>
                    <h3
                      className="text-xl md:text-2xl font-black uppercase leading-tight"
                      style={{ fontFamily: "'Big Shoulders Display', sans-serif" }}
                    >
                      {pub.title}
                    </h3>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs uppercase tracking-widest text-black/40">{pub.venue}</div>
                    <div className="text-xs uppercase tracking-widest text-black/40 mt-1">{pub.year}</div>
                  </div>
                </div>
                <p className="text-black/60 text-sm md:text-base leading-relaxed max-w-3xl">{pub.abstract}</p>
              </div>
            </RevealBlock>
          ))}
        </div>
      </div>
    </section>
  );
}

function OngoingSection() {
  return (
    <section id="ongoing" className="bg-black text-white">
      <MarqueeRow text="ongoing  /  work in progress  /  active research  /" speed={50} />

      <div className="px-6 sm:px-10 md:px-14 pt-16 pb-20">
        <SlashHeading text="ongoing" />

        <div className="flex flex-col gap-12">
          {ONGOING.map((item, idx) => (
            <RevealBlock key={item.codename} delay={idx * 0.12}>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-6 border-b border-white/10 pb-12">
                <div>
                  <div
                    className="text-4xl md:text-5xl font-black uppercase text-white/20 leading-none tracking-tight mb-2"
                    style={{ fontFamily: "'Big Shoulders Display', sans-serif" }}
                  >
                    {item.codename}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-white/30">Started {item.started}</div>
                  {/* Progress bar */}
                  <div className="mt-6">
                    <div className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Progress</div>
                    <div className="w-full h-[2px] bg-white/10 relative">
                      <motion.div
                        className="h-full bg-white"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.progress}%` }}
                        viewport={{ once: false }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                      />
                    </div>
                    <div className="text-[10px] text-white/30 mt-1">{item.progress}%</div>
                  </div>
                </div>
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((t) => <SectionTag key={t} label={t} />)}
                  </div>
                  <h3
                    className="text-2xl md:text-3xl font-black uppercase leading-tight mb-4"
                    style={{ fontFamily: "'Big Shoulders Display', sans-serif" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-white/50 text-sm md:text-base leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </RevealBlock>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArchivesSection() {
  return (
    <section id="archives" className="bg-white text-black">
      <MarqueeRow text="archives  /  past work  /  legacy projects  /" bgBlack={false} speed={42} reverse />

      <div className="px-6 sm:px-10 md:px-14 pt-16 pb-20">
        <SlashHeading text="archives" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black">
          {ARCHIVES.map((a, idx) => (
            <RevealBlock key={a.title} delay={idx * 0.08}>
              <div className="bg-white p-6 md:p-8 h-full hover:bg-neutral-50 transition-colors duration-300 group">
                <div className="flex items-start justify-between mb-6">
                  <span
                    className="text-3xl md:text-4xl font-black text-black/10 leading-none"
                    style={{ fontFamily: "'Big Shoulders Display', sans-serif" }}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-black/40">{a.year}</span>
                </div>
                <h3
                  className="text-xl md:text-2xl font-black uppercase leading-tight mb-3"
                  style={{ fontFamily: "'Big Shoulders Display', sans-serif" }}
                >
                  {a.title}
                </h3>
                <p className="text-black/60 text-sm leading-relaxed mb-4">{a.desc}</p>
                <div className="flex flex-wrap gap-1">
                  {a.tags.map((t) => <SectionTag key={t} label={t} />)}
                </div>
              </div>
            </RevealBlock>
          ))}
        </div>
      </div>
    </section>
  );
}

function LabFooter() {
  return (
    <footer className="bg-black text-white border-t border-white/10 px-6 sm:px-10 md:px-14 py-12">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div>
          <div
            className="text-5xl md:text-7xl font-black uppercase leading-none tracking-tight text-white/10 mb-4"
            style={{ fontFamily: "'Big Shoulders Display', sans-serif" }}
          >
            PR3THIV.LAB
          </div>
          <p className="text-white/40 text-sm max-w-md">
            Research, experiments, and projects by Prethiv Sriman D — AI researcher and developer based in Chennai, India.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-right">
          <Link href="/" className="text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors">
            ← Portfolio Home
          </Link>
          <a href="mailto:prethivsrimand@gmail.com" className="text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors">
            Contact
          </a>
          <span className="text-[10px] text-white/20 uppercase tracking-wider">© 2025 Prethiv Sriman D</span>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────── page ─────────────────────── */

export default function LabPage() {
  const lenis = useLenis();

  // Ensure Lenis is running when entering the lab page
  // (the home page may have stopped it during its snap-scroll sequence)
  useEffect(() => {
    if (!lenis) return;
    lenis.start();
    // Sync Framer Motion with Lenis scroll events
    const onScroll = () => window.dispatchEvent(new Event('scroll'));
    lenis.on('scroll', onScroll);
    return () => {
      lenis.off('scroll', onScroll);
    };
  }, [lenis]);

  return (
    <main className="bg-white" style={{ cursor: 'auto' }}>
      <style>{`
        .lab-page, .lab-page * {
          cursor: auto !important;
        }
        .lab-page a, .lab-page button, .lab-page [role="button"], .lab-page [onClick] {
          cursor: pointer !important;
        }
      `}</style>
      <div className="lab-page">
      <LabHeader />
      <HeroSection />
      <FeaturedProjects />
      <ExperimentsSection />
      <PublicationsSection />
      <OngoingSection />
      <ArchivesSection />
      <LabFooter />
      </div>
    </main>
  );
}
