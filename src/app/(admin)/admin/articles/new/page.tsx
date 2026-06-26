"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { articleSchema } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

// 简易 Markdown 编辑器（后续可替换为 Milkdown）
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

export default function NewArticlePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [loaded, setLoaded] = useState(false)

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

  // 加载分类
  useState(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .finally(() => setLoaded(true))
  })

  function generateSlug() {
    const title = form.watch("title")
    if (title) {
      form.setValue("slug", title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").trim())
    }
  }

  function onSubmit(values: z.infer<typeof articleSchema>) {
    fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "创建失败")
        }
        return res.json()
      })
      .then((data) => {
        toast({ variant: "success", title: "文章创建成功" })
        router.push(`/admin/articles/${data.id}/edit`)
      })
      .catch((err) => toast({ variant: "destructive", title: "创建失败", description: err.message }))
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">新建文章</h1>
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
                        <Input placeholder="文章标题" {...field} onBlur={() => generateSlug()} />
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
                        <Input placeholder="article-slug" {...field} />
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
                      <Textarea placeholder="文章摘要（公开可见）" rows={2} {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>未登录用户看到的预览内容</FormDescription>
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
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
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
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
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
                <Button type="submit">发布文章</Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  取消
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
