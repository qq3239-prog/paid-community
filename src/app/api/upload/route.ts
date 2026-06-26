import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

// 文件上传（占位 — 生产环境对接阿里云 OSS / Vercel Blob）
export async function POST(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "需要管理员权限" }, { status: 403 })
  }

  // 开发环境：返回模拟 URL
  return NextResponse.json({
    url: `https://placeholder.co/800x400?text=Image`,
    message: "上传功能需要在生产环境对接阿里云 OSS",
  })
}
