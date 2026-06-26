"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  MessagesSquare,
  Tags,
  Layers,
  Settings,
  Home,
} from "lucide-react"

const navItems = [
  { href: "/admin", label: "仪表盘", icon: LayoutDashboard },
  { href: "/admin/articles", label: "文章管理", icon: FileText },
  { href: "/admin/categories", label: "分类管理", icon: Tags },
  { href: "/admin/members", label: "会员管理", icon: Users },
  { href: "/admin/tiers", label: "方案管理", icon: Layers },
  { href: "/admin/comments", label: "评论审核", icon: MessageSquare },
  { href: "/admin/discussions", label: "讨论管理", icon: MessagesSquare },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-30 h-screen w-64 border-r border-[var(--hair)] bg-[var(--paper)] flex flex-col overflow-hidden">
      {/* Brand */}
      <Link href="/admin" className="flex items-center gap-3 px-6 py-[22px] border-b border-[var(--hair)] group">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-[8px] bg-[var(--ink)] text-[var(--bg)] font-[900] text-lg font-[display] group-hover:rotate-[-5deg] transition-all relative after:content-[''] after:absolute after:-bottom-[3px] after:-right-[3px] after:w-[10px] after:h-[10px] after:bg-[var(--accent)] after:rounded-[2px]">
          管
        </span>
        <div className="flex flex-col">
          <span className="font-bold text-[15px] tracking-[-0.01em] leading-none">管理后台</span>
          <span className="font-mono text-[10px] tracking-[0.22em] text-[var(--muted)]">ADMIN</span>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 overflow-auto py-2 px-3.5">
        <span className="block px-2.5 py-2 font-mono text-[10px] tracking-[0.18em] text-[var(--mute-2)] uppercase">
          管理菜单
        </span>
        <div className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-[7px] rounded-[6px] text-[13.5px] transition-all group/nav",
                  isActive
                    ? "bg-[var(--ink)] text-[var(--bg)]"
                    : "text-[var(--ink-2)] hover:bg-[var(--bg)] hover:text-[var(--ink)] hover:pl-3.5"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-[var(--bg)]" : "text-[var(--muted)] group-hover/nav:text-[var(--accent)]")} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-[var(--hair)]">
        <Link
          href="/"
          className="flex items-center justify-between px-3 py-3 rounded-[8px] border-[1.5px] border-[var(--ink)] text-[13px] font-bold text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--bg)] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0_var(--accent)] transition-all"
        >
          <Home className="h-4 w-4" />
          回到首页
          <span className="font-mono text-[10px] tracking-[0.22em] text-[var(--accent)]">↵</span>
        </Link>
      </div>
    </aside>
  )
}
