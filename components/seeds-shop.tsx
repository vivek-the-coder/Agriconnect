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
  Star,
  Leaf,
  Sprout,
  Apple,
  Wheat,
  Flower,
  Award,
  Clock,
  Thermometer,
  Droplets,
  Sun,
  Package,
  Shield,
} from "lucide-react"

// Mock data for seeds and tissue culture products
const seedsData = [
  {
    id: 1,
    name: "Hybrid Tomato Seeds - Arka Rakshak",
    category: "Vegetables",
    type: "seeds",
    price: 450,
    unit: "10g packet",
    image: "/tomato-seeds.png",
    description: "High-yielding hybrid tomato variety with excellent disease resistance and uniform fruit size.",
    specifications: {
      germinationRate: "85-90%",
      maturity: "70-75 days",
      yield: "60-70 tons/hectare",
      season: "Kharif & Rabi",
    },
    growingConditions: {
      temperature: "20-30°C",
      soilPH: "6.0-7.0",
      spacing: "45x30 cm",
      irrigation: "Regular",
    },
    vendor: "Indian Agricultural Research Institute",
    certification: "NSC Certified",
    rating: 4.8,
    reviews: 156,
    inStock: true,
    features: ["Disease Resistant", "High Yield", "Uniform Size", "Long Shelf Life"],
  },
  {
    id: 2,
    name: "Basmati Rice Seeds - Pusa 1121",
    category: "Grains",
    type: "seeds",
    price: 280,
    unit: "1kg packet",
    image: "/basmati-rice-seeds.png",
    description: "Premium basmati rice variety known for its long grains, excellent aroma, and export quality.",
    specifications: {
      germinationRate: "80-85%",
      maturity: "140-150 days",
      yield: "45-50 quintals/hectare",
      season: "Kharif",
    },
    growingConditions: {
      temperature: "25-35°C",
      soilPH: "6.5-7.5",
      spacing: "20x15 cm",
      irrigation: "Flooded",
    },
    vendor: "Punjab Agricultural University",
    certification: "Certified Seeds",
    rating: 4.9,
    reviews: 203,
    inStock: true,
    features: ["Export Quality", "Aromatic", "Long Grains", "High Market Value"],
  },
  {
    id: 3,
    name: "Tissue Culture Banana Plants - Grand Naine",
    category: "Fruits",
    type: "tissue-culture",
    price: 25,
    unit: "per plant",
    image: "/banana-tissue-culture.png",
    description: "Disease-free tissue culture banana plants with uniform growth and high productivity.",
    specifications: {
      survivalRate: "95-98%",
      maturity: "12-14 months",
      yield: "40-50 kg/plant",
      season: "Year-round",
    },
    growingConditions: {
      temperature: "26-30°C",
      soilPH: "6.0-7.5",
      spacing: "2x2 meters",
      irrigation: "Drip preferred",
    },
    vendor: "Tissue Culture Labs India",
    certification: "Virus-Free Certified",
    rating: 4.7,
    reviews: 89,
    inStock: true,
    features: ["Disease Free", "Uniform Growth", "High Survival", "Early Bearing"],
  },
  {
    id: 4,
    name: "Hybrid Marigold Seeds - Pusa Narangi",
    category: "Flowers",
    type: "seeds",
    price: 120,
    unit: "5g packet",
    image: "/marigold-seeds.png",
    description: "Vibrant orange marigold variety perfect for commercial flower cultivation and companion planting.",
    specifications: {
      germinationRate: "75-80%",
      maturity: "45-50 days",
      yield: "200-250 flowers/plant",
      season: "Winter & Spring",
    },
    growingConditions: {
      temperature: "15-25°C",
      soilPH: "6.0-7.5",
      spacing: "20x20 cm",
      irrigation: "Moderate",
    },
    vendor: "National Flower Research Centre",
    certification: "Quality Seeds",
    rating: 4.6,
    reviews: 67,
    inStock: true,
    features: ["Vibrant Color", "Long Blooming", "Pest Repellent", "Cut Flower"],
  },
  {
    id: 5,
    name: "Tissue Culture Strawberry Plants - Chandler",
    category: "Fruits",
    type: "tissue-culture",
    price: 35,
    unit: "per plant",
    image: "/strawberry-tissue-culture.png",
    description: "Premium strawberry variety with excellent fruit quality and extended harvesting period.",
    specifications: {
      survivalRate: "90-95%",
      maturity: "3-4 months",
      yield: "300-400g/plant",
      season: "Winter",
    },
    growingConditions: {
      temperature: "15-25°C",
      soilPH: "5.5-6.5",
      spacing: "30x30 cm",
      irrigation: "Drip system",
    },
    vendor: "Advanced Horticulture Systems",
    certification: "Pathogen-Free",
    rating: 4.8,
    reviews: 124,
    inStock: false,
    features: ["Sweet Flavor", "Large Fruits", "Extended Harvest", "Cold Hardy"],
  },
  {
    id: 6,
    name: "Organic Wheat Seeds - Sharbati",
    category: "Grains",
    type: "seeds",
    price: 180,
    unit: "1kg packet",
    image: "/wheat-seeds.png",
    description: "Traditional wheat variety known for its nutritional value and adaptability to organic farming.",
    specifications: {
      germinationRate: "85-90%",
      maturity: "120-130 days",
      yield: "35-40 quintals/hectare",
      season: "Rabi",
    },
    growingConditions: {
      temperature: "15-25°C",
      soilPH: "6.0-7.5",
      spacing: "22.5 cm rows",
      irrigation: "3-4 times",
    },
    vendor: "Organic Seeds Co-operative",
    certification: "Organic Certified",
    rating: 4.5,
    reviews: 91,
    inStock: true,
    features: ["Organic", "Nutritious", "Drought Tolerant", "Traditional Variety"],
  },
]

const categories = [
  { name: "All Products", icon: Package, count: 156 },
  { name: "Vegetables", icon: Leaf, count: 45 },
  { name: "Fruits", icon: Apple, count: 32 },
  { name: "Grains", icon: Wheat, count: 28 },
  { name: "Flowers", icon: Flower, count: 25 },
  { name: "Herbs & Spices", icon: Sprout, count: 26 },
]

export function SeedsShop() {
  const [activeTab, setActiveTab] = useState("seeds")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Products")
  const [priceRange, setPriceRange] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [selectedProduct, setSelectedProduct] = useState<(typeof seedsData)[0] | null>(null)

  const filteredProducts = seedsData.filter((product) => {
    const matchesTab = activeTab === "all" || product.type === activeTab.replace("-", "-")
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All Products" || product.category === selectedCategory
    const matchesPrice =
      priceRange === "all" ||
      (priceRange === "under-100" && product.price < 100) ||
      (priceRange === "100-300" && product.price >= 100 && product.price < 300) ||
      (priceRange === "300-500" && product.price >= 300 && product.price < 500) ||
      (priceRange === "above-500" && product.price >= 500)

    return matchesTab && matchesSearch && matchesCategory && matchesPrice
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price
    if (sortBy === "price-high") return b.price - a.price
    if (sortBy === "rating") return b.rating - a.rating
    if (sortBy === "name") return a.name.localeCompare(b.name)
    return 0 // featured
  })

  const getCategoryIcon = (category: string) => {
    const cat = categories.find((c) => c.name === category)
    return cat ? cat.icon : Package
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Seeds & Tissue Culture Shop</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover high-quality seeds and modern plant solutions for better crop yields and sustainable farming.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="seeds">Seeds</TabsTrigger>
            <TabsTrigger value="tissue-culture">Tissue Culture</TabsTrigger>
            <TabsTrigger value="all">All Products</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
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
                          placeholder="Search products..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Categories</label>
                      <div className="space-y-2">
                        {categories.map((category) => {
                          const Icon = category.icon
                          return (
                            <button
                              key={category.name}
                              onClick={() => setSelectedCategory(category.name)}
                              className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                                selectedCategory === category.name
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                <span className="text-sm">{category.name}</span>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {category.count}
                              </Badge>
                            </button>
                          )
                        })}
                      </div>
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
                          <SelectItem value="under-100">Under ₹100</SelectItem>
                          <SelectItem value="100-300">₹100 - ₹300</SelectItem>
                          <SelectItem value="300-500">₹300 - ₹500</SelectItem>
                          <SelectItem value="above-500">Above ₹500</SelectItem>
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
                          <SelectItem value="name">Name A-Z</SelectItem>
                          <SelectItem value="price-low">Price: Low to High</SelectItem>
                          <SelectItem value="price-high">Price: High to Low</SelectItem>
                          <SelectItem value="rating">Highest Rated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Featured Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Why Choose Our Products?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-primary" />
                      <span>Certified Quality</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-primary" />
                      <span>High Germination Rate</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Leaf className="h-4 w-4 text-primary" />
                      <span>Disease Resistant</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4 text-primary" />
                      <span>Proper Packaging</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Products Grid */}
              <div className="lg:col-span-3">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">
                    {activeTab === "seeds"
                      ? "Seeds"
                      : activeTab === "tissue-culture"
                        ? "Tissue Culture Plants"
                        : "All Products"}{" "}
                    ({sortedProducts.length})
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedProducts.map((product) => {
                    const CategoryIcon = getCategoryIcon(product.category)
                    return (
                      <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                        <div className="relative">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-primary/90 text-primary-foreground">
                              <CategoryIcon className="h-3 w-3 mr-1" />
                              {product.category}
                            </Badge>
                          </div>
                          <div className="absolute top-3 right-3">
                            <Badge
                              variant={product.inStock ? "default" : "secondary"}
                              className={
                                product.inStock
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : "bg-red-100 text-red-800 hover:bg-red-100"
                              }
                            >
                              {product.inStock ? "In Stock" : "Out of Stock"}
                            </Badge>
                          </div>
                          {product.certification && (
                            <div className="absolute bottom-3 left-3">
                              <Badge variant="outline" className="bg-white/90">
                                <Award className="h-3 w-3 mr-1" />
                                {product.certification}
                              </Badge>
                            </div>
                          )}
                        </div>

                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div>
                              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                {product.name}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {product.rating} ({product.reviews} reviews)
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-2xl font-bold text-primary">₹{product.price}</span>
                                <span className="text-sm text-muted-foreground ml-1">/{product.unit}</span>
                              </div>
                              <div className="text-sm text-muted-foreground">{product.vendor}</div>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {product.features.slice(0, 2).map((feature) => (
                                <Badge key={feature} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                              {product.features.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{product.features.length - 2} more
                                </Badge>
                              )}
                            </div>

                            <div className="flex gap-2 pt-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 bg-transparent"
                                    onClick={() => setSelectedProduct(product)}
                                  >
                                    View Details
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                  <DialogHeader>
                                    <DialogTitle>{product.name}</DialogTitle>
                                    <DialogDescription>{product.vendor}</DialogDescription>
                                  </DialogHeader>
                                  {selectedProduct && <ProductDetailsModal product={selectedProduct} />}
                                </DialogContent>
                              </Dialog>
                              <Button size="sm" className="flex-1" disabled={!product.inStock}>
                                <ShoppingCart className="h-4 w-4 mr-1" />
                                {product.inStock ? "Add to Cart" : "Out of Stock"}
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
        </Tabs>
      </div>
    </div>
  )
}

function ProductDetailsModal({ product }: { product: (typeof seedsData)[0] }) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary/10 text-primary">
                {product.type === "seeds" ? "Seeds" : "Tissue Culture"}
              </Badge>
              <Badge variant="outline">{product.category}</Badge>
              {product.certification && (
                <Badge variant="outline">
                  <Award className="h-3 w-3 mr-1" />
                  {product.certification}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary">₹{product.price}</span>
              <span className="text-muted-foreground">per {product.unit}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Specifications
          </h4>
          <div className="space-y-2 text-sm">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="capitalize text-muted-foreground">{key.replace(/([A-Z])/g, " $1")}:</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Sun className="h-4 w-4" />
            Growing Conditions
          </h4>
          <div className="space-y-2 text-sm">
            {Object.entries(product.growingConditions).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="capitalize text-muted-foreground flex items-center gap-1">
                  {key === "temperature" && <Thermometer className="h-3 w-3" />}
                  {key === "irrigation" && <Droplets className="h-3 w-3" />}
                  {key.replace(/([A-Z])/g, " $1")}:
                </span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Key Features</h4>
        <div className="flex flex-wrap gap-2">
          {product.features.map((feature) => (
            <Badge key={feature} variant="outline">
              {feature}
            </Badge>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{product.vendor}</p>
            <p className="text-sm text-muted-foreground">{product.certification}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-transparent">
              Contact Vendor
            </Button>
            <Button disabled={!product.inStock}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
