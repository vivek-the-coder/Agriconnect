import { Languages, Handshake, Zap } from "lucide-react"

const benefits = [
  {
    icon: Languages,
    title: "Language Barrier Solution",
    description: "Multi-language support to connect farmers across different regions and languages.",
    image: "/diverse-farmers-speaking-different-languages-multi.png",
  },
  {
    icon: Handshake,
    title: "Direct Farmer-to-Exporter Deals",
    description: "Cut out middlemen and connect directly with global exporters for better profits.",
    image: "/farmer-and-exporter-shaking-hands-direct-business-.png",
  },
  {
    icon: Zap,
    title: "Easy Access to Tools, Seeds, & Knowledge",
    description: "One-stop platform for all your agricultural needs, from equipment to expertise.",
    image: "/modern-farming-tools-seeds-and-agricultural-knowle.png",
  },
]

export function WhyAgriConnect() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Why Choose AgriConnect?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're revolutionizing agriculture by connecting farmers with opportunities, technology, and global markets.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {benefits.map((benefit) => {
            const Icon = benefit.icon
            return (
              <div key={benefit.title} className="text-center space-y-6">
                <div className="relative mx-auto w-full h-48 rounded-lg overflow-hidden mb-6">
                  <img
                    src={benefit.image || "/placeholder.svg"}
                    alt={benefit.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-foreground">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
