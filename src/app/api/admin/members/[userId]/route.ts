import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { memberUpdateSchema } from "@/lib/validations"

// PATCH — 更新会员状态
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "需要管理员权限" }, { status: 403 })
  }

  const { userId } = await params
  const body = await req.json()
  const parsed = memberUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 })
  }

  // 更新角色
  if (parsed.data.role) {
    await prisma.user.update({
      where: { id: userId },
      data: { role: parsed.data.role },
    })
  }

  // 延期
  if (parsed.data.extendDays) {
    const activeMembership = await prisma.membership.findFirst({
      where: { userId, status: "ACTIVE" },
      orderBy: { endDate: "desc" },
    })
    if (activeMembership) {
      const newEnd = new Date(activeMembership.endDate)
      newEnd.setDate(newEnd.getDate() + parsed.data.extendDays)
      await prisma.membership.update({
        where: { id: activeMembership.id },
        data: { endDate: newEnd },
      })
    } else {
      // 没有有效会员，创建一个
      const tier = await prisma.membershipTier.findFirst({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      })
      if (tier) {
        const endDate = new Date()
        endDate.setDate(endDate.getDate() + parsed.data.extendDays)
        await prisma.membership.create({
          data: { userId, tierId: tier.id, status: "ACTIVE", startDate: new Date(), endDate },
        })
        await prisma.user.update({
          where: { id: userId },
          data: { role: "PAID_MEMBER" },
        })
      }
    }
  }

  // 取消会员
  if (parsed.data.banMembership) {
    await prisma.membership.updateMany({
      where: { userId, status: "ACTIVE" },
      data: { status: "CANCELLED", cancelledAt: new Date() },
    })
    await prisma.user.update({
      where: { id: userId },
      data: { role: "VISITOR" },
    })
  }

  return NextResponse.json({ success: true })
}
