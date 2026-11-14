import { notFound } from "next/navigation"

import type { JobPost } from "@/lib/types"
import { getJob } from "@/lib/api/jobs"

import { JobApplicants } from "./_components/JobApplicants"


const JobApplicantsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  const jobData = await getJob(id)

  const job: JobPost | undefined = jobData?.job ?? jobData

  if (!job?._id) notFound()

  return <JobApplicants job={job} />
}

export default JobApplicantsPage
