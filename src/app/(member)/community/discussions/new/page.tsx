"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { discussionPostSchema } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function NewDiscussionPage() {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof discussionPostSchema>>({
    resolver: zodResolver(discussionPostSchema),
    defaultValues: { title: "", content: "" },
  })

  function onSubmit(values: z.infer<typeof discussionPostSchema>) {
    fetch("/api/discussions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error || "发布失败")
        return res.json()
      })
      .then((data) => {
        toast({ variant: "success", title: "发布成功" })
        router.push(`/community/discussions/${data.id}`)
      })
      .catch((err) => toast({ variant: "destructive", title: "发布失败", description: err.message }))
  }

  return (
    <div className="py-12">
      <div className="container max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>发起讨论</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>标题</FormLabel>
                      <FormControl>
                        <Input placeholder="讨论主题" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>内容（支持 Markdown）</FormLabel>
                      <FormControl>
                        <Textarea placeholder="写下你的想法..." rows={8} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <Button type="submit">发布</Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>取消</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
