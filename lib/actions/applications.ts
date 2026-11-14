import { AUTH_URL } from "./jobs"
import { ApplicationPayload, ApplicationStatus } from "../types"
import { authClient } from "@/lib/auth-client"

export async function applyToJob(data: ApplicationPayload) {
  try {
    // User identity comes from the frontend session for now (JWT later).
    const { data: session } = await authClient.getSession()
    const user = session?.user

    console.log(`[apply] Submitting application for job ${data.jobId}`)
    const res = await fetch(`${AUTH_URL}/applications`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        seekerId: user?.id,
        seekerEmail: user?.email,
      }),
    })

    const result = await res.json()
    console.log("[apply] Application response:", result)
    return result
  } catch (error) {
    console.error("[apply] Error submitting application:", error)
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
