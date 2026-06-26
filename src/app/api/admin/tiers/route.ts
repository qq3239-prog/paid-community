import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { tierSchema } from "@/lib/validations"

// GET — 列表
export async function GET() {
  const tiers = await prisma.membershipTier.findMany({
    orderBy: { sortOrder: "asc" },
  })
  return NextResponse.json(tiers)
}

// POST — 创建
export async function POST(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "需要管理员权限" }, { status: 403 })
  }
  const body = await req.json()
  const parsed = tierSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 })
  }
  const tier = await prisma.membershipTier.create({ data: parsed.data })
  return NextResponse.json(tier, { status: 201 })
}
