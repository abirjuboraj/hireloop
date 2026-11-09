"use client"

import { Banknote, Bookmark, Clock, Globe } from "lucide-react"
import { useState } from "react"

import type { JobPost } from "@/lib/types"
import { cn } from "@/lib/utils"

/** Short suffix shown after the salary range, e.g. "$1400 - $1800 /wk". */
const FREQUENCY_SUFFIX: Record<string, string> = {
  "per hour": "/hr",
  "per day": "/day",
  "per week": "/wk",
  "per month": "/mo",
  "per year": "/yr",
}

const chipClass =
  "inline-flex h-7 items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 text-xs font-medium text-muted-foreground"

export function JobCard({ job }: { job: JobPost }) {
  const [isBookmarked, setIsBookmarked] = useState(false)

  // TODO: connect this to the saved-jobs API (functionality on you)
  const handleToggleBookmark = () => {
    setIsBookmarked((previous) => !previous)
    console.log("Bookmark toggled for job:", job._id)
  }

  const salary = `$${job.minSalary} - $${job.maxSalary}${
    FREQUENCY_SUFFIX[job.frequency] ?? ""
  }`

  // The API may already append "(Remote)"/"(Hybrid)" to the location string.
  const locationText =
    job.isRemote && !/remote|hybrid/i.test(job.location)
      ? `${job.location}, (Remote)`
      : job.location

  return (
    <article className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-border/80 hover:bg-card/80 sm:p-6">
      <div className="flex gap-4">
        {/* Company logo */}
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-muted text-base font-semibold text-brand sm:size-14">
          {job.companyName.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          {/* Title + bookmark */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold tracking-tight">
                {job.title}
              </h3>
              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                {job.companyName} • {locationText}
              </p>
            </div>
            <button
              type="button"
              onClick={handleToggleBookmark}
              aria-pressed={isBookmarked}
              aria-label={isBookmarked ? "Remove bookmark" : "Save job"}
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Bookmark
                className={cn(
                  "size-[18px]",
                  isBookmarked && "fill-brand text-brand"
                )}
              />
            </button>
          </div>

          {/* Meta chips */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className={chipClass}>
              <Banknote className="size-3.5" />
              {salary}
            </span>
            <span className={chipClass}>
              <Clock className="size-3.5" />
              {job.jobType}
            </span>
            {job.isRemote && (
              <span className={chipClass}>
                <Globe className="size-3.5" />
                Remote
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
