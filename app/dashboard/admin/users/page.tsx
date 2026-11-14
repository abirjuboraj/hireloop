import { getUsers } from "@/lib/api/admin-users"

import { UserManagement } from "./_components/UserManagement"

/**
 * Admin > User Management page.
 *
 * The users list is fetched on the SERVER with better-auth's admin API
 * (lib/api/user.ts → getUsers) because that call needs the signed-in admin's
 * session cookies. The interactive UI (search, filters, role changes, …)
 * lives in the client component below.
 */
const AdminUsersPage = async () => {
  // null when the fetch fails (e.g. the signed-in user is not an admin yet)
  const users = await getUsers()

  return <UserManagement initialUsers={users} />
}

export default AdminUsersPage
