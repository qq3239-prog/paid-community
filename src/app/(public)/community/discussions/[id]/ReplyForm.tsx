"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

export function ReplyForm({ postId }: { postId: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!content.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`/api/discussions/${postId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, postId }),
      })
      if (!res.ok) throw new Error((await res.json()).error || "回复失败")
      toast({ variant: "success", title: "回复成功" })
      setContent("")
      router.refresh()
    } catch (err: any) {
      toast({ variant: "destructive", title: "回复失败", description: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <Textarea
        placeholder="写下你的回复..."
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button onClick={handleSubmit} disabled={loading || !content.trim()}>
        {loading ? "提交中..." : "回复"}
      </Button>
    </div>
  )
}
