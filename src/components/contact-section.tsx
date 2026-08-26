'use client';
import {
  ArrowUpRight,
  ArrowDownRight,
  Instagram,
  Github,
  Linkedin,
} from 'lucide-react';
import { motion } from 'framer-motion';
import ScrollStaggerText from './scroll-stagger-text'; 

export default function ContactSection({ isActive }: { isActive: boolean }) {
  return (
    <section
      id="contact"
      className="relative h-screen flex flex-col justify-between bg-[#ffffff] text-black overflow-hidden px-4 sm:px-8 md:px-12 py-8"
    >
 
      <div className="pt-6 sm:pt-10 flex-none">
        <h2 className="font-headline text-[10vw] font-black uppercase leading-[0.8] tracking-tighter flex flex-col items-start">

          <ScrollStaggerText 
            trigger={isActive} 
            text="FEEL FREE TO" 
            animation="bottom" 
            staggerValue={0.05} 
            className="inline-block"
          />
          <ScrollStaggerText 
            trigger={isActive} 
            text="STALK MY" 
            animation="bottom" 
            staggerValue={0.05} 
            className="inline-block"
          />
          <ScrollStaggerText 
            trigger={isActive} 
            text="INBOX !!!" 
            animation="bottom" 
            staggerValue={0.05} 
            className="inline-block"
          />
        </h2>
      </div>


      <motion.div 
        className="flex-1 flex flex-col justify-center"
        initial={{ opacity: 0, y: 30 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
      >
        <div className="space-y-6 pt-7">
          
          <a
            href="/resume.pdf"
            download
            className="group relative flex items-center gap-3 text-xl sm:text-2xl font-bold w-fit pb-1"
          >
            <ArrowDownRight className="w-6 h-6" />
            <ScrollStaggerText 
                trigger={isActive} 
                text="DOWNLOAD RESUME" 
                animation="left" 
                staggerValue={0.02} 
            />
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />
          </a>

          <a
            href="https://instagram.com/_prethiv"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center gap-3 text-xl sm:text-2xl font-bold w-fit pb-1"
          >
            <Instagram className="w-6 h-6" />
            <ScrollStaggerText 
                trigger={isActive} 
                text="INSTAGRAM" 
                animation="left" 
                staggerValue={0.02} 
            />
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />
          </a>

          <a
            href="https://github.com/wtfPrethiv"
            target="_blank"
            className="group relative flex items-center gap-3 text-xl sm:text-2xl font-bold w-fit pb-1"
          >
            <Github className="w-6 h-6" />
            <ScrollStaggerText 
                trigger={isActive} 
                text="GITHUB" 
                animation="left" 
                staggerValue={0.02} 
            />
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />
          </a>

          <a
            href="https://linkedin.com/in/prethiv-sriman"
            target="_blank"
            className="group relative flex items-center gap-3 text-xl sm:text-2xl font-bold w-fit pb-1"
          >
            <Linkedin className="w-6 h-6" />
            <ScrollStaggerText 
                trigger={isActive} 
                text="LINKEDIN" 
                animation="left" 
                staggerValue={0.02} 
            />
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />
          </a>
        </div>
      </motion.div>

      <motion.div 
        className="flex-none w-full flex flex-col items-end justify-end pb-6 md:pb-10"
        initial={{ opacity: 0, y: 30 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
      >
        
        <a 
          href="mailto:prethivshoba@gmail.com"
          className="group w-full md:w-auto flex flex-col items-end"
        >
          <div className="flex items-start gap-2 md:gap-4">
            <ScrollStaggerText 
                trigger={isActive} 
                text="GIVE ME DAT INTERNSHIP HERE"
                animation="bottom"
                staggerValue={0.09}
                className="text-[8vw] md:text-[5vw] font-black uppercase leading-[0.85] tracking-tighter"
            />
            <ArrowUpRight className="w-6 h-6 md:w-10 md:h-10 relative top-1 md:top-2" />
          </div>
          
          <div className="w-full h-[3px] md:h-[5px] bg-black mt-2 md:mt-4 transition-all duration-300 group-hover:h-[8px]" />
        </a>
      </motion.div>

    </section>
  );
}