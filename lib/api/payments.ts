import { AUTH_URL } from "../actions/jobs"

export type VerifyResponse = {
  success: boolean
  message: string
  plan?: "starter" | "growth" | "premium"
  /** True when this session was verified in an earlier visit (idempotent). */
  alreadyVerified?: boolean
}

/**
 * Asks the backend to verify a completed Stripe Checkout session. The backend
 * retrieves the session from Stripe (source of truth), stores the payment
 * record, and upgrades the user's plan — idempotently (duplicate sessionIds
 * are rejected there).
 */
export const verifyCheckoutSession = async (
  sessionId: string,
  userId?: string
): Promise<VerifyResponse> => {
  try {
    console.log(`[payments] Verifying checkout session: ${sessionId}`)
    const res = await fetch(`${AUTH_URL}/payments/checkout-verify`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ sessionId, userId }),
    })

    const data = await res.json()
    console.log("[payments] Verification response:", data)
    return data
  } catch (error) {
    console.error("[payments] Error verifying checkout session:", error)
    return { success: false, message: "Payment verification failed" }
  }
}
