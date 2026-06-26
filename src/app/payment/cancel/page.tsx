import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle } from "lucide-react"

export default function PaymentCancelPage() {
  return (
    <div className="py-16 container max-w-lg text-center">
      <Card>
        <CardHeader>
          <XCircle className="h-16 w-16 text-yellow-500 mx-auto" />
          <CardTitle className="mt-4">支付已取消</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            你取消了本次支付。如有疑问可随时联系客服。
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild>
              <Link href="/plans">重新选择方案</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">返回首页</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
