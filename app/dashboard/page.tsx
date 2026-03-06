import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { DashboardContent } from "@/components/dashboard-content"

export default function DashboardPage() {
    return (
        <div className="min-h-screen">
            <Navigation />
            <main>
                <DashboardContent />
            </main>
            <Footer />
        </div>
    )
}
