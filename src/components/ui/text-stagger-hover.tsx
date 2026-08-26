"use client";
import * as React from "react";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

export type StaggerDirection = "start" | "middle" | "end";

export interface StaggerOptions {
  direction?: StaggerDirection;
  staggerValue?: number;
  totalItems: number;
  index: number;
}

export function setStaggerDirection({
  direction = "start",
  staggerValue = 0.02,
  totalItems,
  index,
}: StaggerOptions): number {
  switch (direction) {
    case "start":
      return index * staggerValue;

    case "middle":
      const middleIndex = Math.floor(totalItems / 2);
      return Math.abs(index - middleIndex) * staggerValue;

    case "end":
      return (totalItems - 1 - index) * staggerValue;

    default:
      return 0;
  }
}

export interface SplitTextResult {
  words: string[];
  characters: string[];
  wordCount: number;
  characterCount: number;
}

export function splitText(text: string): SplitTextResult {
  if (!text?.trim()) {
    return {
      words: [],
      characters: [],
      wordCount: 0,
      characterCount: 0,
    };
  }

  const words = text.split(" ").map((word) => word.concat(" "));
  const characters = words.map((word) => word.split("")).flat(1);

  return {
    words,
    characters,
    wordCount: words.length,
    characterCount: characters.length,
  };
}

export type AnimationT =
  | "left"
  | "right"
  | "top"
  | "bottom"
  | "z"
  | "blur"
  | undefined;

export function useAnimationVariants(animation?: AnimationT) {
  return React.useMemo(
    () => ({
      hidden: {
        x: animation === "left" ? "-100%" : animation === "right" ? "100%" : 0,
        y: animation === "top" ? "-100%" : animation === "bottom" ? "100%" : 0,
        scale: animation === "z" ? 0.95 : 1,
        filter: animation === "blur" ? "blur(10px)" : "blur(0px)",
        opacity: 0,
      },
      visible: {
        x: 0,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        opacity: 1,
      },
    }),
    [animation]
  );
}

interface TextStaggerHoverProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

interface TextStaggerHoverContextValue {
  isMouseIn: boolean;
}
const TextStaggerHoverContext = React.createContext<
  TextStaggerHoverContextValue | undefined
>(undefined);

function useTextStaggerHoverContext() {
  const context = React.useContext(TextStaggerHoverContext);
  if (!context) {
    throw new Error(
      "useTextStaggerHoverContext must be used within an TextStaggerHoverContextProvider"
    );
  }
  return context;
}

export const TextStaggerHover = ({
  as: Component = "span",
  children,
  className,
  ...props
}: TextStaggerHoverProps) => {
  const [isMouseIn, setIsMouseIn] = React.useState<boolean>(false);
  const handleMouse = () => setIsMouseIn((prevState) => !prevState);

  const Comp = Component as any;

  return (
    <TextStaggerHoverContext.Provider value={{ isMouseIn }}>
      <Comp
        className={cn("relative inline-block overflow-hidden", className)}
        {...props}
        onMouseEnter={handleMouse}
        onMouseLeave={handleMouse}
      >
        {children}
      </Comp>
    </TextStaggerHoverContext.Provider>
  );
};

interface TextStaggerHoverContentProps extends HTMLMotionProps<"span"> {
  animation?: AnimationT;
  staggerDirection?: StaggerDirection;
  staggerValue?: number;
}

export const TextStaggerHoverActive = ({
  animation,
  staggerDirection = "start",
  staggerValue = 0.02,
  children,
  className,
  transition,
  ...props
}: TextStaggerHoverContentProps) => {
  const { characters, characterCount } = splitText(String(children));
  const animationVariants = useAnimationVariants(animation);
  const { isMouseIn } = useTextStaggerHoverContext();

  return (
    <span className={cn("inline-block text-nowrap", className)}>
      {characters.map((char, index) => {
        const staggerDelay = setStaggerDirection({
          direction: staggerDirection,
          totalItems: characterCount,
          index,
          staggerValue: staggerValue,
        });

        return (
          <motion.span
            className="inline-block"
            key={`${char}-${index}`}
            variants={animationVariants}
            animate={isMouseIn ? "hidden" : "visible"}
            transition={{
              delay: staggerDelay,
              ease: [0.25, 0.46, 0.45, 0.94],
              duration: 0.3,
              ...transition,
            }}
            {...props}
          >
            {char}
            {char === " " && index < characters.length - 1 && <>&nbsp;</>}
          </motion.span>
        );
      })}
    </span>
  );
};

export const TextStaggerHoverHidden = ({
  animation,
  staggerDirection = "start",
  staggerValue = 0.02,
  children,
  className,
  transition,
  ...props
}: TextStaggerHoverContentProps) => {
  const { characters, characterCount } = splitText(String(children));
  const animationVariants = useAnimationVariants(animation);
  const { isMouseIn } = useTextStaggerHoverContext();

  return (
    <span
      className={cn(
        "inline-block absolute left-0 top-0 text-nowrap",
        className
      )}
    >
      {characters.map((char, index) => {
        const staggerDelay = setStaggerDirection({
          direction: staggerDirection,
          totalItems: characterCount,
          index,
          staggerValue: staggerValue,
        });
        
        return (
          <motion.span
            className="inline-block"
            key={`${char}-${index}`}
            variants={animationVariants}
            animate={isMouseIn ? "visible" : "hidden"}
            transition={{
              delay: staggerDelay,
              ease: [0.25, 0.46, 0.45, 0.94],
              duration: 0.3,
              ...transition,
            }}
            {...props}
          >
            {char}
            {char === " " && index < characters.length - 1 && <>&nbsp;</>}
          </motion.span>
        );
      })}
    </span>
  );
};
