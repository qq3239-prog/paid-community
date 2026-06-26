"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export function CheckoutButton({ tierSlug }: { tierSlug: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function handleCheckout() {
    setLoading(true)
    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tierSlug }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "创建订单失败")
      }

      const result = await res.json()
      if (result.paymentUrl) {
        router.push(result.paymentUrl)
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "支付失败", description: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button className="w-full" size="lg" onClick={handleCheckout} disabled={loading}>
      {loading ? "处理中..." : "确认支付"}
    </Button>
  )
}
