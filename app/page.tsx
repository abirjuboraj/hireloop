import { Hero } from "@/components/Hero"
import { Navbar } from "@/components/Navbar"

export default function Page() {
  return (
    <main className="relative min-h-screen bg-[#000]">
      <Navbar />
      <Hero />
    </main>
  )
}
