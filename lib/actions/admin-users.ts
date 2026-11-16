'use server'

import { resolve } from "path/win32";
import { AUTH_URL } from "../config";
import { protectedMutation } from "../core/server";


export const updateUserRole = async(userId: string, role: "seeker" | "recruiter" | "admin") => {

    const api = `${AUTH_URL}/users/${userId}/role`;

    const roleData = {role};

    const res = await protectedMutation(api, "PATCH", roleData);

    return res;
}



export const updateUserBan = async(userId: string, banned: boolean) => {

    const api = `${AUTH_URL}/users/${userId}/ban`;

    const res = await protectedMutation(api, "PATCH", {banned})

    return res;
}

// Permanently delete a user from the database.
export const deleteUser = async(userId: string) => {

    const api = `${AUTH_URL}/users/${userId}`;

    const res = await protectedMutation(api, "DELETE")

    return res;
}