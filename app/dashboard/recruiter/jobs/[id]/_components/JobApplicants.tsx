"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { ChevronRight, Globe, Mail, MapPin, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/toast"
import type { Application, ApplicationStatus, JobPost } from "@/lib/types"
import { cn } from "@/lib/utils"
import { getJobApplications } from "@/lib/api/applications"
import { updateApplicationStatus } from "@/lib/actions/applications"

import { ApplicantStatusBadge } from "./ApplicantStatusBadge"
import { ApplicantStatusSelect } from "./ApplicantStatusSelect"

// Every status a recruiter can filter by. "All" shows everything.
const STATUS_FILTERS: Array<ApplicationStatus | "All"> = [
  "All",
  "Applied",
  "Review",
  "Interview",
  "Shortlisted",
  "Offered",
  "Rejected",
]

/** "2026-11-13T…" → "Nov 13, 2026" for the Applied column. */
const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

export function JobApplicants({ job }: { job: JobPost }) {
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<ApplicationStatus | "All">("All")

  useEffect(() => {
    let active = true

    getJobApplications(job._id).then((result) => {
      if (!active) return
      setApplications(result ?? [])
      setIsLoading(false)
    })

    return () => {
      active = false
    }
  }, [job._id])

  // How many applicants are in each status — used for the filter pill counts.
  const statusCounts = useMemo(() => {
    const counts: Partial<Record<ApplicationStatus | "All", number>> = {
      All: applications.length,
    }
    for (const application of applications) {
      counts[application.status] = (counts[application.status] ?? 0) + 1
    }
    return counts
  }, [applications])

  // Only show applicants matching the selected filter pill.
  const visibleApplications =
    filter === "All"
      ? applications
      : applications.filter((application) => application.status === filter)

  /**
   * Called by the status dropdown. Updates the UI right away (so it feels
   * instant) and calls the shared action — which currently only logs, because
   * the database update endpoint is still TODO in the backend.
   */
  const handleStatusChange = (
    application: Application,
    nextStatus: ApplicationStatus
  ) => {
    if (nextStatus === application.status) return

    // 1. Update the UI immediately (optimistic update).
    setApplications((previous) =>
      previous.map((item) =>
        item._id === application._id ? { ...item, status: nextStatus } : item
      )
    )

    // 2. Fire the handler (backend update is TODO there).
    updateApplicationStatus(application._id, nextStatus)

    // 3. Tell the recruiter it worked.
    toast.add({
      title: "Status updated",
      description: `${applicantName(application)} moved to ${nextStatus}.`,
      type: "success",
    })
  }

  /** Best display name: real name from the user record, else their email. */
  const applicantName = (application: Application) =>
    application.applicantName ?? application.seekerEmail ?? "Applicant"

  const locationText = job.isRemote
    ? `Remote · ${job.location}`
    : job.location

  return (
    <div className="w-full max-w-6xl px-4 py-6 md:px-8 md:py-8">
      {/* Page header */}
      <div>
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link
            href="/dashboard/recruiter/jobs"
            className="transition-colors hover:text-foreground"
          >
            Manage Jobs
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground">Applicants</span>
        </nav>

        {/* Job summary card — reminds the recruiter which job they're in */}
        <div className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-muted text-lg font-semibold text-brand">
            {job.companyName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-bold tracking-tight sm:text-2xl">
              {job.title}
            </h1>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              {job.companyName}
              <span className="text-border">|</span>
              {job.isRemote ? (
                <Globe className="size-3.5" />
              ) : (
                <MapPin className="size-3.5" />
              )}
              {locationText}
            </p>
          </div>
          <Badge variant="outline" className="border-brand/30 bg-brand/15 text-[#a29dff]">
            <Users className="size-3.5" />
            {applications.length}{" "}
            {applications.length === 1 ? "applicant" : "applicants"}
          </Badge>
        </div>
      </div>

      {/* Status filter pills — click to show only that status.
          Each pill shows how many applicants it holds. */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {STATUS_FILTERS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            aria-pressed={filter === option}
            className={cn(
              "h-9 rounded-full border px-4 text-sm font-medium transition-colors",
              filter === option
                ? "border-transparent bg-brand text-white hover:bg-brand/85"
                : "border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            {option}
            {/* Count badge inside the pill */}
            <span
              className={cn(
                "ml-1.5 text-xs",
                filter === option ? "text-white/70" : "text-muted-foreground"
              )}
            >
              {statusCounts[option] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* ── Applicant list ── */}
      {isLoading ? (
        // Loading placeholders — 4 rows is a good visual guess
        <div className="mt-6 space-y-3">
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : visibleApplications.length === 0 ? (
        // Empty state — different message when filters hide everyone
        <div className="mt-6 rounded-2xl border border-border bg-card p-10 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand/15">
            <Users className="size-6 text-brand" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">
            {applications.length === 0
              ? "No applicants yet"
              : `No ${filter} applicants`}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {applications.length === 0
              ? "Share your job posting to start receiving applications."
              : "Try a different status filter above."}
          </p>
        </div>
      ) : (
        <>
          {/* ── Desktop: table (hidden on small screens) ── */}
          <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-border bg-card md:block">
            {/* Same table styling as the Manage Jobs page for consistency */}
            <Table className="w-full [&_td]:py-3.5 [&_td:first-child]:pl-5 [&_td:last-child]:pr-5 [&_th]:h-11 [&_th]:bg-white/2 [&_th]:text-[11px] [&_th]:tracking-wider [&_th]:text-muted-foreground [&_th]:uppercase [&_th:first-child]:pl-5 [&_th:last-child]:pr-5">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Applicant</TableHead>
                  <TableHead>Applied On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Change Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleApplications.map((application) => (
                  <TableRow
                    key={application._id}
                    className="border-border/60 hover:bg-muted/40"
                  >
                    {/* Avatar + name + email */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9">
                          <AvatarFallback>
                            {applicantName(application).charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {applicantName(application)}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {application.seekerEmail ?? "No email on file"}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-sm">
                      {formatDate(application.appliedAt)}
                    </TableCell>

                    <TableCell>
                      <ApplicantStatusBadge status={application.status} />
                    </TableCell>

                    {/* The dropdown that changes the status */}
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <ApplicantStatusSelect
                          status={application.status}
                          onChange={(next) => handleStatusChange(application, next)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* ── Mobile: one card per applicant (table is hidden here) ── */}
          <div className="mt-6 space-y-3 md:hidden">
            {visibleApplications.map((application) => (
              <div
                key={application._id}
                className="rounded-2xl border border-border bg-card p-4"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarFallback>
                      {applicantName(application).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {applicantName(application)}
                    </p>
                    <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                      <Mail className="size-3 shrink-0" />
                      {application.seekerEmail ?? "No email on file"}
                    </p>
                  </div>
                </div>

                {/* Meta rows: applied date (the job itself is in the page header) */}
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
                  <span>Applied {formatDate(application.appliedAt)}</span>
                </div>

                {/* Current status + the dropdown, side by side on mobile */}
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    Status
                  </span>
                  <ApplicantStatusSelect
                    status={application.status}
                    onChange={(next) => handleStatusChange(application, next)}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Back link — easy way out of the page */}
      <Button
        variant="ghost"
        size="sm"
        className="mt-6 text-muted-foreground hover:text-foreground"
        nativeButton={false}
        render={<Link href="/dashboard/recruiter/jobs" />}
      >
        ← Back to all jobs
      </Button>
    </div>
  )
}
