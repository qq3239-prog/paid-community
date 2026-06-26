"use client"

import { useRef, useEffect, useCallback } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  opacity: number
  hue: number
}

/**
 * 2026 反重力漂浮粒子 — 加重版
 */
export function AntiGravityParticles({
  count = 800,
  className = "",
}: {
  count?: number
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const rafRef = useRef<number>(0)

  const init = useCallback((w: number, h: number) => {
    const particles: Particle[] = []
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -Math.random() * 1.2 - 0.3,
        r: Math.random() * 4 + 2,
        opacity: Math.random() * 0.4 + 0.45,
        hue: 155 + Math.random() * 50,        // teal→blue 范围更广
      })
    }
    particlesRef.current = particles
  }, [count])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      const parent = canvas.parentElement!
      const w = parent.clientWidth
      const h = parent.clientHeight
      canvas.width = w * devicePixelRatio
      canvas.height = h * devicePixelRatio
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.scale(devicePixelRatio, devicePixelRatio)
      return { w, h }
    }

    let { w, h } = resize()
    init(w, h)
    let lastParticles = particlesRef.current

    const observer = new ResizeObserver(() => {
      const size = resize()
      w = size.w; h = size.h
    })
    observer.observe(canvas.parentElement!)

    function onMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }
    window.addEventListener("mousemove", onMove, { passive: true })

    function frame() {
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const mouseActive = mx > -999 && my > -999

      ctx!.clearRect(0, 0, w, h)

      for (const p of lastParticles) {
        p.vy += -0.018           // 更强的反重力
        p.vx += (Math.random() - 0.5) * 0.04

        if (mouseActive) {
          const dx = p.x - mx
          const dy = p.y - my
          const dist = Math.sqrt(dx * dx + dy * dy)
          const radius = 200       // 更大的推斥半径
          if (dist < radius && dist > 0) {
            const force = (1 - dist / radius) * 1.8
            p.vx += (dx / dist) * force
            p.vy += (dy / dist) * force
          }
        }

        p.vx *= 0.994
        p.vy *= 0.994

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (speed > 4) {
          p.vx = (p.vx / speed) * 4
          p.vy = (p.vy / speed) * 4
        }

        p.x += p.vx
        p.y += p.vy

        const margin = 60
        if (p.x < -margin) p.x = w + margin
        if (p.x > w + margin) p.x = -margin
        if (p.y < -margin) p.y = h + margin
        if (p.y > h + margin) p.y = -margin

        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)

        // 更大光晕：6倍半径，更亮核心
        const gradient = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6)
        const rgba = `hsla(${p.hue}, 90%, 72%, ${p.opacity})`
        const rgbaFade = `hsla(${p.hue}, 90%, 72%, 0)`
        gradient.addColorStop(0, rgba)
        gradient.addColorStop(0.15, `hsla(${p.hue}, 90%, 72%, ${p.opacity * 0.8})`)
        gradient.addColorStop(0.5, `hsla(${p.hue}, 85%, 68%, ${p.opacity * 0.35})`)
        gradient.addColorStop(1, rgbaFade)

        ctx!.fillStyle = gradient
        ctx!.fill()
      }

      rafRef.current = requestAnimationFrame(frame)
    }

    rafRef.current = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("mousemove", onMove)
      observer.disconnect()
    }
  }, [init])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none z-[1] ${className}`}
    />
  )
}
