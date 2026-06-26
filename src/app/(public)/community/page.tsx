import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDate, getInitials } from "@/lib/utils"
import { MessageSquare } from "lucide-react"

export default async function CommunityPage() {
  const [members, discussionCount] = await Promise.all([
    prisma.user.findMany({
      where: { role: { in: ["PAID_MEMBER", "ADMIN"] } },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
    prisma.discussionPost.count(),
  ])

  return (
    <div className="py-12 md:py-20">
      <div className="container">
        {/* Head */}
        <div className="flex items-end justify-between pb-6 border-b border-[var(--ink)] mb-10">
          <div>
            <span className="font-mono text-[11px] tracking-[0.2em] text-[var(--muted)] uppercase">.04</span>
            <h1 className="font-[display] font-black text-[clamp(36px,4vw,56px)] tracking-[-.03em] leading-none mt-2">
              社区
            </h1>
          </div>
          <Link
            href="/community/discussions"
            className="font-mono text-[11px] tracking-[0.12em] text-[var(--muted)] hover:text-[var(--ink)] transition-colors text-right leading-[1.6] flex items-center gap-1"
          >
            <MessageSquare className="h-3 w-3" />
            讨论版 ({discussionCount})
            <br />
            <span>→</span>
          </Link>
        </div>

        <h2 className="font-bold text-xl mb-8">成员 ({members.length})</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <Card key={member.id} className="!hover:translate-y-[-2px]">
              <CardContent className="p-5 flex items-start gap-4">
                <Avatar className="h-11 w-11 shrink-0">
                  <AvatarFallback className="text-[11px] font-bold font-mono bg-[var(--ink)] text-[var(--bg)]">
                    {getInitials(member.name || member.email || "U")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[14px]">{member.name || "匿名"}</span>
                    {member.role === "ADMIN" && (
                      <span className="text-[9px] tracking-[0.14em] px-1.5 py-0.5 bg-[var(--accent)] text-[var(--ink)] rounded-pill font-bold font-mono uppercase">
                        管理员
                      </span>
                    )}
                  </div>
                  {member.bio && (
                    <p className="text-[12px] text-[var(--muted)] mt-1 line-clamp-2 leading-[1.5]">
                      {member.bio}
                    </p>
                  )}
                  <p className="text-[10px] text-[var(--mute-2)] mt-2 font-mono tracking-[0.06em]">
                    加入于 {formatDate(member.createdAt)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
