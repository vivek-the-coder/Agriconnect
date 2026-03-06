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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Search,
  Tag,
  Sprout,
  Leaf,
  FlaskConical,
  Loader2,
  ShoppingCart,
  Filter,
  Plus,
} from "lucide-react"
import { useCart } from "@/lib/cart-context"

const seedsData = [
  {
    id: 1,
    name: "Pusa Basmati 1121 Paddy Seeds (5kg)",
    category: "Cereals",
    price: 850,
    unit: "pkt",
    image: "/modern-farming-tools-seeds-and-agricultural-knowle.png",
    description: "Authentic Pusa Basmati 1121 seeds. Known for extra-long grains and pleasant aroma. High market demand.",
    inStock: true,
    rating: 4.8,
    reviews: 124,
    vendor: "Bharat Seeds Ltd",
    features: ["Extra Long Grain", "Aromatic", "High Market Value"],
    specifications: { "Purity": "99%", "Germination": "92%", "Maturity": "135-140 days" }
  },
  {
    id: 2,
    name: "Tissue Culture Banana (Grand Naine G9)",
    category: "Tissue Culture",
    price: 18,
    unit: "plant",
    image: "/high-quality-seeds-and-tissue-culture-plants-in-la.png",
    description: "Virus-free Grand Naine (G9) banana plants. High yield potential and uniform growth.",
    inStock: true,
    rating: 4.9,
    reviews: 350,
    vendor: "EcoPlant Bio-Tech",
    features: ["Virus Free", "Uniform Growth", "High Yield"],
    specifications: { "Variety": "G9 Grand Naine", "Age": "3 months", "Hardening": "Primary & Secondary" }
  },
  {
    id: 3,
    name: "Sona Masuri Paddy Seeds (25kg)",
    category: "Cereals",
    price: 2400,
    unit: "bag",
    image: "/modern-farming-techniques-in-maharashtra-agricultu.png",
    description: "Premium Sona Masuri seeds. Medium-grain rice, low starch, and easy to digest. Popular in South India.",
    inStock: true,
    rating: 4.7,
    reviews: 89,
    vendor: "Kisan Samridhi Seeds",
    features: ["Low Starch", "Premium Quality", "Popular Variety"],
    specifications: { "Purity": "98%", "Germination": "90%", "Region": "Andhra/Karnataka" }
  }
]

const categories = [
  { name: "All Categories", icon: Tag },
  { name: "Tomato", icon: Sprout },
  { name: "Banana", icon: Leaf },
  { name: "Tissue Culture", icon: FlaskConical },
  { name: "Organic Seeds", icon: Leaf },
]

export function SeedsShop() {
  const [seeds, setSeeds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const { addItem } = useCart()

  const [submitting, setSubmitting] = useState(false)
  const [newListing, setNewListing] = useState({
    name: "",
    category: "",
    price: "",
    unit: "pkt",
    description: "",
    stock: ""
  })

  const handleAddToCart = (product: any) => {
    addItem({
      product_id: String(product.id),
      product_type: "seed",
      product_name: product.name,
      product_image: product.image,
      price: Number(product.price),
    })
    toast.success(`${product.name} added to cart!`)
  }

  useEffect(() => {
    fetchSeeds()
  }, [])

  const fetchSeeds = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('seeds')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        if (error.code === 'PGRST116' || error.message?.includes("schema cache") || error.message?.includes("relation") || error.message?.includes("does not exist")) {
          console.warn("Table 'seeds' not found, falling back to mock data.")
          setSeeds(seedsData)
          return
        }
        console.error("Supabase error fetching seeds:", error)
        throw error
      }

      if (!data || data.length === 0) {
        setSeeds(seedsData)
      } else {
        setSeeds([...data, ...seedsData])
      }
    } catch (err: any) {
      console.error("Error fetching seeds:", err.message)
      toast.error("Live seed data currenty unavailable. Showing featured collection.")
      setSeeds(seedsData)
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
        .from('seeds')
        .insert([{
          ...newListing,
          image: '/placeholder.svg',
          user_id: session?.user?.id || null,
        }])

      if (error) throw error

      toast.success("Seed listing submitted successfully!")
      setNewListing({ name: "", category: "", price: "", unit: "pkt", description: "", stock: "" })
      fetchSeeds()
    } catch (err: any) {
      toast.error(err.message || "Failed to list seeds")
    } finally {
      setSubmitting(false)
    }
  }

  const filteredProducts = seeds.filter((product) => {
    const matchesSearch =
      (product.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description || "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All Categories" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const FilterContent = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-lg">Filters</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search seeds..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Categories</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {categories.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelectedCategory(c.name)}
              className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${selectedCategory === c.name ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              <div className="flex items-center gap-3">
                <c.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{c.name}</span>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  )

  if (loading) {
    return <div className="py-20 text-center flex flex-col items-center gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-muted-foreground">Fetching high-quality seeds...</p>
    </div>
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Seeds & Tissue Culture Shop</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            High-quality seeds and tissue culture plants to ensure maximum yield for your farm.
          </p>
        </div>

        <Tabs defaultValue="buy" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="buy">Shop Seeds</TabsTrigger>
            <TabsTrigger value="sell">Sell My Seeds</TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-6">
            <div className="lg:hidden flex justify-end mb-4">
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

            <div className="grid lg:grid-cols-4 gap-8">
              <div className="hidden lg:block lg:col-span-1 space-y-6">
                <FilterContent />
              </div>

              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="group hover:shadow-xl transition-all duration-300">
                      <div className="relative h-48">
                        <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover rounded-t-lg" />
                        <Badge className="absolute top-2 left-2">{product.category}</Badge>
                      </div>
                      <CardContent className="p-4 space-y-4">
                        <h3 className="font-bold text-lg line-clamp-1">{product.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-primary">₹{product.price}</span>
                          <span className="text-sm text-muted-foreground">{product.vendor || 'Local Vendor'}</span>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => setSelectedProduct(product)}>Details</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{product.name}</DialogTitle>
                                <DialogDescription>{product.vendor || 'Local Vendor'}</DialogDescription>
                              </DialogHeader>
                              {selectedProduct && <ProductDetailsModal product={selectedProduct} />}
                            </DialogContent>
                          </Dialog>
                          <Button size="sm" className="flex-1" onClick={() => handleAddToCart(product)}>
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Add to Cart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sell">
            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle>List Your Seeds</CardTitle>
                <CardDescription>Reach other farmers by listing your harvested seeds or tissue culture plants</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSellSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Seed Name *</Label>
                      <Input value={newListing.name} onChange={e => setNewListing({ ...newListing, name: e.target.value })} required placeholder="e.g., Organic Wheat Seeds" />
                    </div>
                    <div className="space-y-2">
                      <Label>Category *</Label>
                      <Select value={newListing.category} onValueChange={v => setNewListing({ ...newListing, category: v })}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Tomato">Tomato</SelectItem>
                          <SelectItem value="Banana">Banana</SelectItem>
                          <SelectItem value="Tissue Culture">Tissue Culture</SelectItem>
                          <SelectItem value="Organic Seeds">Organic Seeds</SelectItem>
                          <SelectItem value="Cereals">Cereals</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Price (₹) *</Label>
                      <Input type="number" value={newListing.price} onChange={e => setNewListing({ ...newListing, price: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit (e.g., kg, pkt, plant) *</Label>
                      <Input value={newListing.unit} onChange={e => setNewListing({ ...newListing, unit: e.target.value })} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description *</Label>
                    <Textarea value={newListing.description} onChange={e => setNewListing({ ...newListing, description: e.target.value })} required rows={4} />
                  </div>
                  <Button type="submit" className="w-full py-6" disabled={submitting}>
                    {submitting ? <Loader2 className="animate-spin mr-2" /> : <Plus className="mr-2 h-4 w-4" />}
                    List Seeds for Sale
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

function ProductDetailsModal({ product }: { product: any }) {
  return (
    <div className="space-y-6">
      <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-64 object-cover rounded-lg" />
      <div className="space-y-4">
        <p className="text-muted-foreground">{product.description}</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Specifications</h4>
            {Object.entries(product.specifications || {}).map(([k, v]: [string, any]) => (
              <p key={k}><span className="text-muted-foreground capitalize">{k}:</span> {v}</p>
            ))}
          </div>
          <div>
            <h4 className="font-semibold mb-2">Features</h4>
            <div className="flex flex-wrap gap-1">
              {(product.features || []).map((f: string) => <Badge key={f} variant="outline">{f}</Badge>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
