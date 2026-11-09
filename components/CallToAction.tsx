import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export function CallToAction() {
  return (
    <section className="relative overflow-hidden bg-[#000] mt-16 sm:mt-24 lg:mt-32 pt-28 pb-36 sm:pt-36 sm:pb-44 lg:pt-44 lg:pb-52">
      {/* 
        LAYER 1: Soft broad bluish-purple ambient glow spread over the globe dome 
        Matches the glowing radial backdrop in the Figma screenshot
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 flex justify-center"
      >
        <div
          className="h-[550px] w-full max-w-[1200px] select-none"
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at 50% 25%, rgba(67, 56, 242, 0.45) 0%, rgba(55, 48, 180, 0.25) 45%, rgba(15, 12, 60, 0.1) 70%, transparent 85%)",
          }}
        />
      </div>

      {/* 
        LAYER 2: Focused bright blue glow directly behind the title
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-16 -translate-x-1/2 select-none sm:top-24 lg:top-28"
      >
        <div
          className="h-[320px] w-[650px] max-w-[90vw] rounded-full blur-[80px]"
          style={{
            background:
              "radial-gradient(circle, rgba(92, 83, 254, 0.35) 0%, rgba(67, 56, 242, 0.2) 60%, transparent 80%)",
          }}
        />
      </div>

      {/* 
        LAYER 3: Background radial wireframe grid dome image
      */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
        <div className="relative h-[650px] w-full max-w-[1440px] select-none sm:h-[800px] lg:h-[964px]">
          <Image
            src="/images/cta-bg.png"
            alt="Radial wireframe background"
            fill
            priority
            className="object-cover object-top select-none mix-blend-screen opacity-95"
          />
          {/* Subtle bottom fade to blend smoothly into pure black */}
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#000] via-[#000]/70 to-transparent" />
        </div>
      </div>

      {/* 
        LAYER 4: Foreground Content
      */}
      <div className="relative z-10 mx-auto w-[min(1200px,94vw)]">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] sm:text-5xl md:text-6xl md:leading-[1.15]">
            Your next role is
            <br />
            already looking for you
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/80 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] sm:text-base md:text-lg">
            Build a profile in three minutes. The matches start arriving tomorrow
            morning.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link href="/sign-up" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="h-12 w-full rounded-xl bg-white px-7 text-sm font-semibold text-black shadow-lg transition-all hover:bg-white/90 sm:w-auto"
              >
                Create a free account
              </Button>
            </Link>
            <Link href="/pricing" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-full rounded-xl border-white/20 bg-white/[0.06] px-7 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-white/35 hover:bg-white/15 sm:w-auto"
              >
                View pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
