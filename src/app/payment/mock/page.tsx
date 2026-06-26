"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"

export default function MockPaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const providerOrderId = searchParams.get("providerOrderId")
  const orderId = searchParams.get("orderId")

  async function handlePay() {
    setStatus("loading")
    setMessage("正在处理支付...")
    try {
      const res = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerOrderId, simulate: true }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "支付失败")
      }

      setStatus("success")
      setMessage("支付成功！会员已激活")
      toast({ variant: "success", title: "支付成功", description: "会员已激活" })

      setTimeout(() => {
        router.push("/payment/success")
      }, 1500)
    } catch (err: any) {
      setStatus("error")
      setMessage(err.message)
      toast({ variant: "destructive", title: "支付失败", description: err.message })
    }
  }

  if (!providerOrderId) {
    return (
      <div className="py-24 container max-w-lg text-center">
        <XCircle className="h-12 w-12 mx-auto text-[var(--danger)]" />
        <h1 className="font-[display] font-black text-3xl mt-6">参数错误</h1>
        <p className="text-[var(--muted)] mt-2">缺少支付订单参数</p>
        <Button className="mt-6" onClick={() => router.push("/plans")}>
          返回方案页
        </Button>
      </div>
    )
  }

  return (
    <div className="py-24 container max-w-lg">
      <Card className="!hover:translate-y-0">
        <CardHeader>
          <CardTitle className="text-center text-[22px]">
            {status === "idle" && "模拟支付"}
            {status === "loading" && "处理中"}
            {status === "success" && "支付完成"}
            {status === "error" && "支付失败"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-5">
          {status === "loading" && (
            <Loader2 className="h-12 w-12 mx-auto animate-spin text-[var(--accent)]" />
          )}
          {status === "success" && (
            <CheckCircle2 className="h-12 w-12 mx-auto text-[var(--ok)]" />
          )}
          {status === "error" && (
            <XCircle className="h-12 w-12 mx-auto text-[var(--danger)]" />
          )}

          <p className="text-[var(--muted)] text-[14px]">
            {status === "idle" && "这是模拟支付页面，点击下方按钮即可完成支付"}
            {message}
          </p>

          {status === "idle" && (
            <Button size="lg" className="w-full" onClick={handlePay}>
              确认支付（模拟）
            </Button>
          )}
          {status === "error" && (
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handlePay}>重试</Button>
              <Button variant="ghost" className="flex-1" onClick={() => router.push("/plans")}>返回</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
