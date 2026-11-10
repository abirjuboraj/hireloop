import type { JobPost } from "@/lib/types"
import { Suspense } from "react"

import { JobCard } from "@/app/components/JobCard"
import { Navbar } from "@/components/Navbar"
import { FiltersSidebar } from "./_components/FiltersSidebar"
import { Pagination } from "./_components/Pagination"
import { SearchBar } from "./_components/SearchBar"
import { SortSelect } from "./_components/SortSelect"
import { getJobs } from "@/lib/api/jobs"

const BrowseJobsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const params = await searchParams

  const queryString = new URLSearchParams(
    params as Record<string, string>
  ).toString()

  const jobsData = await getJobs(queryString)

  // The API may return a plain array or a paginated wrapper — normalize defensively.
  const jobs: JobPost[] = Array.isArray(jobsData?.jobs)
    ? jobsData.jobs
    : Array.isArray(jobsData)
      ? jobsData
      : []

  return (
    <main className="relative min-h-screen bg-black">
      <Navbar />

      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-24 sm:px-6 md:pt-28">
        {/* Search hero */}
        <SearchBar />

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Filters — becomes a collapsible panel below `lg`.
              Suspense boundary is required because the sidebar reads useSearchParams. */}
          <Suspense>
            <FiltersSidebar jobs={jobs} />
          </Suspense>

          {/* Results */}
          <section>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                Found {jobs.length} Professional Jobs
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Sort by:</span>
                <SortSelect />
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>

            {jobs.length === 0 && (
              <p className="mt-10 text-center text-muted-foreground">
                No jobs found.
              </p>
            )}

            <Pagination />
          </section>
        </div>
      </div>
    </main>
  )
}

export default BrowseJobsPage
