"use client"

import { useMemo, useState } from "react"
import {
  Ban,
  Download,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  BriefcaseBusiness,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/toast"
import { useSession } from "@/lib/auth-client"
import { updateUserRole, updateUserBan, deleteUser } from "@/lib/actions/admin-users"
import { USER_ROLES, resolveUserRole, type AdminUser, type UserRole } from "@/lib/types"
import { cn } from "@/lib/utils"

import { DeleteUserDialog } from "./DeleteUserDialog"
import { UserRoleBadge } from "./UserRoleBadge"
import { UserRoleSelect } from "./UserRoleSelect"

/** The role filter in the page header: every role, or "all" for no filter. */
type RoleFilter = UserRole | "all"

/** "2026-11-13T…" → "Nov 13, 2026" for the Join Date column. */
const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

/** True when the account was created in the last 24 hours (for the stats card). */
const isNewSignup = (date: string | Date) =>
  Date.now() - new Date(date).getTime() < 24 * 60 * 60 * 1000

/** Percentage of `part` out of `total`, e.g. "12% of all users". */
const percentOf = (part: number, total: number) =>
  total === 0 ? "0%" : `${Math.round((part / total) * 100)}%`

/** Small green/red chip used in the Status column and on mobile cards. */
function UserStatusBadge({ banned }: { banned?: boolean | null }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium",
        banned
          ? "border-red-500/20 bg-red-500/10 text-red-400"
          : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
      )}
    >
      <span className={cn("size-1.5 rounded-full", banned ? "bg-red-400" : "bg-emerald-400")} />
      {banned ? "Suspended" : "Active"}
    </span>
  )
}


export function UserManagement({ initialUsers }: { initialUsers: AdminUser[] | null }) {
  const { data: session } = useSession()

  const myId = session?.user?.id

  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all")
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null)

 
  const loadFailed = initialUsers === null

 
  const [users, setUsers] = useState<AdminUser[]>(initialUsers ?? [])

  // ── Filtering: email search + role filter, both done in the browser ──
  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase()

    return users.filter((user) => {
      const matchesSearch = user.email.toLowerCase().includes(query)
      const matchesRole = roleFilter === "all" || resolveUserRole(user.role) === roleFilter
      return matchesSearch && matchesRole
    })
  }, [users, search, roleFilter])

  // ── Stats cards, computed from the loaded users (no extra requests) ──
  const stats = useMemo(() => {
    const active = users.filter((user) => !user.banned).length
    const recruiters = users.filter((user) => resolveUserRole(user.role) === "recruiter").length
    const suspended = users.filter((user) => user.banned).length
    const newSignups = users.filter((user) => isNewSignup(user.createdAt)).length

    return [
      {
        label: "Total Active Users",
        value: active,
        detail: `${users.length} account${users.length === 1 ? "" : "s"} in total`,
        detailClass: "text-emerald-400",
        icon: Users,
      },
      {
        label: "Recruiters",
        value: recruiters,
        detail: `${percentOf(recruiters, users.length)} of all users`,
        detailClass: "text-emerald-400",
        icon: BriefcaseBusiness,
      },
      {
        label: "Suspended Accounts",
        value: suspended,
        detail: `${percentOf(suspended, users.length)} of total`,
        detailClass: "text-muted-foreground",
        icon: Ban,
      },
      {
        label: "New Signups (24h)",
        value: newSignups,
        detail: "In the last 24 hours",
        detailClass: "text-amber-400",
        icon: UserPlus,
      },
    ]
  }, [users])

  const handleRoleChange = async (user: AdminUser, next: UserRole) => {
    if (next === resolveUserRole(user.role)) return

    setUsers((previous) =>
      previous.map((item) => (item.id === user.id ? { ...item, role: next } : item))
    )
    try {
      const result = await updateUserRole(user.id, next)
      console.log("[admin-users] Role update response:", result)

      if (result?.success === false) {
        console.error("[admin-users] Backend rejected the change:", result)
        toast.add({
          title: "Role change failed",
          description: result?.message ?? "The backend rejected the request.",
          type: "error",
        })
        return
      }

      toast.add({
        title: "Role updated",
        description: `${user.name} is now a ${next}.`,
        type: "success",
      })
    } catch (error) {
      console.log(error)
      toast.add({
        title: "Role update failed",
        description: `The role update for ${user.name} to ${next} failed` ,
        type: "error",
      })
    }
  }

  /**
   * Suspend or activate a user.
   * There is no "status" field in the database — a suspended user is just a
   * user whose `banned` field is true (see the backend /users/:id/ban route).
   */
  const handleToggleSuspension = async (user: AdminUser) => {
    const nextBanned = !user.banned

    console.log(`[admin-users] ${nextBanned ? "Suspending" : "Activating"}: ${user.email}`)

    setUsers((previous) =>
      previous.map((item) => (item.id === user.id ? { ...item, banned: nextBanned } : item))
    )

    try {
      const result = await updateUserBan(user.id, nextBanned)
      console.log("[admin-users] Ban update response:", result)

      if (result?.success === false) {
        console.error("[admin-users] Backend rejected the change:", result)
        toast.add({
          title: "Suspend update failed",
          description: result?.message ?? "The backend rejected the request.",
          type: "error",
        })
        return
      }

      toast.add({
        title: nextBanned ? "User suspended" : "User activated",
        description: nextBanned
          ? `${user.name} can no longer sign in.`
          : `${user.name} can sign in again.`,
        type: "success",
      })
    } catch (error) {
      console.log(error)
      toast.add({
        title: "Suspend update failed",
        description: `The suspend update for ${user.name} failed`,
        type: "error",
      })
    }
  }

  /**
   * Permanently remove the user — only runs after the confirm dialog.
   * Calls the backend DELETE /users/:id route.
   */
  const handleDelete = async () => {
    if (!userToDelete) return

    const userBeingDeleted = userToDelete

    console.log(`[admin-users] Deleting user: ${userBeingDeleted.email}`)

    setUsers((previous) => previous.filter((item) => item.id !== userBeingDeleted.id))
    setUserToDelete(null)

    try {
      const result = await deleteUser(userBeingDeleted.id)
      console.log("[admin-users] Delete response:", result)

      if (result?.success === false) {
        console.error("[admin-users] Backend rejected the change:", result)
        toast.add({
          title: "Delete failed",
          description: result?.message ?? "The backend rejected the request.",
          type: "error",
        })
        return
      }

      toast.add({
        title: "User deleted",
        description: `${userBeingDeleted.name} has been removed.`,
        type: "success",
      })
    } catch (error) {
      console.log(error)
      toast.add({
        title: "Delete failed",
        description: `Deleting ${userBeingDeleted.name} failed`,
        type: "error",
      })
    }
  }

  /** Export exactly what is on screen (search + role filter applied) to CSV. */
  const handleExport = () => {
    console.log(`[admin-users] Exporting ${filteredUsers.length} users to CSV`)

    if (filteredUsers.length === 0) {
      toast.add({
        title: "Nothing to export",
        description: "No users match the current filters.",
        type: "error",
      })
      return
    }

    const header = ["Name", "Email", "Role", "Join Date", "Status"]
    const rows = filteredUsers.map((user) => [
      user.name,
      user.email,
      resolveUserRole(user.role),
      formatDate(user.createdAt),
      user.banned ? "Suspended" : "Active",
    ])

    // Wrap every cell in quotes so commas inside names/emails can't break the CSV
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
      .join("\n")

    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
    const link = document.createElement("a")
    link.href = url
    link.download = "hireloop-users.csv"
    link.click()
    URL.revokeObjectURL(url)

    toast.add({
      title: "Export ready",
      description: `${filteredUsers.length} users exported to hireloop-users.csv.`,
      type: "success",
    })
  }

  /** True for the signed-in admin's own row. */
  const isSelf = (user: AdminUser) => user.id === myId

  /** The Suspend/Activate + Delete buttons, reused by the table and mobile cards. */
  const RowActions = ({ user }: { user: AdminUser }) => {
    const locked = isSelf(user)

    return (
      <div className="flex flex-wrap items-center justify-end gap-1">
        <UserRoleSelect
          role={user.role}
          disabled={locked}
          onChange={(next) => handleRoleChange(user, next)}
        />

        <Button
          variant="ghost"
          size="sm"
          disabled={locked}
          title={locked ? "You can't suspend your own account" : undefined}
          onClick={() => handleToggleSuspension(user)}
          className={cn(
            "cursor-pointer",
            user.banned
              ? "text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
              : "text-red-400 hover:bg-red-500/10 hover:text-red-300"
          )}
        >
          {user.banned ? <UserCheck className="size-3.5" /> : <Ban className="size-3.5" />}
          {user.banned ? "Activate" : "Suspend"}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          disabled={locked}
          title={locked ? "You can't delete your own account" : undefined}
          aria-label={`Delete ${user.email}`}
          onClick={() => setUserToDelete(user)}
          className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl px-4 py-6 md:px-8 md:py-8">
      {/* ── Header: title + role filter + export ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">User Management</h1>
          <p className="mt-1 text-muted-foreground">
            Review, filter, and manage platform access for all users.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filter the table by role (same values as the role toggle) */}
          <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as RoleFilter)}>
            <SelectTrigger className="h-9 w-36 rounded-lg text-sm">
              <SelectValue className="capitalize">
                {roleFilter === "all" ? "All Roles" : roleFilter}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {USER_ROLES.map((role) => (
                <SelectItem key={role} value={role} className="capitalize">
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" className="cursor-pointer" onClick={handleExport}>
            <Download className="size-4" />
            Export List
          </Button>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <stat.icon className="size-4 shrink-0 text-brand" />
            </div>
            <p className="mt-2 text-2xl font-bold">{loadFailed ? "—" : stat.value}</p>
            <p className={cn("mt-1 text-xs", stat.detailClass)}>
              {loadFailed ? "No data" : stat.detail}
            </p>
          </div>
        ))}
      </div>

      {/* ── Search ── */}
      <div className="relative mt-6 max-w-md">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by email..."
          aria-label="Search users by email"
          className="h-10 pl-9"
        />
      </div>

      {/* ── User list (states + table + mobile cards) ── */}
      {loadFailed ? (
        // The server couldn't list users — almost always a permissions issue.
        <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-10 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-500/10">
            <ShieldCheck className="size-6 text-red-400" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">Couldn&apos;t load users</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            This list is served by better-auth&apos;s admin API. Make sure the account
            you&apos;re signed in with has the <span className="text-foreground">admin</span> role,
            then refresh the page.
          </p>
        </div>
      ) : filteredUsers.length === 0 ? (
        // Nobody matched — either the platform is empty or the filters hide everyone.
        <div className="mt-6 rounded-2xl border border-border bg-card p-10 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand/15">
            <Users className="size-6 text-brand" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">
            {users.length === 0 ? "No users yet" : "No users match your filters"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {users.length === 0
              ? "Users will appear here as people sign up."
              : "Try a different email or role filter."}
          </p>
        </div>
      ) : (
        <>
          {/* ── Desktop: table ── */}
          <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-border bg-card md:block">
            <Table className="w-full [&_td]:py-3.5 [&_td:first-child]:pl-5 [&_td:last-child]:pr-5 [&_th]:h-11 [&_th]:bg-white/2 [&_th]:text-[11px] [&_th]:tracking-wider [&_th]:text-muted-foreground [&_th]:uppercase [&_th:first-child]:pl-5 [&_th:last-child]:pr-5">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>User Name</TableHead>
                  <TableHead>Email Address</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-border/60 hover:bg-muted/40">
                    {/* Avatar + name */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9">
                          <AvatarImage src={user.image ?? undefined} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex min-w-0 items-center gap-2">
                          <p className="truncate text-sm font-semibold">{user.name}</p>
                          {isSelf(user) && (
                            <span className="rounded-full border border-brand/30 bg-brand/15 px-1.5 py-0.5 text-[10px] font-semibold text-[#a29dff]">
                              You
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="max-w-55 truncate text-sm text-muted-foreground">
                      {user.email}
                    </TableCell>

                    <TableCell>
                      <UserRoleBadge role={user.role} />
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-sm">
                      {formatDate(user.createdAt)}
                    </TableCell>

                    <TableCell>
                      <UserStatusBadge banned={user.banned} />
                    </TableCell>

                    <TableCell className="text-right">
                      <RowActions user={user} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* ── Mobile: one card per user ── */}
          <div className="mt-4 space-y-3 md:hidden">
            {filteredUsers.map((user) => (
              <div key={user.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage src={user.image ?? undefined} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold">{user.name}</p>
                      {isSelf(user) && (
                        <span className="rounded-full border border-brand/30 bg-brand/15 px-1.5 py-0.5 text-[10px] font-semibold text-[#a29dff]">
                          You
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                {/* Role + status + join date */}
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
                  <UserRoleBadge role={user.role} />
                  <UserStatusBadge banned={user.banned} />
                  <span className="text-xs text-muted-foreground">
                    Joined {formatDate(user.createdAt)}
                  </span>
                </div>

                {/* The same actions as the desktop table row */}
                <div className="mt-3 border-t border-border pt-2">
                  <RowActions user={user} />
                </div>
              </div>
            ))}
          </div>

          {/* How many rows are on screen — handy when filtering */}
          <p className="mt-4 text-xs text-muted-foreground">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </>
      )}

      {/* Confirm-before-delete popup */}
      <DeleteUserDialog
        user={userToDelete}
        onOpenChange={(open) => !open && setUserToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
