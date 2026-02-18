import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Globe, Users, Wrench, Heading as Seedling, ShoppingCart, ArrowRight } from "lucide-react"

const features = [
  {
    icon: FileText,
    title: "Government Schemes",
    description: "Latest updates & eligibility details for agricultural schemes and subsidies.",
    href: "/schemes",
    image: "/government-building-with-agricultural-documents-an.png",
  },
  {
    icon: Globe,
    title: "Export Hub",
    description: "Post crops, connect with exporters, form joint ventures for global markets.",
    href: "/export-hub",
    image: "/cargo-ships-and-containers-with-agricultural-produ.png",
  },
  {
    icon: Users,
    title: "Community",
    description: "Farmers discuss problems & solutions in our supportive community forum.",
    href: "/community",
    image: "/farmers-discussing-and-sharing-knowledge-in-rural-.png",
  },
  {
    icon: Wrench,
    title: "Tools & Machines",
    description: "Rent, buy or sell modern equipment to enhance your farming operations.",
    href: "/tools",
    image: "/modern-farming-equipment-tractors-and-agricultural.png",
  },
  {
    icon: Seedling,
    title: "Seeds & Tissue Culture",
    description: "High-quality seeds & modern plant solutions for better crop yields.",
    href: "/seeds",
    image: "/high-quality-seeds-and-tissue-culture-plants-in-la.png",
  },
  {
    icon: ShoppingCart,
    title: "Second-Hand Shop",
    description: "Marketplace for used farming tools and equipment at affordable prices.",
    href: "/used-equipment",
    image: "/used-farming-equipment-and-tools-in-marketplace-se.png",
  },
]

export function FeaturesGrid() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Everything You Need in One Platform</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From government schemes to global exports, we provide comprehensive tools and resources for modern
            agriculture.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.title}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={feature.image || "/placeholder.svg"}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed mb-4">{feature.description}</CardDescription>
                  <div className="flex items-center text-primary group-hover:text-primary/80 transition-colors">
                    <span className="text-sm font-medium">Learn more</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
