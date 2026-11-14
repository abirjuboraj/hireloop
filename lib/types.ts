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
  "Engineering & Tech",
  "Design & Creative",
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
  "qualifications & requirements": string[]
  applicants: number
}


/** A stored job post shown in the recruiter's Manage Jobs table (extends the create form). */
export type JobPost = JobForm & {
  _id: string
  postedAgo: string
  status?: string
  /** The recruiter who owns this job — null when missing from the jobs collection. */
  recruiterId?: string | null
}

export type ApplicationStatus =
  | "Applied"
  | "Review"
  | "Interview"
  | "Shortlisted"
  | "Rejected"
  | "Offered"

/**
 * Data posted when a seeker applies — the job's snapshot is copied at
 * apply-time. User identity comes from the frontend session (JWT later).
 */
export type ApplicationPayload = {
  jobId: string
  /** Injected by applyToJob from the frontend session. */
  seekerId?: string
  seekerEmail?: string
  /** From the jobs collection; null when the job has no recruiter id. */
  recruiterId: string | null
  title: string
  companyName: string
  category: string
  jobType: string
  isRemote: boolean
  location: string
}

/** A stored application shown in the seeker's Applications table. */
export type Application = Omit<ApplicationPayload, "seekerId"> & {
  _id: string
  /** Identity, sent from the frontend session. */
  seekerId: string
  seekerEmail?: string
  status: ApplicationStatus
  /** ISO date string of when the seeker applied. */
  appliedAt: string
  archived?: boolean
  /**
   * Only present for recruiters: the backend looks up each applicant's user
   * document and attaches their name (applications themselves don't store it).
   */
  applicantName?: string | null
}
