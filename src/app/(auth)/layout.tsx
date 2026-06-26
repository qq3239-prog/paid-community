import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-[8px] bg-[var(--ink)] text-[var(--bg)] font-[900] text-xl font-[display] group-hover:rotate-[-5deg] transition-all relative after:content-[''] after:absolute after:-bottom-[3px] after:-right-[3px] after:w-[10px] after:h-[10px] after:bg-[var(--accent)] after:rounded-[2px]">
              会
            </span>
            <div className="flex flex-col text-left">
              <span className="font-bold text-[17px] tracking-[-0.01em] leading-none">会员社区</span>
              <span className="font-mono text-[10px] tracking-[0.22em] text-[var(--muted)]">MEMBER CLUB</span>
            </div>
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
