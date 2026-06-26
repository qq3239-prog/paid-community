import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { DeleteCommentButton } from "./DeleteCommentButton"

export default async function AdminCommentsPage() {
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true, email: true } },
      article: { select: { title: true, slug: true } },
    },
    take: 50,
  })

  return (
    <div>
      <div className="pb-6 border-b border-[var(--ink)] mb-8">
        <span className="font-mono text-[11px] tracking-[0.2em] text-[var(--muted)] uppercase">.04</span>
        <h1 className="font-[display] font-black text-[clamp(32px,4vw,48px)] tracking-[-.03em] leading-none mt-2">
          评论审核
        </h1>
      </div>

      <Card className="!hover:translate-y-0">
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--hair)] text-[11px] text-[var(--muted)] font-mono tracking-[0.06em]">
                <th className="text-left p-4 font-semibold">用户</th>
                <th className="text-left p-4 font-semibold hidden md:table-cell">文章</th>
                <th className="text-left p-4 font-semibold">内容</th>
                <th className="text-left p-4 font-semibold hidden lg:table-cell">时间</th>
                <th className="text-right p-4 font-semibold">操作</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((c) => (
                <tr key={c.id} className="border-b border-[var(--hair)] last:border-0 hover:bg-[var(--bg)] transition-colors">
                  <td className="p-4 text-[13px] font-semibold">{c.author.name || c.author.email}</td>
                  <td className="p-4 text-[12px] text-[var(--muted)] hidden md:table-cell max-w-40 truncate">
                    {c.article.title}
                  </td>
                  <td className="p-4 text-[13px] max-w-60 truncate">{c.content}</td>
                  <td className="p-4 text-[11px] text-[var(--muted)] hidden lg:table-cell font-mono">
                    {formatDate(c.createdAt)}
                  </td>
                  <td className="p-4 text-right">
                    <DeleteCommentButton commentId={c.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
