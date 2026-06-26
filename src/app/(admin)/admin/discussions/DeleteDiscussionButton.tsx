"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function DeleteDiscussionButton({ discussionId }: { discussionId: string }) {
  const router = useRouter()
  const { toast } = useToast()

  async function handleDelete() {
    if (!confirm("确定删除该讨论及其所有回复？")) return
    const res = await fetch(`/api/discussions/${discussionId}/replies`, { method: "DELETE" })
    if (res.ok) {
      toast({ variant: "success", title: "已删除" })
      router.refresh()
    } else {
      toast({ variant: "destructive", title: "删除失败" })
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete}>
      <Trash2 className="h-4 w-4 text-red-500" />
    </Button>
  )
}
