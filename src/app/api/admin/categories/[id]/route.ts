import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { categorySchema } from "@/lib/validations"

// PATCH — 更新分类
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
  const parsed = categorySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 })
  }
  await prisma.category.update({ where: { id }, data: parsed.data })
  return NextResponse.json({ success: true })
}

// DELETE — 删除分类
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "需要管理员权限" }, { status: 403 })
  }
  const { id } = await params

  const count = await prisma.article.count({ where: { categoryId: id } })
  if (count > 0) {
    return NextResponse.json({ error: `该分类下有 ${count} 篇文章，无法删除` }, { status: 400 })
  }
  await prisma.category.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
