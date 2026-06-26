import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { tierSchema } from "@/lib/validations"

// PATCH — 更新方案
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "需要管理员权限" }, { status: 403 })
  }
  const { id } = await params
  const body = await req.json()
  const parsed = tierSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 })
  }
  await prisma.membershipTier.update({ where: { id }, data: parsed.data })
  return NextResponse.json({ success: true })
}

// DELETE — 删除方案
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "需要管理员权限" }, { status: 403 })
  }
  const { id } = await params
  const count = await prisma.membership.count({ where: { tierId: id } })
  if (count > 0) {
    return NextResponse.json({ error: `有 ${count} 个会员使用此方案，无法删除` }, { status: 400 })
  }
  await prisma.membershipTier.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
