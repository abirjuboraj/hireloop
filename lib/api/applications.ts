'use server'


import { AUTH_URL } from "../config";
import { authFetch} from "../core/server";


export const getApplications = async (query: string = "") => {
    try {
        const api = `${AUTH_URL}/applications?${query}`

        const data = await authFetch(api);
        const {applications} = data;
        return applications;
    } catch (error) {
        console.error("Error fetching applications:", error);
    }
}


export const getApplicationCount = async (query: string = ""): Promise<{count: number} | undefined> => {
    try {
        const res = await fetch(`${AUTH_URL}/applications/count?${query}`);

        if (!res.ok) {
            console.error(`[applications] Count request failed with status ${res.status}`)
            return undefined
        }

        const data = await res.json();

        return data;
    } catch (error) {
        console.error("[applications] Error fetching application count:", error);
    }
}

// for recruiter
export const getJobApplications = async (jobId: string) => {
    try {

        const data = await authFetch(`${AUTH_URL}/applications?jobId=${jobId}`)

        return data?.applications
    } catch (error) {
        console.error("[applications] Error fetching job applicants:", error)
    }
}
