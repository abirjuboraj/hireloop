import { AUTH_URL } from "./jobs"
import { ApplicationPayload } from "../types"
import { authClient } from "@/lib/auth-client"

export async function applyToJob(data: ApplicationPayload) {
  try {
    // User identity comes from the frontend session for now (JWT later).
    const { data: session } = await authClient.getSession()
    const user = session?.user

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

    return res.json()
  } catch (error) {
    console.log(error);
  }
}
