import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { UsedEquipmentMarketplace } from "@/components/used-equipment-marketplace"

export default function UsedEquipmentPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <UsedEquipmentMarketplace />
      </main>
      <Footer />
    </div>
  )
}
