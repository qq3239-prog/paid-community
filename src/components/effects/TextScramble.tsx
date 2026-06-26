"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface TextScrambleProps {
  text: string
  className?: string
  trigger?: "hover" | "always"
  speed?: number
  chars?: string
}

const DEFAULT_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

/**
 * 2026 文字解密效果
 * 悬停时字符随机乱码再逐位复原
 */
export function TextScramble({
  text,
  className = "",
  trigger = "hover",
  speed = 0.04,
  chars = DEFAULT_CHARS,
}: TextScrambleProps) {
  const [display, setDisplay] = useState(text)
  const [running, setRunning] = useState(false)
  const frameRef = useRef<number>(0)
  const queueRef = useRef<{ from: string; to: string; start: number; end: number; char?: string }[]>([])

  const start = useCallback(() => {
    const queue: { from: string; to: string; start: number; end: number; char?: string }[] = []
    const length = text.length

    for (let i = 0; i < length; i++) {
      const from = display[i] || ""
      const to = text[i]
      const startTime = Math.floor(Math.random() * 10)
      const endTime = startTime + Math.floor(Math.random() * 15) + 5
      queue.push({ from, to, start: startTime, end: endTime })
    }

    queueRef.current = queue
    frameRef.current = 0
    setRunning(true)
  }, [text, display])

  useEffect(() => {
    if (!running) return
    let frame = frameRef.current
    let raf: number

    function update() {
      let output = ""
      let complete = 0

      for (let i = 0; i < queueRef.current.length; i++) {
        const { from, to, start: s, end: e } = queueRef.current[i]

        if (frame >= e) {
          output += to
          complete++
        } else if (frame >= s) {
          const progress = (frame - s) / (e - s)
          if (progress < 0.4) {
            output += chars[Math.floor(Math.random() * chars.length)]
          } else {
            output += Math.random() < 0.5 ? to : chars[Math.floor(Math.random() * chars.length)]
          }
        } else {
          output += from || text[i]
        }
      }

      setDisplay(output)

      if (complete === queueRef.current.length) {
        setRunning(false)
        setDisplay(text)
        return
      }

      frame++
      frameRef.current = frame
      raf = requestAnimationFrame(update)
    }

    raf = requestAnimationFrame(update)
    return () => cancelAnimationFrame(raf)
  }, [running, chars, text])

  useEffect(() => {
    if (trigger === "always") start()
  }, [])

  return (
    <span
      className={className}
      onMouseEnter={trigger === "hover" ? start : undefined}
    >
      {display}
    </span>
  )
}
