"use client"

import { ArrowRight, BarChart3, Crown, Plus, Zap, type LucideIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

type PricingPlan = {
  name: string
  icon: LucideIcon
  price: number
  features: string[]
  highlight?: boolean
}

const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Starter",
    icon: Crown,
    price: 0,
    features: [
      "Daily AI match brief (top 5)",
      "Verified salary bands",
      "Company insight dashboards",
      "1-click apply, unlimited",
    ],
  },
  {
    name: "Growth",
    icon: BarChart3,
    price: 17,
    highlight: true,
    features: [
      "Daily AI match brief (top 5)",
      "Verified salary bands",
      "Company insight dashboards",
      "1-click apply, unlimited",
    ],
  },
  {
    name: "Premium",
    icon: Zap,
    price: 99,
    features: [
      "Everything in Pro",
      "Multi-profile career portfolios",
      "Shared talent rooms",
      "Recruiter view (read-only)",
    ],
  },
]

// TODO: hook the toggle up to real billing/checkout logic (functionality on you)
export function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  )
  const trackRef = useRef<HTMLDivElement>(null)
  const highlightCardRef = useRef<HTMLDivElement>(null)

  // On mobile the cards are a swipe slider — center the highlighted plan on load.
  useEffect(() => {
    const centerHighlightCard = () => {
      const track = trackRef.current
      const card = highlightCardRef.current
      if (!track || !card || track.scrollWidth <= track.clientWidth) return
      track.scrollLeft =
        card.offsetLeft - (track.clientWidth - card.clientWidth) / 2
    }
    centerHighlightCard()
    window.addEventListener("resize", centerHighlightCard)
    return () => window.removeEventListener("resize", centerHighlightCard)
  }, [])

  return (
    <section className="relative bg-black py-20 sm:py-24">
      <div className="mx-auto w-[min(1200px,94vw)]">
        {/* Section header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-[#7065ff] uppercase sm:text-sm">
            <span className="size-1.5 rounded-sm bg-[#5c53fe]" />
            <span>Pricing</span>
            <span className="size-1.5 rounded-sm bg-[#5c53fe]" />
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Pay for the leverage,
            <br /> not the listings
          </h2>
        </div>

        {/* Billing cycle toggle */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-[#121217] p-1">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              aria-pressed={billingCycle === "monthly"}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-colors",
                billingCycle === "monthly"
                  ? "bg-white text-black"
                  : "text-white/60 hover:text-white"
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              aria-pressed={billingCycle === "yearly"}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                billingCycle === "yearly"
                  ? "bg-white text-black"
                  : "text-white/60 hover:text-white"
              )}
            >
              Yearly
              <span className="rounded-full bg-[#d12fe0] px-2 py-0.5 text-[11px] font-semibold text-white">
                25%
              </span>
            </button>
          </div>
        </div>

        {/* Plans — swipe slider (scroll-snap, no visible controls) on mobile, 3-column grid on desktop */}
        <div
          ref={trackRef}
          className="mt-10 flex snap-x snap-mandatory items-center gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-6 lg:mt-12 lg:grid lg:grid-cols-3 lg:overflow-visible"
        >
          {PRICING_PLANS.map((plan) => {
            const Icon = plan.icon
            const isHighlight = Boolean(plan.highlight)

            return (
              <div
                key={plan.name}
                ref={plan.highlight ? highlightCardRef : undefined}
                className={cn(
                  "w-[88%] shrink-0 snap-start rounded-2xl border p-5 sm:p-6 lg:w-auto",
                  isHighlight
                    ? "border-white/20 bg-[linear-gradient(180deg,#1d1d25,#111114)] shadow-[0_25px_80px_-20px_rgba(92,83,254,0.5)] lg:py-8"
                    : "border-white/10 bg-[#0f0f12]"
                )}
              >
                {/* Plan name + price */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#1a1a20]">
                      <Icon className="size-4 text-[#df77ec]" />
                    </span>
                    <h3 className="truncate text-base font-semibold text-white sm:text-lg">
                      {plan.name}
                    </h3>
                  </div>
                  <p className="flex shrink-0 items-baseline gap-1">
                    <span className="text-3xl font-bold text-white sm:text-4xl">
                      ${plan.price}
                    </span>
                    <span className="hidden text-xs text-white/45 sm:inline">
                      /month
                    </span>
                  </p>
                </div>

                {/* Feature list */}
                <p className="mt-6 text-sm font-semibold text-white">
                  Start building your insights hub:
                </p>
                <ul className="mt-3 space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5">
                        <Plus className="size-3 text-white/70" />
                      </span>
                      <span className="text-sm text-white/65">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  type="button"
                  className={cn(
                    "mt-8 flex h-11 w-full items-center justify-between rounded-lg px-4 text-sm font-medium transition-colors",
                    isHighlight
                      ? "bg-white text-black hover:bg-white/90"
                      : "bg-[#1c1c21] text-white hover:bg-[#26262c]"
                  )}
                >
                  Choose This Plan
                  <ArrowRight className="size-4" />
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
