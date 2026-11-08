'use client'

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Banknote,
  Bookmark,
  Briefcase,
  Building2,
  FileText,
  LayoutGrid,
  LogOut,
  Settings,
  Users,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { signOut, useSession } from "@/lib/auth-client"
import { resolveUserRole, type MenuItem, type UserRole } from "@/lib/types"

const menuItemsByRole: Record<UserRole, MenuItem[]> = {
  seeker: [
    { name: "Dashboard", url: "/dashboard", icon: LayoutGrid },
    { name: "Jobs", url: "/dashboard/jobs", icon: Briefcase },
    { name: "Saved Jobs", url: "/dashboard/saved-jobs", icon: Bookmark },
    { name: "Applications", url: "/dashboard/applications", icon: FileText },
    { name: "Billing", url: "/dashboard/billing", icon: Banknote },
    { name: "Settings", url: "/dashboard/settings", icon: Settings },
  ],
  recruiter: [
    { name: "Dashboard", url: "/dashboard", icon: LayoutGrid },
    { name: "Manage Jobs", url: "/dashboard/manage-jobs", icon: Briefcase },
    { name: "Applications", url: "/dashboard/applications", icon: FileText },
    { name: "Settings", url: "/dashboard/settings", icon: Settings },
  ],
  admin: [
    { name: "Dashboard", url: "/dashboard", icon: LayoutGrid },
    { name: "Users", url: "/dashboard/users", icon: Users },
    { name: "Companies", url: "/dashboard/companies", icon: Building2 },
    { name: "Jobs", url: "/dashboard/jobs", icon: Briefcase },
    { name: "Payments", url: "/dashboard/payments", icon: Banknote },
    { name: "Settings", url: "/dashboard/settings", icon: Settings },
  ],
}

const roleLabels: Record<UserRole, { title: string; subtitle: string }> = {
  seeker: { title: "Seeker Portal", subtitle: "Professional Tier" },
  recruiter: { title: "Recruiter", subtitle: "Recruiter" },
  admin: { title: "Admin", subtitle: "Super Admin" },
}

export default function DashboardSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const user = session?.user
  const role = resolveUserRole(user?.role)
  const menuItems = menuItemsByRole[role]
  const cardTitle = role === "seeker" ? roleLabels.seeker.title : (user?.name ?? roleLabels[role].title)
  const showCardInFooter = role === "admin"

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="mt-2 px-3">
          <Image src="/logo.png" alt="HireLoop" width={120} height={34} className="mx-auto" />
        </Link>
        {!showCardInFooter && <PortalCard title={cardTitle} subtitle={roleLabels[role].subtitle} image={user?.image} />}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => {
              const isActive =
                item.url === "/dashboard" ? pathname === item.url : pathname.startsWith(item.url)

              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton isActive={isActive} tooltip={item.name} render={<Link href={item.url} />}>
                    <item.icon />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {showCardInFooter && <PortalCard title={cardTitle} subtitle={roleLabels[role].subtitle} image={user?.image} />}
        {role === "seeker" && (
          <Button size="lg" className="w-full" nativeButton={false} render={<Link href="/dashboard/post-resume" />}>
            Post Resume
          </Button>
        )}
        <Button variant="destructive" size="lg" className="justify-start" onClick={() => signOut()}>
          <LogOut />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}

function PortalCard({
  title,
  subtitle,
  image,
}: {
  title: string
  subtitle: string
  image?: string | null
}) {
  return (
    <div className="mx-3 mt-4 flex items-center gap-3 rounded-xl border border-border/60 bg-white/3 p-3">
      <Avatar className="size-10">
        <AvatarImage src={image ?? undefined} alt={title} />
        <AvatarFallback>{title.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  )
}
