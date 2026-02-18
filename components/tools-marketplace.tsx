"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Search,
  Filter,
  ShoppingCart,
  Calendar,
  MapPin,
  Star,
  Truck,
  Wrench,
  Zap,
  Droplets,
  Scissors,
  Phone,
  Mail,
  Clock,
} from "lucide-react"

// Mock data for tools and equipment
const toolsData = [
  {
    id: 1,
    name: "John Deere 5050D Tractor",
    category: "Tractors",
    type: "new",
    price: 850000,
    rentalPrice: 2500,
    image: "/tractor-john-deere.png",
    description: "50 HP tractor perfect for medium-scale farming operations with excellent fuel efficiency.",
    specifications: {
      power: "50 HP",
      fuelType: "Diesel",
      transmission: "Manual",
      warranty: "3 years",
    },
    vendor: "AgriTech Solutions",
    location: "Punjab",
    rating: 4.8,
    reviews: 24,
    availability: "In Stock",
    features: ["Power Steering", "Hydraulic Lift", "PTO", "4WD"],
  },
  {
    id: 2,
    name: "Mahindra Rotavator 7ft",
    category: "Tillage Equipment",
    type: "new",
    price: 85000,
    rentalPrice: 800,
    image: "/rotavator-mahindra.png",
    description: "Heavy-duty rotavator for soil preparation and weed management.",
    specifications: {
      width: "7 feet",
      blades: "36 L-shaped",
      weight: "450 kg",
      warranty: "2 years",
    },
    vendor: "Farm Equipment Co.",
    location: "Haryana",
    rating: 4.6,
    reviews: 18,
    availability: "In Stock",
    features: ["Adjustable Depth", "Heavy Duty Gearbox", "Side Drive"],
  },
  {
    id: 3,
    name: "Netafim Drip Irrigation Kit",
    category: "Irrigation",
    type: "new",
    price: 45000,
    rentalPrice: 300,
    image: "/drip-irrigation-kit.png",
    description: "Complete drip irrigation system for 1-acre coverage with precision water delivery.",
    specifications: {
      coverage: "1 acre",
      dripper: "2 LPH",
      pipes: "16mm LDPE",
      warranty: "5 years",
    },
    vendor: "Irrigation Systems Ltd.",
    location: "Maharashtra",
    rating: 4.9,
    reviews: 32,
    availability: "In Stock",
    features: ["Water Efficient", "Easy Installation", "Clog Resistant"],
  },
  {
    id: 4,
    name: "Stihl Brush Cutter FS 120",
    category: "Cutting Tools",
    type: "new",
    price: 28000,
    rentalPrice: 400,
    image: "/brush-cutter-stihl.png",
    description: "Professional brush cutter for clearing weeds and small bushes.",
    specifications: {
      engine: "30.8 cc",
      power: "1.4 kW",
      weight: "5.1 kg",
      warranty: "2 years",
    },
    vendor: "Power Tools India",
    location: "Karnataka",
    rating: 4.7,
    reviews: 15,
    availability: "Limited Stock",
    features: ["Anti-Vibration", "Easy Start", "Bike Handle"],
  },
  {
    id: 5,
    name: "Kubota Combine Harvester",
    category: "Harvesting",
    type: "new",
    price: 1200000,
    rentalPrice: 5000,
    image: "/combine-harvester-kubota.png",
    description: "Efficient combine harvester for wheat, rice, and other grain crops.",
    specifications: {
      cuttingWidth: "3.2 meters",
      engine: "75 HP",
      grainTank: "1200 liters",
      warranty: "3 years",
    },
    vendor: "Kubota Agricultural",
    location: "Punjab",
    rating: 4.9,
    reviews: 28,
    availability: "Pre-Order",
    features: ["GPS Ready", "Auto Steering", "Grain Loss Monitor"],
  },
  {
    id: 6,
    name: "Solar Water Pump 5HP",
    category: "Irrigation",
    type: "new",
    price: 125000,
    rentalPrice: 1000,
    image: "/solar-water-pump.png",
    description: "Solar-powered water pump system for sustainable irrigation.",
    specifications: {
      power: "5 HP",
      head: "50 meters",
      flow: "25000 LPH",
      warranty: "5 years",
    },
    vendor: "Solar Agri Tech",
    location: "Rajasthan",
    rating: 4.8,
    reviews: 21,
    availability: "In Stock",
    features: ["Solar Powered", "Remote Monitoring", "Weather Resistant"],
  },
]

const categories = [
  { name: "All Categories", count: 45 },
  { name: "Tractors", count: 12 },
  { name: "Tillage Equipment", count: 8 },
  { name: "Irrigation", count: 15 },
  { name: "Harvesting", count: 6 },
  { name: "Cutting Tools", count: 4 },
]

export function ToolsMarketplace() {
  const [activeTab, setActiveTab] = useState("browse")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [priceRange, setPriceRange] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [selectedTool, setSelectedTool] = useState<(typeof toolsData)[0] | null>(null)

  const filteredTools = toolsData.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All Categories" || tool.category === selectedCategory
    const matchesPrice =
      priceRange === "all" ||
      (priceRange === "under-50k" && tool.price < 50000) ||
      (priceRange === "50k-200k" && tool.price >= 50000 && tool.price < 200000) ||
      (priceRange === "200k-500k" && tool.price >= 200000 && tool.price < 500000) ||
      (priceRange === "above-500k" && tool.price >= 500000)

    return matchesSearch && matchesCategory && matchesPrice
  })

  const sortedTools = [...filteredTools].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price
    if (sortBy === "price-high") return b.price - a.price
    if (sortBy === "rating") return b.rating - a.rating
    return 0 // featured
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Tractors":
        return Truck
      case "Tillage Equipment":
        return Wrench
      case "Irrigation":
        return Droplets
      case "Cutting Tools":
        return Scissors
      case "Harvesting":
        return Zap
      default:
        return Wrench
    }
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Tools & Equipment Marketplace</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover modern farming tools and equipment. Buy new or rent by the day to enhance your farming operations.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browse">Browse Equipment</TabsTrigger>
            <TabsTrigger value="rent">Rental Services</TabsTrigger>
          </TabsList>

          {/* Browse Equipment Tab */}
          <TabsContent value="browse" className="space-y-6">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Sidebar Filters */}
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Filters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Search */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Search</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search equipment..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.name} value={category.name}>
                              {category.name} ({category.count})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Price Range</label>
                      <Select value={priceRange} onValueChange={setPriceRange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Prices</SelectItem>
                          <SelectItem value="under-50k">Under ₹50,000</SelectItem>
                          <SelectItem value="50k-200k">₹50,000 - ₹2,00,000</SelectItem>
                          <SelectItem value="200k-500k">₹2,00,000 - ₹5,00,000</SelectItem>
                          <SelectItem value="above-500k">Above ₹5,00,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sort */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sort By</label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="featured">Featured</SelectItem>
                          <SelectItem value="price-low">Price: Low to High</SelectItem>
                          <SelectItem value="price-high">Price: High to Low</SelectItem>
                          <SelectItem value="rating">Highest Rated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Products Grid */}
              <div className="lg:col-span-3">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Equipment ({sortedTools.length})</h2>
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedTools.map((tool) => {
                    const CategoryIcon = getCategoryIcon(tool.category)
                    return (
                      <Card key={tool.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                        <div className="relative">
                          <img
                            src={tool.image || "/placeholder.svg"}
                            alt={tool.name}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-primary/90 text-primary-foreground">
                              <CategoryIcon className="h-3 w-3 mr-1" />
                              {tool.category}
                            </Badge>
                          </div>
                          <div className="absolute top-3 right-3">
                            <Badge
                              variant={
                                tool.availability === "In Stock"
                                  ? "default"
                                  : tool.availability === "Limited Stock"
                                    ? "secondary"
                                    : "outline"
                              }
                              className={
                                tool.availability === "In Stock"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : tool.availability === "Limited Stock"
                                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                    : ""
                              }
                            >
                              {tool.availability}
                            </Badge>
                          </div>
                        </div>

                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div>
                              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                                {tool.name}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">{tool.description}</p>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < Math.floor(tool.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {tool.rating} ({tool.reviews} reviews)
                              </span>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Purchase Price:</span>
                                <span className="font-semibold text-primary">₹{tool.price.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Rental/Day:</span>
                                <span className="font-semibold text-secondary">
                                  ₹{tool.rentalPrice.toLocaleString()}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{tool.location}</span>
                              <span>•</span>
                              <span>{tool.vendor}</span>
                            </div>

                            <div className="flex gap-2 pt-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 bg-transparent"
                                    onClick={() => setSelectedTool(tool)}
                                  >
                                    View Details
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>{tool.name}</DialogTitle>
                                    <DialogDescription>{tool.vendor}</DialogDescription>
                                  </DialogHeader>
                                  {selectedTool && <ToolDetailsModal tool={selectedTool} />}
                                </DialogContent>
                              </Dialog>
                              <Button size="sm" className="flex-1">
                                <ShoppingCart className="h-4 w-4 mr-1" />
                                Buy Now
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Rental Services Tab */}
          <TabsContent value="rent" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Equipment Rental Services</h2>
              <p className="text-muted-foreground">Rent equipment by the day for cost-effective farming operations</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedTools.map((tool) => (
                <Card key={tool.id} className="hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={tool.image || "/placeholder.svg"}
                      alt={tool.name}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-secondary/90 text-secondary-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        Daily Rental
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{tool.name}</h3>
                        <p className="text-sm text-muted-foreground">{tool.category}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-secondary">₹{tool.rentalPrice.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground">/day</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{tool.location}</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Weekly Rate:</span>
                          <span className="font-semibold">₹{(tool.rentalPrice * 6).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Monthly Rate:</span>
                          <span className="font-semibold">₹{(tool.rentalPrice * 25).toLocaleString()}</span>
                        </div>
                      </div>

                      <Button className="w-full">
                        <Clock className="h-4 w-4 mr-2" />
                        Rent Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function ToolDetailsModal({ tool }: { tool: (typeof toolsData)[0] }) {
  return (
    <div className="space-y-6">
      <img src={tool.image || "/placeholder.svg"} alt={tool.name} className="w-full h-64 object-cover rounded-lg" />

      <div className="space-y-4">
        <p className="text-muted-foreground">{tool.description}</p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Specifications</h4>
            <div className="space-y-1 text-sm">
              {Object.entries(tool.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="capitalize text-muted-foreground">{key.replace(/([A-Z])/g, " $1")}:</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Features</h4>
            <div className="space-y-1">
              {tool.features.map((feature) => (
                <Badge key={feature} variant="outline" className="mr-1 mb-1">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Vendor Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">{tool.vendor}</span>
              <Badge variant="outline">{tool.location}</Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <span>contact@vendor.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button className="flex-1">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Buy for ₹{tool.price.toLocaleString()}
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            <Calendar className="h-4 w-4 mr-2" />
            Rent for ₹{tool.rentalPrice.toLocaleString()}/day
          </Button>
        </div>
      </div>
    </div>
  )
}
