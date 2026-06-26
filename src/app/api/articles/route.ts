import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { articleSchema } from "@/lib/validations"

// GET — 获取文章列表
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "10")
  const category = searchParams.get("category")
  const published = searchParams.get("published")

  const where: any = {}
  if (category) where.category = { slug: category }
  if (published === "true") where.isPublished = true

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      include: {
        category: { select: { name: true, slug: true } },
        author: { select: { name: true } },
        _count: { select: { comments: true } },
      },
    }),
    prisma.article.count({ where }),
  ])

  return NextResponse.json({ articles, total, page, totalPages: Math.ceil(total / limit) })
}

// POST — 创建文章 (admin)
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "需要管理员权限" }, { status: 403 })
  }

  const body = await req.json()
  const parsed = articleSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message || "输入验证失败" },
      { status: 400 }
    )
  }

  const { tagIds, ...data } = parsed.data

  const article = await prisma.article.create({
    data: {
      ...data,
      authorId: session.user.id,
      tags: tagIds.length > 0
        ? { create: tagIds.map((tagId) => ({ tagId })) }
        : undefined,
    },
  })

  return NextResponse.json(article, { status: 201 })
}
