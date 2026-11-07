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
    <header className="absolute top-4 left-1/2 z-50 w-[min(1200px,94vw)] -translate-x-1/2">
      <div className="flex h-16 w-full items-center justify-between rounded-[14px] border border-white/[0.06] bg-[rgba(20,20,22,0.6)] px-4 backdrop-blur-[12px] sm:px-6">
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
                  <Link href="/" aria-label="HireLoop home" className="inline-block">
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

              <nav aria-label="Mobile navigation" className="mt-8">
                <ul className="flex flex-col gap-2">
                  {navLinks.map((link) => {
                    const active = pathname?.startsWith(link.href)
                    return (
                      <li key={link.href}>
                        <SheetClose
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
              <SheetClose
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
                render={
                  <Link href="/sign-up" className="w-full">
                    <Button className="h-11 w-full rounded-xl bg-brand text-base font-medium text-white hover:bg-brand/85">
                      Sign up
                    </Button>
                  </Link>
                }
              />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
