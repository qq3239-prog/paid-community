import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export default function PaymentSuccessPage() {
  return (
    <div className="py-16 container max-w-lg text-center">
      <Card>
        <CardHeader>
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
          <CardTitle className="mt-4">支付成功！</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            恭喜成为会员！现在可以畅享全部付费内容了。
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild>
              <Link href="/articles">浏览文章</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/profile">个人中心</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
