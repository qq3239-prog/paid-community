"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { profileSchema } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileEditPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", bio: "" },
  })

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        form.reset({ name: data.name || "", bio: data.bio || "" })
      })
      .catch(() => toast({ variant: "destructive", title: "加载失败" }))
      .finally(() => setLoading(false))
  }, [])

  function onSubmit(values: z.infer<typeof profileSchema>) {
    fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "保存失败")
        }
        toast({ variant: "success", title: "保存成功" })
        router.push("/profile")
        router.refresh()
      })
      .catch((err) => toast({ variant: "destructive", title: "保存失败", description: err.message }))
  }

  if (loading) {
    return (
      <div className="py-16 container max-w-lg">
        <Skeleton className="h-8 w-32 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="py-16">
      <div className="container max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>编辑资料</CardTitle>
            <CardDescription>修改你的个人资料信息</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>昵称</FormLabel>
                      <FormControl>
                        <Input placeholder="你的昵称" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>个人简介</FormLabel>
                      <FormControl>
                        <Textarea placeholder="介绍一下你自己" rows={4} {...field} value={field.value || ""} />
                      </FormControl>
                      <FormDescription>最多500字</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <Button type="submit">保存</Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    取消
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
