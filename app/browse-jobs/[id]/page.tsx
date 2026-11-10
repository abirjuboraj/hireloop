import { notFound } from "next/navigation"

import type { JobPost } from "@/lib/types"
import { Navbar } from "@/components/Navbar"
import { getJob } from "@/lib/api/jobs"

import { JobDetails } from "./_components/JobDetails"

const JobDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  const jobData = await getJob(id)

  // The API may return the job directly or wrapped in an object — normalize defensively.
  const job: JobPost | undefined = jobData?.job ?? jobData

  // Unknown id or failed fetch — show the 404 instead of an empty shell.
  if (!job?._id) notFound()

  return (
    <main className="relative min-h-screen bg-black">
      <Navbar />

      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-24 sm:px-6 md:pt-28">
        <JobDetails job={job} />
      </div>
    </main>
  )
}

export default JobDetailPage
