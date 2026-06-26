"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import { Menu } from "lucide-react"
import { useState } from "react"
import { signOut } from "next-auth/react"

function handleSignOut() {
  signOut({ callbackUrl: "/" })
}

export default function PublicHeader() {
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--hair)] bg-[var(--paper)]">
        <div className="flex items-center gap-4 px-6 h-14 max-w-[1600px] mx-auto">
          {/* Mobile menu */}
          <button
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-[8px] border border-[var(--hair)] text-[var(--ink-2)] hover:border-[var(--ink)] hover:text-[var(--ink)] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-[8px] bg-[var(--ink)] text-[var(--bg)] font-[900] text-lg font-[display] group-hover:rotate-[-5deg] transition-all relative after:content-[''] after:absolute after:-bottom-[3px] after:-right-[3px] after:w-[10px] after:h-[10px] after:bg-[var(--accent)] after:rounded-[2px]">
              会
            </span>
            <div className="flex flex-col">
              <span className="font-bold text-[15px] tracking-[-0.01em] leading-none">
                会员社区
              </span>
              <span className="font-mono text-[10px] tracking-[0.22em] text-[var(--muted)]">
                MEMBER CLUB
              </span>
            </div>
          </Link>

          {/* Nav */}
          <nav className="hidden lg:flex items-center gap-1 ml-6">
            <Link href="/articles" className="px-3 py-1.5 text-[13.5px] text-[var(--ink-2)] hover:text-[var(--ink)] rounded-md hover:bg-[var(--bg)] transition-all">
              文章
            </Link>
            <Link href="/plans" className="px-3 py-1.5 text-[13.5px] text-[var(--ink-2)] hover:text-[var(--ink)] rounded-md hover:bg-[var(--bg)] transition-all">
              会员方案
            </Link>
            <Link href="/community" className="px-3 py-1.5 text-[13.5px] text-[var(--ink-2)] hover:text-[var(--ink)] rounded-md hover:bg-[var(--bg)] transition-all">
              社区
            </Link>
          </nav>

          <div className="flex-1" />

          {/* User area */}
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative w-8 h-8 rounded-full border border-[var(--hair)] hover:border-[var(--ink)] transition-colors flex items-center justify-center bg-[var(--bg)]">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-[11px] font-bold font-mono bg-[var(--ink)] text-[var(--bg)]">
                      {getInitials(session.user.name || session.user.email || "U")}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold">{session.user.name}</p>
                    <p className="text-xs text-[var(--muted)]">{session.user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">个人中心</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/plans">升级会员</Link>
                </DropdownMenuItem>
                {session.user.role === "ADMIN" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">管理后台</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500"
                  onClick={() => handleSignOut()}
                >
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-[13px]">
                  登录
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="rounded-pill text-[13px]">
                  注册
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 left-0 h-full w-[min(300px,88vw)] bg-[var(--bg)] border-r border-[var(--hair-2)] flex flex-col animate-fade-in shadow-2xl">
            <div className="flex items-center gap-3 p-5 border-b border-[var(--hair)]">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-[8px] bg-[var(--ink)] text-[var(--bg)] font-black text-lg">会</span>
              <div className="flex flex-col">
                <span className="font-bold text-[15px] tracking-[-0.01em]">会员社区</span>
                <span className="font-mono text-[10px] tracking-[0.22em] text-[var(--muted)]">MEMBER CLUB</span>
              </div>
              <button
                className="ml-auto w-8 h-8 flex items-center justify-center border border-[var(--hair)] rounded-[8px] text-[var(--ink-2)] hover:border-[var(--ink)] hover:text-[var(--ink)] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                ✕
              </button>
            </div>
            <nav className="flex-1 overflow-auto p-4 flex flex-col gap-1">
              <Link href="/articles" className="flex items-center gap-3 px-3 py-2 rounded-md text-[13.5px] text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--bg)] transition-all" onClick={() => setMobileOpen(false)}>
                📄 文章
              </Link>
              <Link href="/plans" className="flex items-center gap-3 px-3 py-2 rounded-md text-[13.5px] text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--bg)] transition-all" onClick={() => setMobileOpen(false)}>
                💎 会员方案
              </Link>
              <Link href="/community" className="flex items-center gap-3 px-3 py-2 rounded-md text-[13.5px] text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--bg)] transition-all" onClick={() => setMobileOpen(false)}>
                💬 社区
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
