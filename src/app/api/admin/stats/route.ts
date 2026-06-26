import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "需要管理员权限" }, { status: 403 })
  }

  const [memberCount, activeCount, articleCount, orderSum, commentCount] =
    await Promise.all([
      prisma.membership.count({ where: { status: "ACTIVE" } }),
      prisma.user.count({ where: { role: "PAID_MEMBER" } }),
      prisma.article.count({ where: { isPublished: true } }),
      prisma.paymentOrder.aggregate({
        where: { status: "PAID" },
        _sum: { amount: true },
      }),
      prisma.comment.count(),
    ])

  return NextResponse.json({
    totalMembers: memberCount,
    activeMembers: activeCount,
    articleCount,
    revenue: Number(orderSum._sum.amount || 0),
    commentCount,
  })
}
