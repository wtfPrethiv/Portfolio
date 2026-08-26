"use client"

import { useState, useEffect } from "react"
import { motion, stagger, useAnimate } from "framer-motion"
import type { AnimationOptions } from "framer-motion"

interface TextProps {
  label: string
  reverse?: boolean
  transition?: AnimationOptions
  staggerDuration?: number
  staggerFrom?: "first" | "last" | "center" | number
  className?: string
  onClick?: () => void
  /** When this flips to `true`, the swap animation fires once automatically. */
  trigger?: boolean
}

const LetterSwapForward = ({
  label,
  reverse = true,
  transition = {
    type: "spring",
    duration: 0.7,
  },
  staggerDuration = 0.03,
  staggerFrom = "first",
  className,
  onClick,
  trigger = false,
  ...props
}: TextProps) => {
  const [scope, animate] = useAnimate()
  const [blocked, setBlocked] = useState(false)

  const runAnimation = () => {
    if (blocked) return
    setBlocked(true)

    const mergeTransition = (baseTransition: AnimationOptions) => ({
      ...baseTransition,
      delay: stagger(staggerDuration, {
        from: staggerFrom,
      }),
    })

    animate(
      ".letter",
      { y: reverse ? "100%" : "-100%" },
      mergeTransition(transition)
    ).then(() => {
      animate(
        ".letter",
        { y: 0 },
        { duration: 0 }
      ).then(() => {
        setBlocked(false)
      })
    })

    animate(
      ".letter-secondary",
      { top: "0%" },
      mergeTransition(transition)
    ).then(() => {
      animate(
        ".letter-secondary",
        { top: reverse ? "-100%" : "100%" },
        { duration: 0 }
      )
    })
  }

  // Scroll-triggered: fire once when `trigger` flips to true
  useEffect(() => {
    if (trigger) {
      runAnimation()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger])

  return (
    <span
      className={`flex justify-center items-center relative overflow-hidden ${className} `}
      onMouseEnter={runAnimation}
      onClick={onClick}
      ref={scope}
      {...props}
    >
      <span className="sr-only">{label}</span>

      {label.split("").map((letter: string, i: number) => {
        return (
          <span
            className="whitespace-pre relative flex"
            key={i}
            aria-hidden={true}
          >
            <motion.span className={`relative letter`} style={{ top: 0 }}>
              {letter}
            </motion.span>
            <motion.span
              className="absolute letter-secondary"
              style={{ top: reverse ? "-100%" : "100%" }}
            >
              {letter}
            </motion.span>
          </span>
        )
      })}
    </span>
  )
}

export default LetterSwapForward
