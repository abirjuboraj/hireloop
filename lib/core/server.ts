import { headers } from "next/headers"
import { auth } from "../auth"
import { redirect } from "next/navigation"

export const getSession = async() => {
    "use server"

    const session = await auth.api.getSession(
        {
            headers: await headers()
        }
    )

    return session
}

export const requireRole = async (role: string) => {
    const session = await getSession();

    if(!session || session?.user.role !== role) {
        redirect("/unauthorized");
    }

    return session;
}