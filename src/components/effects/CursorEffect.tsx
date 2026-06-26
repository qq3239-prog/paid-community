"use client"

import { useEffect, useRef } from "react"

/**
 * 2026 自定义光标：大光晕跟随 + 小圆点
 * 暗色模式下光晕变 screen 混合模式
 */
export function CursorEffect() {
  const dotRef = useRef<HTMLDivElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const spot = spotRef.current
    if (!dot || !spot) return

    let x = 0, y = 0
    let sx = 0, sy = 0
    const SPEED = 0.12

    function onMove(e: MouseEvent) {
      x = e.clientX
      y = e.clientY
      // 小圆点即时跟随
      dot!.style.transform = `translate(${x - 4}px, ${y - 4}px)`
    }

    function animate() {
      sx += (x - sx) * SPEED
      sy += (y - sy) * SPEED
      spot!.style.transform = `translate(${sx - 160}px, ${sy - 160}px)`
      requestAnimationFrame(animate)
    }

    // 悬停可交互元素时放大圆点
    function onHover() { dot!.style.transform = `translate(${x - 4}px, ${y - 4}px) scale(2.5)` }
    function onLeave() { dot!.style.transform = `translate(${x - 4}px, ${y - 4}px) scale(1)` }

    document.addEventListener("mousemove", onMove, { passive: true })
    document.querySelectorAll("a, button, [role=button], .magnetic, input, textarea, select, summary").forEach(el => {
      el.addEventListener("mouseenter", onHover)
      el.addEventListener("mouseleave", onLeave)
    })

    const raf = requestAnimationFrame(animate)

    // 移动端彻底隐藏
    const mq = window.matchMedia("(pointer: coarse)")
    if (mq.matches) {
      dot.style.display = "none"
      spot.style.display = "none"
    }

    return () => {
      document.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      {/* 光晕 */}
      <div
        ref={spotRef}
        className="cursor-spot"
      />
      {/* 小圆点 */}
      <div
        ref={dotRef}
        className="cursor-dot"
      />
      {/* 全局噪点纹理 */}
      <div className="noise-overlay" />
    </>
  )
}
