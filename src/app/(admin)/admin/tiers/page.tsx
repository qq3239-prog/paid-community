"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil } from "lucide-react"

export default function AdminTiersPage() {
  const { toast } = useToast()
  const [tiers, setTiers] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [durationDays, setDurationDays] = useState("30")
  const [features, setFeatures] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)

  function loadTiers() {
    fetch("/api/admin/tiers").then((r) => r.json()).then(setTiers)
  }
  useEffect(loadTiers, [])

  function resetForm() {
    setName(""); setSlug(""); setDescription(""); setPrice(""); setDurationDays("30"); setFeatures(""); setIsActive(true); setEditId(null)
  }

  function openEdit(tier: any) {
    setEditId(tier.id); setName(tier.name); setSlug(tier.slug); setDescription(tier.description || "")
    setPrice(String(tier.price)); setDurationDays(String(tier.durationDays))
    let featArr: string[] = []
    try { featArr = JSON.parse(tier.features || "[]") } catch {}
    setFeatures(featArr.join("\n"))
    setIsActive(tier.isActive); setOpen(true)
  }

  async function handleSubmit() {
    setLoading(true)
    const url = editId ? `/api/admin/tiers/${editId}` : "/api/admin/tiers"
    const method = editId ? "PATCH" : "POST"
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, slug, description,
          price: parseFloat(price),
          durationDays: parseInt(durationDays),
          features: features.split("\n").filter(Boolean),
          isActive,
        }),
      })
      if (!res.ok) throw new Error((await res.json()).error || "操作失败")
      toast({ variant: "success", title: editId ? "已更新" : "已创建" })
      setOpen(false); loadTiers()
    } catch (err: any) {
      toast({ variant: "destructive", title: "操作失败", description: err.message })
    } finally { setLoading(false) }
  }

  return (
    <div>
      <div className="flex items-end justify-between pb-6 border-b border-[var(--ink)] mb-8">
        <div>
          <span className="font-mono text-[11px] tracking-[0.2em] text-[var(--muted)] uppercase">.06</span>
          <h1 className="font-[display] font-black text-[clamp(32px,4vw,48px)] tracking-[-.03em] leading-none mt-2">
            方案管理
          </h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={resetForm}><Plus className="h-4 w-4" /> 新建方案</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>{editId ? "编辑方案" : "新建方案"}</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-4 max-h-[60vh] overflow-y-auto">
              <div>
                <label className="text-[13px] font-semibold tracking-[0.02em]">名称</label>
                <Input className="mt-1.5" value={name} onChange={(e) => { setName(e.target.value); if (!editId) setSlug(e.target.value.toLowerCase().replace(/[\s_]+/g, "-").replace(/[^\w-]/g, "")) }} />
              </div>
              <div>
                <label className="text-[13px] font-semibold tracking-[0.02em]">URL</label>
                <Input className="mt-1.5" value={slug} onChange={(e) => setSlug(e.target.value)} />
              </div>
              <div>
                <label className="text-[13px] font-semibold tracking-[0.02em]">描述</label>
                <Textarea className="mt-1.5" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[13px] font-semibold tracking-[0.02em]">价格 (元)</label>
                  <Input className="mt-1.5" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div>
                  <label className="text-[13px] font-semibold tracking-[0.02em]">天数</label>
                  <Input className="mt-1.5" type="number" value={durationDays} onChange={(e) => setDurationDays(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-[13px] font-semibold tracking-[0.02em]">权益 (每行一项)</label>
                <Textarea className="mt-1.5" value={features} onChange={(e) => setFeatures(e.target.value)} rows={4} placeholder="全部付费文章&#10;社区讨论参与" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} id="isActive" />
                <label htmlFor="isActive" className="text-[13px]">启用</label>
              </div>
              <Button onClick={handleSubmit} disabled={loading} className="w-full">
                {loading ? "保存中..." : "保存"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="!hover:translate-y-0">
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--hair)] text-[11px] text-[var(--muted)] font-mono tracking-[0.06em]">
                <th className="text-left p-4 font-semibold">名称</th>
                <th className="text-left p-4 font-semibold">价格</th>
                <th className="text-left p-4 font-semibold hidden md:table-cell">天数</th>
                <th className="text-left p-4 font-semibold">状态</th>
                <th className="text-right p-4 font-semibold">操作</th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((tier) => (
                <tr key={tier.id} className="border-b border-[var(--hair)] last:border-0 hover:bg-[var(--bg)] transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-[14px]">{tier.name}</span>
                    <br/>
                    <span className="text-[10px] text-[var(--mute-2)] font-mono">/{tier.slug}</span>
                  </td>
                  <td className="p-4 font-[display] font-black text-xl">¥{tier.price}</td>
                  <td className="p-4 hidden md:table-cell text-[13px]">{tier.durationDays}天</td>
                  <td className="p-4">
                    <Badge variant={tier.isActive ? "success" : "secondary"}>
                      {tier.isActive ? "启用" : "停用"}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(tier)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
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
