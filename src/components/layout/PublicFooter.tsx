import Link from "next/link"

export function PublicFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--hair)] bg-[var(--paper)]">
      <div className="flex items-center justify-center gap-2 flex-wrap py-6 px-4 text-[11px] tracking-[0.08em] text-[var(--mute-2)] max-w-[1600px] mx-auto">
        <span>© {new Date().getFullYear()} 会员社区</span>
        <span className="text-[var(--hair-2)] select-none">·</span>
        <Link href="/articles" className="hover:text-[var(--ink)] transition-colors hover:underline underline-offset-[3px]">
          文章
        </Link>
        <span className="text-[var(--hair-2)] select-none">·</span>
        <Link href="/plans" className="hover:text-[var(--ink)] transition-colors hover:underline underline-offset-[3px]">
          会员方案
        </Link>
        <span className="text-[var(--hair-2)] select-none">·</span>
        <Link href="/community" className="hover:text-[var(--ink)] transition-colors hover:underline underline-offset-[3px]">
          社区
        </Link>
        <span className="text-[var(--hair-2)] select-none">·</span>
        <span className="flex items-center gap-1">
          <span className="text-[var(--accent)] text-xs">◆</span>
          坚持原创
        </span>
      </div>
    </footer>
  )
}
