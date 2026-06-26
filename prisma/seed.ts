import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 开始填充种子数据...")

  // 创建管理员
  const adminPassword = await bcrypt.hash("admin123", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "管理员",
      email: "admin@example.com",
      password: adminPassword,
      role: "ADMIN",
    },
  })
  console.log(`✅ 管理员: admin@example.com / admin123`)

  // 创建测试会员
  const memberPassword = await bcrypt.hash("member123", 12)
  const member = await prisma.user.upsert({
    where: { email: "member@example.com" },
    update: {},
    create: {
      name: "测试会员",
      email: "member@example.com",
      password: memberPassword,
      role: "PAID_MEMBER",
    },
  })

  // 给测试会员激活订阅
  const tier = await prisma.membershipTier.upsert({
    where: { slug: "basic" },
    update: {},
    create: {
      name: "基础会员",
      slug: "basic",
      description: "适合个人学习者，畅享全部文章和社区讨论",
      price: 199.0, // ¥199.00
      durationDays: 365,
      features: JSON.stringify([
        "全部付费文章",
        "社区讨论参与",
        "会员专属标签",
        "无广告体验",
      ]),
      sortOrder: 1,
    },
  })
  console.log(`✅ 会员等级: ${tier.name} (¥${tier.price}/年)`)

  // 创建高等级（暂不启用）
  await prisma.membershipTier.upsert({
    where: { slug: "premium" },
    update: {},
    create: {
      name: "高级会员",
      slug: "premium",
      description: "适合专业开发者，包含基础会员所有权益 + 源码下载 + 一对一交流",
      price: 499.0,
      durationDays: 365,
      features: JSON.stringify([
        "基础会员所有权益",
        "项目源码下载",
        "一对一答疑（每月2次）",
        "优先参与线上活动",
        "专属资源库访问",
      ]),
      sortOrder: 2,
      isActive: false,
    },
  })

  const endDate = new Date()
  endDate.setFullYear(endDate.getFullYear() + 1)

  await prisma.membership.upsert({
    where: { id: "seed-membership-1" },
    update: {},
    create: {
      id: "seed-membership-1",
      userId: member.id,
      tierId: tier.id,
      status: "ACTIVE",
      startDate: new Date(),
      endDate,
    },
  })
  console.log(`✅ 测试会员: member@example.com / member123 (有效期至 ${endDate.toISOString().split("T")[0]})`)

  // 创建分类
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "frontend" },
      update: {},
      create: { name: "前端开发", slug: "frontend", description: "React、Vue、CSS 等前端技术", sortOrder: 1 },
    }),
    prisma.category.upsert({
      where: { slug: "backend" },
      update: {},
      create: { name: "后端开发", slug: "backend", description: "Node.js、Python、数据库等", sortOrder: 2 },
    }),
    prisma.category.upsert({
      where: { slug: "ai" },
      update: {},
      create: { name: "AI 应用", slug: "ai", description: "大模型、提示词工程、Agent 开发", sortOrder: 3 },
    }),
  ])
  console.log(`✅ ${categories.length} 个分类已创建`)

  // 创建示例文章
  const articles = [
    {
      title: "Next.js 14 实战：从零搭建全栈应用",
      slug: "nextjs-14-fullstack-guide",
      excerpt: "本教程带你从零开始，使用 Next.js 14 App Router 构建一个完整的全栈应用。",
      content: `# Next.js 14 实战：从零搭建全栈应用

Next.js 14 带来了 App Router 的稳定版本，让我们可以更高效地构建全栈应用。

## 为什么选择 Next.js

- **前后端一体**：一个项目搞定前端和后端
- **Server Components**：默认服务端渲染，性能优异
- **文件即路由**：直观的路由组织方式
- **TypeScript 原生支持**：类型安全

## 项目初始化

\`\`\`bash
npx create-next-app@latest my-app
\`\`\`

选择 TypeScript、Tailwind CSS、App Router。

## 数据库集成

使用 Prisma ORM：

\`\`\`bash
npm install prisma @prisma/client
npx prisma init
\`\`\`

配置数据库连接，定义数据模型。

> 以上为预览内容，**加入会员**查看完整教程。
`,
      categoryId: categories[0].id,
      isPublished: true,
      isPinned: true,
    },
    {
      title: "Prisma ORM 完全指南",
      slug: "prisma-orm-guide",
      excerpt: "快速掌握 Prisma ORM 的核心概念和最佳实践。",
      content: `# Prisma ORM 完全指南

Prisma 是下一代 Node.js 和 TypeScript ORM。

## 核心概念

1. **Schema** — 数据模型定义
2. **Client** — 类型安全的数据库操作
3. **Migrate** — 数据库迁移

> 以上为预览内容，**加入会员**查看完整教程。
`,
      categoryId: categories[1].id,
      isPublished: true,
      isPinned: true,
    },
    {
      title: "AI Agent 开发入门：从提示词到自主智能体",
      slug: "ai-agent-intro",
      excerpt: "了解 AI Agent 的基本原理，动手构建你的第一个智能体。",
      content: `# AI Agent 开发入门

## 什么是 AI Agent

AI Agent（智能体）是一种能够自主感知环境、做出决策并执行行动的 AI 系统。

## 核心组件

- **LLM**：大语言模型作为推理引擎
- **Tools**：工具调用能力
- **Memory**：上下文记忆
- **Planning**：任务规划与分解

> 以上为预览内容，**加入会员**查看完整教程。
`,
      categoryId: categories[2].id,
      isPublished: true,
      isPinned: true,
    },
  ]

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: {
        ...article,
        authorId: admin.id,
      },
    })
    console.log(`📝 文章: ${article.title}`)
  }

  console.log("\n🎉 种子数据填充完成！")
  console.log("  管理员: admin@example.com / admin123")
  console.log("  测试会员: member@example.com / member123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
