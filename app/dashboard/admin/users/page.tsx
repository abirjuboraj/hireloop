import { getUsers } from "@/lib/api/admin-users"

import { UserManagement } from "./_components/UserManagement"
import { AdminUser } from "@/lib/types"

const AdminUsersPage = async () => {
 
  const users: AdminUser[] = await getUsers()

  return <UserManagement initialUsers={users} />
}

export default AdminUsersPage
