import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getProvider, getMockProvider } from "@/lib/payment"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }

    const { providerOrderId, simulate } = await req.json()

    if (simulate) {
      // Mock 支付：直接标记为已支付
      const mock = getMockProvider()
      mock.markPaid(providerOrderId)
    }

    const provider = getProvider()
    const result = await provider.verifyPayment({ providerOrderId })

    if (!result.success) {
      return NextResponse.json(
        { error: result.failureReason || "支付未完成" },
        { status: 400 }
      )
    }

    // 查找订单
    const order = await prisma.paymentOrder.findFirst({
      where: { providerOrderId, status: { not: "PAID" } },
    })

    if (!order) {
      return NextResponse.json(
        { error: "订单不存在或已支付" },
        { status: 404 }
      )
    }

    // 更新订单状态
    await prisma.paymentOrder.update({
      where: { id: order.id },
      data: { status: "PAID", paidAt: result.paidAt ?? new Date() },
    })

    // 创建/更新会员
    const tier = await prisma.membershipTier.findUnique({
      where: { id: order.tierId },
    })
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + (tier?.durationDays ?? 30))

    await prisma.membership.create({
      data: {
        userId: session.user.id,
        tierId: order.tierId,
        status: "ACTIVE",
        startDate: new Date(),
        endDate,
        paymentOrderId: order.id,
      },
    })

    // 更新用户角色
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: "PAID_MEMBER" },
    })

    return NextResponse.json({ success: true, message: "支付成功，会员已激活" })
  } catch (error) {
    console.error("Verify payment error:", error)
    return NextResponse.json(
      { error: "支付验证失败" },
      { status: 500 }
    )
  }
}
