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
    console.error("[apply] Error submitting application:", error);
  }
}

/**
 * Recruiter changing an applicant's status (e.g. Applied → Rejected).
 *
 * TODO (backend — yours to add): this currently only logs, because the
 * database update endpoint does not exist yet. When you build it, replace the
 * console.log with the real request — the UI is already wired to this
 * function, so nothing else needs to change. Suggested backend endpoint:
 *
 *   PATCH /applications/:id    body: { status }
 *
 * Example of the real implementation:
 *
 *   const res = await fetch(`${AUTH_URL}/applications/${applicationId}`, {
 *     method: "PATCH",
 *     headers: { "content-type": "application/json" },
 *     body: JSON.stringify({ status }),
 *   })
 *   return res.json()
 */
export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
) {
  console.log(
    `[applications] Status change requested: ${applicationId} → ${status} (database update pending)`
  )

  // Return a success shape so the UI can update optimistically today.
  return { success: true, message: "Status updated in the UI" }
}
