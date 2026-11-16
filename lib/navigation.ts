import { Building2, Home, Search, Tag } from "lucide-react"

/**
 * Public pages shown in the top navbar (desktop + mobile) and repeated
 * inside the dashboard sidebar for every role.
 */
export const navLinks = [
  { href: "/browse-jobs", label: "Browse Jobs", icon: Search },
  { href: "/company", label: "Company", icon: Building2 },
  { href: "/pricing", label: "Pricing", icon: Tag },
]

/** Home first, then the navbar links — used by the dashboard sidebar. */
export const sidebarPublicLinks = [
  { name: "Home", url: "/", icon: Home },
  ...navLinks.map((link) => ({ name: link.label, url: link.href, icon: link.icon })),
]
