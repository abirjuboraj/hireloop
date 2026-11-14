"use client"

import { Badge } from "@/components/ui/badge"
import type { ApplicationStatus } from "@/lib/types"

/**
 * One color style per status, so every place that shows a status
 * (badge, dropdown, filter pills) looks consistent.
 * Colors match the existing dark-theme badges used in Manage Jobs.
 */
export const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Applied: "border-sky-500/25 bg-sky-500/10 text-sky-400",
  Review: "border-amber-500/25 bg-amber-500/10 text-amber-400",
  Interview: "border-violet-500/25 bg-violet-500/10 text-violet-400",
  Shortlisted: "border-[#5c53fe]/30 bg-[#5c53fe]/15 text-[#a29dff]",
  Offered: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
  Rejected: "border-red-500/25 bg-red-500/10 text-red-400",
}

/** Small colored badge that shows an application status. */
export function ApplicantStatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <Badge variant="outline" className={STATUS_STYLES[status]}>
      {/* Little colored dot, same style as the Active/Expired badges */}
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </Badge>
  )
}
