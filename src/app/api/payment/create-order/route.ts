import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getProvider } from "@/lib/payment"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }

    const { tierSlug } = await req.json()
    const tier = await prisma.membershipTier.findUnique({
      where: { slug: tierSlug },
    })

    if (!tier || !tier.isActive) {
      return NextResponse.json({ error: "方案不存在" }, { status: 404 })
    }

    // 创建内部订单
    const order = await prisma.paymentOrder.create({
      data: {
        userId: session.user.id,
        tierId: tier.id,
        amount: tier.price,
        status: "CREATED",
      },
    })

    // 调用支付 provider
    const provider = getProvider()
    const result = await provider.createOrder({
      orderId: order.id,
      amount: Number(tier.price),
      currency: "cny",
      description: `${tier.name}`,
      userId: session.user.id,
    })

    // 更新订单
    await prisma.paymentOrder.update({
      where: { id: order.id },
      data: {
        providerOrderId: result.providerOrderId,
        providerData: result as any,
      },
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Create order error:", error)
    return NextResponse.json(
      { error: "创建订单失败" },
      { status: 500 }
    )
  }
}
