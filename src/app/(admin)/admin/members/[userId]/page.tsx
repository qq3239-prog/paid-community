import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { formatDate, getInitials } from "@/lib/utils"
import { BanActions } from "./BanActions"

export default async function AdminMemberDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      memberships: { include: { tier: true }, orderBy: { endDate: "desc" } },
      paymentOrders: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  })

  if (!user) notFound()

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-8">会员详情</h1>

      <div className="space-y-6">
        {/* 基本信息 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">
                  {getInitials(user.name || user.email || "U")}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{user.name || "未设置"}</CardTitle>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <Badge variant={user.role === "ADMIN" ? "default" : user.role === "PAID_MEMBER" ? "success" : "secondary"} className="mt-2">
                  {user.role === "ADMIN" ? "管理员" : user.role === "PAID_MEMBER" ? "会员" : "游客"}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">个人简介</span>
                <span>{user.bio || "未填写"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">注册时间</span>
                <span>{formatDate(user.createdAt)}</span>
              </div>
            </div>
            <Separator className="my-4" />
            <BanActions userId={user.id} currentRole={user.role} />
          </CardContent>
        </Card>

        {/* 会员历史 */}
        <Card>
          <CardHeader><CardTitle>订阅记录</CardTitle></CardHeader>
          <CardContent>
            {user.memberships.length === 0 ? (
              <p className="text-sm text-muted-foreground">无记录</p>
            ) : (
              <div className="space-y-3">
                {user.memberships.map((m) => (
                  <div key={m.id} className="flex justify-between items-center text-sm border-b pb-2">
                    <div>
                      <span>{m.tier.name}</span>
                      <span className="text-muted-foreground ml-2">
                        {formatDate(m.startDate)} ~ {formatDate(m.endDate)}
                      </span>
                    </div>
                    <Badge variant={m.status === "ACTIVE" ? "success" : "secondary"}>
                      {m.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 支付记录 */}
        <Card>
          <CardHeader><CardTitle>支付记录</CardTitle></CardHeader>
          <CardContent>
            {user.paymentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">无记录</p>
            ) : (
              <div className="space-y-2">
                {user.paymentOrders.map((order) => (
                  <div key={order.id} className="flex justify-between text-sm">
                    <span>¥{order.amount}</span>
                    <Badge variant="secondary">{order.status}</Badge>
                    <span className="text-muted-foreground">{formatDate(order.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
