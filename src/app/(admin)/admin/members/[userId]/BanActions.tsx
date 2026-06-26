"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { UserRole } from "@/lib/constants"

export function BanActions({ userId, currentRole }: { userId: string; currentRole: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  async function updateRole(role: string) {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/members/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      })
      if (!res.ok) throw new Error((await res.json()).error || "操作失败")
      toast({ variant: "success", title: "已更新" })
      router.refresh()
    } catch (err: any) {
      toast({ variant: "destructive", title: "操作失败", description: err.message })
    } finally {
      setLoading(false)
    }
  }

  async function extendMembership(days: number) {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/members/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ extendDays: days }),
      })
      if (!res.ok) throw new Error((await res.json()).error || "操作失败")
      toast({ variant: "success", title: `已延期 ${days} 天` })
      router.refresh()
    } catch (err: any) {
      toast({ variant: "destructive", title: "操作失败", description: err.message })
    } finally {
      setLoading(false)
    }
  }

  async function banMembership() {
    if (!confirm("确定取消该用户的有效会员？")) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/members/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banMembership: true }),
      })
      if (!res.ok) throw new Error((await res.json()).error || "操作失败")
      toast({ variant: "success", title: "已取消会员" })
      router.refresh()
    } catch (err: any) {
      toast({ variant: "destructive", title: "操作失败", description: err.message })
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-sm">角色管理</h4>
      <div className="flex gap-2 flex-wrap">
        <Button size="sm" variant={currentRole === UserRole.VISITOR ? "default" : "outline"} onClick={() => updateRole(UserRole.VISITOR)} disabled={loading}>
          设为游客
        </Button>
        <Button size="sm" variant={currentRole === UserRole.PAID_MEMBER ? "default" : "outline"} onClick={() => updateRole(UserRole.PAID_MEMBER)} disabled={loading}>
          设为会员
        </Button>
        <Button size="sm" variant={currentRole === UserRole.ADMIN ? "default" : "outline"} onClick={() => updateRole(UserRole.ADMIN)} disabled={loading}>
          设为管理员
        </Button>
      </div>
      <h4 className="font-medium text-sm mt-4">会员延期</h4>
      <div className="flex gap-2 flex-wrap">
        <Button size="sm" variant="outline" onClick={() => extendMembership(30)} disabled={loading}>延期 30 天</Button>
        <Button size="sm" variant="outline" onClick={() => extendMembership(90)} disabled={loading}>延期 90 天</Button>
        <Button size="sm" variant="outline" onClick={() => extendMembership(365)} disabled={loading}>延期 365 天</Button>
      </div>
      <h4 className="font-medium text-sm mt-4 text-red-600">危险操作</h4>
      <Button size="sm" variant="destructive" onClick={banMembership} disabled={loading}>取消会员</Button>
    </div>
  )
}
