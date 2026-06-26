"use client"

import { useRef, useEffect, type ReactNode } from "react"

interface MagneticProps {
  children: ReactNode
  strength?: number
  className?: string
}

/**
 * 2026 磁吸按钮
 * 按钮轻微跟随鼠标位置偏移
 */
export function Magnetic({ children, strength = 0.3, className = "" }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    function onMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      el!.style.transform = `translate(${x * strength}px, ${y * strength}px)`
      el!.style.transition = "transform 0.15s ease-out"
    }

    function onLeave() {
      el!.style.transform = "translate(0, 0)"
      el!.style.transition = "transform 0.5s cubic-bezier(.16,1,.3,1)"
    }

    el.addEventListener("mousemove", onMove)
    el.addEventListener("mouseleave", onLeave)
    return () => {
      el.removeEventListener("mousemove", onMove)
      el.removeEventListener("mouseleave", onLeave)
    }
  }, [strength])

  return (
    <div ref={ref} className={`inline-block magnetic ${className}`}>
      {children}
    </div>
  )
}
