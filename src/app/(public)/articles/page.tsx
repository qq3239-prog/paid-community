import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { Lock } from "lucide-react"
import { ScrollReveal } from "@/components/effects/ScrollReveal"
import { TiltCard } from "@/components/effects/TiltCard"

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>
}) {
  const session = await auth()
  const isMember = session?.user?.role === "PAID_MEMBER" || session?.user?.role === "ADMIN"
  const sp = await searchParams
  const page = parseInt(sp.page || "1")
  const category = sp.category
  const limit = 9

  const where: any = { isPublished: true }
  if (category) where.category = { slug: category }

  const [articles, total, categories] = await Promise.all([
    prisma.article.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      include: { category: true, author: { select: { name: true } } },
    }),
    prisma.article.count({ where }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="py-12 md:py-20">
      <div className="container">
        {/* Head */}
        <div className="flex items-end justify-between pb-6 border-b border-[var(--ink)] mb-10">
          <div>
            <span className="font-mono text-[11px] tracking-[0.2em] text-[var(--muted)] uppercase">.02</span>
            <h1 className="font-[display] font-black text-[clamp(36px,4vw,56px)] tracking-[-.03em] leading-none mt-2">
              文章
            </h1>
          </div>
          <span className="font-mono text-[11px] tracking-[0.12em] text-[var(--muted)] text-right leading-[1.6]">
            共 {total} 篇
          </span>
        </div>

        {/* Category pills */}
        {categories.length > 0 && (
          <div className="flex gap-2 mb-10 flex-wrap">
            <Link href="/articles">
              <Badge variant={!category ? "default" : "secondary"} className="cursor-pointer text-[11px]">
                全部
              </Badge>
            </Link>
            {categories.map((cat) => (
              <Link key={cat.id} href={`/articles?category=${cat.slug}`}>
                <Badge variant={category === cat.slug ? "default" : "secondary"} className="cursor-pointer text-[11px]">
                  {cat.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[var(--muted)] text-lg">暂无文章</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, i) => (
              <ScrollReveal key={article.id} delay={i * 0.08} direction="up">
                <Link href={`/articles/${article.slug}`}>
                  <TiltCard intensity={4} glare>
                    <Card className="h-full">
                  {/* Thumb */}
                  <div className="relative aspect-[16/10] bg-[var(--hair)] overflow-hidden">
                    {article.coverImage ? (
                      <img src={article.coverImage} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(.92)" }} />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[var(--mute-2)]">
                        <span className="font-[display] font-black text-[40px] tracking-[-.04em] opacity-20">0{i + 1}</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      {article.category && (
                        <span className="text-[9.5px] tracking-[0.2em] text-[var(--ink)] bg-[var(--accent)] px-2 py-1 font-bold">
                          {article.category.name}
                        </span>
                      )}
                    </div>
                    {!isMember && (
                      <div className="absolute top-3 right-3">
                        <Lock className="h-3 w-3 text-[var(--muted)]" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4 pt-3">
                    <CardTitle className="text-[18px]">{article.title}</CardTitle>
                    {article.excerpt && (
                      <CardDescription className="mt-2 text-[11px] normal-case tracking-[0.06em] leading-[1.5]">
                        {article.excerpt}
                      </CardDescription>
                    )}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--hair)] text-[11px] tracking-[0.12em] text-[var(--ink)] font-semibold">
                      <span>{article.author.name || "匿名"}</span>
                      <span className="text-[var(--muted)]">{formatDate(article.createdAt)}</span>
                    </div>
                  </CardContent>
                </Card>
                  </TiltCard>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: totalPages }, (_, i) => (
              <Link key={i} href={`/articles?page=${i + 1}${category ? `&category=${category}` : ""}`}>
                <Badge variant={page === i + 1 ? "default" : "secondary"} className="cursor-pointer px-4 py-2">
                  {i + 1}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
