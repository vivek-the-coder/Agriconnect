import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CommunityForum } from "@/components/community-forum"

export default function CommunityPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <CommunityForum />
      </main>
      <Footer />
    </div>
  )
}
