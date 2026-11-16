'use server'

import { AUTH_URL } from "../config";
import { getSession, protectedMutation } from "../core/server";
import { JobForm } from "../types";

export const createJob = async( data: JobForm) => {
    try {
  
        const session = await getSession()
        const user = session?.user

        const api = `${AUTH_URL}/jobs`;

        const jobData = {
                ...data,
                recruiterId: user?.id ?? null,
                recruiterEmail: user?.email ?? null,
            }

        const res = await protectedMutation(api, "POST", jobData )

        return res;
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