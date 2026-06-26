import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDate, getInitials } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      memberships: {
        include: { tier: true },
        orderBy: { endDate: "desc" },
        take: 5,
      },
    },
  })

  if (!user) redirect("/login")

  const activeMembership = user.memberships.find(
    (m) => m.status === "ACTIVE" && m.endDate > new Date()
  )

  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-2xl">
        <div className="pb-6 border-b border-[var(--ink)] mb-10">
          <span className="font-mono text-[11px] tracking-[0.2em] text-[var(--muted)] uppercase">profile</span>
          <h1 className="font-[display] font-black text-[clamp(36px,4vw,52px)] tracking-[-.03em] leading-none mt-2">
            个人中心
          </h1>
        </div>

        {/* Profile Card */}
        <Card className="!hover:translate-y-0">
          <CardHeader className="flex flex-row items-center gap-5">
            <Avatar className="h-14 w-14 shrink-0">
              <AvatarFallback className="font-bold font-mono bg-[var(--ink)] text-[var(--bg)]">
                {getInitials(user.name || user.email || "U")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <CardTitle>{user.name || "未设置昵称"}</CardTitle>
              <p className="text-[12px] text-[var(--muted)] font-mono">{user.email}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Badge variant={activeMembership ? "success" : "secondary"}>
                  {activeMembership ? `◆ ${activeMembership.tier.name}` : "普通用户"}
                </Badge>
                {user.role === "ADMIN" && <Badge variant="default">管理员</Badge>}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {user.bio && <p className="text-sm text-[var(--muted)] mb-4 leading-[1.6]">{user.bio}</p>}
            <p className="text-[12px] text-[var(--muted)] font-mono">
              注册时间：{formatDate(user.createdAt)}
            </p>
            <div className="mt-5 flex gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/profile/edit">编辑资料</Link>
              </Button>
              {!activeMembership && (
                <Button size="sm" asChild>
                  <Link href="/plans">升级会员</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active membership */}
        {activeMembership && (
          <Card className="mt-6 !hover:translate-y-0 border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_6%,transparent)]">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-[18px]">
                当前会员
                <Badge variant="success">有效</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-[14px]">
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">方案</span>
                <span className="font-semibold">{activeMembership.tier.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">开通时间</span>
                <span>{formatDate(activeMembership.startDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">到期时间</span>
                <span>{formatDate(activeMembership.endDate)}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* History */}
        {user.memberships.length > 0 && (
          <Card className="mt-6 !hover:translate-y-0">
            <CardHeader>
              <CardTitle className="text-[18px]">订阅历史</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {user.memberships.map((m) => (
                  <div key={m.id} className="flex justify-between items-center text-[13px] py-2 border-b border-[var(--hair)] last:border-0">
                    <div>
                      <span className="font-semibold">{m.tier.name}</span>
                      <span className="text-[var(--muted)] ml-2 text-[12px]">
                        {formatDate(m.startDate)} ~ {formatDate(m.endDate)}
                      </span>
                    </div>
                    <Badge
                      variant={
                        m.status === "ACTIVE" ? "success"
                          : m.status === "EXPIRED" ? "secondary"
                            : "outline"
                      }
                    >
                      {m.status === "ACTIVE" ? "有效"
                        : m.status === "EXPIRED" ? "已过期"
                          : statusLabel(m.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    PENDING: "待支付",
    CANCELLED: "已取消",
    REFUNDED: "已退款",
  }
  return map[status] || status
}
