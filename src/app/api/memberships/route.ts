import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  const memberships = await prisma.membership.findMany({
    where: { userId: session.user.id },
    include: { tier: true },
    orderBy: { endDate: "desc" },
  })

  const active = memberships.find(
    (m) => m.status === "ACTIVE" && m.endDate > new Date()
  )

  return NextResponse.json({
    memberships,
    active: active || null,
    isMember: !!active,
  })
}
