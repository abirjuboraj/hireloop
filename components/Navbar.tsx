"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
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

const navLinks = [
  { href: "/browse-jobs", label: "Browse Jobs" },
  { href: "/company", label: "Company" },
  { href: "/pricing", label: "Pricing" },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="px-4 pt-6 md:px-15">
      <div className="mx-auto flex h-18.5 w-full max-w-330 items-center justify-between rounded-2xl bg-surface pr-2 pl-4 md:pl-6">
        {/* Logo */}
        <Link
          href="/"
          aria-label="HireLoop home"
          className="shrink-0 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-white/30"
        >
          <Image
            src="/logo.png"
            alt="HireLoop"
            width={794}
            height={224}
            preload
            className="h-11 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Main navigation"
          className="hidden h-full items-center gap-6 pl-8 lg:flex"
        >
          <ul className="flex items-center gap-10">
            {navLinks.map((link) => {
              const active = pathname?.startsWith(link.href)
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "text-base leading-[1.8] tracking-[-0.2px] whitespace-nowrap text-white underline-offset-4 transition-colors hover:underline",
                      active && "font-semibold underline"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Divider */}
          <div aria-hidden="true" className="h-6 w-px bg-divider/40" />

          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button
                variant="ghost"
                className="h-13 rounded-xl bg-transparent px-6 text-lg font-semibold text-brand shadow-[inset_0_3px_10px_rgba(255,255,255,0.2),0_2px_4px_rgba(0,0,0,0.03)] hover:bg-white/5 hover:text-brand"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/get-started">
              <Button className="h-13 rounded-xl border border-[#090A15]/10 bg-brand px-6 font-instrument text-lg font-medium text-white shadow-[inset_0_3px_10px_rgba(255,255,255,0.2),0_2px_4px_rgba(0,0,0,0.03)] hover:bg-brand/85">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open navigation menu"
                className="text-white hover:bg-white/5 hover:text-white lg:hidden"
              />
            }
          >
            <Menu className="size-7" />
            <span className="sr-only">Open navigation menu</span>
          </SheetTrigger>

          <SheetContent
            side="top"
            showCloseButton={true}
            className="rounded-b-2xl bg-surface pb-6 text-white"
          >
            <SheetHeader className="px-6 py-5">
              <SheetTitle className="sr-only">HireLoop navigation</SheetTitle>
            </SheetHeader>

            <ul className="flex flex-col divide-y divide-white/10 px-6">
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
                            "text-base leading-[1.8] tracking-[-0.2px] text-white underline-offset-4 transition-colors hover:underline",
                            active && "font-semibold underline"
                          )}
                        />
                      }
                    >
                      {link.label}
                    </SheetClose>
                  </li>
                )
              })}
            </ul>

            <SheetFooter className="mt-6 flex-col gap-3 px-6">
              <Link href="/sign-in" className="w-full">
                <Button
                  variant="ghost"
                  className="h-13 w-full rounded-xl bg-transparent px-6 text-lg font-semibold text-brand shadow-[inset_0_3px_10px_rgba(255,255,255,0.2),0_2px_4px_rgba(0,0,0,0.03)] hover:bg-white/5 hover:text-brand"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/get-started" className="w-full">
                <Button className="h-13 w-full rounded-xl border border-[#090A15]/10 bg-brand px-6 font-instrument text-lg font-medium text-white hover:bg-brand/85">
                  Get Started
                </Button>
              </Link>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
