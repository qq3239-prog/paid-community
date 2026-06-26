import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/layout/AdminSidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 min-w-0">
        <main className="p-8 max-w-[1600px]">{children}</main>
      </div>
    </div>
  )
}
