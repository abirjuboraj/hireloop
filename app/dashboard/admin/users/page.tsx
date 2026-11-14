import { getUsers } from '@/lib/api/user';
import React from 'react';

const AdminUsersPage = async() => {

    const users = await getUsers();
    console.log("users", users)
    return (
        <div>
            Admin Users Page
        </div>
    );
};

export default AdminUsersPage;