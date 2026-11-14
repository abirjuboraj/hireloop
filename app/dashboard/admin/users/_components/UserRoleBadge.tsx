"use client"

import { BriefcaseBusiness, ShieldCheck, UserRound } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { resolveUserRole, type UserRole } from "@/lib/types"

/** One color + icon per role, shared by the badge, the dropdown and the cards. */
export const ROLE_META: Record<UserRole, { icon: LucideIcon; badge: string; text: string }> = {
  // Neutral chip, like the mockup's gray "Seeker"
  seeker: {
    icon: UserRound,
    badge: "border-white/10 bg-white/4 text-white/90",
    text: "text-white/90",
  },
  // Purple chip, like the mockup's "Recruiter"
  recruiter: {
    icon: BriefcaseBusiness,
    badge: "border-indigo-500/25 bg-indigo-500/10 text-indigo-400",
    text: "text-indigo-400",
  },
  // Amber chip for admins — stands out without clashing with the brand purple
  admin: {
    icon: ShieldCheck,
    badge: "border-amber-500/25 bg-amber-500/10 text-amber-400",
    text: "text-amber-400",
  },
}

/** Small colored chip showing a user's role, with its icon. */
export function UserRoleBadge({ role }: { role?: string | null }) {
  const meta = ROLE_META[resolveUserRole(role)]

  return (
    <Badge variant="outline" className={meta.badge}>
      <meta.icon className="size-3" />
      {resolveUserRole(role)}
    </Badge>
  )
}
