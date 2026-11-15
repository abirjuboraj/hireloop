import { requireRole } from '@/lib/core/server';
import React from 'react';

const AdminLayout = async({children}: {children: React.ReactNode}) => {
    await requireRole("admin");
    return children
};

export default AdminLayout;