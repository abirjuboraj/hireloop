"use client"

import Link from "next/link"
import {
  Banknote,
  Briefcase,
  Code2,
  EllipsisVertical,
  Eye,
  Globe,
  MapPin,
  Megaphone,
  PenTool,
  Pencil,
  Plus,
  Trash2,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { type JobPost } from "@/lib/types"

// Dummy data until fetching is implemented
const DUMMY_JOB_POSTS: JobPost[] = [
  {
    title: "Frontend Developer",
    companyName: "HirePulse Network",
    category: "Engineering, Tech",
    jobType: "Full-time",
    isRemote: true,
    location: "New York, USA",
    deadline: "2026-12-30",
    minSalary: "25",
    maxSalary: "40",
    frequency: "per hour",
    responsibilities: "",
    qualifications: "",
    applicants: 34,
    postedAgo: "Posted 1w ago",
  },
  {
    title: "Senior Product Designer",
    companyName: "HirePulse Labs",
    category: "Design, Creative",
    jobType: "Full-time",
    isRemote: false,
    location: "London, UK (Hybrid)",
    deadline: "2027-01-14",
    minSalary: "1100",
    maxSalary: "1450",
    frequency: "per week",
    responsibilities: "",
    qualifications: "",
    applicants: 19,
    postedAgo: "Posted 3w ago",
  },
  {
    title: "DevOps Specialist",
    companyName: "HirePulse Platform",
    category: "Engineering, Tech",
    jobType: "Full-time",
    isRemote: false,
    location: "Berlin, Germany",
    deadline: "2027-01-30",
    minSalary: "5500",
    maxSalary: "12000",
    frequency: "per month",
    responsibilities: "",
    qualifications: "",
    applicants: 12,
    postedAgo: "Posted 4w ago",
  },
  {
    title: "Product Marketing Lead",
    companyName: "HirePulse Network",
    category: "Marketing",
    jobType: "Full-time",
    isRemote: true,
    location: "EU / US",
    deadline: "2027-02-15",
    minSalary: "8000",
    maxSalary: "10500",
    frequency: "per month",
    responsibilities: "",
    qualifications: "",
    applicants: 27,
    postedAgo: "Posted 5w ago",
  },
  {
    title: "QA Automation Engineer",
    companyName: "HirePulse Platform",
    category: "Other",
    jobType: "Part-time",
    isRemote: false,
    location: "Dublin, Ireland (Hybrid)",
    deadline: "2026-08-01",
    minSalary: "35",
    maxSalary: "50",
    frequency: "per hour",
    responsibilities: "",
    qualifications: "",
    applicants: 8,
    postedAgo: "Closed",
  },
]

const categoryMeta: Record<string, { icon: typeof Code2; color: string }> = {
  "Engineering, Tech": { icon: Code2, color: "text-blue-400" },
  "Design, Creative": { icon: PenTool, color: "text-orange-400" },
  Marketing: { icon: Megaphone, color: "text-violet-400" },
  Finance: { icon: Banknote, color: "text-emerald-400" },
  Other: { icon: Briefcase, color: "text-muted-foreground" },
}

const frequencySuffix: Record<string, string> = {
  "per hour": "hr",
  "per day": "day",
  "per week": "wk",
  "per month": "mo",
  "per year": "yr",
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

export default function ManageJobsPage() {
  const jobPosts = DUMMY_JOB_POSTS

  return (
    <div className="mx-auto w-full max-w-6xl p-6 md:p-8">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/dashboard/recruiter/jobs" className="transition-colors hover:text-foreground">
              Manage Jobs
            </Link>
            <span aria-hidden="true">&gt;</span>
            <span className="text-foreground">Job Listings &amp; Postings</span>
          </nav>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Manage Job Posts</h1>
          <p className="text-muted-foreground">
            Review live listings, monitor applicants, and update job details across your organization.
          </p>
        </div>
        <Button
          size="lg"
          className="rounded-full bg-brand font-semibold hover:bg-brand/85"
          render={<Link href="/dashboard/recruiter/jobs/new" />}
        >
          <Plus className="size-4" />
          New Job Post
        </Button>
      </div>

      {/* Listings table */}
      <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Job Title &amp; Dept</TableHead>
              <TableHead>Company &amp; Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Compensation</TableHead>
              <TableHead>Applicants</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobPosts.map((job) => {
              const isExpired = new Date(job.deadline) < new Date()
              const meta = categoryMeta[job.category] ?? categoryMeta.Other

              return (
                <TableRow key={job.title} className="border-border/60 hover:bg-muted/40">
                  {/* Title & dept */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/4 ${meta.color}`}
                      >
                        <meta.icon className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{job.title}</p>
                        <p className={`text-xs ${meta.color}`}>{job.category.split(",")[0]}</p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Company & location */}
                  <TableCell>
                    <p className="text-sm font-medium">{job.companyName}</p>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      {job.isRemote ? <Globe className="size-3" /> : <MapPin className="size-3" />}
                      {job.isRemote ? `Remote, (${job.location})` : job.location}
                    </p>
                  </TableCell>

                  {/* Type */}
                  <TableCell>
                    <Badge className="h-7 rounded-lg border-white/10 bg-white/6 text-white/90" variant="outline">
                      {job.jobType}
                    </Badge>
                  </TableCell>

                  {/* Compensation */}
                  <TableCell className="text-sm whitespace-nowrap">
                    €{job.minSalary} - €{job.maxSalary}{" "}
                    <span className="text-muted-foreground">/ {frequencySuffix[job.frequency] ?? job.frequency}</span>
                  </TableCell>

                  {/* Applicants */}
                  <TableCell>
                    <p className="flex items-center gap-1.5 text-sm font-medium">
                      <Users className="size-3.5 text-muted-foreground" />
                      {job.applicants} Candidates
                    </p>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge
                      className={
                        isExpired
                          ? "border-white/10 bg-white/4 text-muted-foreground"
                          : "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                      }
                    >
                      <span
                        className={`size-1.5 rounded-full ${isExpired ? "bg-muted-foreground" : "bg-emerald-400"}`}
                      />
                      {isExpired ? "Expired" : "Active"}
                    </Badge>
                  </TableCell>

                  {/* Deadline */}
                  <TableCell>
                    <p className="text-sm">{formatDate(job.deadline)}</p>
                    <p className="text-xs text-muted-foreground">{job.postedAgo}</p>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        className="border border-brand/40 bg-brand/15 text-white hover:bg-brand/25"
                      >
                        <Pencil className="size-3.5" />
                        Update
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${job.title}`}
                        className="text-muted-foreground hover:text-red-400"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`More actions for ${job.title}`}
                              className="text-muted-foreground"
                            />
                          }
                        >
                          <EllipsisVertical className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="text-sm">
                          <DropdownMenuItem>
                            <Eye className="size-4" />
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400" onClick={() => undefined /* TODO: delete job */}>
                            <Trash2 className="size-4" />
                            Delete job post
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
