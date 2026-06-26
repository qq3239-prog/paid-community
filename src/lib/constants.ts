export const UserRole = {
  VISITOR: "VISITOR",
  PAID_MEMBER: "PAID_MEMBER",
  ADMIN: "ADMIN",
} as const
export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export const MembershipStatus = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
} as const
export type MembershipStatus = (typeof MembershipStatus)[keyof typeof MembershipStatus]

export const PaymentStatus = {
  CREATED: "CREATED",
  PAID: "PAID",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
  CANCELLED: "CANCELLED",
} as const
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus]
