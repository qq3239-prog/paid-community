"use client"

interface TickerStripProps {
  items: string[]
  speed?: number
  className?: string
}

/**
 * 2026 无限滚动跑马灯
 */
export function TickerStrip({ items, speed = 40, className = "" }: TickerStripProps) {
  const track = items.map((item, i) => (
    <span key={i}>
      <span>{item}</span>
      <span className="text-[var(--accent)] px-4 select-none">◆</span>
    </span>
  ))

  return (
    <div className={`overflow-hidden border-y border-[var(--ink)] bg-[var(--bg)] ${className}`}>
      <div
        className="flex whitespace-nowrap py-3.5 font-mono text-[13px] tracking-[0.14em] font-medium"
        style={{
          animation: `scroll ${speed}s linear infinite`,
          width: "max-content",
        }}
      >
        <div className="flex items-center pr-7">{track}</div>
        <div className="flex items-center pr-7">{track}</div>
      </div>
    </div>
  )
}
