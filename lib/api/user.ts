import { AUTH_URL } from "../actions/jobs"

/**
 * The shape returned by the backend's GET /users/:id/plan endpoint
 * (see its projection). `plan` plus the boolean flags are what the
 * checkout page uses to decide whether the user has already paid.
 */
export type UserPlan = {
  _id: string
  plan?: "starter" | "growth" | "premium" | null
  starter?: boolean
  growth?: boolean
  premium?: boolean
}

export const getUserPlan = async (userId: string): Promise<UserPlan | null> => {
  try {
    const res = await fetch(`${AUTH_URL}/users/${userId}/plan`)

    if (!res.ok) {
      console.error(`[user-plan] Request failed with status ${res.status}`)
      return null
    }

    const data = await res.json()
    console.log("[user-plan] Plan response:", data)
    // Backend returns { success: false, ... } when the user is not found.
    return data.success === false ? null : (data as UserPlan)
  } catch (error) {
    console.error("[user-plan] Error fetching user plan:", error)
    return null
  }
}
