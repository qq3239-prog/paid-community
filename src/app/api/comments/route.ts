import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { commentSchema } from "@/lib/validations"

// POST — 发表评论
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  // 检查会员状态（admin 也算）
  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (user?.role !== "PAID_MEMBER" && user?.role !== "ADMIN") {
    return NextResponse.json({ error: "需要付费会员" }, { status: 403 })
  }

  const body = await req.json()
  const parsed = commentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 })
  }

  const comment = await prisma.comment.create({
    data: {
      content: parsed.data.content,
      articleId: parsed.data.articleId,
      authorId: session.user.id,
      parentId: parsed.data.parentId || null,
    },
  })

  return NextResponse.json(comment, { status: 201 })
}
