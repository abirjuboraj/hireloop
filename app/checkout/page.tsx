"use client"

import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Suspense, useState } from "react"
import {
  ArrowRight,
  ChevronRight,
  CreditCard,
  Globe,
  Lock,
  Mail,
  Plus,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

type BillingCycle = "monthly" | "yearly"

type Plan = {
  name: string
  price: number
  features: string[]
}

// Mirrors the plans on the landing page's Pricing section.
const PLANS: Record<string, Plan> = {
  starter: {
    name: "Starter",
    price: 0,
    features: [
      "Daily AI match brief (top 5)",
      "Verified salary bands",
      "Company insight dashboards",
      "1-click apply, unlimited",
    ],
  },
  growth: {
    name: "Growth",
    price: 17,
    features: [
      "Daily AI match brief (top 5)",
      "Verified salary bands",
      "Company insight dashboards",
      "1-click apply, unlimited",
    ],
  },
  premium: {
    name: "Premium",
    price: 99,
    features: [
      "Everything in Pro",
      "Multi-profile career portfolios",
      "Shared talent rooms",
      "Recruiter view (read-only)",
    ],
  },
}

const YEARLY_DISCOUNT = 0.25

// TODO: point this at the real Stripe Checkout session URL once integrated.
const STRIPE_CHECKOUT_URL = "/checkout-stub"

export default function CheckoutPage() {
  return (
    <Suspense>
      <PaymentPage />
    </Suspense>
  )
}

function PaymentPage() {
  const searchParams = useSearchParams()
  const planKey = searchParams.get("plan")?.toLowerCase() ?? "growth"
  const plan = PLANS[planKey] ?? PLANS.growth

  const router = useRouter();

  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly")
  const [isRedirecting, setIsRedirecting] = useState(false)

  const total =
    billingCycle === "monthly"
      ? plan.price
      : Math.round(plan.price * 12 * (1 - YEARLY_DISCOUNT))

  const handlePay = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // TODO: create a Stripe Checkout session (server action / API route)
    // with the billing details below, then redirect to session.url.
    setIsRedirecting(true)
    toast.add({
      title: "Redirecting to Stripe…",
      description: "You will be taken to a secure checkout page to complete your payment.",
      type: "info",
    })
    router.push(STRIPE_CHECKOUT_URL)
  }

  return (
    <div className="relative min-h-screen w-full px-4 py-10 md:px-8 md:py-14">
      {/* Ambient brand glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(60%_80%_at_50%_0%,rgba(92,83,254,0.14),transparent_70%)]"
      />

      <div className="mx-auto w-[min(1100px,94vw)]">
        {/* Page header */}
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
            Review your order, confirm your details, and complete the payment
            securely.
          </p>
        </div>

        <div className="mt-8 grid items-start gap-6 sm:mt-10 lg:grid-cols-[1fr_1.2fr]">
          {/* ── Order summary ── */}
          <section className="rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-6">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <span className="size-1.5 rounded-full bg-brand" />
              Order Summary
            </h2>

            <div className="mt-5 rounded-xl border border-border bg-muted/40 p-5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{plan.name} plan</p>
                  <p className="text-xs text-muted-foreground">
                    Billed {billingCycle === "monthly" ? "monthly" : "yearly"}
                  </p>
                </div>
                <p className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">${plan.price}</span>
                  <span className="text-xs text-muted-foreground">/mo</span>
                </p>
              </div>

              <ul className="mt-4 space-y-2.5 border-t border-border pt-4">
                {plan.features.map((feature) => (
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

            {/* Billing cycle toggle */}
            <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 p-2">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                aria-pressed={billingCycle === "monthly"}
                className={cn(
                  "h-9 flex-1 rounded-lg text-sm font-medium transition-colors",
                  billingCycle === "monthly"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                aria-pressed={billingCycle === "yearly"}
                className={cn(
                  "flex h-9 flex-1 items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors",
                  billingCycle === "yearly"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Yearly
                <span className="rounded-full bg-brand/15 px-2 py-0.5 text-[11px] font-semibold text-brand">
                  −25%
                </span>
              </button>
            </div>

            {/* Totals */}
            <dl className="mt-5 space-y-2.5 border-t border-border pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="font-medium">
                  ${plan.price * (billingCycle === "monthly" ? 1 : 12)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{billingCycle === "monthly" ? "Monthly" : "Yearly"} discount ({billingCycle === "monthly" ? 0 : (YEARLY_DISCOUNT * 100)}%)</dt>
                <dd className="font-medium text-brand">
                  −${plan.price * (billingCycle === "monthly" ? 0 : 12) - (billingCycle === "monthly" ? 0 : total)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-border pt-3">
                <dt className="font-semibold">Total due today</dt>
                <dd className="text-2xl font-bold">${total}</dd>
              </div>
            </dl>

            <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 shrink-0 text-brand" />
              Cancel anytime. Your plan renews automatically until cancelled.
            </p>
          </section>

          {/* ── Payment details ── */}
          <form onSubmit={handlePay}>
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <span className="size-1.5 rounded-full bg-brand" />
                Payment Details
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                You&apos;ll finish the payment on Stripe&apos;s secure checkout
                page.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="cardholder">
                    Cardholder Name <span className="text-brand">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="cardholder"
                      name="cardholder"
                      placeholder="Jane Doe"
                      required
                      className="h-10 pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">
                    Billing Email <span className="text-brand">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="jane@company.com"
                      required
                      className="h-10 pl-9"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                <Label>
                  Country / Region <span className="text-brand">*</span>
                </Label>
                <Select defaultValue="United States" required>
                  <SelectTrigger className="h-10 w-full">
                    <Globe className="size-4 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "United States",
                      "United Kingdom",
                      "Canada",
                      "Germany",
                      "Bangladesh",
                      "Australia",
                    ].map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Card entry preview — handled by Stripe Checkout */}
              <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/40 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/15">
                      <CreditCard className="size-4 text-brand" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Card information</p>
                      <p className="text-xs text-muted-foreground">
                        Collected securely on the next step
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    Stripe
                  </span>
                </div>
              </div>

              {/* Pay */}
              <Button
                type="submit"
                size="lg"
                disabled={isRedirecting}
                className="mt-6 h-11 w-full rounded-full bg-brand font-semibold hover:bg-brand/85"
              >
                {isRedirecting ? "Redirecting…" : `Pay $${total}`}
                <ArrowRight className="size-4" data-icon="inline-end" />
              </Button>

              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="size-3.5 shrink-0" />
                Payments are encrypted and processed by Stripe. We never see
                your card details.
              </p>
            </section>
          </form>
        </div>
      </div>
    </div>
  )
}
