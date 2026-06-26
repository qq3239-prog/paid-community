"use client"

import { useState, useEffect } from "react"

/**
 * 2026 代码雨（首页 hero 装饰）
 * 绿色字符从屏幕顶部下落
 */
export function CodeRain({ rows = 20, cols = 40 }: { rows?: number; cols?: number }) {
  const [chars, setChars] = useState<string[][]>([])

  useEffect(() => {
    const glyphs = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789{}[]<>/\\|*&^%$#@!".split("")
    const grid: string[][] = []
    for (let r = 0; r < rows; r++) {
      const row: string[] = []
      for (let c = 0; c < cols; c++) {
        row.push(glyphs[Math.floor(Math.random() * glyphs.length)])
      }
      grid.push(row)
    }
    setChars(grid)

    const interval = setInterval(() => {
      setChars(prev => {
        if (prev.length === 0) return prev
        const next = [...prev]
        // 随机替换几个字符
        for (let i = 0; i < 30; i++) {
          const r = Math.floor(Math.random() * rows)
          const c = Math.floor(Math.random() * cols)
          if (next[r]) {
            next[r] = [...next[r]]
            next[r][c] = glyphs[Math.floor(Math.random() * glyphs.length)]
          }
        }
        return next
      })
    }, 120)

    return () => clearInterval(interval)
  }, [rows, cols])

  if (chars.length === 0) return null

  return (
    <div
      className="absolute inset-0 overflow-hidden select-none pointer-events-none z-0"
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "12px",
        lineHeight: "16px",
        opacity: 0.06,
        color: "var(--accent)",
        transform: "skewY(-2deg)",
      }}
    >
      {chars.map((row, ri) => (
        <div key={ri} className="whitespace-nowrap">
          {row.map((ch, ci) => (
            <span
              key={ci}
              style={{
                opacity: 0.3 + Math.random() * 0.7,
              }}
            >
              {ch}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}
