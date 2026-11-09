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

export const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"] as const

export type JobType = (typeof JOB_TYPES)[number]

export const JOB_CATEGORIES = [
  "Engineering, Tech",
  "Design, Creative",
  "Marketing",
  "Finance",
  "Other",
] as const

export const SALARY_FREQUENCIES = ["per hour", "per day", "per week", "per month", "per year"] as const

export type JobForm = {
  title: string
  companyName: string
  category: string
  jobType: JobType
  isRemote: boolean
  location: string
  deadline: string
  minSalary: string
  maxSalary: string
  frequency: string
  responsibilities: string[]
  qualifications: string[]
  applicants: number
}


/** A stored job post shown in the recruiter's Manage Jobs table (extends the create form). */
export type JobPost = JobForm & {
  _id: string
  postedAgo: string
}
