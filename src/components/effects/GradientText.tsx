"use client"

import { type ReactNode } from "react"

interface GradientTextProps {
  children: ReactNode
  className?: string
  colors?: string[]
  speed?: number
}

/**
 * 2026 流动渐变色文字
 */
export function GradientText({
  children,
  className = "",
  colors = ["#00E0C7", "#4D7CFF", "#A78BFA"],
  speed = 6,
}: GradientTextProps) {
  const stops = colors.join(", ")
  return (
    <span
      className={className}
      style={{
        backgroundImage: `linear-gradient(135deg, ${stops})`,
        backgroundSize: "200% 200%",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
        WebkitTextFillColor: "transparent",
        animation: `gradientShift ${speed}s ease-in-out infinite alternate`,
      }}
    >
      {children}
    </span>
  )
}
