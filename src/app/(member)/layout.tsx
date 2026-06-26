import Link from "next/link"
import { auth, signOut } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getInitials } from "@/lib/utils"
import { Home, User, Settings, LogOut } from "lucide-react"

async function handleSignOut() {
  "use server"
  await signOut({ redirectTo: "/" })
}

async function MemberHeader() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--hair)] bg-[var(--paper)]">
      <div className="flex items-center gap-4 px-6 h-14 max-w-[1600px] mx-auto">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-[8px] bg-[var(--ink)] text-[var(--bg)] font-[900] text-lg font-[display] group-hover:rotate-[-5deg] transition-all relative after:content-[''] after:absolute after:-bottom-[3px] after:-right-[3px] after:w-[10px] after:h-[10px] after:bg-[var(--accent)] after:rounded-[2px]">
            会
          </span>
          <div className="flex flex-col">
            <span className="font-bold text-[15px] tracking-[-0.01em] leading-none">会员社区</span>
            <span className="font-mono text-[10px] tracking-[0.22em] text-[var(--muted)]">MEMBER</span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1 ml-4">
          <Link
            href="/articles"
            className="px-3 py-1.5 text-[13.5px] text-[var(--ink-2)] hover:text-[var(--ink)] rounded-md hover:bg-[var(--bg)] transition-all"
          >
            文章
          </Link>
          <Link
            href="/community"
            className="px-3 py-1.5 text-[13.5px] text-[var(--ink-2)] hover:text-[var(--ink)] rounded-md hover:bg-[var(--bg)] transition-all"
          >
            社区
          </Link>
        </nav>

        <div className="flex-1" />

        {/* Member tag */}
        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-[var(--accent)] text-[var(--ink)] rounded-pill text-[10px] font-bold tracking-[0.14em] font-mono uppercase">
          ◆ 会员
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-8 h-8 rounded-full border border-[var(--hair)] hover:border-[var(--ink)] transition-colors flex items-center justify-center bg-[var(--bg)]">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-[11px] font-bold font-mono bg-[var(--ink)] text-[var(--bg)]">
                  {getInitials(session?.user?.name || session?.user?.email || "U")}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold">{session?.user?.name}</p>
                <p className="text-xs text-[var(--muted)]">{session?.user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" /> 个人中心
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/profile/edit" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" /> 编辑资料
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/" className="flex items-center">
                <Home className="mr-2 h-4 w-4" /> 首页
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-500 flex items-center"
              onSelect={async (e) => {
                e.preventDefault()
                await handleSignOut()
              }}
            >
              <LogOut className="mr-2 h-4 w-4" /> 退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      <MemberHeader />
      <main className="flex-1">{children}</main>
      <footer className="mt-auto border-t border-[var(--hair)] bg-[var(--paper)]">
        <div className="flex items-center justify-center gap-2 flex-wrap py-6 px-4 text-[11px] tracking-[0.08em] text-[var(--mute-2)] max-w-[1600px] mx-auto">
          <span>© {new Date().getFullYear()} 会员社区</span>
        </div>
      </footer>
    </div>
  )
}
