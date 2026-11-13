import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe } from '../../../lib/stripe'
import { resolvePlan } from '../../../lib/plans'
import type { UserRole } from '../../../lib/types'

export async function POST(request: Request) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    // The checkout page POSTs this route natively, so user identity, their
    // role, and the selected plan arrive as named form fields (hidden inputs
    // on the page).
    const formData = await request.formData()
    const userId = String(formData.get('userId') ?? '')
    const userEmail = String(formData.get('userEmail') ?? '')
    const role = (String(formData.get('role') ?? 'seeker') || 'seeker') as UserRole

    console.log(
      `[checkout-sessions] Creating session — user: ${userId || 'unknown'}, role: ${role}, plan: ${formData.get('plan')}`
    )

    // Without a logged-in user we can't attribute the payment in the backend's
    // verification step, so refuse to open checkout instead of creating an
    // orphan session.
    if (!userId) {
      console.warn('[checkout-sessions] Rejected — no user id in form data')
      return NextResponse.json(
        { error: 'You must be signed in to check out' },
        { status: 401 }
      )
    }

    // Pick the plan the user selected (validated against their role).
    const [planKey, plan] = resolvePlan(String(formData.get('plan') ?? ''), role)

    // Starter is free — there is nothing to charge, so checkout is a no-op.
    if (plan.price <= 0) {
      console.warn(`[checkout-sessions] Rejected — ${planKey} is a free plan`)
      return NextResponse.json(
        { error: `${plan.name} is a free plan and needs no payment` },
        { status: 400 }
      )
    }

    // ── What Stripe charges ──────────────────────────────────────────────
    // Two cases:
    // 1. The plan has a Stripe Price ID → we pass `price`. Stripe then uses
    //    the EXACT price you configured in your Stripe Dashboard, so the
    //    Stripe page shows your real product name and amount.
    // 2. No Price ID yet → we build the price dynamically (inline price_data)
    //    from the plan catalogue, using the plan's role and price. This keeps
    //    checkout working for plans you haven't created in Stripe yet.
    const lineItem = plan.stripePriceId
      ? {
          quantity: 1,
          price: plan.stripePriceId,
        }
      : {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: plan.price * 100,
            product_data: {
              name: `HireLoop ${plan.name} plan (${role})`,
              description: `${plan.name} plan for ${role}s`,
            },
          },
        }

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      // Prefill the customer's email from their account so they don't have to
      // re-type it on Stripe's page, and let Stripe collect card details.
      customer_email: userEmail || undefined,
      line_items: [lineItem],
      mode: 'payment',
      // Plan, role and user travel in metadata — the backend's
      // /payments/checkout-verify reads them to record the payment and update
      // the user's plan.
      metadata: {
        userId,
        plan: planKey,
        role,
        billingCycle: 'monthly',
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      // Cancel sends the user back to the checkout page with ?canceled=true.
      cancel_url: `${origin}/checkout?canceled=true&plan=${planKey}`,
      // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
      integration_identifier: 'hireloop_web_001',
    });
    console.log(
      `[checkout-sessions] Session created for ${plan.name} (${role}): ${session.id} — redirecting to Stripe`
    )
    return NextResponse.redirect(session.url as string, 303)
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    console.error('[checkout-sessions] Failed to create session:', error.message)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
