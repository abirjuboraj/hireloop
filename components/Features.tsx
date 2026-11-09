import {
  Bookmark,
  Building2,
  FileText,
  Hexagon,
  LineChart,
  MousePointerClick,
  Search,
  TrendingUp,
} from "lucide-react"

interface FeatureItem {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}

const features: FeatureItem[] = [
  {
    icon: Search,
    title: "Smart Search",
    description: "Find your ideal job with advanced filters.",
  },
  {
    icon: LineChart,
    title: "Salary Insights",
    description: "Get real salary data to negotiate confidently.",
  },
  {
    icon: Building2,
    title: "Top Companies",
    description: "Apply to vetted companies that are hiring.",
  },
  {
    icon: Bookmark,
    title: "Saved Jobs",
    description: "Manage apps & favorites on your dashboard.",
  },
  {
    icon: MousePointerClick,
    title: "One-Click Apply",
    description: "Simplify your job applications for an easier process!",
  },
  {
    icon: FileText,
    title: "Resume Builder",
    description: "Create professional resumes with modern templates.",
  },
  {
    icon: Hexagon,
    title: "Skill-Based Matching",
    description: "Discover jobs that match your skills and experience.",
  },
  {
    icon: TrendingUp,
    title: "Career Growth Resources",
    description: "Boost your career with quick interview tips.",
  },
]

export function Features() {
  return (
    <section className="relative bg-[#0c0c0e] py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center">
          {/* Eyebrow badge / pill */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-[#7065ff] uppercase sm:text-sm">
            <span className="size-1.5 rounded-sm bg-[#5c53fe]" />
            <span>FEATURES JOB</span>
            <span className="size-1.5 rounded-sm bg-[#5c53fe]" />
          </div>

          {/* Main Title */}
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Everything you need
            <br className="hidden sm:inline" /> to succeed
          </h2>
        </div>

        {/* Features Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="group flex items-start gap-4 transition-transform duration-200 hover:-translate-y-0.5"
              >
                {/* Icon Box with subtle pink-purple accent outline */}
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#121217] shadow-inner transition-colors group-hover:border-white/20">
                  <Icon className="size-6 text-[#df77ec] transition-colors group-hover:text-[#f49eff]" />
                </div>

                {/* Content */}
                <div className="pt-0.5">
                  <h3 className="text-base font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/55">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

