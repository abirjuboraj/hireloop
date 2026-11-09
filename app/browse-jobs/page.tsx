import { getJobs } from '@/lib/api/jobs';
import { JobPost } from '@/lib/types';
import React from 'react';

const BrowseJobsPage = async ({searchParams}: {searchParams: Promise<{[key: string]: string | string[] | undefined}>}) => {

    const params = await searchParams;

    const queryString = new URLSearchParams(params as Record<string, string>).toString();

    const jobsData = await getJobs(queryString);

    return (
        <div>
            <h1>Browse Jobs</h1>
            <div>
                {
                    jobsData.map((job: JobPost)=> {
                       return (
                        <h1 key={job._id}>{job.title}</h1>
                       ) 
                    })
                }
            </div>
        </div>
    );
};

export default BrowseJobsPage;