import { AUTH_URL } from "./jobs"

export const updateUserRole = async(userId: string, role: "seeker" | "recruiter" | "admin") => {
    const res = await fetch(`${AUTH_URL}/users/${userId}/role`, {
        method: "PATCH",
        headers: {"content-type" : "application/json"},
        body: JSON.stringify({role}),
    });

    return res.json();
}