import { notFound } from "next/navigation"

import type { JobPost } from "@/lib/types"
import { getJob } from "@/lib/api/jobs"

import { JobApplicants } from "./_components/JobApplicants"

/**
 * Recruiter's applicants page for ONE posted job.
 * Reached by clicking the "Applicants" cell on the Manage Jobs table.
 */
const JobApplicantsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  const jobData = await getJob(id)

  // The API may return the job directly or wrapped in an object — normalize defensively.
  const job: JobPost | undefined = jobData?.job ?? jobData

  // Unknown id or failed fetch — show the 404 instead of an empty shell.
  if (!job?._id) notFound()

  return <JobApplicants job={job} />
}

export default JobApplicantsPage
