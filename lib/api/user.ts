import { AUTH_URL } from "../config"



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
  
    return data.success === false ? null : (data as UserPlan)
  } catch (error) {
    console.error("[user-plan] Error fetching user plan:", error)
    return null
  }
}
