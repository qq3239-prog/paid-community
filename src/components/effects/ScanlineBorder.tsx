"use client"

/**
 * 2026 扫描线边框
 * 卡片上有一条亮线持续环绕扫过
 */
export function ScanlineBorder({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] ${className}`}>
      <div
        className="absolute inset-0 rounded-[inherit]"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, transparent, var(--accent) 6%, transparent 8%, transparent)`,
          animation: "scanRotate 4s linear infinite",
          opacity: 0.25,
          maskImage: "radial-gradient(circle at center, black 60%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 60%, transparent 100%)",
        }}
      />
      <style>{`
        @keyframes scanRotate {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
