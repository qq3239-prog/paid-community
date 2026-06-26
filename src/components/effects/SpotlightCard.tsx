"use client"

import { useRef, useCallback, type ReactNode } from "react"

interface SpotlightCardProps {
  children: ReactNode
  className?: string
  color?: string
}

/**
 * 2026 聚光灯卡片
 * 鼠标悬停时卡片上出现跟随光标的渐变聚光灯
 */
export function SpotlightCard({
  children,
  className = "",
  color = "var(--accent)",
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current
    const overlay = overlayRef.current
    if (!el || !overlay) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    overlay.style.background = `radial-gradient(circle 280px at ${x}% ${y}%, ${color}15, transparent 60%)`
    overlay.style.opacity = "1"
  }, [color])

  const onLeave = useCallback(() => {
    if (overlayRef.current) {
      overlayRef.current.style.opacity = "0"
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-500"
        style={{ opacity: 0 }}
      />
      {children}
    </div>
  )
}
