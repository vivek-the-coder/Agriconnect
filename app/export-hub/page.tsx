import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ExportHub } from "@/components/export-hub"

export default function ExportHubPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <ExportHub />
      </main>
      <Footer />
    </div>
  )
}
