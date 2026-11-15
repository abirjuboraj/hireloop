'use server'

import { AUTH_URL } from "./jobs"
import { ApplicationPayload, ApplicationStatus } from "../types"
import { getSession, protectedMutation } from "../core/server"

export async function applyToJob(data: ApplicationPayload) {
  try {
    const session = await getSession()
    const user = session?.user

    const api = `${AUTH_URL}/applications`

    const result = await protectedMutation(api, "POST", {
      ...data,
      seekerId: user?.id,
      seekerEmail: user?.email,
    })

    return result
  } catch (error) {
    console.error("[apply] Error submitting application:", error)
    return { success: false, message: "Error submitting application" }
  }
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
) {
  try {
    const res = await fetch(`${AUTH_URL}/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    })
    console.log(
      `[applications] Status change requested: ${applicationId} → ${status}`
    )
    return res.json()
  } catch (error) {
    return error
  }


}
