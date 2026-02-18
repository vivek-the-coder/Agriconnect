import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturesGrid } from "@/components/features-grid"
import { WhyAgriConnect } from "@/components/why-agriconnect"
import { Testimonials } from "@/components/testimonials"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <FeaturesGrid />
        <WhyAgriConnect />
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}
