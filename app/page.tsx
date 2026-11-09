import { Hero } from "@/components/Hero"
import { Navbar } from "@/components/Navbar"
import { FeaturedJobs } from "@/components/FeaturedJobs"
import { Features } from "@/components/Features"
import { Pricing } from "@/components/Pricing"
import { CallToAction } from "@/components/CallToAction"
import { Footer } from "@/components/Footer"

export default function Page() {
  return (
    <main className="relative min-h-screen bg-black">
      <Navbar />
      <Hero />
      <FeaturedJobs />
      <Features />
      <Pricing />
      <CallToAction />
      <Footer />
    </main>
  )
}


