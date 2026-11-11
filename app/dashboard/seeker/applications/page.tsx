"use client"

import {
  Banknote,
  Bell,
  Bot,
  Briefcase,
  Code2,
  Database,
  Download,
  Mail,
  Megaphone,
  PenTool,
  Search,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getApplications } from "@/lib/api/applications"
import { useSession } from "@/lib/auth-client"
import type { Application, ApplicationStatus } from "@/lib/types"
import { resolveUserRole } from "@/lib/types"
import { cn } from "@/lib/utils"

/* ------------------------------- helpers -------------------------------- */

/** "2 hours ago" style label from an ISO date. */
function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  if (Number.isNaN(diff)) return date

  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`

  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks} week${weeks === 1 ? "" : "s"} ago`

  const months = Math.floor(days / 30)
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`

  const years = Math.floor(days / 365)
  return `${years} year${years === 1 ? "" : "s"} ago`
}

const categoryMeta: Record<string, { icon: LucideIcon; tileClass: string }> = {
  "Engineering & Tech": { icon: Code2, tileClass: "bg-white/5 text-white/80" },
  "Design & Creative": { icon: PenTool, tileClass: "bg-white/5 text-white/80" },
  Marketing: { icon: Megaphone, tileClass: "bg-white/5 text-white/80" },
  Finance: { icon: Banknote, tileClass: "bg-white/5 text-white/80" },
  Other: { icon: Bot, tileClass: "bg-white/5 text-white/80" },
}

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Applied: "border-white/10 bg-white/5 text-white/70",
  Review: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  Interview: "border-violet-500/30 bg-violet-500/10 text-violet-400",
  Shortlisted: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  Rejected: "border-red-500/30 bg-red-500/10 text-red-400",
  Offered: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
}

const PAGE_SIZE = 5

/* -------------------------------- page ---------------------------------- */

export default function MyApplicationsPage() {
  const [tab, setTab] = useState<"Active" | "Archived">("Active")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { data: session, isPending } = useSession()
  const user = session?.user
  const userId = user?.id

  // The API returns the seeker's applications filtered by the query:
  // ?seekerId=...&archived=false&search=react
  useEffect(() => {
    if (!user) return

    const fetchApplications = async () => {
      try {
        setIsLoading(true)

        const params = new URLSearchParams()
        // seekerId is resolved server-side from the session cookie.
        params.set("archived", tab === "Archived" ? "true" : "false")
        if (search) params.set("search", search)

        const data = await getApplications(params.toString())

        // The API may return a plain array or a wrapper — normalize defensively.
        const list: Application[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.applications)
            ? data.applications
            : []

        setApplications(list)
      } catch (error) {
        console.error("Failed to fetch applications:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchApplications()
  }, [user,userId, tab, search])

  // Stats are derived from the fetched list.
  const totalApplied = applications.length
  const shortlisted = applications.filter((a) => a.status === "Shortlisted").length
  const interviews = applications.filter((a) => a.status === "Interview").length
  const offered = applications.filter((a) => a.status === "Offered").length

  const STATS = [
    { label: "Total Applied", value: String(totalApplied), valueClass: "" },
    { label: "Shortlisted", value: String(shortlisted), valueClass: "" },
    { label: "Interviews", value: String(interviews), valueClass: "text-orange-400" },
    {
      label: "Success Rate",
      value: totalApplied ? `${Math.round((offered / totalApplied) * 100)}%` : "0%",
      valueClass: "text-emerald-500",
    },
  ]

  // Pagination happens client-side over the fetched list.
  const paged = applications.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const totalPages = Math.max(1, Math.ceil(applications.length / PAGE_SIZE))
  const showingFrom = applications.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const showingTo = (page - 1) * PAGE_SIZE + paged.length

  // TODO: connect this to the export API (functionality on you)
  const handleExport = () => {
    console.log("Exporting applications as PDF")
  }

  if (isPending) {
    return <p className="p-8 text-sm text-muted-foreground">Loading...</p>
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-black text-center">
        <p className="text-lg font-semibold">Please sign in to view your applications</p>
        <Button className="bg-brand text-white hover:bg-brand/85" nativeButton={false} render={<Link href="/sign-in?callback=/dashboard/seeker/applications" />}>
          Sign In
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Topbar */}
      <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-black/80 px-4 backdrop-blur md:px-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
            placeholder="Search applications..."
            className="h-10 rounded-lg border-white/10 bg-white/[0.04] pl-9 text-sm"
          />
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className="text-muted-foreground hover:text-foreground"
          >
            <Bell className="size-4.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Messages"
            className="hidden text-muted-foreground hover:text-foreground sm:inline-flex"
          >
            <Mail className="size-4.5" />
          </Button>
          <Avatar className="ml-1 size-9">
            <AvatarImage src={user.image ?? undefined} alt={user.name ?? "You"} />
            <AvatarFallback>{(user.name ?? "S").charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
        {/* Page header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              My Applications
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track your job applications and interview progress in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Active / Archived toggle */}
            <div className="flex h-10 items-center gap-1 rounded-lg border border-border bg-card p-1">
              {(["Active", "Archived"] as const).map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setTab(option)
                    setPage(1)
                  }}
                  className={cn(
                    "h-8 px-4",
                    tab === option
                      ? "bg-white/10 font-medium text-foreground hover:bg-white/10"
                      : "text-muted-foreground"
                  )}
                >
                  {option}
                </Button>
              ))}
            </div>

            <Button
              type="button"
              onClick={handleExport}
              className="h-10 rounded-lg bg-white px-4 text-sm font-semibold text-black hover:bg-white/90"
            >
              <Download className="size-4" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {STATS.map((stat) => (
            <Card key={stat.label} className="rounded-xl border-border bg-card">
              <CardContent className="p-4 sm:p-5">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={cn("mt-1.5 text-2xl font-bold sm:text-3xl", stat.valueClass)}>
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Applications table */}
        <div className="mt-6 overflow-hidden rounded-xl border border-border">
          <div className="overflow-x-auto">
            <Table className="w-full min-w-[720px] [&_td]:py-4 [&_td:first-child]:pl-5 [&_td:last-child]:pr-5 [&_th]:h-11 [&_th]:text-xs [&_th]:font-normal [&_th]:text-muted-foreground [&_th:first-child]:pl-5 [&_th:last-child]:pr-5">
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Job Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((application) => {
                  const meta = categoryMeta[application.category] ?? categoryMeta.Other

                  return (
                    <TableRow
                      key={application._id}
                      className="border-border/60 hover:bg-muted/30"
                    >
                      {/* Job title */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10",
                              meta.tileClass
                            )}
                          >
                            <meta.icon className="size-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{application.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {application.jobType} •{" "}
                              {application.isRemote ? "Remote" : "On-site"}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Company */}
                      <TableCell className="text-sm">
                        {application.companyName}
                      </TableCell>

                      {/* Applied */}
                      <TableCell className="text-sm whitespace-nowrap text-muted-foreground">
                        {timeAgo(application.appliedAt)}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-full px-3 py-1",
                            STATUS_STYLES[application.status]
                          )}
                        >
                          {application.status}
                        </Badge>
                      </TableCell>

                      {/* Action */}
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground"
                          nativeButton={false}
                          render={<Link href={`/browse-jobs/${application.jobId}`} />}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}

                {paged.length === 0 && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                      {isLoading
                        ? "Loading applications..."
                        : `No ${tab.toLowerCase()} applications found.`}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Table footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4">
            <p className="text-sm text-muted-foreground">
              Showing {showingFrom}-{showingTo} of {applications.length} applications
            </p>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                className="size-8 text-muted-foreground hover:text-foreground"
                aria-label="Previous page"
                disabled={page === 1}
                onClick={() => setPage((previous) => Math.max(1, previous - 1))}
              >
                <ChevronLeft className="size-4" />
              </Button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <Button
                    key={pageNumber}
                    variant={page === pageNumber ? "secondary" : "outline"}
                    size="icon"
                    className={cn(
                      "size-8",
                      page === pageNumber
                        ? "bg-white/10 font-medium text-foreground hover:bg-white/10"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                size="icon"
                className="size-8 text-muted-foreground hover:text-foreground"
                aria-label="Next page"
                disabled={page === totalPages}
                onClick={() =>
                  setPage((previous) => Math.min(totalPages, previous + 1))
                }
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
