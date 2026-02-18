"use client"

import { CardDescription } from "@/components/ui/card"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Plus,
  MapPin,
  Calendar,
  Clock,
  Phone,
  Mail,
  Star,
  Truck,
  Wrench,
  Droplets,
  Zap,
  User,
  AlertCircle,
  CheckCircle,
  DollarSign,
} from "lucide-react"

// Mock data for used equipment
const usedEquipmentData = [
  {
    id: 1,
    name: "Mahindra 575 DI Tractor",
    category: "Tractors",
    price: 425000,
    originalPrice: 650000,
    year: 2019,
    hoursUsed: 1200,
    condition: "Good",
    conditionRating: 4,
    image: "/used-tractor-mahindra.png",
    description: "Well-maintained tractor with regular servicing. Perfect for medium-scale farming operations.",
    specifications: {
      power: "50 HP",
      fuelType: "Diesel",
      transmission: "Manual",
      drive: "4WD",
    },
    seller: {
      name: "Ramesh Kumar",
      type: "Individual",
      location: "Ludhiana, Punjab",
      phone: "+91 98765 43210",
      email: "ramesh.kumar@email.com",
      rating: 4.6,
      totalSales: 3,
    },
    features: ["Power Steering", "Hydraulic Lift", "Good Tyres", "Recent Service"],
    negotiable: true,
    reasonForSale: "Upgrading to higher HP tractor",
    lastService: "2024-01-15",
    images: ["/used-tractor-mahindra.png"],
  },
  {
    id: 2,
    name: "John Deere 5310 Tractor",
    category: "Tractors",
    price: 750000,
    originalPrice: 1200000,
    year: 2018,
    hoursUsed: 1800,
    condition: "Excellent",
    conditionRating: 5,
    image: "/used-tractor-john-deere.png",
    description: "Premium tractor in excellent condition with complete service history and genuine parts.",
    specifications: {
      power: "55 HP",
      fuelType: "Diesel",
      transmission: "Synchro Shuttle",
      drive: "4WD",
    },
    seller: {
      name: "Green Valley Equipment",
      type: "Dealer",
      location: "Chandigarh",
      phone: "+91 98765 54321",
      email: "sales@greenvalley.com",
      rating: 4.8,
      totalSales: 45,
    },
    features: ["AC Cabin", "Power Steering", "Hydraulic Lift", "Warranty Available"],
    negotiable: false,
    reasonForSale: "Trade-in from customer",
    lastService: "2024-02-01",
    images: ["/used-tractor-john-deere.png"],
  },
  {
    id: 3,
    name: "Swaraj 855 FE Tractor",
    category: "Tractors",
    price: 380000,
    originalPrice: 580000,
    year: 2020,
    hoursUsed: 800,
    condition: "Very Good",
    conditionRating: 4,
    image: "/used-tractor-swaraj.png",
    description: "Low usage tractor with excellent fuel efficiency and reliable performance.",
    specifications: {
      power: "50 HP",
      fuelType: "Diesel",
      transmission: "Manual",
      drive: "2WD",
    },
    seller: {
      name: "Sukhdev Singh",
      type: "Individual",
      location: "Amritsar, Punjab",
      phone: "+91 98765 67890",
      email: "sukhdev.singh@email.com",
      rating: 4.3,
      totalSales: 1,
    },
    features: ["Low Hours", "Single Owner", "All Papers Clear", "Good Condition"],
    negotiable: true,
    reasonForSale: "Financial constraints",
    lastService: "2023-12-20",
    images: ["/used-tractor-swaraj.png"],
  },
  {
    id: 4,
    name: "Kubota Combine Harvester",
    category: "Harvesting",
    price: 850000,
    originalPrice: 1400000,
    year: 2017,
    hoursUsed: 2200,
    condition: "Good",
    conditionRating: 4,
    image: "/used-combine-harvester.png",
    description: "Reliable combine harvester suitable for wheat and rice harvesting with good cutting efficiency.",
    specifications: {
      cuttingWidth: "3.0 meters",
      engine: "70 HP",
      grainTank: "1000 liters",
      type: "Self-Propelled",
    },
    seller: {
      name: "Harvest Solutions",
      type: "Dealer",
      location: "Karnal, Haryana",
      phone: "+91 98765 11111",
      email: "info@harvestsolutions.com",
      rating: 4.5,
      totalSales: 28,
    },
    features: ["Good Cutting", "Grain Loss Monitor", "Spare Parts Available", "Service Support"],
    negotiable: true,
    reasonForSale: "Dealer stock",
    lastService: "2024-01-10",
    images: ["/used-combine-harvester.png"],
  },
  {
    id: 5,
    name: "Fieldking Rotavator 7ft",
    category: "Tillage Equipment",
    price: 45000,
    originalPrice: 75000,
    year: 2021,
    hoursUsed: 300,
    condition: "Very Good",
    conditionRating: 4,
    image: "/used-rotavator.png",
    description: "Lightly used rotavator with sharp blades and good gearbox condition.",
    specifications: {
      width: "7 feet",
      blades: "32 L-shaped",
      weight: "420 kg",
      type: "Tractor Mounted",
    },
    seller: {
      name: "Prakash Sharma",
      type: "Individual",
      location: "Hisar, Haryana",
      phone: "+91 98765 22222",
      email: "prakash.sharma@email.com",
      rating: 4.4,
      totalSales: 2,
    },
    features: ["Sharp Blades", "Good Gearbox", "Light Usage", "Ready to Use"],
    negotiable: true,
    reasonForSale: "Bought bigger size",
    lastService: "2023-11-15",
    images: ["/used-rotavator.png"],
  },
  {
    id: 6,
    name: "Mahindra Sprayer 400L",
    category: "Spraying Equipment",
    price: 28000,
    originalPrice: 45000,
    year: 2020,
    hoursUsed: 150,
    condition: "Good",
    conditionRating: 4,
    image: "/used-sprayer.png",
    description: "Boom sprayer in good working condition with uniform spray pattern.",
    specifications: {
      tankCapacity: "400 liters",
      boomWidth: "12 meters",
      pumpType: "Diaphragm",
      mounting: "Tractor Mounted",
    },
    seller: {
      name: "Agri Equipment Hub",
      type: "Dealer",
      location: "Jaipur, Rajasthan",
      phone: "+91 98765 33333",
      email: "sales@agriequiphub.com",
      rating: 4.2,
      totalSales: 15,
    },
    features: ["Uniform Spray", "Good Pump", "Adjustable Boom", "Service Available"],
    negotiable: true,
    reasonForSale: "Customer upgrade",
    lastService: "2023-10-05",
    images: ["/used-sprayer.png"],
  },
]

const categories = [
  { name: "All Equipment", count: 156 },
  { name: "Tractors", count: 45 },
  { name: "Harvesting", count: 28 },
  { name: "Tillage Equipment", count: 32 },
  { name: "Spraying Equipment", count: 18 },
  { name: "Irrigation Equipment", count: 15 },
  { name: "Other Equipment", count: 18 },
]

const conditions = ["All Conditions", "Excellent", "Very Good", "Good", "Fair"]

export function UsedEquipmentMarketplace() {
  const [activeTab, setActiveTab] = useState("browse")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Equipment")
  const [selectedCondition, setSelectedCondition] = useState("All Conditions")
  const [priceRange, setPriceRange] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [selectedEquipment, setSelectedEquipment] = useState<(typeof usedEquipmentData)[0] | null>(null)

  // New listing form state
  const [newListing, setNewListing] = useState({
    name: "",
    category: "",
    price: "",
    year: "",
    hoursUsed: "",
    condition: "",
    description: "",
    location: "",
    phone: "",
    email: "",
    reasonForSale: "",
  })

  const filteredEquipment = usedEquipmentData.filter((equipment) => {
    const matchesSearch =
      equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.seller.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All Equipment" || equipment.category === selectedCategory
    const matchesCondition = selectedCondition === "All Conditions" || equipment.condition === selectedCondition
    const matchesPrice =
      priceRange === "all" ||
      (priceRange === "under-100k" && equipment.price < 100000) ||
      (priceRange === "100k-500k" && equipment.price >= 100000 && equipment.price < 500000) ||
      (priceRange === "500k-1m" && equipment.price >= 500000 && equipment.price < 1000000) ||
      (priceRange === "above-1m" && equipment.price >= 1000000)

    return matchesSearch && matchesCategory && matchesCondition && matchesPrice
  })

  const sortedEquipment = [...filteredEquipment].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price
    if (sortBy === "price-high") return b.price - a.price
    if (sortBy === "year-new") return b.year - a.year
    if (sortBy === "year-old") return a.year - b.year
    if (sortBy === "condition") return b.conditionRating - a.conditionRating
    return 0 // recent
  })

  const handleSubmitListing = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("New listing submitted:", newListing)
    setNewListing({
      name: "",
      category: "",
      price: "",
      year: "",
      hoursUsed: "",
      condition: "",
      description: "",
      location: "",
      phone: "",
      email: "",
      reasonForSale: "",
    })
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Tractors":
        return Truck
      case "Harvesting":
        return Zap
      case "Tillage Equipment":
        return Wrench
      case "Spraying Equipment":
        return Droplets
      case "Irrigation Equipment":
        return Droplets
      default:
        return Wrench
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "Excellent":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "Very Good":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "Good":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "Fair":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      default:
        return ""
    }
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Used Equipment Marketplace</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find quality used farming equipment at affordable prices. Buy from trusted sellers or list your own
            equipment for sale.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browse">Browse Equipment</TabsTrigger>
            <TabsTrigger value="sell">Sell Equipment</TabsTrigger>
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

                    {/* Condition */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Condition</label>
                      <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {conditions.map((condition) => (
                            <SelectItem key={condition} value={condition}>
                              {condition}
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
                          <SelectItem value="under-100k">Under ₹1 Lakh</SelectItem>
                          <SelectItem value="100k-500k">₹1L - ₹5L</SelectItem>
                          <SelectItem value="500k-1m">₹5L - ₹10L</SelectItem>
                          <SelectItem value="above-1m">Above ₹10L</SelectItem>
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
                          <SelectItem value="recent">Recently Listed</SelectItem>
                          <SelectItem value="price-low">Price: Low to High</SelectItem>
                          <SelectItem value="price-high">Price: High to Low</SelectItem>
                          <SelectItem value="year-new">Year: Newest First</SelectItem>
                          <SelectItem value="year-old">Year: Oldest First</SelectItem>
                          <SelectItem value="condition">Best Condition</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Buying Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                      <span>Inspect equipment physically before purchase</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                      <span>Check service history and maintenance records</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                      <span>Verify ownership documents</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                      <span>Test all functions before finalizing</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Equipment Grid */}
              <div className="lg:col-span-3">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Used Equipment ({sortedEquipment.length})</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {sortedEquipment.map((equipment) => {
                    const CategoryIcon = getCategoryIcon(equipment.category)
                    const savings = equipment.originalPrice - equipment.price
                    const savingsPercent = Math.round((savings / equipment.originalPrice) * 100)

                    return (
                      <Card key={equipment.id} className="group hover:shadow-lg transition-all duration-300">
                        <div className="relative">
                          <img
                            src={equipment.image || "/placeholder.svg"}
                            alt={equipment.name}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-primary/90 text-primary-foreground">
                              <CategoryIcon className="h-3 w-3 mr-1" />
                              {equipment.category}
                            </Badge>
                          </div>
                          <div className="absolute top-3 right-3">
                            <Badge className={getConditionColor(equipment.condition)}>{equipment.condition}</Badge>
                          </div>
                          <div className="absolute bottom-3 left-3">
                            <Badge className="bg-green-600 text-white">Save {savingsPercent}%</Badge>
                          </div>
                          {equipment.negotiable && (
                            <div className="absolute bottom-3 right-3">
                              <Badge variant="outline" className="bg-white/90">
                                <DollarSign className="h-3 w-3 mr-1" />
                                Negotiable
                              </Badge>
                            </div>
                          )}
                        </div>

                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div>
                              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                                {equipment.name}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">{equipment.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{equipment.year}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{equipment.hoursUsed}h used</span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold text-primary">
                                  ₹{equipment.price.toLocaleString()}
                                </span>
                                <div className="text-right">
                                  <div className="text-sm text-muted-foreground line-through">
                                    ₹{equipment.originalPrice.toLocaleString()}
                                  </div>
                                  <div className="text-sm text-green-600 font-medium">
                                    Save ₹{savings.toLocaleString()}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="border-t pt-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center">
                                    {equipment.seller.type === "Dealer" ? (
                                      <Badge variant="outline">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Dealer
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline">
                                        <User className="h-3 w-3 mr-1" />
                                        Individual
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-3 w-3 ${
                                          i < Math.floor(equipment.seller.rating)
                                            ? "text-yellow-400 fill-current"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                <MapPin className="h-3 w-3" />
                                <span>{equipment.seller.location}</span>
                              </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 bg-transparent"
                                    onClick={() => setSelectedEquipment(equipment)}
                                  >
                                    View Details
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl">
                                  <DialogHeader>
                                    <DialogTitle>{equipment.name}</DialogTitle>
                                    <DialogDescription>{equipment.seller.name}</DialogDescription>
                                  </DialogHeader>
                                  {selectedEquipment && <EquipmentDetailsModal equipment={selectedEquipment} />}
                                </DialogContent>
                              </Dialog>
                              <Button size="sm" className="flex-1">
                                <Phone className="h-4 w-4 mr-1" />
                                Contact Seller
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

          {/* Sell Equipment Tab */}
          <TabsContent value="sell" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  List Your Equipment for Sale
                </CardTitle>
                <CardDescription>
                  Fill out the form below to list your used farming equipment and connect with potential buyers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitListing} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="equipmentName">Equipment Name *</Label>
                      <Input
                        id="equipmentName"
                        value={newListing.name}
                        onChange={(e) => setNewListing({ ...newListing, name: e.target.value })}
                        placeholder="e.g., Mahindra 575 DI Tractor"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={newListing.category}
                        onValueChange={(value) => setNewListing({ ...newListing, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.slice(1).map((category) => (
                            <SelectItem key={category.name} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Asking Price (₹) *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newListing.price}
                        onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                        placeholder="e.g., 450000"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="year">Year of Purchase *</Label>
                      <Input
                        id="year"
                        type="number"
                        value={newListing.year}
                        onChange={(e) => setNewListing({ ...newListing, year: e.target.value })}
                        placeholder="e.g., 2019"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hoursUsed">Hours Used</Label>
                      <Input
                        id="hoursUsed"
                        type="number"
                        value={newListing.hoursUsed}
                        onChange={(e) => setNewListing({ ...newListing, hoursUsed: e.target.value })}
                        placeholder="e.g., 1200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="condition">Condition *</Label>
                      <Select
                        value={newListing.condition}
                        onValueChange={(value) => setNewListing({ ...newListing, condition: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          {conditions.slice(1).map((condition) => (
                            <SelectItem key={condition} value={condition}>
                              {condition}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        value={newListing.location}
                        onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
                        placeholder="e.g., Ludhiana, Punjab"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Contact Number *</Label>
                      <Input
                        id="phone"
                        value={newListing.phone}
                        onChange={(e) => setNewListing({ ...newListing, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newListing.email}
                        onChange={(e) => setNewListing({ ...newListing, email: e.target.value })}
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reasonForSale">Reason for Sale</Label>
                      <Input
                        id="reasonForSale"
                        value={newListing.reasonForSale}
                        onChange={(e) => setNewListing({ ...newListing, reasonForSale: e.target.value })}
                        placeholder="e.g., Upgrading to higher HP"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={newListing.description}
                      onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                      placeholder="Describe the equipment condition, maintenance history, features, etc."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium mb-1">Listing Guidelines:</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Provide accurate information about equipment condition</li>
                          <li>• Include clear photos from multiple angles</li>
                          <li>• Mention any repairs or replacements done</li>
                          <li>• Be responsive to buyer inquiries</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    List Equipment for Sale
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function EquipmentDetailsModal({ equipment }: { equipment: (typeof usedEquipmentData)[0] }) {
  const savings = equipment.originalPrice - equipment.price
  const savingsPercent = Math.round((savings / equipment.originalPrice) * 100)

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <img
            src={equipment.image || "/placeholder.svg"}
            alt={equipment.name}
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge
                className={`${equipment.condition === "Excellent" ? "bg-green-100 text-green-800" : equipment.condition === "Very Good" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"} hover:bg-current`}
              >
                {equipment.condition}
              </Badge>
              <Badge variant="outline">{equipment.category}</Badge>
              {equipment.negotiable && (
                <Badge variant="outline">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Negotiable
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{equipment.description}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-primary">₹{equipment.price.toLocaleString()}</span>
              <div className="text-right">
                <div className="text-sm text-muted-foreground line-through">
                  ₹{equipment.originalPrice.toLocaleString()}
                </div>
                <div className="text-sm text-green-600 font-medium">
                  Save ₹{savings.toLocaleString()} ({savingsPercent}%)
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Year: {equipment.year}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Hours: {equipment.hoursUsed}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-3">Specifications</h4>
          <div className="space-y-2 text-sm">
            {Object.entries(equipment.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="capitalize text-muted-foreground">{key.replace(/([A-Z])/g, " $1")}:</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Equipment Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Service:</span>
              <span className="font-medium">{equipment.lastService}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reason for Sale:</span>
              <span className="font-medium">{equipment.reasonForSale}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Key Features</h4>
        <div className="flex flex-wrap gap-2">
          {equipment.features.map((feature) => (
            <Badge key={feature} variant="outline">
              {feature}
            </Badge>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold mb-3">Seller Information</h4>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">{equipment.seller.name}</span>
              <Badge variant="outline">
                {equipment.seller.type === "Dealer" ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Dealer
                  </>
                ) : (
                  <>
                    <User className="h-3 w-3 mr-1" />
                    Individual
                  </>
                )}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {equipment.seller.location}
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                {equipment.seller.rating} ({equipment.seller.totalSales} sales)
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {equipment.seller.phone}
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {equipment.seller.email}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-transparent">
              <Mail className="h-4 w-4 mr-2" />
              Send Message
            </Button>
            <Button>
              <Phone className="h-4 w-4 mr-2" />
              Call Seller
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
