import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Globe } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary/5 to-secondary/5 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Connecting Farmers to <span className="text-primary">Global Markets</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                One platform for schemes, exports, community, and modern farming tools. Empowering farmers with
                technology and global connections.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8 py-6">
                <Users className="mr-2 h-5 w-5" />
                Join as Farmer
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
                <Globe className="mr-2 h-5 w-5" />
                Join as Exporter
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <img
              src="/modern-farmers-using-technology-with-tractors-and-.png"
              alt="Farmers and exporters connecting"
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
