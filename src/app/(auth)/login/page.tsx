"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { loginSchema } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  function onSubmit(values: z.infer<typeof loginSchema>) {
    startTransition(async () => {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      })

      if (result?.error) {
        toast({ variant: "destructive", title: "登录失败", description: "邮箱或密码错误" })
      } else {
        router.push("/")
        router.refresh()
      }
    })
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-sm !hover:translate-y-0">
        <CardHeader>
          <CardTitle>登录</CardTitle>
          <p className="text-[12px] text-[var(--muted)] mt-1">登录您的会员账户</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "登录中..." : "登录"}
              </Button>
            </form>
          </Form>
          <p className="mt-6 text-center text-[12px] text-[var(--muted)]">
            还没有账号？{" "}
            <Link href="/register" className="text-[var(--accent)] hover:underline font-semibold">
              立即注册
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
