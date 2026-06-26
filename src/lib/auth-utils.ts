import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole, MembershipStatus } from "@/lib/constants"

export async function getCurrentUser() {
  const session = await auth()
  if (!session?.user?.id) return null
  return prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      memberships: {
        where: { status: MembershipStatus.ACTIVE },
        include: { tier: true },
        orderBy: { endDate: "desc" },
        take: 1,
      },
    },
  })
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) throw new Error("请先登录")
  return user
}

export async function requireMembership() {
  const user = await requireAuth()
  if (user.role === UserRole.ADMIN) return user
  if (user.role !== UserRole.PAID_MEMBER) throw new Error("需要付费会员")
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (user.role !== UserRole.ADMIN) throw new Error("需要管理员权限")
  return user
}

export async function checkMembershipActive(userId: string): Promise<boolean> {
  const membership = await prisma.membership.findFirst({
    where: {
      userId,
      status: MembershipStatus.ACTIVE,
      endDate: { gte: new Date() },
    },
  })
  return !!membership
}

export async function refreshMembershipStatus(userId: string) {
  const activeMembership = await prisma.membership.findFirst({
    where: {
      userId,
      status: MembershipStatus.ACTIVE,
    },
    orderBy: { endDate: "desc" },
  })

  if (activeMembership && activeMembership.endDate < new Date()) {
    await prisma.membership.update({
      where: { id: activeMembership.id },
      data: { status: MembershipStatus.EXPIRED },
    })

    const stillActive = await checkMembershipActive(userId)
    if (!stillActive) {
      await prisma.user.update({
        where: { id: userId },
        data: { role: UserRole.VISITOR },
      })
    }
  }
}
