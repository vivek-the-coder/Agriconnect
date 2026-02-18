import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ToolsMarketplace } from "@/components/tools-marketplace"

export default function ToolsPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <ToolsMarketplace />
      </main>
      <Footer />
    </div>
  )
}
