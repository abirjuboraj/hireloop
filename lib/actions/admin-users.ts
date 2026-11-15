import { AUTH_URL } from "./jobs"

export const updateUserRole = async(userId: string, role: "seeker" | "recruiter" | "admin") => {
    const res = await fetch(`${AUTH_URL}/users/${userId}/role`, {
        method: "PATCH",
        headers: {"content-type" : "application/json"},
        body: JSON.stringify({role}),
    });

    return res.json();
}



export const updateUserBan = async(userId: string, banned: boolean) => {
    const res = await fetch(`${AUTH_URL}/users/${userId}/ban`, {
        method: "PATCH",
        headers: {"content-type" : "application/json"},
        body: JSON.stringify({banned}),
    });

    return res.json();
}

// Permanently delete a user from the database.
export const deleteUser = async(userId: string) => {
    const res = await fetch(`${AUTH_URL}/users/${userId}`, {
        method: "DELETE",
    });

    return res.json();
}