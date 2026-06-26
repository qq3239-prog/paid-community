import Link from "next/link"
import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDate, getInitials } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { ReplyForm } from "./ReplyForm"

export default async function DiscussionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  const { id } = await params

  const post = await prisma.discussionPost.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, email: true, image: true } },
      replies: {
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: { id: true, name: true, email: true, image: true } },
        },
      },
    },
  })

  if (!post) notFound()

  return (
    <div className="py-12 md:py-20">
      <div className="container max-w-3xl">
        <Link
          href="/community/discussions"
          className="inline-flex items-center gap-2 text-[12px] text-[var(--muted)] hover:text-[var(--ink)] transition-colors mb-8 font-mono tracking-[0.06em]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> /discussions
        </Link>

        {/* Main post */}
        <Card className="mb-8 !hover:translate-y-0">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="text-[11px] font-bold font-mono bg-[var(--ink)] text-[var(--bg)]">
                  {getInitials(post.author.name || post.author.email || "U")}
                </AvatarFallback>
              </Avatar>
              <div>
                <span className="font-bold text-[14px]">{post.author.name || "匿名"}</span>
                <p className="text-[11px] text-[var(--muted)] font-mono">{formatDate(post.createdAt)}</p>
              </div>
            </div>
            <CardTitle className="mt-4 text-[24px]">{post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none prose-headings:font-[display] prose-headings:font-black prose-a:text-[var(--accent)]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        {/* Replies */}
        <h3 className="font-bold text-lg mb-5">回复 ({post.replies.length})</h3>
        {post.replies.length === 0 ? (
          <p className="text-sm text-[var(--muted)] mb-8">暂无回复</p>
        ) : (
          <div className="space-y-4 mb-10">
            {post.replies.map((reply) => (
              <Card key={reply.id} className="!hover:translate-y-0">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-[10px] font-bold font-mono bg-[var(--ink)] text-[var(--bg)]">
                        {getInitials(reply.author.name || reply.author.email || "U")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="text-[13px] font-bold">{reply.author.name || "匿名"}</span>
                      <p className="text-[10px] text-[var(--muted)] font-mono">{formatDate(reply.createdAt)}</p>
                    </div>
                  </div>
                  <p className="text-[14px] whitespace-pre-wrap text-[var(--ink-2)] leading-[1.6]">{reply.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Reply form */}
        {session?.user ? (
          <ReplyForm postId={post.id} />
        ) : (
          <p className="text-sm text-[var(--muted)]">
            <Link href="/login" className="text-[var(--accent)] hover:underline font-semibold">登录</Link> 后参与讨论
          </p>
        )}
      </div>
    </div>
  )
}
