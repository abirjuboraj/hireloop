import { headers } from "next/headers"

import { auth } from "../auth"
import type { AdminUser } from "../types"

/**
 * SERVER-ONLY helpers for the admin panel.
 *
 * Kept in a separate file from lib/api/user.ts because this module imports
 * `next/headers`, which can only run on the server. Mixing it with client
 * helpers would break every client component that imports that file.
 */

/**
 * Fetch every user via better-auth's admin API (auth.api.listUsers).
 * Needs the signed-in admin's session cookie — that's why the request
 * headers are forwarded. Returns null when the call fails (e.g. the
 * signed-in user is not an admin yet), so the page can show a message.
 */
export const getUsers = async (): Promise<AdminUser[] | null> => {
  try {
    // listUsers returns { users, total } — we only need the array here.
    const { users: userList } = await auth.api.listUsers({
      query: {
        sortBy: "name", // The field to sort by.
        sortDirection: "asc", // A → Z feels natural for a name list.
      },
      // This endpoint requires session cookies.
      headers: await headers(),
    })

    console.log(`[users] Fetched ${userList?.length ?? 0} users from the admin API`)
    // better-auth's UserWithRole is compatible with our AdminUser shape
    // (id, name, email, role, banned, createdAt, …).
    return (userList as unknown as AdminUser[]) ?? []
  } catch (error) {
    // Usually fires when the signed-in user doesn't have the admin role yet.
    console.error("[users] Failed to list users (does your account have the admin role?):", error)
    return null
  }
}
