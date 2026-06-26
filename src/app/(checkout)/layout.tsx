import Link from "next/link"

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="h-14 border-b border-[var(--hair)] bg-[var(--paper)] flex items-center sticky top-0 z-10">
        <div className="max-w-[1600px] w-full mx-auto px-6">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-[8px] bg-[var(--ink)] text-[var(--bg)] font-[900] text-lg font-[display] group-hover:rotate-[-5deg] transition-all relative after:content-[''] after:absolute after:-bottom-[3px] after:-right-[3px] after:w-[8px] after:h-[8px] after:bg-[var(--accent)] after:rounded-[2px]">
              会
            </span>
            <span className="font-bold text-[15px] tracking-[-0.01em]">会员社区</span>
          </Link>
        </div>
      </header>
      {children}
    </div>
  )
}
