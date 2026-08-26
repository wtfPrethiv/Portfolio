"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  TextStaggerHover,
  TextStaggerHoverActive,
  TextStaggerHoverHidden,
} from "@/components/ui/text-stagger-hover";

type MenuProps = {
  onClose: () => void;
  sectionRefs: {
    [key: string]: React.RefObject<HTMLElement | null>;
  };
  onNavigate: (id: string) => void;  
  isDarkTheme: boolean;  
};

const menuItems = [
  { id: "HOME", label: "Home" },
  { id: "PROJECTS", label: "Projects" },
  { id: "CONTACT", label: "Contact" },
];

const containerVars = {
  initial: {
    transition: {
      staggerChildren: 0.09,
      staggerDirection: -1,
    },
  },
  open: {
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.09,
      staggerDirection: 1,
    },
  },
  exit: {
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.09,
      staggerDirection: -1,
    },
  },
};

const mobileLinkVars = {
  initial: {
    y: "30vh",
    transition: { duration: 0.4, ease: [0.37, 0, 0.63, 1] },
  },
  open: { y: 0, transition: { ease: [0, 0.55, 0.45, 1], duration: 0.7 } },
};

const MenuLink = ({
  label,
  onClick,
  isDarkTheme,
}: {
  label: string;
  onClick: () => void;
  isDarkTheme: boolean;
}) => {
  
  return (
    <div
      onClick={onClick}
      className="cursor-pointer relative overflow-hidden leading-none"
    >
      <TextStaggerHover>
        <TextStaggerHoverActive
          animation="top"
          staggerDirection="middle"
          staggerValue={0.025}
          className={cn(
            "font-sans block",
            isDarkTheme ? "text-white" : "text-black"
          )}
        >
          {label}
        </TextStaggerHoverActive>
        <TextStaggerHoverHidden
          animation="bottom"
          staggerDirection="middle"
          staggerValue={0.025}
          className={cn(
            "font-serif italic block",
            isDarkTheme ? "text-white" : "text-black"
          )}
        >
          {label}
        </TextStaggerHoverHidden>
      </TextStaggerHover>
    </div>
  );
};

const MenuInfoItem = ({
  number,
  title,
  children,
  isDarkTheme,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
  isDarkTheme: boolean;
}) => (
  <div className="text-sm">
    <div
      className={cn(
        "flex items-baseline gap-2",
        isDarkTheme ? "text-neutral-400" : "text-neutral-500"
      )}
    >
      <span>{number}</span>
      <h3
        className={cn(
          "font-semibold",
          isDarkTheme ? "text-white" : "text-black"
        )}
      >
        {title}
      </h3>
    </div>
    <div
      className={cn(
        "mt-1 flex flex-col",
        isDarkTheme ? "text-neutral-300" : "text-neutral-600"
      )}
    >
      {children}
    </div>
  </div>
);

const Menu = ({ onClose, sectionRefs, onNavigate, isDarkTheme }: MenuProps) => {

  const handleScrollTo = (id: string) => {
    onNavigate(id);

    document.body.style.overflow = "";

    sectionRefs[id]?.current?.scrollIntoView({ behavior: "smooth" });

    onClose();
  };

  return (
    <div className="relative flex h-full w-full flex-col items-start justify-between p-8">
      <motion.nav
        variants={containerVars}
        initial="initial"
        animate="open"
        exit="initial"
        className="flex flex-col text-7xl gap-15 mt-20"
      >
        {menuItems.map((item) => (
          <div className="overflow-hidden" key={item.label}>
            <motion.div variants={mobileLinkVars}>
              <MenuLink
                label={item.label}
                onClick={() => handleScrollTo(item.id)}
                isDarkTheme={isDarkTheme}
              />
            </motion.div>
          </div>
        ))}
      </motion.nav>

      <div className="absolute top-24 right-8 flex flex-col gap-8">
        <MenuInfoItem number="01" title="Archives" isDarkTheme={isDarkTheme}>
          <a href="#" className="hover:underline">
            Blogs
          </a>
          <Link href="/lab" className="hover:underline" onClick={onClose}>
            LAB
          </Link>
          <a href="#" className="hover:underline">
            Blender Renders
          </a>
          <a href="#" className="hover:underline">
            Prethiv.txt
          </a>
          <a href="#" className="hover:underline">
            [ /Socials ]
          </a>
        </MenuInfoItem>

        <MenuInfoItem number="02" title="Builds" isDarkTheme={isDarkTheme}>
          <a href="#" className="hover:underline">
            [ v1 ]
          </a>
          <a href="#" className="hover:underline">
            [ prof. ]
          </a>
        </MenuInfoItem>

        <MenuInfoItem number="03" title="Social" isDarkTheme={isDarkTheme}>
          <a href="#" className="hover:underline">
            LinkedIn
          </a>
          <a href="#" className="hover:underline">
            Twitter
          </a>
        </MenuInfoItem>
      </div>

      <footer
        className={cn(
          "w-full text-xs",
          isDarkTheme ? "text-neutral-400" : "text-neutral-500"
        )}
      >
        <div className="flex justify-between items-end">
          <div>
            <p>.LOG</p>
            <p>Last Update: 29 DEC 25</p>
            <p>Version: Latest@2.0.0 / prod</p>
          </div>
          {/* {menuFooterImage && (
            <div className="flex items-end gap-4">
              <p className="max-w-[150px]">
                I also do blender stuff check it Outtt !!!!!.
              </p>
              <div className="w-[200px] h-[120px] relative overflow-hidden rounded-md">
                <Image
                  src={menuFooterImage.imageUrl}
                  alt={menuFooterImage.description}
                  fill
                  data-ai-hint={menuFooterImage.imageHint}
                  className="object-cover"
                />
              </div>
            </div>
          )} */}
        </div>
        <div className="flex justify-center items-center mt-4 gap-4">
          <a
            href="#"
            className={isDarkTheme ? "hover:text-white" : "hover:text-black"}
          >
            wtfPrethiv
          </a>
          <span>|</span>
          <a
            href="#"
            className={isDarkTheme ? "hover:text-white" : "hover:text-black"}
          >
            Double00
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Menu;
