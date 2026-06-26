"use client"

import { useEffect, useRef } from "react"

/**
 * 2026 浮动渐变光球
 * 大背景中缓慢漂移的渐变光球
 */
export function FloatingOrbs() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let t = 0
    let raf: number

    function animate() {
      t += 0.002
      if (el) {
        el.style.setProperty("--orb-x1", `${50 + Math.sin(t * 0.7) * 25}%`)
        el.style.setProperty("--orb-y1", `${50 + Math.cos(t * 0.9) * 20}%`)
        el.style.setProperty("--orb-x2", `${50 + Math.cos(t * 0.6) * 30}%`)
        el.style.setProperty("--orb-y2", `${50 + Math.sin(t * 0.8) * 25}%`)
        el.style.setProperty("--orb-x3", `${50 + Math.sin(t * 0.5 + 1) * 28}%`)
        el.style.setProperty("--orb-y3", `${50 + Math.cos(t * 0.7 + 1) * 22}%`)
      }
      raf = requestAnimationFrame(animate)
    }

    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div ref={ref} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Orb 1 - warm amber */}
      <div
        className="absolute w-[min(60vw,700px)] aspect-square rounded-full blur-[120px] opacity-[0.07]"
        style={{
          background: "radial-gradient(circle, var(--accent), transparent 70%)",
          left: "var(--orb-x1, 50%)",
          top: "var(--orb-y1, 50%)",
          transform: "translate(-50%, -50%)",
        }}
      />
      {/* Orb 2 - cool */}
      <div
        className="absolute w-[min(50vw,500px)] aspect-square rounded-full blur-[100px] opacity-[0.05]"
        style={{
          background: "radial-gradient(circle, #4D7CFF, transparent 70%)",
          left: "var(--orb-x2, 50%)",
          top: "var(--orb-y2, 50%)",
          transform: "translate(-50%, -50%)",
        }}
      />
      {/* Orb 3 - warm accent */}
      <div
        className="absolute w-[min(40vw,400px)] aspect-square rounded-full blur-[90px] opacity-[0.06]"
        style={{
          background: "radial-gradient(circle, #FF6B9D, transparent 70%)",
          left: "var(--orb-x3, 50%)",
          top: "var(--orb-y3, 50%)",
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  )
}
