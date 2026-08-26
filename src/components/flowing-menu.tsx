import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';

interface MenuItemProps {
  link: string;
  text: string;
  image: string;
  description?: string;
  year?: string;
  tags?: string[];
  isOpen?: boolean;
  onClick?: () => void;
}

interface FlowingMenuProps {
  items?: Omit<MenuItemProps, 'isOpen' | 'onClick'>[];
}

const FlowingMenu: React.FC<FlowingMenuProps> = ({ items = [] }) => {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const handleItemClick = (idx: number) => {
    setExpandedIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="w-full h-full bg-black">
      <nav className="flex flex-col w-full m-0 p-0">
        {items.map((item, idx) => (
          <MenuItem 
            key={idx} 
            {...item} 
            isOpen={expandedIdx === idx} 
            onClick={() => handleItemClick(idx)}
          />
        ))}
      </nav>
    </div>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({ link, text, image, description, year, tags, isOpen, onClick }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const overlayInnerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const contentInnerRef = useRef<HTMLDivElement>(null);
  
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const animationDefaults = { duration: 0.6, ease: 'expo' };

  const handleScrollToCenter = () => {
    if (!headerRef.current) return;
    const rect = headerRef.current.getBoundingClientRect();
    const elementTop = rect.top + window.scrollY;
    const elementHeight = rect.height;
    const viewportHeight = window.innerHeight;
    const targetY = elementTop - (viewportHeight / 2) + (elementHeight / 2);

    const currentScroll = { y: window.scrollY };
    
    gsap.to(currentScroll, {
      y: targetY,
      duration: 1.0,
      ease: 'power4.inOut',
      onUpdate: () => {
        window.scrollTo(0, currentScroll.y);
      }
    });
  };

  const handleClick = () => {
    if (onClick) onClick();
    if (!isOpen) {
      handleScrollToCenter();
    }
  };

  useEffect(() => {
    if (isOpen) {
      gsap.to(contentRef.current, {
        height: 'auto',
        duration: 0.6,
        ease: 'power3.inOut',
      });
      gsap.fromTo(
        contentInnerRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, delay: 0.2, ease: 'power2.out' }
      );
    } else {
      gsap.to(contentRef.current, {
        height: 0,
        duration: 0.5,
        ease: 'power3.inOut',
      });
    }
  }, [isOpen]);

  const findClosestEdge = (mouseX: number, mouseY: number, width: number, height: number): 'top' | 'bottom' => {
    const topEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY, 2);
    const bottomEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY - height, 2);
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
  };

  const handleMouseEnter = (ev: React.MouseEvent<HTMLDivElement>) => {
    if (!headerRef.current || !overlayRef.current || !overlayInnerRef.current) return;
    tlRef.current?.kill();
    const rect = headerRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);
    
    const tl = gsap.timeline({ defaults: animationDefaults });
    tl.set(overlayRef.current, { y: edge === 'top' ? '-101%' : '101%' })
      .set(overlayInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' })
      .to([overlayRef.current, overlayInnerRef.current], { y: '0%' });
    tlRef.current = tl;
  };

  const handleMouseLeave = (ev: React.MouseEvent<HTMLDivElement>) => {
    if (!headerRef.current || !overlayRef.current || !overlayInnerRef.current) return;
    tlRef.current?.kill();
    const rect = headerRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

    const tl = gsap.timeline({ defaults: animationDefaults });
    tl.to(overlayRef.current, { y: edge === 'top' ? '-101%' : '101%' })
      .to(overlayInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' });
    tlRef.current = tl;
  };

  return (
    <motion.div
      ref={itemRef}
      className="w-full bg-black shadow-[0_-1px_0_0_#333] first:shadow-none last:shadow-[0_-1px_0_0_#333,0_1px_0_0_#333]"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <div 
        className="relative overflow-hidden cursor-pointer z-10" 
        ref={headerRef}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="group flex items-center justify-between px-8 py-10 relative uppercase font-semibold text-white">
          <span className="text-3xl relative z-10">{text}</span>
          {year && (
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-500 text-xs font-normal z-10">
              {year}
            </span>
          )}
          {tags && tags.length > 0 && (
            <div className="flex gap-2 relative z-10">
              {tags.map((tag, i) => (
                <span key={i} className="border border-gray-700 rounded-md px-2 py-1 text-[10px] text-gray-300 uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none bg-white translate-y-[101%] z-20" ref={overlayRef}>
          <div className="relative h-full w-full flex items-center justify-between px-8" ref={overlayInnerRef}>
            <span className="text-3xl font-semibold uppercase text-black">{text}</span>
            {year && (
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-black text-xs font-normal">
                {year}
              </span>
            )}
            {tags && tags.length > 0 && (
              <div className="flex gap-2">
                {tags.map((tag, i) => (
                  <span key={i} className="border border-black rounded-md px-2 py-1 text-[10px] text-black uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div 
        ref={contentRef} 
        className="h-0 overflow-hidden bg-black"
      >
        <div ref={contentInnerRef} className="p-8 flex flex-col md:flex-row gap-8 opacity-0">
          <div className="w-full md:w-[400px] h-64 shrink-0 overflow-hidden rounded-lg">
             <img src={image} alt={text} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
          </div>

          <div className="flex flex-col justify-between items-start flex-grow">
             <div>
                <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mb-6">
                   {description || "No description available for this project. Check out the case study to learn more about our process and results."}
                </p>
             </div>
             
             <a 
               href={link} 
               target="_blank"
               rel="noreferrer"
               className="px-6 py-3 border border-white text-white rounded-full text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300 self-end"
             >
               Launch Website
             </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FlowingMenu;