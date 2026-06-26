"use client"

import { type ReactNode } from "react"

interface BreathingGlowProps {
  children: ReactNode
  className?: string
  color?: string
  size?: number
}

/**
 * 2026 呼吸光晕
 * CSS 动画脉冲光环，包裹按钮或卡片
 */
export function BreathingGlow({
  children,
  className = "",
  color = "var(--accent)",
  size = 24,
}: BreathingGlowProps) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span
        className="absolute inset-0 rounded-[inherit] opacity-60"
        style={{
          boxShadow: `0 0 ${size}px 0 ${color}, 0 0 ${size * 2}px 0 ${color}, inset 0 0 ${size}px 0 ${color}`,
          animation: `breathe 3s ease-in-out infinite`,
        }}
      />
      <style>{`
        @keyframes breathe {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.03); }
        }
      `}</style>
      {children}
    </span>
  )
}
