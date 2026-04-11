'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  AnimatePresence,
  motion,
  useScroll,
  useMotionValueEvent,
  useTransform,
  useSpring,
} from 'framer-motion';
import Preloader from '@/components/preloader';
import Header from '@/components/header';
import WhoAmISection from '@/components/who-am-i-section';
import ProjectsSection from '@/components/projects-section';
import ContactSection from '@/components/contact-section';
import HeroScrollTransition from '@/components/hero-scroll-transition';
import CustomCursor from '@/components/custom-cursor';
import { useIdle } from '@/hooks/use-idle';
import { useInView } from '@/hooks/use-in-view';
import PixelTrail from '@/components/PixelTrail';

const sectionRefs = {
  HOME:     React.createRef<HTMLDivElement>(),
  ABOUT:    React.createRef<HTMLDivElement>(),
  PROJECTS: React.createRef<HTMLDivElement>(),
  CONTACT:  React.createRef<HTMLDivElement>(),
};

export default function Home() {
  const [isLoading,      setIsLoading]      = useState(true);
  const [isContentReady, setIsContentReady] = useState(false);
  const [isHeroReady,    setIsHeroReady]    = useState(false);
  const [isMenuOpen,     setIsMenuOpen]     = useState(false);
  const [isOnTop,        setIsOnTop]        = useState(true);
  const [activeSection,  setActiveSection]  = useState('HOME');

  const isIdle       = useIdle(3000);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY }  = useScroll();

  const { scrollYProgress } = useScroll({
    target: sectionRefs.PROJECTS,
    offset: ['end end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 20,
    stiffness: 100,
    restDelta: 0.001,
  });

  const contactY     = useTransform(smoothProgress, [0, 1], ['25%', '0%']);
  const contactScale = useTransform(smoothProgress, [0, 1], [0.95, 1]);

  const isHeroInView     = useInView(sectionRefs.HOME,     { threshold: 0.2 });
  const isAboutInView    = useInView(sectionRefs.ABOUT,    { threshold: 0.1 });
  const isProjectsInView = useInView(sectionRefs.PROJECTS, { threshold: 0.2 });
  const isContactInView  = useInView(sectionRefs.CONTACT,  { threshold: 0.5 });

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (typeof window === 'undefined') return;
    const threshold = window.innerHeight * 0.1;
    if (latest < threshold && !isOnTop) setIsOnTop(true);
    else if (latest >= threshold && isOnTop) setIsOnTop(false);
  });

  useEffect(() => {
    if (isHeroInView)     setActiveSection('HOME');
    else if (isAboutInView)    setActiveSection('ABOUT');
    else if (isProjectsInView) setActiveSection('PROJECTS');
    else if (isContactInView)  setActiveSection('CONTACT');
  }, [isHeroInView, isAboutInView, isProjectsInView, isContactInView]);

  return (
    <main ref={containerRef} className="bg-black relative">
      {!isLoading && <CustomCursor isIdle={isIdle} />}

      <AnimatePresence>
        {isOnTop && !isMenuOpen && (
          <motion.div
            key="blob-cursor"
            initial={{ opacity: 0 }}
            animate={{ opacity: isIdle ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="pointer-events-none fixed inset-0 z-[1] mix-blend-difference"
          >
            <PixelTrail
              gridSize={100}
              trailSize={0.1}
              maxAge={450}
              interpolate={5}
              color="#ffffff"
              gooeyFilter={{ id: 'custom-goo-filter', strength: 10 }}
              className="w-full h-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading && (
        <Preloader
          onContentReady={() => setIsContentReady(true)}
          onComplete={() => {
            setIsLoading(false);
            setIsHeroReady(true);
          }}
        />
      )}

      {isContentReady && (
        <div>
          <Header
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            activeSection={activeSection}
            sectionRefs={sectionRefs}
          />

          <div ref={sectionRefs.HOME}>
            <HeroScrollTransition isMenuOpen={isMenuOpen} isReady={isHeroReady} />
          </div>

          <div ref={sectionRefs.ABOUT} className="relative z-20 bg-black">
            <WhoAmISection />
          </div>

          <div className="relative bg-black">
            <div
              ref={sectionRefs.PROJECTS}
              className="relative z-20 bg-black"
              style={{ marginBottom: '100vh' }}
            >
              <ProjectsSection />
            </div>

            <div
              ref={sectionRefs.CONTACT}
              className="sticky bottom-0 left-0 h-screen w-full z-10 overflow-hidden bg-[#ffffff]"
            >
              <motion.div
                className="h-full w-full"
                style={{ y: contactY, scale: contactScale }}
              >
                <ContactSection isActive={isContactInView} />
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}