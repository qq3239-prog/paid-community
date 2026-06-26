"use client"

import { useRef, useState, useCallback, type ReactNode } from "react"

interface TiltCardProps {
  children: ReactNode
  className?: string
  intensity?: number
  glare?: boolean
}

/**
 * 2026 视差倾斜卡片
 * 鼠标悬停时产生 3D 透视倾斜 + 可选反光
 */
export function TiltCard({ children, className = "", intensity = 8, glare = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<React.CSSProperties>({})
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({})

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    setStyle({
      transform: `perspective(1200px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: "transform 0.1s ease-out",
    })

    if (glare) {
      setGlareStyle({
        background: `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.12), transparent 60%)`,
        opacity: 1,
      })
    }
  }, [intensity, glare])

  const onLeave = useCallback(() => {
    setStyle({
      transform: "perspective(1200px) rotateY(0) rotateX(0) scale3d(1, 1, 1)",
      transition: "transform 0.6s cubic-bezier(.16,1,.3,1)",
    })
    setGlareStyle({ opacity: 0, transition: "opacity 0.4s ease" })
  }, [])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} style={style} onMouseMove={onMove} onMouseLeave={onLeave}>
      {glare && (
        <div className="absolute inset-0 pointer-events-none z-10" style={glareStyle} />
      )}
      {children}
    </div>
  )
}
