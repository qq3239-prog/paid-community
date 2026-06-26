"use client"

import { useEffect, useRef, useState } from "react"

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right"
  duration?: number
  once?: boolean
}

const dirMap = {
  up: "translateY(48px)",
  down: "translateY(-48px)",
  left: "translateX(48px)",
  right: "translateX(-48px)",
}

/**
 * 2026 Scroll-Driven Reveal
 * 用 IntersectionObserver 在元素进入视口时触发动画
 */
export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 0.8,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) obs.unobserve(el)
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [once])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : dirMap[direction],
        transition: `opacity ${duration}s cubic-bezier(.16,1,.3,1), transform ${duration}s cubic-bezier(.16,1,.3,1)`,
        transitionDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  )
}
