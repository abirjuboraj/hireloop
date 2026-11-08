import type { LucideIcon } from "lucide-react"

export const USER_ROLES = ["seeker", "recruiter", "admin"] as const

export type UserRole = (typeof USER_ROLES)[number]

export type MenuItem = {
  name: string
  url: string
  icon: LucideIcon
}

/** Maps any (possibly invalid) role value to a valid role. Defaults to "seeker". */
export function resolveUserRole(role?: string | null): UserRole {
  return role === "recruiter" || role === "admin" ? role : "seeker"
}
