"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import type { ApplicationStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

import { STATUS_STYLES } from "./ApplicantStatusBadge"

/**
 * The dropdown a recruiter uses to change an applicant's status.
 * The trigger itself shows the current status as a colored chip, so the
 * table stays clean — no separate badge + button needed.
 */
export function ApplicantStatusSelect({
  status,
  onChange,
  disabled,
}: {
  status: ApplicationStatus
  onChange: (next: ApplicationStatus) => void
  disabled?: boolean
}) {
  return (
    <Select
      value={status}
      onValueChange={(value) => onChange(value as ApplicationStatus)}
    >
      {/* The trigger is styled with the current status's colors and shows a
          small dot + the status name — same look as the badge. */}
      <SelectTrigger
        disabled={disabled}
        aria-label={`Change status (currently ${status})`}
        className={cn(
          "h-7 w-fit cursor-pointer gap-1.5 rounded-lg px-2.5 text-xs font-medium",
          STATUS_STYLES[status]
        )}
      >
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-current" />
          {status}
        </span>
      </SelectTrigger>

      <SelectContent>
        {/* Every standard status, in the usual hiring-pipeline order */}
        {(
          [
            "Applied",
            "Review",
            "Interview",
            "Shortlisted",
            "Offered",
            "Rejected",
          ] as ApplicationStatus[]
        ).map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
