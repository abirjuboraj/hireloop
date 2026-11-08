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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { JobPost } from "@/lib/types"
import { useEffect, useState } from "react"
import { getJobs } from "@/lib/api/jobs"
import DeleteDialog from "@/app/components/DeleteDialog"
import { deleteJob } from "@/lib/actions/jobs"
import { toast } from "@/components/ui/toast"
import { useRouter } from "next/navigation"

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
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

export default function ManageJobsPage() {
  const [fetchedJobs, setFetchedJobs] = useState<JobPost[]>([])
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null)

  const router = useRouter()
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobPosts = await getJobs()
        if (jobPosts) {
          setFetchedJobs(jobPosts)
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error)
      }
    }
    fetchJobs()
  }, [])

  const handleDeleteConfirm = async () => {
  if (!selectedJob) return;

  try {
    const res = await deleteJob(selectedJob._id);

    if (res && res.deletedCount > 0) {
      setFetchedJobs((prev) =>
        prev.filter((job: JobPost) => job._id !== selectedJob._id)
      );

      toast.add({
        title: "Job deleted",
        description: `The job "${selectedJob.title}" has been successfully deleted.`,
      });

      router.refresh();
    }
  } catch (error) {
    console.error("Failed to delete job:", error);
  } finally {
    setIsDeleteOpen(false);
    setSelectedJob(null);
  }
};
  return (
    <div className="w-full max-w-6xl px-4 py-6 md:px-8 md:py-8">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link
              href="/dashboard/recruiter/jobs"
              className="transition-colors hover:text-foreground"
            >
              Manage Jobs
            </Link>
            <span aria-hidden="true">&gt;</span>
            <span className="text-foreground">Job Listings &amp; Postings</span>
          </nav>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Manage Job Posts
          </h1>
          <p className="text-muted-foreground">
            Review live listings, monitor applicants, and update job details
            across your organization.
          </p>
        </div>
        <Button
          size="lg"
          className="rounded-full bg-brand font-semibold hover:bg-brand/85"
          nativeButton={false}
          render={<Link href="/dashboard/recruiter/jobs/new" />}
        >
          <Plus className="size-4" />
          New Job Post
        </Button>
      </div>

      {/* Listings table */}
      <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card xl:overflow-visible">
        <Table className="w-full min-w-205 xl:min-w-0 [&_td]:py-3.5 [&_td:first-child]:pl-5 [&_td:last-child]:pr-5 [&_th]:h-11 [&_th]:bg-white/2 [&_th]:text-[11px] [&_th]:tracking-wider [&_th]:text-muted-foreground [&_th]:uppercase [&_th:first-child]:pl-5 [&_th:last-child]:pr-5">
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
            {fetchedJobs.map((job) => {
              const isExpired = new Date(job.deadline) < new Date()
              const meta = categoryMeta[job.category] ?? categoryMeta.Other

              return (
                <TableRow
                  key={job.title}
                  className="border-border/60 hover:bg-muted/40"
                >
                  {/* Title & dept */}
                  <TableCell className="whitespace-normal">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/4 ${meta.color}`}
                      >
                        <meta.icon className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{job.title}</p>
                        <p className={`text-xs ${meta.color}`}>
                          {job.category.split(",")[0]}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Company & location */}
                  <TableCell className="whitespace-normal">
                    <p className="text-sm font-medium">{job.companyName}</p>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      {job.isRemote ? (
                        <Globe className="size-3" />
                      ) : (
                        <MapPin className="size-3" />
                      )}
                      {job.isRemote
                        ? `Remote, (${job.location})`
                        : job.location}
                    </p>
                  </TableCell>

                  {/* Type */}
                  <TableCell>
                    <Badge
                      className="h-7 rounded-lg border-white/10 bg-white/6 text-white/90"
                      variant="outline"
                    >
                      {job.jobType}
                    </Badge>
                  </TableCell>

                  {/* Compensation */}
                  <TableCell className="text-sm whitespace-nowrap">
                    €{job.minSalary} - €{job.maxSalary}{" "}
                    <span className="text-muted-foreground">
                      / {frequencySuffix[job.frequency] ?? job.frequency}
                    </span>
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
                    <p className="text-xs text-muted-foreground">
                      {job.postedAgo}
                    </p>
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
                        onClick={() => {
                          setSelectedJob(job)
                          setIsDeleteOpen(true)
                        }}
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
                          <DropdownMenuItem
                            className="text-red-400"
                            onClick={() => undefined /* TODO: delete job */}
                          >
                            <Trash2 className="size-4" />
                            Delete job
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
      <DeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        jobTitle={selectedJob?.title}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
