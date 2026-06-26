import { z } from "zod"
import { UserRole } from "@/lib/constants"

export const loginSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(6, "密码至少6个字符"),
})

export const registerSchema = z.object({
  name: z.string().min(2, "昵称至少2个字符"),
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(6, "密码至少6个字符"),
})

export const articleSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  slug: z.string().min(1, "URL 不能为空"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "内容不能为空"),
  coverImage: z.string().optional(),
  isPublished: z.boolean().default(true),
  isPinned: z.boolean().default(false),
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()).default([]),
})

export const categorySchema = z.object({
  name: z.string().min(1, "分类名不能为空"),
  slug: z.string().min(1, "URL 不能为空"),
  description: z.string().optional(),
})

export const commentSchema = z.object({
  content: z.string().min(1, "评论不能为空").max(2000, "评论不能超过2000字"),
  articleId: z.string(),
  parentId: z.string().optional(),
})

export const discussionPostSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  content: z.string().min(1, "内容不能为空"),
})

export const discussionReplySchema = z.object({
  content: z.string().min(1, "回复不能为空").max(2000, "回复不能超过2000字"),
  postId: z.string(),
  parentId: z.string().optional(),
})

export const profileSchema = z.object({
  name: z.string().min(2, "昵称至少2个字符"),
  bio: z.string().max(500, "简介不能超过500字").optional(),
  image: z.string().optional(),
})

export const tierSchema = z.object({
  name: z.string().min(1, "等级名称不能为空"),
  slug: z.string().min(1, "URL 不能为空"),
  description: z.string().optional(),
  price: z.coerce.number().positive("价格必须大于0"),
  durationDays: z.coerce.number().int().positive("天数必须大于0").default(30),
  features: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
})

export const memberUpdateSchema = z.object({
  role: z.enum([UserRole.VISITOR, UserRole.PAID_MEMBER, UserRole.ADMIN]).optional(),
  extendDays: z.number().int().positive().optional(),
  banMembership: z.boolean().optional(),
})
