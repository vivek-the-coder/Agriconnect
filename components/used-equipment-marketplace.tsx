"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
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
  Search,
  Filter,
  MapPin,
  Loader2,
  Phone,
  Mail,
  ShoppingCart,
} from "lucide-react"
import { useCart } from "@/lib/cart-context"

const mockUsedEquipmentData = [
  {
    id: 1,
    name: "Sonalika DI 745 III Tractor (Used)",
    category: "Tractors",
    price: "325000",
    location: "Karnal, Haryana",
    year: "2018",
    image: "/modern-farmers-using-technology-with-tractors-and-.png",
    description: "50 HP Sonalika tractor in excellent condition. Only 1200 hours used. Single owner, all papers clear.",
    status: "Available",
    condition: "Excellent",
    seller: { name: "Rajiv Singh", type: "Individual", location: "Karnal", phone: "+91 98765 43210", email: "rajiv@example.com", rating: 4.8, totalSales: 5 }
  },
  {
    id: 2,
    name: "Massey Ferguson 241 DI (Used)",
    category: "Tractors",
    price: "280000",
    location: "Sangli, Maharashtra",
    year: "2017",
    image: "/used-farming-equipment-and-tools-in-marketplace-se.png",
    description: "Highly reliable Massey Ferguson tractor. Ideal for small to medium farms. New tires recently installed.",
    status: "Available",
    condition: "Good",
    seller: { name: "Amol Patil", type: "Individual", location: "Sangli", phone: "+91 87654 32109", email: "amol@example.com", rating: 4.9, totalSales: 2 }
  },
  {
    id: 3,
    name: "New Holland 3630 TX Plus (Used)",
    category: "Tractors",
    price: "410000",
    location: "Ludhiana, Punjab",
    year: "2020",
    image: "/modern-farming-equipment-tractors-and-agricultural.png",
    description: "Multi-speed 55 HP tractor. Perfect for heavy duty operations like baling and deep ploughing. Well maintained.",
    status: "Available",
    condition: "Excellent",
    seller: { name: "Gurmukh Singh", type: "Individual", location: "Ludhiana", phone: "+91 76543 21098", email: "gurmukh@example.com", rating: 4.7, totalSales: 8 }
  }
]

export function UsedEquipmentMarketplace() {
  const [equipment, setEquipment] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("buy")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const { addItem } = useCart()

  const handleAddToCart = (item: any) => {
    addItem({
      product_id: String(item.id),
      product_type: "equipment",
      product_name: item.name,
      product_image: item.image,
      price: Number(item.price) || 0,
    })
    toast.success(`${item.name} added to cart!`)
  }

  const [newListing, setNewListing] = useState({
    name: "",
    category: "",
    price: "",
    location: "",
    year: "",
    description: "",
    condition: "Good"
  })

  useEffect(() => {
    fetchEquipment()
  }, [])

  const fetchEquipment = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        if (error.code === 'PGRST116' || error.message?.includes("schema cache") || error.message?.includes("relation") || error.message?.includes("does not exist")) {
          console.warn("Table 'equipment' not found, falling back to mock data.")
          setEquipment(mockUsedEquipmentData)
          return
        }
        throw error
      }

      if (!data || data.length === 0) {
        setEquipment(mockUsedEquipmentData)
      } else {
        setEquipment([...data, ...mockUsedEquipmentData])
      }
    } catch (err: any) {
      console.error("Error fetching equipment:", err.message)
      toast.error("Failed to load live equipment data")
      setEquipment(mockUsedEquipmentData)
    } finally {
      setLoading(false)
    }
  }

  const handleSellSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      const { data: { session } } = await supabase.auth.getSession()
      const { error } = await supabase
        .from('equipment')
        .insert([{
          ...newListing,
          status: 'Available',
          image: '/placeholder.svg',
          user_id: session?.user?.id || null,
        }])

      if (error) throw error

      toast.success("Equipment listed! Pending review.")
      setNewListing({ name: "", category: "", price: "", location: "", year: "", description: "", condition: "Good" })
      setActiveTab("buy")
      fetchEquipment()
    } catch (err: any) {
      toast.error(err.message || "Failed to list equipment")
    } finally {
      setSubmitting(false)
    }
  }

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description || "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All Categories" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return <div className="py-20 text-center">Loading marketplace...</div>
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Used Equipment Marketplace</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Buy and sell quality used agricultural machinery with verified sellers.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy">Browse Equipment</TabsTrigger>
            <TabsTrigger value="sell">Sell My Equipment</TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-6">
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Filter className="h-5 w-5" /> Filters</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Search</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All Categories">All Categories</SelectItem>
                          <SelectItem value="Tractors">Tractors</SelectItem>
                          <SelectItem value="Harvesting">Harvesting</SelectItem>
                          <SelectItem value="Tillage">Tillage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-3 grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEquipment.map((item) => (
                  <Card key={item.id} className="group hover:shadow-lg transition-all">
                    <div className="relative h-48">
                      <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover rounded-t-lg" />
                      <Badge className="absolute top-2 left-2">{item.category}</Badge>
                      <Badge variant="secondary" className="absolute top-2 right-2">{item.condition || 'Used'}</Badge>
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-primary">₹{(parseInt(item.price) || 0).toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground">{item.year}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {item.location}
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => setSelectedItem(item)}>Details</Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{item.name}</DialogTitle>
                              <DialogDescription>{item.location}</DialogDescription>
                            </DialogHeader>
                            {selectedItem && <EquipmentDetailsModal equipment={selectedItem} />}
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" className="flex-1" onClick={() => handleAddToCart(item)}>
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sell">
            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle>List Your Equipment</CardTitle>
                <CardDescription>Fill in the details to reach thousands of potential buyers</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSellSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Equipment Name *</Label>
                      <Input value={newListing.name} onChange={e => setNewListing({ ...newListing, name: e.target.value })} required placeholder="e.g., Mahindra Arjun 555" />
                    </div>
                    <div className="space-y-2">
                      <Label>Category *</Label>
                      <Select value={newListing.category} onValueChange={v => setNewListing({ ...newListing, category: v })}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Tractors">Tractors</SelectItem>
                          <SelectItem value="Harvesting">Harvesting</SelectItem>
                          <SelectItem value="Tillage">Tillage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Expected Price (₹) *</Label>
                      <Input type="number" value={newListing.price} onChange={e => setNewListing({ ...newListing, price: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Model Year *</Label>
                      <Input value={newListing.year} onChange={e => setNewListing({ ...newListing, year: e.target.value })} required placeholder="e.g., 2020" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Location *</Label>
                    <Input value={newListing.location} onChange={e => setNewListing({ ...newListing, location: e.target.value })} required placeholder="City, State" />
                  </div>
                  <div className="space-y-2">
                    <Label>Description *</Label>
                    <Textarea value={newListing.description} onChange={e => setNewListing({ ...newListing, description: e.target.value })} required rows={4} />
                  </div>
                  <Button type="submit" className="w-full py-6" disabled={submitting}>
                    {submitting ? <Loader2 className="animate-spin" /> : "List Equipment for Sale"}
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

function EquipmentDetailsModal({ equipment }: { equipment: any }) {
  return (
    <div className="space-y-6">
      <img src={equipment.image || "/placeholder.svg"} alt={equipment.name} className="w-full h-64 object-cover rounded-lg" />
      <div className="space-y-4">
        <p className="text-muted-foreground">{equipment.description}</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Specifications</h4>
            <p><span className="text-muted-foreground">Year:</span> {equipment.year}</p>
            <p><span className="text-muted-foreground">Condition:</span> {equipment.condition || 'Good'}</p>
            <p><span className="text-muted-foreground">Location:</span> {equipment.location}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Seller Status</h4>
            <Badge variant="outline">{equipment.status || 'Available'}</Badge>
          </div>
        </div>
        <div className="flex gap-3 pt-4">
          <Button className="flex-1"><Phone className="mr-2 h-4 w-4" /> Call Seller</Button>
          <Button variant="outline" className="flex-1 bg-transparent"><Mail className="mr-2 h-4 w-4" /> Message</Button>
        </div>
      </div>
    </div>
  )
}
