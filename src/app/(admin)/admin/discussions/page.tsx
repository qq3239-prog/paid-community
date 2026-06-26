import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { DeleteDiscussionButton } from "./DeleteDiscussionButton"

export default async function AdminDiscussionsPage() {
  const discussions = await prisma.discussionPost.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true, email: true } },
      _count: { select: { replies: true } },
    },
  })

  return (
    <div>
      <div className="pb-6 border-b border-[var(--ink)] mb-8">
        <span className="font-mono text-[11px] tracking-[0.2em] text-[var(--muted)] uppercase">.05</span>
        <h1 className="font-[display] font-black text-[clamp(32px,4vw,48px)] tracking-[-.03em] leading-none mt-2">
          讨论管理
        </h1>
      </div>

      <Card className="!hover:translate-y-0">
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--hair)] text-[11px] text-[var(--muted)] font-mono tracking-[0.06em]">
                <th className="text-left p-4 font-semibold">标题</th>
                <th className="text-left p-4 font-semibold hidden md:table-cell">作者</th>
                <th className="text-left p-4 font-semibold">回复</th>
                <th className="text-left p-4 font-semibold hidden lg:table-cell">时间</th>
                <th className="text-right p-4 font-semibold">操作</th>
              </tr>
            </thead>
            <tbody>
              {discussions.map((d) => (
                <tr key={d.id} className="border-b border-[var(--hair)] last:border-0 hover:bg-[var(--bg)] transition-colors">
                  <td className="p-4 font-bold text-[14px]">{d.title}</td>
                  <td className="p-4 text-[12px] text-[var(--muted)] hidden md:table-cell">
                    {d.author.name || d.author.email}
                  </td>
                  <td className="p-4 text-[13px] font-semibold">{d._count.replies}</td>
                  <td className="p-4 text-[11px] text-[var(--muted)] hidden lg:table-cell font-mono">
                    {formatDate(d.createdAt)}
                  </td>
                  <td className="p-4 text-right">
                    <DeleteDiscussionButton discussionId={d.id} />
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
