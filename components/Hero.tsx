"use client"

import Image from "next/image"
import { Briefcase, Building2, MapPin, Search, Star, UserCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const stats = [
  {
    icon: Briefcase,
    value: "50K",
    label: "Active Jobs",
  },
  {
    icon: Building2,
    value: "12K",
    label: "Companies",
  },
  {
    icon: UserCheck,
    value: "2M",
    label: "Job Seekers",
  },
  {
    icon: Star,
    value: "97%",
    label: "Satisfication Rate",
  },
]

const trendingPositions = [
  "Product Designer",
  "AI Engineering",
  "Dev-ops Engineer",
]

export function Hero() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#000] pt-[140px] pb-24 shadow-[inset_0_0_200px_rgba(0,0,0,0.9)]">
      {/* 
        LAYER 2: GRAY TOP SHADOW (replaces pink area)
        Visible behind the glass navbar and fades out smoothly by ~30-35% of the hero height
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 45% 30% at 0% 0%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 45%, transparent 75%),
            radial-gradient(ellipse 45% 30% at 100% 0%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 45%, transparent 75%),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, transparent 25%)
          `,
        }}
      />

      {/* 
        LAYER 3: INDIGO / VIOLET GLOW BEHIND THE GLOBE RIM
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 z-[1] h-[550px] w-[min(1200px,100vw)] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse 55% 35% at 50% 100%, rgba(99,102,241,0.5) 0%, rgba(79,70,229,0.2) 40%, transparent 70%)",
        }}
      />

      {/* 
        LAYER 4: FAINT STAR DOTS & GLOBE IMAGE (BOTTOM-ANCHORED & MASKED)
        Cropping out the raw upper part, showing top 35-40% of the sphere with screen blend mode
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 z-[2] w-[min(1100px,95vw)] translate-y-[45%] -translate-x-1/2 select-none"
      >
        {/* Scattered 1-2px star dots around globe edge */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute top-[8%] left-[22%] size-[2px] rounded-full bg-[rgba(129,140,248,0.5)]" />
          <div className="absolute top-[12%] left-[35%] size-[1.5px] rounded-full bg-[rgba(129,140,248,0.4)]" />
          <div className="absolute top-[6%] left-[48%] size-[2px] rounded-full bg-[rgba(129,140,248,0.6)]" />
          <div className="absolute top-[10%] right-[32%] size-[1.5px] rounded-full bg-[rgba(129,140,248,0.5)]" />
          <div className="absolute top-[15%] right-[20%] size-[2px] rounded-full bg-[rgba(129,140,248,0.4)]" />
          <div className="absolute top-[4%] right-[44%] size-[1px] rounded-full bg-[rgba(129,140,248,0.5)]" />
        </div>

        <div
          className="relative w-full overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, transparent 38%, #000 55%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, transparent 38%, #000 55%)",
          }}
        >
          <Image
            src="/images/globe.png"
            alt=""
            width={1440}
            height={1882}
            priority
            className="w-full h-auto select-none object-cover mix-blend-screen"
          />
        </div>
      </div>

      {/* 
        LAYER 5: HERO CONTENT (z-index 10)
      */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Badge: 50,000+ NEW JOBS THIS MONTH */}
        <div className="flex items-center justify-center">
          <div
            aria-hidden="true"
            className="hidden h-px w-14 bg-gradient-to-r from-transparent via-white/20 to-white/40 sm:block md:w-20"
          />
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] sm:px-5">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-5 shrink-0"
            >
              <defs>
                <linearGradient id="hero-badge-gold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FEE45A" />
                  <stop offset="100%" stopColor="#FDA613" />
                </linearGradient>
                <linearGradient id="hero-badge-body" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C86D36" />
                  <stop offset="100%" stopColor="#883F2E" />
                </linearGradient>
              </defs>
              <path
                d="M8.5 8.5V6.5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2"
                fill="none"
                stroke="url(#hero-badge-gold)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <rect x="2.5" y="8.5" width="19" height="12" rx="2.5" fill="url(#hero-badge-body)" />
              <rect x="10" y="10.5" width="4" height="4.5" rx="1" fill="url(#hero-badge-gold)" />
            </svg>

            <span className="font-mono text-xs uppercase tracking-wider text-white sm:text-sm">
              <span className="font-semibold text-white">50,000+</span>{" "}
              <span className="text-white/80">New Jobs This Month</span>
            </span>
          </div>
          <div
            aria-hidden="true"
            className="hidden h-px w-14 bg-gradient-to-l from-transparent via-white/20 to-white/40 sm:block md:w-20"
          />
        </div>

        {/* Heading & Subtitle */}
        <div className="mx-auto mt-7 max-w-3xl text-center sm:mt-9">
          <h1 className="text-3xl font-bold tracking-[-0.02em] text-white sm:text-5xl md:text-[56px] md:leading-[1.15]">
            Find Your Dream Job Today
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base md:text-lg">
            HireLoop connects top talent with world-class companies. Browse thousands of
            curated opportunities and land your next role &mdash; faster.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mx-auto mt-8 max-w-[760px] sm:mt-11">
          <div className="flex flex-col gap-2 rounded-2xl border border-white/20 bg-[#101012] p-2 shadow-2xl sm:h-16 sm:flex-row sm:items-center sm:rounded-full sm:p-1.5 sm:pl-6 sm:pr-2">
            {/* Title / Skill input */}
            <div className="flex flex-1 items-center gap-3 px-2 sm:px-0">
              <Search className="size-5 shrink-0 text-white/50" />
              <Input
                type="text"
                placeholder="Job title, skill or company"
                className="h-10 w-full border-0 bg-transparent p-0 text-sm text-white placeholder:text-white/50 shadow-none focus-visible:ring-0 focus-visible:outline-none sm:text-base"
              />
            </div>

            {/* Divider */}
            <div
              aria-hidden="true"
              className="hidden h-6 w-px shrink-0 bg-white/20 sm:block"
            />

            {/* Location input */}
            <div className="flex flex-1 items-center gap-3 px-2 sm:px-0">
              <MapPin className="size-5 shrink-0 text-white/50" />
              <Input
                type="text"
                placeholder="Location or Remote"
                className="h-10 w-full border-0 bg-transparent p-0 text-sm text-white placeholder:text-white/50 shadow-none focus-visible:ring-0 focus-visible:outline-none sm:text-base"
              />
            </div>

            {/* Search Button */}
            <Button
              size="icon"
              aria-label="Search jobs"
              className="h-11 w-full rounded-xl bg-brand text-white hover:bg-brand/85 sm:size-12 sm:rounded-full sm:shrink-0"
            >
              <Search className="size-5" />
            </Button>
          </div>

          {/* Trending Positions */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
            <span className="text-white/60">Trending Position</span>
            {trendingPositions.map((position) => (
              <Badge
                key={position}
                variant="outline"
                className="cursor-pointer rounded-full border-white/10 bg-[#1a1a1d] px-3.5 py-1 font-normal text-white transition-colors hover:border-white/25 hover:bg-[#232328]"
              >
                {position}
              </Badge>
            ))}
          </div>
        </div>

        {/* 
          LAYER 6: TAGLINE CENTERED ON GLOBE'S UPPER EDGE
        */}
        <div className="mx-auto mt-36 max-w-2xl text-center sm:mt-48 md:mt-56 lg:mt-64">
          <h2 className="font-instrument text-2xl font-medium leading-snug text-white/90 sm:text-3xl md:text-[38px]">
            Assisting over 15,000 job seekers find their dream positions.
          </h2>
        </div>

        {/* 
          LAYER 7: FOUR STAT CARDS AT BOTTOM, OVERLAPPING THE GLOBE
        */}
        <div className="mx-auto mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="group flex h-[230px] flex-col justify-between rounded-[14px] border border-white/[0.08] bg-gradient-to-b from-[rgba(20,20,22,0.9)] to-[rgba(5,5,6,0.95)] p-6 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-white/20"
              >
                <div>
                  <Icon className="size-6 text-white/80 transition-colors group-hover:text-white" />
                </div>
                <div>
                  <div className="text-4xl font-semibold tracking-[-0.02em] text-white sm:text-[44px]">
                    {stat.value}
                  </div>
                  <div className="mt-3 text-sm text-white/70 sm:text-base">
                    {stat.label}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
