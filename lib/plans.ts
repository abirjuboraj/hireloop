/**
 * Shared plan catalogue.
 *
 * Every plan here matches a plan on the landing page's Pricing section
 * (components/Pricing.tsx). The checkout page shows the plans for the
 * logged-in user's role, and the Stripe API route charges using each plan's
 * Stripe Price ID when one exists.
 */

import type { UserRole } from "./types"

export type Plan = {
  name: string
  /** Monthly price in dollars — what we display on our own page. */
  price: number
  features: string[]
  /** Who this plan is for — keeps seeker and recruiter plans separate. */
  role: UserRole
  /**
   * The Price ID of this plan's product in your Stripe Dashboard
   * (Products → click a product → copy the "API ID" of its price).
   * When set, Stripe charges exactly the price you configured there.
   * When missing, the API route falls back to charging `price` via inline
   * price_data — so a plan works even before you create it in Stripe.
   */
  stripePriceId?: string
}

// 👉 To add a plan later (e.g. recruiter plans): create its product + price in
// your Stripe Dashboard, copy the Price ID here, and done — checkout picks it
// up automatically because of the `role` field.
export const PLANS: Record<string, Plan> = {
  starter: {
    name: "Starter",
    price: 0,
    role: "seeker",
    // Free plan created in Stripe ($0 price).
    stripePriceId: "price_1UbOTmCLGW7V4hBxEIdQsBu4",
    features: [
      "Daily AI match brief (top 5)",
      "Verified salary bands",
      "Company insight dashboards",
      "1-click apply, unlimited",
    ],
  },
  growth: {
    name: "Growth",
    price: 19,
    role: "seeker",
    // $19 price created in Stripe — checkout charges this exact product.
    stripePriceId: "price_1UbOOnCLGW7V4hBx3sjfHZCW",
    features: [
      "Daily AI match brief (top 5)",
      "Verified salary bands",
      "Company insight dashboards",
      "1-click apply, unlimited",
    ],
  },
  premium: {
    name: "Premium",
    price: 39,
    role: "seeker",
    stripePriceId: "price_1UbOlUCLGW7V4hBxSHsUdkLp",
    features: [
      "Everything in Pro",
      "Multi-profile career portfolios",
      "Shared talent rooms",
      "Recruiter view (read-only)",
    ],
  },
}

/** All plans made for a role (seeker plans for seekers, etc.), as [key, plan]. */
export function plansForRole(role: UserRole): Array<[string, Plan]> {
  return Object.entries(PLANS).filter(([, plan]) => plan.role === role)
}

/**
 * Turn a `?plan=` query value into a real [planKey, plan] for the given role.
 * Falls back to the role's first PAID plan, because a free plan needs no
 * checkout. Used by both the checkout page (?plan= link) and the Stripe
 * API route (the hidden form field), so they always agree.
 */
export function resolvePlan(
  planParam: string | null | undefined,
  role: UserRole
): [string, Plan] {
  const rolePlans = plansForRole(role)

  // If the URL asks for a plan that exists for this role, use it.
  const requested = rolePlans.find(
    ([key]) => key === (planParam ?? "").toLowerCase()
  )
  if (requested) return requested

  // Otherwise default to the first plan that actually costs money.
  const firstPaid = rolePlans.find(([, plan]) => plan.price > 0)
  if (firstPaid) return firstPaid

  // Role has no plans at all (e.g. admin) — hand back the first one anyway.
  return rolePlans[0] ?? ["starter", PLANS.starter]
}
