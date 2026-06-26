import Link from "next/link"
import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { Check } from "lucide-react"

export default async function PlansPage() {
  const session = await auth()
  const tiers = await prisma.membershipTier.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  })

  return (
    <div className="py-16 md:py-24">
      <div className="container">
        {/* Head */}
        <div className="flex items-end justify-between pb-6 border-b border-[var(--ink)] mb-12">
          <div>
            <span className="font-mono text-[11px] tracking-[0.2em] text-[var(--muted)] uppercase">.03</span>
            <h1 className="font-[display] font-black text-[clamp(36px,4vw,56px)] tracking-[-.03em] leading-none mt-2">
              会员方案
            </h1>
          </div>
          <span className="font-mono text-[11px] tracking-[0.12em] text-[var(--muted)] text-right leading-[1.6]">
            选择适合你的
          </span>
        </div>

        <p className="text-[var(--muted)] max-w-md mb-12 text-[15px] leading-[1.6]">
          选择适合你的方案，解锁全部内容
        </p>

        {tiers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[var(--muted)]">暂无可用方案</p>
          </div>
        ) : (
          <div className="grid gap-8 max-w-md mx-auto lg:max-w-none lg:grid-cols-2 lg:max-w-2xl">
            {tiers.map((tier) => {
              let features: string[] = []
              try { features = JSON.parse(tier.features || "[]") } catch {}
              return (
                <Card key={tier.id} className="relative !hover:translate-y-[-6px]">
                  <CardHeader>
                    <CardTitle>{tier.name}</CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                    <div className="mt-6">
                      <span className="font-[display] font-black text-5xl tracking-[-0.02em]">
                        ¥{tier.price}
                      </span>
                      <span className="text-[var(--muted)] ml-2 text-sm">
                        / {tier.durationDays}天
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {features.map((f, i) => (
                        <li key={i} className="flex items-start gap-3 text-[14px]">
                          <Check className="h-4 w-4 text-[var(--accent)] mt-0.5 shrink-0" />
                          <span className="text-[var(--ink-2)]">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    {session?.user ? (
                      <Button className="w-full justify-between text-[13px]" asChild>
                        <Link href={`/checkout/${tier.slug}`}>
                          立即订阅 <span className="font-mono">→</span>
                        </Link>
                      </Button>
                    ) : (
                      <Button className="w-full justify-between text-[13px]" asChild>
                        <Link href="/register">
                          注册后订阅 <span className="font-mono">→</span>
                        </Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
