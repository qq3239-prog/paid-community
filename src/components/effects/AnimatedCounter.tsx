"use client"

import { useState, useEffect, useRef } from "react"

interface AnimatedCounterProps {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
  triggerOnce?: boolean
}

/**
 * 2026 数字滚动计数器
 * 进入视口时从 0 滚动到目标值
 */
export function AnimatedCounter({
  end,
  duration = 1.8,
  prefix = "",
  suffix = "",
  className = "",
  triggerOnce = true,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || (triggerOnce && started)) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          if (triggerOnce) obs.unobserve(el)
        }
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [triggerOnce, started])

  useEffect(() => {
    if (!started) return
    let startTime: number
    let raf: number

    function step(timestamp: number) {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      // ease-out expo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setCount(Math.floor(eased * end))

      if (progress < 1) {
        raf = requestAnimationFrame(step)
      }
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [started, end, duration])

  return (
    <span ref={ref} className={`font-[display] font-black ${className}`}>
      {prefix}{count}{suffix}
    </span>
  )
}
