import Link from "next/link"
import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { ScrollReveal } from "@/components/effects/ScrollReveal"
import { TiltCard } from "@/components/effects/TiltCard"
import { Magnetic } from "@/components/effects/Magnetic"
import { AntiGravityParticles } from "@/components/effects/AntiGravityParticles"
import { GradientText } from "@/components/effects/GradientText"
import { AnimatedCounter } from "@/components/effects/AnimatedCounter"
import { BreathingGlow } from "@/components/effects/BreathingGlow"

export default async function HomePage() {
  const session = await auth()
  const [pinnedArticles, memberCount, articleCount] = await Promise.all([
    prisma.article.findMany({
      where: { isPublished: true, isPinned: true },
      take: 3,
      orderBy: { createdAt: "desc" },
      include: { category: true, author: { select: { name: true } } },
    }),
    prisma.membership.count({ where: { status: "ACTIVE" } }),
    prisma.article.count({ where: { isPublished: true } }),
  ])

  return (
    <div className="relative">
      {/* ── Hero ── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden" style={{ isolation: "isolate" }}>
        {/* Particles background */}
        <AntiGravityParticles count={1000} />

        {/* Subtle glow */}
        <div className="absolute top-1/4 -right-[10%] w-[min(60vw,800px)] aspect-square rounded-full bg-[radial-gradient(circle,var(--accent)_0%,transparent_70%)] opacity-[0.06] blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full px-[clamp(24px,5vw,80px)] py-20">
          <div className="max-w-6xl mx-auto">
            {/* Kicker */}
            <div className="flex items-center gap-3 mb-8 text-[11px] tracking-[0.22em] uppercase text-[var(--muted)] font-semibold animate-rise">
              <span className="w-8 h-px bg-[var(--muted)]" />
              PREMIUM MEMBERSHIP
            </div>

            {/* Headline */}
            <h1 className="font-[display] font-black text-[clamp(48px,9vw,120px)] leading-[1.05] tracking-[-.04em] animate-rise">
              <span>解锁</span>
              <GradientText>独家</GradientText>
              <span> 内容社区</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 max-w-xl text-[clamp(16px,1.5vw,20px)] text-[var(--ink-2)] leading-[1.6] animate-rise">
              高质量教程 · 实战案例 · 社区交流
              <br />
              <span className="text-[var(--muted)]">一次付费，全年畅享</span>
            </p>

            {/* CTA + Stats */}
            <div className="flex flex-wrap items-center gap-6 mt-10 animate-rise">
              {session?.user ? (
                <Link href="/plans">
                  <Button size="lg" className="min-w-[160px] justify-between text-[13px]">
                    查看方案 <span className="font-mono">→</span>
                  </Button>
                </Link>
              ) : (
                <>
                  <BreathingGlow size={16}>
                    <Magnetic strength={0.2}>
                      <Link href="/register">
                        <Button size="lg" className="min-w-[160px] justify-between text-[13px]">
                          立即加入 <span className="font-mono">→</span>
                        </Button>
                      </Link>
                    </Magnetic>
                  </BreathingGlow>
                  <Link href="/articles">
                    <Button variant="ghost" size="lg" className="text-[13px]">浏览文章</Button>
                  </Link>
                </>
              )}

              <div className="hidden sm:flex items-center gap-6 ml-6 pl-6 border-l border-[var(--hair-2)]">
                <div className="text-center">
                  <div className="text-[var(--ink)] font-[display] font-black text-2xl">
                    <AnimatedCounter end={memberCount} />
                  </div>
                  <div className="text-[10px] text-[var(--muted)] font-mono tracking-[0.1em] mt-0.5">会员</div>
                </div>
                <div className="text-center">
                  <div className="text-[var(--ink)] font-[display] font-black text-2xl">
                    <AnimatedCounter end={articleCount} />
                  </div>
                  <div className="text-[10px] text-[var(--muted)] font-mono tracking-[0.1em] mt-0.5">文章</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Articles ── */}
      {pinnedArticles.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="container max-w-6xl">
            <ScrollReveal>
              <div className="flex items-end justify-between pb-6 border-b border-[var(--ink)] mb-10">
                <div>
                  <span className="font-mono text-[11px] tracking-[0.2em] text-[var(--muted)] uppercase">精选</span>
                  <h2 className="font-[display] font-black text-[clamp(32px,4vw,48px)] tracking-[-.03em] leading-none mt-2">
                    最新文章
                  </h2>
                </div>
                <Link
                  href="/articles"
                  className="font-mono text-[11px] tracking-[0.1em] text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
                >
                  查看全部 {articleCount} 篇 →
                </Link>
              </div>
            </ScrollReveal>

            <div className="grid gap-5 md:grid-cols-3">
              {pinnedArticles.map((article, i) => (
                <ScrollReveal key={article.id} delay={i * 0.1} direction="up">
                  <Link href={`/articles/${article.slug}`}>
                    <TiltCard intensity={4} glare>
                      <Card className="h-full">
                        <div className="relative aspect-[16/10] bg-[var(--hair)] overflow-hidden">
                          {article.coverImage ? (
                            <img src={article.coverImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="font-[display] font-black text-[40px] tracking-[-.04em] text-[var(--mute-2)] opacity-20">0{i + 1}</span>
                            </div>
                          )}
                          {article.category && (
                            <span className="absolute bottom-3 left-3 text-[9px] tracking-[0.15em] text-[var(--ink)] bg-[var(--accent)] px-2 py-1 font-bold rounded-sm">
                              {article.category.name}
                            </span>
                          )}
                        </div>
                        <CardContent className="p-4 pt-3">
                          <CardTitle className="text-[18px]">{article.title}</CardTitle>
                          {article.excerpt && (
                            <CardDescription className="mt-2 text-[11px] normal-case tracking-[0.04em] leading-[1.5] line-clamp-2">
                              {article.excerpt}
                            </CardDescription>
                          )}
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--hair)] text-[11px] tracking-[0.08em] text-[var(--ink)] font-semibold">
                            <span>{article.author.name || "匿名"}</span>
                            <span className="text-[var(--muted)]">{formatDate(article.createdAt)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </TiltCard>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-20 md:py-32 border-t border-[var(--hair)]">
        <div className="container text-center max-w-2xl">
          <ScrollReveal>
            <h2 className="font-[display] font-black text-[clamp(36px,6vw,64px)] tracking-[-.03em] leading-[1.1]">
              准备好加入了吗？
            </h2>
            <p className="mt-5 text-[var(--muted)] text-[16px] leading-[1.7]">
              解锁全部付费文章，与优秀创作者交流，全年无限畅享
            </p>
            <div className="mt-10">
              <BreathingGlow size={16}>
                <Link href="/plans">
                  <Button size="lg" className="min-w-[200px] justify-between text-[14px]">
                    查看会员方案 <span className="font-mono">→</span>
                  </Button>
                </Link>
              </BreathingGlow>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
