import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { discussionPostSchema, discussionReplySchema } from "@/lib/validations"

// POST — 发表讨论
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  const body = await req.json()
  const parsed = discussionPostSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 })
  }

  const post = await prisma.discussionPost.create({
    data: { ...parsed.data, authorId: session.user.id },
  })

  return NextResponse.json(post, { status: 201 })
}
