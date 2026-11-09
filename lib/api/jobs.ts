import { AUTH_URL } from "../actions/jobs"



export const getJobs = async (query: string = "")=> {
    try {
        const res = await fetch(`${AUTH_URL}/jobs?${query}`);

        const jobsData = await res.json();
        return jobsData;
    } catch (error) {
        console.error("Error fetching jobs:", error);
    }
}