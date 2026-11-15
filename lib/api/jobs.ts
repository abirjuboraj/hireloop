import { AUTH_URL } from "../actions/jobs"



export const getJobs = async (query: string = "")=> {
    try {
        console.log(query);
        const res = await fetch(`${AUTH_URL}/jobs?${query}`);

        const jobsData = await res.json();
        console.log(jobsData);
        return jobsData;
    } catch (error) {
        console.error("Error fetching jobs:", error);
    }
}


export const getJob = async (id: string)=> {
    try {
        const res = await fetch(`${AUTH_URL}/jobs/${id}`);

        const jobData = await res.json();
        return jobData;
    } catch (error) {
        console.error("Error fetching job:", error);
    }
}