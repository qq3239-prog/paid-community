import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatCurrency(amount: number): string {
  return `¥${amount.toFixed(2)}`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export function getInitials(name: string): string {
  return name
    .split("")
    .filter((c) => /[一-鿿]/.test(c))
    .slice(0, 1)
    .join("") || name.charAt(0).toUpperCase()
}
