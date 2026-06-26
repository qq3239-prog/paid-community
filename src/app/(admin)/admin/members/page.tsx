import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

export default async function AdminMembersPage() {
  const members = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      memberships: {
        where: { status: "ACTIVE" },
        include: { tier: true },
        take: 1,
      },
    },
  })

  return (
    <div>
      <div className="pb-6 border-b border-[var(--ink)] mb-8">
        <span className="font-mono text-[11px] tracking-[0.2em] text-[var(--muted)] uppercase">.03</span>
        <h1 className="font-[display] font-black text-[clamp(32px,4vw,48px)] tracking-[-.03em] leading-none mt-2">
          会员管理
        </h1>
      </div>

      <Card className="!hover:translate-y-0">
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--hair)] text-[11px] text-[var(--muted)] font-mono tracking-[0.06em]">
                <th className="text-left p-4 font-semibold">用户</th>
                <th className="text-left p-4 font-semibold hidden md:table-cell">邮箱</th>
                <th className="text-left p-4 font-semibold">角色</th>
                <th className="text-left p-4 font-semibold hidden lg:table-cell">会员</th>
                <th className="text-left p-4 font-semibold hidden lg:table-cell">注册日期</th>
                <th className="text-right p-4 font-semibold">操作</th>
              </tr>
            </thead>
            <tbody>
              {members.map((user) => (
                <tr key={user.id} className="border-b border-[var(--hair)] last:border-0 hover:bg-[var(--bg)] transition-colors">
                  <td className="p-4 font-bold text-[14px]">{user.name || "未设置"}</td>
                  <td className="p-4 text-[12px] text-[var(--muted)] hidden md:table-cell font-mono">{user.email}</td>
                  <td className="p-4">
                    <Badge variant={user.role === "ADMIN" ? "default" : user.role === "PAID_MEMBER" ? "success" : "secondary"}>
                      {user.role === "ADMIN" ? "管理员" : user.role === "PAID_MEMBER" ? "会员" : "游客"}
                    </Badge>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    {user.memberships[0] ? (
                      <div className="text-[13px]">
                        <Badge variant="success">{user.memberships[0].tier.name}</Badge>
                        <span className="ml-2 text-[var(--muted)] text-[12px]">
                          至 {formatDate(user.memberships[0].endDate)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[var(--muted)] text-sm">-</span>
                    )}
                  </td>
                  <td className="p-4 text-[12px] text-[var(--muted)] hidden lg:table-cell font-mono">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/members/${user.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
