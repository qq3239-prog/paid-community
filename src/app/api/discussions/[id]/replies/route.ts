import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { discussionReplySchema } from "@/lib/validations"

// POST — 回复讨论
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  const body = await req.json()
  const parsed = discussionReplySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 })
  }

  const reply = await prisma.discussionReply.create({
    data: {
      content: parsed.data.content,
      postId: parsed.data.postId,
      authorId: session.user.id,
      parentId: parsed.data.parentId || null,
    },
  })

  return NextResponse.json(reply, { status: 201 })
}

// DELETE — 删除讨论 (admin)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "需要管理员权限" }, { status: 403 })
  }
  const { id } = await params
  await prisma.discussionPost.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
