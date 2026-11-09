import Link from "next/link"

import { Button } from "@/components/ui/button"
import { JobCard, JobCardData } from "@/components/JobCard"

// Single reusable dummy job template as requested
const DUMMY_JOB: JobCardData = {
  id: "dummy-1",
  title: "Frontend Developer",
  description:
    "Showcase your commitment to diversity and inclusion by highlighting initiatives",
  location: "New York, USA",
  workplaceType: "Hybrid",
  salary: "€25–€40/hour",
}

// 6 jobs rendered on the homepage grid (can easily be replaced with fetched data)
const DUMMY_JOBS: JobCardData[] = Array.from({ length: 6 }, (_, i) => ({
  ...DUMMY_JOB,
  id: `job-${i + 1}`,
}))

interface FeaturedJobsProps {
  jobs?: JobCardData[]
}

export function FeaturedJobs({ jobs = DUMMY_JOBS }: FeaturedJobsProps) {
  const displayJobs = jobs.length > 0 ? jobs : DUMMY_JOBS

  return (
    <section className="relative bg-[#000] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-[#7065ff] uppercase sm:text-sm">
            <span className="size-1.5 rounded-sm bg-[#5c53fe]" />
            <span>SMART JOB DISCOVERY</span>
            <span className="size-1.5 rounded-sm bg-[#5c53fe]" />
          </div>

          {/* Heading */}
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl md:leading-[1.15]">
            The roles you&apos;d never
            <br />
            find by searching
          </h2>
        </div>

        {/* 6-Card Responsive Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {displayJobs.slice(0, 6).map((job, idx) => (
            <JobCard key={job.id || job._id || idx} job={job} />
          ))}
        </div>

        {/* Bottom CTA Button */}
        <div className="mt-14 flex justify-center">
          <Link href="/browse-jobs">
            <Button
              size="lg"
              className="h-12 rounded-xl bg-white px-8 text-sm font-semibold text-black shadow-lg transition-all hover:bg-white/90"
            >
              View all job open
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

