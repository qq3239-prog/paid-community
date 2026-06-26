"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { articleSchema } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"

function MarkdownEditor({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  return (
    <Textarea
      placeholder="使用 Markdown 语法编写文章内容..."
      rows={20}
      className="font-mono text-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [articleId, setArticleId] = useState("")
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])

  const form = useForm<z.infer<typeof articleSchema>>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      isPublished: true,
      isPinned: false,
      categoryId: undefined,
    },
  })

  useEffect(() => {
    params.then(({ id }) => {
      setArticleId(id)
      Promise.all([
        fetch(`/api/articles/${id}`).then((r) => r.json()),
        fetch("/api/categories").then((r) => r.json()),
      ]).then(([article, cats]) => {
        setCategories(cats)
        form.reset(article)
      }).catch(() => {
        toast({ variant: "destructive", title: "加载失败" })
      }).finally(() => setLoading(false))
    })
  }, [])

  function onSubmit(values: z.infer<typeof articleSchema>) {
    fetch(`/api/articles/${articleId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error || "保存失败")
        toast({ variant: "success", title: "保存成功" })
        router.refresh()
      })
      .catch((err) => toast({ variant: "destructive", title: "保存失败", description: err.message }))
  }

  async function handleDelete() {
    if (!confirm("确定删除这篇文章吗？此操作不可恢复。")) return
    const res = await fetch(`/api/articles/${articleId}`, { method: "DELETE" })
    if (res.ok) {
      toast({ variant: "success", title: "文章已删除" })
      router.push("/admin/articles")
    } else {
      toast({ variant: "destructive", title: "删除失败" })
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">编辑文章</h1>
      <Card className="max-w-4xl">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>标题</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>摘要</FormLabel>
                    <FormControl>
                      <Textarea rows={2} {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>分类</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择分类" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">无分类</SelectItem>
                          {categories.map((c) => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isPublished"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>发布状态</FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(v === "true")}
                        value={field.value ? "true" : "false"}
                      >
                        <FormControl>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="true">已发布</SelectItem>
                          <SelectItem value="false">草稿</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isPinned"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>置顶</FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(v === "true")}
                        value={field.value ? "true" : "false"}
                      >
                        <FormControl>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="true">是</SelectItem>
                          <SelectItem value="false">否</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>内容（Markdown）</FormLabel>
                    <FormControl>
                      <MarkdownEditor value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button type="submit">保存</Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>取消</Button>
                <div className="flex-1" />
                <Button type="button" variant="destructive" onClick={handleDelete}>删除</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
