import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { SchemesDirectory } from "@/components/schemes-directory"

export default function SchemesPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <SchemesDirectory />
      </main>
      <Footer />
    </div>
  )
}
