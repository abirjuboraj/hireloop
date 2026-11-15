import { getUsers } from "@/lib/api/admin-users"

import { UserManagement } from "./_components/UserManagement"

const AdminUsersPage = async () => {
 
  const users = await getUsers()

  return <UserManagement initialUsers={users} />
}

export default AdminUsersPage
