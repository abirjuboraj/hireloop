import { headers } from "next/headers"

import { auth } from "../auth"
import type { AdminUser } from "../types"


export const getUsers = async (): Promise<AdminUser[] | null> => {
  try {
  
    const { users: userList } = await auth.api.listUsers({
      query: {
        sortBy: "name", 
        sortDirection: "asc", 
      },
  
      headers: await headers(),
    })

    return (userList as unknown as AdminUser[]) ?? []
  } catch (error) {
    console.error("[users] Failed to list users (does your account have the admin role?):", error)
    return null
  }
}
