import { AUTH_URL } from "../actions/jobs"



export const getJobs = async ()=> {
    try {
        const res = await fetch(`${AUTH_URL}/jobs`);

        const jobsData = await res.json();
        return jobsData;
    } catch (error) {
        console.error("Error fetching jobs:", error);
    }
}