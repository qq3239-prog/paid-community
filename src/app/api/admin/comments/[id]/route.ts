import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "需要管理员权限" }, { status: 403 })
  }
  const { id } = await params
  await prisma.comment.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
