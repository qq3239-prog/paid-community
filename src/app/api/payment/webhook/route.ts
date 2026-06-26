import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getProvider } from "@/lib/payment"

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const provider = getProvider()

    const parsed = await provider.parseWebhook({
      rawBody,
      headers: Object.fromEntries(req.headers.entries()),
    })

    if (parsed.eventType === "payment.success") {
      const order = await prisma.paymentOrder.findFirst({
        where: { providerOrderId: parsed.providerOrderId },
      })

      if (!order) {
        return NextResponse.json({ error: "订单不存在" }, { status: 404 })
      }

      if (order.status === "PAID") {
        return NextResponse.json({ message: "已处理" })
      }

      // 更新订单
      await prisma.paymentOrder.update({
        where: { id: order.id },
        data: { status: "PAID", paidAt: parsed.paidAt ?? new Date() },
      })

      // 创建会员
      const tier = await prisma.membershipTier.findUnique({
        where: { id: order.tierId },
      })
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + (tier?.durationDays ?? 30))

      await prisma.membership.create({
        data: {
          userId: order.userId,
          tierId: order.tierId,
          status: "ACTIVE",
          startDate: new Date(),
          endDate,
          paymentOrderId: order.id,
        },
      })

      await prisma.user.update({
        where: { id: order.userId },
        data: { role: "PAID_MEMBER" },
      })
    }

    const response = provider.buildWebhookResponse(parsed)
    return NextResponse.json(response.body, { status: response.status })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "处理失败" }, { status: 500 })
  }
}
