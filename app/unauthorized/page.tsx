import Link from "next/link"
import { ShieldAlert, ArrowLeft, Home, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function UnauthorizedPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#000] px-4 pt-28 pb-12 sm:pt-32">
      {/* Background radial glow matching the site theme */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 50% 40% at 50% 20%, rgba(92,83,254,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 60% 50% at 50% 100%, rgba(20,20,25,0.8) 0%, transparent 100%)
          `,
        }}
      />

      <div className="relative z-10 w-full max-w-md text-center">
        {/* Glass Card */}
        <div className="rounded-2xl border border-white/10 bg-[#0e0e12]/80 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          {/* Icon Badge */}
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-brand/30 bg-brand/10 text-brand shadow-[0_0_30px_rgba(92,83,254,0.3)]">
            <ShieldAlert className="size-8" />
          </div>

          {/* Error Tag */}
          <span className="mt-6 inline-block rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-red-400">
            403 &bull; Access Denied
          </span>

          {/* Heading */}
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Unauthorized Access
          </h1>

          {/* Description */}
          <p className="mt-3 text-sm leading-relaxed text-white/60">
            You do not have the required permissions to view this page. If you believe this is a mistake, please check your account role or sign in with another account.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full rounded-xl border-white/15 bg-white/[0.04] px-5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/10"
              >
                <Home className="mr-2 size-4" />
                Go to Home
              </Button>
            </Link>

            <Link href="/sign-in" className="w-full sm:w-auto">
              <Button className="w-full rounded-xl bg-brand px-5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-brand/90">
                <LogIn className="mr-2 size-4" />
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
