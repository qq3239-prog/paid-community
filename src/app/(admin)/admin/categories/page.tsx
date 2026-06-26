"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2 } from "lucide-react"

export default function AdminCategoriesPage() {
  const { toast } = useToast()
  const [categories, setCategories] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  function loadCategories() {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
  }

  useEffect(loadCategories, [])

  function resetForm() {
    setName(""); setSlug(""); setDescription(""); setEditId(null)
  }

  function openCreate() {
    resetForm(); setOpen(true)
  }

  function openEdit(cat: any) {
    setEditId(cat.id); setName(cat.name); setSlug(cat.slug); setDescription(cat.description || "")
    setOpen(true)
  }

  async function handleSubmit() {
    setLoading(true)
    const url = editId ? `/api/admin/categories/${editId}` : "/api/admin/categories"
    const method = editId ? "PATCH" : "POST"
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, description }),
      })
      if (!res.ok) throw new Error((await res.json()).error || "操作失败")
      toast({ variant: "success", title: editId ? "已更新" : "已创建" })
      setOpen(false)
      loadCategories()
    } catch (err: any) {
      toast({ variant: "destructive", title: "操作失败", description: err.message })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("确定删除该分类？")) return
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" })
    if (res.ok) {
      toast({ variant: "success", title: "已删除" })
      loadCategories()
    } else {
      const data = await res.json()
      toast({ variant: "destructive", title: "删除失败", description: data.error })
    }
  }

  return (
    <div>
      <div className="flex items-end justify-between pb-6 border-b border-[var(--ink)] mb-8">
        <div>
          <span className="font-mono text-[11px] tracking-[0.2em] text-[var(--muted)] uppercase">.02</span>
          <h1 className="font-[display] font-black text-[clamp(32px,4vw,48px)] tracking-[-.03em] leading-none mt-2">
            分类管理
          </h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openCreate}>
              <Plus className="h-4 w-4" /> 新建分类
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editId ? "编辑分类" : "新建分类"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
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
                <Input className="mt-1.5" value={description} onChange={(e) => setDescription(e.target.value)} />
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
                <th className="text-left p-4 font-semibold">URL</th>
                <th className="text-left p-4 font-semibold hidden md:table-cell">描述</th>
                <th className="text-left p-4 font-semibold">文章数</th>
                <th className="text-right p-4 font-semibold">操作</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-[var(--hair)] last:border-0 hover:bg-[var(--bg)] transition-colors">
                  <td className="p-4 font-bold text-[14px]">{cat.name}</td>
                  <td className="p-4 text-[12px] text-[var(--muted)] font-mono">/{cat.slug}</td>
                  <td className="p-4 text-[13px] text-[var(--muted)] hidden md:table-cell">{cat.description || "-"}</td>
                  <td className="p-4"><Badge variant="success">{cat._count.articles}</Badge></td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(cat)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(cat.id)}>
                      <Trash2 className="h-4 w-4 text-[var(--danger)]" />
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
