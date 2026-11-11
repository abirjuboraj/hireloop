import { AUTH_URL } from "../actions/jobs"


export const getApplications = async (query: string = "") => {
    try {
        const res = await fetch(`${AUTH_URL}/applications?${query}`);

        const applicationsData = await res.json();
        return applicationsData;
    } catch (error) {
        console.error("Error fetching applications:", error);
    }
}
