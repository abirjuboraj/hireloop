import Link from "next/link"
import { ArrowRight, Briefcase, MapPin } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export interface JobCardData {
  id?: string
  _id?: string
  title: string
  description?: string
  responsibilities?: string
  location: string
  workplaceType?: string // e.g. "Hybrid", "Remote", "On-site"
  salary?: string // e.g. "€25–€40/hour" or "$120k–$150k/year"
  minSalary?: string
  maxSalary?: string
  frequency?: string
}

interface JobCardProps {
  job: JobCardData
  applyHref?: string
}

export function JobCard({ job, applyHref }: JobCardProps) {
  // Format salary if not directly provided as a combined string
  const formattedSalary =
    job.salary ||
    (job.minSalary && job.maxSalary
      ? `$${job.minSalary}–$${job.maxSalary}${job.frequency ? `/${job.frequency.replace("per ", "")}` : ""}`
      : job.minSalary
        ? `$${job.minSalary}+`
        : null)

  const workplace = job.workplaceType || "Hybrid"
  const descriptionText =
    job.description ||
    job.responsibilities ||
    "Showcase your commitment to diversity and inclusion by highlighting initiatives"

  const linkTarget = applyHref || `/jobs/${job.id || job._id || "apply"}`

  return (
    <Card className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#101014] p-6 shadow-xl transition-all duration-300 hover:border-white/20 hover:bg-[#14141a]">
      <CardContent className="p-0">
        {/* Title */}
        <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-white sm:text-2xl">
          {job.title}
        </h3>

        {/* Short Description */}
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/55">
          {descriptionText}
        </p>

        {/* Tags / Pills */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {/* Location pill */}
          <Badge
            variant="outline"
            className="flex items-center gap-1.5 rounded-full border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-normal text-white/80"
          >
            <MapPin className="size-3 text-[#df77ec]" />
            <span>{job.location}</span>
          </Badge>

          {/* Workplace / Type pill */}
          <Badge
            variant="outline"
            className="flex items-center gap-1.5 rounded-full border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-normal text-white/80"
          >
            <Briefcase className="size-3 text-[#df77ec]" />
            <span>{workplace}</span>
          </Badge>

          {/* Salary pill */}
          {formattedSalary && (
            <Badge
              variant="outline"
              className="flex items-center gap-1.5 rounded-full border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-normal text-white/80"
            >
              <span className="size-1.5 rounded-full bg-[#df77ec]" />
              <span>{formattedSalary}</span>
            </Badge>
          )}
        </div>
      </CardContent>

      {/* Action Footer */}
      <div className="mt-8 pt-2">
        <Link
          href={linkTarget}
          className="inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors group-hover:text-white"
        >
          <span>Apply Now</span>
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </Card>
  )
}

