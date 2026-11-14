"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { USER_ROLES, resolveUserRole, type UserRole } from "@/lib/types"
import { cn } from "@/lib/utils"

import { ROLE_META } from "./UserRoleBadge"

/**
 * The "toggle" button in the Actions column that switches a user's role.
 * The trigger shows the user's CURRENT role as a small chip; opening it
 * offers all three roles as "Make …" options. Picking one calls
 * onValueChange — the actual better-auth setRole call happens in the page.
 */
export function UserRoleSelect({
  role,
  onChange,
  disabled,
}: {
  role?: string | null
  onChange: (next: UserRole) => void
  disabled?: boolean
}) {
  const current = resolveUserRole(role)

  return (
    <Select value={current} onValueChange={(value) => onChange(value as UserRole)}>
      {/* The current role acts as the dropdown trigger — same pattern as the
          applicants' status dropdown, so both admin pages feel familiar */}
      <SelectTrigger
        disabled={disabled}
        aria-label={`Change role (currently ${current})`}
        title={disabled ? "You can't change your own role from here" : undefined}
        className="h-7 w-fit cursor-pointer gap-1.5 rounded-lg border-transparent px-2 text-xs font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground data-[state=open]:bg-muted/50"
      >
        <span className="flex items-center gap-1.5">
          {/* Role icon in the role's color, label in plain text */}
          {(() => {
            const meta = ROLE_META[current]
            return <meta.icon className={cn("size-3.5", meta.text)} />
          })()}
          {current}
        </span>
      </SelectTrigger>

      <SelectContent>
        {/* "Make …" options, one per role (USER_ROLES = seeker/recruiter/admin) */}
        {USER_ROLES.map((option) => {
          const meta = ROLE_META[option]
          return (
            <SelectItem key={option} value={option}>
              <span className="flex items-center gap-2">
                <meta.icon className={cn("size-3.5", meta.text)} />
                Make {option}
              </span>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
