import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, DollarSign, MessageSquare } from "lucide-react"

export default async function AdminDashboardPage() {
  const [memberCount, articleCount, revenueResult, commentCount] = await Promise.all([
    prisma.membership.count({ where: { status: "ACTIVE" } }),
    prisma.article.count({ where: { isPublished: true } }),
    prisma.paymentOrder.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true },
    }),
    prisma.comment.count(),
  ])

  const revenue = Number(revenueResult._sum.amount || 0)

  const stats = [
    { title: "有效会员", value: memberCount.toString(), icon: Users, description: "当前有效订阅" },
    { title: "文章总数", value: articleCount.toString(), icon: FileText, description: "已发布文章" },
    { title: "累计收入", value: `¥${revenue.toFixed(2)}`, icon: DollarSign, description: "已支付订单总额" },
    { title: "总评论", value: commentCount.toString(), icon: MessageSquare, description: "全部评论数" },
  ]

  return (
    <div>
      <div className="pb-6 border-b border-[var(--ink)] mb-8">
        <span className="font-mono text-[11px] tracking-[0.2em] text-[var(--muted)] uppercase">.00</span>
        <h1 className="font-[display] font-black text-[clamp(32px,4vw,48px)] tracking-[-.03em] leading-none mt-2">
          仪表盘
        </h1>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="!hover:translate-y-[-2px]" style={{ animationDelay: `${i * 0.08}s` }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-[12px] font-semibold text-[var(--muted)] tracking-[0.06em]">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-[var(--muted)]" />
              </CardHeader>
              <CardContent>
                <div className="font-[display] font-black text-3xl tracking-[-0.02em]">{stat.value}</div>
                <p className="text-[11px] text-[var(--muted)] mt-1 font-mono tracking-[0.06em]">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
