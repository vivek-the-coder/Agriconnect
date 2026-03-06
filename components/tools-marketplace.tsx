"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
  Wrench,
  Settings,
  Zap,
  TrendingUp,
  ShoppingCart,
} from "lucide-react"
import { useCart } from "@/lib/cart-context"

const mockToolsData = [
  {
    id: 1,
    name: "Mahindra Arjun 555 DI Tractor",
    category: "Tractors",
    type: "new",
    price: "780000",
    rentalPrice: 1200,
    image: "/modern-farmers-using-technology-with-tractors-and-.png",
    description: "50 HP powerful tractor with advanced Arjun DIGISENSE technology. High fuel efficiency and low maintenance.",
    specifications: {
      power: "50 HP",
      fuelType: "Diesel",
      transmission: "8 Forward + 2 Reverse",
      warranty: "2 years",
    },
    vendor: "Mahindra Agri-Dealers",
    location: "Punjab",
    rating: 4.9,
    reviews: 450,
    availability: "In Stock",
    features: ["Power Steering", "Dual Clutch", "High Lift Capacity"],
  },
  {
    id: 2,
    name: "Shaktiman Rotavator (Semi-Side Drive)",
    category: "Ploughing",
    type: "new",
    price: "115000",
    rentalPrice: 500,
    image: "/modern-farming-equipment-tractors-and-agricultural.png",
    description: "High-performance Shaktiman rotavator for efficient soil preparation. Perfect for Indian soil conditions.",
    specifications: {
      blades: "42-48",
      gearbox: "Multi-Speed",
      workingWidth: "6 Feet",
      warranty: "1 year",
    },
    vendor: "Shaktiman Authorized Sales",
    location: "Maharashtra",
    rating: 4.8,
    reviews: 210,
    availability: "In Stock",
    features: ["Heavy Duty Gearbox", "Boron Steel Blades", "Adjustable Depth"],
  },
  {
    id: 3,
    name: "Vasant Garden Power Tiller 15HP",
    category: "Ploughing",
    type: "rental",
    price: "800",
    rentalPrice: 800,
    image: "/modern-farming-techniques-in-maharashtra-agricultu.png",
    description: "Versatile 15HP power tiller for small fields and vegetable gardens. Lightweight and easy to maneuver.",
    specifications: {
      engine: "15 HP Diesel",
      start: "Electric/Hand",
      weight: "250 KG",
      warranty: "N/A (Rental)",
    },
    vendor: "Kisan Rental Services",
    location: "Karnataka",
    rating: 4.6,
    reviews: 75,
    availability: "Available",
    features: ["Electric Start", "Compact Design", "Multi-utility"],
  }
]

export function ToolsMarketplace() {
  const [tools, setTools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [sortBy, setSortBy] = useState("featured")
  const [selectedTool, setSelectedTool] = useState<any>(null)
  const { addItem } = useCart()

  const handleAddToCart = (tool: any) => {
    addItem({
      product_id: String(tool.id),
      product_type: "tool",
      product_name: tool.name,
      product_image: tool.image,
      price: Number(tool.price),
    })
    toast.success(`${tool.name} added to cart!`)
  }

  useEffect(() => {
    fetchTools()
  }, [])

  const fetchTools = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        if (error.code === 'PGRST116' || error.message?.includes("schema cache") || error.message?.includes("relation") || error.message?.includes("does not exist")) {
          console.warn("Table 'tools' not found, falling back to mock data.")
          setTools(mockToolsData)
          return
        }
        throw error
      }

      if (!data || data.length === 0) {
        setTools(mockToolsData)
      } else {
        setTools([...data, ...mockToolsData])
      }
    } catch (err: any) {
      console.error("Error fetching tools:", err.message)
      toast.error("Failed to load live tools data")
      setTools(mockToolsData)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { name: "All Categories", icon: Settings },
    { name: "Tractors", icon: Zap },
    { name: "Harvesting", icon: TrendingUp },
    { name: "Ploughing", icon: Wrench },
    { name: "Irrigation", icon: Settings },
  ]

  const filteredTools = tools.filter((tool) => {
    const matchesTab = activeTab === "all" || tool.type === activeTab
    const matchesSearch =
      (tool.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tool.description || "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All Categories" || tool.category === selectedCategory

    return matchesTab && matchesSearch && matchesCategory
  })

  const sortedTools = [...filteredTools].sort((a, b) => {
    const priceA = parseFloat(a.price) || 0
    const priceB = parseFloat(b.price) || 0
    if (sortBy === "price-low") return priceA - priceB
    if (sortBy === "price-high") return priceB - priceA
    return 0
  })

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.name === category)
    return cat ? cat.icon : Wrench
  }

  if (loading) {
    return <div className="py-20 text-center">Loading tools marketplace...</div>
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Tools & Equipment Marketplace</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover modern farming tools and equipment. Buy new or rent by the day.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="flex h-auto w-full overflow-x-auto no-scrollbar justify-start sm:grid sm:grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="new">Buy New</TabsTrigger>
            <TabsTrigger value="rental">Rent</TabsTrigger>
          </TabsList>

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
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
                        placeholder="Search items..."
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
                          <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedTools.map((tool) => {
                  const Icon = getCategoryIcon(tool.category)
                  return (
                    <Card key={tool.id} className="group hover:shadow-lg transition-all">
                      <div className="relative h-48">
                        <img src={tool.image || "/placeholder.svg"} alt={tool.name} className="w-full h-full object-cover rounded-t-lg" />
                        <Badge className="absolute top-2 left-2 truncate max-w-[120px]">
                          <Icon className="h-3 w-3 mr-1" />
                          {tool.category}
                        </Badge>
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <h3 className="font-semibold text-lg line-clamp-1">{tool.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{tool.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary">₹{tool.price}</span>
                          <Badge variant="outline">{tool.type === 'rental' ? 'Rental' : 'New'}</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => setSelectedTool(tool)}>Details</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{tool.name}</DialogTitle>
                                <DialogDescription>{tool.vendor}</DialogDescription>
                              </DialogHeader>
                              {selectedTool && <ToolDetailsModal tool={selectedTool} />}
                            </DialogContent>
                          </Dialog>
                          <Button size="sm" className="flex-1" onClick={() => handleAddToCart(tool)}>
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            {tool.type === 'rental' ? 'Rent Now' : 'Add to Cart'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

function ToolDetailsModal({ tool }: { tool: any }) {
  return (
    <div className="space-y-6">
      <img src={tool.image || "/placeholder.svg"} alt={tool.name} className="w-full h-64 object-cover rounded-lg" />
      <div className="space-y-4">
        <p className="text-muted-foreground">{tool.description}</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Details</h4>
            <div className="text-sm space-y-1">
              <p><span className="text-muted-foreground">Condition:</span> {tool.condition || 'New'}</p>
              <p><span className="text-muted-foreground">Location:</span> {tool.location || 'India'}</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Vendor</h4>
            <p className="text-sm">{tool.vendor || 'Authorized Dealer'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
