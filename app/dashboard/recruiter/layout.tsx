import { requireRole } from '@/lib/core/server';
import React from 'react';

const RecruiterLayout = async({children}: {children: React.ReactNode}) => {

    await requireRole("recruiter");
    return children
};

export default RecruiterLayout;