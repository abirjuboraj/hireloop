'use server'

import { AUTH_URL } from "../config"
import { authFetch } from "../core/server"


export const getUsers = async () => {
  try {
  
   const res = await authFetch(`${AUTH_URL}/users`);

   return res;

   
  } catch (error) {
    console.error("[users] Failed to list users (does your account have the admin role?):", error)
    return null
  }
}
