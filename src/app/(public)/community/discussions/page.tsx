import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { MessageSquare, Plus } from "lucide-react"

export default async function DiscussionsPage() {
  const session = await auth()
  const discussions = await prisma.discussionPost.findMany({
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    include: {
      author: { select: { name: true } },
      _count: { select: { replies: true } },
    },
  })

  return (
    <div className="py-12 md:py-20">
      <div className="container max-w-3xl">
        {/* Head */}
        <div className="flex items-end justify-between pb-6 border-b border-[var(--ink)] mb-10">
          <div>
            <span className="font-mono text-[11px] tracking-[0.2em] text-[var(--muted)] uppercase">.05</span>
            <h1 className="font-[display] font-black text-[clamp(36px,4vw,56px)] tracking-[-.03em] leading-none mt-2">
              讨论版
            </h1>
          </div>
          {session?.user && (
            <Button asChild size="sm" className="text-[12px]">
              <Link href="/community/discussions/new">
                <Plus className="h-4 w-4" /> 发起讨论
              </Link>
            </Button>
          )}
        </div>

        {discussions.length === 0 ? (
          <div className="text-center py-20">
            <MessageSquare className="h-12 w-12 mx-auto text-[var(--muted)]" />
            <p className="text-[var(--muted)] mt-4">暂无讨论</p>
          </div>
        ) : (
          <div className="space-y-3">
            {discussions.map((post) => (
              <Link key={post.id} href={`/community/discussions/${post.id}`}>
                <Card className="!hover:translate-y-0 hover:border-[var(--ink)]">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {post.isPinned && (
                          <span className="text-[9px] tracking-[0.14em] px-1.5 py-0.5 bg-[var(--accent)] text-[var(--ink)] rounded-pill font-bold font-mono uppercase">
                            置顶
                          </span>
                        )}
                        <h2 className="font-bold line-clamp-1 text-[15px]">{post.title}</h2>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-[var(--muted)] font-mono tracking-[0.06em]">
                        <span>{post.author.name || "匿名"}</span>
                        <span className="text-[var(--hair-2)]">·</span>
                        <span>{formatDate(post.createdAt)}</span>
                        <span className="text-[var(--hair-2)]">·</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" /> {post._count.replies} 回复
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
