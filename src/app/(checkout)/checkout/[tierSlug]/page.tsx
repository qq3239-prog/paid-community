import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { CheckoutButton } from "./CheckoutButton"
import Link from "next/link"

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ tierSlug: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const { tierSlug } = await params
  const tier = await prisma.membershipTier.findUnique({
    where: { slug: tierSlug },
  })

  if (!tier || !tier.isActive) redirect("/plans")

  const activeMembership = await prisma.membership.findFirst({
    where: { userId: session.user.id, status: "ACTIVE", endDate: { gte: new Date() } },
    include: { tier: true },
  })

  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-lg">
        <div className="text-center mb-10">
          <span className="font-mono text-[11px] tracking-[0.2em] text-[var(--muted)] uppercase">checkout</span>
          <h1 className="font-[display] font-black text-4xl tracking-[-.03em] mt-2">确认订阅</h1>
        </div>

        {activeMembership && (
          <Card className="mb-6 !hover:translate-y-0 border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]">
            <CardContent className="p-4 text-sm">
              你已有有效的 {activeMembership.tier.name} 会员（至 {activeMembership.endDate.toLocaleDateString("zh-CN")}）
            </CardContent>
          </Card>
        )}

        <Card className="!hover:translate-y-0">
          <CardHeader>
            <CardTitle>{tier.name}</CardTitle>
            <p className="text-[12px] text-[var(--muted)] mt-1">{tier.description}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center pt-4 border-t border-[var(--hair)]">
              <span className="font-semibold text-[15px]">费用</span>
              <span className="font-[display] font-black text-3xl tracking-[-0.02em]">
                ¥{tier.price}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-t border-[var(--hair)]">
              <span className="text-[var(--muted)] text-sm">时长</span>
              <span className="text-sm">{tier.durationDays}天</span>
            </div>
            <CheckoutButton tierSlug={tier.slug} />
            <p className="text-center text-[11px] text-[var(--mute-2)] pt-2">
              <Link href="/plans" className="hover:text-[var(--ink)] transition-colors">← 返回方案列表</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
