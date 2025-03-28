import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { RoomsSection } from "@/components/rooms-section"
import { DiningSection } from "@/components/dining-section"
import { SpaSection } from "@/components/spa-section"
import { MeetingsSection } from "@/components/meetings-section"
import { AboutSection } from "@/components/about-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <RoomsSection />
      <DiningSection />
      <SpaSection />
      <MeetingsSection />
      <AboutSection />
      <Footer />
    </main>
  )
}

