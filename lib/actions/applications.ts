import { AUTH_URL } from "./jobs"
import { ApplicationPayload } from "../types"

export async function applyToJob(data: ApplicationPayload) {
  try {
    const res = await fetch(`${AUTH_URL}/applications`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    })

    return res.json()
  } catch (error) {
    console.log(error);
  }
}
