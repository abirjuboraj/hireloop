import { AUTH_URL } from "../actions/jobs"


export const getApplications = async (query: string = "") => {
    try {
        const res = await fetch(`${AUTH_URL}/applications?${query}`);

        const {applications} = await res.json();
        return applications;
    } catch (error) {
        console.error("Error fetching applications:", error);
    }
}


export const getApplicationCount = async (query: string = ""): Promise<{count: number} | undefined> => {
    try {
        console.log(`[applications] Fetching application count (${query || "no filter"})`)
        const res = await fetch(`${AUTH_URL}/applications/count?${query}`);

        if (!res.ok) {
            console.error(`[applications] Count request failed with status ${res.status}`)
            return undefined
        }

        const data = await res.json();
        console.log(`[applications] Application count: ${data?.count ?? 0}`)
        return data;
    } catch (error) {
        console.error("[applications] Error fetching application count:", error);
    }
}
