"use client"

import {
  BadgeCheck,
  Banknote,
  Bookmark,
  Briefcase,
  MapPin,
  Users,
  type LucideIcon,
} from "lucide-react"
import { useState } from "react"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import type { ApplicationPayload, JobPost } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/toast"
import { applyToJob } from "@/lib/actions/applications"

type JobDetailsProps = {
  job: JobPost
}

/** The API may return bullet fields as an array or as newline-joined strings. */
function toList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is string =>
        typeof item === "string" && item.trim().length > 0
    )
  }
  if (typeof value === "string") {
    return value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
  }
  return []
}

/** "2027-01-20" → "Jan 20, 2027"; falls back to the raw string if unparseable. */
function formatDate(date: string) {
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime())
    ? date
    : parsed.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
}

/** Small uppercase label + value tile used in the quick-facts row. */
function MetaTile({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-4">
      <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
        <Icon className="size-3.5 shrink-0" />
        {label}
      </div>
      <p className="mt-2 truncate text-sm font-semibold">{value}</p>
    </div>
  )
}

/** Bulleted list with the small square markers used in the mockup. */
function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-3.5">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
        >
          <span className="mt-2 size-1.5 shrink-0 rounded-xs bg-muted-foreground/60" />
          {item}
        </li>
      ))}
    </ul>
  )
}

/** Uppercase label left, value right — used in the company overview card. */
function OverviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
        {label}
      </span>
      <span className="truncate text-right text-sm">{value}</span>
    </div>
  )
}

export function JobDetails({ job }: JobDetailsProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const { data: session } = useSession()
  const user = session?.user
  const router = useRouter()

  // const handleToggleBookmark = () => {
  //   setIsBookmarked((previous) => !previous)
  //   console.log("Bookmark toggled for job:", job._id)
  // }

  const handleApply = async() => {
    console.log("Applied to job:", job._id)

    if (!user) {
      toast.add({
        type: "info",
        title: "Sign-in required",
        description: "Please Sign in",
      })
      router.push(
        `/sign-in?callback=${encodeURIComponent(`/browse-jobs/${job._id}`)}`
      )
      return
    } else if (user.role === "seeker") {
      // Job snapshot at apply-time — seeker identity is injected by applyToJob
      // from the frontend session; recruiterId comes from the job (or null).
      const application: ApplicationPayload = {
        jobId: job._id,
        recruiterId: job.recruiterId ?? null,
        title: job.title,
        companyName: job.companyName,
        category: job.category,
        jobType: job.jobType,
        isRemote: job.isRemote,
        location: job.location,
      }

      const res = await applyToJob(application);

      if(res.success || res.insertedId){
        toast.add({
          title: "Job Apply Successful",
          description: `You have successfully applied for the job ${job.title}`,
          type: "success"
        })

        router.push("/dashboard/seeker/applications");
      }

    }else{
      toast.add({
        title: "Apply Denied",
        description: "Only Job Seekers are allowed to apply",
        type: "error"
      })
    }
  }

  const responsibilities = toList(job.responsibilities)
  const requirements = toList(job["qualifications & requirements"])

  const salary = `$${job.minSalary} - $${job.maxSalary}`

  // The API may already append "(Remote)"/"(Hybrid)" to the location string.
  const locationText =
    job.isRemote && !/remote|hybrid/i.test(job.location)
      ? `${job.location}, (Remote)`
      : job.location

  return (
    <div>
      <Link
        href="/browse-jobs"
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        &larr; Back to Jobs
      </Link>

      <div className="mt-4 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* Left column — hero, quick facts, one tall description card */}
        <div className="space-y-6">
          {/* Hero card */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-4 sm:gap-5">
              {/* Company logo — initials fallback when no logo image exists */}
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-black text-lg font-semibold text-foreground sm:size-16">
                {job.companyName.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  {job.title}
                </h1>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                  {job.companyName}
                  <span className="text-border">|</span>
                  <span className="inline-flex items-center gap-1.5 text-green-500">
                    <BadgeCheck className="size-4" />
                    {job.status ?? "Verified Employer"}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  // onClick={handleToggleBookmark}
                  aria-pressed={isBookmarked}
                  aria-label={isBookmarked ? "Remove bookmark" : "Save job"}
                  className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-black text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                >
                  <Bookmark
                    className={cn(
                      "size-4",
                      isBookmarked && "fill-brand text-brand"
                    )}
                  />
                </button>
                <Button
                  type="button"
                  onClick={handleApply}
                  className="h-10 rounded-lg bg-white px-5 text-sm font-semibold text-black hover:bg-white/90 cursor-pointer"
                >
                  Apply Now
                </Button>
              </div>
            </div>
          </section>

          {/* Quick facts */}
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MetaTile icon={Banknote} label={`Salary Range (${job.frequency})`} value={salary} />
            <MetaTile icon={MapPin} label="Location" value={locationText} />
            <MetaTile icon={Briefcase} label="Job Type" value={job.jobType} />
            <MetaTile
              icon={Users}
              label="Applicants"
              value={`${job.applicants}`}
            />
          </section>

          {/* Single description card — sections divided by hairlines, like the mockup */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <h2 className="text-lg font-bold tracking-tight">
              Job Description
            </h2>

            {/* Responsibilities */}
            <div className="mt-6 border-t border-border/60 pt-5">
              <h3 className="text-base font-bold tracking-tight">
                Responsibilities
              </h3>
              {responsibilities.length > 0 ? (
                <BulletList items={responsibilities} />
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  No responsibilities listed for this job.
                </p>
              )}
            </div>

            {/* Requirements */}
            <div className="mt-6 border-t border-border/60 pt-5">
              <h3 className="text-base font-bold tracking-tight">
                Requirements
              </h3>
              {requirements.length > 0 ? (
                <BulletList items={requirements} />
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  No requirements listed for this job.
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Right column — company overview sidebar */}
        <aside className="rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-28">
          <h2 className="text-lg font-bold tracking-tight">Company Overview</h2>

          {/* Company image — initials fallback when no image exists */}
          <div className="mt-4 grid aspect-16/10 w-full place-items-center overflow-hidden rounded-xl border border-border bg-black">
            <span className="text-3xl font-bold text-foreground/80">
              {job.companyName.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="mt-4 divide-y divide-border/60">
            <OverviewRow label="Category" value={job.category} />
            <OverviewRow label="Location" value={locationText} />
            <OverviewRow label="Job Type" value={job.jobType} />
            <OverviewRow label="Deadline" value={formatDate(job.deadline)} />
          </div>
        </aside>
      </div>
    </div>
  )
}
