import type { Metadata } from "next"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "@/components/ui/toaster"
import { CursorEffect } from "@/components/effects/CursorEffect"
import { FloatingOrbs } from "@/components/effects/FloatingOrbs"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "会员社区",
    template: "%s | 会员社区",
  },
  description: "加入我们的付费会员社区，获取独家内容和社群交流",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-background font-sans antialiased">
        <FloatingOrbs />
        <SessionProvider>{children}</SessionProvider>
        <Toaster />
        <CursorEffect />
      </body>
    </html>
  )
}
