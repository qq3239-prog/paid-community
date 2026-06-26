import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { Plus, Pencil, Eye } from "lucide-react"

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, author: { select: { name: true } } },
  })

  return (
    <div>
      <div className="flex items-end justify-between pb-6 border-b border-[var(--ink)] mb-8">
        <div>
          <span className="font-mono text-[11px] tracking-[0.2em] text-[var(--muted)] uppercase">.01</span>
          <h1 className="font-[display] font-black text-[clamp(32px,4vw,48px)] tracking-[-.03em] leading-none mt-2">
            文章管理
          </h1>
        </div>
        <Button size="sm" asChild>
          <Link href="/admin/articles/new">
            <Plus className="h-4 w-4" /> 新建文章
          </Link>
        </Button>
      </div>

      <Card className="!hover:translate-y-0">
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--hair)] text-[11px] text-[var(--muted)] font-mono tracking-[0.06em]">
                <th className="text-left p-4 font-semibold">标题</th>
                <th className="text-left p-4 font-semibold hidden md:table-cell">分类</th>
                <th className="text-left p-4 font-semibold hidden md:table-cell">状态</th>
                <th className="text-left p-4 font-semibold hidden lg:table-cell">作者</th>
                <th className="text-left p-4 font-semibold hidden lg:table-cell">日期</th>
                <th className="text-right p-4 font-semibold">操作</th>
              </tr>
            </thead>
            <tbody>
              {articles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-12 text-[var(--muted)]">
                    暂无文章
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr key={article.id} className="border-b border-[var(--hair)] last:border-0 hover:bg-[var(--bg)] transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-bold text-[14px] line-clamp-1">{article.title}</p>
                        <p className="text-[10px] text-[var(--mute-2)] mt-0.5 font-mono">/{article.slug}</p>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      {article.category ? (
                        <Badge variant="success">{article.category.name}</Badge>
                      ) : (
                        <span className="text-[var(--muted)] text-sm">-</span>
                      )}
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <Badge variant={article.isPublished ? "success" : "secondary"}>
                        {article.isPublished ? "已发布" : "草稿"}
                      </Badge>
                    </td>
                    <td className="p-4 hidden lg:table-cell text-[13px]">
                      {article.author.name || "匿名"}
                    </td>
                    <td className="p-4 hidden lg:table-cell text-[12px] text-[var(--muted)] font-mono">
                      {formatDate(article.createdAt)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/articles/${article.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/articles/${article.slug}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
