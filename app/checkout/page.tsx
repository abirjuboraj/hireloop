"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Suspense, useEffect, useState } from "react"
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Globe,
  Loader2,
  Lock,
  Mail,
  Plus,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { useSession } from "@/lib/auth-client"
import { getUserPlan, type UserPlan } from "@/lib/api/user"
import { getApplicationCount } from "@/lib/api/applications"
import { plansForRole, resolvePlan, PLANS, type Plan } from "@/lib/plans"
import type { UserRole } from "@/lib/types"
import { cn } from "@/lib/utils"

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutGate />
    </Suspense>
  )
}

/**
 * Gate in front of the payment form: paid users are never shown checkout
 * again (their plan comes from the backend), signed-out users are asked to
 * sign in, and only everyone else reaches the payment step.
 */
function CheckoutGate() {
  const searchParams = useSearchParams()
  const canceled = searchParams.get("canceled")
  const { data: session, isPending } = useSession()
  const user = session?.user

  const [plan, setPlan] = useState<UserPlan | null>(null)
  const [applicationsCount, setApplicationsCount] = useState<number | null>(null)
  const [planLoading, setPlanLoading] = useState(true)

  // Surface the cancel trip from Stripe (cancel_url lands back here).
  useEffect(() => {
    if (canceled) {
      console.log(
        "[checkout] Payment canceled — continuing to browse before checkout"
      )
      toast.add({
        title: "Payment canceled",
        description:
          "No charge was made. You can check out again whenever you're ready.",
        type: "warning",
      })
    }
  }, [canceled])

  // Fetch the user's plan and application count — checkout is only relevant
  // for unpaid users who have used up their 2 free applications.
  useEffect(() => {
    if (!user?.id) return
    let active = true
    Promise.all([
      getUserPlan(user.id),
      getApplicationCount(`seekerId=${user.id}`),
    ]).then(([planResult, countResult]) => {
      if (!active) return
      setPlan(planResult)
      setApplicationsCount(countResult?.count ?? 0)
      setPlanLoading(false)
    })
    return () => {
      active = false
    }
  }, [user?.id])

  if (isPending || (user && planLoading)) {
    return (
      <PageShell>
        <div className="flex items-center justify-center gap-2 py-24 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          Loading checkout…
        </div>
      </PageShell>
    )
  }

  if (!user) {
    return (
      <PageShell>
        <div className="mx-auto mt-16 max-w-md rounded-2xl border border-border bg-card p-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand/15">
            <Mail className="size-6 text-brand" />
          </div>
          <h2 className="mt-4 text-xl font-semibold">Sign in to continue</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You need an account before you can complete a payment.
          </p>
          <Button
            size="lg"
            className="mt-6 rounded-full bg-brand font-semibold hover:bg-brand/85"
            nativeButton={false}
            render={<Link href="/sign-in" />}
          >
            Go to Sign In
          </Button>
        </div>
      </PageShell>
    )
  }

  // Already paid → no checkout for you. The plan flags are what the backend's
  // verification step sets after a successful payment.
  const ownedPlan =
    plan?.plan ??
    (plan?.premium ? "premium" : plan?.growth ? "growth" : plan?.starter ? "starter" : null)

  if (ownedPlan) {
    console.log(
      `[checkout] User ${user.id} already owns the ${ownedPlan} plan — skipping checkout`
    )
    return (
      <PageShell>
        <div className="mx-auto mt-16 max-w-md rounded-2xl border border-border bg-card p-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand/15">
            <CheckCircle2 className="size-6 text-brand" />
          </div>
          <h2 className="mt-4 text-xl font-semibold">
            You&apos;re on the {PLANS[ownedPlan].name} plan
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your subscription is already active — no need to check out again.
          </p>
          <Button
            size="lg"
            className="mt-6 rounded-full bg-brand font-semibold hover:bg-brand/85"
            nativeButton={false}
            render={<Link href="/dashboard/seeker" />}
          >
            Go to Dashboard
            <ArrowRight className="size-4" data-icon="inline-end" />
          </Button>
        </div>
      </PageShell>
    )
  }

  // Free users still have applications left — there's nothing to pay for yet,
  // so checkout is pointless. Send them back to browsing instead.
  if ((applicationsCount ?? 0) < 2) {
    console.log(
      `[checkout] User ${user.id} is free with ${applicationsCount} applications (< 2) — no payment needed yet`
    )
    return (
      <PageShell>
        <div className="mx-auto mt-16 max-w-md rounded-2xl border border-border bg-card p-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand/15">
            <ShieldCheck className="size-6 text-brand" />
          </div>
          <h2 className="mt-4 text-xl font-semibold">No payment needed yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You have{" "}
            <span className="font-semibold text-foreground">
              {2 - (applicationsCount ?? 0)}
            </span>{" "}
            free {applicationsCount === 1 ? "application" : "applications"}{" "}
            remaining. Checkout unlocks once you&apos;ve used them.
          </p>
          <Button
            size="lg"
            className="mt-6 rounded-full bg-brand font-semibold hover:bg-brand/85"
            nativeButton={false}
            render={<Link href="/browse-jobs" />}
          >
            Browse Jobs
            <ArrowRight className="size-4" data-icon="inline-end" />
          </Button>
        </div>
      </PageShell>
    )
  }

  console.log(
    `[checkout] Showing payment for user ${user.id} — free tier used up (${applicationsCount}/2 applications)`
  )
  return (
    <PaymentPage
      userId={user.id}
      userEmail={user.email ?? ""}
      role={(user.role as UserRole) ?? "seeker"}
      initialPlanKey={searchParams.get("plan")}
    />
  )
}

function PaymentPage({
  userId,
  userEmail,
  role,
  initialPlanKey,
}: {
  userId: string
  userEmail: string
  role: UserRole
  initialPlanKey: string | null
}) {
  // The plans shown depend on the user's role — when you add recruiter plans
  // in lib/plans.ts they will appear here automatically for recruiters.
  const rolePlans = plansForRole(role)
  const [selectedKey, setSelectedKey] = useState(() => resolvePlan(initialPlanKey, role)[0])
  const selectedPlan: Plan | undefined = rolePlans.find(
    ([key]) => key === selectedKey
  )?.[1]

  return (
    <div className="mx-auto w-[min(1100px,94vw)]">
      <div className="grid items-start gap-6 sm:mt-10 lg:grid-cols-[1fr_1.2fr]">
        {/* ── Left column: plan picker + order summary ── */}
        <div className="space-y-6 lg:sticky lg:top-6">
          {/* Plan picker — one button per plan. Selecting a card updates the
              order summary and the Stripe payment on the right. */}
          {rolePlans.length > 0 && (
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <span className="size-1.5 rounded-full bg-brand" />
                Choose your plan
              </h2>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {rolePlans.map(([key, plan]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedKey(key)}
                    aria-pressed={selectedKey === key}
                    className={cn(
                      "rounded-xl border p-4 text-left transition-colors",
                      selectedKey === key
                        ? "border-brand bg-brand/15"
                        : "border-border hover:bg-muted/50"
                    )}
                  >
                    <p className="text-sm font-semibold">{plan.name}</p>
                    <p className="mt-1 flex items-baseline gap-1">
                      <span className="text-xl font-bold">${plan.price}</span>
                      <span className="text-xs text-muted-foreground">/mo</span>
                    </p>
                    {plan.price <= 0 && (
                      <span className="mt-1.5 inline-block rounded-full bg-brand/15 px-2 py-0.5 text-[11px] font-semibold text-brand">
                        Free
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Order summary — always shows the currently selected plan */}
          {selectedPlan && (
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <span className="size-1.5 rounded-full bg-brand" />
                Order Summary
              </h2>

              <div className="mt-5 rounded-xl border border-border bg-muted/40 p-5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{selectedPlan.name} plan</p>
                    <p className="text-xs text-muted-foreground">
                      For {role}s
                    </p>
                  </div>
                  <p className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">${selectedPlan.price}</span>
                    <span className="text-xs text-muted-foreground">/mo</span>
                  </p>
                </div>

                <ul className="mt-4 space-y-2.5 border-t border-border pt-4">
                  {selectedPlan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-md border border-border bg-background">
                        <Plus className="size-3 text-brand" />
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Totals — one line, because the price comes straight from the
                  plan (and from Stripe when the plan has a Price ID). */}
              <dl className="mt-5 space-y-2.5 border-t border-border pt-5 text-sm">
                <div className="flex items-baseline justify-between">
                  <dt className="font-semibold">Total due today</dt>
                  <dd className="text-2xl font-bold">${selectedPlan.price}</dd>
                </div>
              </dl>

              <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-4 shrink-0 text-brand" />
                Cancel anytime. Your plan renews automatically until cancelled.
              </p>
            </section>
          )}
        </div>

        {/* ── Right column ── */}
        {selectedPlan && selectedPlan.price <= 0 && (
          // Free plan selected — nothing to pay, so no Stripe checkout.
          <section className="rounded-2xl border border-border bg-card p-8 text-center lg:mt-24">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand/15">
              <CheckCircle2 className="size-6 text-brand" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">
              {selectedPlan.name} is free
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              No payment needed. Pick a paid plan on the left to unlock more,
              or keep going with {selectedPlan.name}.
            </p>
            <Button
              size="lg"
              className="mt-6 rounded-full bg-brand font-semibold hover:bg-brand/85"
              nativeButton={false}
              render={<Link href="/browse-jobs" />}
            >
              Browse Jobs
              <ArrowRight className="size-4" data-icon="inline-end" />
            </Button>
          </section>
        )}

        {selectedPlan && selectedPlan.price > 0 && (
          // ── Payment panel (mirrors Stripe Checkout's layout: Contact →
          // Payment method → Pay. The account email is passed to Stripe so the
          // user never re-types details they've already given.) ──
          // POSTs natively to our API route, which creates the Stripe Checkout
          // session (using the plan's Stripe Price ID when it exists) and
          // 303-redirects to Stripe's hosted page. Hidden fields carry the
          // user, their role, and the chosen plan.
          <form action="/api/checkout_sessions" method="POST">
            <input type="hidden" name="userId" value={userId} />
            <input type="hidden" name="userEmail" value={userEmail} />
            <input type="hidden" name="role" value={role} />
            <input type="hidden" name="plan" value={selectedKey} />

            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <span className="size-1.5 rounded-full bg-brand" />
                Payment
              </h2>

              {/* Contact — pulled from the account, nothing to re-type */}
              <div className="mt-5 rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Contact
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/15">
                    <Mail className="size-4 text-brand" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{userEmail}</p>
                    <p className="text-xs text-muted-foreground">
                      Receipts and plan updates go here
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment method — collected by Stripe on the next step */}
              <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/40 p-4">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Payment method
                </p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/15">
                      <CreditCard className="size-4 text-brand" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Card</p>
                      <p className="text-xs text-muted-foreground">
                        Enter securely on the next step
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    Stripe
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-muted/40 p-4 text-sm">
                <Globe className="size-4 shrink-0 text-brand" />
                <span className="text-muted-foreground">
                  Billed in USD · {selectedPlan.name} plan for {role}s
                </span>
              </div>

              {/* Pay — native submit → /api/checkout_sessions → Stripe */}
              <Button
                type="submit"
                size="lg"
                className="mt-6 h-11 w-full rounded-full cursor-pointer bg-brand font-semibold hover:bg-brand/85"
              >
                {`Pay $${selectedPlan.price}`}
                <ArrowRight className="size-4" data-icon="inline-end" />
              </Button>

              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="size-3.5 shrink-0" />
                Payments are encrypted and processed by Stripe. We never see
                your card details.
              </p>
            </section>
          </form>
        )}
      </div>
    </div>
  )
}

/** Shared page chrome (header + ambient glow) for every gate state. */
function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full px-4 py-10 md:px-8 md:py-14">
      {/* Ambient brand glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(60%_80%_at_50%_0%,rgba(92,83,254,0.14),transparent_70%)]"
      />

      <div className="mx-auto w-[min(1100px,94vw)]">
        <div className="text-center">
          <nav className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground">Checkout</span>
          </nav>
          <h1 className="mt-2 flex items-center justify-center gap-2.5 text-3xl font-bold tracking-tight sm:text-4xl">
            Secure Checkout
            <Sparkles className="size-6 text-brand" />
          </h1>
          <p className="mx-auto max-w-md text-muted-foreground">
            Choose a plan and complete the payment securely.
          </p>
        </div>

        {children}
      </div>
    </div>
  )
}
