import Link from "next/link"
import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { Lock, Eye } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

function PaywallOverlay({ title, excerpt }: { title: string; excerpt?: string | null }) {
  return (
    <div className="relative">
      <div className="prose max-w-none dark:prose-invert">
        <h1>{title}</h1>
        {excerpt && <p>{excerpt}</p>}
      </div>
      <div className="mt-8 relative">
        <div className="blur-sm select-none opacity-30">
          <div className="h-40 bg-gradient-to-b from-muted to-transparent rounded-lg" />
          <div className="space-y-3 mt-4">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-4 bg-muted rounded w-5/6" />
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Card className="max-w-sm !hover:translate-y-0">
            <CardContent className="p-8 text-center space-y-4">
              <Lock className="h-10 w-10 mx-auto text-[var(--muted)]" />
              <div>
                <h3 className="font-bold text-lg">这是付费内容</h3>
                <p className="text-sm text-[var(--muted)] mt-1">加入会员即可查看完整文章</p>
              </div>
              <div className="flex gap-2 justify-center">
                <Button asChild>
                  <Link href="/plans">查看会员方案</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/login">登录</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const session = await auth()
  const isMember = session?.user?.role === "PAID_MEMBER" || session?.user?.role === "ADMIN"
  const { slug } = await params

  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      category: true,
      author: { select: { name: true } },
      _count: { select: { comments: true } },
    },
  })

  if (!article || (!article.isPublished && !isMember && session?.user?.role !== "ADMIN")) {
    notFound()
  }

  await prisma.article.update({
    where: { id: article.id },
    data: { viewCount: { increment: 1 } },
  })

  return (
    <div className="py-12 md:py-20">
      <div className="container max-w-3xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-[var(--muted)] mb-6 font-mono tracking-[0.06em]">
          <Link href="/articles" className="hover:text-[var(--accent)] transition-colors">/articles</Link>
          {article.category && (
            <>
              <span className="text-[var(--hair-2)]">/</span>
              <Link href={`/articles?category=${article.category.slug}`} className="hover:text-[var(--accent)] transition-colors">
                {article.category.name}
              </Link>
            </>
          )}
        </div>

        {isMember ? (
          <article>
            <div className="mb-10 pb-6 border-b border-[var(--ink)]">
              <h1 className="font-[display] font-black text-[clamp(32px,4vw,52px)] tracking-[-.03em] leading-[1.05] mb-4">
                {article.title}
              </h1>
              <div className="flex items-center gap-4 text-[12px] text-[var(--muted)] font-mono tracking-[0.06em]">
                <span>{article.author.name || "匿名"}</span>
                <span className="text-[var(--hair-2)]">·</span>
                <span>{formatDate(article.createdAt)}</span>
                {article.category && (
                  <>
                    <span className="text-[var(--hair-2)]">·</span>
                    <span className="text-[var(--accent)]">{article.category.name}</span>
                  </>
                )}
                <span className="text-[var(--hair-2)]">·</span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" /> {article.viewCount}
                </span>
              </div>
            </div>
            <div className="prose max-w-none prose-headings:font-[display] prose-headings:font-black prose-a:text-[var(--accent)]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {article.content}
              </ReactMarkdown>
            </div>
          </article>
        ) : (
          <PaywallOverlay title={article.title} excerpt={article.excerpt} />
        )}

        <div className="mt-12 pt-8 border-t border-[var(--hair)]">
          <h3 className="font-bold text-lg mb-4">
            评论 ({article._count.comments})
          </h3>
          {isMember ? (
            <p className="text-sm text-[var(--muted)]">评论功能开发中...</p>
          ) : (
            <p className="text-sm text-[var(--muted)]">
              <Lock className="h-3 w-3 inline mr-1" />
              加入会员后可参与评论
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
