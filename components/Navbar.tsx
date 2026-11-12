"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, LogOut, Menu, User as UserIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { signOut, useSession } from "@/lib/auth-client"

const navLinks = [
  { href: "/browse-jobs", label: "Browse Jobs" },
  { href: "/company", label: "Company" },
  { href: "/pricing", label: "Pricing" },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()

  const user = session?.user

  // Generate fallback initials
  const initials = user?.name
    ? user.name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
    : "HL"

  const handleSignOut = async () => {
    await signOut()
    router.refresh()
  }

  return (
    <header className="absolute top-4 left-1/2 z-50 w-[min(1200px,94vw)] -translate-x-1/2">
      <div className="flex h-16 w-full items-center justify-between rounded-[14px] border border-white/6 bg-[rgba(20,20,22,0.6)] px-4 backdrop-blur-md sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          aria-label="HireLoop home"
          className="shrink-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          <Image
            src="/logo.png"
            alt="HireLoop"
            width={794}
            height={224}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Main navigation"
          className="hidden h-full items-center gap-6 pl-8 lg:flex"
        >
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => {
              const active = pathname?.startsWith(link.href)
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "text-sm tracking-[-0.2px] whitespace-nowrap text-white/80 transition-colors hover:text-white",
                      active && "font-semibold text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Divider */}
          <div aria-hidden="true" className="h-5 w-px bg-white/10" />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="flex items-center gap-3 rounded-full py-1 pr-3 pl-1 transition-colors outline-none hover:bg-white/6 focus-visible:ring-2 focus-visible:ring-white/30">
                    <Avatar className="size-8 border border-white/20">
                      {user.image && (
                        <AvatarImage
                          src={user.image}
                          alt={user.name || "User"}
                        />
                      )}
                      <AvatarFallback className="bg-brand text-xs font-semibold text-white">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-white/90">
                      {user.name}
                    </span>
                  </button>
                }
              />
              <DropdownMenuContent
                align="end"
                className="w-56 border border-white/10 bg-[#0e0e12]/95 p-1 text-white shadow-2xl backdrop-blur-xl"
              >
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="truncate text-xs text-white/50">{user.email}</p>
                </div>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  render={<Link href={user.role ? `/dashboard/${user.role}` : "/dashboard"} />}
                  className="cursor-pointer focus:bg-white/10 focus:text-white"
                >
                  <LayoutDashboard className="mr-2 size-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-300"
                >
                  <LogOut className="mr-2 size-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  className="h-10 rounded-lg px-4 text-sm font-semibold text-white/90 hover:bg-white/5 hover:text-white"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="h-10 rounded-lg border border-white/10 bg-brand px-5 font-instrument text-sm font-medium text-white hover:bg-brand/85">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open navigation menu"
                className="size-9 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 lg:hidden"
              >
                <Menu className="size-5" />
              </Button>
            }
          />
          <SheetContent
            side="right"
            className="flex flex-col justify-between border-l border-white/10 bg-[#0c0c0e]/95 p-6 backdrop-blur-xl"
          >
            <div>
              <SheetHeader className="text-left">
                <SheetTitle>
                  <Link
                    href="/"
                    aria-label="HireLoop home"
                    className="inline-block"
                  >
                    <Image
                      src="/logo.png"
                      alt="HireLoop"
                      width={794}
                      height={224}
                      className="h-8 w-auto"
                    />
                  </Link>
                </SheetTitle>
              </SheetHeader>

              {user && (
                <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/10 bg-white/4 p-3">
                  <Avatar className="size-10 border border-white/20">
                    {user.image && (
                      <AvatarImage src={user.image} alt={user.name || "User"} />
                    )}
                    <AvatarFallback className="bg-brand text-sm font-semibold text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-white/50">
                      {user.email}
                    </p>
                  </div>
                </div>
              )}

              <nav aria-label="Mobile navigation" className="mt-6">
                <ul className="flex flex-col gap-2">
                  {navLinks.map((link) => {
                    const active = pathname?.startsWith(link.href)
                    return (
                      <li key={link.href}>
                        <SheetClose
                          nativeButton={false}
                          render={
                            <Link
                              href={link.href}
                              aria-current={active ? "page" : undefined}
                              className={cn(
                                "flex items-center rounded-lg px-3 py-2.5 text-base text-white/80 transition-colors hover:bg-white/5 hover:text-white",
                                active && "bg-white/10 font-semibold text-white"
                              )}
                            >
                              {link.label}
                            </Link>
                          }
                        />
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </div>

            <SheetFooter className="flex flex-col gap-2 border-t border-white/10 pt-4">
              {user ? (
                <>
                  <Link href={`/dashboard/${user?.role}`}>
                    <Button variant="outline" className="h-11 w-full rounded-xl border-white/15 bg-white/5 text-base font-semibold text-white hover:bg-white/10">
                      Dashboard</Button>
                  </Link>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    className="h-11 w-full rounded-xl border-red-500/20 bg-red-500/10 text-base font-semibold text-red-400 hover:bg-red-500/20 hover:text-red-300"
                  >
                    <LogOut className="mr-2 size-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <SheetClose
                    nativeButton={false}
                    render={
                      <Link href="/sign-in" className="w-full">
                        <Button
                          variant="outline"
                          className="h-11 w-full rounded-xl border-white/15 bg-white/5 text-base font-semibold text-white hover:bg-white/10"
                        >
                          Sign In
                        </Button>
                      </Link>
                    }
                  />
                  <SheetClose
                    nativeButton={false}
                    render={
                      <Link href="/sign-up" className="w-full">
                        <Button className="h-11 w-full rounded-xl bg-brand text-base font-medium text-white hover:bg-brand/85">
                          Sign up
                        </Button>
                      </Link>
                    }
                  />
                </>
              )}
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
