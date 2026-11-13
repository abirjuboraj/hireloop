"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Suspense, useEffect, useRef, useState } from "react"
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Loader2,
  TriangleAlert,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { useSession } from "@/lib/auth-client"
import { verifyCheckoutSession } from "@/lib/api/payments"
import { PLANS } from "@/lib/plans"
import { cn } from "@/lib/utils"

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}

type VerificationState =
  | { phase: "verifying" }
  | { phase: "done"; plan: string; alreadyVerified: boolean }
  | { phase: "error"; message: string }

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  // Wait for the auth session to settle so the verify request can carry the
  // userId for the backend's user-match check (when signed in).
  const { data: session, isPending } = useSession()
  const userId = session?.user?.id

  // null = verification still running. The "no session id" error is derived
  // during render instead of being set inside the effect — calling setState
  // synchronously in an effect body triggers cascading renders
  // (react-hooks/set-state-in-effect).
  const [verifyState, setVerifyState] = useState<VerificationState | null>(null)

  const state: VerificationState =
    verifyState ??
    (sessionId
      ? { phase: "verifying" }
      : {
          phase: "error",
          message: "No payment session was found in this link.",
        })

  // Ensures verification runs exactly once per page load — effects re-run in
  // React StrictMode (dev) and when the auth session resolves late.
  const startedRef = useRef(false)

  useEffect(() => {
    if (isPending) return

    if (!sessionId) {
      console.warn("[checkout-success] No session_id in URL — nothing to verify")
      return
    }

    if (startedRef.current) return
    startedRef.current = true

    // Verify against the backend: it re-checks the session with Stripe, saves
    // the payment record, and upgrades the user's plan (idempotent).
    verifyCheckoutSession(sessionId, userId).then((result) => {
      if (result.success && result.alreadyVerified) {
        console.log(
          `[checkout-success] Session was already verified previously (plan: ${result.plan})`
        )
        setVerifyState({
          phase: "done",
          plan: (result.plan as string) ?? "growth",
          alreadyVerified: true,
        })
        toast.add({
          title: "Payment already verified",
          description: "Your plan was activated when you first paid.",
          type: "info",
        })
      } else if (result.success) {
        console.log(
          `[checkout-success] Payment verified — plan activated: ${result.plan}`
        )
        setVerifyState({
          phase: "done",
          plan: (result.plan as string) ?? "starter",
          alreadyVerified: false,
        })
        toast.add({
          title: "Payment successful 🎉",
          description: `Your ${PLANS[(result.plan as string) ?? "starter"].name} plan is now active.`,
          type: "success",
        })
      } else {
        console.error(
          `[checkout-success] Verification failed: ${result.message}`
        )
        setVerifyState({ phase: "error", message: result.message })
        toast.add({
          title: "Payment verification failed",
          description: result.message,
          type: "destructive",
        })
      }
    })
    // Runs once the auth session has settled; never re-verified on re-runs.
  }, [sessionId, isPending, userId])

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
      {/* Ambient brand glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(60%_80%_at_50%_0%,rgba(92,83,254,0.14),transparent_70%)]"
      />

      <div className="w-[min(480px,94vw)]">
        <nav className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground">Payment Complete</span>
        </nav>

        <section className="mt-6 rounded-2xl border border-border bg-card p-8 text-center">
          {state.phase === "verifying" && (
            <>
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand/15">
                <Loader2 className="size-7 animate-spin text-brand" />
              </div>
              <h1 className="mt-5 text-2xl font-bold tracking-tight">
                Verifying your payment…
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Hang tight — we&apos;re confirming your payment with Stripe and
                activating your plan.
              </p>
            </>
          )}

          {state.phase === "done" && (
            <>
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand/15">
                <CheckCircle2 className="size-7 text-brand" />
              </div>
              <h1 className="mt-5 text-2xl font-bold tracking-tight">
                Payment Complete!
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {state.alreadyVerified
                  ? "This payment was already verified earlier — your plan remains active."
                  : `Welcome to the ${PLANS[state.plan].name} plan. Your subscription is now active.`}
              </p>

              <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4 text-left">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold">
                    {PLANS[state.plan].name} plan
                  </p>
                  <span
                    className={cn(
                      "rounded-full bg-brand/15 px-2.5 py-1 text-[11px] font-semibold text-brand"
                    )}
                  >
                    Active
                  </span>
                </div>
                <ul className="mt-3 space-y-2">
                  {PLANS[state.plan].features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2.5 text-sm text-muted-foreground"
                    >
                      <span className="size-1.5 shrink-0 rounded-full bg-brand" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                size="lg"
                className="mt-6 h-11 w-full rounded-full bg-brand font-semibold hover:bg-brand/85"
                nativeButton={false}
                render={<Link href="/dashboard/seeker" />}
              >
                Go to Dashboard
                <ArrowRight className="size-4" data-icon="inline-end" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="mt-2 w-full text-muted-foreground hover:text-foreground"
                nativeButton={false}
                render={<Link href="/browse-jobs" />}
              >
                <Briefcase />
                Browse Jobs
              </Button>
            </>
          )}

          {state.phase === "error" && (
            <>
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-destructive/10">
                <TriangleAlert className="size-7 text-destructive" />
              </div>
              <h1 className="mt-5 text-2xl font-bold tracking-tight">
                Something went wrong
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {state.message} If you were charged, don&apos;t worry —
                contact support and we&apos;ll sort it out.
              </p>
              <Button
                size="lg"
                className="mt-6 h-11 w-full rounded-full bg-brand font-semibold hover:bg-brand/85"
                nativeButton={false}
                render={<Link href="/checkout" />}
              >
                Back to Checkout
              </Button>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
