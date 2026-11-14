import { JobForm } from "../types";
import { authClient } from "@/lib/auth-client"

export const AUTH_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const createJob = async( data: JobForm) => {
    try {
  
        const { data: session } = await authClient.getSession()
        const user = session?.user

        const res = await fetch(`${AUTH_URL}/jobs`,{
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                ...data,
                recruiterId: user?.id ?? null,
                recruiterEmail: user?.email ?? null,
            }),
        });

        return res.json();
    } catch (error) {
        console.log("Error creating job:", error);
    }
}


export const deleteJob = async(jobId:string)=> {
    try {
        const res = await fetch(`${AUTH_URL}/jobs/${jobId}`,{
            method: "DELETE",
        });

        return res.json();
    } catch (error) {
        console.log("Error deleting job:", error);
    }
}