"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { registerSchema } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function RegisterPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  })

  function onSubmit(values: z.infer<typeof registerSchema>) {
    startTransition(async () => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!res.ok) {
        const data = await res.json()
        toast({ variant: "destructive", title: "注册失败", description: data.error || "请稍后重试" })
        return
      }

      toast({ variant: "success", title: "注册成功", description: "请登录" })
      router.push("/login")
    })
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-sm !hover:translate-y-0">
        <CardHeader>
          <CardTitle>注册</CardTitle>
          <p className="text-[12px] text-[var(--muted)] mt-1">创建新账户加入社区</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>邮箱</FormLabel>
                    <FormControl>
                      <Input placeholder="hello@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>密码</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="至少6位字符" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "注册中..." : "注册"}
              </Button>
            </form>
          </Form>
          <p className="mt-6 text-center text-[12px] text-[var(--muted)]">
            已有账号？{" "}
            <Link href="/login" className="text-[var(--accent)] hover:underline font-semibold">
              立即登录
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
