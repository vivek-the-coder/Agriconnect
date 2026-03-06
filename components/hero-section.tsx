import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Globe } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary/5 to-secondary/5 py-12 md:py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="space-y-4 max-w-2xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] tracking-tight">
                Connecting Farmers to <span className="bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">Global Markets</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl">
                One platform for schemes, exports, community, and modern farming tools. Empowering farmers with
                technology and global connections.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
              <Button size="lg" className="text-lg px-8 py-7 md:py-6 h-auto shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                <Users className="mr-2 h-5 w-5" />
                Join as Farmer
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-7 md:py-6 h-auto bg-transparent hover:bg-muted/50 transition-all">
                <Globe className="mr-2 h-5 w-5" />
                Join as Exporter
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative group lg:mt-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <Image
              src="/modern-farmers-using-technology-with-tractors-and-.png"
              alt="Farmers and exporters connecting"
              width={800}
              height={600}
              className="relative w-full h-auto rounded-2xl shadow-2xl border border-white/10"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
