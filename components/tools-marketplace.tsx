"use client"

import { useState, useEffect } from "react"
import { db, auth } from "@/lib/firebase"
import { collection, query, getDocs, addDoc } from "firebase/firestore"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Search,
  Filter,
  Wrench,
  Settings,
  Zap,
  TrendingUp,
  Loader2,
  Plus,
  MapPin,
  Clock,
  Calendar,
  IndianRupee,
  Star,
  CheckCircle2,
} from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { ImageUploader } from "@/components/image-uploader"

const mockRentalsData = [
  {
    id: "rent-1",
    name: "Mahindra Arjun 555 DI Tractor",
    category: "Tractors",
    rentalPrice: 1200,
    rentUnit: "hour",
    minHours: 4,
    image: "/modern-farmers-using-technology-with-tractors-and-.png",
    description: "50 HP powerful tractor available for daily/hourly rent. Perfect for ploughing, hauling, and field preparation. Comes with operator on request.",
    location: "Nagpur, Maharashtra",
    availableFrom: "2026-03-10",
    availableTo: "2026-06-30",
    owner: "Rajesh Patil",
    rating: 4.9,
    reviews: 45,
    availability: "Available",
    features: ["Power Steering", "Dual Clutch", "High Lift Capacity", "Operator Available"],
  },
  {
    id: "rent-2",
    name: "Shaktiman Rotavator 6ft",
    category: "Ploughing",
    rentalPrice: 500,
    rentUnit: "hour",
    minHours: 2,
    image: "/modern-farming-equipment-tractors-and-agricultural.png",
    description: "High-performance rotavator for efficient soil preparation. Ideal for pre-sowing land work. Delivery available within 25 km radius.",
    location: "Pune, Maharashtra",
    availableFrom: "2026-03-08",
    availableTo: "2026-05-15",
    owner: "Anil Sharma",
    rating: 4.8,
    reviews: 22,
    availability: "Available",
    features: ["Heavy Duty Gearbox", "Boron Steel Blades", "Free Delivery (25km)"],
  },
  {
    id: "rent-3",
    name: "Vasant Power Tiller 15HP",
    category: "Ploughing",
    rentalPrice: 800,
    rentUnit: "day",
    minHours: 8,
    image: "/modern-farming-techniques-in-maharashtra-agricultu.png",
    description: "Versatile 15HP power tiller for small fields and vegetable gardens. Lightweight and easy to maneuver. Self-operated rental.",
    location: "Bangalore, Karnataka",
    availableFrom: "2026-03-12",
    availableTo: "2026-12-31",
    owner: "Kisan Rental Services",
    rating: 4.6,
    reviews: 75,
    availability: "Available",
    features: ["Electric Start", "Compact Design", "Self-Operated"],
  },
]

export function ToolsMarketplace() {
  const [tools, setTools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("browse")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [sortBy, setSortBy] = useState("featured")
  const [selectedTool, setSelectedTool] = useState<any>(null)
  const { addItem } = useCart()

  const [submitting, setSubmitting] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [newListing, setNewListing] = useState({
    name: "",
    category: "",
    rentalPrice: "",
    rentUnit: "hour",
    minHours: "",
    location: "",
    availableFrom: "",
    availableTo: "",
    description: "",
  })

  const handleRentNow = (tool: any) => {
    addItem({
      product_id: String(tool.id),
      product_type: "rental",
      product_name: `${tool.name} (Rent)`,
      product_image: tool.image,
      price: Number(tool.rentalPrice) * (Number(tool.minHours) || 1),
    })
    toast.success(`${tool.name} added to cart as a rental booking!`)
  }

  useEffect(() => {
    fetchRentals()
  }, [])

  const fetchRentals = async () => {
    try {
      setLoading(true)
      const q = query(collection(db, "tool_rentals"))
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout fetching data")), 5000))
      const snapshot = await Promise.race([getDocs(q), timeoutPromise]) as any
      const data = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
      data.sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())

      if (!data || data.length === 0) {
        setTools(mockRentalsData)
      } else {
        setTools([...data, ...mockRentalsData])
      }
    } catch (err: any) {
      console.error("Error fetching rentals:", err.message)
      toast.error("Live rental data currently unavailable. Showing sample listings.")
      setTools(mockRentalsData)
    } finally {
      setLoading(false)
    }
  }

  const handleListSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      const sessionUser = auth.currentUser
      if (!sessionUser) {
        toast.error("Please log in to list your equipment.")
        return
      }
      await addDoc(collection(db, "tool_rentals"), {
        ...newListing,
        rentalPrice: Number(newListing.rentalPrice),
        minHours: Number(newListing.minHours) || 1,
        images: uploadedImages,
        image: uploadedImages[0] || "/placeholder.svg",
        owner: sessionUser.displayName || sessionUser.email?.split("@")[0] || "Anonymous",
        user_id: sessionUser.uid,
        rating: 0,
        reviews: 0,
        availability: "Available",
        features: [],
        created_at: new Date().toISOString(),
      })

      toast.success("Equipment listed for rent successfully!")
      setNewListing({ name: "", category: "", rentalPrice: "", rentUnit: "hour", minHours: "", location: "", availableFrom: "", availableTo: "", description: "" })
      setUploadedImages([])
      fetchRentals()
    } catch (err: any) {
      toast.error(err.message || "Failed to list equipment")
    } finally {
      setSubmitting(false)
    }
  }

  const categories = [
    { name: "All Categories", icon: Settings },
    { name: "Tractors", icon: Zap },
    { name: "Harvesting", icon: TrendingUp },
    { name: "Ploughing", icon: Wrench },
    { name: "Irrigation", icon: Settings },
    { name: "Spraying", icon: Wrench },
  ]

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      (tool.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tool.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tool.location || "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All Categories" || tool.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedTools = [...filteredTools].sort((a, b) => {
    const priceA = parseFloat(a.rentalPrice) || 0
    const priceB = parseFloat(b.rentalPrice) || 0
    if (sortBy === "price-low") return priceA - priceB
    if (sortBy === "price-high") return priceB - priceA
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0)
    return 0
  })

  const getCategoryIcon = (category: string) => {
    const cat = categories.find((c) => c.name === category)
    return cat ? cat.icon : Wrench
  }

  const FilterContent = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="h-5 w-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.name} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
  )

  if (loading) {
    return (
      <div className="py-20 text-center flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading equipment rentals...</p>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">🚜 Farmers Equipment Rentals</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Rent farming equipment from fellow farmers or list your idle tools to earn extra income. Pay per hour or per day.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="flex h-auto w-full overflow-x-auto no-scrollbar justify-start sm:grid sm:grid-cols-2">
            <TabsTrigger value="browse">Browse Rentals</TabsTrigger>
            <TabsTrigger value="list">List for Rent</TabsTrigger>
          </TabsList>

          {/* ========== LIST FOR RENT TAB ========== */}
          <TabsContent value="list">
            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle>List Your Equipment for Rent</CardTitle>
                <CardDescription>
                  Earn money from your idle farming tools. Other farmers near you can rent them by the hour or day.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleListSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Equipment Name *</Label>
                      <Input
                        value={newListing.name}
                        onChange={(e) => setNewListing({ ...newListing, name: e.target.value })}
                        required
                        placeholder="e.g., Mahindra 575 DI Tractor"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category *</Label>
                      <Select value={newListing.category} onValueChange={(v) => setNewListing({ ...newListing, category: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories
                            .filter((c) => c.name !== "All Categories")
                            .map((c) => (
                              <SelectItem key={c.name} value={c.name}>
                                {c.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Rental Price (₹) *</Label>
                      <Input
                        type="number"
                        value={newListing.rentalPrice}
                        onChange={(e) => setNewListing({ ...newListing, rentalPrice: e.target.value })}
                        required
                        placeholder="e.g., 500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Rent Unit *</Label>
                      <Select value={newListing.rentUnit} onValueChange={(v) => setNewListing({ ...newListing, rentUnit: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hour">Per Hour</SelectItem>
                          <SelectItem value="day">Per Day</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Minimum Rent Duration *</Label>
                      <Input
                        type="number"
                        value={newListing.minHours}
                        onChange={(e) => setNewListing({ ...newListing, minHours: e.target.value })}
                        required
                        placeholder="e.g., 4 (hours or days)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location *</Label>
                      <Input
                        value={newListing.location}
                        onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
                        required
                        placeholder="e.g., Nagpur, Maharashtra"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Available From *</Label>
                      <Input
                        type="date"
                        value={newListing.availableFrom}
                        onChange={(e) => setNewListing({ ...newListing, availableFrom: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Available To *</Label>
                      <Input
                        type="date"
                        value={newListing.availableTo}
                        onChange={(e) => setNewListing({ ...newListing, availableTo: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Photos (up to 5)</Label>
                    <ImageUploader
                      images={uploadedImages}
                      onImagesChange={setUploadedImages}
                      folder="listings/rentals"
                      maxImages={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description *</Label>
                    <Textarea
                      value={newListing.description}
                      onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                      required
                      rows={4}
                      placeholder="Describe condition, features, delivery options, operator availability, etc."
                    />
                  </div>
                  <Button type="submit" className="w-full py-6" disabled={submitting}>
                    {submitting ? <Loader2 className="animate-spin mr-2" /> : <Plus className="mr-2 h-4 w-4" />}
                    List Equipment for Rent
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ========== BROWSE RENTALS TAB ========== */}
          <TabsContent value="browse">
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="lg:hidden flex justify-end mb-4 col-span-full">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filters & Categories
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                    <SheetHeader className="mb-6">
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="overflow-y-auto max-h-[calc(100vh-100px)] pr-2">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="hidden lg:block lg:col-span-1 space-y-6">
                <FilterContent />
              </div>

              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedTools.length > 0 ? (
                    sortedTools.map((tool) => {
                      const Icon = getCategoryIcon(tool.category)
                      return (
                        <Card key={tool.id} className="group hover:shadow-lg transition-all">
                          <div className="relative h-48">
                            <img
                              src={tool.image || "/placeholder.svg"}
                              alt={tool.name}
                              className="w-full h-full object-cover rounded-t-lg"
                            />
                            <Badge className="absolute top-2 left-2 truncate max-w-[120px]">
                              <Icon className="h-3 w-3 mr-1" />
                              {tool.category || "Tool"}
                            </Badge>
                            <Badge className="absolute top-2 right-2 bg-emerald-600 text-white">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {tool.availability || "Available"}
                            </Badge>
                          </div>
                          <CardContent className="p-4 space-y-3">
                            <h3 className="font-semibold text-lg line-clamp-1">{tool.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{tool.description}</p>

                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span>{tool.location || "India"}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-4 w-4 text-primary" />
                                <span>Min {tool.minHours || 1} {tool.rentUnit === "day" ? "day(s)" : "hr(s)"}</span>
                              </div>
                              {tool.availableFrom && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Calendar className="h-4 w-4 text-primary" />
                                  <span>{tool.availableFrom} → {tool.availableTo || "Open"}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t">
                              <div className="flex items-center gap-1 font-bold text-primary text-lg">
                                <IndianRupee className="h-4 w-4" />
                                {tool.rentalPrice}/{tool.rentUnit || "hr"}
                              </div>
                              {tool.rating > 0 && (
                                <div className="flex items-center gap-1 text-sm text-amber-600">
                                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                                  {tool.rating} ({tool.reviews})
                                </div>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 bg-transparent"
                                    onClick={() => setSelectedTool(tool)}
                                  >
                                    Details
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>{tool.name}</DialogTitle>
                                    <DialogDescription>Listed by {tool.owner || "Farmer"}</DialogDescription>
                                  </DialogHeader>
                                  {selectedTool && <RentalDetailsModal tool={selectedTool} />}
                                </DialogContent>
                              </Dialog>
                              <Button size="sm" className="flex-1" onClick={() => handleRentNow(tool)}>
                                Rent Now
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })
                  ) : (
                    <div className="col-span-full">
                      <Card className="p-12 text-center">
                        <p className="text-muted-foreground text-lg">No rentals match your search. Try a different category or keyword.</p>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function RentalDetailsModal({ tool }: { tool: any }) {
  return (
    <div className="space-y-6">
      <img src={tool.image || "/placeholder.svg"} alt={tool.name} className="w-full h-64 object-cover rounded-lg" />
      <div className="space-y-4">
        <p className="text-muted-foreground">{tool.description}</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Rental Details</h4>
            <div className="text-sm space-y-1.5">
              <p className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Rate:</span>
                <span className="font-medium">₹{tool.rentalPrice} / {tool.rentUnit || "hr"}</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Min Rent:</span>
                <span className="font-medium">{tool.minHours || 1} {tool.rentUnit === "day" ? "day(s)" : "hour(s)"}</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Location:</span>
                <span className="font-medium">{tool.location || "India"}</span>
              </p>
              {tool.availableFrom && (
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Available:</span>
                  <span className="font-medium">{tool.availableFrom} → {tool.availableTo || "Open"}</span>
                </p>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Listed By</h4>
            <p className="text-sm font-medium">{tool.owner || "Farmer"}</p>
            {tool.rating > 0 && (
              <div className="flex items-center gap-1 text-sm text-amber-600 mt-1">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                {tool.rating} ({tool.reviews} reviews)
              </div>
            )}
            {tool.features && tool.features.length > 0 && (
              <div className="mt-3">
                <h4 className="font-semibold mb-2 text-sm">Features</h4>
                <div className="flex flex-wrap gap-1">
                  {tool.features.map((f: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-xs">{f}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
