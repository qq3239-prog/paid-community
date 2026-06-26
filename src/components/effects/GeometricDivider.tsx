/**
 * 2026 几何科技分隔线
 * SVG 细线 + 圆点装饰，用于 section 之间
 */
export function GeometricDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-10 select-none pointer-events-none ${className}`}>
      <svg width="60" height="20" viewBox="0 0 60 20" fill="none" className="opacity-25">
        {/* 中心六边形 */}
        <polygon
          points="30,4 38,9 38,15 30,20 22,15 22,9"
          stroke="var(--accent)"
          strokeWidth="0.8"
          fill="none"
          opacity="0.6"
        />
        {/* 左线 */}
        <line x1="0" y1="10" x2="20" y2="10" stroke="var(--hair-2)" strokeWidth="0.5" />
        {/* 右线 */}
        <line x1="40" y1="10" x2="60" y2="10" stroke="var(--hair-2)" strokeWidth="0.5" />
        {/* 左圆点 */}
        <circle cx="16" cy="10" r="1.2" fill="var(--accent)" opacity="0.5" />
        {/* 右圆点 */}
        <circle cx="44" cy="10" r="1.2" fill="var(--accent)" opacity="0.5" />
      </svg>
    </div>
  )
}
