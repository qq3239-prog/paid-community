import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

// 需要登录的路由
const memberRoutes = ["/profile", "/checkout"]
const adminRoutes = ["/admin"]

// 公开路由（无需拦截）
const publicPaths = ["/login", "/register", "/api/auth", "/api/payment/webhook"]

export default auth((req) => {
  const { pathname } = req.nextUrl
  const user = req.auth?.user

  // 公开路由直接放行
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // 静态资源和 API 放行
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.match(/\.(ico|png|jpg|svg|css|js)$/)
  ) {
    return NextResponse.next()
  }

  // 需要管理员的路由
  if (adminRoutes.some((r) => pathname.startsWith(r))) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    if (user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url))
    }
    return NextResponse.next()
  }

  // 需要登录的路由
  if (memberRoutes.some((r) => pathname.startsWith(r))) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
