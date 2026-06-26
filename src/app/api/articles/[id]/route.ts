import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { articleSchema } from "@/lib/validations"

// GET — 获取单篇文章
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await auth()
  const isAdmin = session?.user?.role === "ADMIN"

  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      author: { select: { name: true } },
      tags: { include: { tag: true } },
    },
  })

  if (!article) {
    return NextResponse.json({ error: "文章不存在" }, { status: 404 })
  }

  // 管理员可以看到全部内容
  if (isAdmin || session?.user?.role === "PAID_MEMBER") {
    return NextResponse.json(article)
  }

  // 非会员：不返回正文内容
  return NextResponse.json({
    ...article,
    content: "",
  })
}

// PATCH — 更新文章 (admin)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "需要管理员权限" }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()
  const parsed = articleSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message || "输入验证失败" },
      { status: 400 }
    )
  }

  const { tagIds, ...data } = parsed.data

  await prisma.article.update({
    where: { id },
    data: {
      ...data,
      tags: tagIds
        ? {
            deleteMany: {},
            create: tagIds.map((tagId) => ({ tagId })),
          }
        : undefined,
    },
  })

  return NextResponse.json({ success: true })
}

// DELETE — 删除文章 (admin)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "需要管理员权限" }, { status: 403 })
  }

  const { id } = await params
  await prisma.article.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
