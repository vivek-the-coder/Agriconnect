import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { SeedsShop } from "@/components/seeds-shop"

export default function SeedsPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <SeedsShop />
      </main>
      <Footer />
    </div>
  )
}
