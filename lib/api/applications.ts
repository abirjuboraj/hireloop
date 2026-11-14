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


/**
 * Fetch every application for ONE job — this is the recruiter's applicants
 * list. The backend also attaches each applicant's name (applicantName).
 */
export const getJobApplications = async (jobId: string) => {
    try {
        console.log(`[applications] Fetching applicants for job: ${jobId}`)
        const res = await fetch(`${AUTH_URL}/applications?jobId=${jobId}`)

        if (!res.ok) {
            console.error(`[applications] Applicants request failed with status ${res.status}`)
            return undefined
        }

        const data = await res.json()
        console.log(`[applications] Found ${data?.applications?.length ?? 0} applicants for job ${jobId}`)
        // Same response shape as getApplications → { applications: [...] }
        return data?.applications
    } catch (error) {
        console.error("[applications] Error fetching job applicants:", error)
    }
}
