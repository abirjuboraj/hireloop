'use client'

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Banknote,
  Bookmark,
  Briefcase,
  Building2,
  CirclePlus,
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
import { cn } from "@/lib/utils"
import { resolveUserRole, type MenuItem, type UserRole } from "@/lib/types"

const menuItemsByRole: Record<UserRole, MenuItem[]> = {
  seeker: [
    { name: "Dashboard", url: "/dashboard/seeker", icon: LayoutGrid },
    { name: "Jobs", url: "/dashboard/seeker/jobs", icon: Briefcase },
    { name: "Saved Jobs", url: "/dashboard/seeker/saved-jobs", icon: Bookmark },
    { name: "Applications", url: "/dashboard/seeker/applications", icon: FileText },
    { name: "Billing", url: "/dashboard/seeker/billing", icon: Banknote },
    { name: "Settings", url: "/dashboard/seeker/settings", icon: Settings },
  ],
  recruiter: [
    { name: "Dashboard", url: "/dashboard/recruiter", icon: LayoutGrid },
    { name: "Add Job", url: "/dashboard/recruiter/jobs/new", icon: CirclePlus },
    { name: "Manage Jobs", url: "/dashboard/recruiter/jobs", icon: Briefcase },
    { name: "Applications", url: "/dashboard/recruiter/applications", icon: FileText },
    { name: "Settings", url: "/dashboard/recruiter/settings", icon: Settings },
  ],
  admin: [
    { name: "Dashboard", url: "/dashboard/admin", icon: LayoutGrid },
    { name: "Users", url: "/dashboard/admin/users", icon: Users },
    { name: "Companies", url: "/dashboard/admin/companies", icon: Building2 },
    { name: "Jobs", url: "/dashboard/admin/jobs", icon: Briefcase },
    { name: "Payments", url: "/dashboard/admin/payments", icon: Banknote },
    { name: "Settings", url: "/dashboard/admin/settings", icon: Settings },
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

  // Only the longest matching URL is active, so nested pages (e.g. jobs/new)
  // don't also highlight Dashboard / Manage Jobs
  const activeUrl = [...menuItems]
    .filter((item) => pathname === item.url || pathname.startsWith(item.url + "/"))
    .sort((a, b) => b.url.length - a.url.length)[0]?.url
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
              const isActive = item.url === activeUrl

              return (
                <SidebarMenuItem key={item.url} className="relative">
                  {/* Brand accent bar */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-1/2 left-0 h-4 w-[3px] -translate-y-1/2 rounded-full bg-brand transition-opacity duration-200",
                      isActive ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={item.name}
                    render={<Link href={item.url} />}
                    className={cn(
                      isActive &&
                        "hover:bg-brand/20 data-active:bg-brand/15 data-active:text-foreground [&>svg]:text-brand"
                    )}
                  >
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
        <Button variant="ghost" size="lg" className="justify-start text-muted-foreground hover:text-foreground" onClick={() => signOut()}>
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
